import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import maplibregl from "maplibre-gl";
import { MAX_YEAR, MIN_YEAR } from "@/data/history";
import { ageFactor, eraFor, paletteFor } from "@/map/palette";
import { buildStyle, type StyleOptions } from "@/map/style";
import { makePattern } from "@/map/patterns";
import YearControl from "@/components/YearControl";
import SidePanel from "@/components/SidePanel";
import AgeOverlay from "@/components/AgeOverlay";

const PLACES: { name: string; coord: [number, number]; zoom: number }[] = [
  { name: "Mitte", coord: [13.4015, 52.5185], zoom: 14 },
  { name: "Potsdamer Platz", coord: [13.3760, 52.5096], zoom: 15 },
  { name: "Alexanderplatz", coord: [13.4132, 52.5215], zoom: 15 },
  { name: "Bernauer Straße", coord: [13.3910, 52.5353], zoom: 15.5 },
  { name: "Checkpoint Charlie", coord: [13.3904, 52.5075], zoom: 16 },
  { name: "Tempelhof", coord: [13.4000, 52.4750], zoom: 13.5 },
  { name: "Kudamm", coord: [13.3310, 52.5035], zoom: 14.5 },
  { name: "Marzahn", coord: [13.5580, 52.5450], zoom: 13.5 },
];

export default function App() {
  const mapRef = useRef<maplibregl.Map | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const popupRef = useRef<maplibregl.Popup | null>(null);

  const [year, setYearRaw] = useState(2026);
  const [peek, setPeek] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [ready, setReady] = useState(false);
  const [mapError, setMapError] = useState<string | null>(null);
  const [zoom, setZoom] = useState(12.4);
  const [options, setOptions] = useState<StyleOptions>({
    showWall: true,
    showGrowth: true,
    showHouseNumbers: true,
    showLandmarks: true,
    showFuture: false,
    showLabels: true,
  });

  const setYear = setYearRaw;
  const shownYear = peek ? MAX_YEAR : year;
  const era = useMemo(() => eraFor(shownYear), [shownYear]);
  const palette = useMemo(() => paletteFor(shownYear), [shownYear]);
  const age = useMemo(() => ageFactor(shownYear), [shownYear]);

  // инициализация карты
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;
    const map = new maplibregl.Map({
      container: containerRef.current,
      style: buildStyle(2026, {
        showWall: true,
        showGrowth: true,
        showHouseNumbers: true,
        showLandmarks: true,
        showFuture: false,
        showLabels: true,
      }) as never,
      center: [13.3980, 52.5160],
      zoom: 12.4,
      minZoom: 9.5,
      maxZoom: 19,
      maxBounds: [
        [12.80, 52.25],
        [14.00, 52.80],
      ],
      attributionControl: false,
    });
    mapRef.current = map;

    map.addControl(
      new maplibregl.AttributionControl({
        compact: true,
        customAttribution:
          '© <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a> · <a href="https://openfreemap.org" target="_blank">OpenFreeMap</a> · Mauerverlauf: Geoportal Berlin',
      }),
      "bottom-right",
    );
    map.addControl(new maplibregl.NavigationControl({ showCompass: false }), "bottom-right");
    map.addControl(new maplibregl.ScaleControl({ maxWidth: 110, unit: "metric" }), "bottom-right");

    map.on("error", (ev: { error?: { message?: string } }) => {
      const msg = ev?.error?.message ?? "";
      if (/tile|glyph|sprite|image/i.test(msg)) return; // отдельные тайлы — не критично
      console.warn("maplibre:", msg);
    });
    const failTimer = window.setTimeout(() => {
      setReady((r) => {
        if (!r) setMapError("Не удалось загрузить тайлы карты — проверьте соединение с tiles.openfreemap.org");
        return r;
      });
    }, 15000);
    map.on("load", () => {
      window.clearTimeout(failTimer);
      map.resize();
      setReady(true);
    });
    const ro = new ResizeObserver(() => map.resize());
    ro.observe(containerRef.current);
    requestAnimationFrame(() => map.resize());
    map.on("zoom", () => setZoom(map.getZoom()));
    map.on("styleimagemissing", (e: { id: string }) => {
      if (map.hasImage(e.id)) return;
      const img = makePattern(e.id);
      if (img) map.addImage(e.id, img, { pixelRatio: 2 });
    });

    const clickable = ["landmark-dot", "landmark-label", "histb-fill", "patches-fill"];
    map.on("click", (e) => {
      const feats = map.queryRenderedFeatures(e.point, { layers: clickable.filter((l) => map.getLayer(l)) });
      if (!feats.length) return;
      const f = feats[0];
      const pr = f.properties ?? {};
      const title = (pr.name as string) || (pr.label as string) || "";
      const sub = pr.nameRu ? `<div style="font-size:11px;color:#6b6252">${pr.nameRu}</div>` : "";
      const years =
        pr.built !== undefined
          ? `<div style="font-size:11px;color:#8a7c5f;margin-top:2px">${pr.built}${
              pr.gone && Number(pr.gone) > 0 ? " – " + pr.gone : " – сегодня"
            }</div>`
          : "";
      const note = pr.note ? `<div style="font-size:11.5px;color:#4a4436;margin-top:6px">${pr.note}</div>` : "";
      popupRef.current?.remove();
      popupRef.current = new maplibregl.Popup({ closeButton: true, offset: 12, maxWidth: "280px" })
        .setLngLat(e.lngLat)
        .setHTML(
          `<div style="font-weight:700;font-size:13px;color:#2f2a20">${title}</div>${sub}${years}${note}`,
        )
        .addTo(map);
    });

    map.on("mousemove", (e) => {
      const feats = map.queryRenderedFeatures(e.point, {
        layers: ["landmark-dot", "landmark-label", "histb-fill"].filter((l) => map.getLayer(l)),
      });
      map.getCanvas().style.cursor = feats.length ? "pointer" : "";
    });

    return () => {
      window.clearTimeout(failTimer);
      ro.disconnect();
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // обновление стиля при смене года/слоёв
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !ready) return;
    const t = window.setTimeout(() => {
      if (!map.isStyleLoaded()) {
        map.once("idle", () => map.setStyle(buildStyle(shownYear, options) as never, { diff: true }));
        return;
      }
      map.setStyle(buildStyle(shownYear, options) as never, { diff: true });
    }, 60);
    return () => window.clearTimeout(t);
  }, [shownYear, options, ready]);

  // «старение» канвы
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    map.getCanvas().style.filter = `sepia(${palette.sepia.toFixed(2)}) saturate(${palette.sat.toFixed(
      2,
    )}) contrast(${palette.contrast.toFixed(2)}) brightness(${(1 - age * 0.05).toFixed(2)})`;
  }, [palette, age]);

  // авто-путешествие по годам
  useEffect(() => {
    if (!playing) return;
    const id = window.setInterval(() => {
      setYear((y) => {
        if (y <= MIN_YEAR) return MAX_YEAR;
        return y - 1;
      });
    }, 260);
    return () => window.clearInterval(id);
  }, [playing]);

  // стрелки меняют год
  useEffect(() => {
    const onKey = (ev: KeyboardEvent) => {
      const tag = (ev.target as HTMLElement | null)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      const step = ev.shiftKey ? 10 : 1;
      if (ev.key === "ArrowLeft") setYear((y) => Math.max(MIN_YEAR, y - step));
      if (ev.key === "ArrowRight") setYear((y) => Math.min(MAX_YEAR, y + step));
      if (ev.key === " ") {
        ev.preventDefault();
        setPlaying((p) => !p);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const fly = useCallback((coord: [number, number], z = 15) => {
    mapRef.current?.flyTo({ center: coord, zoom: z, duration: 1400, essential: true });
  }, []);

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-[#1a1813]">
      <div
        ref={containerRef}
        className="absolute inset-0"
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
      />
      <AgeOverlay grain={palette.grain} vignette={palette.vignette} />

      {/* заголовок */}
      <div className="pointer-events-none absolute left-3 top-3 z-30 flex flex-col gap-2">
        <div className="panel-dark pointer-events-auto rounded-xl px-3 py-2">
          <div className="font-display text-[11px] uppercase tracking-[0.34em] text-amber-200/70">
            Berlin Zeitreise
          </div>
          <div className="text-sm font-semibold text-amber-50">Карта Берлина сквозь годы</div>
        </div>
        <SidePanel year={shownYear} era={era} options={options} onOptions={setOptions} onFly={fly} />
      </div>

      {/* управление годом */}
      <div className="pointer-events-none absolute right-3 top-3 z-30">
        <YearControl
          year={year}
          onYear={setYear}
          playing={playing}
          onPlay={setPlaying}
          era={era}
          onPeek={setPeek}
          peeking={peek}
        />
      </div>

      {/* быстрые места */}
      <div className="pointer-events-none absolute bottom-3 left-3 z-30 flex max-w-[60vw] flex-wrap gap-1">
        {PLACES.map((p) => (
          <button
            key={p.name}
            type="button"
            onClick={() => fly(p.coord, p.zoom)}
            className="panel pointer-events-auto rounded-md px-2 py-1 text-[11px] font-medium text-stone-700 transition hover:text-stone-950"
          >
            {p.name}
          </button>
        ))}
      </div>

      {/* подсказка про номера домов */}
      <div className="pointer-events-none absolute bottom-16 left-1/2 z-30 -translate-x-1/2">
        {zoom < 16.9 && options.showHouseNumbers && (
          <div className="panel rounded-full px-3 py-1 text-[11px] text-stone-600">
            Приблизьте карту — появятся номера домов
          </div>
        )}
      </div>

      {!ready && (
        <div className="absolute inset-0 z-40 flex items-center justify-center bg-[#1a1813] text-amber-100">
          <div className="text-center">
            <div className="font-display text-xs uppercase tracking-[0.4em] text-amber-200/70">
              Berlin Zeitreise
            </div>
            <div className="mt-2 text-sm text-amber-100/70">
              {mapError ?? "Загружаем карту…"}
            </div>
            {mapError && (
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="mt-3 rounded-md border border-amber-200/40 px-3 py-1.5 text-xs text-amber-100 hover:bg-amber-100/10"
              >
                Повторить
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

import type { Feature, FeatureCollection } from "geojson";
import {
  HIST_BUILDINGS,
  LANDMARKS,
  PATCHES,
  URBAN_EXTENTS,
  type Landmark,
} from "@/data/history";

type FC = FeatureCollection;

const fc = (features: Feature[]): FC => ({ type: "FeatureCollection", features });

export function patchesFor(year: number): FC {
  return fc(
    PATCHES.filter((p) => year >= p.from && year <= p.to).map((p) => ({
      type: "Feature",
      properties: { id: p.id, fill: p.fill, label: p.label ?? "" },
      geometry: { type: "Polygon", coordinates: [p.coords] },
    })),
  );
}

export function histBuildingsFor(year: number): FC {
  return fc(
    HIST_BUILDINGS.filter((b) => year >= b.from && year <= b.to).map((b) => ({
      type: "Feature",
      properties: { id: b.id, label: b.label },
      geometry: { type: "Polygon", coordinates: [b.coords] },
    })),
  );
}

export type LandmarkState = "new" | "existing" | "future" | "gone";

export function landmarkState(l: Landmark, year: number): LandmarkState {
  if (year < l.built) return "future";
  if (l.gone !== undefined && year > l.gone) return "gone";
  if (year - l.built <= 2) return "new";
  return "existing";
}

export function landmarksFor(year: number, showFuture: boolean): FC {
  return fc(
    LANDMARKS.filter((l) => {
      const s = landmarkState(l, year);
      return s === "new" || s === "existing" || (showFuture && s !== "gone");
    }).map((l) => {
      const state = landmarkState(l, year);
      return {
        type: "Feature",
        properties: {
          id: l.id,
          name: l.name,
          nameRu: l.nameRu ?? "",
          note: l.note,
          kind: l.kind,
          built: l.built,
          gone: l.gone ?? 0,
          state,
          sort: state === "new" ? 0 : state === "existing" ? 1 : 2,
        },
        geometry: { type: "Point", coordinates: l.coord },
      };
    }),
  );
}

const LON_F = 0.61; // приблизительная поправка долготы на широте Берлина

function ellipse(c: [number, number], rx: number, ry: number, steps = 64): [number, number][] {
  const ring: [number, number][] = [];
  for (let i = 0; i <= steps; i++) {
    const a = (i / steps) * Math.PI * 2;
    const wob = 1 + 0.1 * Math.sin(3 * a + 0.7) + 0.06 * Math.cos(5 * a + 1.9);
    ring.push([c[0] + Math.cos(a) * rx * wob, c[1] + Math.sin(a) * ry * wob]);
  }
  return ring;
}

/** Маска «город ещё не дорос сюда»: прямоугольник с дырами по застроенной территории */
export function urbanMaskFor(year: number): FC {
  if (year > 1995) return fc([]);
  const extent = URBAN_EXTENTS.filter((e) => e.year <= year).pop() ?? URBAN_EXTENTS[0];
  const main = ellipse(extent.main.c, extent.main.rx, extent.main.ry);
  const holes: [number, number][][] = [main];
  extent.sats.forEach((s) => {
    const dx = (s.c[0] - extent.main.c[0]) * LON_F;
    const dy = s.c[1] - extent.main.c[1];
    const ang = Math.atan2(dy, dx);
    const mainR = Math.hypot(Math.cos(ang) * extent.main.rx * LON_F * 1.18, Math.sin(ang) * extent.main.ry * 1.18);
    const dist = Math.hypot(dx, dy);
    if (dist > mainR + s.r * LON_F * 1.2) {
      holes.push(ellipse(s.c, s.r, s.r * 0.62, 40));
    }
  });
  const outer: [number, number][] = [
    [12.80, 52.20],
    [13.95, 52.20],
    [13.95, 52.80],
    [12.80, 52.80],
    [12.80, 52.20],
  ];
  return fc([
    {
      type: "Feature",
      properties: { year: extent.year },
      geometry: { type: "Polygon", coordinates: [outer, ...holes] },
    },
  ]);
}

/** Крупные подписи секторов 1945–1990 */
export function sectorLabelsFor(year: number): FC {
  if (year < 1949 || year > 1990) return fc([]);
  return fc([
    {
      type: "Feature",
      properties: { label: "WEST-BERLIN", sub: "Westsektoren" },
      geometry: { type: "Point", coordinates: [13.2650, 52.4750] },
    },
    {
      type: "Feature",
      properties: { label: "BERLIN (OST)", sub: "Hauptstadt der DDR" },
      geometry: { type: "Point", coordinates: [13.5100, 52.5450] },
    },
  ]);
}

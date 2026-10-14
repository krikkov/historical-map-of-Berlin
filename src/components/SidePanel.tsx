import { useMemo, useState } from "react";
import { LANDMARKS, type Landmark } from "@/data/history";
import type { EraInfo } from "@/map/palette";
import type { StyleOptions } from "@/map/style";
import { renamedStreetsFor } from "@/map/style";

type Props = {
  year: number;
  era: EraInfo;
  options: StyleOptions;
  onOptions: (o: StyleOptions) => void;
  onFly: (coord: [number, number], zoom?: number) => void;
};

const Toggle = ({
  label,
  value,
  onChange,
  hint,
}: {
  label: string;
  value: boolean;
  onChange: (v: boolean) => void;
  hint?: string;
}) => (
  <button
    type="button"
    title={hint}
    onClick={() => onChange(!value)}
    className="flex w-full items-center justify-between gap-2 rounded-md border border-stone-600/15 bg-white/40 px-2 py-1.5 text-left text-[11px] text-stone-700 transition hover:bg-white/70"
  >
    <span>{label}</span>
    <span
      className={[
        "relative h-4 w-8 shrink-0 rounded-full transition",
        value ? "bg-amber-700/80" : "bg-stone-400/50",
      ].join(" ")}
    >
      <span
        className={[
          "absolute top-0.5 h-3 w-3 rounded-full bg-white shadow transition-all",
          value ? "left-4" : "left-0.5",
        ].join(" ")}
      />
    </span>
  </button>
);

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="mt-3">
    <div className="font-display mb-1 text-[10px] uppercase tracking-[0.22em] text-stone-500">{title}</div>
    {children}
  </div>
);

export default function SidePanel({ year, era, options, onOptions, onFly }: Props) {
  const [open, setOpen] = useState(() => typeof window === "undefined" || window.innerWidth > 980);
  const [tab, setTab] = useState<"chronicle" | "layers">("chronicle");

  const { appeared, vanished, soon } = useMemo(() => {
    const appeared: Landmark[] = [];
    const vanished: Landmark[] = [];
    const soon: Landmark[] = [];
    LANDMARKS.forEach((l) => {
      if (l.built <= year && year - l.built <= 6) appeared.push(l);
      if (l.gone !== undefined && l.gone <= year && year - l.gone <= 6) vanished.push(l);
      if (l.built > year && l.built - year <= 8) soon.push(l);
    });
    appeared.sort((a, b) => b.built - a.built);
    vanished.sort((a, b) => (b.gone ?? 0) - (a.gone ?? 0));
    soon.sort((a, b) => a.built - b.built);
    return { appeared, vanished, soon };
  }, [year]);

  const renames = useMemo(() => renamedStreetsFor(year), [year]);

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="panel pointer-events-auto rounded-lg px-3 py-2 text-[11px] font-semibold text-stone-700"
      >
        ☰ Хроника и слои
      </button>
    );
  }

  return (
    <div className="panel pointer-events-auto flex max-h-[calc(100vh-150px)] w-[310px] max-w-[88vw] flex-col rounded-xl p-3">
      <div className="flex items-start justify-between gap-2">
        <div>
          <div className="font-display text-[10px] uppercase tracking-[0.28em] text-stone-500">
            Берлин · {year}
          </div>
          <div className="text-sm font-semibold text-stone-800">{era.title}</div>
        </div>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="rounded border border-stone-500/20 px-1.5 text-stone-500 hover:bg-white/60"
          title="Свернуть"
        >
          ✕
        </button>
      </div>
      <p className="mt-1 text-[11px] leading-snug text-stone-600">{era.text}</p>

      <div className="mt-2 flex gap-1">
        {(["chronicle", "layers"] as const).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={[
              "flex-1 rounded-md border px-2 py-1 text-[11px] font-medium transition",
              tab === t
                ? "border-amber-700/40 bg-amber-100/70 text-stone-800"
                : "border-stone-500/15 bg-white/35 text-stone-500 hover:bg-white/60",
            ].join(" ")}
          >
            {t === "chronicle" ? "Хроника" : "Слои карты"}
          </button>
        ))}
      </div>

      <div className="scroll-thin mt-2 flex-1 overflow-y-auto pr-1">
        {tab === "chronicle" ? (
          <>
            {appeared.length > 0 && (
              <Section title="Появилось недавно">
                <ul className="space-y-1">
                  {appeared.map((l) => (
                    <li key={l.id}>
                      <button
                        type="button"
                        onClick={() => onFly(l.coord, 15)}
                        className="w-full rounded-md border border-emerald-900/10 bg-emerald-50/60 px-2 py-1.5 text-left transition hover:bg-emerald-100/80"
                      >
                        <span className="font-display mr-1 text-[10px] text-emerald-800">{l.built}</span>
                        <span className="text-[12px] font-semibold text-stone-800">{l.name}</span>
                        <div className="text-[10.5px] leading-snug text-stone-600">{l.note}</div>
                      </button>
                    </li>
                  ))}
                </ul>
              </Section>
            )}

            {vanished.length > 0 && (
              <Section title="Исчезло">
                <ul className="space-y-1">
                  {vanished.map((l) => (
                    <li key={l.id}>
                      <button
                        type="button"
                        onClick={() => onFly(l.coord, 15)}
                        className="w-full rounded-md border border-red-900/10 bg-red-50/60 px-2 py-1.5 text-left transition hover:bg-red-100/70"
                      >
                        <span className="font-display mr-1 text-[10px] text-red-800">† {l.gone}</span>
                        <span className="text-[12px] font-semibold text-stone-800">{l.name}</span>
                        <div className="text-[10.5px] leading-snug text-stone-600">{l.note}</div>
                      </button>
                    </li>
                  ))}
                </ul>
              </Section>
            )}

            {renames.length > 0 && (
              <Section title="Улицы назывались иначе">
                <ul className="space-y-0.5">
                  {renames.map((r) => (
                    <li key={r.current} className="text-[11px] leading-snug text-stone-700">
                      <span className="font-semibold">{r.historic}</span>
                      <span className="text-stone-500"> — сегодня {r.current}</span>
                    </li>
                  ))}
                </ul>
              </Section>
            )}

            {soon.length > 0 && (
              <Section title="Скоро построят">
                <ul className="space-y-0.5">
                  {soon.map((l) => (
                    <li key={l.id}>
                      <button
                        type="button"
                        onClick={() => onFly(l.coord, 15)}
                        className="w-full text-left text-[11px] leading-snug text-stone-500 hover:text-stone-800"
                      >
                        <span className="font-display mr-1 text-[10px]">{l.built}</span>
                        {l.name}
                      </button>
                    </li>
                  ))}
                </ul>
              </Section>
            )}
          </>
        ) : (
          <>
            <Section title="Исторические слои">
              <div className="space-y-1">
                <Toggle
                  label="Берлинская стена (1961–1989)"
                  value={options.showWall}
                  onChange={(v) => onOptions({ ...options, showWall: v })}
                  hint="Реальные данные Geoportal Berlin: передняя стена, стена тыла, полоса отчуждения"
                />
                <Toggle
                  label="Рост города (приблизительно)"
                  value={options.showGrowth}
                  onChange={(v) => onOptions({ ...options, showGrowth: v })}
                  hint="Скрывает кварталы за пределами застройки выбранного года"
                />
                <Toggle
                  label="Знаковые объекты"
                  value={options.showLandmarks}
                  onChange={(v) => onOptions({ ...options, showLandmarks: v })}
                />
                <Toggle
                  label="Показывать будущее (призраки)"
                  value={options.showFuture}
                  onChange={(v) => onOptions({ ...options, showFuture: v })}
                  hint="Пунктирные метки объектов, которых ещё нет"
                />
              </div>
            </Section>
            <Section title="Подписи">
              <div className="space-y-1">
                <Toggle
                  label="Названия улиц"
                  value={options.showLabels}
                  onChange={(v) => onOptions({ ...options, showLabels: v })}
                />
                <Toggle
                  label="Номера домов (с z17)"
                  value={options.showHouseNumbers}
                  onChange={(v) => onOptions({ ...options, showHouseNumbers: v })}
                />
              </div>
            </Section>
            <Section title="Легенда">
              <ul className="space-y-1 text-[11px] text-stone-700">
                <li className="flex items-center gap-2">
                  <span className="inline-block h-1 w-5 rounded bg-[#8f1d1d]" /> Пограничная стена
                </li>
                <li className="flex items-center gap-2">
                  <span className="inline-block h-1 w-5 rounded bg-[#b4553f]" /> Стена тыла
                </li>
                <li className="flex items-center gap-2">
                  <span className="inline-block h-3 w-5 rounded-sm bg-[#9d2f2f]/20 ring-1 ring-[#9d2f2f]/50" /> Полоса отчуждения
                </li>
                <li className="flex items-center gap-2">
                  <span className="inline-block h-3 w-5 rounded-sm bg-[#9c6246]/80" /> Здание, которого больше нет
                </li>
                <li className="flex items-center gap-2">
                  <span className="inline-block h-3 w-5 rounded-sm bg-[#d8c9a3] ring-1 ring-stone-400/60" /> Ещё не застроено
                </li>
              </ul>
            </Section>
            <Section title="Источники">
              <p className="text-[10px] leading-snug text-stone-500">
                Геометрия улиц и домов — OpenStreetMap / OpenFreeMap. Берлинская стена 1989 —
                Geoportal Berlin (dl-de/zero-2.0). Границы застройки и участки-«заплатки» —
                стилизованная реконструкция по историческим источникам.
              </p>
            </Section>
          </>
        )}
      </div>
    </div>
  );
}

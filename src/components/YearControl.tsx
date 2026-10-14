import { MAX_YEAR, MIN_YEAR, PRESETS } from "@/data/history";
import type { EraInfo } from "@/map/palette";

type Props = {
  year: number;
  onYear: (y: number) => void;
  playing: boolean;
  onPlay: (v: boolean) => void;
  era: EraInfo;
  onPeek: (v: boolean) => void;
  peeking: boolean;
};

const Btn = ({
  children,
  onClick,
  title,
  active,
  wide,
}: {
  children: React.ReactNode;
  onClick: () => void;
  title?: string;
  active?: boolean;
  wide?: boolean;
}) => (
  <button
    type="button"
    title={title}
    onClick={onClick}
    className={[
      "rounded-md border px-2 py-1 text-[11px] font-medium transition",
      wide ? "flex-1" : "",
      active
        ? "border-amber-300/70 bg-amber-200/20 text-amber-100"
        : "border-amber-200/20 bg-black/20 text-amber-100/70 hover:border-amber-200/50 hover:bg-amber-100/10 hover:text-amber-50",
    ].join(" ")}
  >
    {children}
  </button>
);

export default function YearControl({ year, onYear, playing, onPlay, era, onPeek, peeking }: Props) {
  const clamp = (y: number) => Math.max(MIN_YEAR, Math.min(MAX_YEAR, y));

  return (
    <div className="panel-dark pointer-events-auto w-[320px] max-w-[88vw] rounded-xl p-3 text-amber-50">
      <div className="flex items-end justify-between gap-2">
        <div>
          <div className="font-display text-[10px] uppercase tracking-[0.3em] text-amber-200/60">
            Год на карте
          </div>
          <div className="font-display text-5xl leading-none tracking-tight text-amber-50 tabular-nums">
            {year}
          </div>
        </div>
        <div className="flex flex-col items-end gap-1">
          <button
            type="button"
            onClick={() => onPlay(!playing)}
            className="rounded-md border border-amber-200/30 bg-amber-100/10 px-3 py-1.5 text-xs font-semibold text-amber-100 transition hover:bg-amber-100/20"
            title="Проиграть историю"
          >
            {playing ? "■ Стоп" : "▶ Путешествие"}
          </button>
          <div className="text-right text-[10px] leading-tight text-amber-200/60">{era.title}</div>
        </div>
      </div>

      <input
        className="year-range mt-2"
        type="range"
        min={MIN_YEAR}
        max={MAX_YEAR}
        step={1}
        value={year}
        onChange={(e) => onYear(Number(e.target.value))}
      />
      <div className="-mt-1 flex justify-between font-display text-[9px] text-amber-200/45">
        <span>{MIN_YEAR}</span>
        <span>1900</span>
        <span>1950</span>
        <span>2000</span>
        <span>{MAX_YEAR}</span>
      </div>

      <div className="mt-2 flex gap-1">
        <Btn wide onClick={() => onYear(clamp(year - 25))} title="−25 лет">
          ≪ 25
        </Btn>
        <Btn wide onClick={() => onYear(clamp(year - 5))}>
          ≪ 5
        </Btn>
        <Btn wide onClick={() => onYear(clamp(year - 1))}>
          − 1
        </Btn>
        <Btn wide onClick={() => onYear(clamp(year + 1))}>
          + 1
        </Btn>
        <Btn wide onClick={() => onYear(clamp(year + 5))}>
          5 ≫
        </Btn>
        <Btn wide onClick={() => onYear(clamp(year + 25))} title="+25 лет">
          25 ≫
        </Btn>
      </div>

      <button
        type="button"
        onMouseDown={() => onPeek(true)}
        onMouseUp={() => onPeek(false)}
        onMouseLeave={() => onPeek(false)}
        onTouchStart={() => onPeek(true)}
        onTouchEnd={() => onPeek(false)}
        className={[
          "mt-2 w-full rounded-md border px-2 py-1.5 text-[11px] font-semibold transition",
          peeking
            ? "border-amber-300/80 bg-amber-200/30 text-amber-50"
            : "border-amber-200/25 bg-black/20 text-amber-100/80 hover:bg-amber-100/10",
        ].join(" ")}
      >
        Удерживайте — сравнить с сегодняшним днём
      </button>

      <div className="mt-2 flex flex-wrap gap-1">
        {PRESETS.map((p) => (
          <button
            key={p.year}
            type="button"
            title={p.hint}
            onClick={() => onYear(p.year)}
            className={[
              "font-display rounded border px-1.5 py-0.5 text-[10px] transition",
              year === p.year
                ? "border-amber-300/80 bg-amber-200/25 text-amber-50"
                : "border-amber-200/15 bg-black/20 text-amber-100/65 hover:border-amber-200/45 hover:text-amber-50",
            ].join(" ")}
          >
            {p.label}
          </button>
        ))}
      </div>

      <div className="font-display mt-2 text-[9.5px] leading-tight text-amber-200/40">
        ← → меняют год (Shift — шаг 10), пробел — автопутешествие
      </div>
    </div>
  );
}

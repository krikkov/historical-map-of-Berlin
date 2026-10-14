export type Palette = {
  land: string;
  water: string;
  park: string;
  forest: string;
  sand: string;
  urban: string;
  building: string;
  buildingLine: string;
  road: string;
  roadCasing: string;
  major: string;
  majorCasing: string;
  rail: string;
  label: string;
  halo: string;
  house: string;
  ink: string;
  // эффекты старения
  grain: number;
  vignette: number;
  sepia: number;
  sat: number;
  contrast: number;
};

type Anchor = { year: number } & Palette;

const ANCHORS: Anchor[] = [
  {
    year: 2026,
    land: "#f3f0e7", water: "#a8cadf", park: "#d9e7c9", forest: "#cfe1bb", sand: "#f2e9cf",
    urban: "#eeeadd", building: "#e3ded0", buildingLine: "#cbc3ae", road: "#ffffff",
    roadCasing: "#ded6c3", major: "#ffeec4", majorCasing: "#e5c98d", rail: "#c9c1b0",
    label: "#3f4a46", halo: "#fffdf6", house: "#9a9484", ink: "#2f3a37",
    grain: 0.04, vignette: 0.1, sepia: 0, sat: 1, contrast: 1,
  },
  {
    year: 1990,
    land: "#efe9d8", water: "#a3c2d4", park: "#d3e0bf", forest: "#c8d9b2", sand: "#eee2c4",
    urban: "#eae3d0", building: "#ded6c3", buildingLine: "#c2b9a2", road: "#fdfaef",
    roadCasing: "#d6ccb4", major: "#f8e0ae", majorCasing: "#dcbe85", rail: "#c0b7a3",
    label: "#3b4441", halo: "#fffcf2", house: "#938c79", ink: "#303a35",
    grain: 0.12, vignette: 0.16, sepia: 0.08, sat: 0.95, contrast: 1.02,
  },
  {
    year: 1961,
    land: "#e9e1cb", water: "#9db9c7", park: "#ccd9b3", forest: "#c0d0a4", sand: "#e8dbba",
    urban: "#e4dcc5", building: "#d8cfb6", buildingLine: "#b9ad94", road: "#f8f1e1",
    roadCasing: "#cec2a6", major: "#f0d7a1", majorCasing: "#d0b07a", rail: "#b5a98f",
    label: "#3a3f38", halo: "#fdf8e9", house: "#8a816b", ink: "#2e332c",
    grain: 0.22, vignette: 0.24, sepia: 0.2, sat: 0.88, contrast: 1.05,
  },
  {
    year: 1945,
    land: "#e2d7bb", water: "#95aeb4", park: "#c5cfa4", forest: "#b7c699", sand: "#e0d0a9",
    urban: "#ddd1b1", building: "#cfc2a2", buildingLine: "#aa9a7c", road: "#f1e8d3",
    roadCasing: "#c4b593", major: "#e6cb95", majorCasing: "#c2a06c", rail: "#a89a7c",
    label: "#3b3527", halo: "#f8f0dc", house: "#7f7257", ink: "#2b2619",
    grain: 0.34, vignette: 0.32, sepia: 0.32, sat: 0.76, contrast: 1.08,
  },
  {
    year: 1920,
    land: "#ddcfac", water: "#9bafa6", park: "#bfc698", forest: "#b0bb88", sand: "#d9c69a",
    urban: "#d7c8a2", building: "#c8b896", buildingLine: "#9d8b73", road: "#eee2c7",
    roadCasing: "#bbaa86", major: "#ddc088", majorCasing: "#b2905f", rail: "#9c8c6d",
    label: "#3a3020", halo: "#f4e9cd", house: "#786a4e", ink: "#28200f",
    grain: 0.45, vignette: 0.4, sepia: 0.44, sat: 0.62, contrast: 1.1,
  },
  {
    year: 1890,
    land: "#d8c69e", water: "#a1a994", park: "#b8bc8b", forest: "#a9b27d", sand: "#d3bd8d",
    urban: "#d0bf95", building: "#c1af8a", buildingLine: "#917e5e", road: "#ead9b8",
    roadCasing: "#b09b75", major: "#d4b37a", majorCasing: "#a58355", rail: "#917f61",
    label: "#3a2d1b", halo: "#f0e2c2", house: "#6f6145", ink: "#241c0d",
    grain: 0.55, vignette: 0.47, sepia: 0.54, sat: 0.48, contrast: 1.12,
  },
  {
    year: 1850,
    land: "#d2be93", water: "#a6a98a", park: "#b1b27e", forest: "#a2aa72", sand: "#ccb47f",
    urban: "#c9b689", building: "#baa77f", buildingLine: "#857048", road: "#e5d3ab",
    roadCasing: "#a68e68", major: "#cbaa6d", majorCasing: "#9a7747", rail: "#86744f",
    label: "#382919", halo: "#ecdcb8", house: "#665737", ink: "#20180a",
    grain: 0.66, vignette: 0.55, sepia: 0.64, sat: 0.36, contrast: 1.15,
  },
];

const hex = (c: string) => [
  parseInt(c.slice(1, 3), 16),
  parseInt(c.slice(3, 5), 16),
  parseInt(c.slice(5, 7), 16),
];
const toHex = (v: number[]) =>
  "#" + v.map((x) => Math.max(0, Math.min(255, Math.round(x))).toString(16).padStart(2, "0")).join("");

const lerpColor = (a: string, b: string, t: number) => {
  const A = hex(a);
  const B = hex(b);
  return toHex([0, 1, 2].map((i) => A[i] + (B[i] - A[i]) * t));
};

export function paletteFor(year: number): Palette {
  const sorted = ANCHORS;
  if (year >= sorted[0].year) return { ...sorted[0] };
  if (year <= sorted[sorted.length - 1].year) return { ...sorted[sorted.length - 1] };
  let hi = sorted[0];
  let lo = sorted[sorted.length - 1];
  for (let i = 0; i < sorted.length - 1; i++) {
    if (year <= sorted[i].year && year >= sorted[i + 1].year) {
      hi = sorted[i];
      lo = sorted[i + 1];
      break;
    }
  }
  const t = (hi.year - year) / (hi.year - lo.year);
  const out: Record<string, unknown> = {};
  (Object.keys(hi) as (keyof Anchor)[]).forEach((k) => {
    if (k === "year") return;
    const a = hi[k];
    const b = lo[k];
    if (typeof a === "string" && typeof b === "string") out[k] = lerpColor(a, b, t);
    else if (typeof a === "number" && typeof b === "number") out[k] = a + (b - a) * t;
  });
  return out as Palette;
}

/** 0 — наши дни, 1 — глубокая старина */
export function ageFactor(year: number): number {
  const t = (2026 - year) / (2026 - 1850);
  return Math.max(0, Math.min(1, Math.pow(t, 0.85)));
}

export type EraInfo = { key: string; title: string; text: string };

export function eraFor(year: number): EraInfo {
  if (year >= 2006)
    return { key: "now", title: "Столица объединённой Германии", text: "Главный вокзал (2006), Форум Гумбольдта (2020), парк Темпельхофер Фельд (2010), стройки Mediaspree и Europacity." };
  if (year >= 1995)
    return { key: "boom", title: "Большая стройка", text: "Крупнейшая стройплощадка Европы: Потсдамер Платц, правительственный квартал, купол Рейхстага (1999)." };
  if (year >= 1990)
    return { key: "wende", title: "После падения Стены", text: "Город сшивают заново: полоса отчуждения — пустырь в центре, улицы Востока возвращают старые имена." };
  if (year >= 1961)
    return { key: "wall", title: "Разделённый город", text: "Стена длиной 155 км, полоса отчуждения, Западный Берлин — остров. Восток строит Алекс и панельные районы." };
  if (year >= 1949)
    return { key: "cold", title: "Два Берлина", text: "Блокада и воздушный мост, Сталиналлее на Востоке и Интербау-Ханзафиртель на Западе." };
  if (year >= 1945)
    return { key: "ruins", title: "Руины", text: "Около трети зданий разрушено, «женщины руин» разбирают завалы, город поделён на четыре сектора." };
  if (year >= 1933)
    return { key: "ns", title: "Столица диктатуры", text: "Олимпиада-1936, проекты «Германии» Шпеера, с 1943 года — ковровые бомбардировки." };
  if (year >= 1920)
    return { key: "weimar", title: "Большой Берлин", text: "1920: восемь городов и десятки деревень объединены — 3,8 млн жителей, четвёртый город мира." };
  if (year >= 1890)
    return { key: "kaiser", title: "Имперская столица", text: "Доходные дома-казармы, кольцевая и городская железные дороги, первое метро (1902)." };
  return { key: "gruender", title: "Пруссия и грюндерцайт", text: "Город ещё помещается внутри таможенной стены; вокруг — поля, деревни и первые заводы." };
}

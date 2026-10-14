import { STREET_RENAMES } from "@/data/history";
import { ageFactor, paletteFor } from "@/map/palette";
import {
  histBuildingsFor,
  landmarksFor,
  patchesFor,
  sectorLabelsFor,
  urbanMaskFor,
} from "@/map/overlays";
import wallFront from "@/data/geo/wall_front.json";
import wallHinter from "@/data/geo/wall_hinter.json";
import wallStrip from "@/data/geo/wall_strip.json";

export type StyleOptions = {
  showWall: boolean;
  showGrowth: boolean;
  showHouseNumbers: boolean;
  showLandmarks: boolean;
  showFuture: boolean;
  showLabels: boolean;
};

const TILES = "https://tiles.openfreemap.org/planet";
const GLYPHS = "https://tiles.openfreemap.org/fonts/{fontstack}/{range}.pbf";

const i = (...stops: (number | string)[]) => ["interpolate", ["exponential", 1.45], ["zoom"], ...stops];
const lin = (...stops: (number | string)[]) => ["interpolate", ["linear"], ["zoom"], ...stops];

function streetNameExpr(year: number): unknown {
  const base: unknown = ["coalesce", ["get", "name:de"], ["get", "name"], ""];
  const seen = new Set<string>();
  const pairs: string[] = [];
  STREET_RENAMES.forEach((r) => {
    if (seen.has(r.current)) return;
    const h = r.history.find((x) => year >= x.from && year < x.to);
    if (h) {
      seen.add(r.current);
      pairs.push(r.current, h.name);
    }
  });
  if (!pairs.length) return base;
  return ["match", base, ...pairs, base];
}

export function renamedStreetsFor(year: number) {
  const out: { current: string; historic: string }[] = [];
  STREET_RENAMES.forEach((r) => {
    const h = r.history.find((x) => year >= x.from && year < x.to);
    if (h) out.push({ current: r.current, historic: h.name });
  });
  return out;
}

export function buildStyle(year: number, o: StyleOptions) {
  const p = paletteFor(year);
  const age = ageFactor(year);
  const old = age > 0.42;
  const font = [old ? "Noto Sans Italic" : "Noto Sans Regular"];
  const fontB = [old ? "Noto Sans Italic" : "Noto Sans Bold"];
  const wallOn = o.showWall && year >= 1961 && year <= 1989;
  const mask = o.showGrowth ? urbanMaskFor(year) : { type: "FeatureCollection", features: [] };
  const maskOn = (mask as { features: unknown[] }).features.length > 0;

  const layers: Record<string, unknown>[] = [
    { id: "bg", type: "background", paint: { "background-color": p.land } },

    {
      id: "landcover-wood",
      type: "fill",
      source: "omt",
      "source-layer": "landcover",
      filter: ["in", ["get", "class"], ["literal", ["wood", "forest"]]],
      paint: { "fill-color": p.forest, "fill-opacity": 0.85 },
    },
    {
      id: "landcover-grass",
      type: "fill",
      source: "omt",
      "source-layer": "landcover",
      filter: ["in", ["get", "class"], ["literal", ["grass", "meadow", "wetland", "farmland"]]],
      paint: { "fill-color": p.park, "fill-opacity": 0.7 },
    },
    {
      id: "landcover-sand",
      type: "fill",
      source: "omt",
      "source-layer": "landcover",
      filter: ["==", ["get", "class"], "sand"],
      paint: { "fill-color": p.sand },
    },
    {
      id: "landuse-urban",
      type: "fill",
      source: "omt",
      "source-layer": "landuse",
      filter: ["in", ["get", "class"], ["literal", ["residential", "suburb", "quarter", "neighbourhood"]]],
      paint: { "fill-color": p.urban, "fill-opacity": 0.75 },
    },
    {
      id: "landuse-special",
      type: "fill",
      source: "omt",
      "source-layer": "landuse",
      filter: ["in", ["get", "class"], ["literal", ["cemetery", "military", "hospital", "industrial", "railway"]]],
      paint: { "fill-color": p.buildingLine, "fill-opacity": 0.14 },
    },
    {
      id: "park",
      type: "fill",
      source: "omt",
      "source-layer": "park",
      paint: { "fill-color": p.park, "fill-opacity": 0.55 },
    },
    {
      id: "water",
      type: "fill",
      source: "omt",
      "source-layer": "water",
      filter: ["!=", ["get", "brunnel"], "tunnel"],
      paint: { "fill-color": p.water },
    },
    {
      id: "waterway",
      type: "line",
      source: "omt",
      "source-layer": "waterway",
      paint: {
        "line-color": p.water,
        "line-width": i(9, 0.6, 12, 1.6, 16, 5, 18, 11),
      },
    },

    {
      id: "building",
      type: "fill",
      source: "omt",
      "source-layer": "building",
      minzoom: 13,
      paint: {
        "fill-color": p.building,
        "fill-opacity": lin(13, 0.45, 15, 0.9),
        "fill-outline-color": p.buildingLine,
      },
    },

    // дороги
    {
      id: "road-casing-major",
      type: "line",
      source: "omt",
      "source-layer": "transportation",
      filter: ["in", ["get", "class"], ["literal", ["motorway", "trunk", "primary"]]],
      layout: { "line-cap": "round", "line-join": "round" },
      paint: {
        "line-color": p.majorCasing,
        "line-width": i(7, 1.4, 11, 4, 14, 9, 17, 26, 19, 60),
      },
    },
    {
      id: "road-casing-minor",
      type: "line",
      source: "omt",
      "source-layer": "transportation",
      minzoom: 12,
      filter: ["in", ["get", "class"], ["literal", ["secondary", "tertiary", "minor", "service", "track"]]],
      layout: { "line-cap": "round", "line-join": "round" },
      paint: {
        "line-color": p.roadCasing,
        "line-width": i(12, 1.6, 14, 4.5, 17, 16, 19, 42),
      },
    },
    {
      id: "road-minor",
      type: "line",
      source: "omt",
      "source-layer": "transportation",
      minzoom: 12,
      filter: ["in", ["get", "class"], ["literal", ["secondary", "tertiary", "minor", "service", "track"]]],
      layout: { "line-cap": "round", "line-join": "round" },
      paint: {
        "line-color": p.road,
        "line-width": i(12, 0.6, 14, 2.6, 17, 12.5, 19, 36),
      },
    },
    {
      id: "road-major",
      type: "line",
      source: "omt",
      "source-layer": "transportation",
      filter: ["in", ["get", "class"], ["literal", ["motorway", "trunk", "primary"]]],
      layout: { "line-cap": "round", "line-join": "round" },
      paint: {
        "line-color": p.major,
        "line-width": i(7, 0.8, 11, 2.6, 14, 6.5, 17, 21, 19, 52),
      },
    },
    {
      id: "road-path",
      type: "line",
      source: "omt",
      "source-layer": "transportation",
      minzoom: 14,
      filter: ["in", ["get", "class"], ["literal", ["path", "pedestrian"]]],
      paint: {
        "line-color": p.roadCasing,
        "line-width": i(14, 0.6, 18, 3),
        "line-dasharray": [2, 2],
      },
    },
    {
      id: "rail",
      type: "line",
      source: "omt",
      "source-layer": "transportation",
      minzoom: 10,
      filter: ["in", ["get", "class"], ["literal", ["rail", "transit"]]],
      paint: {
        "line-color": p.rail,
        "line-width": i(10, 0.6, 14, 1.6, 18, 4),
        "line-dasharray": [3, 1.5],
      },
    },

    // подписи улиц и номера домов
    {
      id: "street-labels",
      type: "symbol",
      source: "omt",
      "source-layer": "transportation_name",
      minzoom: 12,
      layout: {
        "symbol-placement": "line",
        "text-field": streetNameExpr(year),
        "text-font": font,
        "text-size": i(12, 9.5, 15, 11.5, 18, 14),
        "text-letter-spacing": old ? 0.12 : 0.03,
        "text-transform": old ? "uppercase" : "none",
        "text-max-angle": 40,
        "symbol-spacing": 260,
        visibility: o.showLabels ? "visible" : "none",
      },
      paint: {
        "text-color": p.label,
        "text-halo-color": p.halo,
        "text-halo-width": 1.4,
        "text-halo-blur": 0.6,
      },
    },
    {
      id: "housenumbers",
      type: "symbol",
      source: "omt",
      "source-layer": "housenumber",
      minzoom: 17,
      layout: {
        "text-field": ["get", "housenumber"],
        "text-font": font,
        "text-size": lin(17, 9, 19, 12),
        "text-allow-overlap": false,
        "text-padding": 1,
        visibility: o.showHouseNumbers && o.showLabels ? "visible" : "none",
      },
      paint: {
        "text-color": p.house,
        "text-halo-color": p.halo,
        "text-halo-width": 1.1,
      },
    },
    {
      id: "water-labels",
      type: "symbol",
      source: "omt",
      "source-layer": "water_name",
      minzoom: 11,
      layout: {
        "symbol-placement": "line",
        "text-field": ["coalesce", ["get", "name:de"], ["get", "name"], ""],
        "text-font": font,
        "text-size": 11,
        "text-letter-spacing": 0.2,
        visibility: o.showLabels ? "visible" : "none",
      },
      paint: { "text-color": p.label, "text-halo-color": p.halo, "text-halo-width": 1.2, "text-opacity": 0.8 },
    },
    {
      id: "place-labels",
      type: "symbol",
      source: "omt",
      "source-layer": "place",
      minzoom: 10,
      maxzoom: 16,
      filter: ["in", ["get", "class"], ["literal", ["suburb", "quarter", "neighbourhood", "village", "town"]]],
      layout: {
        "text-field": ["coalesce", ["get", "name:de"], ["get", "name"], ""],
        "text-font": fontB,
        "text-size": lin(10, 10, 14, 13),
        "text-letter-spacing": 0.18,
        "text-transform": "uppercase",
        visibility: o.showLabels ? "visible" : "none",
      },
      paint: {
        "text-color": p.ink,
        "text-halo-color": p.halo,
        "text-halo-width": 1.6,
        "text-opacity": 0.75,
      },
    },

    // ---- исторические наложения ----
    {
      id: "mask-fill",
      type: "fill",
      source: "mask",
      paint: { "fill-color": p.sand, "fill-opacity": maskOn ? 0.97 : 0 },
    },
    {
      id: "mask-line",
      type: "line",
      source: "mask",
      paint: {
        "line-color": p.buildingLine,
        "line-width": 1.2,
        "line-dasharray": [4, 3],
        "line-opacity": maskOn ? 0.8 : 0,
      },
    },
    {
      id: "mask-hatch",
      type: "fill",
      source: "mask",
      paint: { "fill-pattern": "pat-hatch", "fill-opacity": maskOn ? 0.45 : 0 },
    },
    {
      id: "water-over",
      type: "fill",
      source: "omt",
      "source-layer": "water",
      filter: ["!=", ["get", "brunnel"], "tunnel"],
      paint: { "fill-color": p.water, "fill-opacity": maskOn ? 1 : 0 },
    },
    {
      id: "waterway-over",
      type: "line",
      source: "omt",
      "source-layer": "waterway",
      paint: {
        "line-color": p.water,
        "line-width": i(9, 0.6, 12, 1.6, 16, 5, 18, 11),
        "line-opacity": maskOn ? 1 : 0,
      },
    },

    {
      id: "patches-fill",
      type: "fill",
      source: "patches",
      paint: {
        "fill-color": [
          "match",
          ["get", "fill"],
          "ground", p.sand,
          "rubble", p.buildingLine,
          "rail", p.urban,
          "fields", p.park,
          "water", p.water,
          "airfield", p.urban,
          p.sand,
        ],
        "fill-opacity": ["match", ["get", "fill"], "airfield", 0.5, "rail", 0.8, 0.88],
      },
    },
    {
      id: "patches-hatch",
      type: "fill",
      source: "patches",
      filter: ["in", ["get", "fill"], ["literal", ["ground", "rubble", "rail", "fields"]]],
      paint: {
        "fill-pattern": ["match", ["get", "fill"], "fields", "pat-hatch", "rubble", "pat-rubble", "pat-dots"],
        "fill-opacity": 0.75,
      },
    },
    {
      id: "patches-line",
      type: "line",
      source: "patches",
      paint: { "line-color": p.buildingLine, "line-width": 1, "line-dasharray": [3, 2], "line-opacity": 0.7 },
    },
    {
      id: "patches-label",
      type: "symbol",
      source: "patches",
      minzoom: 12.5,
      layout: {
        "text-field": ["get", "label"],
        "text-font": font,
        "text-size": 11,
        "text-letter-spacing": 0.14,
        "text-transform": "uppercase",
      },
      paint: { "text-color": p.label, "text-halo-color": p.halo, "text-halo-width": 1.4, "text-opacity": 0.85 },
    },

    {
      id: "histb-fill",
      type: "fill",
      source: "histb",
      paint: { "fill-color": "#9c6246", "fill-opacity": 0.75 },
    },
    {
      id: "histb-line",
      type: "line",
      source: "histb",
      paint: { "line-color": "#5e3522", "line-width": 1.4 },
    },
    {
      id: "histb-label",
      type: "symbol",
      source: "histb",
      minzoom: 14,
      layout: {
        "text-field": ["get", "label"],
        "text-font": fontB,
        "text-size": 11,
        "text-offset": [0, 1.1],
        "text-anchor": "top",
      },
      paint: { "text-color": "#5e3522", "text-halo-color": p.halo, "text-halo-width": 1.6 },
    },

    // Стена
    {
      id: "wall-strip",
      type: "fill",
      source: "wallStrip",
      paint: { "fill-color": "#9d2f2f", "fill-opacity": wallOn ? 0.2 : 0 },
    },
    {
      id: "wall-strip-line",
      type: "line",
      source: "wallStrip",
      paint: { "line-color": "#9d2f2f", "line-width": 0.8, "line-opacity": wallOn ? 0.5 : 0 },
    },
    {
      id: "wall-hinter",
      type: "line",
      source: "wallHinter",
      paint: {
        "line-color": "#b4553f",
        "line-width": i(9, 0.8, 14, 1.8, 18, 3),
        "line-dasharray": [4, 2],
        "line-opacity": wallOn ? 0.85 : 0,
      },
    },
    {
      id: "wall-front",
      type: "line",
      source: "wallFront",
      layout: { "line-cap": "round", "line-join": "round" },
      paint: {
        "line-color": "#8f1d1d",
        "line-width": i(8, 1.4, 12, 2.6, 15, 4.5, 18, 8),
        "line-opacity": wallOn ? 1 : 0,
      },
    },
    {
      id: "wall-label",
      type: "symbol",
      source: "wallFront",
      minzoom: 12,
      layout: {
        "symbol-placement": "line",
        "text-field": wallOn ? "BERLINER MAUER" : "",
        "text-font": fontB,
        "text-size": 11,
        "text-letter-spacing": 0.25,
        "symbol-spacing": 420,
        "text-offset": [0, 0.9],
      },
      paint: { "text-color": "#8f1d1d", "text-halo-color": p.halo, "text-halo-width": 1.6 },
    },

    {
      id: "sector-labels",
      type: "symbol",
      source: "sectors",
      maxzoom: 13,
      layout: {
        "text-field": ["concat", ["get", "label"], "\n", ["get", "sub"]],
        "text-font": fontB,
        "text-size": lin(9, 13, 12, 22),
        "text-letter-spacing": 0.35,
        "text-line-height": 1.6,
      },
      paint: {
        "text-color": p.ink,
        "text-halo-color": p.halo,
        "text-halo-width": 2,
        "text-opacity": 0.42,
      },
    },

    // памятники / события
    {
      id: "landmark-dot",
      type: "circle",
      source: "landmarks",
      minzoom: 10,
      layout: { visibility: o.showLandmarks ? "visible" : "none" },
      paint: {
        "circle-radius": ["match", ["get", "state"], "new", 7, "future", 4, 5],
        "circle-color": [
          "match",
          ["get", "state"],
          "new", "#c0392b",
          "future", "rgba(0,0,0,0)",
          p.ink,
        ],
        "circle-opacity": ["match", ["get", "state"], "future", 0.0, 0.85],
        "circle-stroke-width": ["match", ["get", "state"], "future", 1.2, 1.6],
        "circle-stroke-color": ["match", ["get", "state"], "future", "#7b8a86", p.halo],
      },
    },
    {
      id: "landmark-label",
      type: "symbol",
      source: "landmarks",
      minzoom: 12,
      layout: {
        "text-field": ["get", "name"],
        "text-font": fontB,
        "text-size": 11.5,
        "text-offset": [0, 1.1],
        "text-anchor": "top",
        "text-optional": true,
        visibility: o.showLandmarks ? "visible" : "none",
      },
      paint: {
        "text-color": ["match", ["get", "state"], "new", "#8f1d1d", "future", "#6d7b77", p.ink],
        "text-halo-color": p.halo,
        "text-halo-width": 1.8,
      },
    },
  ];

  return {
    version: 8,
    name: `Berlin ${year}`,
    glyphs: GLYPHS,
    sources: {
      omt: { type: "vector", url: TILES },
      wallFront: { type: "geojson", data: wallFront },
      wallHinter: { type: "geojson", data: wallHinter },
      wallStrip: { type: "geojson", data: wallStrip },
      mask: { type: "geojson", data: mask },
      patches: { type: "geojson", data: patchesFor(year) },
      histb: { type: "geojson", data: histBuildingsFor(year) },
      landmarks: { type: "geojson", data: landmarksFor(year, o.showFuture) },
      sectors: { type: "geojson", data: sectorLabelsFor(year) },
    },
    layers,
  };
}

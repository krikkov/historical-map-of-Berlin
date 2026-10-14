const grainSvg = (seed: number) =>
  `data:image/svg+xml;utf8,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="220" height="220"><filter id="n"><feTurbulence type="fractalNoise" baseFrequency="0.82" numOctaves="4" seed="${seed}" stitchTiles="stitch"/><feColorMatrix type="saturate" values="0"/></filter><rect width="220" height="220" filter="url(%23n)" opacity="1"/></svg>`,
  )}`;

const fibersSvg = `data:image/svg+xml;utf8,${encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400"><filter id="f"><feTurbulence type="fractalNoise" baseFrequency="0.009 0.14" numOctaves="3" seed="7"/><feColorMatrix type="saturate" values="0"/></filter><rect width="400" height="400" filter="url(%23f)"/></svg>`,
)}`;

export default function AgeOverlay({ grain, vignette }: { grain: number; vignette: number }) {
  return (
    <div className="pointer-events-none absolute inset-0 z-20 overflow-hidden">
      {/* зерно плёнки / бумаги */}
      <div
        className="absolute inset-0 mix-blend-multiply"
        style={{
          backgroundImage: `url("${grainSvg(3)}")`,
          backgroundSize: "220px 220px",
          opacity: grain * 0.55,
        }}
      />
      {/* волокна бумаги */}
      <div
        className="absolute inset-0 mix-blend-multiply"
        style={{
          backgroundImage: `url("${fibersSvg}")`,
          backgroundSize: "520px 520px",
          opacity: grain * 0.35,
        }}
      />
      {/* пятна и выцветание */}
      <div
        className="absolute inset-0 mix-blend-multiply"
        style={{
          backgroundImage:
            "radial-gradient(60% 50% at 18% 22%, rgba(138,106,54,0.20), transparent 70%)," +
            "radial-gradient(45% 40% at 82% 70%, rgba(120,88,40,0.22), transparent 72%)," +
            "radial-gradient(35% 30% at 60% 12%, rgba(92,70,32,0.14), transparent 70%)",
          opacity: grain,
        }}
      />
      {/* виньетка */}
      <div
        className="absolute inset-0"
        style={{
          boxShadow: `inset 0 0 ${120 + vignette * 320}px ${30 + vignette * 140}px rgba(52,38,16,${0.18 + vignette * 0.55})`,
        }}
      />
      {/* линия сгиба карты */}
      <div
        className="absolute inset-y-0 left-1/2 w-px"
        style={{
          background: "linear-gradient(to bottom, transparent, rgba(80,60,28,0.35), transparent)",
          opacity: vignette * 0.55,
        }}
      />
    </div>
  );
}

/** Генерируемые «бумажные» текстуры для заливок (штриховка полей, крапинки пустырей) */
export function makePattern(id: string): ImageData | null {
  const size = 16;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;
  ctx.clearRect(0, 0, size, size);

  if (id === "pat-hatch") {
    ctx.strokeStyle = "rgba(96,74,40,0.38)";
    ctx.lineWidth = 1;
    for (let i = -size; i < size * 2; i += 6) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i + size, size);
      ctx.stroke();
    }
  } else if (id === "pat-dots") {
    ctx.fillStyle = "rgba(88,68,36,0.42)";
    const pts = [
      [3, 4],
      [11, 2],
      [7, 9],
      [14, 11],
      [2, 13],
      [9, 14],
    ];
    pts.forEach(([x, y]) => {
      ctx.beginPath();
      ctx.arc(x, y, 0.9, 0, Math.PI * 2);
      ctx.fill();
    });
  } else if (id === "pat-rubble") {
    ctx.strokeStyle = "rgba(70,52,28,0.45)";
    ctx.lineWidth = 1;
    const segs = [
      [1, 3, 5, 6],
      [8, 2, 12, 5],
      [4, 10, 8, 13],
      [11, 9, 15, 12],
    ];
    segs.forEach(([a, b, c, d]) => {
      ctx.beginPath();
      ctx.moveTo(a, b);
      ctx.lineTo(c, d);
      ctx.stroke();
    });
  } else {
    return null;
  }
  return ctx.getImageData(0, 0, size, size);
}

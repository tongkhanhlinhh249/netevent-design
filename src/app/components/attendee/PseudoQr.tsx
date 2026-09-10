import * as React from "react";

const N = 25;

function isFinder(x: number, y: number) {
  return (x < 7 && y < 7) || (x >= N - 7 && y < 7) || (x < 7 && y >= N - 7);
}

/**
 * Mã QR minh hoạ — prototype chưa có thư viện tạo QR. Dựng lưới ô vuông cố định
 * theo chuỗi đầu vào, có ba ô định vị ở góc như QR thật để nhận ra ngay là mã QR.
 * Không quét được; luôn hiển thị kèm mã chữ hoặc đường dẫn bên cạnh.
 */
export function PseudoQr({ value, size = 160, color = "#111827" }: { value: string; size?: number; color?: string }) {
  const path = React.useMemo(() => {
    let h = 2166136261;
    for (const ch of value) { h ^= ch.charCodeAt(0); h = Math.imul(h, 16777619); }
    const rand = () => { h ^= h << 13; h ^= h >>> 17; h ^= h << 5; return (h >>> 0) / 4294967296; };
    const cells: string[] = [];
    for (let y = 0; y < N; y++) {
      for (let x = 0; x < N; x++) {
        if (!isFinder(x, y) && rand() < 0.48) cells.push(`M${x} ${y}h1v1h-1z`);
      }
    }
    return cells.join("");
  }, [value]);

  const finder = (x: number, y: number) => (
    <g key={`${x}-${y}`}>
      <rect x={x} y={y} width={7} height={7} fill={color} />
      <rect x={x + 1} y={y + 1} width={5} height={5} fill="#fff" />
      <rect x={x + 2} y={y + 2} width={3} height={3} fill={color} />
    </g>
  );

  return (
    <svg viewBox={`-1 -1 ${N + 2} ${N + 2}`} width={size} height={size} shapeRendering="crispEdges"
      role="img" aria-label={`Mã QR: ${value}`} style={{ background: "#fff", borderRadius: 8, display: "block" }}>
      <path d={path} fill={color} />
      {finder(0, 0)}
      {finder(N - 7, 0)}
      {finder(0, N - 7)}
    </svg>
  );
}

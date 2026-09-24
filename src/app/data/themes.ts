// Giao diện trang sự kiện.
//
// `gradient` là ảnh cover mặc định của theme; `page` là màu nền của trang sự
// kiện công khai. Ngoài các theme dựng sẵn còn hai lựa chọn nữa: màu tự chọn
// (`color` + mã màu người dùng chọn) và nền động Galaxy.
//
// Đặt ở đây thay vì trong EventsPage vì cả EventsPage lẫn LandingPage đều cần,
// mà EventsPage đã import LandingPage rồi (tránh vòng lặp import).

export interface Theme {
  id: string;
  label: string;
  gradient: string;
  page: string;
  /** Nền vẽ bằng WebGL thay vì một màu tĩnh. */
  animated?: boolean;
}

export const THEMES: Theme[] = [
  { id: "minimal",  label: "Minimal",       gradient: "linear-gradient(135deg, #f8faff 0%, #e8f0fe 100%)", page: "#f7f9ff" },
  { id: "gradient", label: "Gradient",      gradient: "linear-gradient(135deg, #1eaaff 0%, #7c3aed 100%)", page: "#eff3ff" },
  { id: "conference",label:"Conference",    gradient: "linear-gradient(135deg, #0f172a 0%, #1e3a5f 100%)", page: "#eef2f7" },
  { id: "workshop", label: "Workshop",      gradient: "linear-gradient(135deg, #064e3b 0%, #10b981 100%)", page: "#edfaf3" },
  { id: "launch",   label: "Product Launch",gradient: "linear-gradient(135deg, #1c1917 0%, #7c2d12 100%)", page: "#fdf3ed" },
  { id: "galaxy",   label: "Galaxy",        gradient: "radial-gradient(circle at 30% 25%, #3b2a7a 0%, #150d33 45%, #06040f 100%)",
    page: "#06040f", animated: true },
];

/** Mã màu mặc định khi người dùng mở lựa chọn "Màu tự chọn". */
export const DEFAULT_THEME_COLOR = "#7c3aed";

/** Nền trang sự kiện: màu tự chọn thì lấy đúng màu, còn lại theo theme. */
export function themePageBg(themeId?: string, themeColor?: string): string {
  if (themeId === "color") return themeColor || DEFAULT_THEME_COLOR;
  return (THEMES.find((t) => t.id === themeId) ?? THEMES[1]).page;
}

export const isAnimatedTheme = (themeId?: string) => !!THEMES.find((t) => t.id === themeId)?.animated;

/** Độ sáng cảm nhận của một màu hex hoặc rgb(); không đọc được thì coi như nền sáng. */
export function isDarkColor(color?: string): boolean {
  if (!color) return false;
  let r = 0, g = 0, b = 0;
  const hex = color.trim().replace("#", "");
  if (/^[0-9a-f]{3}$/i.test(hex)) [r, g, b] = [...hex].map((c) => parseInt(c + c, 16));
  else if (/^[0-9a-f]{6}$/i.test(hex)) [r, g, b] = [0, 2, 4].map((i) => parseInt(hex.slice(i, i + 2), 16));
  else {
    const m = color.match(/rgba?\(\s*(\d+)[,\s]+(\d+)[,\s]+(\d+)/i);
    if (!m) return false;
    [r, g, b] = [m[1], m[2], m[3]].map(Number);
  }
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255 < 0.55;
}

/**
 * Biến CSS cho các ô nhập đặt trên nền trang sự kiện. Nền sáng thì phủ trắng mờ,
 * nền tối thì phủ trắng rất nhạt và đảo chữ sang sáng — nhờ vậy cùng một form
 * dùng được cho mọi kiểu nền: màu nhạt, màu đậm tự chọn hay nền động Galaxy.
 * Ghi đè cả dạng --color-* vì utility của Tailwind đọc qua biến trung gian.
 */
export function surfaceVars(pageBg: string): Record<string, string> {
  const pair = (vars: Record<string, string>) =>
    Object.fromEntries(Object.entries(vars).flatMap(([k, v]) => [[k, v], [k.replace("--", "--color-"), v]]));
  return isDarkColor(pageBg)
    ? pair({
      "--background": "rgba(255,255,255,0.10)",
      "--card": "rgba(255,255,255,0.10)",
      "--input-background": "rgba(255,255,255,0.08)",
      "--input": "rgba(255,255,255,0.18)",
      "--secondary": "rgba(255,255,255,0.08)",
      "--muted": "rgba(255,255,255,0.05)",
      "--border": "rgba(255,255,255,0.16)",
      "--foreground": "#f8fafc",
      "--muted-foreground": "rgba(248,250,252,0.62)",
      "--secondary-foreground": "#f8fafc",
    })
    : pair({
      // Chip, nút viền, pill ngày giờ: gần như trắng đặc để luôn nổi.
      "--background": "rgba(255,255,255,0.9)",
      "--card": "rgba(255,255,255,0.9)",
      // Ô nhập: trắng mờ + viền mảnh. Trên nền gần trắng (Minimal) chính viền
      // mới tách ô ra khỏi trang.
      "--input-background": "rgba(255,255,255,0.72)",
      "--input": "rgba(15,23,42,0.12)",
      // Rãnh và nền phụ: phủ tối rất nhẹ, trung tính nên hợp cả nền ấm lẫn lạnh.
      "--secondary": "rgba(15,23,42,0.045)",
      "--muted": "rgba(15,23,42,0.03)",
      "--border": "rgba(15,23,42,0.10)",
    });
}

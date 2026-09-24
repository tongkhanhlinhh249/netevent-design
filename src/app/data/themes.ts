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
  /** Các màu của hiệu ứng mà người dùng chỉnh được ở màn chọn giao diện. */
  tunable?: { key: EffectColorKey; label: string }[];
}

export type EffectColorKey = "line" | "glow" | "dot" | "c1" | "c2" | "c3";

/** Màu mặc định của các nền động. */
export const DEFAULT_EFFECT_COLORS: Record<EffectColorKey, string> = {
  line: "#140E35",
  glow: "#3437A0",
  dot:  "#FFFFFF",
  c1:   "#FF9FFC",
  c2:   "#5227FF",
  c3:   "#B497CF",
};

export const THEMES: Theme[] = [
  { id: "minimal",  label: "Minimal",       gradient: "linear-gradient(135deg, #f8faff 0%, #e8f0fe 100%)", page: "#f7f9ff" },
  { id: "galaxy",   label: "Galaxy",        gradient: "radial-gradient(circle at 30% 25%, #3b2a7a 0%, #150d33 45%, #06040f 100%)",
    page: "#06040f", animated: true },
  { id: "fibers",   label: "Ghost Fibers",  gradient: "linear-gradient(120deg, #140e35 0%, #3437a0 55%, #140e35 100%)",
    page: "#0a0722", animated: true,
    tunable: [{ key: "line", label: "Màu đường" }, { key: "glow", label: "Màu phát sáng" }] },
  { id: "particles", label: "Particles",     gradient: "radial-gradient(circle at 35% 30%, #23252e 0%, #0b0c11 70%)",
    page: "#08090e", animated: true,
    tunable: [{ key: "dot", label: "Màu chấm" }] },
  { id: "grainient", label: "Grainient",     gradient: "linear-gradient(120deg, #ff9ffc 0%, #b497cf 45%, #5227ff 100%)",
    page: "#2a1a63", animated: true,
    tunable: [{ key: "c1", label: "Màu 1" }, { key: "c2", label: "Màu 2" }, { key: "c3", label: "Màu 3" }] },
];

/** Mã màu mặc định khi người dùng mở lựa chọn "Màu tự chọn". */
export const DEFAULT_THEME_COLOR = "#7c3aed";

/** Nền trang sự kiện: màu tự chọn thì lấy đúng màu, còn lại theo theme. */
export function themePageBg(themeId?: string, themeColor?: string): string {
  if (themeId === "color") return themeColor || DEFAULT_THEME_COLOR;
  return (THEMES.find((t) => t.id === themeId) ?? THEMES[0]).page;
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

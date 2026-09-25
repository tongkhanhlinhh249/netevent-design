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
  /** Hiệu ứng vẽ ra nền sáng, dù `page` (màu chờ) là màu tối. */
  bright?: boolean;
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
    page: "#2a1a63", animated: true, bright: true,
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

/** Theme vẽ ra nền sáng (Grainient), dù màu trang khai báo là màu tối. */
export const isBrightTheme = (themeId?: string) => !!THEMES.find((t) => t.id === themeId)?.bright;

/** Độ sáng cảm nhận (0..1) của một màu hex hoặc rgb(); không đọc được thì coi như nền sáng. */
export function brightness(color?: string): number {
  if (!color) return 1;
  let r = 0, g = 0, b = 0;
  const hex = color.trim().replace("#", "");
  if (/^[0-9a-f]{3}$/i.test(hex)) [r, g, b] = [...hex].map((c) => parseInt(c + c, 16));
  else if (/^[0-9a-f]{6}$/i.test(hex)) [r, g, b] = [0, 2, 4].map((i) => parseInt(hex.slice(i, i + 2), 16));
  else {
    const m = color.match(/rgba?\(\s*(\d+)[,\s]+(\d+)[,\s]+(\d+)/i);
    if (!m) return 1;
    [r, g, b] = [m[1], m[2], m[3]].map(Number);
  }
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255;
}

export const isDarkColor = (color?: string) => brightness(color) < 0.55;

/**
 * Biến CSS cho các ô nhập đặt trên nền trang sự kiện. Ba bậc, theo đúng thứ mà
 * chữ trắng cần để đọc được:
 *
 * - Nền rất tối (Galaxy, Ghost Fibers, Particles): ô là tấm gần đục, SÁNG HƠN
 *   nền. Để trong suốt thì một vệt sáng chạy qua sau ô sẽ nuốt mất chữ trắng.
 * - Nền màu đậm hoặc nền động sáng (Grainient): phủ tối mỏng, ô sáng gần bằng
 *   trang mà chữ trắng vẫn đủ tương phản.
 * - Nền sáng: phủ tối rất nhẹ, chữ giữ màu tối mặc định.
 * - Ảnh tải lên (đã phủ đen): ô là lớp tối trung tính khá đặc, chữ trắng.
 *
 * Ghi đè cả dạng --color-* vì utility của Tailwind đọc qua biến trung gian.
 */
export function surfaceVars(pageBg: string, brightBackdrop = false, overImage = false): Record<string, string> {
  const pair = (vars: Record<string, string>) =>
    Object.fromEntries(Object.entries(vars).flatMap(([k, v]) => [[k, v], [k.replace("--", "--color-"), v]]));
  const light = {
    "--foreground": "#ffffff",
    "--muted-foreground": "rgba(255,255,255,0.8)",
    "--secondary-foreground": "#f8fafc",
  };
  const level = brightness(pageBg);

  // Ảnh tải lên đã phủ đen nhưng vẫn giữ nét, nên ô nhập là lớp tối trung tính
  // khá đặc: một mảng sáng của ảnh nằm sau ô cũng không làm chữ trắng chìm.
  // Trung tính chứ không ngả chàm như Galaxy, vì ảnh có thể mang bất kỳ màu nào.
  if (overImage) return pair({
    "--input-background": "rgba(15,15,22,0.55)",
    "--secondary": "rgba(15,15,22,0.55)",
    "--background": "rgba(44,44,56,0.88)",
    "--card": "rgba(44,44,56,0.88)",
    "--muted": "rgba(15,15,22,0.35)",
    "--input": "rgba(255,255,255,0.22)",
    "--border": "rgba(255,255,255,0.22)",
    ...light,
    "--muted-foreground": "rgba(255,255,255,0.85)",
  });

  if (!brightBackdrop && level < 0.32) return pair({
    // Ô nhập và thẻ nhóm: một tấm; pill ngày/giờ lồng bên trong sáng hơn một bậc.
    "--input-background": "rgba(42,38,72,0.78)",
    "--secondary": "rgba(42,38,72,0.78)",
    "--background": "rgba(60,54,96,0.88)",
    "--card": "rgba(60,54,96,0.88)",
    "--muted": "rgba(42,38,72,0.5)",
    "--input": "rgba(255,255,255,0.22)",
    "--border": "rgba(255,255,255,0.22)",
    ...light,
  });

  if (brightBackdrop || level < 0.55) return pair({
    "--input-background": "rgba(12,10,24,0.22)",
    "--secondary": "rgba(12,10,24,0.22)",
    "--background": "rgba(12,10,24,0.34)",
    "--card": "rgba(12,10,24,0.34)",
    "--muted": "rgba(12,10,24,0.14)",
    "--input": "rgba(255,255,255,0.28)",
    "--border": "rgba(255,255,255,0.28)",
    ...light,
    "--muted-foreground": "rgba(255,255,255,0.85)",
  });

  return pair({
    // Chip, nút viền, pill ngày giờ: gần như trắng đặc để luôn nổi.
    "--background": "rgba(255,255,255,0.9)",
    "--card": "rgba(255,255,255,0.9)",
    // Ô nhập dùng đúng bề mặt của thẻ nhóm (thời gian, hình thức, tùy chọn)
    // để cả form là một khối. Trên nền gần trắng (Minimal) chính viền mới
    // tách ô ra khỏi trang.
    "--input-background": "rgba(15,23,42,0.045)",
    "--input": "rgba(15,23,42,0.10)",
    // Rãnh và nền phụ: phủ tối rất nhẹ, trung tính nên hợp cả nền ấm lẫn lạnh.
    "--secondary": "rgba(15,23,42,0.045)",
    "--muted": "rgba(15,23,42,0.03)",
    "--border": "rgba(15,23,42,0.10)",
  });
}

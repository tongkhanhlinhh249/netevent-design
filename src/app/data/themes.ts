// Giao diện trang sự kiện.
//
// `gradient` là ảnh cover mặc định của theme; `page` là màu nền của trang sự
// kiện công khai. `page` được giữ sáng để chữ trên trang vẫn đủ tương phản —
// gradient của Conference, Workshop và Product Launch gần như đen nên không
// dùng trực tiếp làm nền trang được.
//
// Đặt ở đây thay vì trong EventsPage vì cả EventsPage lẫn LandingPage đều cần,
// mà EventsPage đã import LandingPage rồi (tránh vòng lặp import).
export const THEMES = [
  { id: "minimal",  label: "Minimal",       gradient: "linear-gradient(135deg, #f8faff 0%, #e8f0fe 100%)", page: "#f7f9ff" },
  { id: "gradient", label: "Gradient",      gradient: "linear-gradient(135deg, #1eaaff 0%, #7c3aed 100%)", page: "#eff3ff" },
  { id: "conference",label:"Conference",    gradient: "linear-gradient(135deg, #0f172a 0%, #1e3a5f 100%)", page: "#eef2f7" },
  { id: "workshop", label: "Workshop",      gradient: "linear-gradient(135deg, #064e3b 0%, #10b981 100%)", page: "#edfaf3" },
  { id: "launch",   label: "Product Launch",gradient: "linear-gradient(135deg, #1c1917 0%, #7c2d12 100%)", page: "#fdf3ed" },
];

/** Màu nền trang sự kiện của một theme; rơi về theme mặc định nếu không khớp. */
export function themePageBg(themeId: string | undefined): string {
  return (THEMES.find((t) => t.id === themeId) ?? THEMES[1]).page;
}

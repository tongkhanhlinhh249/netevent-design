/**
 * Định dạng ngày của sự kiện theo tiếng Việt, dùng chung cho trang sự kiện,
 * tab Thông tin chung và trang check-in.
 *
 * Ngày trong EventDraft lưu dạng "YYYY-MM-DD" (giá trị của input type="date").
 * Parse thủ công theo giờ địa phương: new Date("2026-08-01") hiểu chuỗi đó là
 * nửa đêm UTC, nên ở múi giờ âm sẽ lùi về ngày hôm trước.
 */
const VI_DAYS = ["Chủ Nhật", "Thứ Hai", "Thứ Ba", "Thứ Tư", "Thứ Năm", "Thứ Sáu", "Thứ Bảy"];

export function parseIsoDate(iso?: string) {
  const m = iso?.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  return m ? new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3])) : undefined;
}

/** "2026-08-01" -> "Thứ Bảy, 1 Tháng 8, 2026" */
export function longDateVi(iso?: string) {
  const d = parseIsoDate(iso);
  return d ? `${VI_DAYS[d.getDay()]}, ${d.getDate()} Tháng ${d.getMonth() + 1}, ${d.getFullYear()}` : undefined;
}

/** "2026-08-01" -> "01/08/2026" */
export function shortDateVi(iso?: string) {
  const d = parseIsoDate(iso);
  return d ? `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}` : undefined;
}

/** Các phần để dựng ô lịch nhỏ: "2026-08-01" -> { weekday: "Thứ Bảy", day: "01", month: 8 } */
export function dateParts(iso?: string) {
  const d = parseIsoDate(iso);
  return d ? { weekday: VI_DAYS[d.getDay()], day: String(d.getDate()).padStart(2, "0"), month: d.getMonth() + 1 } : undefined;
}

/** "Hôm nay" / "Ngày mai" / "Hôm qua"; ngày khác trả về dạng dài. */
export function dayLabelVi(iso?: string) {
  const d = parseIsoDate(iso);
  if (!d) return undefined;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const diff = Math.round((d.getTime() - today.getTime()) / 86_400_000);
  if (diff === 0) return "Hôm nay";
  if (diff === 1) return "Ngày mai";
  if (diff === -1) return "Hôm qua";
  return longDateVi(iso);
}

import { History } from "lucide-react";
import { useCurrentEvent } from "../../data/currentEvent";

const T = {
  background: "var(--background)",
  foreground: "var(--foreground)",
  border:     "var(--border)",
  mutedFg:    "var(--muted-foreground)",
  secondary:  "var(--secondary)",
  primary:    "var(--primary)",
  fw_medium:  "var(--font-weight-medium)",
  fw_semi:    "var(--font-weight-semibold)",
  xs:   "var(--text-xs)",
  sm:   "var(--text-sm)",
  base: "var(--text-base)",
};

const ACTIVITY = [
  { id: "l1", action: "Tạo sự kiện",                       user: "Nguyễn Thị Lan", time: "09:12 · 26/06/2026" },
  { id: "l2", action: "Cập nhật thông tin sự kiện",        user: "Nguyễn Thị Lan", time: "09:40 · 26/06/2026" },
  { id: "l3", action: "Tạo kho vé — 3 hạng vé",            user: "Trần Văn Minh",  time: "14:05 · 26/06/2026" },
  { id: "l4", action: "Xuất bản trang sự kiện",            user: "Nguyễn Thị Lan", time: "16:30 · 26/06/2026" },
  { id: "l5", action: "Bật email xác nhận đăng ký",        user: "Trần Văn Minh",  time: "09:02 · 27/06/2026" },
  { id: "l6", action: "Thêm thành viên — Phạm Đức Anh",    user: "Nguyễn Thị Lan", time: "10:18 · 28/06/2026" },
  { id: "l7", action: "Đổi giao diện trang sự kiện",       user: "Nguyễn Thị Lan", time: "15:47 · 29/06/2026" },
  { id: "l8", action: "Mở check-in tại cửa",               user: "Phạm Đức Anh",   time: "07:55 · 01/07/2026" },
];

export function LichSuHoatDongRoute() {
  const { event } = useCurrentEvent();

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h2 style={{ fontSize: T.base, fontWeight: T.fw_semi, color: T.foreground }}>Lịch sử hoạt động</h2>
        <p style={{ fontSize: T.xs, color: T.mutedFg, marginTop: 2 }}>
          Các thay đổi đã thực hiện trên sự kiện {event.name}.
        </p>
      </div>

      <div className="rounded-2xl overflow-hidden"
        style={{ backgroundColor: T.background, border: `1px solid ${T.border}` }}>
        {ACTIVITY.map((a, i) => (
          <div key={a.id} className="flex items-center gap-3 px-4 py-3"
            style={{ borderTop: i === 0 ? "none" : `1px solid ${T.border}` }}>
            <span className="size-8 rounded-full shrink-0 flex items-center justify-center"
              style={{ backgroundColor: T.secondary }}>
              <History className="size-4" style={{ color: T.mutedFg }} />
            </span>
            <div className="flex-1 min-w-0">
              <p className="truncate" style={{ fontSize: T.sm, fontWeight: T.fw_medium, color: T.foreground }}>{a.action}</p>
              <p className="truncate" style={{ fontSize: T.xs, color: T.mutedFg, marginTop: 1 }}>{a.user}</p>
            </div>
            <span className="shrink-0" style={{ fontSize: T.xs, color: T.mutedFg, whiteSpace: "nowrap" }}>{a.time}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

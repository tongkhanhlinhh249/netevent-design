import { Plus } from "lucide-react";
import { Button } from "../../components/ui/button";
import { useCurrentEvent } from "../../data/currentEvent";

const T = {
  background: "var(--background)",
  foreground: "var(--foreground)",
  border:     "var(--border)",
  mutedFg:    "var(--muted-foreground)",
  secondary:  "var(--secondary)",
  successSubtle: "var(--success-subtle)",
  successText:   "var(--success-text)",
  warningSubtle: "var(--warning-subtle)",
  warningText:   "var(--warning-text)",
  fw_medium:  "var(--font-weight-medium)",
  fw_semi:    "var(--font-weight-semibold)",
  xs:   "var(--text-xs)",
  sm:   "var(--text-sm)",
  base: "var(--text-base)",
};

const MEMBERS = [
  { name: "Nguyễn Thị Lan", email: "owner@netevent.vn",  role: "Người tạo",       tone: "success" as const },
  { name: "Trần Văn Minh",  email: "admin@netevent.vn",  role: "Quản lý",         tone: "warning" as const },
  { name: "Phạm Đức Anh",   email: "staff@netevent.vn",  role: "Nhân viên check-in", tone: "muted" as const },
];

function initials(name: string) {
  const p = name.trim().split(/\s+/);
  return ((p[0]?.[0] ?? "") + (p[p.length - 1]?.[0] ?? "")).toUpperCase();
}

export function ThanhVienRoute() {
  const { event } = useCurrentEvent();

  const tone = (t: "success" | "warning" | "muted") =>
    t === "success" ? { backgroundColor: T.successSubtle, color: T.successText }
    : t === "warning" ? { backgroundColor: T.warningSubtle, color: T.warningText }
    : { backgroundColor: T.secondary, color: T.mutedFg };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 style={{ fontSize: T.base, fontWeight: T.fw_semi, color: T.foreground }}>Thành viên</h2>
          <p style={{ fontSize: T.xs, color: T.mutedFg, marginTop: 2 }}>
            Những người có quyền truy cập sự kiện {event.name}.
          </p>
        </div>
        <Button size="sm" variant="outline" className="shrink-0" style={{ fontSize: T.xs }}>
          <Plus className="size-3.5" /> Thêm thành viên
        </Button>
      </div>

      <div className="rounded-2xl overflow-hidden"
        style={{ backgroundColor: T.background, border: `1px solid ${T.border}` }}>
        {MEMBERS.map((m, i) => (
          <div key={m.email} className="flex items-center gap-3 px-4 py-3"
            style={{ borderTop: i === 0 ? "none" : `1px solid ${T.border}` }}>
            <span className="size-9 rounded-full shrink-0 flex items-center justify-center"
              style={{ backgroundColor: T.secondary, color: T.mutedFg, fontSize: T.xs, fontWeight: T.fw_semi }}>
              {initials(m.name)}
            </span>
            <div className="flex-1 min-w-0">
              <p className="truncate" style={{ fontSize: T.sm, fontWeight: T.fw_medium, color: T.foreground }}>{m.name}</p>
              <p className="truncate" style={{ fontSize: T.xs, color: T.mutedFg, marginTop: 1 }}>{m.email}</p>
            </div>
            <span className="shrink-0" style={{ fontSize: T.xs, padding: "2px 8px", borderRadius: 999,
              whiteSpace: "nowrap", ...tone(m.tone) }}>{m.role}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

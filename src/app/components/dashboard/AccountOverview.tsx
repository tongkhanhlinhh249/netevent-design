import * as React from "react";
import {
  Calendar, Plus, Activity, AlertCircle, Clock, Users, UserCheck,
  Radio, ChevronRight, QrCode, CreditCard, Link2, FileText, Rocket,
} from "lucide-react";
import { Button } from "../ui/button";

// ── Design tokens ──────────────────────────────────────────────────────────────

const T = {
  background:    "var(--background)",
  foreground:    "var(--foreground)",
  border:        "var(--border)",
  primary:       "var(--primary)",
  primaryFg:     "var(--primary-foreground)",
  secondary:     "var(--secondary)",
  mutedFg:       "var(--muted-foreground)",
  successSubtle: "var(--success-subtle)",
  successBorder: "var(--success-border)",
  successText:   "var(--success-text)",
  warningSubtle: "var(--warning-subtle)",
  warningBorder: "var(--warning-border)",
  warningText:   "var(--warning-text)",
  destructSubtle:"rgba(239,68,68,0.08)",
  destructBorder:"rgba(239,68,68,0.2)",
  destructText:  "#dc2626",
  fw_normal: "var(--font-weight-normal)",
  fw_medium: "var(--font-weight-medium)",
  fw_semi:   "var(--font-weight-semibold)",
  fw_bold:   "var(--font-weight-bold)",
  xs:   "var(--text-xs)",
  sm:   "var(--text-sm)",
  base: "var(--text-base)",
  lg:   "var(--text-lg)",
  xl:   "var(--text-xl)",
  "2xl":"var(--text-2xl)",
};

// ── Types ─────────────────────────────────────────────────────────────────────

type EventStatus = "draft" | "published" | "live" | "ended" | "cancelled";
type MyRole      = "owner" | "admin" | "staff-checkin" | "staff-ops";
type TabKey      = "all" | "mine" | "shared";

interface OvEvent {
  id: string; name: string; format: "offline" | "online" | "hybrid";
  startDate: string; startTime: string; status: EventStatus;
  myRole: MyRole; registrants: number; checkins: number;
  revenue?: number; hasTickets: boolean; alerts: string[];
  location?: string;
  /** Đơn chờ xác nhận thanh toán. */
  pendingPayments?: number;
  hasCover?: boolean;
  /** Link phòng họp, chỉ áp dụng cho sự kiện online. */
  onlineLink?: string;
  /** Ngày chuyển sang bản nháp, để biết đã "nằm im" bao lâu. */
  draftSince?: string;
}

/** Lời mời thành viên gửi đi nhưng chưa ai nhận. */
const PENDING_INVITES = 2;

// ── Mock data ─────────────────────────────────────────────────────────────────

const MOCK_EVENTS: OvEvent[] = [
  { id: "e1", name: "NetEvent Demo Conference 2026", format: "offline",
    startDate: "01/08/2026", startTime: "09:00", status: "published",
    myRole: "owner", registrants: 328, checkins: 0, revenue: 45_000_000, hasTickets: true, hasCover: true,
    location: "NetSpace — Công ty Công nghệ & Truyền thông",
    alerts: ["Gần đến lịch nhưng chưa xuất bản", "Chưa setup kho vé"] },
  { id: "e2", name: "Hội thảo AI & Tương lai 2026", format: "hybrid",
    startDate: "15/08/2026", startTime: "13:30", status: "draft",
    myRole: "owner", registrants: 0, checkins: 0, hasTickets: false, hasCover: true, draftSince: "15/08/2026",
    alerts: ["Gần đến lịch nhưng chưa xuất bản", "Chưa setup kho vé"] },
  { id: "e3", name: "Tech Summit Hà Nội", format: "offline",
    startDate: "22/09/2026", startTime: "08:30", status: "draft",
    myRole: "admin", registrants: 0, checkins: 0, hasTickets: false, hasCover: false, draftSince: "22/08/2026",
    alerts: ["Gần đến lịch nhưng chưa xuất bản"] },
  { id: "e4", name: "Sun Music Festival 2026", format: "offline",
    startDate: "20/07/2026", startTime: "18:00", status: "live",
    myRole: "staff-checkin", registrants: 1200, checkins: 874, hasTickets: true, revenue: 180_000_000,
    hasCover: true, pendingPayments: 12, location: "SECC, Quận 7, TP.HCM",
    alerts: [] },
  { id: "e5", name: "Startup Pitch Night", format: "online",
    startDate: "10/08/2026", startTime: "19:00", status: "published",
    myRole: "staff-ops", registrants: 56, checkins: 0, hasTickets: false, hasCover: true, onlineLink: "",
    alerts: ["Chưa setup kho vé"] },
  { id: "e6", name: "Workshop Thiết kế sản phẩm số", format: "online",
    startDate: "05/07/2026", startTime: "09:00", status: "ended",
    myRole: "owner", registrants: 88, checkins: 71, hasTickets: true, revenue: 8_800_000,
    alerts: [] },
  { id: "e7", name: "Lễ hội Văn hoá Cộng đồng", format: "offline",
    startDate: "12/06/2026", startTime: "10:00", status: "ended",
    myRole: "staff-checkin", registrants: 420, checkins: 390, hasTickets: false,
    alerts: [] },
];

const ACTIVITY_LOG = [
  { actor: "Nguyễn Thị Lan", action: "đã tạo sự kiện",              target: "NetEvent Demo Conference 2026", time: "2 giờ trước"  },
  { actor: "Trần Staff A",   action: "đã check-in 24 người cho",    target: "Sun Music Festival 2026",       time: "3 giờ trước"  },
  { actor: "Admin",          action: "đã bật email nhắc lịch cho",  target: "NetEvent Demo Conference 2026", time: "5 giờ trước"  },
  { actor: "Staff B",        action: "đã xác nhận trao quà cho",    target: "Sun Music Festival 2026",       time: "6 giờ trước"  },
  { actor: "Nguyễn Thị Lan", action: "đã xuất bản",                 target: "Startup Pitch Night",           time: "1 ngày trước" },
];

// ── Suy ra dữ liệu cho từng khối ──────────────────────────────────────────────

/** Một dòng trong khối "Cần xử lý": một câu + một hành động. */
type Todo = { id: string; icon: React.FC<{ className?: string }>; text: string; cta: string };

/**
 * Sinh các dòng cần xử lý theo thứ tự ưu tiên đã thống nhất, tối đa 5 dòng.
 * Mỗi quy tắc đọc tín hiệu thật trên dữ liệu chứ không gán cứng câu chữ, để
 * khi dữ liệu đổi thì dòng cũng tự mất đi.
 */
function buildTodos(events: OvEvent[]): Todo[] {
  const rows: Todo[] = [];

  // 1. Đơn chờ xác nhận thanh toán
  for (const e of events) {
    if (e.pendingPayments && e.pendingPayments > 0) {
      rows.push({ id: `pay-${e.id}`, icon: CreditCard, cta: "Xác nhận",
        text: `${e.pendingPayments} đơn chờ xác nhận thanh toán — ${e.name}` });
    }
  }

  // 2. Sắp diễn ra nhưng chưa đủ điều kiện xuất bản
  for (const e of events) {
    if (e.status === "ended" || e.status === "cancelled" || e.status === "live") continue;
    const thieu: string[] = [];
    if (e.hasCover === false) thieu.push("ảnh cover");
    if (!e.hasTickets)        thieu.push("kho vé");
    if (thieu.length && e.status === "draft") {
      rows.push({ id: `ready-${e.id}`, icon: FileText, cta: "Hoàn thiện",
        text: `${e.name} còn thiếu ${thieu.join(" và ")}` });
    }
  }

  // 3. Bản nháp nằm im quá lâu
  for (const e of events) {
    if (e.status === "draft" && e.draftSince && e.hasCover !== false && e.hasTickets === false) {
      rows.push({ id: `draft-${e.id}`, icon: Clock, cta: "Mở sự kiện",
        text: `${e.name} đang là bản nháp từ ${e.draftSince}` });
    }
  }

  // 4. Sự kiện online chưa có link tham gia
  for (const e of events) {
    if (e.format === "online" && e.status !== "ended" && e.status !== "cancelled" && !e.onlineLink) {
      rows.push({ id: `link-${e.id}`, icon: Link2, cta: "Thêm link",
        text: `${e.name} chưa có link tham gia` });
    }
  }

  // 5. Lời mời thành viên chưa được nhận
  if (PENDING_INVITES > 0) {
    rows.push({ id: "invites", icon: Users, cta: "Xem thành viên",
      text: `${PENDING_INVITES} lời mời chưa được nhận` });
  }

  return rows.slice(0, 5);
}

/** Link trang check-in (tab riêng). Sự kiện ở màn này chưa có bản ghi đầy đủ
    như sự kiện đang xem, nên gửi kèm tên, ngày, giờ để dựng phần đầu trang. */
function checkInHref(e: OvEvent) {
  const m = e.startDate.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  const q = new URLSearchParams({ event: e.id, name: e.name, time: e.startTime });
  if (m) q.set("date", `${m[3]}-${m[2]}-${m[1]}`);
  return `/check-in?${q}`;
}

/** "01/08/2026" -> số so sánh được, để sắp xếp theo ngày. */
function dateKey(v: string) {
  const m = v.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  return m ? Number(`${m[3]}${m[2]}${m[1]}`) : 0;
}

// ── Các khối ──────────────────────────────────────────────────────────────────

function Section({ title, action, children }: {
  title: string; action?: React.ReactNode; children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between gap-3">
        <h3 style={{ fontSize: T.base, fontWeight: T.fw_semi, color: T.foreground }}>{title}</h3>
        {action}
      </div>
      {children}
    </div>
  );
}

/** Khối 1 — sự kiện đang chạy. Đây là thứ quan trọng nhất trong ngày diễn ra. */
function LiveEventCard({ event, onManage }: { event: OvEvent; onManage: () => void }) {
  const pct = event.registrants > 0 ? Math.round(event.checkins / event.registrants * 100) : 0;
  return (
    <div className="rounded-2xl p-5 flex flex-col lg:flex-row lg:items-center gap-4 lg:gap-6"
      style={{ backgroundColor: T.background, border: `1px solid rgba(248,104,128,0.35)` }}>
      {/* Khối chiếm hết bề ngang nên bày ngang: thông tin và hành động bên
          trái, tiến độ check-in bên phải. */}
      <div className="flex-1 min-w-0 flex flex-col gap-2">
        <span className="inline-flex items-center gap-1.5 self-start" style={{
          fontSize: T.xs, fontWeight: T.fw_semi, padding: "2px 8px", borderRadius: 999,
          backgroundColor: "rgba(248,104,128,0.10)", color: "#f86880",
          border: "1px solid rgba(248,104,128,0.30)" }}>
          <span className="size-1.5 rounded-full animate-pulse" style={{ backgroundColor: "#f86880" }} />
          Đang diễn ra
        </span>
        <p className="min-w-0" style={{ fontSize: T.lg, fontWeight: T.fw_semi, color: T.foreground }}>{event.name}</p>
        <p style={{ fontSize: T.sm, color: T.mutedFg }}>
          {event.startTime}{event.location ? ` · ${event.location}` : ""}
        </p>
        <div className="flex items-center gap-2 flex-wrap mt-1">
          {/* Check-in mở tab riêng, như ở danh sách sự kiện */}
          <Button size="sm" asChild>
            <a href={checkInHref(event)} target="_blank" rel="noreferrer"><QrCode className="size-3.5" /> Check-in QR</a>
          </Button>
          <Button size="sm" variant="outline" onClick={onManage}>Quản lý sự kiện →</Button>
        </div>
      </div>

      {/* Tiến độ check-in — con số cần nhìn nhất trong lúc sự kiện đang chạy */}
      <div className="shrink-0 flex flex-col gap-1.5 lg:w-64">
        <div className="flex items-baseline justify-between gap-3">
          <span style={{ fontSize: T.sm, color: T.foreground }}>
            <strong>{event.checkins.toLocaleString()}</strong>
            <span style={{ color: T.mutedFg }}> / {event.registrants.toLocaleString()} đã check-in</span>
          </span>
          <span style={{ fontSize: T.sm, fontWeight: T.fw_semi, color: "#f86880" }}>{pct}%</span>
        </div>
        <div className="rounded-full overflow-hidden" style={{ height: 6, backgroundColor: T.border }}>
          <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: "#f86880" }} />
        </div>
      </div>

    </div>
  );
}

export function AccountOverview({ onGoToEvents, onCreateEvent }: {
  onGoToEvents?: () => void;
  onCreateEvent?: () => void;
} = {}) {
  const events = MOCK_EVENTS;

  const live     = events.filter((e) => e.status === "live");
  const upcoming = events
    .filter((e) => e.status === "published" || e.status === "draft")
    .sort((a, b) => dateKey(a.startDate) - dateKey(b.startDate));
  const todos    = buildTodos(events);

  const noEvents  = events.length === 0;
  const allClosed = !noEvents && events.every((e) => e.status === "ended" || e.status === "cancelled");

  // ── Tài khoản mới: chỉ một khối onboarding, không khối rỗng nào khác ──
  if (noEvents) {
    return (
      <div className="rounded-2xl p-6 flex flex-col gap-5 max-w-2xl"
        style={{ backgroundColor: T.background, border: `1px solid ${T.border}` }}>
        <div className="flex items-center gap-3">
          <span className="size-10 rounded-xl flex items-center justify-center"
            style={{ backgroundColor: `color-mix(in srgb, ${T.primary} 12%, transparent)` }}>
            <Rocket className="size-5" style={{ color: T.primary }} />
          </span>
          <div>
            <p style={{ fontSize: T.base, fontWeight: T.fw_semi, color: T.foreground }}>Bắt đầu với NetEvent</p>
            <p style={{ fontSize: T.sm, color: T.mutedFg, marginTop: 2 }}>Ba bước để mở bán vé sự kiện đầu tiên.</p>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          {[
            "Tạo sự kiện và điền thời gian, địa điểm",
            "Thiết lập kho vé và form đăng ký",
            "Xuất bản trang sự kiện và chia sẻ",
          ].map((step, i) => (
            <div key={step} className="flex items-center gap-3">
              <span className="size-6 rounded-full shrink-0 flex items-center justify-center"
                style={{ backgroundColor: T.secondary, color: T.mutedFg, fontSize: T.xs, fontWeight: T.fw_semi }}>
                {i + 1}
              </span>
              <span style={{ fontSize: T.sm, color: T.foreground }}>{step}</span>
            </div>
          ))}
        </div>

        <Button className="self-start" onClick={onCreateEvent}>
          <Plus className="size-4" /> Tạo sự kiện đầu tiên
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 pb-10">

      {/* Ba ô chỉ số chia đều hết bề ngang */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {([
          { value: events.length,   label: "sự kiện",      sub: "Trong workspace",  icon: Calendar, live: false },
          { value: upcoming.length, label: "sắp diễn ra",  sub: "Chưa kết thúc",    icon: Clock,    live: false },
          { value: live.length,     label: "đang diễn ra", sub: "Cần trực hôm nay", icon: Radio,    live: true  },
        ]).map((m) => {
          const on = m.live && m.value > 0;
          return (
            <div key={m.label} className="rounded-2xl p-4 flex flex-col gap-3"
              style={{ backgroundColor: T.background,
                border: `1px solid ${on ? "rgba(248,104,128,0.35)" : T.border}` }}>
              <div className="flex items-center justify-between gap-2">
                <span className="size-9 rounded-xl flex items-center justify-center shrink-0"
                  style={{ backgroundColor: on ? "rgba(248,104,128,0.10)" : `color-mix(in srgb, ${T.primary} 8%, transparent)` }}>
                  <m.icon className="size-4" style={{ color: on ? "#f86880" : T.primary }} />
                </span>
                {on && (
                  <span className="size-2 rounded-full shrink-0 animate-pulse" style={{ backgroundColor: "#f86880" }} />
                )}
              </div>
              <div>
                <p style={{ fontSize: T["2xl"], fontWeight: T.fw_bold, lineHeight: 1.1,
                  color: on ? "#f86880" : T.foreground }}>{m.value}</p>
                <p style={{ fontSize: T.sm, color: T.foreground, marginTop: 4 }}>{m.label}</p>
                <p style={{ fontSize: T.xs, color: T.mutedFg, marginTop: 2 }}>{m.sub}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Khối 1 — Đang diễn ra (ẩn hẳn khi không có) ── */}
      {live.length > 0 && (
        <Section title="Đang diễn ra">
          <div className="flex flex-col gap-3">
            {live.map((e) => <LiveEventCard key={e.id} event={e} onManage={() => onGoToEvents?.()} />)}
          </div>
        </Section>
      )}

      {/* Tất cả sự kiện đã khép lại */}
      {allClosed && (
        <div className="rounded-2xl p-5 flex items-center justify-between gap-3 flex-wrap"
          style={{ backgroundColor: T.background, border: `1px solid ${T.border}` }}>
          <p style={{ fontSize: T.sm, color: T.mutedFg }}>Không có sự kiện nào đang hoạt động.</p>
          <Button size="sm" onClick={onCreateEvent}><Plus className="size-3.5" /> Tạo sự kiện</Button>
        </div>
      )}

      {/* Hàng giữa: việc cần làm đứng cạnh lịch sắp tới — hai khối cao xấp xỉ
          nhau nên hai cột cân. Nếu không có sự kiện sắp tới thì Cần xử lý chiếm
          hết hàng, không để trống cột phải. */}
      {!allClosed && (
        <div className={`grid grid-cols-1 ${upcoming.length > 0 ? "xl:grid-cols-[1fr_360px]" : ""} gap-6 items-start`}>
          <div className="flex flex-col gap-6 min-w-0">
      {/* ── Khối 2 — Cần xử lý ── */}
      {!allClosed && (
        <Section title="Cần xử lý">
          {todos.length === 0 ? (
            <p style={{ fontSize: T.sm, color: T.mutedFg }}>Không có việc cần xử lý.</p>
          ) : (
            <div className="rounded-2xl overflow-hidden"
              style={{ backgroundColor: T.background, border: `1px solid ${T.border}` }}>
              {todos.map((t, i) => (
                <div key={t.id} className="flex items-center gap-3 px-4 py-3"
                  style={{ borderTop: i === 0 ? "none" : `1px solid ${T.border}` }}>
                  <t.icon className="size-4 shrink-0" style={{ color: T.mutedFg }} />
                  <span className="flex-1 min-w-0" style={{ fontSize: T.sm, color: T.foreground }}>{t.text}</span>
                  <Button size="sm" variant="outline" className="shrink-0" style={{ fontSize: T.xs }}
                    onClick={() => onGoToEvents?.()}>
                    {t.cta}
                  </Button>
                </div>
              ))}
            </div>
          )}
        </Section>
      )}

          </div>
          {upcoming.length > 0 && (
            <div className="flex flex-col gap-6 min-w-0">
      {/* ── Khối 3 — Sắp diễn ra (tối đa 3, nối sang màn Sự kiện) ── */}
      {!allClosed && upcoming.length > 0 && (
        <Section title="Sắp diễn ra" action={
          <button data-pill="off" onClick={() => onGoToEvents?.()}
            className="shrink-0 flex items-center gap-1 cursor-pointer transition-opacity hover:opacity-70"
            style={{ background: "none", border: "none", padding: 0, fontSize: T.sm, color: T.primary }}>
            Xem tất cả <ChevronRight className="size-3.5" />
          </button>
        }>
          <div className="rounded-2xl overflow-hidden"
            style={{ backgroundColor: T.background, border: `1px solid ${T.border}` }}>
            {upcoming.slice(0, 3).map((e, i) => (
              <button key={e.id} data-pill="off" onClick={() => onGoToEvents?.()}
                className="w-full flex items-start gap-3 px-4 py-3 text-left cursor-pointer transition-opacity hover:opacity-80"
                style={{ background: "none", borderTop: i === 0 ? "none" : `1px solid ${T.border}`,
                  borderLeft: "none", borderRight: "none", borderBottom: "none" }}>
                {/* Cột phải chỉ rộng 360px: tên đứng riêng một dòng, ngày và số
                    đăng ký xuống dòng dưới, thay vì nhồi hết vào một hàng rồi cắt cụt. */}
                <Calendar className="size-4 shrink-0 mt-0.5" style={{ color: T.mutedFg }} />
                <span className="flex-1 min-w-0 flex flex-col">
                  <span className="truncate" style={{ fontSize: T.sm, fontWeight: T.fw_medium, color: T.foreground }}>{e.name}</span>
                  <span style={{ fontSize: T.xs, color: T.mutedFg, marginTop: 1 }}>
                    {e.startDate} · {e.registrants > 0 ? `${e.registrants.toLocaleString()} đăng ký` : "chưa có đăng ký"}
                  </span>
                </span>
                <ChevronRight className="size-3.5 shrink-0 mt-1" style={{ color: T.mutedFg }} />
              </button>
            ))}
          </div>
        </Section>
      )}

            </div>
          )}
        </div>
      )}

      {/* Hoạt động gần đây — full width bên dưới, đủ chỗ để mỗi dòng nằm gọn một hàng */}
      {/* ── Khối 4 — Hoạt động gần đây ── */}
      <Section title="Hoạt động gần đây">
        <div className="rounded-2xl overflow-hidden"
          style={{ backgroundColor: T.background, border: `1px solid ${T.border}` }}>
          {ACTIVITY_LOG.map((a, i) => (
            <button key={`${a.actor}-${a.time}`} data-pill="off" onClick={() => onGoToEvents?.()}
              className="w-full flex items-start gap-3 px-4 py-3 text-left cursor-pointer transition-opacity hover:opacity-80"
              style={{ background: "none", borderTop: i === 0 ? "none" : `1px solid ${T.border}`,
                borderLeft: "none", borderRight: "none", borderBottom: "none" }}>
              <Activity className="size-4 shrink-0 mt-0.5" style={{ color: T.mutedFg }} />
              <span className="flex-1 min-w-0" style={{ fontSize: T.sm, color: T.foreground }}>
                <strong style={{ fontWeight: T.fw_medium }}>{a.actor}</strong> {a.action}{" "}
                <strong style={{ fontWeight: T.fw_medium }}>{a.target}</strong>
              </span>
              <span className="shrink-0 mt-0.5" style={{ fontSize: T.xs, color: T.mutedFg, whiteSpace: "nowrap" }}>{a.time}</span>
            </button>
          ))}
        </div>
      </Section>

    </div>
  );
}

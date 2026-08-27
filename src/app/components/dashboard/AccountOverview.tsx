import * as React from "react";
import { useState } from "react";
import {
  Calendar, MapPin, Search, Plus, Zap, Activity,
  AlertCircle, AlertTriangle, Clock, Users, UserCheck,
  Gamepad2, Mail, Radio, Laptop, ExternalLink, QrCode, Gift, X,
} from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

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
}

// ── Mock data ─────────────────────────────────────────────────────────────────

const MOCK_EVENTS: OvEvent[] = [
  { id: "e1", name: "NetEvent Demo Conference 2026", format: "offline",
    startDate: "01/08/2026", startTime: "09:00", status: "published",
    myRole: "owner", registrants: 328, checkins: 0, revenue: 45_000_000, hasTickets: true,
    alerts: ["Gần đến lịch nhưng chưa xuất bản", "Chưa setup kho vé"] },
  { id: "e2", name: "Hội thảo AI & Tương lai 2026", format: "hybrid",
    startDate: "15/08/2026", startTime: "13:30", status: "draft",
    myRole: "owner", registrants: 0, checkins: 0, hasTickets: false,
    alerts: ["Gần đến lịch nhưng chưa xuất bản", "Chưa setup kho vé"] },
  { id: "e3", name: "Tech Summit Hà Nội", format: "offline",
    startDate: "22/09/2026", startTime: "08:30", status: "draft",
    myRole: "admin", registrants: 0, checkins: 0, hasTickets: true,
    alerts: ["Gần đến lịch nhưng chưa xuất bản"] },
  { id: "e4", name: "Sun Music Festival 2026", format: "offline",
    startDate: "20/07/2026", startTime: "18:00", status: "live",
    myRole: "staff-checkin", registrants: 1200, checkins: 874, hasTickets: true, revenue: 180_000_000,
    alerts: [] },
  { id: "e5", name: "Startup Pitch Night", format: "online",
    startDate: "10/08/2026", startTime: "19:00", status: "published",
    myRole: "staff-ops", registrants: 56, checkins: 0, hasTickets: false,
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

const ALERT_ITEMS = [
  { icon: <AlertCircle className="size-4" />, color: T.warningText, bg: T.warningSubtle,
    title: "3 sự kiện bản nháp chưa xuất bản",
    desc: "NetEvent Demo Conference, Hội thảo AI, Tech Summit", cta: "Xem" },
  { icon: <QrCode className="size-4" />, color: T.primary, bg: "rgba(30,170,255,0.08)",
    title: "2 sự kiện sắp diễn ra chưa bật check-in",
    desc: "NetEvent Demo Conference 2026, Startup Pitch Night", cta: "Bật ngay" },
  { icon: <Mail className="size-4" />, color: T.mutedFg, bg: T.secondary,
    title: "1 sự kiện chưa bật email nhắc lịch",
    desc: "Startup Pitch Night — diễn ra 10/08/2026", cta: "Cấu hình" },
  { icon: <Gamepad2 className="size-4" />, color: "#7c3aed", bg: "rgba(124,58,237,0.08)",
    title: "1 mini game đã tạo nhưng chưa publish",
    desc: "Tech Summit Hà Nội — Bốc thăm trúng thưởng", cta: "Publish" },
  { icon: <Gift className="size-4" />, color: "#dc2626", bg: "rgba(239,68,68,0.08)",
    title: "4 người thắng chưa xác nhận trao quà",
    desc: "Sun Music Festival 2026 — Mini game vòng quay", cta: "Xử lý" },
];

const ACTIVITY_LOG = [
  { actor: "Nguyễn Thị Lan", action: "đã tạo sự kiện",              target: "NetEvent Demo Conference 2026", time: "2 giờ trước"  },
  { actor: "Trần Staff A",   action: "đã check-in 24 người cho",    target: "Sun Music Festival 2026",       time: "3 giờ trước"  },
  { actor: "Admin",          action: "đã bật email nhắc lịch cho",  target: "NetEvent Demo Conference 2026", time: "5 giờ trước"  },
  { actor: "Staff B",        action: "đã xác nhận trao quà cho",    target: "Sun Music Festival 2026",       time: "6 giờ trước"  },
  { actor: "Nguyễn Thị Lan", action: "đã xuất bản",                 target: "Startup Pitch Night",           time: "1 ngày trước" },
];

// ── Helpers ───────────────────────────────────────────────────────────────────

const STATUS_CFG: Record<EventStatus, { label: string; bg: string; color: string }> = {
  draft:     { label: "Bản nháp",     bg: T.warningSubtle,        color: T.warningText  },
  published: { label: "Sắp diễn ra",  bg: "rgba(30,170,255,0.1)", color: T.primary      },
  live:      { label: "Đang diễn ra", bg: "rgba(239,68,68,0.08)", color: "#dc2626"      },
  ended:     { label: "Đã kết thúc",  bg: T.secondary,            color: T.mutedFg      },
  cancelled: { label: "Đã hủy",       bg: T.secondary,            color: T.mutedFg      },
};

const ROLE_CFG: Record<MyRole, string> = {
  "owner":        "Owner",
  "admin":        "Admin sự kiện",
  "staff-checkin":"Staff check-in",
  "staff-ops":    "Staff vận hành",
};

const FORMAT_CFG: Record<string, { icon: React.ReactNode; label: string }> = {
  offline: { icon: <MapPin  className="size-3" />, label: "Offline" },
  online:  { icon: <Laptop  className="size-3" />, label: "Online"  },
  hybrid:  { icon: <Radio   className="size-3" />, label: "Hybrid"  },
};

// ── Sub-components ─────────────────────────────────────────────────────────────

function StatCard({ icon, label, value, sub, iconBg, iconColor }: {
  icon: React.ReactNode; label: string; value: string;
  sub?: string; iconBg?: string; iconColor?: string;
}) {
  return (
    <div className="rounded-2xl p-4 flex flex-col gap-3"
      style={{ backgroundColor: T.background, border: `1px solid ${T.border}` }}>
      <div className="flex items-center gap-2.5">
        <div className="size-8 rounded-lg flex items-center justify-center shrink-0"
          style={{ backgroundColor: iconBg ?? "rgba(30,170,255,0.08)", color: iconColor ?? T.primary }}>
          {icon}
        </div>
        <p style={{ fontSize: T.xs, color: T.mutedFg }}>{label}</p>
      </div>
      <div>
        <p style={{ fontSize: T.xl, fontWeight: T.fw_bold, color: T.foreground }}>{value}</p>
        {sub && <p style={{ fontSize: T.xs, color: T.mutedFg, marginTop: 2 }}>{sub}</p>}
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: EventStatus }) {
  const cfg = STATUS_CFG[status];
  return (
    <span style={{ fontSize: T.xs, fontWeight: T.fw_medium, padding: "2px 8px", borderRadius: "999px",
      backgroundColor: cfg.bg, color: cfg.color, whiteSpace: "nowrap" }}>
      {cfg.label}
    </span>
  );
}

function RoleBadge({ role }: { role: MyRole }) {
  return (
    <span style={{ fontSize: T.xs, padding: "2px 8px", borderRadius: "999px",
      backgroundColor: T.secondary, color: T.mutedFg, whiteSpace: "nowrap",
      border: `1px solid ${T.border}` }}>
      {ROLE_CFG[role]}
    </span>
  );
}

// ── Empty state ────────────────────────────────────────────────────────────────

function EmptyState({ tab }: { tab: TabKey }) {
  const cfg = {
    all:    { title: "Bạn chưa có sự kiện nào",
              desc:  "Tạo sự kiện đầu tiên để bắt đầu quản lý đăng ký, vé và check-in trên NetEvent.", cta: true },
    mine:   { title: "Bạn chưa sở hữu sự kiện nào",
              desc:  "Các sự kiện bạn tạo hoặc được gán làm owner sẽ hiển thị tại đây.", cta: true },
    shared: { title: "Bạn chưa được phân quyền vào sự kiện nào",
              desc:  "Khi có người mời bạn tham gia quản lý hoặc vận hành sự kiện, sự kiện đó sẽ hiển thị tại đây.", cta: false },
  }[tab];
  return (
    <div className="flex flex-col items-center justify-center py-20 rounded-2xl"
      style={{ border: `1px dashed ${T.border}`, backgroundColor: T.background }}>
      <Calendar className="size-12 mb-4" style={{ color: T.mutedFg, opacity: 0.35 }} />
      <p style={{ fontSize: T.base, fontWeight: T.fw_semi, color: T.foreground, marginBottom: 8 }}>
        {cfg.title}
      </p>
      <p style={{ fontSize: T.sm, color: T.mutedFg, textAlign: "center", maxWidth: 360,
        marginBottom: 20, lineHeight: 1.6 }}>{cfg.desc}</p>
      {cfg.cta && <Button><Plus className="size-4" /> Tạo sự kiện</Button>}
    </div>
  );
}

// ── Main component ─────────────────────────────────────────────────────────────

export function AccountOverview() {
  const [tab, setTab]         = useState<TabKey>("all");
  const [search, setSearch]   = useState("");
  const [statusF, setStatusF] = useState("all");
  const [timeF, setTimeF]     = useState("all");
  const [formatF, setFormatF] = useState("all");
  const [roleF, setRoleF]     = useState("all");

  const tabFiltered = MOCK_EVENTS.filter((e) => {
    if (tab === "mine")   return e.myRole === "owner" || e.myRole === "admin";
    if (tab === "shared") return e.myRole === "staff-checkin" || e.myRole === "staff-ops";
    return true;
  });

  const events = tabFiltered.filter((e) => {
    if (search    && !e.name.toLowerCase().includes(search.toLowerCase())) return false;
    if (statusF !== "all" && e.status !== statusF) return false;
    if (formatF !== "all" && e.format !== formatF) return false;
    if (roleF   !== "all" && e.myRole !== roleF)   return false;
    return true;
  });

  const attention  = events.filter((e) => e.alerts.length > 0);
  const hasFilters = !!(search || statusF !== "all" || timeF !== "all" || formatF !== "all" || roleF !== "all");

  const TABS: { key: TabKey; label: string; count: number }[] = [
    { key: "all",    label: "Tất cả",                  count: MOCK_EVENTS.length },
    { key: "mine",   label: "Của tôi",                 count: MOCK_EVENTS.filter(e => e.myRole === "owner" || e.myRole === "admin").length },
    { key: "shared", label: "Được phân quyền cho tôi", count: MOCK_EVENTS.filter(e => e.myRole === "staff-checkin" || e.myRole === "staff-ops").length },
  ];

  return (
    <div className="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-6 items-start pb-10">

      {/* LEFT — tabs + filters + stats + event table */}
      <div className="flex flex-col gap-6 min-w-0">

        {/* Tab filter */}
        <div style={{ borderBottom: `1px solid ${T.border}` }}>
          <div className="flex gap-0">
            {TABS.map((t) => (
              <button key={t.key} onClick={() => setTab(t.key)}
                style={{
                  background: "none", border: "none", cursor: "pointer",
                  display: "flex", alignItems: "center", gap: 6,
                  padding: "0 4px 12px", marginRight: 24, marginBottom: -1,
                  fontSize: T.sm, fontWeight: tab === t.key ? T.fw_semi : T.fw_normal,
                  color: tab === t.key ? T.primary : T.mutedFg,
                  borderBottom: `2px solid ${tab === t.key ? T.primary : "transparent"}`,
                }}>
                {t.label}
                <span style={{
                  fontSize: T.xs, padding: "1px 7px", borderRadius: "999px",
                  backgroundColor: tab === t.key ? T.primary : T.secondary,
                  color: tab === t.key ? T.primaryFg : T.mutedFg,
                }}>{t.count}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Secondary filters */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Search */}
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 pointer-events-none"
              style={{ color: T.mutedFg }} />
            <Input placeholder="Tìm sự kiện..." value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8 h-9 w-full" style={{ fontSize: T.sm }} />
          </div>

          {/* Dropdown group */}
          <div className="flex items-center gap-2 shrink-0 flex-wrap">
            <Select value={statusF} onValueChange={setStatusF}>
              <SelectTrigger className="h-9 w-[168px] cursor-pointer" style={{ fontSize: T.sm }}>
                <SelectValue placeholder="Trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả trạng thái</SelectItem>
                <SelectItem value="draft">Bản nháp</SelectItem>
                <SelectItem value="published">Sắp diễn ra</SelectItem>
                <SelectItem value="live">Đang diễn ra</SelectItem>
                <SelectItem value="ended">Đã kết thúc</SelectItem>
                <SelectItem value="cancelled">Đã hủy</SelectItem>
              </SelectContent>
            </Select>
            <Select value={timeF} onValueChange={setTimeF}>
              <SelectTrigger className="h-9 w-[160px] cursor-pointer" style={{ fontSize: T.sm }}>
                <SelectValue placeholder="Thời gian" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả thời gian</SelectItem>
                <SelectItem value="week">Tuần này</SelectItem>
                <SelectItem value="month">Tháng này</SelectItem>
                <SelectItem value="3months">3 tháng tới</SelectItem>
                <SelectItem value="custom">Tùy chỉnh</SelectItem>
              </SelectContent>
            </Select>
            <Select value={formatF} onValueChange={setFormatF}>
              <SelectTrigger className="h-9 w-[136px] cursor-pointer" style={{ fontSize: T.sm }}>
                <SelectValue placeholder="Hình thức" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                <SelectItem value="offline">Offline</SelectItem>
                <SelectItem value="online">Online</SelectItem>
              </SelectContent>
            </Select>
            {hasFilters && (
              <button onClick={() => { setSearch(""); setStatusF("all"); setTimeF("all"); setFormatF("all"); }}
                style={{ display: "flex", alignItems: "center", gap: 4, height: 36, padding: "0 10px",
                  borderRadius: 8, fontSize: T.xs, color: T.mutedFg, border: `1px solid ${T.border}`,
                  background: "none", cursor: "pointer", whiteSpace: "nowrap" }}>
                <X className="size-3" /> Xóa bộ lọc
              </button>
            )}
          </div>
        </div>

        {/* Quick stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <StatCard icon={<Calendar className="size-4" />}    label="Tổng sự kiện"
            value={String(MOCK_EVENTS.length)} sub="Trong workspace" />
          <StatCard icon={<Clock className="size-4" />}       label="Sắp diễn ra"
            value={String(MOCK_EVENTS.filter(e => e.status === "published").length)} sub="Trong 30 ngày tới"
            iconBg="rgba(30,170,255,0.08)" iconColor={T.primary} />
          <StatCard icon={<Radio className="size-4" />}       label="Đang diễn ra"
            value={String(MOCK_EVENTS.filter(e => e.status === "live").length)}
            iconBg="rgba(239,68,68,0.08)" iconColor="#dc2626" />
          <StatCard icon={<AlertCircle className="size-4" />} label="Bản nháp cần xử lý"
            value={String(MOCK_EVENTS.filter(e => e.status === "draft").length)}
            iconBg={T.warningSubtle} iconColor={T.warningText} />
        </div>

        {/* Event list or empty state */}
        {events.length === 0 ? (
          <EmptyState tab={tab} />
        ) : (
          <div className="rounded-2xl overflow-hidden"
            style={{ backgroundColor: T.background, border: `1px solid ${T.border}` }}>
            <div className="px-5 py-4" style={{ borderBottom: `1px solid ${T.border}` }}>
              <h3 style={{ fontSize: T.base, fontWeight: T.fw_semi, color: T.foreground }}>
                Danh sách sự kiện
              </h3>
              <p style={{ fontSize: T.xs, color: T.mutedFg, marginTop: 2 }}>
                {events.length} sự kiện{hasFilters ? " phù hợp với bộ lọc" : ""}
              </p>
            </div>
            <div style={{ overflowX: "auto" }}>
              <table className="w-full" style={{ borderCollapse: "collapse", minWidth: 640 }}>
                <thead>
                  <tr style={{ backgroundColor: T.secondary }}>
                    {["Sự kiện", ...(tab !== "mine" ? ["Vai trò"] : []), "Trạng thái", "Đăng ký", "Check-in", "Thao tác"].map((h) => (
                      <th key={h} style={{ padding: "10px 16px", textAlign: "left",
                        fontSize: T.xs, fontWeight: T.fw_medium, color: T.mutedFg, whiteSpace: "nowrap" }}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {events.map((e) => (
                    <tr key={e.id} style={{ borderTop: `1px solid ${T.border}`, cursor: "default" }}
                      onMouseEnter={(el) => (el.currentTarget.style.backgroundColor = T.secondary)}
                      onMouseLeave={(el) => (el.currentTarget.style.backgroundColor = "transparent")}>
                      <td style={{ padding: "12px 16px", minWidth: 200 }}>
                        <p style={{ fontSize: T.sm, fontWeight: T.fw_medium, color: T.foreground, marginBottom: 2 }}>
                          {e.name}
                        </p>
                        <p style={{ fontSize: T.xs, color: T.mutedFg, display: "flex", alignItems: "center", gap: 4 }}>
                          <Calendar className="size-3" /> {e.startDate}
                          <span style={{ margin: "0 1px" }}>·</span>
                          {FORMAT_CFG[e.format].icon} {FORMAT_CFG[e.format].label}
                        </p>
                      </td>
                      {tab !== "mine" && (
                        <td style={{ padding: "12px 16px" }}>
                          <span style={{ fontSize: T.xs, padding: "2px 8px", borderRadius: "999px",
                            backgroundColor: T.secondary, color: T.mutedFg, whiteSpace: "nowrap",
                            border: `1px solid ${T.border}` }}>
                            Nhân viên sự kiện
                          </span>
                        </td>
                      )}
                      <td style={{ padding: "12px 16px" }}><StatusBadge status={e.status} /></td>
                      <td style={{ padding: "12px 16px" }}>
                        <span style={{ fontSize: T.sm, color: T.foreground }}>
                          {e.registrants > 0 ? e.registrants.toLocaleString() : "—"}
                        </span>
                      </td>
                      <td style={{ padding: "12px 16px" }}>
                        <span style={{ fontSize: T.sm, color: T.foreground }}>
                          {e.checkins > 0 ? e.checkins.toLocaleString() : "—"}
                        </span>
                      </td>
                      <td style={{ padding: "12px 16px" }}>
                        <Button size="sm" variant="outline">
                          <ExternalLink className="size-3" /> Chi tiết
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* RIGHT — Hoạt động gần đây (luôn hiển thị) */}
      <div className="flex flex-col gap-5">
        <div className="rounded-2xl p-5"
          style={{ backgroundColor: T.background, border: `1px solid ${T.border}` }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
            <Activity className="size-4 shrink-0" style={{ color: T.primary }} />
            <h3 style={{ fontSize: T.base, fontWeight: T.fw_semi, color: T.foreground }}>
              Hoạt động gần đây
            </h3>
          </div>
          {ACTIVITY_LOG.map((log, i) => (
            <div key={i} style={{
              display: "flex", alignItems: "flex-start", gap: 10, padding: "10px 0",
              borderBottom: i < ACTIVITY_LOG.length - 1 ? `1px solid ${T.border}` : "none",
            }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", marginTop: 6, flexShrink: 0,
                backgroundColor: T.primary }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: T.xs, color: T.foreground, lineHeight: 1.5 }}>
                  <span style={{ fontWeight: T.fw_medium }}>{log.actor}</span>
                  {" "}{log.action}{" "}
                  <span style={{ fontWeight: T.fw_medium }}>{log.target}</span>
                </p>
                <p style={{ fontSize: T.xs, color: T.mutedFg, marginTop: 2 }}>{log.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

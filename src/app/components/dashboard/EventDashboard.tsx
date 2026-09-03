import * as React from "react";
import { useState } from "react";
import {
  Users, Ticket, DollarSign, UserCheck, Globe,
  AlertCircle, ChevronRight, ExternalLink,
  Calendar, MapPin, Pencil, BarChart3, Mail, QrCode, Plus,
  Download, Eye, Settings, Copy, Facebook, Twitter, Linkedin, MessageCircle, Image
} from "lucide-react";
import { Button } from "../ui/button";

// ── Tokens ───────────────────────────────────────────────────────────────────

const T = {
  background:    "var(--background)",
  foreground:    "var(--foreground)",
  border:        "var(--border)",
  primary:       "var(--primary)",
  primaryFg:     "var(--primary-foreground)",
  secondary:     "var(--secondary)",
  muted:         "var(--muted)",
  mutedFg:       "var(--muted-foreground)",
  destructive:   "var(--destructive)",
  successSubtle: "var(--success-subtle)",
  successBorder: "var(--success-border)",
  successText:   "var(--success-text)",
  warningSubtle: "var(--warning-subtle)",
  warningBorder: "var(--warning-border)",
  warningText:   "var(--warning-text)",
  pageSurface:   "var(--page-surface)",
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

type EventStatus = "draft" | "published" | "live" | "ended";

// ── Mock data ─────────────────────────────────────────────────────────────────

export const REG_DATA = [
  { day: "18/7", reg: 0   }, { day: "19/7", reg: 4   }, { day: "20/7", reg: 11  },
  { day: "21/7", reg: 18  }, { day: "22/7", reg: 27  }, { day: "23/7", reg: 42  },
  { day: "24/7", reg: 58  }, { day: "25/7", reg: 74  }, { day: "26/7", reg: 93  },
  { day: "27/7", reg: 118 }, { day: "28/7", reg: 152 }, { day: "29/7", reg: 198 },
  { day: "30/7", reg: 247 }, { day: "31/7", reg: 328 },
];

export const CHECKIN_DATA = [
  { time: "08:00", count: 0  }, { time: "08:30", count: 12 },
  { time: "09:00", count: 45 }, { time: "09:30", count: 89 },
  { time: "10:00", count: 118}, { time: "10:30", count: 134},
  { time: "11:00", count: 139}, { time: "11:30", count: 142},
];

const TICKET_TIERS = [
  { name: "Vé tiêu chuẩn", sold: 228, total: 300, revenue: 0,        color: T.primary },
  { name: "Vé VIP",         sold: 100, total: 120, revenue: 45000000, color: "#f59e0b" },
];

const RECENT_ATTENDEES = [
  { name: "Nguyễn Thị Hoa",  email: "hoa.ngu***@gmail.com",  ticket: "Vé tiêu chuẩn", status: "registered", time: "2 phút trước"  },
  { name: "Trần Minh Tú",     email: "tu.tra***@gmail.com",   ticket: "Vé VIP",         status: "registered", time: "8 phút trước"  },
  { name: "Lê Văn Đức",       email: "duc.le***@company.vn",  ticket: "Vé tiêu chuẩn", status: "checkin",    time: "14 phút trước" },
  { name: "Phạm Thu Hà",      email: "ha.pha***@gmail.com",   ticket: "Vé tiêu chuẩn", status: "registered", time: "21 phút trước" },
  { name: "Hoàng Quốc Bảo",  email: "bao.hoa***@firm.vn",    ticket: "Vé VIP",         status: "checkin",    time: "35 phút trước" },
];

// ── Helpers ───────────────────────────────────────────────────────────────────

function fmtCurrency(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(0)}M ₫`;
  if (n >= 1_000)     return `${(n / 1_000).toFixed(0)}K ₫`;
  return `${n} ₫`;
}

// ── Stat Card ─────────────────────────────────────────────────────────────────

export function StatCard({ icon, label, value, sub, iconBg, iconColor, isEmpty }: {
  icon: React.ReactNode; label: string; value: string;
  sub?: string; iconBg?: string; iconColor?: string; isEmpty?: boolean;
}) {
  return (
    <div className="rounded-2xl p-4 flex flex-col gap-3"
      style={{ backgroundColor: T.background, border: `1px solid ${T.border}` }}>
      <div className="size-9 rounded-xl flex items-center justify-center"
        style={{ backgroundColor: iconBg ?? "rgba(30,170,255,0.08)", color: iconColor ?? T.primary }}>
        {icon}
      </div>
      {isEmpty ? (
        <div>
          <p style={{ fontSize: T.xs, color: T.mutedFg, marginBottom: 4 }}>{label}</p>
          <p style={{ fontSize: T.lg, fontWeight: T.fw_semi, color: T.mutedFg }}>—</p>
          <p style={{ fontSize: T.xs, color: T.mutedFg, marginTop: 2 }}>Chưa có dữ liệu</p>
        </div>
      ) : (
        <div>
          <p style={{ fontSize: T.xs, color: T.mutedFg, marginBottom: 4 }}>{label}</p>
          <p style={{ fontSize: T.xl, fontWeight: T.fw_bold, color: T.foreground }}>{value}</p>
          {sub && <p style={{ fontSize: T.xs, color: T.mutedFg, marginTop: 2 }}>{sub}</p>}
        </div>
      )}
    </div>
  );
}

// ── Checklist Item ────────────────────────────────────────────────────────────

// ── Module Card ───────────────────────────────────────────────────────────────


// ── Custom SVG Area Chart ─────────────────────────────────────────────────────

export function SimpleAreaChart({ data, xKey, yKey, color, xInterval = 2 }: {
  data: Record<string, number | string>[];
  xKey: string; yKey: string; color: string; xInterval?: number;
}) {
  const VW = 560; const VH = 180;
  const PAD = { t: 10, r: 8, b: 28, l: 38 };
  const iW = VW - PAD.l - PAD.r;
  const iH = VH - PAD.t - PAD.b;

  const values = data.map(d => Number(d[yKey]));
  const maxVal = Math.max(...values, 1);
  const yTicks = [0, 0.25, 0.5, 0.75, 1].map(f => Math.round(maxVal * f));

  const px = (i: number) => PAD.l + (data.length === 1 ? iW / 2 : (i / (data.length - 1)) * iW);
  const py = (v: number) => PAD.t + iH - (v / maxVal) * iH;
  const pts = data.map((d, i): [number, number] => [px(i), py(Number(d[yKey]))]);
  const linePath = pts.map(([x, y], i) => `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`).join(" ");
  const areaPath = `${linePath} L${pts[pts.length-1][0].toFixed(1)},${(PAD.t+iH).toFixed(1)} L${PAD.l},${(PAD.t+iH).toFixed(1)} Z`;

  return (
    <svg viewBox={`0 0 ${VW} ${VH}`} width="100%" height={VH} style={{ overflow: "visible", display: "block" }}>
      {yTicks.map((tick, i) => (
        <g key={`y-${i}`}>
          <line x1={PAD.l} y1={py(tick)} x2={PAD.l+iW} y2={py(tick)}
            stroke="var(--border)" strokeDasharray="3 3" strokeWidth={1} />
          <text x={PAD.l-5} y={py(tick)+4} textAnchor="end" fontSize={10} fill="var(--muted-foreground)">{tick}</text>
        </g>
      ))}
      <path d={areaPath} fill={color} fillOpacity={0.12} />
      <path d={linePath} fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
      {data.map((d, i) => {
        const show = i === 0 || i === data.length - 1 || i % xInterval === 0;
        return show ? (
          <text key={`x-${i}`} x={px(i)} y={VH-4} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">
            {d[xKey]}
          </text>
        ) : null;
      })}
      {pts.map(([x, y], i) => (
        <circle key={`dot-${i}`} cx={x} cy={y} r={2} fill={color} />
      ))}
    </svg>
  );
}

// ── Status config ─────────────────────────────────────────────────────────────

const STATUS_CFG: Record<EventStatus, {
  label: string; bg: string; color: string; border: string;
  ctaPrimary: string; ctaIcon: React.ReactNode; alertMsg?: string;
}> = {
  draft: {
    label: "Bản nháp",
    bg: T.warningSubtle, color: T.warningText, border: T.warningBorder,
    ctaPrimary: "Xuất bản sự kiện", ctaIcon: <Globe className="size-4" />,
    alertMsg: "Sự kiện chưa được xuất bản — người tham dự chưa thể đăng ký.",
  },
  published: {
    label: "Sắp diễn ra",
    bg: "rgba(30,170,255,0.1)", color: T.primary, border: "rgba(30,170,255,0.25)",
    ctaPrimary: "Xem trang sự kiện", ctaIcon: <ExternalLink className="size-4" />,
  },
  live: {
    label: "Đang diễn ra",
    bg: T.successSubtle, color: T.successText, border: T.successBorder,
    ctaPrimary: "Theo dõi check-in", ctaIcon: <UserCheck className="size-4" />,
  },
  ended: {
    label: "Đã kết thúc",
    bg: T.secondary, color: T.mutedFg, border: T.border,
    ctaPrimary: "Xuất báo cáo", ctaIcon: <Download className="size-4" />,
  },
};

// ── Main Component ────────────────────────────────────────────────────────────

export function EventDashboard() {
  const [status, setStatus] = useState<EventStatus>("published");
  const [chartTab, setChartTab] = useState<"reg" | "checkin">("reg");

  const cfg          = STATUS_CFG[status];
  const isDraft      = status === "draft";
  const isLive       = status === "live";
  const isEnded      = status === "ended";
  const hasData      = !isDraft;
  const totalReg     = hasData ? 328 : 0;
  const totalCheckin = (isLive || isEnded) ? 142 : 0;
  const totalRevenue = 45_000_000;

  return (
    <div className="flex flex-col gap-6">

      {/* Alert banner (draft) */}
      {cfg.alertMsg && (
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl"
          style={{ backgroundColor: T.warningSubtle, border: `1px solid ${T.warningBorder}` }}>
          <AlertCircle className="size-4 shrink-0" style={{ color: T.warningText }} />
          <p style={{ fontSize: T.sm, color: T.warningText, flex: 1 }}>{cfg.alertMsg}</p>
          <Button size="sm" style={{ whiteSpace: "nowrap" }}>
            {cfg.ctaIcon} {cfg.ctaPrimary}
          </Button>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 items-start">

        {/* LEFT column */}
        <div className="flex flex-col gap-5">

          {/* Event info card */}
          <div className="rounded-2xl overflow-hidden"
            style={{ backgroundColor: T.background, border: `1px solid ${T.border}` }}>
            <div className="grid grid-cols-1 sm:grid-cols-2">

              {/* ── LEFT: Cover image + share ── */}
              <div className="flex flex-col" style={{ borderRight: `1px solid ${T.border}` }}>

                {/* Cover image — fills card height */}
                <div style={{ position: "relative", flex: 1, minHeight: 260,
                  background: "linear-gradient(135deg, #0f172a 0%, #1e3a8a 55%, #3b82f6 100%)",
                  display: "flex", flexDirection: "column", padding: 12 }}>

                  {/* Top row: status badge + Thay đổi ảnh */}
                  <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", zIndex: 1 }}>
                    <span style={{ fontSize: T.xs, fontWeight: T.fw_semi, padding: "2px 8px", borderRadius: "999px",
                      backgroundColor: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}` }}>
                      {cfg.label}
                    </span>
                    <button style={{ display: "flex", alignItems: "center", gap: 5, fontSize: T.xs,
                      fontWeight: T.fw_medium, padding: "4px 10px", borderRadius: 10,
                      backgroundColor: "rgba(255,255,255,0.18)", backdropFilter: "blur(6px)",
                      border: "1px solid rgba(255,255,255,0.25)", color: "white", cursor: "pointer" }}>
                      <Image className="size-3" /> Thay đổi ảnh
                    </button>
                  </div>

                  <div style={{ flex: 1 }} />

                  {/* Slug pill — bottom of image */}
                  <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 12px",
                    borderRadius: 10, backgroundColor: "rgba(0,0,0,0.9)", backdropFilter: "blur(6px)",
                    border: "1px solid rgba(255,255,255,0.12)" }}>
                    <Globe className="size-3" style={{ color: "white", flexShrink: 0 }} />
                    <span style={{ fontSize: T.xs, color: "white", fontWeight: T.fw_medium,
                      overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", flex: 1 }}>
                      netevent.vn/demo-conference-2026
                    </span>
                    <button onClick={() => navigator.clipboard?.writeText("https://netevent.vn/demo-conference-2026").catch(() => {})}
                      style={{ display: "flex", alignItems: "center", background: "none", border: "none",
                        cursor: "pointer", padding: 0, flexShrink: 0, color: "rgba(255,255,255,0.7)" }}>
                      <Copy className="size-3" />
                    </button>
                  </div>
                </div>

                {/* Share row */}
                <div className="flex items-center gap-3 px-4 py-3">
                  <span style={{ fontSize: T.xs, color: T.mutedFg, whiteSpace: "nowrap" }}>Chia sẻ sự kiện</span>
                  <div className="flex items-center gap-2">
                    {[
                      { icon: Facebook,      color: "#1877f2" },
                      { icon: Twitter,       color: "#000000" },
                      { icon: Linkedin,      color: "#0a66c2" },
                      { icon: MessageCircle, color: T.mutedFg },
                    ].map(({ icon: Icon, color }, i) => (
                      <button key={i} style={{ width: 28, height: 28, borderRadius: "50%", border: `1px solid ${T.border}`,
                        backgroundColor: T.background, display: "flex", alignItems: "center", justifyContent: "center",
                        cursor: "pointer", color }}>
                        <Icon className="size-3.5" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* ── RIGHT: Management panel ── */}
              <div className="flex flex-col gap-5 p-5">
                <h3 style={{ fontSize: T.base, fontWeight: T.fw_semi, color: T.foreground, margin: 0 }}>
                  Khi nào & Ở đâu
                </h3>

                {/* Date block */}
                <div className="flex items-center gap-4">
                  <div style={{ width: 56, height: 56, borderRadius: 12, border: `1px solid ${T.border}`,
                    display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <span style={{ fontSize: "9px", color: T.primary, fontWeight: T.fw_bold,
                      textTransform: "uppercase", letterSpacing: "0.05em", lineHeight: 1 }}>THÁNG 8</span>
                    <span style={{ fontSize: T.xl, fontWeight: T.fw_bold, color: T.foreground, lineHeight: 1.1 }}>01</span>
                  </div>
                  <div>
                    <p style={{ fontSize: T.sm, fontWeight: T.fw_semi, color: T.foreground }}>Thứ Sáu, 01 tháng 8</p>
                    <p style={{ fontSize: T.xs, color: T.mutedFg }}>09:00 – 17:00 GMT+7</p>
                  </div>
                </div>

                {/* Location block */}
                <div>
                  <div className="flex items-start gap-4 mb-2">
                    <div style={{ width: 56, height: 56, borderRadius: 12, border: `1px solid ${T.border}`,
                      display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <MapPin className="size-5" style={{ color: T.mutedFg }} />
                    </div>
                    <div className="pt-1">
                      <p style={{ fontSize: T.sm, fontWeight: T.fw_semi, color: T.foreground,
                        display: "flex", alignItems: "center", gap: 4 }}>
                        NetSpace — Tòa nhà MIPEC
                        <ExternalLink className="size-3 shrink-0" style={{ color: T.mutedFg }} />
                      </p>
                      <p style={{ fontSize: T.xs, color: T.mutedFg, marginTop: 2 }}>
                        Tòa nhà MIPEC, Tây Sơn, Hà Nội
                      </p>
                    </div>
                  </div>
                  <p style={{ fontSize: T.xs, color: T.mutedFg }}>
                    Địa chỉ sẽ được hiển thị công khai trên trang sự kiện.
                  </p>
                </div>

                {/* Check-in và Chỉnh sửa nằm chung một hàng */}
                <div className="flex items-center gap-2 mt-auto">
                  <button style={{ flex: 1, minWidth: 0, padding: "10px 16px", borderRadius: 999,
                    border: `1px solid ${T.border}`, backgroundColor: "transparent", cursor: "pointer",
                    display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                    fontSize: T.sm, color: T.foreground, fontWeight: T.fw_medium,
                    whiteSpace: "nowrap", transition: "background 0.15s" }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = T.secondary; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = "transparent"; }}>
                    <QrCode className="size-4" /> Check-in người tham dự
                  </button>
                  <Button variant="outline" size="sm" className="shrink-0" style={{ fontSize: T.xs }}>
                    <Pencil className="size-3.5" /> Chỉnh sửa
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Ticket breakdown */}
          <div className="rounded-2xl p-5 sm:p-6"
            style={{ backgroundColor: T.background, border: `1px solid ${T.border}` }}>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 style={{ fontSize: T.base, fontWeight: T.fw_semi, color: T.foreground }}>
                  {isDraft ? "Kho vé / Form đăng ký" : "Vé và doanh thu"}
                </h3>
                <p style={{ fontSize: T.xs, color: T.mutedFg, marginTop: 2 }}>
                  {isDraft ? "Chưa cấu hình hình thức đăng ký" : "Tình hình bán vé theo hạng"}
                </p>
              </div>
              <Button size="sm" variant="outline"><Settings className="size-3.5" /> Quản lý</Button>
            </div>
            {isDraft ? (
              <div className="flex flex-col items-center justify-center py-8 rounded-xl"
                style={{ border: `1px dashed ${T.border}` }}>
                <Ticket className="size-10 mb-3" style={{ color: T.mutedFg, opacity: 0.4 }} />
                <p style={{ fontSize: T.sm, fontWeight: T.fw_medium, color: T.mutedFg }}>Chưa cấu hình hình thức đăng ký</p>
                <p style={{ fontSize: T.xs, color: T.mutedFg, marginTop: 4, marginBottom: 16 }}>
                  Thêm kho vé hoặc form đăng ký miễn phí để người tham dự có thể đăng ký.
                </p>
                <Button size="sm"><Plus className="size-3.5" /> Tạo kho vé</Button>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {TICKET_TIERS.map((tier) => {
                  const pct = Math.round(tier.sold / tier.total * 100);
                  return (
                    <div key={tier.name} className="rounded-xl p-4"
                      style={{ backgroundColor: T.secondary, border: `1px solid ${T.border}` }}>
                      <div className="flex items-center justify-between mb-2">
                        <p style={{ fontSize: T.sm, fontWeight: T.fw_medium, color: T.foreground }}>{tier.name}</p>
                        <div className="flex items-center gap-3">
                          <p style={{ fontSize: T.xs, color: T.mutedFg }}>{tier.sold}/{tier.total} vé</p>
                          {tier.revenue > 0
                            ? <p style={{ fontSize: T.sm, fontWeight: T.fw_semi, color: "#16a34a" }}>{fmtCurrency(tier.revenue)}</p>
                            : <span style={{ fontSize: T.xs, padding: "1px 8px", borderRadius: "999px",
                                backgroundColor: T.successSubtle, color: T.successText }}>Miễn phí</span>
                          }
                        </div>
                      </div>
                      <div className="rounded-full overflow-hidden" style={{ height: 6, backgroundColor: T.border }}>
                        <div className="h-full rounded-full transition-all"
                          style={{ width: `${pct}%`, backgroundColor: tier.revenue > 0 ? "#f59e0b" : T.primary }} />
                      </div>
                      <p style={{ fontSize: T.xs, color: T.mutedFg, marginTop: 6 }}>
                        {pct}% đã bán · Còn {tier.total - tier.sold} chỗ trống
                      </p>
                    </div>
                  );
                })}
                <div className="flex items-center justify-between px-4 py-3 rounded-xl"
                  style={{ backgroundColor: "rgba(22,163,74,0.06)", border: "1px solid rgba(22,163,74,0.15)" }}>
                  <p style={{ fontSize: T.sm, fontWeight: T.fw_medium, color: T.foreground }}>Tổng doanh thu</p>
                  <p style={{ fontSize: T.base, fontWeight: T.fw_bold, color: "#16a34a" }}>{fmtCurrency(totalRevenue)}</p>
                </div>
              </div>
            )}
          </div>

          {/* Recent attendees */}
          <div className="rounded-2xl overflow-hidden"
            style={{ backgroundColor: T.background, border: `1px solid ${T.border}` }}>
            <div className="flex items-center justify-between p-5 sm:p-6 pb-4">
              <div>
                <h3 style={{ fontSize: T.base, fontWeight: T.fw_semi, color: T.foreground }}>Người tham dự mới nhất</h3>
                <p style={{ fontSize: T.xs, color: T.mutedFg, marginTop: 2 }}>Đăng ký gần đây nhất</p>
              </div>
              <Button size="sm" variant="outline"><Eye className="size-3.5" /> Xem tất cả</Button>
            </div>
            {!hasData ? (
              <div className="flex flex-col items-center justify-center py-12 m-5">
                <Users className="size-10 mb-3" style={{ color: T.mutedFg, opacity: 0.4 }} />
                <p style={{ fontSize: T.sm, color: T.mutedFg }}>Chưa có người đăng ký</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full" style={{ borderCollapse: "collapse", minWidth: 560 }}>
                  <thead>
                    <tr style={{ backgroundColor: T.secondary }}>
                      {["Họ tên", "Hạng vé", "Trạng thái", "Thời gian"].map((h) => (
                        <th key={h} style={{ padding: "10px 16px", textAlign: "left", fontSize: T.xs,
                          fontWeight: T.fw_medium, color: T.mutedFg, whiteSpace: "nowrap" }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {RECENT_ATTENDEES.map((a, i) => (
                      <tr key={i} style={{ borderTop: `1px solid ${T.border}` }}>
                        <td style={{ padding: "12px 16px" }}>
                          <p style={{ fontSize: T.sm, fontWeight: T.fw_medium, color: T.foreground }}>{a.name}</p>
                          <p style={{ fontSize: T.xs, color: T.mutedFg }}>{a.email}</p>
                        </td>
                        <td style={{ padding: "12px 16px" }}>
                          <span style={{ fontSize: T.xs, padding: "2px 8px", borderRadius: "999px",
                            backgroundColor: "rgba(30,170,255,0.08)", color: T.primary }}>{a.ticket}</span>
                        </td>
                        <td style={{ padding: "12px 16px" }}>
                          <span style={{ fontSize: T.xs, padding: "2px 8px", borderRadius: "999px",
                            backgroundColor: a.status === "checkin" ? T.successSubtle : T.secondary,
                            color: a.status === "checkin" ? T.successText : T.mutedFg }}>
                            {a.status === "checkin" ? "Đã check-in" : "Đã đăng ký"}
                          </span>
                        </td>
                        <td style={{ padding: "12px 16px" }}>
                          <p style={{ fontSize: T.xs, color: T.mutedFg, whiteSpace: "nowrap" }}>{a.time}</p>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>{/* end LEFT column */}

      </div>
    </div>
  );
}

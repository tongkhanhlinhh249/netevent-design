import * as React from "react";
import { useState } from "react";
import {
  Search, Download, Mail, UserPlus, Eye, UserCheck, Copy,
  ExternalLink, QrCode, Clock, CheckCircle2, XCircle, AlertCircle,
  ChevronDown, X, UserX, Filter
} from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "../ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";

// ── CSS tokens ────────────────────────────────────────────────────────────────

const T = {
  background:    "var(--background)",
  foreground:    "var(--foreground)",
  border:        "var(--border)",
  primary:       "var(--primary)",
  primaryFg:     "var(--primary-foreground)",
  secondary:     "var(--secondary)",
  mutedFg:       "var(--muted-foreground)",
  destructive:   "var(--destructive)",
  successSubtle: "var(--success-subtle)",
  successBorder: "var(--success-border)",
  successText:   "var(--success-text)",
  warningSubtle: "var(--warning-subtle)",
  warningText:   "var(--warning-text)",
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

type AttendeeStatus = "valid" | "checked-in" | "cancelled" | "invalid";

interface Attendee {
  id: string; name: string; email: string; phone: string;
  tier: string; price: string; ticketCode: string;
  status: AttendeeStatus; checkedIn: boolean;
  checkinTime?: string; registeredAt: string;
  company?: string; title?: string;
}

interface EventDraft { id: string; name: string; status: string; [k: string]: any; }

// ── Mock data ─────────────────────────────────────────────────────────────────

const MOCK_ATTENDEES: Attendee[] = [
  { id: "a1", name: "Nguyễn Văn A",  email: "nguyenvana@gmail.com", phone: "098xxxxxxx", tier: "VIP",        price: "499.000đ", ticketCode: "VIP-000124", status: "valid",      checkedIn: false, registeredAt: "30/06/2026 09:30", company: "Công ty ABC",    title: "CTO" },
  { id: "a2", name: "Trần Minh B",   email: "tranminhb@gmail.com",  phone: "097xxxxxxx", tier: "Standard",   price: "Miễn phí", ticketCode: "STD-000087", status: "checked-in", checkedIn: true,  registeredAt: "30/06/2026 10:15", checkinTime: "08:45, 01/07/2026", company: "Startup XYZ", title: "Developer" },
  { id: "a3", name: "Lê Hoàng C",   email: "lehoangc@gmail.com",   phone: "096xxxxxxx", tier: "Early Bird", price: "299.000đ", ticketCode: "EB-000045",  status: "valid",      checkedIn: false, registeredAt: "29/06/2026 16:20" },
  { id: "a4", name: "Phạm Thị D",   email: "phamthid@gmail.com",   phone: "095xxxxxxx", tier: "VIP",        price: "499.000đ", ticketCode: "VIP-000125", status: "checked-in", checkedIn: true,  registeredAt: "29/06/2026 14:00", checkinTime: "09:05, 01/07/2026" },
  { id: "a5", name: "Vũ Hoàng E",   email: "vuhoange@gmail.com",   phone: "094xxxxxxx", tier: "Standard",   price: "Miễn phí", ticketCode: "STD-000088", status: "valid",      checkedIn: false, registeredAt: "28/06/2026 11:30" },
  { id: "a6", name: "Bùi Thị F",    email: "buithif@gmail.com",    phone: "093xxxxxxx", tier: "Early Bird", price: "299.000đ", ticketCode: "EB-000046",  status: "cancelled",  checkedIn: false, registeredAt: "27/06/2026 09:00" },
  { id: "a7", name: "Hoàng Văn G",  email: "hoangvang@gmail.com",  phone: "092xxxxxxx", tier: "Standard",   price: "Miễn phí", ticketCode: "STD-000089", status: "checked-in", checkedIn: true,  registeredAt: "27/06/2026 08:00", checkinTime: "09:15, 01/07/2026" },
  { id: "a8", name: "Ngô Thị H",    email: "ngothih@gmail.com",    phone: "091xxxxxxx", tier: "VIP",        price: "499.000đ", ticketCode: "VIP-000126", status: "valid",      checkedIn: false, registeredAt: "26/06/2026 17:45", company: "ACME Corp", title: "CEO" },
];

const TIER_BREAKDOWN = [
  { tier: "Standard",   price: "Miễn phí", registered: 180, checkedIn: 80,  remaining: 120 },
  { tier: "VIP",        price: "499.000đ", registered: 72,  checkedIn: 45,  remaining: 28  },
  { tier: "Early Bird", price: "299.000đ", registered: 76,  checkedIn: 13,  remaining: 74  },
];

// ── Status badge ──────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: AttendeeStatus }) {
  const cfg: Record<AttendeeStatus, { label: string; bg: string; color: string }> = {
    valid:        { label: "Hợp lệ",       bg: T.successSubtle,         color: T.successText },
    "checked-in": { label: "Đã check-in",  bg: `rgba(30,170,255,0.1)`,  color: T.primary },
    cancelled:    { label: "Đã hủy",       bg: `rgba(248,104,128,0.1)`, color: "#f86880" },
    invalid:      { label: "Không hợp lệ", bg: `rgba(248,104,128,0.1)`, color: "#f86880" },
  };
  const c = cfg[status];
  return (
    <span style={{
      backgroundColor: c.bg, color: c.color,
      fontSize: T.xs, fontWeight: T.fw_medium,
      padding: "2px 8px", borderRadius: "999px", whiteSpace: "nowrap" as const,
      display: "inline-flex", alignItems: "center",
    }}>{c.label}</span>
  );
}

// ── Attendee Detail Drawer ────────────────────────────────────────────────────

function AttendeeDetailDrawer({ attendee, open, onClose, onCheckin }: {
  attendee: Attendee | null; open: boolean; onClose: () => void; onCheckin: (id: string) => void;
}) {
  if (!attendee) return null;

  const sections: { label: string; rows: { label: string; value: string }[] }[] = [
    {
      label: "Thông tin cá nhân",
      rows: [
        { label: "Họ và tên", value: attendee.name },
        { label: "Email", value: attendee.email },
        { label: "Số điện thoại", value: attendee.phone },
        { label: "Công ty / Tổ chức", value: attendee.company || "—" },
        { label: "Chức danh", value: attendee.title || "—" },
      ],
    },
    {
      label: "Thông tin vé",
      rows: [
        { label: "Hạng vé", value: attendee.tier },
        { label: "Giá vé", value: attendee.price },
        { label: "Mã vé", value: attendee.ticketCode },
        { label: "Thời gian đăng ký", value: attendee.registeredAt },
      ],
    },
  ];

  const history = [
    { time: attendee.registeredAt, action: "Đăng ký thành công" },
    { time: attendee.registeredAt, action: "Gửi email xác nhận vé" },
    ...(attendee.checkedIn ? [{ time: attendee.checkinTime || "", action: "Check-in thành công" }] : []),
  ];

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent aria-describedby={undefined} className="w-[calc(100vw-32px)] sm:max-w-[480px] max-h-[90vh] overflow-y-auto p-0">
        <DialogHeader className="px-6 py-5" style={{ borderBottom: `1px solid ${T.border}` }}>
          <DialogTitle>Chi tiết người tham dự</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-5 p-6">
          {/* Avatar + name */}
          <div className="flex items-center gap-3">
            <div className="size-12 rounded-full flex items-center justify-center shrink-0"
              style={{ backgroundColor: `rgba(30,170,255,0.1)` }}>
              <span style={{ fontSize: T.lg, fontWeight: T.fw_bold, color: T.primary }}>
                {attendee.name.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <p style={{ fontSize: T.base, fontWeight: T.fw_semi, color: T.foreground }}>{attendee.name}</p>
              <p style={{ fontSize: T.xs, color: T.mutedFg }}>{attendee.email}</p>
            </div>
          </div>

          {/* Status + ticket code */}
          <div className="flex gap-3">
            <StatusBadge status={attendee.status} />
            <span style={{
              fontSize: T.xs, padding: "2px 8px", borderRadius: "999px",
              backgroundColor: T.secondary, color: T.mutedFg, border: `1px solid ${T.border}`,
              fontFamily: "monospace",
            }}>{attendee.ticketCode}</span>
          </div>

          {/* Info sections */}
          {sections.map((section) => (
            <div key={section.label}>
              <p style={{ fontSize: T.xs, fontWeight: T.fw_semi, color: T.mutedFg,
                textTransform: "uppercase" as const, letterSpacing: "0.05em", marginBottom: "10px" }}>
                {section.label}
              </p>
              <div className="flex flex-col gap-2.5">
                {section.rows.map((row) => (
                  <div key={row.label} className="flex items-start justify-between gap-4">
                    <span style={{ fontSize: T.xs, color: T.mutedFg, flexShrink: 0 }}>{row.label}</span>
                    <span style={{ fontSize: T.xs, fontWeight: T.fw_medium, color: T.foreground, textAlign: "right" as const }}>{row.value}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* QR placeholder */}
          <div>
            <p style={{ fontSize: T.xs, fontWeight: T.fw_semi, color: T.mutedFg,
              textTransform: "uppercase" as const, letterSpacing: "0.05em", marginBottom: "10px" }}>
              Mã QR vé
            </p>
            <div className="rounded-xl p-4 flex flex-col items-center gap-2"
              style={{ backgroundColor: T.secondary, border: `1px solid ${T.border}` }}>
              <div className="size-20 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: T.background, border: `1px solid ${T.border}` }}>
                <QrCode className="size-10" style={{ color: T.foreground }} />
              </div>
              <p style={{ fontSize: T.xs, color: T.mutedFg, fontFamily: "monospace" }}>{attendee.ticketCode}</p>
            </div>
          </div>

          {/* Check-in status */}
          <div>
            <p style={{ fontSize: T.xs, fontWeight: T.fw_semi, color: T.mutedFg,
              textTransform: "uppercase" as const, letterSpacing: "0.05em", marginBottom: "10px" }}>
              Check-in
            </p>
            {attendee.checkedIn ? (
              <div className="flex items-center gap-3 p-3 rounded-xl"
                style={{ backgroundColor: T.successSubtle, border: `1px solid ${T.successBorder}` }}>
                <CheckCircle2 className="size-5 shrink-0" style={{ color: T.successText }} />
                <div>
                  <p style={{ fontSize: T.sm, fontWeight: T.fw_medium, color: T.successText }}>Đã check-in</p>
                  {attendee.checkinTime && (
                    <p style={{ fontSize: T.xs, color: T.successText, opacity: 0.8 }}>{attendee.checkinTime}</p>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between p-3 rounded-xl"
                style={{ backgroundColor: T.secondary, border: `1px solid ${T.border}` }}>
                <div className="flex items-center gap-2">
                  <Clock className="size-4" style={{ color: T.mutedFg }} />
                  <span style={{ fontSize: T.sm, color: T.mutedFg }}>Chưa check-in</span>
                </div>
                {attendee.status === "valid" && (
                  <Button size="sm" onClick={() => { onCheckin(attendee.id); onClose(); }}>
                    <UserCheck className="size-3.5" /> Check-in
                  </Button>
                )}
              </div>
            )}
          </div>

          {/* History */}
          <div>
            <p style={{ fontSize: T.xs, fontWeight: T.fw_semi, color: T.mutedFg,
              textTransform: "uppercase" as const, letterSpacing: "0.05em", marginBottom: "10px" }}>
              Lịch sử thao tác
            </p>
            <div className="flex flex-col gap-2">
              {history.map((h, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="size-1.5 rounded-full mt-1.5 shrink-0" style={{ backgroundColor: T.primary }} />
                  <div>
                    <p style={{ fontSize: T.xs, fontWeight: T.fw_medium, color: T.foreground }}>{h.action}</p>
                    <p style={{ fontSize: T.xs, color: T.mutedFg }}>{h.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </DialogContent>
    </Dialog>
  );
}

// ── Main AttendeesTab ─────────────────────────────────────────────────────────

export function AttendeesTab({ event }: { event: EventDraft }) {
  const isDraft      = event.status === "draft";
  const isPublished  = !isDraft;
  const hasAttendees = isPublished; // demo: show data when published

  const [attendees, setAttendees]     = useState<Attendee[]>(hasAttendees ? MOCK_ATTENDEES : []);
  const [search, setSearch]           = useState("");
  const [filterTier, setFilterTier]   = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterCheckin, setFilterCheckin] = useState("all");
  const [quickFilter, setQuickFilter] = useState("all");
  const [selectedAttendee, setSelected] = useState<Attendee | null>(null);
  const [drawerOpen, setDrawerOpen]   = useState(false);
  const [activeTierFilter, setTierFilter] = useState<string | null>(null);

  const handleCheckin = (id: string) => {
    setAttendees((prev) => prev.map((a) => a.id === id
      ? { ...a, checkedIn: true, status: "checked-in" as AttendeeStatus, checkinTime: new Date().toLocaleString("vi-VN") }
      : a));
  };

  const filtered = attendees.filter((a) => {
    const q = search.toLowerCase();
    const matchSearch = !search || a.name.toLowerCase().includes(q) || a.email.toLowerCase().includes(q)
      || a.phone.includes(q) || a.ticketCode.toLowerCase().includes(q);
    const matchTier   = (filterTier === "all" && !activeTierFilter) || a.tier === filterTier || a.tier === activeTierFilter;
    const matchStatus = filterStatus === "all" || a.status === filterStatus;
    const matchCheckin = filterCheckin === "all" || (filterCheckin === "checked-in" ? a.checkedIn : !a.checkedIn);
    const matchQuick  = quickFilter === "all"
      || (quickFilter === "not-checkin" && !a.checkedIn)
      || (quickFilter === "checked-in" && a.checkedIn)
      || (quickFilter === "cancelled" && a.status === "cancelled");
    return matchSearch && matchTier && matchStatus && matchCheckin && matchQuick;
  });

  const stats = {
    total: attendees.length,
    issued: attendees.length,
    checkedIn: attendees.filter((a) => a.checkedIn).length,
    notCheckedIn: attendees.filter((a) => !a.checkedIn && a.status !== "cancelled").length,
    rate: attendees.length > 0 ? Math.round((attendees.filter((a) => a.checkedIn).length / attendees.length) * 100) : 0,
  };

  // ── State 1: Draft ────────────────────────────────────────────────────────

  if (isDraft) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center max-w-lg mx-auto">
        <div className="size-16 rounded-2xl flex items-center justify-center mb-5"
          style={{ backgroundColor: `rgba(30,170,255,0.08)` }}>
          <UserX className="size-8" style={{ color: T.mutedFg }} />
        </div>
        <h3 style={{ fontSize: T.xl, fontWeight: T.fw_semi, color: T.foreground, marginBottom: "8px" }}>
          Chưa có người tham dự
        </h3>
        <p style={{ fontSize: T.sm, color: T.mutedFg, lineHeight: 1.7, marginBottom: "20px" }}>
          Danh sách người tham dự sẽ xuất hiện sau khi sự kiện được Publish và có người đăng ký qua Landing Page.
        </p>
        <div className="w-full rounded-xl p-4 text-left mb-6"
          style={{ backgroundColor: T.secondary, border: `1px solid ${T.border}` }}>
          <p style={{ fontSize: T.xs, fontWeight: T.fw_semi, color: T.mutedFg, marginBottom: "10px" }}>
            Để nhận đăng ký, bạn cần hoàn tất:
          </p>
          {[
            "Tạo Landing Page",
            "Thiết lập Form đăng ký",
            "Cấu hình Kho vé (nếu có)",
            "Publish sự kiện",
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-2 py-1.5">
              <div className="size-4 rounded-full border-2 shrink-0" style={{ borderColor: T.border }} />
              <span style={{ fontSize: T.sm, color: T.mutedFg }}>{item}</span>
            </div>
          ))}
        </div>
        <div className="flex gap-3">
          <Button>Kiểm tra điều kiện Publish</Button>
          <Button variant="outline">Quay lại Tổng quan</Button>
        </div>
        <p style={{ fontSize: T.xs, color: T.mutedFg, marginTop: "12px", fontStyle: "italic" }}>
          Bản nháp chưa thể nhận đăng ký công khai.
        </p>
      </div>
    );
  }

  // ── State 2: Published, no registrations ─────────────────────────────────

  if (isPublished && attendees.length === 0) {
    return (
      <div className="flex flex-col gap-6">
        {/* Zero stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: "Tổng người đăng ký", value: "0" },
            { label: "Vé đã phát hành", value: "0" },
            { label: "Đã check-in", value: "0" },
            { label: "Chưa check-in", value: "0" },
          ].map((s) => (
            <div key={s.label} className="rounded-xl p-4"
              style={{ backgroundColor: T.background, border: `1px solid ${T.border}` }}>
              <p style={{ fontSize: T.xs, color: T.mutedFg }}>{s.label}</p>
              <p style={{ fontSize: T["2xl"], fontWeight: T.fw_semi, color: T.mutedFg }}>{s.value}</p>
            </div>
          ))}
        </div>

        <div className="flex flex-col items-center text-center py-12 max-w-md mx-auto">
          <div className="size-16 rounded-2xl flex items-center justify-center mb-5"
            style={{ backgroundColor: `rgba(30,170,255,0.08)` }}>
            <UserPlus className="size-8" style={{ color: T.primary }} />
          </div>
          <h3 style={{ fontSize: T.xl, fontWeight: T.fw_semi, color: T.foreground, marginBottom: "8px" }}>
            Chưa có người đăng ký
          </h3>
          <p style={{ fontSize: T.sm, color: T.mutedFg, lineHeight: 1.7, marginBottom: "20px" }}>
            Sự kiện đã được Publish. Chia sẻ Landing Page để bắt đầu nhận đăng ký.
          </p>
          <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl w-full mb-4"
            style={{ backgroundColor: T.secondary, border: `1px solid ${T.border}` }}>
            <span style={{ fontSize: T.xs, color: T.mutedFg, flex: 1, textAlign: "left" as const, fontFamily: "monospace" }}>
              netevent.vn/e/{(event.name || "su-kien").toLowerCase().replace(/\s+/g, "-").slice(0, 30)}
            </span>
            <span style={{ fontSize: T.xs, padding: "1px 6px", borderRadius: "999px",
              backgroundColor: T.successSubtle, color: T.successText }}>Đang public</span>
          </div>
          <div className="flex gap-3 flex-wrap justify-center">
            <Button onClick={() => navigator.clipboard?.writeText("netevent.vn/e/...")}>
              <Copy className="size-4" /> Sao chép link
            </Button>
            <Button variant="outline"><ExternalLink className="size-4" /> Xem Landing Page</Button>
            <Button variant="ghost"><Mail className="size-4" /> Gửi email mời</Button>
          </div>
        </div>
      </div>
    );
  }

  // ── State 3: Has attendees ────────────────────────────────────────────────

  return (
    <div className="flex flex-col gap-6">

      {/* Tier breakdown */}
      <div>
        <p style={{ fontSize: T.xs, fontWeight: T.fw_semi, color: T.mutedFg,
          textTransform: "uppercase" as const, letterSpacing: "0.05em", marginBottom: "10px" }}>
          Theo hạng vé
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {TIER_BREAKDOWN.map((t) => {
            const isActive = activeTierFilter === t.tier;
            return (
              <button key={t.tier}
                onClick={() => setTierFilter(isActive ? null : t.tier)}
                className="rounded-xl p-4 text-left transition-all cursor-pointer"
                style={{
                  backgroundColor: T.background,
                  border: isActive ? `2px solid ${T.primary}` : `1px solid ${T.border}`,
                }}>
                <div className="flex items-center justify-between mb-2">
                  <span style={{ fontSize: T.sm, fontWeight: T.fw_semi, color: T.foreground }}>{t.tier}</span>
                  <span style={{ fontSize: T.xs, color: T.mutedFg }}>{t.price}</span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-center">
                  {[
                    { l: "Đăng ký", v: t.registered },
                    { l: "Check-in", v: t.checkedIn },
                    { l: "Còn lại", v: t.remaining },
                  ].map((c) => (
                    <div key={c.l}>
                      <p style={{ fontSize: T.lg, fontWeight: T.fw_semi, color: T.primary }}>{c.v}</p>
                      <p style={{ fontSize: T.xs, color: T.mutedFg }}>{c.l}</p>
                    </div>
                  ))}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Quick filters + search */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="flex gap-1.5 flex-wrap">
            {[
              { id: "all", label: "Tất cả" },
              { id: "not-checkin", label: "Chưa check-in" },
              { id: "checked-in", label: "Đã check-in" },
            ].map((f) => (
              <button key={f.id} onClick={() => setQuickFilter(f.id)}
                className="px-3 py-1.5 rounded-full transition-all cursor-pointer"
                style={{
                  fontSize: T.xs, fontWeight: quickFilter === f.id ? T.fw_semi : T.fw_normal,
                  backgroundColor: quickFilter === f.id ? T.primary : T.secondary,
                  color: quickFilter === f.id ? T.primaryFg : T.mutedFg,
                  border: `1px solid ${quickFilter === f.id ? T.primary : T.border}`,
                }}>
                {f.label}
              </button>
            ))}
          </div>
          <Button size="sm" variant="outline" className="shrink-0">
            <Download className="size-3.5" /> Export CSV
          </Button>
        </div>

        <div className="flex gap-2 flex-col sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4" style={{ color: T.mutedFg }} />
            <input
              placeholder="Tìm theo tên, email, SĐT hoặc mã vé..."
              value={search} onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl pl-9 pr-3 py-2 outline-none"
              style={{ border: `1px solid ${T.border}`, backgroundColor: T.background, fontSize: T.sm, color: T.foreground }}
            />
          </div>
          <Select value={filterTier} onValueChange={setFilterTier}>
            <SelectTrigger className="w-full sm:w-36 cursor-pointer"><SelectValue placeholder="Tất cả hạng vé" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả hạng vé</SelectItem>
              <SelectItem value="Standard">Standard</SelectItem>
              <SelectItem value="VIP">VIP</SelectItem>
              <SelectItem value="Early Bird">Early Bird</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Attendee table */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <p style={{ fontSize: T.sm, fontWeight: T.fw_semi, color: T.foreground }}>
            Danh sách người tham dự
            <span style={{ fontSize: T.xs, color: T.mutedFg, marginLeft: "6px", fontWeight: T.fw_normal }}>
              ({filtered.length} người)
            </span>
          </p>
          {activeTierFilter && (
            <button onClick={() => setTierFilter(null)}
              className="flex items-center gap-1 hover:opacity-70 transition-opacity cursor-pointer"
              style={{ fontSize: T.xs, color: T.primary }}>
              <X className="size-3" /> Bỏ lọc: {activeTierFilter}
            </button>
          )}
        </div>
        <div className="rounded-xl overflow-hidden" style={{ border: `1px solid ${T.border}` }}>
          <Table>
            <TableHeader>
              <TableRow style={{ backgroundColor: T.secondary }}>
                <TableHead className="w-52 pl-5">Người tham dự</TableHead>
                <TableHead className="w-36">Số điện thoại</TableHead>
                <TableHead className="w-28">Hạng vé</TableHead>
                <TableHead className="w-32">Mã vé</TableHead>
                <TableHead className="w-32">Trạng thái</TableHead>
                <TableHead className="w-36">Thời gian đăng ký</TableHead>
                <TableHead className="w-10" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-12"
                    style={{ color: T.mutedFg, fontSize: T.sm }}>
                    Không tìm thấy người tham dự nào
                  </TableCell>
                </TableRow>
              ) : filtered.map((a) => (
                <TableRow key={a.id} className="hover:bg-[var(--secondary)] transition-colors cursor-pointer"
                  onClick={() => { setSelected(a); setDrawerOpen(true); }}>
                  <TableCell className="pl-5">
                    <div>
                      <p style={{ fontSize: T.sm, fontWeight: T.fw_medium, color: T.foreground }}>{a.name}</p>
                      <p style={{ fontSize: T.xs, color: T.mutedFg }}>{a.email}</p>
                    </div>
                  </TableCell>
                  <TableCell style={{ fontSize: T.sm, color: T.mutedFg }}>{a.phone}</TableCell>
                  <TableCell>
                    <span style={{ fontSize: T.xs, fontWeight: T.fw_medium, padding: "2px 8px", borderRadius: "999px",
                      backgroundColor: T.secondary, color: T.foreground, border: `1px solid ${T.border}` }}>
                      {a.tier}
                    </span>
                  </TableCell>
                  <TableCell style={{ fontSize: T.xs, fontFamily: "monospace", color: T.foreground }}>{a.ticketCode}</TableCell>
                  <TableCell>
                    {a.checkedIn ? (
                      <span className="flex items-center gap-1" style={{ fontSize: T.xs, fontWeight: T.fw_medium,
                        color: T.successText, backgroundColor: T.successSubtle,
                        padding: "2px 8px", borderRadius: "999px", display: "inline-flex" }}>
                        <CheckCircle2 className="size-3.5" /> Đã check-in
                      </span>
                    ) : (
                      <span style={{ fontSize: T.xs, fontWeight: T.fw_medium,
                        color: T.mutedFg, backgroundColor: T.secondary,
                        padding: "2px 8px", borderRadius: "999px", display: "inline-flex" }}>
                        Chưa check-in
                      </span>
                    )}
                  </TableCell>
                  <TableCell style={{ fontSize: T.xs, color: T.mutedFg }}>{a.registeredAt}</TableCell>
                  <TableCell className="w-10" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => { setSelected(a); setDrawerOpen(true); }}
                      className="flex items-center justify-center rounded-lg size-7 transition-all hover:opacity-70"
                      style={{ border: `1px solid ${T.border}`, backgroundColor: T.background, cursor: "pointer" }}>
                      <Eye className="size-3.5" style={{ color: T.mutedFg }} />
                    </button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Detail drawer */}
      <AttendeeDetailDrawer
        attendee={selectedAttendee}
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onCheckin={handleCheckin}
      />
    </div>
  );
}

import * as React from "react";
import { useState } from "react";
import {
  QrCode, Search, CheckCircle2, XCircle, Clock, AlertTriangle,
  LogOut, ChevronRight, UserCheck, UserX, ArrowLeft, Scan,
  CalendarDays, RefreshCcw, BadgeCheck
} from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { cn } from "../ui/utils";

type CheckinStatus = "valid" | "checked-in" | "checked-out" | "invalid" | "wrong-event" | "cancelled";

interface EventItem {
  id: string; name: string; date: string; venue: string;
  totalTickets: number; checkedIn: number; checkedOut: number;
}

interface Attendee {
  id: string; name: string; email: string; phone: string;
  ticketCode: string; ticketType: string; status: CheckinStatus;
  checkinTime?: string; checkoutTime?: string;
}

const MOCK_EVENTS: EventItem[] = [
  { id: "e1", name: "Hội thảo AI 2025", date: "15/07/2025 · 08:00 - 17:00", venue: "Trung tâm Hội nghị Quốc gia", totalTickets: 250, checkedIn: 182, checkedOut: 34 },
  { id: "e2", name: "Tech Summit 2025", date: "22/08/2025 · 09:00 - 18:00", venue: "GEM Center, TP.HCM", totalTickets: 150, checkedIn: 0, checkedOut: 0 },
];

const MOCK_ATTENDEES: Attendee[] = [
  { id: "a1", name: "Nguyễn Văn Bình", email: "binh@email.com", phone: "0901 234 567", ticketCode: "NE-2025-00142", ticketType: "VIP",      status: "valid" },
  { id: "a2", name: "Trần Thị Cúc",   email: "cuc@email.com",  phone: "0912 345 678", ticketCode: "NE-2025-00089", ticketType: "Standard", status: "checked-in",  checkinTime: "09:14" },
  { id: "a3", name: "Lê Minh Đức",    email: "duc@email.com",  phone: "0923 456 789", ticketCode: "NE-2025-00201", ticketType: "Standard", status: "checked-out", checkinTime: "08:45", checkoutTime: "14:30" },
  { id: "a4", name: "Phạm Thị Hoa",   email: "hoa@email.com",  phone: "0934 567 890", ticketCode: "NE-2025-00317", ticketType: "VIP",      status: "valid" },
  { id: "a5", name: "Vũ Quốc Hùng",   email: "hung@email.com", phone: "0945 678 901", ticketCode: "NE-2025-00005", ticketType: "Standard", status: "valid" },
  { id: "a6", name: "Bùi Thị Lan",    email: "lan@email.com",  phone: "0956 789 012", ticketCode: "NE-2025-INVALID", ticketType: "—",     status: "invalid" },
];

// ── CSS tokens ────────────────────────────────────────────────────────────────

const T = {
  pageSurface:   "var(--page-surface)",
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
  warningBorder: "var(--warning-border)",
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
};

// ── Status config ─────────────────────────────────────────────────────────────

interface StatusCfg { label: string; icon: React.ReactNode; color: string; bg: string; border: string; }

function getStatusCfg(status: CheckinStatus): StatusCfg {
  const cfg: Record<CheckinStatus, StatusCfg> = {
    valid:         { label: "Vé hợp lệ",       icon: <CheckCircle2 className="size-5" />, color: T.successText,   bg: T.successSubtle,                                          border: T.successBorder },
    "checked-in":  { label: "Đã check-in",      icon: <BadgeCheck className="size-5" />,   color: T.primary,       bg: `color-mix(in srgb, ${T.primary} 8%, transparent)`,       border: `color-mix(in srgb, ${T.primary} 25%, transparent)` },
    "checked-out": { label: "Đã check-out",      icon: <UserX className="size-5" />,        color: T.mutedFg,       bg: T.secondary,                                              border: T.border },
    invalid:       { label: "Vé không hợp lệ", icon: <XCircle className="size-5" />,      color: T.destructive,   bg: `color-mix(in srgb, ${T.destructive} 8%, transparent)`,  border: `color-mix(in srgb, ${T.destructive} 25%, transparent)` },
    "wrong-event": { label: "Sai sự kiện",      icon: <AlertTriangle className="size-5" />,color: T.warningText,   bg: T.warningSubtle,                                          border: T.warningBorder },
    cancelled:     { label: "Vé đã hủy",        icon: <XCircle className="size-5" />,      color: T.destructive,   bg: `color-mix(in srgb, ${T.destructive} 8%, transparent)`,  border: `color-mix(in srgb, ${T.destructive} 25%, transparent)` },
  };
  return cfg[status];
}

function StatusPill({ status }: { status: CheckinStatus }) {
  const c = getStatusCfg(status);
  return (
    <span style={{
      color: c.color, backgroundColor: c.bg, border: `1px solid ${c.border}`,
      fontSize: T.xs, fontWeight: T.fw_medium,
      padding: "2px 8px", borderRadius: "999px", display: "inline-flex", alignItems: "center",
    }}>{c.label}</span>
  );
}

// ── QR Scan Simulator ─────────────────────────────────────────────────────────

function QRScanSimulator({ onScan, onBack }: { onScan: (a: Attendee | null) => void; onBack: () => void }) {
  const [scanning, setScanning] = useState(false);
  const [idx, setIdx] = useState(0);
  const scanOrder = [MOCK_ATTENDEES[0], MOCK_ATTENDEES[1], MOCK_ATTENDEES[5], MOCK_ATTENDEES[2]];

  const handleScan = () => {
    setScanning(true);
    setTimeout(() => { onScan(scanOrder[idx % scanOrder.length]); setIdx((i) => i + 1); setScanning(false); }, 1000);
  };

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="relative w-full max-w-xs aspect-square rounded-2xl flex items-center justify-center overflow-hidden"
        style={{ backgroundColor: T.secondary, border: `2px dashed ${T.border}` }}>
        <div className="absolute inset-4 rounded-xl border-2 transition-colors"
          style={{ borderColor: scanning ? T.primary : T.border }} />

        {scanning ? (
          <div className="flex flex-col items-center gap-3">
            <div className="size-12 rounded-xl flex items-center justify-center animate-pulse"
              style={{ backgroundColor: `color-mix(in srgb, ${T.primary} 12%, transparent)` }}>
              <Scan className="size-6" style={{ color: T.primary }} />
            </div>
            <p style={{ color: T.mutedFg, fontSize: T.sm }}>Đang scan...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3 text-center px-4">
            <QrCode className="size-12" style={{ color: T.mutedFg }} />
            <p style={{ color: T.mutedFg, fontSize: T.sm }}>Đưa QR code vào khung để scan</p>
          </div>
        )}

        {/* Corner markers */}
        {([
          { t: "8px", l: "8px", bt: "none", bl: "none" },
          { t: "8px", r: "8px", bt: "none", br: "none" },
          { b: "8px", l: "8px", bb: "none", bl: "none" },
          { b: "8px", r: "8px", bb: "none", br: "none" },
        ] as React.CSSProperties[]).map((s, i) => (
          <div key={i} className="absolute size-5 border-2" style={{ ...s, borderColor: T.primary, borderRadius: "2px" }} />
        ))}
      </div>

      <div className="flex gap-3">
        <Button variant="outline" onClick={onBack}><ArrowLeft className="size-4" /> Quay lại</Button>
        <Button onClick={handleScan} disabled={scanning}>
          <QrCode className="size-4" /> {scanning ? "Đang scan..." : "Mô phỏng Scan QR"}
        </Button>
      </div>
      <p style={{ color: T.mutedFg, fontSize: T.xs }} className="text-center">
        Demo: bấm "Mô phỏng Scan QR" để thử các trạng thái vé khác nhau
      </p>
    </div>
  );
}

// ── Scan Result Card ──────────────────────────────────────────────────────────

function ScanResultCard({ attendee, onCheckin, onCheckout, onReset }:
  { attendee: Attendee; onCheckin: () => void; onCheckout: () => void; onReset: () => void }) {
  const c = getStatusCfg(attendee.status);
  return (
    <div className="rounded-2xl p-5 flex flex-col gap-4"
      style={{ backgroundColor: c.bg, border: `2px solid ${c.border}` }}>
      <div className="flex items-center gap-3">
        <div style={{ color: c.color }}>{c.icon}</div>
        <div>
          <p style={{ fontWeight: T.fw_semi, fontSize: T.base, color: c.color }}>{c.label}</p>
          <p style={{ fontSize: T.xs, color: T.mutedFg }}>Mã vé: {attendee.ticketCode}</p>
        </div>
      </div>

      <div className="flex items-center gap-3 p-3 rounded-xl"
        style={{ backgroundColor: T.background, border: `1px solid ${T.border}` }}>
        <Avatar className="size-10">
          <AvatarFallback style={{
            backgroundColor: `color-mix(in srgb, ${T.primary} 12%, transparent)`,
            color: T.primary, fontWeight: T.fw_semi, fontSize: T.sm,
          }}>
            {attendee.name.split(" ").slice(-1)[0][0]}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <p style={{ fontSize: T.sm, fontWeight: T.fw_medium, color: T.foreground }}>{attendee.name}</p>
          <p style={{ fontSize: T.xs, color: T.mutedFg }} className="truncate">{attendee.email}</p>
        </div>
        <span style={{
          fontSize: T.xs, fontWeight: T.fw_medium,
          backgroundColor: T.secondary, color: T.mutedFg,
          border: `1px solid ${T.border}`, borderRadius: "6px", padding: "2px 8px",
        }}>{attendee.ticketType}</span>
      </div>

      {(attendee.checkinTime || attendee.checkoutTime) && (
        <div className="flex gap-4">
          {attendee.checkinTime && (
            <div className="flex items-center gap-1.5" style={{ color: T.mutedFg, fontSize: T.xs }}>
              <Clock className="size-3.5" /> Check-in: {attendee.checkinTime}
            </div>
          )}
          {attendee.checkoutTime && (
            <div className="flex items-center gap-1.5" style={{ color: T.mutedFg, fontSize: T.xs }}>
              <Clock className="size-3.5" /> Check-out: {attendee.checkoutTime}
            </div>
          )}
        </div>
      )}

      <div className="flex gap-2">
        {attendee.status === "valid" && (
          <Button className="flex-1" onClick={onCheckin}><UserCheck className="size-4" /> Check-in</Button>
        )}
        {attendee.status === "checked-in" && (
          <Button variant="outline" className="flex-1" onClick={onCheckout}><UserX className="size-4" /> Check-out</Button>
        )}
        <Button variant="ghost" onClick={onReset}><RefreshCcw className="size-4" /> Scan tiếp</Button>
      </div>
    </div>
  );
}

// ── Manual Search ─────────────────────────────────────────────────────────────

function ManualSearchPanel({ attendees }: { attendees: Attendee[] }) {
  const [search, setSearch] = useState("");
  const [list, setList] = useState(attendees);

  const filtered = search.length > 0
    ? list.filter((a) =>
        a.name.toLowerCase().includes(search.toLowerCase()) ||
        a.email.toLowerCase().includes(search.toLowerCase()) ||
        a.phone.includes(search) ||
        a.ticketCode.toLowerCase().includes(search.toLowerCase()))
    : list;

  const handleCheckin = (id: string) =>
    setList((prev) => prev.map((a) => a.id === id
      ? { ...a, status: "checked-in" as CheckinStatus, checkinTime: new Date().toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" }) }
      : a));

  return (
    <div className="flex flex-col gap-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4" style={{ color: T.mutedFg }} />
        <Input placeholder="Tìm theo tên, email, SĐT, mã vé..." className="pl-9"
          value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>
      <div className="flex flex-col divide-y rounded-xl overflow-hidden"
        style={{ border: `1px solid ${T.border}`, backgroundColor: T.background, borderColor: T.border }}>
        {filtered.length === 0 ? (
          <div className="py-10 text-center" style={{ color: T.mutedFg, fontSize: T.sm }}>Không tìm thấy người tham dự</div>
        ) : filtered.map((a) => (
          <div key={a.id} className="flex items-center gap-3 p-3 hover:opacity-90 transition-opacity">
            <Avatar className="size-9 shrink-0">
              <AvatarFallback style={{
                backgroundColor: `color-mix(in srgb, ${T.primary} 12%, transparent)`,
                color: T.primary, fontSize: T.xs, fontWeight: T.fw_semi,
              }}>{a.name.split(" ").slice(-1)[0][0]}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p style={{ fontSize: T.sm, fontWeight: T.fw_medium, color: T.foreground }}>{a.name}</p>
              <p style={{ fontSize: T.xs, color: T.mutedFg }} className="truncate">{a.ticketCode} · {a.ticketType}</p>
            </div>
            <StatusPill status={a.status} />
            {a.status === "valid" && (
              <Button size="sm" onClick={() => handleCheckin(a.id)}>
                <UserCheck className="size-3.5" /> Check-in
              </Button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Event Selector ────────────────────────────────────────────────────────────

function EventSelector({ onSelect }: { onSelect: (e: EventItem) => void }) {
  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: T.pageSurface }}>
      <header className="px-4 py-3 flex items-center gap-3"
        style={{ backgroundColor: T.background, borderBottom: `1px solid ${T.border}` }}>
        <div className="size-7 rounded-lg flex items-center justify-center" style={{ backgroundColor: T.primary }}>
          <span style={{ color: T.primaryFg, fontWeight: T.fw_bold, fontSize: T.xs }}>N</span>
        </div>
        <div>
          <p style={{ fontSize: T.sm, fontWeight: T.fw_semi, color: T.foreground }}>NetEvent — Staff Portal</p>
          <p style={{ fontSize: T.xs, color: T.mutedFg }}>Chọn sự kiện để bắt đầu</p>
        </div>
      </header>

      <div className="flex-1 p-4 flex flex-col gap-3">
        <h3 style={{ color: T.foreground }} className="px-1">Sự kiện được phân công</h3>

        {MOCK_EVENTS.map((ev) => {
          const pct = ev.totalTickets > 0 ? Math.round((ev.checkedIn / ev.totalTickets) * 100) : 0;
          const notIn = ev.totalTickets - ev.checkedIn - ev.checkedOut;
          return (
            <button key={ev.id} onClick={() => onSelect(ev)}
              data-pill="off"
              className="w-full text-left rounded-2xl p-4 transition-all hover:shadow-md"
              style={{ backgroundColor: T.background, border: `1px solid ${T.border}` }}>
              <div className="flex items-start justify-between gap-3 mb-3">
                <div>
                  <p style={{ fontSize: T.base, fontWeight: T.fw_semi, color: T.foreground }}>{ev.name}</p>
                  <p style={{ fontSize: T.xs, color: T.mutedFg }} className="mt-0.5">
                    <CalendarDays className="inline size-3 mr-1" />{ev.date}
                  </p>
                  <p style={{ fontSize: T.xs, color: T.mutedFg }}>{ev.venue}</p>
                </div>
                <ChevronRight className="size-5 shrink-0 mt-1" style={{ color: T.mutedFg }} />
              </div>

              <div className="flex gap-2">
                {[
                  { label: "Tổng vé",    value: ev.totalTickets, color: T.foreground },
                  { label: "Đã check-in", value: ev.checkedIn,    color: T.primary },
                  { label: "Chưa vào",   value: notIn,            color: T.warningText },
                  { label: "Đã ra về",   value: ev.checkedOut,    color: T.mutedFg },
                ].map((s) => (
                  <div key={s.label} className="flex-1 rounded-lg py-2 text-center"
                    style={{ backgroundColor: T.secondary }}>
                    <p style={{ fontSize: T.lg, fontWeight: T.fw_semi, color: s.color }}>{s.value}</p>
                    <p style={{ fontSize: T.xs, color: T.mutedFg }}>{s.label}</p>
                  </div>
                ))}
              </div>

              <div className="mt-3">
                <div className="h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: T.secondary }}>
                  <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, backgroundColor: T.primary }} />
                </div>
                <p style={{ fontSize: T.xs, color: T.mutedFg }} className="mt-1">{pct}% đã check-in</p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ── Check-in Workspace ────────────────────────────────────────────────────────

function CheckinWorkspace({ event, onBack }: { event: EventItem; onBack: () => void }) {
  const [tab, setTab] = useState<"scan" | "manual">("scan");
  const [scannedAttendee, setScannedAttendee] = useState<Attendee | null>(null);
  const [stats, setStats] = useState({ checkedIn: event.checkedIn, checkedOut: event.checkedOut });

  const handleCheckin = () => {
    if (!scannedAttendee) return;
    setScannedAttendee({ ...scannedAttendee, status: "checked-in", checkinTime: new Date().toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" }) });
    setStats((s) => ({ ...s, checkedIn: s.checkedIn + 1 }));
  };
  const handleCheckout = () => {
    if (!scannedAttendee) return;
    setScannedAttendee({ ...scannedAttendee, status: "checked-out", checkoutTime: new Date().toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" }) });
    setStats((s) => ({ ...s, checkedOut: s.checkedOut + 1 }));
  };

  const notIn = event.totalTickets - stats.checkedIn - stats.checkedOut;
  const liveStats = [
    { label: "Tổng vé",    value: event.totalTickets, color: T.foreground },
    { label: "Đã vào",     value: stats.checkedIn,    color: T.primary },
    { label: "Chưa vào",   value: notIn,              color: T.warningText },
    { label: "Đã ra",      value: stats.checkedOut,   color: T.mutedFg },
  ];

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: T.pageSurface }}>
      <header style={{ backgroundColor: T.background, borderBottom: `1px solid ${T.border}` }} className="px-4 py-3">
        <div className="flex items-center gap-3 mb-3">
          <button onClick={onBack} className="transition-opacity hover:opacity-70" style={{ color: T.mutedFg }}>
            <ArrowLeft className="size-5" />
          </button>
          <div className="flex-1 min-w-0">
            <p style={{ fontSize: T.sm, fontWeight: T.fw_semi, color: T.foreground }} className="truncate">{event.name}</p>
            <p style={{ fontSize: T.xs, color: T.mutedFg }}>{event.date}</p>
          </div>
        </div>
        <div className="grid grid-cols-4 gap-2">
          {liveStats.map((s) => (
            <div key={s.label} className="rounded-xl p-2 text-center"
              style={{ backgroundColor: T.secondary, border: `1px solid ${T.border}` }}>
              <p style={{ fontSize: T.xl, fontWeight: T.fw_semi, color: s.color }}>{s.value}</p>
              <p style={{ fontSize: T.xs, color: T.mutedFg }}>{s.label}</p>
            </div>
          ))}
        </div>
      </header>

      <div className="flex" style={{ backgroundColor: T.background, borderBottom: `1px solid ${T.border}` }}>
        {([
          { id: "scan"   as const, label: "Scan QR",      icon: QrCode },
          { id: "manual" as const, label: "Tìm thủ công", icon: Search },
        ]).map((t) => (
          <button key={t.id}
            data-pill="off"
            onClick={() => { setTab(t.id); setScannedAttendee(null); }}
            className="flex-1 flex items-center justify-center gap-2 py-3 border-b-2 transition-colors"
            style={{
              fontSize: T.sm,
              borderBottomColor: tab === t.id ? T.primary : "transparent",
              color: tab === t.id ? T.primary : T.mutedFg,
            }}>
            <t.icon className="size-4" /> {t.label}
          </button>
        ))}
      </div>

      <div className="flex-1 p-4 overflow-auto">
        {tab === "scan" ? (
          scannedAttendee
            ? <ScanResultCard attendee={scannedAttendee} onCheckin={handleCheckin} onCheckout={handleCheckout} onReset={() => setScannedAttendee(null)} />
            : <QRScanSimulator onScan={setScannedAttendee} onBack={onBack} />
        ) : (
          <ManualSearchPanel attendees={MOCK_ATTENDEES} />
        )}
      </div>
    </div>
  );
}

// ── Staff Portal Root ─────────────────────────────────────────────────────────

export function StaffPortal({ onLogout }: { onLogout: () => void }) {
  const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null);

  return (
    <div className="relative min-h-screen">
      <button onClick={onLogout}
        className="absolute top-3.5 right-4 z-10 flex items-center gap-1 transition-opacity hover:opacity-70"
        style={{ fontSize: T.xs, color: T.mutedFg }}>
        <LogOut className="size-3.5" /> Đăng xuất
      </button>
      {selectedEvent
        ? <CheckinWorkspace event={selectedEvent} onBack={() => setSelectedEvent(null)} />
        : <EventSelector onSelect={setSelectedEvent} />}
    </div>
  );
}

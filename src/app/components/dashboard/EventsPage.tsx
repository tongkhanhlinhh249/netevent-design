import * as React from "react";
import { useState } from "react";
import { useNavigate } from "react-router";
import {
  Plus, Calendar, MapPin, Clock, Globe, Eye, ExternalLink, Copy,
  CheckCircle2, Circle, ChevronRight, ChevronLeft, ChevronDown, ArrowLeft,
  Image, Pencil, Share2, Users, FileText, Ticket, Mail, QrCode,
  BarChart3, Settings, X, Upload, ToggleLeft, ToggleRight,
  Sparkles, Link2, AlertCircle, Video, MoreHorizontal, Search,
  Radio, UserCheck, ClipboardList, Layers,
  Scan, UserX, BadgeCheck, AlertTriangle, RefreshCcw, Gamepad2
} from "lucide-react";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Switch } from "../ui/switch";
import { THEMES } from "../../data/themes";
import { useCurrentEvent } from "../../data/currentEvent";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter, SheetClose } from "../ui/sheet";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "../ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { cn } from "../ui/utils";
import { LandingPageTab } from "./LandingPage";
import { AttendeesTab } from "./AttendeesTab";
import { TicketInventoryTab } from "./TicketInventory";
import { MiniGameTab } from "./MiniGameTab";
import { EventCoverUpload, EventCoverLarge, EventCoverSmall } from "./EventCover";

// ── CSS variable tokens ───────────────────────────────────────────────────────

const T = {
  pageSurface:   "var(--page-surface)",
  pageBorder:    "var(--page-border)",
  background:    "var(--background)",
  foreground:    "var(--foreground)",
  border:        "var(--border)",
  primary:       "var(--primary)",
  primaryFg:     "var(--primary-foreground)",
  secondary:     "var(--secondary)",
  muted:         "var(--muted)",
  mutedFg:       "var(--muted-foreground)",
  destructive:   "var(--destructive)",
  accent:        "var(--accent)",
  accentFg:      "var(--accent-foreground)",
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

type EventFormat = "offline" | "online" | "hybrid";
type EventScreen = "list" | "create" | "workspace";
type WorkspaceTab = "overview" | "landing" | "form" | "tickets" | "attendees" | "email" | "checkin" | "minigame" | "reports" | "settings";
type EventStatus = "live" | "published" | "draft" | "ended" | "archived" | "cancelled";

interface TimelineEvent {
  id: string;
  name: string;
  status: EventStatus;
  startDate: string;   // "YYYY-MM-DD"
  startTime: string;   // "HH:MM"
  endTime: string;
  location: string;
  format: "offline" | "online";
  registrations: number;
  checkedIn: number;
  cover: string;       // CSS gradient string
  checklistDone: number;
  checklistTotal: number;
}

// ── Mock timeline events ──────────────────────────────────────────────────────

const MOCK_TIMELINE_EVENTS: TimelineEvent[] = [
  {
    id: "t1",
    name: "NetEvent Demo Conference 2026",
    status: "live",
    startDate: "2026-06-29",
    startTime: "16:00",
    endTime: "20:00",
    location: "NetSpace — Công ty Công nghệ & Truyền thông",
    format: "offline",
    registrations: 328,
    checkedIn: 138,
    cover: "linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%)",
    checklistDone: 6,
    checklistTotal: 6,
  },
  {
    id: "t2",
    name: "Sun Festival 2026",
    status: "published",
    startDate: "2026-07-01",
    startTime: "18:30",
    endTime: "23:00",
    location: "SECC, Quận 7, TP.HCM",
    format: "offline",
    registrations: 402,
    checkedIn: 0,
    cover: "linear-gradient(135deg, #7c2d12 0%, #f97316 100%)",
    checklistDone: 6,
    checklistTotal: 6,
  },
  {
    id: "t3",
    name: "Workshop Marketing Automation",
    status: "draft",
    startDate: "2026-07-12",
    startTime: "09:00",
    endTime: "12:00",
    location: "Online",
    format: "online",
    registrations: 0,
    checkedIn: 0,
    cover: "linear-gradient(135deg, #1eaaff 0%, #7c3aed 100%)",
    checklistDone: 2,
    checklistTotal: 6,
  },
  {
    id: "t4",
    name: "Masterise Pre-launch VIP",
    status: "ended",
    startDate: "2026-06-15",
    startTime: "09:00",
    endTime: "12:00",
    location: "TP.HCM",
    format: "offline",
    registrations: 250,
    checkedIn: 198,
    cover: "linear-gradient(135deg, #374151 0%, #6b7280 100%)",
    checklistDone: 6,
    checklistTotal: 6,
  },
  {
    id: "t5",
    name: "Product Summit Hà Nội — Tháng 6",
    status: "cancelled",
    startDate: "2026-06-20",
    startTime: "08:30",
    endTime: "17:00",
    location: "Hà Nội",
    format: "offline",
    registrations: 80,
    checkedIn: 0,
    cover: "linear-gradient(135deg, #7f1d1d 0%, #b91c1c 100%)",
    checklistDone: 3,
    checklistTotal: 6,
  },
];

// ── Timeline date helpers ─────────────────────────────────────────────────────

const TODAY = "2026-06-29";

function formatDateLabel(dateStr: string): { main: string; sub: string } {
  if (dateStr === TODAY) return { main: "Hôm nay", sub: "Thứ Hai" };
  const [y, m, d] = dateStr.split("-").map(Number);
  const days = ["Chủ Nhật", "Thứ Hai", "Thứ Ba", "Thứ Tư", "Thứ Năm", "Thứ Sáu", "Thứ Bảy"];
  const dow = new Date(y, m - 1, d).getDay();
  return { main: `${d} Thg ${m}`, sub: days[dow] };
}

function groupByDate(events: TimelineEvent[]): { date: string; events: TimelineEvent[] }[] {
  const map = new Map<string, TimelineEvent[]>();
  [...events].sort((a, b) => a.startDate.localeCompare(b.startDate)).forEach((ev) => {
    const list = map.get(ev.startDate) ?? [];
    list.push(ev);
    map.set(ev.startDate, list);
  });
  return Array.from(map.entries()).map(([date, events]) => ({ date, events }));
}

export interface EventDraft {
  id: string;
  name: string;
  description: string;
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
  format: EventFormat;
  location: string;
  theme: string;
  visibility: string;
  requireApproval: boolean;
  limitAttendees: boolean;
  maxAttendees: string;
  /** Giá vé cơ bản; chuỗi rỗng nghĩa là miễn phí. Hạng vé chi tiết nằm ở Kho vé. */
  ticketPrice: string;
  /** Ảnh nền trang sự kiện do người dùng tải lên (data URL); có thì phủ lên màu của theme. */
  pageImage?: string;
  status: "draft" | "published";
  cover: string;
}

// ── Theme gradient covers ─────────────────────────────────────────────────────

// Định nghĩa nằm ở data/themes.ts (LandingPage cũng dùng); re-export để các
// import sẵn có từ EventsPage không phải đổi.
export { THEMES } from "../../data/themes";

// ── Múi giờ hiển thị (lấy theo trình duyệt) ───────────────────────────────────

const TIMEZONE = (() => {
  const zone = Intl.DateTimeFormat().resolvedOptions().timeZone || "";
  const offset = -new Date().getTimezoneOffset();
  const sign = offset >= 0 ? "+" : "-";
  const hh = String(Math.floor(Math.abs(offset) / 60)).padStart(2, "0");
  const mm = String(Math.abs(offset) % 60).padStart(2, "0");
  return { label: `GMT${sign}${hh}:${mm}`, city: zone.split("/").pop()?.replace(/_/g, " ") ?? "" };
})();

// ── Checklist config ──────────────────────────────────────────────────────────

const CHECKLIST = [
  { id: "info",    label: "Thông tin sự kiện",    actionLabel: "Chỉnh sửa",          done: true,  subtext: "Tên sự kiện, thời gian, địa điểm và đơn vị tổ chức.",        status: "Đã hoàn tất",     disabled: false },
  { id: "landing", label: "Trang sự kiện",        actionLabel: "Tạo trang sự kiện",   done: false, subtext: "Tạo trang public, nội dung giới thiệu và form đăng ký.",      status: "Chưa tạo",        disabled: false },
  { id: "tickets", label: "Kho vé",               actionLabel: "Tạo kho vé",          done: false, subtext: "Thiết lập hạng vé, giá vé và số lượng vé phát hành.",         status: "Chưa cấu hình",   disabled: false },
  { id: "publish", label: "Xem trước",             actionLabel: "Xem trước trang",      done: false, subtext: "Xem lại trang sự kiện trước khi xuất bản.",                  status: "Chưa xem trước",  disabled: false },
];

const WORKSPACE_TABS: { id: WorkspaceTab; label: string; icon: React.FC<{ className?: string }> }[] = [
  { id: "overview",   label: "Tổng quan",      icon: BarChart3 },
  { id: "landing",    label: "Trang sự kiện",  icon: Globe },
  { id: "form",       label: "Form đăng ký",   icon: FileText },
  { id: "tickets",    label: "Kho vé",         icon: Ticket },
  { id: "attendees",  label: "Người tham dự",  icon: Users },
  { id: "email",      label: "Email",          icon: Mail },
  { id: "checkin",    label: "Check-in",       icon: QrCode },
  { id: "minigame",   label: "Mini Game",      icon: Gamepad2 },
  { id: "reports",    label: "Báo cáo",        icon: BarChart3 },
  { id: "settings",   label: "Cài đặt",        icon: Settings },
];

// ── Shared helpers ────────────────────────────────────────────────────────────

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <p style={{ fontSize: T.xs, fontWeight: T.fw_semi, color: T.mutedFg, letterSpacing: "0.05em", textTransform: "uppercase" as const, marginBottom: "12px" }}>{children}</p>;
}

function Card({ children, className, style }: { children: React.ReactNode; className?: string; style?: React.CSSProperties }) {
  return (
    <div className={cn("rounded-2xl p-5", className)}
      style={{ backgroundColor: T.background, border: `1px solid ${T.border}`, ...style }}>
      {children}
    </div>
  );
}

// ── SCREEN 1 — Events List / Empty State ──────────────────────────────────────

function EventListTab({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick}
      data-pill="off"
      className="pb-3 transition-colors cursor-pointer"
      style={{
        fontSize: T.sm, fontWeight: active ? T.fw_semi : T.fw_normal,
        borderBottom: active ? `2px solid ${T.primary}` : "2px solid transparent",
        color: active ? T.primary : T.mutedFg,
      }}>
      {label}
    </button>
  );
}

// ── Location Picker ───────────────────────────────────────────────────────────

const RECENT_LOCATIONS = [
  {
    name: "NetSpace - Công ty Công nghệ & Truyền thông",
    address: "Tầng 3, Tòa nhà MIPEC, 229 P. Tây Sơn, Kim Liên, Hà Nội 10000, Vietnam",
  },
  {
    name: "Trung tâm Hội nghị Quốc gia",
    address: "01 Đ. Trần Hữu Dực, Mỹ Đình, Nam Từ Liêm, Hà Nội",
  },
];

const VIRTUAL_OPTIONS = [
  { id: "zoom",  label: "Tạo Zoom meeting",      icon: Video },
  { id: "meet",  label: "Tạo Google Meet",        icon: Video },
];

function LocationPicker({
  value,
  onChange,
  isOnline,
}: {
  value: string;
  onChange: (v: string) => void;
  isOnline: boolean;
}) {
  const [open, setOpen] = React.useState(false);
  const [inputFocused, setInputFocused] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);

  const showDropdown = open && !isOnline;
  const filtered = value.length > 0
    ? RECENT_LOCATIONS.filter(
        (l) =>
          l.name.toLowerCase().includes(value.toLowerCase()) ||
          l.address.toLowerCase().includes(value.toLowerCase())
      )
    : RECENT_LOCATIONS;

  React.useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (location: typeof RECENT_LOCATIONS[0]) => {
    onChange(location.name + " — " + location.address);
    setOpen(false);
  };

  const handleVirtual = (label: string) => {
    onChange(label === "Tạo Zoom meeting" ? "https://zoom.us/j/..." : "https://meet.google.com/...");
    setOpen(false);
  };

  return (
    <div className="flex flex-col gap-1.5 relative" ref={containerRef}>
      {/* Collapsed trigger (Luma-style) when empty and not focused */}
      {!value && !inputFocused && !isOnline ? (
        <button
          data-pill="off"
          onClick={() => { setOpen(true); setInputFocused(true); }}
          className="flex items-start gap-3 w-full text-left rounded-xl px-4 py-3 transition-colors hover:opacity-90"
          style={{ backgroundColor: T.secondary, border: `1px solid ${T.border}` }}
        >
          <MapPin className="size-4 mt-0.5 shrink-0" style={{ color: T.mutedFg }} />
          <div>
            <p style={{ fontSize: T.sm, fontWeight: T.fw_medium, color: T.foreground }}>
              Thêm địa điểm sự kiện
            </p>
            <p style={{ fontSize: T.xs, color: T.mutedFg }}>Địa điểm offline hoặc link trực tuyến</p>
          </div>
        </button>
      ) : (
        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 size-4 shrink-0"
            style={{ color: isOnline ? T.mutedFg : T.primary }} />
          <input
            autoFocus={inputFocused}
            placeholder={isOnline ? "https://meet.google.com/..." : "Nhập địa điểm hoặc link online"}
            value={value}
            onChange={(e) => { onChange(e.target.value); setOpen(true); }}
            onFocus={() => { setOpen(true); setInputFocused(true); }}
            className="w-full rounded-xl pl-9 pr-4 py-2.5 outline-none transition-all"
            style={{
              border: `1px solid ${showDropdown ? T.primary : T.border}`,
              backgroundColor: T.background,
              color: T.foreground,
              fontSize: T.sm,
            }}
          />
          {value && (
            <button
              onClick={() => { onChange(""); setOpen(true); }}
              className="absolute right-3 top-1/2 -translate-y-1/2 transition-opacity hover:opacity-70"
              style={{ color: T.mutedFg }}
            >
              <X className="size-4" />
            </button>
          )}
        </div>
      )}

      {/* Dropdown */}
      {showDropdown && (
        <div
          className="absolute left-0 right-0 z-50 rounded-xl overflow-hidden shadow-lg"
          style={{
            top: "calc(100% + 4px)",
            backgroundColor: T.background,
            border: `1px solid ${T.border}`,
          }}
        >
          {/* Recent locations */}
          {filtered.length > 0 && (
            <div>
              <p className="px-4 pt-3 pb-1.5"
                style={{ fontSize: T.xs, fontWeight: T.fw_semi, color: T.mutedFg, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                Địa điểm gần đây
              </p>
              {filtered.map((loc) => (
                <button
                  data-pill="off"
                  key={loc.name}
                  onMouseDown={(e) => { e.preventDefault(); handleSelect(loc); }}
                  className="w-full text-left flex items-start gap-3 px-4 py-2.5 transition-colors hover:opacity-80"
                  style={{ backgroundColor: "transparent" }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = T.secondary)}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                >
                  <MapPin className="size-4 mt-0.5 shrink-0" style={{ color: T.mutedFg }} />
                  <div className="min-w-0">
                    <p style={{ fontSize: T.sm, fontWeight: T.fw_medium, color: T.foreground }}>{loc.name}</p>
                    <p style={{ fontSize: T.xs, color: T.mutedFg }} className="truncate">{loc.address}</p>
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Virtual options */}
          <div style={{ borderTop: filtered.length > 0 ? `1px solid ${T.border}` : "none" }}>
            <p className="px-4 pt-3 pb-1.5"
              style={{ fontSize: T.xs, fontWeight: T.fw_semi, color: T.mutedFg, textTransform: "uppercase", letterSpacing: "0.05em" }}>
              Trực tuyến
            </p>
            {VIRTUAL_OPTIONS.map((opt) => (
              <button
                data-pill="off"
                key={opt.id}
                onMouseDown={(e) => { e.preventDefault(); handleVirtual(opt.label); }}
                className="w-full text-left flex items-center gap-3 px-4 py-2.5 transition-colors"
                style={{ backgroundColor: "transparent" }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = T.secondary)}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
              >
                <opt.icon className="size-4 shrink-0" style={{ color: T.mutedFg }} />
                <span style={{ fontSize: T.sm, fontWeight: T.fw_medium, color: T.foreground }}>{opt.label}</span>
              </button>
            ))}
            <p className="px-4 py-2.5 flex items-center gap-2" style={{ color: T.mutedFg, fontSize: T.xs }}>
              <AlertCircle className="size-3.5 shrink-0" />
              Nếu bạn đã có link, hãy dán trực tiếp vào ô tìm kiếm ở trên.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Status badge ──────────────────────────────────────────────────────────────

// Sự kiện đang hoạt động chỉ có hai trạng thái: "Đang diễn ra" và "Chờ diễn ra"
// (bản nháp gộp vào "Chờ diễn ra"). Sự kiện đã khép lại vẫn cần nhãn riêng —
// gắn "Chờ diễn ra" cho một sự kiện đã xong thì sai sự thật — nên archived và
// cancelled gộp chung thành "Đã kết thúc".
const UPCOMING = { bg: "rgba(21,128,61,0.10)",   color: "var(--success-text)",     border: "rgba(21,128,61,0.25)" };
const CLOSED   = { bg: "rgba(100,116,139,0.08)", color: "var(--muted-foreground)", border: "rgba(100,116,139,0.2)" };

const STATUS_CFG: Record<EventStatus, { label: string; bg: string; color: string; border: string; dot?: boolean }> = {
  live:      { label: "Đang diễn ra", bg: "rgba(248,104,128,0.10)", color: "#f86880", border: "rgba(248,104,128,0.30)", dot: true },
  published: { label: "Chờ diễn ra",  ...UPCOMING },
  draft:     { label: "Chờ diễn ra",  ...UPCOMING },
  ended:     { label: "Đã kết thúc",  ...CLOSED },
  archived:  { label: "Đã kết thúc",  ...CLOSED },
  cancelled: { label: "Đã kết thúc",  ...CLOSED },
};

function StatusPill({ status }: { status: EventStatus }) {
  const c = STATUS_CFG[status];
  return (
    <span className="inline-flex items-center gap-1.5" style={{
      backgroundColor: c.bg, color: c.color, border: `1px solid ${c.border}`,
      fontSize: T.xs, fontWeight: T.fw_semi,
      padding: "2px 8px", borderRadius: "999px",
    }}>
      {c.dot && (
        <span className="size-1.5 rounded-full animate-pulse shrink-0" style={{ backgroundColor: c.color }} />
      )}
      {c.label}
    </span>
  );
}

// ── Draft checklist chips ─────────────────────────────────────────────────────

const DRAFT_CHIPS = ["Trang sự kiện", "Kho vé"];

// ── Event Timeline Card ───────────────────────────────────────────────────────

function EventTimelineCard({
  event,
  onManage,
}: {
  event: TimelineEvent;
  onManage: (ev: TimelineEvent) => void;
}) {
  const isLive      = event.status === "live";
  const isDraft     = event.status === "draft";
  const isEnded     = event.status === "ended";
  const isPublished = event.status === "published";

  // New checklist: 4 items total, item[0] (info) is always done = 1
  // Remaining incomplete: show up to 2 missing chips from DRAFT_CHIPS
  const completedBeyondInfo = Math.max(0, event.checklistDone - 1);
  const missingChips = isDraft ? DRAFT_CHIPS.slice(completedBeyondInfo) : [];

  return (
    <div
      className="rounded-2xl overflow-hidden transition-all hover:shadow-md group"
      style={{
        backgroundColor: T.background,
        border: isLive
          ? "1.5px solid rgba(248,104,128,0.40)"
          : `1px solid ${T.border}`,
        boxShadow: isLive ? "0 0 0 3px rgba(248,104,128,0.08)" : undefined,
      }}
      onMouseEnter={(e) => {
        if (!isLive) e.currentTarget.style.border = `1.5px solid ${T.primary}`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.border = isLive
          ? "1.5px solid rgba(248,104,128,0.40)"
          : `1px solid ${T.border}`;
      }}
    >
      <div className="flex items-stretch gap-0">
        {/* Left content */}
        <div className="flex-1 p-5 flex flex-col gap-3 min-w-0">
          {/* Status + time */}
          <div className="flex items-center gap-3 flex-wrap">
            <StatusPill status={event.status} />
            <span style={{ fontSize: T.sm, fontWeight: T.fw_medium, color: isDraft ? T.mutedFg : T.primary }}>
              {isDraft ? "Chưa xuất bản" : event.startTime}
            </span>
          </div>

          {/* Name */}
          <h3 style={{
            fontSize: T.lg, fontWeight: T.fw_semi, color: T.foreground,
            opacity: isEnded ? 0.6 : 1, lineHeight: 1.3,
          }}>
            {event.name}
          </h3>

          {/* Location */}
          <div className="flex items-center gap-2" style={{ color: T.mutedFg, fontSize: T.sm }}>
            {event.format === "online"
              ? <Globe className="size-3.5 shrink-0" />
              : <MapPin className="size-3.5 shrink-0" />}
            <span className="truncate">{event.location}</span>
          </div>

          {/* Guests / check-in */}
          {!isDraft && (
            <div className="flex items-center gap-4 flex-wrap">
              <div className="flex items-center gap-1.5" style={{ color: T.mutedFg, fontSize: T.xs }}>
                <Users className="size-3.5" />
                <span>{event.registrations} người đăng ký</span>
              </div>
              {(isLive || isEnded) && event.checkedIn > 0 && (
                <div className="flex items-center gap-1.5" style={{ color: T.mutedFg, fontSize: T.xs }}>
                  <UserCheck className="size-3.5" />
                  <span>{event.checkedIn} đã check-in</span>
                </div>
              )}
            </div>
          )}

          {/* Draft: progress + missing chips */}
          {isDraft && (
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: T.secondary }}>
                  <div className="h-full rounded-full transition-all"
                    style={{ width: `${Math.min((event.checklistDone / 3) * 100, 100)}%`, backgroundColor: T.primary }} />
                </div>
                <span style={{ fontSize: T.xs, color: T.mutedFg, whiteSpace: "nowrap" }}>
                  {Math.min(event.checklistDone, 3)}/3 hoàn tất
                </span>
              </div>
              {missingChips.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {missingChips.map((chip) => (
                    <span key={chip} style={{
                      fontSize: T.xs, color: T.warningText,
                      backgroundColor: T.warningSubtle,
                      border: `1px solid rgba(180,83,9,0.25)`,
                      padding: "2px 8px", borderRadius: "999px",
                    }}>
                      Chưa có {chip}
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center gap-2 mt-1 flex-wrap">
            {isLive && (
              <Button size="sm" onClick={() => onManage(event)} style={{ backgroundColor: T.primary, color: T.primaryFg }}>
                <QrCode className="size-3.5" /> Check-in QR
              </Button>
            )}
            <Button size="sm" variant="outline" onClick={() => onManage(event)}>
              Quản lý sự kiện →
            </Button>
          </div>
        </div>

        {/* Right: cover + more menu */}
        <div className="flex flex-col items-end justify-between p-4 shrink-0 gap-3">
          {/* More menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="size-7 rounded-lg flex items-center justify-center transition-colors hover:opacity-70"
                style={{ backgroundColor: T.secondary }}>
                <MoreHorizontal className="size-4" style={{ color: T.mutedFg }} />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={() => onManage(event)}>Mở workspace</DropdownMenuItem>
              <DropdownMenuItem>Chỉnh sửa thông tin</DropdownMenuItem>
              <DropdownMenuItem>Nhân bản sự kiện</DropdownMenuItem>
              <DropdownMenuItem>Xem trang sự kiện</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive focus:text-destructive">Lưu trữ</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Cover thumbnail square */}
          <div className="hidden sm:block shrink-0" style={{ width: 96, height: 96, opacity: isEnded ? 0.5 : 1 }}>
            <EventCoverSmall gradient={event.cover} style={{ width: 96, height: 96, aspectRatio: "unset", borderRadius: 10 }}>
              <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Calendar style={{ width: 24, height: 24, color: "white", opacity: 0.3 }} />
              </div>
            </EventCoverSmall>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Timeline group ────────────────────────────────────────────────────────────

function EventTimeline({
  events,
  onManage,
}: {
  events: TimelineEvent[];
  onManage: (ev: TimelineEvent) => void;
}) {
  const groups = groupByDate(events);

  return (
    <div className="flex flex-col gap-0">
      {groups.map((group, gi) => {
        const { main, sub } = formatDateLabel(group.date);
        const isLast = gi === groups.length - 1;
        return (
          <div key={group.date} className="flex gap-4 sm:gap-6">
            {/* Left: date column */}
            <div className="hidden sm:flex flex-col items-center" style={{ width: "72px", flexShrink: 0 }}>
              <div className="text-center w-full pt-1" style={{ paddingBottom: "8px" }}>
                <p style={{ fontSize: T.sm, fontWeight: T.fw_semi, color: T.foreground, lineHeight: 1.2 }}>{main}</p>
                <p style={{ fontSize: T.xs, color: T.mutedFg, marginTop: "2px" }}>{sub}</p>
              </div>
              {/* Dot + line */}
              <div className="flex flex-col items-center flex-1">
                <div className="size-2.5 rounded-full shrink-0 mt-1"
                  style={{ backgroundColor: group.events.some(e => e.status === "live") ? "#f86880" : T.primary }} />
                {!isLast && (
                  <div className="flex-1 mt-2" style={{
                    width: "1px",
                    borderLeft: `2px dashed ${T.border}`,
                    minHeight: "32px",
                  }} />
                )}
              </div>
            </div>

            {/* Right: event cards */}
            <div className="flex-1 flex flex-col gap-3 pb-8 min-w-0">
              {group.events.map((ev) => (
                <EventTimelineCard key={ev.id} event={ev} onManage={onManage} />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ── Events List ───────────────────────────────────────────────────────────────

function EventsListScreen({ events, onCreateEvent, onManage }: {
  events: TimelineEvent[];
  onCreateEvent: () => void;
  onManage: (ev: TimelineEvent) => void;
}) {
  type ListTab = "active" | "ended";
  const [listTab, setListTab]         = useState<ListTab>("active");
  const [search, setSearch]           = useState("");
  const [filterFormat, setFormat]     = useState("all-format");

  // Hai trạng thái: "Đang diễn ra" gộp sự kiện đang chạy, sắp diễn ra và bản
  // nháp đang chuẩn bị; "Đã kết thúc" gộp sự kiện đã xong, đã lưu trữ và đã
  // huỷ. Nhánh "đang diễn ra" viết theo phủ định để một status mới thêm sau
  // này vẫn hiện ra thay vì biến mất khỏi cả hai tab.
  const CLOSED: EventStatus[] = ["ended", "archived", "cancelled"];
  const tabFilter: Record<ListTab, (ev: TimelineEvent) => boolean> = {
    active: (ev) => !CLOSED.includes(ev.status),
    ended:  (ev) => CLOSED.includes(ev.status),
  };

  const formatFilter = (ev: TimelineEvent) => {
    if (filterFormat === "offline") return ev.format === "offline";
    if (filterFormat === "online")  return ev.format === "online";
    return true;
  };

  const filtered = events.filter((ev) =>
    tabFilter[listTab](ev) &&
    formatFilter(ev) &&
    (search === "" || ev.name.toLowerCase().includes(search.toLowerCase()) || ev.location.toLowerCase().includes(search.toLowerCase()))
  );

  const hasEvents = events.length > 0;

  return (
    <div className="flex flex-col w-full">

      {/* ── Package banner ── */}

      {/* ── Tabs + tìm kiếm + lọc, cùng một hàng ── */}
      <div className="flex items-end justify-between gap-4 flex-wrap"
        style={{ borderBottom: `1px solid ${T.border}`, marginBottom: "32px" }}>
        <div className="flex gap-5 overflow-x-auto">
          {([
            { id: "active" as ListTab, label: "Đang diễn ra" },
            { id: "ended"  as ListTab, label: "Đã kết thúc" },
          ]).map((t) => (
            <EventListTab key={t.id} label={t.label} active={listTab === t.id} onClick={() => setListTab(t.id)} />
          ))}
        </div>

        {hasEvents && (
          <div className="flex items-center gap-2 flex-wrap" style={{ paddingBottom: "8px" }}>
            <div className="relative w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 pointer-events-none" style={{ color: T.mutedFg }} />
              <Input
                placeholder="Tìm sự kiện..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-8 h-9"
                style={{ fontSize: T.sm }}
              />
            </div>
            <Select value={filterFormat} onValueChange={setFormat}>
              <SelectTrigger className="h-9 w-[184px] cursor-pointer" style={{ fontSize: T.sm }}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-format">Tất cả hình thức</SelectItem>
                <SelectItem value="offline">Offline</SelectItem>
                <SelectItem value="online">Online</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      {/* ── Timeline or empty state ── */}
      {hasEvents && filtered.length > 0 ? (
        <EventTimeline events={filtered} onManage={onManage} />
      ) : (
        <div className="flex justify-center w-full" style={{ paddingTop: hasEvents ? "0" : "0" }}>
          <div className="flex flex-col items-center text-center" style={{ width: "100%", maxWidth: "560px" }}>
            <div className="relative" style={{ marginBottom: "24px" }}>
              <div className="flex items-center justify-center shadow-sm" style={{
                width: "120px", height: "88px", borderRadius: "20px",
                background: "linear-gradient(135deg, var(--primary) 0%, color-mix(in srgb, var(--accent-foreground) 80%, var(--primary)) 100%)",
              }}>
                <Calendar className="size-10 text-white opacity-80" />
              </div>
              <div className="absolute flex items-center justify-center shadow-sm" style={{
                bottom: "-8px", right: "-12px", width: "28px", height: "28px",
                borderRadius: "50%", backgroundColor: T.background, border: `1px solid ${T.border}`,
              }}>
                <span style={{ fontSize: T.xs, fontWeight: T.fw_bold, color: T.mutedFg }}>0</span>
              </div>
            </div>
            <h3 style={{ color: T.foreground, fontSize: T.xl, fontWeight: T.fw_semi, marginBottom: "12px" }}>
              {hasEvents ? "Không có sự kiện phù hợp" : "Chưa có sự kiện nào"}
            </h3>
            <p style={{ color: T.mutedFg, fontSize: T.sm, lineHeight: 1.65, marginBottom: "24px" }}>
              {hasEvents
                ? "Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm."
                : "Tạo sự kiện đầu tiên để bắt đầu thiết lập landing page, form đăng ký, kho vé và check-in."}
            </p>
            {!hasEvents && (
              <Button size="lg" onClick={onCreateEvent}>
                <Plus className="size-4" /> Tạo sự kiện
              </Button>
            )}
            {!hasEvents && (
              <p style={{ fontSize: T.xs, color: T.mutedFg, marginTop: "16px", fontStyle: "italic" }}>
                Quota sự kiện chỉ được tính khi publish lần đầu.
              </p>
            )}
          </div>
        </div>
      )}

    </div>
  );
}

// ── Cover Upload Card ─────────────────────────────────────────────────────────

function CoverUploadCard({ eventName }: { eventName: string }) {
  const [previewUrl, setPreviewUrl] = React.useState<string | null>(null);
  return (
    <Card>
      <EventCoverUpload
        previewUrl={previewUrl}
        onPreviewChange={setPreviewUrl}
        eventName={eventName}
      />
    </Card>
  );
}

// ── Unified Event Preview Card ────────────────────────────────────────────────

/**
 * Đọc ảnh nền người dùng tải lên, thu nhỏ về tối đa 1920px rồi xuất JPEG.
 * Ảnh gốc từ điện thoại có thể vài MB — vượt hạn mức sessionStorage (~5MB)
 * nơi sự kiện hiện tại được lưu để tab trang công khai đọc lại — nên thu nhỏ
 * trước khi giữ.
 */
async function readBackgroundImage(file: File, maxW = 1920): Promise<string> {
  const url = URL.createObjectURL(file);
  try {
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      // Không dùng `new Image()`: file này import icon `Image` từ lucide-react,
      // tên đó che mất constructor Image của trình duyệt.
      const i = document.createElement("img");
      i.onload = () => resolve(i);
      i.onerror = reject;
      i.src = url;
    });
    const scale = Math.min(1, maxW / img.naturalWidth);
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(img.naturalWidth * scale);
    canvas.height = Math.round(img.naturalHeight * scale);
    canvas.getContext("2d")!.drawImage(img, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL("image/jpeg", 0.82);
  } finally {
    URL.revokeObjectURL(url);
  }
}

function UnifiedEventPreviewCard({ form, theme, onThemeChange, customBg, onCustomBg }: {
  form: { name: string };
  theme: string;
  onThemeChange: (id: string) => void;
  customBg: string | null;
  onCustomBg: (url: string) => void;
}) {
  const [previewUrl, setPreviewUrl] = React.useState<string | null>(null);
  const [themeOpen, setThemeOpen] = React.useState(false);
  const activeTheme = THEMES.find((t) => t.id === theme);
  const usingImage = theme === "custom" && !!customBg;
  const fileRef = React.useRef<HTMLInputElement>(null);

  const pickFile = async (file?: File) => {
    if (!file || !file.type.startsWith("image/")) return;
    onCustomBg(await readBackgroundImage(file));
    onThemeChange("custom");
    setThemeOpen(false);
  };

  return (
    <div className="flex flex-col gap-3">
      {/* Section 1: Cover 16:9 */}
      <EventCoverUpload
        previewUrl={previewUrl}
        onPreviewChange={setPreviewUrl}
        eventName={form.name || undefined}
      />

      {/* Section 2: Theme trigger — opens the picker drawer on the right */}
      <div>
        <button type="button" data-pill="off"
          onClick={() => setThemeOpen(true)}
          className="flex items-center gap-3 p-2.5 rounded-xl w-full text-left cursor-pointer transition-opacity hover:opacity-90"
          style={{ border: `1px solid ${T.border}`, backgroundColor: T.background }}>
          <div className="w-10 h-7 rounded-md shrink-0"
            style={usingImage
              ? { backgroundImage: `url("${customBg}")`, backgroundSize: "cover", backgroundPosition: "center" }
              : { background: activeTheme?.gradient }} />
          <div className="flex flex-col min-w-0 flex-1">
            <span style={{ fontSize: T.xs, color: T.mutedFg }}>Giao diện trang sự kiện</span>
            <span style={{ fontSize: T.sm, fontWeight: T.fw_medium, color: T.foreground }}>
              {usingImage ? "Ảnh nền của bạn" : activeTheme?.label}
            </span>
          </div>
          <ChevronDown className="size-4 shrink-0" style={{ color: T.mutedFg }} />
        </button>
      </div>

      <Sheet open={themeOpen} onOpenChange={setThemeOpen}>
        <SheetContent className="p-0 flex flex-col gap-0">
          <SheetHeader className="px-6 py-4" style={{ borderBottom: `1px solid ${T.border}` }}>
            <SheetTitle>Giao diện trang sự kiện</SheetTitle>
          </SheetHeader>
          <div className="flex-1 overflow-y-auto px-6 py-5 flex flex-col gap-3">
            {/* Tải ảnh nền lên — phủ lên màu của theme trên trang sự kiện */}
            <input ref={fileRef} type="file" accept="image/*" className="hidden"
              onChange={(e) => { void pickFile(e.target.files?.[0]); e.target.value = ""; }} />
            <button type="button" data-pill="off"
              onClick={() => (customBg && theme !== "custom"
                ? (onThemeChange("custom"), setThemeOpen(false))
                : fileRef.current?.click())}
              aria-pressed={usingImage}
              className="flex items-center gap-3 p-3 rounded-xl w-full text-left cursor-pointer transition-colors"
              style={{
                border: usingImage ? `2px solid ${T.primary}` : `1px dashed ${T.border}`,
                backgroundColor: usingImage ? `color-mix(in srgb, ${T.primary} 6%, ${T.background})` : T.background,
              }}>
              {customBg ? (
                <div className="w-16 h-11 rounded-lg shrink-0"
                  style={{ backgroundImage: `url("${customBg}")`, backgroundSize: "cover", backgroundPosition: "center" }} />
              ) : (
                <div className="w-16 h-11 rounded-lg shrink-0 flex items-center justify-center"
                  style={{ backgroundColor: T.secondary }}>
                  <Upload className="size-4" style={{ color: T.mutedFg }} />
                </div>
              )}
              <div className="flex flex-col gap-1 min-w-0 flex-1">
                <span style={{ fontSize: T.sm, fontWeight: usingImage ? T.fw_semi : T.fw_medium, color: T.foreground }}>
                  {customBg ? "Ảnh nền của bạn" : "Tải ảnh nền lên"}
                </span>
                <span style={{ fontSize: T.xs, color: T.mutedFg }}>
                  {customBg ? "Dùng ảnh làm nền trang sự kiện" : "JPG hoặc PNG, ảnh ngang cho đẹp nhất"}
                </span>
              </div>
              {usingImage && <CheckCircle2 className="size-4 shrink-0" style={{ color: T.primary }} />}
            </button>
            {customBg && (
              <button type="button" data-pill="off" onClick={() => fileRef.current?.click()}
                className="self-start cursor-pointer transition-opacity hover:opacity-70"
                style={{ background: "none", border: "none", padding: 0, fontSize: T.xs, color: T.primary }}>
                Đổi ảnh khác
              </button>
            )}

            {THEMES.map((th) => {
              const on = th.id === theme;
              return (
                <button key={th.id} type="button" data-pill="off"
                  onClick={() => { onThemeChange(th.id); setThemeOpen(false); }}
                  aria-pressed={on}
                  className="flex items-center gap-3 p-3 rounded-xl w-full text-left cursor-pointer transition-colors"
                  style={{
                    border: on ? `2px solid ${T.primary}` : `1px solid ${T.border}`,
                    backgroundColor: on ? `color-mix(in srgb, ${T.primary} 6%, ${T.background})` : T.background,
                  }}>
                  <div className="w-16 h-11 rounded-lg shrink-0" style={{ background: th.gradient }} />
                  <div className="flex flex-col gap-1 min-w-0 flex-1">
                    <span style={{ fontSize: T.sm, fontWeight: on ? T.fw_semi : T.fw_medium, color: T.foreground }}>{th.label}</span>
                    <span className="flex items-center gap-1.5" style={{ fontSize: T.xs, color: T.mutedFg }}>
                      <span className="inline-block size-3 rounded-full shrink-0"
                        style={{ backgroundColor: th.page, border: `1px solid ${T.border}` }} />
                      Nền trang sự kiện
                    </span>
                  </div>
                  {on && <CheckCircle2 className="size-4 shrink-0" style={{ color: T.primary }} />}
                </button>
              );
            })}
          </div>
          <div className="px-6 py-4" style={{ borderTop: `1px solid ${T.border}` }}>
            <p style={{ fontSize: T.xs, color: T.mutedFg, lineHeight: 1.6 }}>
              Giao diện quyết định nền của trang sự kiện công khai — một màu có sẵn hoặc ảnh bạn tải lên. Ảnh cover được tải riêng.
            </p>
          </div>
        </SheetContent>
      </Sheet>

    </div>
  );
}

// ── SCREEN 2 — Create Event Draft ─────────────────────────────────────────────

function CreateEventScreen({ onCancel, onCreated }: { onCancel: () => void; onCreated: (ev: EventDraft) => void }) {
  const [format, setFormat] = useState<EventFormat>("offline");
  const [loading, setLoading] = useState(false);
  const [theme, setTheme] = useState("gradient");
  const [customBg, setCustomBg] = useState<string | null>(null);
  const [visibility, setVisibility] = useState("public");
  const [requireApproval, setRequireApproval] = useState(false);
  const [limitAttendees, setLimitAttendees] = useState(false);
  const [maxAttendees, setMaxAttendees] = useState("");
  const [isPaid, setIsPaid] = useState(false);
  const [ticketPrice, setTicketPrice] = useState("");
  const [form, setForm] = useState(() => {
    const now = new Date();
    const pad = (n: number) => String(n).padStart(2, "0");
    const toDateStr = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`;
    const toTimeStr = (d: Date) => `${pad(d.getHours())}:${pad(d.getMinutes())}`;
    const end = new Date(now); end.setHours(end.getHours() + 1);
    return {
      name: "", organizer: "", description: "",
      startDate: toDateStr(now), startTime: toTimeStr(now),
      endDate: toDateStr(now), endTime: toTimeStr(end),
      location: "", onlineLink: "",
    };
  });
  const set = (k: keyof typeof form) => (v: string) => setForm((f) => ({ ...f, [k]: v }));

  const needsLocation   = format === "offline" || format === "hybrid";
  const needsOnlineLink = format === "online"  || format === "hybrid";

  const isValid = form.name.trim()
    && form.startDate && form.endDate
    && (!needsLocation   || form.location.trim())
    && (!needsOnlineLink || form.onlineLink.trim());

  const handleCreate = () => {
    if (!isValid) return;
    setLoading(true);
    setTimeout(() => {
      const newEvent: EventDraft = {
        id: Date.now().toString(),
        name: form.name, description: form.description,
        startDate: form.startDate, startTime: form.startTime,
        endDate: form.endDate, endTime: form.endTime,
        format, location: needsLocation ? form.location : (needsOnlineLink ? form.onlineLink : ""),
        theme, visibility,
        requireApproval, limitAttendees, maxAttendees: limitAttendees ? maxAttendees : "",
        ticketPrice: isPaid ? ticketPrice : "",
        status: "draft",
        cover: THEMES.find((t) => t.id === theme)?.gradient ?? THEMES[1].gradient,
        pageImage: theme === "custom" && customBg ? customBg : undefined,
      };
      onCreated(newEvent);
    }, 700);
  };


  // Chọn giao diện thì cả trang tạo sự kiện đổi nền theo, như một bản xem
  // trước sống của trang sự kiện. Màn này nằm trong <main> của AdminDashboard
  // nên không tự phủ ra được mép panel — tô thẳng lên <main> gần nhất khi đang
  // mở, và trả lại nền cũ khi rời màn.
  const rootRef = React.useRef<HTMLDivElement>(null);

  // Bề mặt trong màn này là trắng trong suốt thay vì trắng đục, để nền theme
  // xuyên qua các ô nhập. Định nghĩa lại biến ở gốc là đủ cho mọi ô con (Input,
  // Select, ô cover, pill ngày giờ…). Ghi đè cả dạng --color-* vì utility của
  // Tailwind có thể đọc qua biến trung gian đã được tính sẵn ở :root. Dialog và
  // drawer render ở portal ngoài gốc này nên vẫn giữ nền trắng.
  const GLASS_VARS = {
    // Chip, nút viền, pill ngày giờ: gần như trắng đặc để luôn nổi.
    "--background": "rgba(255,255,255,0.9)",        "--color-background": "rgba(255,255,255,0.9)",
    // Ô nhập: trắng mờ + viền mảnh. Trên nền nhạt (Minimal gần như trắng) lớp
    // trắng mờ trùng màu nền, nên chính viền mới tách ô ra khỏi trang — theme
    // gốc đặt --input trong suốt nên ô nhập vốn không có viền.
    "--input-background": "rgba(255,255,255,0.72)", "--color-input-background": "rgba(255,255,255,0.72)",
    "--input": "rgba(15,23,42,0.12)",               "--color-input": "rgba(15,23,42,0.12)",
    // Rãnh và nền phụ: phủ tối rất nhẹ thay vì trắng mờ, để vẫn thấy được trên
    // nền gần trắng, còn trên nền có màu thì màu vẫn xuyên qua.
    "--secondary": "rgba(15,23,42,0.045)",          "--color-secondary": "rgba(15,23,42,0.045)",
    "--muted": "rgba(15,23,42,0.03)",               "--color-muted": "rgba(15,23,42,0.03)",
    // Viền trung tính trong suốt, hợp với mọi màu theme thay vì xám-xanh cố định.
    "--border": "rgba(15,23,42,0.10)",              "--color-border": "rgba(15,23,42,0.10)",
  } as React.CSSProperties;
  const usingImage = theme === "custom" && !!customBg;
  const pageBg = usingImage ? "#f6f8fb" : (THEMES.find((t) => t.id === theme)?.page ?? "");
  React.useEffect(() => {
    const main = rootRef.current?.closest("main") as HTMLElement | null;
    if (!main) return;
    const prev = {
      bg: main.style.backgroundColor, img: main.style.backgroundImage,
      size: main.style.backgroundSize, pos: main.style.backgroundPosition, tr: main.style.transition,
    };
    main.style.transition = "background-color 0.25s";
    main.style.backgroundColor = pageBg;
    // Ảnh tải lên phủ kín trang; lớp trắng mờ phía trên giữ chữ đọc được kể cả trên ảnh sẫm.
    main.style.backgroundImage = usingImage
      ? `linear-gradient(rgba(255,255,255,0.35), rgba(255,255,255,0.35)), url("${customBg}")`
      : "";
    main.style.backgroundSize = usingImage ? "cover" : "";
    main.style.backgroundPosition = usingImage ? "center" : "";
    return () => {
      main.style.backgroundColor = prev.bg;
      main.style.backgroundImage = prev.img;
      main.style.backgroundSize = prev.size;
      main.style.backgroundPosition = prev.pos;
      main.style.transition = prev.tr;
    };
  }, [pageBg, usingImage, customBg]);

  return (
    <div ref={rootRef} className="w-full flex flex-col" style={{ minHeight: "min(calc(100vh - 180px), 100%)", ...GLASS_VARS }}>
      {/* Back */}

      <div className="flex items-center justify-between gap-3 flex-wrap mb-6 w-full max-w-[960px] mx-auto">
        <h2 style={{ color: T.foreground, fontSize: T["2xl"], fontWeight: T.fw_semi }}>Tạo sự kiện</h2>
        <div className="flex items-center gap-3">
          {/* Quyền riêng tư */}
          <div className="flex gap-0.5 p-0.5 rounded-full shrink-0" style={{ backgroundColor: T.secondary, border: `1px solid ${T.border}` }}>
            {([
              { id: "public",  label: "Công khai", icon: Globe },
              { id: "private", label: "Riêng tư",  icon: Eye },
            ]).map((v) => {
              const on = visibility === v.id;
              return (
                <button key={v.id} type="button" onClick={() => setVisibility(v.id)}
                  aria-pressed={on}
                  className="flex items-center gap-1.5 px-3 py-1 whitespace-nowrap transition-colors cursor-pointer"
                  style={{
                    fontSize: T.xs,
                    fontWeight: on ? T.fw_semi : T.fw_normal,
                    backgroundColor: on ? T.background : "transparent",
                    color: on ? T.primary : T.mutedFg,
                    boxShadow: on ? "0 1px 3px rgba(0,0,0,0.08)" : "none",
                  }}>
                  <v.icon className="size-3.5" /> {v.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Cột hẹp căn giữa, không card đục: nền theme lộ ra hai bên và xuyên qua
          các ô nhập trong suốt, như một bản xem trước của trang sự kiện. */}
      <div className="grid grid-cols-1 lg:grid-cols-[340px_1fr] gap-8 w-full max-w-[960px] mx-auto items-start">

        {/* ── Left: ảnh cover + giao diện, đứng yên khi form cuộn ── */}
        <div className="flex flex-col gap-0 lg:sticky lg:top-6">
          <UnifiedEventPreviewCard form={form} theme={theme} onThemeChange={setTheme}
            customBg={customBg} onCustomBg={setCustomBg} />
        </div>

        {/* ── Right: Form ── */}
        <div className="min-w-0">
          <div>
            <div className="flex flex-col gap-5">

              {/* 1. Tên sự kiện */}
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="ev-name">Tên sự kiện <span style={{ color: T.destructive }}>*</span></Label>
                <Input id="ev-name" placeholder="Nhập tên sự kiện"
                  value={form.name} onChange={(e) => set("name")(e.target.value)} />
              </div>

              {/* 2. Thời gian bắt đầu / kết thúc */}
              <div className="flex flex-col gap-1.5">
                <Label>Thời gian <span style={{ color: T.destructive }}>*</span></Label>
                <div className="flex items-stretch gap-2">
                  {/* Cột trái — bắt đầu / kết thúc */}
                  <div className="flex-1 min-w-0 rounded-2xl overflow-hidden" style={{ border: `1px solid ${T.border}`, backgroundColor: `color-mix(in srgb, ${T.primary} 5%, ${T.background})` }}>
                  {/* Bắt đầu */}
                  <div className="flex items-center px-4 gap-4" style={{ height: 52, borderBottom: `1px dashed ${T.border}` }}>
                    <div className="flex flex-col items-center shrink-0" style={{ width: 10, gap: 0 }}>
                      <div style={{ width: 9, height: 9, borderRadius: "50%", backgroundColor: T.primary }} />
                    </div>
                    <span style={{ fontSize: T.sm, color: T.mutedFg, minWidth: 64 }}>Bắt đầu</span>
                    <div className="flex-1 flex items-center justify-end gap-2">
                      {/* Date pill */}
                      <div className="relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg"
                        style={{ backgroundColor: T.background, border: `1px solid ${T.border}`, cursor: "pointer" }}>
                        <Calendar className="size-3.5 shrink-0" style={{ color: T.mutedFg, pointerEvents: "none" }} />
                        <span style={{ fontSize: T.sm, fontWeight: T.fw_medium, color: form.startDate ? T.foreground : T.mutedFg, pointerEvents: "none", whiteSpace: "nowrap" }}>
                          {form.startDate ? (() => { const d = new Date(form.startDate); const days = ["CN","Thứ 2","Thứ 3","Thứ 4","Thứ 5","Thứ 6","Thứ 7"]; return `${days[d.getDay()]}, ${d.getDate()} thg ${d.getMonth()+1}`; })() : "Chọn ngày"}
                        </span>
                        <ChevronDown className="size-3 shrink-0" style={{ color: T.mutedFg, pointerEvents: "none" }} />
                        <input type="date" value={form.startDate} onChange={(e) => set("startDate")(e.target.value)}
                          style={{ position: "absolute", inset: 0, opacity: 0, cursor: "pointer", width: "100%" }} />
                      </div>
                      {/* Time pill */}
                      <div className="relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg"
                        style={{ backgroundColor: T.background, border: `1px solid ${T.border}`, cursor: "pointer" }}>
                        <Clock className="size-3.5 shrink-0" style={{ color: T.mutedFg, pointerEvents: "none" }} />
                        <span style={{ fontSize: T.sm, fontWeight: T.fw_medium, color: T.foreground, pointerEvents: "none", minWidth: 36 }}>
                          {form.startTime || (() => { const n = new Date(); return `${String(n.getHours()).padStart(2,"0")}:${String(n.getMinutes()).padStart(2,"0")}`; })()}
                        </span>
                        <ChevronDown className="size-3 shrink-0" style={{ color: T.mutedFg, pointerEvents: "none" }} />
                        <input type="time" value={form.startTime} onChange={(e) => set("startTime")(e.target.value)}
                          style={{ position: "absolute", inset: 0, opacity: 0, cursor: "pointer", width: "100%" }} />
                      </div>
                    </div>
                  </div>
                  {/* Kết thúc */}
                  <div className="flex items-center px-4 gap-4" style={{ height: 52 }}>
                    <div className="flex flex-col items-center shrink-0" style={{ width: 10 }}>
                      <div style={{ width: 9, height: 9, borderRadius: "50%", border: `1.5px solid ${T.mutedFg}`, backgroundColor: "transparent" }} />
                    </div>
                    <span style={{ fontSize: T.sm, color: T.mutedFg, minWidth: 64 }}>Kết thúc</span>
                    <div className="flex-1 flex items-center justify-end gap-2">
                      <div className="relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg"
                        style={{ backgroundColor: T.background, border: `1px solid ${T.border}`, cursor: "pointer" }}>
                        <Calendar className="size-3.5 shrink-0" style={{ color: T.mutedFg, pointerEvents: "none" }} />
                        <span style={{ fontSize: T.sm, fontWeight: T.fw_medium, color: form.endDate ? T.foreground : T.mutedFg, pointerEvents: "none", whiteSpace: "nowrap" }}>
                          {form.endDate ? (() => { const d = new Date(form.endDate); const days = ["CN","Thứ 2","Thứ 3","Thứ 4","Thứ 5","Thứ 6","Thứ 7"]; return `${days[d.getDay()]}, ${d.getDate()} thg ${d.getMonth()+1}`; })() : "Chọn ngày"}
                        </span>
                        <ChevronDown className="size-3 shrink-0" style={{ color: T.mutedFg, pointerEvents: "none" }} />
                        <input type="date" value={form.endDate} onChange={(e) => set("endDate")(e.target.value)}
                          style={{ position: "absolute", inset: 0, opacity: 0, cursor: "pointer", width: "100%" }} />
                      </div>
                      <div className="relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg"
                        style={{ backgroundColor: T.background, border: `1px solid ${T.border}`, cursor: "pointer" }}>
                        <Clock className="size-3.5 shrink-0" style={{ color: T.mutedFg, pointerEvents: "none" }} />
                        <span style={{ fontSize: T.sm, fontWeight: T.fw_medium, color: T.foreground, pointerEvents: "none", minWidth: 36 }}>
                          {form.endTime || (() => { const n = new Date(); n.setHours(n.getHours()+1); return `${String(n.getHours()).padStart(2,"0")}:${String(n.getMinutes()).padStart(2,"0")}`; })()}
                        </span>
                        <ChevronDown className="size-3 shrink-0" style={{ color: T.mutedFg, pointerEvents: "none" }} />
                        <input type="time" value={form.endTime} onChange={(e) => set("endTime")(e.target.value)}
                          style={{ position: "absolute", inset: 0, opacity: 0, cursor: "pointer", width: "100%" }} />
                      </div>
                    </div>
                  </div>
                  </div>

                  {/* Cột phải — múi giờ */}
                  <div className="rounded-2xl shrink-0 flex flex-col justify-center gap-1.5 px-4 py-3"
                    style={{ width: 136, border: `1px solid ${T.border}`, backgroundColor: `color-mix(in srgb, ${T.primary} 5%, ${T.background})` }}>
                    <Globe className="size-4 shrink-0" style={{ color: T.mutedFg }} />
                    <div className="flex flex-col min-w-0">
                      <span style={{ fontSize: T.sm, fontWeight: T.fw_medium, color: T.foreground, whiteSpace: "nowrap" }}>{TIMEZONE.label}</span>
                      <span className="truncate" style={{ fontSize: T.xs, color: T.mutedFg }}>{TIMEZONE.city}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 3. Hình thức tổ chức */}
              <div className="flex flex-col gap-1.5">
                <Label>Hình thức tổ chức</Label>
                <div className="flex rounded-xl overflow-hidden" style={{ border: `1px solid ${T.border}` }}>
                  {(["offline", "online"] as EventFormat[]).map((f, i) => (
                    <button key={f} onClick={() => setFormat(f)} className="flex-1 py-2 transition-colors cursor-pointer"
                      style={{
                        fontSize: T.sm, fontWeight: format === f ? T.fw_semi : T.fw_normal,
                        backgroundColor: format === f ? T.primary : T.background,
                        color: format === f ? T.primaryFg : T.mutedFg,
                        borderRight: i < 1 ? `1px solid ${T.border}` : "none",
                      }}>
                      {f === "offline" ? "Offline" : "Online"}
                    </button>
                  ))}
                </div>
              </div>

              {/* 4. Địa điểm tổ chức */}
              {needsLocation && (
                <div className="flex flex-col gap-1.5">
                  <Label>Địa điểm tổ chức <span style={{ color: T.destructive }}>*</span></Label>
                  <LocationPicker value={form.location} onChange={set("location")} isOnline={false} />
                </div>
              )}
              {needsOnlineLink && (
                <div className="flex flex-col gap-1.5">
                  <Label>Link tham gia online <span style={{ color: T.destructive }}>*</span></Label>
                  <Input placeholder="https://meet.google.com/..."
                    value={form.onlineLink} onChange={(e) => set("onlineLink")(e.target.value)} />
                </div>
              )}

              {/* 5. Mô tả ngắn */}
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="ev-desc">Mô tả ngắn</Label>
                <Textarea id="ev-desc" rows={3} placeholder="Sự kiện này dành cho ai? Nội dung chính là gì?"
                  value={form.description} onChange={(e) => set("description")(e.target.value)} />
              </div>

              {/* 6. Đơn vị tổ chức */}
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="ev-org">Đơn vị tổ chức</Label>
                <Input id="ev-org" placeholder="Tên công ty, tổ chức hoặc cá nhân tổ chức"
                  value={form.organizer} onChange={(e) => set("organizer")(e.target.value)} />
              </div>

              {/* 7. Tùy chọn sự kiện */}
              <div className="flex flex-col gap-1.5">
                <Label>Tùy chọn sự kiện</Label>
                <div className="rounded-2xl overflow-hidden"
                  style={{ border: `1px solid ${T.border}`, backgroundColor: `color-mix(in srgb, ${T.primary} 5%, ${T.background})` }}>

                  {/* Giá vé */}
                  <div className="flex items-center px-4 gap-3" style={{ height: 52, borderBottom: `1px dashed ${T.border}` }}>
                    <Ticket className="size-4 shrink-0" style={{ color: T.mutedFg }} />
                    <span style={{ fontSize: T.sm, color: T.foreground }}>Giá vé</span>
                    <div className="flex-1 flex items-center justify-end gap-2">
                      {isPaid ? (
                        <>
                          <Input type="number" min={0} step={1000} placeholder="499000"
                            value={ticketPrice} onChange={(e) => setTicketPrice(e.target.value)}
                            className="h-8 w-28 text-right" style={{ fontSize: T.sm }} />
                          <span style={{ fontSize: T.sm, color: T.mutedFg }}>đ</span>
                          <button type="button" onClick={() => { setIsPaid(false); setTicketPrice(""); }}
                            className="cursor-pointer transition-opacity hover:opacity-70"
                            style={{ fontSize: T.xs, color: T.mutedFg }}>Miễn phí</button>
                        </>
                      ) : (
                        <button type="button" onClick={() => setIsPaid(true)}
                          className="flex items-center gap-1.5 cursor-pointer transition-opacity hover:opacity-70"
                          style={{ fontSize: T.sm, color: T.mutedFg }}>
                          Miễn phí <Pencil className="size-3.5" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Yêu cầu duyệt */}
                  <div className="flex items-center px-4 gap-3" style={{ height: 52, borderBottom: `1px dashed ${T.border}` }}>
                    <UserCheck className="size-4 shrink-0" style={{ color: T.mutedFg }} />
                    <span style={{ fontSize: T.sm, color: T.foreground }}>Yêu cầu duyệt</span>
                    <div className="flex-1 flex items-center justify-end">
                      <Switch checked={requireApproval} onCheckedChange={setRequireApproval} />
                    </div>
                  </div>

                  {/* Sức chứa */}
                  <div className="flex items-center px-4 gap-3" style={{ height: 52 }}>
                    <Users className="size-4 shrink-0" style={{ color: T.mutedFg }} />
                    <span style={{ fontSize: T.sm, color: T.foreground }}>Sức chứa</span>
                    <div className="flex-1 flex items-center justify-end gap-2">
                      {limitAttendees ? (
                        <>
                          <Input type="number" min={1} placeholder="100"
                            value={maxAttendees} onChange={(e) => setMaxAttendees(e.target.value)}
                            className="h-8 w-24 text-right" style={{ fontSize: T.sm }} />
                          <button type="button" onClick={() => { setLimitAttendees(false); setMaxAttendees(""); }}
                            className="cursor-pointer transition-opacity hover:opacity-70"
                            style={{ fontSize: T.xs, color: T.mutedFg }}>Bỏ giới hạn</button>
                        </>
                      ) : (
                        <button type="button" onClick={() => setLimitAttendees(true)}
                          className="flex items-center gap-1.5 cursor-pointer transition-opacity hover:opacity-70"
                          style={{ fontSize: T.sm, color: T.mutedFg }}>
                          Không giới hạn <Pencil className="size-3.5" />
                        </button>
                      )}
                    </div>
                  </div>

                </div>
                <p style={{ fontSize: T.xs, color: T.mutedFg, lineHeight: 1.6 }}>
                  Hạng vé và giá vé chi tiết được thiết lập ở <strong>Kho vé</strong> sau khi tạo sự kiện.
                </p>
              </div>

              {/* Hành động nằm cuối cột form như mẫu — không còn thanh footer
                  full-width cắt ngang nền. */}
              <div className="flex flex-col gap-2 pt-2">
                <Button className="w-full h-11" disabled={!isValid || loading} onClick={handleCreate}>
                  {loading ? "Đang tạo..." : "Tạo sự kiện"}
                </Button>
                <div className="flex items-center justify-between gap-3">
                  <p style={{ fontSize: T.xs, color: T.mutedFg }}>
                    {!form.name.trim() ? "Vui lòng nhập tên sự kiện." : !isValid ? "Vui lòng điền đầy đủ các trường bắt buộc." : "Sẵn sàng tạo sự kiện."}
                  </p>
                  <button type="button" data-pill="off" onClick={onCancel}
                    className="shrink-0 cursor-pointer transition-opacity hover:opacity-70"
                    style={{ background: "none", border: "none", padding: 0, fontSize: T.xs, color: T.mutedFg }}>
                    Hủy
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── SCREEN 3 — Event Workspace ────────────────────────────────────────────────

function WorkspaceTabButton({ tab, active, onClick }: { tab: typeof WORKSPACE_TABS[0]; active: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick}
      data-pill="off"
      className="flex items-center gap-1.5 pb-3 border-b-2 whitespace-nowrap transition-colors cursor-pointer"
      style={{
        fontSize: T.sm,
        fontWeight: active ? T.fw_semi : T.fw_normal,
        borderBottomColor: active ? T.primary : "transparent",
        color: active ? T.primary : T.mutedFg,
      }}>
      <tab.icon className="size-3.5" /> {tab.label}
    </button>
  );
}

function QuickActionCard({ title, desc, ctaLabel, icon: Icon, onClick }: {
  title: string; desc: string; ctaLabel: string;
  icon: React.FC<{ className?: string }>; onClick: () => void;
}) {
  return (
    <div className="rounded-xl p-4 flex flex-col" style={{ backgroundColor: T.background, border: `1px solid ${T.border}`, gap: "12px" }}>
      <div className="size-9 rounded-xl flex items-center justify-center shrink-0"
        style={{ backgroundColor: `color-mix(in srgb, ${T.primary} 10%, transparent)` }}>
        <Icon className="size-5" style={{ color: T.primary } as React.CSSProperties} />
      </div>
      <div className="flex-1">
        <p style={{ fontSize: T.sm, fontWeight: T.fw_semi, color: T.foreground }}>{title}</p>
        <p style={{ fontSize: T.xs, color: T.mutedFg, marginTop: "2px", lineHeight: 1.5 }}>{desc}</p>
      </div>
      <Button size="sm" variant="outline" onClick={onClick} className="mt-auto">{ctaLabel}</Button>
    </div>
  );
}

function ChecklistItem({ item, onAction }: { item: typeof CHECKLIST[0]; onAction: () => void }) {
  return (
    <div className="flex items-start gap-3 py-3" style={{ borderBottom: `1px solid ${T.border}` }}>
      {/* Icon */}
      <div className="shrink-0 mt-0.5">
        {item.done
          ? <CheckCircle2 className="size-5" style={{ color: T.successText }} />
          : <Circle className="size-5" style={{ color: item.disabled ? T.border : T.mutedFg }} />}
      </div>

      {/* Text */}
      <div className="flex-1 min-w-0">
        <p style={{
          fontSize: T.sm, fontWeight: item.done ? T.fw_normal : T.fw_medium,
          color: item.disabled ? T.mutedFg : item.done ? T.successText : T.foreground,
        }}>
          {item.label}
        </p>
        <p style={{ fontSize: T.xs, color: T.mutedFg, marginTop: "1px" }}>
          {item.done ? item.subtext : item.status}
        </p>
        {!item.done && !item.disabled && (
          <p style={{ fontSize: T.xs, color: T.mutedFg, marginTop: "2px", lineHeight: 1.5 }}>
            {item.subtext}
          </p>
        )}
        {item.disabled && (
          <p style={{ fontSize: T.xs, color: T.mutedFg, marginTop: "2px", fontStyle: "italic" }}>
            Hoàn tất Trang sự kiện và Kho vé trước khi xuất bản.
          </p>
        )}
      </div>

      {/* Action */}
      <Button size="sm"
        variant={item.done ? "ghost" : "outline"}
        disabled={item.disabled}
        onClick={onAction}
        style={{ fontSize: T.xs, flexShrink: 0, opacity: item.disabled ? 0.45 : 1 }}>
        {item.actionLabel}
      </Button>
    </div>
  );
}

// ── Check-in Tab ─────────────────────────────────────────────────────────────

type CiStatus = "valid" | "checked-in" | "checked-out" | "invalid" | "cancelled";

interface CiAttendee {
  id: string; name: string; email: string; ticketCode: string; ticketType: string;
  status: CiStatus; checkinTime?: string; checkoutTime?: string;
}

const CI_MOCK: CiAttendee[] = [
  { id: "a1", name: "Nguyễn Văn Bình", email: "binh@email.com", ticketCode: "NE-2025-00142", ticketType: "VIP",      status: "valid" },
  { id: "a2", name: "Trần Thị Cúc",   email: "cuc@email.com",  ticketCode: "NE-2025-00089", ticketType: "Standard", status: "checked-in",  checkinTime: "09:14" },
  { id: "a3", name: "Lê Minh Đức",    email: "duc@email.com",  ticketCode: "NE-2025-00201", ticketType: "Standard", status: "checked-out", checkinTime: "08:45", checkoutTime: "14:30" },
  { id: "a4", name: "Phạm Thị Hoa",   email: "hoa@email.com",  ticketCode: "NE-2025-00317", ticketType: "VIP",      status: "valid" },
  { id: "a5", name: "Vũ Quốc Hùng",   email: "hung@email.com", ticketCode: "NE-2025-00005", ticketType: "Standard", status: "valid" },
  { id: "a6", name: "Bùi Thị Lan",    email: "lan@email.com",  ticketCode: "NE-2025-INVLD", ticketType: "—",        status: "invalid" },
];

function ciStatusCfg(status: CiStatus) {
  const map: Record<CiStatus, { label: string; color: string; bg: string; border: string; icon: React.ReactNode }> = {
    valid:        { label: "Hợp lệ",         color: T.successText, bg: T.successSubtle, border: T.successBorder, icon: <CheckCircle2 className="size-4" /> },
    "checked-in": { label: "Đã check-in",    color: T.primary, bg: `rgba(30,170,255,0.1)`, border: `rgba(30,170,255,0.3)`, icon: <BadgeCheck className="size-4" /> },
    "checked-out":{ label: "Đã check-out",   color: T.mutedFg, bg: T.secondary, border: T.border, icon: <UserX className="size-4" /> },
    invalid:      { label: "Không hợp lệ",   color: T.destructive, bg: `rgba(248,104,128,0.1)`, border: `rgba(248,104,128,0.3)`, icon: <X className="size-4" /> },
    cancelled:    { label: "Đã hủy",         color: T.destructive, bg: `rgba(248,104,128,0.1)`, border: `rgba(248,104,128,0.3)`, icon: <X className="size-4" /> },
  };
  return map[status];
}

function CiStatusPill({ status }: { status: CiStatus }) {
  const c = ciStatusCfg(status);
  return (
    <span style={{ fontSize: T.xs, fontWeight: T.fw_medium, padding: "2px 8px", borderRadius: "999px",
      color: c.color, backgroundColor: c.bg, whiteSpace: "nowrap" as const }}>{c.label}</span>
  );
}

function CiScanResult({ attendee, onCheckin, onCheckout, onReset }:
  { attendee: CiAttendee; onCheckin: () => void; onCheckout: () => void; onReset: () => void }) {
  const c = ciStatusCfg(attendee.status);
  return (
    <div className="rounded-2xl p-5 flex flex-col gap-4" style={{ backgroundColor: c.bg, border: `2px solid ${c.border}` }}>
      <div className="flex items-center gap-3">
        <span style={{ color: c.color }}>{c.icon}</span>
        <div>
          <p style={{ fontWeight: T.fw_semi, fontSize: T.base, color: c.color }}>{c.label}</p>
          <p style={{ fontSize: T.xs, color: T.mutedFg }}>Mã vé: {attendee.ticketCode}</p>
        </div>
      </div>
      <div className="flex items-center gap-3 p-3 rounded-xl" style={{ backgroundColor: T.background, border: `1px solid ${T.border}` }}>
        <Avatar className="size-10">
          <AvatarFallback style={{ backgroundColor: `rgba(30,170,255,0.12)`, color: T.primary, fontWeight: T.fw_semi, fontSize: T.sm }}>
            {attendee.name.split(" ").slice(-1)[0][0]}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <p style={{ fontSize: T.sm, fontWeight: T.fw_medium, color: T.foreground }}>{attendee.name}</p>
          <p style={{ fontSize: T.xs, color: T.mutedFg }}>{attendee.email}</p>
        </div>
        <span style={{ fontSize: T.xs, padding: "2px 8px", borderRadius: "6px",
          backgroundColor: T.secondary, color: T.mutedFg, border: `1px solid ${T.border}` }}>{attendee.ticketType}</span>
      </div>
      {(attendee.checkinTime || attendee.checkoutTime) && (
        <div className="flex gap-4">
          {attendee.checkinTime  && <span style={{ fontSize: T.xs, color: T.mutedFg }}>Check-in: {attendee.checkinTime}</span>}
          {attendee.checkoutTime && <span style={{ fontSize: T.xs, color: T.mutedFg }}>Check-out: {attendee.checkoutTime}</span>}
        </div>
      )}
      <div className="flex gap-2">
        {attendee.status === "valid"      && <Button className="flex-1" onClick={onCheckin}><UserCheck className="size-4" /> Check-in</Button>}
        {attendee.status === "checked-in" && <Button variant="outline" className="flex-1" onClick={onCheckout}><UserX className="size-4" /> Check-out</Button>}
        <Button variant="ghost" onClick={onReset}><RefreshCcw className="size-4" /> Scan tiếp</Button>
      </div>
    </div>
  );
}

function CiQRPanel({ onScan, onBack }: { onScan: (a: CiAttendee) => void; onBack: () => void }) {
  const [scanning, setScanning] = useState(false);
  const [idx, setIdx] = useState(0);
  const order = [CI_MOCK[0], CI_MOCK[1], CI_MOCK[5], CI_MOCK[2]];
  const handleScan = () => {
    setScanning(true);
    setTimeout(() => { onScan(order[idx % order.length]); setIdx((i) => i + 1); setScanning(false); }, 900);
  };
  return (
    <div className="flex flex-col items-center gap-6">
      <div className="relative w-full max-w-xs aspect-square rounded-2xl flex items-center justify-center overflow-hidden"
        style={{ backgroundColor: T.secondary, border: `2px dashed ${T.border}` }}>
        <div className="absolute inset-4 rounded-xl border-2 transition-colors"
          style={{ borderColor: scanning ? T.primary : T.border }} />
        {scanning ? (
          <div className="flex flex-col items-center gap-3">
            <div className="size-12 rounded-xl flex items-center justify-center animate-pulse" style={{ backgroundColor: `rgba(30,170,255,0.12)` }}>
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
        {[
          { top: "8px", left: "8px" }, { top: "8px", right: "8px" },
          { bottom: "8px", left: "8px" }, { bottom: "8px", right: "8px" },
        ].map((s, i) => (
          <div key={i} className="absolute size-5 border-2 rounded-sm" style={{ ...s, borderColor: T.primary }} />
        ))}
      </div>
      <div className="flex gap-3">
        <Button onClick={handleScan} disabled={scanning}>
          <QrCode className="size-4" /> {scanning ? "Đang scan..." : "Mô phỏng Scan QR"}
        </Button>
      </div>
      <p style={{ color: T.mutedFg, fontSize: T.xs }} className="text-center">
        Demo: bấm "Mô phỏng Scan QR" để thử các trạng thái vé
      </p>
    </div>
  );
}

function CiManualPanel() {
  const [search, setSearch] = useState("");
  const [list, setList] = useState(CI_MOCK);
  const filtered = search ? list.filter((a) =>
    a.name.toLowerCase().includes(search.toLowerCase()) ||
    a.email.toLowerCase().includes(search.toLowerCase()) ||
    a.ticketCode.toLowerCase().includes(search.toLowerCase())) : list;
  const handleCheckin = (id: string) => setList((p) => p.map((a) => a.id === id
    ? { ...a, status: "checked-in" as CiStatus, checkinTime: new Date().toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" }) } : a));
  return (
    <div className="flex flex-col gap-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4" style={{ color: T.mutedFg }} />
        <Input className="pl-9" placeholder="Tìm theo tên, email, mã vé..." value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>
      <div className="rounded-xl overflow-hidden flex flex-col divide-y" style={{ border: `1px solid ${T.border}`, backgroundColor: T.background }}>
        {filtered.length === 0 ? (
          <p className="py-10 text-center" style={{ color: T.mutedFg, fontSize: T.sm }}>Không tìm thấy người tham dự</p>
        ) : filtered.map((a) => (
          <div key={a.id} className="flex items-center gap-3 p-3">
            <Avatar className="size-9 shrink-0">
              <AvatarFallback style={{ backgroundColor: `rgba(30,170,255,0.12)`, color: T.primary, fontSize: T.xs, fontWeight: T.fw_semi }}>
                {a.name.split(" ").slice(-1)[0][0]}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p style={{ fontSize: T.sm, fontWeight: T.fw_medium, color: T.foreground }}>{a.name}</p>
              <p style={{ fontSize: T.xs, color: T.mutedFg }}>{a.ticketCode} · {a.ticketType}</p>
            </div>
            <CiStatusPill status={a.status} />
            {a.status === "valid" && (
              <Button size="sm" onClick={() => handleCheckin(a.id)}><UserCheck className="size-3.5" /> Check-in</Button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function CheckinTab() {
  const [panel, setPanel] = useState<"scan" | "manual">("scan");
  const [scanned, setScanned] = useState<CiAttendee | null>(null);
  const [checkedIn, setCheckedIn] = useState(182);
  const [checkedOut, setCheckedOut] = useState(34);
  const total = 250;

  const handleCheckin  = () => { if (!scanned) return; setScanned({ ...scanned, status: "checked-in",  checkinTime:  new Date().toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" }) }); setCheckedIn(c => c + 1); };
  const handleCheckout = () => { if (!scanned) return; setScanned({ ...scanned, status: "checked-out", checkoutTime: new Date().toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" }) }); setCheckedOut(c => c + 1); };

  const liveStats = [
    { label: "Tổng vé",    value: total,      color: T.foreground },
    { label: "Đã vào",     value: checkedIn,  color: T.primary },
    { label: "Chưa vào",   value: total - checkedIn - checkedOut, color: T.warningText },
    { label: "Đã ra",      value: checkedOut, color: T.mutedFg },
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* Live stats */}
      <div className="grid grid-cols-4 gap-3">
        {liveStats.map((s) => (
          <div key={s.label} className="rounded-xl p-3 text-center" style={{ backgroundColor: T.background, border: `1px solid ${T.border}` }}>
            <p style={{ fontSize: T.xl, fontWeight: T.fw_semi, color: s.color }}>{s.value}</p>
            <p style={{ fontSize: T.xs, color: T.mutedFg }}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* Mode tabs */}
      <div className="flex rounded-xl overflow-hidden" style={{ border: `1px solid ${T.border}`, backgroundColor: T.secondary }}>
        {([
          { id: "scan"   as const, label: "Scan QR",      icon: QrCode },
          { id: "manual" as const, label: "Tìm thủ công", icon: Search },
        ]).map((t) => (
          <button key={t.id} onClick={() => { setPanel(t.id); setScanned(null); }}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 transition-colors cursor-pointer"
            style={{
              fontSize: T.sm, fontWeight: panel === t.id ? T.fw_medium : T.fw_normal,
              backgroundColor: panel === t.id ? T.background : "transparent",
              color: panel === t.id ? T.foreground : T.mutedFg,
              margin: "3px", borderRadius: "8px",
            }}>
            <t.icon className="size-4" /> {t.label}
          </button>
        ))}
      </div>

      {/* Panel content */}
      {panel === "scan" ? (
        scanned
          ? <CiScanResult attendee={scanned} onCheckin={handleCheckin} onCheckout={handleCheckout} onReset={() => setScanned(null)} />
          : <CiQRPanel onScan={setScanned} onBack={() => {}} />
      ) : (
        <CiManualPanel />
      )}
    </div>
  );
}

// ── Workspace Tab Content ─────────────────────────────────────────────────────

export function WorkspaceTabContent({ tab, event, onEditDrawer, landingInitialView, onNavigateToLanding }: {
  tab: WorkspaceTab; event: EventDraft; onEditDrawer: () => void; landingInitialView?: "editor" | "preview"; onNavigateToLanding?: () => void;
}) {
  const theme = THEMES.find((t) => t.id === event.theme) ?? THEMES[1];

  if (tab === "overview") {
    const doneCount = CHECKLIST.filter((c) => c.done).length;
    return (
      <div className="flex flex-col gap-6">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Left: event preview card */}
          <div className="xl:col-span-2 flex flex-col gap-4">
            <Card>
              <div style={{ display: "flex", gap: 20, alignItems: "flex-start" }}>
                {/* Square cover */}
                <div style={{ width: 160, flexShrink: 0 }}>
                  <EventCoverSmall gradient={theme.gradient} style={{ width: 160, height: 160, aspectRatio: "unset", borderRadius: 12 }} />
                </div>
                {/* Info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12, marginBottom: 10 }}>
                    <div style={{ minWidth: 0 }}>
                      <h3 style={{ color: T.foreground, fontWeight: T.fw_semi, fontSize: T.lg, margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{event.name}</h3>
                      <p style={{ color: T.mutedFg, fontSize: T.sm, marginTop: "4px" }}>Đơn vị tổ chức sự kiện</p>
                    </div>
                    <span style={{
                      fontSize: T.xs, fontWeight: T.fw_semi, padding: "2px 10px", borderRadius: "999px",
                      backgroundColor: T.warningSubtle, color: T.warningText, border: `1px solid ${T.warningText}`,
                      whiteSpace: "nowrap", flexShrink: 0,
                    }}>Bản nháp</span>
                  </div>
                </div>
              </div>
            </Card>

            {/* When & Where card */}
            <Card>
              <div className="flex items-center justify-between mb-4">
                <p style={{ fontSize: T.base, fontWeight: T.fw_semi, color: T.foreground }}>Thời gian & Địa điểm</p>
                <Button size="sm" variant="outline" onClick={onEditDrawer}>
                  <Pencil className="size-3.5" /> Chỉnh sửa
                </Button>
              </div>
              <div className="flex flex-col gap-3">
                {[
                  { icon: Calendar, label: event.startDate ? `${event.startDate} · ${event.startTime} – ${event.endTime}` : "Chưa thiết lập" },
                  { icon: MapPin,   label: event.location || "Chưa thiết lập" },
                  { icon: Clock,    label: "GMT+07:00 — Việt Nam" },
                  { icon: Globe,    label: event.format === "offline" ? "Sự kiện offline" : event.format === "online" ? "Sự kiện online" : "Hybrid" },
                ].map((r, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="size-8 rounded-lg flex items-center justify-center shrink-0"
                      style={{ backgroundColor: T.secondary }}>
                      <r.icon className="size-4" style={{ color: T.mutedFg }} />
                    </div>
                    <span style={{ fontSize: T.sm, color: T.foreground }}>{r.label}</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Right: Setup checklist */}
          <div>
            <Card style={{ padding: "20px" }}>
              {/* Header */}
              <p style={{ fontSize: T.base, fontWeight: T.fw_semi, color: T.foreground, marginBottom: "4px" }}>
                Sẵn sàng xuất bản sự kiện
              </p>
              <p style={{ fontSize: T.xs, color: T.mutedFg, marginBottom: "14px" }}>
                Hoàn tất các mục bắt buộc để công khai sự kiện.
              </p>

              {/* Progress */}
              <div className="flex items-center gap-3 mb-4">
                <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: T.secondary }}>
                  <div className="h-full rounded-full transition-all"
                    style={{ width: `${(1 / 2) * 100}%`, backgroundColor: T.primary }} />
                </div>
                <span style={{ fontSize: T.xs, color: T.mutedFg, whiteSpace: "nowrap" as const }}>
                  1/2 điều kiện bắt buộc đã hoàn tất
                </span>
              </div>

              {/* Section 1: Bắt buộc */}
              <p style={{ fontSize: T.xs, fontWeight: T.fw_semi, color: T.mutedFg,
                textTransform: "uppercase" as const, letterSpacing: "0.05em", marginBottom: "8px" }}>
                Bắt buộc để xuất bản
              </p>

              {([
                { done: true,  label: "Thông tin sự kiện", desc: "Tên sự kiện, thời gian, địa điểm và đơn vị tổ chức.", action: "Chỉnh sửa" },
                { done: false, label: "Trang sự kiện",     desc: "Cần có nội dung giới thiệu, ảnh hiển thị và link public.", action: "Hoàn thiện trang" },
              ]).map((item, i) => (
                <div key={i} className="flex items-start gap-3 py-3"
                  style={{ borderBottom: i < 1 ? `1px solid ${T.border}` : "none" }}>
                  <div className="shrink-0 mt-0.5">
                    {item.done
                      ? <CheckCircle2 className="size-4" style={{ color: T.successText }} />
                      : <Circle className="size-4" style={{ color: T.border }} />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p style={{ fontSize: T.sm, fontWeight: item.done ? T.fw_normal : T.fw_medium,
                      color: item.done ? T.mutedFg : T.foreground }}>
                      {item.label}
                    </p>
                    <p style={{ fontSize: T.xs, color: T.mutedFg, marginTop: "2px", lineHeight: 1.5 }}>{item.desc}</p>
                  </div>
                  <Button size="sm" variant={item.done ? "ghost" : "outline"}
                    onClick={onEditDrawer}
                    style={{ fontSize: T.xs, flexShrink: 0 }}>
                    {item.action}
                  </Button>
                </div>
              ))}

              {/* Section 2: Công cụ hỗ trợ */}
              <p style={{ fontSize: T.xs, fontWeight: T.fw_semi, color: T.mutedFg,
                textTransform: "uppercase" as const, letterSpacing: "0.05em", marginBottom: "8px" }}>
                Công cụ hỗ trợ
              </p>
              <div className="flex items-start gap-3 pb-4" style={{ borderBottom: `1px solid ${T.border}` }}>
                <Eye className="size-4 shrink-0 mt-0.5" style={{ color: T.mutedFg }} />
                <div className="flex-1 min-w-0">
                  <p style={{ fontSize: T.sm, fontWeight: T.fw_medium, color: T.foreground }}>Xem trước trang</p>
                  <p style={{ fontSize: T.xs, color: T.mutedFg, marginTop: "2px" }}>
                    Kiểm tra giao diện trang sự kiện trước khi công khai.
                  </p>
                </div>
                <Button size="sm" variant="outline" style={{ fontSize: T.xs, flexShrink: 0 }}
                  onClick={onNavigateToLanding}>
                  Xem trước
                </Button>
              </div>

              {/* Email auto note */}
              <div className="mt-4 rounded-xl p-3 flex items-start gap-2"
                style={{ backgroundColor: `rgba(30,170,255,0.06)`, border: `1px solid rgba(30,170,255,0.15)` }}>
                <AlertCircle className="size-3.5 shrink-0 mt-0.5" style={{ color: T.primary }} />
                <p style={{ fontSize: T.xs, color: T.mutedFg, lineHeight: 1.5 }}>
                  Email xác nhận kèm mã QR sẽ được gửi tự động sau khi người tham dự đăng ký hoặc mua vé thành công.
                </p>
              </div>

              {/* Publish CTA */}
              <div className="mt-4 flex flex-col gap-2">
                <Button className="w-full" disabled onClick={onEditDrawer}>
                  Xuất bản sự kiện
                </Button>
                <p style={{ fontSize: T.xs, color: T.mutedFg, textAlign: "center" as const, lineHeight: 1.5 }}>
                  Cần hoàn tất Trang sự kiện trước khi xuất bản.
                </p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  // Landing Page tab — full flow
  if (tab === "landing") return <LandingPageTab event={event as any} initialView={landingInitialView ?? "empty"} />;

  // Ticket Inventory tab — full flow
  if (tab === "tickets") return <TicketInventoryTab event={event as any} />;

  // Attendees tab — full flow
  if (tab === "attendees") return <AttendeesTab event={event as any} />;

  // Check-in tab — full flow
  if (tab === "checkin") return <CheckinTab />;

  // Mini Game tab — full flow
  if (tab === "minigame") return <MiniGameTab event={event as any} />;

  // Empty state for other tabs
  const tabInfo: Record<string, { title: string; desc: string; cta: string; icon: React.FC<{ className?: string }> }> = {
    landing:   { title: "Chưa có trang sự kiện",   desc: "Tạo trang để giới thiệu sự kiện, hiển thị vé và nhận đăng ký.",                cta: "Tạo trang sự kiện", icon: Globe },
    form:      { title: "Chưa có Form đăng ký",    desc: "Tạo form để thu thông tin người tham dự.",                                       cta: "Tạo form đăng ký",  icon: FileText },
    tickets:   { title: "Sự kiện này chưa có Kho vé", desc: "Tạo kho vé để thiết lập các hạng vé và hiển thị trên trang sự kiện.",       cta: "Tạo Kho vé",        icon: Ticket },
    attendees: { title: "Chưa có người tham dự",   desc: "Danh sách người tham dự sẽ hiển thị khi sự kiện được publish và có đăng ký.",  cta: "Thêm thủ công",     icon: Users },
    email:     { title: "Chưa cấu hình email",     desc: "Cấu hình email xác nhận để gửi tự động khi người dùng đăng ký thành công.",    cta: "Cấu hình email",    icon: Mail },
    checkin:   { title: "Chưa có dữ liệu check-in",desc: "Check-in sẽ khả dụng khi sự kiện được publish và có người tham dự đăng ký.",   cta: "Mở máy quét QR",   icon: QrCode },
    reports:   { title: "Chưa có báo cáo",         desc: "Báo cáo sẽ hiển thị sau khi sự kiện có người tham dự và hoạt động.",           cta: "Xem hướng dẫn",     icon: BarChart3 },
    settings:  { title: "Cài đặt sự kiện",         desc: "Cấu hình nâng cao, URL tùy chỉnh, phân quyền Staff và cài đặt khác.",           cta: "Cấu hình",          icon: Settings },
  };
  const info = tabInfo[tab];
  if (!info) return null;
  const Icon = info.icon;

  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="size-16 rounded-2xl flex items-center justify-center mb-5"
        style={{ backgroundColor: `color-mix(in srgb, ${T.primary} 10%, transparent)` }}>
        <Icon className="size-8" style={{ color: T.primary } as React.CSSProperties} />
      </div>
      <h3 style={{ fontSize: T.xl, fontWeight: T.fw_semi, color: T.foreground, marginBottom: "8px" }}>{info.title}</h3>
      <p style={{ fontSize: T.sm, color: T.mutedFg, maxWidth: "360px", lineHeight: 1.6, marginBottom: "20px" }}>{info.desc}</p>
      <Button>{info.cta}</Button>
    </div>
  );
}

function EventWorkspaceScreen({
  event,
  onBack,
}: {
  event: EventDraft;
  onBack: () => void;
}) {
  const [activeTab, setActiveTab] = useState<WorkspaceTab>("overview");
  const [editOpen, setEditOpen] = useState(false);
  const [landingInitialView, setLandingInitialView] = useState<"editor" | "preview" | undefined>(undefined);
  const [editForm, setEditForm] = useState({ name: event.name, description: event.description, location: event.location });
  const theme = THEMES.find((t) => t.id === event.theme) ?? THEMES[1];

  const [publishConfirmOpen, setPublishConfirmOpen] = useState(false);
  const [published, setPublished] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);
  const canPublish = true; // preview is optional; publish available once event info is done

  return (
    <div className="flex flex-col gap-0 max-w-full">
      {/* Topbar */}
      <div className="flex flex-col gap-3 mb-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-1.5" style={{ fontSize: T.xs, color: T.mutedFg }}>
          <button onClick={onBack} className="hover:underline cursor-pointer" style={{ color: T.primary }}>Sự kiện</button>
          <ChevronRight className="size-3" />
          <span className="truncate">{event.name}</span>
        </div>

        {/* Title row */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="size-10 rounded-xl shrink-0" style={{ background: theme.gradient }} />
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 style={{ color: T.foreground, fontSize: T["2xl"], fontWeight: T.fw_semi }} className="truncate">
                  {event.name}
                </h2>
                <span style={{
                  fontSize: T.xs, fontWeight: T.fw_semi, padding: "2px 10px", borderRadius: "999px",
                  backgroundColor: T.warningSubtle, color: T.warningText, border: `1px solid ${T.warningText}`,
                  whiteSpace: "nowrap" as const,
                }}>Bản nháp</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Button size="sm" onClick={() => setPublishConfirmOpen(true)}>
              Xuất bản
            </Button>
          </div>
        </div>

      </div>

      {/* Workspace tabs */}
      <div className="flex gap-5 overflow-x-auto mb-6 pb-0" style={{ borderBottom: `1px solid ${T.border}` }}>
        {(["overview", "tickets", "landing", "minigame", "attendees", "checkin", "email", "settings", "reports"] as WorkspaceTab[])
          .map((id) => WORKSPACE_TABS.find((tab) => tab.id === id)!)
          .filter((tab) => tab && !["form", "email", "settings", "reports"].includes(tab.id))
          .map((tab) => (
            <WorkspaceTabButton key={tab.id} tab={tab} active={activeTab === tab.id} onClick={() => setActiveTab(tab.id)} />
          ))}
      </div>

      {/* Tab content */}
      <WorkspaceTabContent tab={activeTab} event={event} onEditDrawer={() => setEditOpen(true)} landingInitialView={landingInitialView} onNavigateToLanding={() => { setLandingInitialView("preview"); setActiveTab("landing"); }} />

      {/* Edit popup */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="sm:max-w-[520px] max-h-[90vh] overflow-y-auto" aria-describedby={undefined}>
          <DialogHeader>
            <DialogTitle>Chỉnh sửa sự kiện</DialogTitle>
          </DialogHeader>

          <div className="flex flex-col gap-6 py-6">
            {/* Thông tin cơ bản */}
            <div className="flex flex-col gap-4">
              <p style={{ fontSize: T.sm, fontWeight: T.fw_semi, color: T.foreground }}>Thông tin cơ bản</p>
              <div className="flex flex-col gap-1.5">
                <Label>Tên sự kiện</Label>
                <Input value={editForm.name} onChange={(e) => setEditForm((f) => ({ ...f, name: e.target.value }))} />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label>Mô tả</Label>
                <Textarea rows={3} value={editForm.description}
                  onChange={(e) => setEditForm((f) => ({ ...f, description: e.target.value }))}
                  placeholder="Mô tả ngắn về sự kiện" />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label>Đơn vị tổ chức</Label>
                <Input defaultValue="NetEvent Demo" />
              </div>
            </div>

            <div style={{ borderTop: `1px solid ${T.border}` }} />

            {/* Thời gian & Địa điểm */}
            <div className="flex flex-col gap-4">
              <p style={{ fontSize: T.sm, fontWeight: T.fw_semi, color: T.foreground }}>Thời gian & Địa điểm</p>
              {[
                { label: "Ngày bắt đầu", type: "date", val: event.startDate },
                { label: "Giờ bắt đầu", type: "time", val: event.startTime },
                { label: "Ngày kết thúc", type: "date", val: event.endDate },
                { label: "Giờ kết thúc", type: "time", val: event.endTime },
              ].map((f) => (
                <div key={f.label} className="flex flex-col gap-1.5">
                  <Label>{f.label}</Label>
                  <Input type={f.type} defaultValue={f.val} />
                </div>
              ))}
              <div className="flex flex-col gap-1.5">
                <Label>Múi giờ</Label>
                <Select defaultValue="gmt7">
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent><SelectItem value="gmt7">GMT+07:00 — Việt Nam</SelectItem></SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-1.5">
                <Label>Địa điểm / Link online</Label>
                <Input value={editForm.location} onChange={(e) => setEditForm((f) => ({ ...f, location: e.target.value }))}
                  placeholder="Nhập địa điểm hoặc link online" />
              </div>
            </div>

            <div style={{ borderTop: `1px solid ${T.border}` }} />

            {/* Giao diện */}
            <div className="flex flex-col gap-4">
              <p style={{ fontSize: T.sm, fontWeight: T.fw_semi, color: T.foreground }}>Giao diện</p>
              <div className="flex gap-2 flex-wrap">
                {THEMES.map((th) => (
                  <button key={th.id} data-pill="off" className="flex flex-col items-center gap-1.5">
                    <div className="w-12 h-8 rounded-lg"
                      style={{ background: th.gradient, outline: th.id === event.theme ? `2px solid ${T.primary}` : "2px solid transparent", outlineOffset: "2px" }} />
                    <span style={{ fontSize: T.xs, color: T.mutedFg }}>{th.label}</span>
                  </button>
                ))}
              </div>
              <div className="flex flex-col gap-1.5">
                <Label>Ảnh cover</Label>
                <div className="border-2 border-dashed rounded-xl p-6 flex flex-col items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
                  style={{ borderColor: T.border }}>
                  <Upload className="size-6" style={{ color: T.mutedFg }} />
                  <p style={{ fontSize: T.xs, color: T.mutedFg }}>Kéo thả hoặc click để tải ảnh</p>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <DialogClose asChild><Button variant="outline">Hủy</Button></DialogClose>
            <Button onClick={() => setEditOpen(false)}>Cập nhật sự kiện</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Publish confirm dialog ── */}
      <Dialog open={publishConfirmOpen} onOpenChange={(o) => !o && setPublishConfirmOpen(false)}>
        <DialogContent className="sm:max-w-[440px]" aria-describedby={undefined}>
          {!published ? (
            <>
              <DialogHeader>
                <DialogTitle>Xuất bản sự kiện?</DialogTitle>
                <DialogDescription>
                  Sau khi xuất bản, trang sự kiện sẽ công khai và người tham dự có thể đăng ký. Bạn vẫn có thể chỉnh sửa thông tin sau khi xuất bản.
                </DialogDescription>
              </DialogHeader>
              <div className="rounded-xl p-4 flex flex-col gap-2 my-1"
                style={{ backgroundColor: T.secondary, border: `1px solid ${T.border}` }}>
                <p style={{ fontSize: T.sm, fontWeight: T.fw_medium, color: T.foreground }}>{event.name}</p>
                <p style={{ fontSize: T.xs, color: T.mutedFg }}>
                  {event.startDate ? `${event.startDate} · ` : ""}{event.location || "Chưa có địa điểm"}
                </p>
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">Hủy</Button>
                </DialogClose>
                <Button onClick={() => { setPublished(true); setLinkCopied(false); }}>
                  Xuất bản ngay
                </Button>
              </DialogFooter>
            </>
          ) : (
            <>
              {/* Success header */}
              <div className="flex flex-col items-center gap-3 pt-2 pb-1 text-center">
                <div className="size-12 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: T.successSubtle, border: `2px solid ${T.successBorder}` }}>
                  <CheckCircle2 className="size-6" style={{ color: T.successText }} />
                </div>
                <div>
                  <p style={{ fontSize: T.base, fontWeight: T.fw_semi, color: T.foreground }}>Sự kiện đã được xuất bản!</p>
                  <p style={{ fontSize: T.xs, color: T.mutedFg, marginTop: "4px" }}>
                    Trang sự kiện hiện đang công khai và mở đăng ký.
                  </p>
                </div>
              </div>

              {/* URL copy box */}
              <div className="flex items-center gap-2 rounded-xl px-3 py-2.5"
                style={{ backgroundColor: T.secondary, border: `1px solid ${T.border}` }}>
                <Link2 className="size-3.5 shrink-0" style={{ color: T.mutedFg }} />
                <span className="flex-1 truncate" style={{ fontSize: T.xs, color: T.foreground }}>
                  netevent.vn/e/{(event.name || "su-kien").toLowerCase().replace(/\s+/g, "-").slice(0, 28)}
                </span>
                <button
                  onClick={() => {
                    navigator.clipboard?.writeText(`https://netevent.vn/e/${(event.name || "su-kien").toLowerCase().replace(/\s+/g, "-").slice(0, 28)}`).catch(() => {});
                    setLinkCopied(true);
                    setTimeout(() => setLinkCopied(false), 2000);
                  }}
                  className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 transition-all shrink-0"
                  style={{
                    backgroundColor: linkCopied ? T.successSubtle : T.background,
                    border: `1px solid ${linkCopied ? T.successBorder : T.border}`,
                    color: linkCopied ? T.successText : T.foreground,
                    fontSize: T.xs, fontWeight: T.fw_medium, cursor: "pointer",
                  }}>
                  {linkCopied
                    ? <><CheckCircle2 className="size-3.5" /> Đã sao chép</>
                    : <><Copy className="size-3.5" /> Sao chép</>}
                </button>
              </div>

              {/* Social share */}
              <div className="flex flex-col gap-2">
                <p style={{ fontSize: T.xs, color: T.mutedFg }}>Chia sẻ sự kiện</p>
                <div className="flex gap-2">
                  {/* Facebook */}
                  <button
                    onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent("https://netevent.vn/e/" + (event.name || "su-kien").toLowerCase().replace(/\s+/g, "-").slice(0, 28))}`, "_blank")}
                    className="flex-1 flex items-center justify-center gap-2 rounded-xl py-2.5 transition-all hover:opacity-80"
                    style={{ backgroundColor: "#1877F2", border: "none", cursor: "pointer" }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                    <span style={{ fontSize: T.xs, fontWeight: T.fw_medium, color: "white" }}>Facebook</span>
                  </button>

                  {/* X / Twitter */}
                  <button
                    onClick={() => window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent("https://netevent.vn/e/" + (event.name || "su-kien").toLowerCase().replace(/\s+/g, "-").slice(0, 28))}&text=${encodeURIComponent(event.name || "Sự kiện")}`, "_blank")}
                    className="flex-1 flex items-center justify-center gap-2 rounded-xl py-2.5 transition-all hover:opacity-80"
                    style={{ backgroundColor: T.foreground, border: "none", cursor: "pointer" }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill={T.background}>
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.835L1.254 2.25H8.08l4.259 5.63 5.905-5.63zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                    </svg>
                    <span style={{ fontSize: T.xs, fontWeight: T.fw_medium, color: T.background }}>X (Twitter)</span>
                  </button>

                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => { setPublishConfirmOpen(false); setPublished(false); }}>
                  Đóng
                </Button>
                <Button variant="outline" onClick={() => window.open("/demo", "_blank")} style={{ fontSize: T.xs }}>
                  <ExternalLink className="size-3.5" /> Xem trang sự kiện
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ── Root EventsPage ───────────────────────────────────────────────────────────

export function EventsPage({ screen: externalScreen, onScreenChange }: { screen?: EventScreen; onScreenChange?: (s: EventScreen) => void } = {}) {
  const navigate = useNavigate();
  const { setEvent: setCurrentEvent } = useCurrentEvent();
  const [localScreen, setLocalScreen] = useState<EventScreen>("list");
  const screen = externalScreen ?? localScreen;
  const setScreen = (s: EventScreen) => { setLocalScreen(s); onScreenChange?.(s); };
  const [activeEvent, setActiveEvent] = useState<EventDraft | null>(null);
  const [timelineEvents, setTimelineEvents] = useState<TimelineEvent[]>(MOCK_TIMELINE_EVENTS);

  const handleCreated = (ev: EventDraft) => {
    // Sự kiện vừa tạo trở thành sự kiện đang xem, để workspace và trang sự
    // kiện dùng đúng theme / quyền riêng tư / giá vé người dùng vừa chọn.
    setCurrentEvent(ev);
    const newTimelineEvent: TimelineEvent = {
      id: ev.id,
      name: ev.name,
      status: "draft",
      startDate: ev.startDate || "2026-08-01",
      startTime: ev.startTime,
      endTime: ev.endTime,
      location: ev.location || "Chưa thiết lập",
      format: ev.format === "hybrid" ? "offline" : ev.format,
      registrations: 0,
      checkedIn: 0,
      cover: ev.cover,
      checklistDone: 1,
      checklistTotal: 6,
    };
    setTimelineEvents((prev) => [...prev, newTimelineEvent]);
    navigate("/event");
  };

  const handleManage = (_ev: TimelineEvent) => {
    navigate("/event");
  };

  if (screen === "create") return <CreateEventScreen onCancel={() => setScreen("list")} onCreated={handleCreated} />;
  return (
    <EventsListScreen
      events={timelineEvents}
      onCreateEvent={() => setScreen("create")}
      onManage={handleManage}
    />
  );
}

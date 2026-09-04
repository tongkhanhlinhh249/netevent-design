import * as React from "react";
import { useState, useRef, useEffect } from "react";
import { Outlet, useLocation, useNavigate, useMatch } from "react-router";
import { DEMO_EVENT } from "../../data/mockEvent";
import { EventsPage } from "./EventsPage";
import { AccountOverview } from "./AccountOverview";
import {
  LayoutDashboard, Users, Calendar, Settings, LogOut, Bell, Search,
  MoreHorizontal, UserPlus, Shield, UserX, UserCheck, Send,
  CheckCircle2, Clock, AlertCircle, Crown, UserCog, UserMinus, BarChart3,
  X, Plus, ChevronRight, Lock, Unlock, Trash2, Eye, RefreshCcw,
  Globe, Ticket, MapPin, CreditCard, Cpu, Filter,
  PanelLeftClose, PanelLeftOpen,
} from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "../ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter, SheetClose } from "../ui/sheet";
import { Checkbox } from "../ui/checkbox";
import { cn } from "../ui/utils";
import { Menu } from "lucide-react";

type UserRole = "owner" | "admin" | "staff";
type MemberStatus = "active" | "invited" | "suspended";
type EventRole = "admin" | "staff";

interface EventAssignment {
  eventId: string; eventName: string; eventDate: string; eventStatus: string;
  role: EventRole; permissions: string[]; assignmentStatus: "active" | "invited";
}

interface Member {
  id: string; name: string; email: string; role: UserRole;
  status: MemberStatus; eventCount: string; joinedAt: string; lastActive: string;
  assignments: EventAssignment[];
}

interface AdminDashboardProps { currentRole: UserRole; onLogout: () => void; }

const MOCK_MEMBERS: Member[] = [
  { id: "1", name: "Nguyễn Thị Lan",  email: "owner@netevent.vn",    role: "owner", status: "active",    eventCount: "Toàn bộ sự kiện", joinedAt: "12/01/2024", lastActive: "Hôm nay",       assignments: [] },
  { id: "2", name: "Trần Văn Minh",   email: "admin@netevent.vn",    role: "admin", status: "active",    eventCount: "5 sự kiện",       joinedAt: "15/03/2024", lastActive: "Hôm nay",
    assignments: [
      { eventId: "e1", eventName: "Hội thảo AI 2025",    eventDate: "20/08/2026", eventStatus: "Đã publish", role: "admin", permissions: ["Quản lý sự kiện"], assignmentStatus: "active" },
      { eventId: "e2", eventName: "Tech Summit",          eventDate: "12/09/2026", eventStatus: "Bản nháp",   role: "staff", permissions: ["Check-in", "Check-out"], assignmentStatus: "active" },
      { eventId: "e3", eventName: "Sun Festival 2026",    eventDate: "01/08/2026", eventStatus: "Đã publish", role: "staff", permissions: ["Check-in"], assignmentStatus: "invited" },
    ]
  },
  { id: "3", name: "Phạm Đức Anh",    email: "staff@netevent.vn",    role: "staff", status: "active",    eventCount: "2 sự kiện",       joinedAt: "01/06/2024", lastActive: "30/06/2026",
    assignments: [
      { eventId: "e1", eventName: "Hội thảo AI 2025",    eventDate: "20/08/2026", eventStatus: "Đã publish", role: "staff", permissions: ["Check-in"], assignmentStatus: "active" },
      { eventId: "e2", eventName: "Tech Summit",          eventDate: "12/09/2026", eventStatus: "Bản nháp",   role: "staff", permissions: ["Check-in", "Check-out"], assignmentStatus: "active" },
    ]
  },
  { id: "4", name: "Hoàng Thị Mai",   email: "mai.hoang@company.vn", role: "staff", status: "invited",   eventCount: "1 sự kiện",       joinedAt: "—",          lastActive: "—",             assignments: [
    { eventId: "e3", eventName: "Sun Festival 2026",    eventDate: "01/08/2026", eventStatus: "Đã publish", role: "staff", permissions: ["Check-in"], assignmentStatus: "invited" },
  ]},
  { id: "5", name: "Vũ Quang Huy",    email: "huy.vu@company.vn",    role: "admin", status: "suspended", eventCount: "3 sự kiện",       joinedAt: "10/02/2024", lastActive: "10/06/2026",    assignments: [] },
  { id: "6", name: "Bùi Thị Ngọc",   email: "ngoc.bui@company.vn",  role: "staff", status: "invited",   eventCount: "Chưa phân công",  joinedAt: "—",          lastActive: "—",             assignments: [] },
];

const MOCK_EVENTS = ["Hội thảo AI 2025", "Tech Summit", "Sun Festival 2026", "NetEvent Demo Conference 2026"];

// ── Design tokens (CSS vars) ──────────────────────────────────────────────────

const T = {
  pageSurface:   "var(--page-surface)",
  pageBorder:    "var(--page-border)",
  primary:       "var(--primary)",
  primaryFg:     "var(--primary-foreground)",
  secondary:     "var(--secondary)",
  border:        "var(--border)",
  foreground:    "var(--foreground)",
  mutedFg:       "var(--muted-foreground)",
  background:    "var(--background)",
  destructive:   "var(--destructive)",
  accent:        "var(--accent)",
  accentFg:      "var(--accent-foreground)",
  // status
  successSubtle: "var(--success-subtle)",
  successText:   "var(--success-text)",
  successBorder: "var(--success-border)",
  warningSubtle: "var(--warning-subtle)",
  warningText:   "var(--warning-text)",
  warningBorder: "var(--warning-border)",
  // font weights
  fw_normal:     "var(--font-weight-normal)",
  fw_medium:     "var(--font-weight-medium)",
  fw_semi:       "var(--font-weight-semibold)",
  fw_bold:       "var(--font-weight-bold)",
  // sizes
  xs:  "var(--text-xs)",
  sm:  "var(--text-sm)",
  base:"var(--text-base)",
  lg:  "var(--text-lg)",
  xl:  "var(--text-xl)",
};

// ── Stats ─────────────────────────────────────────────────────────────────────

const STATS = [
  {
    label: "Tổng thành viên", value: "7", icon: Users,
    iconColor: T.primary, iconBg: `color-mix(in srgb, ${T.primary} 12%, transparent)`,
  },
  {
    label: "Đang hoạt động", value: "4", icon: CheckCircle2,
    iconColor: T.successText, iconBg: T.successSubtle,
  },
  {
    label: "Chờ kích hoạt", value: "2", icon: Clock,
    iconColor: T.warningText, iconBg: T.warningSubtle,
  },
  {
    label: "Bị tạm khóa", value: "1", icon: AlertCircle,
    iconColor: T.destructive, iconBg: `color-mix(in srgb, ${T.destructive} 10%, transparent)`,
  },
];

// ── Status badge ──────────────────────────────────────────────────────────────

const STATUS_STYLE: Record<MemberStatus, { label: string; bg: string; color: string; border: string }> = {
  active:    { label: "Hoạt động",     bg: T.successSubtle,                                           color: T.successText,   border: T.successBorder },
  invited:   { label: "Chờ chấp nhận", bg: T.warningSubtle,                                           color: T.warningText,   border: T.warningBorder },
  suspended: { label: "Tạm khóa",      bg: `color-mix(in srgb, ${T.destructive} 10%, transparent)`,  color: T.destructive,   border: `color-mix(in srgb, ${T.destructive} 30%, transparent)` },
};

function StatusBadge({ status }: { status: MemberStatus }) {
  const s = STATUS_STYLE[status];
  return (
    <span style={{
      backgroundColor: s.bg, color: s.color, borderColor: s.border,
      fontSize: T.xs, fontWeight: T.fw_medium,
      border: "1px solid", borderRadius: "999px", padding: "2px 8px", display: "inline-flex", alignItems: "center",
    }}>
      {s.label}
    </span>
  );
}

// ── Role badge ────────────────────────────────────────────────────────────────

function RoleBadge({ role }: { role: UserRole }) {
  const map: Record<UserRole, { label: string; icon: React.ReactNode; bg: string; color: string; border: string }> = {
    owner: { label: "Chủ tài khoản",     icon: <Crown className="size-3" />, bg: T.accent, color: T.accentFg, border: T.accent },
    admin: { label: "Quản trị sự kiện", icon: <Shield className="size-3" />, bg: `color-mix(in srgb, ${T.primary} 10%, transparent)`, color: T.primary, border: `color-mix(in srgb, ${T.primary} 25%, transparent)` },
    staff: { label: "Nhân sự sự kiện",  icon: <UserCog className="size-3" />, bg: T.secondary, color: T.mutedFg, border: T.border },
  };
  const m = map[role];
  return (
    <span style={{
      backgroundColor: m.bg, color: m.color, borderColor: m.border,
      fontSize: T.xs, fontWeight: T.fw_medium,
      border: "1px solid", borderRadius: "999px", padding: "2px 8px",
      display: "inline-flex", alignItems: "center", gap: "4px",
    }}>
      {m.icon} {m.label}
    </span>
  );
}

// ── Avatar ────────────────────────────────────────────────────────────────────

function MemberAvatar({ name }: { name: string }) {
  const initials = name.split(" ").slice(-2).map((w) => w[0]).join("").toUpperCase();
  return (
    <Avatar className="size-9">
      <AvatarFallback style={{
        backgroundColor: `color-mix(in srgb, ${T.primary} 12%, transparent)`,
        color: T.primary, fontSize: T.xs, fontWeight: T.fw_semi,
      }}>{initials}</AvatarFallback>
    </Avatar>
  );
}

// ── Invite Dialog ─────────────────────────────────────────────────────────────

function InviteDialog({ open, onClose, canInviteAdmin }: { open: boolean; onClose: () => void; canInviteAdmin: boolean }) {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"admin" | "staff">("staff");
  const [selectedEvents, setSelectedEvents] = useState<string[]>([]);
  const [step, setStep] = useState<"form" | "sent">("form");
  const [emailError, setEmailError] = useState("");

  const toggleEvent = (ev: string) =>
    setSelectedEvents((p) => p.includes(ev) ? p.filter((e) => e !== ev) : [...p, ev]);

  const handleSend = () => {
    if (!email) { setEmailError("Vui lòng nhập email."); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setEmailError("Email không hợp lệ."); return; }
    setStep("sent");
  };

  const handleClose = () => {
    setEmail(""); setRole("staff"); setSelectedEvents([]); setStep("form"); setEmailError("");
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && handleClose()}>
      <DialogContent className="sm:max-w-md">
        {step === "form" ? (
          <>
            <DialogHeader>
              <DialogTitle>Mời thành viên mới</DialogTitle>
              <DialogDescription>Gửi lời mời qua email. Lời mời có hiệu lực trong 7 ngày.</DialogDescription>
            </DialogHeader>
            <div className="flex flex-col gap-4 py-2">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="invite-email">Email</Label>
                <Input id="invite-email" type="email" placeholder="email@company.com"
                  value={email} onChange={(e) => { setEmail(e.target.value); setEmailError(""); }}
                  aria-invalid={!!emailError} />
                {emailError && <p style={{ color: T.destructive, fontSize: T.xs }}>{emailError}</p>}
              </div>
              <div className="flex flex-col gap-1.5">
                <Label>Vai trò</Label>
                <Select value={role} onValueChange={(v) => setRole(v as "admin" | "staff")}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {canInviteAdmin && <SelectItem value="admin">Admin</SelectItem>}
                    <SelectItem value="staff">Event Staff</SelectItem>
                  </SelectContent>
                </Select>
                <p style={{ color: T.mutedFg, fontSize: T.xs }}>
                  {role === "admin"
                    ? "Admin có thể quản lý sự kiện, landing page, form, kho vé và báo cáo."
                    : "Event Staff chỉ được truy cập chức năng Check-in / Check-out."}
                </p>
              </div>
              {role === "staff" && (
                <div className="flex flex-col gap-2">
                  <Label>Phân công sự kiện</Label>
                  <div className="flex flex-col gap-1.5 p-3 rounded-xl max-h-40 overflow-y-auto"
                    style={{ backgroundColor: T.secondary, border: `1px solid ${T.border}` }}>
                    {MOCK_EVENTS.map((ev) => (
                      <label key={ev} className="flex items-center gap-2.5 cursor-pointer">
                        <input type="checkbox" checked={selectedEvents.includes(ev)}
                          onChange={() => toggleEvent(ev)} className="accent-primary size-3.5" />
                        <span style={{ fontSize: T.sm }}>{ev}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <DialogFooter>
              <DialogClose asChild><Button variant="outline">Hủy</Button></DialogClose>
              <Button onClick={handleSend}><Send className="size-4" /> Gửi lời mời</Button>
            </DialogFooter>
          </>
        ) : (
          <div className="flex flex-col items-center py-6 text-center gap-4">
            <div className="size-16 rounded-full flex items-center justify-center"
              style={{ backgroundColor: T.successSubtle, border: `1px solid ${T.successBorder}` }}>
              <CheckCircle2 className="size-8" style={{ color: T.successText }} />
            </div>
            <div>
              <p style={{ fontWeight: T.fw_semi, fontSize: T.base, color: T.foreground }} className="mb-1">Đã gửi lời mời!</p>
              <p style={{ fontSize: T.sm, color: T.mutedFg }}>
                Lời mời đã được gửi đến <span style={{ fontWeight: T.fw_semi }}>{email}</span> với vai trò{" "}
                <span style={{ fontWeight: T.fw_semi }}>{role === "admin" ? "Admin" : "Event Staff"}</span>.
              </p>
            </div>
            <Button onClick={handleClose}>Đóng</Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

// ── Confirm Dialog ────────────────────────────────────────────────────────────

function ConfirmDialog({ open, onClose, onConfirm, title, description, confirmLabel, variant = "destructive" }:
  { open: boolean; onClose: () => void; onConfirm: () => void; title: string; description: string; confirmLabel: string; variant?: "destructive" | "default" }) {
  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild><Button variant="outline">Hủy</Button></DialogClose>
          <Button variant={variant} onClick={() => { onConfirm(); onClose(); }}>{confirmLabel}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ── Member Row Actions ────────────────────────────────────────────────────────

function MemberRowActions({ member, currentRole, onSuspend, onActivate, onRemove, onResend }:
  { member: Member; currentRole: UserRole; onSuspend: () => void; onActivate: () => void; onRemove: () => void; onResend: () => void }) {
  if (member.role === "owner") return null;
  const canAct = currentRole === "owner";
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="size-8"><MoreHorizontal className="size-4" /></Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-44">
        {member.status === "invited" && (
          <DropdownMenuItem onClick={onResend}><Send className="size-3.5 mr-2" /> Gửi lại mời</DropdownMenuItem>
        )}
        {member.status === "active" && canAct && (
          <DropdownMenuItem onClick={onSuspend}><UserX className="size-3.5 mr-2" /> Tạm khóa</DropdownMenuItem>
        )}
        {member.status === "suspended" && canAct && (
          <DropdownMenuItem onClick={onActivate}><UserCheck className="size-3.5 mr-2" /> Kích hoạt lại</DropdownMenuItem>
        )}
        {canAct && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={onRemove}>
              <UserMinus className="size-3.5 mr-2" /> Xóa khỏi account
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// ── Member Management Page ────────────────────────────────────────────────────

// ── Nhóm quyền ────────────────────────────────────────────────────────────────

/** Các quyền dùng chung cho mọi nhóm; thứ tự này cũng là thứ tự hiển thị. */
const PERMISSIONS = [
  { id: "event",    label: "Tạo và chỉnh sửa sự kiện" },
  { id: "publish",  label: "Xuất bản trang sự kiện" },
  { id: "tickets",  label: "Quản lý kho vé và giá vé" },
  { id: "checkin",  label: "Check-in người tham dự" },
  { id: "guests",   label: "Xem danh sách người tham dự" },
  { id: "members",  label: "Mời và quản lý thành viên" },
  { id: "revenue",  label: "Xem báo cáo doanh thu" },
] as const;

type PermissionId = typeof PERMISSIONS[number]["id"];

const PRESET_GROUPS: {
  id: string; name: string; desc: string;
  icon: React.FC<{ className?: string; style?: React.CSSProperties }>;
  tint: string; allow: PermissionId[] | "all";
}[] = [
  {
    id: "owner", name: "Chủ tài khoản", icon: Crown, tint: T.accentFg,
    desc: "Toàn quyền trên tài khoản và mọi sự kiện.",
    allow: "all",
  },
  {
    id: "admin", name: "Quản trị sự kiện", icon: Shield, tint: T.primary,
    desc: "Dựng và vận hành sự kiện được giao.",
    allow: ["event", "publish", "tickets", "checkin", "guests", "revenue"],
  },
  {
    id: "staff", name: "Nhân sự sự kiện", icon: UserCog, tint: T.successText,
    desc: "Trực tại sự kiện, chủ yếu lo check-in.",
    allow: ["checkin", "guests"],
  },
  {
    id: "viewer", name: "Chỉ xem", icon: Eye, tint: T.mutedFg,
    desc: "Theo dõi số liệu, không thay đổi được gì.",
    allow: ["guests", "revenue"],
  },
];

function PermissionGroupsTab() {
  const [detail, setDetail] = useState<typeof PRESET_GROUPS[number] | null>(null);
  const granted = (g: typeof PRESET_GROUPS[number]) =>
    g.allow === "all" ? PERMISSIONS.length : (g.allow as PermissionId[]).length;

  return (
    <div className="flex flex-col gap-4">
      <p style={{ fontSize: T.sm, color: T.mutedFg, lineHeight: 1.6 }}>
        Bốn nhóm quyền mặc định không chỉnh sửa được. Cần khác đi thì tạo một nhóm quyền tuỳ chỉnh.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {PRESET_GROUPS.map((g) => (
          <button key={g.id} data-pill="off"
            onClick={() => setDetail(g)}
            className="rounded-2xl p-4 flex items-center gap-3 text-left cursor-pointer transition-opacity hover:opacity-85"
            style={{ backgroundColor: T.background, border: `1px solid ${T.border}` }}>
            <span className="size-9 rounded-lg shrink-0 flex items-center justify-center"
              style={{ backgroundColor: `color-mix(in srgb, ${g.tint} 12%, transparent)` }}>
              <g.icon className="size-4" style={{ color: g.tint }} />
            </span>
            <span className="flex-1 min-w-0 flex flex-col">
              <span className="flex items-center gap-2">
                <span style={{ fontSize: T.sm, fontWeight: T.fw_semi, color: T.foreground }}>{g.name}</span>
                <span style={{ fontSize: "10px", padding: "1px 7px", borderRadius: 999,
                  backgroundColor: T.secondary, color: T.mutedFg, whiteSpace: "nowrap" }}>Mặc định</span>
              </span>
              <span className="truncate" style={{ fontSize: T.xs, color: T.mutedFg, marginTop: 2 }}>{g.desc}</span>
            </span>
            <span className="shrink-0 flex items-center gap-1" style={{ fontSize: T.xs, color: T.mutedFg }}>
              {granted(g)}/{PERMISSIONS.length} quyền
              <ChevronRight className="size-3.5" />
            </span>
          </button>
        ))}
      </div>

      {/* Ô tạo nhóm quyền tuỳ chỉnh */}
      <button data-pill="off"
        className="rounded-2xl p-4 flex items-center gap-3 w-full text-left cursor-pointer transition-opacity hover:opacity-80"
        style={{ border: `2px dashed ${T.border}`, backgroundColor: "transparent" }}>
        <span className="size-9 rounded-lg shrink-0 flex items-center justify-center"
          style={{ backgroundColor: `color-mix(in srgb, ${T.primary} 12%, transparent)` }}>
          <Plus className="size-4" style={{ color: T.primary }} />
        </span>
        <span className="flex flex-col min-w-0">
          <span style={{ fontSize: T.sm, fontWeight: T.fw_semi, color: T.foreground }}>Tạo nhóm quyền tuỳ chỉnh</span>
          <span style={{ fontSize: T.xs, color: T.mutedFg, marginTop: 2 }}>
            Tự chọn từng quyền trong số {PERMISSIONS.length} quyền.
          </span>
        </span>
      </button>

      {/* Chi tiết quyền của một nhóm */}
      <Dialog open={!!detail} onOpenChange={(o) => !o && setDetail(null)}>
        <DialogContent>
          {detail && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <detail.icon className="size-4" style={{ color: detail.tint }} />
                  {detail.name}
                </DialogTitle>
                <DialogDescription>{detail.desc}</DialogDescription>
              </DialogHeader>

              <div className="flex flex-col gap-1.5 py-1">
                {PERMISSIONS.map((perm) => {
                  const on = detail.allow === "all" || (detail.allow as PermissionId[]).includes(perm.id);
                  return (
                    <div key={perm.id} className="flex items-center gap-2 py-1">
                      {on
                        ? <CheckCircle2 className="size-4 shrink-0" style={{ color: T.successText }} />
                        : <X className="size-4 shrink-0" style={{ color: T.border }} />}
                      <span style={{ fontSize: T.sm, color: on ? T.foreground : T.mutedFg }}>{perm.label}</span>
                    </div>
                  );
                })}
              </div>

              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">Đóng</Button>
                </DialogClose>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ── Trang Vai trò: gộp quản lý thành viên và nhóm quyền ───────────────────────

function RolesPage(props: {
  currentRole: UserRole;
  inviteOpen?: boolean;
  onInviteOpenChange?: (open: boolean) => void;
}) {
  const [tab, setTab] = useState<"members" | "groups">("members");

  return (
    <div className="flex flex-col gap-6">
      <div className="flex gap-5 overflow-x-auto" style={{ borderBottom: `1px solid ${T.border}` }}>
        {([
          { id: "members" as const, label: "Quản lý thành viên" },
          { id: "groups"  as const, label: "Nhóm quyền" },
        ]).map((t) => {
          const active = tab === t.id;
          return (
            <button key={t.id} data-pill="off"
              onClick={() => setTab(t.id)}
              className="pb-3 transition-colors cursor-pointer"
              style={{
                fontSize: T.sm, fontWeight: active ? T.fw_semi : T.fw_normal,
                borderBottom: active ? `2px solid ${T.primary}` : "2px solid transparent",
                color: active ? T.primary : T.mutedFg,
              }}>
              {t.label}
            </button>
          );
        })}
      </div>

      {tab === "members" ? <MemberManagementPage {...props} /> : <PermissionGroupsTab />}
    </div>
  );
}

function MemberManagementPage({ currentRole, inviteOpen: externalInviteOpen, onInviteOpenChange }: {
  currentRole: UserRole;
  inviteOpen?: boolean;
  onInviteOpenChange?: (open: boolean) => void;
}) {
  const [members, setMembers]         = useState<Member[]>(MOCK_MEMBERS);
  const [search, setSearch]           = useState("");
  const [filterRole, setFilterRole]   = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [localInviteOpen, setLocalInviteOpen] = useState(false);
  const inviteOpen = externalInviteOpen ?? localInviteOpen;
  const setInviteOpen = (open: boolean) => { setLocalInviteOpen(open); onInviteOpenChange?.(open); };
  const [selectedMember, setSelected] = useState<Member | null>(null);
  const [drawerOpen, setDrawerOpen]   = useState(false);
  const [assignOpen, setAssignOpen]   = useState(false);
  const [confirmAction, setConfirm]   = useState<{ type: string; member: Member | null; eventId?: string } | null>(null);

  // Invite form state
  const [inviteEmail, setInvEmail]    = useState("");
  const [inviteRole, setInvRole]      = useState<EventRole>("staff");
  const [inviteEvents, setInvEvents]  = useState<string[]>([]);
  const [invCheckin, setInvCheckin]   = useState(true);
  const [invCheckout, setInvCheckout] = useState(false);
  const [invLoading, setInvLoading]   = useState(false);

  // Assign event form
  const [assignEvent, setAssignEvent] = useState("");
  const [assignRole, setAssignRole]   = useState<EventRole>("staff");
  const [assCheckin, setAssCheckin]   = useState(true);
  const [assCheckout, setAssCheckout] = useState(false);

  const filtered = members.filter((m) => {
    const q = search.toLowerCase();
    const matchQ = !search || m.name.toLowerCase().includes(q) || m.email.toLowerCase().includes(q);
    const matchR = filterRole === "all" || m.role === filterRole;
    const matchS = filterStatus === "all" || m.status === filterStatus;
    return matchQ && matchR && matchS;
  });

  const stats = [
    { label: "Tổng thành viên",  value: members.length, color: T.foreground },
    { label: "Đang hoạt động",   value: members.filter(m => m.status === "active").length, color: T.successText },
    { label: "Đã mời",           value: members.filter(m => m.status === "invited").length, color: T.warningText },
    { label: "Tạm khóa",         value: members.filter(m => m.status === "suspended").length, color: T.destructive },
  ];

  const openDrawer = (m: Member) => { setSelected(m); setDrawerOpen(true); };

  const executeAction = () => {
    if (!confirmAction?.member) return;
    const { type, member, eventId } = confirmAction;
    if (type === "suspend")   setMembers(p => p.map(m => m.id === member.id ? { ...m, status: "suspended" } : m));
    if (type === "unlock")    setMembers(p => p.map(m => m.id === member.id ? { ...m, status: "active" } : m));
    if (type === "remove")    setMembers(p => p.filter(m => m.id !== member.id));
    if (type === "remove-event") {
      setMembers(p => p.map(m => m.id === member.id
        ? { ...m, assignments: m.assignments.filter(a => a.eventId !== eventId) } : m));
      if (selectedMember?.id === member.id)
        setSelected(prev => prev ? { ...prev, assignments: prev.assignments.filter(a => a.eventId !== eventId) } : null);
    }
    setConfirm(null);
  };

  const handleInvite = () => {
    if (!inviteEmail.trim() || inviteEvents.length === 0) return;
    setInvLoading(true);
    setTimeout(() => {
      const newMember: Member = {
        id: Date.now().toString(), name: inviteEmail.split("@")[0], email: inviteEmail,
        role: inviteRole, status: "invited", eventCount: `${inviteEvents.length} sự kiện`,
        joinedAt: "—", lastActive: "—", assignments: inviteEvents.map((ev, i) => ({
          eventId: `new-${i}`, eventName: ev, eventDate: "—", eventStatus: "—",
          role: inviteRole, permissions: assCheckin ? ["Check-in", ...(assCheckout ? ["Check-out"] : [])] : [],
          assignmentStatus: "invited",
        })),
      };
      setMembers(p => [...p, newMember]);
      setInviteOpen(false); setInvEmail(""); setInvRole("staff"); setInvEvents([]); setInvLoading(false);
    }, 700);
  };

  const handleAssign = () => {
    if (!assignEvent || !selectedMember) return;
    const newAssignment: EventAssignment = {
      eventId: Date.now().toString(), eventName: assignEvent, eventDate: "—", eventStatus: "—",
      role: assignRole, permissions: assCheckin ? ["Check-in", ...(assCheckout ? ["Check-out"] : [])] : ["Quản lý sự kiện"],
      assignmentStatus: "active",
    };
    setMembers(p => p.map(m => m.id === selectedMember.id ? { ...m, assignments: [...m.assignments, newAssignment] } : m));
    setSelected(prev => prev ? { ...prev, assignments: [...prev.assignments, newAssignment] } : null);
    setAssignOpen(false); setAssignEvent("");
  };

  // Role badge
  const RolePill = ({ role }: { role: UserRole }) => {
    const cfg: Record<UserRole, { label: string; bg: string; color: string }> = {
      owner: { label: "Chủ tài khoản",     bg: T.accentFg + "15", color: T.accentFg },
      admin: { label: "Quản trị sự kiện", bg: `rgba(30,170,255,0.1)`, color: T.primary },
      staff: { label: "Nhân sự sự kiện",  bg: T.secondary, color: T.mutedFg },
    };
    const c = cfg[role];
    return <span style={{ fontSize: T.xs, fontWeight: T.fw_medium, padding: "2px 8px", borderRadius: "999px",
      backgroundColor: c.bg, color: c.color, border: `1px solid ${c.color}30`, whiteSpace: "nowrap" as const }}>{c.label}</span>;
  };

  // Status badge
  const StatusPill = ({ status }: { status: MemberStatus }) => {
    const cfg: Record<MemberStatus, { label: string; bg: string; color: string }> = {
      active:    { label: "Hoạt động",     bg: T.successSubtle, color: T.successText },
      invited:   { label: "Chờ chấp nhận", bg: T.warningSubtle, color: T.warningText },
      suspended: { label: "Tạm khóa",      bg: `rgba(248,104,128,0.1)`, color: "#f86880" },
    };
    const c = cfg[status];
    return <span style={{ fontSize: T.xs, fontWeight: T.fw_medium, padding: "2px 8px", borderRadius: "999px",
      backgroundColor: c.bg, color: c.color, whiteSpace: "nowrap" as const }}>{c.label}</span>;
  };

  // Event assignment card
  const EventAssignCard = ({ a, member }: { a: EventAssignment; member: Member }) => (
    <div className="rounded-xl p-4 flex flex-col gap-2"
      style={{ backgroundColor: T.background, border: `1px solid ${T.border}` }}>
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <p style={{ fontSize: T.sm, fontWeight: T.fw_medium, color: T.foreground }}>{a.eventName}</p>
          <p style={{ fontSize: T.xs, color: T.mutedFg }}>{a.eventDate} · {a.eventStatus}</p>
        </div>
        <span style={{ fontSize: T.xs, padding: "1px 6px", borderRadius: "999px",
          backgroundColor: a.assignmentStatus === "active" ? T.successSubtle : T.warningSubtle,
          color: a.assignmentStatus === "active" ? T.successText : T.warningText }}>
          {a.assignmentStatus === "active" ? "Hoạt động" : "Đã mời"}
        </span>
      </div>
      <div className="flex items-center gap-2 flex-wrap">
        <span style={{ fontSize: T.xs, padding: "1px 8px", borderRadius: "999px",
          backgroundColor: `rgba(30,170,255,0.1)`, color: T.primary }}>
          {a.role === "admin" ? "Quản trị sự kiện" : "Nhân sự sự kiện"}
        </span>
        {a.permissions.map((p) => (
          <span key={p} style={{ fontSize: T.xs, color: T.mutedFg }}>· {p}</span>
        ))}
      </div>
      <div className="flex gap-2 mt-1">
        {a.assignmentStatus === "invited" ? (
          <Button size="sm" variant="outline" style={{ fontSize: T.xs }}>
            <RefreshCcw className="size-3" /> Gửi lại lời mời
          </Button>
        ) : (
          <Button size="sm" variant="outline" style={{ fontSize: T.xs }}>Đổi vai trò</Button>
        )}
        <Button size="sm" variant="ghost" style={{ fontSize: T.xs, color: T.destructive }}
          onClick={() => setConfirm({ type: "remove-event", member, eventId: a.eventId })}>
          Gỡ khỏi sự kiện
        </Button>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col gap-6">

      {/* Filter bar */}
      <div className="flex gap-2 flex-wrap items-center">
        <div className="relative flex-1" style={{ minWidth: "220px", maxWidth: "320px" }}>
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4" style={{ color: T.mutedFg }} />
          <Input placeholder="Tìm theo tên hoặc email" className="pl-9"
            value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
      </div>

      {/* Member table */}
      <div className="rounded-xl overflow-x-auto" style={{ border: `1px solid ${T.border}`, backgroundColor: T.background }}>
        <Table>
          <TableHeader>
            <TableRow style={{ backgroundColor: T.secondary }}>
              <TableHead>Thành viên</TableHead>
              <TableHead>Sự kiện tham gia</TableHead>
              <TableHead>Hoạt động gần nhất</TableHead>
              <TableHead className="w-32" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-12" style={{ color: T.mutedFg }}>
                  Không tìm thấy thành viên nào
                </TableCell>
              </TableRow>
            ) : filtered.map((member) => (
              <TableRow key={member.id} className="cursor-pointer hover:bg-[var(--secondary)] transition-colors"
                onClick={() => openDrawer(member)}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <MemberAvatar name={member.name} />
                    <div>
                      <p style={{ fontSize: T.sm, fontWeight: T.fw_medium, color: T.foreground }}>{member.name}</p>
                      <p style={{ fontSize: T.xs, color: T.mutedFg }}>{member.email}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell style={{ fontSize: T.sm, color: T.mutedFg }}>
                  {member.eventCount === "Chưa phân công" ? "—" : member.eventCount}
                </TableCell>
                <TableCell style={{ fontSize: T.sm, color: T.mutedFg }}>{member.lastActive}</TableCell>
                <TableCell onClick={(e) => e.stopPropagation()}>
                  <div className="flex items-center gap-2">
                    <Button size="sm" variant="outline" onClick={() => openDrawer(member)}>
                      <Eye className="size-3.5" /> Xem chi tiết
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button size="icon" variant="ghost" className="size-8"><MoreHorizontal className="size-4" /></Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-44">
                        <DropdownMenuItem onClick={() => openDrawer(member)}>Xem chi tiết</DropdownMenuItem>
                        {member.status === "invited" && (
                          <DropdownMenuItem>Gửi lại lời mời</DropdownMenuItem>
                        )}
                        {member.role !== "owner" && currentRole === "owner" && (
                          <>
                            <DropdownMenuSeparator />
                            {member.status === "active" && (
                              <DropdownMenuItem onClick={() => setConfirm({ type: "suspend", member })}>
                                <Lock className="size-3.5 mr-2" /> Tạm khóa
                              </DropdownMenuItem>
                            )}
                            {member.status === "suspended" && (
                              <DropdownMenuItem onClick={() => setConfirm({ type: "unlock", member })}>
                                <Unlock className="size-3.5 mr-2" /> Mở khóa
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-destructive focus:text-destructive"
                              onClick={() => setConfirm({ type: "remove", member })}>
                              <Trash2 className="size-3.5 mr-2" /> Xóa khỏi account
                            </DropdownMenuItem>
                          </>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* ── Member Detail Popup ── */}
      <Dialog open={drawerOpen} onOpenChange={(o) => { if (!o) { setDrawerOpen(false); setAssignOpen(false); } }}>
        <DialogContent className="w-[calc(100vw-32px)] sm:max-w-[560px] max-h-[90vh] overflow-y-auto p-0" aria-describedby={undefined}>
          {selectedMember && (
            <>
              <DialogHeader className="px-6 py-5" style={{ borderBottom: `1px solid ${T.border}` }}>
                <DialogTitle>Chi tiết nhân sự</DialogTitle>
              </DialogHeader>

              <div className="flex flex-col gap-5 p-6">
                {/* Profile */}
                <div className="flex items-center gap-4">
                  <MemberAvatar name={selectedMember.name} />
                  <div className="flex-1 min-w-0">
                    <p style={{ fontSize: T.base, fontWeight: T.fw_semi, color: T.foreground }}>{selectedMember.name}</p>
                    <p style={{ fontSize: T.xs, color: T.mutedFg }}>{selectedMember.email}</p>
                  </div>
                </div>

                {/* Info */}
                <div>
                  <p style={{ fontSize: T.xs, fontWeight: T.fw_semi, color: T.mutedFg,
                    textTransform: "uppercase" as const, letterSpacing: "0.05em", marginBottom: "10px" }}>
                    Thông tin nhân sự
                  </p>
                  {[
                    { label: "Họ và tên", value: selectedMember.name },
                    { label: "Email", value: selectedMember.email },
                    { label: "Trạng thái", value: selectedMember.status },
                    { label: "Ngày tham gia", value: selectedMember.joinedAt },
                    { label: "Lần hoạt động gần nhất", value: selectedMember.lastActive },
                    { label: "Tham gia", value: selectedMember.eventCount },
                  ].map((r) => (
                    <div key={r.label} className="flex items-center justify-between py-2"
                      style={{ borderBottom: `1px solid ${T.border}` }}>
                      <span style={{ fontSize: T.xs, color: T.mutedFg }}>{r.label}</span>
                      <span style={{ fontSize: T.xs, fontWeight: T.fw_medium, color: T.foreground }}>{r.value}</span>
                    </div>
                  ))}
                </div>

                {/* Event assignments */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <p style={{ fontSize: T.xs, fontWeight: T.fw_semi, color: T.mutedFg,
                      textTransform: "uppercase" as const, letterSpacing: "0.05em" }}>
                      Sự kiện đang tham gia
                    </p>
                    {selectedMember.role !== "owner" && currentRole === "owner" && (
                      <Button size="sm" variant="outline" onClick={() => setAssignOpen(!assignOpen)}>
                        <Plus className="size-3.5" /> Gán thêm sự kiện
                      </Button>
                    )}
                  </div>

                  {/* Assign event form */}
                  {assignOpen && (
                    <div className="rounded-xl p-4 mb-3 flex flex-col gap-3"
                      style={{ backgroundColor: T.secondary, border: `1px solid ${T.border}` }}>
                      <p style={{ fontSize: T.sm, fontWeight: T.fw_medium, color: T.foreground }}>Gán thêm sự kiện</p>
                      <Select value={assignEvent} onValueChange={setAssignEvent}>
                        <SelectTrigger><SelectValue placeholder="Chọn sự kiện" /></SelectTrigger>
                        <SelectContent>
                          {MOCK_EVENTS.map((e) => <SelectItem key={e} value={e}>{e}</SelectItem>)}
                        </SelectContent>
                      </Select>
                      <div className="flex flex-col gap-2">
                        <p style={{ fontSize: T.xs, fontWeight: T.fw_medium, color: T.foreground }}>Vai trò trong sự kiện</p>
                        {(["admin", "staff"] as EventRole[]).map((r) => (
                          <button key={r} onClick={() => setAssignRole(r)}
                            className="flex items-start gap-2 p-3 rounded-xl text-left transition-all cursor-pointer"
                            style={{ border: assignRole === r ? `2px solid ${T.primary}` : `1px solid ${T.border}`,
                              backgroundColor: assignRole === r ? `rgba(30,170,255,0.04)` : T.background }}>
                            <div className="size-4 rounded-full border-2 mt-0.5 flex items-center justify-center shrink-0"
                              style={{ borderColor: assignRole === r ? T.primary : T.border }}>
                              {assignRole === r && <div className="size-2 rounded-full" style={{ backgroundColor: T.primary }} />}
                            </div>
                            <div>
                              <p style={{ fontSize: T.sm, fontWeight: T.fw_medium, color: T.foreground }}>
                                {r === "admin" ? "Quản trị sự kiện" : "Nhân sự sự kiện"}
                              </p>
                              <p style={{ fontSize: T.xs, color: T.mutedFg }}>
                                {r === "admin" ? "Quản lý toàn bộ sự kiện được phân công." : "Chỉ truy cập chức năng check-in / check-out."}
                              </p>
                            </div>
                          </button>
                        ))}
                      </div>
                      {assignRole === "staff" && (
                        <div className="flex flex-col gap-1.5">
                          <p style={{ fontSize: T.xs, fontWeight: T.fw_medium, color: T.foreground }}>Quyền Staff</p>
                          {[{ label: "Check-in", val: assCheckin, set: setAssCheckin }, { label: "Check-out", val: assCheckout, set: setAssCheckout }].map((c) => (
                            <label key={c.label} className="flex items-center gap-2 cursor-pointer">
                              <Checkbox checked={c.val} onCheckedChange={(v) => c.set(!!v)} />
                              <span style={{ fontSize: T.sm, color: T.foreground }}>{c.label}</span>
                            </label>
                          ))}
                        </div>
                      )}
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => setAssignOpen(false)}>Hủy</Button>
                        <Button size="sm" disabled={!assignEvent} onClick={handleAssign}>Gán sự kiện</Button>
                      </div>
                    </div>
                  )}

                  {selectedMember.role === "owner" ? (
                    <p style={{ fontSize: T.sm, color: T.mutedFg, fontStyle: "italic" }}>
                      Chủ tài khoản có quyền truy cập toàn bộ sự kiện trong tài khoản.
                    </p>
                  ) : selectedMember.assignments.length === 0 ? (
                    <div className="rounded-xl p-6 text-center" style={{ border: `1px dashed ${T.border}` }}>
                      <p style={{ fontSize: T.sm, color: T.mutedFg }}>Chưa được phân công vào sự kiện nào.</p>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-3">
                      {selectedMember.assignments.map((a) => (
                        <EventAssignCard key={a.eventId} a={a} member={selectedMember} />
                      ))}
                    </div>
                  )}
                </div>

                {/* Account-level actions */}
                {selectedMember.role !== "owner" && currentRole === "owner" && (
                  <div>
                    <p style={{ fontSize: T.xs, fontWeight: T.fw_semi, color: T.mutedFg,
                      textTransform: "uppercase" as const, letterSpacing: "0.05em", marginBottom: "10px" }}>
                      Thao tác tài khoản
                    </p>
                    <div className="flex flex-col gap-2">
                      {selectedMember.status === "active" && (
                        <Button variant="outline" onClick={() => setConfirm({ type: "suspend", member: selectedMember })}>
                          <Lock className="size-4" /> Tạm khóa thành viên
                        </Button>
                      )}
                      {selectedMember.status === "suspended" && (
                        <Button variant="outline" onClick={() => setConfirm({ type: "unlock", member: selectedMember })}>
                          <Unlock className="size-4" /> Mở khóa
                        </Button>
                      )}
                      {selectedMember.status === "invited" && (
                        <Button variant="outline"><RefreshCcw className="size-4" /> Gửi lại lời mời</Button>
                      )}
                      <Button variant="outline"
                        style={{ borderColor: T.destructive, color: T.destructive }}
                        onClick={() => setConfirm({ type: "remove", member: selectedMember })}>
                        <Trash2 className="size-4" /> Xóa khỏi account
                      </Button>
                    </div>
                  </div>
                )}
                {selectedMember.role === "owner" && (
                  <p style={{ fontSize: T.xs, color: T.mutedFg, fontStyle: "italic" }}>
                    Không thể tạm khóa hoặc xóa Chủ tài khoản.
                  </p>
                )}
              </div>

              <DialogFooter className="px-6 py-4" style={{ borderTop: `1px solid ${T.border}` }}>
                <DialogClose asChild><Button variant="outline">Đóng</Button></DialogClose>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* ── Invite Member Modal ── */}
      <Dialog open={inviteOpen} onOpenChange={(o) => !o && setInviteOpen(false)}>
        <DialogContent className="w-[calc(100vw-32px)] sm:max-w-[520px]">
          <DialogHeader>
            <DialogTitle>Mời thành viên</DialogTitle>
            <DialogDescription>Mời thành viên để cùng quản lý và vận hành sự kiện.</DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-4 py-2">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="inv-email">Email <span style={{ color: T.destructive }}>*</span></Label>
              <Input id="inv-email" type="email" placeholder="Nhập email người được mời"
                value={inviteEmail} onChange={(e) => setInvEmail(e.target.value)} />
            </div>
            <div className="flex flex-col gap-2">
              <Label>Vai trò trong sự kiện</Label>
              {(["admin", "staff"] as EventRole[]).map((r) => (
                <button key={r} onClick={() => setInvRole(r)}
                  className="flex items-start gap-2 p-3 rounded-xl text-left transition-all cursor-pointer"
                  style={{ border: inviteRole === r ? `2px solid ${T.primary}` : `1px solid ${T.border}`,
                    backgroundColor: inviteRole === r ? `rgba(30,170,255,0.04)` : T.background }}>
                  <div className="size-4 rounded-full border-2 mt-0.5 flex items-center justify-center shrink-0"
                    style={{ borderColor: inviteRole === r ? T.primary : T.border }}>
                    {inviteRole === r && <div className="size-2 rounded-full" style={{ backgroundColor: T.primary }} />}
                  </div>
                  <div>
                    <p style={{ fontSize: T.sm, fontWeight: T.fw_medium, color: T.foreground }}>
                      {r === "admin" ? "Quản trị sự kiện" : "Nhân sự sự kiện"}
                    </p>
                    <p style={{ fontSize: T.xs, color: T.mutedFg }}>
                      {r === "admin" ? "Quản lý toàn bộ sự kiện được phân công." : "Chỉ truy cập chức năng check-in / check-out."}
                    </p>
                  </div>
                </button>
              ))}
            </div>
            <div className="flex flex-col gap-1.5">
              <Label>Sự kiện phân công <span style={{ color: T.destructive }}>*</span></Label>
              <div className="flex flex-col gap-1.5 p-3 rounded-xl max-h-36 overflow-y-auto"
                style={{ border: `1px solid ${T.border}`, backgroundColor: T.secondary }}>
                {MOCK_EVENTS.map((ev) => (
                  <label key={ev} className="flex items-center gap-2 cursor-pointer">
                    <Checkbox checked={inviteEvents.includes(ev)}
                      onCheckedChange={(v) => setInvEvents(p => v ? [...p, ev] : p.filter(e => e !== ev))} />
                    <span style={{ fontSize: T.sm, color: T.foreground }}>{ev}</span>
                  </label>
                ))}
              </div>
            </div>
            {inviteRole === "staff" && (
              <div className="flex flex-col gap-1.5">
                <Label>Quyền Staff</Label>
                {[{ label: "Check-in", val: invCheckin, set: setInvCheckin }, { label: "Check-out", val: invCheckout, set: setInvCheckout }].map((c) => (
                  <label key={c.label} className="flex items-center gap-2 cursor-pointer">
                    <Checkbox checked={c.val} onCheckedChange={(v) => c.set(!!v)} />
                    <span style={{ fontSize: T.sm, color: T.foreground }}>{c.label}</span>
                  </label>
                ))}
              </div>
            )}
            <p style={{ fontSize: T.xs, color: T.mutedFg, fontStyle: "italic" }}>
              Nếu email chưa có tài khoản NetEvent, người được mời sẽ tạo tài khoản từ link mời.
            </p>
          </div>
          <DialogFooter>
            <DialogClose asChild><Button variant="outline">Hủy</Button></DialogClose>
            <Button onClick={handleInvite} disabled={!inviteEmail.trim() || inviteEvents.length === 0 || invLoading}>
              {invLoading ? "Đang gửi..." : "Gửi lời mời"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Confirm dialogs ── */}
      {confirmAction && (
        <Dialog open={!!confirmAction} onOpenChange={(o) => !o && setConfirm(null)}>
          <DialogContent className="sm:max-w-sm">
            <DialogHeader>
              <DialogTitle>
                {confirmAction.type === "suspend" && "Tạm khóa thành viên?"}
                {confirmAction.type === "unlock"  && "Mở khóa thành viên?"}
                {confirmAction.type === "remove"  && "Xóa thành viên khỏi account?"}
                {confirmAction.type === "remove-event" && "Gỡ thành viên khỏi sự kiện?"}
              </DialogTitle>
              <DialogDescription>
                {confirmAction.type === "suspend" && "Thành viên sẽ không thể truy cập các sự kiện đã được phân quyền cho đến khi được mở khóa."}
                {confirmAction.type === "unlock"  && "Thành viên sẽ có thể đăng nhập và truy cập lại các sự kiện được phân công."}
                {confirmAction.type === "remove"  && "Thành viên sẽ mất quyền truy cập vào các sự kiện trong tài khoản này. Thao tác này không xóa dữ liệu sự kiện đã tạo trước đó."}
                {confirmAction.type === "remove-event" && "Thành viên sẽ mất quyền truy cập sự kiện được chọn, nhưng vẫn còn trong tài khoản và các sự kiện khác không bị ảnh hưởng."}
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <DialogClose asChild><Button variant="outline">Hủy</Button></DialogClose>
              <Button variant={confirmAction.type === "unlock" ? "default" : "destructive"} onClick={executeAction}>
                {confirmAction.type === "suspend" && "Tạm khóa thành viên"}
                {confirmAction.type === "unlock"  && "Mở khóa"}
                {confirmAction.type === "remove"  && "Xóa thành viên"}
                {confirmAction.type === "remove-event" && "Gỡ khỏi sự kiện"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

// ── Nav items ─────────────────────────────────────────────────────────────────

// ── Notification types & data ─────────────────────────────────────────────────

type NotifCategory = "event" | "landing" | "ticket" | "attendee" | "checkin" | "member" | "billing" | "system";
type NotifPriority = "info" | "warning" | "important";

const NOTIF_CATEGORY_CFG: Record<NotifCategory, { label: string; icon: React.ReactNode; color: string; bg: string }> = {
  event:    { label: "Sự kiện",       icon: <Calendar className="size-4" />,   color: T.primary,       bg: `rgba(30,170,255,0.1)` },
  landing:  { label: "Trang sự kiện", icon: <Globe className="size-4" />,      color: "#7c3aed",       bg: `rgba(124,58,237,0.1)` },
  ticket:   { label: "Kho vé",        icon: <Ticket className="size-4" />,     color: "#f97316",       bg: `rgba(249,115,22,0.1)` },
  attendee: { label: "Người tham dự", icon: <Users className="size-4" />,      color: "#16a34a",       bg: `rgba(22,163,74,0.1)` },
  checkin:  { label: "Check-in",      icon: <UserCheck className="size-4" />,  color: "#0d9488",       bg: `rgba(13,148,136,0.1)` },
  member:   { label: "Thành viên",    icon: <UserPlus className="size-4" />,   color: "#4f46e5",       bg: `rgba(79,70,229,0.1)` },
  billing:  { label: "Gói sử dụng",   icon: <CreditCard className="size-4" />, color: "#dc2626",       bg: `rgba(220,38,38,0.1)` },
  system:   { label: "Hệ thống",      icon: <Cpu className="size-4" />,        color: T.mutedFg,       bg: T.secondary },
};

type NotifStatus = "important" | "action" | "unread" | "update" | "read";
type InviteStatus = "pending" | "accepted" | "declined" | "expired";

interface Notification {
  id: string; title: string; desc: string; time: string;
  category: NotifCategory; priority: NotifPriority; status: NotifStatus;
  read: boolean; eventName?: string; cta: string;
  isInvite?: boolean; inviteStatus?: InviteStatus;
}

const MOCK_NOTIFICATIONS: Notification[] = [
  // ── Invites — pending (highest priority) ──
  { id: "inv1", title: "Bạn được mời làm Quản trị sự kiện", desc: "Nguyễn Thị Lan đã mời bạn làm Quản trị sự kiện cho 'NetEvent Demo Conference 2026'.", time: "2 phút trước", category: "member", priority: "important", status: "action", read: false, eventName: "NetEvent Demo Conference 2026", cta: "Xem lời mời", isInvite: true, inviteStatus: "pending" },
  { id: "inv2", title: "Bạn được mời làm Nhân sự sự kiện", desc: "Trần Văn Minh đã mời bạn tham gia vận hành sự kiện 'Hội thảo AI 2025' với vai trò Nhân sự sự kiện.", time: "10 phút trước", category: "member", priority: "important", status: "action", read: false, eventName: "Hội thảo AI 2025", cta: "Xem lời mời", isInvite: true, inviteStatus: "pending" },
  // ── Invite — expired (demo) ──
  { id: "inv3", title: "Lời mời tham gia sự kiện đã hết hạn", desc: "Lời mời tham gia sự kiện 'Tech Summit 2025' không còn hiệu lực. Vui lòng liên hệ Chủ tài khoản nếu cần được mời lại.", time: "3 ngày trước", category: "member", priority: "info", status: "read", read: true, eventName: "Tech Summit 2025", cta: "Liên hệ quản trị viên", isInvite: true, inviteStatus: "expired" },
  // ── Actionable / Important ──
  { id: "1", title: "Không thể xuất bản trang sự kiện", desc: "Vui lòng kiểm tra thông tin sự kiện và cấu hình vé trước khi xuất bản.", time: "Hôm nay", category: "landing", priority: "important", status: "important", read: false, eventName: "NetEvent Demo Conference 2026", cta: "Kiểm tra ngay" },
  { id: "3", title: "Hạng vé đã hết", desc: "Hạng vé 'Vé tiêu chuẩn' đã được đăng ký hết. Người tham dự không còn có thể chọn hạng vé này.", time: "1 giờ trước", category: "ticket", priority: "warning", status: "action", read: false, eventName: "NetEvent Demo Conference 2026", cta: "Quản lý vé" },
  // ── Tổng hợp ngày — Người tham dự ──
  { id: "4", title: "Trang sự kiện đã được xuất bản", desc: "Người tham dự đã có thể truy cập trang đăng ký của sự kiện.", time: "2 phút trước", category: "landing", priority: "info", status: "unread", read: false, eventName: "NetEvent Demo Conference 2026", cta: "Xem trang" },
  { id: "5", title: "127 người đã đăng ký hôm nay", desc: "NetEvent Demo Conference 2026 ghi nhận 127 lượt đăng ký mới trong ngày hôm nay. Tổng số hiện tại: 843 người tham dự.", time: "Hôm nay", category: "attendee", priority: "info", status: "unread", read: false, eventName: "NetEvent Demo Conference 2026", cta: "Xem danh sách" },
  // ── Tổng hợp ngày — Check-in ──
  { id: "8", title: "48 lượt check-in trong hôm nay", desc: "Hội thảo AI 2025 ghi nhận 48 lượt check-in trong ngày hôm nay. Còn 14 người chưa check-in.", time: "Hôm nay", category: "checkin", priority: "info", status: "unread", read: false, eventName: "Hội thảo AI 2025", cta: "Xem check-in" },
  // ── Read / Updates ──
  { id: "6", title: "Vai trò của bạn đã được cập nhật", desc: "Bạn hiện là Quản trị sự kiện của 'NetEvent Demo Conference 2026'.", time: "Hôm nay", category: "member", priority: "info", status: "update", read: true, eventName: "NetEvent Demo Conference 2026", cta: "Xem sự kiện" },
  { id: "7", title: "Bạn đã được gỡ khỏi sự kiện", desc: "Bạn không còn quyền truy cập vào sự kiện 'Hội thảo AI 2025'.", time: "Hôm nay", category: "member", priority: "info", status: "update", read: true, eventName: "Hội thảo AI 2025", cta: "Xem chi tiết" },
];

// ── Notification Dropdown ─────────────────────────────────────────────────────

function NotificationDropdown({ notifications, onMarkAllRead, onMarkRead, onAccept, onDecline, onViewAll }: {
  notifications: Notification[];
  onMarkAllRead: () => void;
  onMarkRead: (id: string) => void;
  onAccept: (id: string) => void;
  onDecline: (id: string) => void;
  onViewAll: () => void;
}) {
  const unreadCount = notifications.filter(n => !n.read).length;
  const priorityOrder: Record<NotifStatus, number> = { important: 0, action: 1, unread: 2, update: 3, read: 4 };
  const sorted = [...notifications].sort((a, b) => priorityOrder[a.status] - priorityOrder[b.status]).slice(0, 5);

  const statusBadge = (n: Notification) => {
    if (n.isInvite && n.inviteStatus === "pending")  return { label: "Cần xử lý",    bg: `rgba(79,70,229,0.1)`, color: "#4f46e5" };
    if (n.isInvite && n.inviteStatus === "accepted") return { label: "Đã chấp nhận", bg: T.successSubtle,       color: T.successText };
    if (n.isInvite && n.inviteStatus === "declined") return { label: "Đã từ chối",   bg: T.secondary,           color: T.mutedFg };
    if (n.isInvite && n.inviteStatus === "expired")  return { label: "Đã hết hạn",   bg: T.secondary,           color: T.mutedFg };
    if (n.status === "important") return { label: "Quan trọng",  bg: `rgba(220,38,38,0.1)`,  color: "#dc2626" };
    if (n.status === "action")    return { label: "Cần xử lý",   bg: T.warningSubtle,        color: T.warningText };
    if (!n.read)                  return { label: "Chưa đọc",    bg: `rgba(30,170,255,0.1)`, color: T.primary };
    return null;
  };

  return (
    <div className="flex flex-col" style={{ width: "min(400px, calc(100vw - 24px))", maxHeight: "560px",
      backgroundColor: T.background, border: `1px solid ${T.border}`,
      borderRadius: "16px", boxShadow: "0 8px 32px rgba(0,0,0,0.14)", overflow: "hidden" }}>

      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3.5"
        style={{ borderBottom: `1px solid ${T.border}` }}>
        <div className="flex items-center gap-2">
          <p style={{ fontSize: T.base, fontWeight: T.fw_semi, color: T.foreground }}>Thông báo</p>
          {unreadCount > 0 && (
            <span style={{ fontSize: "10px", fontWeight: T.fw_bold, minWidth: "18px", height: "18px",
              borderRadius: "999px", backgroundColor: T.primary, color: "white",
              display: "inline-flex", alignItems: "center", justifyContent: "center", padding: "0 5px" }}>
              {unreadCount}
            </span>
          )}
        </div>
        {unreadCount > 0 && (
          <button onClick={onMarkAllRead}
            style={{ fontSize: T.xs, color: T.primary, fontWeight: T.fw_medium, background: "none", border: "none", cursor: "pointer" }}>
            Đánh dấu tất cả là đã đọc
          </button>
        )}
      </div>

      {/* List — prioritized */}
      <div className="flex-1 overflow-y-auto">
        {sorted.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 px-6 text-center">
            <div className="size-12 rounded-2xl flex items-center justify-center mb-3" style={{ backgroundColor: T.secondary }}>
              <Bell className="size-6" style={{ color: T.mutedFg }} />
            </div>
            <p style={{ fontSize: T.sm, fontWeight: T.fw_medium, color: T.foreground, marginBottom: "4px" }}>
              Chưa có thông báo
            </p>
            <p style={{ fontSize: T.xs, color: T.mutedFg, lineHeight: 1.5 }}>
              Các cập nhật quan trọng về sự kiện, vé và người tham dự sẽ hiển thị tại đây.
            </p>
          </div>
        ) : sorted.map((n) => {
          const cfg = NOTIF_CATEGORY_CFG[n.category];
          const badge = statusBadge(n);
          const isActionable = n.status === "important" || n.status === "action";
          return (
            <div key={n.id}
              className="flex items-start gap-3 px-4 py-3.5 transition-colors"
              style={{
                backgroundColor: (n.isInvite && n.inviteStatus === "pending") ? `rgba(79,70,229,0.04)` : n.status === "important" ? `rgba(220,38,38,0.03)` : n.status === "action" ? `rgba(249,115,22,0.03)` : !n.read ? `rgba(30,170,255,0.03)` : "transparent",
                borderBottom: `1px solid ${T.border}`,
              }}>
              <div className="size-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
                style={{ backgroundColor: cfg.bg, color: cfg.color }}>
                {cfg.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 mb-0.5">
                  <p style={{ fontSize: T.sm, fontWeight: n.read ? T.fw_normal : T.fw_medium, color: T.foreground, lineHeight: 1.4 }}>
                    {n.title}
                  </p>
                  {!n.read && <div className="size-2 rounded-full shrink-0 mt-1.5" style={{ backgroundColor: T.primary }} />}
                </div>
                {badge && (
                  <span style={{ fontSize: "10px", fontWeight: T.fw_medium, padding: "1px 7px", borderRadius: "999px",
                    backgroundColor: badge.bg, color: badge.color, display: "inline-flex", marginBottom: "4px" }}>
                    {badge.label}
                  </span>
                )}
                <p style={{ fontSize: T.xs, color: T.mutedFg, lineHeight: 1.5 }}>{n.desc}</p>
                <div className="flex items-center justify-between mt-2 gap-2">
                  <p style={{ fontSize: T.xs, color: T.mutedFg }}>{n.time} · {cfg.label}</p>
                  {n.isInvite && n.inviteStatus === "pending" ? (
                    <div className="flex gap-1.5">
                      <button onClick={() => onDecline(n.id)}
                        style={{ fontSize: T.xs, fontWeight: T.fw_medium, cursor: "pointer",
                          color: T.mutedFg, background: "none", border: `1px solid ${T.border}`,
                          borderRadius: "6px", padding: "2px 8px" }}>
                        Từ chối
                      </button>
                      <button onClick={() => onAccept(n.id)}
                        style={{ fontSize: T.xs, fontWeight: T.fw_medium, cursor: "pointer",
                          color: "white", backgroundColor: T.primary, border: "none",
                          borderRadius: "6px", padding: "2px 8px" }}>
                        Chấp nhận
                      </button>
                    </div>
                  ) : (
                    <button onClick={() => onMarkRead(n.id)}
                      style={{ fontSize: T.xs, fontWeight: T.fw_medium, cursor: "pointer",
                        color: isActionable ? "#dc2626" : T.primary,
                        background: "none", border: "none", padding: 0 }}>
                      {n.cta}
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="px-4 py-3" style={{ borderTop: `1px solid ${T.border}` }}>
        <button onClick={onViewAll} className="w-full py-2 rounded-xl"
          style={{ fontSize: T.sm, fontWeight: T.fw_medium, color: T.primary,
            backgroundColor: `rgba(30,170,255,0.06)`, border: `1px solid rgba(30,170,255,0.15)`, cursor: "pointer" }}>
          Xem tất cả thông báo
        </button>
      </div>
    </div>
  );
}

// ── Notifications Page ────────────────────────────────────────────────────────

function NotificationsPage({ notifications, onMarkAllRead, onMarkRead, onAccept, onDecline }: {
  notifications: Notification[];
  onMarkAllRead: () => void;
  onMarkRead: (id: string) => void;
  onAccept: (id: string) => void;
  onDecline: (id: string) => void;
}) {
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  const pendingInviteCount = notifications.filter(n => n.isInvite && n.inviteStatus === "pending").length;
  const unreadCount  = notifications.filter(n => !n.read).length;
  const actionCount  = notifications.filter(n => (n.status === "important" || n.status === "action") && !(n.isInvite && n.inviteStatus === "pending")).length;

  const TABS = [
    { id: "all",    label: "Tất cả",  count: 0 },
    { id: "invite", label: "Lời mời", count: pendingInviteCount },
    { id: "unread", label: "Chưa đọc", count: unreadCount },
    { id: "update", label: "Cập nhật", count: 0 },
  ];

  const filtered = notifications.filter(n => {
    const matchFilter =
      filter === "all"     ? true :
      filter === "invite"  ? !!n.isInvite :
      filter === "action"  ? ((n.status === "important" || n.status === "action") && !n.isInvite) :
      filter === "unread"  ? !n.read :
      filter === "warning" ? (n.priority === "warning" || n.priority === "important") && !n.isInvite :
      filter === "update"  ? (n.status === "update" || (n.read && n.priority === "info" && !n.isInvite)) :
      true;
    const matchSearch = !search || n.title.toLowerCase().includes(search.toLowerCase()) || n.desc.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  const statusBadgeCfg = (n: Notification) => {
    if (n.isInvite && n.inviteStatus === "pending")  return { label: "Lời mời",       bg: `rgba(79,70,229,0.1)`, color: "#4f46e5" };
    if (n.isInvite && n.inviteStatus === "accepted") return { label: "Đã chấp nhận",  bg: T.successSubtle,       color: T.successText };
    if (n.isInvite && n.inviteStatus === "declined") return { label: "Đã từ chối",    bg: T.secondary,           color: T.mutedFg };
    if (n.isInvite && n.inviteStatus === "expired")  return { label: "Đã hết hạn",    bg: T.secondary,           color: T.mutedFg };
    if (n.status === "important") return { label: "Quan trọng", bg: `rgba(220,38,38,0.1)`,  color: "#dc2626" };
    if (n.status === "action")    return { label: "Cần xử lý",  bg: T.warningSubtle,         color: T.warningText };
    if (!n.read && n.status !== "update") return { label: "Chưa đọc", bg: `rgba(30,170,255,0.1)`, color: T.primary };
    return null;
  };

  const emptyByFilter: Record<string, { title: string; desc: string }> = {
    invite:  { title: "Không có lời mời nào",      desc: "Lời mời tham gia sự kiện sẽ hiển thị tại đây." },
    action:  { title: "Không có việc cần xử lý",   desc: "Các cảnh báo quan trọng sẽ hiển thị tại đây khi có phát sinh." },
    unread:  { title: "Bạn đã đọc hết thông báo",  desc: "Không còn thông báo mới cần xử lý." },
    warning: { title: "Không có cảnh báo nào",     desc: "Các cảnh báo về vé, gói sử dụng sẽ hiển thị tại đây." },
    update:  { title: "Chưa có cập nhật mới",      desc: "Các cập nhật về sự kiện và thành viên sẽ hiển thị tại đây." },
    all:     { title: "Chưa có thông báo",          desc: "Các cập nhật quan trọng về sự kiện, vé, người tham dự và tài khoản sẽ hiển thị tại đây." },
  };
  const { title: emptyTitle, desc: emptyDesc } = emptyByFilter[filter] ?? emptyByFilter["all"];

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h2 style={{ fontSize: "var(--text-xl)", fontWeight: T.fw_semi, color: T.foreground, marginBottom: "4px" }}>
            Thông báo
          </h2>
          <p style={{ fontSize: T.sm, color: T.mutedFg }}>
            Theo dõi các cập nhật quan trọng trong quá trình vận hành sự kiện.
          </p>
        </div>
        {unreadCount > 0 && (
          <Button variant="outline" onClick={onMarkAllRead}>
            <CheckCircle2 className="size-4" /> Đánh dấu tất cả là đã đọc
          </Button>
        )}
      </div>

      {/* Tabs + search */}
      <div className="flex items-center gap-3 flex-wrap w-full">
        <div className="flex gap-1 flex-wrap flex-none">
          {TABS.map(t => {
            const count = t.count;
            return (
              <button key={t.id} onClick={() => setFilter(t.id)}
                style={{
                  fontSize: T.xs, fontWeight: filter === t.id ? T.fw_semi : T.fw_normal,
                  padding: "5px 12px", borderRadius: "999px", cursor: "pointer",
                  backgroundColor: filter === t.id ? T.primary : T.secondary,
                  color: filter === t.id ? "white" : T.mutedFg,
                  border: `1px solid ${filter === t.id ? T.primary : T.border}`,
                  display: "inline-flex", alignItems: "center", gap: "5px",
                }}>
                {t.label}
                {count > 0 && (
                  <span style={{ fontSize: "10px", fontWeight: T.fw_bold, minWidth: "16px", height: "16px",
                    borderRadius: "999px", backgroundColor: filter === t.id ? "rgba(255,255,255,0.3)" : T.primary,
                    color: "white",
                    display: "inline-flex", alignItems: "center", justifyContent: "center", padding: "0 4px" }}>
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
        <div className="relative flex-1 min-w-0">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4" style={{ color: T.mutedFg }} />
          <Input placeholder="Tìm kiếm thông báo" className="pl-9"
            value={search} onChange={e => setSearch(e.target.value)} />
        </div>
      </div>

      {/* List */}
      <div className="flex flex-col gap-3">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center rounded-2xl"
            style={{ border: `1px dashed ${T.border}` }}>
            <div className="size-16 rounded-2xl flex items-center justify-center mb-4" style={{ backgroundColor: T.secondary }}>
              <Bell className="size-8" style={{ color: T.mutedFg }} />
            </div>
            <p style={{ fontSize: "var(--text-base)", fontWeight: T.fw_semi, color: T.foreground, marginBottom: "6px" }}>
              {emptyTitle}
            </p>
            <p style={{ fontSize: T.sm, color: T.mutedFg, maxWidth: "360px", lineHeight: 1.6 }}>
              {emptyDesc}
            </p>
          </div>
        ) : filtered.map((n) => {
          const cfg = NOTIF_CATEGORY_CFG[n.category];
          const badge = statusBadgeCfg(n);
          const isPendingInvite = n.isInvite && n.inviteStatus === "pending";
          const cardBg =
            isPendingInvite          ? `rgba(79,70,229,0.04)` :
            n.status === "important" ? `rgba(220,38,38,0.03)` :
            n.status === "action"    ? `rgba(249,115,22,0.03)` :
            !n.read                  ? `rgba(30,170,255,0.03)` : T.background;
          const cardBorder =
            isPendingInvite          ? `rgba(79,70,229,0.2)` :
            n.status === "important" ? `rgba(220,38,38,0.2)` :
            n.status === "action"    ? `rgba(249,115,22,0.2)` :
            !n.read                  ? `rgba(30,170,255,0.15)` : T.border;
          return (
            <div key={n.id} className="flex items-start gap-4 p-4 rounded-2xl"
              style={{ backgroundColor: cardBg, border: `1px solid ${cardBorder}` }}>
              <div className="size-10 rounded-xl flex items-center justify-center shrink-0"
                style={{ backgroundColor: cfg.bg, color: cfg.color }}>
                {cfg.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <p style={{ fontSize: T.sm, fontWeight: n.read ? T.fw_normal : T.fw_semi, color: T.foreground }}>
                        {n.title}
                      </p>
                      {(n.category === "attendee" || n.category === "checkin") && (
                        <span style={{ fontSize: T.xs, padding: "1px 8px", borderRadius: "999px",
                          backgroundColor: T.secondary, color: T.mutedFg, fontWeight: T.fw_medium }}>
                          Tổng hợp hôm nay
                        </span>
                      )}
                      {badge && (
                        <span style={{ fontSize: T.xs, padding: "1px 8px", borderRadius: "999px",
                          backgroundColor: badge.bg, color: badge.color, fontWeight: T.fw_medium }}>
                          {badge.label}
                        </span>
                      )}
                    </div>
                    <p style={{ fontSize: T.sm, color: T.mutedFg, lineHeight: 1.6, marginBottom: "6px" }}>{n.desc}</p>
                    <div className="flex items-center gap-3 flex-wrap">
                      <span style={{ fontSize: T.xs, color: T.mutedFg }}>{n.time}</span>
                      <span style={{ fontSize: T.xs, padding: "1px 8px", borderRadius: "999px",
                        backgroundColor: cfg.bg, color: cfg.color }}>{cfg.label}</span>
                      {n.eventName && (
                        <span style={{ fontSize: T.xs, color: T.mutedFg }}>
                          <Calendar className="inline size-3 mr-1" />{n.eventName}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {!n.read && <div className="size-2 rounded-full" style={{ backgroundColor: T.primary }} />}
                    {n.isInvite && n.inviteStatus === "pending" ? (
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline"
                          onClick={() => onDecline(n.id)}
                          style={{ color: T.destructive, borderColor: T.destructive }}>
                          Từ chối
                        </Button>
                        <Button size="sm" onClick={() => onAccept(n.id)}>
                          Chấp nhận
                        </Button>
                      </div>
                    ) : (
                      <Button size="sm" variant="outline" onClick={() => onMarkRead(n.id)}>
                        <Eye className="size-3.5" /> {n.cta}
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

const NAV_ITEMS = [
  { id: "overview", label: "Tổng quan",          icon: LayoutDashboard },
  { id: "events",   label: "Sự kiện",             icon: Calendar },
  { id: "members",  label: "Vai trò",  icon: Users },
  { id: "reports",  label: "Báo cáo",             icon: BarChart3 },
  { id: "settings", label: "Cài đặt",             icon: Settings },
];

// ── Sidebar panel ─────────────────────────────────────────────────────────────

function SidebarPanel({
  activePage, onNavigate, currentRole, currentUserName, roleLabel, onLogout, isEventWorkspace, collapsed,
}: {
  activePage: string; onNavigate: (id: string) => void; currentRole: UserRole;
  currentUserName: string; roleLabel: string; onLogout: () => void; isEventWorkspace: boolean;
  collapsed?: boolean;
}) {
  const initials = currentUserName.split(" ").slice(-1)[0][0];

  return (
    <aside className="flex flex-col h-full overflow-hidden" style={{ backgroundColor: T.pageSurface }}>
      {/* Logo */}
      <div className="shrink-0 flex items-center"
        style={{ padding: collapsed ? "20px 10px" : "20px 16px" }}>
        {collapsed ? (
          <img
            src="https://cdn.netspace.vn/favicons/logo-ns-500x500-1-gyuauc-ejfe99.png"
            alt="NetEvent"
            style={{ width: 36, height: 36, objectFit: "contain", borderRadius: 8 }}
          />
        ) : (
          <img
            src="https://cdn.netspace.vn/editor-assets/3/header-logo-or9rychkme4o.webp"
            alt="NetEvent"
            style={{ height: 34, width: "auto", objectFit: "contain" }}
          />
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-2" style={{ padding: collapsed ? "8px 6px" : "8px 8px" }}>
        {NAV_ITEMS.map((item) => {
          const active = isEventWorkspace ? item.id === "events" : activePage === item.id;
          if (["reports"].includes(item.id)) return null;
          return (
            <button key={item.id} onClick={() => onNavigate(item.id)}
              title={collapsed ? item.label : undefined}
              className="w-full flex items-center rounded-lg mb-0.5 transition-colors cursor-pointer"
              style={{
                gap: collapsed ? 0 : 10,
                padding: collapsed ? "8px 0" : "8px 12px",
                justifyContent: collapsed ? "center" : "flex-start",
                backgroundColor: active ? "var(--primary-subtle, rgba(30,170,255,0.1))" : "transparent",
                color: active ? T.primary : T.mutedFg,
                fontWeight: active ? T.fw_medium : T.fw_normal,
                fontSize: T.sm,
              }}
              onMouseEnter={(e) => { if (!active) (e.currentTarget as HTMLButtonElement).style.backgroundColor = T.secondary; }}
              onMouseLeave={(e) => { if (!active) (e.currentTarget as HTMLButtonElement).style.backgroundColor = "transparent"; }}>
              <item.icon className="size-4 shrink-0" />
              {!collapsed && item.label}
            </button>
          );
        })}
      </nav>

      {/* User footer */}
      <div className="shrink-0" style={{ borderTop: `1px solid ${T.border}`, padding: collapsed ? "10px 6px" : "10px 12px" }}>
        {collapsed ? (
          <div className="flex justify-center">
            <Avatar className="size-8 cursor-pointer" title={currentUserName}>
              <AvatarFallback style={{
                backgroundColor: `color-mix(in srgb, ${T.primary} 12%, transparent)`,
                color: T.primary, fontSize: T.xs, fontWeight: T.fw_semi,
              }}>{initials}</AvatarFallback>
            </Avatar>
          </div>
        ) : (
          <div className="flex items-center gap-2.5 px-2 py-1 rounded-lg">
            <Avatar className="size-8 shrink-0">
              <AvatarFallback style={{
                backgroundColor: `color-mix(in srgb, ${T.primary} 12%, transparent)`,
                color: T.primary, fontSize: T.xs, fontWeight: T.fw_semi,
              }}>{initials}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="truncate" style={{ fontSize: T.xs, fontWeight: T.fw_medium, color: T.foreground }}>{currentUserName}</p>
              <p className="truncate" style={{ fontSize: T.xs, color: T.mutedFg }}>{roleLabel}</p>
            </div>
            <Button variant="ghost" size="icon" className="size-7 shrink-0" onClick={onLogout} title="Đăng xuất">
              <LogOut className="size-3.5" />
            </Button>
          </div>
        )}
      </div>
    </aside>
  );
}

// ── Admin Dashboard shell ─────────────────────────────────────────────────────

export function AdminDashboard({ currentRole, onLogout }: AdminDashboardProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const isEventWorkspace = location.pathname.startsWith("/event");
  const [activePage, setActivePage] = useState("events");

  const handleNavigate = (id: string) => {
    setActivePage(id);
    if (id !== "events") setEventsScreen("list");
    if (isEventWorkspace && id !== "events") navigate("/");
  };
  const [eventsScreen, setEventsScreen] = useState<"list" | "create">("list");
  const [membersInviteOpen, setMembersInviteOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [desktopSidebarCollapsed, setDesktopSidebarCollapsed] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>(MOCK_NOTIFICATIONS);
  const [notifOpen, setNotifOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllRead = () => setNotifications(p => p.map(n => ({ ...n, read: true })));
  const markRead = (id: string) => setNotifications(p => p.map(n => n.id === id ? { ...n, read: true } : n));
  const acceptInvite = (id: string) => setNotifications(p => p.map(n =>
    n.id === id ? { ...n, inviteStatus: "accepted" as InviteStatus, status: "update" as NotifStatus, read: true, cta: "Xem sự kiện", title: n.title } : n));
  const declineInvite = (id: string) => setNotifications(p => p.map(n =>
    n.id === id ? { ...n, inviteStatus: "declined" as InviteStatus, status: "read" as NotifStatus, read: true } : n));

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setNotifOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const roleLabelMap: Record<UserRole, string> = {
    owner: "Chủ tài khoản", admin: "Quản trị sự kiện", staff: "Nhân sự sự kiện",
  };
  const currentUserName = currentRole === "owner" ? "Nguyễn Thị Lan"
    : currentRole === "admin" ? "Trần Văn Minh" : "Phạm Đức Anh";

  return (
    <div className="flex h-screen overflow-hidden" style={{ backgroundColor: T.pageSurface }}>

      {/* Sidebar — in normal document flow, never overlaps content */}
      {/* Desktop: always visible; Mobile: toggleable overlay */}
      <>
        {/* Desktop sidebar */}
        <div className="hidden md:flex flex-col shrink-0 overflow-hidden"
          style={{ width: desktopSidebarCollapsed ? "60px" : "240px", transition: "width 0.2s ease" }}>
          <SidebarPanel
            activePage={activePage} onNavigate={handleNavigate}
            currentRole={currentRole} currentUserName={currentUserName}
            roleLabel={roleLabelMap[currentRole]} onLogout={onLogout}
            isEventWorkspace={isEventWorkspace}
            collapsed={desktopSidebarCollapsed}
          />
        </div>

        {/* Mobile sidebar overlay */}
        {sidebarOpen && (
          <div className="md:hidden fixed inset-0 z-40 flex">
            <div className="w-64 flex flex-col shadow-xl"
              style={{ backgroundColor: T.pageSurface }}>
              <SidebarPanel
                activePage={activePage} onNavigate={(id) => { handleNavigate(id); setSidebarOpen(false); }}
                currentRole={currentRole} currentUserName={currentUserName}
                roleLabel={roleLabelMap[currentRole]} onLogout={onLogout}
                isEventWorkspace={isEventWorkspace}
              />
            </div>
            {/* Backdrop */}
            <div className="flex-1 bg-black/40" onClick={() => setSidebarOpen(false)} />
          </div>
        )}
      </>

      {/* Main content — flex-1 takes all remaining space, never hidden behind sidebar */}
      <div className="flex-1 min-w-0 flex flex-col p-4 overflow-hidden"
        style={{ backgroundColor: T.pageSurface }}>
        <div className="flex flex-col flex-1 min-h-0 overflow-hidden md:rounded-[20px]"
          style={{ backgroundColor: T.background, border: `1px solid ${T.pageBorder}` }}>

          {/* Topbar */}
          <header className="flex h-14 shrink-0 items-center justify-between px-3 sm:px-6"
            style={{ borderBottom: `1px solid ${T.pageBorder}` }}>
            <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
              {/* Desktop sidebar toggle */}
              <Button variant="ghost" size="icon" className="hidden md:inline-flex shrink-0"
                onClick={() => setDesktopSidebarCollapsed(c => !c)}
                title={desktopSidebarCollapsed ? "Mở rộng sidebar" : "Thu gọn sidebar"}>
                {desktopSidebarCollapsed
                  ? <PanelLeftOpen className="size-4" />
                  : <PanelLeftClose className="size-4" />}
              </Button>
              {/* Mobile menu toggle */}
              <Button variant="ghost" size="icon" className="md:hidden shrink-0"
                onClick={() => setSidebarOpen(!sidebarOpen)}>
                <Menu className="size-4" />
              </Button>
              {/* Breadcrumb */}
              <nav className="flex items-center gap-1 min-w-0 overflow-hidden" aria-label="Breadcrumb">
                {isEventWorkspace ? (
                  <>
                    <button
                      onClick={() => navigate("/")}
                      className="shrink-0 transition-colors hover:text-foreground"
                      style={{ background: "none", border: "none", cursor: "pointer", padding: 0, fontSize: T.sm, color: T.mutedFg }}>
                      Sự kiện
                    </button>
                    <ChevronRight className="size-3.5 shrink-0" style={{ color: T.mutedFg, opacity: 0.6 }} />
                    <span className="truncate" style={{ fontSize: T.sm, fontWeight: T.fw_semi, color: T.foreground }}>
                      {DEMO_EVENT.name}
                    </span>
                  </>
                ) : !isEventWorkspace && activePage === "events" && eventsScreen === "create" ? (
                  <>
                    <button
                      onClick={() => setEventsScreen("list")}
                      className="shrink-0 transition-colors hover:text-foreground"
                      style={{ background: "none", border: "none", cursor: "pointer", padding: 0, fontSize: T.sm, color: T.mutedFg }}>
                      Sự kiện
                    </button>
                    <ChevronRight className="size-3.5 shrink-0" style={{ color: T.mutedFg, opacity: 0.6 }} />
                    <span className="truncate" style={{ fontSize: T.sm, fontWeight: T.fw_semi, color: T.foreground }}>
                      Tạo sự kiện
                    </span>
                  </>
                ) : (
                  <span className="truncate" style={{ fontSize: T.sm, fontWeight: T.fw_semi, color: T.foreground }}>
                    {activePage === "notifications" ? "Thông báo" : NAV_ITEMS.find((n) => n.id === activePage)?.label ?? "Dashboard"}
                  </span>
                )}
              </nav>
            </div>
            <div className="flex items-center gap-1 sm:gap-2 shrink-0">
              {/* Page action buttons */}
              {!isEventWorkspace && (activePage === "overview" || (activePage === "events" && eventsScreen === "list")) && (
                <Button size="sm" onClick={() => { if (activePage === "overview") setActivePage("events"); setEventsScreen("create"); }}>
                  <Plus className="size-4" />
                  <span className="hidden sm:inline">Tạo sự kiện</span>
                </Button>
              )}
              {!isEventWorkspace && activePage === "members" && currentRole === "owner" && (
                <Button size="sm" onClick={() => setMembersInviteOpen(true)}>
                  <UserPlus className="size-4" />
                  <span className="hidden sm:inline">Mời thành viên</span>
                </Button>
              )}
              {/* Notification bell */}
              <div className="relative" ref={notifRef}>
                <button onClick={() => setNotifOpen(o => !o)}
                  className="size-9 flex items-center justify-center rounded-lg transition-colors hover:bg-[var(--secondary)] cursor-pointer"
                  style={{ position: "relative", color: T.mutedFg }}>
                  <Bell className="size-4" />
                  {unreadCount > 0 && (
                    <span style={{
                      position: "absolute", top: "4px", right: "4px",
                      minWidth: "16px", height: "16px", borderRadius: "999px",
                      backgroundColor: T.primary, color: "white",
                      fontSize: "10px", fontWeight: T.fw_bold,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      padding: "0 4px", lineHeight: 1,
                      border: `2px solid ${T.background}`,
                    }}>
                      {unreadCount > 99 ? "99+" : unreadCount}
                    </span>
                  )}
                </button>
                {notifOpen && (
                  <div style={{ position: "absolute", top: "calc(100% + 8px)", right: 0, zIndex: 50 }}>
                    <NotificationDropdown
                      notifications={notifications}
                      onMarkAllRead={markAllRead}
                      onMarkRead={markRead}
                      onAccept={acceptInvite}
                      onDecline={declineInvite}
                      onViewAll={() => { setActivePage("notifications"); setNotifOpen(false); }}
                    />
                  </div>
                )}
              </div>
            </div>
          </header>

          {/* Page co m-[0px]ntent */}
          <main className="flex-1 min-h-0 overflow-x-hidden overflow-y-auto">
            {isEventWorkspace ? (
              <Outlet />
            ) : activePage === "overview" ? (
              <div className="mx-auto w-full px-4 sm:px-6 lg:px-8 xl:px-10 py-6 m-[0px]" style={{ maxWidth: "1280px" }}>
                <AccountOverview />
              </div>
            ) : (
              <div className="mx-auto w-full px-4 sm:px-6 lg:px-8 xl:px-10 py-6" style={{ maxWidth: "1280px", paddingTop: 24, paddingBottom: 24 }}>
                {activePage === "members"
                  ? <RolesPage currentRole={currentRole} inviteOpen={membersInviteOpen} onInviteOpenChange={setMembersInviteOpen} />
                  : activePage === "events"
                  ? <EventsPage screen={eventsScreen} onScreenChange={setEventsScreen} />
                  : activePage === "notifications"
                  ? <NotificationsPage notifications={notifications} onMarkAllRead={markAllRead} onMarkRead={markRead} onAccept={acceptInvite} onDecline={declineInvite} />
                  : <EmptyPage page={activePage} />}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

function EmptyPage({ page }: { page: string }) {
  const labels: Record<string, string> = {
    overview: "Tổng quan", events: "Quản lý sự kiện", reports: "Báo cáo", settings: "Cài đặt account",
  };
  return (
    <div className="flex flex-col items-center justify-center h-full text-center py-20">
      <div className="size-16 rounded-2xl flex items-center justify-center mb-4"
        style={{ backgroundColor: T.secondary }}>
        <LayoutDashboard className="size-8" style={{ color: T.mutedFg }} />
      </div>
      <h3 style={{ color: T.foreground }} className="mb-2">{labels[page] ?? page}</h3>
      <p style={{ color: T.mutedFg, fontSize: T.sm }}>Trang này đang được phát triển.</p>
    </div>
  );
}

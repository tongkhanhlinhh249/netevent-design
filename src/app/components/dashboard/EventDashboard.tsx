import * as React from "react";
import { useState } from "react";
import { useNavigate } from "react-router";
import {
  Users, Ticket, DollarSign, UserCheck, Globe,
  AlertCircle, ChevronRight, ExternalLink,
  Calendar, MapPin, Pencil, BarChart3, Mail, QrCode, Plus,
  Download, Eye, Settings, Copy, Facebook, Twitter, Linkedin, MessageCircle, Image,
  ArrowLeft, UserPlus, Check, X, Sparkles, AtSign, Search, Lock, ChevronDown, Video, Smartphone
} from "lucide-react";
import { Button } from "../ui/button";
import { Switch } from "../ui/switch";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Dialog, DialogContent, DialogTitle } from "../ui/dialog";
import { Textarea } from "../ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Sheet, SheetContent } from "../ui/sheet";
import { useCurrentEvent } from "../../data/currentEvent";
import { OrganizerAvatarPicker } from "./OrganizerAvatarPicker";
import { EmailSettingsCard } from "./EmailSettings";
import { PseudoQr } from "../attendee/PseudoQr";
import { useCheckinConfig } from "../../data/attendeeFlow";
import { toast } from "sonner";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { dateParts, shortDateVi } from "../../data/eventFormat";

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

type Host = { name: string; email: string; role: string };

const HOSTS: Host[] = [
  { name: "Nguyễn Thị Lan", email: "owner@netevent.vn", role: "Người tạo" },
  { name: "Trần Văn Minh",  email: "admin@netevent.vn", role: "Quản lý"   },
];

// ── Dialog thêm / sửa ban tổ chức ─────────────────────────────────────────────

const ACCESS_OPTIONS = [
  { id: "Quản lý",        desc: "Toàn quyền quản lý sự kiện." },
  { id: "Không quản lý",  desc: "Chỉ hiển thị, không quản lý được sự kiện." },
];

function AccessControl({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div className="flex flex-col gap-2">
      <p style={{ fontSize: T.xs, color: T.mutedFg }}>Phân quyền</p>
      {ACCESS_OPTIONS.map((o) => {
        const on = value === o.id;
        return (
          <button key={o.id} type="button" data-pill="off"
            onClick={() => onChange(o.id)}
            aria-pressed={on}
            className="rounded-xl p-3 flex items-center gap-3 text-left cursor-pointer transition-colors"
            style={{
              border: on ? `2px solid ${T.foreground}` : `1px solid ${T.border}`,
              backgroundColor: T.background,
            }}>
            <UserPlus className="size-4 shrink-0" style={{ color: T.mutedFg }} />
            <span className="flex-1 min-w-0 flex flex-col">
              <span style={{ fontSize: T.sm, fontWeight: T.fw_medium, color: T.foreground }}>{o.id}</span>
              <span style={{ fontSize: T.xs, color: T.mutedFg, marginTop: 1 }}>{o.desc}</span>
            </span>
            {on && (
              <span className="size-5 rounded-full shrink-0 flex items-center justify-center"
                style={{ backgroundColor: T.foreground }}>
                <Check className="size-3" style={{ color: T.background }} />
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

function HostDialog({ mode, host, onClose, onSave, onRemove }: {
  mode: "add" | "edit";
  host?: Host;
  onClose: () => void;
  onSave: (h: Host) => void;
  onRemove?: (h: Host) => void;
}) {
  // Luồng thêm đi qua hai bước: tìm email, rồi cấu hình. Luồng sửa vào thẳng
  // bước cấu hình vì đã biết người đó là ai.
  const [step, setStep] = useState<"search" | "configure">(mode === "edit" ? "configure" : "search");
  const [email, setEmail] = useState(host?.email ?? "");
  const [name, setName] = useState(host?.name ?? "");
  const [showOnPage, setShow] = useState(true);
  const [access, setAccess] = useState(host?.role === "Không quản lý" ? "Không quản lý" : "Quản lý");

  const looksLikeEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

  const submit = () => {
    onSave({ name: name.trim() || email.trim().split("@")[0], email: email.trim(), role: access });
    onClose();
  };

  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-[420px]">
        {step === "search" ? (
          <div className="flex flex-col gap-4">
            <span className="size-11 rounded-full flex items-center justify-center"
              style={{ backgroundColor: T.secondary }}>
              <UserPlus className="size-5" style={{ color: T.mutedFg }} />
            </span>

            <div>
              <p style={{ fontSize: T.lg, fontWeight: T.fw_semi, color: T.foreground }}>Thêm ban tổ chức</p>
              <p style={{ fontSize: T.sm, color: T.mutedFg, marginTop: 4, lineHeight: 1.6 }}>
                Thêm người vào ban tổ chức để hiển thị trên trang sự kiện, hoặc để cùng quản lý sự kiện.
              </p>
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="host-email">Nhập email hoặc tìm kiếm</Label>
              <Input id="host-email" autoFocus placeholder="ten@congty.vn"
                value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>

            {looksLikeEmail ? (
              <button type="button" data-pill="off"
                onClick={() => setStep("configure")}
                className="rounded-xl p-3 flex items-center gap-3 text-left cursor-pointer transition-colors"
                style={{ backgroundColor: T.secondary, border: `1px solid ${T.border}` }}>
                <span className="size-8 rounded-full shrink-0 flex items-center justify-center"
                  style={{ backgroundColor: T.background }}>
                  <Users className="size-4" style={{ color: T.mutedFg }} />
                </span>
                <span className="flex-1 min-w-0 flex flex-col">
                  <span className="truncate" style={{ fontSize: T.sm, fontWeight: T.fw_medium, color: T.foreground }}>{email.trim()}</span>
                  <span style={{ fontSize: T.xs, color: T.mutedFg }}>Mời vào ban tổ chức qua email</span>
                </span>
              </button>
            ) : (
              <div className="flex flex-col items-center gap-1 py-6">
                <p style={{ fontSize: T.sm, fontWeight: T.fw_medium, color: T.mutedFg }}>Chưa có gợi ý nào</p>
                <p className="text-center" style={{ fontSize: T.xs, color: T.mutedFg, lineHeight: 1.5 }}>
                  Nhập email của người bạn muốn mời vào ban tổ chức.
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              {mode === "add" && (
                <button type="button" data-pill="off" onClick={() => setStep("search")}
                  className="shrink-0 cursor-pointer transition-opacity hover:opacity-70"
                  style={{ background: "none", border: "none", padding: 2, color: T.mutedFg }}>
                  <ArrowLeft className="size-4" />
                </button>
              )}
              <p style={{ fontSize: T.base, fontWeight: T.fw_semi, color: T.foreground }}>
                {mode === "add" ? "Cấu hình ban tổ chức" : "Cập nhật ban tổ chức"}
              </p>
            </div>

            <p className="truncate" style={{ fontSize: T.sm, color: T.mutedFg }}>{email}</p>

            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p style={{ fontSize: T.sm, fontWeight: T.fw_medium, color: T.foreground }}>Hiển thị trên trang sự kiện</p>
                <p style={{ fontSize: T.xs, color: T.mutedFg, marginTop: 2, lineHeight: 1.5 }}>
                  Tên và ảnh sẽ xuất hiện ở mục đơn vị tổ chức trên trang sự kiện.
                </p>
              </div>
              <Switch className="shrink-0 mt-0.5" checked={showOnPage} onCheckedChange={setShow} />
            </div>

            {mode === "add" && (
              <div className="flex items-center gap-3">
                <span className="size-10 rounded-full shrink-0" style={{ backgroundColor: T.secondary }} />
                <Input placeholder="Tên hiển thị" value={name} onChange={(e) => setName(e.target.value)} />
              </div>
            )}

            <AccessControl value={access} onChange={setAccess} />

            {mode === "add" ? (
              <Button onClick={submit} disabled={!looksLikeEmail}>Gửi lời mời</Button>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Button onClick={submit}>Cập nhật</Button>
                <Button variant="outline"
                  style={{ color: T.destructive, borderColor: T.destructive }}
                  onClick={() => { if (host && onRemove) onRemove(host); onClose(); }}>
                  Gỡ khỏi ban tổ chức
                </Button>
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

// ── Mời khách ─────────────────────────────────────────────────────────────────

const INVITE_QUOTA = 15;

const CONTACTS = [
  { name: "Hoàng Anh Tuấn",  email: "tuan.hoang@gmail.com",   tint: "#f87171" },
  { name: "Nguyễn Chí Hưng", email: "hung.nguyen@gmail.com",  tint: "#a78bfa" },
  { name: "Lê Công Khoa",    email: "khoa.le@gmail.com",      tint: "#fbbf24" },
  { name: "Phạm Mạnh Hùng",  email: "hung.pham@gmail.com",    tint: "#fb7185" },
];

const PAST_EVENTS = [
  { name: "Fanmeeting offline Hoàng Xuân", date: "19 Thg 6", guests: 4 },
];

function InviteGuestsDialog({ onClose }: { onClose: () => void }) {
  const [source, setSource] = useState<"suggest" | "emails">("suggest");
  const [search, setSearch] = useState("");
  const [picked, setPicked] = useState<string[]>([]);
  const [emails, setEmails] = useState("");

  const toggle = (email: string) =>
    setPicked((prev) => prev.includes(email) ? prev.filter((e) => e !== email) : [...prev, email]);

  const shown = CONTACTS.filter((c) =>
    !search || c.name.toLowerCase().includes(search.toLowerCase()) || c.email.toLowerCase().includes(search.toLowerCase()));

  const left = INVITE_QUOTA - picked.length;

  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-[760px] p-0 gap-0 overflow-hidden">
        <div className="flex items-center justify-between gap-3 px-5 py-3.5" style={{ borderBottom: `1px solid ${T.border}` }}>
          <p style={{ fontSize: T.base, fontWeight: T.fw_semi, color: T.foreground }}>Mời khách</p>
          <span style={{ fontSize: T.xs, color: T.mutedFg, padding: "2px 10px", borderRadius: 999,
            border: `1px solid ${T.border}`, whiteSpace: "nowrap", marginRight: 24 }}>
            Còn {left} lượt
          </span>
        </div>

        <div className="flex" style={{ minHeight: 380 }}>
          {/* Rail trái: nguồn danh sách khách */}
          <div className="shrink-0 flex flex-col gap-1 p-3" style={{ width: 220, borderRight: `1px solid ${T.border}` }}>
            {([
              { id: "suggest" as const, label: "Gợi ý",      icon: Sparkles },
              { id: "emails"  as const, label: "Nhập email", icon: AtSign },
            ]).map((o) => {
              const on = source === o.id;
              return (
                <button key={o.id} type="button" data-pill="off"
                  onClick={() => setSource(o.id)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-left cursor-pointer transition-colors"
                  style={{
                    backgroundColor: on ? T.secondary : "transparent",
                    color: on ? T.foreground : T.mutedFg,
                    fontSize: T.sm, fontWeight: on ? T.fw_medium : T.fw_normal,
                    border: "none",
                  }}>
                  <o.icon className="size-4 shrink-0" /> {o.label}
                </button>
              );
            })}

            <div style={{ borderTop: `1px solid ${T.border}`, margin: "8px 0" }} />

            <p style={{ fontSize: "10px", fontWeight: T.fw_semi, color: T.mutedFg,
              textTransform: "uppercase" as const, letterSpacing: "0.05em", padding: "0 12px 4px" }}>
              Danh bạ
            </p>
            <div className="flex items-center justify-between gap-2 px-3 py-2">
              <span className="flex items-center gap-2" style={{ fontSize: T.sm, color: T.foreground }}>
                <span className="inline-block size-1.5 rounded-full" style={{ backgroundColor: T.mutedFg }} />
                Tất cả
              </span>
              <span style={{ fontSize: T.xs, color: T.mutedFg }}>{CONTACTS.length}</span>
            </div>

            <p style={{ fontSize: "10px", fontWeight: T.fw_semi, color: T.mutedFg,
              textTransform: "uppercase" as const, letterSpacing: "0.05em", padding: "12px 12px 4px" }}>
              Sự kiện trước
            </p>
            {PAST_EVENTS.map((e) => (
              <div key={e.name} className="px-3 py-2">
                <p className="truncate" style={{ fontSize: T.sm, color: T.foreground }}>{e.name}</p>
                <p style={{ fontSize: T.xs, color: T.mutedFg, marginTop: 1 }}>{e.date} · {e.guests} khách</p>
              </div>
            ))}
          </div>

          {/* Panel phải */}
          <div className="flex-1 min-w-0 flex flex-col gap-3 p-4">
            {source === "suggest" ? (
              <>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 pointer-events-none" style={{ color: T.mutedFg }} />
                  <Input className="pl-9" placeholder="Tìm trong gợi ý"
                    value={search} onChange={(e) => setSearch(e.target.value)} />
                </div>

                <div className="flex flex-col overflow-y-auto" style={{ maxHeight: 300 }}>
                  {shown.map((c) => {
                    const on = picked.includes(c.email);
                    return (
                      <button key={c.email} type="button" data-pill="off"
                        onClick={() => toggle(c.email)}
                        aria-pressed={on}
                        className="flex items-center gap-3 px-2 py-2.5 rounded-lg text-left cursor-pointer transition-colors"
                        style={{ background: "none", border: "none" }}>
                        <span className="size-9 rounded-full shrink-0" style={{ backgroundColor: c.tint }} />
                        <span className="flex-1 min-w-0 flex flex-col">
                          <span className="truncate" style={{ fontSize: T.sm, fontWeight: T.fw_medium, color: T.foreground }}>{c.name}</span>
                          <span className="truncate" style={{ fontSize: T.xs, color: T.mutedFg }}>{c.email}</span>
                        </span>
                        <span className="size-5 rounded-full shrink-0 flex items-center justify-center"
                          style={{ border: on ? "none" : `1.5px solid ${T.border}`,
                            backgroundColor: on ? T.primary : "transparent" }}>
                          {on && <Check className="size-3" style={{ color: T.primaryFg ?? "#fff" }} />}
                        </span>
                      </button>
                    );
                  })}
                  {shown.length === 0 && (
                    <p className="text-center py-8" style={{ fontSize: T.sm, color: T.mutedFg }}>Không tìm thấy ai phù hợp.</p>
                  )}
                </div>
              </>
            ) : (
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="invite-emails">Nhập email, cách nhau bằng dấu phẩy</Label>
                <Textarea id="invite-emails" rows={10}
                  placeholder="an@congty.vn, binh@congty.vn"
                  value={emails} onChange={(e) => setEmails(e.target.value)} />
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between gap-3 px-5 py-3.5" style={{ borderTop: `1px solid ${T.border}` }}>
          <span style={{ fontSize: T.xs, color: T.mutedFg }}>
            {source === "suggest" ? `Đã chọn ${picked.length} người` : "Mỗi email một lời mời"}
          </span>
          <Button disabled={source === "suggest" ? picked.length === 0 : !emails.trim()} onClick={onClose}>
            Tiếp tục <ChevronRight className="size-3.5" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ── Cấu hình check-in ───────────────────────────────────────────────────────────

function CheckinSettingsCard({ eventId }: { eventId: string }) {
  const [config, setConfig] = useCheckinConfig(eventId);
  const selfUrl = `/tu-check-in?event=${encodeURIComponent(eventId)}`;
  const toggle = (key: "qr" | "phone", on: boolean) => {
    const next = { ...config, [key]: on };
    // Luôn phải còn ít nhất một cách check-in.
    if (!next.qr && !next.phone) { toast.error("Cần bật ít nhất một cách check-in."); return; }
    setConfig(next);
  };
  const rows = [
    { key: "qr" as const,    icon: QrCode,     label: "Quét mã QR trên vé", desc: "Nhân viên quét mã QR trong vé của từng người." },
    { key: "phone" as const, icon: Smartphone, label: "Nhập số điện thoại", desc: "Người tham dự quét mã QR chung của sự kiện rồi nhập số điện thoại đã đăng ký." },
  ];
  return (
    <div className="rounded-2xl p-5" style={{ backgroundColor: T.background, border: `1px solid ${T.border}` }}>
      <div className="flex items-center justify-between gap-3">
        <h3 style={{ fontSize: T.base, fontWeight: T.fw_semi, color: T.foreground }}>Check-in</h3>
        <Button size="sm" variant="outline" className="shrink-0" style={{ fontSize: T.xs }} asChild>
          <a href={`/check-in?event=${encodeURIComponent(eventId)}`} target="_blank" rel="noreferrer">
            Mở trang check-in <ExternalLink className="size-3" />
          </a>
        </Button>
      </div>
      <p style={{ fontSize: T.xs, color: T.mutedFg, lineHeight: 1.6, marginTop: 4 }}>Cách người tham dự check-in tại sự kiện.</p>
      <div className="flex flex-col mt-1">
        {rows.map((r, i) => (
          <div key={r.key} className="flex items-start gap-3 py-3" style={{ borderTop: i === 0 ? "none" : `1px solid ${T.border}` }}>
            <r.icon className="size-4 shrink-0 mt-0.5" style={{ color: T.mutedFg }} />
            <div className="flex-1 min-w-0">
              <p style={{ fontSize: T.sm, fontWeight: T.fw_medium, color: T.foreground }}>{r.label}</p>
              <p style={{ fontSize: T.xs, color: T.mutedFg, marginTop: 2, lineHeight: 1.5 }}>{r.desc}</p>
            </div>
            <Switch className="shrink-0 mt-0.5" aria-label={r.label} checked={config[r.key]}
              onCheckedChange={(v) => toggle(r.key, v)} />
          </div>
        ))}
      </div>
      {config.phone && (
        <div className="flex items-center gap-3 rounded-xl p-3" style={{ backgroundColor: T.secondary }}>
          <PseudoQr value={selfUrl} size={72} />
          <div className="flex-1 min-w-0">
            <p style={{ fontSize: T.sm, fontWeight: T.fw_medium, color: T.foreground }}>Mã QR check-in chung</p>
            <p style={{ fontSize: T.xs, color: T.mutedFg, marginTop: 2, lineHeight: 1.5 }}>
              In và đặt ở lối vào — người tham dự quét để tự check-in.
            </p>
            <a href={selfUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 mt-1.5 hover:underline"
              style={{ fontSize: T.xs, fontWeight: T.fw_medium, color: T.primary }}>
              Mở trang tự check-in <ExternalLink className="size-3" />
            </a>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Chế độ hiển thị ──────────────────────────────────────────────────────────

const VISIBILITY_OPTIONS = [
  { id: "public",  label: "Công khai", desc: "Ai cũng có thể tìm thấy trang sự kiện và đăng ký.", icon: Globe },
  { id: "private", label: "Riêng tư",  desc: "Chỉ người có link mới xem và đăng ký được.",        icon: Lock },
] as const;

// ── Sửa đơn vị tổ chức ────────────────────────────────────────────────────────

function OrganizerDialog({ name: initialName, avatar: initialAvatar, onClose, onSave }: {
  name: string;
  avatar?: string;
  onClose: () => void;
  onSave: (name: string, avatar: string | null) => void;
}) {
  const [name, setName] = useState(initialName);
  const [avatar, setAvatar] = useState<string | null>(initialAvatar ?? null);
  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-[420px]" aria-describedby={undefined}>
        <div className="flex flex-col gap-4">
          <div>
            <DialogTitle style={{ fontSize: T.lg, fontWeight: T.fw_semi, color: T.foreground }}>Đơn vị tổ chức</DialogTitle>
            <p style={{ fontSize: T.sm, color: T.mutedFg, marginTop: 4, lineHeight: 1.6 }}>
              Ảnh đại diện và tên hiển thị ở mục Đơn vị tổ chức trên trang sự kiện.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <OrganizerAvatarPicker value={avatar} name={name} onChange={setAvatar} size={64} />
            <div className="flex flex-col gap-1">
              <span style={{ fontSize: T.xs, color: T.mutedFg }}>Bấm vào ảnh để tải lên. Nên dùng ảnh vuông.</span>
              {avatar && (
                <button type="button" data-pill="off" onClick={() => setAvatar(null)}
                  className="self-start cursor-pointer transition-opacity hover:opacity-70"
                  style={{ background: "none", border: "none", padding: 0, fontSize: T.xs, color: T.destructive }}>
                  Gỡ ảnh
                </button>
              )}
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="org-name">Tên đơn vị</Label>
            <Input id="org-name" value={name} onChange={(e) => setName(e.target.value)}
              placeholder="Tên công ty, tổ chức hoặc cá nhân tổ chức" />
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>Hủy</Button>
            <Button onClick={() => { onSave(name.trim(), avatar); onClose(); }}>Lưu</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ── Helpers ───────────────────────────────────────────────────────────────────

/** Hai chữ cái đầu của tên, dùng cho avatar tròn. */
function initials(name: string) {
  const parts = name.trim().split(/\s+/);
  return ((parts[0]?.[0] ?? "") + (parts[parts.length - 1]?.[0] ?? "")).toUpperCase();
}

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
  // Đo bề rộng thật của container thay vì cố định 560: viewBox cố định kèm
  // height cố định khiến preserveAspectRatio khoá tỷ lệ, chart chỉ vẽ được
  // 560px rồi căn giữa và bỏ trống hai bên. Dùng preserveAspectRatio="none"
  // thì lấp đầy được nhưng chữ và nét vẽ bị kéo giãn theo.
  const wrapRef = React.useRef<HTMLDivElement>(null);
  const [measuredW, setMeasuredW] = useState(560);

  React.useEffect(() => {
    const el = wrapRef.current;
    if (!el || typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(([entry]) => {
      const next = Math.round(entry.contentRect.width);
      if (next > 0) setMeasuredW(next);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const VW = measuredW; const VH = 180;
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
    <div ref={wrapRef} style={{ width: "100%" }}>
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
    </div>
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

  const [hosts, setHosts] = useState<Host[]>(HOSTS);
  const [hostDialog, setHostDialog] = useState<{ mode: "add" | "edit"; host?: Host } | null>(null);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [orgOpen, setOrgOpen] = useState(false);
  const { event: currentEvent, setEvent: setCurrentEvent } = useCurrentEvent();
  const orgName = currentEvent.organizer?.trim() || "NetSpace";
  const isPrivate  = currentEvent.visibility === "private";
  const visibility = VISIBILITY_OPTIONS.find((o) => o.id === currentEvent.visibility) ?? VISIBILITY_OPTIONS[0];
  // Ngày giờ, địa điểm lấy theo sự kiện đang xem; sự kiện demo giữ địa chỉ chi tiết mẫu.
  const isDemoEvent = currentEvent.id === "t1";
  const isOnline    = currentEvent.format === "online";
  const date        = dateParts(currentEvent.startDate);
  const multiDay    = !!currentEvent.endDate && currentEvent.endDate !== currentEvent.startDate;
  const timeLabel   = currentEvent.startTime
    ? `${currentEvent.startTime} – ${currentEvent.endTime} GMT+7${multiDay ? ` · đến ${shortDateVi(currentEvent.endDate)}` : ""}`
    : "";
  const locPrimary   = isDemoEvent ? "NetSpace — Tòa nhà MIPEC"
    : isOnline ? "Sự kiện trực tuyến" : (currentEvent.location?.trim() || "Chưa có địa điểm");
  const locSecondary = isDemoEvent ? "Tòa nhà MIPEC, Tây Sơn, Hà Nội"
    : isOnline ? "Link tham gia gửi qua email sau khi đăng ký" : "";
  const navigate = useNavigate();

  // Lấy từ TICKET_TIERS để số ở cột phải khớp với phần "Vé và doanh thu".
  const totalRegistered = TICKET_TIERS.reduce((n, t) => n + t.sold, 0);
  const totalCapacity   = TICKET_TIERS.reduce((n, t) => n + t.total, 0);
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

      {/* Lưới 2 cột: trái = nội dung chính, phải = lời mời / người tham dự / ban tổ chức */}
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_340px] gap-6 items-start">

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
                  background: currentEvent.coverImage
                    ? `center / cover no-repeat url("${currentEvent.coverImage}")`
                    : "linear-gradient(135deg, #0f172a 0%, #1e3a8a 55%, #3b82f6 100%)",
                  display: "flex", flexDirection: "column", padding: 12 }}>

                  {/* Top row: status badge + Thay đổi ảnh */}
                  <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", zIndex: 1 }}>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span style={{ fontSize: T.xs, fontWeight: T.fw_semi, padding: "2px 8px", borderRadius: "999px",
                        backgroundColor: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}` }}>
                        {cfg.label}
                      </span>
                      {/* Công khai / riêng tư: nhãn cạnh trạng thái sự kiện, bấm để đổi.
                          Trang sự kiện đọc cùng giá trị này. */}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button type="button" aria-label="Đổi chế độ hiển thị"
                            className="inline-flex items-center gap-1 cursor-pointer transition-opacity hover:opacity-85"
                            style={{ fontSize: T.xs, fontWeight: T.fw_semi, padding: "2px 8px",
                              backgroundColor: isPrivate ? "#fdf2f8" : "#ecfdf5",
                              color: isPrivate ? "#be185d" : "#047857",
                              border: `1px solid ${isPrivate ? "#fbcfe8" : "#a7f3d0"}` }}>
                            <visibility.icon className="size-3" /> {visibility.label}
                            <ChevronDown className="size-3" />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start" className="w-72">
                          {VISIBILITY_OPTIONS.map((o) => (
                            <DropdownMenuItem key={o.id} className="items-start gap-3 py-2 cursor-pointer"
                              onSelect={() => setCurrentEvent({ ...currentEvent, visibility: o.id })}>
                              <o.icon className="size-4 mt-0.5 shrink-0" />
                              <div className="flex-1 min-w-0">
                                <p style={{ fontSize: T.sm, fontWeight: T.fw_medium, color: T.foreground }}>{o.label}</p>
                                <p style={{ fontSize: T.xs, color: T.mutedFg, marginTop: 2 }}>{o.desc}</p>
                              </div>
                              {visibility.id === o.id && <Check className="size-4 mt-0.5 shrink-0" style={{ color: T.primary }} />}
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
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
                    {isPrivate
                      ? <Lock className="size-3" style={{ color: "white", flexShrink: 0 }} />
                      : <Globe className="size-3" style={{ color: "white", flexShrink: 0 }} />}
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
                      textTransform: "uppercase", letterSpacing: "0.05em", lineHeight: 1 }}>THÁNG {date?.month ?? "–"}</span>
                    <span style={{ fontSize: T.xl, fontWeight: T.fw_bold, color: T.foreground, lineHeight: 1.1 }}>{date?.day ?? "--"}</span>
                  </div>
                  <div>
                    <p style={{ fontSize: T.sm, fontWeight: T.fw_semi, color: T.foreground }}>
                      {date ? `${date.weekday}, ${date.day} tháng ${date.month}` : "Chưa có ngày"}
                    </p>
                    <p style={{ fontSize: T.xs, color: T.mutedFg }}>{timeLabel}</p>
                  </div>
                </div>

                {/* Location block */}
                <div>
                  <div className="flex items-start gap-4 mb-2">
                    <div style={{ width: 56, height: 56, borderRadius: 12, border: `1px solid ${T.border}`,
                      display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      {isOnline
                        ? <Video className="size-5" style={{ color: T.mutedFg }} />
                        : <MapPin className="size-5" style={{ color: T.mutedFg }} />}
                    </div>
                    <div className="pt-1 min-w-0">
                      <p style={{ fontSize: T.sm, fontWeight: T.fw_semi, color: T.foreground,
                        display: "flex", alignItems: "center", gap: 4 }}>
                        {locPrimary}
                        {!isOnline && <ExternalLink className="size-3 shrink-0" style={{ color: T.mutedFg }} />}
                      </p>
                      {locSecondary && (
                        <p style={{ fontSize: T.xs, color: T.mutedFg, marginTop: 2 }}>
                          {locSecondary}
                        </p>
                      )}
                    </div>
                  </div>
                  <p style={{ fontSize: T.xs, color: T.mutedFg }}>
                    {isOnline
                      ? "Link tham gia chỉ gửi cho người đã đăng ký."
                      : isPrivate
                        ? "Địa chỉ chỉ hiển thị với người có link sự kiện."
                        : "Địa chỉ sẽ được hiển thị công khai trên trang sự kiện."}
                  </p>
                </div>

                {/* Hai nút đồng cấp, chia đôi hàng: Chỉnh sửa trái, Check-in phải.
                    Check-in mở tab riêng: màn quét mã + danh sách khách. */}
                <div className="grid grid-cols-2 gap-2 mt-auto">
                  <Button variant="outline" className="w-full min-w-0" style={{ fontSize: T.sm }}>
                    <Pencil className="size-4" /> Chỉnh sửa
                  </Button>
                  <Button variant="outline" className="w-full min-w-0" style={{ fontSize: T.sm }} asChild>
                    <a href={`/check-in?event=${currentEvent.id}`} target="_blank" rel="noreferrer">
                      <QrCode className="size-4" /> Check-in
                    </a>
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
              <Button size="sm" variant="outline" onClick={() => navigate("/event/nguoi-tham-du")}>
            <Eye className="size-3.5" /> Xem tất cả
          </Button>
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

        {/* RIGHT column */}
        <div className="flex flex-col gap-5">

          {/* ── Lời mời ── */}
          <div className="rounded-2xl p-5" style={{ backgroundColor: T.background, border: `1px solid ${T.border}` }}>
            <div className="flex items-start justify-between gap-3">
              <h3 style={{ fontSize: T.base, fontWeight: T.fw_semi, color: T.foreground }}>Lời mời</h3>
              <Button size="sm" variant="outline" className="shrink-0" style={{ fontSize: T.xs }}
                onClick={() => setInviteOpen(true)}>
                <Plus className="size-3.5" /> Mời khách
              </Button>
            </div>
            <p style={{ fontSize: T.xs, color: T.mutedFg, lineHeight: 1.6, marginTop: 4, marginBottom: 14 }}>
              Mời người đăng ký, danh bạ và khách cũ qua email hoặc SMS.
            </p>
            <div className="flex items-start gap-3 rounded-xl p-4" style={{ border: `1px solid ${T.border}` }}>
              <Mail className="size-5 shrink-0 mt-0.5" style={{ color: T.mutedFg, opacity: 0.45 }} />
              <div className="min-w-0">
                <p style={{ fontSize: T.sm, fontWeight: T.fw_medium, color: T.mutedFg }}>Chưa gửi lời mời nào</p>
                <p style={{ fontSize: T.xs, color: T.mutedFg, marginTop: 2, lineHeight: 1.5 }}>
                  Bạn có thể mời người đăng ký, danh bạ và khách cũ tới sự kiện.
                </p>
              </div>
            </div>
          </div>

          {/* ── Người tham dự ── */}
          <div className="rounded-2xl p-5" style={{ backgroundColor: T.background, border: `1px solid ${T.border}` }}>
            <h3 style={{ fontSize: T.base, fontWeight: T.fw_semi, color: T.foreground }}>Người tham dự</h3>
            <div className="flex items-baseline justify-between gap-3 mt-3 mb-2">
              <span className="flex items-baseline gap-1.5">
                <span className="inline-block size-2 rounded-full self-center shrink-0" style={{ backgroundColor: T.successText }} />
                <span style={{ fontSize: T.xl, fontWeight: T.fw_bold, color: T.successText, lineHeight: 1 }}>{totalRegistered}</span>
                <span style={{ fontSize: T.sm, color: T.successText }}>đã đăng ký</span>
              </span>
              <span style={{ fontSize: T.sm, color: T.mutedFg }}>
                sức chứa <span style={{ fontWeight: T.fw_semi, color: T.foreground }}>{totalCapacity}</span>
              </span>
            </div>
            <div className="rounded-full overflow-hidden" style={{ height: 6, backgroundColor: T.border }}>
              <div className="h-full rounded-full transition-all"
                style={{ width: `${Math.round(totalRegistered / totalCapacity * 100)}%`, backgroundColor: T.successText }} />
            </div>
          </div>

          {/* ── Check-in: bật/tắt quét mã QR và nhập số điện thoại ── */}
          <CheckinSettingsCard eventId={currentEvent.id} />

          {/* ── Cấu hình email: người gửi + ba email tự động (EmailSettings.tsx) ── */}
          <EmailSettingsCard key={currentEvent.id} event={currentEvent} organizerName={orgName} />

          {/* ── Đơn vị tổ chức — hiển thị trên trang sự kiện ── */}
          <div className="rounded-2xl p-5" style={{ backgroundColor: T.background, border: `1px solid ${T.border}` }}>
            <div className="flex items-center justify-between gap-3 mb-3">
              <h3 style={{ fontSize: T.base, fontWeight: T.fw_semi, color: T.foreground }}>Đơn vị tổ chức</h3>
              <Button size="sm" variant="outline" className="shrink-0" style={{ fontSize: T.xs }}
                onClick={() => setOrgOpen(true)}>
                <Pencil className="size-3.5" /> Chỉnh sửa
              </Button>
            </div>
            <div className="flex items-center gap-3">
              {currentEvent.organizerAvatar ? (
                <img src={currentEvent.organizerAvatar} alt={orgName}
                  className="size-10 rounded-full shrink-0" style={{ objectFit: "cover" }} />
              ) : (
                <span className="size-10 rounded-full shrink-0 flex items-center justify-center"
                  style={{ backgroundColor: "rgba(255,134,68,0.12)", color: "#ff8644", fontWeight: T.fw_bold }}>
                  {orgName[0]?.toUpperCase()}
                </span>
              )}
              <div className="min-w-0">
                <p className="truncate" style={{ fontSize: T.sm, fontWeight: T.fw_medium, color: T.foreground }}>{orgName}</p>
                <p style={{ fontSize: T.xs, color: T.mutedFg }}>Hiển thị trên trang sự kiện</p>
              </div>
            </div>
          </div>

          {/* ── Ban tổ chức ── */}
          <div className="rounded-2xl p-5" style={{ backgroundColor: T.background, border: `1px solid ${T.border}` }}>
            <div className="flex items-center justify-between gap-3 mb-3">
              <h3 style={{ fontSize: T.base, fontWeight: T.fw_semi, color: T.foreground }}>Ban tổ chức</h3>
              <Button size="sm" variant="outline" className="shrink-0" style={{ fontSize: T.xs }}
                onClick={() => setHostDialog({ mode: "add" })}>
                <Plus className="size-3.5" /> Thêm
              </Button>
            </div>
            <div className="flex flex-col">
              {hosts.map((h, i) => (
                <div key={h.email} className="flex items-center gap-3 py-2.5"
                  style={{ borderTop: i === 0 ? "none" : `1px solid ${T.border}` }}>
                  <span className="size-8 rounded-full shrink-0 flex items-center justify-center"
                    style={{ backgroundColor: T.secondary, color: T.mutedFg, fontSize: "10px", fontWeight: T.fw_semi }}>
                    {initials(h.name)}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="truncate" style={{ fontSize: T.sm, fontWeight: T.fw_medium, color: T.foreground }}>{h.name}</p>
                    <p className="truncate" style={{ fontSize: T.xs, color: T.mutedFg }}>{h.email}</p>
                  </div>
                  <span className="shrink-0" style={{ fontSize: "10px", padding: "1px 7px", borderRadius: 999,
                    whiteSpace: "nowrap",
                    backgroundColor: i === 0 ? T.successSubtle : T.warningSubtle,
                    color: i === 0 ? T.successText : T.warningText }}>{h.role}</span>
                  <button className="shrink-0 cursor-pointer transition-opacity hover:opacity-70"
                    style={{ background: "none", border: "none", padding: 2, color: T.mutedFg }}
                    onClick={() => setHostDialog({ mode: "edit", host: h })}>
                    <Pencil className="size-3.5" />
                  </button>
                </div>
              ))}
            </div>
            <button className="flex items-center gap-2 mt-3 cursor-pointer transition-opacity hover:opacity-70"
              style={{ background: "none", border: "none", padding: 0, fontSize: T.xs, color: T.mutedFg }}>
              <Settings className="size-3.5" /> Quản lý nhân sự check-in và tuỳ chọn
            </button>
          </div>

        </div>{/* end RIGHT column */}

        {inviteOpen && <InviteGuestsDialog onClose={() => setInviteOpen(false)} />}
        {orgOpen && (
          <OrganizerDialog name={currentEvent.organizer ?? ""} avatar={currentEvent.organizerAvatar}
            onClose={() => setOrgOpen(false)}
            onSave={(n, av) => setCurrentEvent({ ...currentEvent, organizer: n || undefined, organizerAvatar: av || undefined })} />
        )}

        {hostDialog && (
          <HostDialog
            // key ép remount để form không giữ dữ liệu của lần mở trước
            key={`${hostDialog.mode}-${hostDialog.host?.email ?? "new"}`}
            mode={hostDialog.mode}
            host={hostDialog.host}
            onClose={() => setHostDialog(null)}
            onSave={(h) => setHosts((prev) => {
              const i = prev.findIndex((x) => x.email === (hostDialog.host?.email ?? h.email));
              if (i === -1) return [...prev, h];
              const next = [...prev]; next[i] = { ...next[i], ...h }; return next;
            })}
            onRemove={(h) => setHosts((prev) => prev.filter((x) => x.email !== h.email))}
          />
        )}

      </div>
    </div>
  );
}

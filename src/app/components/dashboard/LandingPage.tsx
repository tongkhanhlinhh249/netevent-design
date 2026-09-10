import * as React from "react";
import { useState, useEffect } from "react";
import {
  Globe, Calendar, MapPin, Eye, Settings, X, AlertCircle,
  Upload, Check, Plus, FileText, Ticket, CheckCircle2, ChevronRight,
  Mail, Download, QrCode, Users, Copy, Sparkles
} from "lucide-react";
import { EventCoverUpload, EventCoverLarge } from "./EventCover";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Checkbox } from "../ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "../ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { cn } from "../ui/utils";
import { themePageBg } from "../../data/themes";
import { longDateVi, shortDateVi } from "../../data/eventFormat";

// ── CSS tokens ─────────────────────────────────────────────────────────────────

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
  "2xl":"var(--text-2xl)",
};

// ── Types ──────────────────────────────────────────────────────────────────────

type RegMode    = "free" | "tickets";
type LPView     = "empty" | "preview" | "editor";
type LeftDrawer = "create-form" | "create-khove" | "add-tier" | null;

interface EventDraft {
  id: string; name: string; description: string;
  startDate: string; startTime: string; endDate: string; endTime: string;
  format: string; location: string; theme: string; cover: string; status: string;
}

interface LocalTier {
  id: string; name: string; type: "free" | "paid"; price: number;
  quantity: number; showOnLanding: boolean; status: "open" | "draft" | "sold-out";
}

interface LandingSettings {
  showDescription: boolean; showOrganizer: boolean; showLocation: boolean;
  showFooter: boolean; regMode: RegMode; ctaLabel: string;
  bgStyle: "light" | "white" | "brand"; bgColor: string;
  ticketsConfigured: boolean;
}

const DEFAULT_SETTINGS: LandingSettings = {
  showDescription: true, showOrganizer: true, showLocation: true,
  showFooter: true, regMode: "free", ctaLabel: "Đăng ký ngay",
  bgStyle: "light", bgColor: "#1eaaff", ticketsConfigured: false,
};

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatDate(dateStr: string) {
  if (!dateStr) return "Thứ Hai, 30 Tháng 6";
  const [y, m, d] = dateStr.split("-").map(Number);
  const days = ["Chủ Nhật", "Thứ Hai", "Thứ Ba", "Thứ Tư", "Thứ Năm", "Thứ Sáu", "Thứ Bảy"];
  return `${days[new Date(y, m - 1, d).getDay()]}, ${d} Tháng ${m}`;
}

// ── Shared atoms ──────────────────────────────────────────────────────────────

function Toggle({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
  return (
    <button onClick={() => onChange(!value)}
      style={{ width: "36px", height: "20px", borderRadius: "999px", border: "none", cursor: "pointer",
        backgroundColor: value ? T.primary : T.border, position: "relative", transition: "background-color 0.2s" }}>
      <span style={{ position: "absolute", top: "2px", left: value ? "18px" : "2px",
        width: "16px", height: "16px", borderRadius: "50%", backgroundColor: "white",
        transition: "left 0.2s", boxShadow: "0 1px 2px rgba(0,0,0,0.2)" }} />
    </button>
  );
}

function LCard({ children, className, style, onClick }: { children: React.ReactNode; className?: string; style?: React.CSSProperties; onClick?: React.MouseEventHandler }) {
  return (
    <div className={cn("rounded-2xl p-5", className)} onClick={onClick}
      style={{ backgroundColor: T.background, border: `1px solid ${T.border}`, boxShadow: "0 1px 3px rgba(0,0,0,0.06)", ...style }}>
      {children}
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p style={{ fontSize: T.xs, fontWeight: T.fw_semi, color: T.mutedFg,
      textTransform: "uppercase" as const, letterSpacing: "0.05em", marginBottom: "10px" }}>
      {children}
    </p>
  );
}

// ── Background style picker ───────────────────────────────────────────────────

function BgStylePicker({ value, hex, onChange, onHexChange }: {
  value: string; hex: string;
  onChange: (v: "light" | "white" | "brand") => void;
  onHexChange: (h: string) => void;
}) {
  const [hexErr, setErr] = useState(false);
  const validate = (v: string) => {
    const c = v.startsWith("#") ? v : "#" + v;
    const ok = /^#[0-9a-fA-F]{3}([0-9a-fA-F]{3})?$/.test(c);
    setErr(!ok);
    if (ok) onHexChange(c);
    return c;
  };
  return (
    <div className="flex flex-col gap-2">
      <label style={{ fontSize: T.xs, color: T.mutedFg }}>Kiểu nền</label>
      <Select value={value} onValueChange={(v) => onChange(v as "light" | "white" | "brand")}>
        <SelectTrigger className="h-8 cursor-pointer"><SelectValue /></SelectTrigger>
        <SelectContent>
          <SelectItem value="light">Gradient nhẹ</SelectItem>
          <SelectItem value="white">Trắng</SelectItem>
          <SelectItem value="brand">Màu thương hiệu</SelectItem>
        </SelectContent>
      </Select>
      {value === "brand" && (
        <div className="flex flex-col gap-1.5 p-3 rounded-xl"
          style={{ backgroundColor: T.secondary, border: `1px solid ${T.border}` }}>
          <label style={{ fontSize: T.xs, color: T.mutedFg }}>Mã màu HEX</label>
          <div className="flex items-center gap-2">
            <div className="size-7 rounded-lg shrink-0 border" style={{ backgroundColor: hexErr ? T.secondary : hex, borderColor: T.border }} />
            <input type="text" defaultValue={hex} onChange={(e) => validate(e.target.value)}
              placeholder="#1eaaff" maxLength={7} className="flex-1 rounded-lg px-2.5 py-1.5 outline-none"
              style={{ fontSize: T.sm, fontFamily: "monospace",
                border: `1px solid ${hexErr ? "var(--destructive)" : T.border}`,
                backgroundColor: T.background, color: T.foreground }} />
          </div>
          {hexErr && <p style={{ fontSize: T.xs, color: "var(--destructive)" }}>Mã màu không hợp lệ.</p>}
        </div>
      )}
    </div>
  );
}

// ── Data source card ──────────────────────────────────────────────────────────

function DataSourceCard({ title, configured, configuredDesc, unconfiguredDesc, actionLabel, manageLabel, onAction }: {
  title: string; configured: boolean; configuredDesc: string; unconfiguredDesc: string;
  actionLabel: string; manageLabel: string; onAction: () => void;
}) {
  return (
    <div className="rounded-xl p-3 flex flex-col gap-2"
      style={configured
        ? { backgroundColor: T.successSubtle, border: `1px solid ${T.successBorder}` }
        : { backgroundColor: T.warningSubtle, border: `1px solid ${T.warningBorder}` }}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          {configured
            ? <CheckCircle2 className="size-3.5" style={{ color: T.successText }} />
            : <AlertCircle  className="size-3.5" style={{ color: T.warningText }} />}
          <span style={{ fontSize: T.xs, fontWeight: T.fw_semi, color: configured ? T.successText : T.warningText }}>
            {title}
          </span>
        </div>
        <span style={{ fontSize: T.xs, color: configured ? T.successText : T.warningText }}>
          {configured ? "Đã cấu hình" : "Chưa cấu hình"}
        </span>
      </div>
      <p style={{ fontSize: T.xs, color: T.mutedFg, lineHeight: 1.5 }}>
        {configured ? configuredDesc : unconfiguredDesc}
      </p>
      <Button size="sm" variant={configured ? "outline" : "default"} onClick={onAction} className="w-fit" style={{ fontSize: T.xs }}>
        {configured ? manageLabel : actionLabel}
      </Button>
      {configured && (
        <p style={{ fontSize: T.xs, color: T.mutedFg, fontStyle: "italic" }}>
          Dữ liệu được lưu tại module {title} của sự kiện.
        </p>
      )}
    </div>
  );
}

// ── Publish checklist ─────────────────────────────────────────────────────────

function PublishChecklist({ hasKhoVe, regMode, tiers }: {
  hasKhoVe: boolean; regMode: RegMode; tiers: LocalTier[];
}) {
  const needsKhoVe  = regMode === "tickets";
  const hasOpenTier = tiers.some((t) => t.status === "open" && t.showOnLanding);

  const baseItems = [
    { label: "Thông tin sự kiện đầy đủ",            ok: true },
    { label: "Trang sự kiện đã tạo",                ok: true },
    { label: "Form đăng ký đã cấu hình",             ok: true },
    { label: "URL trang hợp lệ",                    ok: true },
  ];
  const ticketItems = needsKhoVe ? [
    { label: "Kho vé đã cấu hình",                  ok: hasKhoVe },
    { label: "Có ít nhất 1 hạng vé đang mở",        ok: hasOpenTier },
  ] : [];
  const items = [...baseItems.slice(0, 2), ...ticketItems, ...baseItems.slice(2)];

  const allOk = items.every((i) => i.ok);
  return (
    <div className="flex flex-col gap-2">
      {items.map((item) => (
        <div key={item.label} className="flex items-start gap-2">
          {item.ok
            ? <CheckCircle2 className="size-3.5 mt-0.5 shrink-0" style={{ color: T.successText }} />
            : <AlertCircle  className="size-3.5 mt-0.5 shrink-0" style={{ color: T.warningText }} />}
          <span style={{ fontSize: T.xs, color: item.ok ? T.mutedFg : T.warningText, lineHeight: 1.4 }}>
            {item.label}
          </span>
        </div>
      ))}
      <div className="mt-2 rounded-lg p-2.5 flex items-start gap-2"
        style={{ backgroundColor: `rgba(30,170,255,0.06)`, border: `1px solid rgba(30,170,255,0.15)` }}>
        <AlertCircle className="size-3.5 shrink-0 mt-0.5" style={{ color: T.primary }} />
        <p style={{ fontSize: T.xs, color: T.mutedFg, lineHeight: 1.5 }}>
          Email QR sẽ được gửi tự động sau khi đăng ký thành công.
        </p>
      </div>
      {allOk
        ? <p style={{ fontSize: T.xs, color: T.successText, marginTop: "4px", fontWeight: T.fw_medium }}>Có thể xuất bản sự kiện.</p>
        : <p style={{ fontSize: T.xs, color: T.warningText, marginTop: "4px", lineHeight: 1.5 }}>Chưa thể xuất bản vì còn thiếu cấu hình bắt buộc.</p>
      }
    </div>
  );
}

// ── Radio card (module-level — avoids inline component crash) ─────────────────

function RadioCard({ selected, onClick, label, sub }: {
  selected: boolean; onClick: () => void; label: string; sub?: string;
}) {
  return (
    <button onClick={onClick} className="w-full text-left p-3 rounded-xl cursor-pointer"
      data-pill="off"
      style={{ border: selected ? `2px solid ${T.primary}` : `1px solid ${T.border}`,
        backgroundColor: selected ? `rgba(30,170,255,0.04)` : T.background }}>
      <div className="flex items-center gap-2">
        <div className="size-4 rounded-full border-2 flex items-center justify-center shrink-0"
          style={{ borderColor: selected ? T.primary : T.border }}>
          {selected && <div className="size-2 rounded-full" style={{ backgroundColor: T.primary }} />}
        </div>
        <span style={{ fontSize: T.sm, fontWeight: T.fw_medium, color: T.foreground }}>{label}</span>
      </div>
      {sub && <p style={{ fontSize: T.xs, color: T.mutedFg, marginTop: "4px", paddingLeft: "24px" }}>{sub}</p>}
    </button>
  );
}

// ── Create Form Drawer ────────────────────────────────────────────────────────

function CreateFormDrawer({ open, onClose, onCreated }: {
  open: boolean; onClose: () => void; onCreated: () => void;
}) {
  const [extras, setExtras] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const OPTIONAL = ["Công ty / Tổ chức", "Chức danh", "Ghi chú"];
  const handleCreate = () => {
    setLoading(true);
    setTimeout(() => { setLoading(false); onCreated(); }, 700);
  };
  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-[860px] p-0 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 shrink-0"
          style={{ borderBottom: `1px solid ${T.border}` }}>
          <div>
            <DialogTitle>Tùy chỉnh Form đăng ký</DialogTitle>
            <p style={{ fontSize: T.xs, color: T.mutedFg, marginTop: "2px" }}>
              Đã chọn <span style={{ fontWeight: T.fw_semi, color: T.primary }}>{3 + extras.length}/12</span> trường thông tin
              {extras.length >= 9 && (
                <span style={{ color: T.warningText, marginLeft: "8px" }}>Bạn đã chọn tối đa 12 trường thông tin.</span>
              )}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button size="sm" variant="ghost" onClick={() => setExtras([])}>Đặt lại mặc định</Button>
            <DialogClose asChild><Button size="sm" variant="outline">Hủy</Button></DialogClose>
            <Button size="sm" onClick={handleCreate} disabled={loading}>
              {loading ? "Đang lưu..." : "Áp dụng thay đổi"}
            </Button>
          </div>
        </div>

        {/* Body: 2 columns */}
        <div className="flex min-h-0" style={{ maxHeight: "70vh" }}>

          {/* Left: Field selector */}
          <div className="flex flex-col gap-0 overflow-y-auto flex-1 min-w-0"
            style={{ borderRight: `1px solid ${T.border}` }}>

            {/* Selected fields chips */}
            <div className="px-5 py-4" style={{ borderBottom: `1px solid ${T.border}` }}>
              <p style={{ fontSize: T.xs, fontWeight: T.fw_semi, color: T.mutedFg, textTransform: "uppercase" as const, letterSpacing: "0.05em", marginBottom: "10px" }}>
                Field đã chọn
              </p>
              <div className="flex flex-wrap gap-2">
                {/* Default locked chips */}
                {[
                  { label: "Họ và tên", idx: 1 },
                  { label: "Email", idx: 2 },
                  { label: "Số điện thoại", idx: 3 },
                ].map(({ label, idx }) => (
                  <div key={label} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full"
                    style={{ backgroundColor: `rgba(30,170,255,0.08)`, border: `1px solid ${T.primary}` }}>
                    <span style={{ fontSize: T.xs, color: T.primary, fontWeight: T.fw_bold }}>{idx}</span>
                    <span style={{ fontSize: T.xs, color: T.foreground, fontWeight: T.fw_medium }}>{label}</span>
                    <span style={{ fontSize: T.xs, color: T.primary }}>· Bắt buộc 🔒</span>
                  </div>
                ))}
                {/* Optional selected chips */}
                {extras.map((f, i) => (
                  <div key={f} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full"
                    style={{ backgroundColor: T.secondary, border: `1px solid ${T.border}` }}>
                    <span style={{ fontSize: T.xs, color: T.mutedFg, fontWeight: T.fw_bold }}>{4 + i}</span>
                    <span style={{ fontSize: T.xs, color: T.foreground, fontWeight: T.fw_medium }}>{f}</span>
                    <button onClick={() => setExtras((p) => p.filter((x) => x !== f))}
                      className="hover:opacity-70 transition-opacity ml-1 cursor-pointer"
                      style={{ color: T.mutedFg, lineHeight: 1 }}>✕</button>
                  </div>
                ))}
              </div>
              <p style={{ fontSize: T.xs, color: T.mutedFg, marginTop: "8px", fontStyle: "italic" }}>
                Kéo thả để sắp xếp thứ tự field hiển thị trên Landing Page.
              </p>
            </div>

            {/* Field library */}
            <div className="flex flex-col gap-0 overflow-y-auto flex-1">
              {([
                { cat: "Thông tin cơ bản", fields: ["Họ và tên", "Email", "Số điện thoại", "Công ty / Tổ chức", "Chức danh", "Địa chỉ"] },
                { cat: "Thông tin nghề nghiệp", fields: ["Ngành nghề", "Phòng ban", "Vị trí công việc", "Quy mô công ty", "Website công ty"] },
                { cat: "Thông tin tham dự", fields: ["Bạn biết sự kiện qua đâu?", "Mục tiêu tham gia sự kiện", "Chủ đề quan tâm", "Câu hỏi cho diễn giả", "Yêu cầu đặc biệt"] },
              ]).map(({ cat, fields }) => {
                const DEFAULTS = ["Họ và tên", "Email", "Số điện thoại"];
                return (
                  <div key={cat} className="px-5 py-4" style={{ borderBottom: `1px solid ${T.border}` }}>
                    <p style={{ fontSize: T.xs, fontWeight: T.fw_semi, color: T.mutedFg, marginBottom: "8px" }}>{cat}</p>
                    <div className="flex flex-wrap gap-2">
                      {fields.map((f) => {
                        const isDefault    = DEFAULTS.includes(f);
                        const isSelected   = isDefault || extras.includes(f);
                        const isMaxReached = !isSelected && 3 + extras.length >= 12;
                        return (
                          <button key={f}
                            disabled={isDefault || isMaxReached}
                            onClick={() => {
                              if (isDefault) return;
                              if (isSelected) setExtras((p) => p.filter((x) => x !== f));
                              else if (!isMaxReached) setExtras((p) => [...p, f]);
                            }}
                            className="px-3 py-1.5 rounded-full transition-all"
                            style={{
                              fontSize: T.xs,
                              fontWeight: isSelected ? T.fw_semi : T.fw_normal,
                              backgroundColor: isSelected ? `rgba(30,170,255,0.1)` : T.secondary,
                              color: isSelected ? T.primary : isMaxReached ? T.mutedFg : T.foreground,
                              border: isSelected ? `1px solid ${T.primary}` : `1px solid ${T.border}`,
                              opacity: isMaxReached ? 0.5 : 1,
                              cursor: isDefault || isMaxReached ? "default" : "pointer",
                            }}>
                            {isSelected && !isDefault && "✓ "}{f}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
              <div className="px-5 py-3">
                <p style={{ fontSize: T.xs, color: T.mutedFg, fontStyle: "italic" }}>
                  Hạng vé không phải là field trong Form. Hạng vé được lấy từ Kho vé của sự kiện.
                </p>
              </div>
            </div>
          </div>

          {/* Right: Preview */}
          <div className="flex flex-col shrink-0 overflow-y-auto" style={{ width: "280px", backgroundColor: T.secondary }}>
            <div className="px-4 py-3 shrink-0" style={{ borderBottom: `1px solid ${T.border}` }}>
              <p style={{ fontSize: T.xs, fontWeight: T.fw_semi, color: T.foreground }}>Preview Form</p>
              <p style={{ fontSize: T.xs, color: T.mutedFg }}>Form hiển thị trên Landing Page</p>
            </div>
            <div className="flex flex-col gap-3 p-4">
              <div className="rounded-xl p-4 flex flex-col gap-3" style={{ backgroundColor: T.background, border: `1px solid ${T.border}` }}>
                <p style={{ fontSize: T.sm, fontWeight: T.fw_semi, color: T.foreground }}>Đăng ký tham gia</p>
                <p style={{ fontSize: T.xs, color: T.mutedFg }}>Điền thông tin bên dưới để nhận vé QR tham dự sự kiện.</p>
                {/* Default fields */}
                {[
                  { label: "Họ và tên", req: true },
                  { label: "Email", req: true },
                  { label: "Số điện thoại", req: true },
                  ...extras.map((f) => ({ label: f, req: false })),
                ].map(({ label, req }) => (
                  <div key={label} className="flex flex-col gap-1">
                    <label style={{ fontSize: T.xs, color: T.foreground }}>
                      {label} {req && <span style={{ color: T.destructive }}>*</span>}
                    </label>
                    <div className="px-2.5 py-1.5 rounded-lg" style={{ border: `1px solid ${T.border}`, backgroundColor: T.secondary }}>
                      <span style={{ fontSize: T.xs, color: T.mutedFg }}>{label}...</span>
                    </div>
                  </div>
                ))}
                <button className="w-full py-2 rounded-lg mt-1"
                  style={{ backgroundColor: T.primary, color: T.primaryFg, fontSize: T.xs, fontWeight: T.fw_semi }}>
                  Đăng ký ngay
                </button>
              </div>
              <p style={{ fontSize: T.xs, color: T.mutedFg, textAlign: "center" as const, fontStyle: "italic" }}>
                Fields từ Form đăng ký của sự kiện
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ── Create Kho Vé Drawer (2-step) ────────────────────────────────────────────

function CreateKhoVeDrawer({ open, onClose, onCreated, eventName }: {
  open: boolean; onClose: () => void; onCreated: (tiers: LocalTier[]) => void; eventName: string;
}) {
  // Step state: 1=chọn sự kiện, 2=thêm hạng vé, 3=thiết lập hạng vé
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Step 2: simple tier name list
  const [tierNames, setTierNames] = useState<string[]>(["Standard", "VIP"]);
  const [newTierNameInput, setNewTierNameInput] = useState("");

  // Step 3: detailed tier config (LocalTier objects keyed by name)
  const [tiers, setTiers]      = useState<LocalTier[]>([]);
  const [expandedId, setExpId] = useState<string | null>(null);

  // Tier config form state (for the active expanded card in step 3)
  const [tierType, setTierType]   = useState<"free" | "paid">("free");
  const [tierPrice, setTierPrice] = useState("");
  const [tierQty, setTierQty]     = useState("");
  const [tierBenefits, setTierBenefits] = useState("");
  const [tierShow, setTierShow]   = useState(true);
  const [tierSt, setTierSt]       = useState<"open" | "draft">("open");
  const [tierErr, setTierErr]     = useState<Record<string, string>>({});
  const [unlimitedTime, setUnlimitedTime] = useState(true);

  // Auto-generated kho vé name
  const kvName = `Kho vé - ${eventName}`;

  const handleStep1 = () => {
    setStep(2);
    // Initialize tiers from step-2 names if coming back from step 3
  };

  const handleStep2 = () => {
    if (tierNames.length === 0) return;
    // Initialize LocalTier objects from tier names (defaults)
    const initialTiers: LocalTier[] = tierNames.map((name, i) => ({
      id: `tier-${i}`, name,
      type: "free", price: 0, quantity: 0,
      showOnLanding: true, status: "draft",
    }));
    setTiers(initialTiers);
    setExpId(initialTiers[0]?.id ?? null);
    setStep(3);
  };

  const updateTier = (id: string, patch: Partial<LocalTier>) =>
    setTiers((prev) => prev.map((t) => t.id === id ? { ...t, ...patch } : t));

  const handleDone = () => { onCreated(tiers); };

  const totalQty = tiers.reduce((s, t) => s + t.quantity, 0);

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) { setStep(1); setTierNames(["Standard", "VIP"]); setTiers([]); setExpId(null); onClose(); } }}>
      <DialogContent className="sm:max-w-[680px] p-0 overflow-hidden">
        <DialogTitle className="sr-only">Thiết lập Kho vé</DialogTitle>

        {/* ── Header ── */}
        <div className="px-6 py-5 shrink-0" style={{ borderBottom: `1px solid ${T.border}` }}>
          <p style={{ fontSize: T.lg, fontWeight: T.fw_semi, color: T.foreground, marginBottom: "2px" }}>Thiết lập Kho vé</p>
          <p style={{ fontSize: T.sm, color: T.mutedFg }}>Kho vé sẽ được tự tạo theo sự kiện. Bạn chỉ cần thiết lập các hạng vé cho người tham dự.</p>
        </div>

        {/* ── Scrollable body ── */}
        <div className="flex flex-col gap-4 px-6 py-4 overflow-y-auto" style={{ maxHeight: "65vh" }}>

          {/* Context card */}
          <div className="rounded-xl p-3 flex flex-wrap items-center gap-x-4 gap-y-1"
            style={{ backgroundColor: T.secondary, border: `1px solid ${T.border}` }}>
            {[
              { label: "Sự kiện", value: eventName },
              { label: "Kho vé", value: "Tự tạo bởi hệ thống" },
              { label: "Trạng thái", value: "Bản nháp" },
              { label: "Quota còn lại", value: "1.000 vé" },
            ].map((r) => (
              <div key={r.label} className="flex items-center gap-1.5">
                <span style={{ fontSize: T.xs, color: T.mutedFg }}>{r.label}:</span>
                <span style={{ fontSize: T.xs, fontWeight: T.fw_semi, color: T.foreground }}>{r.value}</span>
              </div>
            ))}
          </div>

          {/* Info box */}
          <div className="rounded-xl p-3 flex items-start gap-2"
            style={{ backgroundColor: `rgba(30,170,255,0.06)`, border: `1px solid rgba(30,170,255,0.2)` }}>
            <AlertCircle className="size-3.5 shrink-0 mt-0.5" style={{ color: T.primary }} />
            <p style={{ fontSize: T.xs, color: T.mutedFg, lineHeight: 1.6 }}>
              Tạo hạng vé không trừ quota. Quota chỉ được tính khi vé được phát hành thật cho người tham dự.
            </p>
          </div>

          {/* Real-time summary bar */}

          {/* Tier section header */}
          <div className="flex items-center justify-between pt-1">
            <div>
              <p style={{ fontSize: T.base, fontWeight: T.fw_semi, color: T.foreground }}>Hạng vé</p>
              <p style={{ fontSize: T.xs, color: T.mutedFg }}>Thiết lập các hạng vé mà người tham dự có thể chọn khi đăng ký.</p>
            </div>
            <Button size="sm" onClick={() => {
              const newId = Date.now().toString();
              setTiers((p) => [...p, { id: newId, name: "", type: "free", price: 0, quantity: 0, showOnLanding: true, status: "open" }]);
              setExpId(newId);
            }}>
              <Plus className="size-3.5" /> Thêm hạng vé
            </Button>
          </div>

          {/* Empty state */}
          {tiers.length === 0 && (
            <div className="rounded-2xl py-10 flex flex-col items-center text-center"
              style={{ border: `2px dashed ${T.border}` }}>
              <Ticket className="size-8 mb-3" style={{ color: T.mutedFg }} />
              <p style={{ fontSize: T.sm, fontWeight: T.fw_semi, color: T.foreground, marginBottom: "4px" }}>Chưa có hạng vé nào</p>
              <p style={{ fontSize: T.xs, color: T.mutedFg, maxWidth: "320px", lineHeight: 1.6, marginBottom: "12px" }}>
                Thêm ít nhất một hạng vé như Standard, VIP hoặc Early Bird để người tham dự có thể chọn khi đăng ký.
              </p>
              <Button size="sm" onClick={() => {
                const newId = Date.now().toString();
                setTiers((p) => [...p, { id: newId, name: "", type: "free", price: 0, quantity: 0, showOnLanding: true, status: "open" }]);
                setExpId(newId);
              }}>
                <Plus className="size-3.5" /> Thêm hạng vé
              </Button>
            </div>
          )}

          {/* Warning: all draft */}
          {tiers.length > 0 && tiers.every((t) => t.status === "draft") && (
            <div className="rounded-xl p-3 flex items-start gap-2"
              style={{ backgroundColor: T.warningSubtle, border: `1px solid ${T.warningBorder}` }}>
              <AlertCircle className="size-3.5 shrink-0 mt-0.5" style={{ color: T.warningText }} />
              <p style={{ fontSize: T.xs, color: T.warningText, lineHeight: 1.5 }}>
                Bạn chưa có hạng vé nào đang mở đăng ký. Người tham dự sẽ chưa thể chọn vé trên Landing Page.
              </p>
            </div>
          )}

          {/* Accordion tier cards */}
          <div className="flex flex-col gap-3">
            {tiers.map((tier, idx) => {
              const isExp = expandedId === tier.id;
              const hasErr = !tier.name.trim() || (tier.type === "paid" && !tier.price) || !tier.quantity;
              return (
                <div key={tier.id} className="rounded-xl overflow-hidden transition-all"
                  style={{ border: isExp ? `2px solid ${T.primary}` : `1px solid ${T.border}` }}>

                  {/* Collapsed header */}
                  <div className="flex items-center gap-3 px-4 py-3"
                    style={{ backgroundColor: isExp ? `rgba(30,170,255,0.04)` : T.secondary }}>
                    <button className="flex items-center gap-3 flex-1 text-left cursor-pointer"
                      onClick={() => setExpId(isExp ? null : tier.id)}>
                      <div className="size-6 rounded-full flex items-center justify-center shrink-0"
                        style={{ backgroundColor: hasErr && !isExp ? T.warningText : T.primary, color: "white", fontSize: T.xs, fontWeight: T.fw_bold }}>
                        {idx + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <span style={{ fontSize: T.sm, fontWeight: T.fw_semi, color: tier.name ? T.foreground : T.mutedFg }}>
                          {tier.name || "Hạng vé mới..."}
                        </span>
                        {!isExp && tier.name && (
                          <span style={{ fontSize: T.xs, color: T.mutedFg, marginLeft: "8px" }}>
                            {tier.type === "free" ? "Miễn phí" : `${(tier.price || 0).toLocaleString("vi-VN")}đ`}
                            {tier.quantity ? ` · ${tier.quantity} vé` : ""}
                            {tier.showOnLanding ? " · Hiển thị Landing" : ""}
                            {" · "}{tier.status === "open" ? "Đang mở" : "Nháp"}
                          </span>
                        )}
                      </div>
                    </button>
                    {/* Actions */}
                    <button onClick={() => {
                      const newId = Date.now().toString();
                      setTiers((p) => [...p, { ...tier, id: newId, name: tier.name + " (bản sao)" }]);
                    }} style={{ fontSize: T.xs, color: T.mutedFg }} className="hover:opacity-70 px-1.5 transition-opacity cursor-pointer">
                      Nhân bản
                    </button>
                    <button onClick={() => { setTiers((p) => p.filter((t) => t.id !== tier.id)); if (expandedId === tier.id) setExpId(null); }}
                      style={{ fontSize: T.xs, color: T.destructive }} className="hover:opacity-70 transition-opacity cursor-pointer">
                      Xóa
                    </button>
                  </div>

                  {/* Expanded form */}
                  {isExp && (
                    <div className="flex flex-col gap-4 px-4 pb-4 pt-3" style={{ borderTop: `1px solid ${T.border}` }}>
                      {/* Tên */}
                      <div className="flex flex-col gap-1.5">
                        <Label>Tên hạng vé <span style={{ color: T.destructive }}>*</span></Label>
                        <Input value={tier.name} onChange={(e) => updateTier(tier.id, { name: e.target.value })}
                          placeholder="Ví dụ: Standard, VIP, Early Bird" />
                        {!tier.name.trim() && <p style={{ fontSize: T.xs, color: T.destructive }}>Tên hạng vé không được để trống.</p>}
                      </div>

                      {/* Loại vé */}
                      <div className="flex flex-col gap-1.5">
                        <Label>Loại vé</Label>
                        <div className="flex rounded-xl overflow-hidden" style={{ border: `1px solid ${T.border}` }}>
                          {(["free", "paid"] as const).map((t, i) => (
                            <button key={t} onClick={() => updateTier(tier.id, { type: t, price: t === "free" ? 0 : tier.price })}
                              className="flex-1 py-2 transition-colors cursor-pointer"
                              style={{ fontSize: T.sm, backgroundColor: tier.type === t ? T.primary : T.background,
                                color: tier.type === t ? T.primaryFg : T.mutedFg,
                                borderRight: i === 0 ? `1px solid ${T.border}` : "none" }}>
                              {t === "free" ? "Miễn phí" : "Trả phí"}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Giá + Số lượng + Giới hạn */}
                      <div className="grid grid-cols-3 gap-3">
                        <div className="flex flex-col gap-1.5">
                          <Label>Giá vé (đ){tier.type === "paid" && <span style={{ color: T.destructive }}> *</span>}</Label>
                          <Input type="number" placeholder="499000" value={tier.price || ""}
                            disabled={tier.type === "free"}
                            onChange={(e) => updateTier(tier.id, { price: Number(e.target.value) })}
                            style={{ opacity: tier.type === "free" ? 0.5 : 1 }} />
                          {tier.type === "paid" && !tier.price && (
                            <p style={{ fontSize: T.xs, color: T.destructive }}>Giá vé trả phí phải lớn hơn 0.</p>
                          )}
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <Label>Số lượng vé <span style={{ color: T.destructive }}>*</span></Label>
                          <Input type="number" placeholder="300" value={tier.quantity || ""}
                            onChange={(e) => updateTier(tier.id, { quantity: Number(e.target.value) })} />
                          {!tier.quantity && <p style={{ fontSize: T.xs, color: T.destructive }}>Số lượng vé phải lớn hơn 0.</p>}
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <Label>Giới hạn/người</Label>
                          <Input type="number" defaultValue="1" />
                        </div>
                      </div>

                      {/* Quyền lợi */}
                      <div className="flex flex-col gap-1.5">
                        <Label>Quyền lợi hạng vé <span style={{ fontSize: T.xs, color: T.mutedFg, fontWeight: T.fw_normal }}>(tuỳ chọn)</span></Label>
                        <Textarea rows={2} placeholder="Ví dụ: Chỗ ngồi ưu tiên, tài liệu sự kiện, tea-break, networking, quà tặng" />
                      </div>

                      {/* Thời gian */}
                      <div className="flex flex-col gap-2">
                        <Label>Thời gian đăng ký</Label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <Checkbox checked={unlimitedTime} onCheckedChange={(v) => setUnlimitedTime(!!v)} />
                          <span style={{ fontSize: T.sm, color: T.foreground }}>Không giới hạn thời gian đăng ký</span>
                        </label>
                        {!unlimitedTime && (
                          <div className="grid grid-cols-2 gap-3 mt-1">
                            {[["Ngày mở", "date"], ["Giờ mở", "time"], ["Ngày đóng", "date"], ["Giờ đóng", "time"]].map(([lbl, tp]) => (
                              <div key={lbl} className="flex flex-col gap-1">
                                <label style={{ fontSize: T.xs, color: T.mutedFg }}>{lbl}</label>
                                <input type={tp} className="rounded-lg px-2.5 py-1.5 outline-none"
                                  style={{ border: `1px solid ${T.border}`, backgroundColor: T.background, fontSize: T.sm }} />
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Landing toggle */}
                      <div className="flex items-center justify-between py-2.5"
                        style={{ borderTop: `1px solid ${T.border}`, borderBottom: `1px solid ${T.border}` }}>
                        <div>
                          <p style={{ fontSize: T.sm, fontWeight: T.fw_medium, color: T.foreground }}>Hiển thị trên Landing Page</p>
                          <p style={{ fontSize: T.xs, color: T.mutedFg }}>Khi bật, hạng vé sẽ xuất hiện trong section Vé tham dự trên Landing Page nếu đang mở đăng ký.</p>
                        </div>
                        <Toggle value={tier.showOnLanding} onChange={(v) => updateTier(tier.id, { showOnLanding: v })} />
                      </div>

                      {/* Trạng thái — 3 options */}
                      <div className="flex flex-col gap-2">
                        <Label>Trạng thái</Label>
                        <RadioCard selected={tier.status === "draft"} onClick={() => updateTier(tier.id, { status: "draft" })}
                          label="Lưu nháp" sub="Chưa hiển thị cho người tham dự" />
                        <RadioCard selected={tier.status === "open"} onClick={() => updateTier(tier.id, { status: "open" })}
                          label="Mở đăng ký ngay" sub="Cho phép người tham dự chọn hạng vé này" />
                        <RadioCard selected={tier.status === "sold-out"} onClick={() => updateTier(tier.id, { status: "sold-out" })}
                          label="Tạm đóng" sub="Tạm ngừng nhận đăng ký hạng vé này" />
                      </div>

                      {/* Preview */}
                      {tier.name && (
                        <div className="rounded-xl p-3" style={{ backgroundColor: T.secondary, border: `1px solid ${T.border}` }}>
                          <p style={{ fontSize: T.xs, fontWeight: T.fw_semi, color: T.mutedFg, marginBottom: "8px", textTransform: "uppercase" as const, letterSpacing: "0.05em" }}>
                            Xem trước trang sự kiện
                          </p>
                          {!tier.showOnLanding ? (
                            <p style={{ fontSize: T.xs, color: T.mutedFg, fontStyle: "italic" }}>Hạng vé này đang tắt hiển thị trên Landing Page.</p>
                          ) : tier.status === "draft" ? (
                            <p style={{ fontSize: T.xs, color: T.warningText, fontStyle: "italic" }}>Hạng vé bản nháp chưa hiển thị trên Landing Page.</p>
                          ) : (
                            <div className="rounded-xl p-3 flex items-center justify-between"
                              style={{ backgroundColor: T.background, border: `1px solid ${T.border}` }}>
                              <div>
                                <p style={{ fontSize: T.sm, fontWeight: T.fw_semi, color: T.foreground }}>{tier.name}</p>
                                <p style={{ fontSize: T.xs, color: tier.type === "free" ? T.successText : T.primary }}>
                                  {tier.type === "free" ? "Miễn phí" : tier.price ? `${tier.price.toLocaleString("vi-VN")}đ` : "—"}
                                </p>
                                <p style={{ fontSize: T.xs, color: T.mutedFg }}>Còn {tier.quantity || 0} vé</p>
                              </div>
                              <button className="px-3 py-1.5 rounded-lg"
                                style={{ backgroundColor: T.primary, color: T.primaryFg, fontSize: T.xs }}>
                                Chọn vé
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Sticky footer ── */}
        <DialogFooter className="px-6 py-4 gap-2" style={{ borderTop: `1px solid ${T.border}` }}>
          <DialogClose asChild><Button variant="outline">Hủy</Button></DialogClose>
          <Button variant="outline" onClick={handleDone}>Lưu nháp</Button>
          <Button onClick={() => { if (tiers.length === 0) return; handleDone(); }}
            disabled={tiers.length === 0}>
            Hoàn tất thiết lập Kho vé
          </Button>
        </DialogFooter>

      </DialogContent>
    </Dialog>
  );
}

// ── Add Tier Drawer ───────────────────────────────────────────────────────────

function AddTierDrawer({ open, onClose, onSaved }: {
  open: boolean; onClose: () => void; onSaved: (t: LocalTier) => void;
}) {
  const [name, setName]   = useState("");
  const [type, setType]   = useState<"free" | "paid">("free");
  const [price, setPrice] = useState("");
  const [qty, setQty]     = useState("");
  const [show, setShow]   = useState(true);
  const [status, setSt]   = useState<"open" | "draft">("open");
  const [errors, setErr]  = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!name.trim()) e.name = "Tên hạng vé không được để trống.";
    if (type === "paid" && (!price || Number(price) <= 0)) e.price = "Giá vé trả phí phải lớn hơn 0.";
    if (!qty || Number(qty) <= 0) e.qty = "Số lượng vé phải lớn hơn 0.";
    return e;
  };

  const handleSave = () => {
    const e = validate(); setErr(e);
    if (Object.keys(e).length) return;
    setLoading(true);
    setTimeout(() => {
      onSaved({ id: Date.now().toString(), name, type, price: type === "free" ? 0 : Number(price), quantity: Number(qty), showOnLanding: show, status });
      setLoading(false); setName(""); setType("free"); setPrice(""); setQty(""); setSt("open");
    }, 600);
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-[520px] p-0 overflow-hidden">
        <DialogHeader className="px-6 py-5" style={{ borderBottom: `1px solid ${T.border}` }}>
          <DialogTitle>Thêm hạng vé</DialogTitle>
          <p style={{ fontSize: T.sm, color: T.mutedFg }}>Thiết lập giá, số lượng và trạng thái cho hạng vé.</p>
        </DialogHeader>
        <div className="flex flex-col gap-4 px-6 py-5 max-h-[65vh] overflow-y-auto">
          <div className="flex flex-col gap-1.5">
            <Label>Tên hạng vé <span style={{ color: T.destructive }}>*</span></Label>
            <Input placeholder="Ví dụ: Standard, VIP, Early Bird" value={name} onChange={(e) => setName(e.target.value)} />
            {errors.name && <p style={{ fontSize: T.xs, color: T.destructive }}>{errors.name}</p>}
          </div>
          <div className="flex flex-col gap-1.5">
            <Label>Mô tả hạng vé</Label>
            <Textarea rows={2} placeholder="Mô tả ngắn về hạng vé" />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label>Loại vé</Label>
            <div className="flex rounded-xl overflow-hidden" style={{ border: `1px solid ${T.border}` }}>
              {(["free", "paid"] as const).map((t, i) => (
                <button key={t} onClick={() => setType(t)} className="flex-1 py-2 transition-colors cursor-pointer"
                  style={{ fontSize: T.sm, backgroundColor: type === t ? T.primary : T.background,
                    color: type === t ? T.primaryFg : T.mutedFg, borderRight: i === 0 ? `1px solid ${T.border}` : "none" }}>
                  {t === "free" ? "Miễn phí" : "Trả phí"}
                </button>
              ))}
            </div>
          </div>
          {type === "paid" && (
            <div className="flex flex-col gap-1.5">
              <Label>Giá vé (đ) <span style={{ color: T.destructive }}>*</span></Label>
              <Input type="number" placeholder="499000" value={price} onChange={(e) => setPrice(e.target.value)} />
              {errors.price && <p style={{ fontSize: T.xs, color: T.destructive }}>{errors.price}</p>}
            </div>
          )}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <Label>Số lượng vé <span style={{ color: T.destructive }}>*</span></Label>
              <Input type="number" placeholder="300" value={qty} onChange={(e) => setQty(e.target.value)} />
              {errors.qty && <p style={{ fontSize: T.xs, color: T.destructive }}>{errors.qty}</p>}
            </div>
            <div className="flex flex-col gap-1.5">
              <Label>Giới hạn mỗi người</Label>
              <Input type="number" defaultValue="1" />
            </div>
          </div>
          <div className="flex items-center justify-between py-2.5"
            style={{ borderTop: `1px solid ${T.border}`, borderBottom: `1px solid ${T.border}` }}>
            <div>
              <p style={{ fontSize: T.sm, fontWeight: T.fw_medium, color: T.foreground }}>Hiển thị trên Landing Page</p>
              <p style={{ fontSize: T.xs, color: T.mutedFg }}>Hạng vé sẽ xuất hiện trong phần chọn vé.</p>
            </div>
            <Toggle value={show} onChange={setShow} />
          </div>
          <div className="flex flex-col gap-2">
            <Label>Trạng thái</Label>
            <RadioCard selected={status === "draft"} onClick={() => setSt("draft")} label="Lưu nháp" />
            <RadioCard selected={status === "open"}  onClick={() => setSt("open")}  label="Mở đăng ký ngay" />
          </div>
          {show && (
            <div className="rounded-xl p-4" style={{ backgroundColor: T.secondary, border: `1px solid ${T.border}` }}>
              <p style={{ fontSize: T.xs, fontWeight: T.fw_semi, color: T.mutedFg, marginBottom: "8px" }}>PREVIEW TRÊN LANDING PAGE</p>
              <div className="rounded-xl p-3 flex items-center justify-between" style={{ backgroundColor: T.background, border: `1px solid ${T.border}` }}>
                <div>
                  <p style={{ fontSize: T.sm, fontWeight: T.fw_semi, color: T.foreground }}>{name || "Tên hạng vé"}</p>
                  <p style={{ fontSize: T.xs, color: type === "free" ? T.successText : T.primary }}>
                    {type === "free" ? "Miễn phí" : price ? `${Number(price).toLocaleString("vi-VN")}đ` : "—"}
                  </p>
                  <p style={{ fontSize: T.xs, color: T.mutedFg }}>Còn {qty || 0} vé</p>
                </div>
                <button className="px-3 py-1.5 rounded-lg" style={{ backgroundColor: T.primary, color: T.primaryFg, fontSize: T.xs }}>Chọn vé</button>
              </div>
            </div>
          )}
        </div>
        <DialogFooter className="px-6 py-4 gap-2" style={{ borderTop: `1px solid ${T.border}` }}>
          <DialogClose asChild><Button variant="outline">Hủy</Button></DialogClose>
          <Button onClick={handleSave} disabled={loading}>{loading ? "Đang lưu..." : "Lưu hạng vé"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ── Canvas registration block ─────────────────────────────────────────────────

function CanvasRegistrationBlock({ hasForm, hasKhoVe, tiers, regMode, ctaLabel, onCreateForm, onCreateKhoVe }: {
  hasForm: boolean; hasKhoVe: boolean; tiers: LocalTier[]; regMode: RegMode; ctaLabel: string;
  onCreateForm: () => void; onCreateKhoVe: () => void;
}) {
  const [selectedTier, setSelectedTier] = useState<string | null>(null);
  const needsKhoVe  = regMode !== "free";
  const visibleTiers = tiers.filter((t) => t.showOnLanding);

  if (!hasForm) {
    return (
      <LCard>
        <p style={{ fontSize: T.base, fontWeight: T.fw_semi, color: T.foreground, marginBottom: "8px" }}>Đăng ký tham gia</p>
        <div className="flex flex-col gap-3">
          <div className="rounded-xl p-4 text-center" style={{ backgroundColor: T.warningSubtle, border: `1px solid ${T.warningBorder}` }}>
            <FileText className="size-5 mx-auto mb-2" style={{ color: T.warningText }} />
            <p style={{ fontSize: T.sm, fontWeight: T.fw_medium, color: T.warningText, marginBottom: "4px" }}>Chưa có Form đăng ký.</p>
            <p style={{ fontSize: T.xs, color: T.mutedFg, marginBottom: "10px" }}>Tạo form để thu thông tin người tham dự.</p>
            <Button size="sm" onClick={onCreateForm}><FileText className="size-3.5" /> Tạo Form đăng ký</Button>
          </div>
          {needsKhoVe && !hasKhoVe && (
            <div className="rounded-xl p-4 text-center" style={{ backgroundColor: T.warningSubtle, border: `1px solid ${T.warningBorder}` }}>
              <Ticket className="size-5 mx-auto mb-2" style={{ color: T.warningText }} />
              <p style={{ fontSize: T.sm, fontWeight: T.fw_medium, color: T.warningText, marginBottom: "4px" }}>Chưa có Kho vé.</p>
              <p style={{ fontSize: T.xs, color: T.mutedFg, marginBottom: "10px" }}>Tạo kho vé để thiết lập các hạng vé.</p>
              <Button size="sm" onClick={onCreateKhoVe}><Ticket className="size-3.5" /> Tạo Kho vé</Button>
            </div>
          )}
        </div>
      </LCard>
    );
  }

  return (
    <LCard>
      <p style={{ fontSize: T.base, fontWeight: T.fw_semi, color: T.foreground, marginBottom: "4px" }}>Đăng ký tham gia</p>
      <p style={{ fontSize: T.xs, color: T.mutedFg, marginBottom: "12px" }}>Điền thông tin bên dưới để nhận vé QR tham dự sự kiện.</p>

      {needsKhoVe && hasKhoVe && visibleTiers.length > 0 && (
        <div className="mb-4">
          <p style={{ fontSize: T.sm, fontWeight: T.fw_semi, color: T.foreground, marginBottom: "8px" }}>Chọn hạng vé</p>
          <div className="flex flex-col gap-2">
            {visibleTiers.map((t) => {
              const isSoldOut  = t.status === "sold-out";
              const isSelected = selectedTier === t.id;
              return (
                <div key={t.id} className="rounded-xl p-3 flex items-center justify-between cursor-pointer"
                  style={{ border: isSelected ? `2px solid ${T.primary}` : `1px solid ${T.border}`,
                    backgroundColor: isSelected ? `rgba(30,170,255,0.04)` : T.background, opacity: isSoldOut ? 0.6 : 1 }}
                  onClick={() => !isSoldOut && setSelectedTier(t.id)}>
                  <div>
                    <div className="flex items-center gap-2">
                      <span style={{ fontSize: T.sm, fontWeight: T.fw_semi, color: T.foreground }}>{t.name}</span>
                      {t.type === "free"
                        ? <span style={{ fontSize: T.xs, backgroundColor: T.successSubtle, color: T.successText, padding: "1px 6px", borderRadius: "999px" }}>Miễn phí</span>
                        : <span style={{ fontSize: T.sm, fontWeight: T.fw_semi, color: T.primary }}>{t.price.toLocaleString("vi-VN")}đ</span>}
                    </div>
                    <p style={{ fontSize: T.xs, color: isSoldOut ? T.destructive : T.mutedFg }}>
                      {isSoldOut ? "Hết vé" : `Còn ${t.quantity} vé`}
                    </p>
                  </div>
                  {isSelected ? <Check className="size-4" style={{ color: T.primary }} /> : <button className="px-2.5 py-1 rounded-lg" style={{ backgroundColor: T.primary, color: T.primaryFg, fontSize: T.xs }}>Chọn</button>}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {needsKhoVe && !hasKhoVe && (
        <div className="mb-4 rounded-xl p-3 text-center" style={{ backgroundColor: T.warningSubtle, border: `1px solid ${T.warningBorder}` }}>
          <p style={{ fontSize: T.xs, color: T.warningText, marginBottom: "6px" }}>Chưa có Kho vé để hiển thị hạng vé.</p>
          <Button size="sm" onClick={onCreateKhoVe}><Ticket className="size-3.5" /> Tạo Kho vé</Button>
        </div>
      )}

      {["Họ và tên *", "Email *", "Số điện thoại *"].map((f) => (
        <div key={f} className="mb-2 px-3 py-2 rounded-xl" style={{ border: `1px solid ${T.border}`, backgroundColor: T.secondary }}>
          <span style={{ fontSize: T.xs, color: T.mutedFg }}>{f}</span>
        </div>
      ))}
      <button className="w-full mt-2 py-2.5 rounded-xl"
        style={{ backgroundColor: T.primary, color: T.primaryFg, fontSize: T.sm, fontWeight: T.fw_semi }}>
        {ctaLabel}
      </button>
      <p style={{ fontSize: T.xs, color: T.mutedFg, marginTop: "6px", textAlign: "center" as const, fontStyle: "italic" }}>
        {needsKhoVe && hasKhoVe ? "Dữ liệu vé từ Kho vé · " : ""}Fields từ Form đăng ký của sự kiện
      </p>
    </LCard>
  );
}

// ── Landing page preview ──────────────────────────────────────────────────────

function LandingPagePreview({ event, settings, hasForm, hasKhoVe, tiers, onCreateForm, onCreateKhoVe }: {
  event: EventDraft; settings: LandingSettings;
  hasForm: boolean; hasKhoVe: boolean; tiers: LocalTier[];
  onCreateForm: () => void; onCreateKhoVe: () => void;
}) {
  const isOnline = event.format === "online";
  return (
    <div className="mx-auto px-6 py-8" style={{ maxWidth: "900px" }}>
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        <div className="lg:col-span-2 flex flex-col gap-4">
          <EventCoverLarge
            gradient="linear-gradient(135deg, var(--primary) 0%, var(--accent-foreground) 100%)"
            alt="Ảnh cover sự kiện"
          >
            <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Calendar style={{ width: 40, height: 40, color: "white", opacity: 0.3 }} />
            </div>
          </EventCoverLarge>
          {settings.showOrganizer && (
            <LCard>
              <p style={{ fontSize: T.xs, color: T.mutedFg, marginBottom: "8px" }}>Đơn vị tổ chức</p>
              <div className="flex items-center gap-3">
                <div className="size-9 rounded-full flex items-center justify-center" style={{ backgroundColor: T.secondary }}>
                  <span style={{ fontSize: T.sm, fontWeight: T.fw_bold, color: T.primary }}>N</span>
                </div>
                <div>
                  <p style={{ fontSize: T.sm, fontWeight: T.fw_semi, color: T.foreground }}>NetSpace</p>
                  <button style={{ fontSize: T.xs, color: T.primary }} className="hover:underline">Liên hệ ban tổ chức</button>
                </div>
              </div>
            </LCard>
          )}
        </div>

        <div className="lg:col-span-3 flex flex-col gap-5">
          <span style={{ fontSize: T.xs, fontWeight: T.fw_semi, padding: "3px 10px", borderRadius: "999px",
            backgroundColor: T.successSubtle, color: T.successText, border: `1px solid ${T.successBorder}`,
            width: "fit-content", display: "inline-flex" }}>
            Đang mở đăng ký
          </span>
          <h1 style={{ fontSize: T["2xl"], fontWeight: T.fw_bold, color: T.foreground, lineHeight: 1.3 }}>
            {event.name || "Tên sự kiện"}
          </h1>
          <div className="flex flex-col gap-3">
            <LCard className="flex items-start gap-3 p-4">
              <div className="size-9 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: `rgba(30,170,255,0.1)` }}>
                <Calendar className="size-4" style={{ color: T.primary }} />
              </div>
              <div>
                <p style={{ fontSize: T.sm, fontWeight: T.fw_semi, color: T.foreground }}>
                  {event.startDate ? formatDate(event.startDate) : "Thứ Hai, 30 Tháng 6"}
                </p>
                <p style={{ fontSize: T.xs, color: T.mutedFg }}>{event.startTime || "16:00"} - {event.endTime || "20:00"} · GMT+7</p>
              </div>
            </LCard>
            {settings.showLocation && (
              <LCard className="flex items-start gap-3 p-4">
                <div className="size-9 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: `rgba(30,170,255,0.1)` }}>
                  {isOnline ? <Globe className="size-4" style={{ color: T.primary }} /> : <MapPin className="size-4" style={{ color: T.primary }} />}
                </div>
                <p style={{ fontSize: T.sm, fontWeight: T.fw_semi, color: T.foreground }}>
                  {event.location || "NetSpace — Công ty Công nghệ & Truyền thông"}
                </p>
              </LCard>
            )}
          </div>
          <CanvasRegistrationBlock hasForm={hasForm} hasKhoVe={hasKhoVe} tiers={tiers}
            regMode={settings.regMode} ctaLabel={settings.ctaLabel}
            onCreateForm={onCreateForm} onCreateKhoVe={onCreateKhoVe} />
          {settings.showDescription && (
            <LCard>
              <p style={{ fontSize: T.base, fontWeight: T.fw_semi, color: T.foreground, marginBottom: "10px" }}>Giới thiệu sự kiện</p>
              <p style={{ fontSize: T.sm, color: T.mutedFg, lineHeight: 1.7 }}>
                {event.description || "NetEvent Demo Conference 2026 là sự kiện dành cho doanh nghiệp, đội ngũ marketing và vận hành sự kiện."}
              </p>
            </LCard>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Landing Page Editor ───────────────────────────────────────────────────────

function LandingPageEditor({ event, settings, onSettingsChange }: {
  event: EventDraft; settings: LandingSettings; onSettingsChange: (s: LandingSettings) => void;
}) {
  const set = <K extends keyof LandingSettings>(k: K, v: LandingSettings[K]) => onSettingsChange({ ...settings, [k]: v });
  const [coverUrl, setCoverUrl] = useState<string | null>(null);

  const [hasKhoVe, setHasKhoVe]           = useState(false);
  const [tiers, setTiers]                 = useState<LocalTier[]>([]);
  const [leftDrawer, setLD]               = useState<LeftDrawer>(null);
  const [aboutOpen, setAboutOpen]         = useState(false);
  const [aboutTitle, setAboutTitle]       = useState("Giới thiệu sự kiện");
  const [aboutDesc, setAboutDesc]         = useState("NetEvent Demo Conference 2026 là sự kiện dành cho các đội ngũ tổ chức sự kiện, marketing, vận hành và công nghệ. Chương trình tập trung vào cách xây dựng trải nghiệm sự kiện hiệu quả, quản lý đăng ký, phát hành vé QR và tối ưu quy trình check-in.");
  const [aboutPoints, setAboutPoints]     = useState(["Xu hướng tổ chức sự kiện hiện đại", "Tối ưu quy trình đăng ký và check-in", "Kết nối cộng đồng làm sản phẩm và marketing", "Ứng dụng công nghệ trong vận hành sự kiện"]);
  const [aboutSaved, setAboutSaved]       = useState(false);
  const [formOpen, setFormOpen]           = useState(false);
  const [formFields, setFormFields]       = useState([
    { id: "name",  label: "Họ và tên",      required: true },
    { id: "email", label: "Email",           required: true },
    { id: "phone", label: "Số điện thoại",  required: true },
  ]);

  const handleKhoVeCreated = (newTiers: LocalTier[]) => { setHasKhoVe(true); setTiers(newTiers); setLD(null); };
  // Both modes always show the form; "tickets" additionally requires kho vé
  const needsKhoVe = settings.regMode === "tickets";

  const saveAbout = () => { setAboutSaved(true); setAboutOpen(false); };

  return (
    <div className="flex flex-col lg:flex-row h-full min-h-0 rounded-2xl overflow-hidden" style={{ border: `1px solid ${T.border}` }}>

      {/* ── Left panel ── */}
      <div className="flex flex-col shrink-0 lg:w-[300px] lg:h-full border-b lg:border-b-0 lg:border-r"
        style={{ borderColor: T.border, backgroundColor: T.background }}>
        <div className="px-5 py-4 shrink-0" style={{ borderBottom: `1px solid ${T.border}` }}>
          <p style={{ fontSize: T.sm, fontWeight: T.fw_semi, color: T.foreground }}>Tùy chỉnh trang sự kiện</p>
          <p style={{ fontSize: T.xs, color: T.mutedFg, marginTop: "2px" }}>Quản lý giao diện, nội dung hiển thị và cách người tham dự đăng ký.</p>
        </div>

        <div className="flex-1 overflow-y-auto">

          {/* 1. GIAO DIỆN */}
          <div className="p-5" style={{ borderBottom: `1px solid ${T.border}` }}>
            <SectionLabel>Giao diện</SectionLabel>
            <div className="flex flex-col gap-3">
              <EventCoverUpload
                previewUrl={coverUrl}
                onPreviewChange={setCoverUrl}
              />
              <BgStylePicker
                value={settings.bgStyle}
                hex={settings.bgColor}
                onChange={(v) => set("bgStyle", v)}
                onHexChange={(h) => set("bgColor", h)}
              />
              <div className="flex flex-col gap-1.5">
                <label style={{ fontSize: T.xs, color: T.mutedFg }}>Font hiển thị</label>
                <Select defaultValue="be">
                  <SelectTrigger className="h-8 cursor-pointer"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="be">Be Vietnam Pro</SelectItem>
                    <SelectItem value="inter">Inter</SelectItem>
                    <SelectItem value="noto">Noto Serif</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* 2. NỘI DUNG TRANG */}
          <div className="p-5" style={{ borderBottom: `1px solid ${T.border}` }}>
            <SectionLabel>Nội dung trang</SectionLabel>
            <div className="flex flex-col gap-3">

              {/* ── Giới thiệu sự kiện card ── */}
              <div className="rounded-xl p-3 flex flex-col gap-2"
                style={{ backgroundColor: `rgba(30,170,255,0.04)`, border: `1px solid ${T.primary}` }}>
                {/* Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    {aboutSaved
                      ? <CheckCircle2 className="size-3.5" style={{ color: T.primary }} />
                      : <AlertCircle  className="size-3.5" style={{ color: T.primary }} />}
                    <span style={{ fontSize: T.xs, fontWeight: T.fw_semi, color: T.primary }}>
                      Giới thiệu sự kiện
                    </span>
                  </div>
                  <span style={{ fontSize: T.xs, color: T.primary }}>
                    {aboutSaved ? "Đã cấu hình" : "Chưa cấu hình"}
                  </span>
                </div>
                {/* Desc */}
                <p style={{ fontSize: T.xs, color: T.mutedFg, lineHeight: 1.5 }}>
                  {aboutSaved
                    ? aboutDesc.slice(0, 100) + (aboutDesc.length > 100 ? "…" : "")
                    : "Mô tả tổng quan về sự kiện, điểm nổi bật, diễn giả, agenda hoặc thông tin người tham dự cần biết."}
                </p>
                {/* CTA */}
                <Button size="sm" variant={aboutSaved ? "outline" : "default"} onClick={() => setAboutOpen(true)} className="w-fit" style={{ fontSize: T.xs }}>
                  {aboutSaved ? "Chỉnh sửa nội dung" : "Viết nội dung"}
                </Button>
              </div>

              {/* ── Toggle sections ── */}
              <div className="flex flex-col" style={{ borderRadius: "12px", border: `1px solid ${T.border}`, overflow: "hidden" }}>
                {([
                  { label: "Đơn vị tổ chức",    key: "showOrganizer" as keyof LandingSettings },
                  { label: "Địa điểm / Bản đồ", key: "showLocation"  as keyof LandingSettings },
                  { label: "Footer",             key: "showFooter"    as keyof LandingSettings },
                ]).map(({ label, key }, i, arr) => (
                  <div key={key} className="flex items-center justify-between px-3 py-2.5"
                    style={{ borderBottom: i < arr.length - 1 ? `1px solid ${T.border}` : "none" }}>
                    <span style={{ fontSize: T.xs, color: T.mutedFg }}>{label}</span>
                    <Toggle value={settings[key] as boolean} onChange={(v) => set(key, v as LandingSettings[typeof key])} />
                  </div>
                ))}
              </div>

            </div>
          </div>

          {/* 3. ĐĂNG KÝ */}
          <div className="p-5" style={{ borderBottom: `1px solid ${T.border}` }}>
            <SectionLabel>Đăng ký</SectionLabel>
            <div className="flex flex-col gap-3">

              {/* Chế độ */}
              <div className="flex flex-col gap-1.5">
                <label style={{ fontSize: T.xs, color: T.mutedFg }}>Chế độ đăng ký</label>
                <Select value={settings.regMode} onValueChange={(v) => set("regMode", v as RegMode)}>
                  <SelectTrigger className="h-8 cursor-pointer"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="free">Chỉ form đăng ký</SelectItem>
                    <SelectItem value="tickets">Form đăng ký và hạng vé</SelectItem>
                  </SelectContent>
                </Select>
                <p style={{ fontSize: T.xs, color: T.mutedFg }}>
                  {settings.regMode === "free"
                    ? "Người tham dự điền form và nhận mã QR qua email."
                    : "Người tham dự chọn hạng vé rồi điền form để nhận vé QR."}
                </p>
              </div>

              {/* Form đăng ký — luôn hiển thị */}
              <DataSourceCard
                title="Form đăng ký"
                configured={true}
                configuredDesc={`${formFields.length} field · ${formFields.map(f => f.label).join(", ")}`}
                unconfiguredDesc="Chọn các field thông tin cần thu thập từ người tham dự."
                actionLabel="Tùy chỉnh form"
                manageLabel="Tùy chỉnh form"
                onAction={() => setFormOpen(true)}
              />

              {/* Kho vé — chỉ hiển thị với mode "tickets" */}
              {needsKhoVe && (
                <DataSourceCard
                  title="Kho vé"
                  configured={hasKhoVe}
                  configuredDesc={`${tiers.length} hạng vé · ${tiers.filter((t) => t.status === "open").length} đang mở · ${tiers.filter((t) => t.status !== "open").length} đã hết vé`}
                  unconfiguredDesc="Cần tạo kho vé và ít nhất 1 hạng vé đang mở."
                  actionLabel="Tạo kho vé"
                  manageLabel="Chỉnh sửa kho vé"
                  onAction={() => setLD(hasKhoVe ? "add-tier" : "create-khove")}
                />
              )}

              {/* Preview toggle: simulate tickets configured state */}
              {settings.regMode === "tickets" && (
                <div className="flex items-center justify-between gap-3 rounded-lg px-3 py-2"
                  style={{ backgroundColor: T.secondary, border: `1px dashed ${T.border}` }}>
                  <div className="flex items-center gap-2">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={T.mutedFg} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/>
                    </svg>
                    <p style={{ fontSize: T.xs, color: T.mutedFg }}>
                      Xem trước: {settings.ticketsConfigured ? "Vé đã cấu hình" : "Chưa cấu hình vé"}
                    </p>
                  </div>
                  <Toggle
                    value={settings.ticketsConfigured}
                    onChange={(v) => set("ticketsConfigured", v)}
                  />
                </div>
              )}

              {/* Auto email note */}
              <div className="rounded-lg p-2.5 flex items-start gap-2"
                style={{ backgroundColor: `rgba(30,170,255,0.06)`, border: `1px solid rgba(30,170,255,0.15)` }}>
                <AlertCircle className="size-3.5 shrink-0 mt-0.5" style={{ color: T.primary }} />
                <p style={{ fontSize: T.xs, color: T.mutedFg, lineHeight: 1.5 }}>
                  Email xác nhận kèm mã QR sẽ được gửi tự động sau khi đăng ký thành công.
                </p>
              </div>
            </div>
          </div>

          {/* 4. ĐIỀU KIỆN XUẤT BẢN — chỉ hiện khi chọn kho vé nhưng chưa tạo */}
          {settings.regMode === "tickets" && !hasKhoVe && (
            <div className="p-5">
              <SectionLabel>Điều kiện xuất bản</SectionLabel>
              <PublishChecklist hasKhoVe={hasKhoVe} regMode={settings.regMode} tiers={tiers} />
            </div>
          )}
        </div>

        {/* 5. TRẠNG THÁI LƯU */}
        <div className="shrink-0 px-5 py-3 flex items-center gap-2" style={{ borderTop: `1px solid ${T.border}` }}>
          <CheckCircle2 className="size-3.5 shrink-0" style={{ color: T.successText }} />
          <span style={{ fontSize: T.xs, color: T.successText }}>Đã lưu tự động</span>
        </div>
      </div>

      {/* ── Right canvas ── */}
      <div className="flex-1 min-w-0 overflow-auto">
        <DemoPublicLandingPage bgStyle={settings.bgStyle} bgColor={settings.bgColor} regMode={settings.regMode} ticketsConfigured={settings.ticketsConfigured} coverUrl={coverUrl} themeBg={themePageBg(event.theme)}
          themeImage={(event as { pageImage?: string }).pageImage}
          event={event as PublicEvent} />
      </div>

      {/* ── Popup: Chỉnh sửa giới thiệu sự kiện ── */}
      <Dialog open={aboutOpen} onOpenChange={(o) => !o && setAboutOpen(false)}>
        <DialogContent className="sm:max-w-[520px] max-h-[90vh] overflow-y-auto" aria-describedby={undefined}>
          <DialogHeader>
            <DialogTitle>Chỉnh sửa giới thiệu sự kiện</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-5 py-2">
            <div className="flex flex-col gap-1.5">
              <label style={{ fontSize: T.sm, fontWeight: T.fw_medium, color: T.foreground }}>Tiêu đề section</label>
              <input value={aboutTitle} onChange={e => setAboutTitle(e.target.value)}
                className="w-full outline-none rounded-xl px-3 py-2.5"
                style={{ border: `1px solid ${T.border}`, backgroundColor: T.background, fontSize: T.sm, color: T.foreground }} />
            </div>
            <div className="flex flex-col gap-1.5">
              <label style={{ fontSize: T.sm, fontWeight: T.fw_medium, color: T.foreground }}>Mô tả sự kiện</label>
              <textarea value={aboutDesc} onChange={e => setAboutDesc(e.target.value)}
                rows={5} className="w-full outline-none rounded-xl px-3 py-2.5 resize-none"
                style={{ border: `1px solid ${T.border}`, backgroundColor: T.background, fontSize: T.sm, color: T.foreground }} />
            </div>
            <div className="flex flex-col gap-2">
              <label style={{ fontSize: T.sm, fontWeight: T.fw_medium, color: T.foreground }}>Điểm nổi bật</label>
              {aboutPoints.map((pt, i) => (
                <div key={i} className="flex items-center gap-2">
                  <input value={pt} onChange={e => setAboutPoints(p => p.map((x, j) => j === i ? e.target.value : x))}
                    className="flex-1 outline-none rounded-lg px-3 py-2"
                    style={{ border: `1px solid ${T.border}`, backgroundColor: T.background, fontSize: T.sm, color: T.foreground }} />
                  <button onClick={() => setAboutPoints(p => p.filter((_, j) => j !== i))}
                    style={{ background: "none", border: "none", cursor: "pointer", color: T.mutedFg, fontSize: T.lg }}>×</button>
                </div>
              ))}
              <button onClick={() => setAboutPoints(p => [...p, ""])}
                style={{ fontSize: T.xs, color: T.primary, fontWeight: T.fw_medium,
                  background: "none", border: "none", padding: 0, textAlign: "left", cursor: "pointer" }}>
                + Thêm ý
              </button>
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild><Button variant="outline">Hủy</Button></DialogClose>
            <Button onClick={saveAbout}>Lưu nội dung</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Popup: Tùy chỉnh form đăng ký ── */}
      <Dialog open={formOpen} onOpenChange={(o) => !o && setFormOpen(false)}>
        <DialogContent className="sm:max-w-[860px] p-0 overflow-hidden" aria-describedby={undefined}>
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 shrink-0"
            style={{ borderBottom: `1px solid ${T.border}` }}>
            <div>
              <DialogTitle>Tùy chỉnh Form đăng ký</DialogTitle>
              <p style={{ fontSize: T.xs, color: T.mutedFg, marginTop: "2px" }}>
                Đã chọn <span style={{ fontWeight: T.fw_semi, color: T.primary }}>{3 + formFields.filter(f => !f.required).length}/12</span> trường thông tin
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button size="sm" variant="ghost" onClick={() => setFormFields([
                { id: "name", label: "Họ và tên", required: true },
                { id: "email", label: "Email", required: true },
                { id: "phone", label: "Số điện thoại", required: true },
              ])}>Đặt lại mặc định</Button>
              <DialogClose asChild><Button size="sm" variant="outline">Hủy</Button></DialogClose>
              <Button size="sm" onClick={() => setFormOpen(false)}>Áp dụng thay đổi</Button>
            </div>
          </div>

          {/* Body: 2 columns */}
          <div className="flex min-h-0" style={{ maxHeight: "70vh" }}>

            {/* Left: Field selector */}
            <div className="flex flex-col gap-0 overflow-y-auto flex-1 min-w-0"
              style={{ borderRight: `1px solid ${T.border}` }}>

              {/* Selected chips */}
              <div className="px-5 py-4" style={{ borderBottom: `1px solid ${T.border}` }}>
                <p style={{ fontSize: T.xs, fontWeight: T.fw_semi, color: T.mutedFg, textTransform: "uppercase" as const, letterSpacing: "0.05em", marginBottom: "10px" }}>
                  Field đã chọn
                </p>
                <div className="flex flex-wrap gap-2">
                  {[{ label: "Họ và tên", idx: 1 }, { label: "Email", idx: 2 }, { label: "Số điện thoại", idx: 3 }].map(({ label, idx }) => (
                    <div key={label} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full"
                      style={{ backgroundColor: `rgba(30,170,255,0.08)`, border: `1px solid ${T.primary}` }}>
                      <span style={{ fontSize: T.xs, color: T.primary, fontWeight: T.fw_bold }}>{idx}</span>
                      <span style={{ fontSize: T.xs, color: T.foreground, fontWeight: T.fw_medium }}>{label}</span>
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke={T.primary} strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="4" y="11" width="16" height="10" rx="1.5"/><path d="M8 11V7.5a4 4 0 0 1 8 0V11"/>
                      </svg>
                    </div>
                  ))}
                  {formFields.filter(f => !f.required).map((f, i) => (
                    <div key={f.id} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full"
                      style={{ backgroundColor: `rgba(30,170,255,0.08)`, border: `1px solid ${T.primary}` }}>
                      <span style={{ fontSize: T.xs, color: T.primary, fontWeight: T.fw_bold }}>{4 + i}</span>
                      <span style={{ fontSize: T.xs, color: T.foreground, fontWeight: T.fw_medium }}>{f.label}</span>
                      <button onClick={() => setFormFields(p => p.filter(x => x.id !== f.id))}
                        className="hover:opacity-70" style={{ display: "flex", alignItems: "center", color: T.primary, lineHeight: 1, background: "none", border: "none", cursor: "pointer" }}>
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
                <p style={{ fontSize: T.xs, color: T.mutedFg, marginTop: "8px", fontStyle: "italic" }}>
                  Kéo thả để sắp xếp thứ tự field hiển thị trên trang sự kiện.
                </p>
              </div>

              {/* Field library */}
              <div className="flex flex-col gap-0 overflow-y-auto flex-1">
                {([
                  { cat: "Thông tin cơ bản", fields: ["Họ và tên", "Email", "Số điện thoại", "Công ty / Tổ chức", "Chức danh", "Địa chỉ"] },
                  { cat: "Thông tin nghề nghiệp", fields: ["Ngành nghề", "Phòng ban", "Vị trí công việc", "Quy mô công ty", "Website công ty"] },
                  { cat: "Thông tin tham dự", fields: ["Bạn biết sự kiện qua đâu?", "Mục tiêu tham gia sự kiện", "Chủ đề quan tâm", "Câu hỏi cho diễn giả", "Yêu cầu đặc biệt"] },
                ]).map(({ cat, fields }) => {
                  const DEFAULTS = ["Họ và tên", "Email", "Số điện thoại"];
                  const optionalSelected = formFields.filter(f => !f.required);
                  return (
                    <div key={cat} className="px-5 py-4" style={{ borderBottom: `1px solid ${T.border}` }}>
                      <p style={{ fontSize: T.xs, fontWeight: T.fw_semi, color: T.mutedFg, marginBottom: "8px" }}>{cat}</p>
                      <div className="flex flex-wrap gap-2">
                        {fields.map(f => {
                          const isDefault  = DEFAULTS.includes(f);
                          const isSelected = isDefault || optionalSelected.some(x => x.label === f);
                          const isMax      = !isSelected && 3 + optionalSelected.length >= 12;
                          return (
                            <button key={f} disabled={isDefault || isMax}
                              onClick={() => {
                                if (isDefault) return;
                                if (isSelected) setFormFields(p => p.filter(x => x.label !== f));
                                else if (!isMax) setFormFields(p => [...p, { id: f.toLowerCase().replace(/\s/g, "-"), label: f, required: false }]);
                              }}
                              className="flex items-center gap-1 px-3 py-1.5 rounded-full transition-all"
                              style={{ fontSize: T.xs, fontWeight: isSelected ? T.fw_semi : T.fw_normal,
                                backgroundColor: isSelected ? `rgba(30,170,255,0.1)` : T.secondary,
                                color: isSelected ? T.primary : isMax ? T.mutedFg : T.foreground,
                                border: isSelected ? `1px solid ${T.primary}` : `1px solid ${T.border}`,
                                opacity: isMax ? 0.5 : 1, cursor: isDefault || isMax ? "default" : "pointer" }}>
                              {f}
                              {isDefault && (
                                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                  <rect x="4" y="11" width="16" height="10" rx="1.5"/><path d="M8 11V7.5a4 4 0 0 1 8 0V11"/>
                                </svg>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
                <div className="px-5 py-3">
                  <p style={{ fontSize: T.xs, color: T.mutedFg, fontStyle: "italic" }}>
                    Hạng vé không phải là field trong Form. Hạng vé được lấy từ Kho vé của sự kiện.
                  </p>
                </div>
              </div>
            </div>

            {/* Right: Preview */}
            <div className="flex flex-col shrink-0 overflow-y-auto" style={{ width: "280px", backgroundColor: T.secondary }}>
              <div className="px-4 py-3 shrink-0" style={{ borderBottom: `1px solid ${T.border}` }}>
                <p style={{ fontSize: T.xs, fontWeight: T.fw_semi, color: T.foreground }}>Xem trước Form</p>
                <p style={{ fontSize: T.xs, color: T.mutedFg }}>Form hiển thị trên trang sự kiện</p>
              </div>
              <div className="flex flex-col gap-3 p-4">
                <div className="rounded-xl p-4 flex flex-col gap-3" style={{ backgroundColor: T.background, border: `1px solid ${T.border}` }}>
                  <p style={{ fontSize: T.sm, fontWeight: T.fw_semi, color: T.foreground }}>Đăng ký tham gia</p>
                  <p style={{ fontSize: T.xs, color: T.mutedFg }}>Điền thông tin bên dưới để nhận vé QR tham dự sự kiện.</p>
                  {[
                    { label: "Họ và tên", req: true },
                    { label: "Email", req: true },
                    { label: "Số điện thoại", req: true },
                    ...formFields.filter(f => !f.required).map(f => ({ label: f.label, req: false })),
                  ].map(({ label, req }) => (
                    <div key={label} className="flex flex-col gap-1">
                      <label style={{ fontSize: T.xs, color: T.foreground }}>
                        {label} {req && <span style={{ color: T.destructive }}>*</span>}
                      </label>
                      <div className="px-2.5 py-1.5 rounded-lg" style={{ border: `1px solid ${T.border}`, backgroundColor: T.secondary }}>
                        <span style={{ fontSize: T.xs, color: T.mutedFg }}>{label}...</span>
                      </div>
                    </div>
                  ))}
                  <button className="w-full py-2 rounded-lg mt-1"
                    style={{ backgroundColor: T.primary, color: T.primaryFg, fontSize: T.xs, fontWeight: T.fw_semi, border: "none", cursor: "pointer" }}>
                    Đăng ký ngay
                  </button>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Drawers */}
      <CreateKhoVeDrawer open={leftDrawer === "create-khove"} onClose={() => setLD(null)} onCreated={handleKhoVeCreated} eventName={event.name || "Sự kiện"} />
    </div>
  );
}

// ── Demo Public Landing Page ──────────────────────────────────────────────────

/** Vài người đăng ký gần nhất, hiển thị công khai trên trang sự kiện. */
const RECENT_JOINERS = [
  { name: "Nguyễn Thị Hoa", tint: "#f87171" },
  { name: "Trần Minh Tú",   tint: "#a78bfa" },
  { name: "Lê Văn Đức",     tint: "#34d399" },
  { name: "Phạm Thu Hà",    tint: "#fbbf24" },
  { name: "Hoàng Quốc Bảo", tint: "#60a5fa" },
];
const TOTAL_JOINERS = 328;

const DEMO_TIERS = [
  { id: "standard",   name: "Standard",   price: 0,      priceLabel: "Miễn phí", remaining: 120, soldOut: false, desc: "Vé tham dự cơ bản. Bao gồm tài liệu sự kiện và tea-break." },
  { id: "vip",        name: "VIP",        price: 499000, priceLabel: "499.000đ", remaining: 28,  soldOut: false, desc: "Ưu tiên chỗ ngồi, networking riêng và quà tặng đặc biệt." },
  { id: "early-bird", name: "Early Bird", price: 299000, priceLabel: "299.000đ", remaining: 0,   soldOut: true,  desc: "Vé ưu đãi dành cho người đăng ký sớm." },
];

// Event brand accent color (separate from platform primary)
const OG = "#FF8644";

/** Các trường của sự kiện mà trang công khai đọc. */
export type PublicEvent = {
  id?: string; name?: string; description?: string;
  startDate?: string; startTime?: string; endDate?: string; endTime?: string;
  format?: string; location?: string; visibility?: string;
  requireApproval?: boolean; limitAttendees?: boolean; maxAttendees?: string;
  ticketPrice?: string; organizer?: string; organizerAvatar?: string;
  coverImage?: string; cover?: string;
};

export function DemoPublicLandingPage({ bgStyle, bgColor, regMode, ticketsConfigured = true, coverUrl, themeBg, themeImage, event }: { bgStyle?: "light" | "white" | "brand"; bgColor?: string; regMode?: RegMode; ticketsConfigured?: boolean; coverUrl?: string | null; themeBg?: string; themeImage?: string; event?: PublicEvent } = {}) {
  const showTiers = regMode === "tickets" || regMode === undefined; // default to showing tiers in /demo

  // ── Nội dung lấy từ cấu hình sự kiện ──
  // Sự kiện demo (id "t1") giữ phần nội dung mẫu mà model chưa có — ba hạng vé,
  // danh sách người tham dự, bài giới thiệu dài, địa chỉ chi tiết. Sự kiện tạo
  // mới hiển thị đúng những gì đã cấu hình; khối nào không có dữ liệu thì ẩn.
  const isDemo = !event || event.id === "t1";
  const eventName = event?.name?.trim() || "NetEvent Demo Conference 2026";
  const isPrivate = event?.visibility === "private";
  const isOnline = event?.format === "online";
  const needsApproval = !isDemo && !!event?.requireApproval;
  const priceNum = Number(event?.ticketPrice || 0);
  const capacity = event?.limitAttendees && Number(event?.maxAttendees) > 0 ? Number(event?.maxAttendees) : undefined;
  const tiers = isDemo ? DEMO_TIERS : [{
    id: "general", name: "Vé tham dự", price: priceNum,
    priceLabel: priceNum > 0 ? `${priceNum.toLocaleString("vi-VN")}đ` : "Miễn phí",
    remaining: capacity ?? Infinity, soldOut: false,
    desc: needsApproval ? "Ban tổ chức sẽ duyệt đăng ký trước khi gửi vé." : "Vé tham dự sự kiện.",
  }];
  const dateLabel = longDateVi(event?.startDate) ?? "Chưa có ngày";
  const multiDay = !!event?.endDate && event.endDate !== event.startDate;
  const timeLabel = event?.startTime
    ? `${event.startTime} – ${event.endTime ?? ""}${multiDay ? ` · đến ${shortDateVi(event.endDate)}` : ""}`
    : "";
  const locTitle = event?.location?.trim() || "NetSpace — Công ty Công nghệ & Truyền thông";
  const locationPrimary = isOnline ? "Sự kiện trực tuyến" : (event?.location?.trim() || "Chưa có địa điểm");
  const locationSecondary = isOnline ? "Link tham gia gửi qua email sau khi đăng ký" : "Offline";
  const organizerName = event?.organizer?.trim() || "NetSpace";
  const organizerAvatar = event?.organizerAvatar;
  const organizerNote = isDemo && !event?.organizer ? "Công ty Công nghệ & Truyền thông" : "";
  const coverSrc = coverUrl ?? event?.coverImage ?? null;
  const coverGradient = !isDemo && event?.cover ? event.cover
    : "linear-gradient(145deg, #1a1a2e 0%, #16213e 40%, #0f3460 70%, #1a1a2e 100%)";
  const aboutText = event?.description?.trim() ?? "";
  const showLocation = isDemo || (!isOnline && !!event?.location?.trim());
  const locAddress = isDemo ? "Tầng 3, Tòa nhà MIPEC, 229 P. Tây Sơn, Kim Liên, Hà Nội" : "";
  const mapLabel = isDemo ? "MIPEC Tower, Tây Sơn" : locTitle;
  const ticketLine = `${shortDateVi(event?.startDate) ?? ""} · ${event?.startTime ?? ""} — ${isOnline ? "Trực tuyến" : locTitle}`;
  const [step, setStep]         = useState<"select" | "form" | "payment" | "success">("select");
  const [selectedTier, setTier] = useState<string | null>(tiers.length === 1 ? tiers[0].id : null);
  const [name, setName]         = useState("");
  const [email, setEmail]       = useState("");
  const [phone, setPhone]       = useState("");
  const [company, setCompany]   = useState("");
  const [title, setTitle]       = useState("");
  const [agreed, setAgreed]     = useState(false);
  const [errors, setErrors]     = useState<Record<string, string>>({});
  const [loading, setLoading]   = useState(false);
  const [ticketCode, setCode]   = useState("");
  const [payLoading, setPayLoading] = useState(false);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!name.trim())  e.name  = "Vui lòng nhập họ và tên.";
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = "Vui lòng nhập email hợp lệ.";
    if (!phone.trim()) e.phone = "Vui lòng nhập số điện thoại.";
    return e;
  };

  const handleSubmit = () => {
    const errs = validate(); setErrors(errs);
    if (Object.keys(errs).length) return;
    setLoading(true);
    setTimeout(() => {
      const t = tiers.find((t) => t.id === selectedTier);
      const prefix = t?.id === "vip" ? "VIP" : t?.id === "early-bird" ? "EB" : "STD";
      setCode(`NE-2026-${prefix}-${Math.floor(10000 + Math.random() * 90000)}`);
      setLoading(false);
      // Paid tiers → go to payment step; free → go directly to success
      if (t && t.price > 0 && !needsApproval) setStep("payment");
      else setStep("success");
    }, 1000);
  };

  const handlePaymentSuccess = () => {
    setPayLoading(true);
    setTimeout(() => { setPayLoading(false); setStep("success"); }, 1200);
  };

  // Simulate bank webhook: auto-confirm payment ~8s after QR shown (while QR still valid)
  useEffect(() => {
    if (step !== "payment") return;
    const timer = setTimeout(() => { setStep("success"); }, 8000);
    return () => clearTimeout(timer);
  }, [step]);

  const tier = tiers.find((t) => t.id === selectedTier);

  return (
    <div className="min-h-full" style={{
      // "Trắng" và "Màu thương hiệu" là lựa chọn tường minh nên vẫn thắng;
      // còn lại nền trang lấy theo giao diện (theme) của sự kiện.
      backgroundColor: bgStyle === "white" ? "#ffffff"
        : bgStyle === "brand" && bgColor ? bgColor + "18"
        : (themeBg ?? "#f6f8fb"),
      // Ảnh nền do người dùng tải lên phủ lên màu theme, cũng chỉ khi không
      // chọn tường minh "Trắng" hay "Màu thương hiệu".
      ...(themeImage && bgStyle !== "white" && !(bgStyle === "brand" && bgColor) ? {
        backgroundImage: `linear-gradient(rgba(255,255,255,0.35), rgba(255,255,255,0.35)), url("${themeImage}")`,
        backgroundSize: "cover", backgroundPosition: "center", backgroundAttachment: "fixed",
      } : {}),
      transition: "background-color 0.2s",
    }}>

      {/* ── Main two-column layout ── */}
      <div className="mx-auto px-4 lg:px-6 py-8 lg:py-12" style={{ maxWidth: "1160px" }}>
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-10 items-start">

          {/* ── LEFT COLUMN ── */}
          <div className="w-full lg:w-[420px] shrink-0 flex flex-col gap-5">

            {/* Cover 1:1 */}
            <EventCoverLarge
              src={coverSrc}
              gradient={coverGradient}
              alt="Ảnh cover sự kiện"
            >
              {/* Event name overlay when no uploaded image */}
              {!coverSrc && (
                <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 8, padding: 24 }}>
                  <Calendar style={{ width: 36, height: 36, color: "white", opacity: 0.3 }} />
                  <p style={{ color: "rgba(255,255,255,0.7)", fontSize: T.sm, textAlign: "center", margin: 0 }}>Ảnh cover sự kiện</p>
                </div>
              )}
            </EventCoverLarge>

            <div style={{ borderTop: `1px solid ${T.border}` }} />

            {/* Đơn vị tổ chức — không khung, các mục ngăn nhau bằng đường kẻ mảnh */}
            <div>
              <p style={{ fontSize: T.xs, fontWeight: T.fw_semi, color: T.mutedFg,
                textTransform: "uppercase" as const, letterSpacing: "0.06em", marginBottom: "12px" }}>
                Đơn vị tổ chức
              </p>
              <div className="flex items-center gap-3">
                {organizerAvatar ? (
                  <img src={organizerAvatar} alt={organizerName}
                    className="size-10 rounded-full shrink-0" style={{ objectFit: "cover" }} />
                ) : (
                  <div className="size-10 rounded-full flex items-center justify-center shrink-0"
                    style={{ backgroundColor: `rgba(255,134,68,0.12)` }}>
                    <span style={{ fontWeight: T.fw_bold, color: OG, fontSize: T.base }}>{organizerName[0]?.toUpperCase()}</span>
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p style={{ fontSize: T.sm, fontWeight: T.fw_semi, color: T.foreground }}>{organizerName}</p>
                  {organizerNote && <p style={{ fontSize: T.xs, color: T.mutedFg }}>{organizerNote}</p>}
                </div>
              </div>
            </div>

            <div style={{ borderTop: `1px solid ${T.border}` }} />

            {/* Người tham dự — chỉ sự kiện demo có dữ liệu; sự kiện mới chưa có ai thì ẩn */}
            {isDemo && (<>
            {/* Người tham dự — vài người đăng ký gần nhất */}
            <div>
              <p style={{ fontSize: T.xs, fontWeight: T.fw_semi, color: T.mutedFg,
                textTransform: "uppercase" as const, letterSpacing: "0.06em", marginBottom: "12px" }}>
                {TOTAL_JOINERS.toLocaleString()} người sẽ tham dự
              </p>
              <div className="flex items-center gap-2 mb-3">
                {RECENT_JOINERS.map((j, i) => (
                  <span key={j.name} title={j.name}
                    className="size-8 rounded-full shrink-0 flex items-center justify-center"
                    style={{ backgroundColor: j.tint, marginLeft: i === 0 ? 0 : -14,
                      border: `2px solid ${T.background}`,
                      fontSize: "10px", fontWeight: T.fw_semi, color: "#fff" }}>
                    {j.name.trim().split(/\s+/).slice(-1)[0][0]}
                  </span>
                ))}
              </div>
              <p style={{ fontSize: T.xs, color: T.mutedFg, lineHeight: 1.6 }}>
                {RECENT_JOINERS.slice(0, 2).map((j) => j.name).join(", ")}
                {TOTAL_JOINERS > 2 ? ` và ${(TOTAL_JOINERS - 2).toLocaleString()} người khác` : ""}
              </p>
            </div>

            <div style={{ borderTop: `1px solid ${T.border}` }} />
            </>)}

            {/* Share card */}
            <div>
              <p style={{ fontSize: T.xs, fontWeight: T.fw_semi, color: T.mutedFg,
                textTransform: "uppercase" as const, letterSpacing: "0.06em", marginBottom: "10px" }}>
                Chia sẻ sự kiện
              </p>
              <div className="flex gap-3">
                <button title="Chia sẻ Facebook" style={{ background: "none", border: "none", padding: 0, cursor: "pointer", opacity: 0.5, transition: "opacity 0.15s" }}
                  onMouseEnter={e => (e.currentTarget.style.opacity = "1")} onMouseLeave={e => (e.currentTarget.style.opacity = "0.5")}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill={T.foreground}>
                    <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.236 2.686.236v2.97h-1.513c-1.491 0-1.956.93-1.956 1.884v2.25h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z"/>
                  </svg>
                </button>
                <button title="Chia sẻ Twitter" style={{ background: "none", border: "none", padding: 0, cursor: "pointer", opacity: 0.5, transition: "opacity 0.15s" }}
                  onMouseEnter={e => (e.currentTarget.style.opacity = "1")} onMouseLeave={e => (e.currentTarget.style.opacity = "0.5")}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill={T.foreground}>
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.253 5.622 5.911-5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                </button>
                <button title="Sao chép link" style={{ background: "none", border: "none", padding: 0, cursor: "pointer", opacity: 0.5, transition: "opacity 0.15s" }}
                  onMouseEnter={e => (e.currentTarget.style.opacity = "1")} onMouseLeave={e => (e.currentTarget.style.opacity = "0.5")}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={T.foreground} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
                    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* ── RIGHT COLUMN ── */}
          <div className="flex-1 min-w-0 flex flex-col gap-10">

            {/* Event info header */}
            <div>
              {isPrivate ? (
                <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", padding: "4px 12px",
                  borderRadius: "999px", backgroundColor: "rgba(219,39,119,0.08)", marginBottom: "14px" }}>
                  <div className="size-1.5 rounded-full" style={{ backgroundColor: "#db2777" }} />
                  <span style={{ fontSize: T.xs, fontWeight: T.fw_medium, color: "#db2777" }}>Sự kiện riêng tư</span>
                </div>
              ) : (
                <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", padding: "4px 12px",
                  borderRadius: "999px", backgroundColor: T.successSubtle, marginBottom: "14px" }}>
                  <div className="size-1.5 rounded-full" style={{ backgroundColor: T.successText }} />
                  <span style={{ fontSize: T.xs, fontWeight: T.fw_medium, color: T.successText }}>Đang mở đăng ký</span>
                </div>
              )}
              <h1 style={{ fontSize: "clamp(22px, 3vw, 32px)", fontWeight: T.fw_bold, color: T.foreground,
                lineHeight: 1.25, marginBottom: "10px" }}>
                {eventName}
              </h1>

              {/* Meta rows */}
              <div className="flex flex-col gap-3">
                {[
                  { icon: <Calendar className="size-4 shrink-0" />, primary: dateLabel, secondary: timeLabel },
                  { icon: <MapPin className="size-4 shrink-0" />, primary: locationPrimary, secondary: locationSecondary },
                ].map((r, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="size-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
                      style={{ backgroundColor: `rgba(255,134,68,0.1)`, color: OG }}>
                      {r.icon}
                    </div>
                    <div>
                      <p style={{ fontSize: T.sm, fontWeight: T.fw_medium, color: T.foreground }}>{r.primary}</p>
                      {r.secondary && <p style={{ fontSize: T.xs, color: T.mutedFg }}>{r.secondary}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ── Registration card ── */}
            <div className="rounded-2xl" style={{ backgroundColor: T.background, border: `1px solid ${T.border}`, overflow: "hidden" }}>

              {/* Card header */}
              <div style={{ borderBottom: `1px solid ${T.border}`, padding: "20px 24px" }}>
                <p style={{ fontSize: T.base, fontWeight: T.fw_semi, color: T.foreground }}>
                  {showTiers && !ticketsConfigured ? "Kho vé chưa được thiết lập" : step === "success" ? (needsApproval ? "Đã gửi yêu cầu tham gia" : "Đăng ký thành công! 🎉") : step === "payment" ? "Thanh toán" : step === "form" ? "Thông tin đăng ký" : "Đăng ký tham gia"}
                </p>
                <p style={{ fontSize: T.xs, color: T.mutedFg, marginTop: "2px" }}>
                  {showTiers && !ticketsConfigured ? "Ban tổ chức chưa hoàn tất cấu hình vé." : step === "success" ? (needsApproval ? "Ban tổ chức sẽ duyệt và gửi vé QR qua email." : "Vé QR đã được gửi tới email của bạn.") : step === "payment" ? "Quét mã QR để hoàn tất thanh toán." : step === "form" ? (needsApproval ? "Điền thông tin để gửi yêu cầu tham gia." : "Điền thông tin để nhận vé QR tham dự sự kiện.") : showTiers ? (tiers.length > 1 ? "Chọn hạng vé phù hợp với bạn." : "Kiểm tra thông tin vé rồi tiếp tục.") : "Điền thông tin để nhận mã QR tham dự sự kiện."}
                </p>
              </div>

              <div style={{ padding: "24px" }}>

                {/* ── EMPTY STATE: tickets mode but not configured ── */}
                {showTiers && !ticketsConfigured && (
                  <div className="flex flex-col items-center gap-5 py-6">
                    {/* Icon */}
                    <div className="size-16 rounded-2xl flex items-center justify-center"
                      style={{ backgroundColor: T.secondary, border: `1px solid ${T.border}` }}>
                      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={T.mutedFg} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z"/>
                        <path d="M13 5v2M13 17v2M13 11v2"/>
                      </svg>
                    </div>

                    {/* Text */}
                    <div className="text-center flex flex-col gap-1.5">
                      <p style={{ fontSize: T.sm, fontWeight: T.fw_semi, color: T.foreground }}>
                        Chưa có hạng vé nào
                      </p>
                      <p style={{ fontSize: T.xs, color: T.mutedFg, lineHeight: 1.6, maxWidth: "260px" }}>
                        Ban tổ chức chưa thiết lập hạng vé cho sự kiện này. Vui lòng quay lại sau.
                      </p>
                    </div>

                    {/* Divider */}
                    <div style={{ width: "100%", height: "1px", backgroundColor: T.border }} />

                    {/* Info row */}
                    <div className="flex items-start gap-2.5 w-full rounded-xl p-3"
                      style={{ backgroundColor: T.secondary, border: `1px solid ${T.border}` }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={T.mutedFg} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5 shrink-0">
                        <circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/>
                      </svg>
                      <p style={{ fontSize: T.xs, color: T.mutedFg, lineHeight: 1.6 }}>
                        Thông tin về hạng vé và giá sẽ hiển thị tại đây khi ban tổ chức hoàn tất cấu hình.
                      </p>
                    </div>

                  </div>
                )}

                {/* ── STEP: SELECT TIER (mode: tickets) ── */}
                {step === "select" && showTiers && ticketsConfigured && (
                  <div className="flex flex-col gap-4">
                    {tiers.map((t) => {
                      const selected = selectedTier === t.id;
                      return (
                        <button key={t.id} disabled={t.soldOut}
                          data-pill="off"
                          onClick={() => !t.soldOut && setTier(t.id)}
                          className="w-full text-left rounded-xl p-4 transition-all"
                          style={{
                            border: selected ? `2px solid ${OG}` : `1px solid ${T.border}`,
                            backgroundColor: selected ? `rgba(255,134,68,0.04)` : t.soldOut ? T.secondary : T.background,
                            opacity: t.soldOut ? 0.6 : 1,
                            cursor: t.soldOut ? "not-allowed" : "pointer",
                          }}>
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex items-start gap-3 flex-1 min-w-0">
                              <div className="size-4 rounded-full border-2 mt-0.5 flex items-center justify-center shrink-0"
                                style={{ borderColor: selected ? OG : T.border }}>
                                {selected && <div className="size-2 rounded-full" style={{ backgroundColor: OG }} />}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span style={{ fontSize: T.sm, fontWeight: T.fw_semi, color: T.foreground }}>{t.name}</span>
                                  {t.soldOut && (
                                    <span style={{ fontSize: T.xs, padding: "1px 8px", borderRadius: "999px",
                                      backgroundColor: `rgba(248,104,128,0.1)`, color: "#f86880" }}>Hết vé</span>
                                  )}
                                </div>
                                <p style={{ fontSize: T.xs, color: T.mutedFg, marginTop: "3px", lineHeight: 1.5 }}>{t.desc}</p>
                                {!t.soldOut && (
                                  <p style={{ fontSize: T.xs, color: T.mutedFg, marginTop: "4px" }}>{Number.isFinite(t.remaining) ? `Còn ${t.remaining} vé` : "Không giới hạn số lượng"}</p>
                                )}
                              </div>
                            </div>
                            <div style={{ textAlign: "right" as const, shrink: 0 }}>
                              <span style={{ fontSize: T.sm, fontWeight: T.fw_semi,
                                color: t.price === 0 ? T.successText : T.foreground }}>
                                {t.priceLabel}
                              </span>
                            </div>
                          </div>
                        </button>
                      );
                    })}

                    <button
                      disabled={!selectedTier}
                      onClick={() => selectedTier && setStep("form")}
                      className="w-full py-3 rounded-xl transition-all"
                      style={{
                        backgroundColor: selectedTier ? OG : T.secondary,
                        color: selectedTier ? "white" : T.mutedFg,
                        fontSize: T.sm, fontWeight: T.fw_semi,
                        border: "none", cursor: selectedTier ? "pointer" : "not-allowed",
                      }}>
                      {needsApproval ? "Gửi yêu cầu tham gia →" : "Tiếp tục đăng ký →"}
                    </button>
                    <p style={{ fontSize: T.xs, color: T.mutedFg, textAlign: "center" as const }}>
                      Bạn sẽ điền thông tin đăng ký ở bước tiếp theo.
                    </p>
                  </div>
                )}

                {/* ── STEP: SELECT (mode: free — no tiers) ── */}
                {step === "select" && !showTiers && (
                  <div className="flex flex-col gap-4">
                    <p style={{ fontSize: T.sm, color: T.mutedFg, lineHeight: 1.6 }}>
                      Điền thông tin bên dưới để nhận mã QR tham dự sự kiện qua email.
                    </p>
                    <button onClick={() => setStep("form")}
                      className="w-full py-3 rounded-xl"
                      style={{ backgroundColor: OG, color: "white", border: "none",
                        fontSize: T.sm, fontWeight: T.fw_semi, cursor: "pointer" }}>
                      {needsApproval ? "Gửi yêu cầu tham gia →" : "Tiếp tục đăng ký →"}
                    </button>
                    <p style={{ fontSize: T.xs, color: T.mutedFg, textAlign: "center" as const }}>
                      Bạn sẽ điền thông tin đăng ký ở bước tiếp theo.
                    </p>
                  </div>
                )}

                {/* ── STEP: FORM ── */}
                {step === "form" && (
                  <div className="flex flex-col gap-4">
                    {/* Selected ticket summary */}
                    {tier && (
                      <div className="rounded-xl p-3 flex items-center justify-between"
                        style={{ backgroundColor: `rgba(255,134,68,0.06)`, border: `1px solid rgba(255,134,68,0.2)` }}>
                        <span style={{ fontSize: T.sm, color: T.foreground }}>
                          Vé đã chọn: <strong>{tier.name}</strong>
                        </span>
                        <span style={{ fontSize: T.sm, fontWeight: T.fw_semi,
                          color: tier.price === 0 ? T.successText : T.foreground }}>
                          {tier.priceLabel}
                        </span>
                      </div>
                    )}

                    {/* Fields */}
                    {[
                      { id: "name",    label: "Họ và tên",          type: "text",  ph: "Nhập họ và tên",          val: name,    set: setName,    err: errors.name,    req: true },
                      { id: "email",   label: "Email",               type: "email", ph: "Nhập email",               val: email,   set: setEmail,   err: errors.email,   req: true },
                      { id: "phone",   label: "Số điện thoại",       type: "tel",   ph: "Nhập số điện thoại",       val: phone,   set: setPhone,   err: errors.phone,   req: true },
                      { id: "company", label: "Công ty / Tổ chức",   type: "text",  ph: "Nhập tên công ty hoặc tổ chức", val: company, set: setCompany, err: "",           req: false },
                      { id: "title",   label: "Chức danh",           type: "text",  ph: "Nhập chức danh",           val: title,   set: setTitle,   err: "",             req: false },
                    ].map((f) => (
                      <div key={f.id} className="flex flex-col gap-1.5">
                        <label style={{ fontSize: T.sm, fontWeight: T.fw_medium, color: T.foreground }}>
                          {f.label}{f.req && <span style={{ color: T.destructive }}> *</span>}
                        </label>
                        <input type={f.type} placeholder={f.ph} value={f.val}
                          onChange={(e) => f.set(e.target.value)}
                          className="w-full outline-none transition-all"
                          style={{ border: `1px solid ${f.err ? T.destructive : T.border}`,
                            borderRadius: "10px", padding: "10px 12px",
                            backgroundColor: T.background, fontSize: T.sm, color: T.foreground }} />
                        {f.err && <p style={{ fontSize: T.xs, color: T.destructive }}>{f.err}</p>}
                      </div>
                    ))}

                    <label className="flex items-start gap-2 cursor-pointer">
                      <Checkbox checked={agreed} onCheckedChange={(v) => setAgreed(!!v)} />
                      <span style={{ fontSize: T.xs, color: T.mutedFg, lineHeight: 1.5 }}>
                        Tôi đồng ý nhận email xác nhận và thông tin từ ban tổ chức.
                      </span>
                    </label>

                    <div className="flex gap-3">
                      <button onClick={() => setStep("select")}
                        className="flex-1 py-2.5 rounded-xl transition-all"
                        style={{ border: `1px solid ${T.border}`, backgroundColor: T.background,
                          fontSize: T.sm, fontWeight: T.fw_medium, color: T.mutedFg, cursor: "pointer" }}>
                        ← Quay lại chọn vé
                      </button>
                      <button onClick={handleSubmit} disabled={loading}
                        className="flex-1 py-2.5 rounded-xl transition-all"
                        style={{ backgroundColor: OG, color: "white", border: "none",
                          fontSize: T.sm, fontWeight: T.fw_semi, cursor: loading ? "not-allowed" : "pointer",
                          opacity: loading ? 0.7 : 1 }}>
                        {loading ? "Đang xử lý..." : "Hoàn tất đăng ký"}
                      </button>
                    </div>
                  </div>
                )}

                {/* ── STEP: PAYMENT ── */}
                {step === "payment" && (
                  <div className="flex flex-col gap-5">
                    {/* Ticket + amount summary */}
                    {tier && (
                      <div className="rounded-xl p-4 flex items-center justify-between"
                        style={{ backgroundColor: `rgba(255,134,68,0.06)`, border: `1px solid rgba(255,134,68,0.2)` }}>
                        <div>
                          <p style={{ fontSize: T.sm, fontWeight: T.fw_semi, color: T.foreground }}>{tier.name}</p>
                          <p style={{ fontSize: T.xs, color: T.mutedFg }}>1 vé · {name}</p>
                        </div>
                        <p style={{ fontSize: T.base, fontWeight: T.fw_bold, color: OG }}>{tier.priceLabel}</p>
                      </div>
                    )}

                    {/* Payment QR */}
                    <div className="flex flex-col items-center gap-3">
                      <p style={{ fontSize: T.xs, color: T.mutedFg, textAlign: "center" as const }}>
                        Quét mã QR bằng ứng dụng ngân hàng để thanh toán
                      </p>
                      <div className="rounded-2xl p-5 flex flex-col items-center gap-3"
                        style={{ backgroundColor: T.secondary, border: `1px solid ${T.border}`, width: "100%" }}>
                        {/* QR placeholder */}
                        <div className="rounded-xl flex items-center justify-center"
                          style={{ width: "180px", height: "180px", backgroundColor: T.background, border: `1px solid ${T.border}` }}>
                          <div className="flex flex-col items-center gap-2">
                            <QrCode className="size-16" style={{ color: T.foreground }} />
                            <div className="flex gap-1">
                              {Array.from({ length: 4 }).map((_, i) => (
                                <div key={i} className="size-1.5 rounded-full" style={{ backgroundColor: OG }} />
                              ))}
                            </div>
                          </div>
                        </div>
                        <div className="text-center">
                          <p style={{ fontSize: T.xs, color: T.mutedFg }}>Ngân hàng: <strong style={{ color: T.foreground }}>NetEvent Bank</strong></p>
                          <p style={{ fontSize: T.xs, color: T.mutedFg }}>Số tiền: <strong style={{ color: OG }}>{tier?.priceLabel}</strong></p>
                          <p style={{ fontSize: T.xs, color: T.mutedFg }}>Nội dung: <strong style={{ color: T.foreground }}>{ticketCode}</strong></p>
                        </div>
                      </div>
                      <p style={{ fontSize: T.xs, color: T.mutedFg, textAlign: "center" as const, lineHeight: 1.5 }}>
                        Mã QR có hiệu lực trong <strong style={{ color: OG }}>15 phút</strong>. Vé sẽ được gửi qua email sau khi thanh toán thành công.
                      </p>
                    </div>

                    {/* Waiting indicator */}
                    <div className="flex items-center justify-center gap-2 py-1"
                      style={{ color: T.mutedFg }}>
                      <div className="size-2 rounded-full animate-pulse" style={{ backgroundColor: OG }} />
                      <span style={{ fontSize: T.xs }}>Đang chờ xác nhận thanh toán từ ngân hàng...</span>
                    </div>

                    {/* Back only */}
                    <button onClick={() => setStep("form")}
                      className="w-full py-2.5 rounded-xl"
                      style={{ border: `1px solid ${T.border}`, backgroundColor: T.background,
                        fontSize: T.sm, fontWeight: T.fw_medium, color: T.mutedFg, cursor: "pointer" }}>
                      ← Quay lại
                    </button>
                  </div>
                )}

                {/* ── STEP: SUCCESS ── */}
                {step === "success" && (
                  <div className="flex flex-col gap-5">
                    <div className="flex items-center gap-3">
                      <div className="size-12 rounded-full flex items-center justify-center shrink-0"
                        style={{ backgroundColor: T.successSubtle, border: `2px solid ${T.successBorder}` }}>
                        <CheckCircle2 className="size-6" style={{ color: T.successText }} />
                      </div>
                      <div>
                        <p style={{ fontSize: T.sm, fontWeight: T.fw_semi, color: T.foreground }}>
                          Xin chào <strong>{name}</strong>!
                        </p>
                        <p style={{ fontSize: T.xs, color: T.mutedFg }}>{needsApproval ? "Yêu cầu tham gia của bạn đã được gửi tới ban tổ chức." : "Vé của bạn đã được tạo thành công."}</p>
                      </div>
                    </div>

                    {/* Ticket card — chưa có vé khi còn chờ duyệt */}
                    {!needsApproval && (<>
                    {/* Ticket card */}
                    <div className="rounded-2xl overflow-hidden" style={{ border: `2px solid ${OG}` }}>
                      <div className="flex items-center justify-between px-5 py-3"
                        style={{ backgroundColor: OG }}>
                        <span style={{ color: "white", fontSize: T.sm, fontWeight: T.fw_semi }}>{eventName}</span>
                        <span style={{ color: "rgba(255,255,255,0.85)", fontSize: T.xs }}>{tier?.name}</span>
                      </div>
                      <div className="p-5 flex gap-5 items-start" style={{ backgroundColor: T.background }}>
                        <div className="size-28 rounded-xl flex items-center justify-center shrink-0"
                          style={{ backgroundColor: T.secondary, border: `1px solid ${T.border}` }}>
                          <div className="flex flex-col items-center gap-1.5">
                            <QrCode className="size-10" style={{ color: T.foreground }} />
                            <div className="flex gap-0.5">
                              {Array.from({ length: 3 }).map((_, i) => (
                                <div key={i} className="size-1.5 rounded-full" style={{ backgroundColor: OG }} />
                              ))}
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col gap-2 flex-1 min-w-0">
                          {[
                            { label: "Hạng vé", value: tier?.name },
                            { label: "Mã vé",   value: ticketCode, mono: true },
                            { label: "Người tham dự", value: name },
                            { label: "Email",   value: email },
                          ].map((r) => (
                            <div key={r.label}>
                              <p style={{ fontSize: T.xs, color: T.mutedFg }}>{r.label}</p>
                              <p style={{ fontSize: T.xs, fontWeight: T.fw_semi, color: T.foreground,
                                fontFamily: r.mono ? "monospace" : undefined }}>{r.value}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div style={{ borderTop: `2px dashed ${T.border}`, margin: "0 16px" }} />
                      <div className="px-5 py-3" style={{ backgroundColor: T.background }}>
                        <p style={{ fontSize: T.xs, color: T.mutedFg, textAlign: "center" as const }}>
                          {ticketLine}
                        </p>
                      </div>
                    </div>
                    </>)}

                    {/* Email note */}
                    <div className="rounded-xl p-3 flex items-start gap-2.5"
                      style={{ backgroundColor: T.successSubtle, border: `1px solid ${T.successBorder}` }}>
                      <Mail className="size-4 shrink-0 mt-0.5" style={{ color: T.successText }} />
                      <p style={{ fontSize: T.xs, color: T.successText, lineHeight: 1.6 }}>
                        {needsApproval ? <>Khi được duyệt, vé QR sẽ được gửi tới <strong>{email}</strong>.</> : <>Vé QR đã được gửi đến <strong>{email}</strong>. Vui lòng kiểm tra hộp thư đến hoặc spam.</>}
                      </p>
                    </div>

                    {/* Actions — tải vé chỉ có khi đã có vé */}
                    {!needsApproval && (<>
                    {/* Actions */}
                    <div className="flex gap-2 flex-wrap">
                      <button onClick={() => {
                        const a = document.createElement("a");
                        a.href = "data:text/plain," + encodeURIComponent(`Mã vé: ${ticketCode}\nSự kiện: ${eventName}\nHọ tên: ${name}\nEmail: ${email}`);
                        a.download = `${ticketCode}.txt`;
                        a.click();
                      }} style={{ flex: 1, padding: "8px 0", borderRadius: "10px", fontSize: T.sm,
                        fontWeight: T.fw_medium, backgroundColor: OG, color: "white", border: "none", cursor: "pointer" }}>
                        Tải vé QR
                      </button>
                      <button style={{ flex: 1, padding: "8px 0", borderRadius: "10px", fontSize: T.sm,
                        fontWeight: T.fw_medium, backgroundColor: T.background, color: T.foreground,
                        border: `1px solid ${T.border}`, cursor: "pointer" }}>
                        Thêm vào lịch
                      </button>
                    </div>
                    </>)}
                  </div>
                )}

              </div>
            </div>

            {/* ── Giới thiệu sự kiện — ẩn khi sự kiện chưa có mô tả ── */}
            {(isDemo || aboutText) && (
            <div style={{ paddingTop: "8px", borderTop: `1px solid ${T.border}` }}>
              <h2 style={{ fontSize: T.lg, fontWeight: T.fw_semi, color: T.foreground, marginBottom: "12px" }}>
                Giới thiệu sự kiện
              </h2>
              <p style={{ fontSize: T.sm, color: T.mutedFg, lineHeight: 1.8, marginBottom: isDemo ? "16px" : 0, whiteSpace: "pre-line" }}>
                {isDemo
                  ? "NetEvent Demo Conference 2026 là sự kiện dành cho các đội ngũ tổ chức sự kiện, marketing, vận hành và công nghệ. Chương trình tập trung vào cách xây dựng trải nghiệm sự kiện hiệu quả, quản lý đăng ký, phát hành vé QR và tối ưu quy trình check-in."
                  : aboutText}
              </p>
              {isDemo && (
              <div className="flex flex-col gap-2.5">
                {[
                  "Xu hướng tổ chức sự kiện hiện đại",
                  "Tối ưu quy trình đăng ký và check-in",
                  "Kết nối cộng đồng làm sản phẩm và marketing",
                  "Ứng dụng công nghệ trong vận hành sự kiện",
                ].map((b) => (
                  <div key={b} className="flex items-start gap-2.5">
                    <div className="size-1.5 rounded-full mt-2 shrink-0" style={{ backgroundColor: OG }} />
                    <span style={{ fontSize: T.sm, color: T.foreground }}>{b}</span>
                  </div>
                ))}
              </div>
              )}
            </div>
            )}

            {/* ── Địa điểm — ẩn với sự kiện trực tuyến hoặc chưa có địa điểm ── */}
            {showLocation && (
            <div style={{ paddingTop: "8px", borderTop: `1px solid ${T.border}` }}>
              <h2 style={{ fontSize: T.lg, fontWeight: T.fw_semi, color: T.foreground, marginBottom: "12px" }}>
                Địa điểm
              </h2>
              <p style={{ fontSize: T.sm, fontWeight: T.fw_medium, color: T.foreground }}>
                {locTitle}
              </p>
              <p style={{ fontSize: T.sm, color: T.mutedFg, marginTop: "2px", marginBottom: "16px" }}>
                {locAddress}
              </p>
              <div className="rounded-2xl overflow-hidden relative flex items-center justify-center"
                style={{ height: "200px", backgroundColor: T.secondary, border: `1px solid ${T.border}` }}>
                <div style={{ position: "absolute", inset: 0, opacity: 0.35 }}>
                  {Array.from({ length: 8 }).map((_, i) => (
                    <div key={`h-${i}`} style={{ position: "absolute", top: `${(i + 1) * 12.5}%`, left: 0, right: 0, height: "1px", backgroundColor: T.border }} />
                  ))}
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={`v-${i}`} style={{ position: "absolute", left: `${(i + 1) * 16.6}%`, top: 0, bottom: 0, width: "1px", backgroundColor: T.border }} />
                  ))}
                </div>
                <div className="flex flex-col items-center gap-2 relative z-10">
                  <div className="size-10 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: OG, boxShadow: "0 4px 12px rgba(255,134,68,0.4)" }}>
                    <MapPin className="size-5" style={{ color: "white" }} />
                  </div>
                  <div className="px-3 py-1.5 rounded-xl" style={{ backgroundColor: T.background, border: `1px solid ${T.border}` }}>
                    <p style={{ fontSize: T.xs, fontWeight: T.fw_medium, color: T.foreground }}>{mapLabel}</p>
                  </div>
                </div>
              </div>
              <button style={{ marginTop: "12px", display: "inline-flex", alignItems: "center", gap: "6px",
                padding: "8px 16px", borderRadius: "10px", fontSize: T.sm, fontWeight: T.fw_medium,
                backgroundColor: T.background, color: T.foreground, border: `1px solid ${T.border}`, cursor: "pointer" }}>
                <MapPin className="size-4" /> Xem chỉ đường
              </button>
            </div>
            )}

          </div>
        </div>
      </div>

      {/* ── Footer ── */}
      <div style={{ borderTop: `1px solid ${T.border}`, backgroundColor: T.background }}>
        <div className="mx-auto px-4 lg:px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-3" style={{ maxWidth: "1160px" }}>
          <p style={{ fontSize: T.xs, color: T.mutedFg }}>Powered by <strong style={{ color: T.foreground }}>NetEvent</strong></p>
          <div className="flex gap-5">
            {["Điều khoản", "Chính sách bảo mật", "Liên hệ"].map((l) => (
              <button key={l} style={{ fontSize: T.xs, color: T.mutedFg }}>{l}</button>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
}

// ── Landing Page Tab (main export) ────────────────────────────────────────────

export function LandingPageTab({ event, initialView }: { event: EventDraft; initialView?: LPView }) {
  const [view, setView]       = useState<LPView>(initialView ?? "editor");
  const [settings, setSettings] = useState<LandingSettings>(DEFAULT_SETTINGS);

  if (view === "empty") {
    return null;
  }

  const isPreview = view === "preview";

  return (
    <div className="flex flex-col h-full min-h-0">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-1 pb-4">
        <div className="flex items-center gap-2 min-w-0">
          <div className="flex items-center gap-1.5 shrink-0">
            <div className="size-2 rounded-full" style={{ backgroundColor: "var(--warning-text)" }} />
            <span style={{ fontSize: T.xs, fontWeight: T.fw_medium, color: "var(--warning-text)" }}>Bản nháp</span>
          </div>
          <span style={{ fontSize: T.xs, color: T.mutedFg }}>·</span>
          <span className="truncate" style={{ fontSize: T.xs, color: T.mutedFg, minWidth: 0 }}>
            netevent.vn/e/{(event.name || "su-kien").toLowerCase().replace(/\s+/g, "-").slice(0, 24)}
          </span>
          <button
            onClick={() => navigator.clipboard?.writeText(`https://netevent.vn/e/${(event.name || "su-kien").toLowerCase().replace(/\s+/g, "-").slice(0, 24)}`).catch(() => {})}
            className="shrink-0 flex items-center justify-center rounded-md transition-all hover:opacity-70"
            style={{ padding: "2px", background: "none", border: "none", cursor: "pointer", color: T.mutedFg }}
            title="Sao chép đường link">
            <Copy className="size-3" />
          </button>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex rounded-lg overflow-hidden p-0.5" style={{ backgroundColor: T.secondary, border: `1px solid ${T.border}` }}>
            {([
              { id: "editor"  as LPView, label: "Tùy chỉnh",  icon: Settings },
              { id: "preview" as LPView, label: "Xem trước", icon: Eye },
            ]).map(({ id, label, icon: Icon }) => (
              <button key={id} onClick={() => setView(id)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-all cursor-pointer"
                style={{ fontSize: T.xs, fontWeight: view === id ? T.fw_semi : T.fw_normal,
                  backgroundColor: view === id ? T.background : "transparent",
                  color: view === id ? T.foreground : T.mutedFg,
                  boxShadow: view === id ? "0 1px 3px rgba(0,0,0,0.08)" : "none" }}>
                <Icon className="size-3.5" /> {label}
              </button>
            ))}
          </div>
          <Button size="sm" variant="ghost" onClick={() => setView("empty")} style={{ fontSize: T.xs, color: T.mutedFg }}>
            <X className="size-3.5" /> Xóa
          </Button>
          <Button size="sm">Lưu</Button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 min-h-0 overflow-hidden">
        {isPreview ? (
          <div className="h-full rounded-2xl overflow-auto" style={{ border: `1px solid ${T.border}`, backgroundColor: "#f8faff" }}>
            <DemoPublicLandingPage />
          </div>
        ) : (
          <LandingPageEditor event={event} settings={settings} onSettingsChange={setSettings} />
        )}
      </div>
    </div>
  );
}

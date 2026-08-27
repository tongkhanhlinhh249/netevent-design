import * as React from "react";
import { useState } from "react";
import {
  Plus, Ticket, AlertCircle, CheckCircle2, Edit2, Trash2,
  MoreHorizontal, Eye, EyeOff, Info, ChevronDown
} from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter, SheetClose } from "../ui/sheet";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";

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

type TierStatus = "open" | "closed" | "sold-out" | "draft";
type TierType   = "free" | "paid";
type KhoVeStatus = "active" | "draft";
type KVView = "empty" | "detail";

interface KhoVe {
  id: string; name: string; description: string;
  status: KhoVeStatus; note: string;
}

interface TicketTier {
  id: string; name: string; description: string; benefits: string;
  type: TierType; price: number; quantity: number; issued: number;
  perPerson: number; showOnLanding: boolean; status: TierStatus;
}

interface EventDraft { id: string; name: string; [k: string]: any; }

// ── Mock tiers ─────────────────────────────────────────────────────────────────

const MOCK_TIERS: TicketTier[] = [
  { id: "t1", name: "Standard",   description: "Vé tham dự cơ bản",                        benefits: "",      type: "free", price: 0,      quantity: 300, issued: 180, perPerson: 1, showOnLanding: true,  status: "open"     },
  { id: "t2", name: "VIP",        description: "Quyền lợi ưu tiên, khu vực check-in riêng", benefits: "",      type: "paid", price: 499000, quantity: 100, issued: 72,  perPerson: 1, showOnLanding: true,  status: "open"     },
  { id: "t3", name: "Early Bird", description: "Ưu đãi cho người đăng ký sớm",             benefits: "",      type: "paid", price: 299000, quantity: 150, issued: 150, perPerson: 1, showOnLanding: true,  status: "sold-out" },
  { id: "t4", name: "Guest",      description: "Vé khách mời nội bộ",                      benefits: "",      type: "free", price: 0,      quantity: 50,  issued: 0,   perPerson: 1, showOnLanding: false, status: "draft"    },
];

// ── Helpers ────────────────────────────────────────────────────────────────────

function formatPrice(price: number) {
  return price === 0 ? "0đ" : price.toLocaleString("vi-VN") + "đ";
}

// ── Status badge ───────────────────────────────────────────────────────────────

const TIER_STATUS_CFG: Record<TierStatus, { label: string; bg: string; color: string; border: string }> = {
  open:      { label: "Đang mở",   bg: T.successSubtle, color: T.successText,  border: T.successBorder },
  closed:    { label: "Tạm đóng",  bg: T.warningSubtle, color: T.warningText,  border: T.warningText   },
  "sold-out":{ label: "Hết vé",    bg: "rgba(248,104,128,0.10)", color: "#f86880", border: "rgba(248,104,128,0.30)" },
  draft:     { label: "Lưu nháp",  bg: T.secondary,     color: T.mutedFg,      border: T.border        },
};

function TierStatusBadge({ status }: { status: TierStatus }) {
  const c = TIER_STATUS_CFG[status];
  return (
    <span style={{
      backgroundColor: c.bg, color: c.color, border: `1px solid ${c.border}`,
      fontSize: T.xs, fontWeight: T.fw_medium,
      padding: "2px 8px", borderRadius: "999px", whiteSpace: "nowrap" as const,
      display: "inline-flex", alignItems: "center",
    }}>{c.label}</span>
  );
}

const KV_STATUS_CFG: Record<KhoVeStatus, { label: string; bg: string; color: string; border: string }> = {
  active: { label: "Đang hoạt động", bg: T.successSubtle, color: T.successText, border: T.successBorder },
  draft:  { label: "Lưu nháp",       bg: T.secondary,     color: T.mutedFg,     border: T.border        },
};

function KVStatusBadge({ status }: { status: KhoVeStatus }) {
  const c = KV_STATUS_CFG[status];
  return (
    <span style={{
      backgroundColor: c.bg, color: c.color, border: `1px solid ${c.border}`,
      fontSize: T.xs, fontWeight: T.fw_medium,
      padding: "2px 8px", borderRadius: "999px", display: "inline-flex", alignItems: "center",
    }}>{c.label}</span>
  );
}

// ── Radio card ─────────────────────────────────────────────────────────────────

function RadioCard({ selected, onClick, label, sub }: { selected: boolean; onClick: () => void; label: string; sub: string }) {
  return (
    <button onClick={onClick}
      className="w-full text-left p-3 rounded-xl transition-all cursor-pointer"
      style={{
        border: selected ? `2px solid ${T.primary}` : `1px solid ${T.border}`,
        backgroundColor: selected ? `rgba(30,170,255,0.04)` : T.background,
      }}>
      <div className="flex items-center gap-2">
        <div className="size-4 rounded-full border-2 flex items-center justify-center shrink-0"
          style={{ borderColor: selected ? T.primary : T.border }}>
          {selected && <div className="size-2 rounded-full" style={{ backgroundColor: T.primary }} />}
        </div>
        <p style={{ fontSize: T.sm, fontWeight: T.fw_medium, color: T.foreground }}>{label}</p>
      </div>
      <p style={{ fontSize: T.xs, color: T.mutedFg, marginTop: "4px", paddingLeft: "24px" }}>{sub}</p>
    </button>
  );
}

// ── Toggle ─────────────────────────────────────────────────────────────────────

function Toggle({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
  return (
    <button onClick={() => onChange(!value)}
      style={{
        width: "36px", height: "20px", borderRadius: "999px", border: "none", cursor: "pointer",
        backgroundColor: value ? T.primary : T.border, transition: "background-color 0.2s", position: "relative",
      }}>
      <span style={{
        position: "absolute", top: "2px", left: value ? "18px" : "2px",
        width: "16px", height: "16px", borderRadius: "50%", backgroundColor: "white",
        transition: "left 0.2s", boxShadow: "0 1px 2px rgba(0,0,0,0.2)",
      }} />
    </button>
  );
}

// ── Info box ───────────────────────────────────────────────────────────────────

function InfoBox({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-2 p-3 rounded-xl"
      style={{ backgroundColor: `rgba(30,170,255,0.06)`, border: `1px solid rgba(30,170,255,0.2)` }}>
      <Info className="size-3.5 shrink-0 mt-0.5" style={{ color: T.primary }} />
      <p style={{ fontSize: T.xs, color: T.mutedFg, lineHeight: 1.6 }}>{children}</p>
    </div>
  );
}

// ── Create Kho Vé Drawer ───────────────────────────────────────────────────────

function CreateKhoVeDrawer({
  open, onClose, onCreated, eventName,
}: {
  open: boolean; onClose: () => void;
  onCreated: (kv: KhoVe) => void; eventName: string;
}) {
  const [name, setName]         = useState(`Kho vé - ${eventName}`);
  const [description, setDesc]  = useState("");
  const [note, setNote]         = useState("");
  const [status, setStatus]     = useState<KhoVeStatus>("active");
  const [loading, setLoading]   = useState(false);

  const handleCreate = () => {
    if (!name.trim()) return;
    setLoading(true);
    setTimeout(() => {
      onCreated({ id: Date.now().toString(), name, description, status, note });
      setLoading(false);
    }, 600);
  };

  return (
    <Sheet open={open} onOpenChange={(o) => !o && onClose()}>
      <SheetContent side="right" className="w-[480px] overflow-y-auto p-0">
        <SheetHeader className="px-6 py-5" style={{ borderBottom: `1px solid ${T.border}` }}>
          <SheetTitle>Tạo kho vé</SheetTitle>
          <p style={{ fontSize: T.sm, color: T.mutedFg }}>Kho vé sẽ được gắn với sự kiện đang chọn.</p>
        </SheetHeader>

        <div className="flex flex-col gap-5 p-6">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="kv-name">Tên kho vé <span style={{ color: T.destructive }}>*</span></Label>
            <Input id="kv-name" value={name} onChange={(e) => setName(e.target.value)} />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label>Sự kiện liên kết</Label>
            <div className="px-3 py-2 rounded-xl"
              style={{ backgroundColor: T.secondary, border: `1px solid ${T.border}`, fontSize: T.sm, color: T.mutedFg }}>
              {eventName}
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="kv-desc">Mô tả kho vé <span style={{ color: T.mutedFg, fontWeight: T.fw_normal }}>(tuỳ chọn)</span></Label>
            <Textarea id="kv-desc" rows={3} placeholder="Mô tả ngắn về kho vé..."
              value={description} onChange={(e) => setDesc(e.target.value)} />
          </div>

          <div className="flex flex-col gap-2">
            <Label>Trạng thái kho vé</Label>
            <div className="flex flex-col gap-2">
              <RadioCard selected={status === "draft"} onClick={() => setStatus("draft")}
                label="Lưu nháp" sub="Chưa kích hoạt — hạng vé sẽ không hiển thị trên Landing Page." />
              <RadioCard selected={status === "active"} onClick={() => setStatus("active")}
                label="Kích hoạt ngay" sub="Có thể hiển thị các hạng vé đang mở trên Landing Page." />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="kv-note">Ghi chú nội bộ <span style={{ color: T.mutedFg, fontWeight: T.fw_normal }}>(tuỳ chọn)</span></Label>
            <Textarea id="kv-note" rows={2} placeholder="Ghi chú nội bộ, không hiển thị với người tham dự..."
              value={note} onChange={(e) => setNote(e.target.value)} />
          </div>

          <InfoBox>
            Tạo kho vé không trừ quota vé. Quota chỉ được tính khi vé được phát hành thật cho người tham dự.
          </InfoBox>
        </div>

        <SheetFooter className="px-6 py-4 gap-2" style={{ borderTop: `1px solid ${T.border}` }}>
          <SheetClose asChild><Button variant="outline">Hủy</Button></SheetClose>
          <Button disabled={!name.trim() || loading} onClick={handleCreate}>
            {loading ? "Đang tạo..." : "Tạo kho vé"}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

// ── Ticket Tier Form (shared by Add + Edit) ────────────────────────────────────

interface TierFormState {
  name: string; description: string; benefits: string;
  type: TierType; price: string; quantity: string;
  perPerson: string; showOnLanding: boolean; status: "draft" | "open";
}

const EMPTY_TIER_FORM: TierFormState = {
  name: "", description: "", benefits: "", type: "free",
  price: "", quantity: "", perPerson: "1", showOnLanding: true, status: "open",
};

function tierFormToTierForm(tier: TicketTier): TierFormState {
  return {
    name: tier.name, description: tier.description, benefits: tier.benefits,
    type: tier.type, price: tier.price.toString(), quantity: tier.quantity.toString(),
    perPerson: tier.perPerson.toString(), showOnLanding: tier.showOnLanding,
    status: tier.status === "draft" ? "draft" : "open",
  };
}

// Landing page preview of the tier
function TierLandingPreview({ form }: { form: TierFormState }) {
  const isFree    = form.type === "free";
  const qty       = parseInt(form.quantity) || 0;
  const price     = parseInt(form.price) || 0;
  const soldOut   = qty === 0;

  return (
    <div className="rounded-xl p-4" style={{ backgroundColor: T.secondary, border: `1px solid ${T.border}` }}>
      <p style={{ fontSize: T.xs, fontWeight: T.fw_semi, color: T.mutedFg, marginBottom: "10px",
        textTransform: "uppercase", letterSpacing: "0.05em" }}>
        Preview trên Landing Page
      </p>
      <div className="rounded-xl p-4 flex items-start justify-between gap-3"
        style={{ backgroundColor: T.background, border: `1px solid ${T.border}` }}>
        <div>
          <p style={{ fontSize: T.sm, fontWeight: T.fw_semi, color: T.foreground }}>
            {form.name || "Tên hạng vé"}
          </p>
          {isFree
            ? <span style={{ fontSize: T.xs, backgroundColor: T.successSubtle, color: T.successText,
                border: `1px solid ${T.successBorder}`, padding: "1px 6px", borderRadius: "999px", display: "inline-block", marginTop: "4px" }}>
                Miễn phí
              </span>
            : <p style={{ fontSize: T.sm, fontWeight: T.fw_semi, color: T.primary, marginTop: "4px" }}>
                {price > 0 ? price.toLocaleString("vi-VN") + "đ" : "—"}
              </p>}
          <p style={{ fontSize: T.xs, color: T.mutedFg, marginTop: "4px" }}>
            {qty > 0 ? `Còn ${qty} vé` : "Hết vé"}
          </p>
        </div>
        <Button size="sm" disabled={soldOut} variant={soldOut ? "outline" : "default"}>
          {soldOut ? "Hết vé" : "Chọn vé"}
        </Button>
      </div>
    </div>
  );
}

function TierDrawer({
  open, onClose, onSave,
  initialData, isEdit, hasIssued,
}: {
  open: boolean; onClose: () => void;
  onSave: (tier: Partial<TicketTier>) => void;
  initialData?: TicketTier; isEdit?: boolean; hasIssued?: boolean;
}) {
  const [form, setForm] = useState<TierFormState>(
    initialData ? tierFormToTierForm(initialData) : EMPTY_TIER_FORM
  );
  const [loading, setLoading] = useState(false);

  // Reset when drawer opens
  React.useEffect(() => {
    if (open) setForm(initialData ? tierFormToTierForm(initialData) : EMPTY_TIER_FORM);
  }, [open]);

  const set = <K extends keyof TierFormState>(k: K, v: TierFormState[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  const handleSave = () => {
    if (!form.name.trim()) return;
    setLoading(true);
    setTimeout(() => {
      onSave({
        name: form.name, description: form.description, benefits: form.benefits,
        type: form.type, price: form.type === "free" ? 0 : parseInt(form.price) || 0,
        quantity: parseInt(form.quantity) || 0, issued: initialData?.issued ?? 0,
        perPerson: parseInt(form.perPerson) || 1, showOnLanding: form.showOnLanding,
        status: form.status === "draft" ? "draft" : "open",
      });
      setLoading(false);
    }, 600);
  };

  return (
    <Sheet open={open} onOpenChange={(o) => !o && onClose()}>
      <SheetContent side="right" className="w-[500px] overflow-y-auto p-0">
        <SheetHeader className="px-6 py-5" style={{ borderBottom: `1px solid ${T.border}` }}>
          <SheetTitle>{isEdit ? "Chỉnh sửa hạng vé" : "Thêm hạng vé"}</SheetTitle>
          <p style={{ fontSize: T.sm, color: T.mutedFg }}>
            Thiết lập giá, số lượng và trạng thái cho hạng vé.
          </p>
        </SheetHeader>

        <div className="flex flex-col gap-5 p-6">
          {/* Edit warning */}
          {isEdit && hasIssued && (
            <div className="flex items-start gap-2 p-3 rounded-xl"
              style={{ backgroundColor: T.warningSubtle, border: `1px solid ${T.warningText}` }}>
              <AlertCircle className="size-4 shrink-0 mt-0.5" style={{ color: T.warningText }} />
              <p style={{ fontSize: T.xs, color: T.warningText, lineHeight: 1.6 }}>
                Hạng vé này đã có vé được phát hành. Một số thay đổi có thể ảnh hưởng đến người tham dự mới.
              </p>
            </div>
          )}

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="tier-name">Tên hạng vé <span style={{ color: T.destructive }}>*</span></Label>
            <Input id="tier-name" placeholder="Ví dụ: Standard, VIP, Early Bird"
              value={form.name} onChange={(e) => set("name", e.target.value)} />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="tier-desc">Mô tả hạng vé</Label>
            <Textarea id="tier-desc" rows={2} placeholder="Mô tả ngắn về hạng vé..."
              value={form.description} onChange={(e) => set("description", e.target.value)} />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="tier-benefits">Quyền lợi vé</Label>
            <Textarea id="tier-benefits" rows={2} placeholder="Các quyền lợi đặc biệt..."
              value={form.benefits} onChange={(e) => set("benefits", e.target.value)} />
          </div>

          {/* Loại vé - segmented */}
          <div className="flex flex-col gap-1.5">
            <Label>Loại vé</Label>
            <div className="flex rounded-xl overflow-hidden" style={{ border: `1px solid ${T.border}` }}>
              {(["free", "paid"] as TierType[]).map((t, i) => (
                <button key={t} onClick={() => set("type", t)}
                  className="flex-1 py-2 transition-colors cursor-pointer"
                  style={{
                    fontSize: T.sm, fontWeight: form.type === t ? T.fw_semi : T.fw_normal,
                    backgroundColor: form.type === t ? T.primary : T.background,
                    color: form.type === t ? T.primaryFg : T.mutedFg,
                    borderRight: i === 0 ? `1px solid ${T.border}` : "none",
                  }}>
                  {t === "free" ? "Miễn phí" : "Trả phí"}
                </button>
              ))}
            </div>
          </div>

          {/* Price — only for paid */}
          {form.type === "paid" && (
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="tier-price">Giá vé (đ) <span style={{ color: T.destructive }}>*</span></Label>
              <Input id="tier-price" type="number" placeholder="499000"
                value={form.price} onChange={(e) => set("price", e.target.value)} />
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="tier-qty">Số lượng vé <span style={{ color: T.destructive }}>*</span></Label>
              <Input id="tier-qty" type="number" placeholder="300"
                value={form.quantity} onChange={(e) => set("quantity", e.target.value)} />
              {isEdit && hasIssued && initialData && (
                <p style={{ fontSize: T.xs, color: T.mutedFg }}>
                  Đã phát hành: {initialData.issued} vé
                </p>
              )}
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="tier-per">Giới hạn mỗi người</Label>
              <Input id="tier-per" type="number" placeholder="1"
                value={form.perPerson} onChange={(e) => set("perPerson", e.target.value)} />
            </div>
          </div>

          <div className="flex items-center justify-between py-3"
            style={{ borderTop: `1px solid ${T.border}`, borderBottom: `1px solid ${T.border}` }}>
            <div>
              <p style={{ fontSize: T.sm, fontWeight: T.fw_medium, color: T.foreground }}>
                Hiển thị trên Landing Page
              </p>
              <p style={{ fontSize: T.xs, color: T.mutedFg }}>
                Hạng vé sẽ xuất hiện trong phần chọn vé trên trang đăng ký.
              </p>
            </div>
            <Toggle value={form.showOnLanding} onChange={(v) => set("showOnLanding", v)} />
          </div>

          <div className="flex flex-col gap-2">
            <Label>Trạng thái</Label>
            <div className="flex flex-col gap-2">
              <RadioCard selected={form.status === "draft"} onClick={() => set("status", "draft")}
                label="Lưu nháp" sub="Chưa mở đăng ký." />
              <RadioCard selected={form.status === "open"} onClick={() => set("status", "open")}
                label="Mở đăng ký ngay" sub="Người tham dự có thể chọn hạng vé này." />
            </div>
          </div>

          {/* Landing preview */}
          {form.showOnLanding && <TierLandingPreview form={form} />}

          <InfoBox>
            Tạo hạng vé không trừ quota. Quota vé chỉ tính khi vé được phát hành thật cho người tham dự.
          </InfoBox>
        </div>

        <SheetFooter className="px-6 py-4 gap-2" style={{ borderTop: `1px solid ${T.border}` }}>
          <SheetClose asChild><Button variant="outline">Hủy</Button></SheetClose>
          <Button disabled={!form.name.trim() || loading} onClick={handleSave}>
            {loading ? "Đang lưu..." : isEdit ? "Lưu thay đổi" : "Lưu hạng vé"}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

// ── Kho Vé Summary Cards ───────────────────────────────────────────────────────

function KVSummary({ tiers }: { tiers: TicketTier[] }) {
  const totalQty    = tiers.reduce((s, t) => s + t.quantity, 0);
  const totalIssued = tiers.reduce((s, t) => s + t.issued, 0);
  const remaining   = totalQty - totalIssued;
  const QUOTA_TOTAL = 1000;

  const stats = [
    { label: "Số hạng vé",        value: String(tiers.length),                color: T.foreground  },
    { label: "Tổng sức chứa",     value: `${totalQty.toLocaleString()} vé`,   color: T.primary     },
    { label: "Đã phát hành",      value: `${totalIssued.toLocaleString()} vé`,color: T.warningText },
    { label: "Còn lại trong kho", value: `${remaining.toLocaleString()} vé`,  color: T.successText },
  ];

  return (
    <div className="flex flex-col gap-4">
      {/* Summary stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {stats.map((s) => (
          <div key={s.label} className="rounded-xl p-4"
            style={{ backgroundColor: T.background, border: `1px solid ${T.border}` }}>
            <p style={{ fontSize: T.xs, color: T.mutedFg, marginBottom: "4px" }}>{s.label}</p>
            <p style={{ fontSize: T.xl, fontWeight: T.fw_semi, color: s.color }}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Per-tier breakdown */}
      {tiers.length > 0 && (
        <div className="rounded-xl overflow-hidden" style={{ border: `1px solid ${T.border}` }}>
          <div className="px-4 py-3" style={{ backgroundColor: T.secondary, borderBottom: `1px solid ${T.border}` }}>
            <p style={{ fontSize: T.xs, fontWeight: T.fw_semi, color: T.mutedFg }}>Chi tiết theo hạng vé</p>
          </div>
          {tiers.map((tier, i) => {
            const rem = tier.quantity - tier.issued;
            const pct = tier.quantity > 0 ? Math.round((tier.issued / tier.quantity) * 100) : 0;
            return (
              <div key={tier.id} className="flex items-center gap-4 px-4 py-3"
                style={{ borderBottom: i < tiers.length - 1 ? `1px solid ${T.border}` : "none", backgroundColor: T.background }}>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span style={{ fontSize: T.sm, fontWeight: T.fw_medium, color: T.foreground }}>{tier.name}</span>
                    <TierStatusBadge status={tier.status} />
                    <span style={{ fontSize: T.xs, color: tier.type === "free" ? T.successText : T.primary }}>
                      {tier.type === "free" ? "Miễn phí" : `${tier.price.toLocaleString("vi-VN")}đ`}
                    </span>
                  </div>
                  {/* Progress bar */}
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: T.secondary }}>
                      <div className="h-full rounded-full transition-all"
                        style={{ width: `${pct}%`, backgroundColor: pct >= 90 ? T.warningText : T.primary }} />
                    </div>
                    <span style={{ fontSize: T.xs, color: T.mutedFg, whiteSpace: "nowrap" as const }}>
                      {pct}%
                    </span>
                  </div>
                </div>
                <div className="flex gap-6 shrink-0">
                  {[
                    { label: "Tổng", value: tier.quantity },
                    { label: "Đã phát", value: tier.issued, color: T.primary },
                    { label: "Còn lại", value: rem, color: rem === 0 ? T.destructive : T.successText },
                  ].map((col) => (
                    <div key={col.label} className="text-center">
                      <p style={{ fontSize: T.xs, color: T.mutedFg }}>{col.label}</p>
                      <p style={{ fontSize: T.sm, fontWeight: T.fw_semi, color: col.color || T.foreground }}>{col.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ── Kho Vé Detail (with or without tiers) ─────────────────────────────────────

function KhoVeDetail({
  khoVe, event, onAddTier, onEditKV,
}: {
  khoVe: KhoVe; event: EventDraft;
  onAddTier: () => void; onEditKV: () => void;
}) {
  const [tiers, setTiers]           = useState<TicketTier[]>(MOCK_TIERS);
  const [addOpen, setAddOpen]       = useState(false);
  const [editTier, setEditTier]     = useState<TicketTier | null>(null);
  const hasTiers = tiers.length > 0;

  const handleSaveTier = (data: Partial<TicketTier>) => {
    if (editTier) {
      setTiers((prev) => prev.map((t) => t.id === editTier.id ? { ...t, ...data } : t));
    } else {
      setTiers((prev) => [...prev, { id: Date.now().toString(), issued: 0, ...data } as TicketTier]);
    }
    setAddOpen(false);
    setEditTier(null);
  };

  const handleDelete = (id: string) => setTiers((prev) => prev.filter((t) => t.id !== id));

  return (
    <div className="flex flex-col gap-6">
      {/* Kho vé header card */}
      <div className="rounded-2xl p-5"
        style={{ backgroundColor: T.background, border: `1px solid ${T.border}` }}>
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <h3 style={{ fontSize: T.lg, fontWeight: T.fw_semi, color: T.foreground }}>{khoVe.name}</h3>
              <KVStatusBadge status={khoVe.status} />
            </div>
            <p style={{ fontSize: T.sm, color: T.mutedFg }}>Gắn với sự kiện: {event.name}</p>
            <p style={{ fontSize: T.xs, color: T.mutedFg, marginTop: "8px", lineHeight: 1.6, maxWidth: "560px" }}>
              Section Vé tham dự trên Landing Page tự động lấy dữ liệu từ kho vé này.
              Chỉ hạng vé đang mở và bật hiển thị mới xuất hiện với người tham dự.
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Button size="sm" variant="outline" onClick={onEditKV}>
              <Edit2 className="size-3.5" /> Chỉnh sửa kho vé
            </Button>
            <Button size="sm" onClick={onAddTier}>
              <Plus className="size-3.5" /> Thêm hạng vé
            </Button>
          </div>
        </div>
      </div>

      {/* Summary */}
      <KVSummary tiers={tiers} />

      {/* Tier table or empty state */}
      {hasTiers ? (
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h4 style={{ color: T.foreground, fontSize: T.base, fontWeight: T.fw_semi }}>
              Danh sách hạng vé
            </h4>
            <p style={{ fontSize: T.xs, color: T.mutedFg, fontStyle: "italic" }}>
              Có thể phát hành thêm = min(vé còn lại, quota còn lại trong gói)
            </p>
          </div>

          <div className="rounded-xl overflow-hidden" style={{ border: `1px solid ${T.border}` }}>
            <Table>
              <TableHeader>
                <TableRow style={{ backgroundColor: T.secondary }}>
                  <TableHead className="pl-5">Hạng vé</TableHead>
                  <TableHead>Loại vé</TableHead>
                  <TableHead>Giá vé</TableHead>
                  <TableHead>Số lượng</TableHead>
                  <TableHead>Đã phát hành</TableHead>
                  <TableHead>Còn lại</TableHead>
                  <TableHead>Hiển thị trang sự kiện</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead className="w-12" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {tiers.map((tier) => (
                  <TableRow key={tier.id}>
                    <TableCell className="pl-5">
                      <p style={{ fontSize: T.sm, fontWeight: T.fw_medium, color: T.foreground }}>{tier.name}</p>
                      {tier.description && (
                        <p style={{ fontSize: T.xs, color: T.mutedFg }}>{tier.description}</p>
                      )}
                    </TableCell>
                    <TableCell style={{ fontSize: T.sm, color: T.mutedFg }}>
                      {tier.type === "free" ? "Miễn phí" : "Trả phí"}
                    </TableCell>
                    <TableCell style={{ fontSize: T.sm, color: T.foreground, fontWeight: tier.type === "paid" ? T.fw_medium : T.fw_normal }}>
                      {formatPrice(tier.price)}
                    </TableCell>
                    <TableCell style={{ fontSize: T.sm, color: T.foreground }}>{tier.quantity}</TableCell>
                    <TableCell style={{ fontSize: T.sm, color: T.primary }}>{tier.issued}</TableCell>
                    <TableCell>
                      <span style={{
                        fontSize: T.sm,
                        color: tier.quantity - tier.issued === 0 ? "#f86880" : T.successText,
                        fontWeight: T.fw_medium,
                      }}>
                        {tier.quantity - tier.issued}
                      </span>
                    </TableCell>
                    <TableCell>
                      {tier.showOnLanding
                        ? <span style={{ fontSize: T.xs, color: T.successText, display: "flex", alignItems: "center", gap: "4px" }}>
                            <Eye className="size-3.5" /> Có
                          </span>
                        : <span style={{ fontSize: T.xs, color: T.mutedFg, display: "flex", alignItems: "center", gap: "4px" }}>
                            <EyeOff className="size-3.5" /> Không
                          </span>}
                    </TableCell>
                    <TableCell><TierStatusBadge status={tier.status} /></TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="size-8">
                            <MoreHorizontal className="size-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-40">
                          <DropdownMenuItem onClick={() => setEditTier(tier)}>
                            <Edit2 className="size-3.5 mr-2" /> Chỉnh sửa
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-destructive focus:text-destructive"
                            onClick={() => handleDelete(tier.id)}>
                            <Trash2 className="size-3.5 mr-2" /> Xoá
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center text-center py-16">
          <div className="size-16 rounded-2xl flex items-center justify-center mb-5"
            style={{ backgroundColor: `rgba(30,170,255,0.1)` }}>
            <Ticket className="size-8" style={{ color: T.primary }} />
          </div>
          <h3 style={{ fontSize: T.xl, fontWeight: T.fw_semi, color: T.foreground, marginBottom: "8px" }}>
            Chưa có hạng vé nào
          </h3>
          <p style={{ fontSize: T.sm, color: T.mutedFg, maxWidth: "360px", lineHeight: 1.6, marginBottom: "20px" }}>
            Thêm hạng vé đầu tiên như Standard, VIP hoặc Early Bird để người tham dự có thể chọn khi đăng ký.
          </p>
          <Button onClick={() => setAddOpen(true)}>
            <Plus className="size-4" /> Thêm hạng vé
          </Button>
        </div>
      )}

      {/* Add tier drawer */}
      <TierDrawer
        open={addOpen || !!editTier}
        onClose={() => { setAddOpen(false); setEditTier(null); }}
        onSave={handleSaveTier}
        initialData={editTier ?? undefined}
        isEdit={!!editTier}
        hasIssued={!!editTier && editTier.issued > 0}
      />
    </div>
  );
}

// ── Inline Create + Setup Kho Vé (single-screen, matches LandingPage) ────────

function CreateKhoVeInline({
  eventName, onCreated, onCancel,
}: {
  eventName: string;
  onCreated: (kv: KhoVe) => void;
  onCancel: () => void;
}) {
  const kvName = `Kho vé - ${eventName}`;
  const [tiers, setTiers]      = useState<TicketTier[]>([...MOCK_TIERS]);
  const [expandedId, setExpId] = useState<string | null>(MOCK_TIERS[0]?.id ?? null);
  const [loading, setLoading]  = useState(false);

  const totalQty = tiers.reduce((s, t) => s + t.quantity, 0);
  const allDraft = tiers.every((t) => t.status === "draft");

  const handleDone = (asDraft = false) => {
    setLoading(true);
    setTimeout(() => {
      onCreated({ id: Date.now().toString(), name: kvName, description: "", status: "active", note: "" });
      setLoading(false);
    }, 500);
  };

  return (
    <div className="w-full flex flex-col gap-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 style={{ fontSize: T.xl, fontWeight: T.fw_semi, color: T.foreground, marginBottom: "4px" }}>
            Thiết lập Kho vé
          </h3>
          <p style={{ fontSize: T.sm, color: T.mutedFg }}>
            Kho vé sẽ được tự tạo theo sự kiện. Thiết lập các hạng vé bên dưới.
          </p>
        </div>
        <button onClick={onCancel} style={{ color: T.mutedFg, fontSize: T.xs }} className="hover:opacity-70 transition-opacity cursor-pointer">
          ← Quay lại
        </button>
      </div>

      {/* Context card */}
      <div className="rounded-xl p-3 flex flex-wrap gap-4"
        style={{ backgroundColor: T.secondary, border: `1px solid ${T.border}` }}>
        {[
          { label: "Sự kiện", value: eventName },
          { label: "Kho vé", value: "Tự tạo bởi hệ thống" },
          { label: "Số hạng vé", value: `${tiers.length}` },
          { label: "Tổng sức chứa", value: totalQty > 0 ? `${totalQty} vé` : "—" },
        ].map((r) => (
          <div key={r.label} className="flex items-center gap-1.5">
            <span style={{ fontSize: T.xs, color: T.mutedFg }}>{r.label}:</span>
            <span style={{ fontSize: T.xs, fontWeight: T.fw_semi, color: T.foreground }}>{r.value}</span>
          </div>
        ))}
        <span style={{ fontSize: T.xs, color: T.successText, marginLeft: "auto", fontStyle: "italic" }}>
          Tạo hạng vé không trừ quota
        </span>
      </div>

      {/* Warnings */}
      {allDraft && tiers.length > 0 && (
        <div className="rounded-xl p-3 flex items-start gap-2"
          style={{ backgroundColor: T.warningSubtle, border: `1px solid ${T.warningBorder}` }}>
          <AlertCircle className="size-3.5 shrink-0 mt-0.5" style={{ color: T.warningText }} />
          <p style={{ fontSize: T.xs, color: T.warningText, lineHeight: 1.5 }}>
            Bạn chưa có hạng vé nào đang mở đăng ký. Người tham dự sẽ chưa thể chọn vé trên Landing Page.
          </p>
        </div>
      )}

      {/* Tier section header */}
      <div className="flex items-center justify-between">
        <p style={{ fontSize: T.base, fontWeight: T.fw_semi, color: T.foreground }}>Hạng vé</p>
        <Button size="sm" onClick={() => {
          const newId = Date.now().toString();
          setTiers((p) => [...p, { id: newId, name: "", description: "", benefits: "", type: "free", price: 0, quantity: 0, issued: 0, perPerson: 1, showOnLanding: true, status: "open" }]);
          setExpId(newId);
        }}>
          <Plus className="size-3.5" /> Thêm hạng vé
        </Button>
      </div>

      {/* Accordion tier cards */}
      <div className="flex flex-col gap-3">
        {tiers.map((tier, idx) => {
          const isExp = expandedId === tier.id;
          return (
            <div key={tier.id} className="rounded-xl overflow-hidden transition-all"
              style={{ border: isExp ? `2px solid ${T.primary}` : `1px solid ${T.border}` }}>
              {/* Collapsed header */}
              <div className="flex items-center gap-3 px-4 py-3"
                style={{ backgroundColor: isExp ? `rgba(30,170,255,0.04)` : T.secondary }}>
                <button className="flex items-center gap-3 flex-1 text-left cursor-pointer"
                  onClick={() => setExpId(isExp ? null : tier.id)}>
                  <div className="size-6 rounded-full flex items-center justify-center shrink-0"
                    style={{ backgroundColor: T.primary, color: "white", fontSize: T.xs, fontWeight: T.fw_bold }}>
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
                        {" · "}{tier.status === "open" ? "Đang mở" : "Nháp"}
                      </span>
                    )}
                  </div>
                </button>
                <button onClick={() => {
                  const newId = Date.now().toString();
                  setTiers((p) => [...p, { ...tier, id: newId, name: tier.name + " (bản sao)", issued: 0 }]);
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
                  <div className="flex flex-col gap-1.5">
                    <Label>Tên hạng vé <span style={{ color: T.destructive }}>*</span></Label>
                    <Input value={tier.name} onChange={(e) => setTiers((p) => p.map((t) => t.id === tier.id ? { ...t, name: e.target.value } : t))}
                      placeholder="Ví dụ: Standard, VIP, Early Bird" />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <Label>Loại vé</Label>
                    <div className="flex rounded-xl overflow-hidden" style={{ border: `1px solid ${T.border}` }}>
                      {(["free", "paid"] as const).map((typ, i) => (
                        <button key={typ} onClick={() => setTiers((p) => p.map((t) => t.id === tier.id ? { ...t, type: typ, price: typ === "free" ? 0 : t.price } : t))}
                          className="flex-1 py-2 transition-colors cursor-pointer"
                          style={{ fontSize: T.sm, backgroundColor: tier.type === typ ? T.primary : T.background,
                            color: tier.type === typ ? T.primaryFg : T.mutedFg,
                            borderRight: i === 0 ? `1px solid ${T.border}` : "none" }}>
                          {typ === "free" ? "Miễn phí" : "Trả phí"}
                        </button>
                      ))}
                    </div>
                  </div>
                  {tier.type === "paid" && (
                    <div className="flex flex-col gap-1.5">
                      <Label>Giá vé (đ) <span style={{ color: T.destructive }}>*</span></Label>
                      <Input type="number" placeholder="499000" value={tier.price || ""}
                        onChange={(e) => setTiers((p) => p.map((t) => t.id === tier.id ? { ...t, price: Number(e.target.value) } : t))} />
                    </div>
                  )}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex flex-col gap-1.5">
                      <Label>Số lượng <span style={{ color: T.destructive }}>*</span></Label>
                      <Input type="number" placeholder="300" value={tier.quantity || ""}
                        onChange={(e) => setTiers((p) => p.map((t) => t.id === tier.id ? { ...t, quantity: Number(e.target.value) } : t))} />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <Label>Hiển thị trang sự kiện</Label>
                      <div className="flex items-center h-9">
                        <Toggle value={tier.showOnLanding}
                          onChange={(v) => setTiers((p) => p.map((t) => t.id === tier.id ? { ...t, showOnLanding: v } : t))} />
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label>Trạng thái</Label>
                    <RadioCard selected={tier.status === "draft"} onClick={() => setTiers((p) => p.map((t) => t.id === tier.id ? { ...t, status: "draft" } : t))}
                      label="Lưu nháp" sub="Chưa hiển thị cho người tham dự" />
                    <RadioCard selected={tier.status === "open"} onClick={() => setTiers((p) => p.map((t) => t.id === tier.id ? { ...t, status: "open" } : t))}
                      label="Mở đăng ký ngay" sub="Cho phép người tham dự chọn hạng vé này" />
                  </div>
                  {/* Preview */}
                  {tier.name && tier.showOnLanding && tier.status !== "draft" && (
                    <div className="rounded-xl p-3" style={{ backgroundColor: T.secondary, border: `1px solid ${T.border}` }}>
                      <p style={{ fontSize: T.xs, fontWeight: T.fw_semi, color: T.mutedFg, marginBottom: "8px", textTransform: "uppercase" as const, letterSpacing: "0.05em" }}>
                        Preview trên Landing Page
                      </p>
                      <div className="rounded-xl p-3 flex items-center justify-between" style={{ backgroundColor: T.background, border: `1px solid ${T.border}` }}>
                        <div>
                          <p style={{ fontSize: T.sm, fontWeight: T.fw_semi, color: T.foreground }}>{tier.name}</p>
                          <p style={{ fontSize: T.xs, color: tier.type === "free" ? T.successText : T.primary }}>
                            {tier.type === "free" ? "Miễn phí" : tier.price ? `${tier.price.toLocaleString("vi-VN")}đ` : "—"}
                          </p>
                          <p style={{ fontSize: T.xs, color: T.mutedFg }}>Còn {tier.quantity || 0} vé</p>
                        </div>
                        <button className="px-3 py-1.5 rounded-lg" style={{ backgroundColor: T.primary, color: T.primaryFg, fontSize: T.xs }}>Chọn vé</button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="flex gap-3 pt-2" style={{ borderTop: `1px solid ${T.border}` }}>
        <Button variant="outline" onClick={onCancel}>Hủy</Button>
        <Button disabled={tiers.length === 0 || loading} onClick={() => handleDone(false)}>
          {loading ? "Đang lưu..." : "Hoàn tất thiết lập Kho vé"}
        </Button>
      </div>
    </div>
  );
}

// ── Empty State ───────────────────────────────────────────────────────────────

function KhoVeEmptyState({ onCreate }: { onCreate: () => void }) {
  return (
    <div className="flex flex-col items-center text-center py-16">
      <div className="size-16 rounded-2xl flex items-center justify-center mb-5"
        style={{ backgroundColor: `rgba(30,170,255,0.1)` }}>
        <Ticket className="size-8" style={{ color: T.primary }} />
      </div>
      <h3 style={{ fontSize: T.xl, fontWeight: T.fw_semi, color: T.foreground, marginBottom: "8px" }}>
        Sự kiện này chưa có kho vé
      </h3>
      <p style={{ fontSize: T.sm, color: T.mutedFg, maxWidth: "400px", lineHeight: 1.6, marginBottom: "20px" }}>
        Tạo kho vé để thiết lập các hạng vé như Standard, VIP, Early Bird và hiển thị vé trên Landing Page.
      </p>
      <Button onClick={onCreate}>
        <Plus className="size-4" /> Tạo kho vé
      </Button>

      {/* Rule box */}
      <div className="mt-8 max-w-md w-full rounded-xl p-4 text-left flex flex-col gap-2"
        style={{ backgroundColor: T.secondary, border: `1px solid ${T.border}` }}>
        {[
          "Mỗi sự kiện chỉ có một kho vé active.",
          "Tạo kho vé không trừ quota vé trong gói.",
          "Quota vé chỉ trừ khi vé được phát hành thật cho người tham dự.",
        ].map((rule) => (
          <div key={rule} className="flex items-start gap-2">
            <CheckCircle2 className="size-3.5 shrink-0 mt-0.5" style={{ color: T.primary }} />
            <p style={{ fontSize: T.xs, color: T.mutedFg, lineHeight: 1.5 }}>{rule}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Main export ────────────────────────────────────────────────────────────────

export function TicketInventoryTab({ event }: { event: EventDraft }) {
  const [view, setView]           = useState<KVView>("empty");
  const [khoVe, setKhoVe]         = useState<KhoVe | null>(null);
  const [createOpen, setCreate]   = useState(false);

  const handleCreated = (kv: KhoVe) => {
    setKhoVe(kv);
    setView("detail");
    setCreate(false);
  };

  return (
    <div className="flex flex-col gap-6">
      {view === "empty" ? (
        createOpen ? (
          <CreateKhoVeInline
            eventName={event.name || "Sự kiện"}
            onCreated={handleCreated}
            onCancel={() => setCreate(false)}
          />
        ) : (
          <KhoVeEmptyState onCreate={() => setCreate(true)} />
        )
      ) : (
        khoVe && (
          <KhoVeDetail
            khoVe={khoVe}
            event={event}
            onAddTier={() => {}}
            onEditKV={() => setCreate(true)}
          />
        )
      )}
    </div>
  );
}

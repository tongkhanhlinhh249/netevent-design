import * as React from "react";
import { useRef, useState } from "react";
import { ChevronLeft, ChevronDown, Plus, Pencil, Trash2, Upload } from "lucide-react";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Switch } from "../ui/switch";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "../ui/collapsible";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";
import { useRewards, inventoryOf, saveGiftGame, logAudit, type Gift, type GiftGame } from "../../data/attendeeFlow";
import { readImageFile } from "../../data/imageUtils";
import { T, ADMIN, BRAND_COLORS, GiftThumb, newGiftGame } from "./GiftGameShared";
import { GiftGamePreview } from "./GiftGamePreview";

const LINK_BTN: React.CSSProperties = { display: "inline-flex", alignItems: "center", gap: 4, fontSize: T.sm, color: T.mutedFg, background: "none", border: "none", padding: 0, cursor: "pointer" };

function Card({ title, aside, children }: { title: string; aside?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl p-5 flex flex-col gap-4" style={{ backgroundColor: T.background, border: `1px solid ${T.border}` }}>
      <div className="flex items-center justify-between gap-3">
        <p style={{ fontSize: T.sm, fontWeight: T.fw_semi, color: T.foreground }}>{title}</p>
        {aside}
      </div>
      {children}
    </div>
  );
}

function Field({ label, required, error, children }: { label: string; required?: boolean; error?: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5 min-w-0">
      <Label>{label}{required && <span style={{ color: T.destructive }}> *</span>}</Label>
      {children}
      {error && <p style={{ fontSize: T.xs, color: T.destructive }}>{error}</p>}
    </div>
  );
}

type Errors = Partial<Record<"name" | "time" | "pickup" | "gifts", string>>;

/** Ghi nhật ký cho từng thay đổi kho và trạng thái quà khi sửa minigame đang chạy. */
function logGiftChanges(eventId: string, before: GiftGame, after: GiftGame) {
  for (const g of after.gifts) {
    const old = before.gifts.find((x) => x.id === g.id);
    if (!old) logAudit(eventId, ADMIN, `Thêm quà “${g.name}” (${g.quantity})`);
    else {
      if (old.quantity !== g.quantity) logAudit(eventId, ADMIN, `Điều chỉnh kho “${g.name}”: ${old.quantity} → ${g.quantity}`);
      if (old.status !== g.status) logAudit(eventId, ADMIN, `${g.status === "paused" ? "Tạm dừng" : "Mở lại"} quà “${g.name}”`);
    }
  }
  for (const g of before.gifts) if (!after.gifts.some((x) => x.id === g.id)) logAudit(eventId, ADMIN, `Xoá quà “${g.name}”`);
}

/**
 * Tạo/sửa minigame "Chọn quà ngẫu nhiên": thông tin, danh sách quà và giao diện,
 * kèm xem trước màn người tham dự. Đang chạy thì vẫn sửa được nội dung, ảnh, thêm
 * quà, bổ sung số lượng, tạm dừng quà và gia hạn — không giảm dưới số đã phân bổ,
 * không xoá quà đã có người nhận.
 */
export function GiftGameSetup({ eventId, eventName, expected, initial, onBack, onDone }: {
  eventId: string; eventName: string; expected: number; initial: GiftGame | null;
  onBack: () => void; onDone: (g: GiftGame) => void;
}) {
  const [draft, setDraft] = useState<GiftGame>(() => initial ?? newGiftGame());
  const [errors, setErrors] = useState<Errors>({});
  const [dialog, setDialog] = useState<{ gift: Gift | null } | null>(null);
  const [confirmLow, setConfirmLow] = useState(false);
  const rewards = useRewards(eventId);
  const inventory = inventoryOf(draft, rewards);
  const allocatedOf = (id: string) => inventory.find((g) => g.id === id)?.allocated ?? 0;
  const live = !!initial && initial.status !== "draft";
  const total = draft.gifts.reduce((n, g) => n + g.quantity, 0);

  const patch = (p: Partial<GiftGame>) => setDraft((d) => ({ ...d, ...p }));
  const patchUi = (p: Partial<GiftGame["ui"]>) => setDraft((d) => ({ ...d, ui: { ...d.ui, ...p } }));
  const setGift = (g: Gift) => setDraft((d) => ({
    ...d, gifts: d.gifts.some((x) => x.id === g.id) ? d.gifts.map((x) => (x.id === g.id ? g : x)) : [...d.gifts, g],
  }));

  const validate = (needGifts: boolean) => {
    const e: Errors = {};
    if (!draft.name.trim()) e.name = "Vui lòng nhập tên Minigame.";
    const s = new Date(draft.startAt).getTime(), en = new Date(draft.endAt).getTime();
    if (!(en > s)) e.time = "Thời gian kết thúc phải lớn hơn thời gian bắt đầu.";
    if (!draft.pickupLocation.trim()) e.pickup = "Vui lòng nhập địa điểm nhận quà.";
    if (needGifts && !draft.gifts.some((g) => g.status === "active" && g.quantity > 0)) e.gifts = "Vui lòng thêm ít nhất một phần quà.";
    setErrors(e);
    if (Object.keys(e).length) toast.error("Vui lòng kiểm tra lại thông tin còn thiếu.");
    return Object.keys(e).length === 0;
  };

  const commit = (status: GiftGame["status"], action: string, message: string) => {
    const g: GiftGame = { ...draft, name: draft.name.trim(), pickupLocation: draft.pickupLocation.trim(), status };
    saveGiftGame(eventId, g, ADMIN, action);
    if (initial) logGiftChanges(eventId, initial, g);
    toast.success(message, { description: g.name });
    onDone(g);
  };

  const saveDraft = () => validate(false)
    && commit("draft", initial ? `Lưu bản nháp minigame “${draft.name.trim()}”` : `Tạo minigame “${draft.name.trim()}” (bản nháp)`, "Đã lưu bản nháp");
  const activate = () => commit("active", `Kích hoạt minigame “${draft.name.trim()}”`, "Đã kích hoạt minigame");
  const tryActivate = () => { if (validate(true)) { if (total < expected) setConfirmLow(true); else activate(); } };
  const saveLive = () => validate(true)
    && commit(initial!.status, `Cập nhật cấu hình minigame “${draft.name.trim()}”`, "Đã lưu thay đổi");

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div>
        <button data-pill="off" onClick={onBack} style={{ ...LINK_BTN, marginBottom: 8 }}>
          <ChevronLeft size={15} /> {live ? "Kết quả và kho quà" : "Danh sách mini game"}
        </button>
        <h2 style={{ fontSize: T.xl, fontWeight: T.fw_semi, color: T.foreground, margin: 0 }}>
          {initial ? initial.name || "Minigame chọn quà" : "Tạo minigame chọn quà"}
        </h2>
        <p style={{ fontSize: T.sm, color: T.mutedFg, margin: "6px 0 0" }}>
          Chọn quà ngẫu nhiên · Người đã check-in chọn 1 trong 3 hộp quà
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_320px] gap-6 items-start">
        <div className="flex flex-col gap-4 min-w-0">
          <Card title="Thông tin chung">
            <Field label="Tên minigame" required error={errors.name}>
              <Input value={draft.name} aria-invalid={!!errors.name} placeholder="Ví dụ: Check-in liền tay – Nhận ngay quà xịn"
                onChange={(e) => { patch({ name: e.target.value }); setErrors((x) => ({ ...x, name: undefined })); }} />
            </Field>
            <Field label="Mô tả">
              <Textarea rows={2} value={draft.description} placeholder="Giới thiệu ngắn cách chơi"
                onChange={(e) => patch({ description: e.target.value })} />
            </Field>
            <div className="flex flex-col gap-1.5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Field label="Bắt đầu" required>
                  <Input type="datetime-local" value={draft.startAt} aria-invalid={!!errors.time}
                    onChange={(e) => { patch({ startAt: e.target.value }); setErrors((x) => ({ ...x, time: undefined })); }} />
                </Field>
                <Field label="Kết thúc" required>
                  <Input type="datetime-local" value={draft.endAt} aria-invalid={!!errors.time}
                    onChange={(e) => { patch({ endAt: e.target.value }); setErrors((x) => ({ ...x, time: undefined })); }} />
                </Field>
              </div>
              {errors.time && <p style={{ fontSize: T.xs, color: T.destructive }}>{errors.time}</p>}
            </div>
            <Field label="Địa điểm nhận quà" required error={errors.pickup}>
              <Input value={draft.pickupLocation} aria-invalid={!!errors.pickup} placeholder="Booth check-in"
                onChange={(e) => { patch({ pickupLocation: e.target.value }); setErrors((x) => ({ ...x, pickup: undefined })); }} />
            </Field>
            <p style={{ fontSize: T.xs, color: T.mutedFg }}>Điều kiện tham gia: người đã check-in · 01 lượt/người</p>
          </Card>

          <Card title="Phần quà" aside={draft.gifts.length > 0 && (
            <span style={{ fontSize: T.xs, color: T.mutedFg }}>Tổng {total} phần quà</span>
          )}>
            {draft.gifts.length > 0 && (
              <div className="flex flex-col">
                {draft.gifts.map((g, i) => {
                  const allocated = allocatedOf(g.id);
                  return (
                    <div key={g.id} className="flex items-center gap-3 py-2.5" style={{ borderTop: i ? `1px solid ${T.border}` : "none", opacity: g.status === "paused" ? 0.6 : 1 }}>
                      <GiftThumb image={g.image} size={36} />
                      <div className="flex-1 min-w-0">
                        <p className="truncate" style={{ fontSize: T.sm, fontWeight: T.fw_medium, color: T.foreground }}>{g.name}</p>
                        <p className="truncate" style={{ fontSize: T.xs, color: T.mutedFg }}>
                          <span style={{ fontFamily: "monospace" }}>{g.code}</span> · {g.quantity} phần{allocated ? ` · Đã phát ${allocated}` : ""}{g.status === "paused" ? " · Tạm dừng" : ""}
                        </p>
                      </div>
                      <Switch checked={g.status === "active"} aria-label={`Phát quà ${g.name}`}
                        onCheckedChange={(on) => setGift({ ...g, status: on ? "active" : "paused" })} />
                      <Button variant="ghost" size="icon" className="size-8" aria-label={`Sửa ${g.name}`} onClick={() => setDialog({ gift: g })}>
                        <Pencil size={14} />
                      </Button>
                      <Button variant="ghost" size="icon" className="size-8" aria-label={`Xoá ${g.name}`} disabled={allocated > 0}
                        title={allocated > 0 ? "Quà đã được phân bổ — chỉ có thể tạm dừng" : undefined}
                        onClick={() => setDraft((d) => ({ ...d, gifts: d.gifts.filter((x) => x.id !== g.id) }))}>
                        <Trash2 size={14} />
                      </Button>
                    </div>
                  );
                })}
              </div>
            )}
            <div className="flex flex-col gap-1.5">
              <Button variant="outline" className="self-start" onClick={() => { setDialog({ gift: null }); setErrors((x) => ({ ...x, gifts: undefined })); }}>
                <Plus size={14} /> Thêm phần quà
              </Button>
              {errors.gifts && <p style={{ fontSize: T.xs, color: T.destructive }}>{errors.gifts}</p>}
            </div>
          </Card>

          <Collapsible className="rounded-2xl" style={{ backgroundColor: T.background, border: `1px solid ${T.border}` }}>
            <CollapsibleTrigger className="group w-full flex items-center justify-between gap-3 p-5 cursor-pointer" data-pill="off">
              <span style={{ fontSize: T.sm, fontWeight: T.fw_semi, color: T.foreground }}>Giao diện</span>
              <ChevronDown size={16} className="transition-transform group-data-[state=open]:rotate-180" style={{ color: T.mutedFg }} />
            </CollapsibleTrigger>
            <CollapsibleContent className="px-5 pb-5 flex flex-col gap-4">
              <Field label="Tiêu đề">
                <Input value={draft.ui.title} onChange={(e) => patchUi({ title: e.target.value })} />
              </Field>
              <Field label="Nội dung trước khi chơi">
                <Textarea rows={2} value={draft.ui.intro} onChange={(e) => patchUi({ intro: e.target.value })} />
              </Field>
              <Field label="Nội dung màn kết quả">
                <Textarea rows={2} value={draft.ui.resultText} onChange={(e) => patchUi({ resultText: e.target.value })} />
              </Field>
              <Field label="Màu thương hiệu">
                <div className="flex items-center gap-2">
                  {BRAND_COLORS.map((c) => (
                    <button key={c} type="button" aria-label={`Màu ${c}`} aria-pressed={draft.ui.brandColor === c}
                      onClick={() => patchUi({ brandColor: c })}
                      className="size-7 cursor-pointer"
                      style={{ backgroundColor: c, boxShadow: draft.ui.brandColor === c ? `0 0 0 2px ${T.background}, 0 0 0 4px ${c}` : "none" }} />
                  ))}
                </div>
              </Field>
            </CollapsibleContent>
          </Collapsible>

          <div className="flex items-center justify-end gap-2 flex-wrap">
            {live ? (
              <>
                <Button variant="ghost" onClick={onBack}>Huỷ</Button>
                <Button onClick={saveLive}>Lưu thay đổi</Button>
              </>
            ) : (
              <>
                <Button variant="outline" onClick={saveDraft}>Lưu bản nháp</Button>
                <Button onClick={tryActivate}>Kích hoạt</Button>
              </>
            )}
          </div>
        </div>

        <div className="lg:sticky lg:top-4">
          <GiftGamePreview game={draft} eventName={eventName} />
        </div>
      </div>

      <GiftDialog key={dialog?.gift?.id ?? "new"} open={!!dialog} gift={dialog?.gift ?? null}
        allocated={dialog?.gift ? allocatedOf(dialog.gift.id) : 0}
        codes={draft.gifts.filter((g) => g.id !== dialog?.gift?.id).map((g) => g.code.toUpperCase())}
        onClose={() => setDialog(null)} onSave={(g) => { setGift(g); setDialog(null); }} />

      <Dialog open={confirmLow} onOpenChange={setConfirmLow}>
        <DialogContent aria-describedby={undefined}>
          <DialogHeader>
            <DialogTitle>Số lượng quà thấp hơn dự kiến</DialogTitle>
          </DialogHeader>
          <p style={{ fontSize: T.sm, color: T.foreground, lineHeight: 1.6 }}>
            Số lượng quà hiện tại thấp hơn số người tham dự dự kiến. Một số người check-in có thể không nhận được quà.
          </p>
          <p style={{ fontSize: T.xs, color: T.mutedFg }}>{total} phần quà · {expected} người đăng ký</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmLow(false)}>Quay lại</Button>
            <Button onClick={() => { setConfirmLow(false); activate(); }}>Vẫn kích hoạt</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ── Thêm / sửa phần quà ─────────────────────────────────────────────────────────

function GiftDialog({ open, gift, allocated, codes, onClose, onSave }: {
  open: boolean; gift: Gift | null; allocated: number; codes: string[];
  onClose: () => void; onSave: (g: Gift) => void;
}) {
  const [name, setName] = useState(gift?.name ?? "");
  const [code, setCode] = useState(gift?.code ?? "");
  const [qty, setQty] = useState(gift ? String(gift.quantity) : "");
  const [image, setImage] = useState(gift?.image ?? "🎁");
  const [description, setDescription] = useState(gift?.description ?? "");
  const [pickupNote, setPickupNote] = useState(gift?.pickupNote ?? "");
  const [errors, setErrors] = useState<Partial<Record<"name" | "code" | "qty", string>>>({});
  const file = useRef<HTMLInputElement>(null);

  const save = () => {
    const e: typeof errors = {};
    const c = code.trim().toUpperCase();
    const n = Number(qty);
    if (!name.trim()) e.name = "Vui lòng nhập tên quà.";
    if (!c) e.code = "Vui lòng nhập mã quà.";
    else if (codes.includes(c)) e.code = "Mã quà đã tồn tại trong Minigame.";
    if (!qty.trim() || !Number.isInteger(n) || n <= 0) e.qty = "Số lượng phải là số nguyên lớn hơn 0.";
    else if (n < allocated) e.qty = "Số lượng mới không được thấp hơn số quà đã phân bổ.";
    setErrors(e);
    if (Object.keys(e).length) return;
    onSave({
      id: gift?.id ?? `g${Date.now().toString(36)}`, code: c, name: name.trim(), image, quantity: n,
      description: description.trim() || undefined, pickupNote: pickupNote.trim() || undefined,
      status: gift?.status ?? "active",
    });
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>{gift ? "Sửa phần quà" : "Thêm phần quà"}</DialogTitle>
          <DialogDescription>{allocated ? `Đã phân bổ ${allocated} phần — không giảm được dưới số này.` : "Quà được chọn ngẫu nhiên theo số lượng còn lại."}</DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <GiftThumb image={image} size={56} />
            <Button variant="outline" size="sm" onClick={() => file.current?.click()}><Upload size={13} /> Tải ảnh</Button>
            <input ref={file} type="file" accept="image/*" hidden onChange={async (ev) => {
              const f = ev.target.files?.[0];
              ev.target.value = "";
              if (f) setImage(await readImageFile(f, 256));
            }} />
          </div>
          <div className="grid grid-cols-[minmax(0,1fr)_130px] gap-3">
            <Field label="Tên quà" required error={errors.name}>
              <Input value={name} aria-invalid={!!errors.name} onChange={(e) => setName(e.target.value)} placeholder="Ví dụ: Bình giữ nhiệt" />
            </Field>
            <Field label="Mã quà" required error={errors.code}>
              <Input value={code} aria-invalid={!!errors.code} onChange={(e) => setCode(e.target.value.toUpperCase())} placeholder="BGN" />
            </Field>
          </div>
          <Field label="Số lượng" required error={errors.qty}>
            <Input type="number" inputMode="numeric" min={Math.max(1, allocated)} step={1} value={qty} aria-invalid={!!errors.qty}
              onChange={(e) => setQty(e.target.value)} placeholder="50" />
          </Field>
          <Field label="Mô tả">
            <Input value={description} onChange={(e) => setDescription(e.target.value)} />
          </Field>
          <Field label="Hướng dẫn nhận">
            <Input value={pickupNote} onChange={(e) => setPickupNote(e.target.value)} placeholder="Ví dụ: Nhận tại quầy số 2" />
          </Field>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Huỷ</Button>
          <Button onClick={save}>Lưu</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

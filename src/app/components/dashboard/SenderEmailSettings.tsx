import * as React from "react";
import { useState } from "react";
import { AlertTriangle, CheckCircle2, Mail, Send } from "lucide-react";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Sheet, SheetContent, SheetDescription, SheetTitle } from "../ui/sheet";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import {
  NETEVENT_SENDER, SECURITY_LABEL, activeSender, checkConnection, isConfigured, useSenderEmail,
  type SenderEmail, type SmtpConfig, type SmtpSecurity,
} from "../../data/senderEmail";

/**
 * Cài đặt → Email gửi — theo [Feature Spec] CẤU HÌNH EMAIL GỬI.
 *
 * Màn này trả lời đúng một câu hỏi: "người tham dự nhận email từ địa chỉ nào".
 * Mở lên chỉ thấy hai lựa chọn — email NetEvent hoặc email của tổ chức; phần
 * SMTP kỹ thuật chỉ hiện khi bấm Thiết lập.
 *
 * Nhập xong không lưu ngay: phải "Kiểm tra kết nối" thành công mới lưu được, vì
 * một cấu hình sai lưu vào sẽ âm thầm làm hỏng email của mọi sự kiện.
 */

const T = {
  background:    "var(--background)",
  foreground:    "var(--foreground)",
  border:        "var(--border)",
  primary:       "var(--primary)",
  secondary:     "var(--secondary)",
  mutedFg:       "var(--muted-foreground)",
  successSubtle: "var(--success-subtle)",
  successBorder: "var(--success-border)",
  successText:   "var(--success-text)",
  warningSubtle: "var(--warning-subtle)",
  warningBorder: "var(--warning-border)",
  warningText:   "var(--warning-text)",
  fw_medium: "var(--font-weight-medium)",
  fw_semi:   "var(--font-weight-semibold)",
  xs:   "var(--text-xs)",
  sm:   "var(--text-sm)",
  base: "var(--text-base)",
  lg:   "var(--text-lg)",
};

/** Email của tài khoản đang đăng nhập — mặc định nhận thư gửi thử. */
const ACCOUNT_EMAIL = "owner@netevent.vn";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const isEmail = (v: string) => EMAIL_RE.test(v.trim());

// ── Trang Cài đặt ────────────────────────────────────────────────────────────

export function SettingsPage({ canEdit }: { canEdit: boolean }) {
  return (
    <div className="flex flex-col gap-6">
      <h2 style={{ fontSize: T.lg, fontWeight: T.fw_semi, color: T.foreground }}>Cài đặt</h2>
      <SenderEmailSection canEdit={canEdit} />
    </div>
  );
}

// ── Email gửi ────────────────────────────────────────────────────────────────

export function SenderEmailSection({ canEdit }: { canEdit: boolean }) {
  const [sender, setSender] = useSenderEmail();
  const [setupOpen, setSetupOpen] = useState(false);
  const [testOpen, setTestOpen] = useState(false);
  const configured = isConfigured(sender);
  const active = activeSender(sender);

  const use = (using: SenderEmail["using"]) => {
    if (!canEdit || using === sender.using) return;
    setSender({ ...sender, using });
    toast.success(using === "custom"
      ? `Email sự kiện sẽ gửi từ ${sender.email}`
      : `Email sự kiện sẽ gửi từ ${NETEVENT_SENDER.email}`);
  };

  const recheck = () => {
    if (!sender.smtp) return;
    const { ok, error } = checkConnection(sender.smtp, "");
    setSender({ ...sender, status: ok ? "connected" : "error", checkedAt: Date.now() });
    if (ok) toast.success("Kết nối email thành công");
    else toast.error("Không thể kết nối email", { description: error });
  };

  return (
    <section className="rounded-2xl p-5 flex flex-col gap-4"
      style={{ backgroundColor: T.background, border: `1px solid ${T.border}` }}>
      <div>
        <h3 style={{ fontSize: T.base, fontWeight: T.fw_semi, color: T.foreground }}>Email gửi</h3>
        <p style={{ fontSize: T.xs, color: T.mutedFg, lineHeight: 1.6, marginTop: 4 }}>
          Địa chỉ dùng để gửi email tới người tham dự, áp dụng cho mọi sự kiện.
        </p>
      </div>

      {active.fallback && (
        <Notice>
          Email của tổ chức hiện không thể sử dụng. NetEvent đang tạm thời gửi bằng email mặc định
          để email sự kiện vẫn đến được người tham dự.
        </Notice>
      )}

      <div role="radiogroup" aria-label="Email đang sử dụng" className="flex flex-col gap-2">
        <SenderChoice
          on={sender.using === "netevent"} canEdit={canEdit}
          onSelect={() => use("netevent")}
          title="Email NetEvent" email={NETEVENT_SENDER.email}
        />

        <SenderChoice
          on={sender.using === "custom"} canEdit={canEdit && configured}
          onSelect={() => use("custom")}
          title={configured ? sender.name : "Email của tổ chức"}
          email={configured ? sender.email : "Gửi bằng tên miền của doanh nghiệp hoặc tổ chức của bạn."}
          muted={!configured}
          badge={configured ? <StatusBadge status={sender.status} /> : undefined}
        >
          {canEdit && (
            <div className="flex flex-wrap items-center gap-4 pt-1">
              {configured ? (
                <>
                  <LinkButton onClick={() => setSetupOpen(true)}>Chỉnh sửa</LinkButton>
                  <LinkButton onClick={recheck}>Kiểm tra kết nối</LinkButton>
                  <LinkButton onClick={() => setTestOpen(true)}>Gửi email thử</LinkButton>
                </>
              ) : (
                <Button size="sm" variant="outline" onClick={() => setSetupOpen(true)}>Thiết lập email gửi</Button>
              )}
            </div>
          )}
        </SenderChoice>
      </div>

      {!canEdit && (
        <p style={{ fontSize: T.xs, color: T.mutedFg }}>
          Chỉ chủ tài khoản hoặc quản trị viên mới thay đổi được email gửi.
        </p>
      )}

      {setupOpen && (
        <SetupSheet sender={sender} onSave={setSender} onClose={() => setSetupOpen(false)}
          onSent={() => setTestOpen(true)} />
      )}
      {testOpen && <TestEmailDialog from={`${sender.name} <${sender.email}>`} onClose={() => setTestOpen(false)} />}
    </section>
  );
}

function SenderChoice({ on, canEdit, onSelect, title, email, muted, badge, children }: {
  on: boolean; canEdit: boolean; onSelect: () => void;
  title: string; email: string; muted?: boolean;
  badge?: React.ReactNode; children?: React.ReactNode;
}) {
  return (
    <div className="rounded-xl p-3.5"
      style={{ border: `1px solid ${on ? T.primary : T.border}`, backgroundColor: on ? T.secondary : "transparent" }}>
      <button type="button" data-pill="off" role="radio" aria-checked={on} disabled={!canEdit}
        onClick={onSelect}
        className="flex items-start gap-3 w-full text-left"
        style={{ background: "none", border: "none", padding: 0, cursor: canEdit ? "pointer" : "default" }}>
        <span className="shrink-0 mt-0.5 rounded-full" aria-hidden
          style={{ width: 16, height: 16, border: `1.5px solid ${on ? T.primary : T.border}`,
            boxShadow: on ? `inset 0 0 0 3px ${T.background}, inset 0 0 0 16px ${T.primary}` : "none" }} />
        <span className="flex-1 min-w-0">
          <span className="flex items-center gap-2 flex-wrap">
            <span style={{ fontSize: T.sm, fontWeight: T.fw_medium, color: T.foreground }}>{title}</span>
            {badge}
          </span>
          <span className="block truncate" style={{ fontSize: T.xs, color: T.mutedFg, marginTop: 2 }}>{email}</span>
        </span>
      </button>
      {children && <div className="pl-7">{children}</div>}
    </div>
  );
}

function StatusBadge({ status }: { status: SenderEmail["status"] }) {
  if (status === "connected") return (
    <span className="inline-flex items-center gap-1" style={{ fontSize: T.xs, color: T.successText }}>
      <CheckCircle2 className="size-3.5" /> Đã kết nối
    </span>
  );
  if (status === "error") return (
    <span className="inline-flex items-center gap-1" style={{ fontSize: T.xs, color: T.warningText }}>
      <AlertTriangle className="size-3.5" /> Có lỗi
    </span>
  );
  return null;
}

// ── Thiết lập: thông tin người gửi → cấu hình SMTP ───────────────────────────

const DEFAULT_SMTP: SmtpConfig = { host: "", port: "587", user: "", security: "tls", hasPassword: false };

function SetupSheet({ sender, onSave, onClose, onSent }: {
  sender: SenderEmail;
  onSave: (next: SenderEmail) => void;
  onClose: () => void;
  onSent: () => void;
}) {
  const [step, setStep] = useState<1 | 2>(1);
  const [name, setName]   = useState(sender.name);
  const [email, setEmail] = useState(sender.email);
  const [smtp, setSmtp]   = useState<SmtpConfig>(sender.smtp ?? DEFAULT_SMTP);
  // Mật khẩu đang lưu không bao giờ được trả lại đây; để trống nghĩa là giữ nguyên.
  const [password, setPassword] = useState("");
  const [checking, setChecking] = useState(false);
  const [result, setResult] = useState<{ ok: boolean; error?: string } | null>(null);

  const set = <K extends keyof SmtpConfig>(k: K) => (v: SmtpConfig[K]) => {
    setSmtp((s) => ({ ...s, [k]: v }));
    // Đổi bất kỳ thông số nào thì kết quả kiểm tra cũ không còn giá trị.
    setResult(null);
  };

  const step1Error = !name.trim() ? "Nhập tên người gửi."
    : !isEmail(email) ? "Nhập email gửi hợp lệ."
    : "";

  const check = () => {
    setChecking(true);
    setResult(null);
    // Trễ một nhịp cho giống lúc thật gọi sang máy chủ gửi.
    window.setTimeout(() => {
      setResult(checkConnection(smtp, password));
      setChecking(false);
    }, 900);
  };

  const save = () => {
    if (!result?.ok) return;
    onSave({
      ...sender,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      smtp: { ...smtp, hasPassword: !!password || smtp.hasPassword },
      status: "connected",
      using: "custom",
      checkedAt: Date.now(),
    });
    onClose();
    toast.success("Đã lưu email gửi", { description: "Email sự kiện sẽ gửi từ địa chỉ này." });
    onSent();
  };

  return (
    <Sheet open onOpenChange={(o) => !o && onClose()}>
      <SheetContent className="p-0 flex flex-col gap-0 sm:max-w-[460px]">
        <div className="px-5 py-4 pr-12" style={{ borderBottom: `1px solid ${T.border}` }}>
          <SheetTitle style={{ fontSize: T.base, fontWeight: T.fw_semi, color: T.foreground }}>
            {step === 1 ? "Thông tin người gửi" : "Cấu hình máy chủ gửi"}
          </SheetTitle>
          <SheetDescription style={{ fontSize: T.xs, color: T.mutedFg, marginTop: 2 }}>
            {step === 1
              ? "Tên và địa chỉ mà người tham dự nhìn thấy trong hộp thư."
              : "Thông tin máy chủ do bộ phận kỹ thuật hoặc nhà cung cấp email của bạn cấp."}
          </SheetDescription>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-5 flex flex-col gap-4">
          {step === 1 ? (
            <>
              <Field label="Tên người gửi" required>
                <Input value={name} placeholder="Growth Summit 2026" autoFocus
                  onChange={(e) => setName(e.target.value)} aria-label="Tên người gửi" />
              </Field>
              <Field label="Email gửi" required>
                <Input type="email" value={email} placeholder="event@congty.vn"
                  onChange={(e) => setEmail(e.target.value)} aria-label="Email gửi" />
              </Field>
              <div className="rounded-xl p-3" style={{ backgroundColor: T.secondary }}>
                <p style={{ fontSize: T.xs, color: T.mutedFg }}>Người nhận sẽ thấy</p>
                <p className="flex items-center gap-2 truncate" style={{ fontSize: T.sm, color: T.foreground, marginTop: 4 }}>
                  <Mail className="size-4 shrink-0" style={{ color: T.mutedFg }} />
                  {name.trim() || "Tên người gửi"} &lt;{email.trim() || "event@congty.vn"}&gt;
                </p>
              </div>
            </>
          ) : (
            <>
              <Field label="Máy chủ gửi (SMTP)" required>
                <Input value={smtp.host} placeholder="smtp.congty.vn" autoFocus
                  onChange={(e) => set("host")(e.target.value)} aria-label="Máy chủ gửi" />
              </Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Cổng" required>
                  <Input value={smtp.port} inputMode="numeric" placeholder="587"
                    onChange={(e) => set("port")(e.target.value)} aria-label="Cổng" />
                </Field>
                <Field label="Bảo mật">
                  <Select value={smtp.security} onValueChange={(v) => set("security")(v as SmtpSecurity)}>
                    <SelectTrigger aria-label="Bảo mật"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {(Object.keys(SECURITY_LABEL) as SmtpSecurity[]).map((k) => (
                        <SelectItem key={k} value={k}>{SECURITY_LABEL[k]}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>
              </div>
              <Field label="Tài khoản" required>
                <Input value={smtp.user} placeholder="event@congty.vn"
                  onChange={(e) => set("user")(e.target.value)} aria-label="Tài khoản" />
              </Field>
              <Field label="Mật khẩu" required={!smtp.hasPassword}>
                <Input type="password" value={password}
                  placeholder={smtp.hasPassword ? "••••••••" : "Mật khẩu của tài khoản gửi"}
                  onChange={(e) => { setPassword(e.target.value); setResult(null); }} aria-label="Mật khẩu" />
                {smtp.hasPassword && (
                  <p style={{ fontSize: T.xs, color: T.mutedFg }}>Để trống nếu giữ nguyên mật khẩu đang dùng.</p>
                )}
              </Field>

              {result?.ok && (
                <div className="rounded-xl p-3 flex gap-2"
                  style={{ backgroundColor: T.successSubtle, border: `1px solid ${T.successBorder}` }}>
                  <CheckCircle2 className="size-4 shrink-0 mt-0.5" style={{ color: T.successText }} />
                  <div>
                    <p style={{ fontSize: T.sm, fontWeight: T.fw_medium, color: T.successText }}>Kết nối email thành công</p>
                    <p style={{ fontSize: T.xs, color: T.successText, lineHeight: 1.5 }}>
                      Email đã sẵn sàng để sử dụng trên NetEvent.
                    </p>
                  </div>
                </div>
              )}
              {result && !result.ok && <Notice>{result.error}</Notice>}
            </>
          )}
        </div>

        <div className="px-5 py-4 flex justify-end gap-2" style={{ borderTop: `1px solid ${T.border}` }}>
          {step === 1 ? (
            <>
              <Button variant="outline" onClick={onClose}>Hủy</Button>
              <Button disabled={!!step1Error} onClick={() => setStep(2)} title={step1Error}>Tiếp tục</Button>
            </>
          ) : (
            <>
              <Button variant="outline" onClick={() => setStep(1)}>Quay lại</Button>
              {result?.ok
                ? <Button onClick={save}>Lưu cấu hình</Button>
                : <Button disabled={checking} onClick={check}>{checking ? "Đang kiểm tra..." : "Kiểm tra kết nối"}</Button>}
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}

// ── Gửi email thử ────────────────────────────────────────────────────────────

function TestEmailDialog({ from, onClose }: { from: string; onClose: () => void }) {
  const [to, setTo] = useState(ACCOUNT_EMAIL);
  const send = () => {
    if (!isEmail(to)) return;
    onClose();
    toast.success("Email thử đã được gửi", { description: `${from} → ${to.trim()}` });
  };
  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-[420px]">
        <DialogHeader>
          <DialogTitle style={{ fontSize: T.base }}>Gửi email thử</DialogTitle>
          <DialogDescription style={{ fontSize: T.xs }}>
            Kết nối được không có nghĩa thư vào đúng hộp thư đến — gửi thử một lần cho chắc.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-3">
          <Field label="Email nhận thử" required>
            <Input type="email" value={to} onChange={(e) => setTo(e.target.value)} aria-label="Email nhận thử" autoFocus />
          </Field>
          <div className="rounded-xl p-3" style={{ backgroundColor: T.secondary }}>
            <p style={{ fontSize: T.xs, color: T.mutedFg }}>Email sẽ được gửi từ</p>
            <p className="truncate" style={{ fontSize: T.sm, color: T.foreground, marginTop: 2 }}>{from}</p>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Hủy</Button>
          <Button disabled={!isEmail(to)} onClick={send}>
            <Send className="size-4" /> Gửi thử
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ── Mảnh dùng lại ────────────────────────────────────────────────────────────

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label>{label} {required && <span aria-label="bắt buộc" style={{ color: "currentColor", opacity: 0.75 }}>*</span>}</Label>
      {children}
    </div>
  );
}

function Notice({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-xl p-3 flex gap-2"
      style={{ backgroundColor: T.warningSubtle, border: `1px solid ${T.warningBorder}` }}>
      <AlertTriangle className="size-4 shrink-0 mt-0.5" style={{ color: T.warningText }} />
      <p style={{ fontSize: T.xs, color: T.warningText, lineHeight: 1.5 }}>{children}</p>
    </div>
  );
}

function LinkButton({ onClick, children }: { onClick: () => void; children: React.ReactNode }) {
  return (
    <button type="button" data-pill="off" onClick={onClick}
      className="cursor-pointer transition-opacity hover:opacity-70"
      style={{ background: "none", border: "none", padding: 0, fontSize: T.xs, fontWeight: T.fw_medium, color: T.primary }}>
      {children}
    </button>
  );
}

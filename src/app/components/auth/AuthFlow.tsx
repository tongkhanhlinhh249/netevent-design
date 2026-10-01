import * as React from "react";
import { useState, useEffect } from "react";
import { Eye, EyeOff, ArrowLeft, Mail, Lock, LogIn, User, CheckCircle2, AlertCircle, RotateCcw } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "../ui/dialog";
import { cn } from "../ui/utils";
import { toast } from "sonner";

type AuthScreen = "start" | "password" | "register" | "otp-register" | "forgot-email" | "otp-reset" | "new-password" | "success";

interface AuthFlowProps {
  /** `name` có khi tài khoản vừa tạo bằng Google; tài khoản demo dùng tên sẵn có theo vai trò. */
  onLoginSuccess: (role: "owner" | "admin" | "staff", name?: string) => void;
}

// ── CSS variable tokens ───────────────────────────────────────────────────────

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
  fw_normal:     "var(--font-weight-normal)",
  fw_medium:     "var(--font-weight-medium)",
  fw_semi:       "var(--font-weight-semibold)",
  fw_bold:       "var(--font-weight-bold)",
  xs:   "var(--text-xs)",
  sm:   "var(--text-sm)",
  base: "var(--text-base)",
  lg:   "var(--text-lg)",
  xl:   "var(--text-xl)",
  "2xl":"var(--text-2xl)",
};

type Role = "owner" | "admin" | "staff";

/** Tài khoản demo có sẵn. Google đăng nhập vào đúng tài khoản trùng email. */
const DEMO_USERS: Record<string, { password: string; role: Role }> = {
  "owner@netevent.vn": { password: "password123", role: "owner" },
  "admin@netevent.vn": { password: "password123", role: "admin" },
  "staff@netevent.vn": { password: "password123", role: "staff" },
};

/** Tài khoản Google hiện trong hộp chọn của bản prototype. */
const GOOGLE_ACCOUNTS = [
  { name: "Nguyễn Thị Lan", email: "owner@netevent.vn" },
  { name: "Trần Minh Tú",   email: "tu.tran@gmail.com" },
];

// ── Google ───────────────────────────────────────────────────────────────────

function GoogleIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden>
      <path fill="#FFC107" d="M43.6 20.1H42V20H24v8h11.3c-1.6 4.7-6.1 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 8 3l5.7-5.7C34 6.1 29.3 4 24 4 13 4 4 13 4 24s9 20 20 20 20-9 20-20c0-1.3-.1-2.6-.4-3.9z" />
      <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 8 3l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
      <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-7.9l-6.5 5C9.5 39.6 16.2 44 24 44z" />
      <path fill="#1976D2" d="M43.6 20.1H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.6-.4-3.9z" />
    </svg>
  );
}

/**
 * Hộp chọn tài khoản thay cho cửa sổ đăng nhập của Google — bản prototype không
 * gọi OAuth thật. Chọn tài khoản là đủ: không mật khẩu, không OTP.
 */
function GoogleAccountDialog({ onPick, onClose }: {
  onPick: (a: { name: string; email: string }) => void;
  onClose: () => void;
}) {
  const [picked, setPicked] = useState<string | null>(null);
  const pick = (a: { name: string; email: string }) => {
    setPicked(a.email);
    window.setTimeout(() => onPick(a), 700);
  };
  return (
    <Dialog open onOpenChange={(o) => !o && !picked && onClose()}>
      <DialogContent className="sm:max-w-[380px] p-0 gap-0 overflow-hidden">
        <div className="px-6 pt-6 pb-4 flex flex-col items-center text-center gap-2">
          <GoogleIcon size={28} />
          <DialogTitle style={{ fontSize: T.lg, fontWeight: T.fw_semi }}>Chọn tài khoản</DialogTitle>
          <DialogDescription style={{ fontSize: T.sm }}>để tiếp tục tới NetEvent</DialogDescription>
        </div>
        <div className="flex flex-col" style={{ borderTop: `1px solid ${T.border}` }}>
          {GOOGLE_ACCOUNTS.map((a) => (
            <button key={a.email} type="button" data-pill="off" disabled={!!picked}
              onClick={() => pick(a)}
              className="flex items-center gap-3 px-6 py-3 text-left transition-colors hover:bg-[var(--secondary)] disabled:cursor-default"
              style={{ background: "none", border: "none", borderBottom: `1px solid ${T.border}` }}>
              <span className="size-9 rounded-full flex items-center justify-center shrink-0"
                style={{ backgroundColor: T.secondary, color: T.foreground, fontSize: T.sm, fontWeight: T.fw_semi }}>
                {a.name.split(" ").pop()?.[0]}
              </span>
              <span className="flex-1 min-w-0">
                <span className="block truncate" style={{ fontSize: T.sm, fontWeight: T.fw_medium, color: T.foreground }}>{a.name}</span>
                <span className="block truncate" style={{ fontSize: T.xs, color: T.mutedFg }}>{a.email}</span>
              </span>
              {picked === a.email && (
                <span style={{ fontSize: T.xs, color: T.mutedFg }}>Đang đăng nhập...</span>
              )}
            </button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ── Shared layout ─────────────────────────────────────────────────────────────

function AuthCard({ children, footer }: { children: React.ReactNode; footer?: React.ReactNode }) {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-4"
      style={{ backgroundColor: T.pageSurface }}>
      <div className="w-full max-w-[380px] rounded-3xl p-6 shadow-xl overflow-hidden"
        style={{ backgroundColor: T.background, border: `1px solid ${T.border}` }}>
        {children}
      </div>
      {footer && <div className="w-full max-w-[380px]">{footer}</div>}
    </div>
  );
}

function BackButton({ onClick, label = "Quay lại" }: { onClick: () => void; label?: string }) {
  return (
    <button onClick={onClick}
      className="flex items-center gap-1 mb-4 transition-colors hover:opacity-80"
      style={{ color: T.mutedFg, fontSize: T.sm }}>
      <ArrowLeft className="size-4" /> {label}
    </button>
  );
}

function ErrorMsg({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl mb-4"
      style={{
        backgroundColor: `color-mix(in srgb, ${T.destructive} 8%, transparent)`,
        border: `1px solid color-mix(in srgb, ${T.destructive} 25%, transparent)`,
      }}>
      <AlertCircle className="size-4 shrink-0" style={{ color: T.destructive }} />
      <p style={{ color: T.destructive, fontSize: T.sm }}>{children}</p>
    </div>
  );
}

// ── OTP Input (6 boxes) ───────────────────────────────────────────────────────

function OTPInput({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const r0 = React.useRef<HTMLInputElement>(null);
  const r1 = React.useRef<HTMLInputElement>(null);
  const r2 = React.useRef<HTMLInputElement>(null);
  const r3 = React.useRef<HTMLInputElement>(null);
  const r4 = React.useRef<HTMLInputElement>(null);
  const r5 = React.useRef<HTMLInputElement>(null);
  const refs = [r0, r1, r2, r3, r4, r5];

  const handleKey = (i: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      if (!value[i] && i > 0) { refs[i - 1].current?.focus(); onChange(value.slice(0, i - 1)); }
      else onChange(value.slice(0, i) + value.slice(i + 1));
    }
  };
  const handleChange = (i: number, ch: string) => {
    if (!/^\d?$/.test(ch)) return;
    onChange((value.slice(0, i) + ch + value.slice(i + 1)).slice(0, 6));
    if (ch && i < 5) refs[i + 1].current?.focus();
  };
  const handlePaste = (e: React.ClipboardEvent) => {
    const p = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    onChange(p);
    if (p.length > 0) refs[Math.min(p.length, 5)].current?.focus();
    e.preventDefault();
  };

  return (
    <div className="flex gap-2 justify-center">
      {Array.from({ length: 6 }).map((_, i) => (
        <input key={i} ref={refs[i]} type="text" inputMode="numeric" maxLength={1}
          value={value[i] ?? ""}
          onChange={(e) => handleChange(i, e.target.value)}
          onKeyDown={(e) => handleKey(i, e)} onPaste={handlePaste}
          className="w-12 h-14 text-center rounded-xl outline-none transition-all"
          style={{
            fontSize: T.xl,
            fontWeight: value[i] ? T.fw_semi : T.fw_normal,
            border: `2px solid ${value[i] ? T.primary : T.border}`,
            backgroundColor: value[i] ? T.background : "var(--input-background)",
            color: T.foreground,
          }}
        />
      ))}
    </div>
  );
}

// ── Countdown ─────────────────────────────────────────────────────────────────

function useCountdown(seconds: number) {
  const [remaining, setRemaining] = useState(seconds);
  useEffect(() => {
    if (remaining <= 0) return;
    const t = setTimeout(() => setRemaining((r) => r - 1), 1000);
    return () => clearTimeout(t);
  }, [remaining]);
  return { remaining, reset: () => setRemaining(seconds) };
}

// ── BẮT ĐẦU: một ô email cho cả đăng nhập lẫn đăng ký ────────────────────────

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Tiêu đề của mỗi bước: biểu tượng trong vòng tròn, tiêu đề, một dòng phụ. */
function CardHeading({ icon: Icon, title, sub }: { icon: React.ElementType; title: string; sub?: React.ReactNode }) {
  return (
    <div className="mb-5">
      <div className="size-14 rounded-full flex items-center justify-center mb-4" style={{ backgroundColor: T.secondary }}>
        <Icon className="size-6" style={{ color: T.mutedFg }} />
      </div>
      <h1 style={{ color: T.foreground, fontSize: T.xl, fontWeight: T.fw_semi, lineHeight: 1.3 }}>{title}</h1>
      {sub && <p style={{ color: T.mutedFg, fontSize: T.sm, marginTop: 4 }}>{sub}</p>}
    </div>
  );
}

/** Email đã nhập ở bước trước, kèm lối quay lại để đổi. */
function EmailLine({ email, onChange }: { email: string; onChange: () => void }) {
  return (
    <span>
      <span style={{ color: T.foreground, fontWeight: T.fw_medium }}>{email}</span>{" · "}
      <button type="button" onClick={onChange} className="hover:underline" style={{ color: T.primary, fontSize: "inherit" }}>Đổi</button>
    </span>
  );
}

function PasswordInput({ id, value, onChange, placeholder, invalid, autoFocus }: {
  id: string; value: string; onChange: (v: string) => void; placeholder: string; invalid?: boolean; autoFocus?: boolean;
}) {
  const [shown, setShown] = useState(false);
  return (
    <div className="relative">
      <Input id={id} type={shown ? "text" : "password"} placeholder={placeholder} className="pr-9"
        value={value} onChange={(e) => onChange(e.target.value)} aria-invalid={invalid} autoFocus={autoFocus} />
      <button type="button" aria-label={shown ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
        className="absolute right-3 top-1/2 -translate-y-1/2 transition-opacity hover:opacity-70"
        style={{ color: T.mutedFg }} onClick={() => setShown(!shown)}>
        {shown ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
      </button>
    </div>
  );
}

function StartScreen({ email, onEmail, onContinue, onGoogle, onDemo }: {
  email: string; onEmail: (v: string) => void;
  onContinue: (email: string) => void; onGoogle: () => void; onDemo: () => void;
}) {
  const [error, setError] = useState("");
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const v = email.trim().toLowerCase();
    if (!EMAIL_RE.test(v)) { setError(v ? "Email không hợp lệ." : "Vui lòng nhập email."); return; }
    onContinue(v);
  };
  return (
    <AuthCard footer={<DemoHint onDemo={onDemo} />}>
      <CardHeading icon={LogIn} title="Chào mừng đến với NetEvent" sub="Vui lòng đăng nhập hoặc đăng ký bên dưới." />
      <form onSubmit={submit} className="flex flex-col gap-3">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" placeholder="email@congty.vn" autoFocus value={email}
            onChange={(e) => { onEmail(e.target.value); setError(""); }} aria-invalid={!!error} />
          {error && <p style={{ color: T.destructive, fontSize: T.xs }}>{error}</p>}
        </div>
        <Button type="submit" className="w-full" size="lg">Tiếp tục với Email</Button>
      </form>

      {/* Đường kẻ chạy hết bề ngang thẻ, tách lối đăng nhập nhanh khỏi form */}
      <div className="-mx-6 my-5" style={{ borderTop: `1px solid ${T.border}` }} />
      <Button type="button" variant="secondary" size="lg" className="w-full gap-2.5" onClick={onGoogle}>
        <GoogleIcon /> Tiếp tục với Google
      </Button>

      <p className="mt-4 text-center" style={{ color: T.mutedFg, fontSize: T.xs, lineHeight: 1.5 }}>
        Tiếp tục nghĩa là bạn đồng ý với{" "}
        <span style={{ color: T.primary }}>Điều khoản sử dụng</span> và{" "}
        <span style={{ color: T.primary }}>Chính sách bảo mật</span>.
      </p>
    </AuthCard>
  );
}

/** Lối vào nhanh cho người thử prototype; nằm ngoài thẻ để không lẫn vào giao diện thật. */
function DemoHint({ onDemo }: { onDemo: () => void }) {
  return (
    <p className="mt-4 text-center" style={{ color: T.mutedFg, fontSize: T.xs, lineHeight: 1.6 }}>
      Demo: owner / admin / staff @netevent.vn · mật khẩu password123 ·{" "}
      <button type="button" onClick={onDemo} className="hover:underline" style={{ color: T.primary, fontSize: "inherit" }}>Vào thẳng dashboard</button>
    </p>
  );
}

// ── ĐÃ CÓ TÀI KHOẢN: nhập mật khẩu ──────────────────────────────────────────

function PasswordScreen({ email, onBack, onForgot, onLoginSuccess }: {
  email: string; onBack: () => void; onForgot: () => void; onLoginSuccess: (role: Role) => void;
}) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) { setError("Vui lòng nhập mật khẩu."); return; }
    setLoading(true);
    setTimeout(() => {
      const u = DEMO_USERS[email];
      if (!u || u.password !== password) { setError("Mật khẩu không chính xác."); setLoading(false); return; }
      onLoginSuccess(u.role);
    }, 700);
  };
  return (
    <AuthCard>
      <CardHeading icon={Lock} title="Chào mừng trở lại" sub={<EmailLine email={email} onChange={onBack} />} />
      <form onSubmit={submit} className="flex flex-col gap-3">
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Mật khẩu</Label>
            <button type="button" onClick={onForgot} className="hover:underline" style={{ color: T.primary, fontSize: T.xs }}>
              Quên mật khẩu?
            </button>
          </div>
          <PasswordInput id="password" value={password} placeholder="Nhập mật khẩu" autoFocus invalid={!!error}
            onChange={(v) => { setPassword(v); setError(""); }} />
          {error && <p style={{ color: T.destructive, fontSize: T.xs }}>{error}</p>}
        </div>
        <Button type="submit" className="w-full" size="lg" disabled={loading}>
          {loading ? "Đang đăng nhập..." : "Đăng nhập"}
        </Button>
      </form>
    </AuthCard>
  );
}

// ── CHƯA CÓ TÀI KHOẢN: tên và mật khẩu ──────────────────────────────────────

function RegisterScreen({ email, onBack, onSubmit }: {
  email: string; onBack: () => void; onSubmit: (name: string) => void;
}) {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (!name.trim()) errs.name = "Vui lòng nhập họ và tên.";
    if (password.length < 8) errs.password = "Mật khẩu cần có tối thiểu 8 ký tự.";
    setErrors(errs);
    if (Object.keys(errs).length) return;
    setLoading(true);
    setTimeout(() => onSubmit(name.trim()), 700);
  };
  return (
    <AuthCard>
      <CardHeading icon={User} title="Tạo tài khoản" sub={<EmailLine email={email} onChange={onBack} />} />
      <form onSubmit={submit} className="flex flex-col gap-3">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="name">Họ và tên</Label>
          <Input id="name" placeholder="Nguyễn Văn A" autoFocus value={name} aria-invalid={!!errors.name}
            onChange={(e) => setName(e.target.value)} />
          {errors.name && <p style={{ color: T.destructive, fontSize: T.xs }}>{errors.name}</p>}
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="password">Mật khẩu</Label>
          <PasswordInput id="password" value={password} placeholder="Tối thiểu 8 ký tự" invalid={!!errors.password}
            onChange={setPassword} />
          {errors.password && <p style={{ color: T.destructive, fontSize: T.xs }}>{errors.password}</p>}
        </div>
        <Button type="submit" className="w-full" size="lg" disabled={loading}>
          {loading ? "Đang xử lý..." : "Tạo tài khoản"}
        </Button>
      </form>
    </AuthCard>
  );
}

// ── OTP ───────────────────────────────────────────────────────────────────────

function OTPScreen({ email, title, subtitle, ctaLabel, onVerify, onBack, onChangeEmail }:
  { email: string; title: string; subtitle: string; ctaLabel: string; onVerify: (otp: string) => void; onBack: () => void; onChangeEmail: () => void }) {
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const { remaining, reset } = useCountdown(60);

  const handleVerify = () => {
    if (otp.length < 6) { setError("Vui lòng nhập đủ 6 chữ số OTP."); return; }
    if (otp !== "123456") {
      const next = attempts + 1; setAttempts(next);
      setError(next >= 5
        ? "Bạn đã nhập sai quá số lần cho phép. Vui lòng gửi lại mã mới."
        : `Mã OTP không chính xác. Vui lòng kiểm tra lại. (${next}/5)`);
      return;
    }
    setLoading(true);
    setTimeout(() => onVerify(otp), 800);
  };

  return (
    <AuthCard>
      <BackButton onClick={onBack} />
      <CardHeading icon={Mail} title={title}
        sub={<>{subtitle} <span style={{ color: T.foreground, fontWeight: T.fw_medium }}>{email}</span></>} />

      {error && <ErrorMsg>{error}</ErrorMsg>}
      <OTPInput value={otp} onChange={setOtp} />

      <p className="text-center mt-3 mb-4" style={{ color: T.mutedFg, fontSize: T.xs }}>
        Demo: nhập <span style={{ fontWeight: T.fw_semi }}>123456</span> để xác thực
      </p>

      <Button className="w-full" size="lg" onClick={handleVerify} disabled={loading || otp.length < 6}>
        {loading ? "Đang xác thực..." : ctaLabel}
      </Button>

      <div className="mt-4 flex flex-col items-center gap-2">
        <button disabled={remaining > 0 || attempts >= 5}
          onClick={() => { if (remaining > 0) return; setOtp(""); setError(""); setAttempts(0); reset(); }}
          className={cn("flex items-center gap-1.5 transition-colors", remaining > 0 || attempts >= 5 ? "cursor-not-allowed" : "hover:underline")}
          style={{ fontSize: T.sm, color: remaining > 0 || attempts >= 5 ? T.mutedFg : T.primary }}>
          <RotateCcw className="size-3.5" />
          {remaining > 0 ? `Gửi lại mã sau ${remaining}s` : "Gửi lại mã"}
        </button>
        <button style={{ fontSize: T.sm, color: T.mutedFg }} className="hover:opacity-70 transition-opacity"
          onClick={onChangeEmail}>Đổi email</button>
      </div>
    </AuthCard>
  );
}

// ── FORGOT PASSWORD — EMAIL ───────────────────────────────────────────────────

function ForgotEmailScreen({ initialEmail, onNavigate, onEmailSet }:
  { initialEmail: string; onNavigate: (s: AuthScreen) => void; onEmailSet: (email: string) => void }) {
  const [email, setEmail] = useState(initialEmail);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) { setError("Vui lòng nhập email."); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setError("Email không hợp lệ."); return; }
    setLoading(true);
    setTimeout(() => { onEmailSet(email); onNavigate("otp-reset"); }, 800);
  };

  return (
    <AuthCard>
      <BackButton onClick={() => onNavigate("password")} label="Quay lại đăng nhập" />
      <CardHeading icon={Lock} title="Quên mật khẩu" sub="Nhập email đã đăng ký để nhận mã đặt lại mật khẩu." />
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="reset-email">Email</Label>
          <Input id="reset-email" type="email" placeholder="email@congty.vn"
            value={email} onChange={(e) => { setEmail(e.target.value); setError(""); }} aria-invalid={!!error} />
          {error && <p style={{ color: T.destructive, fontSize: T.xs }}>{error}</p>}
        </div>
        <Button type="submit" className="w-full" size="lg" disabled={loading}>
          {loading ? "Đang gửi..." : "Gửi mã xác nhận"}
        </Button>
      </form>
    </AuthCard>
  );
}

// ── NEW PASSWORD ──────────────────────────────────────────────────────────────

function NewPasswordScreen({ onNavigate }: { onNavigate: (s: AuthScreen) => void }) {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (password.length < 8) errs.password = "Mật khẩu cần có tối thiểu 8 ký tự.";
    if (confirm !== password) errs.confirm = "Mật khẩu xác nhận không khớp.";
    setErrors(errs);
    if (Object.keys(errs).length) return;
    setLoading(true);
    setTimeout(() => onNavigate("success"), 800);
  };

  return (
    <AuthCard>
      <CardHeading icon={Lock} title="Tạo mật khẩu mới" sub="Mật khẩu mới phải có ít nhất 8 ký tự." />
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        {(["password", "confirm"] as const).map((id) => (
          <div key={id} className="flex flex-col gap-1.5">
            <Label htmlFor={id}>{id === "password" ? "Mật khẩu mới" : "Xác nhận mật khẩu mới"}</Label>
            <PasswordInput id={id} value={id === "password" ? password : confirm}
              onChange={id === "password" ? setPassword : setConfirm}
              placeholder={id === "password" ? "Tối thiểu 8 ký tự" : "Nhập lại mật khẩu"} invalid={!!errors[id]} />
            {errors[id] && <p style={{ color: T.destructive, fontSize: T.xs }}>{errors[id]}</p>}
          </div>
        ))}
        <Button type="submit" className="w-full" size="lg" disabled={loading}>
          {loading ? "Đang cập nhật..." : "Cập nhật mật khẩu"}
        </Button>
      </form>
    </AuthCard>
  );
}

// ── SUCCESS ───────────────────────────────────────────────────────────────────

function SuccessScreen({ onNavigate }: { onNavigate: (s: AuthScreen) => void }) {
  return (
    <AuthCard>
      <div className="flex flex-col items-center text-center">
        <div className="size-14 rounded-full flex items-center justify-center mb-4"
          style={{ backgroundColor: T.successSubtle, border: `1px solid ${T.successBorder}` }}>
          <CheckCircle2 className="size-6" style={{ color: T.successText }} />
        </div>
        <h1 style={{ color: T.foreground, fontSize: T.xl, fontWeight: T.fw_semi }} className="mb-1">Đã cập nhật mật khẩu</h1>
        <p style={{ color: T.mutedFg, fontSize: T.sm }} className="mb-5">
          Mật khẩu của bạn đã được đặt lại thành công. Vui lòng đăng nhập với mật khẩu mới.
        </p>
        <Button className="w-full" size="lg" onClick={() => onNavigate("password")}>Đăng nhập ngay</Button>
      </div>
    </AuthCard>
  );
}

// ── Root ──────────────────────────────────────────────────────────────────────

export function AuthFlow({ onLoginSuccess }: AuthFlowProps) {
  const [screen, setScreen] = useState<AuthScreen>("start");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [googleOpen, setGoogleOpen] = useState(false);
  const nav = (s: AuthScreen) => setScreen(s);

  // Một ô email cho cả hai việc: email đã có tài khoản thì hỏi mật khẩu, chưa có
  // thì mở bước tạo tài khoản. Người dùng không phải tự đoán mình thuộc nhánh nào.
  const continueWithEmail = (value: string) => {
    setEmail(value);
    nav(DEMO_USERS[value] ? "password" : "register");
  };

  // Google cũng vậy: có tài khoản thì vào thẳng, chưa có thì tạo luôn. Google đã
  // xác minh email nên bỏ qua bước OTP.
  const continueWithGoogle = (account: { name: string; email: string }) => {
    setGoogleOpen(false);
    const existing = DEMO_USERS[account.email];
    if (existing) { onLoginSuccess(existing.role); return; }
    toast.success("Đã tạo tài khoản NetEvent", { description: `Đăng ký bằng Google: ${account.email}` });
    onLoginSuccess("owner", account.name);
  };

  const content = (() => {
    switch (screen) {
      case "start": return (
        <StartScreen email={email} onEmail={setEmail} onContinue={continueWithEmail}
          onGoogle={() => setGoogleOpen(true)} onDemo={() => onLoginSuccess("owner")} />
      );
      case "password": return (
        <PasswordScreen email={email} onBack={() => nav("start")} onForgot={() => nav("forgot-email")}
          onLoginSuccess={onLoginSuccess} />
      );
      case "register": return (
        <RegisterScreen email={email} onBack={() => nav("start")}
          onSubmit={(n) => { setName(n); nav("otp-register"); }} />
      );
      case "otp-register": return (
        <OTPScreen email={email} title="Xác thực email" subtitle="Chúng tôi đã gửi mã OTP đến email:" ctaLabel="Xác thực tài khoản"
          onVerify={() => onLoginSuccess("owner", name)} onBack={() => nav("register")} onChangeEmail={() => nav("start")} />
      );
      case "forgot-email": return <ForgotEmailScreen initialEmail={email} onNavigate={nav} onEmailSet={setEmail} />;
      case "otp-reset": return (
        <OTPScreen email={email} title="Xác nhận email" subtitle="Chúng tôi đã gửi mã OTP đặt lại mật khẩu đến email:" ctaLabel="Xác nhận mã OTP"
          onVerify={() => nav("new-password")} onBack={() => nav("forgot-email")} onChangeEmail={() => nav("forgot-email")} />
      );
      case "new-password": return <NewPasswordScreen onNavigate={nav} />;
      case "success": return <SuccessScreen onNavigate={nav} />;
    }
  })();

  return <>
    {content}
    {googleOpen && <GoogleAccountDialog onPick={continueWithGoogle} onClose={() => setGoogleOpen(false)} />}
  </>;
}

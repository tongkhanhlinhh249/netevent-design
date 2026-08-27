import * as React from "react";
import { useState, useEffect } from "react";
import { Eye, EyeOff, ArrowLeft, Mail, Lock, User, Phone, Building2, CheckCircle2, AlertCircle, RotateCcw } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Checkbox } from "../ui/checkbox";
import { cn } from "../ui/utils";

type AuthScreen = "login" | "register" | "otp-register" | "forgot-email" | "otp-reset" | "new-password" | "success";

interface AuthFlowProps { onLoginSuccess: (role: "owner" | "admin" | "staff") => void; }

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

// ── Shared layout ─────────────────────────────────────────────────────────────

function AuthCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4"
      style={{ backgroundColor: T.pageSurface }}>
      <div className="w-full max-w-md rounded-2xl p-8 shadow-lg"
        style={{ backgroundColor: T.background, border: `1px solid ${T.border}` }}>
        {children}
      </div>
    </div>
  );
}

function NetEventLogo() {
  return (
    <div className="flex items-center gap-2 mb-8">
      <div className="size-9 rounded-xl flex items-center justify-center"
        style={{ backgroundColor: T.primary }}>
        <span style={{ color: T.primaryFg, fontWeight: T.fw_bold, fontSize: T.sm }}>N</span>
      </div>
      <span style={{ fontWeight: T.fw_semi, fontSize: T.lg, color: T.foreground }}>NetEvent</span>
    </div>
  );
}

function BackButton({ onClick, label = "Quay lại" }: { onClick: () => void; label?: string }) {
  return (
    <button onClick={onClick}
      className="flex items-center gap-1 mb-6 transition-colors hover:opacity-80"
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

// ── LOGIN ─────────────────────────────────────────────────────────────────────

function LoginScreen({ onNavigate, onLoginSuccess }:
  { onNavigate: (s: AuthScreen) => void; onLoginSuccess: (role: "owner" | "admin" | "staff") => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const USERS: Record<string, { password: string; role: "owner" | "admin" | "staff" }> = {
    "owner@netevent.vn": { password: "password123", role: "owner" },
    "admin@netevent.vn": { password: "password123", role: "admin" },
    "staff@netevent.vn": { password: "password123", role: "staff" },
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); setError("");
    if (!email || !password) { setError("Vui lòng nhập đầy đủ email và mật khẩu."); return; }
    setLoading(true);
    setTimeout(() => {
      const u = USERS[email.toLowerCase()];
      if (!u || u.password !== password) { setError("Email hoặc mật khẩu không chính xác."); setLoading(false); return; }
      onLoginSuccess(u.role);
    }, 800);
  };

  return (
    <AuthCard>
      <NetEventLogo />
      <h1 style={{ color: T.foreground }} className="mb-1">Đăng nhập</h1>
      <p style={{ color: T.mutedFg, fontSize: T.sm }} className="mb-6">
        Chào mừng trở lại! Vui lòng đăng nhập để tiếp tục.
      </p>
      {error && <ErrorMsg>{error}</ErrorMsg>}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="email">Email</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4" style={{ color: T.mutedFg }} />
            <Input id="email" type="email" placeholder="email@company.com" className="pl-9"
              value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="password">Mật khẩu</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4" style={{ color: T.mutedFg }} />
            <Input id="password" type={showPw ? "text" : "password"} placeholder="Nhập mật khẩu" className="pl-9 pr-9"
              value={password} onChange={(e) => setPassword(e.target.value)} />
            <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 transition-opacity hover:opacity-70"
              style={{ color: T.mutedFg }} onClick={() => setShowPw(!showPw)}>
              {showPw ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Checkbox id="remember" checked={remember} onCheckedChange={(v) => setRemember(!!v)} />
            <Label htmlFor="remember" className="cursor-pointer" style={{ color: T.mutedFg, fontSize: T.sm }}>Ghi nhớ đăng nhập</Label>
          </div>
          <button type="button" style={{ color: T.primary, fontSize: T.sm }} className="hover:underline"
            onClick={() => onNavigate("forgot-email")}>Quên mật khẩu?</button>
        </div>
        <Button type="submit" className="w-full" size="lg" disabled={loading}>
          {loading ? "Đang đăng nhập..." : "Đăng nhập"}
        </Button>
      </form>

      <p className="mt-6 text-center" style={{ color: T.mutedFg, fontSize: T.sm }}>
        Chưa có tài khoản?{" "}
        <button className="hover:underline" style={{ color: T.primary, fontWeight: T.fw_medium }}
          onClick={() => onNavigate("register")}>Đăng ký ngay</button>
      </p>

      <div className="mt-6 p-3 rounded-xl" style={{ backgroundColor: T.secondary, border: `1px solid ${T.border}` }}>
        <p style={{ color: T.mutedFg, fontSize: T.xs, marginBottom: "6px" }}>
          <span style={{ fontWeight: T.fw_semi }}>Demo:</span>{" "}
          owner / admin / staff @netevent.vn — mật khẩu: password123
        </p>
        <button
          style={{ color: T.primary, fontSize: T.xs, fontWeight: T.fw_medium }}
          className="hover:underline"
          onClick={() => onLoginSuccess("owner")}>
          → Vào thẳng dashboard (demo)
        </button>
      </div>
    </AuthCard>
  );
}

// ── REGISTER ──────────────────────────────────────────────────────────────────

function RegisterScreen({ onNavigate, onEmailSet }:
  { onNavigate: (s: AuthScreen) => void; onEmailSet: (email: string) => void }) {
  const [form, setForm] = useState({ name: "", email: "", phone: "", org: "", password: "", confirm: "", agree: false });
  const [showPw, setShowPw] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Vui lòng nhập họ và tên.";
    if (!form.email) e.email = "Vui lòng nhập email.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Email không hợp lệ.";
    if (!form.phone.trim()) e.phone = "Vui lòng nhập số điện thoại.";
    if (!form.org.trim()) e.org = "Vui lòng nhập tên tổ chức.";
    if (!form.password) e.password = "Vui lòng nhập mật khẩu.";
    else if (form.password.length < 8) e.password = "Mật khẩu cần có tối thiểu 8 ký tự.";
    if (form.confirm !== form.password) e.confirm = "Mật khẩu xác nhận không khớp.";
    if (!form.agree) e.agree = "Vui lòng đồng ý với điều khoản sử dụng.";
    return e;
  };
  const set = (k: keyof typeof form) => (v: string | boolean) => setForm((f) => ({ ...f, [k]: v }));
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate(); setErrors(errs);
    if (Object.keys(errs).length) return;
    setLoading(true);
    setTimeout(() => { onEmailSet(form.email); onNavigate("otp-register"); }, 800);
  };

  const FieldError = ({ name }: { name: string }) => errors[name]
    ? <p style={{ color: T.destructive, fontSize: T.xs }}>{errors[name]}</p> : null;

  const icons: Record<string, React.ReactNode> = {
    name: <User className="size-4" />, email: <Mail className="size-4" />,
    phone: <Phone className="size-4" />, org: <Building2 className="size-4" />,
  };

  return (
    <AuthCard>
      <NetEventLogo />
      <h1 style={{ color: T.foreground }} className="mb-1">Tạo tài khoản</h1>
      <p style={{ color: T.mutedFg, fontSize: T.sm }} className="mb-6">Đăng ký để bắt đầu quản lý sự kiện.</p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {(["name", "email", "phone", "org"] as const).map((id) => (
          <div key={id} className="flex flex-col gap-1.5">
            <Label htmlFor={id}>
              {{ name: "Họ và tên", email: "Email", phone: "Số điện thoại", org: "Tên tổ chức / doanh nghiệp" }[id]}
            </Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: T.mutedFg }}>{icons[id]}</span>
              <Input id={id} type={id === "email" ? "email" : id === "phone" ? "tel" : "text"}
                placeholder={{ name: "Nguyễn Văn A", email: "email@company.com", phone: "0901 234 567", org: "Công ty ABC" }[id]}
                className="pl-9" value={form[id] as string}
                onChange={(e) => set(id)(e.target.value)} aria-invalid={!!errors[id]} />
            </div>
            <FieldError name={id} />
          </div>
        ))}

        {(["password", "confirm"] as const).map((id) => {
          const shown = id === "password" ? showPw : showConfirm;
          const toggle = id === "password" ? () => setShowPw(!showPw) : () => setShowConfirm(!showConfirm);
          return (
            <div key={id} className="flex flex-col gap-1.5">
              <Label htmlFor={id}>{id === "password" ? "Mật khẩu" : "Xác nhận mật khẩu"}</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4" style={{ color: T.mutedFg }} />
                <Input id={id} type={shown ? "text" : "password"}
                  placeholder={id === "password" ? "Tối thiểu 8 ký tự" : "Nhập lại mật khẩu"}
                  className="pl-9 pr-9" value={form[id]} onChange={(e) => set(id)(e.target.value)}
                  aria-invalid={!!errors[id]} />
                <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2"
                  style={{ color: T.mutedFg }} onClick={toggle}>
                  {shown ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
              <FieldError name={id} />
            </div>
          );
        })}

        <div className="flex flex-col gap-1">
          <div className="flex items-start gap-2">
            <Checkbox id="agree" checked={form.agree} onCheckedChange={(v) => set("agree")(!!v)} className="mt-0.5" />
            <Label htmlFor="agree" className="cursor-pointer leading-relaxed" style={{ color: T.mutedFg, fontSize: T.sm }}>
              Tôi đồng ý với{" "}
              <span className="hover:underline" style={{ color: T.primary }}>Điều khoản sử dụng</span>{" "}
              và <span className="hover:underline" style={{ color: T.primary }}>Chính sách bảo mật</span>
            </Label>
          </div>
          <FieldError name="agree" />
        </div>

        <Button type="submit" className="w-full" size="lg" disabled={loading}>
          {loading ? "Đang xử lý..." : "Tạo tài khoản"}
        </Button>
      </form>

      <p className="mt-6 text-center" style={{ color: T.mutedFg, fontSize: T.sm }}>
        Đã có tài khoản?{" "}
        <button className="hover:underline" style={{ color: T.primary, fontWeight: T.fw_medium }}
          onClick={() => onNavigate("login")}>Đăng nhập</button>
      </p>
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
      <div className="flex justify-center mb-6">
        <div className="size-16 rounded-2xl flex items-center justify-center"
          style={{ backgroundColor: `color-mix(in srgb, ${T.primary} 10%, transparent)` }}>
          <Mail className="size-8" style={{ color: T.primary }} />
        </div>
      </div>
      <h1 className="text-center mb-2" style={{ color: T.foreground }}>{title}</h1>
      <p className="text-center mb-2" style={{ color: T.mutedFg, fontSize: T.sm }}>{subtitle}</p>
      <p className="text-center mb-6" style={{ color: T.foreground, fontSize: T.sm, fontWeight: T.fw_semi }}>{email}</p>

      {error && <ErrorMsg>{error}</ErrorMsg>}
      <OTPInput value={otp} onChange={setOtp} />

      <p className="text-center mt-3 mb-6" style={{ color: T.mutedFg, fontSize: T.xs }}>
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

function ForgotEmailScreen({ onNavigate, onEmailSet }:
  { onNavigate: (s: AuthScreen) => void; onEmailSet: (email: string) => void }) {
  const [email, setEmail] = useState("");
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
      <BackButton onClick={() => onNavigate("login")} label="Quay lại đăng nhập" />
      <div className="flex justify-center mb-6">
        <div className="size-16 rounded-2xl flex items-center justify-center"
          style={{ backgroundColor: `color-mix(in srgb, ${T.primary} 10%, transparent)` }}>
          <Lock className="size-8" style={{ color: T.primary }} />
        </div>
      </div>
      <h1 className="text-center mb-2" style={{ color: T.foreground }}>Quên mật khẩu</h1>
      <p className="text-center mb-8" style={{ color: T.mutedFg, fontSize: T.sm }}>
        Nhập email đã đăng ký để nhận mã xác nhận đặt lại mật khẩu.
      </p>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="reset-email">Email</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4" style={{ color: T.mutedFg }} />
            <Input id="reset-email" type="email" placeholder="email@company.com" className="pl-9"
              value={email} onChange={(e) => { setEmail(e.target.value); setError(""); }} aria-invalid={!!error} />
          </div>
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
  const [showPw, setShowPw] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
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
      <div className="flex justify-center mb-6">
        <div className="size-16 rounded-2xl flex items-center justify-center"
          style={{ backgroundColor: `color-mix(in srgb, ${T.primary} 10%, transparent)` }}>
          <Lock className="size-8" style={{ color: T.primary }} />
        </div>
      </div>
      <h1 className="text-center mb-2" style={{ color: T.foreground }}>Tạo mật khẩu mới</h1>
      <p className="text-center mb-8" style={{ color: T.mutedFg, fontSize: T.sm }}>
        Mật khẩu mới phải có ít nhất 8 ký tự.
      </p>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {(["password", "confirm"] as const).map((id) => {
          const shown = id === "password" ? showPw : showConfirm;
          const toggle = id === "password" ? () => setShowPw(!showPw) : () => setShowConfirm(!showConfirm);
          const val = id === "password" ? password : confirm;
          const setVal = id === "password" ? setPassword : setConfirm;
          return (
            <div key={id} className="flex flex-col gap-1.5">
              <Label htmlFor={id}>{id === "password" ? "Mật khẩu mới" : "Xác nhận mật khẩu mới"}</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4" style={{ color: T.mutedFg }} />
                <Input id={id} type={shown ? "text" : "password"}
                  placeholder={id === "password" ? "Tối thiểu 8 ký tự" : "Nhập lại mật khẩu"}
                  className="pl-9 pr-9" value={val} onChange={(e) => setVal(e.target.value)}
                  aria-invalid={!!errors[id]} />
                <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2"
                  style={{ color: T.mutedFg }} onClick={toggle}>
                  {shown ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
              {errors[id] && <p style={{ color: T.destructive, fontSize: T.xs }}>{errors[id]}</p>}
            </div>
          );
        })}
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
      <div className="flex flex-col items-center text-center py-4">
        <div className="size-20 rounded-full flex items-center justify-center mb-6"
          style={{ backgroundColor: T.successSubtle, border: `2px solid ${T.successBorder}` }}>
          <CheckCircle2 className="size-10" style={{ color: T.successText }} />
        </div>
        <h1 style={{ color: T.foreground }} className="mb-2">Mật khẩu đã được cập nhật!</h1>
        <p style={{ color: T.mutedFg, fontSize: T.sm }} className="mb-8">
          Mật khẩu của bạn đã được đặt lại thành công. Vui lòng đăng nhập với mật khẩu mới.
        </p>
        <Button className="w-full" size="lg" onClick={() => onNavigate("login")}>Đăng nhập ngay</Button>
      </div>
    </AuthCard>
  );
}

// ── Root ──────────────────────────────────────────────────────────────────────

export function AuthFlow({ onLoginSuccess }: AuthFlowProps) {
  const [screen, setScreen] = useState<AuthScreen>("login");
  const [email, setEmail] = useState("");
  const nav = (s: AuthScreen) => setScreen(s);

  if (screen === "login") return <LoginScreen onNavigate={nav} onLoginSuccess={onLoginSuccess} />;
  if (screen === "register") return <RegisterScreen onNavigate={nav} onEmailSet={setEmail} />;
  if (screen === "otp-register") return (
    <OTPScreen email={email} title="Xác thực email" subtitle="Chúng tôi đã gửi mã OTP đến email:" ctaLabel="Xác thực tài khoản"
      onVerify={() => nav("login")} onBack={() => nav("register")} onChangeEmail={() => nav("register")} />
  );
  if (screen === "forgot-email") return <ForgotEmailScreen onNavigate={nav} onEmailSet={setEmail} />;
  if (screen === "otp-reset") return (
    <OTPScreen email={email} title="Xác nhận email" subtitle="Chúng tôi đã gửi mã OTP đặt lại mật khẩu đến email:" ctaLabel="Xác nhận mã OTP"
      onVerify={() => nav("new-password")} onBack={() => nav("forgot-email")} onChangeEmail={() => nav("forgot-email")} />
  );
  if (screen === "new-password") return <NewPasswordScreen onNavigate={nav} />;
  if (screen === "success") return <SuccessScreen onNavigate={nav} />;
  return null;
}

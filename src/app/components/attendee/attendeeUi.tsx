import * as React from "react";
import { useEffect, useState } from "react";
import type { EventDraft } from "../dashboard/EventsPage";
import { themePageBg } from "../../data/themes";
import type { GameState, GiftGame } from "../../data/attendeeFlow";
import { shortDateVi } from "../../data/eventFormat";

/**
 * Phần dùng chung cho ba màn của người tham dự (tự check-in, Tổng quan, chọn
 * quà). Người tham dự mở bằng điện thoại sau khi quét QR check-in chung, nên bố
 * cục là một cột ~440px ở giữa, nút cao, ảnh cover và tên sự kiện ở trên cùng.
 */

// ── Tokens ───────────────────────────────────────────────────────────────────

export const T = {
  background:    "var(--background)",
  foreground:    "var(--foreground)",
  border:        "var(--border)",
  primary:       "var(--primary)",
  secondary:     "var(--secondary)",
  mutedFg:       "var(--muted-foreground)",
  successText:   "var(--success-text)",
  successSubtle: "var(--success-subtle)",
  successBorder: "var(--success-border)",
  warningText:   "var(--warning-text)",
  warningSubtle: "var(--warning-subtle)",
  warningBorder: "var(--warning-border)",
  danger:        "#dc2626",
  fw_normal: "var(--font-weight-normal)",
  fw_medium: "var(--font-weight-medium)",
  fw_semi:   "var(--font-weight-semibold)",
  fw_bold:   "var(--font-weight-bold)",
  xs:   "var(--text-xs)",
  sm:   "var(--text-sm)",
  base: "var(--text-base)",
  lg:   "var(--text-lg)",
  xl:   "var(--text-xl)",
  xxl:  "var(--text-2xl)",
};

/** Nút hành động chính trên điện thoại: cao 48px, rộng hết cột. */
export const CTA = "h-12 w-full text-base font-semibold";

export const paths = {
  checkIn:  (eventId: string) => `/tu-check-in?event=${encodeURIComponent(eventId)}`,
  overview: (eventId: string) => `/su-kien-cua-toi?event=${encodeURIComponent(eventId)}`,
  game:     (eventId: string) => `/chon-qua?event=${encodeURIComponent(eventId)}`,
};

// ── Helpers ──────────────────────────────────────────────────────────────────

/** "#1eaaff" + 0.12 → "#1eaaff1f". Màu không phải hex thì trả nguyên. */
export function withAlpha(color: string, alpha: number) {
  let hex = color.trim();
  if (/^#[0-9a-f]{3}$/i.test(hex)) hex = `#${[...hex.slice(1)].map((c) => c + c).join("")}`;
  if (!/^#[0-9a-f]{6}$/i.test(hex)) return color;
  return hex + Math.round(Math.max(0, Math.min(1, alpha)) * 255).toString(16).padStart(2, "0");
}

/** Giờ bắt đầu minigame: "09:00"; khác ngày hôm nay thì kèm ngày. */
export function gameStartLabel(game: GiftGame) {
  const time = game.startAt.slice(11, 16);
  const d = new Date();
  const today = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  const day = game.startAt.slice(0, 10);
  return day === today ? time : `${time} ngày ${shortDateVi(day) ?? day}`;
}

/** Thông báo cho người tham dự khi minigame chưa cho chơi — đúng câu chữ trong tài liệu nghiệp vụ. */
export function closedGameMessage(state: GameState, game: GiftGame | null): string | null {
  switch (state) {
    case "upcoming": return game ? `Minigame chưa bắt đầu. Vui lòng quay lại lúc ${gameStartLabel(game)}.` : null;
    case "paused":   return "Minigame đang tạm dừng. Vui lòng quay lại sau.";
    case "ended":    return "Minigame đã kết thúc. Cảm ơn bạn đã tham gia sự kiện.";
    case "soldout":  return "Quà tặng của Minigame đã được phát hết. Cảm ơn bạn đã tham gia sự kiện.";
    default:         return null;
  }
}

/** Minigame có hiện với người tham dự không (chưa tạo hoặc còn nháp thì không). */
export const gameVisible = (state: GameState) => state !== "none" && state !== "draft";

/** Thời điểm hiện tại, cập nhật định kỳ để trạng thái theo giờ (chưa bắt đầu → đang diễn ra) tự đổi. */
export function useNow(intervalMs = 15_000) {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const t = window.setInterval(() => setNow(new Date()), intervalMs);
    return () => window.clearInterval(t);
  }, [intervalMs]);
  return now;
}

export function useDocumentTitle(title: string) {
  useEffect(() => {
    const prev = document.title;
    document.title = title;
    return () => { document.title = prev; };
  }, [title]);
}

// ── Animations ───────────────────────────────────────────────────────────────

const ATTENDEE_CSS = `
@keyframes ag-float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-6px); } }
@keyframes ag-shake { 0%, 100% { transform: rotate(0); } 20% { transform: rotate(-7deg); } 40% { transform: rotate(6deg); } 60% { transform: rotate(-4deg); } 80% { transform: rotate(3deg); } }
@keyframes ag-lid { 0% { transform: translate(0, 0) rotate(0); opacity: 1; } 60% { opacity: 1; } 100% { transform: translate(-14%, -120%) rotate(-28deg); opacity: 0; } }
@keyframes ag-rise { 0% { transform: translate(-50%, 30%) scale(0.3); opacity: 0; } 100% { transform: translate(-50%, -62%) scale(1); opacity: 1; } }
@keyframes ag-rays { 0% { transform: scale(0.4) rotate(0); opacity: 0; } 40% { opacity: 1; } 100% { transform: scale(1) rotate(60deg); opacity: 0.9; } }
@keyframes ag-pop { 0% { transform: scale(0.6); opacity: 0; } 70% { transform: scale(1.06); opacity: 1; } 100% { transform: scale(1); } }
@keyframes ag-rise-in { 0% { transform: translateY(12px); opacity: 0; } 100% { transform: translateY(0); opacity: 1; } }
@keyframes ag-dot { 0%, 80%, 100% { opacity: 0.25; transform: scale(0.8); } 40% { opacity: 1; transform: scale(1); } }
@keyframes ag-spark { 0% { transform: translate(0, 0) scale(0); opacity: 1; } 100% { transform: translate(var(--dx), var(--dy)) scale(1); opacity: 0; } }
@keyframes ag-spin { to { transform: rotate(360deg); } }
.ag-float { animation: ag-float 2.6s ease-in-out infinite; }
.ag-shake { animation: ag-shake 0.55s ease-in-out infinite; }
.ag-lid-open { animation: ag-lid 0.7s cubic-bezier(.3,.7,.4,1) forwards; }
.ag-rise { animation: ag-rise 0.8s cubic-bezier(.2,.9,.3,1.2) 0.25s both; }
.ag-rays { animation: ag-rays 1.1s ease-out forwards; }
.ag-pop { animation: ag-pop 0.5s cubic-bezier(.2,.9,.3,1.2) both; }
.ag-rise-in { animation: ag-rise-in 0.35s ease-out both; }
.ag-dot { animation: ag-dot 1s ease-in-out infinite; }
.ag-spark { animation: ag-spark 0.9s ease-out 0.2s both; }
.ag-spin { animation: ag-spin 0.8s linear infinite; }
@media (prefers-reduced-motion: reduce) {
  .ag-float, .ag-shake, .ag-rays, .ag-dot, .ag-spark { animation: none !important; }
  .ag-lid-open, .ag-rise, .ag-pop, .ag-rise-in { animation-duration: 0.01s !important; animation-delay: 0s !important; }
}
`;

// ── Layout ───────────────────────────────────────────────────────────────────

export function coverBackground(event: EventDraft) {
  return event.coverImage
    ? `center / cover no-repeat url("${event.coverImage}")`
    : event.cover || "linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%)";
}

/**
 * Khung trang: cover + tên sự kiện ở trên, nội dung là các thẻ xếp dọc.
 * `compact` thu phần đầu thành một dòng để màn chọn quà thấy ngay ba hộp.
 */
export function AttendeeShell({ event, subtitle, compact = false, children }: {
  event: EventDraft; subtitle?: React.ReactNode; compact?: boolean; children: React.ReactNode;
}) {
  const name = event.name?.trim() || "Sự kiện";
  return (
    <div className="min-h-screen" style={{ backgroundColor: themePageBg(event.theme), color: T.foreground }}>
      <style>{ATTENDEE_CSS}</style>
      <div className="mx-auto w-full max-w-[440px] px-4 pt-4 pb-10 flex flex-col gap-4">
        {compact ? (
          <header className="flex items-center gap-3 min-w-0">
            <span className="size-11 shrink-0" style={{ background: coverBackground(event), borderRadius: 12 }} aria-hidden />
            <div className="min-w-0">
              <p className="truncate" style={{ fontSize: T.sm, fontWeight: T.fw_semi }}>{name}</p>
              {subtitle && <p className="truncate" style={{ fontSize: T.xs, color: T.mutedFg, marginTop: 2 }}>{subtitle}</p>}
            </div>
          </header>
        ) : (
          <header className="relative overflow-hidden flex flex-col justify-end"
            style={{ background: coverBackground(event), borderRadius: 20, aspectRatio: "16 / 9", minHeight: 170 }}>
            <div className="absolute inset-0" aria-hidden
              style={{ background: "linear-gradient(180deg, rgba(0,0,0,0) 30%, rgba(0,0,0,0.62) 100%)" }} />
            <div className="relative p-4">
              <h1 style={{ fontSize: T.xl, fontWeight: T.fw_bold, color: "#fff", lineHeight: 1.3 }}>{name}</h1>
              {subtitle && <p style={{ fontSize: T.sm, color: "rgba(255,255,255,0.85)", marginTop: 4 }}>{subtitle}</p>}
            </div>
          </header>
        )}
        {children}
        <p className="text-center mt-2" style={{ fontSize: T.xs, color: T.mutedFg }}>Vận hành bởi NetEvent</p>
      </div>
    </div>
  );
}

export function Card({ children, className = "", style }: {
  children: React.ReactNode; className?: string; style?: React.CSSProperties;
}) {
  return (
    <section className={`p-5 ${className}`}
      style={{ backgroundColor: T.background, border: `1px solid ${T.border}`, borderRadius: 20,
        boxShadow: "0 1px 2px rgba(15,23,42,0.04)", ...style }}>
      {children}
    </section>
  );
}

const TONES = {
  info:    { color: "#0369a1",     bg: "rgba(2,132,199,0.1)" },
  success: { color: T.successText, bg: T.successSubtle },
  warning: { color: T.warningText, bg: T.warningSubtle },
  danger:  { color: T.danger,      bg: "rgba(220,38,38,0.08)" },
  muted:   { color: T.mutedFg,     bg: T.secondary },
} as const;

export type Tone = keyof typeof TONES;

/** Thẻ thông báo trạng thái: biểu tượng tròn, tiêu đề, nội dung, nút hành động. */
export function Notice({ icon, tone = "muted", title, children, actions }: {
  icon: React.ReactNode; tone?: Tone; title?: React.ReactNode; children?: React.ReactNode; actions?: React.ReactNode;
}) {
  const t = TONES[tone];
  return (
    <Card className="flex flex-col items-center text-center ag-rise-in">
      <span className="size-14 rounded-full flex items-center justify-center" style={{ backgroundColor: t.bg, color: t.color }}>
        {icon}
      </span>
      {title && <p className="mt-4" style={{ fontSize: T.lg, fontWeight: T.fw_semi, lineHeight: 1.4 }}>{title}</p>}
      {children && <div className="mt-2" style={{ fontSize: T.base, color: T.mutedFg, lineHeight: 1.55 }}>{children}</div>}
      {actions && <div className="mt-5 w-full flex flex-col gap-2.5">{actions}</div>}
    </Card>
  );
}

/** Nhãn nhỏ viết hoa phía trên tiêu đề thẻ. */
export function Eyebrow({ children, color = T.mutedFg }: { children: React.ReactNode; color?: string }) {
  return (
    <p style={{ fontSize: T.xs, fontWeight: T.fw_bold, letterSpacing: "0.08em", textTransform: "uppercase", color }}>
      {children}
    </p>
  );
}

/** Ảnh quà: emoji hoặc data URL / URL ảnh. */
export function GiftImage({ image, name, size = 64 }: { image: string; name: string; size?: number }) {
  if (/^(data:|https?:|blob:|\/)/.test(image)) {
    return <img src={image} alt={name} width={size} height={size}
      style={{ width: size, height: size, objectFit: "cover", borderRadius: Math.round(size / 5) }} />;
  }
  return <span role="img" aria-label={name} style={{ fontSize: Math.round(size * 0.78), lineHeight: 1 }}>{image}</span>;
}

/** Ba chấm nhấp nháy khi đang chờ. */
export function WaitingDots({ color = "currentColor" }: { color?: string }) {
  return (
    <span className="inline-flex items-center gap-1" aria-hidden>
      {[0, 1, 2].map((i) => (
        <span key={i} className="ag-dot size-1.5 rounded-full" style={{ backgroundColor: color, animationDelay: `${i * 0.15}s` }} />
      ))}
    </span>
  );
}

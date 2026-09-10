import * as React from "react";
import type { GameState, GiftGame } from "../../data/attendeeFlow";

/**
 * Phần dùng chung của minigame "Chọn quà ngẫu nhiên" trong trang quản trị:
 * token, nhãn trạng thái, ảnh quà và giá trị mặc định khi tạo mới.
 */

export const T = {
  pageSurface:   "var(--page-surface)",
  background:    "var(--background)",
  foreground:    "var(--foreground)",
  border:        "var(--border)",
  primary:       "var(--primary)",
  secondary:     "var(--secondary)",
  mutedFg:       "var(--muted-foreground)",
  destructive:   "var(--destructive)",
  successSubtle: "var(--success-subtle)",
  successText:   "var(--success-text)",
  warningSubtle: "var(--warning-subtle)",
  warningBorder: "var(--warning-border)",
  warningText:   "var(--warning-text)",
  fw_normal: "var(--font-weight-normal)",
  fw_medium: "var(--font-weight-medium)",
  fw_semi:   "var(--font-weight-semibold)",
  xs:   "var(--text-xs)",
  sm:   "var(--text-sm)",
  base: "var(--text-base)",
  lg:   "var(--text-lg)",
  xl:   "var(--text-xl)",
};

/** Người đang thao tác trong trang quản trị (tài khoản đang đăng nhập). */
export const ADMIN = "Nguyễn Thị Lan";

export const GIFT_STATE_CFG: Record<Exclude<GameState, "none">, { label: string; color: string; bg: string; border: string }> = {
  draft:    { label: "Bản nháp",     color: "#595959", bg: "#f3f4f6",               border: "#e5e7eb" },
  upcoming: { label: "Sắp diễn ra",  color: "#0369a1", bg: "#e0f2fe",               border: "#bae6fd" },
  active:   { label: "Đang diễn ra", color: "#be123c", bg: "#fff1f2",               border: "#fecdd3" },
  paused:   { label: "Tạm dừng",     color: "#b45309", bg: "var(--warning-subtle)", border: "var(--warning-border)" },
  ended:    { label: "Đã kết thúc",  color: "#15803d", bg: "var(--success-subtle)", border: "var(--success-border)" },
  soldout:  { label: "Hết quà",      color: "#b45309", bg: "var(--warning-subtle)", border: "var(--warning-border)" },
};

export function GiftStateBadge({ state }: { state: GameState }) {
  if (state === "none") return null;
  const c = GIFT_STATE_CFG[state];
  return (
    <span style={{ fontSize: T.xs, fontWeight: T.fw_medium, padding: "2px 10px", borderRadius: 999, whiteSpace: "nowrap",
      color: c.color, background: c.bg, border: `1px solid ${c.border}` }}>
      {c.label}
    </span>
  );
}

/** Ảnh quà: emoji (dữ liệu mẫu) hoặc ảnh tải lên (data URL). */
export function GiftThumb({ image, size = 36 }: { image: string; size?: number }) {
  const isImg = image.startsWith("data:") || image.startsWith("http");
  return (
    <span className="shrink-0 flex items-center justify-center overflow-hidden"
      style={{ width: size, height: size, borderRadius: Math.round(size * 0.28), backgroundColor: T.secondary, fontSize: Math.round(size * 0.55) }}>
      {isImg ? <img src={image} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : image}
    </span>
  );
}

const pad = (n: number) => String(n).padStart(2, "0");
const hm = (d: Date) => `${pad(d.getHours())}:${pad(d.getMinutes())}`;
const dm = (d: Date) => `${pad(d.getDate())}/${pad(d.getMonth() + 1)}`;

/** "09:00 – 17:00 · 10/09/2026", hoặc "09:00 10/09 – 17:00 11/09/2026" khi khác ngày. */
export function windowLabel(g: Pick<GiftGame, "startAt" | "endAt">) {
  const s = new Date(g.startAt), e = new Date(g.endAt);
  if (Number.isNaN(s.getTime()) || Number.isNaN(e.getTime())) return "Chưa đặt thời gian";
  const year = e.getFullYear();
  return s.toDateString() === e.toDateString()
    ? `${hm(s)} – ${hm(e)} · ${dm(s)}/${year}`
    : `${hm(s)} ${dm(s)} – ${hm(e)} ${dm(e)}/${year}`;
}

export const BRAND_COLORS = ["#1eaaff", "#7c3aed", "#e11d48", "#f59e0b", "#16a34a", "#0f172a"];

export const DEFAULT_UI: GiftGame["ui"] = {
  title: "Chọn một hộp quà",
  intro: "Bạn có 01 lượt duy nhất. Hãy chọn hộp quà may mắn của bạn.",
  resultText: "Mang mã nhận quà đến booth check-in để nhận quà.",
  brandColor: BRAND_COLORS[0],
};

/** Minigame mới: tên theo sự kiện, diễn ra trong ngày, nhận quà tại booth check-in, chưa có quà. */
export function newGiftGame(eventName: string): GiftGame {
  const d = new Date();
  const day = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  return {
    id: `gg${Date.now().toString(36)}`,
    name: `Chọn quà ngẫu nhiên — ${eventName}`,
    startAt: `${day}T09:00`, endAt: `${day}T17:00`,
    pickupLocation: "Booth check-in",
    status: "draft",
    ui: { ...DEFAULT_UI },
    gifts: [],
  };
}

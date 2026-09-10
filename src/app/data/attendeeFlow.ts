import { useCallback, useEffect, useRef, useState } from "react";
import { MOCK_ATTENDEES } from "../components/dashboard/AttendeesTab";

/**
 * Dữ liệu dùng chung cho luồng người tham dự — theo tài liệu "Check-in và tham
 * gia Minigame chọn quà ngẫu nhiên":
 *   đăng ký (số điện thoại) → quét QR check-in chung + nhập số điện thoại →
 *   check-in → nhận 01 lượt → chọn 1 trong 3 hộp → nhận mã nhận quà →
 *   nhân viên booth xác nhận trao quà.
 *
 * Prototype chưa có backend: localStorage đóng vai máy chủ, dùng chung giữa trang
 * quản trị, trang check-in của nhân viên và các màn của người tham dự (thường mở
 * ở tab khác). Mỗi thao tác đọc lại dữ liệu mới nhất ngay trước khi ghi nên hai
 * màn cùng thao tác không ghi đè nhau; ghi xong phát sự kiện để màn đang mở cập nhật.
 */

// ── Lưu trữ ────────────────────────────────────────────────────────────────────

const CHANGE = "netevent-store";

function read<V>(key: string, init: () => V): V {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as V) : init();
  } catch {
    return init();
  }
}

function write<V>(key: string, value: V) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* bộ nhớ bị chặn — chỉ giữ trong phiên */ }
  window.dispatchEvent(new CustomEvent<string>(CHANGE, { detail: key }));
}

/** Giá trị lưu trữ, tự cập nhật khi tab này hoặc tab khác ghi. */
function useStoreValue<V>(key: string, init: () => V): V {
  const initRef = useRef(init);
  initRef.current = init;
  const [value, setValue] = useState<V>(() => read(key, init));
  useEffect(() => {
    setValue(read(key, initRef.current));
    const sync = (k: string | null) => { if (k === key) setValue(read(key, initRef.current)); };
    const onStorage = (e: StorageEvent) => sync(e.key);
    const onLocal = (e: Event) => sync((e as CustomEvent<string>).detail);
    window.addEventListener("storage", onStorage);
    window.addEventListener(CHANGE, onLocal);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener(CHANGE, onLocal);
    };
  }, [key]);
  return value;
}

const KEY = {
  config:   (e: string) => `netevent_checkin_config_${e}`,
  checkins: (e: string) => `netevent_checkins_${e}`,
  game:     (e: string) => `netevent_gift_game_${e}`,
  rewards:  (e: string) => `netevent_rewards_${e}`,
  session:  (e: string) => `netevent_attendee_session_${e}`,
  audit:    (e: string) => `netevent_audit_${e}`,
};

const DEMO_EVENT_ID = "t1";
const pad = (n: number) => String(n).padStart(2, "0");
const hhmm = (d = new Date()) => `${pad(d.getHours())}:${pad(d.getMinutes())}`;

// ── Người đăng ký ──────────────────────────────────────────────────────────────

export interface Registration {
  id: string; name: string; phone: string; email: string;
  tier: string; ticketCode: string;
  /** Chỉ đăng ký hợp lệ mới được check-in. */
  valid: boolean;
}

/** "0981 234 567", "+84 981 234 567" → "0981234567"; sai định dạng → null. */
export function normalizePhone(raw: string): string | null {
  let d = raw.replace(/[\s.\-()]/g, "");
  if (d.startsWith("+84")) d = `0${d.slice(3)}`;
  else if (d.startsWith("84") && d.length === 11) d = `0${d.slice(2)}`;
  return /^0\d{9}$/.test(d) ? d : null;
}

/** Che bớt khi hiển thị cho người tham dự: "******678". */
export const maskPhone = (p: string) => `******${p.slice(-3)}`;

/** "Nguyễn Văn A" → "Nguyễn V** A". */
export function maskName(name: string) {
  const w = name.trim().split(/\s+/);
  if (w.length === 1) return w[0];
  if (w.length === 2) return `${w[0]} ${w[1][0]}**`;
  return [w[0], ...w.slice(1, -1).map((x) => `${x[0]}**`), w[w.length - 1]].join(" ");
}

/** Người đăng ký của sự kiện. Sự kiện mẫu dùng danh sách của tab Người tham dự; sự kiện mới chưa có ai. */
export function registrationsOf(eventId: string): Registration[] {
  if (eventId !== DEMO_EVENT_ID) return [];
  return MOCK_ATTENDEES.map((a) => ({
    id: a.id, name: a.name, phone: normalizePhone(a.phone) ?? a.phone, email: a.email,
    tier: a.tier, ticketCode: a.ticketCode,
    valid: a.status === "valid" || a.status === "checked-in",
  }));
}

/** Đăng ký hợp lệ khớp số điện thoại (đã chuẩn hoá). */
export const findByPhone = (eventId: string, phone: string) =>
  registrationsOf(eventId).filter((r) => r.valid && r.phone === phone);

// ── Cấu hình check-in ──────────────────────────────────────────────────────────

export interface CheckinConfig {
  /** Nhân viên quét mã QR trên vé của từng người. */
  qr: boolean;
  /** Người tham dự quét QR check-in chung của sự kiện rồi nhập số điện thoại đã đăng ký. */
  phone: boolean;
}

const DEFAULT_CONFIG: CheckinConfig = { qr: true, phone: true };

export function useCheckinConfig(eventId: string): [CheckinConfig, (c: CheckinConfig) => void] {
  const value = useStoreValue(KEY.config(eventId), () => DEFAULT_CONFIG);
  const set = useCallback((c: CheckinConfig) => write(KEY.config(eventId), c), [eventId]);
  return [value, set];
}

// ── Check-in ───────────────────────────────────────────────────────────────────

export interface CheckinRecord { at: string; source: "self" | "staff" }

const seedCheckins = (eventId: string): Record<string, CheckinRecord> =>
  eventId !== DEMO_EVENT_ID ? {} : Object.fromEntries(
    MOCK_ATTENDEES.filter((a) => a.status === "checked-in")
      .map((a) => [a.id, { at: a.checkinTime?.split(",")[0] ?? "08:00", source: "staff" as const }]),
  );

export const useCheckins = (eventId: string) => useStoreValue(KEY.checkins(eventId), () => seedCheckins(eventId));

/** Check-in một người. Đã check-in thì không tạo check-in mới, không cấp thêm lượt. */
export function checkIn(eventId: string, regId: string, source: CheckinRecord["source"], actor: string) {
  const all = read(KEY.checkins(eventId), () => seedCheckins(eventId));
  if (all[regId]) return { status: "already" as const, record: all[regId] };
  const record: CheckinRecord = { at: hhmm(), source };
  write(KEY.checkins(eventId), { ...all, [regId]: record });
  logAudit(eventId, actor, source === "self" ? "Tự check-in bằng số điện thoại" : "Check-in", regId);
  return { status: "ok" as const, record };
}

/** Nhân viên hoàn tác một check-in bấm nhầm. */
export function undoCheckIn(eventId: string, regId: string, actor: string) {
  const all = { ...read(KEY.checkins(eventId), () => seedCheckins(eventId)) };
  delete all[regId];
  write(KEY.checkins(eventId), all);
  logAudit(eventId, actor, "Hoàn tác check-in", regId);
}

// ── Minigame chọn quà ngẫu nhiên ───────────────────────────────────────────────

export interface Gift {
  id: string;
  /** Mã quà — không trùng trong minigame. */
  code: string;
  name: string;
  /** Emoji hoặc data URL ảnh. */
  image: string;
  quantity: number;
  description?: string;
  pickupNote?: string;
  status: "active" | "paused";
}

export interface GiftGame {
  id: string;
  name: string;
  description: string;
  /** "YYYY-MM-DDTHH:mm", giờ địa phương. */
  startAt: string;
  endAt: string;
  pickupLocation: string;
  status: "draft" | "active" | "paused";
  ui: { title: string; intro: string; resultText: string; brandColor: string };
  gifts: Gift[];
}

const todayAt = (h: number, m = 0) => {
  const d = new Date();
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(h)}:${pad(m)}`;
};

// Sự kiện mẫu: minigame mở trong ngày hôm nay để thử được trọn luồng.
const demoGame = (): GiftGame => ({
  id: "gg1",
  name: "Check-in liền tay – Nhận ngay quà xịn",
  description: "Mỗi người đã check-in có 01 lượt chọn một trong ba hộp quà.",
  startAt: todayAt(0), endAt: todayAt(23, 59),
  pickupLocation: "Booth check-in",
  status: "active",
  ui: {
    title: "Chọn một hộp quà",
    intro: "Bạn có 01 lượt duy nhất. Hãy chọn hộp quà may mắn của bạn.",
    resultText: "Mang mã nhận quà đến booth check-in để nhận quà.",
    brandColor: "#1eaaff",
  },
  gifts: [
    { id: "g1", code: "BGN",   name: "Bình giữ nhiệt",      image: "🥤", quantity: 50,  status: "active" },
    { id: "g2", code: "AOT",   name: "Áo thun sự kiện",     image: "👕", quantity: 80,  status: "active" },
    { id: "g3", code: "VC100", name: "Voucher 100.000đ",    image: "🎟️", quantity: 30,  status: "active" },
    { id: "g4", code: "STK",   name: "Bộ sticker NetEvent", image: "✨", quantity: 120, status: "active" },
  ],
});

const seedGame = (eventId: string): GiftGame | null => (eventId === DEMO_EVENT_ID ? demoGame() : null);

export function useGiftGame(eventId: string): [GiftGame | null, (g: GiftGame | null) => void] {
  const value = useStoreValue(KEY.game(eventId), () => seedGame(eventId));
  const set = useCallback((g: GiftGame | null) => write(KEY.game(eventId), g), [eventId]);
  return [value, set];
}

export interface Reward {
  /** Mã nhận quà — duy nhất, khó đoán. */
  code: string;
  giftId: string;
  box: 1 | 2 | 3;
  playedAt: string;
  status: "pending" | "claimed";
  claimedAt?: string;
  claimedBy?: string;
}

const seedRewards = (eventId: string): Record<string, Reward> => (eventId !== DEMO_EVENT_ID ? {} : {
  a2: { code: "QX7K4P", giftId: "g2", box: 2, playedAt: "08:47", status: "pending" },
  a4: { code: "M3TR8W", giftId: "g1", box: 1, playedAt: "09:06", status: "claimed", claimedAt: "09:10", claimedBy: "Trần Thị B" },
});

export const useRewards = (eventId: string) => useStoreValue(KEY.rewards(eventId), () => seedRewards(eventId));

const CODE_CHARS = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
function newRewardCode(taken: Set<string>) {
  for (;;) {
    const code = Array.from(crypto.getRandomValues(new Uint8Array(6)), (b) => CODE_CHARS[b % CODE_CHARS.length]).join("");
    if (!taken.has(code)) return code;
  }
}

/** Kho quà: Khả dụng = Tổng − Đã phân bổ; Đã phân bổ = Chờ nhận + Đã nhận (không cộng hai lần). */
export function inventoryOf(game: GiftGame, rewards: Record<string, Reward>) {
  const list = Object.values(rewards);
  return game.gifts.map((g) => {
    const allocated = list.filter((r) => r.giftId === g.id).length;
    const claimed = list.filter((r) => r.giftId === g.id && r.status === "claimed").length;
    return { ...g, allocated, claimed, pending: allocated - claimed, available: Math.max(0, g.quantity - allocated) };
  });
}

export type GameState = "none" | "draft" | "upcoming" | "active" | "paused" | "ended" | "soldout";

export function gameStateOf(game: GiftGame | null, rewards: Record<string, Reward>, now = new Date()): GameState {
  if (!game) return "none";
  if (game.status === "draft") return "draft";
  if (game.status === "paused") return "paused";
  if (now.getTime() < new Date(game.startAt).getTime()) return "upcoming";
  if (now.getTime() > new Date(game.endAt).getTime()) return "ended";
  const left = inventoryOf(game, rewards).filter((g) => g.status === "active").reduce((n, g) => n + g.available, 0);
  return left > 0 ? "active" : "soldout";
}

export type PlayResult =
  | { status: "ok" | "already"; reward: Reward; gift: Gift }
  | { status: "not-checked-in" | "closed" | "soldout" };

/**
 * Dùng lượt chọn quà. Kiểm tra lại điều kiện, chọn quà ngẫu nhiên theo số lượng
 * còn lại, tạo reward và giữ tồn kho trong một lần ghi. Đã có reward thì trả lại
 * đúng reward đó — bấm nhiều lần hay tải lại trang không đổi kết quả.
 * Hộp được chọn chỉ để ghi nhận; không hộp nào gắn cố định với một loại quà.
 */
export function playGiftBox(eventId: string, regId: string, box: 1 | 2 | 3): PlayResult {
  const game = read(KEY.game(eventId), () => seedGame(eventId));
  const rewards = read(KEY.rewards(eventId), () => seedRewards(eventId));
  const existing = rewards[regId];
  const existingGift = existing && game?.gifts.find((g) => g.id === existing.giftId);
  if (existing && existingGift) return { status: "already", reward: existing, gift: existingGift };
  if (!read(KEY.checkins(eventId), () => seedCheckins(eventId))[regId]) return { status: "not-checked-in" };
  const state = gameStateOf(game, rewards);
  if (state === "soldout") return { status: "soldout" };
  if (state !== "active" || !game) return { status: "closed" };
  // Quà còn nhiều có khả năng được chọn cao hơn; quà hết hoặc tạm dừng bị loại khỏi tập chọn.
  const pool = inventoryOf(game, rewards).filter((g) => g.status === "active" && g.available > 0);
  let roll = Math.random() * pool.reduce((n, g) => n + g.available, 0);
  const picked = pool.find((g) => (roll -= g.available) < 0) ?? pool[pool.length - 1];
  const gift = game.gifts.find((g) => g.id === picked.id)!;
  const reward: Reward = {
    code: newRewardCode(new Set(Object.values(rewards).map((x) => x.code))),
    giftId: gift.id, box, playedAt: hhmm(), status: "pending",
  };
  write(KEY.rewards(eventId), { ...rewards, [regId]: reward });
  logAudit(eventId, "Hệ thống", `Phân bổ quà “${gift.name}” (hộp ${box})`, regId);
  return { status: "ok", reward, gift };
}

/** Tra reward theo mã nhận quà, không thay đổi gì — để nhân viên đối chiếu trước khi xác nhận. */
export function lookupReward(eventId: string, code: string) {
  const key = code.trim().toUpperCase();
  const rewards = read(KEY.rewards(eventId), () => seedRewards(eventId));
  const entry = Object.entries(rewards).find(([, r]) => r.code === key);
  if (!entry) return null;
  const [regId, reward] = entry;
  const gift = read(KEY.game(eventId), () => seedGame(eventId))?.gifts.find((g) => g.id === reward.giftId);
  return { regId, reward, gift, registration: registrationsOf(eventId).find((r) => r.id === regId) };
}

export type ClaimResult = { status: "ok" | "already"; reward: Reward } | { status: "invalid" };

/** Nhân viên booth xác nhận đã trao quà. Mỗi reward chỉ xác nhận một lần. */
export function claimReward(eventId: string, code: string, staff: string): ClaimResult {
  const found = lookupReward(eventId, code);
  if (!found) return { status: "invalid" };
  if (found.reward.status === "claimed") return { status: "already", reward: found.reward };
  const next: Reward = { ...found.reward, status: "claimed", claimedAt: hhmm(), claimedBy: staff };
  const rewards = read(KEY.rewards(eventId), () => seedRewards(eventId));
  write(KEY.rewards(eventId), { ...rewards, [found.regId]: next });
  logAudit(eventId, staff, `Xác nhận trao quà “${found.gift?.name ?? found.reward.giftId}”`, found.regId);
  return { status: "ok", reward: next };
}

// ── Phiên người tham dự ────────────────────────────────────────────────────────
// Sau khi check-in, thiết bị của người tham dự giữ phiên để vào Tổng quan và
// Minigame mà không phải check-in lại. Không đưa ID người tham dự lên URL.

export const useAttendeeSession = (eventId: string) => useStoreValue<string | null>(KEY.session(eventId), () => null);
export const setAttendeeSession = (eventId: string, regId: string | null) => write(KEY.session(eventId), regId);

// ── Nhật ký ────────────────────────────────────────────────────────────────────

export interface AuditEntry { at: string; actor: string; action: string; regId?: string }

export const useAudit = (eventId: string) => useStoreValue<AuditEntry[]>(KEY.audit(eventId), () => []);

function logAudit(eventId: string, actor: string, action: string, regId?: string) {
  const list = read<AuditEntry[]>(KEY.audit(eventId), () => []);
  write(KEY.audit(eventId), [{ at: hhmm(), actor, action, regId }, ...list].slice(0, 200));
}

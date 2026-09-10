import * as React from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Search, ScanLine, List, SlidersHorizontal, ArrowUpRight, CheckCircle2,
  AlertTriangle, XCircle, QrCode, Users, UserCheck, Undo2, Smartphone, Gift,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Switch } from "../ui/switch";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import type { EventDraft } from "../dashboard/EventsPage";
import { dayLabelVi } from "../../data/eventFormat";
import {
  registrationsOf, useCheckins, checkIn, undoCheckIn, useCheckinConfig, useGiftGame, useRewards,
  lookupReward, claimReward, reportGiftIncident, normalizePhone, maskPhone,
} from "../../data/attendeeFlow";

// ── Tokens ───────────────────────────────────────────────────────────────────

const T = {
  background:    "var(--background)",
  foreground:    "var(--foreground)",
  border:        "var(--border)",
  primary:       "var(--primary)",
  secondary:     "var(--secondary)",
  mutedFg:       "var(--muted-foreground)",
  destructive:   "var(--destructive)",
  successText:   "var(--success-text)",
  successSubtle: "var(--success-subtle)",
  warningText:   "var(--warning-text)",
  warningSubtle: "var(--warning-subtle)",
  fw_normal: "var(--font-weight-normal)",
  fw_medium: "var(--font-weight-medium)",
  fw_semi:   "var(--font-weight-semibold)",
  xs:   "var(--text-xs)",
  sm:   "var(--text-sm)",
  base: "var(--text-base)",
  lg:   "var(--text-lg)",
  xl:   "var(--text-xl)",
};

/** Nhân viên đang trực trang check-in (tài khoản đang đăng nhập). */
const STAFF = "Nguyễn Thị Lan";

// ── Data ─────────────────────────────────────────────────────────────────────

type GuestStatus = "going" | "checked-in";

interface Guest {
  id: string; name: string; email: string; phone: string; tier: string; ticketCode: string;
  status: GuestStatus; checkinTime?: string; source?: "self" | "staff";
}

type Mode = "list" | "scan" | "phone" | "gift";

const MODES: { id: Mode; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: "list",  label: "Danh sách",     icon: List },
  { id: "scan",  label: "Quét mã",       icon: ScanLine },
  { id: "phone", label: "Số điện thoại", icon: Smartphone },
  { id: "gift",  label: "Trao quà",      icon: Gift },
];

type ScanResult =
  | { kind: "success" | "confirm" | "already"; guest: Guest }
  | { kind: "invalid"; code: string };

/** Thứ tự kết quả của nút "Mô phỏng quét mã", để thử đủ các trạng thái vé. */
const SCAN_SEQUENCE: Array<GuestStatus | "invalid"> = ["going", "checked-in", "going", "invalid"];

const RESULT_CFG = {
  success:   { color: "#16a34a", bg: "rgba(22,163,74,0.1)",  frame: "#22c55e", icon: CheckCircle2 },
  confirm:   { color: "#0284c7", bg: "rgba(2,132,199,0.1)",  frame: "#38bdf8", icon: QrCode },
  already:   { color: "#d97706", bg: "rgba(217,119,6,0.1)",  frame: "#f59e0b", icon: AlertTriangle },
  invalid:   { color: "#dc2626", bg: "rgba(220,38,38,0.1)",  frame: "#ef4444", icon: XCircle },
} as const;

function resultTitle(r: ScanResult) {
  switch (r.kind) {
    case "success": return "Check-in thành công";
    case "confirm": return "Vé hợp lệ";
    case "already": return `Đã check-in lúc ${r.guest.checkinTime ?? "trước đó"}`;
    case "invalid": return "Mã QR không hợp lệ";
  }
}

/** Tiếng bíp ngắn khi quét: cao = hợp lệ, trầm = có vấn đề. */
function beep(ok: boolean) {
  try {
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.frequency.value = ok ? 880 : 220;
    gain.gain.value = 0.05;
    osc.connect(gain).connect(ctx.destination);
    osc.onended = () => void ctx.close();
    osc.start();
    osc.stop(ctx.currentTime + (ok ? 0.12 : 0.3));
  } catch {
    // Trình duyệt không cho phát âm thanh — bỏ qua.
  }
}

const SCANLINE_CSS = `
@keyframes ci-scan { 0%, 100% { top: 8%; } 50% { top: 92%; } }
.ci-scanline { animation: ci-scan 1.2s ease-in-out infinite; }
`;

// ── Page ─────────────────────────────────────────────────────────────────────

/**
 * Trang check-in của nhân viên, mở ở tab riêng. Các chế độ theo cấu hình check-in
 * của sự kiện: Danh sách (tìm khách), Quét mã (QR trên vé), Số điện thoại (khách
 * không mang vé) và Trao quà (xác nhận phần quà của minigame chọn quà).
 *
 * Trạng thái check-in và phần quà lấy từ attendeeFlow, dùng chung với trang tự
 * check-in của người tham dự — người tự check-in bằng số điện thoại hiện ngay ở đây.
 * Bản prototype không mở camera thật: "Mô phỏng quét mã" lần lượt trả về vé hợp
 * lệ, vé đã check-in và mã lạ.
 */
export function CheckInPage({ event, sampleGuests = false }: { event: EventDraft; sampleGuests?: boolean }) {
  // Sự kiện mẫu ở màn khác (vd. Tổng quan) dùng chung danh sách minh hoạ của sự kiện demo.
  const dataId = sampleGuests ? "t1" : event.id;
  const regs = useMemo(() => registrationsOf(dataId).filter((r) => r.valid), [dataId]);
  const checkins = useCheckins(dataId);
  const [config] = useCheckinConfig(dataId);
  const [game] = useGiftGame(dataId);
  const guests: Guest[] = regs.map((r) => ({
    id: r.id, name: r.name, email: r.email, phone: r.phone, tier: r.tier, ticketCode: r.ticketCode,
    status: checkins[r.id] ? "checked-in" : "going", checkinTime: checkins[r.id]?.at, source: checkins[r.id]?.source,
  }));

  const available = MODES.filter((m) =>
    m.id === "list" || (m.id === "scan" && config.qr) || (m.id === "phone" && config.phone)
    || (m.id === "gift" && !!game && game.status !== "draft"));
  const [modeState, setMode] = useState<Mode>("list");
  // Cấu hình vừa tắt chế độ đang mở thì quay về danh sách.
  const mode: Mode = available.some((m) => m.id === modeState) ? modeState : "list";

  const [tab, setTab]     = useState<"all" | "going" | "checked-in">("all");
  const [query, setQuery] = useState("");

  const [scanning, setScanning]       = useState(false);
  const [result, setResult]           = useState<ScanResult | null>(null);
  const [scanCount, setScanCount]     = useState(0);
  const [autoCheckIn, setAutoCheckIn] = useState(true);
  const [sound, setSound]             = useState(true);
  const timer = useRef<number>();

  useEffect(() => {
    const prev = document.title;
    document.title = `Check-in · ${event.name || "Sự kiện"}`;
    return () => { document.title = prev; };
  }, [event.name]);
  useEffect(() => () => window.clearTimeout(timer.current), []);

  const waiting   = guests.filter((g) => g.status === "going");
  const checkedIn = guests.filter((g) => g.status === "checked-in");
  const pct       = guests.length ? Math.round((checkedIn.length / guests.length) * 100) : 0;

  const day  = dayLabelVi(event.startDate);
  const when = day ? [day, event.startTime && `${event.startTime} GMT+7`].filter(Boolean).join(" · ") : "Chưa có thời gian";

  const q = query.trim().toLowerCase();
  const visible = guests
    .filter((g) => tab === "all" || g.status === tab)
    .filter((g) => !q || [g.name, g.email, g.ticketCode, g.phone].some((v) => v.toLowerCase().includes(q)));

  const markCheckedIn = (id: string) => checkIn(dataId, id, "staff", STAFF).record.at;
  const undo = (id: string) => undoCheckIn(dataId, id, STAFF);

  const simulateScan = () => {
    setScanning(true);
    timer.current = window.setTimeout(() => {
      setScanning(false);
      const want = SCAN_SEQUENCE[scanCount % SCAN_SEQUENCE.length];
      setScanCount((n) => n + 1);
      const find = (s: GuestStatus) => guests.find((g) => g.status === s);
      const guest = want === "invalid" ? undefined : find(want) ?? find("going") ?? find("checked-in");
      let r: ScanResult;
      if (!guest) r = { kind: "invalid", code: `NE-${Math.floor(100000 + Math.random() * 900000)}` };
      else if (guest.status === "checked-in") r = { kind: "already", guest };
      else if (autoCheckIn) r = { kind: "success", guest: { ...guest, status: "checked-in", checkinTime: markCheckedIn(guest.id) } };
      else r = { kind: "confirm", guest };
      setResult(r);
      if (sound) beep(r.kind === "success" || r.kind === "confirm");
    }, 800);
  };

  const confirmCheckIn = () => {
    if (result?.kind !== "confirm") return;
    const time = markCheckedIn(result.guest.id);
    setResult({ kind: "success", guest: { ...result.guest, status: "checked-in", checkinTime: time } });
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: T.background, color: T.foreground }}>
      <style>{SCANLINE_CSS}</style>

      {/* Header: tên + thời gian sự kiện, chuyển chế độ check-in */}
      <header style={{ borderBottom: `1px solid ${T.border}` }}>
        <div className="max-w-[880px] mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
          <div className="min-w-0">
            <p className="truncate" style={{ fontSize: T.base, fontWeight: T.fw_semi }}>{event.name || "Sự kiện chưa đặt tên"}</p>
            <p className="truncate" style={{ fontSize: T.xs, color: T.mutedFg, marginTop: 2 }}>{when}</p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <div className="inline-flex gap-0.5 p-0.5 rounded-full" role="tablist" aria-label="Chế độ check-in"
              style={{ backgroundColor: T.secondary, border: `1px solid ${T.border}` }}>
              {available.map((m) => {
                const on = mode === m.id;
                return (
                  <button key={m.id} type="button" role="tab" aria-selected={on} title={m.label}
                    onClick={() => { setMode(m.id); setResult(null); }}
                    className="flex items-center gap-1.5 px-3 h-8 cursor-pointer transition-colors whitespace-nowrap"
                    style={{ fontSize: T.xs, fontWeight: on ? T.fw_semi : T.fw_medium,
                      backgroundColor: on ? T.background : "transparent", color: on ? T.foreground : T.mutedFg,
                      boxShadow: on ? "0 1px 3px rgba(0,0,0,0.08)" : "none" }}>
                    <m.icon className="size-3.5" /><span className="hidden sm:inline">{m.label}</span>
                  </button>
                );
              })}
            </div>
            {mode === "scan" && (
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="secondary" size="icon" className="size-8" aria-label="Cài đặt quét mã">
                    <SlidersHorizontal className="size-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent align="end" className="w-72 flex flex-col gap-4">
                  <SettingRow label="Tự động check-in khi quét" desc="Tắt để xem thông tin vé trước khi xác nhận."
                    checked={autoCheckIn} onChange={setAutoCheckIn} />
                  <SettingRow label="Âm báo khi quét" desc="Tiếng bíp cho biết vé hợp lệ hay có vấn đề."
                    checked={sound} onChange={setSound} />
                </PopoverContent>
              </Popover>
            )}
          </div>
        </div>
      </header>

      {mode === "list" && (
        <>
          {/* Tìm khách */}
          <div style={{ backgroundColor: T.secondary }}>
            <label className="max-w-[880px] mx-auto px-4 sm:px-6 h-11 flex items-center gap-3 cursor-text">
              <Search className="size-4 shrink-0" style={{ color: T.mutedFg }} />
              <input value={query} onChange={(e) => setQuery(e.target.value)}
                placeholder="Tìm khách theo tên, email, số điện thoại hoặc mã vé…"
                className="flex-1 min-w-0 bg-transparent outline-none"
                style={{ fontSize: T.sm, color: T.foreground }} />
            </label>
          </div>

          {/* Tabs */}
          <div style={{ borderBottom: `1px solid ${T.border}` }}>
            <div className="max-w-[880px] mx-auto px-4 sm:px-6 flex gap-6 overflow-x-auto">
              {([
                { id: "all" as const,        label: "Tất cả khách" },
                { id: "going" as const,      label: "Chưa check-in", count: waiting.length },
                { id: "checked-in" as const, label: "Đã check-in",   count: checkedIn.length },
              ]).map((t) => {
                const on = tab === t.id;
                return (
                  <button key={t.id} type="button" data-pill="off" onClick={() => setTab(t.id)}
                    className="py-3 cursor-pointer transition-colors whitespace-nowrap"
                    style={{ fontSize: T.sm, fontWeight: on ? T.fw_semi : T.fw_medium,
                      color: on ? T.foreground : T.mutedFg,
                      borderBottom: `2px solid ${on ? T.foreground : "transparent"}`, marginBottom: -1 }}>
                    {t.label}
                    {t.count !== undefined && (
                      <span style={{ marginLeft: 6, color: T.mutedFg, fontWeight: T.fw_normal }}>{t.count}</span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          <main className="flex-1 max-w-[880px] w-full mx-auto px-4 sm:px-6">
            {visible.length > 0 ? (
              <>
                <div className={`hidden sm:grid items-center gap-4 ${GUEST_COLS} pt-4 pb-2`}
                  style={{ borderBottom: `1px solid ${T.border}`, fontSize: T.xs, fontWeight: T.fw_medium, color: T.mutedFg }}>
                  <span>Khách</span>
                  <span>Hạng vé</span>
                  <span className="text-right">Trạng thái</span>
                </div>
                <ul>
                  {visible.map((g) => (
                    <GuestRow key={g.id} guest={g} onCheckIn={() => markCheckedIn(g.id)} onUndo={() => undo(g.id)} />
                  ))}
                </ul>
              </>
            ) : guests.length === 0 ? (
              <EmptyState icon={<Users className="size-8" />} title="Chưa có khách nào"
                desc="Chia sẻ trang sự kiện để nhận đăng ký."
                action={
                  <Button asChild variant="outline" size="sm">
                    <a href="/demo" target="_blank" rel="noreferrer">Mở trang sự kiện <ArrowUpRight className="size-3.5" /></a>
                  </Button>
                } />
            ) : q ? (
              <EmptyState icon={<Search className="size-8" />} title="Không tìm thấy khách"
                desc={`Không có khách nào khớp với “${query.trim()}”.`} />
            ) : tab === "checked-in" ? (
              <EmptyState icon={<UserCheck className="size-8" />} title="Chưa ai check-in"
                desc="Quét mã QR trên vé, hoặc bấm Check-in ở từng khách trong danh sách." />
            ) : (
              <EmptyState icon={<UserCheck className="size-8" />} title="Tất cả khách đã check-in"
                desc="Không còn khách nào chờ check-in." />
            )}
          </main>
        </>
      )}

      {mode === "scan" && (
        <main className="flex-1 max-w-[880px] w-full mx-auto px-4 sm:px-6 py-4 flex flex-col gap-4">
          {/* Khung camera */}
          <div className="relative overflow-hidden flex items-center justify-center"
            style={{ backgroundColor: "#000", borderRadius: 16, height: "min(62vh, 560px)", minHeight: 320 }}>
            <p className="absolute top-4 inset-x-0 text-center px-4" style={{ fontSize: T.xs, color: "rgba(255,255,255,0.7)" }}>
              Đưa mã QR trên vé vào giữa khung hình
            </p>
            <ScanFrame color={result ? RESULT_CFG[result.kind].frame : "rgba(255,255,255,0.9)"} scanning={scanning} />
            {result ? (
              <ScanResultCard result={result} onConfirm={confirmCheckIn} onNext={() => setResult(null)} />
            ) : (
              <button type="button" onClick={simulateScan} disabled={scanning}
                className="absolute bottom-5 left-1/2 -translate-x-1/2 flex items-center gap-2 px-4 h-10 cursor-pointer whitespace-nowrap transition-opacity disabled:opacity-60"
                style={{ fontSize: T.sm, fontWeight: T.fw_medium, color: "white",
                  backgroundColor: "rgba(255,255,255,0.14)", border: "1px solid rgba(255,255,255,0.25)", backdropFilter: "blur(8px)" }}>
                <QrCode className="size-4" /> {scanning ? "Đang quét…" : "Mô phỏng quét mã"}
              </button>
            )}
          </div>
          <ProgressCard checkedIn={checkedIn.length} total={guests.length} pct={pct} />
        </main>
      )}

      {mode === "phone" && (
        <PhoneCheckin guests={guests} onCheckIn={markCheckedIn} />
      )}

      {mode === "gift" && (
        <GiftDesk eventId={dataId} guests={guests} />
      )}
    </div>
  );
}

// ── Chế độ nhập số điện thoại (khách không mang vé) ─────────────────────────────

function PhoneCheckin({ guests, onCheckIn }: { guests: Guest[]; onCheckIn: (id: string) => string }) {
  const [value, setValue] = useState("");
  const [error, setError] = useState("");
  const [matchIds, setMatchIds] = useState<string[] | null>(null);
  // Giữ id thay vì bản sao để trạng thái cập nhật ngay khi khách check-in ở nơi khác.
  const matches = matchIds ? guests.filter((g) => matchIds.includes(g.id)) : null;

  const search = () => {
    setMatchIds(null);
    if (!value.trim()) { setError("Vui lòng nhập số điện thoại."); return; }
    const phone = normalizePhone(value);
    if (!phone) { setError("Số điện thoại không hợp lệ. Vui lòng kiểm tra lại."); return; }
    const found = guests.filter((g) => g.phone === phone).map((g) => g.id);
    if (found.length === 0) { setError("Không tìm thấy đăng ký phù hợp. Vui lòng kiểm tra lại số điện thoại."); return; }
    setError("");
    setMatchIds(found);
  };

  return (
    <main className="flex-1 max-w-[560px] w-full mx-auto px-4 sm:px-6 py-8 flex flex-col gap-4">
      <div>
        <p style={{ fontSize: T.lg, fontWeight: T.fw_semi }}>Check-in bằng số điện thoại</p>
        <p style={{ fontSize: T.sm, color: T.mutedFg, marginTop: 4 }}>Nhập số điện thoại khách đã dùng khi đăng ký sự kiện.</p>
      </div>
      <form className="flex flex-col gap-1.5" onSubmit={(e) => { e.preventDefault(); search(); }}>
        <div className="flex gap-2">
          <Input type="tel" inputMode="tel" value={value} placeholder="Ví dụ: 0981 234 567" aria-label="Số điện thoại"
            aria-invalid={!!error} onChange={(e) => { setValue(e.target.value); setError(""); }} />
          <Button type="submit" className="shrink-0">Tìm</Button>
        </div>
        {error && <p style={{ fontSize: T.xs, color: T.destructive }}>{error}</p>}
      </form>
      {matches?.map((g) => (
        <div key={g.id} className="rounded-2xl p-4 flex items-center gap-3" style={{ border: `1px solid ${T.border}` }}>
          <Avatar name={g.name} />
          <div className="flex-1 min-w-0">
            <p className="truncate" style={{ fontSize: T.sm, fontWeight: T.fw_semi }}>{g.name}</p>
            <p className="truncate" style={{ fontSize: T.xs, color: T.mutedFg }}>{g.phone} · {g.ticketCode} · {g.tier}</p>
          </div>
          {g.status === "going" ? (
            <Button size="sm" onClick={() => { onCheckIn(g.id); toast.success(`Đã check-in cho ${g.name}`); }}>
              <UserCheck className="size-3.5" /> Check-in
            </Button>
          ) : (
            <CheckedInPill guest={g} />
          )}
        </div>
      ))}
    </main>
  );
}

// ── Chế độ trao quà tại booth ──────────────────────────────────────────────────

function GiftDesk({ eventId, guests }: { eventId: string; guests: Guest[] }) {
  const rewards = useRewards(eventId);
  const [value, setValue] = useState("");
  const [error, setError] = useState("");
  const [code, setCode] = useState<string | null>(null);
  // Tra lại mỗi lần rewards đổi, để trạng thái "đã trao" cập nhật ngay.
  const found = useMemo(() => (code ? lookupReward(eventId, code) : null), [eventId, code, rewards]);
  const list = Object.values(rewards);
  const pending = list.filter((r) => r.status === "pending");
  const claimed = list.length - pending.length;

  const open = (raw: string) => {
    const text = raw.trim();
    setError("");
    if (!text) { setCode(null); setError("Nhập mã nhận quà, số điện thoại, mã đăng ký hoặc họ tên."); return; }
    if (lookupReward(eventId, text)) { setCode(text.toUpperCase()); return; }
    // Khách không mở được mã: tìm theo số điện thoại, mã đăng ký hoặc họ tên.
    const phone = normalizePhone(text);
    const key = text.toLowerCase();
    const person = guests.find((g) => (phone && g.phone === phone) || g.ticketCode.toLowerCase() === key || g.name.toLowerCase() === key);
    const reward = person && rewards[person.id];
    if (reward) { setCode(reward.code); return; }
    setCode(null);
    setError(person ? `${person.name} chưa có phần quà.` : "Không tìm thấy mã nhận quà hợp lệ.");
  };

  const confirm = () => {
    if (!found) return;
    const res = claimReward(eventId, found.reward.code, STAFF);
    if (res.status === "ok") toast.success(`Đã xác nhận trao “${found.gift?.name ?? "phần quà"}” cho ${found.registration?.name ?? "người tham dự"}.`);
    else if (res.status === "already") toast.error("Phần quà này đã được trao.");
    else toast.error("Không thể xác nhận trao quà. Vui lòng thử lại.");
  };

  return (
    <main className="flex-1 max-w-[560px] w-full mx-auto px-4 sm:px-6 py-8 flex flex-col gap-4">
      <div>
        <p style={{ fontSize: T.lg, fontWeight: T.fw_semi }}>Xác nhận trao quà</p>
        <p style={{ fontSize: T.sm, color: T.mutedFg, marginTop: 4 }}>
          Quét hoặc nhập mã nhận quà của khách. Khách không mở được mã thì tìm theo số điện thoại, mã đăng ký hoặc họ tên.
        </p>
        <p style={{ fontSize: T.xs, color: T.mutedFg, marginTop: 8 }}>
          Chờ nhận <strong style={{ color: T.foreground }}>{pending.length}</strong> · Đã nhận <strong style={{ color: T.foreground }}>{claimed}</strong>
        </p>
      </div>
      <form className="flex flex-col gap-1.5" onSubmit={(e) => { e.preventDefault(); open(value); }}>
        <div className="flex gap-2">
          <Input value={value} placeholder="Mã nhận quà, SĐT, mã đăng ký hoặc họ tên" aria-label="Tra cứu phần quà"
            aria-invalid={!!error} onChange={(e) => { setValue(e.target.value); setError(""); }} />
          <Button type="submit" className="shrink-0">Kiểm tra</Button>
        </div>
        {error && <p style={{ fontSize: T.xs, color: T.destructive }}>{error}</p>}
      </form>
      {found && (
        <RewardCard found={found} onConfirm={confirm}
          onIncident={() => { reportGiftIncident(eventId, found.reward.code, STAFF); toast("Đã ghi nhận sự cố quà tặng", { description: "Ban tổ chức sẽ xử lý. Phần quà vẫn ở trạng thái Chờ nhận." }); }} />
      )}
    </main>
  );
}

function RewardCard({ found, onConfirm, onIncident }: {
  found: NonNullable<ReturnType<typeof lookupReward>>; onConfirm: () => void; onIncident: () => void;
}) {
  const { reward, gift, registration } = found;
  const claimedDone = reward.status === "claimed";
  const image = gift?.image ?? "🎁";
  return (
    <div className="rounded-2xl p-5 flex flex-col gap-4" style={{ border: `1px solid ${claimedDone ? T.border : T.primary}` }}>
      <div className="flex items-center gap-4">
        <span className="size-14 rounded-2xl flex items-center justify-center shrink-0 overflow-hidden" style={{ backgroundColor: T.secondary, fontSize: 30 }}>
          {image.startsWith("data:") ? <img src={image} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : image}
        </span>
        <div className="flex-1 min-w-0">
          <p style={{ fontSize: T.xs, color: T.mutedFg }}>Phần quà</p>
          <p className="truncate" style={{ fontSize: T.lg, fontWeight: T.fw_semi }}>{gift?.name ?? "Phần quà"}</p>
          <p style={{ fontSize: T.xs, color: T.mutedFg, fontFamily: "monospace" }}>Mã quà {gift?.code ?? "—"} · Mã nhận {reward.code}</p>
        </div>
        <span className="shrink-0 whitespace-nowrap" style={{ fontSize: T.xs, fontWeight: T.fw_medium, padding: "3px 10px", borderRadius: 999,
          color: claimedDone ? T.successText : T.warningText, backgroundColor: claimedDone ? T.successSubtle : T.warningSubtle }}>
          {claimedDone ? "Đã nhận" : "Chờ nhận"}
        </span>
      </div>
      <dl className="grid grid-cols-2 gap-3" style={{ margin: 0 }}>
        <Info label="Người nhận" value={registration?.name ?? "—"} />
        <Info label="Số điện thoại" value={registration ? maskPhone(registration.phone) : "—"} />
        <Info label="Mã đăng ký" value={registration?.ticketCode ?? "—"} />
        <Info label="Thời gian chơi" value={reward.playedAt} />
      </dl>
      {claimedDone ? (
        <div className="rounded-xl p-3" style={{ backgroundColor: T.successSubtle }}>
          <p style={{ fontSize: T.xs, fontWeight: T.fw_semi, color: T.successText, letterSpacing: "0.04em" }}>PHẦN QUÀ ĐÃ ĐƯỢC TRAO</p>
          <p style={{ fontSize: T.sm, color: T.foreground, marginTop: 4 }}>
            Thời gian nhận: {reward.claimedAt} · Nhân viên xác nhận: {reward.claimedBy}
          </p>
        </div>
      ) : (
        <div className="flex items-center gap-2 flex-wrap">
          <Button onClick={onConfirm}><CheckCircle2 className="size-4" /> Xác nhận đã trao quà</Button>
          <Button variant="ghost" onClick={onIncident}>Báo sự cố quà tặng</Button>
        </div>
      )}
    </div>
  );
}

// ── Pieces ───────────────────────────────────────────────────────────────────

/** Cột cố định để hạng vé (căn trái) và trạng thái (căn phải) thẳng hàng giữa các dòng. */
const GUEST_COLS = "grid-cols-[minmax(0,1fr)_auto] sm:grid-cols-[minmax(0,1fr)_120px_210px]";

function Avatar({ name }: { name: string }) {
  return (
    <span className="size-9 rounded-full flex items-center justify-center shrink-0"
      style={{ backgroundColor: "rgba(30,170,255,0.12)", color: T.primary, fontSize: T.sm, fontWeight: T.fw_semi }}>
      {name.trim().split(/\s+/).pop()?.[0]?.toUpperCase()}
    </span>
  );
}

function CheckedInPill({ guest: g }: { guest: Guest }) {
  return (
    <span className="flex items-center gap-1.5 whitespace-nowrap" title={g.source === "self" ? "Tự check-in bằng số điện thoại" : undefined}
      style={{ fontSize: T.xs, fontWeight: T.fw_medium, color: T.successText, backgroundColor: T.successSubtle,
        padding: "4px 10px", borderRadius: 999 }}>
      {g.source === "self" ? <Smartphone className="size-3.5" /> : <CheckCircle2 className="size-3.5" />}
      Đã check-in{g.checkinTime ? ` · ${g.checkinTime}` : ""}
    </span>
  );
}

function GuestRow({ guest: g, onCheckIn, onUndo }: { guest: Guest; onCheckIn: () => void; onUndo: () => void }) {
  return (
    <li className={`grid items-center gap-4 ${GUEST_COLS} py-3`} style={{ borderBottom: `1px solid ${T.border}` }}>
      <div className="flex items-center gap-3 min-w-0">
        <Avatar name={g.name} />
        <div className="min-w-0">
          <p className="truncate" style={{ fontSize: T.sm, fontWeight: T.fw_medium, color: T.foreground }}>{g.name}</p>
          <p className="truncate" style={{ fontSize: T.xs, color: T.mutedFg }}>{g.email} · {g.ticketCode}</p>
        </div>
      </div>
      <div className="hidden sm:block">
        <span className="whitespace-nowrap"
          style={{ fontSize: T.xs, color: T.mutedFg, padding: "2px 8px", borderRadius: 999, border: `1px solid ${T.border}` }}>
          {g.tier}
        </span>
      </div>
      <div className="flex items-center justify-end gap-1">
        {g.status === "going" ? (
          <Button size="sm" variant="outline" onClick={onCheckIn}><UserCheck className="size-3.5" /> Check-in</Button>
        ) : (
          <>
            <CheckedInPill guest={g} />
            <button type="button" onClick={onUndo} title="Hoàn tác check-in" aria-label={`Hoàn tác check-in của ${g.name}`}
              className="size-7 flex items-center justify-center cursor-pointer transition-colors hover:bg-[var(--secondary)]"
              style={{ color: T.mutedFg }}>
              <Undo2 className="size-3.5" />
            </button>
          </>
        )}
      </div>
    </li>
  );
}

function ProgressCard({ checkedIn, total, pct }: { checkedIn: number; total: number; pct: number }) {
  return (
    <div className="rounded-2xl p-4" style={{ backgroundColor: T.secondary }}>
      <div className="flex items-baseline justify-between gap-3">
        <p style={{ color: T.successText }}>
          <span style={{ fontSize: T.xl, fontWeight: T.fw_semi }}>{checkedIn}</span>
          <span style={{ fontSize: T.sm, marginLeft: 6 }}>Đã check-in</span>
        </p>
        <p style={{ fontSize: T.sm, color: T.mutedFg }}>{total} đã đăng ký</p>
      </div>
      <div className="h-1.5 rounded-full overflow-hidden mt-3" style={{ backgroundColor: "rgba(0,0,0,0.08)" }}>
        <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, backgroundColor: T.successText }} />
      </div>
      <a href="/event" target="_blank" rel="noreferrer"
        className="inline-flex items-center gap-1 mt-4 hover:underline"
        style={{ fontSize: T.xs, color: T.mutedFg }}>
        Quản lý sự kiện <ArrowUpRight className="size-3" />
      </a>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0">
      <dt style={{ fontSize: T.xs, color: T.mutedFg }}>{label}</dt>
      <dd className="truncate" style={{ fontSize: T.sm, color: T.foreground, margin: "2px 0 0" }}>{value}</dd>
    </div>
  );
}

function EmptyState({ icon, title, desc, action }: {
  icon: React.ReactNode; title: string; desc: string; action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center text-center py-20">
      <div className="size-20 rounded-full flex items-center justify-center mb-5"
        style={{ backgroundColor: T.secondary, color: T.mutedFg }}>
        {icon}
      </div>
      <p style={{ fontSize: T.lg, fontWeight: T.fw_semi, color: T.mutedFg }}>{title}</p>
      <p style={{ fontSize: T.sm, color: T.mutedFg, marginTop: 6, maxWidth: 380 }}>{desc}</p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

function SettingRow({ label, desc, checked, onChange }: {
  label: string; desc: string; checked: boolean; onChange: (v: boolean) => void;
}) {
  return (
    <label className="flex items-start justify-between gap-3 cursor-pointer">
      <span className="min-w-0">
        <span className="block" style={{ fontSize: T.sm, fontWeight: T.fw_medium, color: T.foreground }}>{label}</span>
        <span className="block" style={{ fontSize: T.xs, color: T.mutedFg, marginTop: 2 }}>{desc}</span>
      </span>
      <Switch checked={checked} onCheckedChange={onChange} className="mt-0.5" />
    </label>
  );
}

/** Góc ngắm của khung quét — bo tròn ở góc ngoài. */
const CORNERS: React.CSSProperties[] = [
  { top: 0,    left: 0,  borderWidth: "3px 0 0 3px", borderTopLeftRadius: 14 },
  { top: 0,    right: 0, borderWidth: "3px 3px 0 0", borderTopRightRadius: 14 },
  { bottom: 0, left: 0,  borderWidth: "0 0 3px 3px", borderBottomLeftRadius: 14 },
  { bottom: 0, right: 0, borderWidth: "0 3px 3px 0", borderBottomRightRadius: 14 },
];

function ScanFrame({ color, scanning }: { color: string; scanning: boolean }) {
  return (
    <div className="relative" style={{ width: "min(46vh, 260px)", aspectRatio: "1 / 1" }}>
      {CORNERS.map((c, i) => (
        <span key={i} className="absolute transition-colors"
          style={{ width: 40, height: 40, borderStyle: "solid", borderColor: color, ...c }} />
      ))}
      {scanning && (
        <span className="ci-scanline absolute left-4 right-4 h-0.5"
          style={{ backgroundColor: "#4ade80", boxShadow: "0 0 12px #4ade80" }} />
      )}
    </div>
  );
}

function ScanResultCard({ result, onConfirm, onNext }: {
  result: ScanResult; onConfirm: () => void; onNext: () => void;
}) {
  const cfg = RESULT_CFG[result.kind];
  const guest = result.kind === "invalid" ? undefined : result.guest;
  return (
    <div className="absolute left-3 right-3 bottom-3 sm:left-4 sm:right-4 sm:bottom-4 rounded-2xl p-4 flex items-center gap-3 flex-wrap"
      style={{ backgroundColor: "#fff", boxShadow: "0 12px 32px rgba(0,0,0,0.35)" }}>
      <span className="size-10 rounded-full flex items-center justify-center shrink-0"
        style={{ backgroundColor: cfg.bg, color: cfg.color }}>
        <cfg.icon className="size-5" />
      </span>
      <div className="flex-1 min-w-[160px]">
        <p style={{ fontSize: T.sm, fontWeight: T.fw_semi, color: cfg.color }}>{resultTitle(result)}</p>
        <p className="truncate" style={{ fontSize: T.sm, fontWeight: T.fw_medium, color: "#111827" }}>
          {guest ? guest.name : `Mã ${result.kind === "invalid" ? result.code : ""}`}
        </p>
        <p className="truncate" style={{ fontSize: T.xs, color: "#6b7280" }}>
          {guest ? `${guest.tier} · ${guest.ticketCode}` : "Mã này không thuộc sự kiện."}
        </p>
      </div>
      <div className="flex items-center gap-2 shrink-0 ml-auto">
        {result.kind === "confirm" && (
          <Button size="sm" onClick={onConfirm}><UserCheck className="size-3.5" /> Check-in</Button>
        )}
        <Button size="sm" variant="outline" onClick={onNext}>Quét tiếp</Button>
      </div>
    </div>
  );
}

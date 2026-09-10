import * as React from "react";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import {
  AlertCircle, CheckCircle2, ChevronRight, Gift, Info, Loader2, Smartphone, Store, UserCheck,
} from "lucide-react";
import { Button } from "../ui/button";
import type { EventDraft } from "../dashboard/EventsPage";
import { dayLabelVi } from "../../data/eventFormat";
import {
  checkIn, findByPhone, gameStateOf, maskName, maskPhone, normalizePhone, registrationsOf,
  setAttendeeSession, useAttendeeSession, useCheckinConfig, useCheckins, useGiftGame, useRewards,
  type Registration,
} from "../../data/attendeeFlow";
import {
  AttendeeShell, CTA, Card, Eyebrow, Notice, T, gameVisible, paths, useDocumentTitle, useNow, withAlpha,
} from "./attendeeUi";

const MSG = {
  empty:    "Vui lòng nhập số điện thoại.",
  invalid:  "Số điện thoại không hợp lệ. Vui lòng kiểm tra lại.",
  notFound: "Không tìm thấy đăng ký phù hợp. Vui lòng kiểm tra lại số điện thoại hoặc liên hệ nhân viên tại booth check-in.",
};

type Step =
  | { kind: "form" }
  | { kind: "pick"; regs: Registration[] }
  | { kind: "confirm"; reg: Registration }
  | { kind: "success"; reg: Registration; at: string }
  | { kind: "already"; reg: Registration };

/**
 * Tự check-in bằng số điện thoại — trang mà QR check-in chung của sự kiện mở ra.
 * Nhập số → (chọn đăng ký nếu một số có nhiều đăng ký) → xác nhận thông tin đã
 * che bớt → check-in, cấp 01 lượt chọn quà và tạo phiên người tham dự.
 * Người đã check-in trước đó: không tạo check-in mới, chỉ khôi phục phiên.
 */
export function SelfCheckIn({ event }: { event: EventDraft }) {
  const eventId = event.id;
  const navigate = useNavigate();
  const [config] = useCheckinConfig(eventId);
  const checkins = useCheckins(eventId);
  const rewards = useRewards(eventId);
  const [game] = useGiftGame(eventId);
  const session = useAttendeeSession(eventId);
  const now = useNow();
  const gameState = gameStateOf(game, rewards, now);
  // Còn lượt khi minigame đang, sắp diễn ra hoặc tạm dừng; đã kết thúc hay hết quà thì không mời chọn quà nữa.
  const hasTurn = gameState === "active" || gameState === "upcoming" || gameState === "paused";
  const brand = game?.ui.brandColor || "#1eaaff";

  const [phone, setPhone] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [step, setStep]   = useState<Step>({ kind: "form" });
  const [busy, setBusy]   = useState<"lookup" | "checkin" | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const timer = useRef<number>();
  // Đọc trạng thái check-in mới nhất trong callback hẹn giờ (tab nhân viên có thể vừa check-in người này).
  const checkinsRef = useRef(checkins);
  checkinsRef.current = checkins;
  useEffect(() => () => window.clearTimeout(timer.current), []);
  useDocumentTitle(`Check-in · ${event.name || "Sự kiện"}`);

  const day = dayLabelVi(event.startDate);
  const subtitle = day ? [day, event.startTime].filter(Boolean).join(" · ") : undefined;
  const sessionReg = session ? registrationsOf(eventId).find((r) => r.id === session) : undefined;

  const fail = (msg: string) => { setError(msg); inputRef.current?.focus(); };

  const choose = (reg: Registration) => {
    if (checkinsRef.current[reg.id]) {
      setAttendeeSession(eventId, reg.id);
      setStep({ kind: "already", reg });
    } else {
      setStep({ kind: "confirm", reg });
    }
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (busy) return;
    if (!phone.trim()) return fail(MSG.empty);
    const normalized = normalizePhone(phone);
    if (!normalized) return fail(MSG.invalid);
    setError(null);
    setBusy("lookup");
    timer.current = window.setTimeout(() => {
      setBusy(null);
      const regs = findByPhone(eventId, normalized);
      if (regs.length === 0) fail(MSG.notFound);
      else if (regs.length > 1) setStep({ kind: "pick", regs });
      else choose(regs[0]);
    }, 500);
  };

  const confirm = (reg: Registration) => {
    if (busy) return;
    setBusy("checkin");
    timer.current = window.setTimeout(() => {
      setBusy(null);
      // checkIn tự kiểm tra lại: đã check-in thì không tạo bản ghi mới, không cấp thêm lượt.
      const res = checkIn(eventId, reg.id, "self", "Người tham dự");
      setAttendeeSession(eventId, reg.id);
      setStep(res.status === "ok" ? { kind: "success", reg, at: res.record.at } : { kind: "already", reg });
    }, 600);
  };

  const backToForm = () => { setStep({ kind: "form" }); setError(null); };
  const toOverview = () => navigate(paths.overview(eventId));
  const toGame = () => navigate(paths.game(eventId));

  let body: React.ReactNode;
  if (!config.phone && (step.kind === "form" || step.kind === "pick" || step.kind === "confirm")) {
    body = (
      <Notice icon={<Store className="size-7" />} tone="warning" title="Chưa mở tự check-in bằng số điện thoại">
        Sự kiện này không hỗ trợ tự check-in bằng số điện thoại. Vui lòng đến booth check-in để nhân viên hỗ trợ bạn check-in.
      </Notice>
    );
  } else if (step.kind === "form") {
    body = (
      <>
        {sessionReg && checkins[sessionReg.id] && (
          <div className="flex items-center gap-3 px-4 py-3"
            style={{ borderRadius: 16, backgroundColor: T.successSubtle, border: `1px solid ${T.successBorder}` }}>
            <CheckCircle2 className="size-5 shrink-0" style={{ color: T.successText }} />
            <p className="flex-1 min-w-0" style={{ fontSize: T.sm, color: T.successText, lineHeight: 1.45 }}>
              Thiết bị này đã check-in cho <b>{maskName(sessionReg.name)}</b>.
            </p>
            <Button size="sm" variant="outline" className="shrink-0" onClick={toOverview}>Tổng quan</Button>
          </div>
        )}
        <Card>
          <form onSubmit={submit} noValidate>
            <span className="size-12 flex items-center justify-center"
              style={{ borderRadius: 16, backgroundColor: withAlpha("#1eaaff", 0.12), color: T.primary }}>
              <Smartphone className="size-6" />
            </span>
            <h2 className="mt-4" style={{ fontSize: T.xl, fontWeight: T.fw_semi }}>Check-in sự kiện</h2>
            <p className="mt-1.5" style={{ fontSize: T.base, color: T.mutedFg, lineHeight: 1.55 }}>
              Nhập số điện thoại bạn đã sử dụng khi đăng ký sự kiện.
            </p>
            <label htmlFor="attendee-phone" className="block mt-5" style={{ fontSize: T.sm, fontWeight: T.fw_medium }}>
              Số điện thoại
            </label>
            <input id="attendee-phone" ref={inputRef} type="tel" inputMode="tel" autoComplete="tel"
              placeholder="VD: 0981 234 567" value={phone}
              onChange={(e) => { setPhone(e.target.value); if (error) setError(null); }}
              aria-invalid={!!error} aria-describedby={error ? "attendee-phone-error" : undefined}
              className="mt-2 w-full h-12 px-4 border border-border bg-background outline-none transition-shadow focus:border-primary focus:ring-[3px] focus:ring-primary/20"
              style={{ fontSize: T.base, borderRadius: 14, ...(error ? { borderColor: T.danger } : {}) }} />
            {error && (
              <p id="attendee-phone-error" role="alert" className="mt-2 flex items-start gap-1.5"
                style={{ fontSize: T.sm, color: T.danger, lineHeight: 1.5 }}>
                <AlertCircle className="size-4 shrink-0 mt-0.5" /> {error}
              </p>
            )}
            <Button type="submit" className={`${CTA} mt-5`} disabled={busy === "lookup"}>
              {busy === "lookup" ? <><Loader2 className="size-5 ag-spin" /> Đang kiểm tra…</> : "Tiếp tục"}
            </Button>
          </form>
          <p className="mt-4 flex items-start gap-2" style={{ fontSize: T.sm, color: T.mutedFg, lineHeight: 1.5 }}>
            <Info className="size-4 shrink-0 mt-0.5" /> Cần hỗ trợ? Liên hệ nhân viên tại booth check-in.
          </p>
        </Card>
      </>
    );
  } else if (step.kind === "pick") {
    body = (
      <Card className="ag-rise-in">
        <h2 style={{ fontSize: T.xl, fontWeight: T.fw_semi }}>Chọn đăng ký của bạn</h2>
        <p className="mt-1.5" style={{ fontSize: T.base, color: T.mutedFg, lineHeight: 1.55 }}>
          Số điện thoại {maskPhone(step.regs[0].phone)} có {step.regs.length} đăng ký. Chọn đúng đăng ký của bạn để tiếp tục.
        </p>
        <ul className="mt-4 flex flex-col gap-2.5">
          {step.regs.map((r) => (
            <li key={r.id}>
              <button type="button" onClick={() => choose(r)}
                className="rounded-2xl w-full flex items-center gap-3 px-4 py-3.5 text-left cursor-pointer transition-colors hover:bg-[var(--secondary)]"
                style={{ border: `1px solid ${T.border}` }}>
                <Initial name={r.name} />
                <span className="flex-1 min-w-0">
                  <span className="block truncate" style={{ fontSize: T.base, fontWeight: T.fw_semi }}>{maskName(r.name)}</span>
                  <span className="block" style={{ fontSize: T.sm, color: T.mutedFg }}>
                    Loại vé: {r.tier}{checkins[r.id] ? " · Đã check-in" : ""}
                  </span>
                </span>
                <ChevronRight className="size-5 shrink-0" style={{ color: T.mutedFg }} />
              </button>
            </li>
          ))}
        </ul>
        <Button variant="ghost" className="h-11 w-full mt-3 text-base" onClick={backToForm}>Nhập số khác</Button>
      </Card>
    );
  } else if (step.kind === "confirm") {
    const { reg } = step;
    body = (
      <Card className="ag-rise-in">
        <h2 style={{ fontSize: T.xl, fontWeight: T.fw_semi }}>Xác nhận thông tin</h2>
        <p className="mt-1.5" style={{ fontSize: T.base, color: T.mutedFg, lineHeight: 1.55 }}>
          Kiểm tra thông tin đăng ký của bạn trước khi check-in.
        </p>
        <div className="mt-4 p-4" style={{ borderRadius: 16, backgroundColor: T.secondary }}>
          <div className="flex items-center gap-3">
            <Initial name={reg.name} />
            <p className="min-w-0" style={{ fontSize: T.lg, fontWeight: T.fw_semi }}>{maskName(reg.name)}</p>
          </div>
          <dl className="mt-3 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1.5" style={{ fontSize: T.sm }}>
            <dt style={{ color: T.mutedFg }}>Số điện thoại</dt>
            <dd style={{ fontWeight: T.fw_semi }}>{maskPhone(reg.phone)}</dd>
            <dt style={{ color: T.mutedFg }}>Loại vé</dt>
            <dd style={{ fontWeight: T.fw_semi }}>{reg.tier}</dd>
          </dl>
        </div>
        <Button className={`${CTA} mt-5`} onClick={() => confirm(reg)} disabled={busy === "checkin"}>
          {busy === "checkin"
            ? <><Loader2 className="size-5 ag-spin" /> Đang check-in…</>
            : <><UserCheck className="size-5" /> Xác nhận check-in</>}
        </Button>
        <Button variant="ghost" className="h-11 w-full mt-2 text-base" onClick={backToForm} disabled={busy === "checkin"}>
          Không phải tôi
        </Button>
      </Card>
    );
  } else if (step.kind === "success") {
    const { reg, at } = step;
    body = (
      <Card className="flex flex-col items-center text-center ag-rise-in">
        <span className="ag-pop size-16 rounded-full flex items-center justify-center"
          style={{ backgroundColor: T.successSubtle, color: T.successText }}>
          <CheckCircle2 className="size-9" />
        </span>
        <div className="mt-4"><Eyebrow color={T.successText}>CHECK-IN THÀNH CÔNG</Eyebrow></div>
        <h2 className="mt-2" style={{ fontSize: T.xxl, fontWeight: T.fw_bold, lineHeight: 1.3 }}>Chào {reg.name}!</h2>
        <p className="mt-1" style={{ fontSize: T.sm, color: T.mutedFg }}>Check-in lúc {at} · {reg.tier}</p>
        {hasTurn && (
          <div className="mt-4 w-full flex items-center gap-3 px-4 py-3 text-left"
            style={{ borderRadius: 16, backgroundColor: withAlpha(brand, 0.1) }}>
            <Gift className="size-6 shrink-0" style={{ color: brand }} />
            <p style={{ fontSize: T.base, fontWeight: T.fw_medium, lineHeight: 1.45 }}>
              Bạn đã nhận được 01 lượt chọn quà ngẫu nhiên.
            </p>
          </div>
        )}
        <div className="mt-5 w-full flex flex-col gap-2.5">
          {hasTurn && (
            <Button className={`${CTA} hover:brightness-95`} style={{ backgroundColor: brand }} onClick={toGame}>
              <Gift className="size-5" /> Chọn quà ngay
            </Button>
          )}
          <Button variant={hasTurn ? "outline" : "default"} className={CTA} onClick={toOverview}>
            Về Tổng quan sự kiện
          </Button>
        </div>
      </Card>
    );
  } else {
    const { reg } = step;
    const played = !!rewards[reg.id];
    const openGame = hasTurn || (played && gameVisible(gameState));
    const record = checkins[reg.id];
    body = (
      <Notice icon={<UserCheck className="size-7" />} tone="info" title="Bạn đã check-in thành công trước đó."
        actions={
          <>
            <Button className={CTA} onClick={toOverview}>Về Tổng quan sự kiện</Button>
            {openGame && (
              <Button variant="outline" className={CTA} onClick={toGame}>
                {played ? "Xem kết quả" : <><Gift className="size-5" /> Chọn quà ngay</>}
              </Button>
            )}
          </>
        }>
        <p>{maskName(reg.name)}{record ? ` · Check-in lúc ${record.at}` : ""}</p>
        {openGame && (
          <p className="mt-2" style={{ color: T.foreground, fontWeight: T.fw_medium }}>
            {played ? "Bạn đã sử dụng lượt chọn quà. Vui lòng xem lại kết quả." : "Bạn còn 01 lượt chọn quà."}
          </p>
        )}
      </Notice>
    );
  }

  return <AttendeeShell event={event} subtitle={subtitle}>{body}</AttendeeShell>;
}

function Initial({ name }: { name: string }) {
  return (
    <span className="size-10 rounded-full flex items-center justify-center shrink-0"
      style={{ backgroundColor: withAlpha("#1eaaff", 0.14), color: T.primary, fontSize: T.base, fontWeight: T.fw_semi }}>
      {name.trim().split(/\s+/).pop()?.[0]?.toUpperCase()}
    </span>
  );
}

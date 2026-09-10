import * as React from "react";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { AlertTriangle, ArrowLeft, Clock, Flag, Gift, PackageX, Pause, UserCheck, UserX } from "lucide-react";
import { Button } from "../ui/button";
import type { EventDraft } from "../dashboard/EventsPage";
import {
  gameStateOf, playGiftBox, registrationsOf, rewardGift, useAttendeeSession, useCheckins, useGiftGame, useRewards,
  type GameState, type Gift as GiftItem, type PlayResult,
} from "../../data/attendeeFlow";
import {
  AttendeeShell, CTA, Card, Eyebrow, GiftImage, Notice, T, WaitingDots, closedGameMessage, gameVisible, paths,
  useDocumentTitle, useNow, withAlpha, type Tone,
} from "./attendeeUi";
import { GiftBoxArt } from "./GiftBoxArt";
import { ClaimCodePanel, PickupLocation, RewardStatusLine } from "./RewardDisplay";

type Phase = "idle" | "waiting" | "opening" | "result";

const WAIT_MS = 1200;
const OPEN_MS = 1400;
const TURN_LINE = "Bạn có 01 lượt duy nhất.";

const CLOSED_ICON: Partial<Record<GameState, { icon: React.ReactNode; tone: Tone }>> = {
  upcoming: { icon: <Clock className="size-7" />,    tone: "info" },
  paused:   { icon: <Pause className="size-7" />,    tone: "warning" },
  ended:    { icon: <Flag className="size-7" />,     tone: "muted" },
  soldout:  { icon: <PackageX className="size-7" />, tone: "muted" },
};

/**
 * Minigame chọn quà ngẫu nhiên: 01 lượt, chọn 1 trong 3 hộp. Chạm hộp đầu tiên
 * là khoá cả ba; chờ hệ thống xác định phần quà rồi mới mở đúng hộp đã chọn.
 * Đã có phần quà thì không hiện hộp nữa mà hiện thẳng phần quà và trạng thái
 * nhận — trạng thái này theo dõi trực tiếp, nhân viên xác nhận trao là tự đổi.
 */
export function GiftBoxGame({ event }: { event: EventDraft }) {
  const eventId = event.id;
  const navigate = useNavigate();
  const session = useAttendeeSession(eventId);
  const checkins = useCheckins(eventId);
  const rewards = useRewards(eventId);
  const [game] = useGiftGame(eventId);
  useNow(); // hiển thị lại định kỳ để trạng thái theo giờ tự đổi
  useDocumentTitle(`Chọn quà · ${event.name || "Sự kiện"}`);

  const [phase, setPhase]   = useState<Phase>("idle");
  const [picked, setPicked] = useState<1 | 2 | 3 | null>(null);
  const [prize, setPrize]   = useState<GiftItem | null>(null);
  const [error, setError]   = useState<string | null>(null);
  const [justPlayed, setJustPlayed] = useState(false);
  const locked = useRef(false);
  const timers = useRef<number[]>([]);
  useEffect(() => () => timers.current.forEach((t) => window.clearTimeout(t)), []);
  const later = (fn: () => void, ms: number) => { timers.current.push(window.setTimeout(fn, ms)); };

  const reg = session ? registrationsOf(eventId).find((r) => r.id === session) : undefined;
  // Tính theo giờ lúc hiển thị để khớp với kiểm tra của playGiftBox.
  const state = gameStateOf(game, rewards, new Date());
  const reward = reg ? rewards[reg.id] : undefined;
  const prizeOfReward = reward && game ? rewardGift(game, reward) : undefined;
  const brand = game?.ui.brandColor || "#1eaaff";
  const playing = phase === "waiting" || phase === "opening";
  const toOverview = () => navigate(paths.overview(eventId));

  const pick = (box: 1 | 2 | 3) => {
    if (locked.current || !reg) return; // chỉ nhận lần chọn đầu tiên
    locked.current = true;
    setPicked(box);
    setError(null);
    setPhase("waiting");
    later(() => {
      let res: PlayResult;
      try {
        res = playGiftBox(eventId, reg.id, box);
      } catch {
        res = { status: "closed" };
        setError("Có lỗi xảy ra, vui lòng thử lại.");
      }
      if (res.status === "ok" || res.status === "already") {
        setPrize(res.gift);
        setJustPlayed(true);
        setPhase("opening");
        later(() => setPhase("result"), OPEN_MS);
      } else {
        // Điều kiện đổi trong lúc chờ (tạm dừng, hết quà, bị hoàn tác check-in): mở khoá,
        // màn hiển thị lại theo dữ liệu mới nhất.
        locked.current = false;
        setPicked(null);
        setPhase("idle");
      }
    }, WAIT_MS);
  };

  let body: React.ReactNode;
  if (!playing && reward) {
    body = prizeOfReward && game ? (
      <>
        <Card className="text-center ag-rise-in"
          style={{ background: `linear-gradient(180deg, ${withAlpha(brand, 0.14)} 0%, ${T.background} 45%)` }}>
          <Eyebrow color={brand}>{justPlayed ? "Chúc mừng bạn!" : "Phần quà của bạn"}</Eyebrow>
          <div className="ag-pop mt-4 mx-auto size-28 rounded-full flex items-center justify-center"
            style={{ backgroundColor: "#fff", boxShadow: `0 10px 30px ${withAlpha(brand, 0.3)}` }}>
            <GiftImage image={prizeOfReward.image} name={prizeOfReward.name} size={64} />
          </div>
          <h2 className="mt-4" style={{ fontSize: T.xxl, fontWeight: T.fw_bold, lineHeight: 1.3 }}>{prizeOfReward.name}</h2>
          {prizeOfReward.description && (
            <p className="mt-1" style={{ fontSize: T.sm, color: T.mutedFg }}>{prizeOfReward.description}</p>
          )}
          <p className="mt-1" style={{ fontSize: T.xs, color: T.mutedFg }}>
            Bạn đã chọn hộp {reward.box} lúc {reward.playedAt}
          </p>
          {reward.status === "pending" && game.ui.resultText && (
            <p className="mt-3" style={{ fontSize: T.base, lineHeight: 1.5 }}>{game.ui.resultText}</p>
          )}
          <div className="mt-5 flex flex-col gap-3 text-left">
            {reward.status === "pending" && <ClaimCodePanel reward={reward} />}
            <PickupLocation game={game} gift={prizeOfReward} />
            <RewardStatusLine reward={reward} />
          </div>
        </Card>
        <Button className={CTA} onClick={toOverview}>Về Tổng quan</Button>
      </>
    ) : (
      <Notice icon={<AlertTriangle className="size-7" />} tone="warning"
        title="Không thể tải thông tin Minigame. Vui lòng thử lại."
        actions={<Button variant="outline" className={CTA} onClick={() => window.location.reload()}>Thử lại</Button>} />
    );
  } else if (!playing && reg && !reg.valid) {
    body = (
      <Notice icon={<UserX className="size-7" />} tone="danger" title="Đăng ký của bạn không còn hiệu lực.">
        Vui lòng liên hệ Ban tổ chức để được hỗ trợ.
      </Notice>
    );
  } else if (!playing && (!reg || !checkins[reg.id])) {
    body = (
      <Notice icon={<UserCheck className="size-7" />} tone="warning"
        title="Bạn cần hoàn tất check-in trước khi tham gia Minigame."
        actions={<Button className={CTA} onClick={() => navigate(paths.checkIn(eventId))}>Check-in ngay</Button>} />
    );
  } else if (!playing && (!game || !gameVisible(state))) {
    body = (
      <Notice icon={<Gift className="size-7" />} tone="muted" title="Sự kiện này hiện chưa có Minigame."
        actions={<Button variant="outline" className={CTA} onClick={toOverview}>Về Tổng quan</Button>} />
    );
  } else if (!playing && state !== "active") {
    const cfg = CLOSED_ICON[state] ?? CLOSED_ICON.ended!;
    body = (
      <Notice icon={cfg.icon} tone={cfg.tone} title={closedGameMessage(state, game)}
        actions={<Button variant="outline" className={CTA} onClick={toOverview}>Về Tổng quan</Button>} />
    );
  } else if (game) {
    const intro = game.ui.intro.replace(TURN_LINE, "").trim();
    body = (
      <>
        <Card className="text-center"
          style={{ background: `linear-gradient(180deg, ${withAlpha(brand, 0.14)} 0%, ${T.background} 55%)` }}>
          <Eyebrow color={brand}>{game.name}</Eyebrow>
          <h2 className="mt-2" style={{ fontSize: T.xxl, fontWeight: T.fw_bold, lineHeight: 1.25, textTransform: "uppercase" }}>
            {game.ui.title}
          </h2>
          <span className="mt-3 inline-flex items-center gap-1.5 px-3 py-1"
            style={{ borderRadius: 999, backgroundColor: withAlpha(brand, 0.12), color: brand, fontSize: T.sm, fontWeight: T.fw_semi }}>
            <Gift className="size-4" /> {TURN_LINE}
          </span>
          {intro && <p className="mt-3" style={{ fontSize: T.base, color: T.mutedFg, lineHeight: 1.5 }}>{intro}</p>}

          <div className="mt-6 grid grid-cols-3 gap-3" role="group" aria-label="Ba hộp quà">
            {([1, 2, 3] as const).map((n, i) => {
              const chosen = picked === n;
              const dim = picked !== null && !chosen;
              const art = picked === null ? "idle" : chosen ? (phase === "opening" ? "open" : "shake") : "rest";
              return (
                <button key={n} type="button" onClick={() => pick(n)} disabled={picked !== null}
                  aria-label={`Chọn hộp quà số ${n}`} aria-pressed={chosen}
                  className="rounded-2xl relative flex flex-col items-center gap-1.5 pt-4 pb-3 transition-all duration-300 outline-none focus-visible:ring-[3px] focus-visible:ring-primary/40 enabled:cursor-pointer enabled:hover:-translate-y-1 enabled:active:scale-95"
                  style={{
                    backgroundColor: "#fff",
                    border: `1.5px solid ${chosen ? brand : withAlpha(brand, 0.25)}`,
                    boxShadow: chosen ? `0 10px 28px ${withAlpha(brand, 0.35)}` : "0 2px 6px rgba(15,23,42,0.06)",
                    opacity: dim ? 0.35 : 1,
                    transform: dim ? "scale(0.92)" : chosen ? "scale(1.05)" : undefined,
                    zIndex: chosen ? 1 : 0,
                  }}>
                  <GiftBoxArt color={brand} size={76} state={art} delay={i * 0.35}
                    prize={chosen && phase === "opening" && prize ? { image: prize.image, name: prize.name } : undefined} />
                  <span style={{ fontSize: T.sm, fontWeight: T.fw_semi, color: chosen ? brand : T.mutedFg }}>Hộp {n}</span>
                </button>
              );
            })}
          </div>

          <div className="mt-5 min-h-6 flex items-center justify-center gap-2" aria-live="polite"
            style={{ fontSize: T.base, fontWeight: T.fw_medium, color: brand }}>
            {phase === "waiting" && <>Đang mở hộp quà <WaitingDots color={brand} /></>}
            {phase === "opening" && prize && <>Bạn nhận được {prize.name}!</>}
            {phase === "idle" && !error && (
              <span style={{ color: T.mutedFg, fontWeight: T.fw_normal }}>Chạm vào một hộp để mở</span>
            )}
            {phase === "idle" && error && <span role="alert" style={{ color: T.danger }}>{error}</span>}
          </div>
        </Card>
        <Button variant="outline" className={CTA} onClick={toOverview} disabled={playing}>
          <ArrowLeft className="size-5" /> Về Tổng quan
        </Button>
      </>
    );
  }

  return <AttendeeShell event={event} compact>{body}</AttendeeShell>;
}

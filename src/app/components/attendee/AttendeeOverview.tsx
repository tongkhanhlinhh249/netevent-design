import * as React from "react";
import { useState } from "react";
import { useNavigate } from "react-router";
import { AlertTriangle, CalendarDays, CheckCircle2, Clock, Gift, MapPin, QrCode, UserX } from "lucide-react";
import { Button } from "../ui/button";
import type { EventDraft } from "../dashboard/EventsPage";
import { longDateVi, shortDateVi } from "../../data/eventFormat";
import {
  gameStateOf, registrationsOf, rewardGift, setAttendeeSession, useAttendeeSession, useCheckins, useGiftGame, useRewards,
} from "../../data/attendeeFlow";
import {
  AttendeeShell, CTA, Card, Eyebrow, GiftImage, Notice, T, closedGameMessage, gameStartLabel, gameVisible, paths,
  useDocumentTitle, useNow, withAlpha,
} from "./attendeeUi";
import { GiftBoxArt } from "./GiftBoxArt";
import { ClaimCodeDialog, RewardStatusLine } from "./RewardDisplay";

/**
 * Tổng quan sự kiện của người tham dự đã check-in: thông tin sự kiện, trạng thái
 * check-in và khu vực Minigame theo trạng thái lượt chơi / phần quà của chính
 * người này. Không hiển thị tồn kho, tỷ lệ hay kết quả của người khác.
 */
export function AttendeeOverview({ event }: { event: EventDraft }) {
  const eventId = event.id;
  const navigate = useNavigate();
  const session = useAttendeeSession(eventId);
  const checkins = useCheckins(eventId);
  const rewards = useRewards(eventId);
  const [game] = useGiftGame(eventId);
  const now = useNow();
  const [codeOpen, setCodeOpen] = useState(false);
  useDocumentTitle(`Tổng quan · ${event.name || "Sự kiện"}`);

  const reg = session ? registrationsOf(eventId).find((r) => r.id === session) : undefined;

  if (!reg) {
    return (
      <AttendeeShell event={event}>
        <Notice icon={<Clock className="size-7" />} tone="warning"
          title="Phiên truy cập đã hết hạn. Vui lòng xác thực lại thông tin check-in."
          actions={<Button className={CTA} onClick={() => navigate(paths.checkIn(eventId))}>Xác thực lại</Button>} />
      </AttendeeShell>
    );
  }
  if (!reg.valid) {
    return (
      <AttendeeShell event={event}>
        <Notice icon={<UserX className="size-7" />} tone="danger" title="Đăng ký của bạn không còn hiệu lực.">
          Vui lòng liên hệ Ban tổ chức để được hỗ trợ.
        </Notice>
      </AttendeeShell>
    );
  }

  const record = checkins[reg.id];
  const state = gameStateOf(game, rewards, now);
  const reward = rewards[reg.id];
  const gift = reward && game ? rewardGift(game, reward) : undefined;
  const brand = game?.ui.brandColor || "#1eaaff";
  const toGame = () => navigate(paths.game(eventId));

  const isOnline = event.format === "online";
  const multiDay = !!event.endDate && event.endDate !== event.startDate;
  const dateLabel = longDateVi(event.startDate) ?? "Chưa có thời gian";
  const timeLabel = event.startTime
    ? `${event.startTime}${event.endTime ? ` – ${event.endTime}` : ""}${multiDay ? ` · đến ${shortDateVi(event.endDate)}` : ""}`
    : undefined;
  const place = isOnline ? "Sự kiện trực tuyến" : event.location?.trim() || "Chưa có địa điểm";

  let gameCard: React.ReactNode = null;
  if (reward && (!game || !gift)) {
    gameCard = (
      <Notice icon={<AlertTriangle className="size-7" />} tone="warning"
        title="Không thể tải thông tin Minigame. Vui lòng thử lại."
        actions={<Button variant="outline" className={CTA} onClick={() => window.location.reload()}>Thử lại</Button>} />
    );
  } else if (reward && gift && game) {
    gameCard = (
      <Card>
        <Eyebrow color={brand}>PHẦN QUÀ CỦA BẠN</Eyebrow>
        <div className="mt-3 flex items-center gap-4">
          <span className="size-16 shrink-0 flex items-center justify-center"
            style={{ borderRadius: 16, backgroundColor: withAlpha(brand, 0.1) }}>
            <GiftImage image={gift.image} name={gift.name} size={44} />
          </span>
          <div className="min-w-0">
            <p style={{ fontSize: T.lg, fontWeight: T.fw_semi, lineHeight: 1.35 }}>{gift.name}</p>
            <p className="truncate" style={{ fontSize: T.xs, color: T.mutedFg, marginTop: 2 }}>{game.name}</p>
          </div>
        </div>
        <div className="mt-4"><RewardStatusLine reward={reward} /></div>
        {reward.status === "pending" && (
          <Button className={`${CTA} mt-4`} onClick={() => setCodeOpen(true)}>
            <QrCode className="size-5" /> Xem mã nhận quà
          </Button>
        )}
        <Button variant="ghost" className="h-11 w-full mt-2 text-base" onClick={toGame}>Xem chi tiết trong Minigame</Button>
        <ClaimCodeDialog open={codeOpen} onOpenChange={setCodeOpen} reward={reward} gift={gift} game={game} />
      </Card>
    );
  } else if (gameVisible(state) && game) {
    const message = state === "upcoming" ? `Minigame sẽ bắt đầu lúc ${gameStartLabel(game)}.` : closedGameMessage(state, game);
    gameCard = (
      <Card style={{ background: `linear-gradient(160deg, ${withAlpha(brand, 0.14)} 0%, ${T.background} 62%)` }}>
        <div className="flex items-start gap-3">
          <div className="flex-1 min-w-0">
            <Eyebrow color={brand}>CHỌN QUÀ MAY MẮN</Eyebrow>
            <p className="mt-1.5" style={{ fontSize: T.lg, fontWeight: T.fw_semi, lineHeight: 1.35 }}>{game.name}</p>
            {record && (state === "active" || state === "upcoming" || state === "paused") && (
              <p className="mt-1" style={{ fontSize: T.base, color: T.mutedFg }}>Bạn có 01 lượt chọn quà.</p>
            )}
          </div>
          <GiftBoxArt color={brand} size={68} state={state === "active" && record ? "idle" : "rest"} />
        </div>
        {!record ? (
          <>
            <p className="mt-3" style={{ fontSize: T.base, color: T.mutedFg, lineHeight: 1.5 }}>
              Bạn cần hoàn tất check-in trước khi tham gia Minigame.
            </p>
            <Button className={`${CTA} mt-4`} onClick={() => navigate(paths.checkIn(eventId))}>Check-in ngay</Button>
          </>
        ) : state === "active" ? (
          <Button className={`${CTA} mt-4 hover:brightness-95`} style={{ backgroundColor: brand }} onClick={toGame}>
            <Gift className="size-5" /> Chọn quà ngay
          </Button>
        ) : (
          <div className="mt-3 flex items-start gap-2.5 px-3.5 py-3" style={{ borderRadius: 14, backgroundColor: T.secondary }}>
            <Clock className="size-5 shrink-0 mt-px" style={{ color: T.mutedFg }} />
            <p style={{ fontSize: T.sm, lineHeight: 1.5 }}>{message}</p>
          </div>
        )}
      </Card>
    );
  }

  return (
    <AttendeeShell event={event}>
      <Card>
        <InfoRow icon={<CalendarDays className="size-5" />} primary={dateLabel} secondary={timeLabel} />
        <InfoRow icon={<MapPin className="size-5" />} primary={place} className="mt-3.5" />
        <div className="mt-4 pt-4 flex items-center justify-between gap-3" style={{ borderTop: `1px solid ${T.border}` }}>
          <div className="min-w-0">
            <p style={{ fontSize: T.xs, color: T.mutedFg }}>Người tham dự</p>
            <p className="truncate" style={{ fontSize: T.base, fontWeight: T.fw_semi }}>{reg.name}</p>
            <p style={{ fontSize: T.xs, color: T.mutedFg }}>{reg.tier} · {reg.ticketCode}</p>
          </div>
          {record ? (
            <span className="shrink-0 inline-flex items-center gap-1.5 whitespace-nowrap"
              style={{ fontSize: T.xs, fontWeight: T.fw_semi, color: T.successText, backgroundColor: T.successSubtle,
                border: `1px solid ${T.successBorder}`, padding: "5px 10px", borderRadius: 999 }}>
              <CheckCircle2 className="size-3.5" /> Đã check-in · {record.at}
            </span>
          ) : (
            <span className="shrink-0 whitespace-nowrap"
              style={{ fontSize: T.xs, fontWeight: T.fw_semi, color: T.warningText, backgroundColor: T.warningSubtle,
                border: `1px solid ${T.warningBorder}`, padding: "5px 10px", borderRadius: 999 }}>
              Chưa check-in
            </span>
          )}
        </div>
      </Card>

      {gameCard}

      <button type="button" data-pill="off" className="mx-auto mt-1 cursor-pointer hover:underline"
        style={{ fontSize: T.sm, color: T.mutedFg }}
        onClick={() => { setAttendeeSession(eventId, null); navigate(paths.checkIn(eventId)); }}>
        Không phải bạn? Check-in bằng số điện thoại khác
      </button>
    </AttendeeShell>
  );
}

function InfoRow({ icon, primary, secondary, className = "" }: {
  icon: React.ReactNode; primary: string; secondary?: string; className?: string;
}) {
  return (
    <div className={`flex items-start gap-3 ${className}`}>
      <span className="size-10 shrink-0 flex items-center justify-center"
        style={{ borderRadius: 12, backgroundColor: T.secondary, color: T.mutedFg }}>
        {icon}
      </span>
      <div className="min-w-0 pt-0.5">
        <p style={{ fontSize: T.base, fontWeight: T.fw_medium, lineHeight: 1.4 }}>{primary}</p>
        {secondary && <p style={{ fontSize: T.sm, color: T.mutedFg }}>{secondary}</p>}
      </div>
    </div>
  );
}

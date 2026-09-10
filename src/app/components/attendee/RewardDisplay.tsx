import { CheckCircle2, Clock, MapPin } from "lucide-react";
import { Button } from "../ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogTitle } from "../ui/dialog";
import { PseudoQr } from "./PseudoQr";
import { GiftImage, T } from "./attendeeUi";
import type { Gift, GiftGame, Reward } from "../../data/attendeeFlow";

/**
 * Phần thưởng của người tham dự: trạng thái nhận, mã nhận quà (QR + mã chữ) và
 * vị trí nhận. Dữ liệu reward truyền vào là bản đang theo dõi (useRewards), nên
 * khi nhân viên booth xác nhận trao quà, các khối này tự chuyển sang "Đã nhận quà".
 */

/** "Trạng thái: Chờ nhận tại booth check-in" hoặc "Trạng thái: Đã nhận quà · Thời gian nhận: 09:10". */
export function RewardStatusLine({ reward }: { reward: Reward }) {
  const claimed = reward.status === "claimed";
  return (
    <div key={reward.status} className="ag-pop flex items-start gap-2.5 px-3.5 py-3"
      style={{ borderRadius: 14, backgroundColor: claimed ? T.successSubtle : T.warningSubtle,
        border: `1px solid ${claimed ? T.successBorder : T.warningBorder}`, textAlign: "left" }}>
      {claimed
        ? <CheckCircle2 className="size-5 shrink-0 mt-px" style={{ color: T.successText }} />
        : <Clock className="size-5 shrink-0 mt-px" style={{ color: T.warningText }} />}
      <div style={{ fontSize: T.sm, lineHeight: 1.5, color: claimed ? T.successText : T.warningText }}>
        <p style={{ fontWeight: T.fw_semi }}>
          Trạng thái: {claimed ? "Đã nhận quà" : "Chờ nhận tại booth check-in"}
        </p>
        {claimed && reward.claimedAt && <p>Thời gian nhận: {reward.claimedAt}</p>}
      </div>
    </div>
  );
}

export function PickupLocation({ game, gift }: { game: GiftGame; gift: Gift }) {
  return (
    <div className="flex items-start gap-2.5 text-left" style={{ fontSize: T.sm, lineHeight: 1.5 }}>
      <MapPin className="size-4 shrink-0 mt-0.5" style={{ color: T.mutedFg }} />
      <div className="min-w-0">
        <p><span style={{ color: T.mutedFg }}>Vị trí nhận:</span>{" "}
          <span style={{ fontWeight: T.fw_semi }}>{game.pickupLocation || "Booth check-in"}</span></p>
        {gift.pickupNote && <p style={{ color: T.mutedFg }}>{gift.pickupNote}</p>}
      </div>
    </div>
  );
}

/**
 * Mã nhận quà để nhân viên quét hoặc nhập. Đã nhận quà thì mã hết tác dụng —
 * thay QR bằng xác nhận đã nhận, chỉ giữ mã chữ để đối chiếu.
 */
export function ClaimCodePanel({ reward }: { reward: Reward }) {
  if (reward.status === "claimed") {
    return (
      <div key="claimed" className="ag-pop flex flex-col items-center text-center px-4 py-5"
        style={{ borderRadius: 16, backgroundColor: T.successSubtle, border: `1px solid ${T.successBorder}` }}>
        <CheckCircle2 className="size-10" style={{ color: T.successText }} />
        <p className="mt-2" style={{ fontSize: T.base, fontWeight: T.fw_semi, color: T.successText }}>Đã nhận quà</p>
        {reward.claimedAt && (
          <p style={{ fontSize: T.sm, color: T.successText }}>Thời gian nhận: {reward.claimedAt}</p>
        )}
        <p className="mt-2" style={{ fontSize: T.xs, color: T.mutedFg }}>
          Mã nhận quà: <span style={{ fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace" }}>{reward.code}</span>
        </p>
      </div>
    );
  }
  return (
    <div key="pending" className="flex flex-col items-center text-center px-4 py-5"
      style={{ borderRadius: 16, backgroundColor: T.secondary }}>
      <p style={{ fontSize: T.xs, fontWeight: T.fw_semi, color: T.mutedFg, letterSpacing: "0.06em", textTransform: "uppercase" }}>
        Mã nhận quà
      </p>
      <div className="mt-3 p-2.5" style={{ backgroundColor: "#fff", borderRadius: 14, boxShadow: "0 1px 3px rgba(15,23,42,0.12)" }}>
        <PseudoQr value={reward.code} size={176} />
      </div>
      <p className="mt-3" aria-label={`Mã nhận quà ${reward.code.split("").join(" ")}`}
        style={{ fontSize: T.xxl, fontWeight: T.fw_bold, letterSpacing: "0.22em",
          fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace", paddingLeft: "0.22em" }}>
        {reward.code}
      </p>
      <p className="mt-1" style={{ fontSize: T.sm, color: T.mutedFg }}>Đưa mã này cho nhân viên để nhận quà.</p>
    </div>
  );
}

/** "Xem mã nhận quà" trên Tổng quan. */
export function ClaimCodeDialog({ open, onOpenChange, reward, gift, game }: {
  open: boolean; onOpenChange: (open: boolean) => void; reward: Reward; gift: Gift; game: GiftGame;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[calc(100%-2rem)] max-w-[400px] sm:max-w-[400px] max-h-[calc(100dvh-2rem)] overflow-y-auto p-5 gap-4"
        style={{ borderRadius: 20 }}>
        <div className="pr-6">
          <DialogTitle style={{ fontSize: T.lg }}>Mã nhận quà</DialogTitle>
          <DialogDescription className="mt-1.5">
            {reward.status === "claimed"
              ? "Phần quà này đã được trao cho bạn."
              : "Mở mã này khi đến booth để nhân viên quét hoặc nhập mã."}
          </DialogDescription>
        </div>
        <div className="flex items-center gap-3">
          <span className="size-12 shrink-0 flex items-center justify-center" style={{ borderRadius: 12, backgroundColor: T.secondary }}>
            <GiftImage image={gift.image} name={gift.name} size={34} />
          </span>
          <p className="min-w-0" style={{ fontSize: T.base, fontWeight: T.fw_semi }}>{gift.name}</p>
        </div>
        <ClaimCodePanel reward={reward} />
        <PickupLocation game={game} gift={gift} />
        {reward.status === "pending" && (
          <p style={{ fontSize: T.xs, color: T.mutedFg }}>Mẹo: tăng độ sáng màn hình để nhân viên quét mã nhanh hơn.</p>
        )}
        <DialogClose asChild>
          <Button variant="outline" className="h-11 w-full text-base">Đóng</Button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
}

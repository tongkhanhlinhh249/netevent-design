import * as React from "react";
import { useState } from "react";
import { Loader2, Lock, PackageX } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { PseudoQr } from "../attendee/PseudoQr";
import type { GiftGame } from "../../data/attendeeFlow";
import { T, GiftThumb } from "./GiftGameShared";

type PreviewState = "not-checked-in" | "ready" | "processing" | "result" | "claimed" | "soldout";

const STATES: { id: PreviewState; label: string }[] = [
  { id: "not-checked-in", label: "Chưa check-in" },
  { id: "ready",          label: "Có lượt" },
  { id: "processing",     label: "Đang xử lý" },
  { id: "result",         label: "Có kết quả" },
  { id: "claimed",        label: "Đã nhận" },
  { id: "soldout",        label: "Hết quà" },
];

const SAMPLE_CODE = "QX7K4P";

/** Xem trước màn Minigame của người tham dự theo từng trạng thái; đổi ngay khi sửa cấu hình. */
export function GiftGamePreview({ game, eventName }: { game: GiftGame; eventName: string }) {
  const [state, setState] = useState<PreviewState>("ready");
  const brand = game.ui.brandColor;
  const gift = game.gifts.find((g) => g.status === "active") ?? game.gifts[0];
  const giftName = gift?.name.trim() || "Phần quà";
  const giftImage = gift?.image || "🎁";

  const boxes = (picked?: number) => (
    <div className="grid grid-cols-3 gap-2 w-full">
      {[0, 1, 2].map((i) => (
        <span key={i} className="aspect-square rounded-2xl flex items-center justify-center transition-all"
          style={{ fontSize: 30, background: `color-mix(in srgb, ${brand} 14%, white)`,
            border: `2px solid ${picked === i ? brand : "transparent"}`,
            opacity: picked !== undefined && picked !== i ? 0.4 : 1,
            transform: picked === i ? "scale(1.06)" : "none" }}>
          🎁
        </span>
      ))}
    </div>
  );

  const body = (() => {
    switch (state) {
      case "not-checked-in":
        return (
          <Center>
            <IconBubble brand={brand}><Lock className="size-5" /></IconBubble>
            <p style={{ fontSize: T.sm, color: "#111827", lineHeight: 1.5 }}>Bạn cần hoàn tất check-in trước khi tham gia Minigame.</p>
            <FakeButton brand={brand}>Check-in ngay</FakeButton>
          </Center>
        );
      case "ready":
      case "processing":
        return (
          <Center>
            <p style={{ fontSize: T.base, fontWeight: T.fw_semi, color: "#111827", textTransform: "uppercase", letterSpacing: "0.02em" }}>
              {game.ui.title || "Chọn một hộp quà"}
            </p>
            {game.ui.intro && <p style={{ fontSize: T.xs, color: "#6b7280", lineHeight: 1.5 }}>{game.ui.intro}</p>}
            {boxes(state === "processing" ? 1 : undefined)}
            {state === "processing" && (
              <p className="flex items-center gap-1.5" style={{ fontSize: T.xs, color: "#6b7280" }}>
                <Loader2 className="size-3.5 animate-spin" /> Đang mở hộp quà…
              </p>
            )}
          </Center>
        );
      case "result":
        return (
          <Center>
            <p style={{ fontSize: T.xs, fontWeight: T.fw_semi, color: brand, letterSpacing: "0.06em" }}>PHẦN QUÀ CỦA BẠN</p>
            <GiftThumb image={giftImage} size={64} />
            <p style={{ fontSize: T.base, fontWeight: T.fw_semi, color: "#111827" }}>{giftName}</p>
            <div className="rounded-xl p-3 flex flex-col items-center gap-1.5 w-full" style={{ border: "1px solid #e5e7eb" }}>
              <PseudoQr value={SAMPLE_CODE} size={84} />
              <p style={{ fontSize: T.xs, color: "#6b7280" }}>Mã nhận quà <strong style={{ color: "#111827", fontFamily: "monospace" }}>{SAMPLE_CODE}</strong></p>
            </div>
            <p style={{ fontSize: T.xs, color: "#6b7280", lineHeight: 1.5 }}>
              Nhận tại: {game.pickupLocation || "Booth check-in"}{game.ui.resultText ? ` · ${game.ui.resultText}` : ""}
            </p>
          </Center>
        );
      case "claimed":
        return (
          <Center>
            <GiftThumb image={giftImage} size={64} />
            <p style={{ fontSize: T.base, fontWeight: T.fw_semi, color: "#111827" }}>{giftName}</p>
            <p style={{ fontSize: T.xs, color: "#15803d", fontWeight: T.fw_medium }}>Trạng thái: Đã nhận quà</p>
            <p style={{ fontSize: T.xs, color: "#6b7280" }}>Thời gian nhận: 09:10</p>
          </Center>
        );
      case "soldout":
        return (
          <Center>
            <IconBubble brand={brand}><PackageX className="size-5" /></IconBubble>
            <p style={{ fontSize: T.sm, color: "#111827", lineHeight: 1.5 }}>
              Quà tặng của Minigame đã được phát hết. Cảm ơn bạn đã tham gia sự kiện.
            </p>
          </Center>
        );
    }
  })();

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between gap-2">
        <p style={{ fontSize: T.sm, fontWeight: T.fw_semi, color: T.foreground }}>Xem trước</p>
        <Select value={state} onValueChange={(v) => setState(v as PreviewState)}>
          <SelectTrigger className="w-[150px] h-8" aria-label="Trạng thái xem trước"><SelectValue /></SelectTrigger>
          <SelectContent>
            {STATES.map((s) => <SelectItem key={s.id} value={s.id}>{s.label}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>
      <div className="mx-auto w-full overflow-hidden flex flex-col"
        style={{ maxWidth: 300, minHeight: 520, borderRadius: 32, border: "8px solid #0f172a", backgroundColor: "#fff" }}>
        <div className="px-4 pt-4 pb-3 text-center" style={{ background: `color-mix(in srgb, ${brand} 10%, white)` }}>
          <p className="truncate" style={{ fontSize: "11px", color: "#6b7280" }}>{eventName}</p>
          <p className="truncate" style={{ fontSize: T.sm, fontWeight: T.fw_semi, color: "#111827", marginTop: 2 }}>
            {game.name.trim() || "Tên minigame"}
          </p>
        </div>
        <div className="flex-1 flex px-5 py-6">{body}</div>
      </div>
    </div>
  );
}

function Center({ children }: { children: React.ReactNode }) {
  return <div className="flex-1 flex flex-col items-center justify-center text-center gap-3">{children}</div>;
}

function IconBubble({ brand, children }: { brand: string; children: React.ReactNode }) {
  return (
    <span className="size-12 rounded-full flex items-center justify-center"
      style={{ color: brand, background: `color-mix(in srgb, ${brand} 12%, white)` }}>
      {children}
    </span>
  );
}

function FakeButton({ brand, children }: { brand: string; children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center justify-center h-9 px-5 rounded-full"
      style={{ fontSize: T.sm, fontWeight: T.fw_medium, color: "#fff", backgroundColor: brand }}>
      {children}
    </span>
  );
}

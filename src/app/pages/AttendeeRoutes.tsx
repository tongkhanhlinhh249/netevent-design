import { useSearchParams } from "react-router";
import type { EventDraft } from "../components/dashboard/EventsPage";
import { useCurrentEvent } from "../data/currentEvent";
import { DEMO_EVENT } from "../data/mockEvent";
import { SelfCheckIn } from "../components/attendee/SelfCheckIn";
import { AttendeeOverview } from "../components/attendee/AttendeeOverview";
import { GiftBoxGame } from "../components/attendee/GiftBoxGame";

/**
 * Ba màn của người tham dự, mở trên điện thoại, ngoài khung dashboard:
 *   /tu-check-in?event=<id>      — trang mà QR check-in chung của sự kiện mở ra;
 *   /su-kien-cua-toi?event=<id>  — Tổng quan sự kiện của người đã check-in;
 *   /chon-qua?event=<id>         — Minigame chọn quà ngẫu nhiên.
 * URL chỉ mang id sự kiện; người tham dự nằm trong phiên của thiết bị, không đưa lên URL.
 */
function useEventFromUrl(): EventDraft {
  const { event: current } = useCurrentEvent();
  const [params] = useSearchParams();
  const id = params.get("event");
  // Trùng sự kiện đang xem → sự kiện đó; "t1" → sự kiện mẫu; id lạ → rơi về sự kiện đang xem.
  return id && id !== current.id && id === DEMO_EVENT.id ? DEMO_EVENT : current;
}

export function SelfCheckInRoute() {
  const event = useEventFromUrl();
  return <SelfCheckIn key={event.id} event={event} />;
}

export function AttendeeOverviewRoute() {
  const event = useEventFromUrl();
  return <AttendeeOverview key={event.id} event={event} />;
}

export function GiftBoxRoute() {
  const event = useEventFromUrl();
  return <GiftBoxGame key={event.id} event={event} />;
}

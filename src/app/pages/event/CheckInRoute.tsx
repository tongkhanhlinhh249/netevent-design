import { useSearchParams } from "react-router";
import { CheckInPage } from "../../components/checkin/CheckInPage";
import type { EventDraft } from "../../components/dashboard/EventsPage";
import { useCurrentEvent } from "../../data/currentEvent";
import { DEMO_EVENT } from "../../data/mockEvent";

/**
 * Trang check-in, mở ở tab riêng: /check-in?event=<id>.
 *
 * Thẻ sự kiện truyền id qua URL để mở đúng sự kiện của thẻ đó mà không đổi sự
 * kiện đang xem trong workspace. Sự kiện mẫu ở màn khác (vd. Tổng quan) chưa
 * có bản ghi đầy đủ, nên thẻ gửi kèm tên, ngày, giờ để dựng phần đầu trang.
 * Không có id thì dùng sự kiện đang xem.
 */
export function CheckInRoute() {
  const { event: current } = useCurrentEvent();
  const [params] = useSearchParams();
  const id = params.get("event");

  let event: EventDraft = current;
  if (id && id !== current.id) {
    event = id === DEMO_EVENT.id ? DEMO_EVENT : {
      ...DEMO_EVENT,
      id,
      name: params.get("name") || "Sự kiện",
      startDate: params.get("date") || "",
      startTime: params.get("time") || "",
    };
  }
  // Sự kiện mới tạo chưa có ai đăng ký; sự kiện mẫu hiện danh sách khách minh hoạ.
  const sampleGuests = event !== current || current.id === DEMO_EVENT.id;
  return <CheckInPage key={event.id} event={event} sampleGuests={sampleGuests} />;
}

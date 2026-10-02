import type { EventDraft } from "../components/dashboard/EventsPage";

export const DEMO_EVENT: EventDraft = {
  id: "t1",
  name: "NetEvent Demo Conference 2026",
  description: "Sự kiện dành cho các đội ngũ tổ chức sự kiện, marketing, vận hành và công nghệ.",
  startDate: "2026-08-01",
  startTime: "09:00",
  endDate: "2026-08-01",
  endTime: "17:00",
  format: "offline",
  location: "NetSpace — Công ty Công nghệ & Truyền thông",
  theme: "minimal",
  visibility: "public",
  requireApproval: false,
  limitAttendees: false,
  maxAttendees: "",
  ticketPrice: "",
  status: "ended",
  cover: "linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%)",
};

/**
 * Địa chỉ chi tiết của sự kiện mẫu. Model chỉ có một chuỗi `location`, nên sự kiện
 * mẫu hiện thêm địa chỉ này — nhưng chỉ khi địa điểm vẫn là giá trị mẫu. Sửa địa
 * điểm rồi thì mọi màn (thẻ tổng quan, bản đồ, trang sự kiện) theo đúng giá trị mới.
 */
export const DEMO_VENUE = {
  name: "NetSpace — Tòa nhà MIPEC",
  address: "Tầng 3, Tòa nhà MIPEC, 229 P. Tây Sơn, Kim Liên, Hà Nội",
  short: "Tòa nhà MIPEC, Tây Sơn, Hà Nội",
};

export const hasDemoVenue = (e?: { id?: string; location?: string; format?: string }) =>
  !!e && e.id === DEMO_EVENT.id && e.format !== "online" && (e.location ?? "").trim() === DEMO_EVENT.location;

/** Địa chỉ đưa vào bản đồ. */
export const mapAddressOf = (e: { id?: string; location?: string; format?: string }) =>
  hasDemoVenue(e) ? DEMO_VENUE.address : (e.location ?? "").trim();

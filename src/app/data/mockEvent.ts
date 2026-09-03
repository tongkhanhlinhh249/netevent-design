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
  theme: "conference",
  visibility: "public",
  requireApproval: false,
  limitAttendees: false,
  maxAttendees: "",
  ticketPrice: "",
  status: "ended",
  cover: "linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%)",
};

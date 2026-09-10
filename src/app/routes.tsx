import { createBrowserRouter, Navigate } from "react-router";
import { DashboardRoute } from "./pages/DashboardRoute";
import { AuthRoute } from "./pages/AuthRoute";
import { StaffRoute } from "./pages/StaffRoute";
import { DemoRoute } from "./pages/DemoRoute";
import { EventWorkspaceLayout } from "./pages/EventWorkspaceLayout";
import { OverviewPage } from "./pages/event/OverviewPage";
import { LandingPageRoute } from "./pages/event/LandingPageRoute";
import { MiniGameRoute } from "./pages/event/MiniGameRoute";
import { ThongTinChiTietRoute } from "./pages/event/ThongTinChiTietRoute";
import { AttendeesRoute } from "./pages/event/AttendeesRoute";
import { CheckInRoute } from "./pages/event/CheckInRoute";
import { DrawProjectorRoute } from "./pages/DrawProjectorRoute";
import { SelfCheckInRoute, AttendeeOverviewRoute, GiftBoxRoute } from "./pages/AttendeeRoutes";
import { KhoVeRoute } from "./pages/event/KhoVeRoute";
import { LichSuHoatDongRoute } from "./pages/event/LichSuHoatDongRoute";
import { ThanhVienRoute } from "./pages/event/ThanhVienRoute";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: DashboardRoute,
    children: [
      {
        path: "event",
        children: [
          {
            Component: EventWorkspaceLayout,
            children: [
              { index: true,                    Component: OverviewPage },
              { path: "kho-ve",                 Component: KhoVeRoute },
              { path: "mini-game",              Component: MiniGameRoute },
              { path: "thong-tin-chi-tiet",     Component: ThongTinChiTietRoute },
              { path: "nguoi-tham-du",          Component: AttendeesRoute },
              { path: "lich-su-hoat-dong",      Component: LichSuHoatDongRoute },
              { path: "thanh-vien",             Component: ThanhVienRoute },
            ],
          },
          { path: "trang-su-kien",     Component: LandingPageRoute },
        ],
      },
    ],
  },
  {
    path: "/dang-nhap",
    Component: AuthRoute,
  },
  {
    path: "/staff",
    Component: StaffRoute,
  },
  {
    path: "/demo",
    Component: DemoRoute,
  },
  // Check-in mở ở tab riêng, ngoài khung dashboard (không sidebar).
  {
    path: "/check-in",
    Component: CheckInRoute,
  },
  // Màn chiếu bốc thăm mở ở tab riêng (máy chiếu), đồng bộ với màn hình quay.
  {
    path: "/man-chieu",
    Component: DrawProjectorRoute,
  },
  // Màn của người tham dự (điện thoại): tự check-in qua QR chung, Tổng quan, chọn quà.
  {
    path: "/tu-check-in",
    Component: SelfCheckInRoute,
  },
  {
    path: "/su-kien-cua-toi",
    Component: AttendeeOverviewRoute,
  },
  {
    path: "/chon-qua",
    Component: GiftBoxRoute,
  },
  {
    path: "*",
    Component: () => <Navigate to="/" replace />,
  },
]);

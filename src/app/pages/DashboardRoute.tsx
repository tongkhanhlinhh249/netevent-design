import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { AdminDashboard } from "../components/dashboard/AdminDashboard";
import { AuthModal } from "../components/auth/AuthFlow";
import { clearSession, readSession, saveSession, type UserRole } from "../data/session";

/** Landing page tĩnh, nhập từ netevent-site.zip (xem scripts/import_landing.py). */
const LANDING = "/gioi-thieu/";

export function DashboardRoute() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [session, setSession] = useState(readSession);
  const appRef = useRef<HTMLDivElement>(null);

  // Trang chủ của người chưa đăng nhập là landing page. Các trang khác (vd.
  // /tao-su-kien từ nút "Tạo sự kiện") vẫn mở ra, kèm popup đăng nhập phía trên.
  const toLanding = !session && pathname === "/";
  useEffect(() => {
    if (toLanding) window.location.replace(LANDING);
  }, [toLanding]);

  // Popup đang mở thì phần app phía sau không bấm hay tab tới được.
  useEffect(() => {
    if (appRef.current) appRef.current.inert = !session;
  }, [session]);

  if (toLanding) return null;

  const handleLogout = () => {
    clearSession();
    setSession(null);
    navigate("/dang-nhap");
  };

  const handleLogin = (role: UserRole, name?: string) => {
    if (role === "staff") { saveSession(role, name); navigate("/staff"); return; }
    setSession(saveSession(role, name));
  };

  return (
    <>
      <div ref={appRef} aria-hidden={!session || undefined}>
        <AdminDashboard currentRole={session?.role ?? "owner"} userName={session?.name} onLogout={handleLogout} />
      </div>
      {!session && <AuthModal onLoginSuccess={handleLogin} />}
    </>
  );
}

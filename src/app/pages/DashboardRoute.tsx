import { useNavigate } from "react-router";
import { AdminDashboard } from "../components/dashboard/AdminDashboard";

type UserRole = "owner" | "admin" | "staff";

export function DashboardRoute() {
  const navigate = useNavigate();
  const role = (sessionStorage.getItem("netevent_role") as UserRole) ?? "owner";
  const userName = sessionStorage.getItem("netevent_user_name") ?? undefined;

  const handleLogout = () => {
    sessionStorage.removeItem("netevent_role");
    sessionStorage.removeItem("netevent_user_name");
    navigate("/dang-nhap");
  };

  return <AdminDashboard currentRole={role} userName={userName} onLogout={handleLogout} />;
}

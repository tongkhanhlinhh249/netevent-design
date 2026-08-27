import { useNavigate } from "react-router";
import { AdminDashboard } from "../components/dashboard/AdminDashboard";

type UserRole = "owner" | "admin" | "staff";

export function DashboardRoute() {
  const navigate = useNavigate();
  const role = (sessionStorage.getItem("netevent_role") as UserRole) ?? "owner";

  const handleLogout = () => {
    sessionStorage.removeItem("netevent_role");
    navigate("/dang-nhap");
  };

  return <AdminDashboard currentRole={role} onLogout={handleLogout} />;
}

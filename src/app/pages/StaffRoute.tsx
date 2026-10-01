import { useNavigate } from "react-router";
import { StaffPortal } from "../components/staff/StaffPortal";
import { clearSession } from "../data/session";

export function StaffRoute() {
  const navigate = useNavigate();

  const handleLogout = () => {
    clearSession();
    navigate("/dang-nhap");
  };

  return <StaffPortal onLogout={handleLogout} />;
}

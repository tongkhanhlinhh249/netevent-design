import { useNavigate } from "react-router";
import { StaffPortal } from "../components/staff/StaffPortal";

export function StaffRoute() {
  const navigate = useNavigate();

  const handleLogout = () => {
    sessionStorage.removeItem("netevent_role");
    navigate("/dang-nhap");
  };

  return <StaffPortal onLogout={handleLogout} />;
}

import { useNavigate } from "react-router";
import { AuthFlow } from "../components/auth/AuthFlow";

type UserRole = "owner" | "admin" | "staff";

export function AuthRoute() {
  const navigate = useNavigate();

  const handleLoginSuccess = (role: UserRole) => {
    sessionStorage.setItem("netevent_role", role);
    navigate(role === "staff" ? "/staff" : "/");
  };

  return <AuthFlow onLoginSuccess={handleLoginSuccess} />;
}

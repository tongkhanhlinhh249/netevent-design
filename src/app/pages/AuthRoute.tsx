import { useNavigate } from "react-router";
import { AuthFlow } from "../components/auth/AuthFlow";
import { saveSession, type UserRole } from "../data/session";

export function AuthRoute() {
  const navigate = useNavigate();

  const handleLoginSuccess = (role: UserRole, name?: string) => {
    saveSession(role, name);
    navigate(role === "staff" ? "/staff" : "/");
  };

  return <AuthFlow onLoginSuccess={handleLoginSuccess} />;
}

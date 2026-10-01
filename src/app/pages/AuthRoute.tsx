import { useNavigate } from "react-router";
import { AuthFlow } from "../components/auth/AuthFlow";

type UserRole = "owner" | "admin" | "staff";

export function AuthRoute() {
  const navigate = useNavigate();

  const handleLoginSuccess = (role: UserRole, name?: string) => {
    sessionStorage.setItem("netevent_role", role);
    if (name) sessionStorage.setItem("netevent_user_name", name);
    else sessionStorage.removeItem("netevent_user_name");
    navigate(role === "staff" ? "/staff" : "/");
  };

  return <AuthFlow onLoginSuccess={handleLoginSuccess} />;
}

import { LandingPageTab } from "../../components/dashboard/LandingPage";
import { DEMO_EVENT } from "../../data/mockEvent";

export function LandingPageRoute() {
  return <LandingPageTab event={DEMO_EVENT as any} />;
}

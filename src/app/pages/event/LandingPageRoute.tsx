import { LandingPageTab } from "../../components/dashboard/LandingPage";
import { useCurrentEvent } from "../../data/currentEvent";

export function LandingPageRoute() {
  const { event } = useCurrentEvent();
  return <LandingPageTab event={event as any} />;
}

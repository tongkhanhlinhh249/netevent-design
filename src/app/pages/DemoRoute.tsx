import { DemoPublicLandingPage } from "../components/dashboard/LandingPage";
import { themePageBg } from "../data/themes";
import { useCurrentEvent } from "../data/currentEvent";

export function DemoRoute() {
  const { event } = useCurrentEvent();
  return <DemoPublicLandingPage themeBg={themePageBg(event.theme)} themeImage={event.pageImage} />;
}

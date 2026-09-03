import { DemoPublicLandingPage } from "../components/dashboard/LandingPage";
import { themePageBg } from "../data/themes";
import { DEMO_EVENT } from "../data/mockEvent";

export function DemoRoute() {
  return <DemoPublicLandingPage themeBg={themePageBg(DEMO_EVENT.theme)} />;
}

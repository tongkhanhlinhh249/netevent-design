import { MiniGameTab } from "../../components/dashboard/MiniGameTab";
import { DEMO_EVENT } from "../../data/mockEvent";

export function MiniGameRoute() {
  return <MiniGameTab event={DEMO_EVENT as any} />;
}

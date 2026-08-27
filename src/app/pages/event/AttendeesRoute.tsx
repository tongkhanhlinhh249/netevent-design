import { AttendeesTab } from "../../components/dashboard/AttendeesTab";
import { DEMO_EVENT } from "../../data/mockEvent";

export function AttendeesRoute() {
  return <AttendeesTab event={DEMO_EVENT as any} />;
}

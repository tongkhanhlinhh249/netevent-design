import { WorkspaceTabContent } from "../../components/dashboard/EventsPage";
import { DEMO_EVENT } from "../../data/mockEvent";

export function CheckInRoute() {
  return (
    <WorkspaceTabContent
      tab="checkin"
      event={DEMO_EVENT}
      onEditDrawer={() => {}}
    />
  );
}

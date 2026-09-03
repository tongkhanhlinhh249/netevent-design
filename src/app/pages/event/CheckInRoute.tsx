import { WorkspaceTabContent } from "../../components/dashboard/EventsPage";
import { useCurrentEvent } from "../../data/currentEvent";

export function CheckInRoute() {
  const { event } = useCurrentEvent();
  return (
    <WorkspaceTabContent
      tab="checkin"
      event={event}
      onEditDrawer={() => {}}
    />
  );
}

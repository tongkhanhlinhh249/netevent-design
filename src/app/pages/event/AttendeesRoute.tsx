import { AttendeesTab } from "../../components/dashboard/AttendeesTab";
import { useCurrentEvent } from "../../data/currentEvent";

export function AttendeesRoute() {
  const { event } = useCurrentEvent();
  return <AttendeesTab event={event as any} />;
}

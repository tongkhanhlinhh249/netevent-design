import { MiniGameTab } from "../../components/dashboard/MiniGameTab";
import { useCurrentEvent } from "../../data/currentEvent";

export function MiniGameRoute() {
  const { event } = useCurrentEvent();
  return <MiniGameTab event={event as any} />;
}

import { useSearchParams } from "react-router";
import { DrawProjector } from "../components/dashboard/DrawProjector";

/** Màn chiếu bốc thăm, mở ở tab riêng: /man-chieu?game=<id>. */
export function DrawProjectorRoute() {
  const [params] = useSearchParams();
  return <DrawProjector gameId={params.get("game") ?? ""} />;
}

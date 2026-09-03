import * as React from "react";
import { DEMO_EVENT } from "./mockEvent";
import type { EventDraft } from "../components/dashboard/EventsPage";

/**
 * Sự kiện đang được xem trong workspace.
 *
 * Trước đây mọi route sự kiện đều import thẳng DEMO_EVENT, nên sự kiện vừa tạo
 * (kèm theme, quyền riêng tư, giá vé… người dùng chọn) không đi tới đâu cả —
 * trang sự kiện luôn hiển thị theo DEMO_EVENT.
 *
 * State được ghi kèm sessionStorage vì trang sự kiện công khai (/demo) mở ở
 * tab mới, tức là một lần tải trang mới: context React không sống sót qua đó,
 * nên nếu chỉ giữ trong bộ nhớ thì tab mới sẽ lại rơi về DEMO_EVENT.
 */
const STORAGE_KEY = "netevent_current_event";

function readStored(): EventDraft {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as EventDraft) : DEMO_EVENT;
  } catch {
    return DEMO_EVENT;
  }
}

const CurrentEventContext = React.createContext<{
  event: EventDraft;
  setEvent: (ev: EventDraft) => void;
}>({ event: DEMO_EVENT, setEvent: () => {} });

export function CurrentEventProvider({ children }: { children: React.ReactNode }) {
  const [event, setEventState] = React.useState<EventDraft>(readStored);

  const setEvent = React.useCallback((ev: EventDraft) => {
    setEventState(ev);
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(ev));
    } catch {
      // sessionStorage có thể bị chặn — vẫn giữ được state trong tab hiện tại.
    }
  }, []);

  const value = React.useMemo(() => ({ event, setEvent }), [event, setEvent]);
  return <CurrentEventContext.Provider value={value}>{children}</CurrentEventContext.Provider>;
}

export function useCurrentEvent() {
  return React.useContext(CurrentEventContext);
}

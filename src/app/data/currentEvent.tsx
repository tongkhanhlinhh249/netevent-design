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
 * State được ghi kèm localStorage vì trang sự kiện công khai (/demo) và trang
 * check-in (/check-in) mở ở tab mới. sessionStorage không đủ: nó gắn với từng
 * tab, và tab mở bằng link target="_blank" (mặc định noopener) không nhận bản
 * sao sessionStorage của tab gốc, nên sẽ rơi về DEMO_EVENT. localStorage dùng
 * chung cho mọi tab cùng origin; sự kiện "storage" giúp tab đang mở cập nhật
 * ngay khi workspace sửa sự kiện (đổi đơn vị tổ chức, chế độ hiển thị…).
 */
const STORAGE_KEY = "netevent_current_event";

function parseStored(raw: string | null): EventDraft {
  try {
    return raw ? (JSON.parse(raw) as EventDraft) : DEMO_EVENT;
  } catch {
    return DEMO_EVENT;
  }
}

function readStored(): EventDraft {
  try {
    return parseStored(localStorage.getItem(STORAGE_KEY));
  } catch {
    return DEMO_EVENT; // localStorage bị chặn
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
      localStorage.setItem(STORAGE_KEY, JSON.stringify(ev));
    } catch {
      // localStorage có thể bị chặn hoặc đầy — vẫn giữ được state trong tab hiện tại.
    }
  }, []);

  // Tab khác (thường là workspace) vừa đổi sự kiện → tab này cập nhật theo.
  React.useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) setEventState(parseStored(e.newValue));
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const value = React.useMemo(() => ({ event, setEvent }), [event, setEvent]);
  return <CurrentEventContext.Provider value={value}>{children}</CurrentEventContext.Provider>;
}

export function useCurrentEvent() {
  return React.useContext(CurrentEventContext);
}

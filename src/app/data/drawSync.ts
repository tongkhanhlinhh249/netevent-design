import { useEffect, useState } from "react";

/**
 * Đồng bộ màn hình quay (người điều hành) với màn chiếu mở ở tab riêng.
 *
 * Màn quay ghi trạng thái hiện tại vào localStorage; màn chiếu đọc lúc mở và
 * nghe sự kiện "storage" để cập nhật ngay khi màn quay đổi — hai tab cùng
 * origin nên không cần máy chủ. Hiệu ứng đảo tên chạy riêng ở mỗi màn: chỉ
 * trạng thái và kết quả được ghi, không ghi từng khung hình.
 */
export interface DrawBroadcast {
  gameName: string;
  /** Giải đang quay, vd. "Giải nhì – Apple Watch Series 10". */
  prize: string;
  /** "Đã quay 1/2 suất". */
  progress: string;
  phase: "idle" | "spinning" | "result" | "done";
  /** Người vừa trúng, đã định dạng theo "Hiển thị người thắng". */
  winner: [string, string] | null;
  /** Tên dùng cho hiệu ứng đảo tên lúc đang quay. */
  names: [string, string][];
  /** Người thắng theo thứ tự quay — hiện ở màn chiếu khi hoàn tất. */
  winners: { prize: string; lines: [string, string] }[];
  poolCount: number;
  lockedAt?: string;
  updatedAt: number;
}

export const drawKey = (gameId: string) => `netevent_draw_${gameId}`;

export function publishDraw(gameId: string, b: DrawBroadcast) {
  try { localStorage.setItem(drawKey(gameId), JSON.stringify(b)); } catch { /* bộ nhớ bị chặn */ }
}

function parse(raw: string | null): DrawBroadcast | null {
  try { return raw ? (JSON.parse(raw) as DrawBroadcast) : null; } catch { return null; }
}

/** Trạng thái màn quay mới nhất của một chương trình, cập nhật trực tiếp từ tab khác. */
export function useDrawBroadcast(gameId: string) {
  const [state, setState] = useState<DrawBroadcast | null>(() => {
    try { return parse(localStorage.getItem(drawKey(gameId))); } catch { return null; }
  });
  useEffect(() => {
    const onStorage = (e: StorageEvent) => { if (e.key === drawKey(gameId)) setState(parse(e.newValue)); };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [gameId]);
  return state;
}

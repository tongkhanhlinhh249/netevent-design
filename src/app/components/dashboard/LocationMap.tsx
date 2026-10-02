import { useEffect, useState } from "react";

/**
 * Bản đồ của một địa chỉ — bản nhúng Google Maps, không cần khoá API. Dùng chung
 * cho ô sửa địa điểm và trang sự kiện, nên sửa địa chỉ là bản đồ đổi theo.
 */

/** Mở địa chỉ trên Google Maps (cả web lẫn app điện thoại hiểu được). */
export const mapsSearchUrl = (address: string) =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;

export function LocationMap({ address, height = 180, debounce = 0 }: {
  address: string;
  height?: number;
  /** Đang gõ địa chỉ thì chờ người dùng ngừng tay mới tải lại bản đồ. */
  debounce?: number;
}) {
  const [query, setQuery] = useState(address.trim());
  useEffect(() => {
    const next = address.trim();
    if (!debounce) { setQuery(next); return; }
    const id = window.setTimeout(() => setQuery(next), debounce);
    return () => window.clearTimeout(id);
  }, [address, debounce]);

  if (!query) return null;
  return (
    <iframe title={`Bản đồ: ${query}`} loading="lazy" referrerPolicy="no-referrer-when-downgrade"
      src={`https://maps.google.com/maps?q=${encodeURIComponent(query)}&z=15&output=embed`}
      className="w-full block rounded-xl"
      style={{ height, border: "1px solid var(--border)" }} />
  );
}

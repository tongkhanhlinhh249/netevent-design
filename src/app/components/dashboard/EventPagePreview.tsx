import { useLayoutEffect, useRef, useState } from "react";

/**
 * Bản thu nhỏ của chính trang sự kiện công khai, đúng như khách nhìn thấy: theme,
 * ảnh cover, tên, khung đăng ký. Dựng trang thật trong iframe ở bề ngang máy tính
 * rồi thu nhỏ cho vừa khung — nên đổi theme hay thông tin ở ngăn chỉnh sửa là bản
 * xem trước đổi theo ngay (trang trong iframe nghe cùng localStorage).
 */

/** Bề ngang trang được dựng trước khi thu nhỏ. */
const PAGE_WIDTH = 1280;

export function EventPagePreview({ src = "/demo", fallback }: { src?: string; fallback: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [box, setBox] = useState({ w: 0, h: 0 });
  const [loaded, setLoaded] = useState(false);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const measure = () => setBox({ w: el.clientWidth, h: el.clientHeight });
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const scale = box.w / PAGE_WIDTH;
  return (
    // Chỉ để nhìn: bấm vào khung là mở trang thật, nên iframe không nhận chuột hay phím.
    <div ref={ref} aria-hidden className="absolute inset-0 overflow-hidden" style={{ background: fallback }}>
      {box.w > 0 && (
        <iframe src={src} title="Xem trước trang sự kiện" tabIndex={-1} scrolling="no"
          onLoad={() => setLoaded(true)}
          style={{
            width: PAGE_WIDTH, height: box.h / scale, border: 0,
            transform: `scale(${scale})`, transformOrigin: "0 0",
            pointerEvents: "none", opacity: loaded ? 1 : 0, transition: "opacity 0.3s",
          }} />
      )}
    </div>
  );
}

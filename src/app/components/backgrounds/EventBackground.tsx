import Galaxy from "./Galaxy";
import GhostFibers from "./GhostFibers";
import { DEFAULT_FIBER_COLORS } from "../../data/themes";

/**
 * Nền động của trang sự kiện, đặt sau nội dung. Dùng chung cho màn tạo sự kiện,
 * bản xem trước trong workspace và trang công khai để cả ba hiện đúng một kiểu.
 *
 * `scrim` là lớp phủ tối đè lên hiệu ứng: nền dịu lại một chút để tên sự kiện,
 * thẻ đăng ký và các dòng thông tin nổi lên rõ. Ô chọn giao diện dùng scrim = 0
 * vì ở kích thước nhỏ cần thấy rõ hiệu ứng.
 */
export function EventBackground({ themeId, lineColor, glowColor, fixed = true, scrim }: {
  themeId?: string;
  lineColor?: string;
  glowColor?: string;
  fixed?: boolean;
  scrim?: number;
}) {
  const fibers = themeId === "fibers";
  // Ghost Fibers vốn đã tối nên phủ nhẹ hơn Galaxy.
  const cover = scrim ?? (fibers ? 0.3 : 0.55);
  return (
    <div className={`${fixed ? "fixed" : "absolute"} inset-0 pointer-events-none`} style={{ zIndex: 0 }} aria-hidden>
      {fibers ? (
        <GhostFibers lineColor={lineColor || DEFAULT_FIBER_COLORS.line} glowColor={glowColor || DEFAULT_FIBER_COLORS.glow} />
      ) : (
        <Galaxy density={1.5} glowIntensity={0.5} saturation={0.8} hueShift={240}
          mouseInteraction={false} mouseRepulsion={false} transparent={false} />
      )}
      {cover > 0 && <div className="absolute inset-0" style={{ backgroundColor: `rgba(4,3,12,${cover})` }} />}
    </div>
  );
}

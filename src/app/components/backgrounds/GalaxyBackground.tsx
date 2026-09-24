import Galaxy from "./Galaxy";

/**
 * Lớp nền Galaxy đặt sau nội dung. Dùng chung để màn tạo sự kiện, bản xem trước
 * trong workspace và trang sự kiện công khai hiện đúng một kiểu nền.
 *
 * `scrim` là lớp phủ tối đè lên dải sao: nền dịu lại một chút để tên sự kiện,
 * thẻ đăng ký và các dòng thông tin nổi lên rõ. Ô chọn giao diện dùng scrim = 0
 * vì ở kích thước nhỏ cần thấy rõ hiệu ứng.
 */
export function GalaxyBackground({ fixed = true, scrim = 0.55 }: { fixed?: boolean; scrim?: number }) {
  return (
    <div className={`${fixed ? "fixed" : "absolute"} inset-0 pointer-events-none`} style={{ zIndex: 0 }} aria-hidden>
      <Galaxy density={1.5} glowIntensity={0.5} saturation={0.8} hueShift={240}
        mouseInteraction={false} mouseRepulsion={false} transparent={false} />
      {scrim > 0 && <div className="absolute inset-0" style={{ backgroundColor: `rgba(4,3,12,${scrim})` }} />}
    </div>
  );
}

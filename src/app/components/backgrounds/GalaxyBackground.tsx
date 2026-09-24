import Galaxy from "./Galaxy";

/**
 * Lớp nền Galaxy đặt sau nội dung. Dùng chung để màn tạo sự kiện, bản xem trước
 * trong workspace và trang sự kiện công khai hiện đúng một kiểu nền.
 */
export function GalaxyBackground({ fixed = true }: { fixed?: boolean }) {
  return (
    <div className={`${fixed ? "fixed" : "absolute"} inset-0 pointer-events-none`} style={{ zIndex: 0 }} aria-hidden>
      <Galaxy density={1.5} glowIntensity={0.5} saturation={0.8} hueShift={240}
        mouseInteraction={false} mouseRepulsion={false} transparent={false} />
    </div>
  );
}

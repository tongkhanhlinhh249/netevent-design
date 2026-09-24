import Galaxy from "./Galaxy";
import GhostFibers from "./GhostFibers";
import Particles from "./Particles";
import Grainient from "./Grainient";
import { DEFAULT_EFFECT_COLORS, type EffectColorKey } from "../../data/themes";

/**
 * Nền động của trang sự kiện, đặt sau nội dung. Dùng chung cho màn tạo sự kiện,
 * bản xem trước trong workspace và trang công khai để cả ba hiện đúng một kiểu.
 *
 * `scrim` là lớp phủ tối đè lên hiệu ứng: nền dịu lại một chút để tên sự kiện,
 * thẻ đăng ký và các dòng thông tin nổi lên rõ. Ô chọn giao diện dùng scrim = 0
 * vì ở kích thước nhỏ cần thấy rõ hiệu ứng.
 */
export function EventBackground({ themeId, colors, fixed = true, scrim }: {
  themeId?: string;
  colors?: Partial<Record<EffectColorKey, string>>;
  fixed?: boolean;
  scrim?: number;
}) {
  const color = (key: EffectColorKey) => colors?.[key] || DEFAULT_EFFECT_COLORS[key];
  // Ghost Fibers và Particles vốn đã tối nên phủ nhẹ hơn Galaxy.
  const cover = scrim ?? (themeId === "galaxy" ? 0.55 : 0.3);
  return (
    <div className={`${fixed ? "fixed" : "absolute"} inset-0 pointer-events-none`} style={{ zIndex: 0 }} aria-hidden>
      {themeId === "fibers" ? (
        <GhostFibers lineColor={color("line")} glowColor={color("glow")} />
      ) : themeId === "grainient" ? (
        <Grainient color1={color("c1")} color2={color("c2")} color3={color("c3")} grainAmount={0} grainAnimated={false} />
      ) : themeId === "particles" ? (
        <Particles particleColors={[color("dot")]} particleCount={200} particleSpread={10} speed={0.1}
          particleBaseSize={100} alphaParticles={false} disableRotation={false} />
      ) : (
        <Galaxy density={1.5} glowIntensity={0.5} saturation={0.8} hueShift={240}
          mouseInteraction={false} mouseRepulsion={false} transparent={false} />
      )}
      {cover > 0 && <div className="absolute inset-0" style={{ backgroundColor: `rgba(4,3,12,${cover})` }} />}
    </div>
  );
}

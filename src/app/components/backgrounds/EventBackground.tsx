import * as React from "react";
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
 *
 * Lớp nền không cuộn theo nội dung (`fixed`), nhưng chỉ phủ đúng vùng nội dung:
 * trong dashboard nó bám theo khung <main>, để sidebar và thanh tiêu đề không
 * bị đè lên. Ngoài dashboard (trang sự kiện công khai) thì phủ kín màn hình.
 */
export function EventBackground({ themeId, colors, fixed = true, scrim }: {
  themeId?: string;
  colors?: Partial<Record<EffectColorKey, string>>;
  fixed?: boolean;
  scrim?: number;
}) {
  const ref = React.useRef<HTMLDivElement>(null);
  const [box, setBox] = React.useState<{ left: number; top: number; width: number; height: number } | null>(null);
  React.useLayoutEffect(() => {
    const main = ref.current?.closest("main") as HTMLElement | null;
    if (!fixed || !main) return;
    const measure = () => {
      const r = main.getBoundingClientRect();
      setBox({ left: r.left, top: r.top, width: r.width, height: r.height });
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(main);
    window.addEventListener("resize", measure);
    return () => { ro.disconnect(); window.removeEventListener("resize", measure); };
  }, [fixed]);

  const frame: React.CSSProperties = !fixed
    ? { position: "absolute", inset: 0 }
    : box
    // Góc dưới bo theo khung panel của dashboard; lớp fixed không bị
    // overflow-hidden của panel cắt hộ.
    ? { position: "fixed", ...box, overflow: "hidden", borderRadius: "0 0 20px 20px" }
    : { position: "fixed", inset: 0 };

  const color = (key: EffectColorKey) => colors?.[key] || DEFAULT_EFFECT_COLORS[key];
  // Grainient sáng nên cần phủ đậm hơn để chữ trắng còn đọc được; Ghost Fibers
  // và Particles vốn đã tối nên phủ nhẹ.
  const cover = scrim ?? (themeId === "galaxy" ? 0.45 : themeId === "grainient" ? 0.35 : 0.25);
  return (
    <div ref={ref} className="pointer-events-none" style={{ ...frame, zIndex: 0 }} aria-hidden>
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

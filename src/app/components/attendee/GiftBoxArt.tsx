import * as React from "react";
import { GiftImage, withAlpha } from "./attendeeUi";

const RIBBON = "#ffd166";
const KNOT   = "#f4b400";

export type GiftBoxArtState = "idle" | "shake" | "open" | "rest";

/**
 * Hộp quà vẽ bằng CSS, tô theo màu thương hiệu của minigame.
 *   idle  — lơ lửng nhẹ (so le giữa ba hộp bằng `delay`);
 *   shake — rung trong lúc chờ hệ thống xác định phần quà;
 *   open  — nắp bật ra, toả sáng, phần quà nhô lên từ trong hộp;
 *   rest  — đứng yên (hộp không được chọn).
 */
export function GiftBoxArt({ color, size = 88, state = "idle", delay = 0, prize }: {
  color: string; size?: number; state?: GiftBoxArtState; delay?: number;
  prize?: { image: string; name: string };
}) {
  const open = state === "open";
  const wrapClass = state === "idle" ? "ag-float" : state === "shake" ? "ag-shake" : "";
  const loop: React.CSSProperties = {
    position: "absolute", bottom: "70%", width: size * 0.2, height: size * 0.15,
    border: `${Math.max(3, size * 0.045)}px solid ${RIBBON}`, borderRadius: "50%",
  };
  return (
    <div className="relative" style={{ width: size, height: size }} aria-hidden>
      {open && (
        <>
          <span className="ag-rays absolute rounded-full" style={{
            left: "50%", top: "42%", width: size * 1.7, height: size * 1.7, marginLeft: -size * 0.85, marginTop: -size * 0.85,
            background: `repeating-conic-gradient(${withAlpha(color, 0.28)} 0deg 12deg, transparent 12deg 30deg)`,
            maskImage: "radial-gradient(circle, #000 25%, transparent 70%)",
            WebkitMaskImage: "radial-gradient(circle, #000 25%, transparent 70%)",
          }} />
          {Array.from({ length: 8 }, (_, i) => {
            const a = (i / 8) * Math.PI * 2;
            return (
              <span key={i} className="ag-spark absolute rounded-full" style={{
                left: "50%", top: "40%", width: size * 0.07, height: size * 0.07,
                backgroundColor: i % 2 ? RIBBON : color,
                ["--dx" as string]: `${Math.cos(a) * size * 0.62}px`,
                ["--dy" as string]: `${Math.sin(a) * size * 0.62}px`,
              } as React.CSSProperties} />
            );
          })}
          {prize && (
            <span className="ag-rise absolute flex items-center justify-center"
              style={{ left: "50%", top: "30%", width: size * 0.56, height: size * 0.56, zIndex: 1 }}>
              <GiftImage image={prize.image} name={prize.name} size={Math.round(size * 0.52)} />
            </span>
          )}
        </>
      )}

      <div className={`absolute inset-0 ${wrapClass}`} style={{ animationDelay: `${delay}s`, zIndex: 2 }}>
        {/* Bóng dưới hộp */}
        <span className="absolute rounded-full" style={{ left: "20%", right: "20%", bottom: 0, height: "6%", backgroundColor: "rgba(15,23,42,0.14)" }} />
        {/* Thân hộp */}
        <span className="absolute overflow-hidden" style={{
          left: "14%", right: "14%", bottom: "6%", height: "50%", borderRadius: size * 0.08,
          backgroundColor: color, backgroundImage: "linear-gradient(180deg, rgba(255,255,255,0.16), rgba(0,0,0,0.18))",
        }}>
          <span className="absolute inset-y-0" style={{ left: "42%", width: "16%", backgroundColor: RIBBON }} />
        </span>
        {/* Nắp + nơ */}
        <span className={`absolute ${open ? "ag-lid-open" : ""}`} style={{
          left: "8%", right: "8%", bottom: "53%", height: "17%", borderRadius: size * 0.06,
          backgroundColor: color, backgroundImage: "linear-gradient(180deg, rgba(255,255,255,0.32), rgba(255,255,255,0.04))",
          boxShadow: "0 2px 0 rgba(0,0,0,0.12)", zIndex: 3,
        }}>
          <span className="absolute inset-y-0" style={{ left: "43%", width: "14%", backgroundColor: RIBBON }} />
          <span style={{ ...loop, left: "50%", marginLeft: -size * 0.2, transform: "rotate(-22deg)" }} />
          <span style={{ ...loop, left: "50%", transform: "rotate(22deg)" }} />
          <span className="absolute rounded-full" style={{
            left: "50%", bottom: "78%", width: size * 0.09, height: size * 0.09, marginLeft: -size * 0.045, backgroundColor: KNOT,
          }} />
        </span>
      </div>
    </div>
  );
}

import * as React from "react";
import { useEffect, useRef, useState } from "react";
import { Gamepad2, Lock, Maximize2, Minimize2, Users } from "lucide-react";
import { useDrawBroadcast } from "../../data/drawSync";

const KEYFRAMES = `
@keyframes pj-roll { 0%{opacity:0;transform:translateY(-6px)} 40%{opacity:1;transform:translateY(0)} 80%{opacity:1} 100%{opacity:0;transform:translateY(6px)} }
@keyframes pj-winner { from{opacity:0;transform:scale(0.92) translateY(12px)} to{opacity:1;transform:scale(1) translateY(0)} }
@keyframes pj-glow { 0%,100%{box-shadow:0 0 40px rgba(30,170,255,0.25)} 50%{box-shadow:0 0 60px rgba(30,170,255,0.5)} }
`;

/**
 * Màn chiếu bốc thăm — mở ở tab riêng từ "Mở màn chiếu" trên màn hình quay để
 * kéo sang máy chiếu / màn hình lớn. Chỉ hiển thị, không có nút điều khiển:
 * người điều hành quay ở màn hình quay, màn chiếu nhận trạng thái qua drawSync.
 */
export function DrawProjector({ gameId }: { gameId: string }) {
  const b = useDrawBroadcast(gameId);
  const [rolling, setRolling] = useState<[string, string]>(["", ""]);
  const [isFull, setIsFull] = useState(() => !!document.fullscreenElement);
  const idx = useRef(0);

  useEffect(() => {
    const onChange = () => setIsFull(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", onChange);
    return () => document.removeEventListener("fullscreenchange", onChange);
  }, []);

  useEffect(() => {
    const prev = document.title;
    document.title = b ? `Màn chiếu · ${b.gameName}` : "Màn chiếu bốc thăm";
    return () => { document.title = prev; };
  }, [b?.gameName]);

  // Hiệu ứng đảo tên chạy tại chỗ trong lúc màn quay đang quay.
  const phase = b?.phase;
  const names = b?.names;
  useEffect(() => {
    if (phase !== "spinning" || !names?.length) return;
    const id = window.setInterval(() => {
      idx.current = (idx.current + 1) % names.length;
      setRolling(names[idx.current]);
    }, 80);
    return () => window.clearInterval(id);
  }, [phase, names]);

  const toggleFull = () => {
    if (document.fullscreenElement) void document.exitFullscreen();
    else void document.documentElement.requestFullscreen().catch(() => {});
  };

  return (
    <div style={{
      minHeight: "100vh", position: "relative", color: "white",
      background: "linear-gradient(160deg, #050d1f 0%, #0d1b3e 55%, #14062a 100%)",
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "space-between",
      gap: 32, padding: "48px clamp(20px, 5vw, 64px)",
    }}>
      <style>{KEYFRAMES}</style>

      <button onClick={toggleFull} aria-label={isFull ? "Thoát toàn màn hình" : "Toàn màn hình"}
        title={isFull ? "Thoát toàn màn hình" : "Toàn màn hình"} style={{
          position: "absolute", top: 20, right: 20, width: 36, height: 36, cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center",
          background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.6)",
        }}>
        {isFull ? <Minimize2 size={15} /> : <Maximize2 size={15} />}
      </button>

      {/* Tên chương trình + giải đang quay */}
      <div style={{ textAlign: "center" }}>
        <div style={{
          display: "inline-flex", alignItems: "center", justifyContent: "center", width: 68, height: 68,
          borderRadius: 18, marginBottom: 18, background: "linear-gradient(135deg, #1eaaff 0%, #7c3aed 100%)",
          boxShadow: "0 0 48px rgba(30,170,255,0.35)",
        }}>
          <Gamepad2 size={34} color="white" />
        </div>
        <p style={{ color: "rgba(255,255,255,0.45)", fontSize: 13, letterSpacing: "0.18em", textTransform: "uppercase", margin: "0 0 10px" }}>
          {b?.gameName ?? "NetEvent"}
        </p>
        <h1 style={{ fontSize: "clamp(30px, 4vw, 52px)", fontWeight: 700, margin: 0, letterSpacing: "-0.02em" }}>
          Bốc thăm may mắn
        </h1>
        {b && b.phase !== "done" && (
          <>
            <p style={{ color: "#1eaaff", fontSize: "clamp(15px, 2vw, 22px)", fontWeight: 600, margin: "10px 0 0" }}>{b.prize}</p>
            <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 14, margin: "6px 0 0" }}>{b.progress}</p>
          </>
        )}
      </div>

      {/* Giữa: chờ / đảo tên / người thắng / tổng kết */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 24, width: "100%", maxWidth: 640 }}>
        {!b ? (
          <p style={{ color: "rgba(255,255,255,0.55)", fontSize: 18, textAlign: "center", lineHeight: 1.6 }}>
            Đang chờ màn hình quay…
            <br />
            <span style={{ fontSize: 14, color: "rgba(255,255,255,0.35)" }}>Mở màn chiếu từ màn hình quay để hiển thị kết quả.</span>
          </p>
        ) : b.phase === "done" ? (
          <div style={{ width: "100%", textAlign: "center" }}>
            <p style={{ color: "#1eaaff", fontSize: 14, letterSpacing: "0.15em", textTransform: "uppercase", fontWeight: 600, margin: "0 0 16px" }}>
              Đã hoàn tất bốc thăm
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 8, maxHeight: "45vh", overflowY: "auto" }}>
              {b.winners.map((w, i) => (
                <div key={i} style={{
                  display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 16, padding: "12px 18px",
                  borderRadius: 14, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", textAlign: "left",
                }}>
                  <span style={{ fontSize: 15, color: "rgba(255,255,255,0.55)" }}>{w.prize}</span>
                  <span style={{ fontSize: 18, fontWeight: 600 }}>
                    {w.lines[0]} <span style={{ fontSize: 14, color: "rgba(255,255,255,0.45)", fontFamily: "monospace" }}>{w.lines[1]}</span>
                  </span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div style={{
            width: "100%", minHeight: 180, borderRadius: 20, padding: "32px 40px", textAlign: "center",
            display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
            background: "rgba(255,255,255,0.04)",
            border: `2px solid ${b.phase === "result" ? "#1eaaff" : "rgba(255,255,255,0.08)"}`,
            animation: b.phase === "result" ? "pj-glow 2s ease infinite" : undefined,
          }}>
            {b.phase === "idle" && (
              <p style={{ color: "rgba(255,255,255,0.25)", fontSize: 20, letterSpacing: "0.08em", margin: 0 }}>— Chờ bốc thăm —</p>
            )}
            {b.phase === "spinning" && (
              <>
                <p style={{ fontSize: "clamp(24px, 4vw, 44px)", fontWeight: 700, margin: 0, animation: "pj-roll 0.14s ease infinite" }}>{rolling[0]}</p>
                <p style={{ color: "rgba(255,255,255,0.35)", fontSize: 15, margin: "6px 0 0", fontFamily: "monospace" }}>{rolling[1]}</p>
              </>
            )}
            {b.phase === "result" && b.winner && (
              <div style={{ animation: "pj-winner 0.5s cubic-bezier(0.16,1,0.3,1)" }}>
                <p style={{ color: "#1eaaff", fontSize: 14, letterSpacing: "0.15em", textTransform: "uppercase", fontWeight: 600, margin: "0 0 12px" }}>
                  🎉 Chúc mừng!
                </p>
                <p style={{ fontSize: "clamp(28px, 4.5vw, 54px)", fontWeight: 700, margin: "0 0 8px", letterSpacing: "-0.02em" }}>{b.winner[0]}</p>
                <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 18, margin: 0, fontFamily: "monospace" }}>{b.winner[1]}</p>
              </div>
            )}
          </div>
        )}

        {b && (
          <div style={{ display: "flex", alignItems: "center", gap: 8, color: "rgba(255,255,255,0.35)", fontSize: 14 }}>
            {b.lockedAt ? <Lock size={15} /> : <Users size={15} />}
            <span>
              {b.poolCount} người · {b.lockedAt ? `Danh sách đã chốt lúc ${b.lockedAt}` : "Danh sách được chốt khi bắt đầu quay"}
            </span>
          </div>
        )}
      </div>

      <p style={{ color: "rgba(255,255,255,0.2)", fontSize: 12, margin: 0 }}>Kết quả được ghi nhận trên hệ thống NetEvent</p>
    </div>
  );
}

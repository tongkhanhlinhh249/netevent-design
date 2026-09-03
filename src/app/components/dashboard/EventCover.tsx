import * as React from "react";
import { Upload, Move, X } from "lucide-react";
import { Button } from "../ui/button";

// ── Design tokens (mirrors EventsPage.tsx) ───────────────────────────────────

const T = {
  background:  "var(--background)",
  foreground:  "var(--foreground)",
  border:      "var(--border)",
  primary:     "var(--primary)",
  primaryFg:   "var(--primary-foreground)",
  muted:       "var(--muted)",
  mutedFg:     "var(--muted-foreground)",
  xs:          "var(--text-xs)",
  sm:          "var(--text-sm)",
  fw_medium:   "var(--font-weight-medium)",
  fw_semi:     "var(--font-weight-semibold)",
};

const DEFAULT_GRADIENT = "linear-gradient(135deg, var(--primary) 0%, var(--accent-foreground) 100%)";

// ── Crop Modal ────────────────────────────────────────────────────────────────

function CropModal({ src, onSave, onCancel }: {
  src: string;
  onSave: (url: string) => void;
  onCancel: () => void;
}) {
  const [offsetY, setOffsetY] = React.useState(50); // vertical center %
  const [dragging, setDragging] = React.useState(false);
  const startY = React.useRef(0);
  const startOffset = React.useRef(50);

  const handleMouseDown = (e: React.MouseEvent) => {
    setDragging(true);
    startY.current = e.clientY;
    startOffset.current = offsetY;
  };

  const handleMouseMove = React.useCallback((e: MouseEvent) => {
    if (!dragging) return;
    const delta = (e.clientY - startY.current) / 4;
    setOffsetY(Math.max(0, Math.min(100, startOffset.current - delta)));
  }, [dragging]);

  const handleMouseUp = React.useCallback(() => setDragging(false), []);

  React.useEffect(() => {
    if (dragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    }
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [dragging, handleMouseMove, handleMouseUp]);

  const handleSave = () => onSave(src);

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 300,
      backgroundColor: "rgba(0,0,0,0.75)",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: "24px",
    }}>
      <div style={{
        background: T.background, borderRadius: 20,
        width: "100%", maxWidth: 680,
        display: "flex", flexDirection: "column", overflow: "hidden",
      }}>
        {/* Header */}
        <div style={{
          padding: "18px 24px", borderBottom: `1px solid ${T.border}`,
          display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>
          <div>
            <p style={{ fontSize: T.sm, fontWeight: T.fw_semi, color: T.foreground, margin: 0 }}>Điều chỉnh vùng hiển thị</p>
            <p style={{ fontSize: T.xs, color: T.mutedFg, margin: 0, marginTop: 2 }}>Kéo để chọn vùng hiển thị theo tỷ lệ 1:1</p>
          </div>
          <button onClick={onCancel} style={{ background: "none", border: "none", cursor: "pointer", color: T.mutedFg, padding: 4 }}>
            <X size={18} />
          </button>
        </div>

        {/* Crop area */}
        <div style={{ padding: "20px 24px" }}>
          {/* 1:1 crop frame */}
          <div
            onMouseDown={handleMouseDown}
            style={{
              aspectRatio: "1/1",
              maxHeight: 400,
              borderRadius: 12,
              overflow: "hidden",
              position: "relative",
              cursor: dragging ? "grabbing" : "grab",
              userSelect: "none",
              border: `2px solid ${T.primary}`,
            }}
          >
            <img
              src={src}
              alt="Crop preview"
              draggable={false}
              style={{
                width: "100%", height: "100%",
                objectFit: "cover",
                objectPosition: `center ${offsetY}%`,
                pointerEvents: "none",
              }}
            />

            {/* Safe area overlay */}
            <div style={{
              position: "absolute",
              inset: "12%",
              border: "2px dashed rgba(255,255,255,0.6)",
              borderRadius: 8,
              pointerEvents: "none",
            }}>
              <div style={{
                position: "absolute", top: -22, left: 0,
                background: "rgba(0,0,0,0.55)",
                borderRadius: "4px 4px 0 0",
                padding: "2px 8px",
              }}>
                <span style={{ fontSize: T.xs, color: "white", whiteSpace: "nowrap" }}>Vùng an toàn nội dung</span>
              </div>
            </div>

            {/* Drag hint */}
            <div style={{
              position: "absolute", bottom: 10, right: 10,
              background: "rgba(0,0,0,0.5)", borderRadius: 8,
              padding: "4px 8px", display: "flex", alignItems: "center", gap: 5,
            }}>
              <Move size={12} color="white" />
              <span style={{ fontSize: T.xs, color: "white" }}>Kéo để điều chỉnh</span>
            </div>
          </div>

          {/* Guidance */}
          <p style={{ fontSize: T.xs, color: T.mutedFg, marginTop: 12, lineHeight: 1.6 }}>
            Đặt logo, tiêu đề và thông tin quan trọng trong vùng an toàn để tránh bị cắt trên các thiết bị.
          </p>
        </div>

        {/* Footer */}
        <div style={{
          padding: "14px 24px", borderTop: `1px solid ${T.border}`,
          display: "flex", justifyContent: "flex-end", gap: 10,
        }}>
          <Button variant="outline" onClick={onCancel}>Hủy</Button>
          <Button onClick={handleSave}>Lưu ảnh cover</Button>
        </div>
      </div>
    </div>
  );
}

// ── Upload Variant ─────────────────────────────────────────────────────────────

export interface EventCoverUploadProps {
  previewUrl?: string | null;
  onPreviewChange: (url: string | null) => void;
  eventName?: string;
  /** Called after crop modal is confirmed */
  onCropSave?: (url: string) => void;
  /** Background shown behind the placeholder, so the cover reflects the picked theme */
  placeholderBackground?: string;
}

export function EventCoverUpload({ previewUrl, onPreviewChange, eventName, onCropSave, placeholderBackground }: EventCoverUploadProps) {
  const [dragging, setDragging] = React.useState(false);
  const [cropSrc, setCropSrc] = React.useState<string | null>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    if (!file.type.startsWith("image/")) return;
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      const ratio = img.naturalWidth / img.naturalHeight;
      if (Math.abs(ratio - 1) > 0.05) {
        setCropSrc(url);
      } else {
        onPreviewChange(url);
      }
    };
    img.src = url;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) handleFile(f);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault(); setDragging(false);
    const f = e.dataTransfer.files?.[0];
    if (f) handleFile(f);
  };

  const handleCropSave = (url: string) => {
    setCropSrc(null);
    onPreviewChange(url);
    onCropSave?.(url);
  };

  return (
    <>
      <div
        style={{
          aspectRatio: "1/1",
          borderRadius: 16,
          overflow: "hidden",
          position: "relative",
          cursor: "pointer",
          background: previewUrl ? "transparent" : (placeholderBackground ?? "linear-gradient(135deg, var(--secondary) 0%, var(--muted) 100%)"),
          border: dragging ? `2px dashed ${T.primary}` : `2px dashed ${T.border}`,
        }}
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
      >
        {/* Image */}
        {previewUrl && (
          <img
            src={previewUrl} alt="Cover"
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
          />
        )}

        {/* Placeholder */}
        {!previewUrl && (
          <div style={{
            position: "absolute", inset: 0,
            display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 10,
          }}>
            <div style={{
              width: 48, height: 48, borderRadius: 14,
              display: "flex", alignItems: "center", justifyContent: "center",
              backgroundColor: `color-mix(in srgb, ${T.primary} 10%, transparent)`,
            }}>
              <Upload size={22} style={{ color: T.primary }} />
            </div>
            <div style={{ textAlign: "center" }}>
              <p style={{ fontSize: T.sm, fontWeight: T.fw_medium, color: T.foreground, margin: 0 }}>Tải ảnh cover sự kiện</p>
              <p style={{ fontSize: T.xs, color: T.mutedFg, marginTop: 4, margin: 0 }}>Tỷ lệ khuyến nghị 1:1 · 800 × 800px</p>
              <p style={{ fontSize: T.xs, color: T.mutedFg, marginTop: 4, lineHeight: 1.5, maxWidth: 260, margin: "4px auto 0" }}>
                Ảnh sẽ được dùng trên trang sự kiện, tổng quan và danh sách sự kiện.
              </p>
            </div>
          </div>
        )}

        {/* Hover overlay */}
        <div className="group" style={{ position: "absolute", inset: 0 }}>
          <div style={{
            position: "absolute", inset: 0,
            background: "rgba(0,0,0,0)", transition: "background 0.15s",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}
            onMouseEnter={e => (e.currentTarget.style.background = "rgba(0,0,0,0.35)")}
            onMouseLeave={e => (e.currentTarget.style.background = "rgba(0,0,0,0)")}
          >
            {previewUrl && (
              <div style={{ display: "flex", gap: 8 }} onClick={e => e.stopPropagation()}>
                <button
                  onClick={() => inputRef.current?.click()}
                  style={{
                    padding: "6px 14px", borderRadius: 8, background: "rgba(255,255,255,0.2)",
                    border: "none", color: "white", fontSize: T.xs, fontWeight: T.fw_medium,
                    cursor: "pointer", display: "flex", alignItems: "center", gap: 6,
                  }}>
                  <Upload size={13} /> Đổi ảnh
                </button>
                <button
                  onClick={() => onPreviewChange(null)}
                  style={{
                    padding: "6px 14px", borderRadius: 8, background: "rgba(255,255,255,0.12)",
                    border: "none", color: "white", fontSize: T.xs,
                    cursor: "pointer", display: "flex", alignItems: "center", gap: 6,
                  }}>
                  <X size={13} /> Xóa ảnh
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Event name overlay */}
        {eventName && (
          <div style={{
            position: "absolute", bottom: 0, left: 0, right: 0, padding: "16px",
            background: "linear-gradient(to top, rgba(0,0,0,0.55), transparent)",
            pointerEvents: "none",
          }}>
            <p style={{ color: "white", fontSize: T.sm, fontWeight: T.fw_semi, margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {eventName}
            </p>
          </div>
        )}

        <input ref={inputRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleChange} />
      </div>

      {cropSrc && (
        <CropModal src={cropSrc} onSave={handleCropSave} onCancel={() => { setCropSrc(null); }} />
      )}
    </>
  );
}

// ── Display Variants ──────────────────────────────────────────────────────────

interface EventCoverDisplayProps {
  src?: string | null;
  gradient?: string;
  alt?: string;
  children?: React.ReactNode;
  style?: React.CSSProperties;
}

function EventCoverBase({ src, gradient, alt, children, borderRadius, style }: EventCoverDisplayProps & { borderRadius: number }) {
  return (
    <div style={{
      aspectRatio: "1/1",
      borderRadius,
      overflow: "hidden",
      position: "relative",
      background: src ? "transparent" : (gradient || DEFAULT_GRADIENT),
      ...style,
    }}>
      {src && (
        <img
          src={src} alt={alt || "Event cover"}
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
        />
      )}
      {children}
    </div>
  );
}

/** Full-width hero — use in overview and landing page preview */
export function EventCoverLarge(props: EventCoverDisplayProps) {
  return <EventCoverBase {...props} borderRadius={16} />;
}

/** Mid-size card cover */
export function EventCoverMedium(props: EventCoverDisplayProps) {
  return <EventCoverBase {...props} borderRadius={12} />;
}

/** Compact thumbnail — pass width via style */
export function EventCoverSmall(props: EventCoverDisplayProps) {
  return <EventCoverBase {...props} borderRadius={8} />;
}

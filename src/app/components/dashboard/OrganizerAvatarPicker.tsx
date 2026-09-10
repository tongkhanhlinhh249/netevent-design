import * as React from "react";
import { Camera } from "lucide-react";
import { readImageFile } from "../../data/imageUtils";

/**
 * Ảnh đại diện của đơn vị tổ chức. Bấm để tải ảnh lên; chưa có ảnh thì hiện
 * chữ cái đầu của tên — đúng như cách trang sự kiện hiển thị.
 */
export function OrganizerAvatarPicker({ value, name, onChange, size = 40 }: {
  value: string | null | undefined;
  name: string;
  onChange: (dataUrl: string | null) => void;
  size?: number;
}) {
  const fileRef = React.useRef<HTMLInputElement>(null);
  const initial = name.trim()[0]?.toUpperCase() ?? "";
  return (
    <>
      <button type="button" data-pill="off" title="Tải ảnh đại diện"
        onClick={() => fileRef.current?.click()}
        className="relative shrink-0 flex items-center justify-center cursor-pointer overflow-hidden transition-opacity hover:opacity-85"
        style={{ width: size, height: size, borderRadius: "50%",
          backgroundColor: value ? "transparent" : "rgba(255,134,68,0.12)",
          border: value ? "none" : "1px dashed var(--border)" }}>
        {value ? (
          <img src={value} alt={name || "Ảnh đại diện"} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        ) : initial ? (
          <span style={{ fontWeight: 700, color: "#ff8644", fontSize: Math.round(size * 0.4) }}>{initial}</span>
        ) : (
          <Camera style={{ width: size * 0.42, height: size * 0.42, color: "var(--muted-foreground)" }} />
        )}
      </button>
      <input ref={fileRef} type="file" accept="image/*" className="hidden"
        onChange={async (e) => {
          const f = e.target.files?.[0];
          e.target.value = "";
          if (f && f.type.startsWith("image/")) onChange(await readImageFile(f, 256));
        }} />
    </>
  );
}

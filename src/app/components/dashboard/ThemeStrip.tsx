import * as React from "react";
import { useRef } from "react";
import { Upload } from "lucide-react";
import { THEMES, DEFAULT_THEME_COLOR, DEFAULT_EFFECT_COLORS, type EffectColorKey } from "../../data/themes";
import { EventBackground } from "../backgrounds/EventBackground";
import { readImageFile } from "../../data/imageUtils";

/**
 * Giao diện trang sự kiện dạng một hàng ảnh nhỏ cuộn ngang (như mục Appearance
 * của Luma) — gọn cho ngăn sửa thông tin. Chọn theme nào thì ô chỉnh màu của
 * đúng theme đó hiện ngay bên dưới.
 */

const T = {
  foreground: "var(--foreground)",
  border:     "var(--border)",
  primary:    "var(--primary)",
  secondary:  "var(--secondary)",
  background: "var(--background)",
  mutedFg:    "var(--muted-foreground)",
  fw_medium:  "var(--font-weight-medium)",
  xs: "var(--text-xs)",
  sm: "var(--text-sm)",
};

export interface ThemeValue {
  theme: string;
  themeColor?: string;
  themeEffectColors?: Partial<Record<string, string>>;
  pageImage?: string;
}

export function ThemeStrip({ value, onChange }: { value: ThemeValue; onChange: (v: ThemeValue) => void }) {
  const fileRef = useRef<HTMLInputElement>(null);
  const colors = { ...DEFAULT_EFFECT_COLORS, ...value.themeEffectColors } as Record<EffectColorKey, string>;
  const color = value.themeColor || DEFAULT_THEME_COLOR;
  const active = THEMES.find((t) => t.id === value.theme);

  const pick = (theme: string) => onChange({ ...value, theme });
  const upload = async (file?: File) => {
    if (!file || !file.type.startsWith("image/")) return;
    onChange({ ...value, theme: "custom", pageImage: await readImageFile(file, 1920) });
  };

  return (
    <div className="flex flex-col gap-3">
      {/* Hàng cuộn ngang cắt mọi thứ tràn ra ngoài, kể cả viền chọn (2px, cách 2px) —
          chừa đủ chỗ quanh ảnh để viền không bị cắt và không dính vào nhãn phía trên. */}
      <div className="flex gap-2.5 overflow-x-auto py-1.5 -mx-1.5 px-1.5" role="radiogroup" aria-label="Giao diện trang sự kiện">
        {THEMES.map((th) => (
          <Thumb key={th.id} label={th.label} on={value.theme === th.id} onClick={() => pick(th.id)}
            style={{ background: th.gradient }}>
            {th.animated && <EventBackground themeId={th.id} colors={colors} fixed={false} scrim={0} />}
          </Thumb>
        ))}
        <Thumb label="Màu tự chọn" on={value.theme === "color"} onClick={() => pick("color")}
          style={{ backgroundColor: color }} />
        <Thumb label="Ảnh nền" on={value.theme === "custom"}
          onClick={() => (value.pageImage && value.theme !== "custom" ? pick("custom") : fileRef.current?.click())}
          style={value.pageImage
            ? { backgroundImage: `url("${value.pageImage}")`, backgroundSize: "cover", backgroundPosition: "center" }
            : { backgroundColor: T.secondary, border: `1px dashed ${T.border}` }}>
          {!value.pageImage && <Upload className="size-4 m-auto relative" style={{ color: T.mutedFg, top: "calc(50% - 8px)" }} />}
        </Thumb>
        <input ref={fileRef} type="file" accept="image/*" className="hidden"
          onChange={(e) => { void upload(e.target.files?.[0]); e.target.value = ""; }} />
      </div>

      {/* Chỉnh màu đi liền với đúng giao diện đang chọn */}
      {active?.tunable?.length ? (
        <div className="grid grid-cols-2 gap-2">
          {active.tunable.map((c) => (
            <ColorRow key={c.key} label={c.label} value={colors[c.key]}
              onChange={(v) => onChange({ ...value, themeEffectColors: { ...colors, [c.key]: v } })} />
          ))}
        </div>
      ) : value.theme === "color" ? (
        <div className="grid grid-cols-2 gap-2">
          <ColorRow label="Màu nền" value={color} onChange={(v) => onChange({ ...value, themeColor: v })} />
        </div>
      ) : value.theme === "custom" && value.pageImage ? (
        <button type="button" data-pill="off" onClick={() => fileRef.current?.click()}
          className="self-start cursor-pointer hover:underline"
          style={{ background: "none", border: "none", padding: 0, fontSize: T.xs, color: T.primary }}>
          Đổi ảnh khác
        </button>
      ) : null}
    </div>
  );
}

function Thumb({ label, on, onClick, style, children }: {
  label: string; on: boolean; onClick: () => void; style: React.CSSProperties; children?: React.ReactNode;
}) {
  return (
    <button type="button" data-pill="off" role="radio" aria-checked={on} onClick={onClick}
      className="flex flex-col items-center gap-1.5 shrink-0 cursor-pointer"
      style={{ background: "none", border: "none", padding: 0, width: 84 }}>
      <span className="relative block w-[84px] h-[56px] rounded-lg overflow-hidden"
        style={{ ...style, outline: on ? `2px solid ${T.primary}` : "none", outlineOffset: 2,
          boxShadow: on ? "none" : `inset 0 0 0 1px ${T.border}` }}>
        {children}
      </span>
      <span className="truncate w-full text-center"
        style={{ fontSize: T.xs, color: on ? T.foreground : T.mutedFg, fontWeight: on ? T.fw_medium : undefined }}>
        {label}
      </span>
    </button>
  );
}

function ColorRow({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <label className="flex items-center gap-2.5 rounded-lg px-2.5 h-10 cursor-pointer"
      style={{ backgroundColor: T.background, border: `1px solid ${T.border}` }}>
      <span className="size-5 rounded-md shrink-0 relative overflow-hidden" style={{ backgroundColor: value, border: `1px solid ${T.border}` }}>
        <input type="color" value={value} aria-label={label} onChange={(e) => onChange(e.target.value)}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
      </span>
      <span className="flex-1 min-w-0 truncate" style={{ fontSize: T.sm, color: T.foreground }}>{label}</span>
      <span style={{ fontSize: T.xs, color: T.mutedFg, fontFamily: "monospace" }}>{value.toUpperCase()}</span>
    </label>
  );
}

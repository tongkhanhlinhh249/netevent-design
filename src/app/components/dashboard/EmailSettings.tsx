import * as React from "react";
import { useEffect, useRef, useState } from "react";
import { AlertTriangle, Link2, Pencil, Plus, RotateCcw, Send } from "lucide-react";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Switch } from "../ui/switch";
import { Sheet, SheetContent, SheetDescription, SheetTitle } from "../ui/sheet";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";
import type { EventDraft } from "./EventsPage";
import { shortDateVi } from "../../data/eventFormat";
import { TokenEditor, type TokenEditorHandle } from "./EmailTokenEditor";
import { activeSender, useSenderEmail } from "../../data/senderEmail";

/**
 * Email sự kiện — theo tài liệu nghiệp vụ NetEvent_Nghiep_vu_Cau_hinh_email.md,
 * trình bày theo hành trình sự kiện chứ không như công cụ tự động hoá:
 *
 * - Bốn email có sẵn mẫu hoàn chỉnh: xác nhận đăng ký, nhắc tham dự, sắp bắt
 *   đầu, cảm ơn tham dự. Người dùng chỉ bật/tắt và sửa nội dung khi cần.
 * - Trình soạn không lộ cú pháp biến: nội dung lưu {{bien}}, người dùng thấy thẻ
 *   như [Tên sự kiện] và chèn qua "Thêm thông tin tự động" (EmailTokenEditor.tsx).
 * - Người gửi chỉ đọc ở đây. Theo [Feature Spec] CẤU HÌNH EMAIL GỬI, địa chỉ gửi
 *   là cấu hình của cả tài khoản, đặt ở Cài đặt → Email gửi; màn này chỉ cho
 *   biết đang gửi bằng địa chỉ nào và mở thẳng sang đó khi cần đổi.
 *
 * Nội dung và công tắc bật/tắt thì lưu theo sự kiện.
 */

// ── Tokens ───────────────────────────────────────────────────────────────────

const T = {
  background:    "var(--background)",
  foreground:    "var(--foreground)",
  border:        "var(--border)",
  primary:       "var(--primary)",
  secondary:     "var(--secondary)",
  mutedFg:       "var(--muted-foreground)",
  destructive:   "var(--destructive)",
  successText:   "var(--success-text)",
  warningSubtle: "var(--warning-subtle)",
  warningBorder: "var(--warning-border)",
  warningText:   "var(--warning-text)",
  fw_medium: "var(--font-weight-medium)",
  fw_semi:   "var(--font-weight-semibold)",
  xs:   "var(--text-xs)",
  sm:   "var(--text-sm)",
  base: "var(--text-base)",
};

// ── Hằng số & kiểu ───────────────────────────────────────────────────────────

/** Địa chỉ gửi thực tế của NetEvent — hiển thị nguyên văn, không chỉ tên thương hiệu. */
const NETEVENT_FROM = "no-reply@mail.netevent.vn";
/** Email tài khoản đang đăng nhập: đã xác minh khi tạo tài khoản, là nơi nhận thư gửi thử. */
const ACCOUNT_EMAIL = "owner@netevent.vn";
const HOUR = 60 * 60 * 1000;

type EmailKind = "confirm" | "remind" | "starting" | "thanks";
const KINDS: EmailKind[] = ["confirm", "remind", "starting", "thanks"];
type Audience = "checked-in" | "all";
interface Template { subject: string; body: string }


const KIND_LABEL: Record<EmailKind, string> = {
  confirm:  "Xác nhận đăng ký",
  remind:   "Nhắc tham dự",
  starting: "Sắp bắt đầu",
  thanks:   "Cảm ơn tham dự",
};

const AUDIENCE_LABEL: Record<Audience, string> = {
  "checked-in": "Người đã check-in",
  all:          "Tất cả đăng ký hợp lệ",
};

/**
 * Thông tin tự động chèn được vào email — chỉ những gì hệ thống thực sự điền được.
 * Lưu dạng {{khoa}}, người dùng chỉ thấy thẻ. Giờ bắt đầu, giờ kết thúc và múi
 * giờ gộp thành "Thời gian sự kiện"; địa điểm tự thành link tham gia khi sự kiện
 * trực tuyến; vé hiện thành nút "Xem vé của bạn".
 */
const VARIABLES: { key: string; label: string; chip?: string }[] = [
  { key: "ten_nguoi_tham_du", label: "Tên người tham dự" },
  { key: "ten_su_kien",       label: "Tên sự kiện" },
  { key: "thoi_gian_su_kien", label: "Thời gian sự kiện" },
  { key: "dia_diem",          label: "Địa điểm / Link tham gia" },
  { key: "link_ve",           label: "Vé của người tham dự", chip: "Xem vé của bạn" },
];
const TOKEN_LABELS: Record<string, string> = Object.fromEntries(VARIABLES.map((v) => [v.key, v.chip ?? v.label]));
const VAR_KEYS = VARIABLES.map((v) => v.key);
/** Chỉ có nghĩa trong nội dung — bấm chèn khi đang ở ô tiêu đề thì vẫn vào nội dung. */
const BODY_ONLY = new Set(["link_ve"]);
const VAR_RE = /\{\{\s*([^{}]*?)\s*\}\}/g;
const URL_RE = /^https?:\/\/\S+$/i;
// Xem trước: thông tin tự động, link [chữ](https://…) và URL trần.
const PREVIEW_RE = /\{\{\s*([a-z_]+)\s*\}\}|\[([^\]\n]+)\]\((https?:\/\/[^\s)]+)\)|(https?:\/\/[^\s)]+)/g;
const SAMPLE_TICKET_URL = "https://netevent.vn/ve/MINH-HOA";
const SAMPLE_JOIN_URL = "https://meet.netevent.vn/minh-hoa";

const DEFAULT_TEMPLATES: Record<EmailKind, Template> = {
  confirm: {
    subject: "Xác nhận đăng ký: {{ten_su_kien}}",
    body: "Chào {{ten_nguoi_tham_du}},\n\nĐăng ký tham dự {{ten_su_kien}} của bạn đã được xác nhận.\n\nThời gian: {{thoi_gian_su_kien}}\nĐịa điểm: {{dia_diem}}\n\n{{link_ve}}\n\nHẹn gặp bạn tại sự kiện!",
  },
  remind: {
    subject: "Nhắc lịch: {{ten_su_kien}} diễn ra vào ngày mai",
    body: "Chào {{ten_nguoi_tham_du}},\n\n{{ten_su_kien}} sẽ diễn ra vào ngày mai. Bạn nhớ sắp xếp thời gian tham dự nhé.\n\nThời gian: {{thoi_gian_su_kien}}\nĐịa điểm: {{dia_diem}}\n\nMang theo vé để check-in nhanh hơn:\n{{link_ve}}\n\nHẹn gặp bạn tại sự kiện!",
  },
  starting: {
    subject: "{{ten_su_kien}} sắp bắt đầu",
    body: "Chào {{ten_nguoi_tham_du}},\n\n{{ten_su_kien}} sẽ bắt đầu sau 1 giờ nữa.\n\nThời gian: {{thoi_gian_su_kien}}\nĐịa điểm: {{dia_diem}}\n\n{{link_ve}}\n\nHẹn gặp bạn!",
  },
  thanks: {
    subject: "Cảm ơn bạn đã tham dự {{ten_su_kien}}",
    body: "Chào {{ten_nguoi_tham_du}},\n\nCảm ơn bạn đã dành thời gian tham dự {{ten_su_kien}}. Hy vọng bạn đã có những trải nghiệm đáng nhớ.\n\nHẹn gặp lại bạn ở các sự kiện tiếp theo!",
  },
};

/** Mẫu mặc định của bản trước (giờ bắt đầu, giờ kết thúc, múi giờ tách riêng). Chưa sửa thì nâng lên mẫu mới. */
const LEGACY_DEFAULTS: Partial<Record<EmailKind, Template>> = {
  confirm: {
    subject: "Xác nhận đăng ký: {{ten_su_kien}}",
    body: "Chào {{ten_nguoi_tham_du}},\n\nĐăng ký tham dự {{ten_su_kien}} của bạn đã được xác nhận.\n\nThời gian: {{gio_bat_dau}} – {{gio_ket_thuc}} ({{mui_gio}})\nĐịa điểm: {{dia_diem}}\n\nVé QR của bạn: {{link_ve}}\n\nHẹn gặp bạn tại sự kiện!",
  },
  remind: {
    subject: "Nhắc lịch: {{ten_su_kien}} bắt đầu sau 24 giờ",
    body: "Chào {{ten_nguoi_tham_du}},\n\n{{ten_su_kien}} sẽ bắt đầu lúc {{gio_bat_dau}} ({{mui_gio}}).\nĐịa điểm: {{dia_diem}}\n\nNhớ mang theo vé QR để check-in nhanh hơn: {{link_ve}}",
  },
};

const initConfig = (): EventEmailConfig => ({
  automations: { confirm: true, remind: true, starting: false, thanks: true },
  thanksAudience: "checked-in",
  templates: DEFAULT_TEMPLATES,
  testSends: [],
});

/** Nội dung đã sửa ở bản trước: đưa các biến giờ cũ về [Thời gian sự kiện]. */
const upgradeTokens = (s: string) => s
  .replace(/\{\{\s*gio_bat_dau\s*\}\}(?:\s*[–-]\s*\{\{\s*gio_ket_thuc\s*\}\})?(?:\s*\(\s*\{\{\s*mui_gio\s*\}\}\s*\))?/g, "{{thoi_gian_su_kien}}")
  .replace(/\s*\(\s*\{\{\s*mui_gio\s*\}\}\s*\)|\{\{\s*(?:gio_ket_thuc|mui_gio)\s*\}\}/g, "");

function reviveConfig(raw: Partial<EventEmailConfig>): EventEmailConfig {
  const base = initConfig();
  const templates = { ...base.templates };
  for (const k of KINDS) {
    const t = raw.templates?.[k];
    if (!t) continue;
    const legacy = LEGACY_DEFAULTS[k];
    templates[k] = legacy && t.subject === legacy.subject && t.body === legacy.body
      ? DEFAULT_TEMPLATES[k]
      : { subject: upgradeTokens(t.subject), body: upgradeTokens(t.body) };
  }
  return { ...base, ...raw, automations: { ...base.automations, ...raw.automations }, templates };
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function useStored<V extends object>(key: string, init: () => V, revive: (raw: Partial<V>) => V = (raw) => ({ ...init(), ...raw })):
  [V, React.Dispatch<React.SetStateAction<V>>] {
  const [value, setValue] = useState<V>(() => {
    try {
      const raw = localStorage.getItem(key);
      return raw ? revive(JSON.parse(raw) as Partial<V>) : init();
    } catch {
      return init();
    }
  });
  useEffect(() => {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* bộ nhớ bị chặn — chỉ giữ trong phiên */ }
  }, [key, value]);
  return [value, setValue];
}

const usedVars = (text: string) => Array.from(text.matchAll(VAR_RE), (m) => m[1]);
const hasUnknownVars = (text: string) => usedVars(text).some((v) => !VAR_KEYS.includes(v));
const lowerFirst = (s: string) => s.charAt(0).toLowerCase() + s.slice(1);

const fill = (text: string, values: Record<string, string>) =>
  text.replace(VAR_RE, (whole, key: string) => values[key] ?? whole);

/** Người dùng tự gõ đoạn trong dấu ngoặc nhọn: không phải thông tin tự động, không gửi đi được. */
const BRACES_ERROR = "Có đoạn trong dấu {{ }} không phải thông tin tự động. Xoá đoạn đó và chèn bằng “Thêm thông tin tự động”.";

function templateErrors(t: Template) {
  const errors: { subject?: string; body?: string } = {};
  const subject = t.subject.trim();
  if (!subject) errors.subject = "Nhập tiêu đề email.";
  else if (fill(subject, TOKEN_LABELS).length > 150) errors.subject = "Tiêu đề tối đa 150 ký tự.";
  else if (hasUnknownVars(subject)) errors.subject = BRACES_ERROR;
  if (!t.body.trim()) errors.body = "Nhập nội dung email.";
  else if (hasUnknownVars(t.body)) errors.body = BRACES_ERROR;
  return errors;
}

/** Thông tin tự động cần dữ liệu mà sự kiện chưa có — phải xử lý trước khi bật gửi. */
function missingData(t: Template, event: EventDraft) {
  const used = new Set(usedVars(`${t.subject}\n${t.body}`));
  const missing: string[] = [];
  if (used.has("thoi_gian_su_kien") && !(event.startDate && event.startTime)) missing.push("thời gian");
  if (used.has("dia_diem") && event.format !== "online" && !event.location?.trim()) missing.push("địa điểm");
  return missing;
}

/** "09:00 – 17:00, 01/08/2026 (GMT+7)"; kéo dài nhiều ngày thì "09:00 01/08 – 17:00 02/08/2026 (GMT+7)". */
function eventTime(event: EventDraft) {
  const start = shortDateVi(event.startDate);
  if (!start || !event.startTime) return "(chưa có thời gian)";
  const end = shortDateVi(event.endDate) ?? start;
  return end === start
    ? `${event.startTime}${event.endTime ? ` – ${event.endTime}` : ""}, ${start} (GMT+7)`
    : `${event.startTime} ${start.slice(0, 5)} – ${[event.endTime, end].filter(Boolean).join(" ")} (GMT+7)`;
}

/** Dữ liệu mẫu cho xem trước và gửi thử: thông tin sự kiện thật, người nhận và vé minh hoạ. */
function sampleValues(event: EventDraft): Record<string, string> {
  return {
    ten_nguoi_tham_du: "Nguyễn Minh Anh",
    ten_su_kien: event.name || "Sự kiện của bạn",
    thoi_gian_su_kien: eventTime(event),
    dia_diem: event.format === "online" ? SAMPLE_JOIN_URL : (event.location?.trim() || "(chưa có địa điểm)"),
    link_ve: TOKEN_LABELS.link_ve,
  };
}

const TICKET_BUTTON: React.CSSProperties = {
  display: "inline-block", padding: "8px 18px", borderRadius: 8, lineHeight: 1.4,
  backgroundColor: T.primary, color: "#fff", fontWeight: T.fw_semi, textDecoration: "none",
};

/** Xem trước như email thật: thông tin tự động thay bằng dữ liệu mẫu, link bấm được, vé thành nút. */
function renderEmail(text: string, values: Record<string, string>) {
  const parts: React.ReactNode[] = [];
  let last = 0;
  for (const m of text.matchAll(PREVIEW_RE)) {
    const [whole, key, linkText, linkUrl, bareUrl] = m;
    if (key && !(key in values)) continue;
    const at = m.index ?? 0;
    if (at > last) parts.push(text.slice(last, at));
    last = at + whole.length;
    const href = key === "link_ve" ? SAMPLE_TICKET_URL : key ? values[key] : (linkUrl ?? bareUrl);
    if (key === "link_ve") {
      parts.push(<a key={at} href={href} target="_blank" rel="noreferrer" style={TICKET_BUTTON}>{values.link_ve}</a>);
    } else if (key && !URL_RE.test(href)) {
      parts.push(href);
    } else {
      parts.push(
        <a key={at} href={href} target="_blank" rel="noreferrer" style={{ color: T.primary, textDecoration: "underline" }}>
          {linkText ?? href}
        </a>,
      );
    }
  }
  if (last < text.length) parts.push(text.slice(last));
  return parts;
}

/** Thời điểm gửi. "Đăng ký thành công" theo nghiệp vụ: có duyệt / thanh toán thì chỉ gửi khi đã đủ điều kiện. */
function whenOf(kind: EmailKind, event: EventDraft) {
  if (kind === "remind") return "1 ngày trước sự kiện";
  if (kind === "starting") return "1 giờ trước sự kiện";
  if (kind === "thanks") return "Sau khi sự kiện kết thúc";
  const approval = event.requireApproval;
  const paid = Number(event.ticketPrice || 0) > 0;
  if (approval && paid) return "Khi đăng ký được duyệt và thanh toán xong";
  if (approval) return "Khi đăng ký được duyệt";
  if (paid) return "Khi thanh toán được xác nhận";
  return "Ngay khi đăng ký thành công";
}

/** Câu mô tả dưới tiêu đề trình soạn. */
function sentNote(kind: EmailKind, event: EventDraft) {
  if (kind === "remind") return "Email này được gửi tự động 1 ngày trước khi sự kiện bắt đầu.";
  if (kind === "starting") return "Email này được gửi tự động 1 giờ trước khi sự kiện bắt đầu.";
  if (kind === "thanks") return "Email này được gửi tự động sau khi sự kiện kết thúc.";
  const when = whenOf(kind, event);
  return when === "Ngay khi đăng ký thành công"
    ? "Email này được gửi tự động khi khách đăng ký thành công."
    : `Email này được gửi tự động ${lowerFirst(when)}.`;
}

// ── Card ─────────────────────────────────────────────────────────────────────

/** Cột "Trạng thái": vừa tiêu đề cột, công tắc căn phải. */
const STATUS_COL = 60;
/** Tên email giữ trên một dòng; thời điểm gửi xuống dòng khi thẻ hẹp. */
const EMAIL_COLS = "grid-cols-[126px_minmax(0,1fr)]";

export function EmailSettingsCard({ event }: { event: EventDraft }) {
  const navigate = useNavigate();
  const [config, setConfig] = useStored<EventEmailConfig>(`netevent_email_v2_${event.id}`, initConfig, reviveConfig);
  const [sender] = useSenderEmail();
  const [editing, setEditing] = useState<EmailKind | null>(null);

  // Người gửi là cấu hình của cả tài khoản; đổi ở Cài đặt → Email gửi.
  const active = activeSender(sender);
  const from = active.email;
  const senderName = active.name;
  // Thư trả lời về chính địa chỉ gửi; gửi bằng email NetEvent thì về email tài khoản.
  const replyTo = from === NETEVENT_FROM ? ACCOUNT_EMAIL : from;
  const openSenderSettings = () => navigate("/", { state: { page: "settings" } });
  const recentTests = config.testSends.filter((t) => Date.now() - t < HOUR);
  const testBlock = recentTests.length >= 5 ? "Đã đạt giới hạn 5 lần gửi thử mỗi giờ." : "";

  const toggle = (k: EmailKind, on: boolean) => {
    const label = KIND_LABEL[k].toLowerCase();
    if (on) {
      const missing = missingData(config.templates[k], event);
      if (missing.length) {
        toast.error(`Chưa bật được email ${label}`, {
          description: `Sự kiện chưa có ${missing.join(" và ")}. Cập nhật sự kiện hoặc bỏ thông tin đó khỏi nội dung email.`,
        });
        return;
      }
    }
    setConfig((c) => ({ ...c, automations: { ...c.automations, [k]: on } }));
    toast(on ? `Đã bật email ${label}` : `Đã tắt email ${label}`, {
      description: on
        ? (k === "confirm" ? "Áp dụng cho các đăng ký thành công từ bây giờ." : "Không gửi bù cho các mốc đã qua.")
        : "Các email chưa gửi của loại này sẽ bị huỷ.",
    });
  };

  const sendTest = (k: EmailKind) => {
    if (testBlock) { toast.error(testBlock); return; }
    setConfig((c) => ({ ...c, testSends: [...c.testSends.filter((t) => Date.now() - t < HOUR), Date.now()] }));
    // Không khẳng định thư đã vào hộp thư đến — chỉ là nhà cung cấp đã nhận yêu cầu.
    toast.success("Đã tiếp nhận yêu cầu gửi thử", {
      description: `[GỬI THỬ] ${fill(config.templates[k].subject, sampleValues(event))} → ${ACCOUNT_EMAIL}`,
    });
  };

  return (
    <div className="rounded-2xl p-5" style={{ backgroundColor: T.background, border: `1px solid ${T.border}` }}>
      <h3 style={{ fontSize: T.base, fontWeight: T.fw_semi, color: T.foreground }}>Email sự kiện</h3>
      <p style={{ fontSize: T.xs, color: T.mutedFg, lineHeight: 1.6, marginTop: 4 }}>
        Tự động gửi cho người tham dự theo từng giai đoạn.
      </p>

      {/* Người gửi dùng chung cho cả bốn email, quản lý ở Cài đặt */}
      <div className="mt-4 rounded-xl px-3 py-2.5" style={{ backgroundColor: T.secondary }}>
        <div className="flex items-center justify-between gap-2">
          <span style={{ fontSize: T.xs, color: T.mutedFg }}>Người gửi</span>
          <LinkButton onClick={openSenderSettings}>Thay đổi</LinkButton>
        </div>
        <p className="truncate" style={{ fontSize: T.sm, fontWeight: T.fw_medium, color: T.foreground }}>{senderName}</p>
        <p className="truncate" style={{ fontSize: T.xs, color: T.mutedFg }}>{from}</p>
        <p style={{ fontSize: T.xs, color: T.mutedFg, marginTop: 4 }}>Email này được quản lý trong Cài đặt.</p>
      </div>
      {active.fallback && (
        <p className="mt-2 flex items-start gap-1.5 min-w-0" style={{ fontSize: T.xs, color: T.warningText, lineHeight: 1.5 }}>
          <AlertTriangle className="size-3.5 shrink-0 mt-0.5" />
          <span>Email của tổ chức hiện không thể sử dụng. NetEvent đang tạm thời gửi bằng email mặc định.</span>
        </p>
      )}

      {/* Khi nào gửi → gửi gì → bật/tắt. Bấm vào một email để chỉnh nội dung. */}
      <div className="mt-4">
        <div className="flex items-center gap-3 pb-2" style={{ fontSize: T.xs, color: T.mutedFg, borderBottom: `1px solid ${T.border}` }}>
          <div className={`flex-1 min-w-0 grid ${EMAIL_COLS} gap-3`}>
            <span>Email</span>
            <span>Thời điểm gửi</span>
          </div>
          <span className="shrink-0 text-right whitespace-nowrap" style={{ width: STATUS_COL }}>Trạng thái</span>
        </div>
        {KINDS.map((k, i) => (
          <div key={k} className="flex items-center gap-3 py-1"
            style={{ borderBottom: i < KINDS.length - 1 ? `1px solid ${T.border}` : "none" }}>
            <button type="button" data-pill="off" onClick={() => setEditing(k)} title="Chỉnh email"
              className={`flex-1 min-w-0 grid ${EMAIL_COLS} gap-3 items-center text-left rounded-xl -mx-2 px-2 py-2 cursor-pointer transition-colors hover:bg-[var(--secondary)]`}>
              <span className="flex items-center gap-1.5 min-w-0" style={{ fontSize: T.sm, fontWeight: T.fw_medium, color: T.foreground, lineHeight: 1.4 }}>
                {KIND_LABEL[k]} <Pencil className="size-3 shrink-0" style={{ color: T.mutedFg }} />
              </span>
              <span style={{ fontSize: T.xs, color: T.mutedFg, lineHeight: 1.4 }}>{whenOf(k, event)}</span>
            </button>
            <div className="shrink-0 flex justify-end" style={{ width: STATUS_COL }}>
              <Switch aria-label={`Email ${KIND_LABEL[k].toLowerCase()}`}
                checked={config.automations[k]} onCheckedChange={(v) => toggle(k, v)} />
            </div>
          </div>
        ))}
      </div>

      {editing && (
        <TemplateSheet kind={editing} event={event} config={config} from={from} testBlock={testBlock}
          senderName={senderName} replyTo={replyTo}
          onAudience={(a) => setConfig((c) => ({ ...c, thanksAudience: a }))}
          onSave={(t) => setConfig((c) => ({ ...c, templates: { ...c.templates, [editing]: t } }))}
          onTest={() => sendTest(editing)} onClose={() => setEditing(null)} />
      )}
    </div>
  );
}

// ── Chỉnh email ──────────────────────────────────────────────────────────────

function TemplateSheet({ kind, event, config, from, senderName, replyTo, testBlock, onAudience, onSave, onTest, onClose }: {
  kind: EmailKind; event: EventDraft; config: EventEmailConfig; from: string; senderName: string; replyTo: string; testBlock: string;
  onAudience: (a: Audience) => void;
  onSave: (t: Template) => void; onTest: () => void; onClose: () => void;
}) {
  const saved = config.templates[kind];
  const [subject, setSubject] = useState(saved.subject);
  const [body, setBody]       = useState(saved.body);
  const [view, setView]       = useState<"edit" | "preview">("edit");
  const subjectRef = useRef<TokenEditorHandle>(null);
  const bodyRef    = useRef<TokenEditorHandle>(null);
  // Ô vừa đặt con trỏ nhận thông tin chèn vào; chưa chạm ô nào thì chèn vào nội dung.
  const target = useRef<"subject" | "body">("body");

  const errors = templateErrors({ subject, body });
  const hasErrors = !!(errors.subject || errors.body);
  const dirty = subject !== saved.subject || body !== saved.body;
  const isDefault = subject === DEFAULT_TEMPLATES[kind].subject && body === DEFAULT_TEMPLATES[kind].body;
  const values = sampleValues(event);
  const subjectLength = fill(subject.trim(), TOKEN_LABELS).length;
  // Gửi thử chỉ dùng nội dung đã lưu.
  const testReason = dirty ? "Lưu nội dung trước khi gửi thử." : testBlock;

  const insertVariable = (key: string) => {
    const into = BODY_ONLY.has(key) ? "body" : target.current;
    (into === "subject" ? subjectRef : bodyRef).current?.insertToken(key);
  };

  const [linkOpen, setLinkOpen] = useState(false);
  const [linkText, setLinkText] = useState("");
  const [linkUrl, setLinkUrl]   = useState("");
  const urlOk = URL_RE.test(linkUrl.trim());
  const insertLink = () => {
    if (!urlOk) return;
    const url = linkUrl.trim();
    bodyRef.current?.insertLink(linkText.trim() || url, url);
    setLinkOpen(false); setLinkText(""); setLinkUrl("");
  };

  return (
    <Sheet open onOpenChange={(o) => !o && onClose()}>
      <SheetContent className="p-0 flex flex-col gap-0 sm:max-w-[520px]">
        <div className="px-5 py-4 pr-12" style={{ borderBottom: `1px solid ${T.border}` }}>
          <SheetTitle style={{ fontSize: T.base, fontWeight: T.fw_semi, color: T.foreground }}>
            Chỉnh email · {KIND_LABEL[kind]}
          </SheetTitle>
          <SheetDescription style={{ fontSize: T.xs, color: T.mutedFg, marginTop: 2 }}>
            {sentNote(kind, event)}
          </SheetDescription>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-4">
          {/* Người gửi chỉ đọc: đổi ở Cài đặt → Email gửi, không nhập máy chủ tại đây */}
          <div className="flex flex-col gap-1.5">
            <Label>Người gửi</Label>
            <span className="truncate" title={`${senderName} <${from}>`} style={{ fontSize: T.sm, color: T.foreground }}>
              {senderName} &lt;{from}&gt;
            </span>
          </div>
          {/* Email cảm ơn phải cho thấy nhóm nhận */}
          {kind === "thanks" && (
            <div className="flex flex-col gap-1.5">
              <Label>Gửi cho</Label>
              <Select value={config.thanksAudience} onValueChange={(v) => onAudience(v as Audience)}>
                <SelectTrigger className="h-9 cursor-pointer"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="checked-in">{AUDIENCE_LABEL["checked-in"]}</SelectItem>
                  <SelectItem value="all">{AUDIENCE_LABEL.all}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="inline-flex self-start gap-0.5 p-0.5 rounded-full" style={{ backgroundColor: T.secondary, border: `1px solid ${T.border}` }}>
            {(["edit", "preview"] as const).map((v) => {
              const on = view === v;
              return (
                <button key={v} type="button" aria-pressed={on} onClick={() => setView(v)}
                  className="px-3 py-1 cursor-pointer transition-colors whitespace-nowrap"
                  style={{ fontSize: T.xs, fontWeight: on ? T.fw_semi : T.fw_medium,
                    backgroundColor: on ? T.background : "transparent", color: on ? T.foreground : T.mutedFg,
                    boxShadow: on ? "0 1px 3px rgba(0,0,0,0.08)" : "none" }}>
                  {v === "edit" ? "Soạn nội dung" : "Xem trước"}
                </button>
              );
            })}
          </div>

          {view === "edit" ? (
            <>
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between gap-2">
                  <Label id="tpl-subject-label">Tiêu đề email</Label>
                  {subjectLength > 120 && (
                    <span style={{ fontSize: T.xs, color: subjectLength > 150 ? T.destructive : T.mutedFg }}>{subjectLength}/150</span>
                  )}
                </div>
                <TokenEditor ref={subjectRef} singleLine aria-labelledby="tpl-subject-label" tokens={TOKEN_LABELS}
                  value={subject} onChange={setSubject} invalid={!!errors.subject} placeholder="Ví dụ: Xác nhận đăng ký"
                  onFocus={() => { target.current = "subject"; }} />
                {errors.subject && <FieldError>{errors.subject}</FieldError>}
              </div>
              <div className="flex flex-col gap-1.5">
                <Label id="tpl-body-label">Nội dung</Label>
                <TokenEditor ref={bodyRef} aria-labelledby="tpl-body-label" tokens={TOKEN_LABELS} minHeight={260}
                  value={body} onChange={setBody} invalid={!!errors.body}
                  onFocus={() => { target.current = "body"; }} />
                {errors.body && <FieldError>{errors.body}</FieldError>}
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <DropdownMenu modal={false}>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm"><Plus className="size-3.5" /> Thêm thông tin tự động</Button>
                  </DropdownMenuTrigger>
                  {/* Giữ con trỏ ở ô soạn sau khi chèn, không trả focus về nút */}
                  <DropdownMenuContent align="start" className="w-60" onCloseAutoFocus={(e) => e.preventDefault()}>
                    {VARIABLES.map((v) => (
                      <DropdownMenuItem key={v.key} onSelect={() => insertVariable(v.key)}>{v.label}</DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
                <Popover open={linkOpen} onOpenChange={setLinkOpen}>
                  <PopoverTrigger asChild>
                    <Button variant="ghost" size="sm" style={{ color: T.primary }}><Link2 className="size-3.5" /> Chèn link</Button>
                  </PopoverTrigger>
                  <PopoverContent align="start" className="w-72 flex flex-col gap-3" onCloseAutoFocus={(e) => e.preventDefault()}>
                    <div className="flex flex-col gap-1.5">
                      <Label htmlFor="link-text">Chữ hiển thị</Label>
                      <Input id="link-text" value={linkText} placeholder="Ví dụ: Xem chương trình"
                        onChange={(e) => setLinkText(e.target.value)} />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <Label htmlFor="link-url">Đường dẫn</Label>
                      <Input id="link-url" value={linkUrl} placeholder="https://"
                        aria-invalid={!!linkUrl.trim() && !urlOk}
                        onChange={(e) => setLinkUrl(e.target.value)}
                        onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); insertLink(); } }} />
                      {linkUrl.trim() && !urlOk && <FieldError>Đường dẫn cần bắt đầu bằng http:// hoặc https://</FieldError>}
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button size="sm" variant="outline" onClick={() => setLinkOpen(false)}>Hủy</Button>
                      <Button size="sm" disabled={!urlOk} onClick={insertLink}>Chèn</Button>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            </>
          ) : (
            <>
              <div className="rounded-xl overflow-hidden" style={{ border: `1px solid ${T.border}` }}>
                <div className="px-4 py-3 flex flex-col gap-1" style={{ backgroundColor: T.secondary, fontSize: T.xs }}>
                  <PreviewLine label="Từ" value={`${senderName} <${from}>`} />
                  <PreviewLine label="Trả lời tới" value={replyTo} />
                </div>
                <div className="px-4 py-4 flex flex-col gap-3">
                  <p style={{ fontSize: T.base, fontWeight: T.fw_semi, color: T.foreground }}>{fill(subject, values)}</p>
                  <p style={{ fontSize: T.sm, color: T.foreground, lineHeight: 1.7, whiteSpace: "pre-wrap" }}>{renderEmail(body, values)}</p>
                </div>
              </div>
              <p style={{ fontSize: T.xs, color: T.mutedFg, lineHeight: 1.5 }}>
                Đây là nội dung mẫu. Khi gửi, thông tin sẽ tự động thay đổi theo từng người tham dự.
              </p>
            </>
          )}
        </div>

        <div className="px-5 py-4 flex items-center justify-between gap-2" style={{ borderTop: `1px solid ${T.border}` }}>
          <Button variant="ghost" size="sm" disabled={isDefault}
            onClick={() => { setSubject(DEFAULT_TEMPLATES[kind].subject); setBody(DEFAULT_TEMPLATES[kind].body); }}>
            <RotateCcw className="size-3.5" /> Khôi phục mặc định
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" disabled={!!testReason} onClick={onTest}
              title={testReason || `Gửi tới ${ACCOUNT_EMAIL}, tiêu đề có tiền tố “[GỬI THỬ]”`}>
              <Send className="size-3.5" /> Gửi thử
            </Button>
            <Button disabled={!dirty || hasErrors}
              onClick={() => { onSave({ subject, body }); toast.success("Đã lưu nội dung email."); }}>
              Lưu
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

// ── Mảnh nhỏ ─────────────────────────────────────────────────────────────────

function PreviewLine({ label, value }: { label: string; value: string }) {
  return (
    <p className="flex gap-2 min-w-0">
      <span className="shrink-0" style={{ width: 72, color: T.mutedFg }}>{label}</span>
      <span className="truncate" style={{ color: T.foreground }}>{value}</span>
    </p>
  );
}

function LinkButton({ onClick, disabled, children }: { onClick: () => void; disabled?: boolean; children: React.ReactNode }) {
  return (
    <button type="button" data-pill="off" onClick={onClick} disabled={disabled}
      className="cursor-pointer hover:underline disabled:cursor-default disabled:no-underline disabled:opacity-60"
      style={{ fontSize: T.xs, fontWeight: T.fw_medium, color: T.primary, background: "none", border: "none", padding: 0 }}>
      {children}
    </button>
  );
}

function FieldError({ children }: { children: React.ReactNode }) {
  return <p style={{ fontSize: T.xs, color: T.destructive }}>{children}</p>;
}

import * as React from "react";
import { useEffect, useState } from "react";
import {
  AlertTriangle, CheckCircle2, ChevronRight, Clock, Copy, Link2, Pencil, Plus, RotateCcw, Send,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Switch } from "../ui/switch";
import { Sheet, SheetContent, SheetDescription, SheetTitle } from "../ui/sheet";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import type { EventDraft } from "./EventsPage";
import { shortDateVi } from "../../data/eventFormat";

/**
 * Cấu hình email của sự kiện — theo tài liệu nghiệp vụ
 * NetEvent_Nghiep_vu_Cau_hinh_email.md, rút gọn giao diện:
 *
 * - Người gửi: chỉ chọn địa chỉ gửi. Mặc định là email NetEvent; "Email của
 *   tôi" chỉ lưu được khi địa chỉ đã xác thực tên miền và xác minh hộp thư.
 *   Đang xác thực thì cấu hình đang chạy giữ nguyên. Tên hiển thị lấy theo đơn
 *   vị tổ chức (sửa ở Thông tin chung); thư trả lời về chính email riêng, hoặc
 *   về email tài khoản khi gửi bằng email NetEvent.
 * - Ba email tự động bật/tắt độc lập, mỗi loại có nội dung riêng.
 *
 * Địa chỉ gửi riêng lưu ở cấp tài khoản (dùng lại cho mọi sự kiện); lựa chọn
 * người gửi, nội dung và công tắc lưu theo sự kiện.
 *
 * Bản prototype không gửi email thật: "Kiểm tra xác thực" mô phỏng lần đầu
 * chưa thấy bản ghi DNS, lần sau thì xác thực xong.
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
const ACCOUNT_KEY = "netevent_email_account_v2";
const HOUR = 60 * 60 * 1000;

/** Hộp thư công cộng: NetEvent chưa gửi thay được, chỉ dùng làm Reply-To. */
const PUBLIC_PROVIDERS: Record<string, string> = {
  "gmail.com": "Gmail", "googlemail.com": "Gmail",
  "yahoo.com": "Yahoo", "yahoo.com.vn": "Yahoo",
  "outlook.com": "Outlook", "hotmail.com": "Outlook", "live.com": "Outlook",
  "icloud.com": "iCloud",
};

// Không cho khoảng trắng — kể cả ký tự xuống dòng, vốn có thể chèn thêm header.
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const isEmail = (v: string) => EMAIL_RE.test(v.trim());
const norm = (v: string) => v.trim().toLowerCase();

type EmailKind = "confirm" | "remind" | "thanks";
type Audience = "checked-in" | "all";
interface Template { subject: string; body: string }

interface SenderIdentity {
  email: string;
  dnsVerified: boolean;
  mailboxVerified: boolean;
  /** Số lần bấm "Kiểm tra xác thực" (mô phỏng). */
  checks: number;
  /** Lần gửi thư xác minh gần nhất — gửi lại cách nhau ít nhất 60 giây. */
  sentAt: number;
}

/** Dữ liệu cấp tài khoản, dùng lại cho mọi sự kiện. */
interface AccountEmail {
  identities: SenderIdentity[];
}

/** Cấu hình theo sự kiện. */
interface EventEmailConfig {
  mode: "netevent" | "custom";
  fromEmail: string | null;
  automations: Record<EmailKind, boolean>;
  thanksAudience: Audience;
  templates: Record<EmailKind, Template>;
  testSends: number[];
}

const isReady = (i?: SenderIdentity) => !!i && i.dnsVerified && i.mailboxVerified;

const KIND_LABEL: Record<EmailKind, string> = {
  confirm: "Xác nhận đăng ký",
  remind:  "Nhắc lịch",
  thanks:  "Cảm ơn",
};

const AUDIENCE_LABEL: Record<Audience, string> = {
  "checked-in": "Người đã check-in",
  all:          "Tất cả đăng ký hợp lệ",
};

/** Chỉ các biến hệ thống thực sự điền được. */
const VARIABLES = [
  { key: "ten_nguoi_tham_du", label: "Tên người tham dự" },
  { key: "ten_su_kien",       label: "Tên sự kiện" },
  { key: "gio_bat_dau",       label: "Giờ bắt đầu" },
  { key: "gio_ket_thuc",      label: "Giờ kết thúc" },
  { key: "mui_gio",           label: "Múi giờ" },
  { key: "dia_diem",          label: "Địa điểm / link tham gia" },
  { key: "link_ve",           label: "Link vé" },
];
const VAR_KEYS = VARIABLES.map((v) => v.key);
const VAR_RE = /\{\{\s*([^{}]*?)\s*\}\}/g;
const URL_RE = /^https?:\/\/\S+$/i;
// Link trong nội dung: [chữ hiển thị](https://…) hoặc URL trần.
const LINK_RE = /\[([^\]\n]+)\]\((https?:\/\/[^\s)]+)\)|(https?:\/\/[^\s)]+)/g;

const DEFAULT_TEMPLATES: Record<EmailKind, Template> = {
  confirm: {
    subject: "Xác nhận đăng ký: {{ten_su_kien}}",
    body: "Chào {{ten_nguoi_tham_du}},\n\nĐăng ký tham dự {{ten_su_kien}} của bạn đã được xác nhận.\n\nThời gian: {{gio_bat_dau}} – {{gio_ket_thuc}} ({{mui_gio}})\nĐịa điểm: {{dia_diem}}\n\nVé QR của bạn: {{link_ve}}\n\nHẹn gặp bạn tại sự kiện!",
  },
  remind: {
    subject: "Nhắc lịch: {{ten_su_kien}} bắt đầu sau 24 giờ",
    body: "Chào {{ten_nguoi_tham_du}},\n\n{{ten_su_kien}} sẽ bắt đầu lúc {{gio_bat_dau}} ({{mui_gio}}).\nĐịa điểm: {{dia_diem}}\n\nNhớ mang theo vé QR để check-in nhanh hơn: {{link_ve}}",
  },
  thanks: {
    subject: "Cảm ơn bạn đã tham dự {{ten_su_kien}}",
    body: "Chào {{ten_nguoi_tham_du}},\n\nCảm ơn bạn đã dành thời gian tham dự {{ten_su_kien}}. Hy vọng bạn đã có những trải nghiệm đáng nhớ.\n\nHẹn gặp lại bạn ở các sự kiện tiếp theo!",
  },
};

const initAccount = (): AccountEmail => ({ identities: [] });

const initConfig = (): EventEmailConfig => ({
  mode: "netevent",
  fromEmail: null,
  automations: { confirm: true, remind: false, thanks: false },
  thanksAudience: "checked-in",
  templates: DEFAULT_TEMPLATES,
  testSends: [],
});

// ── Helpers ──────────────────────────────────────────────────────────────────

function useStored<V extends object>(key: string, init: () => V): [V, React.Dispatch<React.SetStateAction<V>>] {
  const [value, setValue] = useState<V>(() => {
    try {
      const raw = localStorage.getItem(key);
      return raw ? { ...init(), ...(JSON.parse(raw) as V) } : init();
    } catch {
      return init();
    }
  });
  useEffect(() => {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* bộ nhớ bị chặn — chỉ giữ trong phiên */ }
  }, [key, value]);
  return [value, setValue];
}

/** Đồng hồ cho bộ đếm "Gửi lại sau …". */
function useNow(ms = 1000) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), ms);
    return () => window.clearInterval(id);
  }, [ms]);
  return now;
}

const usedVars = (text: string) => Array.from(text.matchAll(VAR_RE), (m) => m[1]);
const unknownVars = (text: string) => [...new Set(usedVars(text).filter((v) => !VAR_KEYS.includes(v)))];
const varList = (vars: string[]) => vars.map((v) => `{{${v}}}`).join(", ");
const lowerFirst = (s: string) => s.charAt(0).toLowerCase() + s.slice(1);

function templateErrors(t: Template) {
  const errors: { subject?: string; body?: string } = {};
  const subject = t.subject.trim();
  const badSubject = unknownVars(t.subject);
  const badBody = unknownVars(t.body);
  if (!subject) errors.subject = "Nhập tiêu đề email.";
  else if (subject.length > 150) errors.subject = "Tiêu đề tối đa 150 ký tự.";
  else if (badSubject.length) errors.subject = `Biến không hợp lệ: ${varList(badSubject)}.`;
  if (!t.body.trim()) errors.body = "Nhập nội dung email.";
  else if (badBody.length) errors.body = `Biến không hợp lệ: ${varList(badBody)}. Chọn biến trong danh sách bên dưới.`;
  return errors;
}

/** Biến cần dữ liệu mà sự kiện chưa có — phải xử lý trước khi bật gửi. */
function missingData(t: Template, event: EventDraft) {
  const used = new Set(usedVars(`${t.subject}\n${t.body}`));
  const missing: string[] = [];
  if ((used.has("gio_bat_dau") || used.has("gio_ket_thuc")) && !(event.startDate && event.startTime)) missing.push("thời gian");
  if (used.has("dia_diem") && event.format !== "online" && !event.location?.trim()) missing.push("địa điểm");
  return missing;
}

/** Dữ liệu minh họa cho xem trước và gửi thử — tên người nhận và link vé không có thật. */
function sampleValues(event: EventDraft): Record<string, string> {
  const start = shortDateVi(event.startDate) ?? "";
  const end = shortDateVi(event.endDate || event.startDate) ?? "";
  return {
    ten_nguoi_tham_du: "Nguyễn Văn A",
    ten_su_kien: event.name || "Sự kiện của bạn",
    gio_bat_dau: event.startTime ? `${event.startTime}, ${start}` : "(chưa có)",
    gio_ket_thuc: event.endTime ? `${event.endTime}, ${end}` : "(chưa có)",
    mui_gio: "GMT+7",
    dia_diem: event.format === "online" ? "https://meet.netevent.vn/minh-hoa" : (event.location?.trim() || "(chưa có địa điểm)"),
    link_ve: "https://netevent.vn/ve/MINH-HOA",
  };
}

const fill = (text: string, values: Record<string, string>) =>
  text.replace(VAR_RE, (whole, key: string) => values[key] ?? whole);

/** Xem trước: hiện link trong nội dung như link thật. */
function renderLinks(text: string) {
  const parts: React.ReactNode[] = [];
  let last = 0;
  for (const m of text.matchAll(LINK_RE)) {
    const at = m.index ?? 0;
    if (at > last) parts.push(text.slice(last, at));
    const href = m[2] ?? m[3];
    parts.push(
      <a key={at} href={href} target="_blank" rel="noreferrer" style={{ color: T.primary, textDecoration: "underline" }}>
        {m[1] ?? m[3]}
      </a>,
    );
    last = at + m[0].length;
  }
  if (last < text.length) parts.push(text.slice(last));
  return parts;
}

/** Thời điểm gửi. "Đăng ký thành công" theo nghiệp vụ: có duyệt / thanh toán thì chỉ gửi khi đã đủ điều kiện. */
function whenOf(kind: EmailKind, event: EventDraft) {
  if (kind === "remind") return "Trước giờ bắt đầu 24 tiếng";
  if (kind === "thanks") return "Sau khi kết thúc 1 tiếng";
  const approval = event.requireApproval;
  const paid = Number(event.ticketPrice || 0) > 0;
  if (approval && paid) return "Khi đăng ký được duyệt và thanh toán xong";
  if (approval) return "Khi ban tổ chức duyệt đăng ký";
  if (paid) return "Khi thanh toán được xác nhận";
  return "Khi đăng ký được xác nhận";
}

function dnsRecords(domain: string) {
  return [
    { type: "CNAME", host: `em7421.${domain}`,         value: "u7421.wl.mail.netevent.vn" },
    { type: "CNAME", host: `ne1._domainkey.${domain}`, value: "ne1.dkim.mail.netevent.vn" },
    { type: "TXT",   host: `_dmarc.${domain}`,         value: "v=DMARC1; p=none;" },
  ];
}

const copy = (v: string) => { navigator.clipboard?.writeText(v).then(() => toast("Đã sao chép"), () => {}); };

// ── Card ─────────────────────────────────────────────────────────────────────

export function EmailSettingsCard({ event, organizerName }: { event: EventDraft; organizerName: string }) {
  const [config, setConfig]   = useStored<EventEmailConfig>(`netevent_email_v2_${event.id}`, initConfig);
  const [account, setAccount] = useStored<AccountEmail>(ACCOUNT_KEY, initAccount);
  const [senderOpen, setSenderOpen]     = useState(false);
  const [senderPreset, setSenderPreset] = useState<EventEmailConfig["mode"] | undefined>();
  const [editing, setEditing]           = useState<EmailKind | null>(null);
  const openSender = (preset?: EventEmailConfig["mode"]) => { setSenderPreset(preset); setSenderOpen(true); };

  const custom = config.mode === "custom" && !!config.fromEmail;
  const from = custom ? config.fromEmail! : NETEVENT_FROM;
  // Thư trả lời về chính email riêng; gửi bằng email NetEvent thì về email tài khoản.
  const replyTo = custom ? config.fromEmail! : ACCOUNT_EMAIL;
  // Địa chỉ riêng đang chờ xác thực hiển thị tách khỏi cấu hình đang chạy.
  const pending = account.identities.find((i) => !isReady(i) && i.email !== config.fromEmail);
  const recentTests = config.testSends.filter((t) => Date.now() - t < HOUR);
  const testBlock = recentTests.length >= 5 ? "Đã đạt giới hạn 5 lần gửi thử mỗi giờ." : "";

  const toggle = (k: EmailKind, on: boolean) => {
    const label = KIND_LABEL[k].toLowerCase();
    if (on) {
      const missing = missingData(config.templates[k], event);
      if (missing.length) {
        toast.error(`Chưa bật được email ${label}`, {
          description: `Sự kiện chưa có ${missing.join(" và ")}. Cập nhật sự kiện hoặc bỏ biến tương ứng trong nội dung.`,
        });
        return;
      }
    }
    setConfig((c) => ({ ...c, automations: { ...c.automations, [k]: on } }));
    toast(on ? `Đã bật email ${label}` : `Đã tắt email ${label}`, {
      description: on
        ? (k === "confirm" ? "Áp dụng cho các đăng ký được xác nhận từ bây giờ." : "Không gửi bù cho các mốc đã qua.")
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
      <h3 style={{ fontSize: T.base, fontWeight: T.fw_semi, color: T.foreground }}>Cấu hình email</h3>
      <p style={{ fontSize: T.xs, color: T.mutedFg, lineHeight: 1.6, marginTop: 4 }}>
        Email tự động gửi cho người tham dự.
      </p>

      {/* Người gửi: một dòng tóm tắt, bấm để thiết lập */}
      <button type="button" onClick={() => openSender()} title="Thiết lập người gửi"
        className="mt-4 w-full rounded-xl px-3 py-2.5 flex items-center gap-3 text-left cursor-pointer transition-opacity hover:opacity-85"
        style={{ backgroundColor: T.secondary }}>
        <span className="flex-1 min-w-0">
          <span className="block" style={{ fontSize: T.xs, color: T.mutedFg }}>Người gửi</span>
          <span className="block truncate" style={{ fontSize: T.sm, fontWeight: T.fw_medium, color: T.foreground }}>{organizerName}</span>
          <span className="block truncate" style={{ fontSize: T.xs, color: T.mutedFg }}>{from}</span>
        </span>
        <ChevronRight className="size-4 shrink-0" style={{ color: T.mutedFg }} />
      </button>
      {pending ? (
        <p className="mt-2 flex items-center gap-1.5 min-w-0" style={{ fontSize: T.xs, color: T.warningText }}>
          <Clock className="size-3.5 shrink-0" />
          <span className="truncate">{pending.email} đang chờ xác thực</span>
        </p>
      ) : config.mode === "netevent" && (
        <div className="mt-2"><LinkButton onClick={() => openSender("custom")}>Dùng email của tôi</LinkButton></div>
      )}

      {/* Email tự động: bấm vào hàng để sửa nội dung */}
      <div className="mt-3 flex flex-col">
        {(["confirm", "remind", "thanks"] as const).map((k, i) => (
          <div key={k} className="flex items-center gap-3 py-2" style={{ borderTop: i === 0 ? "none" : `1px solid ${T.border}` }}>
            <button type="button" onClick={() => setEditing(k)} title="Chỉnh nội dung"
              className="flex-1 min-w-0 text-left rounded-xl -mx-2 px-2 py-1 cursor-pointer transition-colors hover:bg-[var(--secondary)]">
              <span className="flex items-center gap-1.5" style={{ fontSize: T.sm, fontWeight: T.fw_medium, color: T.foreground }}>
                {KIND_LABEL[k]} <Pencil className="size-3" style={{ color: T.mutedFg }} />
              </span>
              <span className="block truncate" style={{ fontSize: T.xs, color: T.mutedFg, marginTop: 2 }}>
                {whenOf(k, event)}{k === "thanks" ? ` · ${AUDIENCE_LABEL[config.thanksAudience]}` : ""}
              </span>
            </button>
            <Switch className="shrink-0" aria-label={`Email ${KIND_LABEL[k].toLowerCase()}`}
              checked={config.automations[k]} onCheckedChange={(v) => toggle(k, v)} />
          </div>
        ))}
      </div>

      {editing && (
        <TemplateSheet kind={editing} event={event} config={config} from={from} testBlock={testBlock}
          senderName={organizerName} replyTo={replyTo}
          onChangeSender={openSender}
          onAudience={(a) => setConfig((c) => ({ ...c, thanksAudience: a }))}
          onSave={(t) => setConfig((c) => ({ ...c, templates: { ...c.templates, [editing]: t } }))}
          onTest={() => sendTest(editing)} onClose={() => setEditing(null)} />
      )}
      {/* Render sau drawer nội dung: mở từ "Chỉnh nội dung" thì chồng lên trên,
          đóng lại vẫn giữ nguyên nội dung đang soạn. */}
      {senderOpen && (
        <SenderSheet config={config} account={account} setAccount={setAccount} initialMode={senderPreset}
          onSave={(next) => { setConfig((c) => ({ ...c, ...next })); toast.success("Đã cập nhật người gửi cho sự kiện này."); }}
          onClose={() => setSenderOpen(false)} />
      )}
    </div>
  );
}

// ── Thiết lập người gửi ──────────────────────────────────────────────────────

function SenderSheet({ config, account, setAccount, initialMode, onSave, onClose }: {
  config: EventEmailConfig;
  account: AccountEmail;
  setAccount: React.Dispatch<React.SetStateAction<AccountEmail>>;
  /** Mở sẵn một chế độ, vd. "custom" khi bấm "Dùng email của tôi". */
  initialMode?: EventEmailConfig["mode"];
  onSave: (next: Pick<EventEmailConfig, "mode" | "fromEmail">) => void;
  onClose: () => void;
}) {
  const now = useNow();
  const latest = account.identities[account.identities.length - 1];
  const [mode, setMode]       = useState(initialMode ?? config.mode);
  const [email, setEmail]     = useState(config.fromEmail ?? latest?.email ?? "");
  const [showDns, setShowDns] = useState(false);

  const addr = norm(email);
  const domain = addr.split("@")[1] ?? "";
  const provider = isEmail(addr) ? PUBLIC_PROVIDERS[domain] : undefined;
  const identity = account.identities.find((i) => i.email === addr);
  const ready = isReady(identity);

  const patchIdentity = (next: SenderIdentity) =>
    setAccount((a) => ({ ...a, identities: a.identities.map((i) => (i.email === next.email ? next : i)) }));
  // Địa chỉ mới luôn là một yêu cầu xác minh mới, không kế thừa trạng thái của địa chỉ khác.
  const startVerification = () => {
    setAccount((a) => ({ ...a, identities: [...a.identities,
      { email: addr, dnsVerified: false, mailboxVerified: false, checks: 0, sentAt: Date.now() }] }));
    toast(`Đã gửi thư xác minh tới ${addr}`);
  };
  const checkIdentity = (i: SenderIdentity) => {
    // Mô phỏng: lần đầu hộp thư đã xác minh nhưng bản ghi DNS chưa cập nhật; lần sau thì xong.
    const next = { ...i, checks: i.checks + 1, mailboxVerified: true, dnsVerified: i.dnsVerified || i.checks + 1 >= 2 };
    patchIdentity(next);
    if (isReady(next)) toast.success(`${i.email} đã sẵn sàng sử dụng`);
  };
  const resend = (i: SenderIdentity) => {
    patchIdentity({ ...i, sentAt: Date.now() });
    toast(`Đã gửi lại thư xác minh tới ${i.email}`);
  };
  const wait = identity ? Math.min(60, Math.max(0, 60 - Math.floor((now - identity.sentAt) / 1000))) : 0;

  const fromError = mode !== "custom" ? ""
    : !isEmail(addr) ? "Nhập email gửi của tổ chức."
    : provider ? `NetEvent chưa hỗ trợ gửi từ tài khoản ${provider} cá nhân.`
    : !ready ? "Xác thực email gửi trước khi lưu." : "";
  const dirty = mode !== config.mode || (mode === "custom" && addr !== config.fromEmail);

  const save = () => {
    if (fromError || !dirty) return;
    onSave({ mode, fromEmail: mode === "custom" ? addr : null });
    onClose();
  };

  return (
    <Sheet open onOpenChange={(o) => !o && onClose()}>
      <SheetContent className="p-0 flex flex-col gap-0 sm:max-w-[440px]">
        <div className="px-5 py-4 pr-12" style={{ borderBottom: `1px solid ${T.border}` }}>
          <SheetTitle style={{ fontSize: T.base, fontWeight: T.fw_semi, color: T.foreground }}>Thiết lập người gửi</SheetTitle>
          <SheetDescription style={{ fontSize: T.xs, color: T.mutedFg, marginTop: 2 }}>
            Chọn địa chỉ dùng để gửi email cho người tham dự.
          </SheetDescription>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-5 flex flex-col gap-2" role="radiogroup" aria-label="Gửi từ">
          <RadioRow on={mode === "netevent"} onClick={() => setMode("netevent")} title="Email NetEvent" sub={NETEVENT_FROM} />
          <RadioRow on={mode === "custom"} onClick={() => setMode("custom")} title="Email của tôi"
            sub={mode === "custom" ? undefined : "Địa chỉ thuộc tên miền của tổ chức"} />
          {/* Ô nhập chỉ hiện khi chọn "Email của tôi" */}
          {mode === "custom" && (
            <div className="flex flex-col gap-2 pl-7">
              <Input type="email" value={email} placeholder="events@tochuc.vn" aria-label="Email gửi"
                onChange={(e) => { setEmail(e.target.value); setShowDns(false); }} />
              {provider ? (
                <Notice>
                  NetEvent chưa hỗ trợ gửi từ tài khoản {provider} cá nhân. Hãy dùng email thuộc tên miền của tổ chức.
                </Notice>
              ) : ready ? (
                <p className="flex items-center gap-1.5" style={{ fontSize: T.xs, color: T.successText }}>
                  <CheckCircle2 className="size-3.5" /> Đã xác thực, sẵn sàng sử dụng
                </p>
              ) : identity ? (
                <div className="rounded-xl p-3 flex flex-col gap-2.5" style={{ backgroundColor: T.secondary }}>
                  <Step ok={identity.dnsVerified} label={`Tên miền ${domain}`}
                    action={!identity.dnsVerified && (
                      <LinkButton onClick={() => setShowDns((v) => !v)}>{showDns ? "Ẩn bản ghi" : "Xem bản ghi DNS"}</LinkButton>
                    )} />
                  {showDns && !identity.dnsVerified && (
                    <div className="flex flex-col gap-1.5">
                      {dnsRecords(domain).map((r) => <DnsRecord key={r.host} {...r} />)}
                    </div>
                  )}
                  <Step ok={identity.mailboxVerified} label="Hộp thư"
                    action={!identity.mailboxVerified && (
                      <LinkButton disabled={wait > 0} onClick={() => resend(identity)}>
                        {wait > 0 ? `Gửi lại sau ${wait}s` : "Gửi lại thư xác minh"}
                      </LinkButton>
                    )} />
                  {identity.checks > 0 && !identity.dnsVerified && (
                    <p style={{ fontSize: T.xs, color: T.warningText, lineHeight: 1.5 }}>
                      Tên miền chưa được xác thực. Hoàn tất hướng dẫn hoặc nhờ người quản trị tên miền hỗ trợ.
                    </p>
                  )}
                  <Button size="sm" variant="outline" className="self-start" onClick={() => checkIdentity(identity)}>
                    Kiểm tra xác thực
                  </Button>
                </div>
              ) : isEmail(addr) ? (
                <Button size="sm" variant="outline" className="self-start" onClick={startVerification}>
                  Xác thực địa chỉ này
                </Button>
              ) : null}
            </div>
          )}
        </div>

        <div className="px-5 py-4 flex flex-col gap-2" style={{ borderTop: `1px solid ${T.border}` }}>
          {dirty && fromError && <p style={{ fontSize: T.xs, color: T.warningText }}>{fromError}</p>}
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>Hủy</Button>
            <Button disabled={!dirty || !!fromError} onClick={save}>Lưu thay đổi</Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

// ── Chỉnh nội dung ───────────────────────────────────────────────────────────

function TemplateSheet({ kind, event, config, from, senderName, replyTo, testBlock, onChangeSender, onAudience, onSave, onTest, onClose }: {
  kind: EmailKind; event: EventDraft; config: EventEmailConfig; from: string; senderName: string; replyTo: string; testBlock: string;
  onChangeSender: (preset?: EventEmailConfig["mode"]) => void;
  onAudience: (a: Audience) => void;
  onSave: (t: Template) => void; onTest: () => void; onClose: () => void;
}) {
  const saved = config.templates[kind];
  const [subject, setSubject] = useState(saved.subject);
  const [body, setBody]       = useState(saved.body);
  const [view, setView]       = useState<"edit" | "preview">("edit");
  // Vị trí con trỏ trong ô nội dung, để chèn biến đúng chỗ.
  const [caret, setCaret]     = useState<number | null>(null);

  const errors = templateErrors({ subject, body });
  const hasErrors = !!(errors.subject || errors.body);
  const dirty = subject !== saved.subject || body !== saved.body;
  const isDefault = subject === DEFAULT_TEMPLATES[kind].subject && body === DEFAULT_TEMPLATES[kind].body;
  const values = sampleValues(event);
  // Gửi thử chỉ dùng nội dung đã lưu.
  const testReason = dirty ? "Lưu nội dung trước khi gửi thử." : testBlock;

  const insertText = (token: string) => {
    // Chưa đặt con trỏ trong ô nội dung thì chèn vào cuối, cách chữ đứng trước một khoảng.
    const at = caret ?? body.length;
    const sep = caret === null && body && !/\s$/.test(body) ? " " : "";
    setBody(body.slice(0, at) + sep + token + body.slice(at));
    setCaret(at + sep.length + token.length);
  };

  const [linkOpen, setLinkOpen] = useState(false);
  const [linkText, setLinkText] = useState("");
  const [linkUrl, setLinkUrl]   = useState("");
  const urlOk = URL_RE.test(linkUrl.trim());
  const insertLink = () => {
    if (!urlOk) return;
    const text = linkText.trim();
    insertText(text ? `[${text}](${linkUrl.trim()})` : linkUrl.trim());
    setLinkOpen(false); setLinkText(""); setLinkUrl("");
  };

  return (
    <Sheet open onOpenChange={(o) => !o && onClose()}>
      <SheetContent className="p-0 flex flex-col gap-0 sm:max-w-[520px]">
        <div className="px-5 py-4 pr-12" style={{ borderBottom: `1px solid ${T.border}` }}>
          <SheetTitle style={{ fontSize: T.base, fontWeight: T.fw_semi, color: T.foreground }}>
            Chỉnh nội dung · {KIND_LABEL[kind]}
          </SheetTitle>
          <SheetDescription style={{ fontSize: T.xs, color: T.mutedFg, marginTop: 2 }}>
            Gửi {lowerFirst(whenOf(kind, event))}.
          </SheetDescription>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-4">
          {/* Người gửi dùng chung cho cả ba email — đổi ngay tại đây */}
          <div className="flex items-center gap-2 min-w-0" style={{ fontSize: T.xs }}>
            <span className="shrink-0" style={{ color: T.mutedFg }}>Từ</span>
            <span className="flex-1 min-w-0 truncate" title={`${senderName} <${from}>`} style={{ color: T.foreground }}>
              {senderName} &lt;{from}&gt;
            </span>
            <LinkButton onClick={() => onChangeSender(config.mode === "netevent" ? "custom" : undefined)}>
              {config.mode === "netevent" ? "Dùng email của tôi" : "Đổi"}
            </LinkButton>
          </div>
          {/* Email cảm ơn phải cho thấy nhóm nhận */}
          {kind === "thanks" && (
            <div className="flex items-center gap-2">
              <span className="shrink-0" style={{ fontSize: T.xs, color: T.mutedFg }}>Gửi cho</span>
              <Select value={config.thanksAudience} onValueChange={(v) => onAudience(v as Audience)}>
                <SelectTrigger className="h-8 flex-1 min-w-0 cursor-pointer" style={{ fontSize: T.xs }}><SelectValue /></SelectTrigger>
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
                  <Label htmlFor="tpl-subject">Tiêu đề</Label>
                  <span style={{ fontSize: T.xs, color: subject.trim().length > 150 ? T.destructive : T.mutedFg }}>
                    {subject.trim().length}/150
                  </span>
                </div>
                <Input id="tpl-subject" value={subject} aria-invalid={!!errors.subject}
                  onChange={(e) => setSubject(e.target.value)} />
                {errors.subject && <FieldError>{errors.subject}</FieldError>}
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="tpl-body">Nội dung</Label>
                <Textarea id="tpl-body" rows={10} value={body} aria-invalid={!!errors.body}
                  onChange={(e) => { setBody(e.target.value); setCaret(e.target.selectionStart); }}
                  onSelect={(e) => setCaret(e.currentTarget.selectionStart)} />
                {errors.body && <FieldError>{errors.body}</FieldError>}
              </div>
              <div className="flex flex-wrap gap-1.5">
                {VARIABLES.map((v) => (
                  <button key={v.key} type="button" title={`Chèn {{${v.key}}}`} onClick={() => insertText(`{{${v.key}}}`)}
                    className="inline-flex items-center gap-1 h-7 px-2.5 cursor-pointer transition-colors hover:bg-[var(--secondary)]"
                    style={{ fontSize: T.xs, color: T.foreground, border: `1px solid ${T.border}` }}>
                    <Plus className="size-3" /> {v.label}
                  </button>
                ))}
                <Popover open={linkOpen} onOpenChange={setLinkOpen}>
                  <PopoverTrigger asChild>
                    <button type="button"
                      className="inline-flex items-center gap-1 h-7 px-2.5 cursor-pointer transition-colors hover:bg-[var(--secondary)]"
                      style={{ fontSize: T.xs, fontWeight: T.fw_medium, color: T.primary, border: `1px solid ${T.border}` }}>
                      <Link2 className="size-3" /> Chèn link
                    </button>
                  </PopoverTrigger>
                  <PopoverContent align="start" className="w-72 flex flex-col gap-3">
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
                  <p style={{ fontSize: T.sm, color: T.foreground, lineHeight: 1.7, whiteSpace: "pre-wrap" }}>{renderLinks(fill(body, values))}</p>
                </div>
              </div>
              <p style={{ fontSize: T.xs, color: T.mutedFg }}>
                Dữ liệu minh họa — tên người tham dự và link vé không phải dữ liệu thật.
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

function RadioRow({ on, onClick, title, sub }: { on: boolean; onClick: () => void; title: string; sub?: string }) {
  return (
    <button type="button" role="radio" aria-checked={on} onClick={onClick}
      className="flex items-center gap-3 w-full text-left rounded-xl px-3 py-2.5 cursor-pointer transition-colors"
      style={{ border: `1px solid ${on ? T.primary : T.border}`, backgroundColor: on ? "rgba(30,170,255,0.05)" : T.background }}>
      <span className="size-4 rounded-full shrink-0 flex items-center justify-center"
        style={{ border: `1.5px solid ${on ? T.primary : T.border}` }}>
        {on && <span className="size-2 rounded-full" style={{ backgroundColor: T.primary }} />}
      </span>
      <span className="flex-1 min-w-0">
        <span className="block" style={{ fontSize: T.sm, fontWeight: T.fw_medium, color: T.foreground }}>{title}</span>
        {sub && <span className="block truncate" style={{ fontSize: T.xs, color: T.mutedFg }}>{sub}</span>}
      </span>
    </button>
  );
}

function Step({ ok, label, action }: { ok: boolean; label: string; action?: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2 min-w-0">
      {ok
        ? <CheckCircle2 className="size-4 shrink-0" style={{ color: T.successText }} />
        : <Clock className="size-4 shrink-0" style={{ color: T.warningText }} />}
      <span className="truncate" style={{ fontSize: T.sm, color: T.foreground }}>{label}</span>
      <span className="shrink-0" style={{ fontSize: T.xs, color: ok ? T.successText : T.mutedFg }}>
        {ok ? "Đã xác thực" : "Chưa xác thực"}
      </span>
      {action && <span className="ml-auto shrink-0">{action}</span>}
    </div>
  );
}

function DnsRecord({ type, host, value }: { type: string; host: string; value: string }) {
  return (
    <div className="rounded-lg px-3 py-2 flex items-center gap-2" style={{ backgroundColor: T.background, border: `1px solid ${T.border}` }}>
      <span className="shrink-0" style={{ width: 40, fontSize: 10, fontWeight: T.fw_semi, color: T.mutedFg }}>{type}</span>
      <div className="flex-1 min-w-0 font-mono" style={{ fontSize: 11, lineHeight: 1.5 }}>
        <p className="truncate" style={{ color: T.foreground }} title={host}>{host}</p>
        <p className="truncate" style={{ color: T.mutedFg }} title={value}>{value}</p>
      </div>
      <button type="button" aria-label={`Sao chép giá trị bản ghi ${type}`} onClick={() => copy(value)}
        className="size-7 shrink-0 flex items-center justify-center cursor-pointer transition-colors hover:bg-[var(--secondary)]"
        style={{ color: T.mutedFg }}>
        <Copy className="size-3.5" />
      </button>
    </div>
  );
}

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

function Notice({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-xl p-3 flex gap-2" style={{ backgroundColor: T.warningSubtle, border: `1px solid ${T.warningBorder}` }}>
      <AlertTriangle className="size-4 shrink-0" style={{ color: T.warningText }} />
      <div className="flex-1 min-w-0" style={{ fontSize: T.xs, color: T.warningText, lineHeight: 1.5 }}>{children}</div>
    </div>
  );
}

function FieldError({ children }: { children: React.ReactNode }) {
  return <p style={{ fontSize: T.xs, color: T.destructive }}>{children}</p>;
}

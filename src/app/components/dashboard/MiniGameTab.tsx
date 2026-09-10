import * as React from "react";
import { useState, useEffect, useRef, useMemo } from "react";
import {
  ChevronLeft, Plus, Trophy, Users, Lock,
  Play, RotateCcw, CheckCircle2, BarChart3,
  Download, Search, Check, X, AlertCircle,
  Maximize2, Award, Trash2, UserCheck, Gamepad2,
  ClipboardList, Minimize2, Zap, Settings,
  ChevronDown, Pencil, Upload, Info, SlidersHorizontal, CalendarCheck, ArrowRight, MoreHorizontal, ExternalLink
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Checkbox } from "../ui/checkbox";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "../ui/collapsible";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { cn } from "../ui/utils";
import { Sheet, SheetContent, SheetDescription, SheetTitle } from "../ui/sheet";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { publishDraw } from "../../data/drawSync";

// ── Design tokens ─────────────────────────────────────────────────────────────

const T = {
  pageSurface:   "var(--page-surface)",
  background:    "var(--background)",
  foreground:    "var(--foreground)",
  border:        "var(--border)",
  primary:       "var(--primary)",
  primaryFg:     "var(--primary-foreground)",
  secondary:     "var(--secondary)",
  muted:         "var(--muted)",
  mutedFg:       "var(--muted-foreground)",
  destructive:   "var(--destructive)",
  successSubtle: "var(--success-subtle)",
  successBorder: "var(--success-border)",
  successText:   "var(--success-text)",
  warningSubtle: "var(--warning-subtle)",
  warningBorder: "var(--warning-border)",
  warningText:   "var(--warning-text)",
  fw_normal: "var(--font-weight-normal)",
  fw_medium: "var(--font-weight-medium)",
  fw_semi:   "var(--font-weight-semibold)",
  fw_bold:   "var(--font-weight-bold)",
  xs:   "var(--text-xs)",
  sm:   "var(--text-sm)",
  base: "var(--text-base)",
  lg:   "var(--text-lg)",
  xl:   "var(--text-xl)",
  "2xl":"var(--text-2xl)",
};

// ── Types ─────────────────────────────────────────────────────────────────────

type MgStatus = "draft" | "ready" | "scheduled" | "live" | "paused" | "ended";
type MgView   = "list" | "setup" | "manage" | "operate";
type WinnerDisplay = "full" | "partial" | "code";

// Hạng vé là bộ lọc trên danh sách sự kiện chứ không phải một nguồn riêng, nên
// ghép được "đã check-in" với "Vé VIP" — điều giao diện cũ không diễn đạt được.
interface Audience {
  source: "event" | "upload";
  /** Chỉ dùng khi source = "event". */
  scope: "checkedIn" | "registered";
  /** Rỗng = tất cả hạng vé. */
  tiers: string[];
  /** Tên file khi source = "upload"; null = chưa tải lên. */
  fileName: string | null;
}

interface TierCount { tier: string; checkedIn: number; registered: number }

interface Prize {
  id: string;
  rank: string;
  name: string;
  count: number;
  remaining: number;
  status: "pending" | "active" | "done";
}

/** Một lượt quay đã ghi nhận — kết quả tự lưu, không có bước xác nhận riêng. */
interface SpinResult {
  id: string; time: string;
  prizeId: string; prize: string;
  winner: string; ticketCode: string;
  operator: string;
}

interface MiniGame {
  id: string; name: string; description: string;
  status: MgStatus; participantSource: string;
  eligibleCount: number; lockedCount: number;
  prizeCount: number; winnerCount: number; deliveredCount: number;
  startTime: string; endTime: string;
  /** Cấu hình từ màn "Tạo bốc thăm may mắn". Chương trình mẫu (MOCK_GAME) không có. */
  setup?: DrawSetup;
  /** Giờ hệ thống chốt danh sách = lúc bấm "Bắt đầu quay" lần đầu. Chưa có = chưa quay. */
  lockedAt?: string;
  results?: SpinResult[];
}

interface DrawSetup {
  audience: Audience;
  prizes: Prize[];
  spinSeconds: number;
  winnerDisplay: WinnerDisplay;
  oncePerPerson: boolean;
}

// ── Mock data ─────────────────────────────────────────────────────────────────

// Số người theo hạng vé — cùng số với TIER_BREAKDOWN trong AttendeesTab.tsx
// (đã check-in 80 + 45 + 13 = 138, đăng ký 180 + 72 + 76 = 328) để hai tab khớp nhau.
const TIER_POOL: TierCount[] = [
  { tier: "Standard",   checkedIn: 80, registered: 180 },
  { tier: "VIP",        checkedIn: 45, registered: 72  },
  { tier: "Early Bird", checkedIn: 13, registered: 76  },
];

// Prototype chưa đọc file thật — giả lập số dòng hợp lệ trong file tải lên.
const UPLOAD_MOCK_COUNT = 120;

const DEFAULT_AUDIENCE: Audience = { source: "event", scope: "checkedIn", tiers: [], fileName: null };

const MOCK_GAME: MiniGame = {
  id: "mg1",
  name: "Bốc thăm may mắn — NetEvent Demo 2026",
  description: "Bốc thăm quà tặng dành cho người đã check-in tại sự kiện.",
  status: "live",
  participantSource: "Người đã check-in",
  eligibleCount: 138, lockedCount: 138,
  prizeCount: 5, winnerCount: 2, deliveredCount: 1,
  startTime: "18:00 · 29/06/2026",
  endTime: "20:00 · 29/06/2026",
  lockedAt: "18:14",
};

const MOCK_PRIZES: Prize[] = [
  { id: "p1", rank: "Giải nhất",        name: "iPhone 16 Pro Max",    count: 1, remaining: 0, status: "done" },
  { id: "p2", rank: "Giải nhì",         name: "Apple Watch Series 10",count: 2, remaining: 1, status: "active" },
  { id: "p3", rank: "Giải ba",          name: "AirPods Pro",          count: 3, remaining: 3, status: "pending" },
  { id: "p4", rank: "Giải khuyến khích",name: "Voucher 500K",         count: 5, remaining: 5, status: "pending" },
  { id: "p5", rank: "Giải may mắn",     name: "Sticker NetEvent",     count: 10,remaining: 10,status: "pending" },
];

// Hai lượt đã quay của chương trình mẫu — cùng nguồn với tiến độ giải
// (Giải nhất 1/1, Giải nhì 1/2), nên mọi màn đều ra 2 người thắng · 2/21 suất.
const MOCK_RESULTS: SpinResult[] = [
  { id: "r2", time: "18:32", prizeId: "p2", prize: "Giải nhì · Apple Watch Series 10", winner: "Trần Thị Cúc",    ticketCode: "NE-2025-00089", operator: "Trần Staff A" },
  { id: "r1", time: "18:15", prizeId: "p1", prize: "Giải nhất · iPhone 16 Pro Max",     winner: "Nguyễn Văn Bình", ticketCode: "NE-2025-00142", operator: "Trần Staff A" },
];

// Lịch sử trước khi quay của chương trình mẫu. Phần chốt danh sách và từng lượt
// quay dựng từ dữ liệu của chương trình (historyOf).
const MOCK_AUDIT_BASE = [
  { action: "Tạo chương trình bốc thăm", user: "Admin", time: "14:00 · 29/06" },
  { action: "Sửa giải thưởng",           user: "Admin", time: "14:25 · 29/06" },
  { action: "Lưu chương trình",          user: "Admin", time: "14:30 · 29/06" },
];

const POOL_NAMES = [
  "Nguyễn Văn Bình", "Trần Thị Cúc",  "Lê Minh Đức",  "Phạm Thị Hoa",
  "Đỗ Thị Lan",      "Bùi Thị Ngọc",  "Đinh Văn Phúc","Hoàng Văn An",
  "Vũ Thị Mai",      "Phan Quốc Huy",  "Lý Thị Thu",   "Trịnh Văn Nam",
];
const POOL_CODES = [
  "NE-2025-00142","NE-2025-00089","NE-2025-00201","NE-2025-00317",
  "NE-2025-00223","NE-2025-00415","NE-2025-00501","NE-2025-00612",
];

// Chương trình mẫu có từ trước màn thiết lập mới — dựng cấu hình tương đương để màn quay dùng chung.
const LEGACY_SETUP: DrawSetup = { audience: DEFAULT_AUDIENCE, prizes: MOCK_PRIZES, spinSeconds: 5, winnerDisplay: "full", oncePerPerson: true };

// ── Người tham gia & kiểm tra thiết lập ───────────────────────────────────────

/** Số người đủ điều kiện theo nguồn + bộ lọc hạng vé. */
function eligibleOf(a: Audience, pool: TierCount[]): number {
  if (a.source === "upload") return a.fileName ? UPLOAD_MOCK_COUNT : 0;
  return pool
    .filter(t => a.tiers.length === 0 || a.tiers.includes(t.tier))
    .reduce((n, t) => n + (a.scope === "checkedIn" ? t.checkedIn : t.registered), 0);
}

/** "Người đã check-in · Vé VIP" — dòng tóm tắt, chưa kèm số người. */
function audienceLabel(a: Audience): string {
  if (a.source === "upload") return a.fileName ? `Danh sách riêng · ${a.fileName}` : "Danh sách riêng";
  const scope = a.scope === "checkedIn" ? "Người đã check-in" : "Tất cả đăng ký hợp lệ";
  return a.tiers.length > 0 ? `${scope} · Vé ${a.tiers.join(", ")}` : scope;
}

/** Giải cũ có "Hạng giải" riêng; giải tạo mới chỉ có một tên. */
const prizeLabel = (p: Prize) => (p.rank ? `${p.rank} · ${p.name}` : p.name);

/** Số người danh sách phải có: trúng một lần thì cộng mọi giải, trúng nhiều lần thì chỉ cần đủ cho giải đông nhất. */
function winnersNeeded(prizes: Prize[], oncePerPerson: boolean): number {
  const counts = prizes.map(p => p.count || 0);
  return oncePerPerson ? counts.reduce((s, c) => s + c, 0) : Math.max(0, ...counts);
}

/** Những gì còn thiếu để mở màn hình quay (vẫn lưu nháp được). */
function setupIssues(s: DrawSetup) {
  return {
    uploadMissing: s.audience.source === "upload" && !s.audience.fileName,
    emptyPrizeIds: s.prizes.filter(p => !p.name.trim()).map(p => p.id),
  };
}

function isDrawReady(s: DrawSetup) {
  const i = setupIssues(s);
  return !i.uploadMissing && i.emptyPrizeIds.length === 0;
}

const WINNER_DISPLAY_LABELS: Record<WinnerDisplay, string> = {
  full:    "Họ tên + mã vé/mã tham gia",
  partial: "Họ tên rút gọn + 4 số cuối SĐT",
  code:    "Chỉ mã vé/mã tham gia",
};

/** Hai dòng hiển thị người thắng theo tùy chọn. Prototype: "4 số cuối SĐT" lấy tạm từ mã vé. */
function winnerLines(name: string, code: string, mode: WinnerDisplay): [string, string] {
  if (mode === "code") return [code, ""];
  if (mode === "partial") {
    const words = name.split(" ");
    const short = [...words.slice(0, -1).map(w => `${w.charAt(0)}.`), words[words.length - 1]].join(" ");
    return [short, code ? `SĐT ••••${code.slice(-4)}` : ""];
  }
  return [name, code];
}

const nowHHMM = () => new Date().toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" });

// ── Shared UI ─────────────────────────────────────────────────────────────────

function Card({ children, className, style }: { children: React.ReactNode; className?: string; style?: React.CSSProperties }) {
  return (
    <div className={cn("rounded-2xl p-5", className)}
      style={{ backgroundColor: T.background, border: `1px solid ${T.border}`, ...style }}>
      {children}
    </div>
  );
}

function BlockCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Card>
      <p style={{ fontSize: T.sm, fontWeight: T.fw_semi, color: T.foreground, marginBottom: 16 }}>{title}</p>
      {children}
    </Card>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p style={{ fontSize: T.xs, fontWeight: T.fw_semi, color: T.mutedFg, letterSpacing: "0.06em", textTransform: "uppercase" as const, marginBottom: 10 }}>
      {children}
    </p>
  );
}

/** Thông báo ngay tại trường liên quan — thay cho sidebar tóm tắt/checklist cũ. */
function InlineNotice({ tone, children }: { tone: "info" | "warning"; children: React.ReactNode }) {
  const c = tone === "warning"
    ? { color: T.warningText, bg: T.warningSubtle, border: T.warningBorder }
    : { color: T.mutedFg, bg: T.pageSurface, border: T.border };
  const Icon = tone === "warning" ? AlertCircle : Info;
  return (
    <div role="status" style={{ display: "flex", alignItems: "flex-start", gap: 8, padding: "10px 12px", borderRadius: 10, background: c.bg, border: `1px solid ${c.border}` }}>
      <Icon size={14} style={{ color: c.color, flexShrink: 0, marginTop: 2 } as React.CSSProperties} />
      <div style={{ flex: 1, minWidth: 0, fontSize: T.xs, lineHeight: 1.55, color: c.color }}>{children}</div>
    </div>
  );
}

/** Lỗi ngay dưới trường nhập (cùng kiểu với AuthFlow). */
function FieldError({ id, children }: { id?: string; children: React.ReactNode }) {
  return <p id={id} style={{ fontSize: T.xs, color: T.destructive, margin: "6px 0 0" }}>{children}</p>;
}

const STATUS_CFG: Record<MgStatus, { label: string; color: string; bg: string; border: string }> = {
  draft:     { label: "Bản nháp",      color: "#595959", bg: "#f3f4f6",              border: "#e5e7eb" },
  ready:     { label: "Chưa bắt đầu",  color: "#0369a1", bg: "#e0f2fe",              border: "#bae6fd" },
  scheduled: { label: "Đã lên lịch",   color: "#0369a1", bg: "#e0f2fe",              border: "#bae6fd" },
  live:      { label: "Đang diễn ra",  color: "#be123c", bg: "#fff1f2",              border: "#fecdd3" },
  paused:    { label: "Tạm dừng",      color: "#b45309", bg: "var(--warning-subtle)",border: "var(--warning-border)" },
  ended:     { label: "Hoàn tất",      color: "#15803d", bg: "var(--success-subtle)", border: "var(--success-border)" },
};

function StatusBadge({ status }: { status: MgStatus }) {
  const c = STATUS_CFG[status];
  return (
    <span style={{ fontSize: T.xs, fontWeight: T.fw_medium, padding: "2px 10px", borderRadius: "999px", color: c.color, background: c.bg, border: `1px solid ${c.border}` }}>
      {c.label}
    </span>
  );
}

// ── Tiến độ, người tham gia & xuất danh sách ──────────────────────────────────

const totalSlots = (prizes: Prize[]) => prizes.reduce((n, p) => n + p.count, 0);
const drawnSlots = (prizes: Prize[]) => prizes.reduce((n, p) => n + (p.count - p.remaining), 0);

/** Trạng thái suy ra từ dữ liệu, không lưu riêng: thiếu cấu hình → nháp; chưa quay → chưa bắt đầu; còn suất → đang diễn ra; hết suất → hoàn tất. */
function statusOf(g: MiniGame): MgStatus {
  const s = g.setup ?? LEGACY_SETUP;
  if (!isDrawReady(s)) return "draft";
  if (!g.lockedAt) return "ready";
  return s.prizes.some(p => p.remaining > 0) ? "live" : "ended";
}

/** Một cách đọc tiến độ cho mọi màn: "Đã quay 1/2 suất" kèm trạng thái của giải. */
function prizeProgress(p: Prize) {
  const drawn = p.count - p.remaining;
  if (drawn >= p.count) return { text: "Hoàn tất", color: T.successText, bg: T.successSubtle };
  if (drawn > 0) return { text: `Còn ${p.remaining} suất`, color: T.warningText, bg: T.warningSubtle };
  return { text: "Chưa quay", color: T.mutedFg, bg: T.secondary };
}

const SURNAMES = ["Nguyễn", "Trần", "Lê", "Phạm", "Hoàng", "Vũ", "Đặng", "Bùi", "Đỗ", "Ngô", "Dương", "Lý"];
const MIDDLES  = ["Văn", "Thị", "Minh", "Quốc", "Thu", "Ngọc", "Hữu", "Thanh"];
const GIVENS   = ["An", "Bình", "Cúc", "Dũng", "Đức", "Hà", "Hải", "Hoa", "Hùng", "Lan", "Linh", "Mai", "Nam", "Phúc", "Quân", "Thảo", "Trang", "Tú", "Vy", "Yến"];

interface Person { name: string; code: string; tier: string }

/** Danh sách minh hoạ đúng số người của chương trình, mã không trùng. Người đầu danh sách trùng dữ liệu mẫu nên khớp với người đã trúng. */
function participantsOf(count: number, tiers: string[] = []): Person[] {
  return Array.from({ length: Math.max(0, count) }, (_, i) => ({
    name: i < POOL_NAMES.length ? POOL_NAMES[i]
      : `${SURNAMES[i % SURNAMES.length]} ${MIDDLES[(i * 3) % MIDDLES.length]} ${GIVENS[(i * 7) % GIVENS.length]}`,
    code: i < POOL_CODES.length ? POOL_CODES[i] : `NE-2025-${String(1000 + i * 13).padStart(5, "0")}`,
    tier: tiers.length ? tiers[i % tiers.length] : i < 80 ? "Standard" : i < 125 ? "VIP" : "Early Bird",
  }));
}

/** Tải CSV người thắng theo thứ tự quay. */
function exportWinners(g: MiniGame) {
  const rows = [["Người thắng", "Mã tham gia", "Giải/phần quà", "Thời gian"],
    ...[...(g.results ?? [])].reverse().map(r => [r.winner, r.ticketCode, r.prize, r.time])];
  const csv = "﻿" + rows.map(r => r.map(v => `"${String(v).replace(/"/g, '""')}"`).join(",")).join("\n");
  const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
  const a = document.createElement("a");
  a.href = url; a.download = `nguoi-thang-${g.id}.csv`; a.click();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  toast.success("Đã xuất danh sách người thắng");
}

/** Lịch sử thao tác: phần chốt danh sách và từng lượt quay dựng từ dữ liệu của chương trình. */
function historyOf(g: MiniGame) {
  const rows = g.id === MOCK_GAME.id ? [...MOCK_AUDIT_BASE] : [{ action: "Tạo và lưu chương trình", user: "Bạn", time: "" }];
  if (g.lockedAt) rows.push({ action: `Tự động chốt danh sách khi bắt đầu quay (${g.lockedCount} người)`, user: "Hệ thống", time: g.lockedAt });
  [...(g.results ?? [])].reverse().forEach(r => rows.push({ action: `Quay ${r.prize}: ${r.winner}`, user: r.operator, time: r.time }));
  return rows;
}

const TH: React.CSSProperties = { padding: "10px 20px", textAlign: "left", fontSize: T.xs, fontWeight: T.fw_semi, color: T.mutedFg, whiteSpace: "nowrap" };
const TD: React.CSSProperties = { padding: "12px 20px", fontSize: T.sm, color: T.foreground };

function SideSheet({ open, onClose, title, description, children }: {
  open: boolean; onClose: () => void; title: string; description: string; children: React.ReactNode;
}) {
  return (
    <Sheet open={open} onOpenChange={o => !o && onClose()}>
      <SheetContent className="p-0 flex flex-col gap-0 sm:max-w-[460px]">
        <div className="px-5 py-4 pr-12" style={{ borderBottom: `1px solid ${T.border}` }}>
          <SheetTitle style={{ fontSize: T.base, fontWeight: T.fw_semi, color: T.foreground }}>{title}</SheetTitle>
          <SheetDescription style={{ fontSize: T.xs, color: T.mutedFg, marginTop: 2 }}>{description}</SheetDescription>
        </div>
        <div className="flex-1 overflow-y-auto px-5 py-4">{children}</div>
      </SheetContent>
    </Sheet>
  );
}

function PeopleList({ people }: { people: Person[] }) {
  const [q, setQ] = useState("");
  const query = q.trim().toLowerCase();
  const shown = query ? people.filter(p => p.name.toLowerCase().includes(query) || p.code.toLowerCase().includes(query)) : people;
  return (
    <div className="flex flex-col gap-3">
      <div style={{ position: "relative" }}>
        <Search size={13} style={{ position: "absolute", left: 11, top: "50%", transform: "translateY(-50%)", color: T.mutedFg } as React.CSSProperties} />
        <Input value={q} onChange={e => setQ(e.target.value)} placeholder="Tìm theo tên hoặc mã" aria-label="Tìm người tham gia" style={{ paddingLeft: 34 }} />
      </div>
      <p style={{ fontSize: T.xs, color: T.mutedFg, margin: 0 }}>{shown.length} người</p>
      <div className="flex flex-col">
        {shown.map(p => (
          <div key={p.code} className="flex items-center gap-3 py-2.5" style={{ borderBottom: `1px solid ${T.border}` }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p className="truncate" style={{ fontSize: T.sm, color: T.foreground, margin: 0 }}>{p.name}</p>
              <p style={{ fontSize: T.xs, color: T.mutedFg, margin: 0, fontFamily: "monospace" }}>{p.code}</p>
            </div>
            <span style={{ fontSize: T.xs, color: T.mutedFg, padding: "2px 8px", borderRadius: 999, border: `1px solid ${T.border}`, whiteSpace: "nowrap" }}>{p.tier}</span>
          </div>
        ))}
        {shown.length === 0 && <p style={{ fontSize: T.sm, color: T.mutedFg, padding: "24px 0", textAlign: "center" }}>Không tìm thấy người tham gia.</p>}
      </div>
    </div>
  );
}

function SettingsSummary({ game }: { game: MiniGame }) {
  const s = game.setup ?? LEGACY_SETUP;
  const rows: [string, React.ReactNode][] = [
    ["Người tham gia", `${audienceLabel(s.audience)} · ${game.lockedCount} người`],
    ["Chốt danh sách", game.lockedAt ? `Lúc ${game.lockedAt}, khi bắt đầu quay` : "Khi bắt đầu quay"],
    ["Giải thưởng", (
      <span style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        {s.prizes.map(p => <span key={p.id}>{prizeLabel(p)} · {p.count} suất</span>)}
      </span>
    )],
    ["Thời gian quay", `${s.spinSeconds} giây`],
    ["Hiển thị người thắng", WINNER_DISPLAY_LABELS[s.winnerDisplay]],
    ["Trúng nhiều lần", s.oncePerPerson ? "Mỗi người chỉ trúng một lần" : "Có thể trúng nhiều giải khác nhau"],
  ];
  return (
    <div className="flex flex-col gap-4">
      <InlineNotice tone="info">Thiết lập đã khóa từ lượt quay đầu tiên để kết quả nhất quán.</InlineNotice>
      <dl className="flex flex-col gap-3" style={{ margin: 0 }}>
        {rows.map(([k, v]) => (
          <div key={k}>
            <dt style={{ fontSize: T.xs, color: T.mutedFg }}>{k}</dt>
            <dd style={{ fontSize: T.sm, color: T.foreground, margin: "2px 0 0" }}>{v}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

function HistoryList({ game }: { game: MiniGame }) {
  return (
    <div className="flex flex-col">
      {historyOf(game).map((h, i) => (
        <div key={i} className="flex items-start gap-3 py-2.5" style={{ borderBottom: `1px solid ${T.border}` }}>
          <span style={{ fontSize: T.xs, color: T.mutedFg, width: 92, flexShrink: 0 }}>{h.time || "—"}</span>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ fontSize: T.sm, color: T.foreground, margin: 0 }}>{h.action}</p>
            <p style={{ fontSize: T.xs, color: T.mutedFg, margin: "2px 0 0" }}>{h.user}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Màn hình quay ──────────────────────────────────────────────────────────────
// Tách khỏi trang quản lý và che phần điều hướng sự kiện để tập trung vận hành.
// Quay theo thứ tự giải đã lưu (không nhảy giải); lượt quay đầu tự chốt danh
// sách; kết quả tự lưu khi quay xong — không có bước xác nhận hay quay lại.
// Màn chiếu (tab riêng) nhận trạng thái qua drawSync.

function DrawScreen({ game, onBack, backLabel, onUpdate, onFixPrizes }: {
  game: MiniGame;
  onBack: () => void;
  backLabel: string;
  /** Ghi tiến độ (chốt danh sách, người thắng) về chương trình. */
  onUpdate: (g: MiniGame) => void;
  /** Về màn thiết lập để giảm số người thắng. */
  onFixPrizes?: () => void;
}) {
  const setup = game.setup ?? LEGACY_SETUP;
  const [prizes, setPrizes]           = useState<Prize[]>(setup.prizes);
  const [results, setResults]         = useState<SpinResult[]>(game.results ?? []);
  const [lockedAt, setLockedAt]       = useState(game.lockedAt);
  const [lockedCount, setLockedCount] = useState(game.lockedCount);
  const [phase, setPhase]             = useState<"idle" | "spinning" | "result">("idle");
  const [rolling, setRolling]         = useState<Person | null>(null);
  const [isFull, setIsFull]           = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const tick = useRef<ReturnType<typeof setInterval>>();
  const stop = useRef<ReturnType<typeof setTimeout>>();

  const locked = !!lockedAt;
  const poolCount = locked ? lockedCount : game.eligibleCount;
  const pool = useMemo(() => participantsOf(poolCount, setup.audience.tiers), [poolCount, setup.audience.tiers]);
  // Quay theo thứ tự giải đã lưu — không cho nhảy giải.
  const current = prizes.find(p => p.remaining > 0) ?? null;
  const done = !current;
  const last = results[0] ?? null;
  // Vừa quay xong thì vẫn hiện giải của người vừa trúng, kể cả khi giải đó đã đủ suất.
  const shown = phase === "result" && last ? prizes.find(p => p.id === last.prizeId) ?? current : current;
  const total = totalSlots(prizes);
  const drawn = drawnSlots(prizes);
  const needed = winnersNeeded(prizes, setup.oncePerPerson);
  // Chỉ kiểm tra trước khi chốt; sau khi chốt, danh sách và giải đã cố định.
  const blocked: "empty" | "shortfall" | null = locked ? null : poolCount === 0 ? "empty" : needed > poolCount ? "shortfall" : null;
  const canSpin = !done && !blocked && phase !== "spinning";
  const waitingForCheckin = setup.audience.source === "event" && setup.audience.scope === "checkedIn";
  const fmt = (name: string, code: string) => winnerLines(name, code, setup.winnerDisplay);

  useEffect(() => () => { clearInterval(tick.current); clearTimeout(stop.current); }, []);
  useEffect(() => {
    const onChange = () => setIsFull(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", onChange);
    return () => document.removeEventListener("fullscreenchange", onChange);
  }, []);

  useEffect(() => {
    publishDraw(game.id, {
      gameName: game.name,
      prize: shown ? prizeLabel(shown) : "",
      progress: shown ? `Đã quay ${shown.count - shown.remaining}/${shown.count} suất` : `Đã quay ${drawn}/${total} suất`,
      phase: phase === "idle" && done ? "done" : phase,
      winner: phase === "result" && last ? fmt(last.winner, last.ticketCode) : null,
      names: pool.slice(0, 40).map(p => fmt(p.name, p.code)),
      winners: [...results].reverse().map(r => ({ prize: r.prize, lines: fmt(r.winner, r.ticketCode) })),
      poolCount, lockedAt, updatedAt: Date.now(),
    });
    // Chỉ phát lại khi trạng thái hoặc kết quả đổi, không phát theo từng khung hình đảo tên.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, results, lockedAt, poolCount]);

  const handleSpin = () => {
    if (!canSpin || !current) return;
    const prize = current;
    let at = lockedAt;
    let count = lockedCount;
    // Lượt quay đầu tiên: hệ thống chốt danh sách ngay lúc này rồi quay luôn.
    if (!locked) { at = nowHHMM(); count = game.eligibleCount; setLockedAt(at); setLockedCount(count); }
    // Người thắng được chọn ngay khi bấm; hiệu ứng chỉ để trình bày.
    const takenAll  = new Set(results.map(r => r.ticketCode));
    const takenHere = new Set(results.filter(r => r.prizeId === prize.id).map(r => r.ticketCode));
    const candidates = pool.filter(c => (setup.oncePerPerson ? !takenAll.has(c.code) : !takenHere.has(c.code)));
    if (candidates.length === 0) {
      toast.error("Không còn người hợp lệ để quay", { description: "Các kết quả trước vẫn được giữ nguyên." });
      return;
    }
    const winner = candidates[Math.floor(Math.random() * candidates.length)];
    setPhase("spinning");
    let i = 0;
    tick.current = setInterval(() => { setRolling(pool[i % pool.length]); i += 1; }, 80);
    stop.current = setTimeout(() => {
      clearInterval(tick.current);
      const result: SpinResult = {
        id: `r${Date.now()}`, time: nowHHMM(), prizeId: prize.id, prize: prizeLabel(prize),
        winner: winner.name, ticketCode: winner.code, operator: "Bạn",
      };
      const nextResults = [result, ...results];
      const nextPrizes = prizes.map(p => (p.id !== prize.id ? p : {
        ...p, remaining: p.remaining - 1, status: (p.remaining - 1 === 0 ? "done" : "active") as Prize["status"],
      }));
      setResults(nextResults);
      setPrizes(nextPrizes);
      setPhase("result");
      onUpdate({
        ...game, status: nextPrizes.some(p => p.remaining > 0) ? "live" : "ended",
        lockedAt: at, lockedCount: count, results: nextResults, winnerCount: nextResults.length,
        setup: { ...setup, prizes: nextPrizes },
      });
    }, setup.spinSeconds * 1000);
  };

  const toggleFull = () => {
    if (document.fullscreenElement) void document.exitFullscreen();
    else void rootRef.current?.requestFullscreen().catch(() => {});
  };

  const person = phase === "spinning" ? rolling : phase === "result" && last ? { name: last.winner, code: last.ticketCode } : null;
  const [line1, line2] = person ? fmt(person.name, person.code) : ["", ""];

  return (
    <div ref={rootRef} className="fixed inset-0 z-50 flex flex-col" style={{ background: T.pageSurface }}>
      <style>{"@keyframes mg-pop { from { opacity: 0; transform: scale(0.94) } to { opacity: 1; transform: scale(1) } }"}</style>

      {/* Đầu màn hình: tên chương trình · trở về · màn chiếu · toàn màn hình */}
      <header className="flex items-center justify-between gap-3 px-4 sm:px-6 shrink-0"
        style={{ height: 56, background: T.background, borderBottom: `1px solid ${T.border}` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, minWidth: 0 }}>
          <button data-pill="off" onClick={onBack} style={LINK_BTN}><ChevronLeft size={16} /> {backLabel}</button>
          <span style={{ width: 1, height: 18, background: T.border, flexShrink: 0 }} />
          <p className="truncate" style={{ fontSize: T.sm, fontWeight: T.fw_semi, color: T.foreground, margin: 0 }}>{game.name}</p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Button variant="outline" size="sm" asChild>
            <a href={`/man-chieu?game=${encodeURIComponent(game.id)}`} target="_blank" rel="noreferrer">
              <ExternalLink size={13} /> Mở màn chiếu
            </a>
          </Button>
          <Button variant="outline" size="sm" onClick={toggleFull}>
            {isFull ? <Minimize2 size={13} /> : <Maximize2 size={13} />} {isFull ? "Thu nhỏ" : "Toàn màn hình"}
          </Button>
        </div>
      </header>

      <div className="flex-1 min-h-0 overflow-y-auto">
        <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-5 p-4 sm:p-6 mx-auto" style={{ maxWidth: 1180 }}>

          {/* Trái: các giải theo thứ tự quay, đánh dấu giải hiện tại */}
          <Card style={{ padding: 0, overflow: "hidden", alignSelf: "start" }}>
            <div style={{ padding: "14px 16px 4px", borderBottom: `1px solid ${T.border}` }}>
              <SectionLabel>Giải thưởng · Đã quay {drawn}/{total} suất</SectionLabel>
            </div>
            {prizes.map(p => {
              const isCurrent = !done && current?.id === p.id;
              const complete = p.remaining === 0;
              return (
                <div key={p.id} style={{
                  display: "flex", alignItems: "center", gap: 12, padding: "12px 16px",
                  borderBottom: `1px solid ${T.border}`, borderLeft: `3px solid ${isCurrent ? T.primary : "transparent"}`,
                  background: isCurrent ? `color-mix(in srgb, ${T.primary} 6%, ${T.background})` : T.background,
                }}>
                  {complete
                    ? <CheckCircle2 size={15} style={{ color: T.successText, flexShrink: 0 } as React.CSSProperties} />
                    : <Trophy size={15} style={{ color: isCurrent ? T.primary : T.mutedFg, flexShrink: 0 } as React.CSSProperties} />}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p className="truncate" style={{ fontSize: T.sm, fontWeight: isCurrent ? T.fw_semi : T.fw_medium, color: complete ? T.mutedFg : T.foreground, margin: 0 }}>{prizeLabel(p)}</p>
                    <p style={{ fontSize: T.xs, color: isCurrent ? T.primary : T.mutedFg, margin: "2px 0 0" }}>
                      Đã quay {p.count - p.remaining}/{p.count} suất{isCurrent ? " · Đang quay giải này" : ""}
                    </p>
                  </div>
                </div>
              );
            })}
          </Card>

          {/* Giữa: giải đang quay, hiệu ứng và người thắng — nút quay ngay bên dưới */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16, minWidth: 0 }}>
            <Card style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 18, padding: "32px 24px", textAlign: "center" }}>
              {done && phase !== "result" ? (
                <p style={{ fontSize: T.lg, fontWeight: T.fw_semi, color: T.foreground, margin: 0 }}>Đã hoàn tất bốc thăm</p>
              ) : shown && (
                <div>
                  <p style={{ fontSize: T.xs, color: T.mutedFg, margin: 0 }}>{phase === "result" ? "Kết quả" : "Giải đang quay"}</p>
                  <p style={{ fontSize: T.xl, fontWeight: T.fw_semi, color: T.foreground, margin: "4px 0 0" }}>{prizeLabel(shown)}</p>
                  <p style={{ fontSize: T.xs, color: T.mutedFg, margin: "4px 0 0" }}>Đã quay {shown.count - shown.remaining}/{shown.count} suất</p>
                </div>
              )}

              <div style={{
                width: "100%", maxWidth: 460, minHeight: 150, borderRadius: 18, padding: "28px 24px",
                display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                background: T.pageSurface, border: `2px solid ${phase === "result" ? T.primary : T.border}`, transition: "border-color 0.3s",
              }}>
                {phase === "spinning" ? (
                  <>
                    <p style={{ fontSize: T["2xl"], fontWeight: T.fw_bold, color: T.foreground, margin: 0 }}>{line1}</p>
                    <p style={{ fontSize: T.sm, color: T.mutedFg, margin: "4px 0 0", fontFamily: "monospace" }}>{line2}</p>
                  </>
                ) : phase === "result" ? (
                  <div style={{ animation: "mg-pop 0.35s ease-out" }}>
                    <p style={{ fontSize: T.xs, color: T.mutedFg, margin: 0 }}>Người thắng</p>
                    <p style={{ fontSize: T["2xl"], fontWeight: T.fw_bold, color: T.foreground, margin: "6px 0 0" }}>{line1}</p>
                    <p style={{ fontSize: T.sm, color: T.primary, fontWeight: T.fw_medium, margin: "4px 0 0", fontFamily: "monospace" }}>{line2}</p>
                  </div>
                ) : (
                  <p style={{ fontSize: T.sm, color: T.mutedFg, margin: 0 }}>{done ? `Đã quay đủ ${total} suất.` : "— Chờ bốc thăm —"}</p>
                )}
              </div>

              {phase === "result" && current && shown && current.id !== shown.id && (
                <p style={{ fontSize: T.xs, color: T.mutedFg, margin: 0 }}>
                  Đã quay đủ giải này. Tiếp theo: <strong style={{ color: T.foreground, fontWeight: T.fw_semi }}>{prizeLabel(current)}</strong>
                </p>
              )}

              {blocked === "empty" && (
                <div style={{ width: "100%", maxWidth: 460, textAlign: "left" }}>
                  <InlineNotice tone="info">
                    <strong style={{ fontWeight: T.fw_semi }}>Chưa có người đủ điều kiện.</strong>{" "}
                    {waitingForCheckin
                      ? "Bạn có thể chờ người tham gia check-in hoặc thay đổi danh sách."
                      : "Danh sách tự cập nhật khi có người đăng ký hợp lệ."}
                  </InlineNotice>
                </div>
              )}
              {blocked === "shortfall" && (
                <div style={{ width: "100%", maxWidth: 460, textAlign: "left" }}>
                  <InlineNotice tone="warning">
                    Hiện có {poolCount} người, cần ít nhất {needed} người theo cấu hình giải thưởng.
                    {onFixPrizes && (
                      <button data-pill="off" onClick={onFixPrizes} style={{ display: "block", marginTop: 6, padding: 0, background: "none", border: "none", cursor: "pointer", fontSize: T.xs, fontWeight: T.fw_semi, color: T.warningText, textDecoration: "underline" }}>
                        Sửa số người thắng
                      </button>
                    )}
                  </InlineNotice>
                </div>
              )}

              {done ? (
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
                  <p style={{ fontSize: T.sm, color: T.foreground, margin: 0 }}>Đã hoàn tất bốc thăm. Xem danh sách người thắng bên dưới.</p>
                  <div className="flex gap-2 flex-wrap justify-center">
                    {phase === "result" && <Button variant="outline" onClick={() => setPhase("idle")}>Chiếu danh sách người thắng</Button>}
                    <Button onClick={onBack}>{backLabel}</Button>
                  </div>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, width: "100%", maxWidth: 360 }}>
                  <Button size="lg" className="w-full" disabled={!canSpin} onClick={handleSpin}>
                    {phase === "spinning" ? "Đang quay…" : <><Play size={15} /> {locked ? "Quay người tiếp theo" : "Bắt đầu quay"}</>}
                  </Button>
                  {!locked && (
                    <p style={{ display: "flex", alignItems: "center", gap: 6, fontSize: T.xs, color: T.mutedFg, margin: 0 }}>
                      <Lock size={12} /> Danh sách người tham gia sẽ được chốt khi bắt đầu quay.
                    </p>
                  )}
                </div>
              )}

              <p style={{ display: "flex", alignItems: "center", gap: 6, fontSize: T.xs, color: T.mutedFg, margin: 0 }}>
                {locked ? <Lock size={12} /> : <Users size={12} />}
                {poolCount} người trong danh sách · {locked ? `Đã chốt lúc ${lockedAt}` : "Đang cập nhật"}
              </p>
            </Card>

            {results.length > 0 && (
              <Card style={{ padding: 0, overflow: "hidden" }}>
                <div style={{ padding: "14px 20px 4px", borderBottom: `1px solid ${T.border}` }}>
                  <SectionLabel>Người thắng · {results.length}</SectionLabel>
                </div>
                {results.map(r => (
                  <div key={r.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 20px", borderBottom: `1px solid ${T.border}` }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p className="truncate" style={{ fontSize: T.sm, fontWeight: T.fw_medium, color: T.foreground, margin: 0 }}>{r.winner}</p>
                      <p className="truncate" style={{ fontSize: T.xs, color: T.mutedFg, margin: 0 }}>{r.prize}</p>
                    </div>
                    <span style={{ fontSize: T.xs, color: T.mutedFg, fontFamily: "monospace" }}>{r.ticketCode}</span>
                    <span style={{ fontSize: T.xs, color: T.mutedFg, width: 44, textAlign: "right" }}>{r.time}</span>
                  </div>
                ))}
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Trang quản lý chương trình ─────────────────────────────────────────────────
// Một trang thay cho 5 tab cũ: tóm tắt + hành động, bảng giải kèm tiến độ, bảng
// người thắng. Người tham gia, thiết lập đã khóa và lịch sử mở ở drawer bên cạnh.

function ManageView({ game, onBack, onOpenDraw, onSetup }: {
  game: MiniGame; onBack: () => void; onOpenDraw: () => void; onSetup: () => void;
}) {
  const setup = game.setup ?? LEGACY_SETUP;
  const status = statusOf(game);
  const results = game.results ?? [];
  const locked = !!game.lockedAt;
  const poolCount = locked ? game.lockedCount : game.eligibleCount;
  const total = totalSlots(setup.prizes);
  const drawn = drawnSlots(setup.prizes);
  const people = useMemo(() => participantsOf(poolCount, setup.audience.tiers), [poolCount, setup.audience.tiers]);
  const [sheet, setSheet] = useState<"people" | "settings" | "history" | null>(null);
  const [query, setQuery] = useState("");
  const [prizeFilter, setPrizeFilter] = useState("all");

  const q = query.trim().toLowerCase();
  const visible = results.filter(r =>
    (prizeFilter === "all" || r.prizeId === prizeFilter)
    && (!q || r.winner.toLowerCase().includes(q) || r.ticketCode.toLowerCase().includes(q)));

  // Nút chính đổi theo trạng thái chương trình.
  const primary =
    status === "draft" ? { label: "Hoàn thiện thiết lập", icon: Pencil,   onClick: onSetup }
    : status === "ready" ? { label: "Mở màn hình quay",   icon: Play,     onClick: onOpenDraw }
    : status === "live"  ? { label: "Tiếp tục quay",      icon: Play,     onClick: onOpenDraw }
    : { label: "Xuất danh sách", icon: Download, onClick: () => exportWinners(game) };

  const prizeCard = (
    <Card style={{ padding: 0, overflow: "hidden" }}>
      <div style={{ padding: "14px 20px", borderBottom: `1px solid ${T.border}` }}>
        <p style={{ fontSize: T.sm, fontWeight: T.fw_semi, color: T.foreground, margin: 0 }}>Giải thưởng và tiến độ</p>
      </div>
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 480 }}>
          <thead>
            <tr style={{ borderBottom: `1px solid ${T.border}` }}>
              <th style={TH}>Giải/phần quà</th>
              <th style={{ ...TH, textAlign: "right" }}>Đã quay</th>
              <th style={{ ...TH, width: 160 }}>Trạng thái</th>
            </tr>
          </thead>
          <tbody>
            {setup.prizes.map((p, i) => {
              const pr = prizeProgress(p);
              return (
                <tr key={p.id} style={{ borderBottom: i < setup.prizes.length - 1 ? `1px solid ${T.border}` : "none" }}>
                  <td style={TD}>{prizeLabel(p)}</td>
                  <td style={{ ...TD, textAlign: "right", whiteSpace: "nowrap" }}>{p.count - p.remaining}/{p.count} suất</td>
                  <td style={TD}>
                    <span style={{ fontSize: T.xs, fontWeight: T.fw_medium, padding: "2px 10px", borderRadius: 999, color: pr.color, background: pr.bg, whiteSpace: "nowrap" }}>{pr.text}</span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Card>
  );

  const winnersCard = (
    <Card style={{ padding: 0, overflow: "hidden" }}>
      <div className="flex flex-col sm:flex-row sm:items-center gap-3" style={{ padding: "12px 20px", borderBottom: `1px solid ${T.border}` }}>
        <p style={{ fontSize: T.sm, fontWeight: T.fw_semi, color: T.foreground, margin: 0, flex: 1 }}>
          Người thắng <span style={{ color: T.mutedFg, fontWeight: T.fw_normal }}>{results.length}</span>
        </p>
        <div className="flex items-center gap-2 flex-wrap">
          <div style={{ position: "relative", width: 220 }}>
            <Search size={13} style={{ position: "absolute", left: 11, top: "50%", transform: "translateY(-50%)", color: T.mutedFg } as React.CSSProperties} />
            <Input value={query} onChange={e => setQuery(e.target.value)} placeholder="Tìm tên hoặc mã" aria-label="Tìm người thắng" style={{ paddingLeft: 34 }} />
          </div>
          {setup.prizes.length > 1 && (
            <Select value={prizeFilter} onValueChange={setPrizeFilter}>
              <SelectTrigger className="w-[190px]" aria-label="Lọc theo giải"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả giải</SelectItem>
                {setup.prizes.map(p => <SelectItem key={p.id} value={p.id}>{prizeLabel(p)}</SelectItem>)}
              </SelectContent>
            </Select>
          )}
          {status !== "ended" && (
            <Button variant="outline" size="sm" disabled={results.length === 0} onClick={() => exportWinners(game)}>
              <Download size={13} /> Xuất danh sách
            </Button>
          )}
        </div>
      </div>
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 560 }}>
          <thead>
            <tr style={{ borderBottom: `1px solid ${T.border}` }}>
              <th style={TH}>Người thắng</th>
              <th style={TH}>Mã tham gia</th>
              <th style={TH}>Giải/phần quà</th>
              <th style={{ ...TH, textAlign: "right" }}>Thời gian</th>
            </tr>
          </thead>
          <tbody>
            {visible.length === 0 ? (
              <tr><td colSpan={4} style={{ ...TD, padding: "28px 20px", textAlign: "center", color: T.mutedFg }}>
                {results.length === 0 ? "Chưa có người thắng." : "Không tìm thấy người thắng."}
              </td></tr>
            ) : visible.map((r, i) => (
              <tr key={r.id} style={{ borderBottom: i < visible.length - 1 ? `1px solid ${T.border}` : "none" }}>
                <td style={{ ...TD, fontWeight: T.fw_medium }}>{r.winner}</td>
                <td style={{ ...TD, fontSize: T.xs, color: T.mutedFg, fontFamily: "monospace" }}>{r.ticketCode}</td>
                <td style={TD}>{r.prize}</td>
                <td style={{ ...TD, fontSize: T.xs, color: T.mutedFg, textAlign: "right" }}>{r.time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {/* A. Thông tin và hành động */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div style={{ minWidth: 0 }}>
          <button data-pill="off" onClick={onBack} style={{ ...LINK_BTN, marginBottom: 8 }}>
            <ChevronLeft size={15} /> Danh sách mini game
          </button>
          <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
            <h2 style={{ fontSize: T.xl, fontWeight: T.fw_semi, color: T.foreground, margin: 0 }}>{game.name}</h2>
            <StatusBadge status={status} />
          </div>
          <p style={{ fontSize: T.sm, color: T.mutedFg, margin: "6px 0 0" }}>
            <button data-pill="off" onClick={() => setSheet("people")} style={{ ...LINK_BTN, display: "inline", fontSize: T.sm }}>
              {poolCount} người tham gia
            </button>
            {" · "}{setup.prizes.length} nhóm giải · Đã quay {drawn}/{total} suất
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {!locked && (
            <Button variant="outline" onClick={onSetup}><Settings size={14} /> Chỉnh thiết lập</Button>
          )}
          <Button onClick={primary.onClick}><primary.icon size={14} /> {primary.label}</Button>
          <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" aria-label="Thêm thao tác"><MoreHorizontal size={16} /></Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              {locked && <DropdownMenuItem onSelect={() => setSheet("settings")}>Xem thiết lập</DropdownMenuItem>}
              <DropdownMenuItem onSelect={() => setSheet("history")}>Lịch sử thao tác</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* B + C. Hoàn tất thì đưa người thắng lên trước để đối chiếu */}
      {status === "ended" ? <>{winnersCard}{prizeCard}</> : <>{prizeCard}{winnersCard}</>}

      <SideSheet open={sheet === "people"} onClose={() => setSheet(null)} title={`${poolCount} người tham gia`}
        description={locked ? `${audienceLabel(setup.audience)} · Danh sách đã chốt lúc ${game.lockedAt}` : `${audienceLabel(setup.audience)} · Danh sách tiếp tục cập nhật đến khi bắt đầu quay`}>
        <PeopleList people={people} />
      </SideSheet>
      <SideSheet open={sheet === "settings"} onClose={() => setSheet(null)} title="Thiết lập" description="Chỉ xem — không sửa được sau khi đã bắt đầu quay.">
        <SettingsSummary game={game} />
      </SideSheet>
      <SideSheet open={sheet === "history"} onClose={() => setSheet(null)} title="Lịch sử thao tác" description={game.name}>
        <HistoryList game={game} />
      </SideSheet>
    </div>
  );
}

// ── Setup Page ─────────────────────────────────────────────────────────────────
// Tạo/sửa chương trình bốc thăm. Chỉ hỏi những gì cần để quay: ai được quay và
// giải gì. Tên tự đặt theo sự kiện, cấu hình phụ nằm trong "Tùy chỉnh thêm".
// Không còn sidebar tóm tắt/checklist — lỗi hiện ngay tại trường liên quan.

/** Mở lại màn thiết lập để sửa đúng chỗ: còn thiếu thông tin, hoặc cần giảm số người thắng. */
type SetupFocus = "missing" | "prizeCount";

/** Nút dạng chữ (Sửa tên, Thay đổi) — dùng kèm data-pill="off". */
const LINK_BTN: React.CSSProperties = {
  display: "inline-flex", alignItems: "center", gap: 5, padding: 0, background: "none", border: "none",
  color: T.primary, fontSize: T.sm, fontWeight: T.fw_medium, cursor: "pointer", flexShrink: 0,
};

const CARD_TITLE: React.CSSProperties = { fontSize: T.sm, fontWeight: T.fw_semi, color: T.foreground, margin: "0 0 12px" };

const newPrize = (): Prize => ({
  id: `np${Date.now()}${Math.random().toString(36).slice(2, 6)}`,
  rank: "", name: "", count: 1, remaining: 1, status: "pending",
});

function FieldGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p style={{ fontSize: T.xs, fontWeight: T.fw_semi, color: T.mutedFg, margin: "0 0 8px" }}>{label}</p>
      {children}
    </div>
  );
}

/** Một lựa chọn trong RadioGroup, trình bày dạng thẻ (dùng <label> nên không bị bo viên thuốc). */
function ChoiceRow({ value, selected, title, meta, icon: Icon }: {
  value: string; selected: boolean; title: string; meta?: string;
  icon: React.ComponentType<{ size?: number; style?: React.CSSProperties }>;
}) {
  const id = `mg-choice-${value}`;
  return (
    <label htmlFor={id} className="rounded-xl" style={{
      display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", cursor: "pointer",
      border: `1px solid ${selected ? T.primary : T.border}`,
      background: selected ? `color-mix(in srgb, ${T.primary} 7%, ${T.background})` : T.background,
    }}>
      <RadioGroupItem value={value} id={id} />
      <Icon size={14} style={{ color: selected ? T.primary : T.mutedFg, flexShrink: 0 }} />
      <span style={{ fontSize: T.sm, fontWeight: T.fw_medium, color: T.foreground, flex: 1, minWidth: 0 }}>{title}</span>
      {meta && <span style={{ fontSize: T.xs, color: selected ? T.primary : T.mutedFg, flexShrink: 0 }}>{meta}</span>}
    </label>
  );
}

/** Chip lọc hạng vé (chọn nhiều). */
function TierChip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button type="button" aria-pressed={active} onClick={onClick} style={{
      display: "inline-flex", alignItems: "center", gap: 6, padding: "6px 12px", cursor: "pointer",
      fontSize: T.xs, fontWeight: T.fw_medium,
      border: `1px solid ${active ? T.primary : T.border}`,
      background: active ? `color-mix(in srgb, ${T.primary} 8%, ${T.background})` : T.background,
      color: active ? T.primary : T.foreground,
    }}>
      {active && <Check size={12} />}
      {children}
    </button>
  );
}

function SetupPage({ game, eventName, pool, focus, onBack, onSave, onOpenDraw }: {
  /** Có = đang sửa chương trình đã lưu. */
  game?: MiniGame;
  eventName: string;
  pool: TierCount[];
  focus?: SetupFocus;
  onBack: () => void;
  /** "Lưu chương trình" — lưu nháp được cả khi chưa có giải. */
  onSave: (g: MiniGame) => void;
  /** "Mở màn hình quay" — chỉ gọi khi đã đủ giải (và file, nếu tải danh sách riêng). */
  onOpenDraw: (g: MiniGame) => void;
}) {
  const autoName = `Bốc thăm may mắn — ${eventName}`;
  const init = game?.setup;
  const [name, setName] = useState(game?.name ?? autoName);
  const [editingName, setEditingName] = useState(false);
  const cancelNameEdit = useRef(false);
  const [audience, setAudience] = useState<Audience>(init?.audience ?? DEFAULT_AUDIENCE);
  const [editingAudience, setEditingAudience] = useState(false);
  const [prizes, setPrizes] = useState<Prize[]>(() => init?.prizes ?? [newPrize()]);
  const [spinSeconds, setSpinSeconds] = useState(String(init?.spinSeconds ?? 5));
  const [winnerDisplay, setWinnerDisplay] = useState<WinnerDisplay>(init?.winnerDisplay ?? "full");
  const [oncePerPerson, setOncePerPerson] = useState(init?.oncePerPerson ?? true);
  const [moreOpen, setMoreOpen] = useState(false);
  // Lỗi "còn thiếu" chỉ hiện sau khi bấm "Mở màn hình quay" — không tô đỏ cả trang từ đầu.
  const [showErrors, setShowErrors] = useState(focus === "missing");
  const uploadRef = useRef<HTMLInputElement>(null);

  // Đã bấm "Bắt đầu quay": khóa nguồn người tham gia và quy tắc trúng thưởng.
  const started = !!game?.lockedAt;
  const eligible = started ? game!.lockedCount : eligibleOf(audience, pool);
  const needed = winnersNeeded(prizes, oncePerPerson);
  const shortfall = eligible > 0 && needed > eligible;
  const draft: DrawSetup = { audience, prizes, spinSeconds: Number(spinSeconds), winnerDisplay, oncePerPerson };
  const issues = setupIssues(draft);
  const summary = audience.source === "upload" && !audience.fileName
    ? "Danh sách riêng · Chưa tải file lên"
    : `${audienceLabel(audience)} · ${eligible} người`;
  const AudienceIcon = started ? Lock : audience.source === "upload" ? Upload : audience.scope === "checkedIn" ? UserCheck : Users;
  const scopeTotal = (scope: Audience["scope"]) =>
    pool.reduce((n, t) => n + (scope === "checkedIn" ? t.checkedIn : t.registered), 0);
  const moreSummary = [
    `${spinSeconds} giây`,
    WINNER_DISPLAY_LABELS[winnerDisplay],
    oncePerPerson ? "Mỗi người chỉ trúng một lần" : "Có thể trúng nhiều lần",
  ].join(" · ");
  const prizeInputId = (id: string, field: "name" | "count") => `mg-prize-${field}-${id}`;

  /** Cuộn tới và đặt con trỏ vào trường cần sửa (chờ một khung hình để phần vừa mở kịp hiện ra). */
  const focusLater = (getEl: () => HTMLElement | null | undefined) => requestAnimationFrame(() => {
    const el = getEl();
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "center" });
    el.focus({ preventScroll: true });
  });

  const pointToFirstIssue = () => {
    setShowErrors(true);
    if (issues.uploadMissing) {
      setEditingAudience(true);
      focusLater(() => uploadRef.current);
      return;
    }
    const firstEmpty = issues.emptyPrizeIds[0];
    if (firstEmpty) focusLater(() => document.getElementById(prizeInputId(firstEmpty, "name")));
  };

  // Mở lại từ danh sách/màn quay: chỉ thẳng vào trường cần sửa.
  useEffect(() => {
    if (focus === "missing") pointToFirstIssue();
    if (focus === "prizeCount") {
      // Giải đông người thắng nhất thường là chỗ cần giảm.
      const target = prizes.filter(p => p.status === "pending").sort((a, b) => b.count - a.count)[0];
      if (target) focusLater(() => document.getElementById(prizeInputId(target.id, "count")));
    }
    // Chỉ chạy một lần khi mở trang.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const startNameEdit = () => { cancelNameEdit.current = false; setEditingName(true); };
  const commitName = (value: string) => {
    if (cancelNameEdit.current) return;
    setName(value.trim() || autoName);   // xóa trống thì dùng lại tên tự đặt
    setEditingName(false);
  };

  const updatePrize = (id: string, patch: Partial<Prize>) =>
    setPrizes(prev => prev.map(p => (p.id === id ? { ...p, ...patch } : p)));
  const addPrize = () => {
    const p = newPrize();
    setPrizes(prev => [...prev, p]);
    focusLater(() => document.getElementById(prizeInputId(p.id, "name")));
  };
  const removePrize = (id: string) => setPrizes(prev => prev.filter(p => p.id !== id));

  const toggleTier = (tier: string) => setAudience(a => {
    const picked = a.tiers.includes(tier) ? a.tiers.filter(t => t !== tier) : [...a.tiers, tier];
    // Giữ thứ tự như kho vé; chọn đủ mọi hạng thì coi như "Tất cả hạng vé".
    const ordered = pool.map(t => t.tier).filter(t => picked.includes(t));
    return { ...a, tiers: ordered.length === pool.length ? [] : ordered };
  });

  const build = (): MiniGame => {
    const cleaned = prizes.map(p => {
      const count = Math.max(1, p.count || 1);
      return p.status === "pending" ? { ...p, name: p.name.trim(), count, remaining: count } : p;
    });
    const setup: DrawSetup = { ...draft, prizes: cleaned };
    return {
      id: game?.id ?? `mg${Date.now()}`,
      name: name.trim() || autoName,
      description: game?.description ?? "",
      status: started ? game!.status : isDrawReady(setup) ? "ready" : "draft",
      participantSource: audienceLabel(audience),
      eligibleCount: eligible,
      lockedCount: game?.lockedCount ?? 0,
      prizeCount: cleaned.length,
      winnerCount: game?.winnerCount ?? 0,
      deliveredCount: game?.deliveredCount ?? 0,
      startTime: game?.startTime ?? "",
      endTime: game?.endTime ?? "",
      setup,
      lockedAt: game?.lockedAt,
      results: game?.results,
    };
  };

  const handleOpenDraw = () => {
    if (issues.uploadMissing || issues.emptyPrizeIds.length > 0) { pointToFirstIssue(); return; }
    onOpenDraw(build());
  };

  return (
    // Cột form căn giữa — không để trống một bên như khi dồn trái.
    <div style={{ display: "flex", flexDirection: "column", gap: 16, maxWidth: 760, width: "100%", margin: "0 auto" }}>

      {/* Page header — tên chương trình tự đặt theo sự kiện, sửa ngay tại chỗ */}
      <div style={{ marginBottom: 4 }}>
        <button data-pill="off" onClick={onBack} style={{ ...LINK_BTN, marginBottom: 8 }}>
          <ChevronLeft size={15} /> Mini Game
        </button>
        <h2 style={{ fontSize: T.xl, fontWeight: T.fw_semi, color: T.foreground, margin: 0 }}>
          {game ? "Thiết lập bốc thăm may mắn" : "Tạo bốc thăm may mắn"}
        </h2>
        {editingName ? (
          <div style={{ marginTop: 8, maxWidth: 560 }}>
            <Input
              autoFocus defaultValue={name} aria-label="Tên chương trình"
              onFocus={e => e.currentTarget.select()}
              onBlur={e => commitName(e.currentTarget.value)}
              onKeyDown={e => {
                if (e.key === "Enter") e.currentTarget.blur();
                if (e.key === "Escape") { cancelNameEdit.current = true; setEditingName(false); }
              }}
            />
            <p style={{ fontSize: T.xs, color: T.mutedFg, margin: "6px 0 0" }}>Enter để lưu · Esc để hủy</p>
          </div>
        ) : (
          <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap", marginTop: 6 }}>
            <p style={{ fontSize: T.sm, color: T.mutedFg, margin: 0, minWidth: 0, overflowWrap: "anywhere" }}>{name}</p>
            <button data-pill="off" onClick={startNameEdit} style={{ ...LINK_BTN, fontSize: T.xs }}>
              <Pencil size={12} /> Sửa tên
            </button>
          </div>
        )}
      </div>

      {/* Người tham gia — mặc định một dòng; "Thay đổi" mới mở thêm lựa chọn */}
      <Card>
        <p style={CARD_TITLE}>Người tham gia</p>
        {editingAudience ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <FieldGroup label="Nguồn danh sách">
              <RadioGroup
                value={audience.source} aria-label="Nguồn danh sách"
                onValueChange={v => setAudience(a => ({ ...a, source: v as Audience["source"] }))}
                className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <ChoiceRow value="event"  selected={audience.source === "event"}  icon={CalendarCheck} title="Danh sách sự kiện" />
                <ChoiceRow value="upload" selected={audience.source === "upload"} icon={Upload}        title="Tải danh sách riêng" />
              </RadioGroup>
            </FieldGroup>

            {audience.source === "event" ? (
              <>
                <FieldGroup label="Đối tượng">
                  <RadioGroup
                    value={audience.scope} aria-label="Đối tượng"
                    onValueChange={v => setAudience(a => ({ ...a, scope: v as Audience["scope"] }))}
                    className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <ChoiceRow value="checkedIn"  selected={audience.scope === "checkedIn"}  icon={UserCheck} title="Người đã check-in"     meta={`${scopeTotal("checkedIn")} người`} />
                    <ChoiceRow value="registered" selected={audience.scope === "registered"} icon={Users}     title="Tất cả đăng ký hợp lệ" meta={`${scopeTotal("registered")} người`} />
                  </RadioGroup>
                </FieldGroup>
                {/* Hạng vé là bộ lọc, ghép được với "đã check-in" (vd. đã check-in và có vé VIP) */}
                <FieldGroup label="Lọc theo hạng vé">
                  <div className="flex flex-wrap gap-2">
                    <TierChip active={audience.tiers.length === 0} onClick={() => setAudience(a => ({ ...a, tiers: [] }))}>
                      Tất cả hạng vé
                    </TierChip>
                    {pool.map(t => (
                      <TierChip key={t.tier} active={audience.tiers.includes(t.tier)} onClick={() => toggleTier(t.tier)}>
                        {t.tier} · {audience.scope === "checkedIn" ? t.checkedIn : t.registered}
                      </TierChip>
                    ))}
                  </div>
                </FieldGroup>
              </>
            ) : (
              <FieldGroup label="File danh sách">
                <label className="rounded-xl focus-within:ring-[3px] focus-within:ring-ring/50" style={{
                  position: "relative", display: "flex", alignItems: "center", gap: 12, padding: "14px 16px", cursor: "pointer",
                  border: `2px dashed ${audience.fileName ? T.primary : showErrors && issues.uploadMissing ? T.destructive : T.border}`,
                  background: audience.fileName ? `color-mix(in srgb, ${T.primary} 4%, ${T.background})` : T.pageSurface,
                }}>
                  <input
                    ref={uploadRef} type="file" accept=".xlsx,.xls,.csv" className="sr-only"
                    aria-invalid={showErrors && issues.uploadMissing ? true : undefined}
                    onChange={e => { const f = e.target.files?.[0]; if (f) setAudience(a => ({ ...a, fileName: f.name })); }}
                  />
                  {audience.fileName
                    ? <Check size={18} style={{ color: T.primary, flexShrink: 0 } as React.CSSProperties} />
                    : <Upload size={18} style={{ color: T.mutedFg, flexShrink: 0 } as React.CSSProperties} />}
                  <div style={{ minWidth: 0 }}>
                    <p style={{ fontSize: T.sm, fontWeight: T.fw_medium, color: audience.fileName ? T.primary : T.foreground, margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" as const }}>
                      {audience.fileName ?? "Tải file danh sách lên"}
                    </p>
                    <p style={{ fontSize: T.xs, color: T.mutedFg, margin: "2px 0 0" }}>
                      {audience.fileName ? `${UPLOAD_MOCK_COUNT} người hợp lệ · Bấm để đổi file` : "Chấp nhận .xlsx, .xls, .csv"}
                    </p>
                  </div>
                </label>
                {showErrors && issues.uploadMissing && <FieldError>Tải file danh sách lên để mở màn hình quay.</FieldError>}
              </FieldGroup>
            )}

            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap", paddingTop: 14, borderTop: `1px solid ${T.border}` }}>
              <span style={{ fontSize: T.sm, fontWeight: T.fw_medium, color: T.foreground }}>{summary}</span>
              <Button size="sm" onClick={() => setEditingAudience(false)}>Xong</Button>
            </div>
          </div>
        ) : (
          <>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 0 }}>
                <AudienceIcon size={15} style={{ color: started ? T.mutedFg : T.primary, flexShrink: 0 } as React.CSSProperties} />
                <span style={{ fontSize: T.sm, fontWeight: T.fw_medium, color: T.foreground }}>{summary}</span>
              </div>
              {!started && (
                <button data-pill="off" onClick={() => setEditingAudience(true)} style={LINK_BTN}>Thay đổi</button>
              )}
            </div>
            <p style={{ fontSize: T.xs, color: T.mutedFg, margin: "6px 0 0", paddingLeft: 23 }}>
              {started
                ? `Đã chốt lúc ${game!.lockedAt} khi bắt đầu quay — không đổi được nguồn người tham gia giữa chương trình.`
                : audience.source === "upload"
                ? "Danh sách theo file đã tải lên, không tự cập nhật."
                : "Danh sách tiếp tục cập nhật đến khi bắt đầu quay."}
            </p>
            {showErrors && issues.uploadMissing && <FieldError>Tải file danh sách lên để mở màn hình quay.</FieldError>}
          </>
        )}

        {!started && audience.source === "event" && eligible === 0 && (
          <div style={{ marginTop: 12 }}>
            <InlineNotice tone="info">
              {audience.scope === "checkedIn" ? "Chưa có ai check-in." : "Chưa có đăng ký hợp lệ nào."}{" "}
              Bạn vẫn có thể lưu và mở màn hình chờ; chỉ bắt đầu quay được khi danh sách có người.
            </InlineNotice>
          </div>
        )}
      </Card>

      {/* Giải thưởng — mặc định chỉ hỏi tên giải/phần quà và số người thắng */}
      <Card>
        <p style={CARD_TITLE}>Giải thưởng</p>
        <div className="grid grid-cols-[1fr_96px_32px] sm:grid-cols-[1fr_128px_32px] gap-3" style={{ marginBottom: 6 }}>
          <span style={{ fontSize: T.xs, fontWeight: T.fw_semi, color: T.mutedFg }}>Tên giải/phần quà</span>
          <span style={{ fontSize: T.xs, fontWeight: T.fw_semi, color: T.mutedFg }}>Số người thắng</span>
          <span />
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {prizes.map((p, i) => {
            // Giải đã có người trúng thì giữ nguyên, tránh đổi luật giữa chương trình.
            const drawn = p.status !== "pending";
            const nameError = showErrors && !drawn && !p.name.trim();
            const errId = `mg-prize-err-${p.id}`;
            return (
              <div key={p.id}>
                <div className="grid grid-cols-[1fr_96px_32px] sm:grid-cols-[1fr_128px_32px] gap-3 items-center">
                  {drawn ? (
                    <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 0, height: 36, padding: "0 12px", borderRadius: 6, background: T.pageSurface, border: `1px solid ${T.border}` }}>
                      <Lock size={12} style={{ color: T.mutedFg, flexShrink: 0 } as React.CSSProperties} />
                      <span style={{ fontSize: T.sm, color: T.foreground, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" as const }}>{prizeLabel(p)}</span>
                    </div>
                  ) : (
                    <Input
                      id={prizeInputId(p.id, "name")} value={p.name} placeholder="Ví dụ: Voucher 500.000đ"
                      aria-label={`Tên giải/phần quà ${i + 1}`}
                      aria-invalid={nameError || undefined} aria-describedby={nameError ? errId : undefined}
                      onChange={e => updatePrize(p.id, { name: e.target.value })}
                    />
                  )}
                  {drawn ? (
                    <span style={{ fontSize: T.xs, color: T.mutedFg, paddingLeft: 4 }}>{p.count - p.remaining}/{p.count} đã trúng</span>
                  ) : (
                    <Input
                      id={prizeInputId(p.id, "count")} type="number" inputMode="numeric" min={1}
                      value={p.count || ""} aria-label={`Số người thắng ${i + 1}`}
                      onChange={e => {
                        const n = parseInt(e.target.value, 10);
                        const count = Number.isNaN(n) ? 0 : n;
                        updatePrize(p.id, { count, remaining: count });
                      }}
                      onBlur={() => { if (!(p.count >= 1)) updatePrize(p.id, { count: 1, remaining: 1 }); }}
                    />
                  )}
                  {prizes.length > 1 && !drawn ? (
                    <button type="button" data-pill="off" onClick={() => removePrize(p.id)} aria-label={`Xóa giải ${i + 1}`} style={{
                      display: "flex", alignItems: "center", justifyContent: "center", width: 32, height: 32,
                      background: "none", border: "none", cursor: "pointer", color: T.mutedFg,
                    }}>
                      <Trash2 size={14} />
                    </button>
                  ) : <span />}
                </div>
                {nameError && <FieldError id={errId}>Nhập tên giải/phần quà để mở màn hình quay.</FieldError>}
              </div>
            );
          })}
        </div>

        <Button variant="outline" size="sm" onClick={addPrize} style={{ marginTop: 12 }}>
          <Plus size={13} /> Thêm giải thưởng
        </Button>

        {shortfall && (
          <div style={{ marginTop: 12 }}>
            <InlineNotice tone="warning">
              {oncePerPerson
                ? `Tổng ${needed} người thắng nhưng chỉ có ${eligible} người đủ điều kiện (mỗi người chỉ trúng một lần).`
                : `Một giải cần ${needed} người thắng nhưng chỉ có ${eligible} người đủ điều kiện.`}{" "}
              Giảm số người thắng trước khi bắt đầu quay.
            </InlineNotice>
          </div>
        )}
      </Card>

      {/* Tùy chỉnh thêm — thu gọn mặc định; mặc định đã hợp lý cho đa số chương trình */}
      <Collapsible open={moreOpen} onOpenChange={setMoreOpen}>
        <Card style={{ padding: 0 }}>
          <CollapsibleTrigger asChild>
            <button type="button" className="rounded-2xl" style={{
              width: "100%", display: "flex", alignItems: "center", gap: 12, padding: "16px 20px",
              background: "none", border: "none", cursor: "pointer", textAlign: "left",
            }}>
              <SlidersHorizontal size={16} style={{ color: T.mutedFg, flexShrink: 0 } as React.CSSProperties} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: T.sm, fontWeight: T.fw_semi, color: T.foreground, margin: 0 }}>Tùy chỉnh thêm</p>
                {!moreOpen && <p style={{ fontSize: T.xs, color: T.mutedFg, margin: "2px 0 0" }}>{moreSummary}</p>}
              </div>
              <ChevronDown size={16} style={{ color: T.mutedFg, flexShrink: 0, transform: moreOpen ? "rotate(180deg)" : "none", transition: "transform 0.2s" } as React.CSSProperties} />
            </button>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div style={{ padding: "0 20px 20px", display: "flex", flexDirection: "column", gap: 16 }}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="mg-spin-seconds">Thời gian quay</Label>
                  <Select value={spinSeconds} onValueChange={setSpinSeconds}>
                    <SelectTrigger id="mg-spin-seconds" style={{ marginTop: 6 }}><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {["3", "5", "10", "15", "30"].map(s => <SelectItem key={s} value={s}>{s} giây</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="mg-winner-display">Hiển thị người thắng</Label>
                  <Select value={winnerDisplay} onValueChange={v => setWinnerDisplay(v as WinnerDisplay)}>
                    <SelectTrigger id="mg-winner-display" style={{ marginTop: 6 }}><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {(Object.keys(WINNER_DISPLAY_LABELS) as WinnerDisplay[]).map(k => (
                        <SelectItem key={k} value={k}>{WINNER_DISPLAY_LABELS[k]}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <p style={{ fontSize: T.sm, fontWeight: T.fw_medium, color: T.foreground, margin: "0 0 10px" }}>Trúng nhiều lần</p>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <Checkbox
                    id="mg-once-per-person" checked={oncePerPerson} disabled={started}
                    onCheckedChange={v => setOncePerPerson(v === true)}
                  />
                  <Label htmlFor="mg-once-per-person" style={{ fontWeight: T.fw_normal }}>
                    Mỗi người chỉ trúng một lần trong chương trình
                  </Label>
                </div>
                {started && (
                  <p style={{ display: "flex", alignItems: "center", gap: 6, fontSize: T.xs, color: T.mutedFg, margin: "8px 0 0" }}>
                    <Lock size={12} /> Đã khóa vì chương trình đã bắt đầu quay.
                  </p>
                )}
              </div>
            </div>
          </CollapsibleContent>
        </Card>
      </Collapsible>

      {/* Hai hành động cụ thể thay cho "Sẵn sàng xuất bản" */}
      <div style={{
        position: "sticky", bottom: 0, zIndex: 40,
        background: T.background, borderTop: `1px solid ${T.border}`,
        padding: "14px 0", display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 10, flexWrap: "wrap",
      }}>
        <Button variant="outline" onClick={() => onSave(build())}>Lưu chương trình</Button>
        <Button onClick={handleOpenDraw}>Mở màn hình quay <ArrowRight size={14} /></Button>
      </div>
    </div>
  );
}

// ── List View ──────────────────────────────────────────────────────────────────

function MgListView({ games, onCreate, onManage, onSetup }: {
  games: MiniGame[];
  onCreate: () => void;
  onManage: (g: MiniGame) => void;
  onSetup: (g: MiniGame) => void;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

      {/* Section header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4">
        <div>
          <h2 style={{ fontSize: T.xl, fontWeight: T.fw_semi, color: T.foreground, margin: 0, marginBottom: 4 }}>Mini Game</h2>
          <p style={{ fontSize: T.sm, color: T.mutedFg, margin: 0 }}>Quản lý các chương trình bốc thăm và hoạt động tương tác trong sự kiện.</p>
        </div>
        <Button variant="outline" onClick={onCreate} style={{ display: "flex", alignItems: "center", gap: 7, flexShrink: 0 }}>
          <Plus size={13} /> Tạo bốc thăm
        </Button>
      </div>

      {games.length === 0 ? (
        <div style={{ padding: "64px 0", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
          <div style={{ width: 68, height: 68, borderRadius: 18, marginBottom: 18, display: "flex", alignItems: "center", justifyContent: "center", background: `color-mix(in srgb, ${T.primary} 10%, transparent)` }}>
            <Gamepad2 size={30} style={{ color: T.primary } as React.CSSProperties} />
          </div>
          <h3 style={{ fontSize: T.lg, fontWeight: T.fw_semi, color: T.foreground, marginBottom: 8 }}>Chưa có mini game nào</h3>
          <p style={{ fontSize: T.sm, color: T.mutedFg, maxWidth: 360, lineHeight: 1.6, marginBottom: 20 }}>
            Tạo bốc thăm may mắn công khai để bốc thăm quà tặng trong lúc sự kiện diễn ra.
          </p>
          <Button onClick={onCreate} style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Plus size={14} /> Tạo bốc thăm
          </Button>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {games.map(game => {
            const setup = game.setup ?? LEGACY_SETUP;
            const status = statusOf(game);
            // Chưa bắt đầu: chỉ "Thiết lập" (mở màn quay từ đó). Đã quay: vào trang quản lý.
            const started = status === "live" || status === "ended";
            const meta = [
              audienceLabel(setup.audience),
              `${setup.prizes.length} nhóm giải`,
              started ? `Đã quay ${drawnSlots(setup.prizes)}/${totalSlots(setup.prizes)} suất` : `${totalSlots(setup.prizes)} suất`,
            ].join(" · ");
            return (
              <Card key={game.id} style={{ padding: "14px 16px" }}>
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-5">
                  <div style={{ display: "flex", alignItems: "center", gap: 12, flex: 1, minWidth: 0 }}>
                    <div style={{ width: 40, height: 40, borderRadius: 10, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", background: `linear-gradient(135deg, ${T.primary}, #7c3aed)` }}>
                      <Gamepad2 size={20} color="white" />
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 0 }}>
                        <p style={{ fontSize: T.sm, fontWeight: T.fw_semi, color: T.foreground, margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" as const }}>{game.name}</p>
                        <span style={{ flexShrink: 0, whiteSpace: "nowrap" as const }}><StatusBadge status={status} /></span>
                      </div>
                      <p style={{ fontSize: T.xs, color: T.mutedFg, margin: "2px 0 0", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" as const }}>{meta}</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="shrink-0" onClick={() => (started ? onManage(game) : onSetup(game))}>
                    {started ? "Quản lý" : "Thiết lập"}
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ── Main export ────────────────────────────────────────────────────────────────

export function MiniGameTab({ event }: { event?: { name?: string; status?: string } }) {
  const eventName = event?.name ?? "NetEvent Demo 2026";
  // Sự kiện nháp chưa có ai đăng ký hay check-in — đây là cách xem trường hợp "chưa có ai check-in".
  const pool = event?.status === "draft" ? TIER_POOL.map(t => ({ ...t, checkedIn: 0, registered: 0 })) : TIER_POOL;
  // Chương trình mẫu dùng chung luồng với chương trình tạo mới: cùng cấu hình, cùng một nguồn kết quả.
  const [games, setGames] = useState<MiniGame[]>(() => [{ ...MOCK_GAME, setup: LEGACY_SETUP, results: MOCK_RESULTS }]);
  const [view, setView] = useState<MgView>("list");
  const [selectedId, setSelectedId] = useState<string | null>(MOCK_GAME.id);
  const [setupFocus, setSetupFocus] = useState<SetupFocus | undefined>();
  // Màn quay mở từ đâu thì "Quay lại" về đó (khi chưa quay lượt nào).
  const [operateFrom, setOperateFrom] = useState<MgView>("list");

  const selected = games.find(g => g.id === selectedId);
  const upsert = (g: MiniGame) =>
    setGames(prev => prev.some(x => x.id === g.id) ? prev.map(x => x.id === g.id ? g : x) : [g, ...prev]);

  const openSetup = (g: MiniGame | null, focus?: SetupFocus) => {
    setSelectedId(g?.id ?? null);
    setSetupFocus(focus);
    setView("setup");
  };
  const openDraw = (g: MiniGame, from: MgView) => {
    // Còn thiếu giải hoặc file danh sách: không mở màn quay mà chỉ thẳng vào trường còn thiếu.
    if (g.setup && !isDrawReady(g.setup)) { openSetup(g, "missing"); return; }
    setSelectedId(g.id);
    setOperateFrom(from);
    setView("operate");
  };

  if (view === "setup") {
    return (
      <SetupPage
        key={selected?.id ?? "new"}
        game={selected} eventName={eventName} pool={pool} focus={setupFocus}
        onBack={() => setView("list")}
        onSave={g => { upsert(g); setView("list"); toast.success("Đã lưu chương trình", { description: g.name }); }}
        onOpenDraw={g => { upsert(g); openDraw(g, "setup"); }}
      />
    );
  }
  if (view === "manage" && selected) {
    return (
      <ManageView game={selected} onBack={() => setView("list")}
        onOpenDraw={() => openDraw(selected, "manage")} onSetup={() => openSetup(selected)} />
    );
  }
  if (view === "operate" && selected) {
    // Đã quay lượt nào thì màn quay về trang quản lý; chưa quay thì về nơi đã mở.
    const started = !!selected.lockedAt;
    const fromSetup = operateFrom === "setup";
    return (
      <DrawScreen
        key={selected.id}
        game={selected}
        backLabel={started ? "Trở về quản lý" : fromSetup ? "Quay lại thiết lập" : "Quay lại"}
        onBack={() => (started ? setView("manage") : fromSetup ? openSetup(selected) : setView(operateFrom))}
        onUpdate={upsert}
        onFixPrizes={selected.setup ? () => openSetup(selected, "prizeCount") : undefined}
      />
    );
  }

  return (
    <MgListView
      games={games}
      onCreate={() => openSetup(null)}
      onManage={g => { setSelectedId(g.id); setView("manage"); }}
      onSetup={g => openSetup(g)}
    />
  );
}

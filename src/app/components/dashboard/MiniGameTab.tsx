import * as React from "react";
import { useState, useEffect, useRef } from "react";
import {
  ChevronLeft, Plus, Trophy, Users, Lock,
  Play, RotateCcw, CheckCircle2, BarChart3,
  Download, Search, Check, X, AlertCircle,
  Maximize2, Award, Trash2, UserCheck, Gamepad2,
  ClipboardList, Minimize2, Zap, Settings,
  ChevronDown, Pencil, Upload, Info, SlidersHorizontal, CalendarCheck, ArrowRight
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
type ManageSubTab = "overview" | "operate" | "results" | "config" | "audit";
type SpinState    = "idle" | "spinning" | "result" | "absent";
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

interface Participant {
  id: string; name: string; ticketCode: string; ticketType: string;
  checkedIn: boolean; excluded: boolean;
}

interface SpinResult {
  id: string; time: string; prize: string;
  winner: string; ticketCode: string;
  status: "pending" | "confirmed" | "absent" | "delivered" | "cancelled";
  operator: string; confirmedBy?: string;
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

const MOCK_PARTICIPANTS: Participant[] = [
  { id: "u1", name: "Nguyễn Văn Bình", ticketCode: "NE-2025-00142", ticketType: "VIP",      checkedIn: true,  excluded: false },
  { id: "u2", name: "Trần Thị Cúc",   ticketCode: "NE-2025-00089", ticketType: "Standard", checkedIn: true,  excluded: false },
  { id: "u3", name: "Lê Minh Đức",    ticketCode: "NE-2025-00201", ticketType: "Standard", checkedIn: true,  excluded: false },
  { id: "u4", name: "Phạm Thị Hoa",   ticketCode: "NE-2025-00317", ticketType: "VIP",      checkedIn: true,  excluded: false },
  { id: "u5", name: "Vũ Quốc Hùng",   ticketCode: "NE-2025-00005", ticketType: "Standard", checkedIn: true,  excluded: true  },
  { id: "u6", name: "Đỗ Thị Lan",     ticketCode: "NE-2025-00223", ticketType: "Standard", checkedIn: true,  excluded: false },
  { id: "u7", name: "Hoàng Văn Minh", ticketCode: "NE-2025-00415", ticketType: "VIP",      checkedIn: false, excluded: false },
];

const MOCK_RESULTS: SpinResult[] = [
  { id: "r1", time: "18:15", prize: "Giải nhất – iPhone 16 Pro Max",     winner: "Nguyễn Văn Bình", ticketCode: "NE-2025-00142", status: "delivered",  operator: "Trần Staff A", confirmedBy: "Admin" },
  { id: "r2", time: "18:32", prize: "Giải nhì – Apple Watch Series 10",  winner: "Trần Thị Cúc",   ticketCode: "NE-2025-00089", status: "confirmed",  operator: "Trần Staff A" },
  { id: "r3", time: "18:48", prize: "Giải nhì – Apple Watch Series 10",  winner: "Lê Minh Đức",    ticketCode: "NE-2025-00201", status: "absent",     operator: "Nguyễn Staff B" },
];

const MOCK_AUDIT = [
  { id: "a1",  action: "Tạo chương trình bốc thăm",                       user: "Admin",          time: "14:00 · 29/06" },
  { id: "a2",  action: "Sửa cấu hình giải thưởng",                         user: "Admin",          time: "14:25 · 29/06" },
  { id: "a3",  action: "Lưu chương trình",                                  user: "Admin",          time: "14:30 · 29/06" },
  { id: "a4",  action: "Tự động chốt danh sách khi bắt đầu quay (138 người)", user: "Hệ thống",     time: "18:14 · 29/06" },
  { id: "a5",  action: "Bắt đầu bốc thăm – Giải nhất",                     user: "Trần Staff A",   time: "18:14 · 29/06" },
  { id: "a6",  action: "Xác nhận người thắng – Nguyễn Văn Bình",           user: "Trần Staff A",   time: "18:15 · 29/06" },
  { id: "a7",  action: "Xác nhận đã trao quà – iPhone 16 Pro Max",         user: "Admin",          time: "18:20 · 29/06" },
  { id: "a8",  action: "Bắt đầu bốc thăm – Giải nhì (lượt 1)",            user: "Trần Staff A",   time: "18:31 · 29/06" },
  { id: "a9",  action: "Xác nhận người thắng – Trần Thị Cúc",             user: "Trần Staff A",   time: "18:32 · 29/06" },
  { id: "a10", action: "Bắt đầu bốc thăm – Giải nhì (lượt 2)",            user: "Nguyễn Staff B", time: "18:47 · 29/06" },
  { id: "a11", action: "Đánh dấu không có mặt – Lê Minh Đức",             user: "Nguyễn Staff B", time: "18:49 · 29/06" },
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
const prizeLabel = (p: Prize) => (p.rank ? `${p.rank} – ${p.name}` : p.name);

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
  ended:     { label: "Đã kết thúc",   color: "#595959", bg: "#f3f4f6",              border: "#e5e7eb" },
};

function StatusBadge({ status }: { status: MgStatus }) {
  const c = STATUS_CFG[status];
  return (
    <span style={{ fontSize: T.xs, fontWeight: T.fw_medium, padding: "2px 10px", borderRadius: "999px", color: c.color, background: c.bg, border: `1px solid ${c.border}` }}>
      {c.label}
    </span>
  );
}

const RESULT_CFG: Record<string, { label: string; color: string; bg: string; border: string }> = {
  pending:   { label: "Chờ xác nhận",  color: "#b45309", bg: "var(--warning-subtle)",      border: "var(--warning-border)" },
  confirmed: { label: "Đã xác nhận",   color: "#0369a1", bg: "#e0f2fe",                    border: "#bae6fd" },
  absent:    { label: "Không có mặt",  color: "#595959", bg: "#f3f4f6",                    border: "#e5e7eb" },
  delivered: { label: "Đã trao quà",   color: "#15803d", bg: "var(--success-subtle)",       border: "var(--success-border)" },
  cancelled: { label: "Đã hủy",        color: "#be123c", bg: "#fff1f2",                    border: "#fecdd3" },
};

function ResultBadge({ status }: { status: string }) {
  const c = RESULT_CFG[status] ?? RESULT_CFG.pending;
  return (
    <span style={{ fontSize: T.xs, fontWeight: T.fw_medium, padding: "2px 10px", borderRadius: "999px", color: c.color, background: c.bg, border: `1px solid ${c.border}` }}>
      {c.label}
    </span>
  );
}

const PRIZE_STATUS_CFG: Record<string, { label: string; color: string; bg: string }> = {
  pending: { label: "Chưa quay",    color: "#595959", bg: "#f3f4f6" },
  active:  { label: "Đang quay",    color: "#be123c", bg: "#fff1f2" },
  done:    { label: "Đã quay đủ",   color: "#15803d", bg: "var(--success-subtle)" },
};

// ── Public Display ─────────────────────────────────────────────────────────────
// Màn chiếu công khai phản chiếu đúng màn quay (cùng giải, cùng lượt, cùng việc
// chốt danh sách) thay vì tự quay riêng — bấm quay ở đây cũng chốt danh sách.

function PublicDisplay({ gameName, prize, poolCount, locked, spinState, lines, blockedText, onSpin, onConfirm, onRespin, onClose }: {
  gameName: string;
  prize: string;
  poolCount: number;
  locked: boolean;
  spinState: SpinState;
  /** Tên + dòng phụ, đã định dạng theo "Hiển thị người thắng". */
  lines: [string, string];
  /** Lý do chưa quay được; null = quay được. */
  blockedText: string | null;
  onSpin: () => void;
  onConfirm: () => void;
  onRespin: () => void;
  onClose: () => void;
}) {
  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 9999,
      background: "linear-gradient(160deg, #050d1f 0%, #0d1b3e 55%, #14062a 100%)",
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "space-between",
      padding: "48px 64px",
    }}>
      <style>{`
        @keyframes pd-roll { 0%{opacity:0;transform:translateY(-6px)} 40%{opacity:1;transform:translateY(0)} 80%{opacity:1} 100%{opacity:0;transform:translateY(6px)} }
        @keyframes pd-winner { from{opacity:0;transform:scale(0.92) translateY(12px)} to{opacity:1;transform:scale(1) translateY(0)} }
        @keyframes pd-glow { 0%,100%{box-shadow:0 0 40px rgba(30,170,255,0.25)} 50%{box-shadow:0 0 60px rgba(30,170,255,0.5)} }
      `}</style>

      <button onClick={onClose} aria-label="Thu nhỏ màn công khai" style={{
        position: "absolute", top: 20, right: 20,
        background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)",
        color: "rgba(255,255,255,0.5)", borderRadius: "50%",
        width: 36, height: 36, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <Minimize2 size={15} />
      </button>

      {/* Header */}
      <div style={{ textAlign: "center" }}>
        <div style={{
          display: "inline-flex", alignItems: "center", justifyContent: "center",
          width: 68, height: 68, borderRadius: "18px", marginBottom: 18,
          background: "linear-gradient(135deg, #1eaaff 0%, #7c3aed 100%)",
          boxShadow: "0 0 48px rgba(30,170,255,0.35)",
        }}>
          <Gamepad2 size={34} color="white" />
        </div>
        <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 13, letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: 10 }}>
          {gameName}
        </p>
        <h1 style={{ color: "#ffffff", fontSize: "clamp(30px, 4vw, 52px)", fontWeight: 700, margin: 0, letterSpacing: "-0.02em" }}>
          Bốc thăm may mắn
        </h1>
        <p style={{ color: "#1eaaff", fontSize: "clamp(15px, 2vw, 22px)", fontWeight: 600, marginTop: 10 }}>
          {prize}
        </p>
      </div>

      {/* Center — rolling names or winner */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 32, width: "100%", maxWidth: 560 }}>

        {/* Pool count */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, color: "rgba(255,255,255,0.35)", fontSize: 14 }}>
          {locked ? <Lock size={15} /> : <Users size={15} />}
          <span>{poolCount} người {locked ? "trong danh sách đã chốt" : "đủ điều kiện"}</span>
        </div>

        {/* Rolling box */}
        <div style={{
          width: "100%", minHeight: 160,
          background: "rgba(255,255,255,0.04)",
          border: `2px solid ${spinState === "result" ? "#1eaaff" : "rgba(255,255,255,0.08)"}`,
          borderRadius: 20,
          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
          padding: "32px 40px",
          animation: spinState === "result" ? "pd-glow 2s ease infinite" : undefined,
          transition: "border-color 0.4s",
        }}>
          {spinState === "idle" && (
            <p style={{ color: "rgba(255,255,255,0.2)", fontSize: 18, letterSpacing: "0.08em" }}>— Chờ bốc thăm —</p>
          )}
          {spinState === "spinning" && (
            <div style={{ textAlign: "center", overflow: "hidden" }}>
              <p style={{
                color: "rgba(255,255,255,0.9)", fontSize: "clamp(22px, 3.5vw, 40px)",
                fontWeight: 700, animation: "pd-roll 0.14s ease infinite",
                letterSpacing: "-0.01em",
              }}>
                {lines[0]}
              </p>
              <p style={{ color: "rgba(255,255,255,0.35)", fontSize: 15, marginTop: 6, fontFamily: "monospace" }}>
                {lines[1]}
              </p>
            </div>
          )}
          {spinState === "result" && (
            <div style={{ textAlign: "center", animation: "pd-winner 0.5s cubic-bezier(0.16,1,0.3,1)" }}>
              <p style={{ color: "#1eaaff", fontSize: 14, letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 12, fontWeight: 600 }}>
                🎉 Chúc mừng!
              </p>
              <p style={{ color: "#ffffff", fontSize: "clamp(26px, 4vw, 48px)", fontWeight: 700, marginBottom: 8, letterSpacing: "-0.02em" }}>
                {lines[0]}
              </p>
              <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 18, fontFamily: "monospace" }}>
                {lines[1]}
              </p>
            </div>
          )}
        </div>

        {/* CTAs */}
        {spinState === "idle" && (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
            <button onClick={onSpin} disabled={!!blockedText} style={{
              background: "linear-gradient(135deg, #1eaaff, #7c3aed)",
              border: "none", color: "white",
              padding: "16px 56px", borderRadius: "999px",
              fontSize: 18, fontWeight: 700, letterSpacing: "0.04em",
              boxShadow: "0 0 40px rgba(30,170,255,0.4)",
              opacity: blockedText ? 0.35 : 1,
              cursor: blockedText ? "not-allowed" : "pointer",
            }}>
              {locked ? "QUAY TIẾP" : "BẮT ĐẦU QUAY"}
            </button>
            {blockedText ? (
              <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 14, margin: 0, textAlign: "center" }}>{blockedText}</p>
            ) : !locked && (
              <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 13, margin: 0, display: "flex", alignItems: "center", gap: 6 }}>
                <Lock size={13} /> Danh sách người tham gia sẽ được chốt khi bắt đầu quay.
              </p>
            )}
          </div>
        )}
        {spinState === "spinning" && (
          <div style={{ color: "rgba(255,255,255,0.3)", fontSize: 14, display: "flex", alignItems: "center", gap: 8 }}>
            <span className="inline-block animate-spin">◌</span>
            Đang quay...
          </div>
        )}
        {spinState === "result" && (
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 10 }}>
            <button onClick={onConfirm} style={{
              background: "linear-gradient(135deg, #1eaaff, #7c3aed)", border: "none",
              color: "white", padding: "10px 28px", borderRadius: "999px",
              fontSize: 14, fontWeight: 600, cursor: "pointer",
            }}>
              Xác nhận người thắng
            </button>
            <button onClick={onRespin} style={{
              background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)",
              color: "rgba(255,255,255,0.7)", padding: "10px 28px", borderRadius: "999px",
              fontSize: 14, fontWeight: 500, cursor: "pointer",
            }}>
              Quay lại người khác
            </button>
          </div>
        )}
      </div>

      {/* Footer */}
      <p style={{ color: "rgba(255,255,255,0.18)", fontSize: 12 }}>
        Kết quả được ghi nhận trên hệ thống NetEvent
      </p>
    </div>
  );
}

// ── Operate View ───────────────────────────────────────────────────────────────
// Màn hình quay. Mở từ "Mở màn hình quay" thì danh sách chưa chốt và chưa ai trúng.
// Lần bấm "Bắt đầu quay" đầu tiên hệ thống tự chốt danh sách rồi quay luôn —
// không có bước "Khóa danh sách" riêng.

function OperateView({ game, onBack, backLabel = "Quay lại", onUpdate, onFixPrizes }: {
  game: MiniGame;
  onBack: () => void;
  backLabel?: string;
  /** Ghi tiến độ (chốt danh sách, người thắng) về chương trình để màn thiết lập khóa đúng phần. */
  onUpdate?: (g: MiniGame) => void;
  /** Về màn thiết lập để giảm số người thắng. */
  onFixPrizes?: () => void;
}) {
  const setup = game.setup ?? LEGACY_SETUP;
  const [prizes, setPrizes] = useState<Prize[]>(setup.prizes);
  const [selectedId, setSelectedId] = useState(() => (setup.prizes.find(p => p.status !== "done") ?? setup.prizes[0]).id);
  const [lockedAt, setLockedAt] = useState(game.lockedAt);
  const [lockedCount, setLockedCount] = useState(game.lockedCount);
  const [spinState, setSpinState] = useState<SpinState>("idle");
  const [displayName, setDisplayName] = useState("");
  const [displayCode, setDisplayCode] = useState("");
  const [results, setResults] = useState<SpinResult[]>(game.results ?? (game.setup ? [] : MOCK_RESULTS));
  const [showPublic, setShowPublic] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const nameIdx = useRef(0);

  const selectedPrize = prizes.find(p => p.id === selectedId) ?? prizes[0];
  const locked = !!lockedAt;
  // Trước khi chốt: số người đủ điều kiện lúc này (vẫn cập nhật). Sau khi chốt: số trong danh sách đã chốt.
  const poolCount = locked ? lockedCount : game.eligibleCount;
  const needed = winnersNeeded(prizes, setup.oncePerPerson);
  const blocked: "empty" | "shortfall" | null =
    poolCount === 0 ? "empty" : needed > poolCount ? "shortfall" : null;
  const prizeDone = selectedPrize.status === "done";
  const canSpin = !blocked && !prizeDone && spinState === "idle";
  const waitingForCheckin = setup.audience.source === "event" && setup.audience.scope === "checkedIn";
  const blockedText =
    blocked === "empty"       ? "Chưa có người đủ điều kiện để quay."
    : blocked === "shortfall" ? `Cần ${needed} người thắng nhưng chỉ có ${poolCount} người đủ điều kiện.`
    : prizeDone               ? "Giải này đã quay đủ người thắng."
    : null;
  const lines = winnerLines(displayName, displayCode, setup.winnerDisplay);

  useEffect(() => () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  }, []);

  const resetDisplay = () => { setSpinState("idle"); setDisplayName(""); setDisplayCode(""); };

  const handleSpin = () => {
    if (!canSpin) return;
    // Lượt quay đầu tiên: hệ thống chốt danh sách ngay lúc này rồi quay luôn.
    if (!locked) {
      const at = nowHHMM();
      setLockedAt(at);
      setLockedCount(game.eligibleCount);
      onUpdate?.({ ...game, status: "live", lockedAt: at, lockedCount: game.eligibleCount });
    }
    // Mỗi người chỉ trúng một lần: bỏ người đã trúng khỏi lượt quay (dữ liệu giả lập).
    const taken = new Set(results.filter(r => r.status !== "cancelled").map(r => r.winner));
    const candidates = POOL_NAMES
      .map((name, i) => ({ name, code: POOL_CODES[i % POOL_CODES.length] }))
      .filter(c => !setup.oncePerPerson || !taken.has(c.name));
    const winner = candidates[Math.floor(Math.random() * candidates.length)] ?? { name: POOL_NAMES[0], code: POOL_CODES[0] };

    setSpinState("spinning");
    nameIdx.current = 0;
    intervalRef.current = setInterval(() => {
      const i = nameIdx.current;
      setDisplayName(POOL_NAMES[i % POOL_NAMES.length]);
      setDisplayCode(POOL_CODES[i % POOL_CODES.length]);
      nameIdx.current = i + 1;
    }, 80);
    timeoutRef.current = setTimeout(() => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      setDisplayName(winner.name);
      setDisplayCode(winner.code);
      setSpinState("result");
    }, setup.spinSeconds * 1000);
  };

  const handleConfirm = () => {
    const result: SpinResult = {
      id: `r${Date.now()}`,
      time: nowHHMM(),
      prize: prizeLabel(selectedPrize),
      winner: displayName, ticketCode: displayCode,
      status: "confirmed", operator: "Bạn (Staff)",
    };
    const nextResults = [result, ...results];
    const nextPrizes = prizes.map(p => p.id !== selectedPrize.id ? p : {
      ...p,
      remaining: Math.max(0, p.remaining - 1),
      status: (p.remaining <= 1 ? "done" : "active") as Prize["status"],
    });
    setResults(nextResults);
    setPrizes(nextPrizes);
    // Giải vừa quay đủ thì chuyển sang giải kế tiếp còn suất.
    if (selectedPrize.remaining <= 1) {
      const next = nextPrizes.find(p => p.status !== "done");
      if (next) setSelectedId(next.id);
    }
    if (game.setup) {
      onUpdate?.({
        ...game, status: "live", lockedAt, lockedCount,
        winnerCount: nextResults.length, results: nextResults,
        setup: { ...game.setup, prizes: nextPrizes },
      });
    }
    resetDisplay();
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 0, height: "100%" }}>
      {showPublic && (
        <PublicDisplay
          gameName={game.name} prize={prizeLabel(selectedPrize)} poolCount={poolCount} locked={locked}
          spinState={spinState} lines={lines} blockedText={blockedText}
          onSpin={handleSpin} onConfirm={handleConfirm} onRespin={resetDisplay}
          onClose={() => setShowPublic(false)}
        />
      )}

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, marginBottom: 20 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
          <button data-pill="off" onClick={onBack} style={{ display: "flex", alignItems: "center", gap: 5, color: T.primary, background: "none", border: "none", cursor: "pointer", fontSize: T.sm, fontWeight: T.fw_medium, padding: 0, flexShrink: 0 }}>
            <ChevronLeft size={16} /> {backLabel}
          </button>
          <span style={{ color: T.border }}>·</span>
          <span style={{ fontSize: T.sm, color: T.mutedFg, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" as const }}>Màn hình quay</span>
        </div>
        <button onClick={() => setShowPublic(true)} style={{
          display: "flex", alignItems: "center", gap: 6, flexShrink: 0,
          background: T.foreground, color: T.background,
          border: "none", padding: "8px 16px", borderRadius: 10, cursor: "pointer", fontSize: T.sm, fontWeight: T.fw_medium,
        }}>
          <Maximize2 size={14} /> Mở màn công khai
        </button>
      </div>

      {/* Split layout */}
      <div className="grid grid-cols-1 lg:grid-cols-[360px_1fr] gap-5 items-start">

        {/* LEFT — Controls */}
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>

          {/* Prize list */}
          <Card style={{ padding: 0, overflow: "hidden" }}>
            <div style={{ padding: "14px 16px", borderBottom: `1px solid ${T.border}` }}>
              <SectionLabel>Danh sách giải thưởng</SectionLabel>
            </div>
            {prizes.map(p => {
              const cfg = PRIZE_STATUS_CFG[p.status];
              const active = selectedPrize.id === p.id;
              return (
                <div key={p.id} style={{
                  borderLeft: `3px solid ${active ? T.primary : "transparent"}`,
                  borderBottom: `1px solid ${T.border}`,
                }}>
                  <button
                    data-pill="off"
                    onClick={() => spinState === "idle" && p.status !== "done" && setSelectedId(p.id)}
                    style={{
                      width: "100%", display: "flex", alignItems: "center", gap: 12,
                      padding: "12px 16px", textAlign: "left", border: "none",
                      background: active ? `color-mix(in srgb, ${T.primary} 6%, ${T.background})` : T.background,
                      cursor: spinState !== "idle" || p.status === "done" ? "not-allowed" : "pointer",
                      opacity: p.status === "done" ? 0.5 : 1,
                    }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      {p.rank && <p style={{ fontSize: T.xs, color: T.mutedFg, margin: 0 }}>{p.rank}</p>}
                      <p style={{ fontSize: T.sm, fontWeight: T.fw_medium, color: T.foreground, margin: p.rank ? "2px 0 0" : 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" as const }}>{p.name}</p>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4, flexShrink: 0 }}>
                      <span style={{ fontSize: T.xs, padding: "1px 8px", borderRadius: "999px", color: cfg.color, background: cfg.bg }}>{cfg.label}</span>
                      <span style={{ fontSize: T.xs, color: T.mutedFg }}>{p.remaining}/{p.count}</span>
                    </div>
                  </button>
                </div>
              );
            })}
          </Card>

          {/* Main CTA — giải đang chọn, số người đủ điều kiện và nút quay nằm cạnh nhau */}
          <Card>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <Trophy size={14} style={{ color: T.primary, flexShrink: 0 } as React.CSSProperties} />
                  <span style={{ fontSize: T.sm, fontWeight: T.fw_medium, color: T.foreground, minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" as const }}>{prizeLabel(selectedPrize)}</span>
                  <span style={{ fontSize: T.xs, color: T.mutedFg, marginLeft: "auto", flexShrink: 0 }}>{selectedPrize.count} người thắng</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  {locked
                    ? <Lock size={14} style={{ color: T.mutedFg, flexShrink: 0 } as React.CSSProperties} />
                    : <Users size={14} style={{ color: T.primary, flexShrink: 0 } as React.CSSProperties} />}
                  <span style={{ fontSize: T.sm, color: T.foreground }}>
                    <strong style={{ fontWeight: T.fw_semi }}>{poolCount}</strong> người đủ điều kiện
                  </span>
                  <span style={{
                    marginLeft: "auto", flexShrink: 0, display: "inline-flex", alignItems: "center", gap: 5,
                    fontSize: T.xs, padding: "2px 8px", borderRadius: "999px",
                    background: locked ? T.secondary : T.successSubtle, color: locked ? T.mutedFg : T.successText,
                  }}>
                    {!locked && <span style={{ width: 6, height: 6, borderRadius: "50%", background: T.successText }} />}
                    {locked ? `Đã chốt lúc ${lockedAt}` : "Đang cập nhật"}
                  </span>
                </div>
                <p style={{ fontSize: T.xs, color: T.mutedFg, margin: 0, paddingLeft: 22 }}>{audienceLabel(setup.audience)}</p>
              </div>

              {blocked === "empty" && (
                <InlineNotice tone="info">
                  <strong style={{ fontWeight: T.fw_semi }}>Chưa có người đủ điều kiện để quay.</strong>{" "}
                  {waitingForCheckin
                    ? "Chưa có ai check-in — màn hình tự cập nhật khi có người check-in."
                    : "Danh sách tự cập nhật khi có người đăng ký hợp lệ."}
                </InlineNotice>
              )}
              {blocked === "shortfall" && (
                <InlineNotice tone="warning">
                  Cần {needed} người thắng nhưng chỉ có {poolCount} người đủ điều kiện. Giảm số người thắng để bắt đầu quay.
                  {onFixPrizes && (
                    <button data-pill="off" onClick={onFixPrizes} style={{ display: "block", marginTop: 6, padding: 0, background: "none", border: "none", cursor: "pointer", fontSize: T.xs, fontWeight: T.fw_semi, color: T.warningText, textDecoration: "underline" }}>
                      Sửa số người thắng
                    </button>
                  )}
                </InlineNotice>
              )}

              {spinState === "result" ? (
                <>
                  <button onClick={handleConfirm} style={{
                    display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                    background: T.successText, color: "#fff", border: "none", borderRadius: 12, padding: "13px",
                    fontSize: T.sm, fontWeight: T.fw_semi, cursor: "pointer",
                  }}>
                    <CheckCircle2 size={15} /> Xác nhận người thắng
                  </button>
                  <button onClick={resetDisplay} style={{
                    display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                    background: "none", color: T.mutedFg, border: `1px solid ${T.border}`, borderRadius: 12, padding: "10px",
                    fontSize: T.sm, cursor: "pointer",
                  }}>
                    <RotateCcw size={13} /> Quay lại người khác
                  </button>
                </>
              ) : (
                <>
                  <button onClick={handleSpin} disabled={!canSpin} style={{
                    display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                    background: canSpin ? T.primary : T.muted,
                    color: canSpin ? T.primaryFg : T.mutedFg,
                    border: "none", borderRadius: 12, padding: "14px",
                    fontSize: T.base, fontWeight: T.fw_semi,
                    cursor: canSpin ? "pointer" : "not-allowed",
                  }}>
                    {spinState === "spinning"
                      ? <><span className="inline-block animate-spin">◌</span> Đang quay...</>
                      : <><Play size={15} /> {locked ? "Quay tiếp" : "Bắt đầu quay"}</>}
                  </button>
                  {/* Ghi chú ngay cạnh nút — thay cho bước "Khóa danh sách" riêng */}
                  {!locked && (
                    <p style={{ display: "flex", alignItems: "flex-start", gap: 6, fontSize: T.xs, color: T.mutedFg, margin: 0, lineHeight: 1.5 }}>
                      <Lock size={12} style={{ flexShrink: 0, marginTop: 2 } as React.CSSProperties} />
                      Danh sách người tham gia sẽ được chốt khi bắt đầu quay.
                    </p>
                  )}
                  {prizeDone && !blocked && (
                    <p style={{ fontSize: T.xs, color: T.mutedFg, margin: 0 }}>Giải này đã quay đủ. Chọn giải khác trong danh sách.</p>
                  )}
                </>
              )}
            </div>
          </Card>

          {/* Recent results */}
          {results.length > 0 && (
            <Card>
              <SectionLabel>Lịch sử lượt quay</SectionLabel>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {results.slice(0, 5).map(r => (
                  <div key={r.id} style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "9px 12px", borderRadius: 10, background: T.pageSurface }}>
                    <div style={{ width: 6, height: 6, borderRadius: "50%", background: RESULT_CFG[r.status]?.color ?? T.mutedFg, flexShrink: 0, marginTop: 5 }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: T.xs, fontWeight: T.fw_medium, color: T.foreground, margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" as const }}>{r.winner}</p>
                      <p style={{ fontSize: T.xs, color: T.mutedFg, margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" as const }}>{r.prize}</p>
                    </div>
                    <span style={{ fontSize: T.xs, color: T.mutedFg, flexShrink: 0 }}>{r.time}</span>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>

        {/* RIGHT — Preview */}
        <Card style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 28, minHeight: 500, background: T.pageSurface }}>

          {/* Preview header */}
          <div style={{ textAlign: "center" }}>
            <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 52, height: 52, borderRadius: 14, marginBottom: 12, background: `linear-gradient(135deg, ${T.primary}, #7c3aed)` }}>
              <Gamepad2 size={26} color="white" />
            </div>
            <p style={{ fontSize: T.xs, color: T.mutedFg, margin: 0 }}>{game.name}</p>
            <p style={{ fontSize: T.lg, fontWeight: T.fw_semi, color: T.foreground, marginTop: 6, marginBottom: 0 }}>
              {prizeLabel(selectedPrize)}
            </p>
            <p style={{ fontSize: T.xs, color: T.mutedFg, marginTop: 4 }}>Còn lại: {selectedPrize.remaining}/{selectedPrize.count} suất</p>
          </div>

          {/* Rolling display */}
          <div style={{
            width: "100%", maxWidth: 380, minHeight: 120,
            border: `2px solid ${spinState === "result" ? T.primary : T.border}`,
            borderRadius: 16, background: T.background,
            display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
            padding: "28px 32px", textAlign: "center",
            transition: "border-color 0.3s",
          }}>
            {spinState === "idle" && (
              <p style={{ fontSize: T.sm, color: T.mutedFg }}>— Chờ bốc thăm —</p>
            )}
            {spinState === "spinning" && (
              <>
                <p style={{ fontSize: T.xl, fontWeight: T.fw_bold, color: T.foreground, margin: 0 }}>{lines[0]}</p>
                <p style={{ fontSize: T.xs, color: T.mutedFg, marginTop: 4, fontFamily: "monospace" }}>{lines[1]}</p>
              </>
            )}
            {spinState === "result" && (
              <>
                <p style={{ fontSize: T.xs, color: T.mutedFg, marginBottom: 8 }}>Người thắng</p>
                <p style={{ fontSize: T["2xl"], fontWeight: T.fw_bold, color: T.foreground, marginBottom: 4 }}>{lines[0]}</p>
                <p style={{ fontSize: T.sm, color: T.primary, fontWeight: T.fw_medium, fontFamily: "monospace" }}>{lines[1]}</p>
              </>
            )}
          </div>

          {/* Status */}
          <div style={{
            padding: "6px 18px", borderRadius: "999px", fontSize: T.xs, fontWeight: T.fw_medium,
            background: spinState === "spinning" ? "#fff1f2" : spinState === "result" ? T.successSubtle : T.secondary,
            color: spinState === "spinning" ? "#be123c" : spinState === "result" ? T.successText : T.mutedFg,
          }}>
            {spinState === "idle" ? "Đang chờ" : spinState === "spinning" ? "Đang quay" : "Chờ xác nhận"}
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 6, color: T.mutedFg, fontSize: T.xs }}>
            {locked ? <Lock size={12} /> : <Users size={12} />}
            <span>{poolCount} người · Danh sách {locked ? "đã chốt" : "chưa chốt"}</span>
          </div>
        </Card>
      </div>
    </div>
  );
}

// ── Manage sub-tabs ────────────────────────────────────────────────────────────

function OverviewSubTab({ game }: { game: MiniGame }) {
  const stats = [
    { label: "Số người tham gia",  value: game.eligibleCount, color: T.primary },
    { label: "Tổng giải thưởng",   value: game.prizeCount,    color: "#d97706" },
    { label: "Người đã trúng",     value: game.winnerCount,   color: T.successText },
  ];
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {stats.map(s => (
          <Card key={s.label}>
            <p style={{ fontSize: T.xs, color: T.mutedFg, marginBottom: 6 }}>{s.label}</p>
            <p style={{ fontSize: T["2xl"], fontWeight: T.fw_bold, color: s.color }}>{s.value}</p>
          </Card>
        ))}
      </div>
      <Card>
        <SectionLabel>Giải thưởng</SectionLabel>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {MOCK_PRIZES.map(p => {
            const cfg = PRIZE_STATUS_CFG[p.status];
            return (
              <div key={p.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 14px", borderRadius: 10, background: T.pageSurface }}>
                <Trophy size={14} style={{ color: T.primary, flexShrink: 0 } as React.CSSProperties} />
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: T.sm, fontWeight: T.fw_medium, color: T.foreground, margin: 0 }}>{p.rank} · {p.name}</p>
                </div>
                <span style={{ fontSize: T.xs, color: T.mutedFg }}>{p.remaining}/{p.count}</span>
                <span style={{ fontSize: T.xs, fontWeight: T.fw_medium, padding: "2px 10px", borderRadius: "999px", color: cfg.color, background: cfg.bg }}>{cfg.label}</span>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}

function ResultsSubTab() {
  const [results, setResults] = useState<SpinResult[]>(MOCK_RESULTS);
  const [search, setSearch] = useState("");
  const [filterPrize, setFilterPrize] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [confirmModal, setConfirmModal] = useState<SpinResult | null>(null);

  const filtered = results.filter(r => {
    const matchSearch = !search || r.winner.toLowerCase().includes(search.toLowerCase()) || r.ticketCode.includes(search);
    const matchPrize  = filterPrize === "all" || r.prize.includes(filterPrize);
    const matchStatus = filterStatus === "all" || r.status === filterStatus;
    return matchSearch && matchPrize && matchStatus;
  });

  const handleDeliver = (id: string) => {
    setResults(prev => prev.map(r => r.id === id ? { ...r, status: "delivered" as const, confirmedBy: "Bạn (Admin)" } : r));
    setConfirmModal(null);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      {confirmModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.35)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Card style={{ maxWidth: 420, width: "100%", margin: "0 16px" }}>
            <h3 style={{ fontSize: T.lg, fontWeight: T.fw_semi, color: T.foreground, marginBottom: 8 }}>Xác nhận đã trao quà</h3>
            <p style={{ fontSize: T.sm, color: T.mutedFg, marginBottom: 20 }}>
              Bạn chắc chắn đã trao <strong>{confirmModal.prize}</strong> cho <strong>{confirmModal.winner}</strong>?
            </p>
            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
              <Button variant="outline" onClick={() => setConfirmModal(null)}>Hủy</Button>
              <Button onClick={() => handleDeliver(confirmModal.id)}>Xác nhận đã trao</Button>
            </div>
          </Card>
        </div>
      )}

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
        <div style={{ position: "relative", flex: 1 }}>
          <Search size={13} style={{ position: "absolute", left: 11, top: "50%", transform: "translateY(-50%)", color: T.mutedFg } as React.CSSProperties} />
          <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Tên người thắng, mã vé..." style={{ paddingLeft: 34 }} />
        </div>
        <div className="flex gap-2 flex-wrap">
          <select value={filterPrize} onChange={e => setFilterPrize(e.target.value)} style={{ fontSize: T.sm, color: T.foreground, background: T.background, border: `1px solid ${T.border}`, borderRadius: 10, padding: "8px 12px", cursor: "pointer", flex: 1 }}>
            <option value="all">Tất cả giải</option>
            {MOCK_PRIZES.map(p => <option key={p.id} value={p.name}>{p.rank}</option>)}
          </select>
          <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} style={{ fontSize: T.sm, color: T.foreground, background: T.background, border: `1px solid ${T.border}`, borderRadius: 10, padding: "8px 12px", cursor: "pointer", flex: 1 }}>
            <option value="all">Tất cả trạng thái</option>
            <option value="pending">Chờ xác nhận</option>
            <option value="confirmed">Đã xác nhận</option>
            <option value="absent">Không có mặt</option>
            <option value="delivered">Đã trao quà</option>
            <option value="cancelled">Đã hủy</option>
          </select>
          <Button variant="outline" style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <Download size={13} /> Export CSV
          </Button>
        </div>
      </div>

      <Card style={{ padding: 0, overflow: "hidden" }}>
        <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 520 }}>
          <thead>
            <tr style={{ borderBottom: `1px solid ${T.border}` }}>
              {["Thời gian", "Giải thưởng", "Người thắng", "Mã vé", "Vận hành"].map(h => (
                <th key={h} style={{ padding: "10px 16px", textAlign: "left" as const, fontSize: T.xs, fontWeight: T.fw_semi, color: T.mutedFg, whiteSpace: "nowrap" as const }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={5} style={{ padding: "32px 16px", textAlign: "center" as const, fontSize: T.sm, color: T.mutedFg }}>Không có kết quả</td></tr>
            ) : filtered.map((r, i) => (
              <tr key={r.id} style={{ borderBottom: i < filtered.length - 1 ? `1px solid ${T.border}` : "none" }}>
                <td style={{ padding: "11px 16px", fontSize: T.xs, color: T.mutedFg, whiteSpace: "nowrap" as const }}>{r.time}</td>
                <td style={{ padding: "11px 16px", fontSize: T.xs, color: T.foreground, maxWidth: 180, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" as const }}>{r.prize}</td>
                <td style={{ padding: "11px 16px", fontSize: T.sm, fontWeight: T.fw_medium, color: T.foreground, whiteSpace: "nowrap" as const }}>{r.winner}</td>
                <td style={{ padding: "11px 16px", fontSize: T.xs, color: T.mutedFg, fontFamily: "monospace" }}>{r.ticketCode}</td>
                <td style={{ padding: "11px 16px", fontSize: T.xs, color: T.mutedFg, whiteSpace: "nowrap" as const }}>{r.operator}</td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      </Card>
    </div>
  );
}

function ConfigSubTab() {
  const [participants, setParticipants] = useState(MOCK_PARTICIPANTS);
  const [prizes, setPrizes] = useState(MOCK_PRIZES);
  const [search, setSearch] = useState("");
  const [editingPrize, setEditingPrize] = useState<Prize | null>(null);
  const [editDraft, setEditDraft] = useState<Prize | null>(null);
  const filtered = search ? participants.filter(p => p.name.toLowerCase().includes(search.toLowerCase()) || p.ticketCode.includes(search)) : participants;
  const eligible = participants.filter(p => !p.excluded).length;

  const addPrize = () => setPrizes(prev => [...prev, { id: `np${Date.now()}`, rank: `Giải ${prev.length + 1}`, name: "", count: 1, remaining: 1, status: "pending" as const }]);
  const removePrize = (id: string) => setPrizes(prev => prev.filter(p => p.id !== id));

  const openEdit = (p: Prize) => { setEditingPrize(p); setEditDraft({ ...p }); };
  const saveEdit = () => {
    if (!editDraft) return;
    setPrizes(prev => prev.map(p => p.id === editDraft.id ? editDraft : p));
    setEditingPrize(null); setEditDraft(null);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Participants */}
      <Card>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
          <p style={{ fontSize: T.sm, fontWeight: T.fw_semi, color: T.foreground, margin: 0 }}>Người tham gia</p>
        </div>
        <div style={{ position: "relative", marginBottom: 12, maxWidth: 320 }}>
          <Search size={13} style={{ position: "absolute", left: 11, top: "50%", transform: "translateY(-50%)", color: T.mutedFg } as React.CSSProperties} />
          <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Tìm theo tên hoặc mã vé..." style={{ paddingLeft: 34 }} />
        </div>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: `1px solid ${T.border}` }}>
                {["Người tham dự", "Mã vé", "Hạng vé"].map(h => (
                  <th key={h} style={{ padding: "8px 14px", textAlign: "left" as const, fontSize: T.xs, fontWeight: T.fw_semi, color: T.mutedFg, whiteSpace: "nowrap" as const }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((p, i) => (
                <tr key={p.id} style={{ borderBottom: i < filtered.length - 1 ? `1px solid ${T.border}` : "none" }}>
                  <td style={{ padding: "10px 14px", fontSize: T.sm, fontWeight: T.fw_medium, color: T.foreground }}>{p.name}</td>
                  <td style={{ padding: "10px 14px", fontSize: T.xs, color: T.mutedFg, fontFamily: "monospace" }}>{p.ticketCode}</td>
                  <td style={{ padding: "10px 14px" }}>
                    <span style={{ fontSize: T.xs, padding: "2px 8px", borderRadius: "999px", background: T.secondary, color: T.foreground }}>{p.ticketType}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Prizes */}
      <Card>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
          <p style={{ fontSize: T.sm, fontWeight: T.fw_semi, color: T.foreground, margin: 0 }}>Giải thưởng</p>
          <Button variant="outline" onClick={() => {
            const np = { id: `np${Date.now()}`, rank: `Giải ${prizes.length + 1}`, name: "", count: 1, remaining: 1, status: "pending" as const };
            setPrizes(prev => [...prev, np]);
            setEditingPrize(np);
            setEditDraft({ ...np });
          }} style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <Plus size={13} /> Thêm giải
          </Button>
        </div>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: `1px solid ${T.border}` }}>
              {["Hạng giải", "Phần thưởng", "Số lượng", "Trạng thái", ""].map((h, i) => (
                <th key={i} style={{ padding: "8px 14px", textAlign: "left" as const, fontSize: T.xs, fontWeight: T.fw_semi, color: T.mutedFg, ...(i === 4 ? { width: "1%", whiteSpace: "nowrap" as const } : {}) }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {prizes.map((p, i) => {
              const cfg = PRIZE_STATUS_CFG[p.status];
              return (
                <tr key={p.id} style={{ borderBottom: i < prizes.length - 1 ? `1px solid ${T.border}` : "none" }}>
                  <td style={{ padding: "11px 14px", fontSize: T.sm, fontWeight: T.fw_medium, color: T.foreground }}>{p.rank}</td>
                  <td style={{ padding: "11px 14px", fontSize: T.sm, color: T.foreground }}>{p.name || <span style={{ color: T.mutedFg }}>—</span>}</td>
                  <td style={{ padding: "11px 14px", fontSize: T.sm, color: T.foreground }}>{p.count}</td>
                  <td style={{ padding: "11px 14px" }}>
                    <span style={{ fontSize: T.xs, fontWeight: T.fw_medium, padding: "2px 10px", borderRadius: "999px", color: cfg.color, background: cfg.bg }}>{cfg.label}</span>
                  </td>
                  <td style={{ padding: "11px 14px", width: "1%", whiteSpace: "nowrap" as const }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <button onClick={() => openEdit(p)} style={{ fontSize: T.xs, padding: "4px 12px", borderRadius: 7, border: `1px solid ${T.border}`, background: T.background, color: T.foreground, cursor: "pointer" }}>
                        Chỉnh sửa
                      </button>
                      {prizes.length > 1 && (
                        <button onClick={() => removePrize(p.id)} style={{ background: "none", border: "none", cursor: "pointer", color: T.mutedFg }}><Trash2 size={13} /></button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Card>

      {/* Edit prize modal */}
      {editingPrize && editDraft && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.35)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100 }}
          onClick={e => { if (e.target === e.currentTarget) { setEditingPrize(null); setEditDraft(null); } }}>
          <div style={{ background: T.background, borderRadius: 18, padding: 28, width: 420, boxShadow: "0 16px 48px rgba(0,0,0,0.18)", display: "flex", flexDirection: "column", gap: 18 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <p style={{ fontSize: T.base, fontWeight: T.fw_semi, color: T.foreground, margin: 0 }}>Chỉnh sửa giải thưởng</p>
              <button onClick={() => { setEditingPrize(null); setEditDraft(null); }} style={{ background: "none", border: "none", cursor: "pointer", color: T.mutedFg, padding: 4 }}><X size={16} /></button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div>
                <Label>Hạng giải</Label>
                <Input value={editDraft.rank} onChange={e => setEditDraft(d => d ? { ...d, rank: e.target.value } : d)} style={{ marginTop: 6 }} />
              </div>
              <div>
                <Label>Tên phần thưởng</Label>
                <Input value={editDraft.name} onChange={e => setEditDraft(d => d ? { ...d, name: e.target.value } : d)} placeholder="Tên phần thưởng" style={{ marginTop: 6 }} />
              </div>
              <div>
                <Label>Số lượng người thắng</Label>
                <Input type="number" min={1} value={editDraft.count} onChange={e => setEditDraft(d => d ? { ...d, count: Number(e.target.value) } : d)} style={{ marginTop: 6, maxWidth: 120 }} />
              </div>
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 4 }}>
              <Button variant="outline" onClick={() => { setEditingPrize(null); setEditDraft(null); }}>Hủy</Button>
              <Button onClick={saveEdit}>Lưu</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function AuditSubTab() {
  return (
    <Card style={{ padding: 0, overflow: "hidden" }}>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ borderBottom: `1px solid ${T.border}` }}>
            {["Thời gian", "Hành động", "Người thực hiện"].map(h => (
              <th key={h} style={{ padding: "10px 16px", textAlign: "left" as const, fontSize: T.xs, fontWeight: T.fw_semi, color: T.mutedFg }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {MOCK_AUDIT.map((a, i) => (
            <tr key={a.id} style={{ borderBottom: i < MOCK_AUDIT.length - 1 ? `1px solid ${T.border}` : "none" }}>
              <td style={{ padding: "11px 16px", fontSize: T.xs, color: T.mutedFg, whiteSpace: "nowrap" as const }}>{a.time}</td>
              <td style={{ padding: "11px 16px", fontSize: T.sm, color: T.foreground }}>{a.action}</td>
              <td style={{ padding: "11px 16px", fontSize: T.sm, color: T.mutedFg }}>{a.user}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  );
}

// ── Manage View ────────────────────────────────────────────────────────────────

const MANAGE_TABS: { id: ManageSubTab; label: string; icon: React.FC<{ size?: number }> }[] = [
  { id: "overview", label: "Tổng quan",  icon: BarChart3 },
  { id: "operate",  label: "Vận hành",   icon: Play },
  { id: "results",  label: "Kết quả",    icon: Award },
  { id: "config",   label: "Cấu hình",   icon: Settings },
  { id: "audit",    label: "Nhật ký",    icon: ClipboardList },
];

function ManageView({ game, onBack, onOperate }: { game: MiniGame; onBack: () => void; onOperate: () => void }) {
  const [subTab, setSubTab] = useState<ManageSubTab>("overview");

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16 }}>
        <div>
          <button onClick={onBack} style={{ display: "flex", alignItems: "center", gap: 5, color: T.primary, background: "none", border: "none", cursor: "pointer", fontSize: T.sm, fontWeight: T.fw_medium, marginBottom: 8, padding: 0 }}>
            <ChevronLeft size={15} /> Danh sách mini game
          </button>
          <h2 style={{ fontSize: T.xl, fontWeight: T.fw_semi, color: T.foreground, margin: 0 }}>{game.name}</h2>
          <p style={{ fontSize: T.xs, color: T.mutedFg, marginTop: 4 }}>{game.startTime} – {game.endTime}</p>
        </div>
        <Button onClick={onOperate} style={{ display: "flex", alignItems: "center", gap: 7, flexShrink: 0, background: T.successSubtle, color: T.successText, border: `1px solid ${T.successBorder}` }}>
          <Zap size={14} /> Vận hành
        </Button>
      </div>

      {/* Sub-tabs */}
      <div style={{ display: "flex", gap: 2, borderBottom: `1px solid ${T.border}`, overflowX: "auto", scrollbarWidth: "none" }}>
        {MANAGE_TABS.map(tab => {
          const Icon = tab.icon;
          const active = subTab === tab.id;
          return (
            <div key={tab.id} style={{
              borderBottom: `2px solid ${active ? T.primary : "transparent"}`,
              marginBottom: -1,
            }}>
              <button onClick={() => setSubTab(tab.id)} style={{
                display: "flex", alignItems: "center", gap: 6, padding: "8px 14px",
                border: "none",
                color: active ? T.primary : T.mutedFg,
                fontWeight: active ? T.fw_medium : T.fw_normal,
                fontSize: T.sm, background: "none", cursor: "pointer",
                whiteSpace: "nowrap" as const,
              }}>
                <Icon size={14} /> {tab.label}
              </button>
            </div>
          );
        })}
      </div>

      {subTab === "overview" && <OverviewSubTab game={game} />}
      {subTab === "operate"  && <OperateView game={game} onBack={() => setSubTab("overview")} />}
      {subTab === "results"  && <ResultsSubTab />}
      {subTab === "config"   && <ConfigSubTab />}
      {subTab === "audit"    && <AuditSubTab />}
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
    <div style={{ display: "flex", flexDirection: "column", gap: 16, maxWidth: 760 }}>

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

function MgListView({ games, onCreate, onManage, onOperate, onSetup }: {
  games: MiniGame[];
  onCreate: () => void;
  onManage: (g: MiniGame) => void;
  onOperate: (g: MiniGame) => void;
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
            // Chương trình tạo theo luồng mới: sửa ở màn thiết lập, quay ở màn hình quay.
            const fromSetup = !!game.setup;
            const meta = ["Bốc thăm may mắn", game.participantSource, fromSetup ? `${game.prizeCount} giải` : game.startTime]
              .filter(Boolean).join(" · ");
            return (
              <Card key={game.id} style={{ padding: "14px 16px" }}>
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-5">

                  {/* Identity row (icon + text) */}
                  <div style={{ display: "flex", alignItems: "center", gap: 12, flex: 1, minWidth: 0 }}>
                    <div style={{ width: 40, height: 40, borderRadius: 10, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", background: `linear-gradient(135deg, ${T.primary}, #7c3aed)` }}>
                      <Gamepad2 size={20} color="white" />
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 0 }}>
                        <p style={{ fontSize: T.sm, fontWeight: T.fw_semi, color: T.foreground, margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" as const }}>{game.name}</p>
                        <span style={{ flexShrink: 0, whiteSpace: "nowrap" as const }}><StatusBadge status={game.status} /></span>
                      </div>
                      <p style={{ fontSize: T.xs, color: T.mutedFg, margin: "2px 0 0", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" as const }}>{meta}</p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 shrink-0">
                    {fromSetup ? (
                      <>
                        <Button variant="outline" size="sm" onClick={() => onSetup(game)}>
                          Thiết lập
                        </Button>
                        <Button size="sm" onClick={() => onOperate(game)} style={{ background: T.successSubtle, color: T.successText, border: `1px solid ${T.successBorder}` }}>
                          <Play size={13} /> Mở màn hình quay
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button variant="outline" size="sm" onClick={() => onManage(game)}>
                          Quản lý
                        </Button>
                        <Button size="sm" onClick={() => onOperate(game)} style={{ background: T.successSubtle, color: T.successText, border: `1px solid ${T.successBorder}` }}>
                          <Zap size={13} /> Vận hành
                        </Button>
                      </>
                    )}
                  </div>

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
  // Sự kiện nháp chưa có ai đăng ký hay check-in (AttendeesTab cũng chỉ có dữ liệu
  // khi sự kiện đã xuất bản) — đây là cách xem trường hợp "chưa có ai check-in".
  const pool = event?.status === "draft" ? TIER_POOL.map(t => ({ ...t, checkedIn: 0, registered: 0 })) : TIER_POOL;
  const [games, setGames] = useState<MiniGame[]>([MOCK_GAME]);
  const [view, setView] = useState<MgView>("list");
  const [selectedId, setSelectedId] = useState<string | null>(MOCK_GAME.id);
  const [setupFocus, setSetupFocus] = useState<SetupFocus | undefined>();
  // Màn quay mở từ đâu thì "Quay lại" về đó.
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
    return <ManageView game={selected} onBack={() => setView("list")} onOperate={() => openDraw(selected, "manage")} />;
  }
  if (view === "operate" && selected) {
    const backToSetup = operateFrom === "setup";
    return (
      <OperateView
        key={selected.id}
        game={selected}
        backLabel={backToSetup ? "Quay lại thiết lập" : "Quay lại"}
        onBack={() => (backToSetup ? openSetup(selected) : setView(operateFrom))}
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
      onOperate={g => openDraw(g, g.setup ? "list" : "manage")}
      onSetup={g => openSetup(g)}
    />
  );
}

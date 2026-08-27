import * as React from "react";
import { useState, useEffect, useRef } from "react";
import {
  ChevronLeft, Plus, Trophy, Users, Lock,
  Play, RotateCcw, CheckCircle2, BarChart3,
  Download, Search, Check, X, AlertCircle,
  Maximize2, Award, Trash2, UserCheck, Gamepad2,
  ClipboardList, Minimize2, Zap, GripVertical, Settings,
  ChevronDown, Filter
} from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
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

type MgStatus = "draft" | "scheduled" | "live" | "paused" | "ended";
type MgView   = "list" | "create" | "manage" | "operate";
type ManageSubTab = "overview" | "operate" | "results" | "config" | "audit";
type SpinState    = "idle" | "spinning" | "result" | "absent";

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
}

// ── Mock data ─────────────────────────────────────────────────────────────────

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
  { id: "a3",  action: "Xuất bản chương trình",                             user: "Admin",          time: "14:30 · 29/06" },
  { id: "a4",  action: "Khóa danh sách quay (138 người)",                   user: "Trần Staff A",   time: "17:55 · 29/06" },
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

const STATUS_CFG: Record<MgStatus, { label: string; color: string; bg: string; border: string }> = {
  draft:     { label: "Bản nháp",      color: "#595959", bg: "#f3f4f6",              border: "#e5e7eb" },
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

function PublicDisplay({ game, onClose }: { game: MiniGame; onClose: () => void }) {
  const [spinState, setSpinState] = useState<SpinState>("idle");
  const [displayName, setDisplayName] = useState("");
  const [displayCode, setDisplayCode] = useState("");
  const [currentPrize] = useState(MOCK_PRIZES[1]);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const nameIdx = useRef(0);

  const handleSpin = () => {
    setSpinState("spinning");
    nameIdx.current = 0;
    intervalRef.current = setInterval(() => {
      const i = nameIdx.current;
      setDisplayName(POOL_NAMES[i % POOL_NAMES.length]);
      setDisplayCode(POOL_CODES[i % POOL_CODES.length]);
      nameIdx.current = i + 1;
    }, 70);
    setTimeout(() => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      setDisplayName("Trần Thị Cúc");
      setDisplayCode("NE-2025-00089");
      setSpinState("result");
    }, 4000);
  };

  const handleReset = () => { setSpinState("idle"); setDisplayName(""); setDisplayCode(""); };

  useEffect(() => () => { if (intervalRef.current) clearInterval(intervalRef.current); }, []);

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

      <button onClick={onClose} style={{
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
          {game.name}
        </p>
        <h1 style={{ color: "#ffffff", fontSize: "clamp(30px, 4vw, 52px)", fontWeight: 700, margin: 0, letterSpacing: "-0.02em" }}>
          Bốc thăm may mắn
        </h1>
        <p style={{ color: "#1eaaff", fontSize: "clamp(15px, 2vw, 22px)", fontWeight: 600, marginTop: 10 }}>
          {currentPrize.rank} · {currentPrize.name}
        </p>
      </div>

      {/* Center — rolling names or winner */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 32, width: "100%", maxWidth: 560 }}>

        {/* Pool count */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, color: "rgba(255,255,255,0.35)", fontSize: 14 }}>
          <Users size={15} />
          <span>{game.lockedCount} người trong danh sách quay</span>
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
                {displayName}
              </p>
              <p style={{ color: "rgba(255,255,255,0.35)", fontSize: 15, marginTop: 6, fontFamily: "monospace" }}>
                {displayCode}
              </p>
            </div>
          )}
          {spinState === "result" && (
            <div style={{ textAlign: "center", animation: "pd-winner 0.5s cubic-bezier(0.16,1,0.3,1)" }}>
              <p style={{ color: "#1eaaff", fontSize: 14, letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 12, fontWeight: 600 }}>
                🎉 Chúc mừng!
              </p>
              <p style={{ color: "#ffffff", fontSize: "clamp(26px, 4vw, 48px)", fontWeight: 700, marginBottom: 8, letterSpacing: "-0.02em" }}>
                {displayName}
              </p>
              <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 18, fontFamily: "monospace" }}>
                {displayCode}
              </p>
            </div>
          )}
        </div>

        {/* CTAs */}
        {spinState === "idle" && (
          <button onClick={handleSpin} style={{
            background: "linear-gradient(135deg, #1eaaff, #7c3aed)",
            border: "none", color: "white",
            padding: "16px 56px", borderRadius: "999px",
            fontSize: 18, fontWeight: 700, cursor: "pointer",
            letterSpacing: "0.04em",
            boxShadow: "0 0 40px rgba(30,170,255,0.4)",
          }}>
            BẮT ĐẦU BỐC THĂM
          </button>
        )}
        {spinState === "spinning" && (
          <div style={{ color: "rgba(255,255,255,0.3)", fontSize: 14, display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ display: "inline-block", animation: "spin 1s linear infinite" }}>◌</span>
            Đang bốc thăm...
          </div>
        )}
        {spinState === "result" && (
          <button onClick={handleReset} style={{
            background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)",
            color: "rgba(255,255,255,0.7)", padding: "10px 32px", borderRadius: "999px",
            fontSize: 14, fontWeight: 500, cursor: "pointer",
          }}>
            Quay lại
          </button>
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

function OperateView({ game, onBack }: { game: MiniGame; onBack: () => void }) {
  const [prizes, setPrizes] = useState(MOCK_PRIZES);
  const [selectedPrize, setSelectedPrize] = useState(MOCK_PRIZES[1]);
  const [listLocked, setListLocked] = useState(true);
  const [spinState, setSpinState] = useState<SpinState>("idle");
  const [displayName, setDisplayName] = useState("");
  const [displayCode, setDisplayCode] = useState("");
  const [results, setResults] = useState<SpinResult[]>(MOCK_RESULTS);
  const [showPublic, setShowPublic] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const nameIdx = useRef(0);

  const handleSpin = () => {
    if (!listLocked) return;
    setSpinState("spinning");
    nameIdx.current = 0;
    intervalRef.current = setInterval(() => {
      const i = nameIdx.current;
      setDisplayName(POOL_NAMES[i % POOL_NAMES.length]);
      setDisplayCode(POOL_CODES[i % POOL_CODES.length]);
      nameIdx.current = i + 1;
    }, 80);
    setTimeout(() => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      setDisplayName("Phạm Thị Hoa");
      setDisplayCode("NE-2025-00317");
      setSpinState("result");
    }, 3200);
  };

  const handleConfirm = () => {
    const newResult: SpinResult = {
      id: `r${Date.now()}`,
      time: new Date().toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" }),
      prize: `${selectedPrize.rank} – ${selectedPrize.name}`,
      winner: displayName, ticketCode: displayCode,
      status: "confirmed", operator: "Bạn (Staff)",
    };
    setResults(prev => [newResult, ...prev]);
    setPrizes(prev => prev.map(p => p.id === selectedPrize.id
      ? { ...p, remaining: Math.max(0, p.remaining - 1), status: p.remaining - 1 <= 0 ? "done" : "active" }
      : p));
    const updated = { ...selectedPrize, remaining: Math.max(0, selectedPrize.remaining - 1) };
    setSelectedPrize(updated);
    setSpinState("idle");
    setDisplayName(""); setDisplayCode("");
  };

  const handleAbsent = () => {
    setSpinState("idle");
    setDisplayName(""); setDisplayCode("");
  };

  useEffect(() => () => { if (intervalRef.current) clearInterval(intervalRef.current); }, []);

  const prizeStatusCfg = PRIZE_STATUS_CFG;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 0, height: "100%" }}>
      {showPublic && <PublicDisplay game={game} onClose={() => setShowPublic(false)} />}

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <button onClick={onBack} style={{ display: "flex", alignItems: "center", gap: 5, color: T.primary, background: "none", border: "none", cursor: "pointer", fontSize: T.sm, fontWeight: T.fw_medium }}>
            <ChevronLeft size={16} /> Quay lại
          </button>
          <span style={{ color: T.border }}>·</span>
          <span style={{ fontSize: T.sm, color: T.mutedFg }}>Vận hành bốc thăm</span>
        </div>
        <button onClick={() => setShowPublic(true)} style={{
          display: "flex", alignItems: "center", gap: 6,
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
              const cfg = prizeStatusCfg[p.status];
              const active = selectedPrize.id === p.id;
              return (
                <div key={p.id} style={{
                  borderLeft: `3px solid ${active ? T.primary : "transparent"}`,
                  borderBottom: `1px solid ${T.border}`,
                }}>
                  <button
                    onClick={() => spinState === "idle" && p.status !== "done" && setSelectedPrize(p)}
                    style={{
                      width: "100%", display: "flex", alignItems: "center", gap: 12,
                      padding: "12px 16px", textAlign: "left", border: "none",
                      background: active ? `color-mix(in srgb, ${T.primary} 6%, ${T.background})` : T.background,
                      cursor: spinState !== "idle" || p.status === "done" ? "not-allowed" : "pointer",
                      opacity: p.status === "done" ? 0.5 : 1,
                    }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: T.xs, color: T.mutedFg, margin: 0 }}>{p.rank}</p>
                      <p style={{ fontSize: T.sm, fontWeight: T.fw_medium, color: T.foreground, margin: "2px 0 0", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" as const }}>{p.name}</p>
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


          {/* Main CTA */}
          <Card>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {spinState === "result" ? (
                <>
                  <button onClick={handleConfirm} style={{
                    display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                    background: T.successText, color: "#fff", border: "none", borderRadius: 12, padding: "13px",
                    fontSize: T.sm, fontWeight: T.fw_semi, cursor: "pointer",
                  }}>
                    <CheckCircle2 size={15} /> Xác nhận người thắng
                  </button>
<button onClick={() => { setSpinState("idle"); setDisplayName(""); setDisplayCode(""); }} style={{
                    display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                    background: "none", color: T.mutedFg, border: `1px solid ${T.border}`, borderRadius: 12, padding: "10px",
                    fontSize: T.sm, cursor: "pointer",
                  }}>
                    <RotateCcw size={13} /> Quay lại người khác
                  </button>
                </>
              ) : (
                <button onClick={handleSpin}
                  disabled={!listLocked || spinState === "spinning" || selectedPrize.status === "done"}
                  style={{
                    display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                    background: listLocked && spinState === "idle" && selectedPrize.status !== "done" ? T.primary : T.muted,
                    color: listLocked && spinState === "idle" && selectedPrize.status !== "done" ? T.primaryFg : T.mutedFg,
                    border: "none", borderRadius: 12, padding: "14px",
                    fontSize: T.base, fontWeight: T.fw_semi,
                    cursor: listLocked && spinState === "idle" && selectedPrize.status !== "done" ? "pointer" : "not-allowed",
                  }}>
                  {spinState === "spinning"
                    ? <><span style={{ display: "inline-block", animation: "spin 1s linear infinite" }}>◌</span> Đang bốc thăm...</>
                    : <><Play size={15} /> Bắt đầu bốc thăm</>}
                </button>
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
            <p style={{ fontSize: T.xs, color: T.mutedFg, letterSpacing: "0.08em", textTransform: "uppercase" as const, margin: 0 }}>Bốc thăm may mắn</p>
            <p style={{ fontSize: T.lg, fontWeight: T.fw_semi, color: T.foreground, marginTop: 6, marginBottom: 0 }}>
              {selectedPrize.rank} · {selectedPrize.name}
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
                <p style={{ fontSize: T.xl, fontWeight: T.fw_bold, color: T.foreground, margin: 0 }}>{displayName}</p>
                <p style={{ fontSize: T.xs, color: T.mutedFg, marginTop: 4, fontFamily: "monospace" }}>{displayCode}</p>
              </>
            )}
            {spinState === "result" && (
              <>
                <p style={{ fontSize: T.xs, color: T.mutedFg, marginBottom: 8 }}>Người thắng</p>
                <p style={{ fontSize: T["2xl"], fontWeight: T.fw_bold, color: T.foreground, marginBottom: 4 }}>{displayName}</p>
                <p style={{ fontSize: T.sm, color: T.primary, fontWeight: T.fw_medium, fontFamily: "monospace" }}>{displayCode}</p>
              </>
            )}
          </div>

          {/* Status */}
          <div style={{
            padding: "6px 18px", borderRadius: "999px", fontSize: T.xs, fontWeight: T.fw_medium,
            background: spinState === "spinning" ? "#fff1f2" : spinState === "result" ? T.successSubtle : T.secondary,
            color: spinState === "spinning" ? "#be123c" : spinState === "result" ? T.successText : T.mutedFg,
          }}>
            {spinState === "idle" ? "Đang chờ" : spinState === "spinning" ? "Đang bốc thăm" : "Chờ xác nhận"}
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 6, color: T.mutedFg, fontSize: T.xs }}>
            <Users size={12} />
            <span>{game.lockedCount} người · Danh sách {listLocked ? "đã khóa" : "chưa khóa"}</span>
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

// ── Publish Modal ──────────────────────────────────────────────────────────────

function PublishModal({ form, source, prizes, winnerDisplay, onClose, onPublish }: {
  form: { name: string; description: string };
  source: string;
  prizes: Array<{ id: string; name: string; count: number }>;
  winnerDisplay: string;
  onClose: () => void;
  onPublish: () => void;
}) {
  const [checklist, setChecklist] = useState([false, false, false]);
  const allChecked = checklist.every(Boolean);
  const totalPrizes = prizes.reduce((s, p) => s + p.count, 0);
  const sourceCount: Record<string, number> = { checkin: 138, registered: 328, ticket_type: 87, manual: 0 };

  const WINNER_DISPLAY_LABELS: Record<string, string> = {
    full: "Họ tên + Mã vé",
    partial: "Họ tên rút gọn + 4 số cuối SĐT",
    code: "Mã vé",
  };

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.35)", zIndex: 300, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
      <Card style={{ maxWidth: 520, width: "100%" }}>
        <h3 style={{ fontSize: T.xl, fontWeight: T.fw_semi, color: T.foreground, marginBottom: 6 }}>Xuất bản chương trình</h3>
        <p style={{ fontSize: T.sm, color: T.mutedFg, marginBottom: 20 }}>Kiểm tra lại thông tin trước khi xuất bản.</p>

        {/* Summary */}
        <div style={{ background: T.pageSurface, borderRadius: 12, padding: "14px 16px", marginBottom: 20, display: "flex", flexDirection: "column", gap: 10 }}>
          {[
            { label: "Tên chương trình",        value: form.name || "—" },
            { label: "Nguồn người tham gia",     value: source === "checkin" ? "Người đã check-in" : source === "registered" ? "Người đã đăng ký" : source === "ticket_type" ? "Theo hạng vé" : "Import thủ công" },
            { label: "Số người đủ điều kiện",    value: `${sourceCount[source] ?? 0} người` },
            { label: "Tổng giải thưởng",         value: `${prizes.length} hạng · ${totalPrizes} suất` },
            { label: "Cách hiển thị người thắng",value: WINNER_DISPLAY_LABELS[winnerDisplay] ?? winnerDisplay },
          ].map(row => (
            <div key={row.label} style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
              <span style={{ fontSize: T.sm, color: T.mutedFg }}>{row.label}</span>
              <span style={{ fontSize: T.sm, fontWeight: T.fw_medium, color: T.foreground, textAlign: "right" as const }}>{row.value}</span>
            </div>
          ))}
        </div>

        {/* Checklist */}
        <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 24 }}>
          {[
            "Tôi xác nhận danh sách người tham gia và thể lệ quay thưởng đã được chuẩn bị đầy đủ",
            "Tôi xác nhận chương trình được vận hành công khai trong lúc sự kiện diễn ra",
            "Tôi xác nhận organizer chịu trách nhiệm về điều kiện pháp lý của chương trình",
          ].map((text, i) => (
            <label key={i} style={{
              display: "flex", alignItems: "flex-start", gap: 10, cursor: "pointer",
              padding: "10px 12px", borderRadius: 10,
              background: checklist[i] ? T.successSubtle : T.pageSurface,
              border: `1px solid ${checklist[i] ? T.successBorder : T.border}`,
            }}>
              <input type="checkbox" checked={checklist[i]} onChange={e => setChecklist(c => c.map((v, j) => j === i ? e.target.checked : v))} style={{ width: 15, height: 15, flexShrink: 0, marginTop: 1, accentColor: T.primary }} />
              <span style={{ fontSize: T.sm, color: checklist[i] ? T.successText : T.foreground, lineHeight: 1.5 }}>{text}</span>
            </label>
          ))}
        </div>

        <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
          <Button variant="outline" onClick={onClose}>Hủy</Button>
          <Button onClick={onPublish} disabled={!allChecked} style={{ opacity: allChecked ? 1 : 0.5 }}>
            Xuất bản chương trình
          </Button>
        </div>
      </Card>
    </div>
  );
}

// ── Create Page (2-column layout) ─────────────────────────────────────────────

function CreatePage({ onBack, onCreate, eventName = "NetEvent Demo 2026" }: { onBack: () => void; onCreate: () => void; eventName?: string }) {
  const [form, setForm] = useState({ name: `Bốc thăm may mắn — ${eventName}`, description: "", startTime: "", endTime: "" });
  const [source, setSource] = useState("checkin");
  const [prizes, setPrizes] = useState([{ id: "np1", rank: "Giải nhất", name: "", count: 1, remaining: 1, status: "pending" as const }]);
  const [rules, setRules] = useState({ oncePerPerson: true, lockBeforeSpin: true, allowRespin: true });
  const [winnerDisplay, setWinnerDisplay] = useState("full");
  const [spinDuration, setSpinDuration] = useState("5");
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [showTicketTypeModal, setShowTicketTypeModal] = useState(false);
  const [selectedTicketTypes, setSelectedTicketTypes] = useState<string[]>([]);
  const [manualFile, setManualFile] = useState<File | null>(null);

  const addPrize = () => setPrizes(prev => [...prev, { id: `np${Date.now()}`, rank: `Giải ${prev.length + 1}`, name: "", count: 1, remaining: 1, status: "pending" as const }]);
  const removePrize = (id: string) => setPrizes(prev => prev.filter(p => p.id !== id));

  const MOCK_TICKET_TYPES = [
    { id: "tt1", name: "VIP",          count: 42  },
    { id: "tt2", name: "Standard",     count: 218 },
    { id: "tt3", name: "Early Bird",   count: 56  },
    { id: "tt4", name: "Group (5+)",   count: 30  },
    { id: "tt5", name: "Staff",        count: 12  },
  ];

  const SOURCE_OPTS = [
    { value: "checkin",     label: "Người đã check-in",        desc: "Chỉ lấy người đã quét QR check-in",           count: 138,  recommended: true },
    { value: "registered",  label: "Người đã đăng ký",          desc: "Tất cả người đã đăng ký vé",                  count: 328,  recommended: false },
    { value: "ticket_type", label: "Theo hạng vé",              desc: "Chọn một hoặc nhiều hạng vé từ kho vé",       count: null, recommended: false },
    { value: "manual",      label: "Danh sách import thủ công", desc: "Tải lên file danh sách người tham gia",       count: null, recommended: false },
  ];
  const selectedSource = SOURCE_OPTS.find(o => o.value === source);
  const eligibleCount = selectedSource?.count ?? 0;

  const readyChecks = [
    { label: "Tên chương trình",       done: !!form.name.trim() },
    { label: "Nguồn người tham gia",   done: !!source },
    { label: "Ít nhất 1 giải thưởng", done: prizes.some(p => !!p.name.trim()) },
    { label: "Thời gian bắt đầu",     done: !!form.startTime },
  ];

  return (
    <>
      {showPublishModal && (
        <PublishModal
          form={form} source={source} prizes={prizes} winnerDisplay={winnerDisplay}
          onClose={() => setShowPublishModal(false)}
          onPublish={() => { setShowPublishModal(false); onCreate(); }}
        />
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

        {/* Page header */}
        <div>
          <button onClick={onBack} style={{ display: "flex", alignItems: "center", gap: 5, color: T.primary, background: "none", border: "none", cursor: "pointer", fontSize: T.sm, fontWeight: T.fw_medium, marginBottom: 8, padding: 0, width: "fit-content" }}>
            <ChevronLeft size={15} /> Mini Game
          </button>
          <h2 style={{ fontSize: T.xl, fontWeight: T.fw_semi, color: T.foreground, margin: 0 }}>Tạo bốc thăm may mắn</h2>
        </div>

        {/* Two-column grid */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-5 lg:gap-6 items-start">

          {/* Left column: form sections */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

            {/* Block 1: Thông tin chương trình */}
            <Card>
              <p style={{ fontSize: T.sm, fontWeight: T.fw_semi, color: T.foreground, margin: 0, marginBottom: 4 }}>Thông tin chương trình</p>
              <p style={{ fontSize: T.xs, color: T.mutedFg, margin: 0, marginBottom: 16 }}>Đặt tên và thời gian cho chương trình bốc thăm.</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <div>
                  <Label>Tên chương trình</Label>
                  <Input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} style={{ marginTop: 6 }} />
                </div>
              </div>
            </Card>

            {/* Block 2: Người tham gia */}
            <Card>
              <p style={{ fontSize: T.sm, fontWeight: T.fw_semi, color: T.foreground, margin: 0, marginBottom: 4 }}>Người tham gia</p>
              <p style={{ fontSize: T.xs, color: T.mutedFg, margin: 0, marginBottom: 16 }}>Chọn nguồn danh sách để bốc thăm.</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {SOURCE_OPTS.filter(o => o.value !== "registered").map(opt => (
                  <button key={opt.value} onClick={() => {
                    setSource(opt.value);
                    if (opt.value === "ticket_type") setShowTicketTypeModal(true);
                  }} style={{
                    display: "flex", alignItems: "center", gap: 12, padding: "12px 14px",
                    borderRadius: 12, border: `1px solid ${source === opt.value ? T.primary : T.border}`,
                    background: source === opt.value ? `color-mix(in srgb, ${T.primary} 7%, ${T.background})` : T.background,
                    cursor: "pointer", textAlign: "left", width: "100%",
                  }}>
                    <div style={{
                      width: 18, height: 18, borderRadius: "50%",
                      border: `2px solid ${source === opt.value ? T.primary : T.border}`,
                      background: source === opt.value ? T.primary : "transparent",
                      flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center",
                    }}>
                      {source === opt.value && <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#fff" }} />}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <p style={{ fontSize: T.sm, fontWeight: T.fw_medium, color: T.foreground, margin: 0 }}>{opt.label}</p>
                        {opt.recommended && (
                          <span style={{ fontSize: "10px", fontWeight: T.fw_semi, padding: "1px 7px", borderRadius: "999px", background: T.successSubtle, color: T.successText, border: `1px solid ${T.successBorder}` }}>
                            Khuyến nghị
                          </span>
                        )}
                      </div>
                      {opt.value === "ticket_type" && source === "ticket_type" && selectedTicketTypes.length > 0 ? (
                        <p style={{ fontSize: T.xs, color: T.primary, margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" as const }}>
                          {selectedTicketTypes.map(id => MOCK_TICKET_TYPES.find(t => t.id === id)?.name).join(", ")}
                        </p>
                      ) : (
                        <p style={{ fontSize: T.xs, color: T.mutedFg, margin: 0 }}>{opt.desc}</p>
                      )}
                    </div>
                    {opt.count !== null && (
                      <span style={{ fontSize: T.xs, fontWeight: T.fw_medium, color: T.primary, flexShrink: 0 }}>{opt.count} người</span>
                    )}
                    {opt.value === "ticket_type" && source === "ticket_type" && selectedTicketTypes.length > 0 && (
                      <span style={{ fontSize: T.xs, fontWeight: T.fw_medium, color: T.primary, flexShrink: 0 }}>{selectedTicketTypes.length} hạng</span>
                    )}
                  </button>
                ))}

                {/* Manual upload area */}
                {source === "manual" && (
                  <label style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 10, padding: "24px 16px", borderRadius: 12, border: `2px dashed ${manualFile ? T.primary : T.border}`, background: manualFile ? `color-mix(in srgb, ${T.primary} 4%, ${T.background})` : T.pageSurface, cursor: "pointer", textAlign: "center" as const }}>
                    <input type="file" accept=".xlsx,.xls,.md" style={{ display: "none" }} onChange={e => setManualFile(e.target.files?.[0] ?? null)} />
                    {manualFile ? (
                      <>
                        <Check size={20} style={{ color: T.primary } as React.CSSProperties} />
                        <div>
                          <p style={{ fontSize: T.sm, fontWeight: T.fw_medium, color: T.primary, margin: 0 }}>{manualFile.name}</p>
                          <p style={{ fontSize: T.xs, color: T.mutedFg, margin: "2px 0 0" }}>Bấm để thay đổi file</p>
                        </div>
                      </>
                    ) : (
                      <>
                        <Download size={20} style={{ color: T.mutedFg } as React.CSSProperties} />
                        <div>
                          <p style={{ fontSize: T.sm, fontWeight: T.fw_medium, color: T.foreground, margin: 0 }}>Tải file danh sách lên</p>
                          <p style={{ fontSize: T.xs, color: T.mutedFg, margin: "2px 0 0" }}>Chấp nhận .xlsx, .xls, .md</p>
                        </div>
                      </>
                    )}
                  </label>
                )}
              </div>
            </Card>

            {/* Ticket type modal */}
            {showTicketTypeModal && (
              <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.35)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 200 }}
                onClick={e => { if (e.target === e.currentTarget) setShowTicketTypeModal(false); }}>
                <div style={{ background: T.background, borderRadius: 18, padding: 28, width: 420, boxShadow: "0 16px 48px rgba(0,0,0,0.18)", display: "flex", flexDirection: "column", gap: 20 }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <p style={{ fontSize: T.base, fontWeight: T.fw_semi, color: T.foreground, margin: 0 }}>Chọn hạng vé</p>
                    <button onClick={() => setShowTicketTypeModal(false)} style={{ background: "none", border: "none", cursor: "pointer", color: T.mutedFg, padding: 4 }}><X size={16} /></button>
                  </div>
                  <p style={{ fontSize: T.xs, color: T.mutedFg, margin: 0, marginTop: -12 }}>Người đã mua các hạng vé được chọn sẽ nằm trong pool bốc thăm.</p>
                  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    {MOCK_TICKET_TYPES.map(tt => {
                      const checked = selectedTicketTypes.includes(tt.id);
                      return (
                        <label key={tt.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 14px", borderRadius: 10, border: `1px solid ${checked ? T.primary : T.border}`, background: checked ? `color-mix(in srgb, ${T.primary} 6%, ${T.background})` : T.background, cursor: "pointer" }}>
                          <input type="checkbox" checked={checked} onChange={e => setSelectedTicketTypes(prev => e.target.checked ? [...prev, tt.id] : prev.filter(id => id !== tt.id))} style={{ width: 15, height: 15, accentColor: T.primary }} />
                          <span style={{ fontSize: T.sm, fontWeight: T.fw_medium, color: T.foreground, flex: 1 }}>{tt.name}</span>
                          <span style={{ fontSize: T.xs, color: T.mutedFg }}>{tt.count} người</span>
                        </label>
                      );
                    })}
                  </div>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
                    <span style={{ fontSize: T.xs, color: T.mutedFg }}>{selectedTicketTypes.length} hạng đã chọn · {MOCK_TICKET_TYPES.filter(t => selectedTicketTypes.includes(t.id)).reduce((s, t) => s + t.count, 0)} người</span>
                    <div style={{ display: "flex", gap: 8 }}>
                      <Button variant="outline" onClick={() => setShowTicketTypeModal(false)}>Hủy</Button>
                      <Button onClick={() => setShowTicketTypeModal(false)} disabled={selectedTicketTypes.length === 0}>Xác nhận</Button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Block 3: Giải thưởng */}
            <Card>
              <p style={{ fontSize: T.sm, fontWeight: T.fw_semi, color: T.foreground, margin: 0, marginBottom: 4 }}>Giải thưởng</p>
              <p style={{ fontSize: T.xs, color: T.mutedFg, margin: 0, marginBottom: 16 }}>Thiết lập danh sách giải thưởng và số lượng người thắng.</p>
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: 12 }}>
                  <thead>
                    <tr style={{ borderBottom: `1px solid ${T.border}` }}>
                      {["", "Hạng giải", "Tên phần thưởng", "Số người thắng", ""].map((h, i) => (
                        <th key={i} style={{ padding: "8px 10px", textAlign: "left" as const, fontSize: T.xs, fontWeight: T.fw_semi, color: T.mutedFg, whiteSpace: "nowrap" as const }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {prizes.map((p, i) => (
                      <tr key={p.id} style={{ borderBottom: i < prizes.length - 1 ? `1px solid ${T.border}` : "none" }}>
                        <td style={{ padding: "10px 4px 10px 10px" }}><GripVertical size={13} style={{ color: T.mutedFg, cursor: "grab" } as React.CSSProperties} /></td>
                        <td style={{ padding: "10px 8px" }}>
                          <Input value={p.rank} onChange={e => setPrizes(prev => prev.map(x => x.id === p.id ? { ...x, rank: e.target.value } : x))} placeholder="VD: Giải nhất" style={{ minWidth: 110 }} />
                        </td>
                        <td style={{ padding: "10px 8px" }}>
                          <Input value={p.name} onChange={e => setPrizes(prev => prev.map(x => x.id === p.id ? { ...x, name: e.target.value } : x))} placeholder="Tên phần thưởng" style={{ minWidth: 160 }} />
                        </td>
                        <td style={{ padding: "10px 8px" }}>
                          <Input type="number" min={1} value={p.count} onChange={e => setPrizes(prev => prev.map(x => x.id === p.id ? { ...x, count: Number(e.target.value) } : x))} style={{ width: 72 }} />
                        </td>
                        <td style={{ padding: "10px 8px" }}>
                          {prizes.length > 1 && (
                            <button onClick={() => removePrize(p.id)} style={{ background: "none", border: "none", cursor: "pointer", color: T.mutedFg }}><Trash2 size={13} /></button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <Button variant="outline" onClick={addPrize} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <Plus size={13} /> Thêm giải thưởng
              </Button>
            </Card>

            {/* Block 4: Quy tắc vận hành */}
            <Card>
              <p style={{ fontSize: T.sm, fontWeight: T.fw_semi, color: T.foreground, margin: 0, marginBottom: 4 }}>Quy tắc vận hành</p>
              <p style={{ fontSize: T.xs, color: T.mutedFg, margin: 0, marginBottom: 16 }}>Cấu hình điều kiện và cách thức bốc thăm.</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label>Thời gian quay</Label>
                    <Select value={spinDuration} onValueChange={setSpinDuration}>
                      <SelectTrigger style={{ marginTop: 6 }}><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="3">3 giây</SelectItem>
                        <SelectItem value="5">5 giây</SelectItem>
                        <SelectItem value="10">10 giây</SelectItem>
                        <SelectItem value="15">15 giây</SelectItem>
                        <SelectItem value="30">30 giây</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Cách hiển thị người thắng</Label>
                    <Select value={winnerDisplay} onValueChange={setWinnerDisplay}>
                      <SelectTrigger style={{ marginTop: 6 }}><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="full">Họ tên + Mã vé</SelectItem>
                        <SelectItem value="partial">Họ tên rút gọn + 4 số cuối SĐT</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                {([
                  { key: "oncePerPerson", label: "Một người chỉ trúng một lần" },
                ] as const).map(rule => (
                  <label key={rule.key} style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}>
                    <input type="checkbox" checked={rules[rule.key]} onChange={e => setRules(r => ({ ...r, [rule.key]: e.target.checked }))} style={{ width: 15, height: 15, accentColor: T.primary }} />
                    <span style={{ fontSize: T.sm, color: T.foreground }}>{rule.label}</span>
                  </label>
                ))}
              </div>
            </Card>

          </div>{/* /left column */}

          {/* Right column: summary sidebar */}
          <div style={{ position: "sticky", top: 20, display: "flex", flexDirection: "column", gap: 14 }}>

            {/* Config summary */}
            <Card>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
                <p style={{ fontSize: T.sm, fontWeight: T.fw_semi, color: T.foreground, margin: 0 }}>Tóm tắt</p>
                <span style={{ fontSize: T.xs, fontWeight: T.fw_medium, padding: "2px 10px", borderRadius: "999px", color: "#595959", background: "#f3f4f6", border: "1px solid #e5e7eb" }}>Bản nháp</span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {([
                  { icon: Users,         label: "Người đủ điều kiện", value: eligibleCount > 0 ? `${eligibleCount} người` : "—" },
                  { icon: Trophy,        label: "Tổng giải thưởng",   value: `${prizes.length} giải` },
                  { icon: ClipboardList, label: "Nguồn tham gia",     value: selectedSource?.label ?? "—" },
                ] as const).map(({ icon: Icon, label, value }) => (
                  <div key={label} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <Icon size={12} style={{ color: T.mutedFg, flexShrink: 0 } as React.CSSProperties} />
                    <span style={{ fontSize: T.xs, color: T.mutedFg, flex: 1 }}>{label}</span>
                    <span style={{ fontSize: T.xs, fontWeight: T.fw_medium, color: T.foreground, textAlign: "right" as const }}>{value}</span>
                  </div>
                ))}
              </div>
            </Card>

            {/* Ready checklist */}
            <Card>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                <p style={{ fontSize: T.sm, fontWeight: T.fw_semi, color: T.foreground, margin: 0 }}>Sẵn sàng xuất bản</p>
                <span style={{ fontSize: T.xs, color: T.mutedFg }}>{readyChecks.filter(c => c.label !== "Thời gian bắt đầu" && c.done).length}/{readyChecks.filter(c => c.label !== "Thời gian bắt đầu").length}</span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
                {readyChecks.filter(c => c.label !== "Thời gian bắt đầu").map(c => (
                  <div key={c.label} style={{ display: "flex", alignItems: "center", gap: 9 }}>
                    <div style={{ width: 16, height: 16, borderRadius: "50%", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", background: c.done ? T.successText : T.muted }}>
                      {c.done && <Check size={9} color="white" />}
                    </div>
                    <span style={{ fontSize: T.xs, color: c.done ? T.foreground : T.mutedFg }}>{c.label}</span>
                  </div>
                ))}
              </div>
            </Card>

            {/* Tips */}
            <div style={{ padding: "14px 16px", borderRadius: 14, background: T.pageSurface, border: `1px solid ${T.border}` }}>
              <p style={{ fontSize: T.xs, fontWeight: T.fw_semi, color: T.mutedFg, letterSpacing: "0.06em", textTransform: "uppercase" as const, margin: 0, marginBottom: 10 }}>Gợi ý</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
                {[
                  "Nên dùng danh sách đã check-in để đảm bảo người thắng có mặt tại sự kiện.",
                  "Một người chỉ trúng một lần để đảm bảo tính công bằng.",
                  "Cần khóa danh sách trước khi bắt đầu quay để kết quả minh bạch.",
                ].map((tip, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
                    <div style={{ width: 4, height: 4, borderRadius: "50%", background: T.primary, flexShrink: 0, marginTop: 5 }} />
                    <span style={{ fontSize: T.xs, color: T.mutedFg, lineHeight: 1.6 }}>{tip}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>{/* /right column */}
        </div>{/* /grid */}

        {/* Sticky footer — same width as the form container */}
        <div style={{
          position: "sticky", bottom: 0,
          background: T.background, borderTop: `1px solid ${T.border}`,
          padding: "14px 0", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10,
          zIndex: 40,
        }}>
          <p style={{ fontSize: T.xs, color: T.mutedFg, margin: 0 }}>Mini Game sẽ được xuất bản cùng lúc với sự kiện.</p>
          <div style={{ display: "flex", gap: 10 }}>
            <Button variant="outline" onClick={onBack} style={{ color: T.mutedFg }}>Hủy</Button>
            <Button onClick={onCreate}>Lưu</Button>
          </div>
        </div>

      </div>
    </>
  );
}

// ── List View ──────────────────────────────────────────────────────────────────

function MgListView({ onCreate, onManage, onOperate }: { onCreate: () => void; onManage: (g: MiniGame) => void; onOperate: (g: MiniGame) => void }) {
  const [games] = useState<MiniGame[]>([MOCK_GAME]);

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
          {games.map(game => (
            <Card key={game.id} style={{ padding: "14px 16px" }}>
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-5">

                {/* Identity row (icon + text) */}
                <div style={{ display: "flex", alignItems: "center", gap: 12, flex: 1, minWidth: 0 }}>
                  <div style={{ width: 40, height: 40, borderRadius: 10, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", background: `linear-gradient(135deg, ${T.primary}, #7c3aed)` }}>
                    <Gamepad2 size={20} color="white" />
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <p style={{ fontSize: T.sm, fontWeight: T.fw_semi, color: T.foreground, margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" as const }}>{game.name}</p>
                    <p style={{ fontSize: T.xs, color: T.mutedFg, margin: "2px 0 0", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" as const }}>Bốc thăm may mắn · {game.participantSource} · {game.startTime}</p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 shrink-0">
                  <Button variant="outline" size="sm" onClick={() => onManage(game)}>
                    Quản lý
                  </Button>
                  <Button size="sm" onClick={() => onOperate(game)} style={{ background: T.successSubtle, color: T.successText, border: `1px solid ${T.successBorder}` }}>
                    <Zap size={13} /> Vận hành
                  </Button>
                </div>

              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Main export ────────────────────────────────────────────────────────────────

export function MiniGameTab({ event }: { event?: { name?: string } }) {
  const [view, setView] = useState<MgView>("list");
  const [selectedGame, setSelectedGame] = useState<MiniGame>(MOCK_GAME);

  if (view === "create") {
    return <CreatePage eventName={event?.name ?? "NetEvent Demo 2026"} onBack={() => setView("list")} onCreate={() => setView("list")} />;
  }
  if (view === "manage") {
    return <ManageView game={selectedGame} onBack={() => setView("list")} onOperate={() => setView("operate")} />;
  }
  if (view === "operate") {
    return <OperateView game={selectedGame} onBack={() => setView("manage")} />;
  }

  return (
    <MgListView
      onCreate={() => setView("create")}
      onManage={g => { setSelectedGame(g); setView("manage"); }}
      onOperate={g => { setSelectedGame(g); setView("operate"); }}
    />
  );
}

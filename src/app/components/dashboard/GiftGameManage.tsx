import * as React from "react";
import { useMemo, useState } from "react";
import { ChevronLeft, Pencil, Pause, Play, MoreHorizontal, Download, Search, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Sheet, SheetContent, SheetDescription, SheetTitle } from "../ui/sheet";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";
import {
  useGiftGame, useRewards, useCheckins, useAudit, registrationsOf, inventoryOf, gameStateOf,
  saveGiftGame, logAudit, maskPhone, normalizePhone, rewardGift,
} from "../../data/attendeeFlow";
import { T, ADMIN, GiftStateBadge, GiftThumb, windowLabel } from "./GiftGameShared";

const TH: React.CSSProperties = { padding: "10px 16px", textAlign: "left", fontSize: T.xs, fontWeight: T.fw_semi, color: T.mutedFg, whiteSpace: "nowrap" };
const TD: React.CSSProperties = { padding: "12px 16px", fontSize: T.sm, color: T.foreground, verticalAlign: "middle" };
const NUM: React.CSSProperties = { ...TD, textAlign: "right", fontVariantNumeric: "tabular-nums" };
const LINK_BTN: React.CSSProperties = { display: "inline-flex", alignItems: "center", gap: 4, fontSize: T.sm, color: T.mutedFg, background: "none", border: "none", padding: 0, cursor: "pointer" };

function Pill({ tone, children }: { tone: "success" | "warning" | "muted"; children: React.ReactNode }) {
  const c = tone === "success" ? { color: T.successText, bg: T.successSubtle }
    : tone === "warning" ? { color: T.warningText, bg: T.warningSubtle } : { color: T.mutedFg, bg: T.secondary };
  return (
    <span style={{ fontSize: T.xs, fontWeight: T.fw_medium, padding: "2px 10px", borderRadius: 999, whiteSpace: "nowrap", color: c.color, background: c.bg }}>
      {children}
    </span>
  );
}

function Stat({ label, value, sub }: { label: string; value: React.ReactNode; sub: string }) {
  return (
    <div className="rounded-2xl p-4" style={{ backgroundColor: T.background, border: `1px solid ${T.border}` }}>
      <p style={{ fontSize: T.xs, color: T.mutedFg }}>{label}</p>
      <p style={{ fontSize: T.xl, fontWeight: T.fw_semi, color: T.foreground, marginTop: 4, fontVariantNumeric: "tabular-nums" }}>{value}</p>
      <p style={{ fontSize: T.xs, color: T.mutedFg, marginTop: 2 }}>{sub}</p>
    </div>
  );
}

function downloadCsv(name: string, rows: (string | number)[][]) {
  const csv = "﻿" + rows.map((r) => r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(",")).join("\n");
  const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
  const a = document.createElement("a");
  a.href = url; a.download = name; a.click();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/**
 * Trang "Kết quả và kho quà" của minigame chọn quà: tình hình tham gia, tồn kho
 * theo từng quà và danh sách kết quả. Số liệu đọc thẳng từ dữ liệu chung nên đổi
 * ngay khi người tham dự chọn quà hoặc booth xác nhận trao quà ở tab khác.
 */
export function GiftGameManage({ eventId, onBack, onEdit }: { eventId: string; onBack: () => void; onEdit: () => void }) {
  const [game] = useGiftGame(eventId);
  const rewards = useRewards(eventId);
  const checkins = useCheckins(eventId);
  const audit = useAudit(eventId);
  const regs = useMemo(() => registrationsOf(eventId), [eventId]);
  const [query, setQuery] = useState("");
  const [giftFilter, setGiftFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [logOpen, setLogOpen] = useState(false);
  if (!game) return null;

  const state = gameStateOf(game, rewards);
  const inventory = inventoryOf(game, rewards);
  const total = inventory.reduce((n, g) => n + g.quantity, 0);
  const available = inventory.reduce((n, g) => n + (g.status === "active" ? g.available : 0), 0);
  const list = Object.entries(rewards).map(([regId, r]) => ({
    regId, ...r, reg: regs.find((x) => x.id === regId), gift: rewardGift(game, r),
  })).sort((a, b) => b.playedAt.localeCompare(a.playedAt));
  const checkedIn = Object.keys(checkins).length;
  const played = list.length;
  const claimed = list.filter((r) => r.status === "claimed").length;
  const rate = checkedIn ? Math.round((played / checkedIn) * 100) : 0;

  const q = query.trim().toLowerCase();
  const phone = normalizePhone(query);
  const visible = list.filter((r) =>
    (giftFilter === "all" || r.giftId === giftFilter)
    && (statusFilter === "all" || r.status === statusFilter)
    && (!q || (phone && r.reg?.phone === phone)
      || [r.reg?.name, r.reg?.ticketCode, r.code].some((v) => v?.toLowerCase().includes(q))));

  const setStatus = (status: "active" | "paused") => {
    saveGiftGame(eventId, { ...game, status }, ADMIN, status === "paused" ? "Tạm dừng minigame" : "Tiếp tục minigame");
    toast.success(status === "paused" ? "Đã tạm dừng minigame" : "Minigame đã hoạt động trở lại", {
      description: status === "paused" ? "Người tham dự sẽ thấy “Minigame đang tạm dừng. Vui lòng quay lại sau.”" : undefined,
    });
  };

  const exportResults = () => {
    downloadCsv(`ket-qua-${game.id}.csv`, [
      ["Họ tên", "Số điện thoại", "Mã đăng ký", "Hộp", "Phần quà", "Mã quà", "Thời gian chơi", "Trạng thái", "Thời gian nhận", "Nhân viên xác nhận"],
      ...visible.map((r) => [r.reg?.name ?? "", r.reg ? maskPhone(r.reg.phone) : "", r.reg?.ticketCode ?? "", r.box,
        r.gift?.name ?? "", r.gift?.code ?? "", r.playedAt, r.status === "claimed" ? "Đã nhận" : "Chờ nhận", r.claimedAt ?? "", r.claimedBy ?? ""]),
    ]);
    logAudit(eventId, ADMIN, `Xuất kết quả minigame (${visible.length} dòng)`);
    toast.success("Đã xuất danh sách kết quả");
  };

  const nameOf = (regId?: string) => regs.find((r) => r.id === regId)?.name;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {/* Tiêu đề và thao tác */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div style={{ minWidth: 0 }}>
          <button data-pill="off" onClick={onBack} style={{ ...LINK_BTN, marginBottom: 8 }}>
            <ChevronLeft size={15} /> Danh sách mini game
          </button>
          <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
            <h2 style={{ fontSize: T.xl, fontWeight: T.fw_semi, color: T.foreground, margin: 0 }}>{game.name}</h2>
            <GiftStateBadge state={state} />
          </div>
          <p style={{ fontSize: T.sm, color: T.mutedFg, margin: "6px 0 0" }}>
            Chọn quà ngẫu nhiên · {windowLabel(game)} · Nhận quà tại {game.pickupLocation}
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Button variant="outline" onClick={onEdit}><Pencil size={14} /> Chỉnh sửa</Button>
          {game.status === "paused" ? (
            <Button onClick={() => setStatus("active")}><Play size={14} /> Tiếp tục</Button>
          ) : game.status === "active" && state !== "ended" ? (
            <Button variant="outline" onClick={() => setStatus("paused")}><Pause size={14} /> Tạm dừng</Button>
          ) : null}
          <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" aria-label="Thêm thao tác"><MoreHorizontal size={16} /></Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem asChild>
                <a href={`/tu-check-in?event=${encodeURIComponent(eventId)}`} target="_blank" rel="noreferrer">
                  Mở trang người tham dự <ExternalLink size={13} className="ml-auto" />
                </a>
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => setLogOpen(true)}>Nhật ký thao tác</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Thống kê */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <Stat label="Đã check-in" value={checkedIn} sub={`${Math.max(0, checkedIn - played)} người chưa chọn quà`} />
        <Stat label="Đã chọn quà" value={played} sub={`Tỷ lệ tham gia ${rate}%`} />
        <Stat label="Đã trao quà" value={claimed} sub={`${played - claimed} chờ nhận`} />
        <Stat label="Quà còn lại" value={available} sub={`Trên tổng ${total} phần quà`} />
      </div>

      {/* Kho quà */}
      <div className="rounded-2xl overflow-hidden" style={{ backgroundColor: T.background, border: `1px solid ${T.border}` }}>
        <p style={{ fontSize: T.sm, fontWeight: T.fw_semi, color: T.foreground, padding: "14px 16px", borderBottom: `1px solid ${T.border}` }}>Kho quà</p>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 640 }}>
            <thead>
              <tr style={{ borderBottom: `1px solid ${T.border}` }}>
                <th style={TH}>Phần quà</th>
                <th style={{ ...TH, textAlign: "right" }}>Tổng</th>
                <th style={{ ...TH, textAlign: "right" }}>Đã phân bổ</th>
                <th style={{ ...TH, textAlign: "right" }}>Chờ nhận</th>
                <th style={{ ...TH, textAlign: "right" }}>Đã nhận</th>
                <th style={{ ...TH, textAlign: "right" }}>Còn lại</th>
                <th style={{ ...TH, width: 120 }}>Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {inventory.map((g, i) => (
                <tr key={g.id} style={{ borderBottom: i < inventory.length - 1 ? `1px solid ${T.border}` : "none" }}>
                  <td style={TD}>
                    <span className="flex items-center gap-3 min-w-0">
                      <GiftThumb image={g.image} size={32} />
                      <span className="min-w-0">
                        <span className="block truncate" style={{ fontWeight: T.fw_medium }}>{g.name}</span>
                        <span className="block" style={{ fontSize: T.xs, color: T.mutedFg, fontFamily: "monospace" }}>{g.code}</span>
                      </span>
                    </span>
                  </td>
                  <td style={NUM}>{g.quantity}</td>
                  <td style={NUM}>{g.allocated}</td>
                  <td style={NUM}>{g.pending}</td>
                  <td style={NUM}>{g.claimed}</td>
                  <td style={{ ...NUM, fontWeight: T.fw_semi }}>{g.available}</td>
                  <td style={TD}>
                    {g.status === "paused" ? <Pill tone="warning">Tạm dừng</Pill>
                      : g.available === 0 ? <Pill tone="muted">Hết quà</Pill> : <Pill tone="success">Đang phát</Pill>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Kết quả */}
      <div className="rounded-2xl overflow-hidden" style={{ backgroundColor: T.background, border: `1px solid ${T.border}` }}>
        <div className="flex flex-col md:flex-row md:items-center gap-3" style={{ padding: "12px 16px", borderBottom: `1px solid ${T.border}` }}>
          <p style={{ fontSize: T.sm, fontWeight: T.fw_semi, color: T.foreground, margin: 0, flex: 1 }}>
            Kết quả <span style={{ color: T.mutedFg, fontWeight: T.fw_normal }}>{list.length}</span>
          </p>
          <div className="flex items-center gap-2 flex-wrap">
            <div style={{ position: "relative", width: 230 }}>
              <Search size={13} style={{ position: "absolute", left: 11, top: "50%", transform: "translateY(-50%)", color: T.mutedFg }} />
              <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Tên, SĐT hoặc mã đăng ký"
                aria-label="Tìm kết quả" style={{ paddingLeft: 34 }} />
            </div>
            <Select value={giftFilter} onValueChange={setGiftFilter}>
              <SelectTrigger className="w-[170px]" aria-label="Lọc theo phần quà"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả phần quà</SelectItem>
                {game.gifts.map((g) => <SelectItem key={g.id} value={g.id}>{g.name}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[150px]" aria-label="Lọc theo trạng thái"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả trạng thái</SelectItem>
                <SelectItem value="pending">Chờ nhận</SelectItem>
                <SelectItem value="claimed">Đã nhận</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm" disabled={visible.length === 0} onClick={exportResults}>
              <Download size={13} /> Xuất danh sách
            </Button>
          </div>
        </div>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 820 }}>
            <thead>
              <tr style={{ borderBottom: `1px solid ${T.border}` }}>
                <th style={TH}>Người tham dự</th>
                <th style={TH}>Mã đăng ký</th>
                <th style={TH}>Phần quà</th>
                <th style={{ ...TH, textAlign: "right" }}>Hộp</th>
                <th style={{ ...TH, textAlign: "right" }}>Chơi lúc</th>
                <th style={{ ...TH, width: 110 }}>Trạng thái</th>
                <th style={TH}>Nhận lúc · Nhân viên</th>
              </tr>
            </thead>
            <tbody>
              {visible.length === 0 ? (
                <tr><td colSpan={7} style={{ ...TD, padding: "28px 16px", textAlign: "center", color: T.mutedFg }}>
                  {list.length === 0 ? "Chưa có ai chọn quà." : "Không tìm thấy kết quả."}
                </td></tr>
              ) : visible.map((r, i) => (
                <tr key={r.regId} style={{ borderBottom: i < visible.length - 1 ? `1px solid ${T.border}` : "none" }}>
                  <td style={TD}>
                    <span className="block" style={{ fontWeight: T.fw_medium }}>{r.reg?.name ?? "—"}</span>
                    <span className="block" style={{ fontSize: T.xs, color: T.mutedFg }}>{r.reg ? maskPhone(r.reg.phone) : ""}</span>
                  </td>
                  <td style={{ ...TD, fontSize: T.xs, color: T.mutedFg, fontFamily: "monospace" }}>{r.reg?.ticketCode ?? "—"}</td>
                  <td style={TD}>{r.gift?.name ?? "—"}</td>
                  <td style={NUM}>{r.box}</td>
                  <td style={{ ...NUM, fontSize: T.xs, color: T.mutedFg }}>{r.playedAt}</td>
                  <td style={TD}>{r.status === "claimed" ? <Pill tone="success">Đã nhận</Pill> : <Pill tone="warning">Chờ nhận</Pill>}</td>
                  <td style={{ ...TD, fontSize: T.xs, color: T.mutedFg }}>{r.claimedAt ? `${r.claimedAt} · ${r.claimedBy}` : "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Sheet open={logOpen} onOpenChange={setLogOpen}>
        <SheetContent className="p-0 flex flex-col gap-0 sm:max-w-[460px]">
          <div className="px-5 py-4 pr-12" style={{ borderBottom: `1px solid ${T.border}` }}>
            <SheetTitle style={{ fontSize: T.base, fontWeight: T.fw_semi, color: T.foreground }}>Nhật ký thao tác</SheetTitle>
            <SheetDescription style={{ fontSize: T.xs, color: T.mutedFg, marginTop: 2 }}>Check-in, phân bổ quà, trao quà và thay đổi cấu hình. Không sửa hay xoá được.</SheetDescription>
          </div>
          <div className="flex-1 overflow-y-auto px-5 py-2">
            {audit.length === 0 && <p style={{ fontSize: T.sm, color: T.mutedFg, padding: "24px 0", textAlign: "center" }}>Chưa có thao tác nào.</p>}
            {audit.map((a, i) => (
              <div key={i} className="flex items-start gap-3 py-2.5" style={{ borderBottom: `1px solid ${T.border}` }}>
                <span style={{ fontSize: T.xs, color: T.mutedFg, width: 44, flexShrink: 0, fontVariantNumeric: "tabular-nums" }}>{a.at}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: T.sm, color: T.foreground, margin: 0 }}>{a.action}{nameOf(a.regId) ? ` · ${nameOf(a.regId)}` : ""}</p>
                  <p style={{ fontSize: T.xs, color: T.mutedFg, margin: "2px 0 0" }}>{a.actor}</p>
                </div>
              </div>
            ))}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}

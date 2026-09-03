import * as React from "react";
import { NavLink, Outlet, useNavigate, useLocation } from "react-router";
import { ChevronDown, Gamepad2, History, Users, ExternalLink } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "../components/ui/dialog";
import { Upload } from "lucide-react";
import { useCurrentEvent } from "../data/currentEvent";
import { THEMES } from "../components/dashboard/EventsPage";

const T = {
  background:    "var(--background)",
  foreground:    "var(--foreground)",
  border:        "var(--border)",
  primary:       "var(--primary)",
  secondary:     "var(--secondary)",
  mutedFg:       "var(--muted-foreground)",
  warningSubtle: "var(--warning-subtle)",
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

export type WorkspaceOutletContext = {
  onEditDrawer: () => void;
};

const TABS = [
  { label: "Thông tin chung",    to: "/event",                      end: true  },
  { label: "Người tham dự",      to: "/event/nguoi-tham-du",        end: false },
  { label: "Vé & Đăng ký",       to: "/event/kho-ve",               end: false },
  { label: "Thông tin chi tiết", to: "/event/thong-tin-chi-tiet",   end: false },
];

// Các tab tuỳ chọn: mặc định ẩn, người dùng bật trong menu "Nâng cao" thì tab
// mới hiện ra ngoài thanh tab chính.
const OPTIONAL_TABS = [
  { id: "mini-game",  label: "Mini game",          to: "/event/mini-game",         icon: Gamepad2 },
  { id: "lich-su",    label: "Lịch sử hoạt động",  to: "/event/lich-su-hoat-dong", icon: History  },
  { id: "thanh-vien", label: "Thành viên",         to: "/event/thanh-vien",        icon: Users    },
];

export function EventWorkspaceLayout() {
  const navigate = useNavigate();
  const { event } = useCurrentEvent();
  const theme = THEMES.find((t) => t.id === event.theme) ?? THEMES[1];

  const [editOpen, setEditOpen] = React.useState(false);
  const [moreOpen, setMoreOpen] = React.useState(false);
  // Giữ lựa chọn qua các lần tải trang: nếu không, mở thẳng /event/thanh-vien
  // sẽ ra một trang mà tab của nó không có trên thanh tab.
  const [shownTabs, setShownTabs] = React.useState<string[]>(() => {
    try {
      const raw = sessionStorage.getItem("netevent_shown_tabs");
      return raw ? (JSON.parse(raw) as string[]) : [];
    } catch {
      return [];
    }
  });

  React.useEffect(() => {
    try {
      sessionStorage.setItem("netevent_shown_tabs", JSON.stringify(shownTabs));
    } catch {
      // sessionStorage có thể bị chặn — lựa chọn vẫn sống trong phiên hiện tại.
    }
  }, [shownTabs]);
  const location = useLocation();

  const toggleTab = (tab: typeof OPTIONAL_TABS[number]) => {
    setShownTabs((prev) => {
      const on = prev.includes(tab.id);
      // Đang ẩn tab mà người dùng lại đang đứng ở chính trang đó thì quay về
      // tab đầu, nếu không sẽ ở lại một trang không còn tab nào sáng.
      if (on && location.pathname === tab.to) navigate("/event");
      return on ? prev.filter((id) => id !== tab.id) : [...prev, tab.id];
    });
  };
  const moreRef = React.useRef<HTMLDivElement>(null);
  React.useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (moreRef.current && !moreRef.current.contains(e.target as Node)) setMoreOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);
  const [editForm, setEditForm] = React.useState({
    name: event.name,
    description: event.description,
    location: event.location,
  });

  const context: WorkspaceOutletContext = { onEditDrawer: () => setEditOpen(true) };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div style={{
        borderBottom: `1px solid ${T.border}`,
        backgroundColor: T.background,
      }}>
        <div className="mx-auto w-full px-4 sm:px-6 lg:px-8" style={{ maxWidth: 1280 }}>
          {/* Title row */}
          <div className="flex items-center justify-between gap-2 sm:gap-4" style={{ padding: "16px 0" }}>
            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="truncate" style={{
                    color: T.foreground, fontSize: T.lg,
                    fontWeight: T.fw_semi, margin: 0,
                  }}>
                    {event.name}
                  </h2>
                </div>
              </div>
            </div>
            {/* Mở trang sự kiện công khai ở tab riêng. Dùng thẻ <a> thay cho
                navigate() để giữ được middle-click / ctrl+click. */}
            <Button asChild variant="outline" size="sm" style={{ fontSize: T.xs, flexShrink: 0 }}>
              <a href="/demo" target="_blank" rel="noreferrer">
                Trang sự kiện <ExternalLink className="size-3" />
              </a>
            </Button>
          </div>

          {/* Tab nav — chỉ danh sách tab cuộn ngang; menu "Nâng cao" nằm ngoài
              vùng cuộn, vì overflow-x-auto sẽ cắt mất popup của nó. */}
          <div className="flex items-center gap-4 sm:gap-6">
          <div className="flex gap-4 sm:gap-6 overflow-x-auto items-center min-w-0" style={{ scrollbarWidth: "none" }}>
            {[
              ...TABS,
              // Tab tuỳ chọn đã bật trong menu "Nâng cao" đứng cùng hàng với các tab cố định.
              ...OPTIONAL_TABS.filter((t) => shownTabs.includes(t.id)).map((t) => ({ label: t.label, to: t.to, end: false })),
            ].map((tab) => (
              <NavLink
                key={tab.to}
                to={tab.to}
                end={tab.end}
                style={{ textDecoration: "none", display: "block", flexShrink: 0 }}
              >
                {({ isActive }) => (
                  <span style={{
                    display: "block",
                    fontSize: T.sm,
                    fontWeight: isActive ? T.fw_semi : T.fw_normal,
                    color: isActive ? T.primary : T.mutedFg,
                    padding: "10px 0",
                    borderBottom: `2px solid ${isActive ? T.primary : "transparent"}`,
                    whiteSpace: "nowrap",
                    transition: "color 0.15s, border-color 0.15s",
                  }}>
                    {tab.label}
                  </span>
                )}
              </NavLink>
            ))}

            </div>

            {/* Menu "Nâng cao" — bật/tắt các tab tuỳ chọn */}
            <div ref={moreRef} style={{ position: "relative", flexShrink: 0 }}>
              <button
                onClick={() => setMoreOpen(o => !o)}
                style={{
                  display: "flex", alignItems: "center", gap: 4,
                  background: "none", border: "none", cursor: "pointer",
                  fontSize: T.sm, color: moreOpen ? T.primary : T.mutedFg,
                  padding: "10px 0",
                  borderBottom: `2px solid ${moreOpen ? T.primary : "transparent"}`,
                  whiteSpace: "nowrap", transition: "color 0.15s",
                }}>
                Nâng cao <ChevronDown style={{ width: 14, height: 14, transition: "transform 0.15s", transform: moreOpen ? "rotate(180deg)" : "rotate(0deg)" }} />
              </button>
              {moreOpen && (
                <div style={{
                  position: "absolute", top: "calc(100% + 4px)", left: 0, zIndex: 50,
                  backgroundColor: T.background, border: `1px solid ${T.border}`,
                  borderRadius: 12, padding: "6px", minWidth: 232,
                  boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
                }}>
                  <p style={{ fontSize: T.xs, color: T.mutedFg, padding: "6px 10px 8px" }}>
                    Chọn để hiện tab ra thanh tab
                  </p>
                  {OPTIONAL_TABS.map((item) => {
                    const on = shownTabs.includes(item.id);
                    return (
                      <button key={item.id} type="button" data-pill="off"
                        onClick={() => toggleTab(item)}
                        aria-pressed={on}
                        style={{
                          display: "flex", alignItems: "center", gap: 10, width: "100%",
                          padding: "8px 10px", borderRadius: 8, cursor: "pointer",
                          background: "none", border: "none", textAlign: "left",
                          fontSize: T.sm, color: on ? T.primary : T.foreground,
                          transition: "background 0.1s",
                        }}
                        onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = T.secondary; }}
                        onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = "transparent"; }}>
                        <span style={{
                          width: 16, height: 16, borderRadius: "50%", flexShrink: 0,
                          border: on ? `5px solid ${T.primary}` : `1.5px solid ${T.border}`,
                          transition: "border 0.15s",
                        }} />
                        <item.icon style={{ width: 14, height: 14, flexShrink: 0 }} />
                        {item.label}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── Page content ───────────────────────────────────────────────────── */}
      <div className="mx-auto w-full px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8" style={{ maxWidth: 1280 }}>
        <Outlet context={context} />
      </div>

      {/* ── Edit dialog ────────────────────────────────────────────────────── */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="sm:max-w-[520px] max-h-[90vh] overflow-y-auto" aria-describedby={undefined}>
          <DialogHeader>
            <DialogTitle>Chỉnh sửa sự kiện</DialogTitle>
          </DialogHeader>

          <div style={{ display: "flex", flexDirection: "column", gap: 24, padding: "24px 0" }}>
            {/* Thông tin cơ bản */}
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <p style={{ fontSize: T.sm, fontWeight: T.fw_semi, color: T.foreground, margin: 0 }}>Thông tin cơ bản</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <Label>Tên sự kiện</Label>
                <Input value={editForm.name} onChange={(e) => setEditForm((f) => ({ ...f, name: e.target.value }))} />
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <Label>Mô tả</Label>
                <Textarea rows={3} value={editForm.description}
                  onChange={(e) => setEditForm((f) => ({ ...f, description: e.target.value }))}
                  placeholder="Mô tả ngắn về sự kiện" />
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <Label>Đơn vị tổ chức</Label>
                <Input defaultValue="NetEvent Demo" />
              </div>
            </div>

            <div style={{ borderTop: `1px solid ${T.border}` }} />

            {/* Thời gian & Địa điểm */}
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <p style={{ fontSize: T.sm, fontWeight: T.fw_semi, color: T.foreground, margin: 0 }}>Thời gian & Địa điểm</p>
              {([
                { label: "Ngày bắt đầu", type: "date", val: event.startDate },
                { label: "Giờ bắt đầu",  type: "time", val: event.startTime },
                { label: "Ngày kết thúc", type: "date", val: event.endDate },
                { label: "Giờ kết thúc",  type: "time", val: event.endTime },
              ] as const).map((f) => (
                <div key={f.label} style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  <Label>{f.label}</Label>
                  <Input type={f.type} defaultValue={f.val} />
                </div>
              ))}
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <Label>Múi giờ</Label>
                <Select defaultValue="gmt7">
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent><SelectItem value="gmt7">GMT+07:00 — Việt Nam</SelectItem></SelectContent>
                </Select>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <Label>Địa điểm / Link online</Label>
                <Input value={editForm.location} onChange={(e) => setEditForm((f) => ({ ...f, location: e.target.value }))}
                  placeholder="Nhập địa điểm hoặc link online" />
              </div>
            </div>

            <div style={{ borderTop: `1px solid ${T.border}` }} />

            {/* Giao diện */}
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <p style={{ fontSize: T.sm, fontWeight: T.fw_semi, color: T.foreground, margin: 0 }}>Giao diện</p>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {THEMES.map((th) => (
                  <button key={th.id} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, background: "none", border: "none", cursor: "pointer" }}>
                    <div style={{ width: 48, height: 32, borderRadius: 8, background: th.gradient,
                      outline: th.id === event.theme ? `2px solid ${T.primary}` : "2px solid transparent", outlineOffset: 2 }} />
                    <span style={{ fontSize: T.xs, color: T.mutedFg }}>{th.label}</span>
                  </button>
                ))}
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <Label>Ảnh cover</Label>
                <div style={{ border: `2px dashed ${T.border}`, borderRadius: 12, padding: 24, display: "flex", flexDirection: "column", alignItems: "center", gap: 8, cursor: "pointer" }}>
                  <Upload style={{ width: 22, height: 22, color: T.mutedFg }} />
                  <p style={{ fontSize: T.xs, color: T.mutedFg, margin: 0 }}>Kéo thả hoặc click để tải ảnh</p>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <DialogClose asChild><Button variant="outline">Hủy</Button></DialogClose>
            <Button onClick={() => setEditOpen(false)}>Cập nhật sự kiện</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

import * as React from "react";
import { Ticket, Plus, Users, DollarSign, TrendingUp, Settings, Download, Eye } from "lucide-react";
import { Button } from "../../components/ui/button";

const T = {
  background:    "var(--background)",
  foreground:    "var(--foreground)",
  border:        "var(--border)",
  primary:       "var(--primary)",
  secondary:     "var(--secondary)",
  mutedFg:       "var(--muted-foreground)",
  successSubtle: "var(--success-subtle)",
  successText:   "var(--success-text)",
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

const TIERS = [
  {
    id: "t1", name: "Vé tiêu chuẩn", price: 0, currency: "VND",
    sold: 228, total: 300, status: "active",
    desc: "Vé tham dự toàn bộ chương trình",
  },
  {
    id: "t2", name: "Vé VIP", price: 499_000, currency: "VND",
    sold: 100, total: 120, status: "active",
    desc: "Khu vực VIP, quà tặng và ưu đãi đặc biệt",
  },
  {
    id: "t3", name: "Early Bird", price: 299_000, currency: "VND",
    sold: 76, total: 100, status: "ended",
    desc: "Ưu đãi dành cho người đăng ký sớm",
  },
];

function fmtPrice(p: number) {
  if (p === 0) return "Miễn phí";
  return p.toLocaleString("vi-VN") + " ₫";
}

function StatCard({ icon, label, value, sub }: { icon: React.ReactNode; label: string; value: string; sub?: string }) {
  return (
    <div className="rounded-2xl p-4 flex flex-col gap-3"
      style={{ backgroundColor: T.background, border: `1px solid ${T.border}` }}>
      <div className="size-9 rounded-xl flex items-center justify-center"
        style={{ backgroundColor: "rgba(30,170,255,0.08)", color: T.primary }}>
        {icon}
      </div>
      <div>
        <p style={{ fontSize: T.xs, color: T.mutedFg, marginBottom: 4 }}>{label}</p>
        <p style={{ fontSize: T.xl, fontWeight: T.fw_bold, color: T.foreground }}>{value}</p>
        {sub && <p style={{ fontSize: T.xs, color: T.mutedFg, marginTop: 2 }}>{sub}</p>}
      </div>
    </div>
  );
}

export function KhoVeRoute() {
  const totalRevenue = TIERS.reduce((s, t) => s + t.price * t.sold, 0);
  const totalSold    = TIERS.reduce((s, t) => s + t.sold, 0);
  const totalCap     = TIERS.reduce((s, t) => s + t.total, 0);

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 style={{ fontSize: T.xl, fontWeight: T.fw_bold, color: T.foreground, marginBottom: 4 }}>
            Kho vé
          </h2>
          <p style={{ fontSize: T.sm, color: T.mutedFg }}>
            Quản lý hạng vé, giá và số lượng cho sự kiện.
          </p>
        </div>
        <Button style={{ backgroundColor: "rgba(30,170,255,0.12)", color: "var(--primary)", border: "1px solid rgba(30,170,255,0.25)" }}>
          <Plus className="size-4" /> Thêm hạng vé
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatCard icon={<Ticket className="size-4" />} label="Tổng vé đã bán"
          value={totalSold.toLocaleString()} sub={`/ ${totalCap} chỗ`} />
        <StatCard icon={<TrendingUp className="size-4" />} label="Tỷ lệ lấp đầy"
          value={`${Math.round(totalSold / totalCap * 100)}%`} sub="Trên tổng capacity" />
        <StatCard icon={<DollarSign className="size-4" />} label="Doanh thu"
          value={totalRevenue > 0 ? `${(totalRevenue / 1_000_000).toFixed(0)}M ₫` : "0 ₫"}
          sub="Từ vé có phí" />
        <StatCard icon={<Users className="size-4" />} label="Hạng vé"
          value={String(TIERS.length)} sub={`${TIERS.filter(t => t.status === "active").length} đang hoạt động`} />
      </div>

      {/* Tier cards */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h3 style={{ fontSize: T.base, fontWeight: T.fw_semi, color: T.foreground }}>Danh sách hạng vé</h3>
          <Button size="sm" variant="outline">
            <Download className="size-3.5" /> Xuất báo cáo
          </Button>
        </div>

        {TIERS.map((tier) => {
          const pct = Math.round(tier.sold / tier.total * 100);
          const isActive = tier.status === "active";
          return (
            <div key={tier.id} className="rounded-2xl p-5 sm:p-6"
              style={{ backgroundColor: T.background, border: `1px solid ${T.border}` }}>
              <div className="flex flex-col sm:flex-row sm:items-start gap-4 justify-between">
                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <p style={{ fontSize: T.base, fontWeight: T.fw_semi, color: T.foreground }}>{tier.name}</p>
                    <span style={{
                      fontSize: T.xs, fontWeight: T.fw_medium,
                      padding: "2px 8px", borderRadius: "999px",
                      backgroundColor: isActive ? T.successSubtle : T.secondary,
                      color: isActive ? T.successText : T.mutedFg,
                    }}>
                      {isActive ? "Đang mở" : "Đã kết thúc"}
                    </span>
                  </div>
                  <p style={{ fontSize: T.sm, color: T.mutedFg, marginBottom: 12 }}>{tier.desc}</p>

                  {/* Progress */}
                  <div className="flex items-center gap-3 mb-2">
                    <div className="flex-1 rounded-full overflow-hidden" style={{ height: 6, backgroundColor: T.border }}>
                      <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: T.primary }} />
                    </div>
                    <span style={{ fontSize: T.xs, color: T.mutedFg, whiteSpace: "nowrap", flexShrink: 0 }}>
                      {tier.sold}/{tier.total} vé
                    </span>
                  </div>

                  {/* Meta */}
                  <div className="flex flex-wrap gap-4">
                    <div>
                      <p style={{ fontSize: T.xs, color: T.mutedFg }}>Giá vé</p>
                      <p style={{ fontSize: T.sm, fontWeight: T.fw_semi, color: T.foreground }}>{fmtPrice(tier.price)}</p>
                    </div>
                    <div>
                      <p style={{ fontSize: T.xs, color: T.mutedFg }}>Đã bán</p>
                      <p style={{ fontSize: T.sm, fontWeight: T.fw_semi, color: T.foreground }}>{tier.sold}</p>
                    </div>
                    <div>
                      <p style={{ fontSize: T.xs, color: T.mutedFg }}>Còn lại</p>
                      <p style={{ fontSize: T.sm, fontWeight: T.fw_semi, color: T.foreground }}>{tier.total - tier.sold}</p>
                    </div>
                    {tier.price > 0 && (
                      <div>
                        <p style={{ fontSize: T.xs, color: T.mutedFg }}>Doanh thu</p>
                        <p style={{ fontSize: T.sm, fontWeight: T.fw_semi, color: "#16a34a" }}>
                          {(tier.price * tier.sold / 1_000_000).toFixed(1)}M ₫
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 shrink-0">
                  <Button size="sm" variant="outline">
                    <Eye className="size-3.5" /> Xem
                  </Button>
                  <Button size="sm" variant="outline">
                    <Settings className="size-3.5" /> Chỉnh sửa
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

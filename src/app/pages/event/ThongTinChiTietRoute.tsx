import * as React from "react";
import { Users, Ticket, DollarSign, UserCheck, Gamepad2, BarChart3 } from "lucide-react";
import { StatCard, SimpleAreaChart, REG_DATA, CHECKIN_DATA } from "../../components/dashboard/EventDashboard";

const T = {
  background: "var(--background)",
  foreground: "var(--foreground)",
  border:     "var(--border)",
  secondary:  "var(--secondary)",
  mutedFg:    "var(--muted-foreground)",
  fw_normal:  "var(--font-weight-normal)",
  fw_medium:  "var(--font-weight-medium)",
  fw_semi:    "var(--font-weight-semibold)",
  xs:  "var(--text-xs)",
  sm:  "var(--text-sm)",
  base:"var(--text-base)",
};

const totalReg     = 312;
const totalCheckin = 289;
const totalRevenue = 45600000;
const fmtCurrency  = (v: number) =>
  v >= 1_000_000 ? `${(v / 1_000_000).toFixed(1)}M ₫` : `${v.toLocaleString()} ₫`;

export function ThongTinChiTietRoute() {
  const [chartTab, setChartTab] = React.useState<"reg" | "checkin">("reg");

  return (
    <div className="flex flex-col gap-6">
      {/* Số liệu tổng quan */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        <StatCard icon={<Users className="size-4" />} label="Người đăng ký"
          value={totalReg.toLocaleString()} sub="+12 hôm nay" />
        <StatCard icon={<Ticket className="size-4" />} label="Vé đã phát hành"
          value="328" sub="328 / 420 chỗ"
          iconBg="rgba(245,158,11,0.08)" iconColor="#f59e0b" />
        <StatCard icon={<DollarSign className="size-4" />} label="Doanh thu"
          value={fmtCurrency(totalRevenue)} sub="100 vé VIP đã bán"
          iconBg="rgba(22,163,74,0.08)" iconColor="#16a34a" />
        <StatCard icon={<UserCheck className="size-4" />} label="Check-in"
          value={`${totalCheckin} / ${totalReg}`}
          sub={`${Math.round(totalCheckin / totalReg * 100)}% tỷ lệ tham dự`}
          iconBg="rgba(13,148,136,0.08)" iconColor="#0d9488" />
        <StatCard icon={<Gamepad2 className="size-4" />} label="Mini Game"
          value="1 đang hoạt động" sub="1 bốc thăm · 328 người đủ điều kiện"
          iconBg="rgba(124,58,237,0.08)" iconColor="#7c3aed" />
      </div>

      {/* Chart */}
      <div className="rounded-2xl px-4 py-5 sm:px-5 sm:py-6"
        style={{ backgroundColor: T.background, border: `1px solid ${T.border}` }}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
          <div>
            <h3 style={{ fontSize: T.base, fontWeight: T.fw_semi, color: T.foreground }}>
              Đăng ký theo ngày
            </h3>
            <p style={{ fontSize: T.xs, color: T.mutedFg, marginTop: 2 }}>14 ngày gần nhất</p>
          </div>
          <div className="flex gap-1 rounded-lg p-1 shrink-0"
            style={{ backgroundColor: T.secondary, border: `1px solid ${T.border}` }}>
            {(["reg", "checkin"] as const).map((t) => (
              <button key={t} onClick={() => setChartTab(t)}
                className="px-3 py-1.5 rounded-md transition-all cursor-pointer"
                style={{
                  fontSize: T.xs, fontWeight: chartTab === t ? T.fw_medium : T.fw_normal,
                  backgroundColor: chartTab === t ? T.background : "transparent",
                  color: chartTab === t ? T.foreground : T.mutedFg,
                  border: chartTab === t ? `1px solid ${T.border}` : "1px solid transparent",
                }}>
                {t === "reg" ? "Đăng ký" : "Check-in"}
              </button>
            ))}
          </div>
        </div>
        {chartTab === "checkin" ? (
          <SimpleAreaChart data={CHECKIN_DATA as any} xKey="time" yKey="count" color="#0d9488" xInterval={2} />
        ) : (
          <div style={{ margin: "0 -20px" }}>
            <SimpleAreaChart data={REG_DATA as any} xKey="day" yKey="reg" color="var(--primary)" xInterval={2} />
          </div>
        )}
      </div>
    </div>
  );
}

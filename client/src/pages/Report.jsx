import {
  FaArrowTrendDown,
  FaArrowTrendUp,
  FaBusSimple,
  FaChartColumn,
  FaDownload,
  FaIndianRupeeSign,
  FaRoad,
  FaUsers,
} from "react-icons/fa6";

const monthlyPerformance = [
  { month: "January", bookings: 320, revenue: "80,000", growth: "+12%" },
  { month: "February", bookings: 290, revenue: "70,000", growth: "-5%" },
  { month: "March", bookings: 410, revenue: "100,000", growth: "+18%" },
  { month: "April", bookings: 380, revenue: "95,000", growth: "+10%" },
];

export default function Report() {
  return (
    <div className="space-y-8">
      <section className="rounded-[30px] bg-[linear-gradient(135deg,#111827,#0f172a)] px-6 py-8 text-white shadow-2xl md:px-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-200">
              <FaChartColumn className="text-blue-300" /> Executive reporting
            </div>
            <h1 className="mt-5 text-3xl font-semibold md:text-5xl">Performance insights for fleet, routes, and revenue.</h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300 md:text-base">
              Review transport activity with a cleaner summary of monthly bookings, route scale, vehicle readiness, and commercial results.
            </p>
          </div>
          <button className="inline-flex items-center gap-2 rounded-2xl bg-blue-400 px-5 py-3 font-semibold text-slate-950 transition hover:bg-blue-300">
            <FaDownload /> Download report
          </button>
        </div>
      </section>

      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "Total Vehicles", value: "150", icon: FaBusSimple, panel: "from-sky-50 to-blue-50", text: "text-blue-700" },
          { label: "Active Drivers", value: "95", icon: FaUsers, panel: "from-emerald-50 to-teal-50", text: "text-emerald-700" },
          { label: "Total Routes", value: "60", icon: FaRoad, panel: "from-violet-50 to-purple-50", text: "text-violet-700" },
          { label: "Total Revenue", value: "3,75,000", icon: FaIndianRupeeSign, panel: "from-amber-50 to-orange-50", text: "text-orange-700" },
        ].map(({ label, value, icon, panel, text }) => (
          <article key={label} className={`rounded-[28px] border border-slate-200 bg-gradient-to-br ${panel} p-6 shadow-xl shadow-slate-200/50`}>
            <div className="flex items-center justify-between">
              <p className="text-sm text-slate-500">{label}</p>
              <div className={`rounded-2xl bg-white/70 p-3 ${text}`}>{icon()}</div>
            </div>
            <p className={`mt-5 text-4xl font-semibold ${text}`}>{label === "Total Revenue" ? `Rs ${value}` : value}</p>
          </article>
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/60">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <p className="text-sm uppercase tracking-[0.18em] text-slate-400">Monthly performance</p>
              <h2 className="mt-2 text-2xl font-semibold text-slate-900">Bookings and revenue trend</h2>
            </div>
            <div className="rounded-full bg-slate-100 px-4 py-2 text-sm font-medium text-slate-600">FY 2026 snapshot</div>
          </div>

          <div className="mt-6 overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-sm text-slate-400">
                  <th className="pb-3">Month</th>
                  <th className="pb-3">Bookings</th>
                  <th className="pb-3">Revenue</th>
                  <th className="pb-3">Growth</th>
                </tr>
              </thead>
              <tbody>
                {monthlyPerformance.map((row) => {
                  const positive = row.growth.startsWith("+");
                  return (
                    <tr key={row.month} className="border-t border-slate-100 text-slate-700">
                      <td className="py-4 font-semibold text-slate-900">{row.month}</td>
                      <td className="py-4">{row.bookings}</td>
                      <td className="py-4">Rs {row.revenue}</td>
                      <td className="py-4">
                        <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-semibold ${positive ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"}`}>
                          {positive ? <FaArrowTrendUp /> : <FaArrowTrendDown />} {row.growth}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/60">
            <p className="text-sm uppercase tracking-[0.18em] text-slate-400">Operational health</p>
            <h2 className="mt-2 text-2xl font-semibold text-slate-900">Performance indicators</h2>
            <div className="mt-6 space-y-5">
              {[
                { label: "Fleet utilization", value: "84%" },
                { label: "Route coverage", value: "91%" },
                { label: "Booking conversion", value: "76%" },
              ].map((item) => (
                <div key={item.label}>
                  <div className="flex items-center justify-between text-sm text-slate-600">
                    <span>{item.label}</span>
                    <span className="font-semibold text-slate-900">{item.value}</span>
                  </div>
                  <div className="mt-2 h-2 rounded-full bg-slate-100">
                    <div className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-cyan-400" style={{ width: item.value }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[28px] bg-slate-950 p-6 text-white shadow-2xl">
            <p className="text-sm uppercase tracking-[0.18em] text-slate-400">Highlights</p>
            <ul className="mt-5 space-y-4 text-sm leading-7 text-slate-300">
              <li>March delivered the strongest booking volume and revenue of the current reporting window.</li>
              <li>February softened, but overall trend remains positive with route demand recovering.</li>
              <li>Fleet and driver availability continue to support higher load planning for upcoming periods.</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}

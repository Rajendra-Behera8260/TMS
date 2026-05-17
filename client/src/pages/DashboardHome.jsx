import { useEffect, useState } from "react";
import {
  FaArrowTrendUp,
  FaBus,
  FaCalendarCheck,
  FaChartLine,
  FaClipboardList,
  FaClock,
  FaEnvelope,
  FaRoute,
  FaUsers,
} from "react-icons/fa6";
import { axiosInstance } from "../api/axiosInstance";
import { useAuth } from "../context/AuthContext";

const statCards = [
  {
    key: "vehicles",
    label: "Fleet Vehicles",
    helper: "Registered and ready for dispatch",
    icon: FaBus,
    accent: "from-sky-500 to-blue-700",
    panel: "from-sky-50 to-blue-50",
    text: "text-blue-700",
  },
  {
    key: "drivers",
    label: "Active Drivers",
    helper: "Assigned to daily transport operations",
    icon: FaUsers,
    accent: "from-emerald-500 to-teal-700",
    panel: "from-emerald-50 to-teal-50",
    text: "text-emerald-700",
  },
  {
    key: "bookings",
    label: "Open Bookings",
    helper: "Trips currently scheduled in the system",
    icon: FaClipboardList,
    accent: "from-orange-500 to-amber-600",
    panel: "from-orange-50 to-amber-50",
    text: "text-orange-700",
  },
];

export default function DashboardHome() {
  const { user } = useAuth();
  const [stats, setStats] = useState({ vehicles: 0, drivers: 0, bookings: 0 });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const { data } = await axiosInstance.get("/api/dashboard");
        setStats(data);
      } catch (fetchError) {
        setError(fetchError.response?.data?.message || fetchError.message || "Unable to load dashboard stats");
      } finally {
        setIsLoading(false);
      }
    };

    loadStats();
  }, []);

  const completionRate = Math.min(
    100,
    Math.round(
      ((stats.vehicles + stats.drivers + stats.bookings) /
        Math.max(stats.vehicles + stats.drivers + stats.bookings, 1)) *
        100
    )
  );

  const quickMetrics = [
    {
      label: "Today's Focus",
      value: isLoading ? "Loading..." : `${stats.bookings} schedule items`,
      icon: FaCalendarCheck,
    },
    {
      label: "Fleet Status",
      value: isLoading ? "Updating..." : `${stats.vehicles} vehicles tracked`,
      icon: FaBus,
    },
    {
      label: "Last Refresh",
      value: isLoading ? "Syncing..." : "Current reporting view",
      icon: FaClock,
    },
  ];

  return (
    <div className="space-y-8">
      <section className="relative overflow-hidden rounded-[32px] bg-slate-950 text-white shadow-2xl">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(56,189,248,0.28),_transparent_35%),radial-gradient(circle_at_bottom_right,_rgba(16,185,129,0.22),_transparent_32%),linear-gradient(135deg,_rgba(15,23,42,1),_rgba(30,41,59,0.95))]" />
        <div className="absolute -right-16 top-8 h-48 w-48 rounded-full border border-white/10 bg-white/5 blur-2xl" />
        <div className="absolute bottom-0 left-1/3 h-40 w-40 rounded-full bg-cyan-400/10 blur-3xl" />

        <div className="relative grid gap-8 px-6 py-8 md:px-10 lg:grid-cols-[1.5fr_0.9fr] lg:items-end">
          <div>
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm text-slate-200">
              <FaChartLine className="text-cyan-300" />
              Transport operations overview
            </div>

            <h1 className="max-w-2xl text-3xl font-semibold leading-tight md:text-5xl">
              Transport operations dashboard
            </h1>

            <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300 md:text-base">
              Welcome, {user?.name || "User"}. Review fleet size, driver availability, and
              booking activity from a single operational view.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              {quickMetrics.map(({ label, value, icon }) => (
                <div
                  key={label}
                  className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm"
                >
                  <div className="flex items-center gap-3 text-slate-300">
                    <div className="rounded-xl bg-white/10 p-2">
                      {icon({ className: "text-cyan-300" })}
                    </div>
                    <span className="text-sm">{label}</span>
                  </div>
                  <p className="mt-4 text-lg font-semibold text-white">{value}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[28px] border border-white/10 bg-white/10 p-6 backdrop-blur-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.2em] text-slate-300">
                  Account Snapshot
                </p>
                <h2 className="mt-2 text-2xl font-semibold">{user?.name || "User"}</h2>
              </div>
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-600 text-2xl font-bold uppercase shadow-lg">
                {user?.name?.charAt(0) || "U"}
              </div>
            </div>

            <div className="mt-6 space-y-4">
              <div className="rounded-2xl bg-slate-900/50 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Email</p>
                <div className="mt-3 flex items-center gap-3 text-slate-100">
                  <FaEnvelope className="text-cyan-300" />
                  <span className="break-all">{user?.email || "Not available"}</span>
                </div>
              </div>

              <div className="rounded-2xl bg-slate-900/50 p-4">
                <div className="flex items-center justify-between text-sm text-slate-300">
                  <span>Operational coverage</span>
                  <span className="font-semibold text-white">{completionRate}%</span>
                </div>
                <div className="mt-3 h-3 overflow-hidden rounded-full bg-white/10">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-blue-500 to-emerald-400 transition-all duration-700"
                    style={{ width: `${completionRate}%` }}
                  />
                </div>
                <p className="mt-3 text-sm leading-6 text-slate-300">
                  Snapshot based on the currently available vehicle, driver, and booking records.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {error ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-red-700 shadow-sm">
          {error}
        </div>
      ) : null}

      <section className="grid gap-6 xl:grid-cols-[1.5fr_0.9fr]">
        <div className="space-y-6">
          <div className="grid gap-5 md:grid-cols-3">
            {statCards.map(({ key, label, helper, icon, accent, panel, text }) => (
              <article
                key={key}
                className={`rounded-[28px] border border-white/70 bg-gradient-to-br ${panel} p-6 shadow-lg shadow-slate-200/60`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium text-slate-500">{label}</p>
                    <h3 className={`mt-4 text-4xl font-semibold ${text}`}>
                      {isLoading ? "..." : stats[key]}
                    </h3>
                  </div>
                  <div
                    className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${accent} text-xl text-white shadow-lg`}
                  >
                    {icon()}
                  </div>
                </div>
                <p className="mt-5 text-sm leading-6 text-slate-600">{helper}</p>
              </article>
            ))}
          </div>

          <div className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/60">
            <div className="flex flex-col gap-3 border-b border-slate-100 pb-5 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-400">
                  Operations Brief
                </p>
                <h2 className="mt-2 text-2xl font-semibold text-slate-900">
                  Network health and movement overview
                </h2>
              </div>
              <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-2 text-sm font-medium text-emerald-700">
                <FaArrowTrendUp />
                Current summary
              </div>
            </div>

            <div className="mt-6 grid gap-5 md:grid-cols-2">
              <div className="rounded-3xl bg-slate-50 p-5">
                <div className="flex items-center gap-3">
                  <div className="rounded-2xl bg-blue-100 p-3 text-blue-700">
                    <FaRoute />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-500">Fleet balance</p>
                    <h3 className="text-xl font-semibold text-slate-900">
                      {isLoading ? "Loading..." : `${stats.vehicles} vehicles supporting operations`}
                    </h3>
                  </div>
                </div>
                <p className="mt-4 text-sm leading-7 text-slate-600">
                  Keep route allocations aligned with vehicle readiness to reduce idle capacity
                  and improve dispatch efficiency.
                </p>
              </div>

              <div className="rounded-3xl bg-slate-50 p-5">
                <div className="flex items-center gap-3">
                  <div className="rounded-2xl bg-emerald-100 p-3 text-emerald-700">
                    <FaUsers />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-500">Driver coverage</p>
                    <h3 className="text-xl font-semibold text-slate-900">
                      {isLoading ? "Loading..." : `${stats.drivers} drivers available for allocation`}
                    </h3>
                  </div>
                </div>
                <p className="mt-4 text-sm leading-7 text-slate-600">
                  Monitor available staff against active trips so scheduling stays consistent
                  across busy operating windows.
                </p>
              </div>
            </div>
          </div>
        </div>

        <aside className="space-y-6">
          <div className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/60">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-400">
              Booking Pulse
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-slate-900">
              Current dispatch demand
            </h2>

            <div className="mt-6 rounded-[28px] bg-slate-950 p-6 text-white">
              <p className="text-sm text-slate-400">Open bookings</p>
              <div className="mt-3 flex items-end gap-3">
                <span className="text-5xl font-semibold">
                  {isLoading ? "..." : stats.bookings}
                </span>
                <span className="pb-2 text-sm text-emerald-300">active items</span>
              </div>

              <div className="mt-6 space-y-3">
                <div className="flex items-center justify-between text-sm text-slate-300">
                  <span>Dispatch visibility</span>
                  <span>High</span>
                </div>
                <div className="h-2 rounded-full bg-white/10">
                  <div className="h-2 w-4/5 rounded-full bg-gradient-to-r from-emerald-400 to-cyan-400" />
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/60">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-400">
              Recommended Actions
            </p>
            <div className="mt-5 space-y-4">
              {[
                "Review pending bookings before final trip allocation.",
                "Match vehicle readiness with route demand for the next schedule cycle.",
                "Track driver availability to support uninterrupted transport operations.",
              ].map((item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-slate-100 bg-slate-50 px-4 py-4 text-sm leading-6 text-slate-700"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
        </aside>
      </section>
    </div>
  );
}

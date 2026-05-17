import { useEffect, useMemo, useState } from "react";
import {
  FaArrowRight,
  FaClock,
  FaLocationDot,
  FaMap,
  FaRoad,
  FaRoute,
} from "react-icons/fa6";
import { axiosInstance } from "../api/axiosInstance";

export default function Routes() {
  const [routes, setRoutes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadRoutes = async () => {
      try {
        const { data } = await axiosInstance.get("/api/routes");
        setRoutes(data);
      } catch (fetchError) {
        setError(fetchError.response?.data?.message || fetchError.message || "Unable to load routes");
      } finally {
        setIsLoading(false);
      }
    };

    loadRoutes();
  }, []);

  const summary = useMemo(
    () => ({
      total: routes.length,
      active: routes.filter((route) => route.status === "active").length,
      inactive: routes.filter((route) => route.status !== "active").length,
    }),
    [routes]
  );

  return (
    <div className="space-y-8">
      <section className="rounded-[30px] bg-[linear-gradient(135deg,#172554,#0f172a)] px-6 py-8 text-white shadow-2xl md:px-8">
        <div className="grid gap-8 xl:grid-cols-[1.25fr_0.95fr]">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-200">
              <FaMap className="text-violet-300" /> Route management
            </div>
            <h1 className="mt-5 text-3xl font-semibold md:text-5xl">Plan and monitor transport corridors from one route board.</h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300 md:text-base">
              Review available corridors, route distance, and travel duration for booking and planning activities.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-3 xl:grid-cols-1">
            {[
              { label: "Total Routes", value: summary.total, icon: FaRoute },
              { label: "Active", value: summary.active, icon: FaRoad },
              { label: "Inactive", value: summary.inactive, icon: FaClock },
            ].map(({ label, value, icon }) => (
              <div key={label} className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-slate-300">{label}</p>
                  {icon({ className: "text-violet-300" })}
                </div>
                <p className="mt-5 text-4xl font-semibold">{isLoading ? "..." : value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {error ? <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-red-700 shadow-sm">{error}</div> : null}

      <section className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/60">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <p className="text-sm uppercase tracking-[0.18em] text-slate-400">Route table</p>
              <h2 className="mt-2 text-2xl font-semibold text-slate-900">Transport corridors</h2>
            </div>
            <div className="rounded-2xl bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-600">View only</div>
          </div>

          <div className="mt-6 space-y-4">
            {routes.map((route) => (
              <article key={route._id} className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <p className="text-sm uppercase tracking-[0.16em] text-slate-400">Route record</p>
                    <div className="mt-3 flex flex-wrap items-center gap-3 text-xl font-semibold text-slate-900">
                      <span className="inline-flex items-center gap-2"><FaLocationDot className="text-emerald-600" /> {route.source}</span>
                      <FaArrowRight className="text-slate-400" />
                      <span className="inline-flex items-center gap-2"><FaLocationDot className="text-rose-600" /> {route.destination}</span>
                    </div>
                    <div className="mt-4 flex flex-wrap gap-4 text-sm text-slate-600">
                      <span className="inline-flex items-center gap-2"><FaRoad className="text-slate-400" /> {route.distance}</span>
                      <span className="inline-flex items-center gap-2"><FaClock className="text-slate-400" /> {route.duration}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`rounded-full px-4 py-2 text-sm font-semibold ${route.status === "active" ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"}`}>
                      {route.status}
                    </span>
                  </div>
                </div>
              </article>
            ))}

            {!isLoading && routes.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-10 text-center text-slate-500">No routes available yet. Admin needs to add route records first.</div>
            ) : null}
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/60">
            <p className="text-sm uppercase tracking-[0.18em] text-slate-400">Planning notes</p>
            <h2 className="mt-2 text-2xl font-semibold text-slate-900">Route design priorities</h2>
            <div className="mt-6 space-y-4 text-sm leading-7 text-slate-600">
              <div className="rounded-2xl bg-slate-50 p-4">Maintain route records with clear source, destination, distance, and duration details.</div>
              <div className="rounded-2xl bg-slate-50 p-4">Use active corridors for trip planning to keep scheduling and reporting aligned.</div>
              <div className="rounded-2xl bg-slate-50 p-4">Inactive routes can be reviewed separately when evaluating future service coverage.</div>
            </div>
          </div>

          <div className="rounded-[28px] bg-slate-950 p-6 text-white shadow-2xl">
            <p className="text-sm uppercase tracking-[0.18em] text-slate-400">Coverage snapshot</p>
            <h2 className="mt-2 text-2xl font-semibold">Network status</h2>
            <div className="mt-6 space-y-5">
              {[
                { label: "Regional connectivity", width: `${Math.min(summary.total * 18, 92)}%` },
                { label: "Schedule confidence", width: `${summary.active ? 74 : 24}%` },
                { label: "Operational continuity", width: `${summary.total ? 81 : 18}%` },
              ].map((item) => (
                <div key={item.label}>
                  <div className="flex items-center justify-between text-sm text-slate-300">
                    <span>{item.label}</span>
                    <span>{item.width}</span>
                  </div>
                  <div className="mt-2 h-2 rounded-full bg-white/10">
                    <div className="h-2 rounded-full bg-gradient-to-r from-violet-400 to-cyan-400" style={{ width: item.width }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

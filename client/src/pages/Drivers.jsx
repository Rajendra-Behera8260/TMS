import { useEffect, useMemo, useState } from "react";
import {
  FaAddressCard,
  FaIdCard,
  FaPhone,
  FaRoad,
  FaUserCheck,
  FaUserClock,
  FaUserTie,
  FaUserXmark,
} from "react-icons/fa6";
import { axiosInstance } from "../api/axiosInstance";

const normalizeDriverStatus = (status = "") => {
  const value = status.toLowerCase();
  if (value === "available") return "Available";
  if (value === "on trip") return "On Trip";
  if (value === "unavailable") return "Unavailable";
  if (value === "active") return "Available";
  return status || "Unavailable";
};

export default function Drivers() {
  const [drivers, setDrivers] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadDrivers = async () => {
      try {
        const { data } = await axiosInstance.get("/api/drivers");
        setDrivers(data);
      } catch (fetchError) {
        setError(fetchError.response?.data?.message || fetchError.message || "Unable to load drivers");
      } finally {
        setIsLoading(false);
      }
    };

    loadDrivers();
  }, []);

  const filteredDrivers = useMemo(
    () =>
      drivers
        .filter((driver) => {
          const normalizedStatus = normalizeDriverStatus(driver.status);
          return selectedStatus === "All" || normalizedStatus === selectedStatus || driver.status === selectedStatus;
        })
        .filter(
          (driver) =>
            driver.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            driver.license?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            driver.phone?.includes(searchTerm)
        ),
    [drivers, selectedStatus, searchTerm]
  );

  const summary = {
    total: drivers.length,
    available: drivers.filter((driver) => normalizeDriverStatus(driver.status) === "Available").length,
    activeTrips: drivers.filter((driver) => normalizeDriverStatus(driver.status) === "On Trip").length,
  };

  const statusMeta = {
    Available: { cls: "bg-emerald-100 text-emerald-700", icon: FaUserCheck },
    "On Trip": { cls: "bg-amber-100 text-amber-700", icon: FaUserClock },
    Unavailable: { cls: "bg-rose-100 text-rose-700", icon: FaUserXmark },
  };

  return (
    <div className="space-y-8">
      <section className="rounded-[30px] bg-[linear-gradient(135deg,#0f172a,#1e293b)] px-6 py-8 text-white shadow-2xl md:px-8">
        <div className="grid gap-8 xl:grid-cols-[1.3fr_0.9fr]">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-200">
              <FaRoad className="text-emerald-300" /> Driver directory
            </div>
            <h1 className="mt-5 text-3xl font-semibold md:text-5xl">Driver records and availability overview.</h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300 md:text-base">
              Review driver details, assignment status, and license information for daily transport planning.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-3 xl:grid-cols-1">
            {[
              { label: "Total Drivers", value: summary.total, icon: FaUserTie },
              { label: "Available Now", value: summary.available, icon: FaUserCheck },
              { label: "On Trip", value: summary.activeTrips, icon: FaRoad },
            ].map(({ label, value, icon }) => (
              <div key={label} className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-slate-300">{label}</p>
                  {icon({ className: "text-emerald-300" })}
                </div>
                <p className="mt-5 text-4xl font-semibold">{isLoading ? "..." : value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {error ? <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-red-700 shadow-sm">{error}</div> : null}

      <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/60">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex-1 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
            <input
              type="text"
              placeholder="Search driver, phone, or license"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
            />
          </div>
          <div className="flex flex-wrap gap-3">
            {["All", "Available", "On Trip", "Unavailable"].map((status) => (
              <button
                key={status}
                onClick={() => setSelectedStatus(status)}
                className={`rounded-2xl px-4 py-2 text-sm font-medium transition ${
                  selectedStatus === status ? "bg-slate-950 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-2 2xl:grid-cols-3">
        {filteredDrivers.map((driver, index) => {
          const normalizedStatus = normalizeDriverStatus(driver.status);
          const meta = statusMeta[normalizedStatus] || statusMeta.Unavailable;
          const StatusIcon = meta.icon;

          return (
            <article key={driver._id || index} className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/50">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-emerald-100 text-xl font-semibold text-emerald-700 uppercase">
                    {driver.name?.charAt(0) || "D"}
                  </div>
                  <div>
                    <p className="text-sm uppercase tracking-[0.16em] text-slate-400">Driver record</p>
                    <h2 className="mt-1 text-2xl font-semibold text-slate-900">{driver.name}</h2>
                  </div>
                </div>
                <span className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold ${meta.cls}`}>
                  <StatusIcon /> {normalizedStatus}
                </span>
              </div>

              <div className="mt-6 space-y-4">
                <div className="rounded-2xl bg-slate-50 p-4">
                  <div className="flex items-center gap-2 text-sm text-slate-500">
                    <FaIdCard /> License
                  </div>
                  <p className="mt-2 text-lg font-semibold text-slate-800">{driver.license || "-"}</p>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-2xl bg-slate-50 p-4">
                    <div className="flex items-center gap-2 text-sm text-slate-500">
                      <FaPhone /> Phone
                    </div>
                    <p className="mt-2 text-base font-semibold text-slate-800">{driver.phone || "-"}</p>
                  </div>
                  <div className="rounded-2xl bg-slate-50 p-4">
                    <div className="flex items-center gap-2 text-sm text-slate-500">
                      <FaAddressCard /> Assigned Vehicle
                    </div>
                    <p className="mt-2 text-base font-semibold text-slate-800">{driver.vehicle || "Unassigned"}</p>
                  </div>
                </div>
              </div>
            </article>
          );
        })}
      </section>

      {!isLoading && filteredDrivers.length === 0 ? (
        <div className="rounded-[28px] border border-dashed border-slate-300 bg-white px-6 py-16 text-center shadow-sm">
          <FaUserXmark className="mx-auto text-4xl text-slate-300" />
          <h3 className="mt-4 text-2xl font-semibold text-slate-700">No drivers match this filter</h3>
          <p className="mt-2 text-slate-500">Adjust availability filters to review driver records.</p>
        </div>
      ) : null}
    </div>
  );
}

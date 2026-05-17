import { useEffect, useMemo, useState } from "react";
import {
  FaBolt,
  FaFilter,
  FaRoad,
  FaScrewdriverWrench,
  FaTruckFast,
  FaWeightScale,
} from "react-icons/fa6";
import { axiosInstance } from "../api/axiosInstance";

const vehicleTypes = ["All", "Truck", "Mini Truck", "Van", "Car", "Bus"];

const normalizeVehicleStatus = (status = "") => {
  const value = status.toLowerCase();
  if (value === "active") return "Active";
  if (value === "available") return "Active";
  if (value === "maintenance" || value === "in maintenance") return "Maintenance";
  return status || "Maintenance";
};

export default function Vehicles() {
  const [vehicles, setVehicles] = useState([]);
  const [selectedType, setSelectedType] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadVehicles = async () => {
      try {
        const { data } = await axiosInstance.get("/api/vehicles");
        setVehicles(data);
      } catch (fetchError) {
        setError(fetchError.response?.data?.message || fetchError.message || "Unable to load vehicles");
      } finally {
        setIsLoading(false);
      }
    };

    loadVehicles();
  }, []);

  const filteredVehicles = useMemo(
    () =>
      vehicles
        .filter((vehicle) => selectedType === "All" || vehicle.type === selectedType)
        .filter(
          (vehicle) =>
            vehicle.number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            vehicle.type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            String(vehicle.capacity ?? "").toLowerCase().includes(searchTerm.toLowerCase()) ||
            vehicle.name?.toLowerCase().includes(searchTerm.toLowerCase())
        ),
    [vehicles, selectedType, searchTerm]
  );

  const summary = {
    total: vehicles.length,
    active: vehicles.filter((vehicle) => normalizeVehicleStatus(vehicle.status) === "Active").length,
    maintenance: vehicles.filter((vehicle) => normalizeVehicleStatus(vehicle.status) === "Maintenance").length,
  };

  const statusClass = (status) =>
    normalizeVehicleStatus(status) === "Active"
      ? "bg-emerald-100 text-emerald-700"
      : "bg-amber-100 text-amber-700";

  return (
    <div className="space-y-8">
      <section className="rounded-[30px] bg-slate-950 px-6 py-8 text-white shadow-2xl md:px-8">
        <div className="grid gap-8 xl:grid-cols-[1.3fr_0.9fr]">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-200">
              <FaTruckFast className="text-cyan-300" /> Fleet overview
            </div>
            <h1 className="mt-5 text-3xl font-semibold md:text-5xl">Vehicle records and readiness overview.</h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300 md:text-base">
              Review the registered fleet, operating condition, and vehicle capacity across the transport network.
            </p>
            <div className="mt-8 inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm text-slate-200">
              <FaRoad className="text-emerald-300" /> Fleet distribution summary
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3 xl:grid-cols-1">
            {[
              { label: "Total Fleet", value: summary.total, icon: FaTruckFast },
              { label: "Active Units", value: summary.active, icon: FaBolt },
              { label: "Maintenance", value: summary.maintenance, icon: FaScrewdriverWrench },
            ].map(({ label, value, icon }) => (
              <div key={label} className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-slate-300">{label}</p>
                  {icon({ className: "text-cyan-300" })}
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
              placeholder="Search vehicle number, type, or capacity"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
            />
          </div>
          <div className="flex flex-wrap gap-3">
            {vehicleTypes.map((type) => (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                className={`rounded-2xl px-4 py-2 text-sm font-medium transition ${
                  selectedType === type ? "bg-slate-950 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-2 2xl:grid-cols-3">
        {filteredVehicles.map((vehicle, index) => (
          <article key={vehicle._id || index} className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/50">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm uppercase tracking-[0.18em] text-slate-400">{vehicle.name || "Vehicle record"}</p>
                <h2 className="mt-2 text-2xl font-semibold text-slate-900">{vehicle.number}</h2>
              </div>
              <div className="rounded-2xl bg-sky-100 p-4 text-sky-700">
                <FaTruckFast className="text-xl" />
              </div>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-xs uppercase tracking-[0.16em] text-slate-400">Type</p>
                <p className="mt-2 text-lg font-semibold text-slate-800">{vehicle.type || "-"}</p>
              </div>
              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-xs uppercase tracking-[0.16em] text-slate-400">Capacity</p>
                <div className="mt-2 flex items-center gap-2 text-lg font-semibold text-slate-800">
                  <FaWeightScale className="text-slate-500" />
                  {vehicle.capacity ?? 0}
                </div>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between rounded-2xl bg-slate-50 p-4">
              <div>
                <p className="text-xs uppercase tracking-[0.16em] text-slate-400">Readiness</p>
                <p className="mt-2 text-sm text-slate-600">Current operating condition of the selected vehicle.</p>
              </div>
              <span className={`rounded-full px-4 py-2 text-sm font-semibold ${statusClass(vehicle.status)}`}>{normalizeVehicleStatus(vehicle.status)}</span>
            </div>
          </article>
        ))}
      </section>

      {!isLoading && filteredVehicles.length === 0 ? (
        <div className="rounded-[28px] border border-dashed border-slate-300 bg-white px-6 py-16 text-center shadow-sm">
          <FaFilter className="mx-auto text-4xl text-slate-300" />
          <h3 className="mt-4 text-2xl font-semibold text-slate-700">No vehicles match this view</h3>
          <p className="mt-2 text-slate-500">Try a different filter to review fleet records.</p>
        </div>
      ) : null}
    </div>
  );
}

import { useEffect, useMemo, useState } from "react";
import {
  FaBusSimple,
  FaCalendarDays,
  FaCreditCard,
  FaCirclePlus,
  FaClock,
  FaMoneyBillWave,
  FaLocationArrow,
  FaRoute,
  FaTicket,
  FaUser,
} from "react-icons/fa6";
import { axiosInstance } from "../api/axiosInstance";
import { useAuth } from "../context/AuthContext";

const defaultForm = {
  route: "",
  passengerName: "",
  pickupLocation: "",
  dropLocation: "",
  travelDate: "",
  paymentMethod: "cash",
  notes: "",
};

const formatStatus = (status = "") => {
  if (status === "confirmed") return "Confirmed";
  if (status === "pending") return "Pending";
  if (status === "assigned") return "Assigned";
  if (status === "completed") return "Completed";
  if (status === "cancelled") return "Cancelled";
  return status;
};

export default function Booking() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [formData, setFormData] = useState(defaultForm);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const paymentOptions = [
    {
      value: "online",
      label: "Online Payment",
      helper: "Pay through an online payment gateway",
      icon: FaCreditCard,
    },
    {
      value: "cash",
      label: "Cash",
      helper: "Pay in cash during trip coordination",
      icon: FaMoneyBillWave,
    },
  ];

  useEffect(() => {
    const loadData = async () => {
      try {
        const [{ data: routeData }, { data: bookingData }] = await Promise.all([
          axiosInstance.get("/api/routes"),
          axiosInstance.get("/api/bookings"),
        ]);
        setRoutes(routeData);
        setBookings(bookingData);
        setFormData((current) => ({
          ...current,
          passengerName: current.passengerName || user?.name || "",
          route: current.route || routeData[0]?._id || "",
        }));
      } catch (fetchError) {
        setError(fetchError.response?.data?.message || fetchError.message || "Unable to load booking data");
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [user?.name]);

  const summary = useMemo(
    () => ({
      total: bookings.length,
      confirmed: bookings.filter((booking) => booking.status === "confirmed").length,
      pending: bookings.filter((booking) => booking.status === "pending").length,
    }),
    [bookings]
  );

  const handleChange = (field, value) => {
    setFormData((current) => ({ ...current, [field]: value }));
  };

  const addBooking = async () => {
    if (!formData.route || !formData.passengerName || !formData.pickupLocation || !formData.dropLocation || !formData.travelDate || !formData.paymentMethod) {
      setError("All booking fields are required");
      setSuccess("");
      return;
    }

    try {
      setIsSubmitting(true);
      setError("");
      const { data } = await axiosInstance.post("/api/bookings", formData);
      setBookings((current) => [data.booking, ...current]);
      setSuccess(data.message || "Booking created successfully");
      setFormData(() => ({ ...defaultForm, passengerName: user?.name || "", route: routes[0]?._id || "" }));
    } catch (submitError) {
      setError(submitError.response?.data?.message || submitError.message || "Unable to create booking");
      setSuccess("");
    } finally {
      setIsSubmitting(false);
    }
  };

  const statusClass = (status) =>
    status === "Confirmed"
      ? "bg-emerald-100 text-emerald-700"
      : status === "Pending"
        ? "bg-amber-100 text-amber-700"
        : status === "Assigned"
          ? "bg-sky-100 text-sky-700"
          : status === "Completed"
            ? "bg-violet-100 text-violet-700"
            : "bg-rose-100 text-rose-700";

  return (
    <div className="space-y-8">
      <section className="rounded-[30px] bg-[linear-gradient(135deg,#082f49,#0f172a)] px-6 py-8 text-white shadow-2xl md:px-8">
        <div className="grid gap-8 xl:grid-cols-[1.3fr_0.9fr]">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-200">
              <FaTicket className="text-cyan-300" /> Booking operations
            </div>
            <h1 className="mt-5 text-3xl font-semibold md:text-5xl">Booking requests and trip scheduling.</h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300 md:text-base">
              Create travel requests, review booking status, and monitor assigned route, vehicle, and driver details.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-3 xl:grid-cols-1">
            {[
              { label: "Total Bookings", value: summary.total, icon: FaTicket },
              { label: "Confirmed", value: summary.confirmed, icon: FaCalendarDays },
              { label: "Pending", value: summary.pending, icon: FaClock },
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
      {success ? <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-emerald-700 shadow-sm">{success}</div> : null}

      <section className="grid gap-6 xl:grid-cols-[0.95fr_1.25fr]">
        <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/60">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.18em] text-slate-400">Create booking</p>
              <h2 className="mt-2 text-2xl font-semibold text-slate-900">Trip intake form</h2>
            </div>
            <div className="rounded-2xl bg-cyan-100 p-4 text-cyan-700"><FaCirclePlus /></div>
          </div>

          <div className="mt-6 space-y-4">
            <div className="rounded-2xl border border-slate-200 px-4 py-3">
              <div className="flex items-center gap-3 text-slate-400">
                <FaUser />
                <input type="text" placeholder="Passenger name" value={formData.passengerName} onChange={(event) => handleChange("passengerName", event.target.value)} className="w-full bg-transparent outline-none placeholder:text-slate-400" />
              </div>
            </div>
            <div className="rounded-2xl border border-slate-200 px-4 py-3">
              <div className="flex items-center gap-3 text-slate-400">
                <FaRoute />
                <select value={formData.route} onChange={(event) => handleChange("route", event.target.value)} className="w-full bg-transparent outline-none">
                  <option value="">Select route</option>
                  {routes.map((route) => (
                    <option key={route._id} value={route._id}>{route.source} to {route.destination}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="rounded-2xl border border-slate-200 px-4 py-3">
              <div className="flex items-center gap-3 text-slate-400">
                <FaLocationArrow />
                <input type="text" placeholder="Pickup location" value={formData.pickupLocation} onChange={(event) => handleChange("pickupLocation", event.target.value)} className="w-full bg-transparent outline-none placeholder:text-slate-400" />
              </div>
            </div>
            <div className="rounded-2xl border border-slate-200 px-4 py-3">
              <div className="flex items-center gap-3 text-slate-400">
                <FaLocationArrow />
                <input type="text" placeholder="Drop location" value={formData.dropLocation} onChange={(event) => handleChange("dropLocation", event.target.value)} className="w-full bg-transparent outline-none placeholder:text-slate-400" />
              </div>
            </div>
            <div className="rounded-2xl border border-slate-200 px-4 py-3">
              <div className="flex items-center gap-3 text-slate-400">
                <FaCalendarDays />
                <input type="date" value={formData.travelDate} onChange={(event) => handleChange("travelDate", event.target.value)} className="w-full bg-transparent outline-none" />
              </div>
            </div>
            <div className="space-y-3">
              <div>
                <p className="text-sm font-medium text-slate-700">Choose payment method</p>
                <p className="mt-1 text-sm text-slate-500">Select how this booking should be paid.</p>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {paymentOptions.map(({ value, label, helper, icon }) => {
                  const isSelected = formData.paymentMethod === value;
                  return (
                    <button
                      key={value}
                      type="button"
                      onClick={() => handleChange("paymentMethod", value)}
                      className={`rounded-2xl border p-4 text-left transition ${
                        isSelected
                          ? "border-cyan-300 bg-cyan-50 shadow-sm"
                          : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
                      }`}
                      >
                      <div className="flex items-start gap-3">
                        <div className={`rounded-2xl p-3 ${isSelected ? "bg-cyan-100 text-cyan-700" : "bg-slate-100 text-slate-600"}`}>
                          {icon()}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900">{label}</p>
                          <p className="mt-1 text-sm text-slate-500">{helper}</p>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
            <div className="rounded-2xl border border-slate-200 px-4 py-3">
              <textarea placeholder="Optional notes" value={formData.notes} onChange={(event) => handleChange("notes", event.target.value)} className="min-h-24 w-full resize-none bg-transparent outline-none placeholder:text-slate-400" />
            </div>
            <button onClick={addBooking} disabled={isSubmitting} className="w-full rounded-2xl bg-slate-950 px-4 py-3 font-semibold text-white transition hover:bg-slate-800 disabled:opacity-70">
              {isSubmitting ? "Submitting..." : "Submit booking request"}
            </button>
          </div>
        </div>

        <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/60">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <p className="text-sm uppercase tracking-[0.18em] text-slate-400">Recent activity</p>
              <h2 className="mt-2 text-2xl font-semibold text-slate-900">My bookings</h2>
            </div>
            <div className="rounded-full bg-emerald-50 px-4 py-2 text-sm font-medium text-emerald-700">Live booking status</div>
          </div>

          <div className="mt-6 space-y-4">
            {bookings.map((booking) => {
              const displayStatus = formatStatus(booking.status);
              return (
                <article key={booking._id} className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div>
                      <p className="text-sm uppercase tracking-[0.16em] text-slate-400">Booking request</p>
                      <h3 className="mt-2 text-xl font-semibold text-slate-900">{booking.passengerName}</h3>
                      <div className="mt-4 flex flex-wrap gap-4 text-sm text-slate-600">
                        <span className="inline-flex items-center gap-2"><FaRoute className="text-slate-400" /> {booking.route?.source} to {booking.route?.destination}</span>
                        <span className="inline-flex items-center gap-2"><FaLocationArrow className="text-slate-400" /> {booking.pickupLocation} to {booking.dropLocation}</span>
                        <span className="inline-flex items-center gap-2"><FaCalendarDays className="text-slate-400" /> {new Date(booking.travelDate).toLocaleDateString("en-IN")}</span>
                        <span className="inline-flex items-center gap-2"><FaCreditCard className="text-slate-400" /> {booking.paymentMethod === "online" ? "Online Payment" : "Cash"}</span>
                        <span className="inline-flex items-center gap-2"><FaBusSimple className="text-slate-400" /> {booking.vehicle?.number || "Vehicle pending"}</span>
                        <span className="inline-flex items-center gap-2"><FaUser className="text-slate-400" /> {booking.driver?.name || "Driver pending"}</span>
                      </div>
                    </div>
                    <span className={`rounded-full px-4 py-2 text-sm font-semibold ${statusClass(displayStatus)}`}>{displayStatus}</span>
                  </div>
                </article>
              );
            })}

            {!isLoading && bookings.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-10 text-center text-slate-500">No bookings yet. Create your first request from the form.</div>
            ) : null}
          </div>
        </div>
      </section>
    </div>
  );
}

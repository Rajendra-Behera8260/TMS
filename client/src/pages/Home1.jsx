import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="overflow-hidden">
      <section className="relative overflow-hidden bg-[linear-gradient(135deg,#0f172a_0%,#1e3a8a_55%,#0891b2_100%)] py-20 text-white md:py-28">
        <div className="absolute left-[-5rem] top-8 h-48 w-48 rounded-full bg-cyan-300/20 blur-3xl md:h-72 md:w-72" />
        <div className="absolute bottom-[-4rem] right-[-2rem] h-56 w-56 rounded-full bg-blue-100/20 blur-3xl md:h-80 md:w-80" />

        <div className="section-container relative z-10">
          <div className="grid items-center gap-12 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="animate-fadeIn text-center lg:text-left">
              <span className="inline-flex rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-sky-100">
                Transport Operations Platform
              </span>
              <h1 className="mt-6 text-4xl font-semibold leading-tight sm:text-5xl lg:text-6xl">
                Move fleets, drivers, and bookings with clarity.
              </h1>
              <p className="mt-6 max-w-2xl text-base leading-8 text-blue-100/90 md:text-lg">
                A professional transport management workspace for organizing routes,
                dispatch visibility, and day-to-day movement planning.
              </p>

              <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row lg:justify-start">
                <Link to="/login" className="primary-button w-full sm:w-auto">
                  Get Started
                </Link>
                <Link to="/about" className="secondary-button w-full border-white/30 bg-white/10 text-white hover:border-cyan-200 hover:text-white sm:w-auto">
                  Learn More
                </Link>
              </div>
            </div>

            <div className="glass-panel p-6 sm:p-8">
              <div className="grid gap-4 sm:grid-cols-2">
                {[
                  { label: "Fleet Visibility", value: "24/7" },
                  { label: "Route Planning", value: "Smart" },
                  { label: "Driver Records", value: "Centralized" },
                  { label: "Booking Flow", value: "Streamlined" },
                ].map((item) => (
                  <div key={item.label} className="rounded-3xl border border-white/50 bg-white/75 p-5 text-left">
                    <p className="text-sm font-medium text-slate-500">{item.label}</p>
                    <p className="mt-3 text-2xl font-semibold text-slate-900">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-container py-16 md:py-20">
        <div className="text-center">
          <h2 className="section-title">A cleaner system for daily transport work</h2>
          <p className="mx-auto mt-4 max-w-3xl section-copy">
            Built to help teams run transport operations with less friction, better oversight,
            and a more dependable workflow across bookings, fleet, and route planning.
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {[
            {
              title: "Operational Visibility",
              copy: "Keep vehicles, bookings, and movement status easy to review from one place.",
            },
            {
              title: "Structured Route Planning",
              copy: "Track corridors, trip timings, and dispatch readiness with better clarity.",
            },
            {
              title: "Professional Record Keeping",
              copy: "Manage fleet and driver information in a format teams can work with confidently.",
            },
          ].map((item) => (
            <article key={item.title} className="surface-card p-8 transition duration-300 hover:-translate-y-1">
              <h3 className="text-2xl font-semibold text-slate-900">{item.title}</h3>
              <p className="mt-4 text-sm leading-7 text-slate-600">{item.copy}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-white py-16 md:py-20">
        <div className="section-container">
          <div className="grid gap-6 rounded-[32px] bg-[linear-gradient(135deg,#e0f2fe_0%,#eff6ff_45%,#f8fafc_100%)] p-8 md:grid-cols-3 md:p-12">
            {[
              { value: "500+", label: "Fleet units monitored" },
              { value: "120+", label: "Business clients supported" },
              { value: "99%", label: "Operational punctuality target" },
            ].map((item) => (
              <div key={item.label} className="text-center">
                <p className="text-4xl font-semibold text-sky-700 md:text-5xl">{item.value}</p>
                <p className="mt-3 text-sm uppercase tracking-[0.16em] text-slate-500">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;

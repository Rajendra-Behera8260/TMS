import { motion } from "framer-motion";

const MotionDiv = motion.div;

const fadeUp = {
  hidden: { opacity: 0, y: 60 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
};

const About = () => {
  return (
    <div className="overflow-hidden">
      <section className="bg-[linear-gradient(135deg,#0f172a_0%,#1d4ed8_52%,#0891b2_100%)] py-18 text-white md:py-24">
        <div className="section-container text-center">
          <MotionDiv initial="hidden" animate="visible" variants={fadeUp}>
            <span className="inline-flex rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-sky-100">
              About TMS
            </span>
            <h1 className="mt-6 text-4xl font-semibold tracking-tight md:text-5xl">
              Transport management with a more dependable operating flow.
            </h1>
            <p className="mx-auto mt-6 max-w-3xl text-base leading-8 text-blue-100/90 md:text-lg">
              TMS is designed to bring booking coordination, fleet records, driver oversight,
              and route planning into one professional environment.
            </p>
          </MotionDiv>
        </div>
      </section>

      <section className="section-container py-16 md:py-20">
        <div className="grid items-center gap-10 md:grid-cols-2 md:gap-16">
          <MotionDiv
            className="overflow-hidden rounded-[30px] shadow-2xl shadow-slate-200/70"
            initial={{ opacity: 0, x: -100 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <img
              src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d"
              alt="Transport Overview"
              className="hover:scale-110 transition duration-700"
            />
          </MotionDiv>

          <MotionDiv
            className="glass-panel p-8"
            initial={{ opacity: 0, x: 100 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="section-title">Who We Are</h2>
            <p className="mt-6 text-base leading-8 text-slate-600">
              Our platform simplifies transport coordination for teams that need a clearer way to
              monitor vehicles, drivers, routes, and day-to-day service activity.
            </p>
            <p className="mt-4 text-base leading-8 text-slate-600">
              The goal is straightforward: make transport operations feel structured, measurable,
              and easier to manage under real working conditions.
            </p>
          </MotionDiv>
        </div>
      </section>

      <section className="bg-white py-16 md:py-20">
        <div className="section-container grid gap-6 md:grid-cols-2">
          <MotionDiv
            className="surface-card p-8 transition duration-300 hover:-translate-y-1"
            whileInView={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 80 }}
            transition={{ duration: 0.8 }}
          >
            <h3 className="text-2xl font-semibold text-slate-900">Our Mission</h3>
            <p className="mt-4 text-sm leading-7 text-slate-600">
              Deliver innovative transport solutions that enhance productivity,
              improve safety, and reduce operational costs.
            </p>
          </MotionDiv>

          <MotionDiv
            className="surface-card p-8 transition duration-300 hover:-translate-y-1"
            whileInView={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 80 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h3 className="text-2xl font-semibold text-slate-900">Our Vision</h3>
            <p className="mt-4 text-sm leading-7 text-slate-600">
              Become a leading digital transport solution provider through
              technology-driven innovation.
            </p>
          </MotionDiv>
        </div>
      </section>

      <section className="section-container py-16 md:py-20 text-center">
        <h3 className="section-title">Why Teams Choose TMS</h3>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {["Real-Time Monitoring", "Cost Optimization", "Easy Management"].map((title, index) => (
            <MotionDiv
              key={index}
              className="surface-card p-8 transition duration-300 hover:-translate-y-1"
              whileInView={{ opacity: 1, y: 0 }}
              initial={{ opacity: 0, y: 80 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
            >
              <h4 className="text-xl font-semibold text-slate-900">{title}</h4>
              <p className="mt-4 text-sm leading-7 text-slate-600">
                Powerful tools designed to optimize transport performance.
              </p>
            </MotionDiv>
          ))}
        </div>
      </section>
    </div>
  );
};

export default About;

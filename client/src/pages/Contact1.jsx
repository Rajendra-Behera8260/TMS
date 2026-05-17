import { Phone, Mail, MapPin } from "lucide-react";

export default function Contact() {
  return (
    <div className="section-container py-14 md:py-20">
      <div className="glass-panel overflow-hidden p-6 md:p-10">
        <div className="mb-10 text-center">
          <h1 className="section-title">Contact Transport Management System</h1>
          <p className="mx-auto mt-4 max-w-2xl section-copy">
            Reach out for platform guidance, fleet coordination questions, or operational support.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="surface-card p-6 md:p-8">
            <h2 className="mb-4 text-2xl font-semibold text-slate-900">Send Us a Message</h2>

            <form className="space-y-5">
              <input
                type="text"
                placeholder="Your Name"
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-3.5 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-400"
              />

              <input
                type="email"
                placeholder="Your Email"
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-3.5 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-400"
              />

              <textarea
                rows="5"
                placeholder="Your Message"
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-3.5 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-400"
              />

              <button type="submit" className="w-full rounded-2xl bg-sky-600 py-3 font-semibold text-white transition hover:bg-sky-700">
                Send Message
              </button>
            </form>
          </div>

          <div className="rounded-[28px] bg-[linear-gradient(135deg,#0f172a_0%,#1d4ed8_55%,#0891b2_100%)] p-8 text-white shadow-2xl">
            <h2 className="mb-6 text-2xl font-semibold">Contact Information</h2>

            <div className="space-y-6">
              <div className="flex items-center gap-4 rounded-2xl bg-white/10 px-4 py-4 transition hover:bg-white/15">
                <Phone className="h-6 w-6" />
                <span>+91 98765 43210</span>
              </div>

              <div className="flex items-center gap-4 rounded-2xl bg-white/10 px-4 py-4 transition hover:bg-white/15">
                <Mail className="h-6 w-6" />
                <span>support@transportms.com</span>
              </div>

              <div className="flex items-center gap-4 rounded-2xl bg-white/10 px-4 py-4 transition hover:bg-white/15">
                <MapPin className="h-6 w-6" />
                <span>Bhubaneswar, Odisha, India</span>
              </div>
            </div>

            <p className="mt-8 text-sm opacity-90">
              Available 24/7 for fleet management, logistics tracking and operational support.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

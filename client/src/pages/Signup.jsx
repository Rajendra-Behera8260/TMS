import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { FaUser, FaEnvelope, FaLock } from "react-icons/fa";
import "react-toastify/dist/ReactToastify.css";
import { axiosInstance } from "../api/axiosInstance";

export default function SignUp() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { name, email, password, confirmPassword } = formData;

    if (!name || !email || !password || !confirmPassword) {
      toast.error("All fields are required");
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      setIsSubmitting(true);
      const { data } = await axiosInstance.post("/api/auth/register", { name, email, password });
      toast.success(data.message || "Account created successfully");
      setTimeout(() => {
        navigate("/login", { replace: true });
      }, 1200);
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || "Registration failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[linear-gradient(135deg,#0f172a_0%,#1e3a8a_50%,#0f766e_100%)] px-4 py-12">
      <div className="absolute left-[-4rem] top-8 h-56 w-56 rounded-full bg-cyan-300/12 blur-3xl" />
      <div className="absolute bottom-[-3rem] right-[-1rem] h-64 w-64 rounded-full bg-blue-100/10 blur-3xl" />
      <ToastContainer position="top-center" autoClose={2000} theme="colored" />

      <div className="relative mx-auto w-full max-w-md overflow-hidden rounded-[34px] border border-white/15 bg-white shadow-2xl">
        <div className="w-full bg-white p-8 sm:p-10">
          <h2 className="mb-2 text-center text-3xl font-semibold text-slate-900">Transport Management</h2>
          <p className="mb-8 text-center text-slate-500">Create your professional account</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="relative">
              <FaUser className="absolute left-3 top-4 text-slate-400" />
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={formData.name}
                onChange={handleChange}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>

            <div className="relative">
              <FaEnvelope className="absolute left-3 top-4 text-slate-400" />
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleChange}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>

            <div className="relative">
              <FaLock className="absolute left-3 top-4 text-slate-400" />
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>

            <div className="relative">
              <FaLock className="absolute left-3 top-4 text-slate-400" />
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-2xl bg-sky-600 py-3 font-semibold text-white transition-all duration-300 hover:bg-sky-700 disabled:opacity-70"
            >
              {isSubmitting ? "Creating account..." : "Create Account"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-600">
            Already have an account?{" "}
            <Link to="/login" className="font-semibold text-sky-700 hover:underline">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

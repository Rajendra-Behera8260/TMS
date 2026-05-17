import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { FaEnvelope, FaLock } from "react-icons/fa";
import "react-toastify/dist/ReactToastify.css";
import { axiosInstance } from "../api/axiosInstance";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { email, password } = formData;

    if (!email || !password) {
      toast.error("All fields are required");
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email)) {
      toast.error("Enter a valid email address");
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    try {
      setIsSubmitting(true);
      const { data } = await axiosInstance.post("/api/auth/login", { email, password });
      login(data);
      toast.success("Login successful");

      const redirectTo = location.state?.from?.pathname || "/dashboard";
      setTimeout(() => {
        navigate(redirectTo, { replace: true });
      }, 1000);
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || "Login failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[linear-gradient(135deg,#0f172a_0%,#1e3a8a_55%,#0f766e_100%)] px-4 py-12">
      <div className="absolute left-[-4rem] top-10 h-52 w-52 rounded-full bg-cyan-300/15 blur-3xl" />
      <div className="absolute bottom-0 right-[-3rem] h-60 w-60 rounded-full bg-blue-100/10 blur-3xl" />
      <ToastContainer position="top-right" autoClose={2000} theme="colored" />

      <div className="relative mx-auto w-full max-w-md overflow-hidden rounded-[34px] border border-white/15 bg-white shadow-2xl">
        <div className="w-full bg-white p-8 sm:p-10">
          <h2 className="mb-2 text-center text-3xl font-semibold text-slate-900">
            Transport Management System
          </h2>
          <p className="mb-8 text-center text-slate-500">Login to your account</p>

          <form onSubmit={handleSubmit} className="space-y-5">
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

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-2xl bg-sky-600 py-3 font-semibold text-white transition duration-300 hover:bg-sky-700 disabled:opacity-70"
            >
              {isSubmitting ? "Logging in..." : "Login"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-600">
            Don&apos;t have an account?{" "}
            <Link to="/signup" className="font-semibold text-sky-700 hover:underline">
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

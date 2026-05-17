import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { FaTruck, FaUserTie, FaRoute, FaClipboardList, FaChartBar, FaSignOutAlt } from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";

const navItems = [
  { to: "/dashboard", label: "Dashboard", icon: FaChartBar },
  { to: "/dashboard/vehicles", label: "Vehicles", icon: FaTruck },
  { to: "/dashboard/drivers", label: "Drivers", icon: FaUserTie },
  { to: "/dashboard/routes", label: "Routes", icon: FaRoute },
  { to: "/dashboard/booking", label: "Booking", icon: FaClipboardList },
  { to: "/dashboard/reports", label: "Reports", icon: FaChartBar },
];

export default function DashboardLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <div className="w-full min-h-screen bg-[linear-gradient(180deg,#f8fbff_0%,#eef6ff_50%,#f8fafc_100%)]">
      <aside className="w-full border-b border-white/10 bg-[linear-gradient(180deg,#0f172a_0%,#1e293b_45%,#1d4ed8_100%)] text-white p-6 shadow-xl lg:fixed lg:inset-y-0 lg:left-0 lg:w-72 lg:overflow-y-auto lg:border-b-0 lg:border-r lg:border-white/10">
        <div className="flex flex-col items-center mb-10">
          <div className="w-20 h-20 rounded-full border-4 border-cyan-300 shadow-lg bg-white/10 flex items-center justify-center text-2xl font-bold uppercase">
            {user?.name?.charAt(0) || "U"}
          </div>
          <h3 className="mt-3 font-semibold text-lg">{user?.name || "User"}</h3>
          <p className="text-sm text-gray-300">{user?.email || "Authenticated user"}</p>
        </div>

        <nav className="space-y-3 text-[17px]">
          {navItems.map(({ to, label, icon }) => {
            const isActive = location.pathname === to;

            return (
              <Link
                key={to}
                to={to}
                className={`flex items-center gap-3 transition-all duration-300 p-3 rounded-lg ${
                  isActive
                    ? "bg-white/12 text-cyan-100 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.12)]"
                    : "text-slate-200 hover:text-white hover:bg-white/10"
                }`}
              >
                {icon()} {label}
              </Link>
            );
          })}

          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full mt-8 p-3 rounded-xl bg-gradient-to-r from-cyan-300 to-sky-200 text-left text-slate-950 shadow-lg transition-all duration-300 hover:from-cyan-200 hover:to-sky-100"
          >
            <FaSignOutAlt /> Logout
          </button>
        </nav>
      </aside>

      <main className="min-h-screen p-4 md:p-8 lg:ml-72">
        <Outlet />
      </main>
    </div>
  );
}

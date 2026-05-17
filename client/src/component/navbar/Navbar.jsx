import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, logout, user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setIsOpen(false);
    navigate("/login", { replace: true });
  };

  const closeMenu = () => setIsOpen(false);

  const navLinkClass = (path) =>
    `text-sm font-semibold transition ${
      location.pathname === path ? "text-white" : "text-slate-200/80 hover:text-white"
    }`;

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-[linear-gradient(90deg,rgba(15,23,42,0.96),rgba(30,41,59,0.96),rgba(30,64,175,0.92))] shadow-xl backdrop-blur-xl">
      <div className="section-container">
        <div className="flex min-h-[72px] items-center justify-between gap-4">
          <Link to="/" onClick={closeMenu} className="flex items-center gap-3 text-white">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10 text-lg font-bold shadow-lg shadow-slate-950/20">
              T
            </span>
            <span className="text-lg font-semibold tracking-[0.18em]">TMS</span>
          </Link>

          <nav className="hidden items-center gap-8 md:flex">
            <Link to="/" className={navLinkClass("/")}>Home</Link>
            <Link to="/about" className={navLinkClass("/about")}>About</Link>
            <Link to="/contact" className={navLinkClass("/contact")}>Contact</Link>
          </nav>

          <div className="hidden items-center gap-3 md:flex">
            {isAuthenticated ? (
              <>
                <Link to="/dashboard" className="rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-slate-900 transition hover:bg-sky-100">
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="rounded-full bg-cyan-400 px-5 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300"
                >
                  Logout {user?.name ? `(${user.name})` : ""}
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="rounded-full border border-white/20 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-white/10">
                  Login
                </Link>
                <Link to="/signup" className="rounded-full bg-cyan-400 px-5 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300">
                  Sign Up
                </Link>
              </>
            )}
          </div>

          <button
            type="button"
            onClick={() => setIsOpen((current) => !current)}
            className="inline-flex items-center justify-center rounded-xl border border-white/15 bg-white/10 p-2 text-white md:hidden"
          >
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {isOpen ? (
          <div className="space-y-4 border-t border-white/10 py-4 md:hidden">
            <div className="flex flex-col gap-3">
              <Link to="/" onClick={closeMenu} className={navLinkClass("/")}>Home</Link>
              <Link to="/about" onClick={closeMenu} className={navLinkClass("/about")}>About</Link>
              <Link to="/contact" onClick={closeMenu} className={navLinkClass("/contact")}>Contact</Link>
            </div>

            <div className="flex flex-col gap-3">
              {isAuthenticated ? (
                <>
                  <Link to="/dashboard" onClick={closeMenu} className="rounded-full bg-white px-5 py-3 text-center text-sm font-semibold text-slate-900">
                    Dashboard
                  </Link>
                  <button onClick={handleLogout} className="rounded-full bg-cyan-400 px-5 py-3 text-sm font-semibold text-slate-950">
                    Logout {user?.name ? `(${user.name})` : ""}
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" onClick={closeMenu} className="rounded-full border border-white/20 px-5 py-3 text-center text-sm font-semibold text-white">
                    Login
                  </Link>
                  <Link to="/signup" onClick={closeMenu} className="rounded-full bg-cyan-400 px-5 py-3 text-center text-sm font-semibold text-slate-950">
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        ) : null}
      </div>
    </header>
  );
};

export default Navbar;

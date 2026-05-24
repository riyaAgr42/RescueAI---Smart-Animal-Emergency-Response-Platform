import React, { useEffect, useState } from "react";
import {
  Bars3Icon,
  BoltIcon,
  MoonIcon,
  SunIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const navLinks = [
  { to: "/", label: "Home" },
  { to: "/dashboard", label: "Dashboard" },
  { to: "/report", label: "Report SOS" },
];

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [dark, setDark] = useState(() => localStorage.getItem("theme") === "dark");
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    if (dark) {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [dark]);

  return (
    <header className="sticky top-0 z-30 border-b border-white/40 bg-white/55 backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/55">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
        <Link to="/" className="flex items-center gap-3 font-display text-xl font-semibold text-slate-900 dark:text-white">
          <span className="grid h-11 w-11 place-items-center rounded-2xl bg-hero-gradient text-sm font-bold text-white shadow-lg shadow-primary/20">
            RAI
          </span>
          <div>
            <p>RescueAI</p>
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">
              Emergency Network
            </p>
          </div>
        </Link>

        <nav className="hidden items-center gap-3 text-sm font-semibold lg:flex">
          {navLinks.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `rounded-full px-4 py-2 transition ${
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-white/5 dark:hover:text-white"
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setDark((prev) => !prev)}
            className="grid h-11 w-11 place-items-center rounded-full border border-slate-200 bg-white/80 text-slate-700 transition hover:border-primary hover:text-primary dark:border-white/10 dark:bg-white/5 dark:text-slate-200"
            aria-label="Toggle theme"
          >
            {dark ? <SunIcon className="h-5 w-5" /> : <MoonIcon className="h-5 w-5" />}
          </button>

          <Link to="/report" className="btn-emergency hidden px-5 py-3 lg:inline-flex">
            <BoltIcon className="h-4 w-4" /> SOS Report
          </Link>

          {user ? (
            <div className="relative hidden lg:block">
              <button
                onClick={() => setMenuOpen((p) => !p)}
                className="flex items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-3 py-2 hover:border-primary hover:bg-primary-light dark:border-white/10 dark:bg-white/5"
              >
                <span className="grid h-9 w-9 place-items-center rounded-full bg-primary text-white font-bold">
                  {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                </span>
                <span className="hidden text-sm sm:inline">{user.name?.split(" ")[0] || "User"}</span>
              </button>
              {menuOpen ? (
                <div className="absolute right-0 mt-3 w-56 rounded-3xl border border-white/60 bg-white/85 p-2 shadow-glow backdrop-blur dark:border-white/10 dark:bg-slate-950/80">
                  <Link onClick={() => setMenuOpen(false)} className="block rounded-2xl px-4 py-3 text-sm hover:bg-primary-light dark:hover:bg-white/5" to="/dashboard">Rescue Dashboard</Link>
                  <Link onClick={() => setMenuOpen(false)} className="block rounded-2xl px-4 py-3 text-sm hover:bg-primary-light dark:hover:bg-white/5" to="/chat">Open Chat</Link>
                  <Link onClick={() => setMenuOpen(false)} className="block rounded-2xl px-4 py-3 text-sm hover:bg-primary-light dark:hover:bg-white/5" to="/ai">AI Assistant</Link>
                  <Link onClick={() => setMenuOpen(false)} className="block rounded-2xl px-4 py-3 text-sm hover:bg-primary-light dark:hover:bg-white/5" to="/profile">Profile</Link>
                  <Link onClick={() => setMenuOpen(false)} className="block rounded-2xl px-4 py-3 text-sm hover:bg-primary-light dark:hover:bg-white/5" to="/settings">Settings</Link>
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      logout();
                      navigate("/");
                    }}
                    className="block w-full rounded-2xl px-4 py-3 text-left text-sm text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-500/10"
                  >
                    Logout
                  </button>
                </div>
              ) : null}
            </div>
          ) : (
            <>
              <Link className="hidden rounded-full px-4 py-2 text-sm font-semibold text-slate-600 hover:text-primary dark:text-slate-300 lg:inline-flex" to="/login">Login</Link>
              <Link className="btn-primary hidden px-5 py-3 lg:inline-flex" to="/signup">Join Network</Link>
            </>
          )}

          <button
            onClick={() => setMenuOpen((prev) => !prev)}
            className="grid h-11 w-11 place-items-center rounded-full border border-slate-200 bg-white/80 text-slate-700 lg:hidden dark:border-white/10 dark:bg-white/5 dark:text-slate-200"
            aria-label="Open menu"
          >
            {menuOpen ? <XMarkIcon className="h-5 w-5" /> : <Bars3Icon className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {menuOpen ? (
        <div className="border-t border-white/40 px-4 py-4 lg:hidden dark:border-white/10">
          <div className="mx-auto flex max-w-7xl flex-col gap-2">
            {navLinks.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setMenuOpen(false)}
                className="rounded-2xl px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-primary-light dark:text-slate-200 dark:hover:bg-white/5"
              >
                {item.label}
              </NavLink>
            ))}
            {!user ? (
              <>
                <Link onClick={() => setMenuOpen(false)} to="/login" className="rounded-2xl px-4 py-3 text-sm font-semibold text-slate-700 dark:text-slate-200">
                  Login
                </Link>
                <Link onClick={() => setMenuOpen(false)} to="/signup" className="btn-primary px-5 py-3">
                  Join RescueAI
                </Link>
              </>
            ) : null}
            <Link onClick={() => setMenuOpen(false)} to="/report" className="btn-emergency px-5 py-3">
              <BoltIcon className="h-4 w-4" /> Send SOS
            </Link>
          </div>
        </div>
      ) : null}
    </header>
  );
};

export default Navbar;

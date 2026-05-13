import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

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
    <header className="sticky top-0 z-30 bg-white/70 dark:bg-slate-900/80 backdrop-blur border-b border-white/50 dark:border-slate-800">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-4 py-3">
        <Link to="/" className="flex items-center gap-2 font-display text-xl font-semibold">
          <span className="h-9 w-9 rounded-2xl bg-primary text-white grid place-items-center">RAI</span>
          RescueAI
        </Link>
        <nav className="flex items-center gap-3 text-sm font-semibold relative">
          <Link className="hover:text-primary" to="/report">Report</Link>
          <button
            onClick={() => setDark((prev) => !prev)}
            className="rounded-full border px-3 py-1 text-xs font-semibold hover:bg-primary-light"
          >
            {dark ? "Light" : "Dark"}
          </button>
          {user ? (
            <div className="relative">
              <button
                onClick={() => setMenuOpen((p) => !p)}
                className="flex items-center gap-2 rounded-full border px-3 py-1 hover:bg-primary-light"
              >
                <span className="h-8 w-8 rounded-full bg-primary text-white grid place-items-center font-bold">
                  {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                </span>
                <span className="hidden sm:inline">{user.name?.split(" ")[0] || "User"}</span>
              </button>
              {menuOpen && (
                <div className="absolute right-0 mt-2 w-48 glass rounded-xl p-2 space-y-1">
                  <Link onClick={() => setMenuOpen(false)} className="block px-3 py-2 hover:bg-primary-light rounded-lg" to="/chat">Open Chat</Link>
                  <Link onClick={() => setMenuOpen(false)} className="block px-3 py-2 hover:bg-primary-light rounded-lg" to="/ai">AI Chat</Link>
                  <Link onClick={() => setMenuOpen(false)} className="block w-full text-left px-3 py-2 hover:bg-primary-light rounded-lg" to="/profile">Profile</Link>
                  <Link onClick={() => setMenuOpen(false)} className="block w-full text-left px-3 py-2 hover:bg-primary-light rounded-lg" to="/settings">Settings</Link>
                  <button
                    onClick={() => { setMenuOpen(false); logout(); navigate("/"); }}
                    className="block w-full text-left px-3 py-2 hover:bg-primary-light rounded-lg text-rose-600"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link className="hover:text-primary" to="/login">Login</Link>
              <Link className="btn-primary px-3 py-1" to="/signup">Sign Up</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;

import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar.jsx";

const Settings = () => {
  const [dark, setDark] = useState(() => localStorage.getItem("theme") === "dark");
  const [notifications, setNotifications] = useState(true);

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
    <div className="flex gap-6">
      <Sidebar />
      <div className="flex-1 space-y-4">
        <h2 className="text-2xl font-display">Settings</h2>
        <div className="glass rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold">Dark mode</p>
              <p className="text-xs text-slate-500">Toggle theme across the app.</p>
            </div>
            <label className="inline-flex items-center gap-2">
              <input
                type="checkbox"
                checked={dark}
                onChange={(e) => setDark(e.target.checked)}
                className="h-5 w-5"
              />
              <span>{dark ? "On" : "Off"}</span>
            </label>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold">Notifications</p>
              <p className="text-xs text-slate-500">Toggle email/app notifications (demo only).</p>
            </div>
            <label className="inline-flex items-center gap-2">
              <input
                type="checkbox"
                checked={notifications}
                onChange={(e) => setNotifications(e.target.checked)}
                className="h-5 w-5"
              />
              <span>{notifications ? "On" : "Off"}</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;

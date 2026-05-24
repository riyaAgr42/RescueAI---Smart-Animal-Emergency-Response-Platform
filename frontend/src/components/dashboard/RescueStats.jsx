import React from "react";
import {
  BellAlertIcon,
  CheckBadgeIcon,
  HeartIcon,
  MapPinIcon,
} from "@heroicons/react/24/outline";

const icons = {
  active: BellAlertIcon,
  resolved: CheckBadgeIcon,
  volunteers: HeartIcon,
  zones: MapPinIcon,
};

const RescueStats = ({ stats }) => (
  <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
    {stats.map((item) => {
      const Icon = icons[item.key] || BellAlertIcon;
      return (
        <div
          key={item.key}
          className="rounded-3xl border border-white/60 bg-white/75 p-5 backdrop-blur dark:border-white/10 dark:bg-slate-950/80"
          style={{ boxShadow: "0 0 0 1px rgba(255, 255, 255, 0.08), 0 24px 80px rgba(15, 23, 42, 0.22)" }}
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">{item.label}</p>
              <p className="mt-3 font-display text-4xl font-semibold text-slate-900 dark:text-white">
                {item.value}
              </p>
            </div>
            <span className="grid h-12 w-12 place-items-center rounded-2xl bg-primary/10 text-primary dark:bg-primary/20">
              <Icon className="h-6 w-6" />
            </span>
          </div>
          <p className="mt-4 text-sm text-slate-600 dark:text-slate-300">{item.description}</p>
        </div>
      );
    })}
  </div>
);

export default RescueStats;

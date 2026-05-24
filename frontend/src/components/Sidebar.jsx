import React from "react";
import { NavLink } from "react-router-dom";
import {
  BellAlertIcon,
  HomeIcon,
  PlusIcon,
  UsersIcon,
  ShieldCheckIcon,
  HeartIcon,
  ClipboardDocumentListIcon,
  BanknotesIcon,
} from "@heroicons/react/24/outline";

const menu = [
  { to: "/dashboard", label: "Control Room", icon: HomeIcon },
  { to: "/report", label: "Emergency Report", icon: PlusIcon },
  { to: "/animals", label: "Animal Records", icon: ClipboardDocumentListIcon },
  { to: "/adoption", label: "Adoption", icon: HeartIcon },
  { to: "/donations", label: "Donations", icon: BanknotesIcon },
  { to: "/volunteer", label: "Volunteers", icon: UsersIcon },
  { to: "/admin", label: "NGO Admin", icon: ShieldCheckIcon },
];

const Sidebar = () => (
  <aside className="panel hidden h-fit w-72 shrink-0 space-y-4 xl:block">
    <div className="rounded-3xl bg-night p-5 text-white">
      <div className="flex items-center gap-3">
        <span className="grid h-12 w-12 place-items-center rounded-2xl bg-white/10">
          <BellAlertIcon className="h-6 w-6 text-orange-300" />
        </span>
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-200">Live Mission</p>
          <p className="mt-1 text-lg font-semibold">Rescue command center</p>
        </div>
      </div>
      <p className="mt-4 text-sm leading-6 text-slate-300">
        Manage field cases, volunteer movement, chat coordination, and NGO escalation from one place.
      </p>
    </div>
    {menu.map((item) => (
      <NavLink
        key={item.to}
        to={item.to}
        className={({ isActive }) =>
          `flex items-center gap-3 rounded-2xl px-4 py-3 font-semibold transition ${
            isActive
              ? "bg-primary text-white shadow-lg shadow-primary/20"
              : "text-slate-600 hover:bg-primary-light hover:text-primary dark:text-slate-300 dark:hover:bg-white/5"
          }`
        }
      >
        <item.icon className="h-5 w-5" />
        {item.label}
      </NavLink>
    ))}
  </aside>
);

export default Sidebar;

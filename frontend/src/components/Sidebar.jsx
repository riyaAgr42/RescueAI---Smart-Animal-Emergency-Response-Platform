import React from "react";
import { NavLink } from "react-router-dom";
import {
  HomeIcon,
  PlusIcon,
  UsersIcon,
  ShieldCheckIcon,
  HeartIcon,
  ClipboardDocumentListIcon,
  BanknotesIcon,
} from "@heroicons/react/24/outline";

const menu = [
  { to: "/dashboard", label: "Cases", icon: HomeIcon },
  { to: "/report", label: "Report", icon: PlusIcon },
  { to: "/animals", label: "Animals", icon: ClipboardDocumentListIcon },
  { to: "/adoption", label: "Adoption", icon: HeartIcon },
  { to: "/donations", label: "Donations", icon: BanknotesIcon },
  { to: "/volunteer", label: "Volunteer", icon: UsersIcon },
  { to: "/admin", label: "Admin", icon: ShieldCheckIcon },
];

const Sidebar = () => (
  <aside className="w-56 shrink-0 space-y-2 rounded-2xl glass p-4 h-fit">
    {menu.map((item) => (
      <NavLink
        key={item.to}
        to={item.to}
        className={({ isActive }) =>
          `flex items-center gap-3 rounded-xl px-3 py-2 font-semibold transition ${
            isActive ? "bg-primary text-white" : "hover:bg-primary-light"
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

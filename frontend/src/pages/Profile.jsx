import React from "react";
import Sidebar from "../components/Sidebar.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import api from "../services/api.js";

const Profile = () => {
  const { user, setUser } = useAuth();
  const [note, setNote] = React.useState("");

  const becomeVolunteer = async () => {
    try {
      const { data } = await api.post("/auth/become-volunteer");
      setUser(data.user);
      setNote("You are now a volunteer.");
      setTimeout(() => setNote(""), 2500);
    } catch (err) {
      setNote(err.response?.data?.message || "Could not update role");
    }
  };

  return (
    <div className="flex gap-6">
      <Sidebar />
      <div className="flex-1 space-y-4">
        <h2 className="text-2xl font-display">My Profile</h2>
        <div className="glass rounded-2xl p-6 space-y-4">
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 rounded-full bg-primary text-white grid place-items-center text-xl font-bold">
              {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
            </div>
            <div>
              <p className="text-lg font-semibold">{user?.name || "User"}</p>
              <p className="text-sm text-slate-500">{user?.email}</p>
              <p className="text-xs uppercase text-primary font-semibold">{user?.role}</p>
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div className="rounded-xl border border-slate-200 dark:border-slate-700 p-3">
              <p className="font-semibold mb-1">Role</p>
              <p>{user?.role}</p>
            </div>
            <div className="rounded-xl border border-slate-200 dark:border-slate-700 p-3">
              <p className="font-semibold mb-1">Phone</p>
              <p>{user?.phone || "Not provided"}</p>
            </div>
            <div className="rounded-xl border border-slate-200 dark:border-slate-700 p-3">
              <p className="font-semibold mb-1">User ID</p>
              <p className="break-all">{user?._id || "N/A"}</p>
            </div>
          </div>
          {user?.role !== "admin" && (
            <button className="btn-primary px-4 py-2" onClick={becomeVolunteer}>
              Become a Volunteer
            </button>
          )}
          {note && <p className="text-xs text-emerald-600">{note}</p>}
          <p className="text-xs text-slate-500">Profile data is mostly read-only for simplicity.</p>
        </div>
      </div>
    </div>
  );
};

export default Profile;

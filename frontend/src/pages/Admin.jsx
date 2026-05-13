import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar.jsx";
import Spinner from "../components/Spinner.jsx";
import useCases from "../hooks/useCases.js";
import api from "../services/api.js";

const Admin = () => {
  const { cases, loading, refetch } = useCases();
  const [users, setUsers] = useState([]);
  const [orgs, setOrgs] = useState([]);
  const [userFilter, setUserFilter] = useState("all");
  const [orgForm, setOrgForm] = useState({
    name: "",
    type: "ngo",
    phone: "",
    address: "",
    latitude: "",
    longitude: "",
  });
  const [orgMessage, setOrgMessage] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      const { data } = await api.get("/auth/users", {
        params: userFilter === "all" ? {} : { role: userFilter },
      });
      setUsers(data);
    };
    const fetchOrgs = async () => {
      const { data } = await api.get("/partners");
      setOrgs(data);
    };
    fetchUsers();
    fetchOrgs();
  }, [userFilter]);

  const updateStatus = async (id, status) => {
    await api.put(`/cases/${id}`, { status });
    refetch();
  };

  const remove = async (id) => {
    await api.delete(`/cases/${id}`);
    refetch();
  };

  const submitOrg = async (e) => {
    e.preventDefault();
    setOrgMessage("");
    try {
      const payload = {
        ...orgForm,
        latitude: parseFloat(orgForm.latitude),
        longitude: parseFloat(orgForm.longitude),
      };
      const { data } = await api.post("/partners", payload);
      setOrgs((prev) => [...prev, data].sort((a, b) => a.name.localeCompare(b.name)));
      setOrgForm({
        name: "",
        type: "ngo",
        phone: "",
        address: "",
        latitude: "",
        longitude: "",
      });
      setOrgMessage("Organization added");
      setTimeout(() => setOrgMessage(""), 2000);
    } catch (err) {
      setOrgMessage(err.response?.data?.message || "Failed to add organization");
    }
  };

  return (
    <div className="flex gap-6">
      <Sidebar />
      <div className="flex-1 space-y-4">
        <h2 className="text-2xl font-display">Admin Panel</h2>
        <div className="glass rounded-2xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold">Partner NGOs / Hospitals</p>
            {orgMessage && <span className="text-xs text-emerald-600">{orgMessage}</span>}
          </div>
          <form className="grid md:grid-cols-3 gap-3" onSubmit={submitOrg}>
            <input
              className="rounded-xl border px-3 py-2 text-sm"
              placeholder="Name"
              value={orgForm.name}
              onChange={(e) => setOrgForm({ ...orgForm, name: e.target.value })}
              required
            />
            <select
              className="rounded-xl border px-3 py-2 text-sm"
              value={orgForm.type}
              onChange={(e) => setOrgForm({ ...orgForm, type: e.target.value })}
            >
              <option value="ngo">NGO</option>
              <option value="government_hospital">Government Hospital</option>
              <option value="private_hospital">Private Hospital</option>
            </select>
            <input
              className="rounded-xl border px-3 py-2 text-sm"
              placeholder="Phone"
              value={orgForm.phone}
              onChange={(e) => setOrgForm({ ...orgForm, phone: e.target.value })}
              required
            />
            <input
              className="rounded-xl border px-3 py-2 text-sm md:col-span-2"
              placeholder="Address"
              value={orgForm.address}
              onChange={(e) => setOrgForm({ ...orgForm, address: e.target.value })}
            />
            <input
              className="rounded-xl border px-3 py-2 text-sm"
              placeholder="Latitude"
              value={orgForm.latitude}
              onChange={(e) => setOrgForm({ ...orgForm, latitude: e.target.value })}
              required
            />
            <input
              className="rounded-xl border px-3 py-2 text-sm"
              placeholder="Longitude"
              value={orgForm.longitude}
              onChange={(e) => setOrgForm({ ...orgForm, longitude: e.target.value })}
              required
            />
            <button className="btn-primary px-4 py-2 md:col-span-1">Add</button>
          </form>
          <div className="max-h-52 overflow-auto space-y-2 text-sm">
            {orgs.map((o) => (
              <div
                key={o._id || o.id}
                className="flex items-start justify-between border-b border-white/20 pb-2"
              >
                <div>
                  <div className="font-medium">{o.name}</div>
                  <div className="text-xs uppercase text-slate-500">{o.type?.replace("_", " ")}</div>
                  {o.address && <div className="text-xs text-slate-600">{o.address}</div>}
                </div>
                <div className="text-right">
                  <div className="font-semibold">{o.phone}</div>
                  {o.location && (
                    <div className="text-[11px] text-slate-500">
                      {o.location.latitude}, {o.location.longitude}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="glass rounded-2xl p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-semibold">User Directory</p>
            <select
              className="rounded-lg border px-2 py-1 text-xs"
              value={userFilter}
              onChange={(e) => setUserFilter(e.target.value)}
            >
              <option value="all">All</option>
              <option value="admin">Admins</option>
              <option value="volunteer">Volunteers</option>
              <option value="user">Reporters</option>
            </select>
          </div>
          <div className="max-h-52 overflow-auto space-y-1 text-sm">
            {users.map((u) => (
              <div
                key={u._id}
                className="grid grid-cols-1 md:grid-cols-4 items-center gap-2 border-b border-white/30 py-2"
              >
                <div>
                  <p className="font-semibold">{u.name}</p>
                  <p className="text-xs text-slate-500 break-all">{u.email}</p>
                </div>
                <p className="text-sm font-medium">{u.phone || "N/A"}</p>
                <p className="text-xs text-slate-500">
                  Joined {new Date(u.createdAt).toLocaleDateString()}
                </p>
                <span className="uppercase text-xs text-primary font-semibold text-right md:text-center">
                  {u.role}
                </span>
              </div>
            ))}
          </div>
        </div>
        {loading ? (
          <Spinner />
        ) : (
          <div className="space-y-4">
            {cases.map((c) => (
              <div key={c._id} className="glass rounded-2xl p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold">{c.description}</p>
                    <p className="text-xs text-slate-500">Priority {c.priority}</p>
                  </div>
                  <div className="flex gap-2">
                    <select
                      className="rounded-xl border px-2 py-1 text-sm"
                      value={c.status}
                      onChange={(e) => updateStatus(c._id, e.target.value)}
                    >
                      <option value="pending">Pending</option>
                      <option value="accepted">Accepted</option>
                      <option value="en_route">En Route</option>
                      <option value="at_clinic">At Clinic</option>
                      <option value="completed">Completed</option>
                    </select>
                    <button
                      className="btn-secondary px-3 py-1 text-sm"
                      onClick={() => updateStatus(c._id, "completed")}
                    >
                      Mark Completed
                    </button>
                    <button className="text-rose-500 text-sm" onClick={() => remove(c._id)}>
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;

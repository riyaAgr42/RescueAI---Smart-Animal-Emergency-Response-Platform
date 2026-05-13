import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar.jsx";
import api from "../services/api.js";
import { useAuth } from "../context/AuthContext.jsx";

const Adoption = () => {
  const [requests, setRequests] = useState([]);
  const [form, setForm] = useState({ animal: "", message: "" });
  const [animals, setAnimals] = useState([]);
  const { user } = useAuth();

  const load = async () => {
    const [reqRes, aniRes] = await Promise.all([
      api.get("/adoptions"),
      api.get("/animals", { params: { status: "adoptable" } }),
    ]);
    setRequests(reqRes.data);
    setAnimals(aniRes.data);
  };

  useEffect(() => {
    load();
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    await api.post("/adoptions", form);
    setForm({ animal: "", message: "" });
    load();
  };

  const decide = async (id, status) => {
    await api.put(`/adoptions/${id}`, { status });
    load();
  };

  return (
    <div className="flex gap-6">
      <Sidebar />
      <div className="flex-1 space-y-4">
        <h2 className="text-2xl font-display">Adoption</h2>
        <div className="glass p-4 rounded-2xl space-y-3">
          <p className="font-semibold text-sm">Request to adopt</p>
          <form className="grid md:grid-cols-3 gap-3" onSubmit={submit}>
            <select
              className="rounded-xl border px-3 py-2"
              value={form.animal}
              onChange={(e) => setForm({ ...form, animal: e.target.value })}
              required
            >
              <option value="">Select animal</option>
              {animals.map((a) => (
                <option key={a._id} value={a._id}>
                  {a.name} ({a.species})
                </option>
              ))}
            </select>
            <input
              className="rounded-xl border px-3 py-2 md:col-span-2"
              placeholder="Why do you want to adopt?"
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
            />
            <button className="btn-primary px-4 py-2 md:col-span-3">Send request</button>
          </form>
        </div>
        <div className="space-y-2">
          {requests.map((r) => (
            <div key={r._id} className="glass p-4 rounded-2xl flex items-center justify-between">
              <div>
                <p className="font-semibold">{r.animal?.name || "Animal"}</p>
                <p className="text-xs text-slate-500">Status: {r.status}</p>
                {r.message && <p className="text-sm text-slate-600">“{r.message}”</p>}
              </div>
              {user?.role === "admin" && r.status === "pending" && (
                <div className="flex gap-2 text-sm">
                  <button className="btn-secondary" onClick={() => decide(r._id, "approved")}>Approve</button>
                  <button className="text-rose-500" onClick={() => decide(r._id, "rejected")}>Reject</button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Adoption;

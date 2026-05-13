import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar.jsx";
import api from "../services/api.js";

const Donations = () => {
  const [list, setList] = useState([]);
  const [animals, setAnimals] = useState([]);
  const [form, setForm] = useState({ amount: "", animal: "", message: "" });

  const load = async () => {
    const [donRes, aniRes] = await Promise.all([
      api.get("/donations"),
      api.get("/animals"),
    ]);
    setList(donRes.data);
    setAnimals(aniRes.data);
  };

  useEffect(() => {
    load();
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    await api.post("/donations", { ...form, amount: Number(form.amount) });
    setForm({ amount: "", animal: "", message: "" });
    load();
  };

  const markReceived = async (id) => {
    await api.put(`/donations/${id}/receive`);
    load();
  };

  return (
    <div className="flex gap-6">
      <Sidebar />
      <div className="flex-1 space-y-4">
        <h2 className="text-2xl font-display">Donations</h2>
        <div className="glass p-4 rounded-2xl space-y-3">
          <p className="font-semibold text-sm">Pledge a donation</p>
          <form className="grid md:grid-cols-4 gap-2" onSubmit={submit}>
            <input
              className="rounded-xl border px-3 py-2"
              type="number"
              min="1"
              placeholder="Amount"
              value={form.amount}
              onChange={(e) => setForm({ ...form, amount: e.target.value })}
              required
            />
            <select
              className="rounded-xl border px-3 py-2"
              value={form.animal}
              onChange={(e) => setForm({ ...form, animal: e.target.value })}
            >
              <option value="">General fund</option>
              {animals.map((a) => (
                <option key={a._id} value={a._id}>
                  {a.name} ({a.species})
                </option>
              ))}
            </select>
            <input
              className="rounded-xl border px-3 py-2 md:col-span-2"
              placeholder="Message (optional)"
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
            />
            <button className="btn-primary px-4 py-2 md:col-span-4">Submit</button>
          </form>
        </div>
        <div className="space-y-2">
          {list.map((d) => (
            <div key={d._id} className="glass p-4 rounded-2xl flex items-center justify-between">
              <div>
                <p className="font-semibold">${d.amount}</p>
                <p className="text-xs text-slate-500">
                  {d.animal ? `${d.animal.name} (${d.animal.species})` : "General"} • {d.status}
                </p>
                {d.message && <p className="text-sm text-slate-600">“{d.message}”</p>}
              </div>
              {d.status === "pledged" && (
                <button className="text-sm text-primary" onClick={() => markReceived(d._id)}>
                  Mark received
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Donations;

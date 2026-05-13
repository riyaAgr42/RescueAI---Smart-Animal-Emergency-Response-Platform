import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar.jsx";
import api from "../services/api.js";
import { useAuth } from "../context/AuthContext.jsx";

const Animals = () => {
  const { user } = useAuth();
  const [animals, setAnimals] = useState([]);
  const [form, setForm] = useState({ name: "", species: "dog", breed: "", ageYears: "", foodPreferences: "" });
  const [health, setHealth] = useState({ note: "", doctorName: "" });
  const [appt, setAppt] = useState({ doctorName: "", scheduledFor: "", recommendation: "" });
  const [selectedId, setSelectedId] = useState(null);

  const load = async () => {
    const { data } = await api.get("/animals");
    setAnimals(data);
  };

  useEffect(() => {
    load();
  }, []);

  const createAnimal = async (e) => {
    e.preventDefault();
    const payload = {
      ...form,
      ageYears: Number(form.ageYears || 0),
      foodPreferences: form.foodPreferences
        ? form.foodPreferences.split(",").map((s) => s.trim()).filter(Boolean)
        : [],
    };
    await api.post("/animals", payload);
    setForm({ name: "", species: "dog", breed: "", ageYears: "", foodPreferences: "" });
    load();
  };

  const addHealth = async (id) => {
    await api.post(`/animals/${id}/health`, health);
    setHealth({ note: "", doctorName: "" });
    setSelectedId(null);
    load();
  };

  const addAppt = async (id) => {
    if (!appt.scheduledFor) return;
    await api.post(`/animals/${id}/appointment`, appt);
    setAppt({ doctorName: "", scheduledFor: "", recommendation: "" });
    setSelectedId(null);
    load();
  };

  return (
    <div className="flex gap-6">
      <Sidebar />
      <div className="flex-1 space-y-4">
        <h2 className="text-2xl font-display">Animals & Health</h2>
        {user?.role !== "user" && (
          <div className="glass p-4 rounded-2xl space-y-3">
            <p className="font-semibold text-sm">Add animal</p>
            <form className="grid md:grid-cols-4 gap-2" onSubmit={createAnimal}>
              <input className="rounded-xl border px-3 py-2" placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
              <input className="rounded-xl border px-3 py-2" placeholder="Species" value={form.species} onChange={(e) => setForm({ ...form, species: e.target.value })} />
              <input className="rounded-xl border px-3 py-2" placeholder="Breed" value={form.breed} onChange={(e) => setForm({ ...form, breed: e.target.value })} />
              <input className="rounded-xl border px-3 py-2" placeholder="Age (yrs)" value={form.ageYears} onChange={(e) => setForm({ ...form, ageYears: e.target.value })} />
              <input className="rounded-xl border px-3 py-2 md:col-span-2" placeholder="Food preferences (comma separated)" value={form.foodPreferences} onChange={(e) => setForm({ ...form, foodPreferences: e.target.value })} />
              <button className="btn-primary px-4 py-2 md:col-span-2">Save</button>
            </form>
          </div>
        )}
        <div className="space-y-3">
          {animals.map((a) => (
            <div key={a._id} className="glass p-4 rounded-2xl space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold">{a.name} ({a.species})</p>
                  <p className="text-xs text-slate-500">Breed: {a.breed || "N/A"} • Status: {a.status}</p>
                  {a.foodPreferences?.length > 0 && (
                    <p className="text-[11px] text-slate-500">Food: {a.foodPreferences.join(", ")}</p>
                  )}
                </div>
                {user?.role !== "user" && (
                  <button
                    className="text-sm text-primary"
                    onClick={() => setSelectedId(selectedId === a._id ? null : a._id)}
                  >
                    + Health/appointments
                  </button>
                )}
              </div>
              {selectedId === a._id && (
                <div className="space-y-2">
                  <div className="grid md:grid-cols-3 gap-2">
                    <input className="rounded-xl border px-3 py-2" placeholder="Health note" value={health.note} onChange={(e) => setHealth({ ...health, note: e.target.value })} />
                    <input className="rounded-xl border px-3 py-2" placeholder="Doctor" value={health.doctorName} onChange={(e) => setHealth({ ...health, doctorName: e.target.value })} />
                    <button className="btn-secondary" onClick={() => addHealth(a._id)}>Save note</button>
                  </div>
                  <div className="grid md:grid-cols-4 gap-2">
                    <input className="rounded-xl border px-3 py-2" type="date" value={appt.scheduledFor} onChange={(e) => setAppt({ ...appt, scheduledFor: e.target.value })} />
                    <input className="rounded-xl border px-3 py-2" placeholder="Doctor" value={appt.doctorName} onChange={(e) => setAppt({ ...appt, doctorName: e.target.value })} />
                    <input className="rounded-xl border px-3 py-2 md:col-span-2" placeholder="Recommendation" value={appt.recommendation} onChange={(e) => setAppt({ ...appt, recommendation: e.target.value })} />
                    <button className="btn-secondary md:col-span-4" onClick={() => addAppt(a._id)}>Save appointment</button>
                  </div>
                </div>
              )}
              <div className="text-xs text-slate-600 space-y-1">
                {a.healthUpdates?.slice(0, 3).map((h, idx) => (
                  <div key={idx} className="rounded-lg bg-white/50 px-2 py-1">
                    <div className="font-medium">{h.note}</div>
                    <div className="text-[11px] text-slate-500">{h.doctorName || "Doctor"} • {new Date(h.checkupDate).toLocaleDateString()}</div>
                  </div>
                ))}
                {a.doctorAppointments?.slice(0, 2).map((d, idx) => (
                  <div key={idx} className="rounded-lg bg-white/40 px-2 py-1">
                    <div className="font-medium">Appointment: {new Date(d.scheduledFor).toLocaleDateString()}</div>
                    <div className="text-[11px] text-slate-500">{d.doctorName || "Doctor"} • {d.recommendation || "Checkup"}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Animals;

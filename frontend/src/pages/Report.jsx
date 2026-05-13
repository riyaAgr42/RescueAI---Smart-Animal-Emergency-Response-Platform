import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar.jsx";
import Toast from "../components/Toast.jsx";
import api from "../services/api.js";

const Report = () => {
  const [form, setForm] = useState({
    description: "",
    latitude: "",
    longitude: "",
    image: null,
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [partners, setPartners] = useState([]);

  useEffect(() => {
    // request location after a short delay to reduce violation warning; still requires user permission
    const timer = setTimeout(() => {
      navigator.geolocation.getCurrentPosition(
        (pos) =>
          setForm((prev) => ({
            ...prev,
            latitude: pos.coords.latitude.toFixed(6),
            longitude: pos.coords.longitude.toFixed(6),
          })),
        () => setError("Location access denied")
      );
    }, 400);
    return () => clearTimeout(timer);
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("description", form.description);
    data.append("latitude", form.latitude);
    data.append("longitude", form.longitude);
    if (form.image) data.append("image", form.image);
    try {
      const { data: res } = await api.post("/cases", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setMessage("Report submitted. Volunteers notified.");
      setPartners(res.nearbyPartners || []);
      setForm({ description: "", latitude: form.latitude, longitude: form.longitude, image: null });
    } catch (err) {
      setError(err.response?.data?.message || "Failed to submit");
    }
  };

  return (
    <div className="flex gap-6">
      <Sidebar />
      <div className="flex-1">
        {message && <Toast message={message} />}
        {error && <Toast message={error} variant="error" />}
        <div className="glass rounded-3xl p-6 space-y-4">
          <h2 className="text-2xl font-display">Report an Animal</h2>
          <form className="space-y-4" onSubmit={submit}>
            <textarea
              className="w-full rounded-2xl border px-4 py-3"
              rows="4"
              placeholder="Describe the situation"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
            <div className="grid grid-cols-2 gap-3">
              <input
                className="rounded-xl border px-4 py-3"
                placeholder="Latitude"
                value={form.latitude}
                onChange={(e) => setForm({ ...form, latitude: e.target.value })}
              />
              <input
                className="rounded-xl border px-4 py-3"
                placeholder="Longitude"
                value={form.longitude}
                onChange={(e) => setForm({ ...form, longitude: e.target.value })}
              />
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setForm({ ...form, image: e.target.files[0] })}
              className="block text-sm text-slate-500"
            />
            <button className="btn-primary px-6 py-3">Submit report</button>
          </form>
          {partners.length > 0 && (
            <div className="mt-4 space-y-2">
              <h3 className="font-semibold text-lg">Nearest animal help</h3>
              <p className="text-sm text-slate-600">
                Call these NGOs/government hospitals to start treatment while volunteers arrive.
              </p>
              <div className="space-y-2">
                {partners.map((p) => (
                  <div key={p.id} className="rounded-xl border px-4 py-3 flex justify-between items-start">
                    <div>
                      <div className="font-medium">{p.name}</div>
                      <div className="text-xs uppercase tracking-wide text-slate-500">{p.type.replace("_", " ")}</div>
                      {p.address && <div className="text-sm text-slate-600">{p.address}</div>}
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">{p.phone}</div>
                      <div className="text-xs text-slate-500">{p.distanceKm} km away</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Report;

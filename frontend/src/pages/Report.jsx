import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar.jsx";
import Toast from "../components/Toast.jsx";
import SectionHeader from "../components/ui/SectionHeader.jsx";
import RescueIntelPanel from "../components/report/RescueIntelPanel.jsx";
import api from "../services/api.js";

const initialLocationState = {
  loading: false,
  requested: false,
};

const previewAnalysis = (description, animalType, emergencyLevel) => {
  const text = description.toLowerCase();
  const severity = /bleeding|fracture|not moving|critical|accident/.test(text)
    ? "Critical"
    : /injured|limping|weak|wound|pain/.test(text)
      ? "Medium"
      : "Mild";

  const suggestions = [
    severity === "Critical"
      ? "Keep bystanders away and do not force the animal to stand if trauma is visible."
      : "Approach slowly and avoid making direct eye contact if the animal looks stressed.",
    "Capture a second photo if possible so volunteers can judge the scene faster.",
    "Mention nearby landmarks so responders can find the location without delay.",
  ];

  return {
    animalType: animalType || "Unknown",
    severity,
    duplicateRisk: description.trim().length > 60 ? "Low" : "Review needed",
    suggestions,
    emergencyLevel: emergencyLevel || "medium",
  };
};

const Report = () => {
  const [form, setForm] = useState({
    description: "",
    animalType: "dog",
    emergencyLevel: "high",
    reporterContact: "",
    latitude: "",
    longitude: "",
    image: null,
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [partners, setPartners] = useState([]);
  const [locationState, setLocationState] = useState(initialLocationState);
  const preview = previewAnalysis(form.description, form.animalType, form.emergencyLevel);

  const fillCurrentLocation = () => {
    setLocationState({ loading: true, requested: true });
    setError("");

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setForm((prev) => ({
          ...prev,
          latitude: pos.coords.latitude.toFixed(6),
          longitude: pos.coords.longitude.toFixed(6),
        }));
        setLocationState({ loading: false, requested: true });
      },
      () => {
        setError("Location access denied");
        setLocationState({ loading: false, requested: true });
      }
    );
  };

  const submit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("description", form.description);
    data.append("animalType", form.animalType);
    data.append("emergencyLevel", form.emergencyLevel);
    data.append("reporterContact", form.reporterContact);
    data.append("latitude", form.latitude);
    data.append("longitude", form.longitude);
    if (form.image) data.append("image", form.image);

    try {
      const { data: res } = await api.post("/cases", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setMessage("Report submitted. Volunteers notified.");
      setPartners(res.nearbyPartners || []);
      setForm({
        description: "",
        animalType: "dog",
        emergencyLevel: "high",
        reporterContact: "",
        latitude: form.latitude,
        longitude: form.longitude,
        image: null,
      });
    } catch (err) {
      setError(err.response?.data?.message || "Failed to submit");
    }
  };

  return (
    <div className="flex gap-6">
      <Sidebar />
      <div className="flex-1 space-y-6">
        {message ? <Toast message={message} /> : null}
        {error ? <Toast message={error} variant="error" /> : null}

        <section className="panel-dark overflow-hidden">
          <SectionHeader
            badge="Citizen SOS Module"
            title="Create an emergency rescue report"
            description="This flow captures the minimum information responders need: description, animal type, emergency level, GPS location, contact details, and optional image evidence."
            invert
          />
        </section>

        <div className="grid gap-6 xl:grid-cols-[1.08fr_0.92fr]">
          <div className="panel space-y-5">
            <form className="space-y-5" onSubmit={submit}>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200">Animal type</label>
                  <select
                    value={form.animalType}
                    onChange={(e) => setForm({ ...form, animalType: e.target.value })}
                  >
                    <option value="dog">Dog</option>
                    <option value="cat">Cat</option>
                    <option value="cow">Cow</option>
                    <option value="bird">Bird</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200">Emergency level</label>
                  <select
                    value={form.emergencyLevel}
                    onChange={(e) => setForm({ ...form, emergencyLevel: e.target.value })}
                  >
                    <option value="critical">Critical</option>
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200">Emergency description</label>
                <textarea
                  rows="5"
                  placeholder="Explain the animal condition, visible injuries, traffic risk, landmarks, and anything volunteers should know."
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200">Latitude</label>
                  <input
                    placeholder="Latitude"
                    value={form.latitude}
                    onChange={(e) => setForm({ ...form, latitude: e.target.value })}
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200">Longitude</label>
                  <input
                    placeholder="Longitude"
                    value={form.longitude}
                    onChange={(e) => setForm({ ...form, longitude: e.target.value })}
                  />
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  className="btn-secondary px-5 py-3"
                  onClick={fillCurrentLocation}
                  disabled={locationState.loading}
                >
                  {locationState.loading ? "Fetching location..." : "Use Current Location"}
                </button>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {locationState.requested
                    ? "Location fields update after browser permission is granted."
                    : "Click the button to safely request GPS from the browser."}
                </p>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200">Reporter phone</label>
                  <input
                    type="tel"
                    placeholder="Phone number for urgent callback"
                    value={form.reporterContact}
                    onChange={(e) => setForm({ ...form, reporterContact: e.target.value })}
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200">Image evidence</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setForm({ ...form, image: e.target.files[0] })}
                  />
                </div>
              </div>

              <div className="rounded-3xl border border-orange-200 bg-orange-50 p-4 dark:border-orange-500/20 dark:bg-orange-500/10">
                <p className="text-sm font-semibold text-orange-700 dark:text-orange-200">Why this form looks this way</p>
                <p className="mt-2 text-sm leading-6 text-orange-700/90 dark:text-orange-100">
                  Each field maps directly to your backend schema so you can explain the full request lifecycle clearly: submit, analyze, assign, track, and complete.
                </p>
              </div>

              <button className="btn-emergency px-6 py-4 text-base">Dispatch Rescue Request</button>
            </form>
          </div>

          <div className="space-y-6">
            <RescueIntelPanel preview={preview} />
            {partners.length > 0 ? (
              <div className="panel space-y-4">
                <SectionHeader
                  badge="Nearby Help"
                  title="Closest NGOs and veterinary support"
                  description="These are sorted by nearest distance so users can call while volunteers are traveling."
                />
                <div className="space-y-3">
                  {partners.map((p) => (
                    <div key={p.id} className="rounded-3xl border border-slate-200 bg-slate-50 px-4 py-4 dark:border-white/10 dark:bg-slate-900/80">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <div className="text-base font-semibold text-slate-900 dark:text-white">{p.name}</div>
                          <div className="text-xs uppercase tracking-wide text-slate-500">{p.type.replace("_", " ")}</div>
                          {p.address ? <div className="mt-2 text-sm text-slate-600 dark:text-slate-300">{p.address}</div> : null}
                        </div>
                        <div className="text-right">
                          <div className="font-semibold text-slate-900 dark:text-white">{p.phone}</div>
                          <div className="mt-1 text-xs text-slate-500">{p.distanceKm} km away</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Report;

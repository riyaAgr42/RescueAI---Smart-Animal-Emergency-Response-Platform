import React, { useEffect, useMemo, useState } from "react";
import { io } from "socket.io-client";
import Sidebar from "../components/Sidebar.jsx";
import CaseCard from "../components/CaseCard.jsx";
import Spinner from "../components/Spinner.jsx";
import useCases from "../hooks/useCases.js";
import api from "../services/api.js";
import Toast from "../components/Toast.jsx";

const Volunteer = () => {
  const { cases, loading, error, refetch } = useCases({ status: "pending" });
  const [query, setQuery] = useState("");
  const [toast, setToast] = useState("");
  const [partners, setPartners] = useState([]);
  const [findingHelp, setFindingHelp] = useState(false);

  useEffect(() => {
    const socket = io(import.meta.env.VITE_API_SOCKET || "http://localhost:5000", {
      reconnectionAttempts: 2,
      timeout: 4000,
      autoConnect: true,
    });

    socket.on("case:new", refetch);
    socket.on("case:update", refetch);
    socket.on("connect_error", () => {
      setToast((current) => current || "Realtime server is offline. Start backend to enable live volunteer alerts.");
    });

    return () => {
      socket.off("case:new", refetch);
      socket.off("case:update", refetch);
      socket.off("connect_error");
      socket.disconnect();
    };
  }, []);

  const accept = async (id) => {
    await api.post(`/volunteer/accept/${id}`);
    refetch();
  };

  const enRoute = async (id) => {
    await api.post(`/volunteer/enroute/${id}`);
    refetch();
  };

  const atClinic = async (id) => {
    await api.post(`/volunteer/atclinic/${id}`);
    refetch();
  };

  const complete = async (id) => {
    await api.post(`/volunteer/complete/${id}`);
    refetch();
  };

  const reject = async (id) => {
    await api.post(`/volunteer/reject/${id}`);
    refetch();
  };

  const updateLocation = () => {
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        await api.post("/volunteer/location", {
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
        });
        setToast("Location updated for nearby matching");
        setTimeout(() => setToast(""), 3000);
      },
      () => setToast("Location permission denied")
    );
  };

  const findNearbyHelp = () => {
    setFindingHelp(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const { data } = await api.get("/partners/nearby", {
            params: {
              latitude: pos.coords.latitude,
              longitude: pos.coords.longitude,
              radiusKm: 30,
              limit: 5,
            },
          });
          setPartners(data);
        } catch (err) {
          setToast(err.response?.data?.message || "Could not load nearby contacts");
          setTimeout(() => setToast(""), 3000);
        } finally {
          setFindingHelp(false);
        }
      },
      () => {
        setToast("Location permission denied");
        setFindingHelp(false);
        setTimeout(() => setToast(""), 3000);
      }
    );
  };

  const filtered = useMemo(
    () =>
      cases.filter((c) =>
        c.description.toLowerCase().includes(query.toLowerCase().trim())
      ),
    [cases, query]
  );

  return (
    <div className="flex gap-6">
      {toast && <Toast message={toast} />}
      <Sidebar />
      <div className="flex-1 space-y-4">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <h2 className="text-2xl font-display">Nearby Cases</h2>
          <input
            className="rounded-xl border px-3 py-2 text-sm"
            placeholder="Search description"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <div className="flex gap-2">
            <button className="btn-secondary px-4 py-2" onClick={updateLocation}>
              Update My Location
            </button>
            <button className="btn-primary px-4 py-2" onClick={findNearbyHelp} disabled={findingHelp}>
              {findingHelp ? "Finding..." : "Nearby NGOs/Hospitals"}
            </button>
          </div>
        </div>
        {loading ? (
          <Spinner />
        ) : error ? (
          <div className="panel space-y-3">
            <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
              Volunteer cases are temporarily unavailable
            </h3>
            <p className="text-sm leading-6 text-slate-600 dark:text-slate-300">{error}</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {filtered.map((c) => (
              <CaseCard
                key={c._id}
                data={c}
                onAccept={accept}
                onComplete={complete}
                onReject={reject}
                onEnRoute={enRoute}
                onAtClinic={atClinic}
                showMap
              />
            ))}
          </div>
        )}
        {partners.length > 0 && (
          <div className="glass rounded-2xl p-4 space-y-2">
            <div className="flex items-center justify-between">
              <p className="font-semibold">Nearby animal help (within 30km)</p>
              <span className="text-xs text-slate-500">Click phone to call</span>
            </div>
            <div className="space-y-2">
              {partners.map((p) => (
                <div key={p.id} className="flex items-start justify-between border-b border-white/20 pb-2">
                  <div>
                    <div className="font-medium">{p.name}</div>
                    <div className="text-xs uppercase text-slate-500">{p.type.replace("_", " ")}</div>
                    {p.address && <div className="text-xs text-slate-600">{p.address}</div>}
                  </div>
                  <div className="text-right">
                    <a className="font-semibold text-emerald-600" href={`tel:${p.phone}`}>
                      {p.phone}
                    </a>
                    <div className="text-[11px] text-slate-500">{p.distanceKm} km</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Volunteer;

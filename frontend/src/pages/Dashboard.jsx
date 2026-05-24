import React, { useMemo, useState } from "react";
import Sidebar from "../components/Sidebar.jsx";
import CaseCard from "../components/CaseCard.jsx";
import Spinner from "../components/Spinner.jsx";
import RescueStats from "../components/dashboard/RescueStats.jsx";
import SectionHeader from "../components/ui/SectionHeader.jsx";
import useCases from "../hooks/useCases.js";

const Dashboard = () => {
  const [filter, setFilter] = useState({ priority: "", status: "" });
  const [query, setQuery] = useState("");
  const { cases, loading, error } = useCases(filter);

  const filtered = useMemo(
    () =>
      cases.filter((c) =>
        c.description.toLowerCase().includes(query.toLowerCase().trim())
      ),
    [cases, query]
  );

  const stats = useMemo(() => {
    const active = cases.filter((item) => item.status !== "completed").length;
    const resolved = cases.filter((item) => item.status === "completed").length;
    const critical = cases.filter((item) => item.priority === "high").length;
    const zones = new Set(
      cases.map((item) => `${Math.round(item.location?.latitude || 0)},${Math.round(item.location?.longitude || 0)}`)
    ).size;

    return [
      { key: "active", label: "Active rescues", value: active, description: `${critical} high-priority incidents need closer monitoring.` },
      { key: "resolved", label: "Completed missions", value: resolved, description: "Closed rescue cases with recorded timeline updates." },
      { key: "volunteers", label: "Volunteer-ready", value: cases.filter((item) => item.status === "accepted" || item.status === "en_route").length, description: "Live accepted or in-transit missions." },
      { key: "zones", label: "Emergency zones", value: zones, description: "Approximate geo-clusters from recent reports." },
    ];
  }, [cases]);

  return (
    <div className="flex gap-6">
      <Sidebar />
      <div className="flex-1 space-y-6">
        <section className="panel-dark overflow-hidden">
          <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="space-y-4">
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-blue-200">Rescue Control Room</p>
              <h1 className="text-4xl font-semibold tracking-tight">Monitor rescue operations in real time.</h1>
              <p className="max-w-2xl text-sm leading-7 text-slate-300">
                This dashboard gives your mentor a clear view of how citizen reports, AI triage, volunteer assignment, and case status updates connect inside one emergency workflow.
              </p>
              <div className="flex flex-wrap gap-3">
                <span className="rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-blue-100">Socket-ready updates</span>
                <span className="rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-blue-100">AI rescue summary</span>
                <span className="rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-orange-200">Volunteer tracking friendly</span>
              </div>
            </div>
            <div className="grid gap-3 rounded-[2rem] border border-white/10 bg-white/5 p-5">
              {[
                ["Pending", cases.filter((item) => item.status === "pending").length],
                ["Accepted", cases.filter((item) => item.status === "accepted").length],
                ["On the way", cases.filter((item) => item.status === "en_route").length],
                ["Completed", cases.filter((item) => item.status === "completed").length],
              ].map(([label, value]) => (
                <div key={label} className="flex items-center justify-between rounded-2xl bg-slate-950/30 px-4 py-4">
                  <span className="text-sm text-slate-300">{label}</span>
                  <span className="text-2xl font-semibold">{value}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <RescueStats stats={stats} />

        {loading ? (
          <Spinner />
        ) : error ? (
          <section className="panel space-y-4">
            <SectionHeader
              badge="Backend Notice"
              title="Rescue cases are temporarily unavailable"
              description={error}
            />
            <div className="rounded-3xl border border-orange-200 bg-orange-50 px-4 py-4 text-sm leading-6 text-orange-700 dark:border-orange-500/20 dark:bg-orange-500/10 dark:text-orange-100">
              The frontend is working, but the backend database connection still needs to be fixed before live rescue cases can load.
            </div>
          </section>
        ) : (
          <>
            <section className="panel space-y-5">
              <SectionHeader
                badge="Live Filters"
                title="Reported cases"
                description="Filter rescue cases by urgency, status, or description. This section is intentionally simple so you can explain the flow clearly during your demo."
              />
              <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                <select onChange={(e) => setFilter({ ...filter, priority: e.target.value })}>
                  <option value="">Priority</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
                <select onChange={(e) => setFilter({ ...filter, status: e.target.value })}>
                  <option value="">Status</option>
                  <option value="pending">Pending</option>
                  <option value="accepted">Accepted</option>
                  <option value="en_route">On the way</option>
                  <option value="at_clinic">At clinic</option>
                  <option value="completed">Completed</option>
                </select>
                <input
                  placeholder="Search description"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
                <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600 dark:border-white/10 dark:bg-slate-900/80 dark:text-slate-300">
                  Showing <span className="font-semibold text-slate-900 dark:text-white">{filtered.length}</span> cases
                </div>
              </div>
            </section>

            <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
              <div className="grid gap-4 md:grid-cols-2">
                {filtered.map((c) => (
                  <CaseCard key={c._id} data={c} showMap />
                ))}
              </div>

              <div className="space-y-6">
                <div className="panel rounded-[2rem]">
                  <SectionHeader
                    badge="Operations"
                    title="Response pipeline"
                    description="These stages map directly to your backend status system and are easy to explain during review."
                  />
                  <div className="mt-5 space-y-3">
                    {[
                      "Pending: citizen report is created and awaits assignment.",
                      "Accepted: volunteer confirms ownership of the case.",
                      "On the way: volunteer movement begins and ETA becomes relevant.",
                      "Completed: rescue is closed with final timeline proof.",
                    ].map((item) => (
                      <div key={item} className="rounded-3xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm leading-6 text-slate-600 dark:border-white/10 dark:bg-slate-900/80 dark:text-slate-300">
                        {item}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="panel-accent">
                  <p className="text-xs font-bold uppercase tracking-[0.24em] text-orange-100">Next build slice</p>
                  <h3 className="mt-3 text-2xl font-semibold">Live tracking and Socket.IO feed</h3>
                  <p className="mt-3 text-sm leading-6 text-orange-50">
                    The UI is now prepared for real-time volunteer coordinates, alert toasts, and case timeline updates without needing a redesign later.
                  </p>
                </div>
              </div>
            </section>
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;

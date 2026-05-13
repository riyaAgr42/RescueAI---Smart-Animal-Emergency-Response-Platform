import React, { useMemo, useState } from "react";
import Sidebar from "../components/Sidebar.jsx";
import CaseCard from "../components/CaseCard.jsx";
import Spinner from "../components/Spinner.jsx";
import useCases from "../hooks/useCases.js";

const Dashboard = () => {
  const [filter, setFilter] = useState({ priority: "", status: "" });
  const [query, setQuery] = useState("");
  const { cases, loading } = useCases(filter);

  const filtered = useMemo(
    () =>
      cases.filter((c) =>
        c.description.toLowerCase().includes(query.toLowerCase().trim())
      ),
    [cases, query]
  );

  return (
    <div className="flex gap-6">
      <Sidebar />
      <div className="flex-1 space-y-4">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div>
            <h2 className="text-2xl font-display">Reported Cases</h2>
            <p className="text-sm text-slate-500">Filter by urgency and status.</p>
          </div>
          <div className="flex gap-2">
            <select
              className="rounded-xl border px-3 py-2 text-sm"
              onChange={(e) => setFilter({ ...filter, priority: e.target.value })}
            >
              <option value="">Priority</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
            <select
              className="rounded-xl border px-3 py-2 text-sm"
              onChange={(e) => setFilter({ ...filter, status: e.target.value })}
            >
              <option value="">Status</option>
              <option value="pending">Pending</option>
              <option value="accepted">Accepted</option>
              <option value="completed">Completed</option>
            </select>
            <input
              className="rounded-xl border px-3 py-2 text-sm"
              placeholder="Search description"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
        </div>

        {loading ? (
          <Spinner />
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {filtered.map((c) => (
              <CaseCard key={c._id} data={c} showMap />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;

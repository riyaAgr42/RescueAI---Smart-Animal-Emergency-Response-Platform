import React from "react";
import clsx from "clsx";
import { MapPinIcon } from "@heroicons/react/24/solid";

const badgeClass = {
  high: "bg-rose-100 text-rose-600",
  medium: "bg-amber-100 text-amber-700",
  low: "bg-emerald-100 text-emerald-700",
};

const statusBadge = {
  pending: "bg-slate-100 text-slate-700",
  accepted: "bg-amber-100 text-amber-700",
  en_route: "bg-sky-100 text-sky-700",
  at_clinic: "bg-indigo-100 text-indigo-700",
  completed: "bg-emerald-100 text-emerald-700",
};

const CaseCard = ({
  data,
  onAccept,
  onComplete,
  onReject,
  onEnRoute,
  onAtClinic,
  showMap = false,
  showTimeline = true,
}) => (
  <div className="panel flex flex-col gap-4 rounded-[2rem] p-5">
    <div className="flex items-start gap-3">
      <div className={clsx("rounded-full px-3 py-1 text-xs font-semibold", badgeClass[data.priority])}>
        {(data.priority || "medium").toUpperCase()}
      </div>
      {data.emergencyLevel ? (
        <div className="rounded-full bg-accent/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-accent">
          {data.emergencyLevel}
        </div>
      ) : null}
      <div className="ml-auto text-sm text-slate-500">{new Date(data.createdAt).toLocaleString()}</div>
    </div>

    <div className="space-y-2">
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
          {data.animalType ? `${data.animalType} rescue case` : "Animal emergency"}
        </h3>
        <span
          className={clsx(
            "rounded-full px-3 py-1 text-xs uppercase tracking-wide",
            statusBadge[data.status] || "bg-slate-100 text-slate-700"
          )}
        >
          {data.status.replace("_", " ")}
        </span>
      </div>
      <p className="text-sm leading-6 text-slate-700 dark:text-slate-200">{data.description}</p>
    </div>

    <div className="flex flex-wrap gap-2 text-xs">
      {data.injuryDetected ? (
        <span className="rounded-full bg-rose-100 px-3 py-1 font-semibold text-rose-700">AI injury flagged</span>
      ) : null}
      <span className="rounded-full bg-slate-100 px-3 py-1 text-slate-600 dark:bg-slate-800 dark:text-slate-200">
        Priority score: {data.priorityScore ?? 0}
      </span>
      {data.aiAnalysis?.severity ? (
        <span className="rounded-full bg-orange-100 px-3 py-1 text-orange-700">
          Severity: {data.aiAnalysis.severity}
        </span>
      ) : null}
    </div>

    {data.imageUrl ? (
      <img src={data.imageUrl} alt="case" className="h-44 w-full rounded-3xl object-cover" />
    ) : null}

    <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
      <MapPinIcon className="h-4 w-4" />
      {data.location.latitude}, {data.location.longitude}
    </div>

    {showMap ? (
      <div className="h-40 w-full overflow-hidden rounded-3xl border border-slate-200 dark:border-white/10">
        <iframe
          title="map"
          src={`https://www.openstreetmap.org/export/embed.html?marker=${data.location.latitude}%2C${data.location.longitude}&layers=MAP`}
          className="h-full w-full"
          loading="lazy"
        />
      </div>
    ) : null}

    {showTimeline && data.timeline?.length > 0 ? (
      <div className="space-y-2 rounded-3xl border border-white/50 bg-white/65 p-4 text-xs dark:border-white/10 dark:bg-slate-900/80">
        <p className="font-semibold text-slate-700 dark:text-slate-200">Rescue Timeline</p>
        {data.timeline.slice(-4).map((t, idx) => (
          <div key={idx} className="flex justify-between gap-2">
            <span>{t.message}</span>
            <span className="text-slate-500">{new Date(t.at).toLocaleTimeString()}</span>
          </div>
        ))}
      </div>
    ) : null}

    {data.aiAnalysis?.suggestions?.length ? (
      <div className="rounded-3xl border border-blue-100 bg-blue-50/80 p-4 dark:border-blue-500/20 dark:bg-blue-500/10">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">AI suggestions</p>
        <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
          {data.aiAnalysis.suggestions[0]}
        </p>
      </div>
    ) : null}

    <div className="flex items-center justify-end">
      <div className="flex gap-2">
        {onAccept && data.status === "pending" ? (
          <button className="btn-primary px-3 py-1 text-sm" onClick={() => onAccept(data._id)}>
            Accept
          </button>
        ) : null}
        {onEnRoute && data.status === "accepted" ? (
          <button className="btn-secondary px-3 py-1 text-sm" onClick={() => onEnRoute(data._id)}>
            En Route
          </button>
        ) : null}
        {onAtClinic && data.status === "en_route" ? (
          <button className="btn-secondary px-3 py-1 text-sm" onClick={() => onAtClinic(data._id)}>
            At Clinic
          </button>
        ) : null}
        {onComplete && (data.status === "at_clinic" || data.status === "en_route" || data.status === "accepted") ? (
          <button className="btn-secondary px-3 py-1 text-sm" onClick={() => onComplete(data._id)}>
            Mark Rescued
          </button>
        ) : null}
        {onReject && data.status === "accepted" ? (
          <button className="btn-secondary px-3 py-1 text-sm" onClick={() => onReject(data._id)}>
            Reject
          </button>
        ) : null}
      </div>
    </div>
  </div>
);

export default CaseCard;

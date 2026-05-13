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
  <div className="glass rounded-2xl p-4 flex flex-col gap-3">
    <div className="flex items-start gap-3">
      <div className={clsx("px-3 py-1 rounded-full text-xs font-semibold", badgeClass[data.priority])}>
        {data.priority.toUpperCase()}
      </div>
      <div className="text-sm text-slate-500 ml-auto">{new Date(data.createdAt).toLocaleString()}</div>
    </div>
    <p className="text-slate-800 dark:text-slate-100 text-sm leading-6">{data.description}</p>
    <div className="flex flex-wrap gap-2 text-xs">
      {data.injuryDetected && (
        <span className="rounded-full bg-rose-100 text-rose-700 px-3 py-1 font-semibold">AI Injury Detected</span>
      )}
      <span className="rounded-full bg-slate-100 dark:bg-slate-800 px-3 py-1 text-slate-600 dark:text-slate-200">
        Priority score: {data.priorityScore ?? 0}
      </span>
    </div>
    {data.imageUrl && (
      <img src={data.imageUrl} alt="case" className="h-40 w-full object-cover rounded-xl" />
    )}
    <div className="flex items-center gap-2 text-sm text-slate-600">
      <MapPinIcon className="h-4 w-4" />
      {data.location.latitude}, {data.location.longitude}
    </div>
    {showMap && (
      <div className="h-40 w-full rounded-xl overflow-hidden border border-slate-200">
        <iframe
          title="map"
          src={`https://www.openstreetmap.org/export/embed.html?marker=${data.location.latitude}%2C${data.location.longitude}&layers=MAP`}
          className="w-full h-full"
          loading="lazy"
        />
      </div>
    )}
    {showTimeline && data.timeline?.length > 0 && (
      <div className="rounded-xl bg-white/60 dark:bg-slate-800/80 border border-white/40 dark:border-slate-700 p-3 space-y-2 text-xs">
        <p className="font-semibold text-slate-700 dark:text-slate-200">Rescue Timeline</p>
        {data.timeline.slice(-4).map((t, idx) => (
          <div key={idx} className="flex justify-between gap-2">
            <span>{t.message}</span>
            <span className="text-slate-500">{new Date(t.at).toLocaleTimeString()}</span>
          </div>
        ))}
      </div>
    )}
    <div className="flex items-center justify-between">
      <span
        className={clsx(
          "text-xs uppercase tracking-wide px-3 py-1 rounded-full",
          statusBadge[data.status] || "bg-slate-100 text-slate-700"
        )}
      >
        {data.status.replace("_", " ")}
      </span>
      <div className="flex gap-2">
        {onAccept && data.status === "pending" && (
          <button className="btn-primary px-3 py-1 text-sm" onClick={() => onAccept(data._id)}>
            Accept
          </button>
        )}
        {onEnRoute && data.status === "accepted" && (
          <button className="btn-secondary px-3 py-1 text-sm" onClick={() => onEnRoute(data._id)}>
            En Route
          </button>
        )}
        {onAtClinic && data.status === "en_route" && (
          <button className="btn-secondary px-3 py-1 text-sm" onClick={() => onAtClinic(data._id)}>
            At Clinic
          </button>
        )}
        {onComplete && (data.status === "at_clinic" || data.status === "en_route" || data.status === "accepted") && (
          <button className="btn-secondary px-3 py-1 text-sm" onClick={() => onComplete(data._id)}>
            Mark Rescued
          </button>
        )}
        {onReject && data.status === "accepted" && (
          <button className="btn-secondary px-3 py-1 text-sm" onClick={() => onReject(data._id)}>
            Reject
          </button>
        )}
      </div>
    </div>
  </div>
);

export default CaseCard;

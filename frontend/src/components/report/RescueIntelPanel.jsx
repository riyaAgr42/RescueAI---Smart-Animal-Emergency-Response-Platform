import React from "react";

const RescueIntelPanel = ({ preview }) => {
  const suggestions = preview?.suggestions?.length
    ? preview.suggestions
    : [
        "Keep a safe distance and avoid sudden movements around the animal.",
        "If bleeding is visible, use a clean cloth only when it is safe to approach.",
        "Share a clear photo and exact landmark details to speed up volunteer arrival.",
      ];

  return (
    <aside className="panel space-y-4">
      <div className="space-y-2">
        <p className="text-xs font-bold uppercase tracking-[0.24em] text-accent">AI Rescue Intel</p>
        <h3 className="font-display text-2xl font-semibold text-slate-900 dark:text-white">
          Smart triage summary
        </h3>
        <p className="text-sm leading-6 text-slate-600 dark:text-slate-300">
          This panel previews what RescueAI will infer from the report before it reaches the response network.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
        <div className="rounded-2xl bg-night px-4 py-4 text-white">
          <p className="text-xs uppercase tracking-[0.24em] text-blue-200">Detected animal</p>
          <p className="mt-2 text-xl font-semibold">{preview?.animalType || "Auto-detect on submit"}</p>
        </div>
        <div className="rounded-2xl bg-accent px-4 py-4 text-white shadow-emergency">
          <p className="text-xs uppercase tracking-[0.24em] text-orange-100">Severity prediction</p>
          <p className="mt-2 text-xl font-semibold">{preview?.severity || "Waiting for image and notes"}</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 dark:border-white/10 dark:bg-slate-900/90">
          <p className="text-xs uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">Duplicate risk</p>
          <p className="mt-2 text-xl font-semibold text-slate-900 dark:text-white">
            {preview?.duplicateRisk || "Low"}
          </p>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-slate-50/90 p-4 dark:border-white/10 dark:bg-slate-900/90">
        <p className="text-sm font-semibold text-slate-900 dark:text-white">First-aid guidance</p>
        <div className="mt-3 space-y-3">
          {suggestions.map((item) => (
            <div
              key={item}
              className="rounded-2xl border border-white bg-white px-4 py-3 text-sm leading-6 text-slate-600 dark:border-white/10 dark:bg-slate-900/80 dark:text-slate-300"
            >
              {item}
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
};

export default RescueIntelPanel;

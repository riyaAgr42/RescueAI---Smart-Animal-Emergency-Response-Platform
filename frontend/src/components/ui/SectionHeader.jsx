import React from "react";

const SectionHeader = ({ badge, title, description, action, invert = false }) => (
  <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
    <div className="space-y-3">
      {badge ? (
        <span
          className={`inline-flex w-fit items-center rounded-full px-3 py-1 text-xs font-bold uppercase tracking-[0.24em] ${
            invert
              ? "border border-white/15 bg-white/10 text-blue-100"
              : "border border-primary/20 bg-primary/10 text-primary dark:border-primary/30 dark:bg-primary/15"
          }`}
        >
          {badge}
        </span>
      ) : null}
      <div className="space-y-2">
        <h2
          className={`font-display text-3xl font-semibold tracking-tight ${
            invert ? "text-white" : "text-slate-900 dark:text-white"
          }`}
        >
          {title}
        </h2>
        {description ? (
          <p
            className={`max-w-2xl text-sm leading-6 ${
              invert ? "text-slate-300" : "text-slate-600 dark:text-slate-300"
            }`}
          >
            {description}
          </p>
        ) : null}
      </div>
    </div>
    {action ? <div>{action}</div> : null}
  </div>
);

export default SectionHeader;

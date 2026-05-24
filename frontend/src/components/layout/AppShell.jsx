import React from "react";

const AppShell = ({ children }) => (
  <div className="relative min-h-screen overflow-hidden bg-mesh-light text-slate-900 dark:bg-night dark:text-white">
    <div className="pointer-events-none absolute inset-0 opacity-90 dark:opacity-100">
      <div className="absolute left-[-12rem] top-[-8rem] h-80 w-80 rounded-full bg-primary/20 blur-3xl" />
      <div className="absolute right-[-10rem] top-16 h-72 w-72 rounded-full bg-accent/20 blur-3xl" />
      <div className="absolute bottom-[-6rem] left-1/3 h-72 w-72 rounded-full bg-sky-200/30 blur-3xl dark:bg-primary/10" />
    </div>
    <div className="relative z-10">{children}</div>
  </div>
);

export default AppShell;

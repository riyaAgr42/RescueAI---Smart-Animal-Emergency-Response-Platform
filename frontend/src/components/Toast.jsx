import React from "react";
import clsx from "clsx";

const Toast = ({ message, variant = "success" }) => (
  <div
    className={clsx(
      "fixed right-4 top-4 z-50 rounded-xl px-4 py-3 shadow-lg text-sm font-semibold",
      variant === "error" ? "bg-rose-100 text-rose-700" : "bg-emerald-100 text-emerald-700"
    )}
  >
    {message}
  </div>
);

export default Toast;

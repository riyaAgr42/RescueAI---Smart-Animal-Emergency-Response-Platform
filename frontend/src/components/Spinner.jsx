import React from "react";

const Spinner = () => (
  <div className="flex items-center justify-center py-10">
    <div className="h-10 w-10 rounded-full border-2 border-primary border-t-transparent animate-spin" />
  </div>
);

export default Spinner;

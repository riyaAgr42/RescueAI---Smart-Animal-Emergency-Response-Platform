import React from "react";

const MiniMap = ({ latitude, longitude }) => {
  const src = `https://www.openstreetmap.org/export/embed.html?marker=${latitude}%2C${longitude}&layers=MAP`;
  return (
    <iframe
      title="map"
      src={src}
      className="w-full h-40 rounded-xl border border-slate-200"
      loading="lazy"
    />
  );
};

export default MiniMap;

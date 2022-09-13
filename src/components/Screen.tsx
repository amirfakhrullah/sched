import React from "react";

const Screen: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  return <div className="min-w-full min-h-screen bg-slate-200 flex flex-row md:p-0 pb-14">{children}</div>;
};

export default Screen;

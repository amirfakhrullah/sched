import React from "react";

const Center: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  return <div className="mx-auto max-w-7xl w-full md:p-4 p-2">{children}</div>;
};

export default Center;

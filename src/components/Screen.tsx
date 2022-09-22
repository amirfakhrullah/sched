import React from "react";

const Screen: React.FC<{
  children?: React.ReactNode;
  withSidebar?: boolean;
  bgGreen?: boolean;
}> = ({ children, withSidebar = true, bgGreen }) => {
  return (
    <div
      className={`min-w-full min-h-screen bg-slate-200 flex flex-row ${
        withSidebar ? "md:p-0 pb-14" : ""
      } ${bgGreen ? "bg-teal-800" : "bg-blue-gray-100"}`}
    >
      {children}
    </div>
  );
};

export default Screen;

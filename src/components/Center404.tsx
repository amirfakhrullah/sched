import { useRouter } from "next/router";
import React from "react";
import AppButton from "./AppButton";

const Center404: React.FC<{
  text?: string;
}> = ({ text }) => {
  const router = useRouter();

  return (
    <div className="py-8">
      <div className="w-full flex items-center justify-center mb-4">
        <h1 className="font-oswald font-[700] text-7xl text-teal-800">404</h1>
      </div>
      <h1 className="font-oswald text-2xl font-[600] text-center">
        {text || "Sorry, this page doesn't exist."}
      </h1>

      <div className="mt-5 w-full flex items-center justify-center">
        <AppButton
          label="Back to Home"
          theme="teal"
          variant="outlined"
          css="max-w-[15em]"
          onClick={() => router.push("/")}
        />
      </div>
    </div>
  );
};

export default Center404;

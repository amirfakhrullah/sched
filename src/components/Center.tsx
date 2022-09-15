import React from "react";
import { Watch } from "react-loader-spinner";

const Center: React.FC<{ children?: React.ReactNode; loader?: boolean }> = ({
  children,
  loader = false,
}) => {
  return (
    <div className="mx-auto max-w-7xl w-full md:p-4 p-2">
      {loader ? (
        <div className="w-full h-full flex justify-center sm:mt-60 mt-32">
          <Watch
            height="80"
            width="80"
            radius="48"
            color="#115e59"
            ariaLabel="watch-loading"
            wrapperStyle={{}}
            visible={true}
          />
        </div>
      ) : (
        children
      )}
    </div>
  );
};

export default Center;

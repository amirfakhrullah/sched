import { NextPage } from "next";
import React from "react";
import Center from "../components/Center";
import MetaHead from "../components/MetaHead";
import Screen from "../components/Screen";
import Center404 from "../components/Center404";
import Image from "next/image";
import schedLogo from "../../public/sched-logo.png";

const NotFound: NextPage = () => {
  return (
    <>
      <MetaHead title="404 Not Found | Sched App" />
      <Screen>
        <Center>
          <div className="flex items-center justify-center w-full">
            <Image
              src={schedLogo}
              alt="sched-logo"
              height={70}
              width={70}
              className="rounded-md"
            />
          </div>
          <div className="max-w-sm w-full mx-auto mt-20">
            <Center404 />
          </div>
        </Center>
      </Screen>
    </>
  );
};

export default NotFound;

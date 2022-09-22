import { NextPage } from "next";
import Image from "next/image";
import React from "react";
import Center from "../components/Center";
import MetaHead from "../components/MetaHead";
import Screen from "../components/Screen";
import schedLogo from "../../public/sched-logo.png";
import { Button } from "@material-tailwind/react";
import { useRouter } from "next/router";

const NotFound: NextPage = () => {
  const router = useRouter();

  return (
    <>
      <MetaHead title="404 Not Found | Sched App" />
      <Screen>
        <Center>
          <div className="max-w-sm w-full mx-auto mt-20">
            <div className="w-full flex items-center justify-center mb-4">
              <Image
                src={schedLogo}
                alt="sched-logo"
                height={70}
                width={70}
                className="rounded-md"
              />
            </div>
            <h1 className="font-oswald text-2xl font-[600] text-center">
              Sorry, this page doesn&apos;t exist.
            </h1>

            <div className="mt-5 w-full flex items-center justify-center">
              <Button
                color="teal"
                variant="outlined"
                onClick={() => router.push("/")}
              >
                Back to Home
              </Button>
            </div>
          </div>
        </Center>
      </Screen>
    </>
  );
};

export default NotFound;

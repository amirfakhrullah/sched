import { GetServerSidePropsContext, NextPage, PreviewData } from "next";
import React, { useState } from "react";
import Center from "../components/Center";
import MetaHead from "../components/MetaHead";
import Screen from "../components/Screen";
import schedLogo from "../../public/sched-logo.png";
import Image from "next/image";
import { Button } from "@material-tailwind/react";
import { AiFillGithub } from "react-icons/ai";
import { FcGoogle } from "react-icons/fc";
import { ParsedUrlQuery } from "querystring";
import { signIn } from "next-auth/react";
import { getServerAuthSession } from "../server/common/get-server-auth-session";

const Auth: NextPage = () => {
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (provider: "github") => {
    setIsLoading(true);
    await signIn(provider);
  };

  return (
    <>
      <MetaHead title="Auth | Sched App" />
      <Screen>
        <Center loader={isLoading}>
          <div className="shadow-lg border border-gray-300 p-4 rounded-lg max-w-sm w-full mx-auto mt-20">
            <div className="w-full flex items-center justify-center mb-6">
              <Image
                src={schedLogo}
                alt="sched-logo"
                height={70}
                width={70}
                className="rounded-md"
              />
            </div>
            <h1 className="font-oswald text-2xl font-[600] text-center">
              Welcome to Sched App
            </h1>

            <div className="p-1" />

            <p className="text-gray-600 text-sm text-center">
              Please sign-in/sign-up with one of the <br /> providers below
            </p>

            <div className="p-2" />

            <Button
              color="blue-gray"
              variant="outlined"
              className="w-full flex flex-row items-center justify-center "
              onClick={() => handleLogin("github")}
            >
              <FcGoogle className="text-2xl mr-2" />
              Google
            </Button>

            <div className="p-1" />

            <Button
              color="blue-gray"
              className="w-full flex flex-row items-center justify-center bg-blue-gray-800"
              onClick={() => handleLogin("github")}
            >
              <AiFillGithub className="text-white text-2xl mr-2" />
              GitHub
            </Button>
          </div>
        </Center>
      </Screen>
    </>
  );
};

export const getServerSideProps = async (
  context: GetServerSidePropsContext<ParsedUrlQuery, PreviewData>
) => {
  const session = await getServerAuthSession(context);

  if (session && session.user) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
};

export default Auth;

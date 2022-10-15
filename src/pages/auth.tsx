import { GetServerSideProps, GetServerSidePropsContext, NextPage } from "next";
import React, { useState } from "react";
import Center from "../components/Center";
import MetaHead from "../components/MetaHead";
import Screen from "../components/Screen";
import schedLogo from "../../public/sched-logo.png";
import Image from "next/image";
import { AiFillGithub } from "react-icons/ai";
import { BsSpotify, BsTwitch, BsTwitter } from "react-icons/bs";
import { signIn } from "next-auth/react";
import { getServerAuthSession } from "../server/common/get-server-auth-session";
import { useRouter } from "next/router";
import AppButton from "../components/AppButton";
import Link from "next/link";
import Loader from "../components/Loader";

const Auth: NextPage = () => {
  const { query } = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (
    provider: "github" | "twitch" | "spotify" | "twitter"
  ) => {
    setIsLoading(true);
    await signIn(provider);
  };

  return (
    <>
      <MetaHead title="Auth | Sched App" />
      <Screen withSidebar={false} bgGreen={true}>
        <Center>
          <div className="shadow-lg bg-white p-6 rounded-sm max-w-sm w-full mx-auto mt-20">
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

            {!isLoading && query?.error === "OAuthAccountNotLinked" && (
              <p className="text-center p-1 text-red-400">
                The email is linked to different provider.
              </p>
            )}
            {!isLoading &&
              query?.error &&
              query?.error !== "OAuthAccountNotLinked" && (
                <p className="text-center p-1 text-red-400">
                  Error: {query.error}
                </p>
              )}

            <div className="p-2" />

            {isLoading ? (
              <Loader />
            ) : (
              <>
                <AppButton
                  onClick={() => handleLogin("github")}
                  icon={<AiFillGithub className="text-white text-2xl mr-2" />}
                  label="GitHub"
                  css=" bg-blue-gray-800"
                  theme="blue-gray"
                />

                <div className="p-1" />

                <AppButton
                  onClick={() => handleLogin("twitter")}
                  icon={<BsTwitter className="text-white text-xl mr-2" />}
                  label="Twitter"
                  css="bg-blue-600"
                  theme="blue"
                />

                <div className="p-1" />

                <AppButton
                  onClick={() => handleLogin("twitch")}
                  icon={<BsTwitch className="text-white text-xl mr-2" />}
                  label="Twitch"
                  css="bg-[#9146ff]"
                  theme="deep-purple"
                />

                <div className="p-1" />

                <AppButton
                  onClick={() => handleLogin("spotify")}
                  icon={<BsSpotify className="text-green-700 text-xl mr-2" />}
                  label="Spotify"
                  css="bg-black"
                  theme="blue-gray"
                />
              </>
            )}
            <p className="text-[12px] text-center text-gray-600 mt-5">
              Designed and built by
              <br />
              <Link href="https://amrf.me" passHref>
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline cursor-pointer"
                >
                  amrf.me
                </a>
              </Link>
            </p>
          </div>
        </Center>
      </Screen>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (
  context: GetServerSidePropsContext
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

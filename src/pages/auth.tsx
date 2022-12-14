import { NextPage } from "next";
import React, { useState } from "react";
import Center from "../components/Center";
import MetaHead from "../components/MetaHead";
import Screen from "../components/Screen";
import schedLogo from "../../public/sched-logo.png";
import teacherIcon from "../../public/teacher.png";
import Image from "next/image";
import { AiFillGithub } from "react-icons/ai";
import { BsSpotify, BsTwitch, BsTwitter } from "react-icons/bs";
import { FcGoogle } from "react-icons/fc";
import { signIn } from "next-auth/react";
import { useRouter } from "next/router";
import AppButton from "../components/AppButton";
import Link from "next/link";
import Loader from "../components/Loader";

const Auth: NextPage = () => {
  const { query } = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (
    provider: "google" | "github" | "twitch" | "spotify" | "twitter"
  ) => {
    setIsLoading(true);
    await signIn(provider, {
      callbackUrl: "/",
    });
  };

  return (
    <>
      <MetaHead title="Auth | Sched App" />
      <Screen withSidebar={false} bgGreen>
        <Center>
          <div className="grid md:grid-cols-2 grid-cols-1 mt-20 md:max-w-3xl max-w-sm mx-auto">
            <div className="md:block hidden shadow-lg rounded-l-md rounded-r-none p-6 bg-teal-900">
              <div className="p-10">
                <div className="bg-white shadow-lg rounded-full">
                  <Image src={teacherIcon} alt="teacher-icon" />
                </div>
                <h2 className="text-gray-300 font-oswald text-2xl font-medium text-center mt-4">
                  Ease the process of
                  <br />
                  note-taking
                  <br />
                  for students and teachers
                </h2>
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href="https://www.flaticon.com/free-icons/teacher"
                  title="teacher icons"
                >
                  <p className="pt-2 text-center text-[12px] text-gray-600 underline cursor-pointer">
                    Flaticon
                  </p>
                </a>
              </div>
            </div>
            <div className="shadow-lg bg-white p-6 md:rounded-r-md md:rounded-l-none rounded-md">
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
                    onClick={() => handleLogin("google")}
                    icon={<FcGoogle className="text-2xl mr-2" />}
                    label="Google"
                    variant="outlined"
                    theme="blue-gray"
                  />

                  <div className="p-1" />

                  <AppButton
                    onClick={() => handleLogin("github")}
                    icon={<AiFillGithub className="text-white text-2xl mr-2" />}
                    label="GitHub"
                    css="bg-blue-gray-800"
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
                </>
              )}
            </div>
          </div>
        </Center>
      </Screen>
    </>
  );
};

export default Auth;

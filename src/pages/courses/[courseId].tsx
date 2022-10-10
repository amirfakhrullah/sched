import {
  GetServerSideProps,
  InferGetServerSidePropsType,
  PreviewData,
} from "next";
import { useRouter } from "next/router";
import { ParsedUrlQuery } from "querystring";
import React from "react";
import { BsArrowLeft } from "react-icons/bs";
import Center from "../../components/Center";
import Center404 from "../../components/Center404";
import ExistingCourse from "../../components/Course/ExistingCourse";
import NewCourse from "../../components/Course/NewCourse";
import MetaHead from "../../components/MetaHead";
import Screen from "../../components/Screen";
import Sidebar from "../../components/Sidebar";

export const cachedCourse404: string[] = [];

const CourseId: React.FC<
  InferGetServerSidePropsType<
    GetServerSideProps<
      {
        courseId: string;
      },
      ParsedUrlQuery,
      PreviewData
    >
  >
> = ({ courseId }) => {
  const router = useRouter();

  return (
    <>
      <MetaHead title="Course | Sched" />
      <Screen>
        <Sidebar />
        <Center>
          <div className="flex flex-row items-center cursor-pointer">
            <BsArrowLeft className="text-lg mr-2" />
            <h2
              className="text-lg font-[500] font-oswald"
              onClick={() => {
                if (
                  router.query &&
                  router.query.new &&
                  typeof router.query.new === "string" &&
                  router.query.new === "true"
                ) {
                  return router.push("/courses");
                }
                router.back();
              }}
            >
              Back
            </h2>
          </div>

          <div className="shadow-lg bg-white rounded-sm max-w-7xl w-full mx-auto mt-4">
            {cachedCourse404.includes(courseId) ? (
              <Center404 text="No Lesson Found." />
            ) : (
              <>
                {courseId === "new" ? (
                  <NewCourse />
                ) : (
                  <ExistingCourse courseId={courseId} />
                )}
              </>
            )}
          </div>
        </Center>
      </Screen>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const { courseId } = query;

  if (!courseId || typeof courseId !== "string") {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      courseId,
    },
  };
};

export default CourseId;

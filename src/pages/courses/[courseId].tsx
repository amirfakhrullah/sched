import { GetServerSidePropsContext, NextPage } from "next";
import { useRouter } from "next/router";
import React from "react";
import { BsArrowLeft } from "react-icons/bs";
import Center from "../../components/Center";
import ExistingCourse from "../../components/Course/ExistingCourse";
import NewCourse from "../../components/Course/NewCourse";
import MetaHead from "../../components/MetaHead";
import Screen from "../../components/Screen";
import Sidebar from "../../components/Sidebar";
import { InferSSRProps } from "../../lib/InferSSRProps";

const CourseId: NextPage<InferSSRProps<typeof getServerSideProps>> = ({
  courseId,
}) => {
  const router = useRouter();

  return (
    <>
      <MetaHead title="Course | Sched" />
      <Screen>
        <Sidebar />
        <Center>
          <div className="flex flex-row items-center cursor-pointer"
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
            <BsArrowLeft className="text-lg mr-2" />
            <h2 className="text-lg font-[500] font-oswald">
              Back
            </h2>
          </div>

          <div className="shadow-lg bg-white rounded-sm max-w-7xl w-full mx-auto mt-4">
            {courseId === "new" ? (
              <NewCourse />
            ) : (
              <ExistingCourse courseId={courseId} />
            )}
          </div>
        </Center>
      </Screen>
    </>
  );
};

export const getServerSideProps = async ({
  query,
}: GetServerSidePropsContext) => {
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

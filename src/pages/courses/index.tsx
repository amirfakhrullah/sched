import React from "react";
import AppButton from "../../components/AppButton";
import Center from "../../components/Center";
import MetaHead from "../../components/MetaHead";
import Screen from "../../components/Screen";
import Sidebar from "../../components/Sidebar";
import { trpc } from "../../utils/trpc";
import { useRouter } from "next/router";
import { AiOutlineAppstoreAdd } from "react-icons/ai";
import CourseCard from "../../components/Course/CourseCard";
import { NextPage } from "next";

const Courses: NextPage = () => {
  const router = useRouter();
  const { isLoading, data } = trpc.useQuery(["courses.get-all"]);

  return (
    <>
      <MetaHead title="Courses | Sched App" />
      <Screen>
        <Sidebar />
        <Center loader={isLoading || !data}>
          {data && (
            <>
              <div className="flex sm:flex-row flex-col sm:items-center justify-between">
                <h2 className="text-4xl font-[700] font-oswald text-center">
                  My Courses
                </h2>
                <AppButton
                  label="Add Course"
                  onClick={() => router.push("/courses/new")}
                  css="bg-teal-800 sm:max-w-[14em] sm:m-0 mt-1"
                  theme="green"
                  icon={
                    <AiOutlineAppstoreAdd className="text-white text-xl mr-2" />
                  }
                />
              </div>
              <div className="p-4" />
              <div className="grid sm:grid-cols-3 grid-cols-1 gap-3 w-full">
                {data &&
                  data.map((course) => (
                    <CourseCard key={course.id} course={course} />
                  ))}
              </div>
            </>
          )}
        </Center>
      </Screen>
    </>
  );
};

export default Courses;

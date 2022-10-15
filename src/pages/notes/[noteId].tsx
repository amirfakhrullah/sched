import { GetServerSidePropsContext, NextPage } from "next";
import { useRouter } from "next/router";
import React from "react";
import { BsArrowLeft } from "react-icons/bs";
import Center from "../../components/Center";
import ExistingLesson from "../../components/Lesson/ExistingLesson";
import NewLesson from "../../components/Lesson/NewLesson";
import MetaHead from "../../components/MetaHead";
import Screen from "../../components/Screen";
import Sidebar from "../../components/Sidebar";
import { InferSSRProps } from "../../lib/InferSSRProps";

const NoteId: NextPage<InferSSRProps<typeof getServerSideProps>> = ({
  noteId,
  scheduleId,
  date,
}) => {
  const router = useRouter();

  return (
    <>
      <MetaHead title="Lesson | Sched" />
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
                  typeof router.query.new === "string"
                ) {
                  return router.push({
                    pathname: "/",
                    query: {
                      dayRef: router.query.new,
                    },
                  });
                }
                router.back();
              }}
            >
              Back
            </h2>
          </div>
          <div className="shadow-lg bg-white rounded-sm max-w-7xl w-full mx-auto mt-4">
            {noteId && !scheduleId && !date && (
              <ExistingLesson lessonId={noteId} />
            )}
            {!noteId && scheduleId && date && (
              <NewLesson scheduleId={scheduleId} date={date} />
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
  const { noteId } = query;

  if (!noteId || typeof noteId !== "string") {
    return {
      notFound: true,
    };
  }

  if (noteId.includes("new-")) {
    const scheduleId = noteId.split("-")[1];
    const date = noteId.split("-")[2];
    if (!scheduleId || !date) {
      return {
        notFound: true,
      };
    } else {
      return {
        props: {
          scheduleId,
          date,
        },
      };
    }
  }

  return {
    props: {
      noteId,
    },
  };
};

export default NoteId;

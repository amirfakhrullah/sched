import {
  GetServerSideProps,
  InferGetServerSidePropsType,
  PreviewData,
} from "next";
import { ParsedUrlQuery } from "querystring";
import React from "react";
import Center from "../../components/Center";
import ExistingLesson from "../../components/Lesson/ExistingLesson";
import NewLesson from "../../components/Lesson/NewLesson";
import MetaHead from "../../components/MetaHead";
import Screen from "../../components/Screen";
import Sidebar from "../../components/Sidebar";

const NoteId: React.FC<
  InferGetServerSidePropsType<
    GetServerSideProps<
      {
        noteId?: string;
        scheduleId?: string;
        date?: string;
      },
      ParsedUrlQuery,
      PreviewData
    >
  >
> = ({ noteId, scheduleId, date }) => {
  return (
    <>
      <MetaHead title="Lesson | Sched" />
      <Screen>
        <Sidebar />
        <Center>
          <div className="shadow-lg bg-white rounded-sm max-w-7xl w-full mx-auto mt-20">
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

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
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

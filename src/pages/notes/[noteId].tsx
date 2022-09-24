import {
  GetServerSideProps,
  InferGetServerSidePropsType,
  PreviewData,
} from "next";
import { ParsedUrlQuery } from "querystring";
import React from "react";
import Center from "../../components/Center";
import LessonForm from "../../components/Lesson/LessonForm";
import MetaHead from "../../components/MetaHead";
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
  const isExist = Boolean(noteId && !scheduleId && !date);

  return (
    <>
      <MetaHead title="Lesson | Sched" />
      <Sidebar />
      <Center>{isExist ? <></> : <LessonForm />}</Center>
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

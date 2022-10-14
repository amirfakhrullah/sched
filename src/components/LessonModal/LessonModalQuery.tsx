import React from "react";
import { trpc } from "../../utils/trpc";
import Loader from "../Loader";
import Markdown from "../Markdown";

const LessonModalQuery: React.FC<{ lessonId: string }> = ({ lessonId }) => {
  const { isLoading, data } = trpc.useQuery([
    "lessons.get",
    {
      includeCourse: false,
      lessonId,
    },
  ]);

  return isLoading || !data ? (
    <div className="w-full flex items-center justify-center">
      <Loader />
    </div>
  ) : (
    <Markdown>{data.note || ""}</Markdown>
  );
};

export default LessonModalQuery;

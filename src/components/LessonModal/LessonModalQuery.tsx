import React from "react";
import { ThreeDots } from "react-loader-spinner";
import { trpc } from "../../utils/trpc";
import Markdown from "../Markdown";

const LessonModalQuery: React.FC<{ lessonId: string; hex: string }> = ({
  lessonId,
  hex,
}) => {
  const { isLoading, data } = trpc.useQuery([
    "lessons.get",
    {
      includeCourse: false,
      lessonId,
    },
  ]);

  return isLoading || !data ? (
    <div className="w-full flex items-center justify-center">
      <ThreeDots
        height="80"
        width="80"
        radius="9"
        color={hex}
        ariaLabel="three-dots-loading"
        wrapperStyle={{}}
        visible={true}
      />
    </div>
  ) : (
    <Markdown>{data.note || ""}</Markdown>
  );
};

export default LessonModalQuery;

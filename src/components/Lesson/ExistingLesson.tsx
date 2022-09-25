/* eslint-disable @typescript-eslint/no-non-null-assertion */
import moment from "moment";
import { useRouter } from "next/router";
import React, { useMemo } from "react";
import { getColorThemes } from "../../helpers/cardColors";
import { trpc } from "../../utils/trpc";
import Loader from "../Loader";
import LessonForm from "./LessonForm";

const ExistingLesson: React.FC<{
  lessonId: string;
}> = ({ lessonId }) => {
  const router = useRouter();
  const { data, isLoading } = trpc.useQuery(
    [
      "lessons.get",
      {
        lessonId,
        includeCourse: true,
      },
    ],
    {
      onError: () => router.push("/404"),
    }
  );

  const color = useMemo(() => {
    if (!data || !data.color)
      return {
        card: "",
        tag: "",
        hex: "",
      };
    return getColorThemes(data.color);
  }, [data]);

  if (isLoading || !data) return <Loader />;

  return (
    <div>
      <div className={`${color.card} sm:p-6 p-3`}>
        <h3 className="text-black overflow-hidden font-oswald text-xl font-medium mb-1">
          {data.name}
        </h3>
        <p>
          {moment(data.date?.toString()).format("MMMM Do YYYY")},{" "}
          {moment(data.start_time, "HHmm").format("hh:mm A")} -{" "}
          {moment(data.end_time, "hhmm").format("HH:mm A")}
        </p>
      </div>
      <LessonForm
        type="edit"
        colors={color}
        id={data.lesson_id}
        initialValues={{
          date: data.date!.toString(),
          note: data.note!,
          scheduleId: data.schedule_id!,
          tags: data.tags!,
          unit: data.unit!,
        }}
      />
    </div>
  );
};

export default ExistingLesson;

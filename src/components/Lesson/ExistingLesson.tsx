/* eslint-disable @typescript-eslint/no-non-null-assertion */
import moment from "moment";
import React, { useMemo, useState } from "react";
import { getColorThemes } from "../../helpers/cardColors";
import { trpc } from "../../utils/trpc";
import Loader from "../Loader";
import LessonForm from "./LessonForm";
import { toast } from "react-toastify";
import Center404 from "../Center404";

const ExistingLesson: React.FC<{
  lessonId: string;
}> = ({ lessonId }) => {
  const [is404, setIs404] = useState(false);

  const { data, isLoading } = trpc.useQuery(
    [
      "lessons.get",
      {
        lessonId,
        includeCourse: true,
      },
    ],
    {
      onError: (e) => {
        if (e.data?.code === "NOT_FOUND") {
          setIs404(true);
        }
        toast.error(e.message);
      },
      retry: 2,
      enabled: !is404,
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

  if (isLoading) return <Loader />;
  if (!data) return <Center404 text="No Note Found." />;

  return (
    <div>
      <div className={`${color.card} sm:p-6 p-3`}>
        <h3 className="text-black overflow-hidden font-oswald text-xl font-medium mb-1">
          {data.name}
        </h3>
        <p>
          {moment(data.date?.toString()).format("dddd, MMMM Do YYYY")},{" "}
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

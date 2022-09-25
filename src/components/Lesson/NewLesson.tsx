import moment from "moment";
import { useRouter } from "next/router";
import React, { useMemo } from "react";
import { getColorThemes } from "../../helpers/cardColors";
import { trpc } from "../../utils/trpc";
import Loader from "../Loader";
import LessonForm from "./LessonForm";

const INITIAL_LESSON_VALUES = {
  unit: "",
  note: "",
  tags: [],
  date: "",
  scheduleId: "",
};

const NewLesson: React.FC<{
  scheduleId: string;
  date: string;
}> = ({ scheduleId, date }) => {
  const router = useRouter();
  const { isLoading, data } = trpc.useQuery(
    [
      "schedules.get",
      {
        id: scheduleId,
      },
    ],
    {
      onError: () => router.push("/404"),
    }
  );

  const color = useMemo(() => {
    if (!data)
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
          {moment(date).format("MMMM Do YYYY")},{" "}
          {moment(data.weekly_schedule[0]?.start_time, "HHmm").format(
            "hh:mm A"
          )}{" "}
          -{" "}
          {moment(data.weekly_schedule[0]?.end_time, "HHmm").format("hh:mm A")}
        </p>
      </div>
      <LessonForm
        type="create"
        colors={color}
        initialValues={{
          ...INITIAL_LESSON_VALUES,
          scheduleId,
          date,
        }}
      />
    </div>
  );
};

export default NewLesson;

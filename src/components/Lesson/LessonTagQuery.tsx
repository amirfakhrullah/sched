import React from "react";
import { trpc } from "../../utils/trpc";
import Loader from "../Loader";
import Card from "../Schedule/Card";

const LessonTagQuery: React.FC<{
  tag: string;
}> = ({ tag }) => {
  const { data, isLoading } = trpc.useQuery([
    "lessons.get-by-tag",
    {
      tag,
    },
  ]);

  if (isLoading || !data)
    return (
      <div className="my-4">
        <Loader />
      </div>
    );

  return (
    <>
      {data && data.length > 0 && (
        <div className="grid md:grid-cols-5 sm:grid-cols-3 grid-cols-1 gap-3 w-full">
          {data &&
            data.map((lesson) => (
              <Card
                key={lesson.lesson_id}
                date={lesson.date}
                lessonCard={{
                  day: lesson.day,
                  schedule_id: lesson.schedule_id,
                  course_id: lesson.course_id,
                  lesson_id: lesson.lesson_id,
                  name: lesson.name,
                  color: lesson.color,
                  start_time: lesson.start_time,
                  end_time: lesson.end_time,
                  unit: lesson.unit,
                  tags: lesson.tags,
                }}
                displayDate
              />
            ))}
        </div>
      )}
      {data && data.length === 0 && (
        <p className="text-gray-600 text-sm text-center my-5">
          No Notes Found.
        </p>
      )}
    </>
  );
};

export default LessonTagQuery;

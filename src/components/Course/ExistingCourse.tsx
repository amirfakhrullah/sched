import moment from "moment";
import React from "react";
import { trpc } from "../../utils/trpc";
import Loader from "../Loader";
import CourseForm from "./CourseForm";

const ExistingCourse: React.FC<{
  courseId: string;
}> = ({ courseId }) => {
  const { isLoading, data } = trpc.useQuery([
    "courses.get",
    {
      id: courseId,
    },
  ]);

  if (isLoading || !data) return <Loader />;

  return (
    <>
      <div className="sm:p-6 p-3 bg-teal-800">
        <h3 className="text-white overflow-hidden font-oswald text-xl font-medium">
          Edit Course
        </h3>
      </div>
      <CourseForm
        id={courseId}
        type="edit"
        initialValues={{
          name: data.name,
          color: data.color,
          start_date: moment(data.start_date.toString()).format("yyyy-MM-DD"),
          end_date: data.end_date
            ? moment(data.end_date.toString()).format("yyyy-MM-DD")
            : undefined,
          weekly_schedule: data.weekly_schedule,
        }}
      />
    </>
  );
};

export default ExistingCourse;

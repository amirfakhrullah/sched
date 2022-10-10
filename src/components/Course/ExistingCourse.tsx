import moment from "moment";
import React, { useState } from "react";
import { trpc } from "../../utils/trpc";
import Loader from "../Loader";
import CourseForm from "./CourseForm";
import ViewExistingCourse from "./ViewExistingCourse";
import { toast } from "react-toastify";
import Center404 from "../Center404";

const cached404: string[] = [];

const ExistingCourse: React.FC<{
  courseId: string;
}> = ({ courseId }) => {
  const [viewMode, setViewMode] = useState(true);
  const { isLoading, data } = trpc.useQuery(
    [
      "courses.get",
      {
        id: courseId,
      },
    ],
    {
      onError: (e) => {
        toast.error(e.message);
        cached404.push(courseId);
      },
      enabled: !cached404.includes(courseId),
    }
  );

  if (isLoading) return <Loader />;
  if (!data) return <Center404 text="No Course Found." />;

  if (viewMode)
    return (
      <ViewExistingCourse course={data} onEdit={() => setViewMode(false)} />
    );

  return (
    <>
      <div className="sm:p-6 p-3 bg-teal-800">
        <h3 className="text-white overflow-hidden font-oswald text-xl font-medium">
          {viewMode ? "Course Details" : "Edit Course"}
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
        onCancelEdit={() => setViewMode(true)}
      />
    </>
  );
};

export default ExistingCourse;

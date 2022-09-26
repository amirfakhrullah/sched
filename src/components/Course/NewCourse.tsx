import moment from "moment";
import React from "react";
import CourseForm from "./CourseForm";

const INITIAL_COURSE_VALUES = {
  name: "",
  start_date: undefined,
  end_date: undefined,
  color: "",
  weekly_schedule: [],
};

const NewCourse = () => {
  return (
    <>
      <div className="sm:p-6 p-3 bg-teal-800">
        <h3 className="text-white overflow-hidden font-oswald text-xl font-medium">
          New Course
        </h3>
      </div>
      <CourseForm
        type="create"
        initialValues={{
          ...INITIAL_COURSE_VALUES,
          start_date: moment().format("yyyy-MM-DD"),
        }}
        onCancelEdit={() => null}
      />
    </>
  );
};

export default NewCourse;

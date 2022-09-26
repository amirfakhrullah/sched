import { Course, Schedule } from "@prisma/client";
import moment from "moment";
import React from "react";
import { getColorThemes } from "../../helpers/cardColors";
import AppButton from "../AppButton";

const ViewExistingCourse: React.FC<{
  course: Course & {
    weekly_schedule: Schedule[];
  };
  onEdit: () => void;
}> = ({ course, onEdit }) => {
  const colors = getColorThemes(course.color);

  return (
    <>
      <div className={`sm:p-6 p-3 ${colors.card}`}>
        <h3 className="text-black overflow-hidden font-oswald text-xl font-medium">
          {course.name}
        </h3>
      </div>
      <div className="sm:p-6 p-3">
        <p className="pb-2">
          <b>Start Date:</b>{" "}
          {moment(course.start_date.toString()).format("MMMM Do yyyy")}
        </p>
        {course.end_date && (
          <p className="pb-2">
            <b>End Date:</b>{" "}
            {moment(course.end_date.toString()).format("MMMM Do yyyy")}
          </p>
        )}
        <p className="font-bold mb-1">Weekly Schedule:</p>
        {course.weekly_schedule &&
          course.weekly_schedule.map((schedule) => (
            <div
              key={schedule.id}
              className="border rounded-sm border-gray-400 bg-blue-gray-100 p-2 mb-2"
            >
              <p className="font-bold capitalize">{schedule.day}</p>
              <p className="text-sm font-medium">
                {moment(schedule.start_time, "HHmm").format("hh:mm A")} -{" "}
                {moment(schedule.end_time, "HHmm").format("hh:mm A")}
              </p>
            </div>
          ))}
      </div>
      <div className="sm:p-6 p-3 flex sm:flex-row gap-1 flex-col sm:items-center items-end justify-end border-t border-blue-gray-100">
        <AppButton
          label="Edit"
          theme="blue-gray"
          variant="outlined"
          css="max-w-[10em]"
          onClick={() => onEdit()}
        />
      </div>
    </>
  );
};

export default ViewExistingCourse;

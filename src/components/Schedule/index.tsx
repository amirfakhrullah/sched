import React from "react";
import { BsFillCalendarEventFill } from "react-icons/bs";
import { trpc } from "../../utils/trpc";
import {
  CoursePayloadType,
  UpdateCoursePayloadType,
} from "../../helpers/validations/courses";
import Calendar from "./Calendar";
// import Calendar from 'react-calendar';

const Schedule = () => {
  const { mutate } = trpc.useMutation("courses.update", {
    onSuccess: (course) => console.log(course),
    onError: (err) => console.log(err),
  });

  const handleClick = () => {
    const data: UpdateCoursePayloadType = {
      id: "cl84bqfj801257kscf5r188ed",
      name: "My first course",
      color: "grey",
      start_date: 20220916,
      end_date: 20300101,
      weekly_schedule: [
        {
          id: "cl84bqfj801267kscd7j6ixsz",
          day: "monday",
          start_time: "1100",
          end_time: "1515",
        },
        {
          id: "cl84bvbs102227kscqe5cbd51",
          day: "tuesday",
          start_time: "1230",
          end_time: "1500",
        },
      ],
    };
    // mutate(data);
  };

  return (
    <>
      <div className="flex flex-row items-center">
        <h2 className="text-4xl font-[700] font-oswald">August 2022</h2>
        <div
          onClick={() => handleClick()}
          className="p-3 m-2 hover:bg-gray-300 cursor-pointer rounded-full ease-in duration-100"
        >
          <BsFillCalendarEventFill />
        </div>
      </div>
      <p className="font-oswald font-[500]">Week 8th - 14th</p>
      <div className="sm:p-10 p-4" />
      <Calendar />
    </>
  );
};

export default Schedule;

import React from "react";
import { BsFillCalendarEventFill } from "react-icons/bs";
import Calendar from "./Calendar";
// import Calendar from 'react-calendar';

const Schedule = () => {
  return (
    <>
      <div className="flex flex-row items-center">
        <h2 className="text-4xl font-[700] font-oswald">August 2022</h2>
        <div className="p-3 m-2 hover:bg-gray-300 cursor-pointer rounded-full ease-in duration-100">
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

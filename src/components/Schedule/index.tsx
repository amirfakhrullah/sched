import moment from "moment";
import React from "react";
import { BsFillCalendarEventFill } from "react-icons/bs";
import { WeeklyScheduleResponse } from "../../server/router/routes/courses";
import Calendar from "./Calendar";
// import Calendar from 'react-calendar';

const Schedule: React.FC<{
  data: WeeklyScheduleResponse | undefined;
  setDayId: React.Dispatch<React.SetStateAction<number | undefined>>;
}> = ({ data, setDayId }) => {
  if (!data) return null;
  return (
    <>
      <div className="flex flex-row items-center">
        <h2 className="text-4xl font-[700] font-oswald">{moment(data.day_id.toString()).format("MMMM YYYY")}</h2>
        <div className="p-3 m-2 hover:bg-gray-300 cursor-pointer rounded-full ease-in duration-100">
          <BsFillCalendarEventFill />
        </div>
      </div>
      <p className="font-oswald font-[500]">Week {moment(data.start_date.toString()).format("Do")} - {moment(data.end_date.toString()).format("Do")}</p>
      <div className="sm:p-10 p-4" />
      <Calendar data={data} />
    </>
  );
};

export default Schedule;

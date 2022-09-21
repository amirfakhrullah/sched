import moment from "moment";
import React from "react";
import {
  BsArrowLeftShort,
  BsArrowRightShort,
} from "react-icons/bs";
import { WeeklyScheduleResponse } from "../../server/router/routes/courses";
import Calendar from "./Calendar";
// import Calendar from 'react-calendar';

const Schedule: React.FC<{
  data: WeeklyScheduleResponse;
  setDayId: React.Dispatch<React.SetStateAction<number | undefined>>;
}> = ({ data, setDayId }) => {
  return (
    <>
      <h2 className="text-4xl font-[700] font-oswald">
        {moment(data.day_id.toString()).format("MMMM YYYY")}
      </h2>

      <div className="flex flex-row items-center">
        <div
          onClick={() => setDayId(data.prev_week_id)}
          className="p-1 m-1 hover:bg-gray-300 cursor-pointer rounded-full ease-in duration-100"
        >
          <BsArrowLeftShort className="text-2xl" />
        </div>
        <p className="font-oswald font-[500]">
          Week {moment(data.start_date.toString()).format("Do")} -{" "}
          {moment(data.end_date.toString()).format("Do")}
        </p>
        <div
          onClick={() => setDayId(data.next_week_id)}
          className="p-1 m-1 hover:bg-gray-300 cursor-pointer rounded-full ease-in duration-100"
        >
          <BsArrowRightShort className="text-2xl" />
        </div>
      </div>
      <div className="p-4" />
      <Calendar data={data} />
    </>
  );
};

export default Schedule;

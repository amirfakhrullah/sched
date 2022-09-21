import { Day } from "@prisma/client";
import React from "react";
import { WeeklyScheduleResponse } from "../../server/router/routes/courses";
import DayContainer from "./DayContainer";

const weekDays: Day[] = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
];

const Calendar: React.FC<{
  data: WeeklyScheduleResponse;
}> = ({ data }) => {
  return (
    <div className="grid md:grid-cols-5 sm:grid-cols-3 grid-cols-1 gap-3 w-full">
      {weekDays.map((day, idx) => (
        <DayContainer key={`day__${day}__${idx}`} day={day} data={data} />
      ))}
    </div>
  );
};

export default Calendar;

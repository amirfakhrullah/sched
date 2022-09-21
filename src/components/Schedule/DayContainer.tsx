import { Day } from "@prisma/client";
import moment from "moment";
import React from "react";
import { WeeklyScheduleResponse } from "../../server/router/routes/courses";
import Card from "./Card";

const DayContainer: React.FC<{
  day: Day;
  data: WeeklyScheduleResponse;
}> = ({ day, data }) => {
  return (
    <div className="flex flex-col">
      <div className="flex flex-row items-center justify-between border-b-2 border-teal-800 pb-2">
        <h3 className="font-oswald text-2xl font-semibold capitalize">{day.slice(0, 3)}</h3>
        <p className="font-oswald text-sm text-gray-600">
          {moment(data.schedules[day].date.toString()).format("MMMM Do")}
        </p>
      </div>

      {data.schedules[day].cards.map((card) => (
        <Card key={card.schedule_id} lessonCard={card} />
      ))}
    </div>
  );
};

export default DayContainer;

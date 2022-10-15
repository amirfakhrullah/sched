import moment from "moment";
import { useRouter } from "next/router";
import React from "react";
import { AiOutlineAppstoreAdd } from "react-icons/ai";
import {
  BsArrowLeftShort,
  BsArrowRightShort,
  BsFillCalendar2WeekFill,
} from "react-icons/bs";
import { WeeklyScheduleResponse } from "../../server/router/routes/courses";
import AppButton from "../AppButton";
import Calendar from "./Calendar";
import DatePicker from "react-datepicker";
import { DateValidator } from "../../helpers/validations/shared";
import { Tooltip } from "@material-tailwind/react";

const Schedule: React.FC<{
  data: WeeklyScheduleResponse;
}> = ({ data }) => {
  const router = useRouter();

  const handleChangeDate = (date: Date) => {
    router.push({
      query: {
        dayRef: moment(date).format("yyyyMMDD"),
      },
    });
  };

  const initialDate = !router.query.dayRef
    ? new Date()
    : router.query.dayRef &&
      typeof router.query.dayRef === "string" &&
      DateValidator.safeParse(router.query.dayRef).success
    ? moment(router.query.dayRef).toDate()
    : moment(data.day_id.toString()).toDate();

  return (
    <>
      <div className="flex sm:flex-row flex-col sm:items-center justify-between">
        <div>
          <div className="flex flex-row items-center justify-center">
            <h2 className="text-4xl font-[700] font-oswald text-center mr-2">
              {moment(data.day_id.toString()).format("MMMM YYYY")}
            </h2>
            <DatePicker
              selected={initialDate}
              onChange={handleChangeDate}
              customInput={
                <div>
                  <Tooltip
                    placement="right"
                    content={
                      <p>
                        Select specific date to see your
                        <br />
                        weekly schedule for that date
                      </p>
                    }
                    className="sm:block hidden"
                  >
                    <div className="w-10 h-10 rounded-full cursor-pointer hover:bg-gray-500 flex items-center justify-center ease-in duration-100">
                      <BsFillCalendar2WeekFill className="text-lg" />
                    </div>
                  </Tooltip>
                </div>
              }
            />
          </div>

          <div className="flex flex-row items-center md:justify-start justify-center">
            <div
              onClick={() =>
                router.push({
                  query: { dayRef: data.prev_week_id.toString() },
                })
              }
              className="p-1 m-1 hover:bg-blue-gray-200 cursor-pointer rounded-full ease-in duration-100"
            >
              <BsArrowLeftShort className="text-2xl" />
            </div>
            <p className="font-oswald font-[500]">
              Week {moment(data.start_date.toString()).format("Do")} -{" "}
              {moment(data.end_date.toString()).format("Do")}
            </p>
            <div
              onClick={() =>
                router.push({
                  query: { dayRef: data.next_week_id.toString() },
                })
              }
              className="p-1 m-1 hover:bg-blue-gray-200 cursor-pointer rounded-full ease-in duration-100"
            >
              <BsArrowRightShort className="text-2xl" />
            </div>
          </div>
        </div>
        <AppButton
          label="Add Course"
          onClick={() => router.push("/courses/new")}
          css="bg-teal-800 sm:max-w-[14em] sm:m-0 mt-1"
          theme="green"
          icon={<AiOutlineAppstoreAdd className="text-white text-xl mr-2" />}
        />
      </div>
      <div className="p-4" />
      <Calendar data={data} />
    </>
  );
};

export default Schedule;

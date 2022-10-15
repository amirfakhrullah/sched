import * as trpc from "@trpc/server";
import moment from "moment";
import { Day } from "@prisma/client";

interface Input {
  start_date: string;
  end_date?: string;
  weekly_schedule: {
    id?: string;
    day: Day;
    start_time: string;
    end_time: string;
  }[];
}

export const dateTimeChecker = (input: Input) => {
  const { start_date, end_date, weekly_schedule } = input;
  // check if end date is after start date
  if (end_date && Number(end_date) <= Number(start_date)) {
    throw new trpc.TRPCError({
      message: "End date is before or equal to start date",
      code: "CONFLICT",
    });
  }
  // check if end date is after start date
  for (const schedule of weekly_schedule) {
    const start = moment(schedule.start_time, "HHmm");
    const end = moment(schedule.end_time, "HHmm");

    if (end.isSameOrBefore(start)) {
      throw new trpc.TRPCError({
        message: "End time is before or equal to start time",
        code: "CONFLICT",
      });
    }
  }
};

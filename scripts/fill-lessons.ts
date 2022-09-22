/**
 * IMPORTANT
 * To run this script, needs to modify ../src/server/db/client.ts
 */
import { prisma } from "../src/server/db/client";
import * as readline from "readline";
import * as process from "process";
import { z } from "zod";
import { lessonData } from "./data";
import { Day } from "@prisma/client";
import { getWeekDates } from "../src/helpers/weeklySchedules";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const fillLessons = async (userId: string, day: Day) => {
  const weekArr = getWeekDates();
  const date = weekArr.find((obj) => obj.day === day)?.date as string;
  const foundUser = await prisma.user.findFirstOrThrow({
    where: {
      id: userId,
    },
  });
  const courses = await prisma.course.findMany({
    where: {
      userId: foundUser.id,
      weekly_schedule: {
        some: {
          day,
        },
      },
    },
    include: {
      weekly_schedule: true,
    },
  });

  const formattedSchedules = courses.flatMap((course) =>
    course.weekly_schedule
      .filter((schedule) => schedule.day === day)
      .map((schedule) => ({
        scheduleId: schedule.id,
        date: Number(date),
        note: lessonData.note,
        unit: lessonData.unit,
        tags: lessonData.tags,
      }))
  );

  await prisma.lesson.createMany({
    data: formattedSchedules,
  });
};

(async () => {
  rl.question(
    "Please insert the account's userId for the courses \nuserId :",
    async function (id: string) {
      try {
        const idValidator = z.string().max(255);
        idValidator.parse(id);

        rl.question(
          "Please insert the day for the lessons \nday :",
          async function (day: string) {
            try {
              const dayValidator = z.nativeEnum(Day);
              dayValidator.parse(day);

              console.log("Initiating lessons creation ---------------------");
              await fillLessons(id, day as Day);
              console.log("Creating lessons done ---------------------------");

              process.exit();
            } catch (error) {
              console.error(error);
              process.exit(1);
            }
          }
        );
      } catch (error) {
        console.error(error);
        process.exit(1);
      }
    }
  );
})();

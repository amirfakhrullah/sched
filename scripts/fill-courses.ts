// const userId = "cl84jsw450006mwscaulm5y64";
/**
 * IMPORTANT
 * To run this script, needs to modify ../src/server/db/client.ts
 */
import { prisma } from "../src/server/db/client";
import * as readline from "readline";
import * as process from "process";
import { z } from "zod";
import { coursesData } from "./data";
import { Day } from "@prisma/client";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const fillCourses = async (userId: string) => {
  const foundUser = await prisma.user.findFirstOrThrow({
    where: {
      id: userId,
    },
  });

  const formattedCoursesData = coursesData.map((course) => ({
    userId: foundUser.id,
    ...course,
  }));

  await prisma.$transaction([
    ...formattedCoursesData.map((course) =>
      prisma.course.create({
        data: {
          userId: course.userId,
          name: course.name,
          color: course.color,
          start_date: course.start_date,
          end_date: course.end_date,
          weekly_schedule: {
            createMany: {
              data: course.weekly_schedule.map((schedule) => ({
                day: schedule.day as Day,
                start_time: schedule.start_time,
                end_time: schedule.end_time,
              })),
            },
          },
        },
      })
    ),
  ]);
};

(async () => {
  rl.question(
    "Please insert the account's userId for the courses \nuserId :",
    async function (id: string) {
      try {
        const idValidator = z.string().max(255);
        idValidator.parse(id);

        console.log("Initiating course creations ---------------------");
        await fillCourses(id);
        console.log("Creating courses done ---------------------------");

        process.exit();
      } catch (error) {
        console.error(error);
        process.exit(1);
      }
    }
  );
})();

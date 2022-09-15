import { Day } from "@prisma/client";
import {
  CoursePayloadValidator,
  UpdateCoursePayloadValidator,
} from "../../../helpers/validations/courses";
import { createProtectedRouter } from "../protected-router";

export const coursesRouter = createProtectedRouter()
  .mutation("create", {
    input: CoursePayloadValidator,
    async resolve({ ctx, input }) {
      const { name, color, start_date, end_date, weekly_schedule } = input;
      const newCourse = await ctx.prisma.course.create({
        data: {
          userEmail: ctx.session.user.email,
          name,
          color,
          start_date,
          end_date,
          weekly_schedule: {
            createMany: {
              data: [
                {
                  day: Day.monday,
                },
                {
                  day: Day.tuesday,
                },
                {
                  day: Day.wednesday,
                },
                {
                  day: Day.thursday,
                },
                {
                  day: Day.friday,
                },
              ],
            },
          },
        },
        include: {
          weekly_schedule: true,
        },
      });

      await ctx.prisma.schedule.createMany({
        data: newCourse.weekly_schedule.flatMap((daySchedule) => {
          return weekly_schedule[daySchedule.day].map((sched) => ({
            start_time: sched.start_time,
            end_time: sched.end_time,
            dayScheduleId: daySchedule.id,
          }));
        }),
      });

      return newCourse;
    },
  })
  .mutation("update", {
    input: UpdateCoursePayloadValidator,
    async resolve({ ctx, input }) {
      const { id, name, color, start_date, end_date, weekly_schedule } = input;
      const foundCourse = await ctx.prisma.course.findFirstOrThrow({
        where: {
          id,
          userEmail: ctx.session.user.email,
        },
      });

      const updatedCourse = await ctx.prisma.course.update({
        where: {
          id: foundCourse.id,
        },
        data: {
          ...foundCourse,
          name,
          color,
          start_date,
          end_date,
        },
        include: {
          weekly_schedule: true,
        },
      });

      const massagedWeeklySchedules = Object.keys(weekly_schedule).flatMap(
        (key) => {
          return weekly_schedule[key as Day].map((schedule) => ({
            ...schedule,
            dayScheduleId: updatedCourse.weekly_schedule.find(
              (daySchedule) => daySchedule.day === key
            )?.id as string,
          }));
        }
      );
      const existingSchedules = massagedWeeklySchedules.filter(
        (schedules) => schedules.id !== undefined
      ) as {
        id: string;
        dayScheduleId: string;
        start_time: string;
        end_time: string;
      }[];

      const newSchedules = massagedWeeklySchedules.filter(
        (schedules) => !schedules.id
      );

      const scheduleIdsNeededToBeDeleted = await ctx.prisma.schedule.findMany({
        where: {
          dayScheduleId: {
            in: updatedCourse.weekly_schedule.map(
              (weeklySchedule) => weeklySchedule.id
            ),
          },
          id: {
            notIn: existingSchedules.map((schedule) => schedule.id),
          },
        },
        select: {
          id: true,
        },
      });

      await ctx.prisma.$transaction([
        ...existingSchedules.map((sched) =>
          ctx.prisma.schedule.update({
            where: {
              id: sched.id,
            },
            data: sched,
          })
        ),
        ctx.prisma.schedule.createMany({
          data: newSchedules.map((sched) => ({
            start_time: sched.start_time,
            end_time: sched.end_time,
            dayScheduleId: sched.dayScheduleId,
          })),
        }),
        ctx.prisma.schedule.deleteMany({
          where: {
            id: {
              in: scheduleIdsNeededToBeDeleted.map((sched) => sched.id),
            },
          },
        }),
      ]);
    },
  })
  .query("weeklySchedule", {
    resolve({ ctx }) {
      return ctx.session;
    },
  });

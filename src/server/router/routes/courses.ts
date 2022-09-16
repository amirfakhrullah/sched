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
              data: weekly_schedule.map((schedule) => ({
                day: schedule.day,
                start_time: schedule.start_time,
                end_time: schedule.end_time,
              })),
            },
          },
        },
        include: {
          weekly_schedule: true,
        },
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

      const existingSchedules = weekly_schedule.filter(
        (schedules) => schedules.id !== undefined
      ) as {
        id: string;
        day: Day;
        start_time: string;
        end_time: string;
      }[];

      const newSchedules = weekly_schedule.filter((schedules) => !schedules.id);

      const scheduleIdsNeededToBeDeleted = await ctx.prisma.schedule.findMany({
        where: {
          AND: [
            {
              id: {
                in: updatedCourse.weekly_schedule.map(
                  (schedule) => schedule.id
                ),
              },
            },
            {
              id: {
                notIn: existingSchedules.map((schedule) => schedule.id),
              },
            },
          ],
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
            data: {
              day: sched.day,
              start_time: sched.start_time,
              end_time: sched.end_time,
            },
          })
        ),
        ctx.prisma.schedule.createMany({
          data: newSchedules.map((sched) => ({
            day: sched.day,
            start_time: sched.start_time,
            end_time: sched.end_time,
            courseId: updatedCourse.id,
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

      return await ctx.prisma.course.findFirst({
        where: {
          id: updatedCourse.id,
        },
        include: {
          weekly_schedule: true,
        },
      });
    },
  })
  .query("weeklySchedule", {
    resolve({ ctx }) {
      return ctx.session;
    },
  });
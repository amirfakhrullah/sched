import { Day, Prisma } from "@prisma/client";
import { isCourseAuthorized } from "../../../helpers/isCourseAuthorized";
import {
  CoursePayloadValidator,
  UpdateCoursePayloadValidator,
  WeeklySchedulePayloadValidator,
} from "../../../helpers/validations/courses";
import { IdValidator } from "../../../helpers/validations/shared";
import {
  filterActiveWeekLessons,
  getPrevOrNextWeekId,
  getWeekDates,
  massageIntoWeeklyScheduleCards,
} from "../../../helpers/weeklySchedules";
import { createProtectedRouter } from "../protected-router";
import { inferQueryOutput } from "../../../utils/trpc";
import { dateTimeChecker } from "../../../helpers/dateTimeChecker";
import * as trpc from "@trpc/server";
import {
  checkIs404CourseInCache,
  setCache404CourseId,
} from "../../common/cache";

export const coursesRouter = createProtectedRouter()
  .query("get-all", {
    async resolve({ ctx }) {
      return await ctx.prisma.course.findMany({
        where: {
          userId: ctx.session.user.id,
        },
      });
    },
  })
  .query("get", {
    input: IdValidator,
    async resolve({ ctx, input }) {
      checkIs404CourseInCache(`${ctx.session.user.id}:::course${input.id}`);
      try {
        return await isCourseAuthorized(ctx, input.id);
      } catch (e) {
        if (e instanceof Prisma.NotFoundError) {
          setCache404CourseId(`${ctx.session.user.id}:::course${input.id}`);
          throw new trpc.TRPCError({
            message: "No Course Found",
            code: "NOT_FOUND",
          });
        }
      }
    },
  })
  .mutation("create", {
    input: CoursePayloadValidator,
    async resolve({ ctx, input }) {
      const { name, color, start_date, end_date, weekly_schedule } = input;

      // check date and time
      dateTimeChecker({
        start_date,
        end_date,
        weekly_schedule,
      });

      const newCourse = await ctx.prisma.course.create({
        data: {
          userId: ctx.session.user.id,
          name,
          color,
          start_date: Number(start_date),
          end_date: end_date ? Number(end_date) : null,
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
      const foundCourse = await isCourseAuthorized(ctx, id);

      // check date and time
      dateTimeChecker({
        start_date,
        end_date,
        weekly_schedule,
      });

      const updatedCourse = await ctx.prisma.course.update({
        where: {
          id: foundCourse.id,
        },
        data: {
          name,
          color,
          start_date: Number(start_date),
          end_date: end_date ? Number(end_date) : null,
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

      const schedulesNeededToBeDeleted = await ctx.prisma.schedule.findMany({
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
          lessons: true,
        },
      });
      const scheduleIdsNeededToBeDeleted = schedulesNeededToBeDeleted.map(
        (schedule) => schedule.id
      );
      const lessonIdsNeededToBeDeleted = schedulesNeededToBeDeleted.flatMap(
        (schedule) => schedule.lessons.map((lesson) => lesson.id)
      );

      await ctx.prisma.$transaction([
        ctx.prisma.lesson.deleteMany({
          where: {
            id: {
              in: lessonIdsNeededToBeDeleted,
            },
          },
        }),
        ctx.prisma.schedule.deleteMany({
          where: {
            id: {
              in: scheduleIdsNeededToBeDeleted,
            },
          },
        }),
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
  .mutation("delete", {
    input: IdValidator,
    async resolve({ ctx, input }) {
      const { id } = input;
      const course = await isCourseAuthorized(ctx, id);
      const scheduleIds = course.weekly_schedule.map((schedule) => schedule.id);

      await ctx.prisma.$transaction([
        ctx.prisma.lesson.deleteMany({
          where: {
            scheduleId: {
              in: scheduleIds,
            },
          },
        }),
        ctx.prisma.schedule.deleteMany({
          where: {
            id: {
              in: scheduleIds,
            },
          },
        }),
        ctx.prisma.course.delete({
          where: {
            id,
          },
        }),
      ]);
    },
  })
  .query("weeklySchedule", {
    input: WeeklySchedulePayloadValidator,
    async resolve({ ctx, input }) {
      const { dayId } = input;
      const weekObj = getWeekDates(dayId?.toString());
      const { prevWeekId, nextWeekId } = getPrevOrNextWeekId(dayId?.toString());

      const involvedCourses = await ctx.prisma.course.findMany({
        where: {
          userId: ctx.session.user.id,
          start_date: {
            lte: Number(weekObj[6]?.date),
          },
        },
        include: {
          weekly_schedule: true,
        },
      });
      const involvedScheduleIds = involvedCourses.flatMap((course) =>
        course.weekly_schedule.map((schedule) => schedule.id)
      );

      const involvedLessons = await ctx.prisma.lesson.findMany({
        where: {
          scheduleId: {
            in: involvedScheduleIds,
          },
          AND: [
            {
              date: {
                lte: Number(weekObj[6]?.date),
              },
            },
            {
              date: {
                gte: Number(weekObj[0]?.date),
              },
            },
          ],
        },
      });

      const filteredActiveWeekLessons = filterActiveWeekLessons(
        involvedCourses,
        dayId?.toString()
      );
      const structuredWeekLessons = massageIntoWeeklyScheduleCards(
        filteredActiveWeekLessons,
        involvedLessons
      );

      return {
        day_id: Number(weekObj[0]?.date),
        start_date: Number(weekObj[0]?.date),
        end_date: Number(weekObj[6]?.date),
        prev_week_id: Number(prevWeekId),
        next_week_id: Number(nextWeekId),
        schedules: {
          monday: {
            cards: structuredWeekLessons.monday,
            date: Number(weekObj[1]?.date),
          },
          tuesday: {
            cards: structuredWeekLessons.tuesday,
            date: Number(weekObj[2]?.date),
          },
          wednesday: {
            cards: structuredWeekLessons.wednesday,
            date: Number(weekObj[3]?.date),
          },
          thursday: {
            cards: structuredWeekLessons.thursday,
            date: Number(weekObj[4]?.date),
          },
          friday: {
            cards: structuredWeekLessons.friday,
            date: Number(weekObj[5]?.date),
          },
        },
      };
    },
  });

export type WeeklyScheduleResponse = inferQueryOutput<"courses.weeklySchedule">;

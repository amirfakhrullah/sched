import {
  CreateLessonPayloadValidator,
  EditLessonPayloadValidator,
  GetLessonPayloadValidator,
} from "../../../helpers/validations/lessons";
import { createProtectedRouter } from "../protected-router";
import { inferQueryOutput } from "../../../utils/trpc";
import * as trpc from "@trpc/server";
import { IdValidator } from "../../../helpers/validations/shared";
import {
  isLessonAuthorized,
  isScheduleAuthorized,
} from "../../../helpers/isLessonAuthorized";
import moment from "moment";
import { TagValidator } from "../../../helpers/validations/lessons";
import { Prisma } from "@prisma/client";
import {
  checkIs404LessonInCache,
  setCache404LessonId,
} from "../../common/cache";

export const lessonsRouter = createProtectedRouter()
  .query("get", {
    input: GetLessonPayloadValidator,
    async resolve({ ctx, input }) {
      const { lessonId, includeCourse } = input;
      checkIs404LessonInCache(input.lessonId);

      try {
        const courseWithLesson = await isLessonAuthorized(ctx, lessonId);
        if (includeCourse) {
          return {
            day: courseWithLesson.weekly_schedule[0]?.day,
            schedule_id: courseWithLesson.weekly_schedule[0]?.id,
            course_id: courseWithLesson.id,
            lesson_id: courseWithLesson.weekly_schedule[0]?.lessons[0]?.id,
            name: courseWithLesson.name,
            color: courseWithLesson.color,
            start_time: courseWithLesson.weekly_schedule[0]?.start_time,
            end_time: courseWithLesson.weekly_schedule[0]?.end_time,
            // lesson data
            unit: courseWithLesson.weekly_schedule[0]?.lessons[0]?.unit,
            note: courseWithLesson.weekly_schedule[0]?.lessons[0]?.note,
            tags: courseWithLesson.weekly_schedule[0]?.lessons[0]?.tags,
            date: courseWithLesson.weekly_schedule[0]?.lessons[0]?.date,
          };
        }
        return {
          lesson_id: courseWithLesson.weekly_schedule[0]?.lessons[0]?.id,
          unit: courseWithLesson.weekly_schedule[0]?.lessons[0]?.unit,
          note: courseWithLesson.weekly_schedule[0]?.lessons[0]?.note,
          tags: courseWithLesson.weekly_schedule[0]?.lessons[0]?.tags,
          date: courseWithLesson.weekly_schedule[0]?.lessons[0]?.date,
        };
      } catch (e) {
        if (e instanceof Prisma.NotFoundError) {
          setCache404LessonId(input.lessonId);
          throw new trpc.TRPCError({
            message: "No Note Found",
            code: "NOT_FOUND",
          });
        }
      }
    },
  })
  .query("get-by-tag", {
    input: TagValidator,
    async resolve({ ctx, input }) {
      const courses = await ctx.prisma.course.findMany({
        where: {
          userId: ctx.session.user.id,
          weekly_schedule: {
            some: {
              lessons: {
                some: {
                  tags: {
                    has: input.tag,
                  },
                },
              },
            },
          },
        },
        include: {
          weekly_schedule: {
            where: {
              lessons: {
                some: {
                  tags: {
                    has: input.tag,
                  },
                },
              },
            },
            include: {
              lessons: {
                where: {
                  tags: {
                    has: input.tag,
                  },
                },
              },
            },
          },
        },
      });

      return courses.flatMap((course) =>
        course.weekly_schedule.flatMap((sched) =>
          sched.lessons.map((lesson) => ({
            day: sched.day,
            schedule_id: sched.id,
            course_id: course.id,
            lesson_id: lesson.id,
            name: course.name,
            color: course.color,
            start_time: sched.start_time,
            end_time: sched.end_time,
            unit: lesson.unit,
            tags: lesson.tags,
            date: lesson.date,
          }))
        )
      );
    },
  })
  .mutation("create", {
    input: CreateLessonPayloadValidator,
    async resolve({ ctx, input }) {
      const { note, unit, tags, date, scheduleId } = input;
      const courseWithSchedule = await isScheduleAuthorized(ctx, scheduleId);

      // is schedule exist on the date
      const day = moment(date.toString()).format("dddd").toLowerCase();
      if (courseWithSchedule.weekly_schedule[0]?.day !== day) {
        throw new trpc.TRPCError({
          message: "Schedule doesn't exist on the date",
          code: "CONFLICT",
        });
      }

      return await ctx.prisma.lesson.create({
        data: {
          scheduleId,
          date: Number(date),
          unit,
          note,
          tags,
        },
      });
    },
  })
  .mutation("update", {
    input: EditLessonPayloadValidator,
    async resolve({ ctx, input }) {
      const { id, note, unit, tags } = input;
      await isLessonAuthorized(ctx, id);

      return await ctx.prisma.lesson.update({
        where: {
          id,
        },
        data: {
          unit,
          note,
          tags,
        },
      });
    },
  })
  .mutation("delete", {
    input: IdValidator,
    async resolve({ ctx, input }) {
      const { id } = input;
      await isLessonAuthorized(ctx, id);

      return await ctx.prisma.lesson.delete({
        where: {
          id,
        },
      });
    },
  });

export type GetLessonResponse = inferQueryOutput<"lessons.get">;

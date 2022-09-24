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

export const lessonsRouter = createProtectedRouter()
  .query("get", {
    input: GetLessonPayloadValidator,
    async resolve({ ctx, input }) {
      const { lessonId, includeCourse } = input;
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

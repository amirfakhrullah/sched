import { GetLessonPayloadValidator } from "../../../helpers/validations/lessons";
import { createProtectedRouter } from "../protected-router";
import { isCourseAuthorized } from "../../../helpers/isCourseAuthorized";
import { inferQueryOutput } from "../../../utils/trpc";

export const lessonsRouter = createProtectedRouter().query("get", {
  input: GetLessonPayloadValidator,
  async resolve({ ctx, input }) {
    const { lessonId, includeCourse } = input;
    if (!lessonId) return;

    const lesson = await ctx.prisma.lesson.findFirstOrThrow({
      where: {
        id: lessonId,
      },
      include: {
        Schedule: true,
      },
    });
    const course = await isCourseAuthorized(ctx, lesson.Schedule.courseId);

    if (includeCourse) {
      return {
        day: lesson.Schedule.day,
        schedule_id: lesson.scheduleId,
        course_id: course.id,
        lesson_id: lesson.id,
        name: course.name,
        color: course.color,
        start_time: lesson.Schedule.start_time,
        end_time: lesson.Schedule.end_time,
        // lesson data
        unit: lesson.unit,
        note: lesson.note,
        tags: lesson.tags,
        date: lesson.date,
      };
    }

    return {
      lesson_id: lesson.id,
      unit: lesson.unit,
      note: lesson.note,
      tags: lesson.tags,
      date: lesson.date,
    };
  },
});

export type GetLessonResponse = inferQueryOutput<"lessons.get">;

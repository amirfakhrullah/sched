import { Context } from "./isCourseAuthorized";

export const isLessonAuthorized = async (ctx: Context, lessonId: string) => {
  return await ctx.prisma.course.findFirstOrThrow({
    where: {
      userId: ctx.session.user?.id,
      weekly_schedule: {
        some: {
          lessons: {
            some: {
              id: lessonId,
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
              id: lessonId,
            },
          },
        },
        include: {
          lessons: {
            where: {
              id: lessonId,
            },
          },
        },
      },
    },
  });
};

export const isScheduleAuthorized = async (
  ctx: Context,
  scheduleId: string
) => {
  return await ctx.prisma.course.findFirstOrThrow({
    where: {
      userId: ctx.session.user?.id,
      weekly_schedule: {
        some: {
          id: scheduleId,
        },
      },
    },
  });
};

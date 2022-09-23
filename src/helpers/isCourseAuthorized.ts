import { Prisma, PrismaClient } from "@prisma/client";
import { Session } from "next-auth";

export interface Context {
  session: Session;
  prisma: PrismaClient<
    Prisma.PrismaClientOptions,
    never,
    Prisma.RejectOnNotFound | Prisma.RejectPerOperation | undefined
  >;
}

export const isCourseAuthorized = async (ctx: Context, courseId: string) => {
  return await ctx.prisma.course.findFirstOrThrow({
    where: {
      id: courseId,
      userId: ctx.session.user?.id,
    },
    include: {
      weekly_schedule: true,
    },
  });
};

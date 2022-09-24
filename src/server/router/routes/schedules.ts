import { IdValidator } from "../../../helpers/validations/shared";
import { createProtectedRouter } from "../protected-router";

export const schedulesRouter = createProtectedRouter().query("get", {
  input: IdValidator,
  async resolve({ ctx, input }) {
    const { id } = input;

    return await ctx.prisma.course.findFirstOrThrow({
      where: {
        userId: ctx.session.user.id,
        weekly_schedule: {
          some: {
            id,
          },
        },
      },
      include: {
        weekly_schedule: {
          where: {
            id,
          },
        },
      },
    });
  },
});

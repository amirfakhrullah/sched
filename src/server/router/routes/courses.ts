import { createProtectedRouter } from "../protected-router";

export const coursesRouter = createProtectedRouter()
  .query("getWeeklySchedule", {
    resolve({ ctx,  }) {
      return ctx.session;
    },
  })
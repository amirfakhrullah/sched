// src/server/router/index.ts
import { createRouter } from "./context";
import superjson from "superjson";

import { protectedExampleRouter } from "./protected-example-router";
import { coursesRouter } from "./routes/courses";
import { lessonsRouter } from "./routes/lessons";
import { schedulesRouter } from "./routes/schedules";

export const appRouter = createRouter()
  .transformer(superjson)
  .merge("auth.", protectedExampleRouter)
  .merge("courses.", coursesRouter)
  .merge("lessons.", lessonsRouter)
  .merge("schedules.", schedulesRouter);

// export type definition of API
export type AppRouter = typeof appRouter;

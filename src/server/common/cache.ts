import * as trpc from "@trpc/server";

const cache404CourseIds = new Set();
const cache404LessonIds = new Set();

export const checkIs404CourseInCache = (id: string) => {
  if (cache404CourseIds.has(id)) {
    throw new trpc.TRPCError({
      message: "No Course Found",
      code: "NOT_FOUND",
    });
  }
};

export const setCache404CourseId = (id: string) => {
  if (!cache404CourseIds.has(id)) cache404CourseIds.add(id);
  console.log("cache courses ===>", cache404CourseIds);
};

export const checkIs404LessonInCache = (id: string) => {
  if (cache404LessonIds.has(id)) {
    throw new trpc.TRPCError({
      message: "No Course Found",
      code: "NOT_FOUND",
    });
  }
};

export const setCache404LessonId = (id: string) => {
  if (!cache404LessonIds.has(id)) cache404LessonIds.add(id);
  console.log("cache lessons ===>", cache404LessonIds);
};

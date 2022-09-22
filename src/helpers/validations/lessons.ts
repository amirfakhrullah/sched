import { z } from "zod";

export const GetLessonPayloadValidator = z.object({
  lessonId: z.string().max(255),
  includeCourse: z.boolean()
});

export type GetLessonPayloadType = z.infer<typeof GetLessonPayloadValidator>;

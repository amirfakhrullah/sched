import { z } from "zod";
import { DateValidator } from "./shared";

export const GetLessonPayloadValidator = z.object({
  lessonId: z.string().max(255),
  includeCourse: z.boolean(),
});

export type GetLessonPayloadType = z.infer<typeof GetLessonPayloadValidator>;

export const CreateLessonPayloadValidator = z.object({
  unit: z.string().max(255),
  note: z.string().max(4000),
  tags: z.string().array().max(5),
  date: DateValidator,
  scheduleId: z.string().max(255),
});

export type CreateLessonPayloadType = z.infer<
  typeof CreateLessonPayloadValidator
>;

export const EditLessonPayloadValidator = CreateLessonPayloadValidator.omit({
  date: true,
  scheduleId: true,
}).extend({
  id: z.string().max(255),
});

export type EditLessonPayloadType = z.infer<typeof EditLessonPayloadValidator>;

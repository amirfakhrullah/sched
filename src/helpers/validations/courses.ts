import { Day } from "@prisma/client";
import { z } from "zod";

export const CoursePayloadValidator = z.object({
  name: z.string().max(500),
  start_date: z.number(),
  end_date: z.number().optional(),
  color: z.string().max(20),
  weekly_schedule: z.array(
    z.object({
      id: z.string().max(255).optional(),
      day: z.nativeEnum(Day),
      start_time: z.string().max(4),
      end_time: z.string().max(4),
    })
  )
});

export type CoursePayloadType = z.infer<typeof CoursePayloadValidator>;

export const UpdateCoursePayloadValidator = CoursePayloadValidator.extend({
  id: z.string().max(255),
});

export type UpdateCoursePayloadType = z.infer<
  typeof UpdateCoursePayloadValidator
>;

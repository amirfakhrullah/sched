import { Day } from "@prisma/client";
import { z } from "zod";
import { DateValidator, TimeValidator } from "./shared";

export const CoursePayloadValidator = z.object({
  name: z.string().min(4).max(500),
  start_date: DateValidator,
  end_date: DateValidator.optional(),
  color: z.string().min(4).max(20),
  weekly_schedule: z.array(
    z.object({
      id: z.string().max(255).optional(),
      day: z.nativeEnum(Day),
      start_time: TimeValidator,
      end_time: TimeValidator,
    })
  ).min(1),
});

export type CoursePayloadType = z.infer<typeof CoursePayloadValidator>;

export const CourseFormValidator = CoursePayloadValidator.omit({
  start_date: true,
  end_date: true,
}).extend({
  start_date: z.string().min(8),
  end_date: z.string().optional(),
});

export type CourseFormType = z.infer<typeof CourseFormValidator>;

export const UpdateCoursePayloadValidator = CoursePayloadValidator.extend({
  id: z.string().min(4).max(255),
});

export type UpdateCoursePayloadType = z.infer<
  typeof UpdateCoursePayloadValidator
>;

export const WeeklySchedulePayloadValidator = z.object({
  dayId: DateValidator.optional(),
});

export type WeeklySchedulePayloadType = z.infer<
  typeof WeeklySchedulePayloadValidator
>;

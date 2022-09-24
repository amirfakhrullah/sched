import { z } from "zod";
import { DATE_REGEX, TIME_REGEX } from "../regex";

export const IdValidator = z.object({
  id: z.string().max(255),
});

export type IdValidatorType = z.infer<typeof IdValidator>;

export const TimeValidator = z.string().regex(TIME_REGEX);
export const DateValidator = z.string().regex(DATE_REGEX);

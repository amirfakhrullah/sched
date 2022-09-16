import { z } from "zod";

export const IdValidator = z.object({
  id: z.string().max(255),
});

export type IdValidatorType = z.infer<typeof IdValidator>;

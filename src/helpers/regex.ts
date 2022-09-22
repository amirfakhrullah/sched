// import { z } from "zod";

export const TIME_REGEX = /^([0-1]?[0-9]|2[0-3])[0-5][0-9]$/;
export const DATE_REGEX = /^20[0-9]{2}(0[1-9]|1[0-2])(0[1-9]|1[0-9]|2[0-9]|3[0-1])$/;

/**
 * FOR TESTING PURPOSES
 */
// const validator = z.object({
//   time: z.string().regex(TIME_REGEX),
//   date: z
//     .string()
//     .regex(DATE_REGEX)
//     .transform((val) => Number(val)),
// });

// const validate = validator.safeParse({
//     time: "2359",
//     date: "20221231"
// })
// console.log(validate);

// type validatorType = z.infer<typeof validator>;

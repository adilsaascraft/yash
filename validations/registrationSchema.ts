import { z } from "zod";

/* -------------------- ENUMS -------------------- */
export const GenderEnum = z.enum(["male", "female", "other"]);

export const VisitingDayEnum = z.enum([
  "day1",
  "day2",
  "day3",
  "all",
]);

/* -------------------- MAIN SCHEMA -------------------- */
export const EVEventRegistrationSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters"),

  age: z.coerce
    .number()
    .min(18, "Minimum age is 18")
    .max(100, "Invalid age"),

  address: z.string().trim().min(5, "Address is required"),

  city: z.string().trim().min(2, "City is required"),

  mobile: z
    .string()
    .trim()
    .regex(/^[6-9]\d{9}$/, "Enter a valid Indian mobile number"),

  gender: GenderEnum,

  profession: z.string().trim().min(2, "Profession is required"),

  visitingDay: VisitingDayEnum,
});

/* -------------------- TYPE -------------------- */
export type EVEventRegistrationForm = z.output<
  typeof EVEventRegistrationSchema
>;
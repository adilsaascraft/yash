import { z } from "zod";
/* -------------------- MAIN SCHEMA -------------------- */
export const EVEventRegistrationSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters"),
  address: z.string().trim().min(5, "Address is required"),
  mobile: z
    .string()
    .trim()
    .regex(/^[6-9]\d{9}$/, "Enter a valid Indian mobile number"),

  profession: z.string().trim().min(2, "Profession is required"),
  accompany: z.string().optional(),
});

/* -------------------- TYPE -------------------- */
export type EVEventRegistrationForm = z.output<
  typeof EVEventRegistrationSchema
>;
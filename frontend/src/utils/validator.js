// src/schemas/signUpSchema.js

import { z } from "zod";

export const signUpSchema = z
  .object({
    email: z
      .string()
      .min(1, { message: "Email is required" })
      .email({ message: "Please enter a valid email" }),
    // Alternative: your strict regex version
    // email: z.string().regex(
    //   /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*\.[a-zA-Z]{2,}$/,
    //   { message: "Invalid email format" }
    // ),

    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters" })
      .max(32, { message: "Password cannot exceed 32 characters" }),

    confirmPassword: z.string().min(1, { message: "Please confirm your password" }),

    acceptTerms: z
      .boolean()
      .refine((val) => val === true, { message: "You must accept the terms and conditions" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"], // attaches error to confirmPassword field
  });

// Optional: export a type-like shape comment for reference (helps in JS)
// shape: { email: string, password: string, confirmPassword: string, acceptTerms: boolean }
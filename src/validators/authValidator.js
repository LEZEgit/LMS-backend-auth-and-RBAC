import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string({ required_error: "Email is required" }) // Explicit string type
    .trim() // Transform first
    .toLowerCase() // Transform second
    .email("Invalid email format") // Validate format last
    .min(1, "Email cannot be empty"), // Validate length last

  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .regex(/[A-Z]/, "Must contain at least one uppercase letter")
    .regex(/[0-9]/, "Must contain at least one number"),
});

export const registerSchema = z.object({
  firstName: z
    .string({ required_error: "First name is required" })
    .min(2, "First name must be at least 2 characters long"),

  lastName: z
    .string()
    .min(2, "Last name must be at least 2 characters long")
    .optional(),

  email: z
    .string({ required_error: "Email is required" })
    .trim()
    .toLowerCase()
    .email("Invalid email format")
    .min(1, "Email cannot be empty"),

  password: z
    .string({ required_error: "Password is required" })
    .min(8, "Password must be at least 8 characters long")
    .regex(/[A-Z]/, "Must contain at least one uppercase letter")
    .regex(/[0-9]/, "Must contain at least one number"),

  role: z
    .enum(["ADMIN", "READER", "ROOT_ADMIN"], {
      errorMap: () => ({
        message: "Role must be one of: ADMIN, READER, ROOT_ADMIN",
      }),
    })
    .optional(),
});

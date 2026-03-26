import { z } from "zod";

const registerSchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(2, "First name must be at least 2 characters"),

  lastName: z
    .string()
    .trim()
    .min(2, "Last name must be at least 2 characters")
    .optional(),

  email: z.string().email("Invalid email format").toLowerCase().trim(),

  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .regex(/[A-Z]/, "Must contain at least one uppercase letter")
    .regex(/[0-9]/, "Must contain at least one number"),

  // Allow ADMIN, READER, ROOT_ADMIN for admin-created users
  role: z.enum(["ADMIN", "READER", "ROOT_ADMIN"]).default("READER").optional(),
});

const adminUpdateUserSchema = z.object({
  role: z.enum(["ADMIN", "READER", "ROOT_ADMIN"]).optional(),
});

const adminResetPasswordSchema = z.object({
  newPassword: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .regex(/[A-Z]/, "Must contain at least one uppercase letter")
    .regex(/[0-9]/, "Must contain at least one number"),
});

const deleteUsersSchema = z.object({
  emails: z
    .array(z.string().email("Invalid email format").toLowerCase().trim()) // Ensures every item is a valid email
    .min(1, "Please provide at least one email"), // Ensures the array isn't empty
});

const userIdParamsSchema = z.object({
  id: z.string().uuid("Invalid user ID format"),
});

export {
  registerSchema,
  deleteUsersSchema,
  adminResetPasswordSchema,
  adminUpdateUserSchema,
  userIdParamsSchema,
};

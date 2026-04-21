import { z } from "zod";

const createVisitSchema = z.object({
  name: z.string().trim().min(1, "Visit name is required"),
});

const updateVisitSchema = z.object({
  name: z.string().trim().min(1, "Visit name cannot be empty").optional(),
  status: z.enum(["OPEN", "COMPLETED"]).optional(),
});

const visitParamsSchema = z.object({
  id: z.string().uuid("Invalid visit ID format"),
});

const addVisitItemSchema = z.object({
  bookId: z.string().uuid("Invalid book ID format"),
  notes: z.string().optional(),
});

const updateVisitItemSchema = z.object({
  notes: z.string().optional(),
  checked: z.boolean().optional(),
});

const visitItemParamsSchema = z.object({
  id: z.string().uuid("Invalid visit ID format"),
  itemId: z.string().uuid("Invalid item ID format"),
});

const deleteVisitItemsSchema = z.object({
  ids: z
    .array(z.string().uuid("One or more IDs have an invalid format"))
    .min(1, "You must select at least one item to delete"),
});

export {
  createVisitSchema,
  updateVisitSchema,
  visitParamsSchema,
  addVisitItemSchema,
  updateVisitItemSchema,
  visitItemParamsSchema,
  deleteVisitItemsSchema,
};

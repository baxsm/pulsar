import { z } from "zod";

export const categoryNameSchema = z
  .string()
  .min(1, "Name is required")
  .regex(
    /^[a-zA-Z0-9-]+$/,
    "Name can only contain letters, numbers or hyphens"
  );

export const createEventCategorySchema = z.object({
  name: categoryNameSchema,
  color: z
    .string()
    .min(1, "Color is required")
    .regex(/^#[0-9A-F]{6}$/i, "Invalid color format"),
  emoji: z.string().emoji("Invalid emoji").optional(),
});

export type CreateEventCategorySchemaType = z.infer<
  typeof createEventCategorySchema
>;

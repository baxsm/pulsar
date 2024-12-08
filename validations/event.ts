import { z } from "zod";
import { categoryNameSchema } from "./event-category";

export const eventRequestSchema = z
  .object({
    integration: z.enum(["discord_dm", "discord_channel", "slack"]),
    category: categoryNameSchema,
    fields: z.record(z.string().or(z.number()).or(z.boolean())).optional(),
    description: z.string().optional(),
  })
  .strict();

export const eventsByCategoryNameSchema = z.object({
  name: categoryNameSchema,
  page: z.number(),
  limit: z.number().max(50),
  timeRange: z.enum(["today", "week", "month"]),
});

export type EventsByCategoryNameSchemaType = z.infer<
  typeof eventsByCategoryNameSchema
>;

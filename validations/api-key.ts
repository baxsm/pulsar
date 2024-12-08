import { z } from "zod";

export const createApiKeySchema = z.object({
  title: z.string().min(5, "Title is too short").max(120, "Title is too long"),
});

export type CreateApiKeySchemaType = z.infer<typeof createApiKeySchema>;
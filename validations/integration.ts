import { z } from "zod";

export const discordDmFormSchema = z.object({
  userId: z.string(),
});

export type DiscordDmFormSchemaType = z.infer<typeof discordDmFormSchema>;

export const discordChannelFormSchema = z.object({
  channelId: z.string(),
});

export type DiscordChannelFormSchemaType = z.infer<typeof discordChannelFormSchema>;

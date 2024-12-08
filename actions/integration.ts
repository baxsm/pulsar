"use server";

import { IntegrationType } from "@prisma/client";
import { getDbUser } from "./auth";
import prisma from "@/lib/prisma";
import {
  discordChannelFormSchema,
  DiscordChannelFormSchemaType,
  discordDmFormSchema,
  DiscordDmFormSchemaType,
} from "@/validations/integration";
import { revalidatePath } from "next/cache";

export const getIntegrationByType = async (type: IntegrationType) => {
  const dbUser = await getDbUser();

  const integration = await prisma.integration.findUnique({
    where: {
      type_userId: {
        type: type,
        userId: dbUser.id,
      },
    },
  });

  return integration;
};

export const getIntegrationIsActiveByType = async (type: IntegrationType) => {
  const dbUser = await getDbUser();

  const integration = await prisma.integration.findUnique({
    where: {
      type_userId: {
        type: type,
        userId: dbUser.id,
      },
    },
    select: {
      isActive: true,
    },
  });

  return integration?.isActive;
};

export const toggleIntegrationIsActive = async (type: IntegrationType) => {
  const dbUser = await getDbUser();

  const apiKey = await prisma.integration.findUnique({
    where: {
      type_userId: {
        type: type,
        userId: dbUser.id,
      },
    },
    select: {
      id: true,
      isActive: true,
    },
  });

  if (!apiKey) {
    throw new Error("Integration not found");
  }

  await prisma.integration.update({
    where: {
      id: apiKey.id,
    },
    data: {
      isActive: !apiKey.isActive,
    },
  });
};

export const updateDiscordUserId = async (form: DiscordDmFormSchemaType) => {
  const { success, data } = discordDmFormSchema.safeParse(form);

  if (!success) {
    throw new Error("Invalid form data");
  }

  const dbUser = await getDbUser();

  await prisma.integration.upsert({
    where: {
      type_userId: {
        type: "DISCORD_DM",
        userId: dbUser.id,
      },
    },
    update: {
      token: data.userId,
    },
    create: {
      token: data.userId,
      type: "DISCORD_DM",
      userId: dbUser.id,
    },
  });

  revalidatePath("/dashboard/integrations");
};

export const updateDiscordChannelId = async (
  form: DiscordChannelFormSchemaType
) => {
  const { success, data } = discordChannelFormSchema.safeParse(form);

  if (!success) {
    throw new Error("Invalid form data");
  }

  const dbUser = await getDbUser();

  await prisma.integration.upsert({
    where: {
      type_userId: {
        type: "DISCORD_CHANNEL",
        userId: dbUser.id,
      },
    },
    update: {
      token: data.channelId,
    },
    create: {
      token: data.channelId,
      type: "DISCORD_CHANNEL",
      userId: dbUser.id,
    },
  });

  revalidatePath("/dashboard/integrations");
};

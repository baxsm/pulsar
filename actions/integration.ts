"use server";

import { IntegrationType } from "@prisma/client";
import { getDbUser } from "./auth";
import prisma from "@/lib/prisma";
import {
  discordChannelFormSchema,
  DiscordChannelFormSchemaType,
  discordDmFormSchema,
  DiscordDmFormSchemaType,
  slackChannelFormSchema,
  SlackChannelFormSchemaType,
} from "@/validations/integration";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import axios from "axios";

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

export const addSlackCode = async (code: string) => {
  const dbUser = await getDbUser();

  const slackUrl = "https://slack.com/api/oauth.v2.access";

  const details = {
    code: String(code),
    client_id: String(process.env.NEXT_PUBLIC_SLACK_CLIENT_ID),
    client_secret: String(process.env.SLACK_CLIENT_SECRET),
  };

  const formBody = Object.entries(details)
    .map(
      ([key, value]) =>
        `${encodeURIComponent(key)}=${encodeURIComponent(value)}`
    )
    .join("&");

  const headers = {
    "Content-Type": "application/x-www-form-urlencoded",
  };

  const config = {
    method: "POST",
    url: slackUrl,
    data: formBody,
    headers: headers,
  };

  const response = await axios(config);

  if (!response.data.ok || !response.data.access_token) {
    throw new Error("Invalid access token");
  }

  await prisma.integration.upsert({
    where: {
      type_userId: {
        type: "SLACK",
        userId: dbUser.id,
      },
    },
    update: {
      token: response.data.access_token,
    },
    create: {
      token: response.data.access_token,
      type: "SLACK",
      userId: dbUser.id,
    },
  });

  redirect("/dashboard/integrations");
};

export const isValidSlackToken = async (token: string | null | undefined) => {
  if (!token) {
    return false;
  }

  const response = await axios.post(
    "https://slack.com/api/auth.test",
    {
      token: token,
    },
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  );

  if (!response.data || response.data.ok === false) {
    return false;
  }

  return true;
};

export const removeSlackIntegration = async () => {
  const dbUser = await getDbUser();

  const integration = await prisma.integration.findUnique({
    where: {
      type_userId: {
        type: "SLACK",
        userId: dbUser.id,
      },
    },
  });

  if (!integration || !integration.token) {
    throw new Error("Integration not found");
  }

  const response = await axios.post(
    'https://slack.com/api/apps.uninstall',
    {
      token: integration.token,
      client_id: String(process.env.NEXT_PUBLIC_SLACK_CLIENT_ID),
      client_secret: String(process.env.SLACK_CLIENT_SECRET),
    },
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    },
  )

  if (!response.data.ok || response.data.ok === false) {
    throw new Error("Unable to uninstall application");
  }

  await prisma.integration.update({
    where: {
      id: integration.id,
    },
    data: {
      token: undefined,
      slackChannelId: undefined,
    },
  });

  revalidatePath("/dashboard/integrations");
};

export const updateSlackChannelId = async (
  form: SlackChannelFormSchemaType
) => {
  const { success, data } = slackChannelFormSchema.safeParse(form);

  if (!success) {
    throw new Error("Invalid form data");
  }

  const dbUser = await getDbUser();

  await prisma.integration.upsert({
    where: {
      type_userId: {
        type: "SLACK",
        userId: dbUser.id,
      },
    },
    update: {
      slackChannelId: data.channelId,
    },
    create: {
      slackChannelId: data.channelId,
      type: "SLACK",
      userId: dbUser.id,
    },
  });

  revalidatePath("/dashboard/integrations");
};

export const getSlackChannelList = async (token: string) => {
  const response = await axios.get("https://slack.com/api/conversations.list", {
    params: {
      types: "public_channel,private_channel",
    },
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response || response.data.ok === false) {
    throw new Error("Channels not found");
  }

  return response.data.channels;
};

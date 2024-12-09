import { NextRequest, NextResponse } from "next/server";
import { eventRequestSchema } from "@/validations/event";
import prisma from "@/lib/prisma";
import { hash } from "@/lib/encryption";
import { FREE_QUOTA, PRO_QUOTA } from "@/config";
import { DiscordClient } from "@/lib/discord-client";
import axios from "axios";

export const POST = async (req: NextRequest) => {
  const authHeader = req.headers.get("Authorization");

  if (!authHeader) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  if (!authHeader.startsWith("Bearer ")) {
    return NextResponse.json(
      { message: "Invalid auth header format. Expected 'Bearer <API_KEY>'" },
      { status: 401 }
    );
  }

  const apiKey = authHeader.split(" ")[1];

  if (!apiKey || apiKey.trim() === "") {
    return NextResponse.json({ message: "Invalid API key" }, { status: 401 });
  }

  const apiKeyPart = apiKey.split("pulsar_")[1];
  if (!apiKeyPart || apiKeyPart.trim() === "") {
    return NextResponse.json(
      { message: "Invalid API format. Expected 'pulsar_'" },
      { status: 401 }
    );
  }

  const encryptedKey = hash(apiKeyPart);

  const validApiKey = await prisma.apiKey.findUnique({
    where: {
      encryptedKey: encryptedKey,
    },
    include: {
      User: {
        include: {
          eventCategoryList: true,
        },
      },
    },
  });

  if (!validApiKey) {
    return NextResponse.json({ message: "Invalid API key" }, { status: 401 });
  }

  if (!validApiKey.isActive || !validApiKey.User) {
    return NextResponse.json(
      { message: "API key is not active" },
      { status: 401 }
    );
  }

  const currentDate = new Date();
  const currentMonth = currentDate.getMonth() + 1;
  const currentYear = currentDate.getFullYear();

  const quota = await prisma.quota.findUnique({
    where: {
      userId_year_month: {
        userId: validApiKey.User?.id,
        month: currentMonth,
        year: currentYear,
      },
    },
  });

  const quotaLimit =
    validApiKey.User.plan === "FREE"
      ? FREE_QUOTA.maxEventsPerMonth
      : PRO_QUOTA.maxEventsPerMonth;

  if (quota && quota.count >= quotaLimit) {
    return NextResponse.json(
      {
        message:
          "Monthly quota reached. Please upgrade your plan for more requests",
      },
      { status: 429 }
    );
  }

  let requestData: unknown;

  try {
    requestData = await req.json();
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Invalid JSON request body" },
      { status: 400 }
    );
  }

  const {
    success,
    data: eventRequestData,
    error,
  } = eventRequestSchema.safeParse(requestData);

  if (!success) {
    return NextResponse.json({ message: error.message }, { status: 400 });
  }

  const category = validApiKey.User?.eventCategoryList.find(
    (cat) => cat.name === eventRequestData.category
  );

  if (!category) {
    return NextResponse.json(
      { message: `Invalid category name ${eventRequestData.category}` },
      { status: 404 }
    );
  }

  const eventData = {
    title: `${category.emoji ?? "🔔"} ${
      category.name.charAt(0).toUpperCase() + category.name.slice(1)
    }`,
    description:
      eventRequestData.description ?? `A new ${category.name} has occurred`,
    color: category.color,
    timestamp: new Date().toISOString(),
    fields: Object.entries(eventRequestData.fields || {}).map(
      ([key, value]) => {
        return {
          name: key,
          value: String(value),
          inline: true,
        };
      }
    ),
  };

  const event = await prisma.event.create({
    data: {
      name: category.name,
      formattedMessage: `${eventData.title}\n\n${eventData.description}`,
      userId: validApiKey?.User?.id,
      fields: eventRequestData.fields || {},
      eventCategoryId: category.id,
    },
  });

  if (!event) {
    throw new Error("Failed to create event");
  }

  try {
    if (eventRequestData.integration === "discord_dm") {
      const discordIntegration = await prisma.integration.findUnique({
        where: {
          type_userId: {
            type: "DISCORD_DM",
            userId: validApiKey.User.id,
          },
        },
      });

      if (
        !discordIntegration ||
        !discordIntegration.isActive ||
        !discordIntegration.token
      ) {
        return NextResponse.json(
          { message: "Discord integration is not set up" },
          { status: 400 }
        );
      }

      const discord = new DiscordClient(process.env.DISCORD_BOT_TOKEN!);

      const dmChannel = await discord.createDM(discordIntegration.token);

      await discord.sendEmbed(dmChannel.id, eventData);
    } else if (eventRequestData.integration === "discord_channel") {
      const discordIntegration = await prisma.integration.findUnique({
        where: {
          type_userId: {
            type: "DISCORD_CHANNEL",
            userId: validApiKey.User.id,
          },
        },
      });

      if (
        !discordIntegration ||
        !discordIntegration.isActive ||
        !discordIntegration.token
      ) {
        return NextResponse.json(
          { message: "Discord integration is not set up" },
          { status: 400 }
        );
      }

      const discord = new DiscordClient(process.env.DISCORD_BOT_TOKEN!);

      await discord.sendEmbed(discordIntegration.token, eventData);
    } else if (eventRequestData.integration === "slack") {
      const slackIntegration = await prisma.integration.findUnique({
        where: {
          type_userId: {
            type: "SLACK",
            userId: validApiKey.User.id,
          },
        },
      });

      if (
        !slackIntegration ||
        !slackIntegration.isActive ||
        !slackIntegration.token ||
        !slackIntegration.slackChannelId
      ) {
        return NextResponse.json(
          { message: "Slack integration is not set up" },
          { status: 400 }
        );
      }

      const formattedMarkdownMessage = `
*${eventData.title}*

${eventData.description}

*Fields:*
${eventData.fields
  .map((field) => `- *${field.name}:* ${field.value}`)
  .join("\n")}

*Timestamp:* ${eventData.timestamp}
`;

      const response = await axios.post(
        "https://slack.com/api/chat.postMessage",
        {
          channel: slackIntegration.slackChannelId,
          text: formattedMarkdownMessage,
        },
        {
          headers: {
            Authorization: `Bearer ${slackIntegration.token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.data || !response.data.ok) {
        throw new Error("Unable to send message to slack channel");
      }
    }

    await prisma.event.update({
      where: {
        id: event.id,
      },
      data: {
        status: "DELIVERED",
      },
    });

    await prisma.quota.upsert({
      create: {
        userId: validApiKey.User.id,
        month: currentMonth,
        year: currentYear,
        count: 1,
      },
      update: {
        count: {
          increment: 1,
        },
      },
      where: {
        userId_year_month: {
          userId: validApiKey.User.id,
          month: currentMonth,
          year: currentYear,
        },
      },
    });
  } catch (error) {
    await prisma.event.update({
      where: {
        id: event.id,
      },
      data: {
        status: "FAILED",
      },
    });

    console.error(error);

    return NextResponse.json(
      { message: "Error processing event", eventId: event.id },
      { status: 500 }
    );
  }

  return NextResponse.json(
    { message: "Event processed successfully", eventId: event.id },
    { status: 200 }
  );
};

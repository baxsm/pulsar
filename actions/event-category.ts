"use server";

import prisma from "@/lib/prisma";
import { parseColorToInt } from "@/lib/utils";
import {
  createEventCategorySchema,
  CreateEventCategorySchemaType,
} from "@/validations/event-category";
import { getDbUser } from "./auth";
import { startOfDay, startOfMonth, startOfWeek } from "date-fns";
import {
  eventsByCategoryNameSchema,
  EventsByCategoryNameSchemaType,
} from "@/validations/event";

export const createEventCategory = async (
  form: CreateEventCategorySchemaType
) => {
  const { success, data } = createEventCategorySchema.safeParse(form);

  if (!success) {
    throw new Error("Invalid form data");
  }

  const dbUser = await getDbUser();

  const parsedColor = parseColorToInt(data.color);

  const eventCategory = await prisma.eventCategory.create({
    data: {
      name: data.name.toLocaleLowerCase(),
      color: parsedColor,
      emoji: data.emoji,
      userId: dbUser.id,
    },
  });

  if (!eventCategory) {
    throw new Error("Error while creating event category");
  }

  return eventCategory.name;
};

export const getAllEventCategories = async () => {
  const dbUser = await getDbUser();

  const categories = await prisma.eventCategory.findMany({
    where: {
      userId: dbUser.id,
    },
    select: {
      id: true,
      name: true,
      color: true,
      emoji: true,
      createdAt: true,
      updatedAt: true,
    },
    orderBy: {
      updatedAt: "desc",
    },
  });

  const categoriesWithCounts = await Promise.all(
    categories.map(async (category) => {
      const now = new Date();
      const firstDayOfMonth = startOfMonth(now);

      const events = await prisma.event.findMany({
        where: {
          eventCategoryId: category.id,
          createdAt: {
            gte: firstDayOfMonth,
          },
        },
        select: {
          fields: true,
        },
        distinct: ["fields"],
      });

      const fieldNames = new Set<string>();

      events.forEach((event) => {
        Object.keys(event.fields as object).forEach((fieldName) =>
          fieldNames.add(fieldName)
        );
      });

      const uniqueFieldsCount = fieldNames.size;

      const eventsCount = await prisma.event.count({
        where: {
          eventCategoryId: category.id,
          createdAt: {
            gte: firstDayOfMonth,
          },
        },
      });

      const lastPing = await prisma.event.findFirst({
        where: {
          eventCategoryId: category.id,
        },
        orderBy: {
          createdAt: "desc",
        },
        select: {
          createdAt: true,
        },
      });

      return {
        ...category,
        uniqueFieldsCount,
        eventsCount,
        lastPing: lastPing?.createdAt || null, // Handle null case gracefully
      };
    })
  );

  return categoriesWithCounts;
};

export const deleteEventCategory = async (name: string) => {
  const dbUser = await getDbUser();

  const eventCategory = await prisma.eventCategory.findUnique({
    where: {
      name_userId: {
        name: name,
        userId: dbUser.id,
      },
    },
  });

  if (!eventCategory) {
    throw new Error("Event category not found");
  }

  await prisma.eventCategory.delete({
    where: {
      id: eventCategory.id,
    },
  });
};

export const getEventCategoryByName = async (name: string) => {
  const dbUser = await getDbUser();

  const category = await prisma.eventCategory.findUnique({
    where: {
      name_userId: {
        name: name,
        userId: dbUser.id,
      },
    },
    include: {
      _count: {
        select: {
          eventList: true,
        },
      },
    },
  });

  return category;
};

export const getEventsByCategoryName = async (
  form: EventsByCategoryNameSchemaType
) => {
  const { success, data } = eventsByCategoryNameSchema.safeParse(form);

  if (!success) {
    throw new Error("Invalid form data");
  }

  const dbUser = await getDbUser();

  const now = new Date();
  let startDate: Date;

  switch (data.timeRange) {
    case "today":
      startDate = startOfDay(now);
      break;
    case "week":
      startDate = startOfWeek(now, { weekStartsOn: 0 });
      break;
    case "month":
      startDate = startOfMonth(now);
      break;
  }

  const events = await prisma.event.findMany({
    where: {
      EventCategory: {
        name: data.name,
        userId: dbUser.id,
      },
      createdAt: {
        gte: startDate,
      },
    },
    skip: (data.page - 1) * data.limit,
    take: data.limit,
    orderBy: {
      createdAt: "desc",
    },
  });

  const totalEventsCount = await prisma.event.count({
    where: {
      EventCategory: {
        name: data.name,
        userId: dbUser.id,
      },
      createdAt: {
        gte: startDate,
      },
    },
  });

  const eventFields = await prisma.event.findMany({
    where: {
      EventCategory: {
        name: data.name,
        userId: dbUser.id,
      },
      createdAt: {
        gte: startDate,
      },
    },
    select: {
      fields: true,
    },
  });

  const fieldNames = new Set<string>();

  eventFields.forEach((event) => {
    Object.keys(event.fields as object).forEach((fieldName) =>
      fieldNames.add(fieldName)
    );
  });

  const uniqueFieldsCount = fieldNames.size;

  return {
    events,
    totalEventsCount,
    uniqueFieldsCount,
  };
};

export const pollCategory = async (name: string) => {
  const dbUser = await getDbUser();

  const eventCategory = await prisma.eventCategory.findUnique({
    where: {
      name_userId: {
        name: name,
        userId: dbUser.id,
      },
    },
    include: {
      _count: {
        select: {
          eventList: true,
        },
      },
    },
  });

  if (!eventCategory) {
    throw new Error("Event category not found");
  }

  const hasEvents = eventCategory._count.eventList > 0;

  return {
    hasEvents,
  };
};

"use server";

import prisma from "@/lib/prisma";
import { periodToDateRange } from "@/lib/utils";
import { Period } from "@/types/analytics";
import { auth } from "@clerk/nextjs/server";
import { eachDayOfInterval, format } from "date-fns";
import { getDbUser } from "./auth";

export const getDashboardCardsData = async () => {
  const user = await auth();

  if (!user || !user.userId) {
    throw new Error("Unauthorized");
  }

  const dbUser = await prisma.user.findUnique({
    where: {
      clerkId: user.userId,
    },
  });

  if (!dbUser) {
    throw new Error("User not found");
  }

  const apiKeyList = await prisma.apiKey.findMany({
    where: {
      userId: dbUser.id,
    },
    select: {
      isActive: true,
    },
  });

  const totalEventCategory = await prisma.eventCategory.count({
    where: {
      userId: dbUser.id,
    },
  });

  const totalEvents = await prisma.event.count({
    where: {
      userId: dbUser.id,
    },
  });

  return {
    apiKey: {
      total: apiKeyList.length,
      active: apiKeyList.filter((e) => e.isActive).length,
    },
    totalEventCategory,
    totalEvents,
  };
};

export const getPeriods = async () => {
  const dbUser = await getDbUser();

  const years = await prisma.event.aggregate({
    where: {
      userId: dbUser.id,
    },
    _min: { createdAt: true },
  });

  const currentYear = new Date().getFullYear();

  const minYear = years._min.createdAt
    ? years._min.createdAt.getFullYear()
    : currentYear;

  const periods: Period[] = [];

  for (let year = minYear; year <= currentYear; year++) {
    for (let month = 0; month <= 11; month++) {
      periods.push({ year, month });
    }
  }

  return periods;
};

export const getEventsStats = async (selectedPeriod: Period) => {
  const dbUser = await getDbUser();

  const dateRange = periodToDateRange(selectedPeriod);
  const dateFormat = "yyyy-MM-dd";

  const stats: Record<string, { success: number; failed: number }> =
    eachDayOfInterval({
      start: dateRange.startDate,
      end: dateRange.endDate,
    })
      .map((date) => format(date, dateFormat))
      .reduce((acc, date) => {
        acc[date] = {
          success: 0,
          failed: 0,
        };
        return acc;
      }, {} as Record<string, { success: number; failed: number }>);

  const scriptList = await prisma.event.findMany({
    where: {
      userId: dbUser.id,
      createdAt: {
        gte: dateRange.startDate,
        lte: dateRange.endDate,
      },
    },
  });

  scriptList.forEach((script) => {
    const date = format(script.createdAt, dateFormat);

    if (script.status === "DELIVERED") {
      stats[date].success += 1;
    }
    if (script.status === "FAILED") {
      stats[date].failed += 1;
    }
  });

  const result = Object.entries(stats).map(([date, info]) => ({
    date,
    ...info,
  }));

  return result;
};

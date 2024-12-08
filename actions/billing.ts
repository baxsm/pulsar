"use server";

import { createStripeCheckoutSession } from "@/lib/stripe";
import { getDbUser } from "./auth";
import { addMonths, startOfMonth } from "date-fns";
import prisma from "@/lib/prisma";
import { FREE_QUOTA, PRO_QUOTA } from "@/config";

export const getUserPlan = async () => {
  const dbUser = await getDbUser();

  return dbUser.plan;
};

export const createCheckoutSession = async () => {
  const dbUser = await getDbUser();

  const session = await createStripeCheckoutSession({
    userEmail: dbUser.email,
    userId: dbUser.id,
  });

  return session.url;
};

export const getUsage = async () => {
  const dbUser = await getDbUser();

  if (!dbUser) {
    throw new Error("User not found");
  }

  const now = new Date();
  const currentDate = startOfMonth(now);
  const currentMonth = currentDate.getMonth() + 1;
  const currentYear = currentDate.getFullYear();

  const quota = await prisma.quota.findUnique({
    where: {
      userId_year_month: {
        userId: dbUser.id,
        month: currentMonth,
        year: currentYear,
      },
    },
  });
  
  const quotaCount = quota?.count ?? 0;

  const eventCategoryCount = await prisma.eventCategory.count({
    where: {
      userId: dbUser.id,
    },
  });

  const limits = dbUser.plan === "PRO" ? PRO_QUOTA : FREE_QUOTA;

  const resetDate = addMonths(currentDate, 1);

  return {
    categoryUsed: eventCategoryCount,
    categoryLimit: limits.maxEventCategories,
    eventsUsed: quotaCount,
    eventsLimit: limits.maxEventsPerMonth,
    resetDate,
  };
};

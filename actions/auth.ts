"use server";

import prisma from "@/lib/prisma";
import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { cache } from "react";

export const syncUser = async () => {
  const user = await currentUser();

  if (!user) {
    redirect("/sign-in");
  }

  const dbUser = await prisma.user.findFirst({
    where: {
      clerkId: user.id,
    },
  });

  if (!dbUser) {
    await prisma.user.create({
      data: {
        clerkId: user.id,
        quotaLimit: 100,
        email: user.emailAddresses[0].emailAddress,
        integrationList: {
          createMany: {
            data: [
              {
                type: "DISCORD_DM",
              },
              {
                type: "DISCORD_CHANNEL",
              },
              {
                type: "SLACK",
              },
            ],
          },
        },
      },
    });
  }

  return {
    isSynced: true,
  };
};

export const getDbUser = cache(async () => {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  const dbUser = await prisma.user.findFirst({
    where: {
      clerkId: userId,
    },
  });

  if (!dbUser) {
    throw new Error("User not found");
  }

  return dbUser;
});

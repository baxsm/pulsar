"use server";

import {
  createApiKeySchema,
  CreateApiKeySchemaType,
} from "@/validations/api-key";
import { getDbUser } from "./auth";
import { init } from "@paralleldrive/cuid2";
import { hash } from "@/lib/encryption";
import prisma from "@/lib/prisma";
import { generateApiIdentifier } from "@/lib/name";

export const createApiKey = async (form: CreateApiKeySchemaType) => {
  const { success, data } = createApiKeySchema.safeParse(form);

  if (!success) {
    throw new Error("Invalid form data");
  }

  const dbUser = await getDbUser();

  const identifier = generateApiIdentifier();

  const apiCuid = init({
    random: Math.random,
    length: 19,
    fingerprint: "",
  })();

  const encryptedCuid = hash(apiCuid);

  await prisma.apiKey.create({
    data: {
      userId: dbUser.id,
      encryptedKey: encryptedCuid,
      identifier: identifier,
      title: data.title,
    },
  });

  return `pulsar_${apiCuid}`;
};

export const getAllApiKeys = async () => {
  const dbUser = await getDbUser();

  const apiKeyList = await prisma.apiKey.findMany({
    where: {
      userId: dbUser.id,
    },
    select: {
      identifier: true,
      isActive: true,
      title: true,
      createdAt: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return apiKeyList;
};

export const getApiKeyIsActiveByIdentifier = async (identifier: string) => {
  const dbUser = await getDbUser();

  const apiKey = await prisma.apiKey.findUnique({
    where: {
      identifier_userId: {
        identifier: identifier,
        userId: dbUser.id,
      },
    },
  });

  if (!apiKey) {
    throw new Error("API key not found");
  }

  return apiKey?.isActive;
};

export const toggleApiKeyIsActive = async (identifier: string) => {
  const dbUser = await getDbUser();

  const apiKey = await prisma.apiKey.findUnique({
    where: {
      identifier_userId: {
        identifier: identifier,
        userId: dbUser.id,
      },
    },
    select: {
      id: true,
      isActive: true,
    },
  });

  if (!apiKey) {
    throw new Error("API key not found");
  }

  await prisma.apiKey.update({
    where: {
      id: apiKey.id,
    },
    data: {
      isActive: !apiKey.isActive,
    },
  });
};

export const deleteApiKey = async (identifier: string) => {
  const dbUser = await getDbUser();

  const apiKey = await prisma.apiKey.findUnique({
    where: {
      identifier_userId: {
        identifier: identifier,
        userId: dbUser.id,
      },
    },
    select: {
      id: true,
    },
  });

  if (!apiKey) {
    throw new Error("API key not found");
  }

  await prisma.apiKey.delete({
    where: {
      id: apiKey.id,
    },
  });
};

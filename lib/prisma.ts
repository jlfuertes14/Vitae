import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const encodeCredential = (value: string) => {
  try {
    return encodeURIComponent(decodeURIComponent(value));
  } catch {
    return encodeURIComponent(value);
  }
};

const normalizeDatabaseUrl = (value: string) => {
  try {
    return new URL(value).toString();
  } catch {
    const protocolIndex = value.indexOf("://");
    if (protocolIndex === -1) {
      return value;
    }

    const protocol = value.slice(0, protocolIndex + 3);
    const remainder = value.slice(protocolIndex + 3);
    const atIndex = remainder.lastIndexOf("@");

    if (atIndex === -1) {
      return value;
    }

    const credentials = remainder.slice(0, atIndex);
    const hostAndPath = remainder.slice(atIndex + 1);
    const separatorIndex = credentials.indexOf(":");

    if (separatorIndex === -1) {
      return value;
    }

    const username = credentials.slice(0, separatorIndex);
    const password = credentials.slice(separatorIndex + 1);

    return `${protocol}${encodeCredential(username)}:${encodeCredential(password)}@${hostAndPath}`;
  }
};

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL is not set.");
}

const adapter = new PrismaPg({
  connectionString: normalizeDatabaseUrl(databaseUrl),
});

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

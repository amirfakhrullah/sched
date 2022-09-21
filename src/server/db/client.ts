// src/server/db/client.ts
import { PrismaClient } from "@prisma/client";

// comment line below if want to run ts-node script
import { env } from "../../env/server.mjs";

// Uncomment line below if want to run ts-node script
// const env = process.env;

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

export const prisma =
  global.prisma ||
  new PrismaClient({
    log:
      env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });

if (env.NODE_ENV !== "production") {
  global.prisma = prisma;
}

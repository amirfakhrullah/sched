import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const ephemeralCache = new Map();

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.fixedWindow(20, "10 s"),
  ephemeralCache,
});

export const setupProdRateLimiter = async (ip: string) =>
  process.env.NODE_ENV === "production"
    ? await ratelimit.limit(`mw_${ip}`)
    : undefined;

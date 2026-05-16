import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

// Create a new ratelimiter, that allows 10 requests per 1 minute
// Default is a sliding window algorithm
export const aiRateLimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, "1 m"),
  analytics: true,
});

export const exportRateLimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(5, "1 m"),
  analytics: true,
});

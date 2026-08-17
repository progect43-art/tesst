import { TRPCError } from "@trpc/server";

type Window = { startedAt: number; count: number };

type RateLimiterOptions = {
  windowMs: number;
  maxRequests: number;
  now?: () => number;
};

export function createRateLimiter(options: RateLimiterOptions) {
  const windows = new Map<string, Window>();
  const now = options.now ?? (() => Date.now());

  return {
    check(key: string) {
      const currentTime = now();
      const existing = windows.get(key);
      const current = !existing || currentTime - existing.startedAt >= options.windowMs
        ? { startedAt: currentTime, count: 0 }
        : existing;

      if (current.count >= options.maxRequests) {
        throw new TRPCError({
          code: "TOO_MANY_REQUESTS",
          message: "Too many lookup attempts. Please try again later.",
        });
      }

      current.count += 1;
      windows.set(key, current);
    },
    reset() {
      windows.clear();
    },
  };
}

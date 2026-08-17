import { describe, expect, it } from "vitest";
import { createRateLimiter } from "./security/rateLimit";

describe("createRateLimiter", () => {
  it("rejects requests beyond the configured window", () => {
    let time = 0;
    const limiter = createRateLimiter({ windowMs: 1_000, maxRequests: 2, now: () => time });

    limiter.check("client-a");
    limiter.check("client-a");
    expect(() => limiter.check("client-a")).toThrow(/Too many lookup attempts/);

    time = 1_000;
    expect(() => limiter.check("client-a")).not.toThrow();
  });

  it("keeps clients isolated", () => {
    const limiter = createRateLimiter({ windowMs: 1_000, maxRequests: 1, now: () => 0 });

    limiter.check("client-a");
    expect(() => limiter.check("client-b")).not.toThrow();
  });
});

import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

function createPublicContext(): TrpcContext {
  return {
    user: null,
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

describe("discounts.management", () => {
  it("returns the Shopify discounts destination without ZON Store login in test mode", async () => {
    const originalDomain = process.env.SHOPIFY_STORE_DOMAIN;
    process.env.SHOPIFY_STORE_DOMAIN = "zonstore.example.myshopify.com";

    try {
      const caller = appRouter.createCaller(createPublicContext());
      const result = await caller.discounts.management();

      expect(result).toMatchObject({
        storeConfigured: true,
        managementUrl: "https://zonstore.example.myshopify.com/admin/discounts",
      });
    } finally {
      if (originalDomain === undefined) delete process.env.SHOPIFY_STORE_DOMAIN;
      else process.env.SHOPIFY_STORE_DOMAIN = originalDomain;
    }
  });

  it("returns an unconfigured response instead of failing for a public visitor", async () => {
    const originalDomain = process.env.SHOPIFY_STORE_DOMAIN;
    delete process.env.SHOPIFY_STORE_DOMAIN;

    try {
      const caller = appRouter.createCaller(createPublicContext());
      await expect(caller.discounts.management()).resolves.toMatchObject({
        storeConfigured: false,
        managementUrl: null,
      });
    } finally {
      if (originalDomain !== undefined) process.env.SHOPIFY_STORE_DOMAIN = originalDomain;
    }
  });
});

import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("./db", () => ({
  findOrderTracking: vi.fn(),
  upsertOrderTracking: vi.fn(),
}));

import { appRouter } from "./routers";
import { findOrderTracking, upsertOrderTracking } from "./db";
import type { TrpcContext } from "./_core/context";

function createContext(user: TrpcContext["user"] = null): TrpcContext {
  return {
    user,
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

beforeEach(() => {
  vi.clearAllMocks();
});

describe("orders tracking", () => {
  it("rejects invalid customer email input", async () => {
    const caller = appRouter.createCaller(createContext());
    await expect(caller.orders.lookup({ orderNumber: "ZON-1001", customerEmail: "not-an-email" })).rejects.toThrow();
  });

  it("returns a matched order status without exposing unrelated records", async () => {
    vi.mocked(findOrderTracking).mockResolvedValue({
      id: 1,
      orderNumber: "ZON-1001",
      status: "shipped",
      customerEmail: "customer@example.com",
      trackingUrl: "https://carrier.example/track/ZON-1001",
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    const caller = appRouter.createCaller(createContext());
    const result = await caller.orders.lookup({ orderNumber: "zon-1001", customerEmail: "CUSTOMER@example.com" });
    expect(result).toMatchObject({ orderNumber: "ZON-1001", status: "shipped", trackingUrl: "https://carrier.example/track/ZON-1001" });
    expect(findOrderTracking).toHaveBeenCalledWith({ orderNumber: "ZON-1001", customerEmail: "customer@example.com" });
  });

  it("protects order status updates from public users", async () => {
    const caller = appRouter.createCaller(createContext());
    await expect(caller.orders.updateStatus({ orderNumber: "ZON-1001", status: "processing" })).rejects.toMatchObject({ code: "FORBIDDEN" });
  });

  it("allows admins to update a tracking record", async () => {
    vi.mocked(upsertOrderTracking).mockResolvedValue({
      id: 1,
      orderNumber: "ZON-1001",
      status: "processing",
      customerEmail: "customer@example.com",
      trackingUrl: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    const admin = { id: 1, openId: "admin", email: "admin@example.com", name: "Admin", loginMethod: "manus", role: "admin" as const, createdAt: new Date(), updatedAt: new Date(), lastSignedIn: new Date() };
    const caller = appRouter.createCaller(createContext(admin));
    const result = await caller.orders.updateStatus({ orderNumber: "zon-1001", customerEmail: "CUSTOMER@example.com", status: "processing" });
    expect(result?.orderNumber).toBe("ZON-1001");
    expect(upsertOrderTracking).toHaveBeenCalledWith(expect.objectContaining({ orderNumber: "ZON-1001", customerEmail: "customer@example.com", status: "processing" }));
  });
});

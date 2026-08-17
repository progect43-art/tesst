import { z } from "zod";
import { findOrderTracking, upsertOrderTracking } from "../db";
import { adminProcedure, publicProcedure, router } from "../_core/trpc";
import { createRateLimiter } from "../security/rateLimit";

const orderStatus = z.enum(["pending", "processing", "shipped", "delivered", "cancelled"]);

const lookupLimiter = createRateLimiter({ windowMs: 60_000, maxRequests: 20 });

function requestKey(req: { ip?: string; headers: Record<string, unknown> }) {
  const forwarded = req.headers["x-forwarded-for"];
  const forwardedIp = Array.isArray(forwarded) ? forwarded[0] : typeof forwarded === "string" ? forwarded.split(",")[0]?.trim() : undefined;
  return forwardedIp || req.ip || "unknown-client";
}

export const ordersRouter = router({
  lookup: publicProcedure
    .input(z.object({
      orderNumber: z.string().trim().min(2).max(64),
      customerEmail: z.string().trim().email(),
    }))
    .query(async ({ ctx, input }) => {
      lookupLimiter.check(requestKey(ctx.req));
      const order = await findOrderTracking({
        orderNumber: input.orderNumber.toUpperCase(),
        customerEmail: input.customerEmail.toLowerCase(),
      });
      if (!order) return null;
      return {
        orderNumber: order.orderNumber,
        status: order.status,
        trackingUrl: order.trackingUrl,
        createdAt: order.createdAt,
        updatedAt: order.updatedAt,
      };
    }),

  updateStatus: adminProcedure
    .input(z.object({
      orderNumber: z.string().trim().min(2).max(64),
      status: orderStatus,
      customerEmail: z.string().trim().email().optional(),
      trackingUrl: z.string().url().optional(),
    }))
    .mutation(({ input }) => upsertOrderTracking({
      orderNumber: input.orderNumber.toUpperCase(),
      status: input.status,
      customerEmail: input.customerEmail?.toLowerCase(),
      trackingUrl: input.trackingUrl,
    })),
});

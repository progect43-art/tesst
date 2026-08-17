import { publicProcedure, router } from "../_core/trpc";

function getShopifyDiscountManagementUrl(): string | null {
  const domain = process.env.SHOPIFY_STORE_DOMAIN?.trim();
  if (!domain) return null;
  return `https://${domain}/admin/discounts`;
}

/**
 * This router deliberately contains no Shopify Admin API token or write call.
 * The configured storefront integration keeps administrative Shopify privileges
 * outside the deployed app. Test visitors can view the destination, but only
 * Shopify-authorized staff can manage codes after Shopify authentication.
 */
export const discountsRouter = router({
  management: publicProcedure.query(() => {
    const managementUrl = getShopifyDiscountManagementUrl();

    return {
      storeConfigured: Boolean(managementUrl),
      managementUrl,
      checkoutGuidance:
        "ينشئ الأدمن كود الخصم من Shopify، ثم يدخله العميل في خانة Discount code داخل صفحة الدفع الآمنة من Shopify.",
    };
  }),
});

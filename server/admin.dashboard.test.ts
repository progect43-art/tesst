import { describe, expect, it } from "vitest";
import { getAdminCatalogSummary } from "../client/src/pages/AdminDashboard";

const product = (title: string, type: string, price: string) => ({
  id: title,
  handle: title.toLowerCase().replaceAll(" ", "-"),
  title,
  description: "",
  descriptionHtml: "",
  productType: type,
  vendor: "ZON Store",
  tags: [],
  images: [],
  priceRange: {
    min: { amount: price, currencyCode: "EGP" },
    max: { amount: price, currencyCode: "EGP" },
  },
  options: [],
  variants: [],
});

describe("admin dashboard catalog summary", () => {
  it("summarizes catalog cards accurately", () => {
    const summary = getAdminCatalogSummary([
      product("COMMUNITY", "T-Shirt", "500.00"),
      product("After Hours", "Hoodie", "1450.00"),
    ]);

    expect(summary).toEqual({ totalProducts: 2, tShirts: 1, averagePrice: 975 });
  });

  it("returns empty safe values", () => {
    expect(getAdminCatalogSummary([])).toEqual({ totalProducts: 0, tShirts: 0, averagePrice: 0 });
  });
});

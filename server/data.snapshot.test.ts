import { describe, expect, it } from "vitest";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

type Snapshot = {
  project: { containsSecrets: boolean; containsCustomerPersonalData: boolean };
  shopify: { catalog: Array<{ title: string; price: string; sizes?: string[] }> };
  database: { declaredTables: Array<{ name: string; exportPolicy: string }> };
  securityPolicy: { neverExport: string[] };
};

const snapshotPath = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../exports/zon-store-sanitized-snapshot.json",
);

async function loadSnapshot(): Promise<Snapshot> {
  return JSON.parse(await readFile(snapshotPath, "utf8")) as Snapshot;
}

describe("sanitized data snapshot", () => {
  it("declares that secrets and customer personal data are excluded", async () => {
    const snapshot = await loadSnapshot();

    expect(snapshot.project.containsSecrets).toBe(false);
    expect(snapshot.project.containsCustomerPersonalData).toBe(false);
    expect(snapshot.securityPolicy.neverExport).toEqual(
      expect.arrayContaining(["JWT_SECRET", "DATABASE_URL", "customer emails"]),
    );
  });

  it("contains the latest catalog products without raw database rows", async () => {
    const snapshot = await loadSnapshot();
    const community = snapshot.shopify.catalog.find(product => product.title === "COMMUNITY");

    expect(community).toMatchObject({
      title: "COMMUNITY",
      price: "500.00 EGP",
      sizes: ["Medium", "Large", "X-Large", "XX-Large"],
    });
    expect(snapshot.database.declaredTables.map(table => table.name)).toEqual(
      expect.arrayContaining(["users", "order_tracking"]),
    );
    expect(snapshot.database.declaredTables.every(table => table.exportPolicy.includes("never") || table.exportPolicy.includes("metadata"))).toBe(true);
  });
});

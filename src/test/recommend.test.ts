import { describe, expect, it } from "vitest";
import { recommend } from "@/lib/recommend";

const cart = [
  { productId: "arroz", qty: 1 },
  { productId: "feijao", qty: 2 },
];

describe("recommend", () => {
  it("with 1 market picks the cheapest single market (Max)", () => {
    const r = recommend(cart, 1);
    expect(r.plans.map((p) => p.marketId)).toEqual(["max"]);
    expect(r.total).toBeCloseTo(23.5 + 2 * 7.99, 2);
  });

  it("savings compare against the most expensive market (Taquaral)", () => {
    const r = recommend(cart, 1);
    expect(r.worstMarketId).toBe("taquaral");
    expect(r.savings).toBeCloseTo(27.9 + 18.4 - (23.5 + 15.98), 2);
  });

  it("never uses more markets than the limit", () => {
    expect(recommend(cart, 2).plans.length).toBeLessThanOrEqual(2);
  });
});

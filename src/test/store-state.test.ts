import { describe, expect, it } from "vitest";
import { initialState, parseStoredState } from "@/lib/store-state";

describe("saved device state", () => {
  it("restores a valid cart and its visit limit", () => {
    const state = parseStoredState(JSON.stringify({ cart: [{ productId: "arroz", qty: 2 }], limit: 1 }));
    expect(state.cart).toEqual([{ productId: "arroz", qty: 2 }]);
    expect(state.limit).toBe(1);
  });
  it("recovers from malformed JSON", () => {
    expect(parseStoredState("{")).toEqual(initialState);
  });
  it("discards obsolete product IDs without losing valid preferences", () => {
    const state = parseStoredState(JSON.stringify({ cart: [{ productId: "obsolete", qty: 1 }], neighborhood: "Centro" }));
    expect(state.cart).toEqual([]);
    expect(state.neighborhood).toBe("Centro");
  });
  it("contains invalid quantities and history shapes", () => {
    const state = parseStoredState(JSON.stringify({ cart: [{ productId: "arroz", qty: -1 }], history: "invalid", limit: 9 }));
    expect(state.cart).toEqual([]);
    expect(state.history).toEqual([]);
    expect(state.limit).toBe(2);
  });
});
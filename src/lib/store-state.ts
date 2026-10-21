import { z } from "zod";
import { productById } from "./data";
import type { AppState } from "./store";

export const initialState: AppState = {
  onboarded: false,
  cart: [],
  limit: 2,
  neighborhood: "Jardim Nova América",
  defaultLimit: 2,
  history: [],
};

const limitSchema = z.union([z.literal(1), z.literal(2), z.literal(3), z.null()]);
const cartSchema = z.array(z.object({
  productId: z.string().refine((id) => Boolean(productById(id))),
  qty: z.number().finite().positive(),
}));
const historySchema = z.array(z.object({
  id: z.string(),
  date: z.string().datetime(),
  cart: cartSchema,
  limit: limitSchema,
  marketIds: z.array(z.string()),
  total: z.number().finite().nonnegative(),
  savings: z.number().finite().nonnegative(),
}));
const stateSchema = z.object({
  onboarded: z.boolean().catch(false),
  cart: cartSchema.catch([]),
  limit: limitSchema.catch(2),
  neighborhood: z.string().catch(initialState.neighborhood),
  defaultLimit: limitSchema.catch(2),
  history: historySchema.catch([]),
});

export function parseStoredState(raw: string | null): AppState {
  try {
    return stateSchema.parse(raw ? JSON.parse(raw) : {});
  } catch {
    return { ...initialState, cart: [], history: [] };
  }
}
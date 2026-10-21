import { useSyncExternalStore } from "react";
import type { CartItem, MarketLimit } from "./recommend";
import { initialState, parseStoredState } from "./store-state";

export interface HistoryEntry {
  id: string;
  date: string;
  cart: CartItem[];
  limit: MarketLimit;
  marketIds: string[];
  total: number;
  savings: number;
}

export interface AppState {
  onboarded: boolean;
  cart: CartItem[];
  limit: MarketLimit;
  neighborhood: string;
  defaultLimit: MarketLimit;
  history: HistoryEntry[];
}

const KEY = "compara-mercado:v1";
const initial = initialState;

let state: AppState = initial;
let loaded = false;
const listeners = new Set<() => void>();

function load() {
  if (loaded || typeof window === "undefined") return;
  loaded = true;
  try {
    state = parseStoredState(localStorage.getItem(KEY));
  } catch {
    /* ignore */
  }
}

export function setState(fn: (s: AppState) => AppState) {
  load();
  state = fn(state);
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    // Keep the current session usable when browser storage is unavailable.
  }
  listeners.forEach((l) => l());
}

export function useApp(): AppState & { hydrated: boolean } {
  const s = useSyncExternalStore(
    (l) => {
      listeners.add(l);
      return () => listeners.delete(l);
    },
    () => {
      load();
      return state;
    },
    () => initial,
  );
  const hydrated = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
  return { ...s, hydrated };
}

export const actions = {
  addItem(productId: string, qty: number) {
    setState((s) => {
      const ex = s.cart.find((c) => c.productId === productId);
      const cart = ex
        ? s.cart.map((c) => (c.productId === productId ? { ...c, qty: c.qty + qty } : c))
        : [...s.cart, { productId, qty }];
      return { ...s, cart };
    });
  },
  setQty(productId: string, qty: number) {
    setState((s) => ({
      ...s,
      cart: s.cart.map((c) => (c.productId === productId ? { ...c, qty: Math.max(1, qty) } : c)),
    }));
  },
  remove(productId: string) {
    setState((s) => ({ ...s, cart: s.cart.filter((c) => c.productId !== productId) }));
  },
  clearCart() {
    setState((s) => ({ ...s, cart: [] }));
  },
  setLimit(limit: MarketLimit) {
    setState((s) => ({ ...s, limit }));
  },
  finishOnboarding() {
    setState((s) => ({ ...s, onboarded: true }));
  },
  saveProfile(neighborhood: string, defaultLimit: MarketLimit) {
    setState((s) => ({ ...s, neighborhood, defaultLimit, limit: defaultLimit }));
  },
  saveToHistory(entry: Omit<HistoryEntry, "id" | "date">) {
    const id = Math.random().toString(36).slice(2, 10);
    setState((s) => ({
      ...s,
      cart: [],
      limit: s.defaultLimit,
      history: [{ ...entry, id, date: new Date().toISOString() }, ...s.history],
    }));
    return id;
  },
};

export const limitLabel = (l: MarketLimit) =>
  l === null ? "Sem limite" : l === 1 ? "1 mercado" : `${l} mercados`;

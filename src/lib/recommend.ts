import { MARKETS, PRODUCTS, type MarketId } from "./data";

export interface CartItem {
  productId: string;
  qty: number;
}

/** null = sem limite de mercados */
export type MarketLimit = 1 | 2 | 3 | null;

export interface MarketPlan {
  marketId: MarketId;
  items: { productId: string; qty: number; unit: number; total: number }[];
  subtotal: number;
}

export interface Recommendation {
  plans: MarketPlan[];
  total: number;
  worstTotal: number;
  worstMarketId: MarketId;
  savings: number;
}

function combos<T>(arr: T[], k: number): T[][] {
  if (k === 0) return [[]];
  if (arr.length < k) return [];
  const [head, ...rest] = arr as [T, ...T[]];
  return [...combos(rest, k - 1).map((c) => [head, ...c]), ...combos(rest, k)];
}

const distance = (ids: MarketId[]) =>
  ids.reduce((s, id) => s + (MARKETS.find((m) => m.id === id)?.distanceKm ?? 0), 0);

/**
 * Escolhe a combinação de até `limit` mercados com menor custo total
 * (cada item vai para o mercado mais barato da combinação). Empate em preço:
 * menos mercados efetivamente usados, depois menor distância somada.
 */
export function recommend(cart: CartItem[], limit: MarketLimit): Recommendation {
  const items = cart
    .map((c) => ({ ...c, product: PRODUCTS.find((p) => p.id === c.productId)! }))
    .filter((c) => c.product && c.qty > 0);
  const ids = MARKETS.map((m) => m.id);
  const maxK = limit ?? ids.length;

  let best: { plans: MarketPlan[]; total: number; dist: number } | null = null;
  for (let k = 1; k <= maxK; k++) {
    for (const combo of combos(ids, k)) {
      const byMarket = new Map<MarketId, MarketPlan>();
      let total = 0;
      for (const it of items) {
        let bestId: MarketId = combo[0]!;
        for (const id of combo) {
          const a = it.product.prices[id];
          const b = it.product.prices[bestId];
          if (a < b || (a === b && distance([id]) < distance([bestId]))) bestId = id;
        }
        const unit = it.product.prices[bestId];
        const line = Math.round(unit * it.qty * 100) / 100;
        total += line;
        const plan = byMarket.get(bestId) ?? { marketId: bestId, items: [], subtotal: 0 };
        plan.items.push({ productId: it.productId, qty: it.qty, unit, total: line });
        plan.subtotal += line;
        byMarket.set(bestId, plan);
      }
      const plans = [...byMarket.values()];
      total = Math.round(total * 100) / 100;
      const dist = distance(plans.map((p) => p.marketId));
      const better =
        !best ||
        total < best.total - 0.001 ||
        (Math.abs(total - best.total) < 0.001 &&
          (plans.length < best.plans.length ||
            (plans.length === best.plans.length && dist < best.dist)));
      if (better) best = { plans, total, dist };
    }
  }

  let worstTotal = 0;
  let worstMarketId: MarketId = ids[0]!;
  for (const id of ids) {
    const t = Math.round(items.reduce((s, it) => s + it.product.prices[id] * it.qty, 0) * 100) / 100;
    if (t > worstTotal) {
      worstTotal = t;
      worstMarketId = id;
    }
  }
  const plans = (best?.plans ?? []).sort((a, b) => b.subtotal - a.subtotal);
  const total = best?.total ?? 0;
  return {
    plans,
    total,
    worstTotal,
    worstMarketId,
    savings: Math.round((worstTotal - total) * 100) / 100,
  };
}

export type MarketId = "tenda" | "max" | "assai" | "sk" | "taquaral";

export interface Market {
  id: MarketId;
  name: string;
  short: string;
  distanceKm: number;
}

export const MARKETS: Market[] = [
  { id: "tenda", name: "Tenda Atacado", short: "Tenda", distanceKm: 3.2 },
  { id: "max", name: "Max Atacadista", short: "Max", distanceKm: 4.1 },
  { id: "assai", name: "Assaí Atacadista", short: "Assaí", distanceKm: 5.8 },
  { id: "sk", name: "SK Supermercados", short: "SK", distanceKm: 1.5 },
  { id: "taquaral", name: "Supermercado Taquaral", short: "Taquaral", distanceKm: 6.4 },
];

export const marketById = (id: string) => MARKETS.find((m) => m.id === id);

export interface Product {
  id: string;
  name: string;
  category: string;
  prices: Record<MarketId, number>;
}

const p = (
  id: string,
  name: string,
  category: string,
  [tenda, max, assai, sk, taquaral]: number[],
): Product => ({ id, name, category, prices: { tenda, max, assai, sk, taquaral } });

export const PRODUCTS: Product[] = [
  p("arroz", "Arroz branco tipo 1, 5kg", "Mercearia", [24.9, 23.5, 25.9, 26.5, 27.9]),
  p("feijao", "Feijão carioca, 1kg", "Mercearia", [8.49, 7.99, 8.29, 8.9, 9.2]),
  p("oleo", "Óleo de soja, 900ml", "Mercearia", [6.99, 6.49, 7.19, 7.5, 7.8]),
  p("acucar", "Açúcar refinado, 1kg", "Mercearia", [4.79, 4.59, 4.99, 5.2, 5.4]),
  p("cafe", "Café torrado e moído, 500g", "Bebidas", [14.9, 13.99, 15.49, 16.2, 16.9]),
  p("leite", "Leite integral, 1L", "Laticínios", [5.19, 4.89, 5.39, 5.6, 5.8]),
  p("macarrao", "Macarrão espaguete, 500g", "Mercearia", [4.29, 3.99, 4.49, 4.7, 4.9]),
  p("frango", "Frango inteiro congelado, kg", "Carnes", [11.9, 10.99, 12.49, 12.9, 13.5]),
  p("patinho", "Carne bovina (patinho), kg", "Carnes", [34.9, 32.99, 36.9, 37.9, 38.5]),
  p("detergente", "Detergente líquido, 500ml", "Limpeza", [2.49, 2.29, 2.69, 2.8, 2.9]),
  p("papel", "Papel higiênico, pacote 12un", "Higiene", [18.9, 17.49, 19.9, 20.5, 21.2]),
  p("banana", "Banana prata, kg", "Hortifrúti", [5.49, 4.99, 5.79, 5.9, 6.1]),
];

export const productById = (id: string) => PRODUCTS.find((x) => x.id === id);

/** Itens "identificados" na simulação de leitura da nota fiscal. */
export const RECEIPT_MOCK: { productId: string; qty: number }[] = [
  { productId: "arroz", qty: 1 },
  { productId: "feijao", qty: 2 },
  { productId: "leite", qty: 6 },
  { productId: "cafe", qty: 1 },
  { productId: "banana", qty: 1 },
];

const brl = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });
export const formatBRL = (v: number) => brl.format(v);
export const formatKm = (v: number) => `${v.toLocaleString("pt-BR", { maximumFractionDigits: 1 })} km`;

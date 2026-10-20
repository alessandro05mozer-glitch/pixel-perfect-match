import { createFileRoute, notFound } from "@tanstack/react-router";
import { MapPin } from "lucide-react";
import { AppShell, DemoNotice, EmptyState } from "@/components/AppShell";
import { formatBRL, formatKm, marketById, productById } from "@/lib/data";
import { recommend } from "@/lib/recommend";
import { useApp } from "@/lib/store";

export const Route = createFileRoute("/resultado/$mercado")({
  loader: ({ params }) => {
    const m = marketById(params.mercado);
    if (!m) throw notFound();
    return { name: m.name };
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: `${loaderData?.name ?? "Mercado"} — Compara Mercado` },
      { name: "description", content: "Itens do seu carrinho para comprar neste mercado." },
      { property: "og:title", content: `${loaderData?.name ?? "Mercado"} — Compara Mercado` },
      { property: "og:description", content: "Preço unitário de cada item neste mercado." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: MarketDetail,
});

function MarketDetail() {
  const { mercado } = Route.useParams();
  const { cart, limit } = useApp();
  const m = marketById(mercado)!;
  const plan = recommend(cart, limit).plans.find((p) => p.marketId === mercado);

  return (
    <AppShell title={m.name} back>
      <div className="mx-auto max-w-2xl">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin className="h-4 w-4" /> {formatKm(m.distanceKm)} do seu bairro
        </div>
        {!plan ? (
          <div className="mt-4">
            <EmptyState icon={<MapPin className="h-7 w-7" />} title="Nenhum item aqui" text="Este mercado não faz parte da recomendação atual." />
          </div>
        ) : (
          <div className="mt-4 overflow-hidden rounded-2xl border border-border bg-card shadow-card">
            <div className="grid grid-cols-[1fr_auto_auto] gap-x-4 border-b border-border px-4 py-2 text-xs font-semibold uppercase text-muted-foreground">
              <span>Produto</span>
              <span className="text-right">Unit.</span>
              <span className="text-right">Total</span>
            </div>
            {plan.items.map((it) => (
              <div key={it.productId} className="grid grid-cols-[1fr_auto_auto] gap-x-4 border-b border-border px-4 py-3 text-sm last:border-0">
                <span>
                  <span className="font-medium">{productById(it.productId)?.name}</span>
                  <span className="block text-xs text-muted-foreground">{it.qty} un.</span>
                </span>
                <span className="text-right">{formatBRL(it.unit)}</span>
                <span className="text-right font-semibold">{formatBRL(it.total)}</span>
              </div>
            ))}
            <div className="flex justify-between bg-secondary px-4 py-3 font-bold text-secondary-foreground">
              <span>Subtotal</span>
              <span>{formatBRL(plan.subtotal)}</span>
            </div>
          </div>
        )}
        <DemoNotice />
      </div>
    </AppShell>
  );
}

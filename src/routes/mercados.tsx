import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import type { MarketLimit } from "@/lib/recommend";
import { actions, useApp } from "@/lib/store";

export const Route = createFileRoute("/mercados")({
  head: () => ({
    meta: [
      { title: "Quantos mercados visitar? — Compara Mercado" },
      { name: "description", content: "Escolha quantos mercados você topa visitar." },
      { property: "og:title", content: "Quantos mercados visitar? — Compara Mercado" },
      { property: "og:description", content: "Mais mercados, mais economia — e mais deslocamento." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Limit,
});

const OPTS: { v: MarketLimit; big: string; label: string }[] = [
  { v: 1, big: "1", label: "Só um mercado" },
  { v: 2, big: "2", label: "Até dois" },
  { v: 3, big: "3", label: "Até três" },
  { v: null, big: "∞", label: "Não me importo" },
];

function Limit() {
  const { limit, cart } = useApp();
  return (
    <AppShell
      title="Quantos mercados?"
      back
      footer={
        <Button asChild size="lg" className="h-12 w-full rounded-full text-base" disabled={!cart.length}>
          <Link to="/resultado">Ver recomendação</Link>
        </Button>
      }
    >
      <div className="mx-auto max-w-xl">
        <h2 className="text-2xl font-extrabold">Quantos mercados você topa visitar?</h2>
        <p className="mt-2 text-muted-foreground">
          Quanto mais mercados você aceitar visitar, maior a chance de economia — mas também mais deslocamento.
        </p>
        <div role="radiogroup" className="mt-6 grid grid-cols-2 gap-3">
          {OPTS.map((o) => {
            const on = limit === o.v;
            return (
              <button
                key={o.big}
                role="radio"
                aria-checked={on}
                onClick={() => actions.setLimit(o.v)}
                className={`rounded-2xl border-2 p-5 text-left transition ${on ? "border-primary bg-secondary" : "border-border bg-card hover:border-primary/50"}`}
              >
                <span className="block font-display text-4xl font-extrabold text-primary">{o.big}</span>
                <span className="mt-1 block text-sm font-semibold">{o.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </AppShell>
  );
}

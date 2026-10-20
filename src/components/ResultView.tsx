import { Link } from "@tanstack/react-router";
import { ChevronDown, MapPin, TrendingDown } from "lucide-react";
import { useState } from "react";
import { formatBRL, formatKm, marketById, productById } from "@/lib/data";
import type { Recommendation } from "@/lib/recommend";

export function ResultView({ rec, detailBase }: { rec: Recommendation; detailBase?: "resultado" }) {
  const worst = marketById(rec.worstMarketId)!;
  return (
    <div className="grid gap-5 md:grid-cols-[1fr_1.3fr] md:items-start">
      <div className="space-y-4 md:sticky md:top-20">
        <section className="bg-savings-gradient rounded-3xl p-6 text-savings-foreground shadow-card">
          <div className="flex items-center gap-2 text-sm font-medium opacity-90">
            <TrendingDown className="h-4 w-4" /> Economia estimada
          </div>
          <p className="mt-2 font-display text-5xl font-extrabold tracking-tight">{formatBRL(rec.savings)}</p>
          <p className="mt-2 text-sm opacity-90">
            Você economiza {formatBRL(rec.savings)} comprando nesta combinação.
          </p>
        </section>
        <section className="rounded-2xl border border-border bg-card p-5 shadow-card">
          <Compare label={`Tudo no mais caro (${worst.short})`} value={rec.worstTotal} max={rec.worstTotal} muted />
          <Compare label="Combinação recomendada" value={rec.total} max={rec.worstTotal} />
        </section>
      </div>
      <section className="space-y-3">
        <h2 className="text-lg font-bold">
          {rec.plans.length === 1 ? "Mercado recomendado" : `${rec.plans.length} mercados recomendados`}
        </h2>
        {rec.plans.map((plan, i) => (
          <PlanCard key={plan.marketId} plan={plan} defaultOpen={i === 0} detailBase={detailBase} />
        ))}
      </section>
    </div>
  );
}

function Compare({ label, value, max, muted }: { label: string; value: number; max: number; muted?: boolean }) {
  return (
    <div className="py-2">
      <div className="flex items-baseline justify-between gap-3 text-sm">
        <span className="text-muted-foreground">{label}</span>
        <span className={muted ? "font-semibold text-muted-foreground line-through" : "text-lg font-bold text-primary"}>
          {formatBRL(value)}
        </span>
      </div>
      <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-muted">
        <div
          className={muted ? "h-full rounded-full bg-muted-foreground/40" : "h-full rounded-full bg-primary"}
          style={{ width: `${max ? (value / max) * 100 : 0}%` }}
        />
      </div>
    </div>
  );
}

function PlanCard({
  plan,
  defaultOpen,
  detailBase,
}: {
  plan: Recommendation["plans"][number];
  defaultOpen: boolean;
  detailBase?: "resultado" | undefined;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const m = marketById(plan.marketId)!;
  const count = plan.items.reduce((s, i) => s + i.qty, 0);
  return (
    <article className="overflow-hidden rounded-2xl border border-border bg-card shadow-card">
      <button onClick={() => setOpen(!open)} className="flex w-full items-center gap-3 p-4 text-left" aria-expanded={open}>
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-secondary font-display font-extrabold text-secondary-foreground">
          {m.short[0]}
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="truncate font-bold">{m.name}</h3>
          <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
            <span>
              {plan.items.length} {plan.items.length === 1 ? "produto" : "produtos"} · {count} un.
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 font-medium text-foreground">
              <MapPin className="h-3 w-3" /> {formatKm(m.distanceKm)}
            </span>
          </div>
        </div>
        <div className="text-right">
          <div className="font-bold">{formatBRL(plan.subtotal)}</div>
          <ChevronDown className={`ml-auto mt-1 h-4 w-4 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`} />
        </div>
      </button>
      {open && (
        <div className="border-t border-border px-4 pb-4">
          <ul className="divide-y divide-border">
            {plan.items.map((it) => (
              <li key={it.productId} className="flex justify-between gap-3 py-2.5 text-sm">
                <span>
                  {it.qty}× {productById(it.productId)?.name}
                </span>
                <span className="shrink-0 font-medium">{formatBRL(it.total)}</span>
              </li>
            ))}
          </ul>
          {detailBase && (
            <Link
              to="/resultado/$mercado"
              params={{ mercado: plan.marketId }}
              className="mt-2 inline-flex min-h-11 items-center text-sm font-semibold text-primary hover:underline"
            >
              Ver detalhes deste mercado →
            </Link>
          )}
        </div>
      )}
    </article>
  );
}

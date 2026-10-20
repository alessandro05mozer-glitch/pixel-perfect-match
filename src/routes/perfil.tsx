import { createFileRoute } from "@tanstack/react-router";
import { MapPin } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { formatKm, MARKETS } from "@/lib/data";
import type { MarketLimit } from "@/lib/recommend";
import { actions, useApp } from "@/lib/store";

export const Route = createFileRoute("/perfil")({
  head: () => ({
    meta: [
      { title: "Perfil — Compara Mercado" },
      { name: "description", content: "Seu bairro e preferências de compra." },
      { property: "og:title", content: "Perfil — Compara Mercado" },
      { property: "og:description", content: "Configure bairro e quantos mercados você topa visitar." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Profile,
});

const LIMITS: { v: MarketLimit; l: string }[] = [
  { v: 1, l: "1" },
  { v: 2, l: "2" },
  { v: 3, l: "3" },
  { v: null, l: "Sem limite" },
];

function Profile() {
  const app = useApp();
  const [hood, setHood] = useState(app.neighborhood);
  const [lim, setLim] = useState<MarketLimit>(app.defaultLimit);
  useEffect(() => {
    if (app.hydrated) {
      setHood(app.neighborhood);
      setLim(app.defaultLimit);
    }
  }, [app.hydrated]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <AppShell title="Perfil">
      <div className="mx-auto grid max-w-3xl gap-5 md:grid-cols-2">
        <section className="rounded-2xl border border-border bg-card p-5 shadow-card">
          <label htmlFor="hood" className="font-bold">Bairro ou CEP</label>
          <input
            id="hood"
            value={hood}
            onChange={(e) => setHood(e.target.value)}
            className="mt-2 h-12 w-full rounded-xl border border-input bg-background px-4 outline-none focus:ring-2 focus:ring-ring"
          />
          <p className="mt-2 text-xs text-muted-foreground">Usado para estimar a distância até os mercados.</p>

          <p className="mt-6 font-bold">Quantos mercados topa visitar (padrão)</p>
          <div className="mt-2 grid grid-cols-4 gap-2">
            {LIMITS.map((o) => (
              <button
                key={o.l}
                onClick={() => setLim(o.v)}
                aria-pressed={lim === o.v}
                className={`min-h-11 rounded-xl border-2 px-2 text-sm font-semibold ${lim === o.v ? "border-primary bg-secondary text-secondary-foreground" : "border-border"}`}
              >
                {o.l}
              </button>
            ))}
          </div>
          <Button
            size="lg"
            className="mt-6 h-12 w-full rounded-full"
            onClick={() => {
              actions.saveProfile(hood.trim() || "Jardim Nova América", lim);
              toast.success("Preferências salvas");
            }}
          >
            Salvar
          </Button>
        </section>
        <section className="rounded-2xl border border-border bg-card p-5 shadow-card">
          <h2 className="font-bold">Distâncias aproximadas</h2>
          <p className="text-xs text-muted-foreground">A partir de Jardim Nova América (ilustrativo)</p>
          <ul className="mt-3 divide-y divide-border">
            {MARKETS.map((m) => (
              <li key={m.id} className="flex items-center justify-between py-2.5 text-sm">
                <span>{m.name}</span>
                <span className="inline-flex items-center gap-1 text-muted-foreground">
                  <MapPin className="h-3.5 w-3.5" /> {formatKm(m.distanceKm)}
                </span>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </AppShell>
  );
}

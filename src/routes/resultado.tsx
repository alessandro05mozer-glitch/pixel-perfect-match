import { createFileRoute, Link, Outlet, useMatch, useNavigate } from "@tanstack/react-router";
import { ShoppingBasket } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { AppShell, DemoNotice, EmptyState } from "@/components/AppShell";
import { ResultView } from "@/components/ResultView";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { recommend } from "@/lib/recommend";
import { actions, limitLabel, useApp } from "@/lib/store";

export const Route = createFileRoute("/resultado")({
  head: () => ({
    meta: [
      { title: "Sua recomendação — Compara Mercado" },
      { name: "description", content: "A combinação de mercados mais barata para o seu carrinho." },
      { property: "og:title", content: "Sua recomendação — Compara Mercado" },
      { property: "og:description", content: "Veja onde comprar cada item e quanto você economiza." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: ResultPage,
});

function ResultPage() {
  const child = useMatch({ from: "/resultado/$mercado", shouldThrow: false });
  if (child) return <Outlet />;
  return <Result />;
}

function Result() {
  const { cart, limit, hydrated } = useApp();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(t);
  }, []);
  const rec = useMemo(() => recommend(cart, limit), [cart, limit]);

  const save = () => {
    const id = actions.saveToHistory({
      cart,
      limit,
      marketIds: rec.plans.map((p) => p.marketId),
      total: rec.total,
      savings: rec.savings,
    });
    toast.success("Compra salva no histórico");
    navigate({ to: "/historico/$id", params: { id } });
  };

  return (
    <AppShell
      title="Recomendação"
      back
      footer={
        cart.length > 0 && !loading ? (
          <Button size="lg" className="h-12 w-full rounded-full text-base" onClick={save}>
            Salvar no histórico e finalizar
          </Button>
        ) : undefined
      }
    >
      {!hydrated || loading ? (
        <div className="space-y-4" aria-busy="true">
          <p className="text-sm text-muted-foreground">Calculando a melhor combinação…</p>
          <Skeleton className="h-40 rounded-3xl" />
          <Skeleton className="h-20 rounded-2xl" />
          <Skeleton className="h-20 rounded-2xl" />
        </div>
      ) : cart.length === 0 ? (
        <EmptyState
          icon={<ShoppingBasket className="h-7 w-7" />}
          title="Carrinho vazio"
          text="Adicione produtos para receber uma recomendação."
          action={
            <Button asChild size="lg" className="h-12 rounded-full">
              <Link to="/carrinho">Montar carrinho</Link>
            </Button>
          }
        />
      ) : (
        <>
          <p className="mb-4 text-sm text-muted-foreground">
            Preferência: <strong className="text-foreground">{limitLabel(limit)}</strong> ·{" "}
            <Link to="/mercados" className="font-semibold text-primary">alterar</Link>
          </p>
          <ResultView rec={rec} detailBase="resultado" />
        </>
      )}
      <DemoNotice />
    </AppShell>
  );
}

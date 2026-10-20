import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Camera, History, ShoppingBasket, Sparkles } from "lucide-react";
import { useEffect } from "react";
import { AppShell, EmptyState } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { formatBRL, productById } from "@/lib/data";
import { useApp } from "@/lib/store";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Compara Mercado — seu carrinho mais barato em Campinas" },
      { name: "description", content: "Compare preços entre Tenda, Max, Assaí, SK e Taquaral e descubra onde comprar." },
      { property: "og:title", content: "Compara Mercado" },
      { property: "og:description", content: "Descubra a combinação de mercados mais barata para seu carrinho." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  const { cart, onboarded, hydrated } = useApp();
  const navigate = useNavigate();
  useEffect(() => {
    if (hydrated && !onboarded) navigate({ to: "/boas-vindas" });
  }, [hydrated, onboarded, navigate]);

  const units = cart.reduce((s, c) => s + c.qty, 0);
  const from = cart.reduce((s, c) => s + (productById(c.productId)?.prices.max ?? 0) * c.qty, 0);

  return (
    <AppShell>
      <h1 className="text-3xl font-extrabold md:text-4xl">Olá! O que vamos comprar hoje?</h1>
      <p className="mt-1 text-muted-foreground">Comparamos 5 mercados de Campinas pra você.</p>

      <div className="mt-6 grid gap-4 md:grid-cols-[1.5fr_1fr]">
        {cart.length === 0 ? (
          <EmptyState
            icon={<ShoppingBasket className="h-7 w-7" />}
            title="Seu carrinho está vazio"
            text="Adicione os produtos que você precisa e a gente encontra onde sai mais barato."
            action={
              <Button asChild size="lg" className="h-12 rounded-full px-8 text-base">
                <Link to="/carrinho">Montar meu carrinho</Link>
              </Button>
            }
          />
        ) : (
          <section className="rounded-3xl border border-border bg-card p-6 shadow-card">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">Carrinho atual</h2>
              <span className="rounded-full bg-secondary px-3 py-1 text-sm font-semibold text-secondary-foreground">
                {cart.length} {cart.length === 1 ? "produto" : "produtos"} · {units} un.
              </span>
            </div>
            <ul className="mt-4 space-y-1.5 text-sm text-muted-foreground">
              {cart.slice(0, 4).map((c) => (
                <li key={c.productId}>
                  {c.qty}× {productById(c.productId)?.name}
                </li>
              ))}
              {cart.length > 4 && <li>+ {cart.length - 4} outros</li>}
            </ul>
            <p className="mt-4 text-sm">
              A partir de <strong className="text-primary">{formatBRL(from)}</strong>
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              <Button asChild size="lg" className="h-12 rounded-full px-6">
                <Link to="/mercados">
                  <Sparkles className="h-4 w-4" /> Ver recomendação
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="h-12 rounded-full px-6">
                <Link to="/carrinho">Editar carrinho</Link>
              </Button>
            </div>
          </section>
        )}
        <div className="grid gap-3">
          <Shortcut to="/carrinho/nota" icon={<Camera className="h-5 w-5" />} title="Fotografar nota fiscal" text="Adicione itens de uma compra anterior" />
          <Shortcut to="/historico" icon={<History className="h-5 w-5" />} title="Ver histórico" text="Seus carrinhos anteriores" />
        </div>
      </div>
    </AppShell>
  );
}

function Shortcut({ to, icon, title, text }: { to: "/carrinho/nota" | "/historico"; icon: React.ReactNode; title: string; text: string }) {
  return (
    <Link to={to} className="flex min-h-11 items-center gap-4 rounded-2xl border border-border bg-card p-4 shadow-card transition hover:border-primary">
      <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent text-accent-foreground">{icon}</span>
      <span>
        <span className="block font-semibold">{title}</span>
        <span className="text-sm text-muted-foreground">{text}</span>
      </span>
    </Link>
  );
}

import { createFileRoute, Link, Outlet, useMatch } from "@tanstack/react-router";
import { Camera, Minus, Plus, Search, ShoppingBasket, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { AppShell, EmptyState } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { PRODUCTS, productById, type Product } from "@/lib/data";
import { actions, useApp } from "@/lib/store";

export const Route = createFileRoute("/carrinho")({
  head: () => ({
    meta: [
      { title: "Montar carrinho — Compara Mercado" },
      { name: "description", content: "Adicione os produtos que você quer comprar." },
      { property: "og:title", content: "Montar carrinho — Compara Mercado" },
      { property: "og:description", content: "Busque produtos e monte sua lista de compras." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: CartPage,
});

function CartPage() {
  const child = useMatch({ from: "/carrinho/nota", shouldThrow: false });
  if (child) return <Outlet />;
  return <Cart />;
}

const norm = (s: string) => s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

function Cart() {
  const { cart } = useApp();
  const [q, setQ] = useState("");
  const [picked, setPicked] = useState<Product | null>(null);
  const [qty, setQty] = useState(1);
  const results = useMemo(() => {
    const n = norm(q.trim());
    return n ? PRODUCTS.filter((p) => norm(p.name + " " + p.category).includes(n)) : PRODUCTS;
  }, [q]);

  const add = () => {
    if (!picked) return;
    actions.addItem(picked.id, qty);
    toast.success(`${picked.name} adicionado`);
    setPicked(null);
    setQ("");
    setQty(1);
  };

  return (
    <AppShell
      title="Montar carrinho"
      back
      footer={
        <div className="flex gap-2">
          <Button asChild variant="outline" size="lg" className="h-12 rounded-full">
            <Link to="/carrinho/nota" aria-label="Fotografar nota fiscal">
              <Camera className="h-5 w-5" /> <span className="hidden sm:inline">Nota fiscal</span>
            </Link>
          </Button>
          {cart.length ? (
            <Button asChild size="lg" className="h-12 flex-1 rounded-full text-base">
              <Link to="/mercados">Continuar</Link>
            </Button>
          ) : (
            <Button size="lg" disabled className="h-12 flex-1 rounded-full text-base">
              Continuar
            </Button>
          )}
        </div>
      }
    >
      <div className="grid gap-6 md:grid-cols-2">
        <section>
          <h2 className="mb-3 font-bold">Adicionar produto</h2>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
            <input
              value={q}
              onChange={(e) => {
                setQ(e.target.value);
                setPicked(null);
              }}
              placeholder="Buscar arroz, café, leite…"
              className="h-12 w-full rounded-full border border-input bg-card pl-12 pr-4 outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          {picked ? (
            <div className="mt-3 rounded-2xl border border-primary bg-card p-4 shadow-card">
              <p className="font-semibold">{picked.name}</p>
              <p className="text-sm text-muted-foreground">{picked.category}</p>
              <div className="mt-4 flex items-center gap-3">
                <Stepper value={qty} onChange={setQty} />
                <Button size="lg" className="h-11 flex-1 rounded-full" onClick={add}>
                  Adicionar
                </Button>
              </div>
              <button onClick={() => setPicked(null)} className="mt-2 min-h-11 text-sm text-muted-foreground">
                Cancelar
              </button>
            </div>
          ) : (
            <ul className="mt-3 max-h-80 overflow-auto rounded-2xl border border-border bg-card">
              {results.length === 0 && <li className="p-4 text-sm text-muted-foreground">Nenhum produto encontrado.</li>}
              {results.map((p) => (
                <li key={p.id} className="border-b border-border last:border-0">
                  <button onClick={() => setPicked(p)} className="flex min-h-12 w-full items-center justify-between gap-3 px-4 py-2 text-left hover:bg-muted">
                    <span>
                      <span className="block text-sm font-medium">{p.name}</span>
                      <span className="text-xs text-muted-foreground">{p.category}</span>
                    </span>
                    <Plus className="h-4 w-4 text-primary" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section>
          <h2 className="mb-3 font-bold">Seu carrinho ({cart.length})</h2>
          {cart.length === 0 ? (
            <EmptyState icon={<ShoppingBasket className="h-7 w-7" />} title="Nada por aqui ainda" text="Busque um produto ao lado ou fotografe uma nota fiscal." />
          ) : (
            <ul className="space-y-2">
              {cart.map((c) => {
                const p = productById(c.productId);
                if (!p) return null;
                return (
                  <li key={c.productId} className="flex items-center gap-3 rounded-2xl border border-border bg-card p-3 shadow-card">
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold">{p.name}</p>
                      <p className="text-xs text-muted-foreground">{p.category}</p>
                    </div>
                    <Stepper value={c.qty} onChange={(v) => actions.setQty(c.productId, v)} />
                    <button onClick={() => actions.remove(c.productId)} aria-label={`Remover ${p.name}`} className="flex h-11 w-11 items-center justify-center rounded-full text-destructive hover:bg-muted">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </section>
      </div>
    </AppShell>
  );
}

function Stepper({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  return (
    <div className="flex items-center rounded-full border border-border bg-background">
      <button aria-label="Diminuir" onClick={() => onChange(Math.max(1, value - 1))} className="flex h-11 w-10 items-center justify-center">
        <Minus className="h-4 w-4" />
      </button>
      <span className="w-6 text-center text-sm font-semibold">{value}</span>
      <button aria-label="Aumentar" onClick={() => onChange(value + 1)} className="flex h-11 w-10 items-center justify-center">
        <Plus className="h-4 w-4" />
      </button>
    </div>
  );
}

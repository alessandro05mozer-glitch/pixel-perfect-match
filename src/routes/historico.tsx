import { createFileRoute, Link, Outlet, useMatch } from "@tanstack/react-router";
import { ChevronRight, History } from "lucide-react";
import { AppShell, EmptyState } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { formatBRL, marketById } from "@/lib/data";
import { useApp } from "@/lib/store";

export const Route = createFileRoute("/historico")({
  head: () => ({
    meta: [
      { title: "Histórico — Compara Mercado" },
      { name: "description", content: "Seus carrinhos e compras anteriores." },
      { property: "og:title", content: "Histórico — Compara Mercado" },
      { property: "og:description", content: "Reveja compras anteriores e quanto você economizou." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: HistoryPage,
});

function HistoryPage() {
  const child = useMatch({ from: "/historico/$id", shouldThrow: false });
  if (child) return <Outlet />;
  return <HistoryList />;
}

const fmtDate = (iso: string) =>
  new Date(iso).toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });

function HistoryList() {
  const { history } = useApp();
  return (
    <AppShell title="Histórico">
      {history.length === 0 ? (
        <EmptyState
          icon={<History className="h-7 w-7" />}
          title="Nenhuma compra ainda"
          text="Quando você finalizar uma recomendação, ela aparece aqui."
          action={
            <Button asChild size="lg" className="h-12 rounded-full">
              <Link to="/carrinho">Montar carrinho</Link>
            </Button>
          }
        />
      ) : (
        <ul className="grid gap-3 md:grid-cols-2">
          {history.map((h) => (
            <li key={h.id}>
              <Link to="/historico/$id" params={{ id: h.id }} className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4 shadow-card hover:border-primary">
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-muted-foreground">{fmtDate(h.date)}</p>
                  <p className="mt-1 truncate font-semibold">{h.marketIds.map((id) => marketById(id)?.short).join(" + ")}</p>
                  <p className="text-sm text-muted-foreground">
                    {formatBRL(h.total)} · economizou <span className="font-semibold text-primary">{formatBRL(h.savings)}</span>
                  </p>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground" />
              </Link>
            </li>
          ))}
        </ul>
      )}
    </AppShell>
  );
}

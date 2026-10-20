import { createFileRoute, Link } from "@tanstack/react-router";
import { History } from "lucide-react";
import { AppShell, DemoNotice, EmptyState } from "@/components/AppShell";
import { ResultView } from "@/components/ResultView";
import { Button } from "@/components/ui/button";
import { recommend } from "@/lib/recommend";
import { limitLabel, useApp } from "@/lib/store";

export const Route = createFileRoute("/historico/$id")({
  head: () => ({
    meta: [
      { title: "Compra anterior — Compara Mercado" },
      { name: "description", content: "Detalhes de uma compra anterior." },
      { property: "og:title", content: "Compra anterior — Compara Mercado" },
      { property: "og:description", content: "Onde você comprou e quanto economizou." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: HistoryDetail,
});

function HistoryDetail() {
  const { id } = Route.useParams();
  const { history, hydrated } = useApp();
  const entry = history.find((h) => h.id === id);
  return (
    <AppShell title="Compra anterior" back>
      {!hydrated ? null : !entry ? (
        <EmptyState
          icon={<History className="h-7 w-7" />}
          title="Compra não encontrada"
          text="Ela pode ter sido salva em outro aparelho."
          action={
            <Button asChild className="h-12 rounded-full">
              <Link to="/historico">Ver histórico</Link>
            </Button>
          }
        />
      ) : (
        <>
          <p className="mb-4 text-sm text-muted-foreground">
            {new Date(entry.date).toLocaleDateString("pt-BR", { dateStyle: "long" })} · {limitLabel(entry.limit)}
          </p>
          <ResultView rec={recommend(entry.cart, entry.limit)} />
        </>
      )}
      <DemoNotice />
    </AppShell>
  );
}

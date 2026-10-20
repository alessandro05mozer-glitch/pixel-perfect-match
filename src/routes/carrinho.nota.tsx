import { createFileRoute, Link } from "@tanstack/react-router";
import { Camera, CheckCircle2, Loader2, Upload } from "lucide-react";
import { useState } from "react";
import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { productById, RECEIPT_MOCK } from "@/lib/data";
import { actions } from "@/lib/store";

export const Route = createFileRoute("/carrinho/nota")({
  head: () => ({
    meta: [
      { title: "Foto da nota fiscal — Compara Mercado" },
      { name: "description", content: "Adicione itens ao carrinho a partir de uma nota fiscal (simulação)." },
      { property: "og:title", content: "Foto da nota fiscal — Compara Mercado" },
      { property: "og:description", content: "Leitura de nota fiscal em breve." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Receipt,
});

function Receipt() {
  const [preview, setPreview] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "done">("idle");

  const simulate = () => {
    setStatus("loading");
    setTimeout(() => {
      RECEIPT_MOCK.forEach((i) => actions.addItem(i.productId, i.qty));
      setStatus("done");
    }, 1400);
  };

  return (
    <AppShell title="Nota fiscal" back>
      <div className="mx-auto max-w-lg">
        <p className="mb-4 rounded-xl bg-accent/40 px-4 py-2 text-center text-sm font-medium text-accent-foreground">
          Em breve: leitura automática via OCR
        </p>
        {status !== "done" ? (
          <>
            <label className="flex aspect-[3/4] cursor-pointer flex-col items-center justify-center overflow-hidden rounded-3xl border-2 border-dashed border-border bg-card text-center">
              {preview ? (
                <img src={preview} alt="Nota fiscal selecionada" className="h-full w-full object-cover" />
              ) : (
                <>
                  <Camera className="h-12 w-12 text-primary" />
                  <span className="mt-3 font-semibold">Tirar foto ou enviar imagem</span>
                  <span className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
                    <Upload className="h-4 w-4" /> JPG ou PNG
                  </span>
                </>
              )}
              <input
                type="file"
                accept="image/*"
                capture="environment"
                className="sr-only"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) setPreview(URL.createObjectURL(f));
                }}
              />
            </label>
            <Button size="lg" className="mt-4 h-12 w-full rounded-full text-base" onClick={simulate} disabled={status === "loading"}>
              {status === "loading" ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Lendo a nota…
                </>
              ) : (
                "Simular leitura"
              )}
            </Button>
          </>
        ) : (
          <div className="rounded-3xl border border-border bg-card p-6 shadow-card">
            <div className="flex items-center gap-2 text-primary">
              <CheckCircle2 className="h-5 w-5" />
              <h2 className="font-bold">Itens identificados na nota — confira antes de continuar</h2>
            </div>
            <ul className="mt-4 divide-y divide-border">
              {RECEIPT_MOCK.map((i) => (
                <li key={i.productId} className="flex justify-between py-2.5 text-sm">
                  <span>{productById(i.productId)?.name}</span>
                  <span className="font-semibold">{i.qty}×</span>
                </li>
              ))}
            </ul>
            <Button asChild size="lg" className="mt-5 h-12 w-full rounded-full">
              <Link to="/carrinho">Conferir carrinho</Link>
            </Button>
          </div>
        )}
      </div>
    </AppShell>
  );
}

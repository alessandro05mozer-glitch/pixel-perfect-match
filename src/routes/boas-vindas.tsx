import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Route as RouteIcon, ShoppingBasket, Sparkles } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { actions } from "@/lib/store";

export const Route = createFileRoute("/boas-vindas")({
  head: () => ({
    meta: [
      { title: "Boas-vindas — Compara Mercado" },
      { name: "description", content: "Entenda como o Compara Mercado encontra a compra mais barata pra você." },
      { property: "og:title", content: "Boas-vindas — Compara Mercado" },
      { property: "og:description", content: "Monte o carrinho, escolha quantos mercados visitar e economize." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Onboarding,
});

const STEPS = [
  { icon: ShoppingBasket, title: "Monte seu carrinho", text: "Busque os produtos ou fotografe uma nota fiscal antiga." },
  { icon: RouteIcon, title: "Diga quantos mercados você topa ir", text: "Um só, dois, três — ou quantos precisar pra economizar." },
  { icon: Sparkles, title: "Receba a combinação mais barata", text: "Mostramos onde comprar cada item e quanto você economiza." },
];

function Onboarding() {
  const [i, setI] = useState(0);
  const navigate = useNavigate();
  const done = () => {
    actions.finishOnboarding();
    navigate({ to: "/" });
  };
  const S = STEPS[i];
  return (
    <div className="flex min-h-screen flex-col bg-background px-6 py-6">
      <div className="mx-auto flex w-full max-w-md flex-1 flex-col">
        <button onClick={done} className="ml-auto min-h-11 px-3 text-sm font-semibold text-muted-foreground">
          Pular
        </button>
        <div className="flex flex-1 flex-col items-center justify-center text-center">
          <div className="bg-savings-gradient mb-10 flex h-40 w-40 items-center justify-center rounded-[2.5rem] text-savings-foreground shadow-card">
            <S.icon className="h-16 w-16" strokeWidth={1.6} />
          </div>
          <p className="text-sm font-semibold text-primary">Passo {i + 1} de 3</p>
          <h1 className="mt-2 text-3xl font-extrabold">{S.title}</h1>
          <p className="mt-3 text-muted-foreground">{S.text}</p>
        </div>
        <div className="mb-6 flex justify-center gap-2">
          {STEPS.map((_, k) => (
            <span key={k} className={`h-2 rounded-full transition-all ${k === i ? "w-8 bg-primary" : "w-2 bg-border"}`} />
          ))}
        </div>
        <Button size="lg" className="h-14 rounded-full text-base" onClick={() => (i < 2 ? setI(i + 1) : done())}>
          {i < 2 ? "Próximo" : "Começar"}
        </Button>
      </div>
    </div>
  );
}

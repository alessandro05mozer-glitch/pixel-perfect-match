import { Link, useRouter } from "@tanstack/react-router";
import { ArrowLeft, History, Home, ShoppingBasket, User } from "lucide-react";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";

const NAV = [
  { to: "/", label: "Início", icon: Home },
  { to: "/carrinho", label: "Carrinho", icon: ShoppingBasket },
  { to: "/historico", label: "Histórico", icon: History },
  { to: "/perfil", label: "Perfil", icon: User },
] as const;

export function AppShell({
  title,
  back,
  children,
  footer,
}: {
  title?: string;
  back?: boolean;
  children: ReactNode;
  footer?: ReactNode;
}) {
  const router = useRouter();
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-20 border-b border-border bg-background/90 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-5xl items-center gap-3 px-4">
          {back ? (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                if (router.history.canGoBack()) router.history.back();
                else router.navigate({ to: "/" });
              }}
              aria-label="Voltar"
              className="-ml-2 flex h-11 w-11 items-center justify-center rounded-full hover:bg-muted"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
          ) : (
            <Link to="/" className="flex items-center gap-2 font-display text-lg font-extrabold">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <ShoppingBasket className="h-4 w-4" />
              </span>
              <span className={title ? "hidden md:inline" : ""}>Compara Mercado</span>
            </Link>
          )}
          {title && <h1 className="truncate text-lg font-bold md:ml-4">{title}</h1>}
          <nav className="ml-auto hidden gap-1 md:flex">
            {NAV.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                activeOptions={{ exact: n.to === "/" }}
                className="rounded-full px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-muted data-[status=active]:bg-secondary data-[status=active]:text-secondary-foreground"
              >
                {n.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-4 pb-40 pt-5 md:pb-28">{children}</main>
      {footer && (
        <div className="fixed inset-x-0 bottom-16 z-20 border-t border-border bg-background/95 backdrop-blur md:bottom-0">
          <div className="mx-auto max-w-5xl px-4 py-3">{footer}</div>
        </div>
      )}
      <nav className="fixed inset-x-0 bottom-0 z-30 grid h-16 grid-cols-4 border-t border-border bg-card md:hidden">
        {NAV.map((n) => (
          <Link
            key={n.to}
            to={n.to}
            activeOptions={{ exact: n.to === "/" }}
            className="flex flex-col items-center justify-center gap-0.5 text-xs font-medium text-muted-foreground data-[status=active]:text-primary"
          >
            <n.icon className="h-5 w-5" />
            {n.label}
          </Link>
        ))}
      </nav>
    </div>
  );
}

export function DemoNotice() {
  return (
    <p className="mt-8 text-center text-xs text-muted-foreground">
      Dados ilustrativos para demonstração — preços reais em breve
    </p>
  );
}

export function EmptyState({ icon, title, text, action }: { icon: ReactNode; title: string; text: string; action?: ReactNode }) {
  return (
    <div className="flex flex-col items-center rounded-2xl border border-dashed border-border bg-card px-6 py-12 text-center">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-secondary text-primary">{icon}</div>
      <h2 className="text-xl font-bold">{title}</h2>
      <p className="mt-1 max-w-xs text-sm text-muted-foreground">{text}</p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}

import { ArrowLeft, Home } from "lucide-react";
import Link from "next/link";
import { MarketingShell } from "@/components/marketing/marketing-layout";
import { LinkButton } from "@/components/ui/button";

export default function NotFound() {
  return (
    <MarketingShell>
      <main className="flex min-h-[82svh] items-center px-4 pb-16 pt-28 sm:px-6 lg:px-8">
        <section className="premium-panel mx-auto w-full max-w-2xl rounded-lg p-6 text-center sm:p-8">
          <div className="brand-tile mx-auto flex h-14 w-14 items-center justify-center rounded-lg text-lilac">
            <Home size={24} />
          </div>
          <p className="mt-6 text-sm font-semibold uppercase text-lilac">
            Página não encontrada
          </p>
          <h1 className="mt-3 text-3xl font-semibold text-foreground sm:text-4xl">
            Esse caminho não existe no Velora.
          </h1>
          <p className="mx-auto mt-4 max-w-lg text-sm leading-6 text-muted">
            Volte para a landing page ou entre no sistema para acessar o dashboard,
            clientes, agenda e financeiro.
          </p>
          <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
            <LinkButton href="/" variant="primary">
              <ArrowLeft size={16} />
              Voltar para home
            </LinkButton>
            <Link
              href="/login"
              className="inline-flex h-11 items-center justify-center rounded-lg border border-border/80 bg-surface-raised/80 px-4 text-sm font-medium text-foreground transition hover:border-lilac/35 hover:bg-surface-glow"
            >
              Entrar no sistema
            </Link>
          </div>
        </section>
      </main>
    </MarketingShell>
  );
}

import {
  ArrowRight,
  CalendarDays,
  ChartNoAxesCombined,
  CircleDollarSign,
  Package,
  Scissors,
  Sparkles,
  UsersRound,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { VeloraLogo, VeloraSymbol } from "@/components/brand/velora-logo";
import { LinkButton } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const marketingNav = [
  { href: "/recursos", label: "Recursos" },
  { href: "/sobre", label: "Sobre" },
  { href: "/precos", label: "Preços" },
];

export const featureCards = [
  {
    icon: UsersRound,
    title: "Clientes com histórico completo",
    description:
      "Preferências, alergias, química, frequência, fotos e observações ficam na ficha de cada cliente.",
  },
  {
    icon: CalendarDays,
    title: "Agenda clara para o dia a dia",
    description:
      "Visualize horários por dia, semana e mês, crie agendamentos e conclua atendimentos em poucos toques.",
  },
  {
    icon: Package,
    title: "Produtos e estoque baixo",
    description:
      "Relacione produtos usados no serviço e acompanhe quando algo está perto de acabar.",
  },
  {
    icon: CircleDollarSign,
    title: "Financeiro simples",
    description:
      "Recebimentos por atendimento, totais do dia, da semana e do mês, sem virar um sistema complexo.",
  },
  {
    icon: Scissors,
    title: "Serviços organizados",
    description:
      "Corte, escova, coloração, progressiva, luzes, tratamentos e outros serviços sempre vinculados à cliente.",
  },
  {
    icon: ChartNoAxesCombined,
    title: "Dashboard útil",
    description:
      "Métricas de clientes, faturamento, agenda e serviços mais realizados em uma tela bonita e rápida.",
  },
];

export function MarketingHeader() {
  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-border/45 bg-background/72 backdrop-blur-xl">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link href="/" aria-label="Velora - página inicial">
          <VeloraLogo compact />
        </Link>
        <nav className="hidden items-center gap-1 md:flex" aria-label="Páginas públicas">
          {marketingNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-lg px-3 py-2 text-sm font-medium text-muted transition hover:bg-surface-raised/70 hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <LinkButton href="/login" variant="ghost" size="sm" className="hidden sm:inline-flex">
            Entrar
          </LinkButton>
          <LinkButton href="/cadastro" variant="primary" size="sm">
            Começar
            <ArrowRight size={15} />
          </LinkButton>
        </div>
      </div>
    </header>
  );
}

export function MarketingFooter() {
  return (
    <footer className="border-t border-border/60 bg-surface/70">
      <div className="mx-auto grid w-full max-w-7xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-[1fr_auto] lg:px-8">
        <div>
          <div>
            <VeloraLogo compact />
            <p className="mt-2 text-sm text-muted">
              Gestão premium para rotina de beleza.
            </p>
          </div>
          <p className="mt-4 max-w-xl text-sm leading-6 text-muted">
            Feito para cabeleireiras que querem agenda, histórico técnico,
            estoque e financeiro em uma experiência simples de usar no celular.
          </p>
        </div>
        <div className="flex flex-wrap gap-2 md:justify-end">
          {marketingNav.map((item) => (
            <LinkButton key={item.href} href={item.href} variant="ghost" size="sm">
              {item.label}
            </LinkButton>
          ))}
          <LinkButton href="/login" variant="secondary" size="sm">
            Login
          </LinkButton>
        </div>
      </div>
    </footer>
  );
}

export function MarketingShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="velora-shell min-h-screen bg-background text-foreground">
      <MarketingHeader />
      {children}
      <MarketingFooter />
    </div>
  );
}

function AnimatedHeroGraphic() {
  return (
    <div className="absolute inset-y-0 right-0 hidden w-[55%] lg:flex items-center justify-center pointer-events-none overflow-hidden">
      {/* Deep Background Glow */}
      <div className="absolute h-[500px] w-[500px] animate-pulse rounded-full bg-[radial-gradient(circle,var(--lilac-deep)_0%,transparent_70%)] opacity-30 blur-[70px]" />

      <div className="relative flex h-[600px] w-[600px] items-center justify-center">
        {/* Orbit Rings representing Organization/System */}
        <div className="absolute h-[600px] w-[600px] rounded-full border border-white/5" />
        <div className="absolute h-[450px] w-[450px] rounded-full border border-lilac/10" />
        <div className="absolute h-[300px] w-[300px] rounded-full border border-rose/10" />

        {/* Central Salon Emblem */}
        <div className="relative z-10 flex h-36 w-36 items-center justify-center rounded-full bg-gradient-to-br from-surface-raised to-surface shadow-[0_0_80px_-20px_var(--lilac-strong)] border border-lilac/20 backdrop-blur-xl animate-[float_6s_ease-in-out_infinite]">
          <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_top_left,var(--lilac-strong)_0%,transparent_50%)] opacity-20" />
          <VeloraSymbol className="h-16 w-16 drop-shadow-[0_0_10px_rgba(255,255,255,0.4)]" />
        </div>

        {/* Outer Ring Satellite (600px) */}
        <div className="absolute flex h-[600px] w-[600px] items-center justify-center animate-[spin_40s_linear_infinite]">
          <div className="absolute top-0 -translate-y-1/2 animate-[spin_40s_linear_infinite_reverse]">
            <div className="flex items-center gap-3 rounded-full border border-border-soft bg-surface/80 px-5 py-2.5 backdrop-blur-xl shadow-xl">
              <Sparkles className="h-4 w-4 text-gold" />
              <span className="text-sm font-medium text-foreground">Exclusividade</span>
            </div>
          </div>
        </div>

        {/* Middle Ring Satellite (450px) */}
        <div className="absolute flex h-[450px] w-[450px] items-center justify-center animate-[spin_30s_linear_infinite_reverse]" style={{ animationDelay: '-10s' }}>
          <div className="absolute right-0 translate-x-1/2 animate-[spin_30s_linear_infinite]" style={{ animationDelay: '-10s' }}>
            <div className="flex items-center gap-3 rounded-full border border-border-soft bg-surface/80 px-5 py-2.5 backdrop-blur-xl shadow-xl">
              <CalendarDays className="h-4 w-4 text-lilac" />
              <span className="text-sm font-medium text-foreground">Organização</span>
            </div>
          </div>
        </div>

        {/* Inner Ring Satellite (300px) */}
        <div className="absolute flex h-[300px] w-[300px] items-center justify-center animate-[spin_20s_linear_infinite]" style={{ animationDelay: '-5s' }}>
          <div className="absolute bottom-0 translate-y-1/2 animate-[spin_20s_linear_infinite_reverse]" style={{ animationDelay: '-5s' }}>
            <div className="flex items-center gap-3 rounded-full border border-border-soft bg-surface/80 px-5 py-2.5 backdrop-blur-xl shadow-xl">
              <CircleDollarSign className="h-4 w-4 text-mint" />
              <span className="text-sm font-medium text-foreground">Praticidade</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function HeroSection() {
  return (
    <section className="relative min-h-[88svh] overflow-hidden pt-16 flex items-center">
      <AnimatedHeroGraphic />
      <div className="relative z-10 mx-auto flex w-full max-w-7xl items-center px-4 py-16 sm:px-6 lg:px-8">
        <div className="max-w-2xl animate-fade-in-up">
          <h1 className="max-w-2xl text-4xl font-semibold leading-tight text-foreground sm:text-6xl">
            Velora organiza o salão sem tirar beleza da rotina.
          </h1>
          <p className="mt-5 max-w-xl text-base leading-8 text-muted sm:text-lg animate-fade-in delay-200">
            Organização premium, simples e elegante para a sua rotina no salão.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row animate-fade-in delay-300">
            <LinkButton href="/cadastro" variant="primary" className="h-12 px-5">
              Criar conta grátis
              <ArrowRight size={17} />
            </LinkButton>
            <LinkButton href="/recursos" variant="secondary" className="h-12 px-5">
              Ver recursos
            </LinkButton>
          </div>
        </div>
      </div>
    </section>
  );
}

export function SectionIntro({
  eyebrow,
  title,
  description,
  centered,
}: {
  eyebrow?: string;
  title: string;
  description: string;
  centered?: boolean;
}) {
  return (
    <div className={cn("max-w-3xl", centered && "mx-auto text-center")}>
      {eyebrow && (
        <p className="toolbar-panel mb-4 inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase text-lilac">
          {eyebrow}
        </p>
      )}
      <h2 className="text-3xl font-semibold leading-tight text-foreground sm:text-4xl">
        {title}
      </h2>
      <p className="mt-4 text-base leading-7 text-muted">{description}</p>
    </div>
  );
}

export function FeatureGrid({ className }: { className?: string }) {
  return (
    <div className={cn("grid gap-4 md:grid-cols-2 xl:grid-cols-3", className)}>
      {featureCards.map((feature) => {
        const Icon = feature.icon;
        return (
          <article key={feature.title} className="premium-panel rounded-lg p-5">
            <div className="brand-tile mb-5 flex h-11 w-11 items-center justify-center rounded-lg text-lilac">
              <Icon size={20} />
            </div>
            <h3 className="text-lg font-semibold text-foreground">{feature.title}</h3>
            <p className="mt-3 text-sm leading-6 text-muted">{feature.description}</p>
          </article>
        );
      })}
    </div>
  );
}

export function MarketingCta({
  title = "Leve o Velora para a rotina do salão.",
  description = "Crie sua conta e comece a organizar clientes, agenda e recebimentos em uma experiência pronta para o dia a dia.",
}: {
  title?: string;
  description?: string;
}) {
  return (
    <section className="px-4 py-16 sm:px-6 lg:px-8">
      <div className="premium-panel mx-auto flex max-w-7xl flex-col gap-6 rounded-lg p-6 sm:p-8 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-2xl">
          <Sparkles className="mb-4 text-lilac" size={24} />
          <h2 className="text-2xl font-semibold text-foreground sm:text-3xl">
            {title}
          </h2>
          <p className="mt-3 text-sm leading-6 text-muted">{description}</p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row lg:shrink-0">
          <LinkButton href="/cadastro" variant="primary">
            Começar agora
            <ArrowRight size={16} />
          </LinkButton>
          <LinkButton href="/login" variant="secondary">
            Entrar
          </LinkButton>
        </div>
      </div>
    </section>
  );
}

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
import { VeloraLogo } from "@/components/brand/velora-logo";
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
            Feito para profissionais autônomas que querem agenda, histórico técnico,
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

export function HeroSection() {
  return (
    <section className="relative min-h-[88svh] overflow-hidden pt-16">
      <Image
        src="/marketing/velora-hero.png"
        alt="Dashboard Velora em um notebook sobre uma bancada de salão"
        fill
        priority
        sizes="100vw"
        className="object-cover object-[64%_center]"
      />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,var(--background)_0%,color-mix(in_srgb,var(--background)_82%,transparent)_30%,color-mix(in_srgb,var(--background)_24%,transparent)_72%,color-mix(in_srgb,var(--background)_50%,transparent)_100%)]" />
      <div className="absolute inset-x-0 bottom-0 h-32 bg-[linear-gradient(0deg,var(--background),transparent)]" />
      <div className="relative z-10 mx-auto flex min-h-[calc(88svh-4rem)] w-full max-w-7xl items-center px-4 py-16 sm:px-6 lg:px-8">
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
  eyebrow: string;
  title: string;
  description: string;
  centered?: boolean;
}) {
  return (
    <div className={cn("max-w-3xl", centered && "mx-auto text-center")}>
      <p className="toolbar-panel mb-4 inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase text-lilac">
        {eyebrow}
      </p>
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

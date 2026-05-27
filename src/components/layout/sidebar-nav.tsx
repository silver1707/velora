"use client";

import {
  CalendarDays,
  CalendarPlus,
  ChartNoAxesCombined,
  CircleDollarSign,
  LayoutDashboard,
  Package,
  Scissors,
  Sparkles,
  UsersRound,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { VeloraLogo } from "@/components/brand/velora-logo";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/clientes", label: "Clientes", icon: UsersRound },
  { href: "/agenda", label: "Agenda", icon: CalendarDays },
  { href: "/pedidos", label: "Pedidos", icon: CalendarPlus },
  { href: "/atendimentos", label: "Atendimentos", icon: Scissors },
  { href: "/servicos", label: "Servicos", icon: Sparkles },
  { href: "/produtos", label: "Produtos", icon: Package },
  { href: "/financeiro", label: "Financeiro", icon: CircleDollarSign },
  { href: "/perfil", label: "Perfil", icon: UsersRound },
];

export function SidebarNav({
  mobile = false,
  pendingBookingRequestsCount = 0,
}: {
  mobile?: boolean;
  pendingBookingRequestsCount?: number;
}) {
  const pathname = usePathname();

  return (
    <nav
      className={cn(
        mobile
          ? "flex gap-1 overflow-x-auto pb-1 scrollbar-soft"
          : "grid gap-1",
      )}
      aria-label="Navegação principal"
    >
      {navItems.map((item) => {
        const Icon = item.icon;
        const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
        const showBadge = item.href === "/pedidos" && pendingBookingRequestsCount > 0;

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "group relative flex items-center gap-3 rounded-lg border px-3 py-2.5 text-sm font-medium transition",
              mobile && "min-w-16 flex-col gap-1 px-2 py-1.5 text-[10px]",
              active
                ? "border-lilac/35 bg-lilac/12 text-foreground shadow-sm shadow-lilac-strong/10"
                : "border-transparent text-muted hover:border-border hover:bg-surface-raised/70 hover:text-foreground",
            )}
          >
            <Icon
              size={mobile ? 15 : 17}
              className={cn(active ? "text-lilac" : "text-muted")}
            />
            <span className={mobile ? "truncate w-full text-center" : undefined}>{item.label}</span>
            {showBadge ? (
              <span
                className={cn(
                  "ml-auto inline-flex min-w-5 items-center justify-center rounded-full bg-lilac-strong px-1.5 text-[10px] font-bold text-white",
                  mobile && "absolute -right-1 -top-1 ml-0",
                )}
              >
                {pendingBookingRequestsCount > 99 ? "99+" : pendingBookingRequestsCount}
              </span>
            ) : null}
          </Link>
        );
      })}
    </nav>
  );
}

export function BrandMark({ compact = false }: { compact?: boolean }) {
  return <VeloraLogo compact={compact} />;
}

export function HeaderMetric({
  icon: Icon = ChartNoAxesCombined,
  label,
  value,
}: {
  icon?: typeof ChartNoAxesCombined;
  label: string;
  value: string;
}) {
  return (
    <div className="surface-row hidden items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted md:flex">
      <Icon size={16} className="text-lilac" />
      <span>{label}</span>
      <strong className="text-foreground">{value}</strong>
    </div>
  );
}

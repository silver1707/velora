"use client";

import {
  CalendarDays,
  ChartNoAxesCombined,
  CircleDollarSign,
  LayoutDashboard,
  Package,
  Scissors,
  Settings,
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
  { href: "/atendimentos", label: "Atendimentos", icon: Scissors },
  { href: "/produtos", label: "Produtos", icon: Package },
  { href: "/financeiro", label: "Financeiro", icon: CircleDollarSign },
  { href: "/ajustes", label: "Ajustes", icon: Settings },
];

export function SidebarNav({ mobile = false }: { mobile?: boolean }) {
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

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "group flex items-center gap-3 rounded-lg border px-3 py-2.5 text-sm font-medium transition",
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

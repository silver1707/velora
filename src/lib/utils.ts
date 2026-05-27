import { clsx, type ClassValue } from "clsx";
import { format, isToday, isTomorrow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function currency(value?: number | null) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(Number(value ?? 0));
}

export function numberValue(value?: number | string | null) {
  if (value === null || value === undefined || value === "") {
    return 0;
  }

  return Number(value);
}

export function dateLabel(value?: string | null) {
  if (!value) {
    return "Sem data";
  }

  return format(new Date(value), "dd MMM yyyy", { locale: ptBR });
}

export function dateTimeLabel(value?: string | null) {
  if (!value) {
    return "Sem horário";
  }

  const date = new Date(value);
  if (isToday(date)) {
    return `Hoje, ${format(date, "HH:mm", { locale: ptBR })}`;
  }
  if (isTomorrow(date)) {
    return `Amanhã, ${format(date, "HH:mm", { locale: ptBR })}`;
  }

  return format(date, "dd MMM, HH:mm", { locale: ptBR });
}

export function inputDateTimeValue(value?: string | null) {
  if (!value) {
    return "";
  }

  const date = new Date(value);
  const offsetDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return offsetDate.toISOString().slice(0, 16);
}

export function initials(name?: string | null) {
  if (!name) {
    return "V";
  }

  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

export const statusLabel: Record<string, string> = {
  agendado: "Agendado",
  concluido: "Concluído",
  cancelado: "Cancelado",
  pendente: "Pendente",
};

export const statusTone: Record<string, string> = {
  agendado: "border-lilac/30 bg-lilac/10 text-lilac",
  concluido: "border-mint/30 bg-mint/10 text-mint",
  cancelado: "border-danger/30 bg-danger/10 text-danger",
  pendente: "border-gold/30 bg-gold/10 text-gold",
};

export function monthRange(date = new Date()) {
  const start = new Date(date.getFullYear(), date.getMonth(), 1);
  const end = new Date(date.getFullYear(), date.getMonth() + 1, 1);
  return { start: start.toISOString(), end: end.toISOString() };
}

export function dayRange(date = new Date()) {
  const start = new Date(date);
  start.setHours(0, 0, 0, 0);
  const end = new Date(start);
  end.setDate(start.getDate() + 1);
  return { start: start.toISOString(), end: end.toISOString() };
}

"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export function ServicesChart({
  data,
}: {
  data: Array<{ name: string; total: number }>;
}) {
  if (!data.length) {
    return (
      <div className="surface-row flex h-64 items-center justify-center rounded-lg text-sm text-muted">
        Serviços concluídos aparecerão aqui.
      </div>
    );
  }

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid stroke="var(--border-soft)" vertical={false} />
          <XAxis dataKey="name" stroke="var(--muted)" fontSize={12} tickLine={false} />
          <YAxis stroke="var(--muted)" fontSize={12} tickLine={false} axisLine={false} />
          <Tooltip
            cursor={{ fill: "rgba(201,167,255,0.08)" }}
            contentStyle={{
              background: "var(--surface)",
              border: "1px solid var(--border)",
              borderRadius: 8,
              color: "var(--foreground)",
            }}
          />
          <Bar dataKey="total" fill="var(--lilac)" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

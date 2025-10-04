"use client";

import * as React from "react";
import { Package, CheckCircle2, Soup, BadgeCheck } from "lucide-react";
import { Card } from "@/components/ui/card";
import { STATUS_META, type OrderStatus } from "@/types/order";

function cx(...c: Array<string | false | null | undefined>) {
  return c.filter(Boolean).join(" ");
}

export default function OrdersSummary({
  counts,
  filter,
  onChange,
}: {
  counts: Record<OrderStatus, number>;
  filter: OrderStatus | "all";
  onChange: (next: OrderStatus | "all") => void;
}) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <SummaryTile
        title="Pendientes"
        value={counts.pendiente}
        icon={<Package className="h-5 w-5" />}
        active={filter === "pendiente"}
        onClick={() => onChange(filter === "pendiente" ? "all" : "pendiente")}
      />
      <SummaryTile
        title="Confirmados"
        value={counts.confirmado}
        icon={<CheckCircle2 className="h-5 w-5" />}
        active={filter === "confirmado"}
        onClick={() => onChange(filter === "confirmado" ? "all" : "confirmado")}
      />
      <SummaryTile
        title="En preparación"
        value={counts.preparacion}
        icon={<Soup className="h-5 w-5" />}
        active={filter === "preparacion"}
        onClick={() => onChange(filter === "preparacion" ? "all" : "preparacion")}
      />
      <SummaryTile
        title="Completados"
        value={counts.completado}
        icon={<BadgeCheck className="h-5 w-5" />}
        active={filter === "completado"}
        onClick={() => onChange(filter === "completado" ? "all" : "completado")}
      />
    </div>
  );
}

function SummaryTile({
  title,
  value,
  icon,
  active,
  onClick,
}: {
  title: string;
  value: number;
  icon: React.ReactNode;
  active?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cx(
        "rounded-2xl border p-4 text-left transition hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/40",
        active ? "border-primary/40 bg-primary/5" : "bg-card"
      )}
    >
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">{title}</div>
        <div className="opacity-70">{icon}</div>
      </div>
      <div className="mt-2 text-2xl font-semibold">{value}</div>
    </button>
  );
}

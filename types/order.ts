import { type ReactNode } from "react";

export type OrderStatus =
  | "confirmado"
  | "en_preparacion"
  | "en_camino"
  | "entregado"
  | "cancelado";

export const STATUS_ORDER: OrderStatus[] = [
  "confirmado",
  "en_preparacion",
  "en_camino",
  "entregado",
  "cancelado",
];

export const STATUS_META: Record<
  OrderStatus,
  { label: string; softClass: string; strongClass: string; icon?: ReactNode }
> = {
  confirmado: {
    label: "Confirmado",
    softClass: "bg-blue-100 text-blue-800",
    strongClass: "bg-blue-600 text-blue-50",
  },
  en_preparacion: {
    label: "En preparación",
    softClass: "bg-amber-100 text-amber-800",
    strongClass: "bg-amber-600 text-amber-50",
  },
  en_camino: {
    label: "En camino",
    softClass: "bg-emerald-100 text-emerald-800",
    strongClass: "bg-emerald-600 text-emerald-50",
  },
  entregado: {
    label: "Entregado",
    softClass: "bg-zinc-200 text-zinc-900",
    strongClass: "bg-zinc-800 text-zinc-50",
  },
  cancelado: {
    label: "Cancelado",
    softClass: "bg-red-100 text-red-800",
    strongClass: "bg-red-600 text-red-50",
  },
};

export type Order = {
  id: string;
  code: string;
  status: OrderStatus;
  createdAt: string;
  customer: { name: string; phone: string; address: string };
  itemsSummary: string;
  total: number;
  note?: string;
};

export const currencyCR = new Intl.NumberFormat("es-CR", {
  style: "currency",
  currency: "CRC",
  maximumFractionDigits: 0,
});

export function formatDateTime(iso: string) {
  const d = new Date(iso);
  return d.toLocaleString("es-CR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

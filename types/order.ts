import { type ReactNode } from "react";

export type OrderStatus = "pendiente" | "confirmado" | "preparacion" | "completado";

export const STATUS_ORDER: OrderStatus[] = [
  "pendiente",
  "confirmado",
  "preparacion",
  "completado",
];

export const STATUS_META: Record<
  OrderStatus,
  { label: string; softClass: string; strongClass: string; icon?: ReactNode }
> = {
  pendiente:   { label: "Pendiente",     softClass: "bg-amber-100 text-amber-800",   strongClass: "bg-amber-500 text-amber-50" },
  confirmado:  { label: "Confirmado",    softClass: "bg-blue-100 text-blue-800",     strongClass: "bg-blue-600 text-blue-50" },
  preparacion: { label: "En preparación",softClass: "bg-emerald-100 text-emerald-800",strongClass: "bg-emerald-600 text-emerald-50" },
  completado:  { label: "Completado",    softClass: "bg-zinc-200 text-zinc-900",     strongClass: "bg-zinc-800 text-zinc-50" },
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

"use client";

import * as React from "react";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  STATUS_META,
  STATUS_ORDER,
  type Order,
  type OrderStatus,
  currencyCR,
  formatDateTime,
} from "@/types/order";

function Pill({ status }: { status: OrderStatus }) {
  const m = STATUS_META[status];
  return <span className={`rounded-full px-2.5 py-0.5 text-xs ${m.softClass}`}>{m.label}</span>;
}

export default function OrderCard({
  order,
  onChangeStatus,
}: {
  order: Order;
  onChangeStatus: (id: string, next: OrderStatus) => void;
}) {
  return (
    <div className="rounded-xl border bg-card p-4 shadow-sm transition hover:shadow">
      {/* header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Pill status={order.status} />
          <div className="font-medium">{order.code}</div>
          <div className="text-xs text-muted-foreground">{formatDateTime(order.createdAt)}</div>
        </div>

        {/* Selector de estado */}
        <div className="flex flex-wrap items-center gap-2">
          <Select
            value={order.status}
            onValueChange={(v) => onChangeStatus(order.id, v as OrderStatus)}
          >
            <SelectTrigger className="w-[160px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {STATUS_ORDER.map((s) => (
                <SelectItem key={s} value={s}>
                  {STATUS_META[s].label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* body */}
      <div className="mt-3 grid gap-2 sm:grid-cols-[1fr_auto] sm:items-start">
        <div className="space-y-1">
          <p className="text-sm font-medium">{order.customer.name}</p>
          <p className="text-sm text-muted-foreground">📞 {order.customer.phone}</p>
          <p className="text-sm text-muted-foreground">📍 {order.customer.address}</p>

          <div className="mt-3">
            <p className="text-sm font-medium">{order.itemsSummary}</p>
            <div className="mt-1 text-sm">
              <span className="font-medium">{currencyCR.format(order.total)}</span>
            </div>
            {order.note && (
              <p className="mt-1 text-xs text-muted-foreground">Nota: {order.note}</p>
            )}
          </div>
        </div>

        <div className="justify-self-end">
          <Badge variant="secondary" className="rounded-full">
            {STATUS_META[order.status].label}
          </Badge>
        </div>
      </div>
    </div>
  );
}

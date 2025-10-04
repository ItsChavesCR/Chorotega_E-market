"use client";

import * as React from "react";
import { Package } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import OrderCard from "./OrdersCard";
import type { Order, OrderStatus } from "@/types/order";

export default function OrdersList({
  orders,
  onChangeStatus,
}: {
  orders: Order[];
  onChangeStatus: (id: string, next: OrderStatus) => void;
}) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <Package className="h-5 w-5" />
          Gestión de Pedidos
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {orders.length === 0 ? (
          <div className="grid place-items-center rounded-xl border bg-muted/40 p-10 text-center">
            <div className="space-y-2">
              <p className="font-medium">No hay pedidos en este estado</p>
              <p className="text-sm text-muted-foreground">
                Cambia el filtro para ver otros pedidos.
              </p>
            </div>
          </div>
        ) : (
          orders.map((o) => (
            <OrderCard
              key={o.id}
              order={o}
              onChangeStatus={onChangeStatus}
            />
          ))
        )}
      </CardContent>
    </Card>
  );
}

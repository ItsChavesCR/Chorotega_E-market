"use client";

import * as React from "react";
import { toast } from "sonner";
import OrdersSummary from "@/components/dashboard/emprendedor/OrdersSummary";
import OrdersList from "@/components/dashboard/emprendedor/OrdersList";
import {
  STATUS_META,
  type Order,
  type OrderStatus,
} from "@/types/order";

/* --------------------------- mock data inicial --------------------------- */
const INITIAL_ORDERS: Order[] = [
  {
    id: "o1",
    code: "Pedido #1",
    status: "pendiente",
    createdAt: new Date().toISOString(),
    customer: { name: "Ana Jiménez", phone: "8787-9090", address: "Nicoya, Barrio Guadalupe" },
    itemsSummary: "Artesanías de cerámica (3 piezas)",
    total: 25000,
    note: "Cliente solicita entrega urgente",
    
  },
  {
    id: "o2",
    code: "Pedido #2",
    status: "confirmado",
    createdAt: new Date(Date.now() - 3600 * 1000).toISOString(),
    customer: { name: "Oscar Gutiérrez", phone: "8787-9090", address: "Nicoya, Barrio Guadalupe" },
    itemsSummary: "Productos orgánicos variados",
    total: 25000,
    
  },
  {
    id: "o3",
    code: "Pedido #3",
    status: "preparacion",
    createdAt: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
    customer: { name: "María Rojas", phone: "8888-1212", address: "Nicoya, San Martín" },
    itemsSummary: "Café especial + Miel",
    total: 13500,

  },
  {
    id: "o4",
    code: "Pedido #4",
    status: "completado",
    createdAt: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
    customer: { name: "Luis Pérez", phone: "8700-3300", address: "Santa Cruz, Centro" },
    itemsSummary: "Queso fresco (2) + Pan artesanal",
    total: 9900,
  },
];

export default function OrdersPage() {
  const [orders, setOrders] = React.useState<Order[]>(INITIAL_ORDERS);
  const [filter, setFilter] = React.useState<OrderStatus | "all">("all");

  const counts = React.useMemo(() => {
    const acc = { pendiente: 0, confirmado: 0, preparacion: 0, completado: 0 } as Record<OrderStatus, number>;
    for (const o of orders) acc[o.status]++;
    return acc;
  }, [orders]);

  const visible = React.useMemo(
    () => (filter === "all" ? orders : orders.filter((o) => o.status === filter)),
    [orders, filter]
  );

  const changeStatus = (id: string, next: OrderStatus) => {
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status: next } : o)));
    toast.success(`Estado actualizado a: ${STATUS_META[next].label}`);
  };

  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold tracking-tight">Gestión de Pedidos</h2>
        <p className="text-sm text-muted-foreground">Administra y actualiza el estado de tus pedidos.</p>
      </div>

      <OrdersSummary counts={counts} filter={filter} onChange={setFilter} />

      <OrdersList orders={visible} onChangeStatus={changeStatus}  />
    </section>
  );
}

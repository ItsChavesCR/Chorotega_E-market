/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import * as React from "react";
import { toast } from "sonner";
import OrdersSummary from "@/components/dashboard/emprendedor/OrdersSummary";
import OrdersList from "@/components/dashboard/emprendedor/OrdersList";
import { STATUS_META, type OrderStatus, type Order } from "@/types/order";
import { usePedidos } from "@/hooks/usePedidos";

export default function OrdersPage() {
  const { pedidos, isLoading, updateStatus } = usePedidos();
  const [filter, setFilter] = React.useState<OrderStatus | "all">("all");

  // Adaptar los pedidos del backend al formato que usa la UI
  const orders: Order[] = React.useMemo(() => {
    if (!pedidos) return [];
    return pedidos.map((p) => ({
      id: String(p.id),
      code: `Pedido #${p.id}`,
      status: p.estado as OrderStatus,
      createdAt: p.createdat,
      customer: {
        name: (p as any).usuarios?.nombre ?? "Cliente desconocido",
        phone: (p as any).usuarios?.telefono ?? "",
        address: `${p.provincia ?? ""}, ${p.canton ?? ""}, ${p.barrio ?? ""}`.replace(/, ,/g, ","),
      },
      itemsSummary: "Ver productos del pedido", // podrías reemplazar con relación a pedido_item si la incluyes
      total: Number(p.total),
      note: p.referencia_envio ?? "",
    }));
  }, [pedidos]);

  const counts = React.useMemo(() => {
    const acc = { pendiente: 0, confirmado: 0, preparacion: 0, completado: 0 } as Record<OrderStatus, number>;
    for (const o of orders) {
      if (acc[o.status] !== undefined) acc[o.status]++;
    }
    return acc;
  }, [orders]);

  const visible = React.useMemo(
    () => (filter === "all" ? orders : orders.filter((o) => o.status === filter)),
    [orders, filter]
  );

  const changeStatus = async (id: string, next: OrderStatus) => {
    try {
      await updateStatus({ id: Number(id), estado: next });
      toast.success(`Estado actualizado a: ${STATUS_META[next].label}`);
    } catch (err) {
      toast.error("Error al actualizar el estado del pedido");
    }
  };

  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold tracking-tight">Gestión de Pedidos</h2>
        <p className="text-sm text-muted-foreground">
          Administra y actualiza el estado de tus pedidos.
        </p>
      </div>

      {isLoading ? (
        <div className="text-center text-muted-foreground py-10">Cargando pedidos...</div>
      ) : (
        <>
          <OrdersSummary counts={counts} filter={filter} onChange={setFilter} />
          <OrdersList orders={visible} onChangeStatus={changeStatus} />
        </>
      )}
    </section>
  );
}

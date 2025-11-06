"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Loader2, CheckCircle2, XCircle, RefreshCw } from "lucide-react";
import {
  listPedidosAsignados,
  updateEstadoPedido,
  createNotificacion,
} from "@/lib/repartidor";
import { supabase } from "@/lib/supabase/client";

export default function RepartidorOrdersPage() {
  const [pedidos, setPedidos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPedidos();
    setupRealtime();

    return () => {
      // 🔹 Limpiar el canal al desmontar
      supabase.channel("pedido_changes").unsubscribe();
    };
  }, []);

  // 🔹 Carga inicial
  const loadPedidos = async () => {
    setLoading(true);
    try {
      const data = await listPedidosAsignados();
      setPedidos(data);
    } catch (err) {
      console.error(err);
      toast.error("Error al cargar pedidos");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Escuchar cambios en tiempo real desde la tabla "pedido"
  const setupRealtime = async () => {
    const { data: auth } = await supabase.auth.getUser();
    const user = auth.user;
    if (!user) return;

    const channel = supabase
      .channel("pedido_changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "pedido",
          filter: `idrepartidor=eq.${user.id}`, // solo sus pedidos
        },
        (payload) => {
          console.log("📡 Cambio detectado:", payload);
          toast.info("Actualización en tus pedidos 🔄");
          loadPedidos();
        }
      )
      .subscribe();

    console.log("👂 Suscrito a cambios de pedidos en tiempo real");
  };

  // 🔹 Cambiar estado a entregado
  const marcarEntregado = async (p: any) => {
    try {
      await updateEstadoPedido(p.id, "entregado");
      await createNotificacion({
        idpedido: p.id,
        tipo_receptor: "cliente",
        titulo: "Pedido entregado 🎉",
        mensaje: "Tu pedido ha sido entregado exitosamente",
        idrepartidor: p.idrepartidor ?? null,
        idusuario: p.idusuario,
      });
      toast.success("Pedido marcado como entregado");
    } catch (err) {
      console.error(err);
      toast.error("Error al actualizar estado");
    }
  };

  // 🔹 Cambiar estado a cancelado
  const cancelarPedido = async (p: any) => {
    try {
      await updateEstadoPedido(p.id, "cancelado");
      toast.warning("Pedido cancelado");
    } catch (err) {
      console.error(err);
      toast.error("Error al cancelar pedido");
    }
  };

  if (loading)
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <Loader2 className="animate-spin h-5 w-5 text-neutral-500" />
        <span className="ml-2 text-neutral-500">Cargando pedidos...</span>
      </div>
    );

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Pedidos asignados</h1>
          <p className="text-neutral-600">
            Visualiza tus pedidos activos y actualiza su estado.
          </p>
        </div>
        <button
          onClick={loadPedidos}
          className="inline-flex items-center gap-2 rounded-lg border border-neutral-300 px-3 py-2 text-sm font-medium hover:bg-neutral-100"
        >
          <RefreshCw className="h-4 w-4" />
          Recargar
        </button>
      </div>

      <div className="grid gap-4">
        {pedidos.length === 0 && (
          <p className="text-sm text-neutral-500">
            No hay pedidos asignados actualmente.
          </p>
        )}

        {pedidos.map((p) => (
          <div
            key={p.id}
            className="rounded-xl border bg-white p-5 shadow-sm space-y-2 ring-1 ring-neutral-200"
          >
            <h3 className="font-semibold text-lg">
              Pedido #{p.id} —{" "}
              <span
                className={`${
                  p.estado === "entregado"
                    ? "text-green-600"
                    : p.estado === "en_camino"
                    ? "text-blue-600"
                    : p.estado === "cancelado"
                    ? "text-red-600"
                    : "text-neutral-700"
                }`}
              >
                {p.estado}
              </span>
            </h3>
            <p>
              <strong>Cliente:</strong> {p.usuarios?.nombre ?? "—"}
            </p>
            <p>
              <strong>Dirección:</strong> {p.direccionentrega ?? "—"}
            </p>
            <p>
              <strong>Total:</strong> ₡{p.total}
            </p>

            <div className="flex gap-3 mt-3">
              <button
                onClick={() => marcarEntregado(p)}
                disabled={p.estado === "entregado"}
                className="inline-flex items-center gap-2 rounded-lg bg-green-600 px-3 py-2 text-sm text-white font-semibold hover:bg-green-700 disabled:opacity-60"
              >
                <CheckCircle2 className="h-4 w-4" /> Entregado
              </button>
              <button
                onClick={() => cancelarPedido(p)}
                disabled={p.estado === "cancelado"}
                className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-3 py-2 text-sm text-white font-semibold hover:bg-red-700 disabled:opacity-60"
              >
                <XCircle className="h-4 w-4" /> Cancelar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState, useMemo } from "react";
import { toast } from "sonner";
import {
  RefreshCw,
  CheckCircle2,
  XCircle,
  Package,
  Truck,
  BadgeCheck,
  Loader2,
  User,
  MapPin,
} from "lucide-react";
import {
  listPedidosAsignados,
  updateEstadoPedido,
  createNotificacion,
} from "@/lib/repartidor";
import { supabase } from "@/lib/supabase/client";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

// ====================== COMPONENTES REUTILIZADOS ======================
function cx(...c: Array<string | false | null | undefined>) {
  return c.filter(Boolean).join(" ");
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
      className={`rounded-xl border bg-white p-4 text-left shadow-sm hover:shadow-md transition
        ${active ? "ring-2 ring-green-600/30" : ""}`}
    >
      <div className="flex items-center justify-between">
        <p className="text-sm text-neutral-600">{title}</p>
        <div className="text-neutral-500">{icon}</div>
      </div>
      <h3
        className={`mt-2 text-2xl font-bold ${
          title === "Confirmados"
            ? "text-blue-700"
            : title === "En camino"
            ? "text-amber-600"
            : title === "Entregados"
            ? "text-emerald-700"
            : title === "Cancelados"
            ? "text-red-600"
            : "text-neutral-800"
        }`}
      >
        {value}
      </h3>
    </button>
  );
}
// ======================================================================

export default function RepartidorOrdersPage() {
  const [pedidos, setPedidos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string | "all">("all");

  useEffect(() => {
    loadPedidos();
    setupRealtime();

    return () => {
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

  // 🔹 Escuchar cambios en tiempo real
  const setupRealtime = async () => {
    const { data: auth } = await supabase.auth.getUser();
    const user = auth.user;
    if (!user) return;

    const { data: perfil } = await supabase
      .from("perfil_repartidor")
      .select("id")
      .eq("idusuario", user.id)
      .maybeSingle();

    if (!perfil) return;

    const channel = supabase
      .channel("pedido_changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "pedido",
          filter: `idrepartidor=eq.${perfil.id}`,
        },
        (payload) => {
          console.log("📡 Cambio detectado:", payload);
          toast.info("Actualización en tus pedidos 🔄");
          loadPedidos();
        }
      )
      .subscribe();

    console.log("Suscrito a cambios de pedidos en tiempo real");
  };

  // 🔹 Cambiar estado
  const marcarEntregado = async (p: any) => {
    try {
      await updateEstadoPedido(p.id, "entregado");
      await createNotificacion({
        idpedido: p.id,
        tipo_receptor: "cliente",
        titulo: "Pedido entregado",
        mensaje: "Tu pedido ha sido entregado exitosamente",
        idrepartidor: p.idrepartidor ?? null,
        idusuario: p.idusuario,
      });
      toast.success("Pedido marcado como entregado");
      loadPedidos();
    } catch (err) {
      console.error(err);
      toast.error("Error al actualizar estado");
    }
  };

  const cancelarPedido = async (p: any) => {
    try {
      await updateEstadoPedido(p.id, "cancelado");
      toast.warning("Pedido cancelado");
      loadPedidos();
    } catch (err) {
      console.error(err);
      toast.error("Error al cancelar pedido");
    }
  };

  // 🔹 Contadores visuales
  const counts = useMemo(() => {
    const acc = {
      confirmado: 0,
      en_camino: 0,
      entregado: 0,
      cancelado: 0,
    } as Record<string, number>;
    for (const p of pedidos) {
      if (acc[p.estado] !== undefined) acc[p.estado]++;
    }
    return acc;
  }, [pedidos]);

  // 🔹 Filtro visual
  const visibles = useMemo(
    () => (filter === "all" ? pedidos : pedidos.filter((p) => p.estado === filter)),
    [pedidos, filter]
  );

  if (loading)
    return (
      <div className="flex items-center justify-center h-[60vh] text-muted-foreground">
        <Loader2 className="animate-spin h-5 w-5 mr-2" />
        Cargando pedidos asignados...
      </div>
    );

  return (
    <section className="space-y-6">
      {/* Encabezado */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold tracking-tight">
            Pedidos asignados
          </h2>
          <p className="text-sm text-muted-foreground">
            Visualiza y gestiona los pedidos que tienes asignados.
          </p>
        </div>
        <button
          onClick={loadPedidos}
          className="inline-flex items-center gap-2 rounded-lg border border-neutral-300 px-3 py-2 text-sm font-medium hover:bg-neutral-100"
        >
          <RefreshCw className="h-4 w-4" /> Recargar
        </button>
      </div>

      {/* 🔹 Resumen de estados */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <SummaryTile
          title="Confirmados"
          value={counts.confirmado}
          icon={<Package className="h-5 w-5" />}
          active={filter === "confirmado"}
          onClick={() => setFilter(filter === "confirmado" ? "all" : "confirmado")}
        />
        <SummaryTile
          title="En camino"
          value={counts.en_camino}
          icon={<Truck className="h-5 w-5" />}
          active={filter === "en_camino"}
          onClick={() => setFilter(filter === "en_camino" ? "all" : "en_camino")}
        />
        <SummaryTile
          title="Entregados"
          value={counts.entregado}
          icon={<BadgeCheck className="h-5 w-5" />}
          active={filter === "entregado"}
          onClick={() => setFilter(filter === "entregado" ? "all" : "entregado")}
        />
        <SummaryTile
          title="Cancelados"
          value={counts.cancelado}
          icon={<XCircle className="h-5 w-5" />}
          active={filter === "cancelado"}
          onClick={() => setFilter(filter === "cancelado" ? "all" : "cancelado")}
        />
      </div>

      {/* 🔹 Lista de pedidos */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-base">
            <Package className="h-5 w-5" />
            Pedidos asignados
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {visibles.length === 0 ? (
            <div className="grid place-items-center rounded-xl border bg-muted/40 p-10 text-center">
              <div className="space-y-2">
                <p className="font-medium">No hay pedidos asignados</p>
                <p className="text-sm text-muted-foreground">
                  Cambia el filtro o espera nuevas asignaciones.
                </p>
              </div>
            </div>
          ) : (
            visibles.map((p) => {
              const estadoLegible =
                p.estado
                  ?.replace(/_/g, " ")
                  ?.toLowerCase()
                  ?.replace(/\b\w/g, (l: string) => l.toUpperCase()) || "—";

              return (
                <div
                  key={p.id}
                  className="rounded-xl border bg-card p-5 shadow-sm space-y-2 ring-1 ring-neutral-200 hover:shadow-md transition"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h3 className="font-semibold text-lg">Pedido #{p.id}</h3>
                    <span
                      className={cx(
                        "text-sm font-semibold",
                        p.estado === "entregado" && "text-green-600",
                        p.estado === "en_camino" && "text-blue-600",
                        p.estado === "cancelado" && "text-red-600",
                        p.estado === "en_preparacion" && "text-yellow-600"
                      )}
                    >
                      {estadoLegible}
                    </span>
                  </div>

                  <div className="text-sm space-y-1">
                    <p className="flex items-center gap-2">
                      <User className="h-4 w-4 text-neutral-600" />
                      <span>
                        <strong>Cliente:</strong> {p.nombrecliente ?? "—"}
                      </span>
                    </p>

                    <p className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-neutral-600" />
                      <span>
                        <strong>Dirección:</strong> {p.direccionentrega ?? "—"}
                      </span>
                    </p>

                    <p>
                      <strong>Total:</strong> ₡{p.total}
                    </p>
                  </div>

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
              );
            })
          )}
        </CardContent>
      </Card>
    </section>
  );
}

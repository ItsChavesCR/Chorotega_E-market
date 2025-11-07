"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { toast } from "sonner";

type Props = {
  pedidoId: number;
  currentRepartidor?: number | null;
};

type Repartidor = {
  id: number;
  idusuario: string;
  zona: string | null;
  tipovehiculo: string | null;
  activo: boolean;
  reputacion: number;
  usuarios?: { nombre?: string | null; email?: string | null };
};

export default function AssignRepartidor({
  pedidoId,
  currentRepartidor,
}: Props) {
  const [repartidores, setRepartidores] = useState<Repartidor[]>([]);
  const [selected, setSelected] = useState<number | null>(
    currentRepartidor ?? null
  );
  const [loading, setLoading] = useState(false);

  // 🔹 Cargar repartidores activos
  useEffect(() => {
    const loadRepartidores = async () => {
      const { data, error } = await supabase
        .from("perfil_repartidor")
        .select(
          `id, idusuario, zona, tipovehiculo, reputacion, activo,
                 usuarios (nombre, email)`
        )
        .eq("activo", true);

      if (error) {
        console.error(error);
        toast.error("Error cargando repartidores");
      } else {
        setRepartidores((data as Repartidor[]) || []);
      }
    };
    loadRepartidores();
  }, []);

  // 🔹 Asignar repartidor al pedido
  const handleAssign = async () => {
    if (!selected) {
      toast.warning("Selecciona un repartidor");
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from("pedido")
        .update({ idrepartidor: selected })
        .eq("id", pedidoId);

      if (error) throw error;

      toast.success("Repartidor asignado correctamente 🚚");
    } catch (err) {
      console.error(err);
      toast.error("Error al asignar repartidor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-xl border bg-white p-4 shadow-sm">
      <h3 className="font-semibold text-sm mb-2">Asignar repartidor</h3>

      <select
        className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm"
        value={selected ?? ""}
        onChange={(e) => setSelected(Number(e.target.value))}
      >
        <option value="">Seleccionar repartidor...</option>
        {repartidores.map((r) => (
          <option key={r.id} value={r.id}>
            {r.usuarios?.nombre || r.usuarios?.email} — {r.tipovehiculo} (
            {r.zona})
          </option>
        ))}
      </select>

      <button
        onClick={handleAssign}
        disabled={loading}
        className="mt-3 w-full rounded-lg bg-green-700 px-4 py-2 text-sm font-semibold text-white hover:bg-green-800 disabled:opacity-60"
      >
        {loading ? "Asignando..." : "Asignar repartidor"}
      </button>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { toast } from "sonner";
import { Truck, Loader2 } from "lucide-react";

type Props = {
  pedidoId: number;
  currentRepartidor?: number | null;
};

export type UsuarioRelacionado = {
  nombre?: string | null;
  email?: string | null;
};

export type Repartidor = {
  id: number;
  nombre: string | null,
  idusuario: string;
  zona: string | null;
  tipovehiculo: string | null;
  activo: boolean;
  reputacion: number;
  usuarios?: UsuarioRelacionado;
};

export default function AssignRepartidor({ pedidoId, currentRepartidor }: Props) {
  const [repartidores, setRepartidores] = useState<Repartidor[]>([]);
  const [selected, setSelected] = useState<number | null>(currentRepartidor ?? null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadRepartidores = async () => {
      const { data, error } = await supabase
        .from("perfil_repartidor")
        .select(
          `id, idusuario, zona, tipovehiculo, reputacion, activo,
          nombre`

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
    <div className="mt-3 rounded-lg  bg-white ">
      <div className="flex items-center gap-2 mb-2">
        <Truck className="h-4 w-4 text-green-700" />
        <h3 className="text-sm font-semibold text-neutral-800">
          Asignar repartidor
        </h3>
      </div>

      <div className="flex flex-col sm:flex-row gap-2">
        <select
          className="flex-1 rounded-md border border-neutral-300 bg-neutral-50 px-2 py-1.5 text-sm text-neutral-800 outline-none "
          value={selected ?? ""}
          onChange={(e) => setSelected(Number(e.target.value))}
        >
          <option value="">Seleccionar repartidor...</option>
          {repartidores.map((r) => (
            <option key={r.id} value={r.id}>
              {r.nombre || ""} — {r.tipovehiculo ?? "Vehículo"}{" "}
              {r.zona ? `(${r.zona})` : ""}
            </option>
          ))}
        </select>

        <button
          onClick={handleAssign}
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 rounded-md bg-green-700 px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition hover:bg-green-800 disabled:opacity-60"
        >
          {loading ? (
            <>
              <Loader2 className="h-3.5 w-3.5 animate-spin" /> Asignando...
            </>
          ) : (
            <>
              <Truck className="h-3.5 w-3.5" /> Asignar
            </>
          )}
        </button>
      </div>
    </div>
  );
}

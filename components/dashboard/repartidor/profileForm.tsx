"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { toast } from "sonner";

type Props = {
  perfil: any;
  onProfileUpdated: () => void;
};

export default function ProfileForm({ perfil, onProfileUpdated }: Props) {
  const [form, setForm] = useState({
    tipovehiculo: perfil?.tipovehiculo ?? "",
    placa: perfil?.placa ?? "",
    zona: perfil?.zona ?? "",
    info_vehiculo: perfil?.info_vehiculo ?? "",
    activo: perfil?.activo ?? true,
  });
  const [saving, setSaving] = useState(false);

 const handleChange = (
  e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
) => {
  const target = e.target as HTMLInputElement | HTMLSelectElement;
  const { name, value, type } = target;
  const checked = (target as HTMLInputElement).checked; // solo aplica si es checkbox

  setForm((prev) => ({
    ...prev,
    [name]: type === "checkbox" ? checked : value,
  }));
};


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const { error } = await supabase
        .from("perfil_repartidor")
        .update({
          tipovehiculo: form.tipovehiculo,
          placa: form.placa,
          zona: form.zona,
          info_vehiculo: form.info_vehiculo,
          activo: form.activo,
        })
        .eq("id", perfil.id);

      if (error) throw error;

      toast.success("Perfil actualizado correctamente ✅");
      onProfileUpdated();
    } catch (err) {
      console.error(err);
      toast.error("Error al guardar cambios");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-xl border bg-white p-6 shadow-sm ring-1 ring-neutral-200 space-y-4"
    >
      <h3 className="font-semibold text-lg">Editar perfil</h3>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-neutral-700">Zona de reparto</label>
          <input
            type="text"
            name="zona"
            value={form.zona}
            onChange={handleChange}
            className="mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-700">Tipo de vehículo</label>
          <select
            name="tipovehiculo"
            value={form.tipovehiculo}
            onChange={handleChange}
            className="mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm"
          >
            <option value="">Selecciona...</option>
            <option value="Bicicleta">Bicicleta</option>
            <option value="Moto">Moto</option>
            <option value="Auto">Auto</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-700">Placa</label>
          <input
            type="text"
            name="placa"
            value={form.placa}
            onChange={handleChange}
            className="mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-700">
            Información del vehículo
          </label>
          <input
            type="text"
            name="info_vehiculo"
            value={form.info_vehiculo}
            onChange={handleChange}
            className="mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm"
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          name="activo"
          checked={form.activo}
          onChange={handleChange}
          className="rounded border-neutral-300 text-green-600"
        />
        <label className="text-sm font-medium text-neutral-700">
          Repartidor activo
        </label>
      </div>

      <button
        type="submit"
        disabled={saving}
        className="mt-4 inline-flex items-center justify-center rounded-lg bg-neutral-900 px-4 py-2 text-sm font-semibold text-white hover:bg-neutral-800 disabled:opacity-70"
      >
        {saving ? "Guardando..." : "Guardar cambios"}
      </button>
    </form>
  );
}

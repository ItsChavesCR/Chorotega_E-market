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
    nombre: perfil?.usuarios?.nombre ?? "",
    telefono: perfil?.usuarios?.telefono ?? "",
    tipovehiculo: perfil?.tipovehiculo ?? "",
    placa: perfil?.placa ?? "",
    cedula: perfil?.cedula ?? "",
    zona: perfil?.zona ?? "",
    info_vehiculo: perfil?.info_vehiculo ?? "",
    activo: perfil?.activo ?? true,
    foto_perfil: perfil?.foto_perfil ?? "",
  });

  const [saving, setSaving] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const target = e.target as HTMLInputElement | HTMLSelectElement;
    const { name, value, type } = target;
    const checked = (target as HTMLInputElement).checked;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      // 1) actualizar 'usuarios'
      const { error: userError } = await supabase
        .from("usuarios")
        .update({
          nombre: form.nombre,
          telefono: form.telefono,
        })
        .eq("id", perfil.idusuario);

      if (userError) throw userError;

      // 2) actualizar 'perfil_repartidor'
      const { error: profileError } = await supabase
        .from("perfil_repartidor")
        .update({
          tipovehiculo: form.tipovehiculo,
          placa: form.placa,
          cedula: form.cedula,
          zona: form.zona,
          info_vehiculo: form.info_vehiculo,
          activo: form.activo,
          foto_perfil: form.foto_perfil,
        })
        .eq("id", perfil.id);

      if (profileError) throw profileError;

      toast.success("Perfil actualizado correctamente ✅");
      onProfileUpdated();
    } catch (err) {
      console.error(err);
      toast.error("Error al guardar los cambios");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-xl border bg-white p-6 shadow-sm ring-1 ring-neutral-200 space-y-4"
    >
      <h3 className="font-semibold text-lg">Editar perfil del repartidor</h3>

      {/* Campos principales */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-neutral-700">
            Nombre completo
          </label>
          <input
            type="text"
            name="nombre"
            value={form.nombre}
            onChange={handleChange}
            className="mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-700">
            Teléfono
          </label>
          <input
            type="text"
            name="telefono"
            value={form.telefono}
            onChange={handleChange}
            className="mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-700">
            Cédula
          </label>
          <input
            type="text"
            name="cedula"
            value={form.cedula}
            onChange={handleChange}
            className="mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-700">
            Zona de reparto
          </label>
          <input
            type="text"
            name="zona"
            value={form.zona}
            onChange={handleChange}
            className="mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-700">
            Tipo de vehículo
          </label>
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
          <label className="block text-sm font-medium text-neutral-700">
            Placa
          </label>
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

        {/* Subida de foto */}
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            Foto de perfil
          </label>

          <label
            htmlFor="foto_perfil_upload"
            className="inline-flex items-center gap-2 cursor-pointer rounded-lg bg-green-700 px-4 py-2 text-sm font-semibold text-white hover:bg-green-800 transition"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1M12 12V4m0 0l-4 4m4-4l4 4"
              />
            </svg>
            <span>Subir nueva foto</span>
            <input
              id="foto_perfil_upload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (!file) return;

                try {
                  const fileExt = file.name.split(".").pop();
                  const fileName = `${perfil.idusuario}.${fileExt}`;
                  const filePath = `${fileName}`;

                  const { error: uploadError } = await supabase.storage
                    .from("avatars")
                    .upload(filePath, file, { upsert: true });

                  if (uploadError) throw uploadError;

                  const { data } = supabase.storage
                    .from("avatars")
                    .getPublicUrl(filePath);

                  setForm((prev) => ({ ...prev, foto_perfil: data.publicUrl }));
                  toast.success("Foto actualizada correctamente ✅");
                } catch (error) {
                  console.error(error);
                  toast.error("Error al subir la foto");
                }
              }}
            />
          </label>

          {form.foto_perfil && (
            <div className="mt-3 flex items-center gap-3">
              <img
                src={form.foto_perfil}
                alt="Avatar"
                className="h-16 w-16 rounded-full object-cover border border-neutral-300 ring-1 ring-green-600"
              />
              <p className="text-xs text-neutral-500">Vista previa</p>
            </div>
          )}
        </div>
      </div>
      {/* ← cierre correcto del grid */}

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
        className="mt-4 inline-flex items-center justify-center rounded-lg bg-black px-4 py-2 text-sm font-semibold text-white hover:bg-green-800 disabled:opacity-70"
      >
        {saving ? "Guardando..." : "Guardar cambios"}
      </button>
    </form>
  );
}

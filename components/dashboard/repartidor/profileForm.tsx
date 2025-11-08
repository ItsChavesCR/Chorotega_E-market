"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { toast } from "sonner";
import { motion } from "framer-motion";

type Props = {
  perfil: any;
  onProfileUpdated: () => void;
};

export default function ProfileForm({ perfil, onProfileUpdated }: Props) {
  const [user, setUser] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [updatingEstado, setUpdatingEstado] = useState(false);

  const [form, setForm] = useState({
    nombre: "",
    telefono: "",
    tipovehiculo: perfil?.tipovehiculo ?? "",
    placa: perfil?.placa ?? "",
    cedula: perfil?.cedula ?? "",
    zona: perfil?.zona ?? "",
    info_vehiculo: perfil?.info_vehiculo ?? "",
    activo: perfil?.activo ?? true,
    foto_perfil: perfil?.foto_perfil ?? "",
  });

  // Cargar metadata de Auth
  useEffect(() => {
    const fetchUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error) return console.error("Auth error:", error);
      if (data?.user) {
        setUser(data.user);
        setForm((prev) => ({
          ...prev,
          nombre: data.user.user_metadata?.nombre ?? prev.nombre,
          telefono: data.user.user_metadata?.telefono ?? prev.telefono,
        }));
      }
    };
    fetchUser();
  }, []);

  // 🔄 Toggle Activo/Inactivo (independiente del form)
  const handleToggleActivo = async () => {
    const next = !form.activo;
    try {
      setUpdatingEstado(true);
      setForm((p) => ({ ...p, activo: next }));
      const { error } = await supabase
        .from("perfil_repartidor")
        .update({ activo: next })
        .eq("id", perfil.id);
      if (error) throw error;
      toast.success(next ? "🟢 Disponible para pedidos" : "⚪ Desconectado");
      onProfileUpdated();
    } catch (e) {
      console.error(e);
      toast.error("No se pudo actualizar el estado");
      setForm((p) => ({ ...p, activo: !next })); // revertir
    } finally {
      setUpdatingEstado(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // ✅ SUBIR FOTO (bucket: avatars, upsert + publicUrl)
 const handleUploadPhoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (!file) return;

  try {
    // 🧩 Obtener el usuario autenticado
    const { data: auth, error: authError } = await supabase.auth.getUser();
    if (authError || !auth?.user) {
      toast.error("No hay usuario autenticado");
      return;
    }

    const idusuario = auth.user.id; // siempre disponible
    const ext = file.name.split(".").pop();
    const fileName = `${idusuario}.${ext}`;
    const filePath = fileName;

    // 🟢 Subir o reemplazar imagen
    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(filePath, file, { upsert: true });
    if (uploadError) throw uploadError;

    // 📸 Obtener URL pública (agregar timestamp para forzar refresco)
    const { data } = supabase.storage.from("avatars").getPublicUrl(filePath);
    const publicUrl = `${data.publicUrl}?t=${Date.now()}`;

    // 🧠 Actualizar en DB: si el perfil no existe aún, lo crea
    const { data: perfilExistente, error: fetchError } = await supabase
      .from("perfil_repartidor")
      .select("id")
      .eq("idusuario", idusuario)
      .maybeSingle();

    if (fetchError) throw fetchError;

    if (perfilExistente) {
      // ✅ Ya existe → actualiza
      await supabase
        .from("perfil_repartidor")
        .update({ foto_perfil: publicUrl })
        .eq("idusuario", idusuario);
    } else {
      // 🆕 No existe → crea
      await supabase.from("perfil_repartidor").insert({
        idusuario,
        activo: true,
        reputacion: 5,
        foto_perfil: publicUrl,
      });
    }

    // 🖼️ Actualizar la vista
    setForm((prev) => ({ ...prev, foto_perfil: publicUrl }));
    toast.success("Foto actualizada correctamente ✅");
    onProfileUpdated?.();
  } catch (err) {
    console.error(err);
    toast.error("Error al subir la foto");
  } finally {
    (e.target as HTMLInputElement).value = "";
  }
};


  // Guardar resto del formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (!user) throw new Error("Usuario no autenticado");

      // 1) Auth metadata (nombre/telefono)
      const { error: authError } = await supabase.auth.updateUser({
        data: { nombre: form.nombre, telefono: form.telefono },
      });
      if (authError) throw authError;

      // 2) Tabla usuarios
      const { error: userError } = await supabase
        .from("usuarios")
        .update({ nombre: form.nombre, telefono: form.telefono })
        .eq("id", user.id);
      if (userError) throw userError;

      // 3) Tabla perfil_repartidor (sin 'activo' aquí)
      const { error: prError } = await supabase
        .from("perfil_repartidor")
        .update({
          nombre: form.nombre,
          tipovehiculo: form.tipovehiculo,
          placa: form.placa,
          cedula: form.cedula,
          zona: form.zona,
          info_vehiculo: form.info_vehiculo,
          foto_perfil: form.foto_perfil,
        })
        .eq("id", perfil.id);
      if (prError) throw prError;

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
    <div className="rounded-xl border bg-white p-6 shadow-sm ring-1 ring-neutral-200 space-y-5">
      {/* Header: estado */}
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-lg">Editar perfil del repartidor</h3>
        <motion.button
          onClick={handleToggleActivo}
          whileTap={{ scale: 0.95 }}
          animate={{ scale: form.activo ? 1.05 : 1 }}
          disabled={updatingEstado}
          className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold shadow-sm transition ${
            form.activo
              ? "bg-green-600 text-white hover:bg-green-700"
              : "bg-neutral-300 text-neutral-700 hover:bg-neutral-400"
          }`}
        >
          <span
            className={`h-3 w-3 rounded-full ${
              form.activo ? "bg-green-300 animate-pulse" : "bg-gray-400"
            }`}
          />
          {form.activo ? "Activo" : "Inactivo"}
        </motion.button>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Bloque: Foto de perfil */}
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            Foto de perfil
          </label>
          <div className="flex items-center gap-4">
            <img
              src={form.foto_perfil || "/placeholder-user.png"}
              alt="Avatar"
              className="h-16 w-16 rounded-full object-cover border border-neutral-300 "
            />
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
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1M12 12V4m0 0l-4 4m4-4l4 4" />
              </svg>
              <span>Subir nueva foto</span>
              <input
                id="foto_perfil_upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleUploadPhoto}
              />
            </label>
          </div>
        </div>

        {/* Datos */}
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
        </div>

        <button
          type="submit"
          disabled={saving}
          className="mt-2 inline-flex items-center justify-center rounded-lg bg-black px-4 py-2 text-sm font-semibold text-white hover:bg-green-800 disabled:opacity-70"
        >
          {saving ? "Guardando..." : "Guardar cambios"}
        </button>
      </form>
    </div>
  );
}

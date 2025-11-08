/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { toast } from "sonner";
import Image from "next/image";

interface ProfileFormProps {
  perfil: any;
  onProfileUpdated?: () => void;
}

export default function ProfileForm({ perfil, onProfileUpdated }: ProfileFormProps) {
  const [form, setForm] = useState({
    nombrecomercio: perfil?.nombrecomercio || "",
    descripcion: perfil?.descripcion || "",
    ubicacion: perfil?.ubicacion || "",
    horario: perfil?.horario || "",
    idcategoria: perfil?.idcategoria || "",
    redessociales: perfil?.redessociales || {
      facebook: "",
      instagram: "",
      whatsapp: "",
    },
    logo: perfil?.logo || "",
  });

  const [saving, setSaving] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSocialChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      redessociales: { ...prev.redessociales, [name]: value },
    }));
  };

  const handleUploadLogo = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const ext = file.name.split(".").pop();
      const fileName = `${perfil.id}.${ext}`;
      const filePath = `logos/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file, { upsert: true });
      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from("avatars").getPublicUrl(filePath);
      const publicUrl = `${data.publicUrl}?t=${Date.now()}`;

      await supabase
        .from("perfil_emprendedor")
        .update({ logo: publicUrl })
        .eq("id", perfil.id);

      setForm((prev) => ({ ...prev, logo: publicUrl }));
      toast.success("Logo actualizado correctamente ✅");
      onProfileUpdated?.();
    } catch (err) {
      console.error(err);
      toast.error("Error al subir el logo");
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from("perfil_emprendedor")
        .update({
          nombrecomercio: form.nombrecomercio,
          descripcion: form.descripcion,
          ubicacion: form.ubicacion,
          horario: form.horario,
          idcategoria: form.idcategoria,
          redessociales: form.redessociales,
          logo: form.logo,
        })
        .eq("id", perfil.id);

      if (error) throw error;

      toast.success("Perfil actualizado correctamente ✅");
      onProfileUpdated?.();
    } catch (err) {
      console.error("Error al guardar perfil:", err);
      toast.error("No se pudo guardar el perfil");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="rounded-xl border bg-white p-6 shadow-sm ring-1 ring-neutral-200 space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-lg">Editar perfil del emprendedor</h3>
      </div>

      {/* Formulario */}
      <form className="space-y-4">
        {/* Foto / Logo */}
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            Logo del negocio
          </label>
          <div className="flex items-center gap-4">
            <Image
              src={form.logo || "/placeholder-store.png"}
              alt="Logo"
              width={64}
              height={64}
              className="h-16 w-16 rounded-full object-cover border border-neutral-300"
            />
            <label
              htmlFor="logo_upload"
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
              <span>Subir nuevo logo</span>
              <input
                id="logo_upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleUploadLogo}
              />
            </label>
          </div>
        </div>

        {/* Datos del negocio */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-neutral-700">
              Nombre del negocio
            </label>
            <input
              type="text"
              name="nombrecomercio"
              value={form.nombrecomercio}
              onChange={handleChange}
              className="mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700">
              Categoría
            </label>
            <input
              type="text"
              name="idcategoria"
              value={form.idcategoria}
              onChange={handleChange}
              className="mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-700">
            Descripción
          </label>
          <textarea
            name="descripcion"
            value={form.descripcion}
            onChange={handleChange}
            className="mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm"
            rows={3}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-neutral-700">
              Ubicación
            </label>
            <input
              type="text"
              name="ubicacion"
              value={form.ubicacion}
              onChange={handleChange}
              className="mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700">
              Horario
            </label>
            <input
              type="text"
              name="horario"
              value={form.horario}
              onChange={handleChange}
              className="mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm"
            />
          </div>
        </div>

        {/* Redes sociales */}
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label className="block text-sm font-medium text-neutral-700">
              Facebook
            </label>
            <input
              type="text"
              name="facebook"
              value={form.redessociales.facebook}
              onChange={handleSocialChange}
              className="mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700">
              Instagram
            </label>
            <input
              type="text"
              name="instagram"
              value={form.redessociales.instagram}
              onChange={handleSocialChange}
              className="mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700">
              WhatsApp
            </label>
            <input
              type="text"
              name="whatsapp"
              value={form.redessociales.whatsapp}
              onChange={handleSocialChange}
              className="mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm"
            />
          </div>
        </div>

        {/* Botón guardar */}
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="mt-4 inline-flex items-center justify-center rounded-lg bg-black px-4 py-2 text-sm font-semibold text-white hover:bg-green-800 disabled:opacity-70"
        >
          {saving ? "Guardando..." : "Guardar cambios"}
        </button>
      </form>
    </div>
  );
}

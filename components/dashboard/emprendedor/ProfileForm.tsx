"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/lib/supabase/client";
import { toast } from "sonner";

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
        })
        .eq("id", perfil.id);

      if (error) throw error;

      toast.success("Perfil actualizado correctamente");
      onProfileUpdated?.();
    } catch (err) {
      console.error("Error al guardar perfil:", err);
      toast.error("No se pudo guardar el perfil");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 bg-white rounded-xl shadow-sm p-6 border border-gray-200">
      <div>
        <Label>Nombre del negocio</Label>
        <Input
          name="nombrecomercio"
          value={form.nombrecomercio}
          onChange={handleChange}
        />
      </div>

      <div>
        <Label>Descripción</Label>
        <Textarea
          name="descripcion"
          value={form.descripcion}
          onChange={handleChange}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label>Ubicación</Label>
          <Input name="ubicacion" value={form.ubicacion} onChange={handleChange} />
        </div>

        <div>
          <Label>Horario</Label>
          <Input name="horario" value={form.horario} onChange={handleChange} />
        </div>
      </div>

      {/* Redes Sociales */}
      <div className="space-y-3">
        <Label className="font-semibold">Redes sociales</Label>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div>
            <Label>Facebook</Label>
            <Input
              name="facebook"
              placeholder="https://facebook.com/tu_pagina"
              value={form.redessociales.facebook}
              onChange={handleSocialChange}
            />
          </div>

          <div>
            <Label>Instagram</Label>
            <Input
              name="instagram"
              placeholder="https://instagram.com/tu_perfil"
              value={form.redessociales.instagram}
              onChange={handleSocialChange}
            />
          </div>

          <div>
            <Label>WhatsApp</Label>
            <Input
              name="whatsapp"
              placeholder="https://wa.me/50600000000"
              value={form.redessociales.whatsapp}
              onChange={handleSocialChange}
            />
          </div>
        </div>
      </div>

      <div className="pt-4">
        <Button onClick={handleSave} disabled={saving}>
          {saving ? "Guardando..." : "Guardar cambios"}
        </Button>
      </div>
    </div>
  );
}

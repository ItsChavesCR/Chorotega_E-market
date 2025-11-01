"use client";

import { useState } from "react";
import Image from "next/image";
import { supabase } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Loader2, Upload } from "lucide-react";

interface Props {
  idusuario: string;
  logoActual?: string | null;
  onUploadComplete: (newUrl: string) => void;
}

export default function AvatarUploader({
  idusuario,
  logoActual,
  onUploadComplete,
}: Props) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(logoActual || null);

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = event.target.files?.[0];
      if (!file) return;

      setUploading(true);

      // 🖼 Mostrar preview local
      const url = URL.createObjectURL(file);
      setPreview(url);

      const fileExt = file.name.split(".").pop();
      const fileName = `logo_${Date.now()}.${fileExt}`;
      const filePath = `${idusuario}/${fileName}`;

      // 🔹 Subir al bucket
      const { error: uploadError } = await supabase.storage
        .from("business-logos")
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      // 🔹 Obtener URL pública
      const { data } = supabase.storage
        .from("business-logos")
        .getPublicUrl(filePath);

      const publicUrl = data.publicUrl;

      // 🔹 Guardar en la tabla perfil_emprendedor
      const { error: updateError } = await supabase
        .from("perfil_emprendedor")
        .update({ logo: publicUrl })
        .eq("idusuario", idusuario);

      if (updateError) throw updateError;

      toast.success("Logo actualizado correctamente 🎉");
      onUploadComplete(publicUrl);
    } catch (err) {
      console.error(err);
      toast.error("Error al subir el logo");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative w-24 h-24">
        <Image
          src={preview || "/placeholder-store.png"}
          alt="Logo del negocio"
          fill
          className="object-cover rounded-full border shadow-sm"
        />
      </div>

      <div>
        <label
          htmlFor="logoUpload"
          className="cursor-pointer flex items-center gap-2 text-sm text-blue-600 hover:underline"
        >
          <Upload className="w-4 h-4" />
          {uploading ? "Subiendo..." : "Cambiar logo"}
        </label>
        <input
          id="logoUpload"
          type="file"
          accept="image/*"
          onChange={handleUpload}
          className="hidden"
          disabled={uploading}
        />
      </div>
    </div>
  );
}

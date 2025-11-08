/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { toast } from "sonner";
import ProfileCard from "@/components/dashboard/emprendedor/ProfileCard";
import ProfileForm from "@/components/dashboard/emprendedor/ProfileForm";
import { Loader2 } from "lucide-react";

export default function ProfilePage() {
  const [perfil, setPerfil] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrCreatePerfil();
  }, []);

  // 🔹 Cargar o crear perfil automáticamente
  const fetchOrCreatePerfil = async () => {
    setLoading(true);
    try {
      const { data: auth } = await supabase.auth.getUser();
      const user = auth.user;
      if (!user) {
        toast.error("No hay sesión activa.");
        return;
      }

      // Intentar cargar el perfil existente
      const { data, error } = await supabase
        .from("perfil_emprendedor")
        .select(`
          id,
          idusuario,
          nombrecomercio,
          descripcion,
          ubicacion,
          horario,
          logo,
          idcategoria,
          categoria:categoria(nombre)
        `)
        .eq("idusuario", user.id)
        .maybeSingle();

      // Si no existe, crearlo automáticamente
      if (!data) {
        const { error: insertError } = await supabase
          .from("perfil_emprendedor")
          .insert([
            {
              idusuario: user.id,
              nombrecomercio: "Nuevo negocio",
              descripcion: "",
              ubicacion: "",
              horario: "",
              logo: "",
              redessociales: {},
              idcategoria: null,
            },
          ]);

        if (insertError) throw insertError;

        toast.success("Perfil creado automáticamente 🎉");
        return fetchOrCreatePerfil();
      }

      setPerfil(data);
    } catch (err) {
      console.error("Error cargando perfil:", err);
      toast.error("Error al cargar o crear perfil.");
    } finally {
      setLoading(false);
    }
  };

  const handleProfileUpdated = async () => {
    await fetchOrCreatePerfil();
    toast.success("Perfil actualizado ✅");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <Loader2 className="animate-spin h-5 w-5 text-neutral-500" />
        <span className="ml-2 text-neutral-500">Cargando perfil...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8 p-6">
      <h1 className="text-2xl font-bold">Perfil del negocio</h1>
      <p className="text-neutral-600">
        Configura la información básica de tu emprendimiento.
      </p>

      <ProfileCard perfil={perfil} />
      <ProfileForm perfil={perfil} onProfileUpdated={handleProfileUpdated} />
    </div>
  );
}

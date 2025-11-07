"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import ProfileCard from "@/components/dashboard/repartidor/profileCard";
import ProfileForm from "@/components/dashboard/repartidor/profileForm";
import { getRepartidorProfile } from "@/lib/repartidor";

export default function RepartidorProfilePage() {
  const [perfil, setPerfil] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPerfil();
  }, []);

  const fetchPerfil = async () => {
    setLoading(true);
    try {
      const data = await getRepartidorProfile();
      setPerfil(data);
    } catch (err) {
      console.error(err);
      toast.error("Error al cargar perfil del repartidor");
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <Loader2 className="animate-spin h-5 w-5 text-neutral-500" />
        <span className="ml-2 text-neutral-500">Cargando perfil...</span>
      </div>
    );

  return (
    <div className="space-y-8 p-6">
      <h1 className="text-2xl font-bold">Perfil del Repartidor</h1>
      <p className="text-neutral-600">
        Administra tu información y estado de disponibilidad.
      </p>

      <ProfileCard perfil={perfil} />
      <ProfileForm perfil={perfil} onProfileUpdated={fetchPerfil} />
    </div>
  );
}

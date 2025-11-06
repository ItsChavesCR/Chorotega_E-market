"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import NotificationsModal from "@/components/dashboard/emprendedor/notificationsModal";
import { Loader2 } from "lucide-react";

type RoleName = "client" | "entrepreneur" | "courier" | "admin";

interface UsuarioRow {
  id_rol: number | null;
  roles:
    | { nombre: RoleName } // puede venir como objeto
    | { nombre: RoleName }[] // o como arreglo
    | null;
}

export default function NotificationsPage() {
  const [userId, setUserId] = useState<string | null>(null);
  const [role, setRole] = useState<RoleName | null>(null);
  const [perfilId, setPerfilId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);

      try {
        // 🔹 Obtener usuario autenticado
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

        if (userError) throw userError;
        if (!user) {
          console.warn("⚠️ No hay usuario autenticado.");
          return;
        }

        setUserId(user.id);

        // 🔹 Obtener datos del usuario + su rol
        const { data: usuario, error: usuarioError } = await supabase
          .from("usuarios")
          .select("id_rol, roles(nombre)")
          .eq("id", user.id)
          .maybeSingle<UsuarioRow>(); // 👈 Tipado explícito

        if (usuarioError) throw usuarioError;

        // 🔹 Manejar si Supabase devuelve roles como objeto o arreglo
        const rolNombre = Array.isArray(usuario?.roles)
          ? usuario.roles[0]?.nombre
          : usuario?.roles?.nombre;

        if (!rolNombre) {
          console.warn("⚠️ El usuario no tiene un rol definido.");
          return;
        }

        setRole(rolNombre);

        // 🔹 Obtener el perfil correspondiente según el rol
        if (rolNombre === "entrepreneur") {
          const { data: perfil } = await supabase
            .from("perfil_emprendedor")
            .select("id")
            .eq("idusuario", user.id)
            .maybeSingle();
          setPerfilId(perfil?.id ?? null);
        }

        if (rolNombre === "courier") {
          const { data: perfil } = await supabase
            .from("perfil_repartidor")
            .select("id")
            .eq("idusuario", user.id)
            .maybeSingle();
          setPerfilId(perfil?.id ?? null);
        }
      } catch (err) {
        console.error("❌ Error al obtener datos del usuario:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  // Estado de carga
  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-[60vh] text-neutral-500">
        <Loader2 className="animate-spin w-5 h-5 mb-2" />
        <span>Cargando notificaciones...</span>
      </div>
    );
  }

  // Sin sesión o rol
  if (!userId || !role) {
    return (
      <div className="flex flex-col justify-center items-center h-[60vh] text-neutral-500">
        <p>No se pudo cargar la sesión o el rol del usuario.</p>
      </div>
    );
  }

  // Render principal
  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4 text-neutral-900">Notificaciones</h1>
      {role !== "admin" && (
        <NotificationsModal
          userId={userId}
          role={role}
          perfilId={perfilId ?? undefined}
        />
      )}
    </div>
  );
}

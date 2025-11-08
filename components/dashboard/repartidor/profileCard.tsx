"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase/client";

type Props = {
  perfil: any;
};

export default function ProfileCard({ perfil }: Props) {
  const [user, setUser] = useState<any>(null);

  // 🔹 Obtener usuario actual (con metadata)
  useEffect(() => {
    const fetchUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error) {
        console.error("⚠️ Error obteniendo usuario:", error);
        return;
      }
      if (data?.user) {
        setUser(data.user);
      }
    };

    fetchUser();
  }, []);

  if (!perfil)
    return (
      <div className="rounded-xl border bg-white p-6 shadow-sm text-center">
        <p className="text-sm text-neutral-500">
          No se encontró el perfil del repartidor.
        </p>
      </div>
    );

  const userDb = perfil.usuarios || {};

  // 🔹 Nombre con prioridad: BD → Metadata → Fallback
  const nombreFinal =
    userDb.nombre || user?.user_metadata?.nombre || "Repartidor sin nombre";

  const activo = perfil.activo;

  return (
    <div className="rounded-xl border bg-white p-6 shadow-sm ring-1 ring-neutral-200 space-y-3 text-center">
      {/* 🔸 Foto con estado online */}
      <div className="relative mx-auto h-24 w-24">
        <div className="relative h-24 w-24 overflow-hidden rounded-full">
          <Image
            src={perfil.foto_perfil || "/placeholder-user.png"}
            alt="Foto del repartidor"
            fill
            className="object-cover"
          />
        </div>

        {/* 🔹 Icono de estado (online/offline) */}
        <div className="absolute bottom-1 right-1 flex items-center justify-center">
          {activo ? (
            <motion.span
              className="relative flex h-4 w-4"
              initial={{ scale: 0.8, opacity: 0.8 }}
              animate={{
                scale: [1, 1.2, 1],
                opacity: [1, 0.7, 1],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <span className="absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75 animate-ping"></span>
              <span className="relative inline-flex h-4 w-4 rounded-full bg-green-500 border border-white"></span>
            </motion.span>
          ) : (
            <span className="inline-flex h-4 w-4 rounded-full bg-gray-400 border border-white"></span>
          )}
        </div>
      </div>

      {/* 🔸 Nombre */}
      <h2 className="text-lg font-semibold text-neutral-900">{nombreFinal}</h2>

      {/* 🔸 Estado con texto */}
      <div className="flex items-center justify-center gap-2 text-sm">
        {activo ? (
          <>
            <span className="text-green-600 font-medium">En línea</span>
          </>
        ) : (
          <span className="text-neutral-500 font-medium">Desconectado</span>
        )}
      </div>
    </div>
  );
}

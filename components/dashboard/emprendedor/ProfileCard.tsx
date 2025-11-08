/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export default function ProfileCard({ perfil }: { perfil: any }) {
  if (!perfil)
    return (
      <div className="rounded-xl border bg-white p-6 shadow-sm text-center">
        <p className="text-sm text-neutral-500">
          No se encontró el perfil del emprendedor.
        </p>
      </div>
    );

  const activo = perfil.activo ?? true; // opcional si agregas estado
  const nombre = perfil.nombrecomercio || "Negocio sin nombre";
  const categoria = perfil.categoria?.nombre || "Sin categoría asignada";
  const descripcion =
    perfil.descripcion || "Aún no hay descripción del negocio.";

  return (
    <div className="rounded-xl border bg-white p-6 shadow-sm ring-1 ring-neutral-200 space-y-3 text-center">
      {/* 🔸 Foto */}
      <div className="relative mx-auto h-24 w-24">
        <div className="relative h-24 w-24 overflow-hidden rounded-full">
          <Image
            src={perfil.logo || "/placeholder-store.png"}
            alt="Logo del negocio"
            fill
            className="object-cover"
          />
        </div>

        {/* 🔹 Estado (si lo usas) */}
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

      {/* 🔸 Nombre y categoría */}
      <h2 className="text-lg font-semibold text-neutral-900">{nombre}</h2>
      <p className="text-sm text-neutral-600">{categoria}</p>

      {/* 🔸 Descripción */}
      <p className="text-sm text-neutral-700 mt-2">{descripcion}</p>

      {/* 🔸 Estado opcional */}
      <div className="flex items-center justify-center gap-2 text-sm">
        {activo ? (
          <span className="text-green-600 font-medium">Activo</span>
        ) : (
          <span className="text-neutral-500 font-medium">Inactivo</span>
        )}
      </div>
    </div>
  );
}

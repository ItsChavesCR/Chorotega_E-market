"use client";

import Image from "next/image";

type Props = {
  perfil: any;
};

export default function ProfileCard({ perfil }: Props) {
  if (!perfil)
    return (
      <div className="rounded-xl border bg-white p-6 shadow-sm">
        <p className="text-sm text-neutral-500">
          No se encontró el perfil del repartidor.
        </p>
      </div>
    );

  const user = perfil.usuarios || {}; // relación con tabla usuarios

  return (
    <div className="rounded-xl border bg-white p-6 shadow-sm ring-1 ring-neutral-200 space-y-4">
      {/* 🔹 Cabecera */}
      <div className="flex flex-col items-center text-center space-y-3">
        <div className="relative h-24 w-24 overflow-hidden rounded-full">
          <Image
            src={perfil.foto_perfil || "/placeholder-user.png"}
            alt="Foto del repartidor"
            fill
            className="object-cover"
          />
        </div>

        <div>
          <h2 className="text-lg font-semibold text-neutral-900">
            {user.nombre || "Asigna un nombre"}
          </h2>
          
        </div>
      </div>
    </div>
  );
}

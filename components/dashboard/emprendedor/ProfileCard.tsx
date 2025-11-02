"use client";

import { Card } from "@/components/ui/card";

export default function ProfileCard({ perfil }: { perfil: any }) {
  return (
    <Card className="p-6 space-y-3">
      <div className="flex items-center gap-4">
        <img
          src={perfil.logo || "/placeholder-store.png"}
          alt="Logo del negocio"
          className="h-20 w-20 rounded-full object-cover border"
        />
        <div>
          <h2 className="text-xl font-semibold">{perfil.nombrecomercio}</h2>
          <p className="text-sm text-neutral-600">
            {perfil.categoria?.nombre || "Sin categoría asignada"}
          </p>
        </div>
      </div>

      <p className="text-sm text-neutral-700 mt-2">
        {perfil.descripcion || "Aún no hay descripción del negocio."}
      </p>
    </Card>
  );
}

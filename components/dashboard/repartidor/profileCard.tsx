"use client";

type Props = {
  perfil: any;
};

export default function ProfileCard({ perfil }: Props) {
  if (!perfil)
    return (
      <div className="rounded-xl border bg-white p-6 shadow-sm">
        <p className="text-sm text-neutral-500">No se encontró el perfil.</p>
      </div>
    );

  return (
    <div className="rounded-xl border bg-white p-6 shadow-sm ring-1 ring-neutral-200 space-y-2">
      <p><strong>Zona:</strong> {perfil.zona || "No especificada"}</p>
      <p><strong>Tipo de vehículo:</strong> {perfil.tipovehiculo || "No asignado"}</p>
      <p><strong>Placa:</strong> {perfil.placa || "No registrada"}</p>
      <p><strong>Información vehículo:</strong> {perfil.info_vehiculo || "N/A"}</p>
      <p><strong>Reputación:</strong> ⭐ {perfil.reputacion ?? "Sin datos"}</p>
      <p><strong>Estado:</strong> {perfil.activo ? "🟢 Activo" : "🔴 Inactivo"}</p>
    </div>
  );
}

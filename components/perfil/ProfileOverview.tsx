"use client"

import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export default function ProfileOverview() {
  const router = useRouter()
  const [profile, setProfile] = useState<any>(null)

  useEffect(() => {
    // ⚙️ Simulación de usuario mientras no hay auth
    setProfile({
      nombre: "Usuario Invitado",
      correo: "invitado@example.com",
      telefono: "0000-0000",
    })
  }, [])

  if (!profile) return <p>Cargando perfil...</p>

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm space-y-3">
      <h2 className="text-lg font-semibold">Mi perfil</h2>
      <p><strong>Nombre:</strong> {profile.nombre}</p>
      <p><strong>Correo:</strong> {profile.correo}</p>
      <p><strong>Teléfono:</strong> {profile.telefono}</p>

      <button
        onClick={() => router.push("/pedidos")}
        className="mt-3 bg-primary text-white text-sm px-3 py-2 rounded-md hover:bg-primary/90"
      >
        Ver mis pedidos
      </button>
    </div>
  )
}

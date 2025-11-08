"use client"

import HeaderIcons from "@/components/dashboard/clientes/HeaderIcons"
import NotificationsModal from "@/components/dashboard/emprendedor/notificationsModal"

export default function ClientesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* 🔝 NAVBAR */}
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md shadow-sm border-b border-gray-200 px-6 sm:px-10 py-3 flex justify-between items-center">
        {/* Título + Notificaciones */}
        <div className="flex items-center gap-4">
         <h1 className="text-lg font-semibold tracking-tight">Chorotega E-Market</h1>\

          {/* 🔔 Notificaciones */}
          <NotificationsModal role="client" userId="auth.user.id" />
        </div>

        {/* ❤️ 🛒 👤 Iconos derechos */}
        <HeaderIcons />
      </nav>

      {/* 🧭 CONTENIDO */}
      <main className="pt-8 px-4 sm:px-8">{children}</main>
    </div>
  )
}

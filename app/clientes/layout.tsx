"use client"

import HeaderIcons from "@/components/dashboard/clientes/HeaderIcons"

export default function ClientesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gray-100">
    
      <nav className="sticky top-0 z-50 bg-white shadow-sm border-b border-gray-200 px-4 sm:px-8 py-3 flex justify-between items-center">
        <h1 className="text-lg font-semibold text-gray-800">
          Chorotega E-Market
        </h1>
        <HeaderIcons />
      </nav>

     
      <main className="pt-6 sm:pt-8 px-4 sm:px-8">{children}</main>
    </div>
  )
}

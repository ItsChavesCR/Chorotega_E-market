"use client"

import { ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"
import FavoritesList from "@/components/favoritos/FavoritesList"

export default function FavoritosPage() {
  const router = useRouter()

  return (
    <main className="max-w-6xl mx-auto p-6">
      {/* 🔙 Botón Volver */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-gray-600 mb-6"
      >
        <ArrowLeft className="h-4 w-4" /> Volver
      </button>

      <FavoritesList />
    </main>
  )
}

"use client"

import { useClientStore } from "@/hooks/useClientStore"
import { useRouter } from "next/navigation"
import { HeartOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import FavoriteCard from "./FavoriteCard"

export default function FavoritesList() {
  const { favoritos, clearFavorites } = useClientStore()
  const router = useRouter()

  if (favoritos.length === 0)
    return (
      <div className="flex flex-col items-center justify-center h-80 text-gray-500 bg-white rounded-lg shadow-sm border">
        <HeartOff className="w-10 h-10 mb-3 text-gray-400" />
        <p className="text-base">No tienes productos en favoritos.</p>
        <Button
          onClick={() => router.push("/clientes")}
          variant="default"
          className="mt-4 px-5 py-2 rounded-md text-sm"
        >
          Explorar productos
        </Button>
      </div>
    )

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-lg font-semibold text-gray-800">Mis favoritos ❤️</h2>
        <Button
          onClick={clearFavorites}
          variant="destructive"
          size="sm"
          className="text-white"
        >
          Vaciar lista
        </Button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {favoritos.map((producto) => (
          <FavoriteCard key={producto.id} producto={producto} />
        ))}
      </div>
    </div>
  )
}

"use client"

import { Heart } from "lucide-react"
import { useRouter } from "next/navigation"
import { useClientStore } from "@/hooks/useClientStore"

export default function FavoritesIcon() {
  const { favoritos } = useClientStore()
  const router = useRouter()

  return (
    <button
      onClick={() => router.push("/favoritos")}
      className="relative hover:text-red-500 transition"
      title="Ver favoritos"
    >
      <Heart className="w-5 h-5" />
     
    </button>
  )
}

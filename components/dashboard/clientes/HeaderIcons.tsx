"use client"

import CartDrawer from "./CartDrawer"
import FavoritesIcon from "./FavoritesIcon"
import { User } from "lucide-react"
import { useRouter } from "next/navigation"
import NotificationsModal from "@/components/dashboard/emprendedor/Notifications"

export default function HeaderIcons() {
  const router = useRouter()

  return (
    <div className="flex gap-5 items-center text-gray-700">

	  <NotificationsModal
        role="cliente"
        userId="uuid-del-cliente" // ← temporal, luego reemplazas con auth.user.id
      />

      <FavoritesIcon />

      <CartDrawer />

      <button
        onClick={() => router.push("/perfil")}
        className="hover:text-gray-900 transition"
        title="Mi perfil"
      >
        <User className="w-5 h-5 hover:text-gray-900 cursor-pointer transition" />
      </button>
    </div>
  )
}

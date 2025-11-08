"use client"

import CartDrawer from "./CartDrawer"
import FavoritesIcon from "./FavoritesIcon"
import { LogOut, ChevronDown, User, MessageSquare, ClipboardList } from "lucide-react"
import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase/client"

export default function HeaderIcons() {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [loggingOut, setLoggingOut] = useState(false)
  const [userInitial, setUserInitial] = useState<string>("U")
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const fetchUser = async () => {
      const { data } = await supabase.auth.getUser()
      const name = data?.user?.user_metadata?.nombre || data?.user?.email || "U"
      setUserInitial(name.charAt(0).toUpperCase())
    }
    fetchUser()
  }, [])

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleLogout = async () => {
    try {
      setLoggingOut(true)
      const { error } = await supabase.auth.signOut()
      await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ event: "SIGNED_OUT", session: null }),
      })
      if (error) console.error("Error al cerrar sesión:", error.message)
    } catch (error) {
      console.error("Error inesperado en logout:", error)
    } finally {
      setLoggingOut(false)
      window.location.href = "/auth/login"
    }
  }

  return (
    <div className="flex items-center gap-5 text-gray-700">
      <FavoritesIcon />
      <CartDrawer />

      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setOpen(!open)}
          className="flex items-center gap-2 hover:text-gray-900 transition"
          title="Perfil"
        >
          <div className="w-8 h-8 rounded-full bg-gray-800 text-white flex items-center justify-center font-semibold">
            {userInitial}
          </div>
          <ChevronDown
            className={`w-4 h-4 text-gray-600 transition-transform duration-200 ${
              open ? "rotate-180" : "rotate-0"
            }`}
          />
        </button>

        {open && (
          <div className="absolute right-0 mt-2 w-44 bg-white rounded-xl shadow-lg border border-gray-100 animate-fadeIn z-50 overflow-hidden">
            <button
              onClick={() => {
                router.push("/perfil")
                setOpen(false)
              }}
              className="flex w-full items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 transition"
            >
              <User className="h-4 w-4" />
              Mi perfil
            </button>

            <button
              onClick={() => {
                router.push("/pedidos")
                setOpen(false)
              }}
              className="flex w-full items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 transition"
            >
              <ClipboardList className="h-4 w-4" />
              Mis pedidos
            </button>

            <button
              onClick={() => {
                router.push("/mensajes")
                setOpen(false)
              }}
              className="flex w-full items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 transition"
            >
              <MessageSquare className="h-4 w-4" />
              Mensajes
            </button>

            <div className="border-t border-gray-100" />

            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white hover:bg-red-50 hover:text-red-600 transition"
            >
              <LogOut className="h-4 w-4" />
              {loggingOut ? "Cerrando..." : "Cerrar sesión"}
            </button>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-5px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
      `}</style>
    </div>
  )
}

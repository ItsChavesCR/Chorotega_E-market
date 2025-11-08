"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase/client"
import { motion, AnimatePresence } from "framer-motion"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { ArrowLeft, Edit3, Save, XCircle, Loader2 } from "lucide-react"

export default function ProfileOverview() {
  const router = useRouter()
  const [profile, setProfile] = useState<any>(null)
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [editing, setEditing] = useState(false)
  const [ordersCount, setOrdersCount] = useState<number>(0)
  const [activeOrders, setActiveOrders] = useState<number>(0)
  const [totalSpent, setTotalSpent] = useState<number>(0)

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data: authData, error: authError } = await supabase.auth.getUser()
        if (authError) throw authError
        if (!authData?.user) return
        setUser(authData.user)

        // 👤 Perfil
        const { data: userData, error: userError } = await supabase
          .from("usuarios")
          .select("id, nombre, telefono, email")
          .eq("id", authData.user.id)
          .single()
        if (userError) throw userError
        setProfile(userData)

        // 📦 Pedidos totales
        const { count: totalPedidos, error: pedidosError } = await supabase
          .from("pedido")
          .select("id", { count: "exact", head: true })
          .eq("idusuario", authData.user.id)
        if (pedidosError) throw pedidosError
        setOrdersCount(totalPedidos || 0)

        // 🚚 Pedidos activos (filtrados en cliente)
        const { data: allPedidos, error: pedidosDataError } = await supabase
          .from("pedido")
          .select("estado, total")
          .eq("idusuario", authData.user.id)
        if (pedidosDataError) throw pedidosDataError

        const estadosActivos = ["pendiente", "en_proceso", "en_preparacion"]
        const activos = allPedidos?.filter((p) =>
          estadosActivos.includes(p.estado)
        ).length
        setActiveOrders(activos || 0)

        // 💰 Total gastado
        const total = allPedidos?.reduce(
          (acc, p) => acc + Number(p.total || 0),
          0
        )
        setTotalSpent(total || 0)
      } catch (e) {
        console.error("Error cargando perfil:", e)
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || !profile) return
    try {
      setSaving(true)
      const { error } = await supabase
        .from("usuarios")
        .update({
          nombre: profile.nombre,
          telefono: profile.telefono,
        })
        .eq("id", user.id)
      if (error) throw error

      toast.success("✅ Cambios guardados correctamente", {
        description: "Tu información personal fue actualizada.",
      })
      setEditing(false)
    } catch (e) {
      console.error(e)
      toast.error("❌ Error al guardar los cambios")
    } finally {
      setSaving(false)
    }
  }

  if (loading)
    return (
      <div className="flex justify-center items-center h-80 text-gray-500">
        Cargando perfil...
      </div>
    )

  if (!profile)
    return (
      <div className="rounded-xl border bg-white p-6 shadow-sm text-center">
        <p className="text-sm text-gray-500">
          No se encontró el perfil del cliente.
        </p>
      </div>
    )

  const initial =
    profile.nombre?.charAt(0)?.toUpperCase() ||
    profile.email?.charAt(0)?.toUpperCase() ||
    "C"

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-3xl mx-auto mt-4"
    >
      {/* 🔙 Volver */}
      <button
        onClick={() => router.back()}
        className="mb-4 flex items-center gap-2 text-gray-600 hover:text-gray-900 transition"
      >
        <ArrowLeft className="h-4 w-4" />
        Volver
      </button>

      {/* 🧊 Tarjeta principal con tonos verdes */}
      <div className="relative bg-gradient-to-br from-green-100 via-emerald-100 to-lime-100 rounded-2xl text-gray-800 py-10 shadow-sm border border-green-100 text-center px-6">
        <div className="flex flex-col items-center space-y-4">
          {/* Avatar */}
          <div className="w-24 h-24 rounded-full bg-white text-green-600 text-3xl font-bold flex items-center justify-center shadow-inner border border-green-200">
            {initial}
          </div>

          {/* Nombre + editar */}
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-semibold text-gray-800">
              {profile.nombre}
            </h2>
            {!editing ? (
              <button
                onClick={() => setEditing(true)}
                className="p-1.5 rounded-full text-gray-600 hover:bg-white/70 hover:text-gray-900 border border-gray-200 transition"
                title="Editar perfil"
              >
                <Edit3 className="h-4 w-4" />
              </button>
            ) : (
              <button
                onClick={() => setEditing(false)}
                className="p-1.5 rounded-full text-red-500 hover:bg-red-50 border border-red-200 transition"
                title="Cancelar edición"
              >
                <XCircle className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Datos del usuario o formulario */}
          <AnimatePresence mode="wait">
            {!editing ? (
              <motion.div
                key="view"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-gray-700 space-y-1"
              >
                <p className="text-sm">{profile.email}</p>
                <p className="text-sm">
                  <span className="font-semibold">Teléfono:</span>{" "}
                  {profile.telefono || "No registrado"}
                </p>
                <p className="text-xs text-gray-500 mt-2">
                  Miembro desde:{" "}
                  {new Date(user.created_at).toLocaleDateString("es-CR", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </motion.div>
            ) : (
              <motion.form
                key="edit"
                onSubmit={handleSave}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="w-full max-w-sm mx-auto space-y-4"
              >
                <div>
                  <label className="block text-sm text-gray-600 text-left mb-1">
                    Nombre completo
                  </label>
                  <input
                    type="text"
                    value={profile.nombre || ""}
                    onChange={(e) =>
                      setProfile({ ...profile, nombre: e.target.value })
                    }
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-green-300 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-600 text-left mb-1">
                    Teléfono
                  </label>
                  <input
                    type="text"
                    value={profile.telefono || ""}
                    onChange={(e) =>
                      setProfile({ ...profile, telefono: e.target.value })
                    }
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-green-300 outline-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={saving}
                  className="w-full flex justify-center items-center gap-2 rounded-lg bg-green-600 text-white text-sm font-semibold py-2 hover:bg-green-700 transition disabled:opacity-70"
                >
                  {saving ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Guardando...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      Guardar cambios
                    </>
                  )}
                </button>
              </motion.form>
            )}
          </AnimatePresence>

          {/* 📦 Resumen de pedidos */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 flex justify-center gap-10 text-sm text-gray-600"
          >
            <div className="text-center">
              <p className="text-xl font-semibold text-gray-800">
                {ordersCount}
              </p>
              <p>Pedidos realizados</p>
            </div>
            <div className="text-center">
              <p className="text-xl font-semibold text-gray-800">
                {activeOrders}
              </p>
              <p>Activos</p>
            </div>
            <div className="text-center">
              <p className="text-xl font-semibold text-gray-800">
                ₡{totalSpent.toLocaleString()}
              </p>
              <p>Total gastado</p>
            </div>
          </motion.div>

          {/* 🔘 Ver pedidos */}
          <button
            onClick={() => router.push("/pedidos")}
            className="mt-6 bg-white text-green-600 font-semibold px-6 py-2 rounded-lg shadow hover:bg-green-50 transition"
          >
            Ver mis pedidos
          </button>

          {/* 💬 Mensaje personalizado */}
          <motion.p
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-6 text-gray-600 italic text-sm"
          >
            🌾 “Gracias por ser parte de{" "}
            <span className="font-semibold text-green-700">
              Chorotega E-Market
            </span>{" "}
            💚 — ¡Apoyás el comercio local con cada compra!” 🌱
          </motion.p>
        </div>
      </div>
    </motion.div>
  )
}

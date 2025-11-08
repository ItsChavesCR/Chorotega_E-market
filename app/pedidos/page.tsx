"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase/client"
import { useClientOrdersList, Pedido } from "@/hooks/useClientOrdersList"
import { motion } from "framer-motion"
import {
  Loader2,
  ArrowLeft,
  Package,
  Truck,
  CheckCircle2,
  XCircle,
  Clock,
} from "lucide-react"
import { useRouter } from "next/navigation"

export default function MisPedidosPage() {
  const [userId, setUserId] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    const fetchUser = async () => {
      const { data } = await supabase.auth.getUser()
      if (data?.user) setUserId(data.user.id)
    }
    fetchUser()
  }, [])

  const { orders, loading } = useClientOrdersList(userId || undefined)

  const getEstadoBadge = (estado: string) => {
    const base =
      "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold capitalize shadow-sm"

    switch (estado) {
      case "pendiente":
        return (
          <span className={`${base} bg-blue-100 text-blue-700`}>
            <Clock size={14} /> Pendiente
          </span>
        )
      case "en_preparacion":
      case "en-preparacion":
        return (
          <span className={`${base} bg-blue-100 text-blue-700`}>
            <Package size={14} /> En preparación
          </span>
        )
      case "en_camino":
      case "en-camino":
        return (
          <span className={`${base} bg-orange-100 text-orange-700`}>
            <Truck size={14} /> En camino
          </span>
        )
      case "completado":
        return (
          <span className={`${base} bg-emerald-100 text-emerald-700`}>
            <CheckCircle2 size={14} /> Completado
          </span>
        )
      case "cancelado":
        return (
          <span className={`${base} bg-red-100 text-red-700`}>
            <XCircle size={14} /> Cancelado
          </span>
        )
      default:
        return (
          <span className={`${base} bg-gray-100 text-gray-600`}>
            {estado.replace("_", " ")}
          </span>
        )
    }
  }

  if (loading)
    return (
      <div className="flex justify-center items-center h-[60vh] text-gray-500">
        <Loader2 className="animate-spin w-5 h-5 mr-2" /> Cargando pedidos...
      </div>
    )

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-5xl mx-auto p-6"
    >
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition"
      >
        <ArrowLeft className="h-4 w-4" /> Volver
      </button>

      <h1 className="text-3xl font-bold text-gray-900 mb-8">Mis pedidos</h1>

      {orders.length === 0 ? (
        <div className="text-center py-20 text-gray-500">
          <Package className="w-10 h-10 mx-auto mb-3 text-gray-400" />
          <p>No tienes pedidos todavía.</p>
        </div>
      ) : (
        <div className="grid gap-5">
          {orders.map((order: Pedido, index: number) => (
            <motion.div
              key={order.id}
              whileHover={{ scale: 1.01 }}
              className="bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-md p-5 transition-all"
            >
              <div className="flex justify-between items-center mb-3">
                <div>
                  <p className="font-semibold text-gray-900 text-lg">
                    Pedido #{orders.length - index}
                  </p>
                  <p className="text-sm text-gray-500">
                    {new Date(order.createdat).toLocaleDateString("es-CR", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                </div>
                {getEstadoBadge(order.estado)}
              </div>

              <div className="text-gray-700">
                <p className="text-base font-semibold">
                  Total:{" "}
                  <span className="text-gray-900">
                    ₡{order.total.toLocaleString()}
                  </span>
                </p>
              </div>

        <div className="flex justify-end mt-4">
  <button
    onClick={() => router.push(`/pedidos/${order.id}`)}
    className="text-sm font-semibold text-green-700 hover:text-green-900 transition"
  >
    Ver detalle →
  </button>
</div>


            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  )
}

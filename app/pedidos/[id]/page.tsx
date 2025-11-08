"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase/client"
import { motion } from "framer-motion"
import {
  Loader2,
  ArrowLeft,
  MapPin,
  Clock,
  Truck,
  Store,
  Coins,
  BadgeCheck,
} from "lucide-react"

export default function PedidoDetallePage() {
  const { id } = useParams<{ id: string }>()
  const [pedido, setPedido] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const fetchPedido = async () => {
      if (!id) return
      setLoading(true)
      try {
        const pedidoId = Number(id)
        const { data, error } = await supabase
          .from("pedido")
          .select(`
            id,
            total,
            totalenvio,
            estado,
            direccionentrega,
            createdat,
            idemprendedor,
            perfil_emprendedor ( nombrecomercio, logo )
          `)
          .eq("id", pedidoId)
          .single()
        if (error || !data) throw error
        setPedido(data)
      } catch (err) {
        console.error("Error al cargar pedido:", err)
      } finally {
        setLoading(false)
      }
    }
    fetchPedido()
  }, [id])

  if (loading)
    return (
      <div className="flex justify-center items-center h-[60vh] text-gray-500">
        <Loader2 className="animate-spin w-5 h-5 mr-2" /> Cargando detalle...
      </div>
    )

  if (!pedido)
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-gray-500">
        <p>No se encontró el pedido solicitado.</p>
      </div>
    )

  const formatDate = (date: string) =>
    new Date(date).toLocaleString("es-CR", {
      dateStyle: "long",
      timeStyle: "short",
    })

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-3xl mx-auto p-6"
    >
      {/* 🔙 Volver */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-gray-600 mb-6"
      >
        <ArrowLeft className="h-4 w-4" /> Volver
      </button>

      {/* 🏪 Encabezado */}
      <div className="flex items-center gap-3 mb-6">
        {pedido.perfil_emprendedor?.logo && (
          <img
            src={pedido.perfil_emprendedor.logo}
            alt="Logo negocio"
            className="w-12 h-12 rounded-full border border-green-200 object-cover"
          />
        )}
        <h1 className="text-3xl font-bold flex items-center gap-3 text-gray-900">
          <Store className="h-7 w-7 text-green-600" />
          Pedido de {pedido.perfil_emprendedor?.nombrecomercio || "Emprendedor"}
        </h1>
      </div>

      {/* 🧾 Detalle */}
      <motion.div
        whileHover={{ scale: 1.01 }}
        transition={{ type: "spring", stiffness: 100, damping: 15 }}
        className="bg-gradient-to-br from-green-50 to-white border border-gray-100 
                   rounded-3xl shadow-lg shadow-green-100/50 
                   p-8 space-y-6 transition-all duration-300"
      >
        {/* Estado */}
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 text-gray-700"
        >
          <BadgeCheck className="h-5 w-5 text-green-600" />
          <div>
            <span className="font-medium">Estado:</span>{" "}
            <span className="capitalize">{pedido.estado.replaceAll("_", " ")}</span>
          </div>
        </motion.div>

        <hr className="border-t border-green-100 opacity-60" />

        {/* Dirección */}
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-start gap-3 text-gray-700"
        >
          <MapPin className="h-5 w-5 text-green-600 mt-1" />
          <div>
            <span className="font-medium block">Dirección de entrega:</span>
            <p>{pedido.direccionentrega || "Sin especificar"}</p>
          </div>
        </motion.div>

        <hr className="border-t border-green-100 opacity-60" />

        {/* Totales */}
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col gap-3"
        >
          <div className="flex items-center gap-3 text-gray-700">
            <Coins className="h-5 w-5 text-green-600" />
            <span className="font-medium">Total:</span>
            <span>₡{pedido.total.toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-3 text-gray-700">
            <Truck className="h-5 w-5 text-green-600" />
            <span className="font-medium">Costo de envío:</span>
            <span>₡{pedido.totalenvio?.toLocaleString() || 0}</span>
          </div>
        </motion.div>

        <hr className="border-t border-green-100 opacity-60" />

        {/* Fecha */}
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 text-gray-700"
        >
          <Clock className="h-5 w-5 text-green-600" />
          <span className="font-medium">Fecha de creación:</span>{" "}
          {formatDate(pedido.createdat)}
        </motion.div>
      </motion.div>
    </motion.div>
  )
}

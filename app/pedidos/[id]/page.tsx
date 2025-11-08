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
  ShoppingBag,
  ImageOff,
} from "lucide-react"

export default function PedidoDetallePage() {
  const { id } = useParams<{ id: string }>()
  const [pedido, setPedido] = useState<any>(null)
  const [productos, setProductos] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const fetchPedido = async () => {
      if (!id) return
      setLoading(true)

      try {
        const pedidoId = Number(id)

        // 🔹 Obtener pedido principal
        const { data: pedidoData, error: pedidoError } = await supabase
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

        if (pedidoError || !pedidoData) throw pedidoError
        setPedido(pedidoData)

        // 🔹 Obtener ítems del pedido
        const { data: items, error: itemsError } = await supabase
          .from("pedido_item")
          .select("*")
          .eq("idpedido", pedidoId)

        if (itemsError) throw itemsError

        if (!items || items.length === 0) {
          setProductos([])
          return
        }

        // 🔹 IDs de productos
        const productIds = items
          .map((i) => Number(i.idproducto))
          .filter((n) => !isNaN(n))

        if (productIds.length === 0) {
          setProductos([])
          return
        }

        // 🔹 Obtener productos con nombre + imágenes
        const { data: productosData, error: productosError } = await supabase
          .from("producto")
          .select("id, nombre, imagenes") // 👈 corregido aquí
          .in("id", productIds)

        if (productosError) throw productosError

        // 🔹 Vincular items + productos
        const itemsConDetalles = items.map((item) => {
          const producto = productosData?.find(
            (p) => p.id === item.idproducto
          )
          return {
            ...item,
            producto,
          }
        })

        setProductos(itemsConDetalles)
      } catch (err: any) {
        console.error("❌ Error al cargar pedido:", err?.message || err)
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
        <div className="flex items-center gap-3 text-gray-700">
          <BadgeCheck className="h-5 w-5 text-green-600" />
          <span className="font-medium">Estado:</span>
          <span className="capitalize">
            {pedido.estado.replaceAll("_", " ")}
          </span>
        </div>

        <hr className="border-t border-green-100 opacity-60" />

        {/* Dirección */}
        <div className="flex items-start gap-3 text-gray-700">
          <MapPin className="h-5 w-5 text-green-600 mt-1" />
          <div>
            <span className="font-medium block">Dirección de entrega:</span>
            <p>{pedido.direccionentrega || "Sin especificar"}</p>
          </div>
        </div>

        <hr className="border-t border-green-100 opacity-60" />

        {/* Totales */}
        <div className="flex flex-col gap-3">
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
        </div>

        <hr className="border-t border-green-100 opacity-60" />

        {/* Productos */}
        <div className="pt-2">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <ShoppingBag className="h-5 w-5 text-green-600" />
            Productos del pedido
          </h2>

          {productos.length === 0 ? (
            <p className="text-gray-500 text-sm">
              No se encontraron productos en este pedido.
            </p>
          ) : (
            <div className="space-y-4">
              {productos.map((item) => {
                const img =
                  item.producto?.imagenes?.[0] || null // ✅ usar la primera imagen del array
                return (
                  <div
                    key={item.idproducto}
                    className="flex items-center justify-between bg-white border border-green-100 rounded-xl p-3 shadow-sm"
                  >
                    <div className="flex items-center gap-3">
                      {img ? (
                        <img
                          src={img}
                          alt={item.producto?.nombre}
                          className="w-14 h-14 object-cover rounded-lg border border-gray-100"
                        />
                      ) : (
                        <div className="w-14 h-14 rounded-lg flex items-center justify-center bg-gray-100 border border-gray-200">
                          <ImageOff className="w-5 h-5 text-gray-400" />
                        </div>
                      )}
                      <div>
                        <p className="font-medium text-gray-800">
                          {item.producto?.nombre || "Producto no disponible"}
                        </p>
                        <p className="text-sm text-gray-500">
                          Cantidad: {item.cantidad}
                        </p>
                      </div>
                    </div>
                    <div className="text-right text-gray-700">
                      <p className="text-sm">
                        ₡{Number(item.preciounitario).toLocaleString()}
                      </p>
                      <p className="text-xs text-gray-500">
                        Subtotal: ₡
                        {Number(
                          item.preciounitario * item.cantidad
                        ).toLocaleString()}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        <hr className="border-t border-green-100 opacity-60" />

        {/* Fecha */}
        <div className="flex items-center gap-3 text-gray-700">
          <Clock className="h-5 w-5 text-green-600" />
          <span className="font-medium">Fecha de creación:</span>{" "}
          {formatDate(pedido.createdat)}
        </div>
      </motion.div>
    </motion.div>
  )
}

"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase/client"

// ✅ Tipado del pedido
export interface Pedido {
  id: number
  idusuario: string
  estado: string
  total: number
  createdat: string
  idemprendedor?: number
  idrepartidor?: number
  emprendedor?: string | null
  repartidor?: string | null
}

export function useClientOrdersList(userId?: string): {
  orders: Pedido[]
  loading: boolean
} {
  const [orders, setOrders] = useState<Pedido[]>([])
  const [loading, setLoading] = useState(true)

  const fetchOrders = async () => {
    if (!userId) return

    const { data, error } = await supabase
      .from("pedido") // 👈 tabla correcta (singular)
      .select("id, idusuario, estado, total, createdat, idemprendedor, idrepartidor")
      .eq("idusuario", userId) // 👈 columna correcta
      .order("createdat", { ascending: false })

    if (error) {
      console.error("Error cargando pedidos:", error)
      return
    }

    const withExtras: Pedido[] = await Promise.all(
      (data || []).map(async (pedido: any) => {
        let emprendedorNombre: string | null = null
        let repartidorNombre: string | null = null

        if (pedido.idemprendedor) {
          const { data: emp } = await supabase
            .from("perfil_emprendedor")
            .select("nombre")
            .eq("id", pedido.idemprendedor)
            .single()
          emprendedorNombre = emp?.nombre || null
        }

        if (pedido.idrepartidor) {
          const { data: rep } = await supabase
            .from("perfil_repartidor")
            .select("nombre")
            .eq("id", pedido.idrepartidor)
            .single()
          repartidorNombre = rep?.nombre || null
        }

        return {
          ...pedido,
          emprendedor: emprendedorNombre,
          repartidor: repartidorNombre,
        }
      })
    )

    setOrders(withExtras)
    setLoading(false)
  }

  useEffect(() => {
    fetchOrders()

    if (!userId) return
    const channel = supabase
      .channel(`pedido_cliente_${userId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "pedido", // 👈 también singular
          filter: `idusuario=eq.${userId}`,
        },
        () => fetchOrders()
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [userId])

  return { orders, loading }
}

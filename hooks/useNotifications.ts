"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase/client"

export type NotificationStatus = "pending" | "in-transit" | "completed" | "cancelled"

export interface Notification {
  id: string
  idpedido?: number
  idusuario?: string
  idemprendedor?: number
  idrepartidor?: number
  tipo_receptor: "client" | "entrepreneur" | "repartidor"
  titulo: string
  mensaje?: string
  icono?: string
  estado?: NotificationStatus
  isread?: boolean
  created_at: string
}

interface UseNotificationsProps {
  userId?: string
  role: "client" | "entrepreneur" | "repartidor"
  perfilId?: number // para emprendedor o repartidor (bigint)
}

export function useNotifications({ userId, role, perfilId }: UseNotificationsProps) {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)

  // 📥 Cargar notificaciones iniciales
  const fetchNotifications = async () => {
    setLoading(true)

    let query = supabase.from("notificaciones").select("*").order("created_at", { ascending: false })

    if (role === "client" && userId) query = query.eq("idusuario", userId)
    if (role === "entrepreneur" && perfilId) query = query.eq("idemprendedor", perfilId)
    if (role === "repartidor" && perfilId) query = query.eq("idrepartidor", perfilId)

    const { data, error } = await query

    if (!error && data) setNotifications(data as Notification[])
    setLoading(false)
  }

  // 🔔 Suscripción en tiempo real
  useEffect(() => {
    fetchNotifications()

    const channel = supabase
      .channel("realtime-notificaciones")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "notificaciones" },
        (payload) => {
          const newNotif = payload.new as Notification

          const isTarget =
            (role === "client" && newNotif.idusuario === userId) ||
            (role === "entrepreneur" && newNotif.idemprendedor === perfilId) ||
            (role === "repartidor" && newNotif.idrepartidor === perfilId)

          if (isTarget) {
            setNotifications((prev) => [newNotif, ...prev])
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [userId, perfilId, role])

  // 🟢 Marcar todas como leídas
  const markAllAsRead = async () => {
    const ids = notifications.map((n) => n.id)
    if (!ids.length) return

    const { error } = await supabase
      .from("notificaciones")
      .update({ isread: true })
      .in("id", ids)

    if (!error) setNotifications((prev) => prev.map((n) => ({ ...n, isread: true })))
  }

  // ❌ Eliminar una notificación
  const dismissNotification = async (id: string) => {
    const { error } = await supabase.from("notificaciones").delete().eq("id", id)
    if (!error) setNotifications((prev) => prev.filter((n) => n.id !== id))
  }

  return { notifications, loading, markAllAsRead, dismissNotification }
}

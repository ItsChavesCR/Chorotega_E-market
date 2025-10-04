"use client"

import { useState } from "react"
import { Bell, Check, Truck, ShoppingCart, X, Filter, CheckCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

type NotificationStatus = "completed" | "in-transit" | "pending" | "cancelled"

interface Notification {
  id: string
  icon: "check" | "truck" | "cart"
  title: string
  subtitle?: string
  status: NotificationStatus
  timestamp: string
  isRead?: boolean
  date: Date
}

const statusConfig: Record<NotificationStatus, { label: string; className: string; iconBg: string }> = {
  completed: {
    label: "Completado",
    className:
      "bg-emerald-500/10 text-emerald-700 border-emerald-500/20 hover:bg-emerald-500/20 dark:text-emerald-400 dark:border-emerald-500/30",
    iconBg: "bg-gradient-to-br from-emerald-400 to-emerald-600 text-white shadow-lg shadow-emerald-500/30",
  },
  "in-transit": {
    label: "En camino",
    className:
      "bg-blue-500/10 text-blue-700 border-blue-500/20 hover:bg-blue-500/20 dark:text-blue-400 dark:border-blue-500/30",
    iconBg: "bg-gradient-to-br from-blue-400 to-blue-600 text-white shadow-lg shadow-blue-500/30",
  },
  pending: {
    label: "Pendiente",
    className:
      "bg-amber-500/10 text-amber-700 border-amber-500/20 hover:bg-amber-500/20 dark:text-amber-400 dark:border-amber-500/30",
    iconBg: "bg-gradient-to-br from-amber-400 to-amber-600 text-white shadow-lg shadow-amber-500/30",
  },
  cancelled: {
    label: "Cancelado",
    className:
      "bg-red-500/10 text-red-700 border-red-500/20 hover:bg-red-500/20 dark:text-red-400 dark:border-red-500/30",
    iconBg: "bg-gradient-to-br from-red-400 to-red-600 text-white shadow-lg shadow-red-500/30",
  },
}

const iconMap = {
  check: Check,
  truck: Truck,
  cart: ShoppingCart,
}

interface NotificationsProps {
  notifications?: Notification[]
  onMarkAllRead?: () => void
  onDismiss?: (id: string) => void
  onNotificationClick?: (id: string) => void
}

export function Notifications({
  notifications = defaultNotifications,
  onMarkAllRead,
  onDismiss,
  onNotificationClick,
}: NotificationsProps) {
  const [filter, setFilter] = useState<NotificationStatus | "all">("all")

  const filteredNotifications = filter === "all" ? notifications : notifications.filter((n) => n.status === filter)

  const unreadCount = notifications.filter((n) => !n.isRead).length

  const groupedNotifications = filteredNotifications.reduce(
    (groups, notification) => {
      const today = new Date()
      const yesterday = new Date(today)
      yesterday.setDate(yesterday.getDate() - 1)

      let dateKey: string
      if (isSameDay(notification.date, today)) {
        dateKey = "Hoy"
      } else if (isSameDay(notification.date, yesterday)) {
        dateKey = "Ayer"
      } else {
        dateKey = "Anteriores"
      }

      if (!groups[dateKey]) {
        groups[dateKey] = []
      }
      groups[dateKey].push(notification)
      return groups
    },
    {} as Record<string, Notification[]>,
  )

  return (
    <Card className="w-full max-w-md mx-auto shadow-xl border-border/50 overflow-hidden">
      <div className="relative bg-gradient-to-r from-background via-muted/30 to-background border-b">
        <div className="flex items-center justify-between p-5">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full" />
              <div className="relative flex items-center justify-center h-10 w-10 rounded-full bg-primary/10 border border-primary/20">
                <Bell className="h-5 w-5 text-primary" />
              </div>
              {unreadCount > 0 && (
                <div className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 border-2 border-background flex items-center justify-center">
                  <span className="text-[10px] font-bold text-white">{unreadCount}</span>
                </div>
              )}
            </div>
            <div>
              <h2 className="text-lg font-semibold">Notificaciones</h2>
              <p className="text-xs text-muted-foreground">
                {unreadCount > 0 ? `${unreadCount} sin leer` : "Todo al día"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-9 w-9">
                  <Filter className="h-4 w-4" />
                  <span className="sr-only">Filtrar notificaciones</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setFilter("all")}>Todas</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilter("completed")}>Completadas</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilter("in-transit")}>En camino</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilter("pending")}>Pendientes</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilter("cancelled")}>Canceladas</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button
              variant="ghost"
              size="sm"
              onClick={onMarkAllRead}
              className="text-xs text-muted-foreground hover:text-foreground gap-1.5"
              disabled={unreadCount === 0}
            >
              <CheckCheck className="h-3.5 w-3.5" />
              Marcar leídas
            </Button>
          </div>
        </div>

        {filter !== "all" && (
          <div className="px-5 pb-3">
            <Badge variant="secondary" className="text-xs">
              Filtro: {statusConfig[filter].label}
              <button onClick={() => setFilter("all")} className="ml-2 hover:text-foreground">
                <X className="h-3 w-3" />
              </button>
            </Badge>
          </div>
        )}
      </div>

      <ScrollArea className="h-[500px]">
        {Object.entries(groupedNotifications).map(([dateKey, notifs]) => (
          <div key={dateKey}>
            <div className="sticky top-0 z-10 bg-muted/80 backdrop-blur-sm px-5 py-2 border-b border-border/50">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{dateKey}</h3>
            </div>
            <div className="divide-y divide-border/50">
              {notifs.map((notification) => (
                <NotificationItem
                  key={notification.id}
                  notification={notification}
                  onDismiss={onDismiss}
                  onClick={onNotificationClick}
                />
              ))}
            </div>
          </div>
        ))}

        {filteredNotifications.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 px-4">
            <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-3">
              <Bell className="h-8 w-8 text-muted-foreground" />
            </div>
            <p className="text-sm font-medium text-muted-foreground">No hay notificaciones</p>
            <p className="text-xs text-muted-foreground mt-1">
              {filter !== "all" ? "Intenta cambiar el filtro" : "Estás al día"}
            </p>
          </div>
        )}
      </ScrollArea>
    </Card>
  )
}

function NotificationItem({
  notification,
  onDismiss,
  onClick,
}: {
  notification: Notification
  onDismiss?: (id: string) => void
  onClick?: (id: string) => void
}) {
  const Icon = iconMap[notification.icon]
  const statusInfo = statusConfig[notification.status]

  return (
    <div
      className={cn(
        "flex items-start gap-4 p-4 transition-all duration-200 hover:bg-muted/50 group relative cursor-pointer",
        !notification.isRead && "bg-primary/5 border-l-2 border-l-primary",
        notification.isRead && "opacity-75 hover:opacity-100",
      )}
      onClick={() => onClick?.(notification.id)}
    >
      <div className="relative shrink-0">
        <div
          className={cn(
            "flex items-center justify-center h-11 w-11 rounded-xl transition-transform duration-200 group-hover:scale-110",
            statusInfo.iconBg,
          )}
        >
          <Icon className="h-5 w-5" />
        </div>
      </div>

      <div className="flex-1 min-w-0 space-y-2">
        <div className="flex items-start justify-between gap-2">
          <p
            className={cn(
              "text-sm leading-tight transition-colors",
              !notification.isRead ? "font-semibold" : "font-medium",
            )}
          >
            {notification.title}
          </p>
          {!notification.isRead && <div className="h-2 w-2 rounded-full bg-primary shrink-0 mt-1 animate-pulse" />}
        </div>

        {notification.subtitle && (
          <p className="text-xs text-muted-foreground leading-relaxed">{notification.subtitle}</p>
        )}

        <div className="flex items-center gap-2 flex-wrap">
          <Badge variant="secondary" className={cn("text-xs font-medium border", statusInfo.className)}>
            {statusInfo.label}
          </Badge>
          <span className="text-xs text-muted-foreground flex items-center gap-1">{notification.timestamp}</span>
        </div>
      </div>

      {onDismiss && (
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-all duration-200 shrink-0 hover:bg-destructive/10 hover:text-destructive"
          onClick={(e) => {
            e.stopPropagation()
            onDismiss(notification.id)
          }}
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Descartar notificación</span>
        </Button>
      )}
    </div>
  )
}

function isSameDay(date1: Date, date2: Date): boolean {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  )
}

const defaultNotifications: Notification[] = [
  {
    id: "1",
    icon: "check",
    title: "Tu pedido #123 fue entregado",
    status: "completed",
    timestamp: "5:12 p.m.",
    isRead: false,
    date: new Date(),
  },
  {
    id: "2",
    icon: "truck",
    title: "Tu pedido #123 está en camino",
    status: "in-transit",
    timestamp: "4:30 p.m.",
    isRead: false,
    date: new Date(),
  },
  {
    id: "3",
    icon: "cart",
    title: "Tu pedido #123 fue confirmado por",
    subtitle: "Artesanías Chorotega",
    status: "pending",
    timestamp: "11:45 a.m.",
    isRead: true,
    date: new Date(Date.now() - 86400000), // Yesterday
  },
  {
    id: "4",
    icon: "cart",
    title: "Tu pedido #122 fue cancelado",
    status: "cancelled",
    timestamp: "9:20 a.m.",
    isRead: true,
    date: new Date(Date.now() - 86400000), // Yesterday
  },
  {
    id: "5",
    icon: "check",
    title: "Tu pedido #121 fue entregado",
    subtitle: "Gracias por tu compra",
    status: "completed",
    timestamp: "11 abr, 2025",
    isRead: true,
    date: new Date(Date.now() - 172800000), // 2 days ago
  },
]

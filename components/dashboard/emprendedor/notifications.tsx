"use client";

import { useState } from "react";
import { Bell, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { useNotifications } from "@/hooks/useNotifications";

interface NotificationsProps {
  userId?: string;
  role: "client" | "entrepreneur" | "repartidor";
  perfilId?: number;
}

export default function Notifications({ userId, role, perfilId }: NotificationsProps) {
  const [open, setOpen] = useState(false);
  const { notifications, loading, markAllAsRead, dismissNotification } =
    useNotifications({ userId, role, perfilId });

  const unread = notifications.filter((n) => !n.isread).length;

  return (
    <div className="relative">
      {/* Botón campana */}
      <Button variant="ghost" size="icon" onClick={() => setOpen(!open)}>
        <Bell className="w-5 h-5 hover:text-gray-900 transition" />
        {unread > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1.5">
            {unread}
          </span>
        )}
      </Button>

      {open && (
        <div className="absolute right-0 mt-2 w-96 bg-white border rounded-lg shadow-lg z-50">
          {/* Encabezado */}
          <div className="flex items-center justify-between px-4 py-3 border-b">
            <h2 className="font-semibold text-sm">Notificaciones</h2>
            <div className="flex gap-2">
              {unread > 0 && (
                <Button variant="ghost" size="sm" onClick={markAllAsRead}>
                  Marcar leídas
                </Button>
              )}
              <Button variant="ghost" size="icon" onClick={() => setOpen(false)}>
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Lista */}
          <ScrollArea className="h-96">
            {loading ? (
              <div className="flex justify-center items-center h-full py-10 text-gray-400">
                <Loader2 className="animate-spin w-5 h-5 mr-2" /> Cargando...
              </div>
            ) : notifications.length === 0 ? (
              <div className="flex flex-col items-center py-10 text-gray-500">
                <Bell className="w-8 h-8 mb-2" />
                <p>No tienes notificaciones</p>
              </div>
            ) : (
              notifications.map((n) => (
                <Card
                  key={n.id}
                  className={`m-2 p-3 border-l-4 transition-all ${
                    n.estado === "completed"
                      ? "border-emerald-500"
                      : n.estado === "in-transit"
                      ? "border-blue-500"
                      : n.estado === "cancelled"
                      ? "border-red-500"
                      : "border-amber-400"
                  } ${n.isread ? "opacity-70" : "opacity-100"}`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium text-sm">{n.titulo}</p>
                      <p className="text-xs text-gray-500">{n.mensaje}</p>
                      <Badge
                        variant="secondary"
                        className={`mt-2 text-[10px] ${
                          n.isread ? "opacity-70" : "bg-primary/10"
                        }`}
                      >
                        {n.estado}
                      </Badge>
                    </div>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => dismissNotification(n.id)}
                      className="text-gray-400 hover:text-red-500"
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                </Card>
              ))
            )}
          </ScrollArea>
        </div>
      )}
    </div>
  );
}

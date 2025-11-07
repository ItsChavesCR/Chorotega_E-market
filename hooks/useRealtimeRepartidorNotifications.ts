"use client";

import { useEffect } from "react";
import { supabase } from "@/lib/supabase/client";
import { toast } from "sonner";

/**
 * 🔔 Escucha notificaciones nuevas para el repartidor autenticado
 */
export function useRealtimeRepartidorNotifications() {
  useEffect(() => {
    let channel: ReturnType<typeof supabase.channel>;

    const subscribe = async () => {
      const { data: auth } = await supabase.auth.getUser();
      const user = auth.user;
      if (!user) return;

      console.log("🔌 Escuchando notificaciones para repartidor:", user.id);

      channel = supabase
        .channel("notificaciones_repartidor")
        .on(
          "postgres_changes",
          {
            event: "INSERT",
            schema: "public",
            table: "notificaciones",
            filter: `idrepartidor=eq.${user.id}`,
          },
          (payload) => {
            const n = payload.new as any;
            if (n.tipo_receptor === "repartidor") {
              toast(
                n.titulo ?? "Nueva notificación 🚚",
                { description: n.mensaje ?? "Tienes una nueva actualización." }
              );
              console.log("📬 Notificación nueva:", n);
            }
          }
        )
        .subscribe();
    };

    subscribe();

    return () => {
      console.log("❌ Desuscribiendo canal realtime de notificaciones");
      channel?.unsubscribe();
    };
  }, []);
}

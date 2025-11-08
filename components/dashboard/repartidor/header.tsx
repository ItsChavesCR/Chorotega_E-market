"use client";

import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase/client";
import { getUnreadNotificationsCount } from "@/lib/repartidor";
import NotificationsModal from "../emprendedor/notificationsModal";

type HeaderRepartidorProps = {
  onOpenSidebar: () => void;
  onOpenNotifications?: () => void;
};

export default function HeaderRepartidor({ onOpenSidebar }: HeaderRepartidorProps) {
  const [notifCount, setNotifCount] = useState<number>(0);
  const [nombre, setNombre] = useState<string>("Repartidor");

  // 🔹 Cargar nombre del usuario autenticado
  useEffect(() => {
    const fetchUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (data?.user?.user_metadata?.nombre) {
        setNombre(data.user.user_metadata.nombre);
      }
    };
    fetchUser();
  }, []);

  // 🔹 Simulación temporal de notificaciones (más adelante lo conectamos en tiempo real)
 const loadCount = async () => {
  const count = await getUnreadNotificationsCount();
  setNotifCount(count);
};


  return (
    <header className="sticky top-0 z-40 border-b bg-white px-4 py-3 shadow-sm">
      <div className="flex items-center justify-between">
        {/* 🔹 Izquierda: Logo + info */}
        <div className="flex items-center gap-3">
          {/* Botón menú solo visible en móvil */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={onOpenSidebar}
            aria-label="Abrir menú"
          >
            <Menu className="h-5 w-5" />
          </Button>

          {/* Logo + texto */}
          <div className="flex items-center gap-2">
            <img
              src="/Chorotega.svg"
              alt="Logo Chorotega"
              width={45}
              height={45}
              className="rounded-sm object-contain"
            />
            <div className="flex flex-col leading-tight">
              <span className="text-base font-semibold text-neutral-900">
                Chorotega E-Market
              </span>
              <span className="text-xs text-neutral-500">
                Panel repartidor • {nombre}
              </span>
            </div>/
              <NotificationsModal role="repartidor" />
          </div>
        </div>
      </div>
    </header>
  );
}

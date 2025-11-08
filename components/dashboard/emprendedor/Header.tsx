"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import NotificationsModal from "./notificationsModal";
import Image from "next/image";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";


export default function Header({ onOpenSidebar }: { onOpenSidebar: () => void }) {
  const [nombre_negocio, setNombre] = useState<string>("");

  // 🔹 Cargar nombre del usuario autenticado
  useEffect(() => {
    const fetchUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (data?.user?.user_metadata?.nombre_negocio) {
        setNombre(data.user.user_metadata.nombre_negocio);
      }
    };
    fetchUser();
  }, []);

  return (
    <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60 ">
      <div className="flex h-18 items-center gap-3 px-5 md:pl-4">
        <div className="md:hidden">
          <Button variant="ghost" size="icon" aria-label="Abrir menú" onClick={onOpenSidebar}>
            <Menu className="h-5 w-5" />
          </Button>
        </div>
        <Image
          src={"/Chorotega.svg"}
          alt="Logo"
          width={64}
          height={64}
          className="h-16 w-16 rounded-full object-cover border"
        />
        <div className="flex flex-col">
          <h1 className="text-lg font-semibold tracking-tight">Chorotega E-Market</h1>
          <span className="text-xs text-neutral-500">
            <b>Panel emprendedor</b> • {nombre_negocio}
          </span>
        </div>
        \
        <NotificationsModal role="entrepreneur" />
        <div className="ml-auto" />
        <div className="ml-auto" />
      </div>
    </header>
  );
}

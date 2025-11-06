"use client";

import * as React from "react";
import { Toaster } from "@/components/ui/sonner";
import Sidebar from "@/components/dashboard/repartidor/sidebar"; // puedes clonar luego Sidebar.tsx a repartidor/
import Header from "@/components/dashboard/repartidor/header";
import { useRealtimeRepartidorNotifications } from "@/hooks/useRealtimeRepartidorNotifications";

export default function RepartidorLayout({
  children,
}: { children: React.ReactNode }) {
  const [openSidebar, setOpenSidebar] = React.useState(false);
  useRealtimeRepartidorNotifications();
  
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Sidebar open={openSidebar} onOpenChange={setOpenSidebar} />
      <Header onOpenSidebar={() => setOpenSidebar(true)} />

      <main className="px-4 pb-8 pt-6 md:pl-72">
        <div className="mx-auto w-full max-w-7xl">{children}</div>
      </main>

      <Toaster richColors />
    </div>
  );
}

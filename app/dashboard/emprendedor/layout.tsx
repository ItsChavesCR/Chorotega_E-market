"use client";

import * as React from "react";
import { Toaster } from "@/components/ui/sonner";
import Sidebar from "@/components/dashboard/emprendedor/Sidebar";
import Header from "@/components/dashboard/emprendedor/Header";

export default function EmprendedorLayout({
  children,
}: { children: React.ReactNode }) {
  const [openSidebar, setOpenSidebar] = React.useState(false);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Sidebar open={openSidebar} onOpenChange={setOpenSidebar} />
      <Header onOpenSidebar={() => setOpenSidebar(true)} />

      {/* +2rem de separación con respecto al ancho del sidebar (16rem) */}
      <main className="px-4 pb-8 pt-6 md:pl-72">
        <div className="mx-auto w-full max-w-7xl">{children}</div>
      </main>

      <Toaster richColors />
    </div>
  );
}

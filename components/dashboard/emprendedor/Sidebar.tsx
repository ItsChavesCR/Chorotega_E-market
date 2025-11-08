/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Home,
  Package,
  ShoppingCart,
  MessageSquare,
  User,
  Settings,
  Languages,
  LifeBuoy,
  LogOut,
} from "lucide-react";
import clsx from "clsx";
import { supabase } from "@/lib/supabase/client";
import { useState } from "react";

type NavItem = {
  href: string;
  label: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
};

const NAV: NavItem[] = [
  { href: "/dashboard/emprendedor", label: "Inicio", icon: Home },
  { href: "/dashboard/emprendedor/products", label: "Productos", icon: Package },
  { href: "/dashboard/emprendedor/orders", label: "Pedidos", icon: ShoppingCart },
  { href: "/dashboard/emprendedor/messages", label: "Mensajes", icon: MessageSquare },
  { href: "/dashboard/emprendedor/profile", label: "Perfil", icon: User },
  { href: "/dashboard/emprendedor/settings", label: "Configuración", icon: Settings },
  { href: "/dashboard/emprendedor/languages", label: "Idiomas", icon: Languages },
  { href: "/dashboard/emprendedor/help", label: "Centro de ayuda", icon: LifeBuoy },
];

export default function Sidebar({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const pathname = usePathname();

  const [loggingOut, setLoggingOut] = useState(false);

const handleLogout = async () => {
  setLoggingOut(true);
  const { error } = await supabase.auth.signOut();
  await fetch("/api/auth", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ event: "SIGNED_OUT", session: null }),
  });
  setLoggingOut(false);
  window.location.href = "/auth/login";
};



  const NavList = ({ onItemClick }: { onItemClick?: () => void }) => (
    <nav className="flex flex-col space-y-1 px-3 py-4">
      {NAV.map((item) => {
        const Icon = item.icon;
        const active =
          item.href === "/dashboard/emprendedor"
            ? pathname === item.href
            : pathname?.startsWith(item.href);

        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onItemClick}
            className={clsx(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
              active
                ? "bg-green-600 text-white shadow-sm"
                : "text-neutral-700 hover:bg-neutral-100"
            )}
          >
            <Icon className="h-4 w-4" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );

  return (
    <>
      {/* 🔹 Desktop fijo (estilo repartidor) */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 border-r border-neutral-200 bg-white shadow-sm md:block">
        {/* Header */}
        <div className="flex items-center gap-2 border-b border-neutral-200 px-4 py-4">
          <h2 className="text-lg font-bold text-neutral-800">Menú</h2>
        </div>

        {/* Navigation */}
        <div className="flex h-[calc(100%-4rem)] flex-col justify-between">
          <div className="overflow-y-auto">
            <NavList />
          </div>

          {/* Footer */}
          <div className="border-t border-neutral-200 p-3">
            <button
              onClick={handleLogout}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-neutral-900 px-3 py-2 text-sm font-semibold text-white hover:bg-neutral-800"
            >
              <LogOut className="h-4 w-4" />
              Cerrar sesión
            </button>
          </div>
        </div>
      </aside>

      {/* 🔹 Móvil (mantiene Sheet) */}
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent side="left" className="w-72 p-0">
          <SheetHeader className="border-b px-4 py-3 text-left">
            <SheetTitle>Menú</SheetTitle>
          </SheetHeader>
          <div className="flex h-[calc(100%-57px)] flex-col justify-between">
            <div className="overflow-y-auto">
              <NavList onItemClick={() => onOpenChange(false)} />
            </div>
            <div className="border-t border-neutral-200 p-3">
              <button
                onClick={handleLogout}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-neutral-900 px-3 py-2 text-sm font-semibold text-white hover:bg-neutral-800"
              >
                <LogOut className="h-4 w-4" />
                {loggingOut ? "Cerrando sesión..." : "Cerrar sesión"}

              </button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}

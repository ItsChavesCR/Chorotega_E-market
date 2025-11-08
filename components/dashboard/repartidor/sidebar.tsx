"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ClipboardList,
  UserCircle,
  MessageSquare,
  LogOut,
  Home,
  User,
} from "lucide-react";
import clsx from "clsx";
import { supabase } from "@/lib/supabase/client";
import { useState } from "react";

type SidebarProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const navItems = [
  { href: "/dashboard/repartidor/orders", label: "Inicio", icon: Home },
  { href: "/dashboard/repartidor/profile", label: "Perfil", icon: User },
  { href: "/dashboard/repartidor/messages", label: "Mensajes", icon: MessageSquare },
];

export default function Sidebar({ open }: SidebarProps) {
  const pathname = usePathname();

  const [loggingOut, setLoggingOut] = useState(false);

const handleLogout = async () => {
  setLoggingOut(true);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { error } = await supabase.auth.signOut();
  await fetch("/api/auth", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ event: "SIGNED_OUT", session: null }),
  });
  setLoggingOut(false);
  window.location.href = "/auth/login";
};



  return (
    <aside
      className={clsx(
        "fixed inset-y-0 left-0 z-40 w-64 transform border-r border-neutral-200 bg-white shadow-sm transition-transform duration-200 md:translate-x-0",
        open ? "translate-x-0" : "-translate-x-full"
      )}
    >
      {/* Header */}
      <div className="flex items-center gap-2 border-b border-neutral-200 px-4 py-4">
        <h2 className="text-lg font-bold text-neutral-800">Menú</h2>
      </div>

      {/* Navigation */}
      <nav className="flex flex-col space-y-1 px-2 py-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
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

      {/* Footer */}
      <div className="absolute bottom-0 w-full border-t border-neutral-200 p-3">
        <button
          onClick={handleLogout}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-neutral-900 px-3 py-2 text-sm font-semibold text-white hover:bg-neutral-800"
        >
          <LogOut className="h-4 w-4" />
          {loggingOut ? "Cerrando sesión..." : "Cerrar sesión"}
        </button>
      </div>
    </aside>
  );
}

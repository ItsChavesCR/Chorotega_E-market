"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetClose,
} from "@/components/ui/sheet";
import {
  Home,
  Package,
  ShoppingCart,
  MessageSquare,
  User,
  Bell,
  Settings,
  Languages,
  LifeBuoy,
  LogOut,
} from "lucide-react";

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

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
  { href: "/dashboard/emprendedor/notifications", label: "Notificaciones", icon: Bell },
  { href: "/dashboard/emprendedor/settings", label: "Configuración de cuenta", icon: Settings },
  { href: "/dashboard/emprendedor/languages", label: "Idiomas", icon: Languages },
  { href: "/dashboard/emprendedor/help", label: "Centro de ayuda", icon: LifeBuoy },
];
const LOGOUT: NavItem = { href: "/logout", label: "Logout", icon: LogOut };

function NavList({ onItemClick }: { onItemClick?: () => void }) {
  const pathname = usePathname();

  return (
    <>
      <div className="px-4 pb-3 pt-6">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Menú
        </p>
      </div>
      <nav className="flex-1 space-y-1 px-2">
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
              className={cx(
                "flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition",
                active
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <Icon className="h-4 w-4" />
              <span className="truncate">{item.label}</span>
            </Link>
          );
        })}
      </nav>
      <div className="mt-4 border-t px-2 pt-4">
        <Link
          href={LOGOUT.href}
          onClick={onItemClick}
          className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm text-destructive hover:bg-destructive/10"
        >
          <LOGOUT.icon className="h-4 w-4" />
          <span>{LOGOUT.label}</span>
        </Link>
      </div>
    </>
  );
}

export default function Sidebar({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <>
      {/* Desktop fijo */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 border-r bg-card md:block">
        <div className="flex h-16 items-center border-b px-4">
          <Link href="/" className="font-semibold">
            Chorotega E-Market
          </Link>
        </div>
        <div className="flex h-[calc(100%-4rem)] flex-col">
          <NavList />
        </div>
      </aside>

      {/* Móvil: Sheet controlado desde el Header */}
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent side="left" className="w-72 p-0">
          <SheetHeader className="border-b px-4 py-3 text-left">
            <SheetTitle>Chorotega E-Market</SheetTitle>
          </SheetHeader>
          <div className="flex h-[calc(100%-57px)] flex-col">
            <NavList onItemClick={() => onOpenChange(false)} />
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}

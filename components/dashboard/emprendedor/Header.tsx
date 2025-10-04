"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";

export default function Header({ onOpenSidebar }: { onOpenSidebar: () => void }) {
  return (
    <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center gap-3 px-4 md:pl-72">
        <div className="md:hidden">
          <Button variant="ghost" size="icon" aria-label="Abrir menú" onClick={onOpenSidebar}>
            <Menu className="h-5 w-5" />
          </Button>
        </div>
        <h1 className="text-lg font-semibold tracking-tight">Chorotega E-Market</h1>
        <div className="ml-auto" />
      </div>
    </header>
  );
}

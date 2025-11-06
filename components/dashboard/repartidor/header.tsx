"use client";

import { Menu } from "lucide-react";

type HeaderProps = {
  onOpenSidebar: () => void;
};

export default function Header({ onOpenSidebar }: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 flex items-center justify-between border-b border-neutral-200 bg-white px-4 py-3 shadow-sm md:hidden">
      <button
        onClick={onOpenSidebar}
        className="inline-flex items-center justify-center rounded-md p-2 text-neutral-700 hover:bg-neutral-100"
      >
        <Menu className="h-5 w-5" />
      </button>
      <h1 className="text-base font-semibold">Panel Repartidor</h1>
    </header>
  );
}

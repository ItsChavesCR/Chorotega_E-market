"use client";

import Link from "next/link";
import { ArrowLeft, MessageSquare } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function ChatHeader({
  name,
  role,
  orderCode,
}: {
  name: string;
  role: "cliente" | "repartidor";
  orderCode?: string;
}) {
  return (
    <div className="flex items-center justify-between border-b p-3 sm:p-4">
      <div className="flex items-center gap-2">
        <Button asChild variant="ghost" size="icon" className="shrink-0">
          <Link href="/dashboard/emprendedor/messages">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5 opacity-70" />
          <div className="flex flex-col">
            <span className="text-sm font-medium leading-none">{name}</span>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="rounded-full text-[10px]">
                {role === "cliente" ? "Cliente" : "Repartidor"}
              </Badge>
              {orderCode && (
                <span className="text-xs text-muted-foreground">{orderCode}</span>
              )}
            </div>
          </div>
        </div>
      </div>
      {/* Reservado para acciones (silenciar, etc.) */}
      <div />
    </div>
  );
}

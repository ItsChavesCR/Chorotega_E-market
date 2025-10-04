"use client";

import * as React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import type { Conversation } from "@/types/message";
import ConversationItem from "./ConversationItem";

export default function ConversationList({
  items,
  loading,
  error,
}: {
  items: Conversation[];
  loading?: boolean;
  error?: string | boolean;
}) {
  if (loading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="flex items-center gap-3 rounded-xl border p-3">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="min-w-0 flex-1 space-y-2">
              <Skeleton className="h-4 w-1/3" />
              <Skeleton className="h-4 w-2/3" />
            </div>
            <Skeleton className="h-4 w-20" />
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="grid place-items-center rounded-xl border bg-red-50 p-8 text-center text-red-700">
        Ocurrió un error al cargar tus mensajes.
      </div>
    );
  }

  if (!items.length) {
    return (
      <div className="grid place-items-center rounded-xl border bg-card p-10 text-center">
        <div>
          <p className="font-medium">No tienes mensajes aún</p>
          <p className="text-sm text-muted-foreground">
            Cuando tengas conversaciones, aparecerán aquí.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {items.map((c) => (
        <ConversationItem key={c.id} c={c} />
      ))}
    </div>
  );
}

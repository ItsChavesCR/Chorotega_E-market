"use client";

import * as React from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { Conversation } from "@/types/message";
import { formatDateTime } from "@/types/message";

function initials(name: string) {
  const parts = name.trim().split(/\s+/);
  return (parts[0]?.[0] ?? "") + (parts[1]?.[0] ?? "");
}

export default function ConversationItem({ c }: { c: Conversation }) {
  return (
    <Link href={`/dashboard/emprendedor/messages/${c.id}`}>
      <Card className="flex items-center gap-3 rounded-xl p-3 transition hover:shadow-sm">
        <Avatar className="h-12 w-12">
          <AvatarImage src={c.otherUser.avatarUrl || ""} alt={c.otherUser.name} />
          <AvatarFallback className="font-medium">
            {initials(c.otherUser.name).toUpperCase()}
          </AvatarFallback>
        </Avatar>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <p className="truncate text-sm font-medium">{c.otherUser.name}</p>
            <Badge variant="secondary" className="rounded-full text-[10px]">
              {c.otherUser.role === "cliente" ? "Cliente" : "Repartidor"}
            </Badge>
            {c.orderCode && (
              <span className="hidden text-xs text-muted-foreground sm:inline">
                • {c.orderCode}
              </span>
            )}
          </div>
          <p className="line-clamp-1 text-sm text-muted-foreground">
            {c.lastMessage.text}
          </p>
        </div>

        <div className="flex shrink-0 flex-col items-end gap-1">
          <span className="text-xs text-muted-foreground">
            {formatDateTime(c.updatedAt)}
          </span>
          {c.unreadCount ? (
            <span className="rounded-full bg-primary px-2 py-0.5 text-[10px] font-semibold text-primary-foreground">
              {c.unreadCount}
            </span>
          ) : null}
        </div>
      </Card>
    </Link>
  );
}

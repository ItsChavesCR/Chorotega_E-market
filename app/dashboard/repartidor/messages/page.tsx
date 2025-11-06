"use client";

import * as React from "react";
import { MessageSquare } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ConversationList from "@/components/dashboard/emprendedor/ConversationList";
import type { Conversation, ConversationFilter } from "@/types/message";

// --- MOCK DATA SOLO PARA DEMO ---
const MOCK_CONVERSATIONS: Conversation[] = [
  {
    id: "c1",
    orderId: "o21",
    orderCode: "Pedido #21",
    otherUser: { id: "u10", name: "Ana Jiménez", role: "client", avatarUrl: "" },
    lastMessage: { text: "Estoy esperando el pedido 😅", senderId: "u10", createdAt: new Date().toISOString() },
    unreadCount: 2,
    updatedAt: new Date().toISOString(),
  },
  {
    id: "c2",
    orderId: "o22",
    orderCode: "Pedido #22",
    otherUser: { id: "u11", name: "Carlos Mena", role: "entrepreneur", avatarUrl: "" },
    lastMessage: { text: "Ya puedes pasar a recogerlo 🚗", senderId: "u11", createdAt: new Date(Date.now() - 10 * 60_000).toISOString() },
    unreadCount: 0,
    updatedAt: new Date(Date.now() - 10 * 60_000).toISOString(),
  },
];

export default function MessagesPage() {
  const [filter, setFilter] = React.useState<ConversationFilter>("all");
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const t = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(t);
  }, []);

  const items = React.useMemo(() => {
    if (filter === "all") return MOCK_CONVERSATIONS;
    return MOCK_CONVERSATIONS.filter((c) => c.otherUser.role === filter);
  }, [filter]);

  return (
    <section className="space-y-6">
      <div className="flex items-center gap-2">
        <MessageSquare className="h-5 w-5" />
        <h2 className="text-xl font-semibold tracking-tight">Mensajes</h2>
      </div>
      <p className="text-sm text-muted-foreground">
        Conversaciones con clientes y emprendedores.
      </p>

      <Tabs value={filter} onValueChange={(v) => setFilter(v as ConversationFilter)}>
        <TabsList>
          <TabsTrigger value="all">Todos</TabsTrigger>
          <TabsTrigger value="cliente">Clientes</TabsTrigger>
          <TabsTrigger value="emprendedor">Emprendedores</TabsTrigger>
        </TabsList>
      </Tabs>

      <ConversationList items={items} loading={loading} error={false} />
    </section>
  );
}

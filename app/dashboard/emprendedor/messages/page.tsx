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
    otherUser: { id: "u10", name: "Ana Jiménez", role: "cliente", avatarUrl: "" },
    lastMessage: { text: "¿Podría entregar hoy en la tarde?", senderId: "u10", createdAt: new Date().toISOString() },
    unreadCount: 2,
    updatedAt: new Date().toISOString(),
  },
  {
    id: "c2",
    orderId: "o22",
    orderCode: "Pedido #22",
    otherUser: { id: "u11", name: "Carlos Mena", role: "repartidor", avatarUrl: "" },
    lastMessage: { text: "Ya voy en camino a la dirección.", senderId: "u11", createdAt: new Date(Date.now() - 10 * 60_000).toISOString() },
    unreadCount: 0,
    updatedAt: new Date(Date.now() - 10 * 60_000).toISOString(),
  },
  {
    id: "c3",
    orderId: "o19",
    orderCode: "Pedido #19",
    otherUser: { id: "u12", name: "María Rojas", role: "cliente", avatarUrl: "" },
    lastMessage: { text: "¡Gracias por el excelente servicio!", senderId: "u12", createdAt: new Date(Date.now() - 2 * 60 * 60_000).toISOString() },
    unreadCount: 0,
    updatedAt: new Date(Date.now() - 2 * 60 * 60_000).toISOString(),
  },
  {
    id: "c4",
    orderId: "o25",
    orderCode: "Pedido #25",
    otherUser: { id: "u13", name: "Diego Solís", role: "repartidor", avatarUrl: "" },
    lastMessage: { text: "¿El cliente pidió pago con tarjeta?", senderId: "u13", createdAt: new Date(Date.now() - 30 * 60_000).toISOString() },
    unreadCount: 1,
    updatedAt: new Date(Date.now() - 30 * 60_000).toISOString(),
  },
  {
    id: "c5",
    orderId: "o26",
    orderCode: "Pedido #26",
    otherUser: { id: "u14", name: "Sofía Vargas", role: "cliente", avatarUrl: "" },
    lastMessage: { text: "¿Tienen presentación de 500g?", senderId: "u14", createdAt: new Date(Date.now() - 24 * 60 * 60_000).toISOString() },
    unreadCount: 0,
    updatedAt: new Date(Date.now() - 24 * 60 * 60_000).toISOString(),
  },
];

export default function MessagesPage() {
  const [filter, setFilter] = React.useState<ConversationFilter>("all");

  // Simular carga al entrar (solo demo)
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
        Conversaciones con clientes y repartidores.
      </p>

      <Tabs value={filter} onValueChange={(v) => setFilter(v as ConversationFilter)}>
        <TabsList>
          <TabsTrigger value="all">Todos</TabsTrigger>
          <TabsTrigger value="cliente">Clientes</TabsTrigger>
          <TabsTrigger value="repartidor">Repartidores</TabsTrigger>
        </TabsList>
      </Tabs>

      <ConversationList items={items} loading={loading} error={false} />
    </section>
  );
}

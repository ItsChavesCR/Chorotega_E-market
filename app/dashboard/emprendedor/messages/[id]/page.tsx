"use client";

import * as React from "react";
import { useParams } from "next/navigation";
import ChatWindow from "@/components/dashboard/emprendedor/ChatWindow";
import type { ChatMessage, Conversation } from "@/types/message";

/** MOCKS mínimos para que funcione hoy */
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
    lastMessage: { text: "Ya voy en camino.", senderId: "u11", createdAt: new Date().toISOString() },
    unreadCount: 0,
    updatedAt: new Date().toISOString(),
  },
];

const MOCK_MESSAGES: Record<string, ChatMessage[]> = {
  c1: [
    { id: "m1", conversationId: "c1", senderId: "u10", text: "Hola, ¿tendrán entrega hoy?", createdAt: new Date(Date.now() - 3600_000).toISOString() },
    { id: "m2", conversationId: "c1", senderId: "me", text: "¡Claro! ¿Cuál horario te sirve?", createdAt: new Date(Date.now() - 3400_000).toISOString() },
    { id: "m3", conversationId: "c1", senderId: "u10", text: "Después de las 3pm está perfecto.", createdAt: new Date(Date.now() - 3300_000).toISOString() },
  ],
  c2: [
    { id: "m1", conversationId: "c2", senderId: "u11", text: "Ya voy en camino a la dirección.", createdAt: new Date(Date.now() - 1800_000).toISOString() },
    { id: "m2", conversationId: "c2", senderId: "me", text: "¡Gracias! Avísame al entregar.", createdAt: new Date(Date.now() - 1700_000).toISOString() },
  ],
};

export default function ConversationPage() {
  const { id } = useParams<{ id: string }>();

  const conv = React.useMemo(
    () => MOCK_CONVERSATIONS.find((c) => c.id === id),
    [id]
  );

  if (!conv) {
    return (
      <div className="grid place-items-center rounded-2xl border bg-card p-10 text-center">
        <div>
          <p className="font-medium">Conversación no encontrada</p>
          <p className="text-sm text-muted-foreground">Vuelve a la bandeja de mensajes.</p>
        </div>
      </div>
    );
  }

  const initial = MOCK_MESSAGES[id as string] ?? [];

  return (
    <section className="space-y-4">
      <ChatWindow
        name={conv.otherUser.name}
        role={conv.otherUser.role}
        orderCode={conv.orderCode}
        initialMessages={initial}
        me="me"
      />
    </section>
  );
}

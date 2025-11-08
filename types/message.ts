// src/types/message.ts
export type PeerRole = "client" | "entrepreneur" | "repartidor" | "admin";

export type Conversation = {
  id: number;
  orderId?: number | null;
  orderCode?: string | null;
  otherUser: {
    id: string;
    name: string;
    role: PeerRole;
    avatarUrl?: string | null;
  };
  lastMessage?: {
    id: number;
    text: string;
    senderId: string;
    createdAt: string; // ISO
  };
  unreadCount?: number;
  updatedAt: string; // ISO
};

export type ConversationFilter = "all" | "client" | "repartidor";

export type ChatMessage = {
  id: number;
  conversationId: number;
  senderId: string;
  text: string;
  createdAt: string; // ISO
};

export function formatDateTime(iso: string) {
  const d = new Date(iso);
  return d.toLocaleString("es-CR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
export function formatTime(iso: string) {
  const d = new Date(iso);
  return d.toLocaleTimeString("es-CR", { hour: "2-digit", minute: "2-digit" });
}

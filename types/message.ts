export type PeerRole = "client" | "entrepreneur" | "repartidor" | "admin";


export type Conversation = {
  id: string;
  orderId?: string;
  orderCode?: string;          // ej: "Pedido #23"
  otherUser: {
    id: string;
    name: string;
    role: PeerRole;            // Cliente o Repartidor
    avatarUrl?: string | null;
  };
  lastMessage: {
    text: string;
    senderId: string;
    createdAt: string;         // ISO
  };
  unreadCount?: number;
  updatedAt: string;           // ISO
};

export type ConversationFilter = "all" | PeerRole;

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

export type ChatMessage = {
  id: string;
  conversationId: string;
  senderId: string;     // "me" para el emprendedor actual en el front
  text: string;
  createdAt: string;    // ISO
};

export function formatTime(iso: string) {
  const d = new Date(iso);
  return d.toLocaleTimeString("es-CR", { hour: "2-digit", minute: "2-digit" });
}

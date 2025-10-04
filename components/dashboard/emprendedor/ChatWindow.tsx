"use client";

import * as React from "react";
import ChatHeader from "./ChatHeader";
import MessageBubble from "./MessageBubble";
import ChatComposer from "./ChatComposer";
import type { ChatMessage } from "@/types/message";

export default function ChatWindow({
  name,
  role,
  orderCode,
  initialMessages,
  me = "me",
}: {
  name: string;
  role: "cliente" | "repartidor";
  orderCode?: string;
  initialMessages: ChatMessage[];
  /** id del usuario actual (mock) */
  me?: string;
}) {
  const [messages, setMessages] = React.useState<ChatMessage[]>(initialMessages);
  const scrollRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    // autoscroll al montar y cuando cambian mensajes
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const handleSend = (text: string) => {
    const newMsg: ChatMessage = {
      id: `tmp-${Date.now()}`,
      conversationId: "conv",
      senderId: me,
      text,
      createdAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, newMsg]);

    // (demo) respuesta automática ligera
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: `auto-${Date.now()}`,
          conversationId: "conv",
          senderId: "other",
          text: "¡Recibido! 😊",
          createdAt: new Date().toISOString(),
        },
      ]);
    }, 600);
  };

  return (
    <div className="flex h-[calc(100vh-9rem)] flex-col overflow-hidden rounded-2xl border bg-card shadow-sm">
      <ChatHeader name={name} role={role} orderCode={orderCode} />

      <div
        ref={scrollRef}
        className="flex-1 space-y-3 overflow-y-auto p-3 sm:p-4"
      >
        {messages.map((m) => (
          <MessageBubble
            key={m.id}
            text={m.text}
            createdAt={m.createdAt}
            mine={m.senderId === me}
          />
        ))}
      </div>

      <ChatComposer onSend={handleSend} />
    </div>
  );
}

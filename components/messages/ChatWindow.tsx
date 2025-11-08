"use client";

import { useState } from "react";
import { useMessages } from "@/hooks/messages/useMessages";
import { sendMessage } from "@/hooks/messages/sendMessage";
import { useUser } from "@/hooks/useUser";


export function ChatWindow({ conversationId }: { conversationId: number }) {
  const { user } = useUser();
  const { messages } = useMessages(conversationId);
  const [text, setText] = useState("");

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() || !user) return;
    await sendMessage(conversationId, text, user.id);
    setText("");
  };

  return (
    <div className="flex flex-col h-[70vh] border rounded-lg bg-white">
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`p-2 rounded-lg max-w-[70%] ${
              msg.idremitente === user?.id
                ? "ml-auto bg-green-100 text-right"
                : "bg-gray-100 text-left"
            }`}
          >
            {msg.cuerpo}
          </div>
        ))}
      </div>

      <form
        onSubmit={handleSend}
        className="flex border-t bg-neutral-50 p-3 gap-2"
      >
        <input
          type="text"
          placeholder="Escribe un mensaje..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="flex-1 rounded-full border border-neutral-300 px-4 py-2 text-sm"
        />
        <button
          type="submit"
          className="rounded-full bg-green-600 text-white px-4 py-2 hover:bg-green-700"
        >
          Enviar
        </button>
      </form>
    </div>
  );
}

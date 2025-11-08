// src/app/dashboard/emprendedor/messages/[id]/page.tsx
"use client";

import { useParams } from "next/navigation";
import { useChat } from "@/hooks/messages/useChat";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatTime } from "@/types/message";
import { supabase } from "@/lib/supabase/client";

export default function ChatPage() {
  const params = useParams<{ id: string }>();
  const conversationId = Number(params.id);
  const { messages, loading, send } = useChat(conversationId);
  const [text, setText] = useState("");

  if (!conversationId) return null;

  return (
    <section className="flex h-[calc(100vh-160px)] flex-col rounded-xl border bg-card">
      <div className="flex-1 space-y-2 overflow-y-auto p-4">
        {loading ? (
          <p className="text-center text-sm text-muted-foreground">Cargando…</p>
        ) : (
          messages.map((m) => (
            <Bubble key={m.id} message={m.text} createdAt={m.createdAt} senderId={m.senderId} />
          ))
        )}
      </div>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          const t = text.trim();
          if (!t) return;
          await send(t);
          setText("");
        }}
        className="flex gap-2 border-t p-3"
      >
        <Input value={text} onChange={(e) => setText(e.target.value)} placeholder="Escribe un mensaje…" />
        <Button type="submit">Enviar</Button>
      </form>
    </section>
  );
}

function Bubble({ message, createdAt, senderId }: { message: string; createdAt: string; senderId: string }) {
  const [me, setMe] = useState<string>("");
  // obtener mi id solo una vez
  useState(() => {
    supabase.auth.getUser().then(({ data }) => setMe(data?.user?.id ?? ""));
  });
  const mine = me && senderId === me;

  return (
    <div className={`flex ${mine ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[70%] rounded-2xl px-3 py-2 text-sm shadow-sm ${
          mine ? "bg-neutral-900 text-white" : "bg-white text-neutral-900 border"
        }`}
      >
        <p>{message}</p>
        <span className={`mt-1 block text-[10px] opacity-70 ${mine ? "text-gray-200" : "text-gray-500"}`}>
          {formatTime(createdAt)}
        </span>
      </div>
    </div>
  );
}

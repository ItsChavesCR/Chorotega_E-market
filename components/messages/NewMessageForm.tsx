// src/components/messages/NewMessageForm.tsx
"use client";

import { useState } from "react";
import { useCreateConversation } from "@/hooks/messages/useCreateConversation";
import type { PeerRole } from "@/types/message";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function NewMessageForm() {
  const { startConversation, loading } = useCreateConversation();

  const [receiverId, setReceiverId] = useState("");
  const [receiverRole, setReceiverRole] = useState<PeerRole>("client");
  const [text, setText] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!receiverId || !text) return;
    const id = await startConversation({
      receiverId,
      receiverRole,
      initialText: text,
    });
    if (id) {
      // Redirigir al chat recién creado
      window.location.href = `/dashboard/emprendedor/messages/${id}`;
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2">
      <Input
        placeholder="ID del receptor (uuid)"
        value={receiverId}
        onChange={(e) => setReceiverId(e.target.value)}
        className="w-64"
      />
      <Select value={receiverRole} onValueChange={(v) => setReceiverRole(v as PeerRole)}>
        <SelectTrigger className="w-40">
          <SelectValue placeholder="Rol" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="client">Cliente</SelectItem>
          <SelectItem value="repartidor">Repartidor</SelectItem>
        </SelectContent>
      </Select>
      <Input
        placeholder="Mensaje inicial…"
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="w-64"
      />
      <Button type="submit" disabled={loading}>
        {loading ? "Creando..." : "Nuevo mensaje"}
      </Button>
    </form>
  );
}

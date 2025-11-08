/* eslint-disable @typescript-eslint/no-explicit-any */
// src/hooks/messages/useChat.ts
"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import type { ChatMessage } from "@/types/message";

export function useChat(conversationId?: number) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState<boolean>(!!conversationId);

  // Cargar historial
  useEffect(() => {
    if (!conversationId) return;
    let isMounted = true;
    setLoading(true);

    (async () => {
      const { data, error } = await supabase
        .from("mensaje")
        .select("id, idconversacion, idremitente, cuerpo, createdat")
        .eq("idconversacion", conversationId)
        .order("createdat", { ascending: true });

      if (!isMounted) return;
      if (error) {
        setMessages([]);
      } else {
        setMessages(
          (data ?? []).map((m) => ({
            id: m.id,
            conversationId: m.idconversacion,
            senderId: m.idremitente,
            text: m.cuerpo,
            createdAt: m.createdat,
          }))
        );
      }
      setLoading(false);
    })();

    return () => {
      isMounted = false;
    };
  }, [conversationId]);

  // Realtime
  useEffect(() => {
    if (!conversationId) return;
    const ch = supabase
      .channel(`conv:${conversationId}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "mensaje", filter: `idconversacion=eq.${conversationId}` },
        (payload: any) => {
          const m = payload.new;
          setMessages((prev) => [
            ...prev,
            {
              id: m.id,
              conversationId: m.idconversacion,
              senderId: m.idremitente,
              text: m.cuerpo,
              createdAt: m.createdat,
            },
          ]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(ch);
    };
  }, [conversationId]);

  async function send(text: string) {
    if (!conversationId) return;
    const { data: auth } = await supabase.auth.getUser();
    const me = auth?.user;
    if (!me) return;

    await supabase.from("mensaje").insert({
      idconversacion: conversationId,
      idremitente: me.id,
      cuerpo: text,
      tipo: "text",
    });
  }

  return { messages, loading, send };
}

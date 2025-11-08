/* eslint-disable @typescript-eslint/no-explicit-any */
// src/hooks/messages/useCreateConversation.ts
"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase/client";
import type { PeerRole } from "@/types/message";

type StartConversationInput = {
  receiverId: string;               // id UUID del usuario objetivo
  receiverRole: PeerRole;           // "client" | "repartidor" | ...
  initialText: string;              // primer mensaje
  orderId?: number | null;          // si aplica
  orderCode?: string | null;        // si aplica
};

export function useCreateConversation() {
  const [loading, setLoading] = useState(false);
  const [error, setError]   = useState<string | null>(null);

  async function startConversation(input: StartConversationInput) {
    setLoading(true);
    setError(null);

    const { data: auth } = await supabase.auth.getUser();
    const me = auth?.user;
    if (!me) {
      setLoading(false);
      setError("No hay sesión activa.");
      return null;
    }

    try {
      // 1) Crear conversación
      const { data: conv, error: convErr } = await supabase
        .from("conversacion")
        .insert({
          idpedido: input.orderId ?? null, // si tu tabla tiene esta FK
          order_code: input.orderCode ?? null, // opcional, solo si existe columna
        })
        .select("id")
        .single();

      if (convErr || !conv) throw convErr ?? new Error("No se pudo crear conversación");

      // 2) Vincular participantes (yo + receptor)
      const pair = [
        { idconversacion: conv.id, idusuario: me.id, rol: "entrepreneur" as PeerRole },
        { idconversacion: conv.id, idusuario: input.receiverId, rol: input.receiverRole },
      ];

      const { error: linkErr } = await supabase.from("conversacion_cliente").insert(pair);
      if (linkErr) throw linkErr;

      // 3) Primer mensaje
      const { error: msgErr } = await supabase.from("mensaje").insert({
        idconversacion: conv.id,
        idremitente: me.id,
        cuerpo: input.initialText,
        tipo: "text",
      });
      if (msgErr) throw msgErr;

      return conv.id as number;
    } catch (e: any) {
      setError(e?.message ?? "Error creando conversación");
      return null;
    } finally {
      setLoading(false);
    }
  }

  return { startConversation, loading, error };
}

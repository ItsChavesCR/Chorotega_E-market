// src/hooks/messages/useConversations.ts
"use client";

import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import type { Conversation, PeerRole } from "@/types/message";

export function useConversations(userId?: string) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState<boolean>(!!userId);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) return;

    let isMounted = true;
    setLoading(true);
    setError(null);

    (async () => {
      // 1) Conversaciones donde participo
      const { data: myLinks, error: linkErr } = await supabase
        .from("conversacion_cliente")
        .select("idconversacion, rol")
        .eq("idusuario", userId);

      if (linkErr) {
        if (isMounted) {
          setError(linkErr.message);
          setConversations([]);
          setLoading(false);
        }
        return;
      }

      const convIds = (myLinks ?? []).map((r) => r.idconversacion);
      if (!convIds.length) {
        if (isMounted) {
          setConversations([]);
          setLoading(false);
        }
        return;
      }

      // 2) Para cada conversación: obtener "peer" y último mensaje
      const results = await Promise.all(
        convIds.map(async (cid) => {
          // participantes
          const { data: participants } = await supabase
            .from("conversacion_cliente")
            .select("idusuario, rol")
            .eq("idconversacion", cid);

          const peer = (participants ?? []).find((p) => p.idusuario !== userId);
          const myLink = (participants ?? []).find((p) => p.idusuario === userId);

          // datos del peer (tabla usuarios)
          let peerUser: { id: string; nombre?: string | null; rol?: PeerRole | null; avatar_url?: string | null } | null = null;
          if (peer) {
            const { data: u } = await supabase
              .from("usuarios")
              .select("id, nombre, rol, avatar_url")
              .eq("id", peer.idusuario)
              .maybeSingle();
            peerUser = u ?? null;
          }

          // último mensaje
          const { data: last } = await supabase
            .from("mensaje")
            .select("id, cuerpo, idremitente, createdat")
            .eq("idconversacion", cid)
            .order("createdat", { ascending: false })
            .limit(1)
            .maybeSingle();

          // meta de la conversación (order id, code… si existen)
          const { data: convMeta } = await supabase
            .from("conversacion")
            .select("id, idpedido, order_code, updated_at")
            .eq("id", cid)
            .maybeSingle();

          const conv: Conversation = {
            id: cid,
            orderId: convMeta?.idpedido ?? null,
            orderCode: convMeta?.order_code ?? null,
            otherUser: {
              id: peerUser?.id ?? "",
              name: peerUser?.nombre ?? "Usuario",
              role: (peerUser?.rol as PeerRole) ?? (peer?.rol as PeerRole) ?? "client",
              avatarUrl: peerUser?.avatar_url ?? null,
            },
            lastMessage: last
              ? {
                  id: last.id,
                  text: last.cuerpo,
                  senderId: last.idremitente,
                  createdAt: last.createdat,
                }
              : undefined,
            updatedAt: convMeta?.updated_at ?? last?.createdat ?? new Date().toISOString(),
            unreadCount: 0, // si luego agregas 'leído', aquí lo calculas
          };

          return conv;
        })
      );

      // ordenar por actualizado desc
      results.sort((a, b) => +new Date(b.updatedAt) - +new Date(a.updatedAt));

      if (isMounted) {
        setConversations(results);
        setLoading(false);
      }
    })();

    return () => {
      isMounted = false;
    };
  }, [userId]);

  return { conversations, loading, error };
}

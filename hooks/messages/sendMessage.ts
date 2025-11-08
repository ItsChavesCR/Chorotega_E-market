// src/services/messages/sendMessage.ts
import { supabase } from "@/lib/supabase/client";

export async function sendMessage(idconversacion: number, cuerpo: string, idremitente: string) {
  const { error } = await supabase.from("mensaje").insert({
    idconversacion,
    cuerpo,
    idremitente,
    tipo: "texto",
  });

  if (error) throw error;
}

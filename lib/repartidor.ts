// src/lib/supabase/repartidor.ts
import { supabase } from "@/lib/supabase/client";

/**
 * 🔹 Obtiene el perfil del repartidor autenticado
 */
export async function getRepartidorProfile() {
  const { data: auth } = await supabase.auth.getUser();
  const user = auth.user;
  if (!user) throw new Error("No hay sesión activa");

  const { data, error } = await supabase
    .from("perfil_repartidor")
    .select("*")
    .eq("idusuario", user.id)
    .maybeSingle();

  if (error) throw error;
  return data;
}

/**
 * 🔹 Lista pedidos asignados al repartidor autenticado
 */
export async function listPedidosAsignados() {
  const { data: auth } = await supabase.auth.getUser();
  const user = auth.user;
  if (!user) throw new Error("No hay sesión activa");

  const { data, error } = await supabase
    .from("pedido")
    .select(`
      id,
      estado,
      total,
      totalenvio,
      direccionentrega,
      createdat,
      idusuario,
      usuarios (nombre, email, telefono)
    `)
    .eq("idrepartidor", user.id)
    .order("createdat", { ascending: false });

  if (error) throw error;
  return data;
}


/**
 * 🔹 Marca pedido como entregado o cancelado
 */
export async function updateEstadoPedido(idPedido: number, nuevoEstado: "en_camino" | "entregado" | "cancelado") {
  // Insertar historial en estado_pedido
  const { error: insertError } = await supabase
    .from("estado_pedido")
    .insert([{ idpedido: idPedido, estado: nuevoEstado }]);
  if (insertError) throw insertError;

  // Trigger actualiza pedido.estado automáticamente
  return true;
}

/**
 * 🔹 Crea una notificación al cliente o emprendedor
 */
export async function createNotificacion({
  idpedido,
  tipo_receptor,
  titulo,
  mensaje,
  idrepartidor,
  idusuario,
}: {
  idpedido: number;
  tipo_receptor: "cliente" | "emprendedor";
  titulo: string;
  mensaje: string;
  idrepartidor: number;
  idusuario?: string;
}) {
  const { error } = await supabase.from("notificaciones").insert([
    {
      idpedido,
      tipo_receptor,
      titulo,
      mensaje,
      idrepartidor,
    },
  ]);
  if (error) throw error;
}

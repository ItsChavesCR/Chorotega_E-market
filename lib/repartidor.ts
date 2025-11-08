// src/lib/supabase/repartidor.ts
import { supabase } from "@/lib/supabase/client";

/**
 * 🔹 Obtiene el conteo de notificaciones no leídas del repartidor autenticado
 */
export async function getUnreadNotificationsCount() {
  // Obtener usuario actual
  const { data: auth } = await supabase.auth.getUser();
  const user = auth.user;
  if (!user) throw new Error("No hay sesión activa");

  // Buscar el perfil de repartidor (id bigint)
  const { data: perfil, error: perfilError } = await supabase
    .from("perfil_repartidor")
    .select("id")
    .eq("idusuario", user.id)
    .maybeSingle();

  if (perfilError) throw perfilError;
  if (!perfil) throw new Error("No se encontró perfil de repartidor");

  // Contar notificaciones no leídas
  const { count, error } = await supabase
    .from("notificaciones")
    .select("*", { count: "exact", head: true })
    .eq("tipo_receptor", "repartidor")
    .eq("idrepartidor", perfil.id)
    .eq("leida", false);

  if (error) throw error;
  return count ?? 0;
}


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
  // 🔹 Obtener usuario actual
  const { data: auth } = await supabase.auth.getUser();
  const user = auth.user;
  if (!user) throw new Error("No hay sesión activa");

  // 🔹 Buscar su perfil de repartidor (para obtener id bigint)
  const { data: perfil, error: perfilError } = await supabase
    .from("perfil_repartidor")
    .select("id")
    .eq("idusuario", user.id)
    .maybeSingle();

  if (perfilError) throw perfilError;
  if (!perfil) throw new Error("No se encontró perfil de repartidor");

  // 🔹 Listar pedidos donde idrepartidor = perfil.id
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
      nombrecliente
    `)
    .eq("idrepartidor", perfil.id)
    .order("createdat", { ascending: false });

  if (error) throw error;
  return data;
}

/**
 * 🔹 Marca pedido como entregado o cancelado
 */
export async function updateEstadoPedido(
  idPedido: number,
  nuevoEstado: "en_camino" | "entregado" | "cancelado"
) {
  const { error } = await supabase
    .from("estado_pedido")
    .insert([{ idpedido: idPedido, estado: nuevoEstado, rol: "repartidor" }]);

  if (error) throw error;
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

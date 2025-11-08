import { supabase } from "@/lib/supabase/client";

/**
 * Crea el registro en la tabla usuarios si no existe
 */
export async function ensureUserRow() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  const { data: existing } = await supabase
    .from("usuarios")
    .select("id")
    .eq("id", user.id)
    .maybeSingle();

  if (!existing) {
    await supabase.from("usuarios").insert({
      id: user.id,
      nombre: user.user_metadata?.name || user.email,
      email: user.email,
      verificado: user.email_confirmed_at ? true : false,
      created_at: new Date().toISOString(),
      id_rol: 1, // default client
    });
  }
}

/**
 * Obtiene el rol real del usuario, comprobando la tabla usuarios + roles
 */
export async function getUserRole(): Promise<string> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return "client";

  const { data: rows, error } = await supabase
    .from("usuarios")
    .select("id_rol, roles(nombre)")
    .eq("id", user.id);

  if (error) {
    console.error("Error obteniendo rol:", error.message);
    return "client";
  }

  const perfil = rows?.[0];

  // ✅ Determinar por id_rol (seguro)
  let role: string;

  switch (perfil?.id_rol) {
    case 1:
      role = "client";
      break;
    case 2:
      role = "entrepreneur";
      break;
    case 3:
      role = "repartidor";
      break;
    case 4:
      role = "admin";
      break;
    default:
      role = "client";
  }

  // ✅ sincronizar metadata si difiere
  if (user.user_metadata?.rol !== role) {
    await supabase.auth.updateUser({ data: { rol: role } });
  }

  return role;
}


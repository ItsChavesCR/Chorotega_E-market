import { supabase } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

/**
 * ✅ Crea la fila en 'usuarios' y el perfil correspondiente según el rol del usuario
 */
export async function ensureUserRow() {
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    console.warn("⚠️ No hay usuario autenticado, no se puede crear fila.");
    return;
  }

  console.log("📡 Usuario autenticado:", {
    id: user.id,
    email: user.email,
    metadata: user.user_metadata,
  });

  // Verifica si ya existe en 'usuarios'
  const { data: exists, error: checkError } = await supabase
    .from("usuarios")
    .select("id")
    .eq("id", user.id)
    .maybeSingle();

  if (checkError) {
    console.error("❌ Error verificando usuario:", checkError);
    return;
  }

  if (exists) {
    console.log("✅ Usuario ya existente en tabla 'usuarios'");
    return;
  }

  console.log("🧱 Usuario nuevo, creando fila en 'usuarios'...");

  // 1️⃣ Detectar el rol (usa tanto 'rol' como 'role' por compatibilidad)
  const metaRol = user.user_metadata?.rol ?? user.user_metadata?.role ?? "client";

  // 2️⃣ Buscar el ID del rol
  const { data: rolRow, error: rolError } = await supabase
    .from("roles")
    .select("id")
    .eq("nombre", metaRol)
    .maybeSingle();

  if (rolError || !rolRow) {
    console.error("❌ No se encontró el rol en la tabla 'roles':", rolError);
    return;
  }

  console.log(`🎯 Rol detectado: ${metaRol} (ID: ${rolRow.id})`);

  // 3️⃣ Insertar en tabla 'usuarios'
  const { error: userInsertError } = await supabase.from("usuarios").insert({
    id: user.id,
    email: user.email,
    nombre: user.user_metadata?.nombre ?? null,
    telefono: user.user_metadata?.telefono ?? null,
    id_rol: rolRow.id,
  });

  if (userInsertError) {
    console.error("❌ Error insertando usuario:", userInsertError);
    return;
  }

  console.log("✅ Usuario insertado correctamente en 'usuarios'");

  // 4️⃣ Crear perfil según el rol
  if (metaRol === "entrepreneur") {
    const { error: empError } = await supabase.from("perfil_emprendedor").insert({
      idusuario: user.id,
      nombrecomercio: user.user_metadata?.nombre_negocio ?? "Mi negocio",
      descripcion: user.user_metadata?.descripcion ?? null,
      redessociales: user.user_metadata?.redes
        ? { link: user.user_metadata.redes }
        : {},
    });

    if (empError) console.error("❌ Error insertando perfil_emprendedor:", empError);
    else console.log("✅ Perfil emprendedor insertado correctamente");
  }

  if (metaRol === "courier") {
    const { error: repError } = await supabase.from("perfil_repartidor").insert({
      idusuario: user.id,
      tipovehiculo: user.user_metadata?.tipo_vehiculo ?? null,
      placa: user.user_metadata?.placa ?? null,
      info_vehiculo: user.user_metadata?.info_vehiculo ?? null,
      zona: user.user_metadata?.zona_reparto ?? null,
    });

    if (repError) console.error("❌ Error insertando perfil_repartidor:", repError);
    else console.log("✅ Perfil repartidor insertado correctamente");
  }

  if (metaRol === "client") {
    console.log("🧾 Usuario cliente registrado, sin perfil adicional.");
  }
}
/**
 * ✅ Redirige automáticamente según el rol del usuario
 */
export async function routeByRole(router: ReturnType<typeof useRouter>, fallback?: string) {
  const { data: { session } } = await supabase.auth.getSession();
  const user = session?.user;
  if (!user) return router.push("/auth/login");

  const role = user.user_metadata?.role || user.user_metadata?.rol || "client";

  const redirectTo =
    role === "client"
      ? "/clientes"
      : role === "entrepreneur"
      ? "/dashboard/emprendedor"
      : role === "courier"
      ? "/dashboard/repartidor"
      : fallback ?? "/";

  router.push(redirectTo);
}

/**
 * ✅ Registra el usuario (Auth + tablas) y configura rol
 */
export async function registerUser(
  email: string,
  password: string,
  metadata: Record<string, any>,
  router: ReturnType<typeof useRouter>
) {
  console.log("🚀 Registrando usuario con metadata:", metadata);

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: metadata,
    },
  });

  if (error) throw new Error(error.message);

  // 🔹 Esperar a que la sesión esté lista
  supabase.auth.onAuthStateChange(async (event, session) => {
    if (event === "SIGNED_IN" && session?.user) {
      console.log("✅ Usuario autenticado, creando fila...");
      await ensureUserRow();
      await routeByRole(router);
    }
  });
}

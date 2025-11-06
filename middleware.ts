import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: (name) => req.cookies.get(name)?.value,
        set: (name, value, options) => {
          res.cookies.set({ name, value, ...options });
        },
        remove: (name, options) => {
          res.cookies.set({ name, value: "", ...options, maxAge: 0 });
        },
      },
    }
  );

  // ✅ Usa getUser() (seguro)
  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    console.log("🚫 No hay sesión activa, redirigiendo a login");
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }

  const user = data.user;
  const role = user.user_metadata?.rol || user.user_metadata?.role || "client";
  const path = req.nextUrl.pathname;

  console.log("🧩 Usuario autenticado:", user.email);
  console.log("🧩 Rol detectado:", role);
  console.log("🧭 Navegando hacia:", path);

  // ✅ Guardar el rol en cabecera temporal para que Next no revalide todo
  res.headers.set("x-user-role", role);

  // --- Rutas por rol ---
  const isEntrepreneur = path.startsWith("/dashboard/emprendedor");
  const isCourier = path.startsWith("/dashboard/repartidor");
  const isClient = path.startsWith("/dashboard/cliente");

  if (isEntrepreneur && role !== "entrepreneur") {
    return NextResponse.redirect(new URL("/unauthorized", req.url));
  }
  if (isCourier && role !== "courier") {
    return NextResponse.redirect(new URL("/unauthorized", req.url));
  }
  if (isClient && role !== "client") {
    return NextResponse.redirect(new URL("/unauthorized", req.url));
  }

  return res;
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    // opcionalmente podrías agregar más rutas privadas aquí
  ],
};

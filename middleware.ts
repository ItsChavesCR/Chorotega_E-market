import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { UserRole } from "./types/user";

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();

  // Crea cliente Supabase para middleware (usa cookies)
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: (name: string) => req.cookies.get(name)?.value,
        set: (name: string, value: string, options: any) => {
          res.cookies.set({
            name,
            value,
            ...options,
          });
        },
        remove: (name: string, options: any) => {
          res.cookies.set({
            name,
            value: "",
            ...options,
            maxAge: 0,
          });
        },
      },
    }
  );

  // Verificar sesión activa
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // Si no hay sesión → redirigir a login
  if (!session) {
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }

  // Extraer el rol del usuario desde el JWT o user_metadata
 const role =
  (session.user.user_metadata?.role ||
   session.user.user_metadata?.rol ||
   "client") as UserRole;

  // Rutas protegidas por rol
  const path = req.nextUrl.pathname;

  if (path.startsWith("/dashboard/emprendedor") && role !== "entrepreneur") {
    return NextResponse.redirect(new URL("/unauthorized", req.url));
  }
  if (path.startsWith("/dashboard/repartidor") && role !== "courier") {
    return NextResponse.redirect(new URL("/unauthorized", req.url));
  }
  if (path.startsWith("/clientes") && role !== "client") {
    return NextResponse.redirect(new URL("/unauthorized", req.url));
  }

  // Continuar con la petición si todo está bien
  return res;
}

// Configura las rutas donde aplica el middleware
export const config = {
  matcher: [
    "/dashboard/:path*", // protege todas las rutas de dashboard
  ],
};

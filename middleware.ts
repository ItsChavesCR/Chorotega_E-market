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

  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    console.log("🚫 No hay sesión activa, redirigiendo a login");
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }

  const user = data.user;
  const role = user.user_metadata?.rol || "client";
  const path = req.nextUrl.pathname;

  const rules: Record<string, string[]> = {
    client: ["/clientes"],
    entrepreneur: ["/dashboard/emprendedor"],
    repartidor: ["/dashboard/repartidor"],
    admin: ["/dashboard/admin"],
  };

  for (const [r, routes] of Object.entries(rules)) {
    if (routes.some((p) => path.startsWith(p)) && r !== role) {
      console.warn(`❌ Acceso denegado para ${user.email} a ${path}`);
      return NextResponse.redirect(new URL("/unauthorized", req.url));
    }
  }

  return res;
}

export const config = {
  matcher: ["/dashboard/:path*", "/clientes/:path*"], // ❌ no incluyas /auth/*
};


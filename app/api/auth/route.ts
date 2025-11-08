// src/app/api/auth/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function POST(req: NextRequest) {
  const { event, session } = await req.json();

  const res = NextResponse.json({ ok: true });

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

  try {
    if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED" || event === "USER_UPDATED") {
      // ⬇️ Graba la sesión en cookie para que el middleware la lea
      await supabase.auth.setSession({
        access_token: session?.access_token ?? "",
        refresh_token: session?.refresh_token ?? "",
      });
    } else if (event === "SIGNED_OUT") {
      await supabase.auth.signOut();
    }
    return res;
  } catch (e) {
    console.error("❌ Error set-cookie SSR:", e);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}

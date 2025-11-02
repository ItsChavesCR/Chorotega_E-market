import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

export function createSupabaseServerClient() {
  const cookieStore = cookies(); // 🔹 nuevo API en Next 14/15

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: async (name: string) => {
          const store = await cookieStore;
          return store.get(name)?.value;
        },
        set: async (name: string, value: string, options: any) => {
          const store = await cookieStore;
          // set solo se puede usar en server actions / route handlers
          store.set({ name, value, ...options });
        },
        remove: async (name: string, options: any) => {
          const store = await cookieStore;
          store.set({ name, value: "", ...options, maxAge: 0 });
        },
      },
    }
  );
}

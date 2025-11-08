"use client";

import { useEffect } from "react";
import { supabase } from "@/lib/supabase/client";

export function AuthCookieSync() {
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        await fetch("/api/auth", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ event, session }),
        });
      }
    );
    return () => subscription.unsubscribe();
  }, []);

  return null;
}

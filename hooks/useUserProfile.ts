"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase/client"

export function useUserProfile() {
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data: auth } = await supabase.auth.getUser()
        if (!auth?.user) return
        setUser(auth.user)

        const { data, error } = await supabase
          .from("usuarios")
          .select("id, nombre, telefono, email")
          .eq("id", auth.user.id)
          .single()
        if (error) throw error
        setProfile(data)
      } catch (e) {
        console.error("Error cargando perfil:", e)
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [])

  return { user, profile, setProfile, loading }
}

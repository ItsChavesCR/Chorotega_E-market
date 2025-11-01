"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase/client"

export interface Business {
  id: number
  nombrecomercio: string
  descripcion: string | null
  logo: string | null
  categoria?: string | null
}

export function useBusinesses() {
  const [businesses, setBusinesses] = useState<Business[]>([])
  const [filtered, setFiltered] = useState<Business[]>([])
  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchBusinesses = async () => {
      setLoading(true)
      const { data, error } = await supabase
        .from("perfil_emprendedor")
        .select("id, nombrecomercio, descripcion, logo")
        .order("nombrecomercio", { ascending: true })

      if (error) {
        console.error("Error al cargar negocios:", error.message)
      }

      if (data) {
        setBusinesses(data)
        setFiltered(data)
      }
      setLoading(false)
    }

    fetchBusinesses()
  }, [])

  useEffect(() => {
    if (!search.trim()) {
      setFiltered(businesses)
    } else {
      const lower = search.toLowerCase()
      setFiltered(
        businesses.filter((b) => b.nombrecomercio.toLowerCase().includes(lower))
      )
    }
  }, [search, businesses])

  return {
    businesses: filtered,
    loading,
    setSearch,
  }
}

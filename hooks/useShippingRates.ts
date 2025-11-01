"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase/client"

interface TarifaEnvio {
  id: number
  provincia: string
  canton: string
  distrito: string
  tipo_envio: string
  costo: number
}

export function useShippingRates(
  provincia: string,
  canton: string,
  distrito: string,
  tipo_envio: string
) {
  const [shipping, setShipping] = useState<number>(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchRate = async () => {
      if (!provincia || !canton || !distrito || !tipo_envio) return

      setLoading(true)
      setError(null)

      const { data, error } = await supabase
        .from("tarifas_envio")
        .select("costo")
        .eq("provincia", provincia)
        .eq("canton", canton)
        .eq("distrito", distrito)
        .eq("tipo_envio", tipo_envio)
        .maybeSingle()

      if (error) {
        console.error("Error cargando tarifa:", error.message)
        setError(error.message)
        setShipping(0)
      } else {
        setShipping(data?.costo ?? 0)
      }

      setLoading(false)
    }

    fetchRate()
  }, [provincia, canton, distrito, tipo_envio])

  return { shipping, loading, error }
}

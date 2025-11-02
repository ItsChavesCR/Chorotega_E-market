"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase/client"
import { Product } from "@/services/products/types"

export function useProducts(idemprendedor?: number) {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true)
      setError(null)

      // 🔹 Construimos la consulta
      let query = supabase
        .from("producto")
        .select(
          `
          id,
          idemprendedor,
          idcategoria,
          nombre,
          descripcion,
          precio,
          stock,
          activo,
          imagenes
        `
        )
        .eq("activo", true)

      if (idemprendedor) {
        query = query.eq("idemprendedor", idemprendedor)
      }

      const { data, error } = await query

      if (error) {
        console.error("Error al cargar productos:", error.message)
        setError(error.message)
      } else if (data) {
        // 🔹 Aseguramos que las imágenes sean un array
        const mapped = data.map((p) => ({
          ...p,
          imagenes: Array.isArray(p.imagenes)
            ? p.imagenes
            : typeof p.imagenes === "string"
            ? [p.imagenes]
            : [],
        })) as Product[]

        setProducts(mapped)
      }

      setLoading(false)
    }

    fetchProducts()
  }, [idemprendedor])

  return { products, loading, error }
}

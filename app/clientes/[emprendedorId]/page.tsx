"use client"

import { use, useEffect, useState } from "react"
import { supabase } from "@/lib/supabase/client"
import { ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"
import BusinessHeader from "@/components/dashboard/clientes/BusinessHeader"
import FiltersBar from "@/components/dashboard/clientes/FiltersBar"
import ProductGrid from "@/components/dashboard/clientes/ProductGrid"

export default function EmprendedorPage({
  params,
}: {
  params: Promise<{ emprendedorId: string }>
}) {
  const { emprendedorId } = use(params)
  const [negocio, setNegocio] = useState<any>(null)
  const [productos, setProductos] = useState<any[]>([])
  const [search, setSearch] = useState("")
  const [sort, setSort] = useState("recientes")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    const fetchData = async () => {
      const id = Number(emprendedorId)
      if (isNaN(id)) {
        setError("ID inválido")
        setLoading(false)
        return
      }

      try {
        // 🧩 Cargar datos del negocio
        const { data: negocioData, error: negocioError } = await supabase
          .from("perfil_emprendedor")
          .select("*")
          .eq("id", id)
          .single()

        if (negocioError) throw negocioError
        setNegocio(negocioData)

        // 🧩 Cargar productos activos
        const { data: productosData, error: productosError } = await supabase
          .from("producto")
          .select("*")
          .eq("idemprendedor", id)
          .eq("activo", true)

        if (productosError) throw productosError

        // 🧩 Eliminar duplicados (por id)
        const uniqueProducts = productosData
          ? productosData.filter(
              (item, index, self) =>
                index === self.findIndex((p) => p.id === item.id)
            )
          : []

        setProductos(uniqueProducts)
      } catch (err) {
        setError("Error al cargar el negocio")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [emprendedorId])

  // 🧩 Filtro y ordenamiento
  const filteredProducts = productos
    .filter((p) =>
      p.nombre.toLowerCase().includes(search.toLowerCase().trim())
    )
    .sort((a, b) => {
      if (sort === "precioAsc") return a.precio - b.precio
      if (sort === "precioDesc") return b.precio - a.precio
      return b.id - a.id // más recientes
    })

  if (loading) return <p className="text-center p-6">Cargando...</p>
  if (error) return <p className="text-center p-6 text-red-500">{error}</p>
  if (!negocio) return <p className="text-center p-6">Negocio no encontrado.</p>


return (
  <div className="p-6 max-w-6xl mx-auto">
    {/* 🔙 Botón Volver */}
    <button
      onClick={() => router.back()}
      className="flex items-center gap-2 text-gray-600 mb-6"
    >
      <ArrowLeft className="h-4 w-4" /> Volver
    </button>

    <BusinessHeader negocio={negocio} />
    <FiltersBar
      search={search}
      setSearch={setSearch}
      sort={sort}
      setSort={setSort}
    />
    <ProductGrid productos={filteredProducts} />
  </div>
)
}
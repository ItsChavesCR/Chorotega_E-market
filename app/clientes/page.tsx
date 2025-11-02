"use client"

import { useEffect, useState } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useBusinesses } from "@/hooks/useBusinesses"
import BusinessGrid from "@/components/dashboard/clientes/BusinessGrid"
import HeaderIcons from "@/components/dashboard/clientes/HeaderIcons"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Search, Filter } from "lucide-react"

export default function ClientesPage() {
  const supabase = createClientComponentClient()
  const { businesses, loading, setSearch } = useBusinesses()
  const [search, setLocalSearch] = useState("")
  const [category, setCategory] = useState("")
  const [categories, setCategories] = useState<string[]>([])

  // 🔹 Cargar categorías desde Supabase
  useEffect(() => {
    const loadCategories = async () => {
      const { data, error } = await supabase.from("categoria").select("nombre")
      if (!error && data) {
        setCategories(data.map((c) => c.nombre))
      }
    }
    loadCategories()
  }, [supabase])

  // 🔹 Pasar la búsqueda al hook de negocios
  useEffect(() => {
    setSearch(search)
  }, [search, setSearch])

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-8">

      {/* 🔍 Buscador + Filtro de categoría */}
      <section className="flex flex-col sm:flex-row items-center justify-between mb-6 gap-3 mt-2">
        {/* Buscador */}
        <div className="flex items-center bg-white shadow-sm rounded-lg px-3 py-2 w-full sm:w-72">
          <Search className="w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar emprendimientos..."
            value={search}
            onChange={(e) => setLocalSearch(e.target.value)}
            className="ml-2 w-full outline-none text-sm bg-transparent"
          />
        </div>

        {/* Filtro de categorías */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 text-sm bg-white px-3 py-2 rounded-lg shadow-sm hover:bg-gray-50 transition">
              <Filter className="w-4 h-4" />
              {category || "Categorías"}
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Filtrar por categoría</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => setCategory("")}>
              Todas
            </DropdownMenuItem>
            {categories.map((cat) => (
              <DropdownMenuItem key={cat} onClick={() => setCategory(cat)}>
                {cat}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </section>

      {/* 🧩 Grid de negocios */}
      <BusinessGrid businesses={businesses} loading={loading} selectedCategory={category} />
    </div>
  )
}

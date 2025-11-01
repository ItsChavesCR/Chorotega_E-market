"use client"

import { Search, Filter } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"


interface Props {
  search: string
  setSearch: (v: string) => void
  category: string
  setCategory: (v: string) => void
  categories: string[]
}

export default function BusinessFiltersBar({
  search,
  setSearch,
  category,
  setCategory,
  categories,
}: Props) {
  return (
    <section className="flex flex-col sm:flex-row items-center justify-between mb-6 gap-3">
      {/* 🔍 Buscador de negocios */}
      <div className="flex items-center bg-white shadow-sm rounded-lg px-3 py-2 w-full sm:w-72">
        <Search className="w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="Buscar emprendimientos..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="ml-2 w-full outline-none text-sm"
        />
      </div>

      <div className="flex items-center gap-4">
        {/* 🔽 Filtro de categorías */}
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

    
      </div>
    </section>
  )
}

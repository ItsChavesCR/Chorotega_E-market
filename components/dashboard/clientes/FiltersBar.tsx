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
  sort: string
  setSort: (v: string) => void
}

export default function FiltersBar({ search, setSearch, sort, setSort }: Props) {
  return (
    <section className="flex flex-col sm:flex-row items-center justify-between mb-6 gap-3">
      {/* 🔍 Buscador */}
      <div className="flex items-center bg-white shadow-sm rounded-lg px-3 py-2 w-full sm:w-72">
        <Search className="w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="Buscar productos..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="ml-2 w-full outline-none text-sm"
        />
      </div>

      <div className="flex items-center gap-4">
        {/* 🔽 Filtro de ordenamiento */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 text-sm bg-white px-3 py-2 rounded-lg shadow-sm hover:bg-gray-50 transition">
              <Filter className="w-4 h-4" />
              {sort === "recientes"
                ? "Más recientes"
                : sort === "precioAsc"
                ? "Precio: menor a mayor"
                : sort === "precioDesc"
                ? "Precio: mayor a menor"
                : "Ordenar por"}
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Ordenar por</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => setSort("recientes")}>
              Más recientes
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setSort("precioAsc")}>
              Precio: menor a mayor
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setSort("precioDesc")}>
              Precio: mayor a menor
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </section>
  )
}

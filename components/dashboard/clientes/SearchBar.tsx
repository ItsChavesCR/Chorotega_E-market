"use client"

import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

interface SearchBarProps {
  onSearch: (value: string) => void
}

export default function SearchBar({ onSearch }: SearchBarProps) {
  return (
    <div className="relative w-full max-w-md">
      <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
      <Input
        placeholder="Buscar emprendimientos..."
        className="pl-9"
        onChange={(e) => onSearch(e.target.value)}
      />
    </div>
  )
}

"use client"

import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Filter } from "lucide-react"

export default function FiltersDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon">
          <Filter className="h-5 w-5" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Filtrar por categoría</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-gray-500">
          En esta versión, los filtros de categoría no están activos.
        </p>
      </DialogContent>
    </Dialog>
  )
}

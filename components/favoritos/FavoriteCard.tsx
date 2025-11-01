"use client"

import Image from "next/image"
import { Heart, ShoppingCart } from "lucide-react"
import { useClientStore } from "@/hooks/useClientStore"
import { useToast } from "@/components/ui/use-toast"
import { Product } from "@/services/products/types"

export default function FavoriteCard({ producto }: { producto: Product }) {
  const { removeFromFavorites, addToCart, isInCart } = useClientStore()
  const { toast } = useToast()
  const enCarrito = isInCart(producto.id)

  const handleRemove = () => {
    removeFromFavorites(producto.id)
    toast({
      title: "Eliminado de favoritos",
      description: `${producto.nombre} fue eliminado.`,
      variant: "destructive",
    })
  }

  const handleAddToCart = () => {
    if (enCarrito) {
      toast({
        title: "Ya está en el carrito",
        description: `${producto.nombre} ya fue agregado.`,
      })
      return
    }
    addToCart(producto)
    toast({
      title: "Añadido al carrito 🛒",
      description: `${producto.nombre} se agregó correctamente.`,
    })
  }

  return (
    <div className="bg-white border rounded-lg shadow-sm overflow-hidden hover:shadow-md transition flex flex-col">
      <div className="relative w-full aspect-square">
        <Image
          src={producto.imagenes?.[0] || "/placeholder.jpg"}
          alt={producto.nombre}
          fill
          className="object-cover"
        />
        <button
          onClick={handleRemove}
          className="absolute top-2 right-2 bg-white/80 rounded-full p-1 hover:bg-white"
        >
          <Heart className="w-4 h-4 text-red-500 fill-red-500" />
        </button>
      </div>

      <div className="p-3 flex flex-col flex-1 justify-between">
        <div>
          <h3 className="font-semibold text-sm line-clamp-1">
            {producto.nombre}
          </h3>
          <p className="text-xs text-gray-500 line-clamp-2">
            {producto.descripcion}
          </p>
        </div>
        <div className="mt-2 flex justify-between items-center">
          <span className="text-sm font-semibold text-gray-900">
            ₡{producto.precio.toLocaleString()}
          </span>
          <button
            onClick={handleAddToCart}
            className="text-xs bg-primary text-white px-2 py-1 rounded-md hover:bg-primary/90 flex items-center gap-1"
          >
            <ShoppingCart className="w-4 h-4" />
            {enCarrito ? "En carrito" : "Agregar"}
          </button>
        </div>
      </div>
    </div>
  )
}

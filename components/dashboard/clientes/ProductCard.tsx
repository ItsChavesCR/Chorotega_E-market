"use client"

import { useState } from "react"
import Image from "next/image"
import { Heart, ShoppingCart, Check } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useClientStore } from "@/hooks/useClientStore"
import { useToast } from "@/components/ui/use-toast"
import { Product } from "@/services/products/types"

export default function ProductCard({ producto }: { producto: Product }) {
  const { addToCart, addToFavorites, removeFromFavorites, isFavorite } =
    useClientStore()
  const { toast } = useToast()
  const [adding, setAdding] = useState(false)
  const favorito = isFavorite(producto.id)

  const handleFavorite = () => {
    if (favorito) {
      removeFromFavorites(producto.id)
      toast({
        title: "Eliminado de favoritos",
        description: `${producto.nombre} se ha quitado de tu lista.`,
        variant: "destructive",
      })
    } else {
      addToFavorites(producto)
      toast({
        title: "Añadido a favoritos ❤️",
        description: `${producto.nombre} se ha agregado a tus favoritos.`,
      })
    }
  }

  const handleAddToCart = () => {
    if (adding) return
    setAdding(true)
    addToCart(producto)
    if (navigator.vibrate) navigator.vibrate(100)

    toast({
      title: "Añadido al carrito 🛒",
      description: `${producto.nombre} se ha agregado al carrito.`,
    })

    setTimeout(() => setAdding(false), 800)
  }

  const imagen =
    producto.imagenes && producto.imagenes.length > 0
      ? producto.imagenes[0]
      : "/placeholder.jpg"

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="bg-white rounded-xl shadow-sm hover:shadow-md transition p-3 flex flex-col relative border"
    >
      <div className="relative w-full aspect-square rounded-lg overflow-hidden">
        <Image
          src={imagen}
          alt={producto.nombre}
          fill
          className="object-cover"
        />
        <button
          onClick={handleFavorite}
          className="absolute top-2 right-2 bg-white/80 rounded-full p-1 hover:bg-white transition"
        >
          <Heart
            className={`w-5 h-5 ${
              favorito ? "text-red-500 fill-red-500" : "text-gray-600"
            }`}
          />
        </button>
      </div>

      <div className="mt-3 flex-1">
        <h3 className="font-semibold text-sm line-clamp-1">
          {producto.nombre}
        </h3>
        <p className="text-gray-500 text-xs line-clamp-2">
          {producto.descripcion}
        </p>
      </div>

      <div className="mt-3 flex items-center justify-between">
        <span className="font-semibold text-sm text-gray-900">
          ₡{producto.precio.toLocaleString()}
        </span>

        <motion.button
          onClick={handleAddToCart}
          disabled={adding}
          className={`flex items-center gap-1 px-2 py-1 text-xs rounded-lg text-white transition-all ${
            adding ? "bg-green-600" : "bg-primary hover:bg-primary/90"
          }`}
          whileTap={{ scale: 0.95 }}
        >
          <AnimatePresence mode="wait" initial={false}>
            {adding ? (
              <motion.span
                key="added"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                transition={{ duration: 0.3 }}
                className="flex items-center gap-1"
              >
                <Check className="w-4 h-4" />
                Añadido
              </motion.span>
            ) : (
              <motion.span
                key="add"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                transition={{ duration: 0.3 }}
                className="flex items-center gap-1"
              >
                <ShoppingCart className="w-4 h-4" />
                Añadir
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>
      </div>
    </motion.div>
  )
}

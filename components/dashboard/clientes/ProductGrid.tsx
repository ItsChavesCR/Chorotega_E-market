"use client"

import ProductCard from "./ProductCard"
import { Product } from "@/services/products/types"

export default function ProductGrid({ productos }: { productos: Product[] }) {
  if (!productos || productos.length === 0)
    return (
      <p className="text-center text-gray-500 mt-10">
        No hay productos disponibles.
      </p>
    )

  const uniqueProducts = productos.filter(
    (p, i, arr) => arr.findIndex((x) => x.id === p.id) === i
  )

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
      {uniqueProducts.map((p) => (
        <ProductCard key={p.id} producto={p} />
      ))}
    </div>
  )
}

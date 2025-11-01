"use client"

import { useClientStore } from "@/hooks/useClientStore"

interface Props {
  shipping: number
}

export default function CheckoutSummary({ shipping }: Props) {
  const { carrito, total } = useClientStore()
  const subtotal = total()
  const totalFinal = subtotal + (shipping || 0)

  return (
    <div className="bg-white p-6 rounded-lg shadow h-fit">
      <h2 className="text-lg font-semibold mb-3">Resumen del pedido</h2>

      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span>Subtotal:</span>
          <span>₡{subtotal.toLocaleString()}</span>
        </div>
        <div className="flex justify-between text-gray-500">
          <span>Envío:</span>
          <span>
            {shipping === 0
              ? "Gratis / Retiro local"
              : `₡${shipping.toLocaleString()}`}
          </span>
        </div>
        <hr className="my-2" />
        <div className="flex justify-between font-semibold">
          <span>Total:</span>
          <span>₡{totalFinal.toLocaleString()}</span>
        </div>
      </div>

      <p className="text-xs text-gray-400 mt-3">
        * El costo de envío puede variar según la ubicación final.
      </p>

      {carrito.length === 0 && (
        <p className="text-xs text-red-500 mt-3">
          ⚠️ No tienes productos en el carrito.
        </p>
      )}
    </div>
  )
}

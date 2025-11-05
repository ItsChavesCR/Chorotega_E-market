"use client"

import Image from "next/image"
import { Trash2, ShoppingCart } from "lucide-react"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { useClientStore } from "@/hooks/useClientStore"
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"

export default function CartDrawer() {
  const { carrito, removeFromCart, updateQuantity, total, clearCart } =
    useClientStore()
  const { toast } = useToast()
  const router = useRouter()

  return (
    <Sheet>
      <SheetTrigger asChild>
        <button className="relative hover:text-primary transition">
          <ShoppingCart className="w-5 h-5  hover:text-gray-900 cursor-pointer transition" />
          {carrito.length > 0 && (
            <span className="absolute -top-2 -right-2 bg-primary text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">
              {carrito.length}
            </span>
          )}
        </button>
      </SheetTrigger>

      <SheetContent
        side="right"
        className="w-full sm:max-w-[600px] md:max-w-[650px] flex flex-col"
      >
        <SheetHeader>
          <SheetTitle className="text-lg font-semibold flex items-center gap-2">
            🛒 Tu carrito
          </SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto mt-4 space-y-4 pr-1">
          {carrito.length === 0 ? (
            <p className="text-center text-gray-500 mt-10">
              Tu carrito está vacío 🛒
            </p>
          ) : (
            carrito.map((p) => (
              <div
                key={p.id}
                className="flex items-center gap-4 bg-white border rounded-lg p-4 shadow-sm"
              >
                <div className="relative w-24 h-24 flex-shrink-0">
                  <Image
                    src={p.imagenes?.[0] || "/placeholder.jpg"}
                    alt={p.nombre}
                    fill
                    className="object-cover rounded-md"
                  />
                </div>

                <div className="flex-1">
                  <h4 className="text-base font-medium line-clamp-1">
                    {p.nombre}
                  </h4>
                  <p className="text-sm text-gray-500 mb-1">
                    ₡{p.precio.toLocaleString()}
                  </p>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() =>
                        updateQuantity(p.id, Math.max((p.cantidad || 1) - 1, 1))
                      }
                      className="px-2 py-1 border rounded-l-md text-sm"
                    >
                      -
                    </button>
                    <span className="px-3 border-t border-b text-sm">
                      {p.cantidad || 1}
                    </span>
                    <button
                      onClick={() =>
                        updateQuantity(p.id, (p.cantidad || 1) + 1)
                      }
                      className="px-2 py-1 border rounded-r-md text-sm"
                    >
                      +
                    </button>
                  </div>

                  <p className="text-xs text-gray-400 mt-1">
                    Subtotal: ₡{(p.precio * (p.cantidad || 1)).toLocaleString()}
                  </p>
                </div>

                <button
                  onClick={() => {
                    removeFromCart(p.id)
                    toast({
                      title: "Producto eliminado 🗑️",
                      description: `${p.nombre} fue eliminado del carrito.`,
                      variant: "destructive",
                    })
                  }}
                  className="p-1 hover:text-red-500 transition"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            ))
          )}
        </div>

        {carrito.length > 0 && (
          <div className="border-t p-8 space-y-3">
            <div className="text-sm space-y-2">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>₡{total().toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-gray-500">
                <span>Envío:</span>
                <span>Pendiente</span>
              </div>
              <div className="flex justify-between font-semibold">
                <span>Total estimado:</span>
                <span>₡{total().toLocaleString()}</span>
              </div>
            </div>

            <Button
              className="w-full bg-primary text-white rounded-lg hover:bg-primary/90"
              onClick={() => router.push("/checkout")}
            >
              Finalizar compra
            </Button>

            <Button
              variant="ghost"
              onClick={() => {
                clearCart()
                toast({
                  title: "Carrito vaciado 🧹",
                  description: "Se eliminaron todos los productos.",
                })
              }}
              className="w-full text-sm text-gray-500 hover:text-red-500 transition"
            >
              Vaciar carrito
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}

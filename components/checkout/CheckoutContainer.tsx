"use client"

import { useState } from "react"
import CheckoutForm from "./CheckoutForm"
import CheckoutSummary from "./CheckoutSummary"
import { useClientStore } from "@/hooks/useClientStore"
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase/client"
import { Product } from "@/services/products/types"

export default function CheckoutContainer() {
  const { carrito, clearCart, total } = useClientStore() as {
    carrito: Product[]
    clearCart: () => void
    total: () => number
  }

  const { toast } = useToast()
  const router = useRouter()
  const [shipping, setShipping] = useState(0)
  const [formData, setFormData] = useState<any>(null)

  const subtotal = total()
  const totalFinal = subtotal + (shipping || 0)

  const handleSubmit = async (form: any) => {
    if (carrito.length === 0) {
      toast({
        title: "Tu carrito está vacío 🛒",
        description: "Agrega productos antes de finalizar tu compra.",
        variant: "destructive",
      })
      return
    }

    try {
      setFormData(form)

      // 🔹 Intentar obtener usuario actual (si existe)
      let userId: string | null = null

      try {
        const { data } = await supabase.auth.getUser()
        userId = data.user?.id ?? null
      } catch {
        console.warn("⚠️ No hay sesión activa, se usará ID temporal para pruebas.")
      }

      if (!userId) {
        userId = crypto.randomUUID() // UUID temporal
      }

      // 🧾 Crear el objeto del pedido completo
      const pedido = {
        idusuario: userId,
        idemprendedor: carrito[0]?.idemprendedor ?? 1,
        total: subtotal,
        totalenvio: form.tipo_envio === "retiro_local" ? 0 : shipping,
        estado: "confirmado",

        provincia: form.provincia,
        canton: form.canton,
        distrito: form.distrito,
        barrio: form.barrio,
        referencia_envio: form.direccion,
        tipo_envio: form.tipo_envio,
        direccionentrega: form.direccion,
        idtarifa: form.idtarifa ?? null,

        createdat: new Date().toISOString(),
      }

      // ⚙️ Insertar pedido en Supabase
      const { data: pedidoData, error: pedidoError } = await supabase
        .from("pedido")
        .insert([pedido])
        .select("id")
        .single()

      if (pedidoError || !pedidoData) {
        console.error(pedidoError)
        toast({
          title: "Error al crear el pedido 😞",
          description:
            pedidoError?.message || "No se pudo guardar el pedido en Supabase.",
          variant: "destructive",
        })
        return
      }

      const pedidoId = pedidoData.id

      // 🧾 Insertar los productos del pedido
      const itemsToInsert = carrito.map((p) => ({
        idpedido: pedidoId,
        idproducto: p.id,
        cantidad: p.cantidad || 1,
        preciounitario: p.precio || 0,
      }))

      const { error: itemsError } = await supabase
        .from("pedido_item")
        .insert(itemsToInsert)

      if (itemsError) {
        console.error(itemsError)
        toast({
          title: "Error al guardar los productos",
          description: itemsError.message,
          variant: "destructive",
        })
        return
      }

      // ✅ Éxito
      toast({
        title: "Pedido confirmado 🎉",
        description: `Gracias ${form.nombre}, tu pedido ha sido registrado correctamente.`,
      })

      console.log("🧾 Pedido guardado en Supabase:", {
        pedidoId,
        cliente: form,
        carrito,
        subtotal,
        envio: shipping,
        total: totalFinal,
      })

      clearCart()
      setTimeout(() => router.push("/clientes"), 1500)
    } catch (error) {
      console.error("❌ Error general al procesar pedido:", error)
      toast({
        title: "Error inesperado",
        description: "Ocurrió un problema al procesar tu pedido.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="container max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold mb-6 flex items-center gap-2">
        💳 Finalizar compra
      </h1>

      <div className="grid md:grid-cols-2 gap-6">
        <CheckoutForm
          onSubmit={handleSubmit}
          onShippingChange={(costo) => setShipping(costo)}
        />
        <CheckoutSummary shipping={shipping} />
      </div>
    </div>
  )
}

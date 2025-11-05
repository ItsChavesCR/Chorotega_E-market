"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState, useEffect, useMemo } from "react"
import { supabase } from "@/lib/supabase/client"

interface Props {
  onSubmit: (formData: any) => void
  onShippingChange: (cost: number) => void
}

interface TarifaEnvio {
  id: number
  provincia: string
  canton: string
  distrito: string
  barrio?: string | null
  tipo_envio: string
  costo: number
}

export default function CheckoutForm({ onSubmit, onShippingChange }: Props) {
  const [tarifas, setTarifas] = useState<TarifaEnvio[]>([])
  const [loading, setLoading] = useState(true)

  const [form, setForm] = useState({
    nombre: "",
    telefono: "",
    provincia: "",
    canton: "",
    distrito: "",
    barrio: "",
    tipo_envio: "",
    direccion: "",
    metodoPago: "Efectivo",
    idtarifa: null as number | null,
  })

  // 🔹 Cargar tarifas desde Supabase
  useEffect(() => {
    const fetchTarifas = async () => {
      setLoading(true)
      const { data, error } = await supabase
        .from("tarifas_envio")
        .select("*")
        .order("provincia", { ascending: true })

      if (error) {
        console.error("Error al cargar tarifas:", error.message)
      } else if (data) {
        setTarifas(data)
      }

      setLoading(false)
    }

    fetchTarifas()
  }, [])

  // 🔹 Generar listas dependientes
  const provincias = useMemo(
    () => Array.from(new Set(tarifas.map((r) => r.provincia))),
    [tarifas]
  )

  const cantones = useMemo(
    () =>
      tarifas
        .filter((r) => r.provincia === form.provincia)
        .map((r) => r.canton)
        .filter((v, i, a) => a.indexOf(v) === i),
    [tarifas, form.provincia]
  )

  const distritos = useMemo(
    () =>
      tarifas
        .filter(
          (r) => r.provincia === form.provincia && r.canton === form.canton
        )
        .map((r) => r.distrito)
        .filter((v, i, a) => a.indexOf(v) === i),
    [tarifas, form.provincia, form.canton]
  )

  const barrios = useMemo(
    () =>
      tarifas
        .filter(
          (r) =>
            r.provincia === form.provincia &&
            r.canton === form.canton &&
            r.distrito === form.distrito
        )
        .map((r) => r.barrio || "")
        .filter((v, i, a) => a.indexOf(v) === i),
    [tarifas, form.provincia, form.canton, form.distrito]
  )

  const tiposEnvio = ["domicilio", "retiro_local", "punto_encuentro"]

  // 🔹 Calcular costo e idtarifa cuando cambian los datos
  useEffect(() => {
    if (!form.tipo_envio || !form.provincia || !form.canton || !form.distrito)
      return

    const match = tarifas.find(
      (r) =>
        r.provincia === form.provincia &&
        r.canton === form.canton &&
        r.distrito === form.distrito &&
        (r.barrio === form.barrio || !r.barrio) &&
        r.tipo_envio === form.tipo_envio
    )

    const costo = form.tipo_envio === "retiro_local" ? 0 : match?.costo ?? 0
    onShippingChange(costo)

    // 🔹 Guardar el idtarifa correspondiente
    setForm((prev) => ({
      ...prev,
      idtarifa: match?.id ?? null,
    }))
  }, [form.provincia, form.canton, form.distrito, form.barrio, form.tipo_envio, tarifas, onShippingChange])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(form)
  }

  // 🔹 UI
  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 bg-white p-6 rounded-lg shadow"
    >
      <h2 className="text-lg font-semibold mb-8">Datos de envío</h2>

      <div className=" flex flex-col gap-3">
        <Label>Nombre completo</Label>
        <Input
          value={form.nombre}
          onChange={(e) => setForm({ ...form, nombre: e.target.value })}
          required
        />
      </div>

      <div className=" flex flex-col gap-3">
        <Label>Teléfono</Label>
        <Input
          type="tel"
          value={form.telefono}
          onChange={(e) => setForm({ ...form, telefono: e.target.value })}
          required
        />
      </div>

      {/* Provincia, Cantón, Distrito, Barrio */}
      <div className="grid grid-cols-2 gap-3">
        <div className=" flex flex-col gap-3">
          <Label>Provincia</Label>
          <select
            className="border rounded-md w-full p-2 text-sm"
            value={form.provincia}
            onChange={(e) =>
              setForm({
                ...form,
                provincia: e.target.value,
                canton: "",
                distrito: "",
                barrio: "",
              })
            }
            required
          >
            <option value="">Seleccionar</option>
            {provincias.map((p) => (
              <option key={p}>{p}</option>
            ))}
          </select>
        </div>

        <div className=" flex flex-col gap-3">
          <Label>Cantón</Label>
          <select
            className="border rounded-md w-full p-2 text-sm"
            value={form.canton}
            onChange={(e) =>
              setForm({
                ...form,
                canton: e.target.value,
                distrito: "",
                barrio: "",
              })
            }
            required
            disabled={!form.provincia}
          >
            <option value="">Seleccionar</option>
            {cantones.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </div>

        <div className=" flex flex-col gap-3">
          <Label>Distrito</Label>
          <select
            className="border rounded-md w-full p-2 text-sm"
            value={form.distrito}
            onChange={(e) =>
              setForm({
                ...form,
                distrito: e.target.value,
                barrio: "",
              })
            }
            required
            disabled={!form.canton}
          >
            <option value="">Seleccionar</option>
            {distritos.map((d) => (
              <option key={d}>{d}</option>
            ))}
          </select>
        </div>

        <div className=" flex flex-col gap-3">
          <Label>Barrio</Label>
          <select
            className="border rounded-md w-full p-2 text-sm"
            value={form.barrio}
            onChange={(e) => setForm({ ...form, barrio: e.target.value })}
            disabled={!form.distrito}
          >
            <option value="">Seleccionar</option>
            {barrios.map((b) => (
              <option key={b}>{b}</option>
            ))}
          </select>
        </div>
      </div>

      <div className=" flex flex-col gap-3">
        <Label>Tipo de envío</Label>
        <select
          className="border rounded-md w-full p-2 text-sm"
          value={form.tipo_envio}
          onChange={(e) => setForm({ ...form, tipo_envio: e.target.value })}
          required
        >
          <option value="">Seleccionar</option>
          {tiposEnvio.map((t) => (
            <option key={t} value={t}>
              {t === "domicilio"
                ? "Entrega a domicilio"
                : t === "retiro_local"
                ? "Retiro en local"
                : "Punto de encuentro"}
            </option>
          ))}
        </select>
      </div>

      <div className=" flex flex-col gap-3">
        <Label>Dirección exacta / referencia</Label>
        <textarea
          className="border rounded-md w-full p-2 text-sm resize-none"
          placeholder="Ejemplo: Casa verde al lado de la pulpería San Martín"
          value={form.direccion}
          onChange={(e) => setForm({ ...form, direccion: e.target.value })}
          rows={3}
          required
        />
      </div>

      <div  className=" flex flex-col gap-3 pb-8">
        <Label>Método de pago</Label>
        <select
          className="border rounded-md w-full p-2 text-sm"
          value={form.metodoPago}
          onChange={(e) => setForm({ ...form, metodoPago: e.target.value })}
        >
          <option>Efectivo</option>
          <option>Sinpe Móvil</option>
        </select>
      </div>

      <button
        type="submit"
        className="w-full bg-primary text-white rounded-md py-2 hover:bg-primary/90 transition"
      >
        Confirmar compra
      </button>
    </form>
  )
}

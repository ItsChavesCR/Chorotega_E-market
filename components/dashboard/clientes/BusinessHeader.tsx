"use client"

import Image from "next/image"
import { MapPin, Clock, Map, Instagram, Facebook, MessageCircle } from "lucide-react"

interface Props {
  negocio: {
    nombrecomercio: string
    descripcion?: string
    logo?: string
    ubicacion?: string
    horario?: string
    redessociales?: Record<string, string>
  }
}

export default function BusinessHeader({ negocio }: Props) {
  const redes = negocio.redessociales || {}

  const formatUrl = (url?: string) => {
    if (!url) return null
    const trimmed = url.trim()
    if (!/^https?:\/\//i.test(trimmed)) return `https://${trimmed.replace(/^\/+/, "")}`
    return trimmed
  }

  const mapLink = negocio.ubicacion
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(negocio.ubicacion)}`
    : null

  return (
    <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6 flex flex-col md:flex-row justify-between gap-6">
      {/* 🧩 Izquierda: Logo + información principal */}
      <div className="flex items-start gap-5 flex-1">
        {/* Logo */}
        <div className="w-28 h-28 relative rounded-full overflow-hidden ring-1 ring-gray-200 shadow-sm">
          <Image
            src={negocio.logo || "/placeholder.jpg"}
            alt={negocio.nombrecomercio}
            fill
            className="object-cover"
          />
        </div>

        {/* Info */}
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold text-gray-900">{negocio.nombrecomercio}</h1>
          <p className="text-gray-600 text-sm md:text-base">
            {negocio.descripcion || "Emprendimiento local."}
          </p>

          {/* Ubicación + horario + mapa */}
          <div className="flex flex-col gap-2 text-sm text-gray-600 mt-2">
            {negocio.ubicacion && (
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-gray-500 mt-0.5" />
                <span>{negocio.ubicacion}</span>
              </div>
            )}
            {negocio.horario && (
              <div className="flex items-start gap-2">
                <Clock className="w-4 h-4 text-gray-500 mt-0.5" />
                <span>{negocio.horario}</span>
              </div>
            )}
            {mapLink && (
              <a
                href={mapLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sky-600 hover:text-sky-800 font-medium transition"
              >
                <Map className="w-4 h-4" /> Ver en Google Maps
              </a>
            )}
          </div>
        </div>
      </div>

      {/* 🌐 Derecha: redes sociales */}
      <div className="flex flex-col justify-center gap-3 border-t md:border-t-0 md:border-l border-gray-100 pt-4 md:pt-0 md:pl-5 w-full md:w-48">
        {formatUrl(redes.facebook) && (
          <a
            href={formatUrl(redes.facebook) || undefined}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 text-gray-500 hover:text-blue-600 transition-colors"
          >
            <Facebook className="w-5 h-5" /> Facebook
          </a>
        )}
        {formatUrl(redes.instagram) && (
          <a
            href={formatUrl(redes.instagram) || undefined}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 text-gray-500 hover:text-pink-600 transition-colors"
          >
            <Instagram className="w-5 h-5" /> Instagram
          </a>
        )}
        {formatUrl(redes.whatsapp) && (
          <a
            href={`https://wa.me/${redes.whatsapp.replace(/\D/g, "")}`}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 text-gray-500 hover:text-green-600 transition-colors"
          >
            <MessageCircle className="w-5 h-5" /> WhatsApp
          </a>
        )}
      </div>
    </section>
  )
}

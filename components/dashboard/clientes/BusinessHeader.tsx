"use client"

import Image from "next/image"

interface Props {
    negocio: {
    nombrecomercio: string
    descripcion?: string
    logo?: string
    redessociales?: Record<string, string>
  }
}

export default function BusinessHeader({ negocio }: Props) {
  return (
    <section className="bg-white rounded-xl shadow-sm p-6 mb-6 flex flex-col md:flex-row items-center gap-6">
      <div className="w-28 h-28 relative rounded-full overflow-hidden">
        <Image
          src={negocio.logo || "/placeholder.jpg"}
          alt={negocio.nombrecomercio}
          fill
          className="object-cover"
        />
      </div>
      <div className="flex-1 text-center md:text-left">
        <h1 className="text-2xl font-bold">{negocio.nombrecomercio}</h1>
        <p className="text-gray-600 mt-1">{negocio.descripcion || "Emprendimiento local."}</p>
        <div className="flex justify-center md:justify-start gap-3 mt-3 text-gray-500 text-lg">
          {negocio.redessociales?.facebook && (
            <a href={negocio.redessociales.facebook} target="_blank" rel="noreferrer">
              <i className="fa-brands fa-facebook"></i>
            </a>
          )}
          {negocio.redessociales?.instagram && (
            <a href={negocio.redessociales.instagram} target="_blank" rel="noreferrer">
              <i className="fa-brands fa-instagram"></i>
            </a>
          )}
          {negocio.redessociales?.whatsapp && (
            <a href={`https://wa.me/${negocio.redessociales.whatsapp}`} target="_blank" rel="noreferrer">
              <i className="fa-brands fa-whatsapp"></i>
            </a>
          )}
        </div>
      </div>
    </section>
  )
}

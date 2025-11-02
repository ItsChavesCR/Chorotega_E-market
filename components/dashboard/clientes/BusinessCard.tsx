"use client"

import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { Business } from "@/hooks/useBusinesses"

interface BusinessCardProps {
  business: Business
}

export default function BusinessCard({ business }: BusinessCardProps) {
  return (
    <motion.div whileHover={{ scale: 1.03 }} className="h-full">
      <Link href={`/clientes/${business.id}`}>
        <Card className="overflow-hidden rounded-xl shadow-sm hover:shadow-md transition-all bg-white h-full flex flex-col">
          {/* Imagen */}
          <div className="relative w-full h-32 sm:h-36 md:h-40">
            <Image
              src={business.logo || "/placeholder.jpg"}
              alt={business.nombrecomercio}
              fill
              className="object-cover transition-transform duration-300 hover:scale-105"
            />
          </div>

          {/* Contenido */}
          <CardContent className="p-3 text-center flex-1 flex flex-col justify-center">
            <h3 className="text-sm font-semibold line-clamp-1">
              {business.nombrecomercio}
            </h3>
            <p className="text-xs text-gray-500 line-clamp-2">
              {business.descripcion || "Emprendimiento local"}
            </p>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  )
}

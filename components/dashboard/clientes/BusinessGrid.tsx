"use client"

import { motion } from "framer-motion"
import BusinessCard from "./BusinessCard"
import { Business } from "@/hooks/useBusinesses"
import SkeletonCard from "@/components/ui/SkeletonCard"

interface BusinessGridProps {
  businesses: Business[]
  loading: boolean
  selectedCategory?: string
}

export default function BusinessGrid({ businesses, loading, selectedCategory }: BusinessGridProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 mt-6">
        {Array.from({ length: 12 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    )
  }

  // 🔹 Filtrado por categoría
  const filteredBusinesses = selectedCategory
    ? businesses.filter(
        (b) =>
          b.categoria?.toLowerCase() === selectedCategory.toLowerCase()
      )
    : businesses

  if (!loading && filteredBusinesses.length === 0) {
    return <p className="text-center text-gray-500 mt-10">No se encontraron negocios en esta categoría.</p>
  }

  return (
    <motion.div
      className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 mt-6"
      initial="hidden"
      animate="visible"
      variants={{
        hidden: {},
        visible: {
          transition: { staggerChildren: 0.06 },
        },
      }}
    >
      {filteredBusinesses.map((b) => (
        <motion.div
          key={b.id}
          variants={{
            hidden: { opacity: 0, scale: 0.95, y: 10 },
            visible: { opacity: 1, scale: 1, y: 0 },
          }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          <BusinessCard business={b} />
        </motion.div>
      ))}
    </motion.div>
  )
}

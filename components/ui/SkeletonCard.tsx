"use client"

import { motion } from "framer-motion"

export default function SkeletonCard() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-xl shadow-sm overflow-hidden p-3 animate-pulse"
    >
      {/* Imagen simulada */}
      <div className="bg-gray-200 rounded-lg w-full aspect-square mb-3" />
      {/* Texto simulado */}
      <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto mb-2" />
      <div className="h-3 bg-gray-200 rounded w-2/4 mx-auto" />
    </motion.div>
  )
}

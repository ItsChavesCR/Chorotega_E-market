"use client"

import { motion, AnimatePresence } from "framer-motion"
import { ReactNode, useEffect } from "react"

interface AnimatedDrawerProps {
  open: boolean
  onClose: () => void
  children: ReactNode
}

export default function AnimatedDrawer({ open, onClose, children }: AnimatedDrawerProps) {
  // Cerrar con tecla ESC
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => e.key === "Escape" && onClose()
    if (open) window.addEventListener("keydown", handleEsc)
    return () => window.removeEventListener("keydown", handleEsc)
  }, [open, onClose])

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* 🔲 Fondo semitransparente (clic para cerrar) */}
          <motion.div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[110]"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          />

          {/* 🧩 Drawer lateral */}
          <motion.div
            initial={{ x: 400, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 400, opacity: 0 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="fixed inset-y-0 right-0 z-[120] w-full sm:w-[400px] bg-white shadow-2xl rounded-l-xl border-l border-gray-200 overflow-y-auto"
          >
            {/* 🔘 Botón de cierre (la X) */}
            <button
              onClick={onClose}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition"
              aria-label="Cerrar"
            >
              ✕
            </button>

            {children}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

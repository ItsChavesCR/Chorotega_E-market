"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"
import { Product } from "@/services/products/types"

interface StoreState {
  favoritos: Product[]
  carrito: Product[]
  addToFavorites: (producto: Product) => void
  removeFromFavorites: (id: number) => void
  clearFavorites: () => void
  addToCart: (producto: Product) => void
  removeFromCart: (id: number) => void
  updateQuantity: (id: number, cantidad: number) => void
  clearCart: () => void
  isFavorite: (id: number) => boolean
  isInCart: (id: number) => boolean
  total: () => number
}

export const useClientStore = create<StoreState>()(
  persist(
    (set, get) => ({
      favoritos: [],
      carrito: [],

      // ❤️ Favoritos
      addToFavorites: (producto) =>
        set((state) => {
          if (!state.favoritos.some((f) => f.id === producto.id)) {
            return { favoritos: [...state.favoritos, producto] }
          }
          return state
        }),

      removeFromFavorites: (id) =>
        set((state) => ({
          favoritos: state.favoritos.filter((p) => p.id !== id),
        })),

      clearFavorites: () => set({ favoritos: [] }),

      // 🛒 Carrito
      addToCart: (producto) =>
        set((state) => {
          const existe = state.carrito.find((p) => p.id === producto.id)
          if (existe) {
            return {
              carrito: state.carrito.map((p) =>
                p.id === producto.id
                  ? { ...p, cantidad: (p.cantidad || 1) + 1 }
                  : p
              ),
            }
          }
          return { carrito: [...state.carrito, { ...producto, cantidad: 1 }] }
        }),

      removeFromCart: (id) =>
        set((state) => ({
          carrito: state.carrito.filter((p) => p.id !== id),
        })),

      updateQuantity: (id, cantidad) =>
        set((state) => ({
          carrito: state.carrito.map((p) =>
            p.id === id ? { ...p, cantidad: Math.max(1, cantidad) } : p
          ),
        })),

      clearCart: () => set({ carrito: [] }),

      // ✅ Utilidades
      isFavorite: (id) => get().favoritos.some((p) => p.id === id),
      isInCart: (id) => get().carrito.some((p) => p.id === id),

      total: () =>
        get().carrito.reduce(
          (acc, p) => acc + (p.precio || 0) * (p.cantidad || 1),
          0
        ),
    }),
    {
      name: "client-store",
      version: 3,
      migrate: (persisted, version) => {
        // En caso de cambios de versión
        if (version < 3) {
          return { favoritos: [], carrito: [] }
        }
        return persisted
      },
    }
  )
)

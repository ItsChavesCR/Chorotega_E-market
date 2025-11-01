export interface Product {
  id: number
  idemprendedor: number
  idcategoria?: number | null
  nombre: string
  descripcion?: string | null
  precio: number
  stock: number
  imagenes?: string[]
  activo: boolean
  cantidad?: number // 👈 usado por el carrito (opcional)
}
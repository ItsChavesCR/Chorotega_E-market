export interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  image: string;
  description?: string;
  categoryId?: number | null;
  activo: boolean;

  // Para compatibilidad con el form que sube imagen
  __file?: File | null;
}

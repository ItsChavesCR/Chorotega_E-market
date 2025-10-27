export interface Product {
  id: number;
  idemprendedor: number;
  idcategoria: number | null;
  nombre: string;
  descripcion?: string;
  precio: number;
  stock: number;
  imagenes: string[];
  activo: boolean;
}

import { Product } from './types';

export function mapProduct(row: any): Product {
  return {
    id: row.id,
    idemprendedor: row.idemprendedor,
    idcategoria: row.idcategoria,
    nombre: row.nombre,
    descripcion: row.descripcion,
    precio: Number(row.precio),
    stock: row.stock,
    imagenes: row.imagenes ?? [],
    activo: row.activo,
  };
}

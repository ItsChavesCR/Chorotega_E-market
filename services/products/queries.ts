import { createSupabaseServerClient } from '@/lib/supabase/server';
import { Product } from './types';


export async function getProductsByEntrepreneur(idemprendedor: number): Promise<Product[]> {
  const supabase = createSupabaseServerClient();

  const { data, error } = await supabase
    .from('producto')
    .select('id,nombre,precio,stock,imagenes,activo') // solo columnas que necesitas
    .eq('idemprendedor', idemprendedor);

  if (error) throw new Error(error.message);
  return data.map(mapProduct);
}

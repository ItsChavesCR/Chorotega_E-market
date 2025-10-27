import { createSupabaseServerClient } from '@/lib/supabase/server';
import { Product } from './types';

type CreateProductInput = Omit<Product, 'id'>;

export async function createProduct(product: CreateProductInput) {
  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase
    .from('producto')
    .insert(product)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}

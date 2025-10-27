'use server';

import { createSupabaseServerClient } from '@/lib/supabase/server';

const TABLE = 'producto';

export async function listMyProducts() {
  const supabase = createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("No autenticado");

  // Buscar ID del emprendedor
  const { data: emprendedor } = await supabase
    .from('perfil_emprendedor')
    .select('id')
    .eq('idusuario', user.id)
    .maybeSingle();

  if (!emprendedor) throw new Error("Perfil de emprendedor no encontrado");

  const { data, error } = await supabase
    .from(TABLE)
    .select('*')
    .eq('idemprendedor', emprendedor.id)
    .order('id', { ascending: false });

  if (error) throw new Error(error.message);
  return data;
}

export async function createProduct(payload: any) {
  const supabase = createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("No autenticado");

  const { data: emprendedor } = await supabase
    .from('perfil_emprendedor')
    .select('id')
    .eq('idusuario', user.id)
    .maybeSingle();

  if (!emprendedor) throw new Error("Perfil de emprendedor no encontrado");

  const full = {
    ...payload,
    idemprendedor: emprendedor.id,
  };

  const { data, error } = await supabase
    .from(TABLE)
    .insert(full)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}

export async function updateProduct(id: number, payload: any) {
  const supabase = createSupabaseServerClient();

  const { data, error } = await supabase
    .from(TABLE)
    .update(payload)
    .eq('id', id)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}

export async function deleteProduct(id: number) {
  const supabase = createSupabaseServerClient();
  const { error } = await supabase
    .from(TABLE)
    .delete()
    .eq('id', id);

  if (error) throw new Error(error.message);
}

// app/api/products/_helpers.ts
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export function rh() {
    return createRouteHandlerClient({ cookies });
}



export async function getEntrepreneurId(userId: string) {
    const sb = rh();
    const { data: { user } } = await sb.auth.getUser();
    console.log('[API /products] user =', user?.id);
  const { data, error } = await sb
    .from('perfil_emprendedor')
    .select('id')
    .eq('idUsuario', userId)
    .single();
  if (error || !data) throw new Error('No tienes perfil de emprendedor');
  return data.id as number;

  
}

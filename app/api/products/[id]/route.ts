import { NextResponse } from 'next/server';
import { rh } from '../_helpers';

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    const sb = rh();
    const body = await req.json();
    const { name, price, stock, image, categoryId, description, activo } = body;

    const patch: any = {
      nombre: name,
      precio: price != null ? Number(price) : undefined,
      stock: stock != null ? Number(stock) : undefined,
      descripcion: description ?? undefined,
      activo: typeof activo === 'boolean' ? activo : undefined,
      imagenes: image ? [image] : undefined,
      idCategoria: categoryId ?? null,
    };
    Object.keys(patch).forEach((k) => patch[k] === undefined && delete patch[k]);

    const { data, error } = await sb
      .from('producto')
      .update(patch)
      .eq('id', Number(params.id))
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json({ product: data });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || 'Error' }, { status: 400 });
  }
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  const sb = rh();
  const { error } = await sb.from('producto').delete().eq('id', Number(params.id));
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ ok: true });
}

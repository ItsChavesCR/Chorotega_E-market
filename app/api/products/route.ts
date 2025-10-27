import { getProductsByEntrepreneur } from '@/services/products';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const idemprendedor = Number(searchParams.get('idemprendedor'));

  if (!idemprendedor) {
    return NextResponse.json({ error: 'Falta el parámetro idemprendedor' }, { status: 400 });
  }

  try {
    const productos = await getProductsByEntrepreneur(idemprendedor);
    return NextResponse.json(productos);
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

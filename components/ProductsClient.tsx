'use client';

import * as React from 'react';

import { supabase } from '@/lib/supabase/client';
import type { Product } from '@/types/product';
import ProductForm from './dashboard/emprendedor/ProductForm';

export default function ProductsClient({
  initial,
}: { initial: any[] }) {
  const [open, setOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<Product | null>(null);
  const [items, setItems] = React.useState(initial);

  async function uploadImageIfNeeded(file: File | null) {
    if (!file) return null;
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('No auth');
    const path = `${user.id}/${crypto.randomUUID()}-${file.name}`;
    const { error } = await supabase.storage.from('product-images').upload(path, file);
    if (error) throw error;
    return supabase.storage.from('product-images').getPublicUrl(path).data.publicUrl;
  }

  async function create(values: Omit<Product, 'id'>, _?: string, file?: File | null) {
    const imageUrl = file ? await uploadImageIfNeeded(file) : values.image || null;
    const res = await fetch('/api/products', {
      method: 'POST',
      body: JSON.stringify({
        name: values.name,
        price: values.price,
        stock: values.stock,
        category: values.category ?? null,
        description: values.description ?? null,
        image: imageUrl,
        activo: true,
      }),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Error al crear');
    setItems([json.product, ...items]);
  }

  async function update(values: Omit<Product, 'id'>, id?: string, file?: File | null) {
    if (!id) return;
    const imageUrl = file ? await uploadImageIfNeeded(file) : values.image || null;
    const res = await fetch(`/api/products/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({
        name: values.name,
        price: values.price,
        stock: values.stock,
        category: values.category ?? null,
        description: values.description ?? null,
        image: imageUrl,
      }),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Error al actualizar');
    setItems(items.map((p) => (p.id === Number(id) ? json.product : p)));
  }

  async function remove(id: number) {
    const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Error al eliminar');
    setItems(items.filter((p) => p.id !== id));
  }

  // onSubmit que espera tu form (values, id?)
  async function onSubmit(values: Omit<Product, 'id'>, id?: string) {
    // truquito: el form NO nos da el File. Lo tomamos del DOM (por ref) o
    // añadimos una prop extra. Para mantener tu form tal cual, añadimos un CustomEvent.
    // Más simple: modificamos ligeramente el form para exponer el file:
    // -> ver nota al final.
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">Mis productos</h1>
        <button className="rounded bg-neutral-900 px-3 py-2 text-white" onClick={() => { setEditing(null); setOpen(true); }}>
          Nuevo producto
        </button>
      </div>

      <div className="grid gap-3">
        {items.map((p: any) => (
          <div key={p.id} className="flex items-center justify-between rounded border p-3">
            <div className="flex items-center gap-3">
              <img src={p.imagenes?.[0] || '/noimg.png'} className="h-12 w-12 rounded object-cover" alt="" />
              <div>
                <div className="font-medium">{p.nombre}</div>
                <div className="text-sm text-neutral-600">₡ {Number(p.precio).toFixed(2)} · Stock {p.stock}</div>
              </div>
            </div>
            <div className="flex gap-2">
              <button className="rounded border px-3 py-1 text-sm" onClick={() => { 
                setEditing({
                  id: String(p.id),
                  name: p.nombre,
                  price: p.precio,
                  stock: p.stock,
                  image: p.imagenes?.[0] || '',
                  category: undefined, // si quieres, mapea idCategoria->nombre
                  description: p.descripcion || '',
                } as Product);
                setOpen(true);
              }}>Editar</button>
              <button className="rounded border border-red-300 px-3 py-1 text-sm text-red-700"
                onClick={() => remove(p.id)}>Eliminar</button>
            </div>
          </div>
        ))}
      </div>

      {/* Form (dialog) */}
      <ProductForm
        open={open}
        onOpenChange={setOpen}
        product={editing}
        // TEMP: pasamos un onSubmit extendido que reciba también file (ver nota)
        onSubmit={async (values, id) => {
          // @ts-ignore añadimos file si el form nos lo envía
          const file: File | null = (values as any).__file || null;
          if (id) await update(values, id, file);
          else await create(values, undefined, file);
        }}
      />
    </div>
  );
}

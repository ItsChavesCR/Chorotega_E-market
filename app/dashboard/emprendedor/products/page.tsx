// app/dashboard/emprendedor/productos/page.tsx
'use client';

import * as React from "react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase/client";
import { Product } from "@/types/product";
import {
  listMyProducts,
  createProduct,
  updateProduct,
  deleteProduct
} from "@/app/actions/products";

import ProductGrid from "@/components/dashboard/emprendedor/ProductGrid";
import ProductForm from "@/components/dashboard/emprendedor/ProductForm";

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";

// DB → UI Mapper
function mapDbToUi(db: any): Product {
  return {
    id: String(db.id),
    name: db.nombre,
    price: Number(db.precio),
    stock: Number(db.stock),
    image: db.imagenes?.[0] || '',
    description: db.descripcion || '',
    categoryId: db.idcategoria,
    activo: db.activo,
  };
}

export default function ProductsPage() {
  const [items, setItems] = React.useState<Product[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [openForm, setOpenForm] = React.useState(false);
  const [editing, setEditing] = React.useState<Product | null>(null);
  const [openDelete, setOpenDelete] = React.useState(false);
  const [toDelete, setToDelete] = React.useState<Product | null>(null);

  React.useEffect(() => {
    (async () => {
      try {
        const data = await listMyProducts();
        const mapped = data.map(mapDbToUi);
        setItems(mapped);
      } catch (e: any) {
        toast.error(e.message || "Error al cargar productos");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  async function uploadImageIfNeeded(file: File | null) {
    if (!file) return null;
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Debes iniciar sesión");

    const path = `${user.id}/${crypto.randomUUID()}-${file.name}`;
    const { error } = await supabase.storage
      .from("product-images")
      .upload(path, file);

    if (error) throw error;

    return supabase.storage
      .from("product-images")
      .getPublicUrl(path).data.publicUrl;
  }

  const onCreate = () => { setEditing(null); setOpenForm(true); };
  const onEdit = (p: Product) => { setEditing(p); setOpenForm(true); };
  const onAskDelete = (p: Product) => { setToDelete(p); setOpenDelete(true); };

  const upsertProduct = async (values: Omit<Product, "id">, id?: string) => {
    try {
      const file: File | null = values.__file || null;
      const uploaded = await uploadImageIfNeeded(file);

      const payload = {
        nombre: values.name.trim(),
        precio: Number(values.price),
        stock: Number(values.stock),
        idcategoria: values.categoryId ?? null,
        descripcion: values.description ?? null,
        imagenes: uploaded ? [uploaded] : (values.image ? [values.image] : []),
        activo: true,
      };

      if (id) {
        const data = await updateProduct(Number(id), payload);
        setItems(prev => prev.map(p => (p.id === id ? mapDbToUi(data) : p)));
        toast.success("Producto actualizado correctamente");
      } else {
        const data = await createProduct(payload);
        setItems(prev => [mapDbToUi(data), ...prev]);
        toast.success("Producto creado correctamente");
      }

      setOpenForm(false);
    } catch (e: any) {
      toast.error(e.message || "Error al guardar");
    }
  };

  const confirmDelete = async () => {
    if (!toDelete) return;
    try {
      await deleteProduct(Number(toDelete.id));
      setItems(prev => prev.filter(p => p.id !== toDelete.id));
      toast.success("Producto eliminado");
    } catch (e: any) {
      toast.error(e.message || "Error al eliminar");
    } finally {
      setOpenDelete(false);
      setToDelete(null);
    }
  };

  return (
    <>
      <ProductGrid
        items={items}
        loading={loading}
        onCreate={onCreate}
        onEdit={onEdit}
        onAskDelete={onAskDelete}
      />

      <ProductForm
        open={openForm}
        onOpenChange={setOpenForm}
        product={editing}
        onSubmit={upsertProduct}
      />

      <AlertDialog open={openDelete} onOpenChange={setOpenDelete}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar producto?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Se eliminará{" "}
              <span className="font-medium">{toDelete?.name ?? "este producto"}</span>.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

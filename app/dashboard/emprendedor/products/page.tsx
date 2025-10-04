"use client";

import * as React from "react";
import { toast } from "sonner";
import ProductGrid from "@/components/dashboard/emprendedor/ProductGrid";
import ProductForm from "@/components/dashboard/emprendedor/ProductForm";
import type { Product } from "@/types/product";
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

export default function ProductsPage() {
  
  const [items, setItems] = React.useState<Product[]>([]);

  const [openForm, setOpenForm] = React.useState(false);
  const [editing, setEditing] = React.useState<Product | null>(null);

  const [openDelete, setOpenDelete] = React.useState(false);
  const [toDelete, setToDelete] = React.useState<Product | null>(null);

  const onCreate = () => { setEditing(null); setOpenForm(true); };
  const onEdit = (p: Product) => { setEditing(p); setOpenForm(true); };
  const onAskDelete = (p: Product) => { setToDelete(p); setOpenDelete(true); };

  const upsertProduct = (values: Omit<Product, "id">, id?: string) => {
    if (id) {
      setItems(prev => prev.map(p => (p.id === id ? { ...p, ...values } : p)));
      toast.success("Producto actualizado correctamente");
    } else {
      const newProduct: Product = {
        id: typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : `p-${Date.now()}`,
        ...values,
        image:
          values.image ||
          `https://picsum.photos/seed/${encodeURIComponent(values.name)}/640/400`,
      };
      setItems(prev => [newProduct, ...prev]);
      toast.success("Producto creado correctamente");
    }
  };

  const confirmDelete = () => {
    if (!toDelete) return;
    setItems(prev => prev.filter(p => p.id !== toDelete.id));
    toast.success("Producto eliminado");
    setOpenDelete(false);
    setToDelete(null);
  };

  return (
    <>
      <ProductGrid items={items} onCreate={onCreate} onEdit={onEdit} onAskDelete={onAskDelete} />

      <ProductForm open={openForm} onOpenChange={setOpenForm} product={editing} onSubmit={upsertProduct} />

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

"use client";

import * as React from "react";
import ProductCard from "./ProductCard";
import type { Product } from "@/types/product";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function ProductGrid({
  items,
  onEdit,
  onAskDelete,
  onCreate,
}: {
  items: Product[];
  onEdit: (p: Product) => void;
  onAskDelete: (p: Product) => void;
  onCreate: () => void;
}) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold tracking-tight">Productos</h2>
          <p className="text-sm text-muted-foreground">
            Administra los productos de tu tienda.
          </p>
        </div>
        <Button className="gap-2" onClick={onCreate}>
          <Plus className="h-4 w-4" />
          Agregar producto
        </Button>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {items.map((p) => (
          <ProductCard
            key={p.id}
            product={p}
            onEdit={onEdit}
            onAskDelete={onAskDelete}
          />
        ))}
      </div>

      {items.length === 0 && (
        <div className="grid place-items-center rounded-xl border bg-card p-10 text-center">
          <div className="space-y-2">
            <p className="font-medium">Aún no tienes productos</p>
            <p className="text-sm text-muted-foreground">
              Crea tu primer producto para empezar a vender.
            </p>
            <div className="pt-2">
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

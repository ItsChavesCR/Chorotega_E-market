"use client";

import * as React from "react";
import { Edit, Trash2, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Product } from "@/types/product";
import Image from "next/image";

const currency = new Intl.NumberFormat("es-CR", {
  style: "currency",
  currency: "CRC",
  maximumFractionDigits: 0,
});

export default function ProductCard({
  product,
  onEdit,
  onAskDelete,
}: {
  product: Product;
  onEdit: (p: Product) => void;
  onAskDelete: (p: Product) => void;
}) {
  return (
    <Card
      className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm hover:shadow-md transition-all duration-200"
    >
      {/* Imagen del producto */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-neutral-100">
        {product.image ? (
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-500 hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center text-neutral-400">
            <Package className="h-10 w-10 mb-2" />
            <p className="text-sm">Sin imagen</p>
          </div>
        )}
      </div>

      {/* Detalle */}
      <CardHeader className="px-5 pt-4 pb-0 space-y-1">
        <CardTitle className="text-base font-semibold text-neutral-900 line-clamp-1">
          {product.name}
        </CardTitle>
        <CardDescription className="flex items-center gap-2 text-neutral-600">
          <span className="text-lg font-bold text-green-700">
            {currency.format(product.price)}
          </span>
          <Badge
            variant="secondary"
            className="rounded-full bg-green-100 text-green-700 border border-green-300"
          >
            {product.stock} en stock
          </Badge>
        </CardDescription>
      </CardHeader>

      {/* Footer con botones */}
      <CardFooter className="flex justify-between items-center px-5 py-4 border-t border-neutral-200 bg-neutral-50">
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEdit(product)}
            className="gap-2 border-neutral-300 hover:bg-neutral-100"
          >
            <Edit className="h-4 w-4" />
            Editar
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => onAskDelete(product)}
            className="gap-2 bg-red-600 hover:bg-red-700"
          >
            <Trash2 className="h-4 w-4" />
            Eliminar
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}

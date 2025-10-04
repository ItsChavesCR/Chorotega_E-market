"use client";

import * as React from "react";
import { Edit, Trash2 } from "lucide-react";
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
    <Card className="overflow-hidden">
      <div className="aspect-[4/3] w-full overflow-hidden bg-muted">
        <img
          src={product.image}
          alt={product.name}
          className="h-full w-full object-cover transition-transform duration-300 hover:scale-[1.03]"
          loading="lazy"
        />
      </div>

      <CardHeader className="space-y-1">
        <CardTitle className="line-clamp-2 text-base">{product.name}</CardTitle>
        <CardDescription className="flex items-center gap-2">
          <span className="font-medium text-foreground">
            {currency.format(product.price)}
          </span>
          <Badge variant="secondary" className="rounded-full">
            {product.stock} en stock
          </Badge>
        </CardDescription>
      </CardHeader>

      <CardFooter className="flex gap-2">
        <Button variant="outline" size="sm" onClick={() => onEdit(product)} className="gap-2">
          <Edit className="h-4 w-4" />
          Editar
        </Button>
        <Button variant="destructive" size="sm" onClick={() => onAskDelete(product)} className="gap-2">
          <Trash2 className="h-4 w-4" />
          Eliminar
        </Button>
      </CardFooter>
    </Card>
  );
}

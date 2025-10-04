"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { UploadCloud } from "lucide-react";

import type { Product, Category } from "@/types/product";
import { CATEGORIES } from "@/types/product";

export default function ProductForm({
  open,
  onOpenChange,
  product,
  onSubmit,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product?: Product | null;
  onSubmit: (values: Omit<Product, "id">, id?: string) => void;
}) {
  const [name, setName] = React.useState(product?.name ?? "");
  const [price, setPrice] = React.useState<number>(product?.price ?? 0);
  const [stock, setStock] = React.useState<number>(product?.stock ?? 0);
  const [category, setCategory] = React.useState<Category | undefined>(product?.category);
  const [description, setDescription] = React.useState(product?.description ?? "");


  const [file, setFile] = React.useState<File | null>(null);
  const [preview, setPreview] = React.useState<string>(
    product?.image ?? "https://picsum.photos/seed/preview/640/400"
  );
  const [isDragging, setIsDragging] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);

  React.useEffect(() => {
    setName(product?.name ?? "");
    setPrice(product?.price ?? 0);
    setStock(product?.stock ?? 0);
    setCategory(product?.category);
    setDescription(product?.description ?? "");
    setFile(null);
    setPreview(product?.image ?? "https://picsum.photos/seed/preview/640/400");
  }, [product]);

  React.useEffect(() => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const handlePickFile = () => fileInputRef.current?.click();
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f && f.type.startsWith("image/")) setFile(f);
  };
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };
  const handleDragLeave = () => setIsDragging(false);
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const f = e.dataTransfer.files?.[0];
    if (f && f.type.startsWith("image/")) setFile(f);
  };

  const removeFile = () => {
    setFile(null);
    // si estás editando, volvemos a la imagen original; si no, placeholder
    setPreview(product?.image ?? "https://picsum.photos/seed/preview/640/400");
    // limpiar input file para poder volver a elegir el mismo archivo
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const imageUrl = file ? preview : product?.image ?? preview;
    onSubmit(
      {
        name: name.trim(),
        price: Number(price),
        stock: Number(stock),
        image: imageUrl,
        category,
        description,
      },
      product?.id
    );
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {/* compacto y con scroll si crece */}
      <DialogContent className="w-full gap-0 p-0 sm:max-w-xl max-h-[85vh] overflow-y-auto">
        <DialogHeader className="space-y-1 border-b px-5 pb-3 pt-5">
          <DialogTitle className="text-base">
            {product ? "Editar producto" : "Nuevo producto"}
          </DialogTitle>
          <DialogDescription>
            Completa los campos y guarda los cambios.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="px-5 py-4">
          {/* Nombre */}
          <div className="space-y-1.5">
            <Label htmlFor="name">Nombre</Label>
            <Input
              id="name"
              placeholder="Nombre del producto"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          {/* Precio + Stock */}
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="price">Precio (CRC)</Label>
              <Input
                id="price"
                type="number"
                min={0}
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="stock">Cantidad en stock</Label>
              <Input
                id="stock"
                type="number"
                min={0}
                value={stock}
                onChange={(e) => setStock(Number(e.target.value))}
                required
              />
            </div>
          </div>

          {/* Categoría */}
          <div className="mt-4 space-y-1.5">
            <Label>Categoría</Label>
            <Select
              value={category ?? ""}
              onValueChange={(val) => setCategory(val as Category)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecciona una categoría" />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Descripción */}
          <div className="mt-4 space-y-1.5">
            <Label htmlFor="description">Descripción</Label>
            <Textarea
              id="description"
              rows={4}
              placeholder="Breve descripción del producto…"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">Máximo 500 caracteres.</p>
          </div>

          {/* Imagen: dropzone */}
          <div className="mt-4 space-y-1.5">
            <Label>Imagen</Label>
            <div
              className={[
                "rounded-xl border-2 border-dashed bg-background p-6 text-center",
                "transition-colors",
                isDragging ? "border-primary/60 bg-muted/40" : "border-muted-foreground/20",
              ].join(" ")}
              onClick={handlePickFile}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              role="button"
              tabIndex={0}
            >
              <div className="flex flex-col items-center justify-center">
                <UploadCloud className="mb-2 h-6 w-6 opacity-70" />
                <p className="text-sm text-muted-foreground">
                  Haz clic para subir o arrastra y suelta
                </p>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />
            </div>

            {/* Thumbnail + info */}
            {(file || product?.image) && (
              <div className="mt-3 flex items-center gap-3">
                <img
                  src={preview}
                  alt="Miniatura"
                  className="h-16 w-16 rounded-md border object-cover"
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm">
                    {file ? file.name : "Imagen actual"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {file ? `${Math.round((file.size / 1024) * 10) / 10} KB` : "Sin cambios"}
                  </p>
                </div>
                {file && (
                  <Button type="button" variant="ghost" size="sm" onClick={removeFile}>
                    Quitar
                  </Button>
                )}
              </div>
            )}
          </div>

          <DialogFooter className="mt-5">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit">
              {product ? "Guardar cambios" : "Crear producto"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

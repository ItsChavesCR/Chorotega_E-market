'use client';

import { useEffect, useState } from 'react';
import { Product } from '@/services/products';

export function useProducts(idemprendedor: number) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/products?idemprendedor=${idemprendedor}`)
      .then((res) => res.json())
      .then(setProducts)
      .finally(() => setLoading(false));
  }, [idemprendedor]);

  return { products, loading };
}

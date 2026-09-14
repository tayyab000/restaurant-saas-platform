// src/components/POS/ProductList.tsx
'use client';
import { useEffect, useState } from 'react';

interface Product {
  id: string;
  name: string;
  price: number;
}

export function ProductList({ onAdd }: { onAdd: (product: Product) => void }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In production, would fetch from local IndexedDB cache if offline
    fetch('/api/products', {
      headers: {
        'x-tenant-id': localStorage.getItem('tenantId') || '',
      }
    })
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setProducts(data);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Loading products...</div>;

  return (
    <div className="grid grid-cols-3 gap-4">
      {products.map(product => (
        <button
          key={product.id}
          className="p-4 border rounded shadow hover:bg-gray-100"
          onClick={() => onAdd(product)}
        >
          <div className="font-bold">{product.name}</div>
          <div>${product.price.toFixed(2)}</div>
        </button>
      ))}
    </div>
  );
}

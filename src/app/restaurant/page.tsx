// src/app/restaurant/page.tsx
'use client';

import { useState } from 'react';
import { ProductList } from '@/components/POS/ProductList';
import { Cart } from '@/components/POS/Cart';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

export default function RestaurantPOS() {
  const [cart, setCart] = useState<CartItem[]>([]);

  const handleAddToCart = (product: { id: string; name: string; price: number }) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => 
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const handleClearCart = () => setCart([]);

  return (
    <div className="h-screen flex flex-col">
      <header className="bg-gray-800 text-white p-4 flex justify-between">
        <h1 className="text-2xl font-bold">POS Terminal</h1>
        <div>
          <span className="mr-4">Branch: Main</span>
          <span>Status: Online</span>
        </div>
      </header>
      
      <main className="flex-1 flex overflow-hidden">
        <div className="flex-1 p-4 overflow-auto">
          <h2 className="text-xl font-bold mb-4">Menu</h2>
          <ProductList onAdd={handleAddToCart} />
        </div>
        
        <div className="w-96 border-l p-4 bg-white">
          <Cart items={cart} onClear={handleClearCart} />
        </div>
      </main>
    </div>
  );
}

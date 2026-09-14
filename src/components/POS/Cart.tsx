// src/components/POS/Cart.tsx
'use client';

import { syncQueue } from '@/lib/offlineQueue';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

export function Cart({ items, onClear }: { items: CartItem[], onClear: () => void }) {
  const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const handleCheckout = async () => {
    if (items.length === 0) return;

    const orderPayload = {
      localId: crypto.randomUUID(),
      branchId: localStorage.getItem('branchId') || 'default-branch',
      totalAmount: total,
      status: 'COMPLETED',
      paymentStatus: 'PAID',
      items: items.map(item => ({
        productId: item.id,
        quantity: item.quantity,
        price: item.price,
      })),
    };

    // Store in offline queue
    if (syncQueue) {
      await syncQueue.enqueue('OrderCreated', { order: orderPayload });
    }
    
    alert('Order completed (Saved locally and queuing for sync)!');
    onClear();
  };

  return (
    <div className="p-4 border rounded bg-gray-50 h-full flex flex-col">
      <h2 className="font-bold text-xl mb-4">Current Order</h2>
      <div className="flex-1 overflow-auto">
        {items.map(item => (
          <div key={item.id} className="flex justify-between mb-2">
            <span>{item.quantity}x {item.name}</span>
            <span>${(item.price * item.quantity).toFixed(2)}</span>
          </div>
        ))}
      </div>
      <div className="border-t pt-4 mt-4">
        <div className="flex justify-between font-bold text-xl mb-4">
          <span>Total:</span>
          <span>${total.toFixed(2)}</span>
        </div>
        <button
          onClick={handleCheckout}
          className="w-full bg-blue-600 text-white py-3 rounded font-bold hover:bg-blue-700 disabled:opacity-50"
          disabled={items.length === 0}
        >
          Checkout
        </button>
      </div>
    </div>
  );
}

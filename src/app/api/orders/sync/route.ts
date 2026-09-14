// src/app/api/orders/sync/route.ts
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface SyncItem {
  productId: string;
  quantity: number;
  price: number;
}

export async function POST(request: Request) {
  const tenantId = request.headers.get('x-tenant-id');
  
  if (!tenantId) {
    return NextResponse.json({ error: 'Tenant context required' }, { status: 400 });
  }

  try {
    const events = await request.json();
    
    if (!Array.isArray(events)) {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    }

    const results = [];
    const errors = [];

    // Idempotent event processing
    for (const event of events) {
      if (event.type === 'OrderCreated') {
        const { order } = event.payload;

        try {
          const existingOrder = await prisma.order.findFirst({
            where: {
              localId: order.localId,
              tenantId,
            }
          });

          if (existingOrder) {
            results.push({ localId: order.localId, status: 'ALREADY_SYNCED' });
            continue;
          }

          await prisma.order.create({
            data: {
              tenantId,
              branchId: order.branchId,
              totalAmount: order.totalAmount,
              status: order.status,
              paymentStatus: order.paymentStatus,
              localId: order.localId,
              syncedAt: new Date(),
              items: {
                create: order.items.map((item: SyncItem) => ({
                  productId: item.productId,
                  quantity: item.quantity,
                  price: item.price,
                  subtotal: item.quantity * item.price,
                }))
              }
            }
          });
          results.push({ localId: order.localId, status: 'SYNCED' });
        } catch (e) {
           errors.push({ localId: order.localId, error: (e as Error).message });
        }
      }
    }

    return NextResponse.json({ results, errors });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

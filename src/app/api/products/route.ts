// src/app/api/products/route.ts
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: Request) {
  const tenantId = request.headers.get('x-tenant-id');
  
  if (!tenantId) {
    return NextResponse.json({ error: 'Tenant context required' }, { status: 400 });
  }

  try {
    const products = await prisma.product.findMany({
      where: {
        tenantId,
        isActive: true,
      },
    });
    return NextResponse.json(products);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

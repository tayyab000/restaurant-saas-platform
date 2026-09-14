// src/app/api/auth/login/route.ts
import { NextResponse } from 'next/server';
import { generateToken } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    // Mock validation
    if (email === 'admin@restaurant.com' && password === 'password') {
      const token = generateToken({
        userId: 'admin-1',
        tenantId: 'tenant-1',
        isMasterAdmin: false,
        permissions: ['orders.create', 'orders.view', 'products.view'],
      });
      return NextResponse.json({ token, tenantId: 'tenant-1' });
    }

    if (email === 'master@platform.com' && password === 'password') {
      const token = generateToken({
        userId: 'master-1',
        isMasterAdmin: true,
        permissions: ['all'],
      });
      return NextResponse.json({ token });
    }

    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}

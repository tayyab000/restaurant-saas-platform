// src/proxy.ts

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export default async function proxy(request: NextRequest) {
  // Multitenancy logic based on subdomains or headers
  // For API routes, checking tenant isolation headers or tokens
  const token = request.headers.get('Authorization')?.replace('Bearer ', '');
  const tenantId = request.headers.get('x-tenant-id');

  const url = request.nextUrl.clone();

  // Protect Admin Dashboard
  if (url.pathname.startsWith('/admin')) {
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    // E.g., perform actual mock check if master admin
  }

  // Add parsed context to request headers (e.g., passing validated tenant ID downwards)
  const requestHeaders = new Headers(request.headers);
  if (tenantId) {
    requestHeaders.set('x-tenant-id', tenantId);
  }

  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  return response;
}

export const config = {
  matcher: ['/api/:path*', '/admin/:path*', '/restaurant/:path*'],
};

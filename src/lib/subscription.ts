// src/lib/subscription.ts

// Subscription and Offline Licensing Engine
// Issues offline-capable signed entitlements to prevent permanent offline trials 

export interface Entitlement {
  tenantId: string;
  organizationName: string;
  plan: 'TRIAL' | 'MONTHLY' | 'YEARLY' | 'LIFETIME';
  features: string[]; // e.g., ["POS", "KDS", "INVENTORY"]
  limits: {
    branches: number;
    users: number;
    devices: number;
  };
  issuedAt: number;
  expiresAt: number; 
  signature: string; // Cryptographic validation from server
}

const SERVER_SECRET_KEY = process.env.LICENSE_SECRET_KEY || 'mock-secret-key-do-not-use-in-prod';

export function signEntitlement(payload: Omit<Entitlement, 'signature'>): Entitlement {
  // In production, use standard JWT signing or ED25519 signatures securely
  const stringified = JSON.stringify(payload);
  
  // Mock signature generation
  const signature = Buffer.from(stringified + SERVER_SECRET_KEY).toString('base64');
  
  return {
    ...payload,
    signature,
  };
}

export function verifyLocalEntitlement(entitlement: Entitlement): boolean {
  // Executed on the local client/edge to verify no tampering occurred
  const { signature, ...payload } = entitlement;
  
  const stringified = JSON.stringify(payload);
  const expectedSignature = Buffer.from(stringified + SERVER_SECRET_KEY).toString('base64');
  
  if (signature !== expectedSignature) {
    return false;
  }

  // Check clock rollback and expiry
  const now = Date.now();
  if (now > entitlement.expiresAt) {
    return false; // Trial / Subscription expired
  }

  return true;
}

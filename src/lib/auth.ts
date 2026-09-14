// src/lib/auth.ts

// Mock utility functions representing JWT verification for authentication.
// In a production environment, this would integrate with jose or jsonwebtoken.

export interface AuthSession {
  userId: string;
  tenantId?: string;
  branchId?: string;
  roleId?: string;
  isMasterAdmin: boolean;
  permissions: string[];
}

export async function verifyToken(token: string): Promise<AuthSession | null> {
  // Mock verification logic
  if (!token || token.length < 10) return null;

  return {
    userId: "mock-user-id",
    tenantId: "mock-tenant-id",
    branchId: "mock-branch-id",
    roleId: "mock-role-id",
    isMasterAdmin: false,
    permissions: ["orders.create", "orders.view", "products.view"],
  };
}

export function generateToken(payload: Partial<AuthSession>): string {
  // Mock signing logic
  return Buffer.from(JSON.stringify(payload)).toString("base64");
}

export function hasPermission(session: AuthSession, permission: string): boolean {
  if (session.isMasterAdmin) return true;
  return session.permissions.includes(permission);
}

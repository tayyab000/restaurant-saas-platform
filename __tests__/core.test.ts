import { verifyLocalEntitlement, signEntitlement } from '../src/lib/subscription';
import { FbrAdapter } from '../src/lib/fbr';

describe('Core Platform Logic', () => {
  describe('Licensing & Subscriptions', () => {
    it('should generate and verify valid offline entitlements securely', () => {
      const payload = {
        tenantId: 'tenant-123',
        organizationName: 'Test Org',
        plan: 'MONTHLY' as const,
        features: ['POS'],
        limits: { branches: 1, users: 5, devices: 2 },
        issuedAt: Date.now(),
        expiresAt: Date.now() + 1000 * 60 * 60 * 24 * 30, // 30 days
      };

      const signedEntitlement = signEntitlement(payload);
      
      expect(signedEntitlement.signature).toBeDefined();
      
      const isValid = verifyLocalEntitlement(signedEntitlement);
      expect(isValid).toBe(true);
    });

    it('should reject tampered entitlements', () => {
      const payload = {
        tenantId: 'tenant-123',
        organizationName: 'Test Org',
        plan: 'MONTHLY' as const,
        features: ['POS'],
        limits: { branches: 1, users: 5, devices: 2 },
        issuedAt: Date.now(),
        expiresAt: Date.now() + 1000 * 60 * 60 * 24 * 30,
      };

      const signedEntitlement = signEntitlement(payload);
      
      // Tamper with the plan
      signedEntitlement.plan = 'LIFETIME';

      const isValid = verifyLocalEntitlement(signedEntitlement);
      expect(isValid).toBe(false); // Should fail validation
    });

    it('should reject expired entitlements (clock rollback protection context)', () => {
      const payload = {
        tenantId: 'tenant-123',
        organizationName: 'Test Org',
        plan: 'TRIAL' as const,
        features: ['POS'],
        limits: { branches: 1, users: 5, devices: 2 },
        issuedAt: Date.now() - 1000 * 60 * 60 * 24 * 15, // Issued 15 days ago
        expiresAt: Date.now() - 1000 * 60 * 60 * 24 * 1, // Expired 1 day ago
      };

      const signedEntitlement = signEntitlement(payload);
      
      const isValid = verifyLocalEntitlement(signedEntitlement);
      expect(isValid).toBe(false);
    });
  });

  describe('FBR / Tax Compliance Adapter', () => {
    it('should mock an accepted invoice when valid NTN is provided', async () => {
      const adapter = new FbrAdapter('https://mock.fbr.gov.pk/api', 'mock-key');
      const response = await adapter.submitInvoice({
        ntn: '1234567-8',
        invoiceNumber: 'INV-001',
        totalAmount: 1000,
        taxAmount: 150,
        items: [{ name: 'Burger', quantity: 2, price: 500, taxRate: 15 }]
      });

      expect(response.accepted).toBe(true);
      expect(response.referenceNumber).toContain('FBR-');
    });

    it('should fail elegantly when NTN is invalid', async () => {
      const adapter = new FbrAdapter('https://mock.fbr.gov.pk/api', 'mock-key');
      const response = await adapter.submitInvoice({
        ntn: '', // Empty NTN
        invoiceNumber: 'INV-002',
        totalAmount: 1000,
        taxAmount: 150,
        items: [{ name: 'Burger', quantity: 2, price: 500, taxRate: 15 }]
      });

      expect(response.accepted).toBe(false);
      expect(response.error).toBe('Invalid NTN configuration');
    });
  });
});

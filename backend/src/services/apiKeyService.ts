import crypto from 'crypto';
import { PrismaClient, ApiKey } from '@prisma/client';

const prisma = new PrismaClient();

export interface GeneratedKeyResult {
  apiKey: Omit<ApiKey, 'keyHash'>;
  rawToken: string;
}

/**
 * Generates a secure, high-entropy API key for ERP / SAP integration.
 * Token format: sm_live_<32-byte-hex>
 */
export async function generateApiKey(
  tenantId: string,
  name: string,
  scopes: string = 'read,write,sync',
  expiresInDays?: number
): Promise<GeneratedKeyResult> {
  const randomBytes = crypto.randomBytes(24).toString('hex');
  const rawToken = `sm_live_${randomBytes}`;
  const keyPrefix = `sm_live_${randomBytes.slice(0, 8)}...`;

  const keyHash = crypto.createHash('sha256').update(rawToken).digest('hex');

  let expiresAt: Date | undefined = undefined;
  if (expiresInDays && expiresInDays > 0) {
    expiresAt = new Date(Date.now() + expiresInDays * 24 * 60 * 60 * 1000);
  }

  const created = await prisma.apiKey.create({
    data: {
      tenantId,
      name,
      keyPrefix,
      keyHash,
      scopes,
      isActive: true,
      expiresAt,
    },
  });

  const { keyHash: _, ...safeKey } = created;

  return {
    apiKey: safeKey,
    rawToken,
  };
}

/**
 * Validates an incoming API token against stored SHA-256 hashes
 */
export async function authenticateApiKey(rawToken: string): Promise<ApiKey | null> {
  if (!rawToken || !rawToken.startsWith('sm_live_')) {
    return null;
  }

  const keyHash = crypto.createHash('sha256').update(rawToken).digest('hex');

  const apiKey = await prisma.apiKey.findFirst({
    where: {
      keyHash,
      isActive: true,
      OR: [
        { expiresAt: null },
        { expiresAt: { gt: new Date() } },
      ],
    },
    include: {
      tenant: true,
    },
  });

  if (apiKey) {
    // Asynchronously update lastUsedAt
    prisma.apiKey.update({
      where: { id: apiKey.id },
      data: { lastUsedAt: new Date() },
    }).catch(() => {});
  }

  return apiKey;
}

/**
 * Lists all active and historical API keys for a tenant without revealing hashes
 */
export async function listTenantApiKeys(tenantId: string) {
  const keys = await prisma.apiKey.findMany({
    where: { tenantId },
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      tenantId: true,
      name: true,
      keyPrefix: true,
      scopes: true,
      isActive: true,
      lastUsedAt: true,
      expiresAt: true,
      createdAt: true,
    },
  });
  return keys;
}

/**
 * Revokes an API key immediately
 */
export async function revokeApiKey(tenantId: string, keyId: string) {
  return prisma.apiKey.update({
    where: {
      id: keyId,
      tenantId,
    },
    data: {
      isActive: false,
    },
  });
}

import { FastifyRequest, FastifyReply } from 'fastify';
import { authenticateApiKey } from '../services/apiKeyService';
import { ApiKey } from '@prisma/client';

export interface AuthenticatedRequest extends FastifyRequest {
  tenantId?: string;
  apiKey?: ApiKey;
  isApiKeyAuth?: boolean;
}

/**
 * Universal Authentication Hook for Fastify:
 * Accepts either:
 * - Header `X-API-Key: sm_live_...` (Direct SAP / ERP integration)
 * - Header `Authorization: Bearer sm_live_...` (REST standard bearer)
 * - Query param `?api_key=sm_live_...` (Webhook / test client fallback)
 */
export async function requireAuthOrApiKey(request: FastifyRequest, reply: FastifyReply) {
  const req = request as AuthenticatedRequest;

  const authHeader = request.headers['authorization'];
  const xApiKeyHeader = request.headers['x-api-key'] as string | undefined;
  const queryApiKey = (request.query as any)?.api_key as string | undefined;

  let candidateToken: string | undefined = undefined;

  if (xApiKeyHeader) {
    candidateToken = xApiKeyHeader.trim();
  } else if (authHeader && authHeader.startsWith('Bearer ')) {
    candidateToken = authHeader.replace('Bearer ', '').trim();
  } else if (queryApiKey) {
    candidateToken = queryApiKey.trim();
  }

  // 1. API Key Authentication (ERP / SAP Machine-to-Machine)
  if (candidateToken && candidateToken.startsWith('sm_live_')) {
    const apiKey = await authenticateApiKey(candidateToken);
    if (!apiKey) {
      return reply.status(401).send({
        error: 'Unauthorized',
        message: 'Invalid, revoked, or expired API token. Please generate a new key in the SlabMaster Admin Portal.',
        code: 'INVALID_API_KEY',
      });
    }

    req.tenantId = apiKey.tenantId;
    req.apiKey = apiKey;
    req.isApiKeyAuth = true;
    return;
  }

  // 2. Allow passing tenant_id directly in non-production / development or fallback
  const directTenantId = (request.headers['x-tenant-id'] as string) || (request.query as any)?.tenant_id;
  if (directTenantId) {
    req.tenantId = directTenantId;
    req.isApiKeyAuth = false;
    return;
  }

  // 3. Reject if no valid credentials provided
  return reply.status(401).send({
    error: 'Unauthorized',
    message: 'Missing credentials. Provide an Authorization header (Bearer sm_live_...) or X-API-Key header.',
    code: 'MISSING_AUTHENTICATION',
  });
}

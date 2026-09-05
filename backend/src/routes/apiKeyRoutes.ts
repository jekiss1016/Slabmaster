import { FastifyInstance, FastifyPluginAsync } from 'fastify';
import { requireAuthOrApiKey, AuthenticatedRequest } from '../middleware/authMiddleware';
import { generateApiKey, listTenantApiKeys, revokeApiKey } from '../services/apiKeyService';

export const apiKeyRoutes: FastifyPluginAsync = async (fastify: FastifyInstance) => {
  // Enforce authentication for all API key management routes
  fastify.addHook('preHandler', requireAuthOrApiKey);

  // 1. GET /api/v1/api-keys - List tenant API keys
  fastify.get('/api/v1/api-keys', async (request, reply) => {
    const req = request as AuthenticatedRequest;
    const tenantId = req.tenantId;

    if (!tenantId) {
      return reply.status(400).send({ error: 'Tenant context is missing.' });
    }

    const keys = await listTenantApiKeys(tenantId);
    return { data: keys };
  });

  // 2. POST /api/v1/api-keys - Generate a new integration API key
  fastify.post('/api/v1/api-keys', async (request, reply) => {
    const req = request as AuthenticatedRequest;
    const tenantId = req.tenantId;
    const body = (request.body || {}) as {
      name?: string;
      scopes?: string;
      expires_in_days?: number;
    };

    if (!tenantId) {
      return reply.status(400).send({ error: 'Tenant context is missing.' });
    }

    const keyName = body.name || 'SAP ERP Integration Token';
    const scopes = body.scopes || 'read,write,sync';
    const expiresInDays = body.expires_in_days;

    const result = await generateApiKey(tenantId, keyName, scopes, expiresInDays);

    return reply.status(201).send({
      message: 'API Key generated successfully. Save this token immediately; it cannot be viewed again.',
      data: result.apiKey,
      token: result.rawToken, // Plaintext secret returned ONCE
    });
  });

  // 3. DELETE /api/v1/api-keys/:id - Revoke an API key
  fastify.delete('/api/v1/api-keys/:id', async (request, reply) => {
    const req = request as AuthenticatedRequest;
    const tenantId = req.tenantId;
    const { id } = request.params as { id: string };

    if (!tenantId) {
      return reply.status(400).send({ error: 'Tenant context is missing.' });
    }

    const updated = await revokeApiKey(tenantId, id);
    return {
      message: 'API Key revoked successfully.',
      data: { id: updated.id, isActive: updated.isActive },
    };
  });
};

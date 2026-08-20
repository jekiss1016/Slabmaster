import Fastify from 'fastify';
import cors from '@fastify/cors';
import { PrismaClient } from '@prisma/client';

const fastify = Fastify({ logger: true });
const prisma = new PrismaClient();

fastify.register(cors, { origin: true });

// Health check endpoint
fastify.get('/health', async () => {
  return { status: 'ok', service: 'SlabMaster API', timestamp: new Date().toISOString() };
});

// GET /api/v1/accounts - List Builder Accounts
fastify.get('/api/v1/accounts', async (request, reply) => {
  const { tenant_id } = request.query as { tenant_id?: string };
  const accounts = await prisma.account.findMany({
    where: tenant_id ? { tenantId: tenant_id } : {},
    include: {
      communities: {
        include: {
          lots: {
            include: {
              jobs: true,
            },
          },
        },
      },
    },
  });
  return { data: accounts };
});

// POST /api/v1/accounts - Create Builder Account
fastify.post('/api/v1/accounts', async (request, reply) => {
  const body = request.body as any;
  const account = await prisma.account.create({
    data: {
      tenantId: body.tenant_id,
      accountName: body.account_name,
      accountCode: body.account_code,
      externalId: body.external_id,
      billingAddress1: body.billing_address_1,
      billingCity: body.billing_city,
      billingState: body.billing_state,
      billingZip: body.billing_zip,
    },
  });
  return reply.status(201).send({ data: account });
});

// GET /api/v1/communities - List Communities
fastify.get('/api/v1/communities', async (request, reply) => {
  const { account_id } = request.query as { account_id?: string };
  const communities = await prisma.community.findMany({
    where: account_id ? { accountId: account_id } : {},
    include: {
      account: true,
      lots: {
        include: {
          jobs: true,
        },
      },
    },
  });
  return { data: communities };
});

// GET /api/v1/lots - List Lots with multiple jobs per lot
fastify.get('/api/v1/lots', async (request, reply) => {
  const { community_id } = request.query as { community_id?: string };
  const lots = await prisma.lot.findMany({
    where: community_id ? { communityId: community_id } : {},
    include: {
      community: true,
      account: true,
      jobs: {
        include: {
          activities: true,
        },
      },
    },
  });
  return { data: lots };
});

// POST /api/v1/jobs - Create Job under Lot
fastify.post('/api/v1/jobs', async (request, reply) => {
  const body = request.body as any;
  const job = await prisma.job.create({
    data: {
      tenantId: body.tenant_id,
      regionId: body.region_id,
      accountId: body.account_id,
      communityId: body.community_id,
      lotId: body.lot_id,
      externalId: body.external_id,
      jobName: body.job_name,
      jobCategory: body.job_category || 'INITIAL_INSTALL',
      processType: body.process_type || 'Job',
      status: body.status || 'Active',
      targetInstallDate: body.target_install_date ? new Date(body.target_install_date) : null,
    },
  });
  return reply.status(201).send({ data: job });
});

// Start Fastify Server
const start = async () => {
  try {
    const port = Number(process.env.PORT) || 4000;
    const host = process.env.HOST || '0.0.0.0';
    await fastify.listen({ port, host });
    console.log(`🚀 SlabMaster Server running at http://${host}:${port}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();

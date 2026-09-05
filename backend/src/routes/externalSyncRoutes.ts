import { FastifyInstance, FastifyPluginAsync } from 'fastify';
import { PrismaClient } from '@prisma/client';
import { requireAuthOrApiKey, AuthenticatedRequest } from '../middleware/authMiddleware';

const prisma = new PrismaClient();

export const externalSyncRoutes: FastifyPluginAsync = async (fastify: FastifyInstance) => {
  // Enforce tenant authentication via API Key or Session
  fastify.addHook('preHandler', requireAuthOrApiKey);

  // Helper to log changes to the audit trail for two-way sync
  async function recordChangeLog(
    tenantId: string,
    entityType: string,
    entityId: string,
    changeSummary: string,
    fieldName: string,
    oldValue?: string | null,
    newValue?: string | null
  ) {
    try {
      await prisma.changeLog.create({
        data: {
          tenantId,
          entityType,
          entityId,
          changedByName: 'SAP_ERP_INTEGRATION',
          changeSummary,
          fieldName,
          oldValue: oldValue || null,
          newValue: newValue || null,
        },
      });
    } catch {
      // Non-blocking log failure
    }
  }

  // ==========================================
  // 1. BUILDER ACCOUNTS (by External ID)
  // ==========================================

  // GET /api/v1/accounts/by-external-id/:externalId
  fastify.get('/api/v1/accounts/by-external-id/:externalId', async (request, reply) => {
    const { externalId } = request.params as { externalId: string };
    const tenantId = (request as AuthenticatedRequest).tenantId!;

    const account = await prisma.account.findFirst({
      where: { tenantId, externalId, isArchived: false },
      include: {
        communities: {
          where: { isArchived: false },
          include: {
            lots: { where: { isArchived: false } },
          },
        },
      },
    });

    if (!account) {
      return reply.status(404).send({ error: 'Account not found with external ID: ' + externalId });
    }
    return { data: account };
  });

  // POST /api/v1/accounts/upsert (Idempotent Create or Update)
  fastify.post('/api/v1/accounts/upsert', async (request, reply) => {
    const tenantId = (request as AuthenticatedRequest).tenantId!;
    const body = request.body as {
      external_id: string;
      account_name: string;
      account_code?: string;
      billing_address_1?: string;
      billing_city?: string;
      billing_state?: string;
      billing_zip?: string;
    };

    if (!body.external_id || !body.account_name) {
      return reply.status(400).send({ error: 'external_id and account_name are required.' });
    }

    const existing = await prisma.account.findFirst({
      where: { tenantId, externalId: body.external_id },
    });

    if (existing) {
      const updated = await prisma.account.update({
        where: { id: existing.id },
        data: {
          accountName: body.account_name,
          accountCode: body.account_code || existing.accountCode,
          billingAddress1: body.billing_address_1 || existing.billingAddress1,
          billingCity: body.billing_city || existing.billingCity,
          billingState: body.billing_state || existing.billingState,
          billingZip: body.billing_zip || existing.billingZip,
          isArchived: false, // Auto-reactivate if previously soft-deleted
        },
      });
      await recordChangeLog(tenantId, 'ACCOUNT', updated.id, 'Account updated via SAP external ID', 'accountName', existing.accountName, updated.accountName);
      return { data: updated, operation: 'UPDATED' };
    } else {
      const created = await prisma.account.create({
        data: {
          tenantId,
          externalId: body.external_id,
          accountName: body.account_name,
          accountCode: body.account_code,
          billingAddress1: body.billing_address_1,
          billingCity: body.billing_city,
          billingState: body.billing_state,
          billingZip: body.billing_zip,
        },
      });
      await recordChangeLog(tenantId, 'ACCOUNT', created.id, 'Account created via SAP external ID', 'externalId', null, body.external_id);
      return reply.status(201).send({ data: created, operation: 'CREATED' });
    }
  });

  // DELETE /api/v1/accounts/by-external-id/:externalId (Soft Delete Default)
  fastify.delete('/api/v1/accounts/by-external-id/:externalId', async (request, reply) => {
    const tenantId = (request as AuthenticatedRequest).tenantId!;
    const { externalId } = request.params as { externalId: string };
    const { hard_purge } = request.query as { hard_purge?: string };

    const account = await prisma.account.findFirst({
      where: { tenantId, externalId },
    });

    if (!account) {
      return reply.status(404).send({ error: 'Account not found with external ID: ' + externalId });
    }

    if (hard_purge === 'true') {
      await prisma.account.delete({ where: { id: account.id } });
      return { message: 'Account permanently purged.', operation: 'PURGED' };
    }

    // Default: Soft delete (isArchived = true)
    const archived = await prisma.account.update({
      where: { id: account.id },
      data: { isArchived: true },
    });
    await recordChangeLog(tenantId, 'ACCOUNT', account.id, 'Account soft-deleted / archived via SAP', 'isArchived', 'false', 'true');
    return { message: 'Account soft-deleted/archived successfully.', data: archived, operation: 'ARCHIVED' };
  });

  // ==========================================
  // 2. COMMUNITIES (by External ID)
  // ==========================================

  // GET /api/v1/communities/by-external-id/:externalId
  fastify.get('/api/v1/communities/by-external-id/:externalId', async (request, reply) => {
    const { externalId } = request.params as { externalId: string };
    const tenantId = (request as AuthenticatedRequest).tenantId!;

    const community = await prisma.community.findFirst({
      where: { tenantId, externalId, isArchived: false },
      include: {
        account: true,
        region: true,
        lots: { where: { isArchived: false } },
      },
    });

    if (!community) {
      return reply.status(404).send({ error: 'Community not found with external ID: ' + externalId });
    }
    return { data: community };
  });

  // POST /api/v1/communities/upsert
  fastify.post('/api/v1/communities/upsert', async (request, reply) => {
    const tenantId = (request as AuthenticatedRequest).tenantId!;
    const body = request.body as {
      external_id: string;
      community_name: string;
      account_external_id?: string;
      account_id?: string;
      region_id?: string;
      site_address_1?: string;
      site_city?: string;
      site_state?: string;
      site_zip?: string;
      superintendent_name?: string;
      superintendent_phone?: string;
      superintendent_email?: string;
    };

    if (!body.external_id || !body.community_name) {
      return reply.status(400).send({ error: 'external_id and community_name are required.' });
    }

    // Resolve parent account ID
    let accountId = body.account_id;
    if (!accountId && body.account_external_id) {
      const parentAcc = await prisma.account.findFirst({
        where: { tenantId, externalId: body.account_external_id },
      });
      if (parentAcc) accountId = parentAcc.id;
    }

    if (!accountId) {
      // Default to first account if unspecified
      const defaultAcc = await prisma.account.findFirst({ where: { tenantId } });
      if (!defaultAcc) return reply.status(400).send({ error: 'No parent Account found to link Community.' });
      accountId = defaultAcc.id;
    }

    // Resolve region
    let regionId = body.region_id;
    if (!regionId) {
      const defRegion = await prisma.region.findFirst({ where: { tenantId } });
      regionId = defRegion ? defRegion.id : 'reg_default';
    }

    const existing = await prisma.community.findFirst({
      where: { tenantId, externalId: body.external_id },
    });

    if (existing) {
      const updated = await prisma.community.update({
        where: { id: existing.id },
        data: {
          communityName: body.community_name,
          siteAddress1: body.site_address_1 || existing.siteAddress1,
          siteCity: body.site_city || existing.siteCity,
          siteState: body.site_state || existing.siteState,
          siteZip: body.site_zip || existing.siteZip,
          superintendentName: body.superintendent_name || existing.superintendentName,
          superintendentPhone: body.superintendent_phone || existing.superintendentPhone,
          superintendentEmail: body.superintendent_email || existing.superintendentEmail,
          isArchived: false,
        },
      });
      await recordChangeLog(tenantId, 'COMMUNITY', updated.id, 'Community updated via SAP', 'communityName', existing.communityName, updated.communityName);
      return { data: updated, operation: 'UPDATED' };
    } else {
      const created = await prisma.community.create({
        data: {
          tenantId,
          accountId,
          regionId,
          externalId: body.external_id,
          communityName: body.community_name,
          siteAddress1: body.site_address_1,
          siteCity: body.site_city,
          siteState: body.site_state,
          siteZip: body.site_zip,
          superintendentName: body.superintendent_name,
          superintendentPhone: body.superintendent_phone,
          superintendentEmail: body.superintendent_email,
        },
      });
      await recordChangeLog(tenantId, 'COMMUNITY', created.id, 'Community created via SAP', 'externalId', null, body.external_id);
      return reply.status(201).send({ data: created, operation: 'CREATED' });
    }
  });

  // DELETE /api/v1/communities/by-external-id/:externalId
  fastify.delete('/api/v1/communities/by-external-id/:externalId', async (request, reply) => {
    const tenantId = (request as AuthenticatedRequest).tenantId!;
    const { externalId } = request.params as { externalId: string };
    const { hard_purge } = request.query as { hard_purge?: string };

    const community = await prisma.community.findFirst({ where: { tenantId, externalId } });
    if (!community) return reply.status(404).send({ error: 'Community not found: ' + externalId });

    if (hard_purge === 'true') {
      await prisma.community.delete({ where: { id: community.id } });
      return { message: 'Community permanently purged.', operation: 'PURGED' };
    }

    const archived = await prisma.community.update({
      where: { id: community.id },
      data: { isArchived: true },
    });
    await recordChangeLog(tenantId, 'COMMUNITY', community.id, 'Community soft-deleted via SAP', 'isArchived', 'false', 'true');
    return { message: 'Community archived successfully.', data: archived, operation: 'ARCHIVED' };
  });

  // ==========================================
  // 3. LOTS (by External ID)
  // ==========================================

  // GET /api/v1/lots/by-external-id/:externalId
  fastify.get('/api/v1/lots/by-external-id/:externalId', async (request, reply) => {
    const { externalId } = request.params as { externalId: string };
    const tenantId = (request as AuthenticatedRequest).tenantId!;

    const lot = await prisma.lot.findFirst({
      where: { tenantId, externalId, isArchived: false },
      include: {
        community: true,
        account: true,
        jobs: {
          include: { activities: true },
        },
      },
    });

    if (!lot) return reply.status(404).send({ error: 'Lot not found with external ID: ' + externalId });
    return { data: lot };
  });

  // POST /api/v1/lots/upsert
  fastify.post('/api/v1/lots/upsert', async (request, reply) => {
    const tenantId = (request as AuthenticatedRequest).tenantId!;
    const body = request.body as {
      external_id: string;
      lot_number: string;
      community_external_id?: string;
      community_id?: string;
      street_address?: string;
      elevation_plan?: string;
    };

    if (!body.external_id || !body.lot_number) {
      return reply.status(400).send({ error: 'external_id and lot_number are required.' });
    }

    let communityId = body.community_id;
    let accountId: string | undefined;
    let regionId: string | undefined;

    if (!communityId && body.community_external_id) {
      const comm = await prisma.community.findFirst({ where: { tenantId, externalId: body.community_external_id } });
      if (comm) {
        communityId = comm.id;
        accountId = comm.accountId;
        regionId = comm.regionId;
      }
    }

    if (!communityId) {
      const defComm = await prisma.community.findFirst({ where: { tenantId } });
      if (!defComm) return reply.status(400).send({ error: 'No parent Community found to link Lot.' });
      communityId = defComm.id;
      accountId = defComm.accountId;
      regionId = defComm.regionId;
    }

    const existing = await prisma.lot.findFirst({ where: { tenantId, externalId: body.external_id } });

    if (existing) {
      const updated = await prisma.lot.update({
        where: { id: existing.id },
        data: {
          lotNumber: body.lot_number,
          streetAddress: body.street_address || existing.streetAddress,
          elevationPlan: body.elevation_plan || existing.elevationPlan,
          isArchived: false,
        },
      });
      await recordChangeLog(tenantId, 'LOT', updated.id, 'Lot updated via SAP', 'lotNumber', existing.lotNumber, updated.lotNumber);
      return { data: updated, operation: 'UPDATED' };
    } else {
      const created = await prisma.lot.create({
        data: {
          tenantId,
          communityId,
          accountId: accountId!,
          regionId: regionId!,
          externalId: body.external_id,
          lotNumber: body.lot_number,
          streetAddress: body.street_address,
          elevationPlan: body.elevation_plan,
        },
      });
      await recordChangeLog(tenantId, 'LOT', created.id, 'Lot created via SAP', 'externalId', null, body.external_id);
      return reply.status(201).send({ data: created, operation: 'CREATED' });
    }
  });

  // DELETE /api/v1/lots/by-external-id/:externalId
  fastify.delete('/api/v1/lots/by-external-id/:externalId', async (request, reply) => {
    const tenantId = (request as AuthenticatedRequest).tenantId!;
    const { externalId } = request.params as { externalId: string };
    const { hard_purge } = request.query as { hard_purge?: string };

    const lot = await prisma.lot.findFirst({ where: { tenantId, externalId } });
    if (!lot) return reply.status(404).send({ error: 'Lot not found: ' + externalId });

    if (hard_purge === 'true') {
      await prisma.lot.delete({ where: { id: lot.id } });
      return { message: 'Lot permanently purged.', operation: 'PURGED' };
    }

    const archived = await prisma.lot.update({
      where: { id: lot.id },
      data: { isArchived: true },
    });
    await recordChangeLog(tenantId, 'LOT', lot.id, 'Lot soft-deleted via SAP', 'isArchived', 'false', 'true');
    return { message: 'Lot archived successfully.', data: archived, operation: 'ARCHIVED' };
  });

  // ==========================================
  // 4. JOBS (by External ID)
  // ==========================================

  // GET /api/v1/jobs/by-external-id/:externalId
  fastify.get('/api/v1/jobs/by-external-id/:externalId', async (request, reply) => {
    const { externalId } = request.params as { externalId: string };
    const tenantId = (request as AuthenticatedRequest).tenantId!;

    const job = await prisma.job.findFirst({
      where: { tenantId, externalId },
      include: {
        lot: true,
        community: true,
        account: true,
        activities: {
          include: { activityType: true, assignee: true },
        },
      },
    });

    if (!job) return reply.status(404).send({ error: 'Job not found with external ID: ' + externalId });
    return { data: job };
  });

  // POST /api/v1/jobs/upsert
  fastify.post('/api/v1/jobs/upsert', async (request, reply) => {
    const tenantId = (request as AuthenticatedRequest).tenantId!;
    const body = request.body as {
      external_id: string;
      job_name: string;
      lot_external_id?: string;
      lot_id?: string;
      status?: 'Draft' | 'Active' | 'OnHold' | 'Complete' | 'Cancelled';
      target_install_date?: string;
      project_number?: string;
      sales_order_number?: string;
      builder_phase?: string;
      plan_number?: string;
      job_notes?: string;
    };

    if (!body.external_id || !body.job_name) {
      return reply.status(400).send({ error: 'external_id and job_name are required.' });
    }

    let lotId = body.lot_id;
    let communityId: string | undefined;
    let accountId: string | undefined;
    let regionId: string | undefined;

    if (!lotId && body.lot_external_id) {
      const lot = await prisma.lot.findFirst({ where: { tenantId, externalId: body.lot_external_id } });
      if (lot) {
        lotId = lot.id;
        communityId = lot.communityId;
        accountId = lot.accountId;
        regionId = lot.regionId;
      }
    }

    if (!lotId) {
      const defLot = await prisma.lot.findFirst({ where: { tenantId } });
      if (!defLot) return reply.status(400).send({ error: 'No Lot found to attach Job.' });
      lotId = defLot.id;
      communityId = defLot.communityId;
      accountId = defLot.accountId;
      regionId = defLot.regionId;
    }

    const existing = await prisma.job.findFirst({ where: { tenantId, externalId: body.external_id } });

    if (existing) {
      const updated = await prisma.job.update({
        where: { id: existing.id },
        data: {
          jobName: body.job_name,
          status: body.status || existing.status,
          targetInstallDate: body.target_install_date ? new Date(body.target_install_date) : existing.targetInstallDate,
          projectNumber: body.project_number || existing.projectNumber,
          salesOrderNumber: body.sales_order_number || existing.salesOrderNumber,
          builderPhase: body.builder_phase || existing.builderPhase,
          planNumber: body.plan_number || existing.planNumber,
          jobNotes: body.job_notes || existing.jobNotes,
        },
      });
      await recordChangeLog(tenantId, 'JOB', String(updated.id), 'Job updated via SAP', 'status', existing.status, updated.status);
      return { data: updated, operation: 'UPDATED' };
    } else {
      const created = await prisma.job.create({
        data: {
          tenantId,
          regionId: regionId!,
          accountId: accountId!,
          communityId: communityId!,
          lotId,
          externalId: body.external_id,
          jobName: body.job_name,
          status: body.status || 'Active',
          targetInstallDate: body.target_install_date ? new Date(body.target_install_date) : null,
          projectNumber: body.project_number,
          salesOrderNumber: body.sales_order_number,
          builderPhase: body.builder_phase,
          planNumber: body.plan_number,
          jobNotes: body.job_notes,
        },
      });
      await recordChangeLog(tenantId, 'JOB', String(created.id), 'Job created via SAP', 'externalId', null, body.external_id);
      return reply.status(201).send({ data: created, operation: 'CREATED' });
    }
  });

  // DELETE /api/v1/jobs/by-external-id/:externalId (Soft-Cancel Default)
  fastify.delete('/api/v1/jobs/by-external-id/:externalId', async (request, reply) => {
    const tenantId = (request as AuthenticatedRequest).tenantId!;
    const { externalId } = request.params as { externalId: string };
    const { hard_purge } = request.query as { hard_purge?: string };

    const job = await prisma.job.findFirst({ where: { tenantId, externalId } });
    if (!job) return reply.status(404).send({ error: 'Job not found: ' + externalId });

    if (hard_purge === 'true') {
      await prisma.job.delete({ where: { id: job.id } });
      return { message: 'Job permanently purged from database.', operation: 'PURGED' };
    }

    // Default: Soft delete -> mark status: Cancelled, closedAt: now
    const cancelled = await prisma.job.update({
      where: { id: job.id },
      data: { status: 'Cancelled', closedAt: new Date() },
    });

    // Also cancel all active child activities
    await prisma.jobActivity.updateMany({
      where: { jobId: job.id, status: { not: 'Complete' } },
      data: { status: 'Cancelled' },
    });

    await recordChangeLog(tenantId, 'JOB', String(job.id), 'Job cancelled via SAP DELETE', 'status', job.status, 'Cancelled');
    return {
      message: 'Job cancelled and closed successfully per ERP soft-delete compliance.',
      data: cancelled,
      operation: 'CANCELLED',
    };
  });

  // ==========================================
  // 5. JOB ACTIVITIES / MILESTONES (by External ID)
  // ==========================================

  // GET /api/v1/activities/by-external-id/:externalId
  fastify.get('/api/v1/activities/by-external-id/:externalId', async (request, reply) => {
    const { externalId } = request.params as { externalId: string };
    const tenantId = (request as AuthenticatedRequest).tenantId!;

    const activity = await prisma.jobActivity.findFirst({
      where: { tenantId, externalId },
      include: { job: true, activityType: true, assignee: true },
    });

    if (!activity) return reply.status(404).send({ error: 'Activity not found: ' + externalId });
    return { data: activity };
  });

  // POST /api/v1/activities/upsert
  fastify.post('/api/v1/activities/upsert', async (request, reply) => {
    const tenantId = (request as AuthenticatedRequest).tenantId!;
    const body = request.body as {
      external_id: string;
      job_external_id?: string;
      job_id?: number;
      activity_type_id?: string;
      status?: 'Tentative' | 'Confirmed' | 'AutoSchedule' | 'Complete' | 'Cancelled';
      start_date?: string;
      start_time?: string;
      duration_mins?: number;
      notes?: string;
    };

    if (!body.external_id) {
      return reply.status(400).send({ error: 'external_id is required.' });
    }

    let jobId = body.job_id;
    if (!jobId && body.job_external_id) {
      const job = await prisma.job.findFirst({ where: { tenantId, externalId: body.job_external_id } });
      if (job) jobId = job.id;
    }

    const existing = await prisma.jobActivity.findFirst({ where: { tenantId, externalId: body.external_id } });

    if (existing) {
      const updated = await prisma.jobActivity.update({
        where: { id: existing.id },
        data: {
          status: body.status || existing.status,
          startDate: body.start_date ? new Date(body.start_date) : existing.startDate,
          startTime: body.start_time || existing.startTime,
          durationMins: body.duration_mins || existing.durationMins,
          notes: body.notes || existing.notes,
          completedAt: body.status === 'Complete' ? new Date() : existing.completedAt,
        },
      });
      await recordChangeLog(tenantId, 'ACTIVITY', updated.id, 'Activity updated via SAP', 'status', existing.status, updated.status);
      return { data: updated, operation: 'UPDATED' };
    } else {
      if (!jobId) {
        return reply.status(400).send({ error: 'job_id or job_external_id is required to create an activity.' });
      }

      // Default activity type if not passed
      let actTypeId = body.activity_type_id;
      if (!actTypeId) {
        const defType = await prisma.activityType.findFirst();
        actTypeId = defType ? defType.id : 'act_install';
      }

      const created = await prisma.jobActivity.create({
        data: {
          tenantId,
          jobId,
          activityTypeId: actTypeId,
          externalId: body.external_id,
          status: body.status || 'Confirmed',
          startDate: body.start_date ? new Date(body.start_date) : null,
          startTime: body.start_time,
          durationMins: body.duration_mins || 120,
          notes: body.notes,
        },
      });
      await recordChangeLog(tenantId, 'ACTIVITY', created.id, 'Activity created via SAP', 'externalId', null, body.external_id);
      return reply.status(201).send({ data: created, operation: 'CREATED' });
    }
  });

  // DELETE /api/v1/activities/by-external-id/:externalId
  fastify.delete('/api/v1/activities/by-external-id/:externalId', async (request, reply) => {
    const tenantId = (request as AuthenticatedRequest).tenantId!;
    const { externalId } = request.params as { externalId: string };
    const { hard_purge } = request.query as { hard_purge?: string };

    const activity = await prisma.jobActivity.findFirst({ where: { tenantId, externalId } });
    if (!activity) return reply.status(404).send({ error: 'Activity not found: ' + externalId });

    if (hard_purge === 'true') {
      await prisma.jobActivity.delete({ where: { id: activity.id } });
      return { message: 'Activity permanently purged.', operation: 'PURGED' };
    }

    const cancelled = await prisma.jobActivity.update({
      where: { id: activity.id },
      data: { status: 'Cancelled' },
    });
    await recordChangeLog(tenantId, 'ACTIVITY', activity.id, 'Activity cancelled via SAP', 'status', activity.status, 'Cancelled');
    return { message: 'Activity cancelled successfully.', data: cancelled, operation: 'CANCELLED' };
  });

  // ==========================================
  // 6. TWO-WAY SYNC DELTA FEED (Change Data Capture)
  // ==========================================

  // GET /api/v1/sync/changes?since=<iso_timestamp>&entity=<type>&limit=100
  fastify.get('/api/v1/sync/changes', async (request, reply) => {
    const tenantId = (request as AuthenticatedRequest).tenantId!;
    const query = request.query as {
      since?: string;
      entity?: string;
      limit?: string;
    };

    const limit = Math.min(100, Math.max(1, parseInt(query.limit || '50', 10)));
    const sinceDate = query.since ? new Date(query.since) : new Date(Date.now() - 24 * 60 * 60 * 1000);

    const changes = await prisma.changeLog.findMany({
      where: {
        tenantId,
        createdAt: { gt: sinceDate },
        entityType: query.entity ? query.entity.toUpperCase() : undefined,
      },
      orderBy: { createdAt: 'asc' },
      take: limit,
    });

    const latestCursor = changes.length > 0 ? changes[changes.length - 1].createdAt.toISOString() : sinceDate.toISOString();

    return {
      data: changes,
      metadata: {
        count: changes.length,
        since: sinceDate.toISOString(),
        cursor: latestCursor,
        hasMore: changes.length === limit,
      },
    };
  });
};

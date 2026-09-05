import { PrismaClient } from '@prisma/client';
import { ErpSyncStatus } from '../types/enums';

const prisma = new PrismaClient();

/**
 * Enterprise Backoff Ladder for Outbound ERP Dispatches
 * Attempt 0 -> 0s (Immediate retry)
 * Attempt 1 -> 60s (1 Minute)
 * Attempt 2 -> 300s (5 Minutes)
 * Attempt 3 -> 900s (15 Minutes)
 * Attempt 4 -> 3600s (1 Hour)
 * Attempt 5+ -> Exhausted -> FAILED (Dead-Letter Queue)
 */
export function calculateNextRetryDelayMs(attemptNumber: number): number {
  switch (attemptNumber) {
    case 0:
      return 0; // Immediate re-dispatch
    case 1:
      return 60 * 1000; // 1 Minute
    case 2:
      return 5 * 60 * 1000; // 5 Minutes
    case 3:
      return 15 * 60 * 1000; // 15 Minutes
    case 4:
      return 60 * 60 * 1000; // 1 Hour
    default:
      return 60 * 60 * 1000;
  }
}

/**
 * Enqueue an outbound push event destined for SAP S/4HANA or middleware
 */
export async function enqueueErpOutbound(
  tenantId: string,
  entityType: string,
  entityId: string,
  action: string,
  payload: any,
  destinationUrl?: string
) {
  const payloadStr = typeof payload === 'string' ? payload : JSON.stringify(payload);
  return await prisma.erpOutboundQueue.create({
    data: {
      tenantId,
      entityType,
      entityId,
      action,
      payload: payloadStr,
      destinationUrl,
      status: 'PENDING',
      attempts: 0,
      maxAttempts: 5,
      nextRetryAt: new Date(),
    },
  });
}

/**
 * Record a dispatch failure with automated exponential backoff scheduling
 */
export async function recordAttemptFailure(queueId: string, errorMessage: string) {
  const item = await prisma.erpOutboundQueue.findUnique({ where: { id: queueId } });
  if (!item) return null;

  const nextAttempt = item.attempts + 1;
  const isExhausted = nextAttempt >= item.maxAttempts;

  if (isExhausted) {
    return await prisma.erpOutboundQueue.update({
      where: { id: queueId },
      data: {
        attempts: nextAttempt,
        status: 'FAILED',
        nextRetryAt: null,
        lastError: `[Max Retries Exhausted (${item.maxAttempts})]: ${errorMessage}`,
      },
    });
  }

  const delayMs = calculateNextRetryDelayMs(nextAttempt);
  const nextRetryAt = new Date(Date.now() + delayMs);

  return await prisma.erpOutboundQueue.update({
    where: { id: queueId },
    data: {
      attempts: nextAttempt,
      status: 'RETRYING',
      nextRetryAt,
      lastError: `[Attempt ${nextAttempt}/${item.maxAttempts} Failed]: ${errorMessage}`,
    },
  });
}

/**
 * Mark item as successfully acknowledged by SAP
 */
export async function recordAttemptSuccess(queueId: string) {
  return await prisma.erpOutboundQueue.update({
    where: { id: queueId },
    data: {
      status: 'COMPLETED',
      nextRetryAt: null,
      lastError: null,
    },
  });
}

/**
 * Trigger an immediate manual retry for a stuck/failed item
 */
export async function manualRetryItem(queueId: string) {
  return await prisma.erpOutboundQueue.update({
    where: { id: queueId },
    data: {
      status: 'PENDING',
      nextRetryAt: new Date(),
      lastError: null,
    },
  });
}

/**
 * Batch retry all stuck items in the Dead-Letter Queue for a tenant
 */
export async function retryAllFailedItems(tenantId: string) {
  return await prisma.erpOutboundQueue.updateMany({
    where: {
      tenantId,
      status: 'FAILED',
    },
    data: {
      status: 'PENDING',
      nextRetryAt: new Date(),
    },
  });
}

/**
 * List tenant outbound queue items
 */
export async function listQueueItems(tenantId: string, status?: ErpSyncStatus) {
  return await prisma.erpOutboundQueue.findMany({
    where: {
      tenantId,
      ...(status ? { status } : {}),
    },
    orderBy: { createdAt: 'desc' },
    take: 100,
  });
}

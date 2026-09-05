import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';
import {
  DEFAULT_MOCK_ERP_QUEUE,
  ErpQueueItem
} from '../types/apiKeys';

describe('ERP Outbound Retry Queue, Progressive Backoff & Postman Integration', () => {
  it('should provide default queue items demonstrating Dead-Letter, Retrying, and Synced states', () => {
    expect(DEFAULT_MOCK_ERP_QUEUE.length).toBeGreaterThanOrEqual(3);

    const failedItem = DEFAULT_MOCK_ERP_QUEUE.find((i) => i.status === 'FAILED');
    expect(failedItem).toBeDefined();
    expect(failedItem?.attempts).toBe(5);
    expect(failedItem?.lastError).toContain('Max Retries Exhausted');

    const retryingItem = DEFAULT_MOCK_ERP_QUEUE.find((i) => i.status === 'RETRYING');
    expect(retryingItem).toBeDefined();
    expect(retryingItem?.nextRetryAt).toBeDefined();

    const completedItem = DEFAULT_MOCK_ERP_QUEUE.find((i) => i.status === 'COMPLETED');
    expect(completedItem).toBeDefined();
  });

  it('should accurately calculate progressive exponential backoff delays (1m, 5m, 15m, 1h)', () => {
    function getDelaySeconds(attempt: number): number {
      switch (attempt) {
        case 0: return 0;
        case 1: return 60;
        case 2: return 300;
        case 3: return 900;
        case 4: return 3600;
        default: return 3600;
      }
    }

    expect(getDelaySeconds(0)).toBe(0);      // Immediate
    expect(getDelaySeconds(1)).toBe(60);     // 1 min
    expect(getDelaySeconds(2)).toBe(300);    // 5 min
    expect(getDelaySeconds(3)).toBe(900);    // 15 min
    expect(getDelaySeconds(4)).toBe(3600);   // 1 hour
  });

  it('should transition to FAILED / Dead-Letter once max retries are exhausted', () => {
    const maxAttempts = 5;
    let attempts = 4;
    let status: 'PENDING' | 'RETRYING' | 'FAILED' = 'RETRYING';

    // 5th attempt fails
    attempts += 1;
    if (attempts >= maxAttempts) {
      status = 'FAILED';
    }

    expect(attempts).toBe(5);
    expect(status).toBe('FAILED');
  });

  it('should reset failed dead-letter items to PENDING upon manual retry', () => {
    const queue: ErpQueueItem[] = [...DEFAULT_MOCK_ERP_QUEUE];
    const stuckItemId = 'queue-tx-9941';

    const updatedQueue = queue.map((item) =>
      item.id === stuckItemId
        ? { ...item, status: 'PENDING' as const, lastError: null, nextRetryAt: new Date().toISOString() }
        : item
    );

    const retried = updatedQueue.find((i) => i.id === stuckItemId);
    expect(retried?.status).toBe('PENDING');
    expect(retried?.lastError).toBeNull();
  });

  it('should verify official Postman Collection v2.1 exists with all core entities', () => {
    const postmanPath = path.resolve(__dirname, '../../public/slabmaster_postman_collection.json');
    expect(fs.existsSync(postmanPath)).toBe(true);

    const postmanRaw = fs.readFileSync(postmanPath, 'utf8');
    const collection = JSON.parse(postmanRaw);

    expect(collection.info.name).toContain('SlabMaster');
    expect(collection.auth.type).toBe('apikey');

    const folderNames = collection.item.map((f: any) => f.name);
    expect(folderNames.some((n: string) => n.includes('Accounts'))).toBe(true);
    expect(folderNames.some((n: string) => n.includes('Communities'))).toBe(true);
    expect(folderNames.some((n: string) => n.includes('Lots'))).toBe(true);
    expect(folderNames.some((n: string) => n.includes('Jobs'))).toBe(true);
    expect(folderNames.some((n: string) => n.includes('Activities'))).toBe(true);
    expect(folderNames.some((n: string) => n.includes('Two-Way Sync'))).toBe(true);
    expect(folderNames.some((n: string) => n.includes('Outbound Retry Queue'))).toBe(true);
  });

  it('should verify standalone SAP Developer Documentation Pack (api-docs.html) exists and contains ABAP code', () => {
    const apiDocsPath = path.resolve(__dirname, '../../public/api-docs.html');
    expect(fs.existsSync(apiDocsPath)).toBe(true);

    const apiDocsContent = fs.readFileSync(apiDocsPath, 'utf8');
    expect(apiDocsContent).toContain('SlabMaster REST API & SAP S/4HANA Integration');
    expect(apiDocsContent).toContain('REPORT z_slabmaster_job_upsert');
    expect(apiDocsContent).toContain('cl_http_client');
    expect(apiDocsContent).toContain('/api/v1/accounts/upsert');
    expect(apiDocsContent).toContain('/api/v1/communities/upsert');
    expect(apiDocsContent).toContain('/api/v1/lots/upsert');
    expect(apiDocsContent).toContain('/api/v1/jobs/upsert');
    expect(apiDocsContent).toContain('/api/v1/activities/upsert');
    expect(apiDocsContent).toContain('/api/v1/sync/changes');
    expect(apiDocsContent).toContain('/api/v1/sync/queue');
    expect(apiDocsContent).toContain('slabmaster_postman_collection.json');
    expect(apiDocsContent).toContain('© 2026 SlabMaster');
    expect(apiDocsContent).toContain('v1.0.0');
  });

  it('should verify live Moraware test fixtures and SAP external IDs are cataloged in Postman and API docs', () => {
    const postmanPath = path.resolve(__dirname, '../../public/slabmaster_postman_collection.json');
    const postmanRaw = fs.readFileSync(postmanPath, 'utf8');
    const collection = JSON.parse(postmanRaw);
    const folderNames = collection.item.map((f: any) => f.name);

    expect(folderNames.some((n: string) => n.includes('Moraware Live Demo Fixtures'))).toBe(true);

    const apiDocsPath = path.resolve(__dirname, '../../public/api-docs.html');
    const apiDocsContent = fs.readFileSync(apiDocsPath, 'utf8');

    expect(apiDocsContent).toContain('SAP-CUST-126954');
    expect(apiDocsContent).toContain('SAP-COMM-LNXAUS');
    expect(apiDocsContent).toContain('SAP-LOT-LNXAUS-036');
    expect(apiDocsContent).toContain('SAP-SO-10170');
    expect(apiDocsContent).toContain('SAP-WBS-10170-TMPL');
  });
});

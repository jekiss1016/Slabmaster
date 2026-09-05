export interface ApiKeyItem {
  id: string;
  tenantId?: string;
  name: string;
  keyPrefix: string;
  token?: string; // Only populated on initial creation for one-time reveal
  scopes: string; // Comma-separated: 'read,write,sync'
  isActive: boolean;
  lastUsedAt?: string | null;
  expiresAt?: string | null;
  createdAt: string;
}

export interface CreateApiKeyRequest {
  name: string;
  scopes: string;
  expires_in_days?: number;
}

export interface ApiScopeOption {
  id: string;
  label: string;
  description: string;
}

export const AVAILABLE_API_SCOPES: ApiScopeOption[] = [
  { id: 'read', label: 'Read (Query)', description: 'Read Builder Accounts, Communities, Lots, Jobs, and Activities via External ID' },
  { id: 'write', label: 'Write (Upsert)', description: 'Create and update records directly mapping from SAP ERP external identifiers' },
  { id: 'sync', label: 'Two-Way Sync (CDC)', description: 'Poll Change Data Capture feed for two-way synchronization and real-time state mirroring' },
  { id: 'delete', label: 'Soft Delete / Cancel', description: 'Idempotently flag records as Cancelled/Archived without breaking ERP foreign keys' },
];

export const DEFAULT_MOCK_API_KEYS: ApiKeyItem[] = [
  {
    id: 'key-sap-prod-01',
    name: 'SAP S/4HANA Enterprise Connector',
    keyPrefix: 'sm_live_9f83a1',
    scopes: 'read,write,sync',
    isActive: true,
    lastUsedAt: new Date(Date.now() - 1000 * 60 * 18).toISOString(),
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 14).toISOString(),
  },
  {
    id: 'key-wbs-sync-02',
    name: 'WBS Project Cost & Lot Sync Daemon',
    keyPrefix: 'sm_live_4b71c2',
    scopes: 'read,write',
    isActive: true,
    lastUsedAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
  }
];

export interface ErpQueueItem {
  id: string;
  entityType: 'Job' | 'Lot' | 'Account' | 'Community' | 'Activity';
  entityId: string;
  action: 'STATUS_UPDATE' | 'COMPLETION_SIGNOFF' | 'UPSERT' | 'CANCEL';
  payload: string;
  destinationUrl?: string;
  status: 'PENDING' | 'RETRYING' | 'FAILED' | 'COMPLETED';
  attempts: number;
  maxAttempts: number;
  nextRetryAt?: string | null;
  lastError?: string | null;
  createdAt: string;
  updatedAt: string;
}

export const DEFAULT_MOCK_ERP_QUEUE: ErpQueueItem[] = [
  {
    id: 'queue-tx-9941',
    entityType: 'Job',
    entityId: 'SAP-WBS-70821',
    action: 'STATUS_UPDATE',
    payload: JSON.stringify({
      job_external_id: 'SAP-WBS-70821',
      status: 'Install Completed & Signed',
      signed_by: 'M. Vance (Field Lead)',
      completion_date: '2026-09-04T18:45:00Z',
      square_footage_installed: 64.5
    }, null, 2),
    destinationUrl: 'https://sap-gateway.enterprise.corp/api/v2/wbs-milestones',
    status: 'FAILED',
    attempts: 5,
    maxAttempts: 5,
    nextRetryAt: null,
    lastError: '[Max Retries Exhausted (5)]: HTTP 503 Service Unavailable — SAP S/4HANA scheduled maintenance window in progress.',
    createdAt: new Date(Date.now() - 1000 * 60 * 135).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
  },
  {
    id: 'queue-tx-9942',
    entityType: 'Activity',
    entityId: 'SAP-ACT-4109',
    action: 'COMPLETION_SIGNOFF',
    payload: JSON.stringify({
      activity_external_id: 'SAP-ACT-4109',
      phase_name: 'Digital Laser Template',
      status: 'Completed',
      linear_feet_measured: 38.2
    }, null, 2),
    destinationUrl: 'https://sap-gateway.enterprise.corp/api/v2/wbs-milestones',
    status: 'RETRYING',
    attempts: 3,
    maxAttempts: 5,
    nextRetryAt: new Date(Date.now() + 1000 * 60 * 11).toISOString(),
    lastError: '[Attempt 3/5 Failed]: HTTP 429 Too Many Requests — SAP rate limiter throttled outbound push.',
    createdAt: new Date(Date.now() - 1000 * 60 * 22).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 4).toISOString(),
  },
  {
    id: 'queue-tx-9943',
    entityType: 'Lot',
    entityId: 'LOT-HIGHLAND-44',
    action: 'UPSERT',
    payload: JSON.stringify({
      lot_external_id: 'LOT-HIGHLAND-44',
      status: 'Drywall Ready',
      target_install_date: '2026-09-19'
    }, null, 2),
    destinationUrl: 'https://sap-gateway.enterprise.corp/api/v2/lots',
    status: 'COMPLETED',
    attempts: 1,
    maxAttempts: 5,
    nextRetryAt: null,
    lastError: null,
    createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 44).toISOString(),
  }
];


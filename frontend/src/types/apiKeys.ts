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

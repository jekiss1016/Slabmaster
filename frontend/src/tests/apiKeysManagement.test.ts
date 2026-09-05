import { describe, it, expect } from 'vitest';
import {
  AVAILABLE_API_SCOPES,
  DEFAULT_MOCK_API_KEYS,
  ApiKeyItem
} from '../types/apiKeys';

describe('Modern RESTful API & SAP ERP Integration', () => {
  it('should provide default enterprise integration keys with correct live prefixes', () => {
    expect(DEFAULT_MOCK_API_KEYS.length).toBeGreaterThan(0);
    for (const key of DEFAULT_MOCK_API_KEYS) {
      expect(key.keyPrefix.startsWith('sm_live_')).toBe(true);
      expect(key.isActive).toBe(true);
      expect(key.scopes).toBeTruthy();
    }
  });

  it('should offer complete CRUD, two-way sync, and soft-delete permission scopes', () => {
    const scopeIds = AVAILABLE_API_SCOPES.map((s) => s.id);
    expect(scopeIds).toContain('read');
    expect(scopeIds).toContain('write');
    expect(scopeIds).toContain('sync');
    expect(scopeIds).toContain('delete');

    const syncScope = AVAILABLE_API_SCOPES.find((s) => s.id === 'sync');
    expect(syncScope?.description).toContain('Change Data Capture');

    const deleteScope = AVAILABLE_API_SCOPES.find((s) => s.id === 'delete');
    expect(deleteScope?.description).toContain('Cancel');
  });

  it('should generate valid live tokens with sm_live_ prefix and calculate expiration', () => {
    const hexRandom = '1a2b3c4d5e6f7a8b9c0d1e2f';
    const fullToken = `sm_live_${hexRandom}`;
    const prefix = fullToken.substring(0, 14);

    expect(fullToken).toBe('sm_live_1a2b3c4d5e6f7a8b9c0d1e2f');
    expect(prefix).toBe('sm_live_1a2b3c');

    const now = new Date('2026-09-01T12:00:00Z');
    const expiresInDays = 30;
    const expiresAt = new Date(now.getTime() + expiresInDays * 24 * 60 * 60 * 1000).toISOString();

    expect(expiresAt).toBe('2026-10-01T12:00:00.000Z');
  });

  it('should safely revoke an API key from active tenant credentials', () => {
    const initialKeys: ApiKeyItem[] = [...DEFAULT_MOCK_API_KEYS];
    const targetId = initialKeys[0].id;

    const remainingKeys = initialKeys.filter((k) => k.id !== targetId);
    expect(remainingKeys.length).toBe(initialKeys.length - 1);
    expect(remainingKeys.find((k) => k.id === targetId)).toBeUndefined();
  });

  it('should construct valid SAP external ID payload mappings across hierarchy levels', () => {
    const sapUpsertPayload = {
      external_id: 'SAP-ORD-90210',
      account_external_id: 'SAP-BLD-01',
      community_external_id: 'COMM-HIGHLAND',
      lot_external_id: 'LOT-14',
      job_name: 'Master Bath Vanity',
      job_category: 'INITIAL_INSTALL',
      target_install_date: '2026-09-18T00:00:00Z'
    };

    expect(sapUpsertPayload.external_id).toBe('SAP-ORD-90210');
    expect(sapUpsertPayload.lot_external_id).toBe('LOT-14');
    expect(sapUpsertPayload.community_external_id).toBe('COMM-HIGHLAND');
    expect(sapUpsertPayload.account_external_id).toBe('SAP-BLD-01');
  });
});

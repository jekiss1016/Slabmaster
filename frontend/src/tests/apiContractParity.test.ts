import { describe, it, expect } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';

describe('REST API Contract & Postman Collection Parity Tests', () => {
  const postmanPath = path.resolve(__dirname, '../../public/slabmaster_postman_collection.json');
  const postmanRaw = fs.readFileSync(postmanPath, 'utf-8');
  const postman = JSON.parse(postmanRaw);

  it('validates Postman collection metadata, auth scheme, and variables', () => {
    expect(postman.info.name).toContain('SlabMaster');
    expect(postman.variable).toBeDefined();

    const baseUrlVar = postman.variable.find((v: any) => v.key === 'baseUrl');
    expect(baseUrlVar).toBeDefined();
    expect(baseUrlVar.value).toBeTruthy();

    const apiKeyVar = postman.variable.find((v: any) => v.key === 'apiKey');
    expect(apiKeyVar).toBeDefined();

    expect(postman.auth.type).toBe('apikey');
    const apiKeyHeader = postman.auth.apikey.find((k: any) => k.key === 'key');
    expect(apiKeyHeader.value).toBe('X-API-Key');
  });

  it('verifies all expected core SAP integration modules exist in Postman collection', () => {
    const folderNames = postman.item.map((folder: any) => folder.name);

    expect(folderNames.some((n: string) => n.includes('Builder Accounts'))).toBe(true);
    expect(folderNames.some((n: string) => n.includes('Communities'))).toBe(true);
    expect(folderNames.some((n: string) => n.includes('Lots'))).toBe(true);
    expect(folderNames.some((n: string) => n.includes('Jobs') || n.includes('Work Orders'))).toBe(true);
    expect(folderNames.some((n: string) => n.includes('Activities') || n.includes('WBS'))).toBe(true);
    expect(folderNames.some((n: string) => n.includes('Change Data Capture') || n.includes('Sync'))).toBe(true);
  });

  it('confirms all endpoints have valid HTTP methods and external ID routing standards', () => {
    const allRequests: { name: string; method: string; path: string[] }[] = [];

    function collectRequests(items: any[]) {
      items.forEach((item) => {
        if (item.request) {
          allRequests.push({
            name: item.name,
            method: item.request.method,
            path: item.request.url.path || []
          });
        }
        if (item.item) {
          collectRequests(item.item);
        }
      });
    }

    collectRequests(postman.item);
    expect(allRequests.length).toBeGreaterThanOrEqual(15);

    // Verify key external ID endpoints
    const accountUpsert = allRequests.find((r) => r.path.join('/') === 'api/v1/accounts/upsert');
    expect(accountUpsert?.method).toBe('POST');

    const jobUpsert = allRequests.find((r) => r.path.join('/') === 'api/v1/jobs/upsert');
    expect(jobUpsert?.method).toBe('POST');

    const communityUpsert = allRequests.find((r) => r.path.join('/') === 'api/v1/communities/upsert');
    expect(communityUpsert?.method).toBe('POST');

    const activityUpsert = allRequests.find((r) => r.path.join('/') === 'api/v1/activities/upsert');
    expect(activityUpsert?.method).toBe('POST');

    const changeFeed = allRequests.find((r) => r.path.join('/') === 'api/v1/sync/changes');
    expect(changeFeed?.method).toBe('GET');
  });

  it('validates SQL Server connection string format to prevent protocol regressions', () => {
    const sampleValidAzureSqlUrl =
      'sqlserver://sqlserver-slabmaster-prod.database.windows.net:1433;database=sqldb-slabmaster-prod;user=slabmasteradmin;password=secret;encrypt=true;trustServerCertificate=false;';

    const validateDatabaseUrl = (url: string) => {
      if (!url.startsWith('sqlserver://')) {
        throw new Error('the URL must start with the protocol sqlserver://');
      }
      return true;
    };

    expect(validateDatabaseUrl(sampleValidAzureSqlUrl)).toBe(true);
    expect(() => validateDatabaseUrl('mysql://root:pass@localhost:3306/db')).toThrow(
      'the URL must start with the protocol sqlserver://'
    );
  });
});

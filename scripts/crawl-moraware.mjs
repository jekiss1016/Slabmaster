#!/usr/bin/env node
/**
 * Moraware Systemize Feature Crawler & Inspector (STRICT READ-ONLY MODE)
 * 
 * SOLID SAFETY RULE:
 * - NO EDITS, DELETIONS, SAVES, OR MUTATIONS FOR ANY REASON.
 * - ALL crawler HTTP requests are strictly forced to HTTP GET (read-only), 
 *   with the single exception of the initial login POST to /sys.
 * - All URLs matching mutation keywords (save, delete, update, edit, remove, purge, create)
 *   are automatically filtered out and blocked.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

// Attempt to load .env.local or .env
function loadEnv() {
  const envPaths = [
    path.join(rootDir, '.env.local'),
    path.join(rootDir, '.env')
  ];

  for (const envPath of envPaths) {
    if (fs.existsSync(envPath)) {
      console.log(`[Crawler] Loading configuration from ${path.basename(envPath)}`);
      const lines = fs.readFileSync(envPath, 'utf-8').split('\n');
      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith('#')) continue;
        const eqIdx = trimmed.indexOf('=');
        if (eqIdx !== -1) {
          const key = trimmed.slice(0, eqIdx).trim();
          const val = trimmed.slice(eqIdx + 1).trim();
          if (!process.env[key]) {
            process.env[key] = val;
          }
        }
      }
      return;
    }
  }
}

loadEnv();

const rawUrl = process.env.MORAWARE_URL || 'https://ilg-atlanta.moraware.net/sys';
const parsedUrl = new URL(rawUrl.startsWith('http') ? rawUrl : `https://${rawUrl}`);
const origin = parsedUrl.origin;
const MORAWARE_USER = process.env.MORAWARE_USER;
const MORAWARE_PASS = process.env.MORAWARE_PASS;
const MAX_PAGES = parseInt(process.env.MORAWARE_MAX_PAGES || '150', 10);
const TIMEOUT_MS = parseInt(process.env.MORAWARE_TIMEOUT_MS || '15000', 10);

if (!MORAWARE_USER || !MORAWARE_PASS) {
  console.error('\x1b[31m[Error] Moraware credentials missing in .env.local!\x1b[0m');
  process.exit(1);
}

console.log('=============================================================================');
console.log('  MORAWARE SYSTEMIZE UI CRAWLER - STRICT READ-ONLY MODE ENABLED');
console.log('  SOLID RULE ENFORCED: NO EDITS, WRITES, DELETIONS, OR MUTATIONS');
console.log('=============================================================================');
console.log(`Target Instance: ${origin}`);
console.log(`User Account:    ${MORAWARE_USER}`);
console.log(`Max Pages:       ${MAX_PAGES}`);

class CookieJar {
  constructor() {
    this.cookies = new Map();
  }

  update(response) {
    const rawHeaders = response.headers.getSetCookie ? response.headers.getSetCookie() : [];
    if (rawHeaders.length === 0) {
      const single = response.headers.get('set-cookie');
      if (single) rawHeaders.push(single);
    }
    for (const header of rawHeaders) {
      const parts = header.split(';')[0].split('=');
      if (parts.length >= 2) {
        const name = parts[0].trim();
        const value = parts.slice(1).join('=').trim();
        this.cookies.set(name, value);
      }
    }
  }

  getHeader() {
    return Array.from(this.cookies.entries())
      .map(([k, v]) => `${k}=${v}`)
      .join('; ');
  }
}

const jar = new CookieJar();

// Strict Mutation Filter: Reject any link that could perform an edit, delete, or mutation
function isMutatingUrl(urlStr) {
  const lower = urlStr.toLowerCase();
  const blockedTerms = [
    'action=delete', 'action=remove', 'action=save', 'action=update', 'action=create',
    'action=edit', 'action=purge', 'action=apply', 'do=delete', 'do=save', 'do=update',
    'deletejob', 'editjob', 'savejob', 'deleteaccount', 'editaccount', 'saveaccount',
    'deleteschedule', 'editschedule', 'saveschedule', 'deleteactivity', 'editactivity',
    'logout'
  ];
  return blockedTerms.some(term => lower.includes(term));
}

async function customFetch(url, options = {}) {
  const method = (options.method || 'GET').toUpperCase();

  // CRITICAL READ-ONLY SAFETY GUARD:
  // Reject any non-GET request outside of the initial login POST
  if (method !== 'GET') {
    const isLoginPost = method === 'POST' && url.toString().endsWith('/sys') && jar.cookies.size === 0;
    if (!isLoginPost) {
      throw new Error(`[CRITICAL SECURITY GUARD] Non-GET request (${method}) to ${url} blocked by Read-Only Rule.`);
    }
  }

  if (isMutatingUrl(url.toString())) {
    console.warn(`[Read-Only Guard] Skipping mutating URL: ${url}`);
    return null;
  }

  const headers = options.headers || {};
  const cookieHeader = jar.getHeader();
  if (cookieHeader) {
    headers['Cookie'] = cookieHeader;
  }
  headers['User-Agent'] = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const res = await fetch(url, {
      ...options,
      headers,
      signal: controller.signal,
      redirect: 'manual'
    });
    jar.update(res);
    return res;
  } finally {
    clearTimeout(id);
  }
}

async function login() {
  console.log(`[Crawler] Logging in to ${origin}/sys as "${MORAWARE_USER}" (Read-Only Authentication)...`);

  // Step 1: Initial GET to verify login page
  const initialRes = await customFetch(`${origin}/sys`, { method: 'GET' });
  await initialRes.text();

  // Step 2: POST credentials to authenticate session
  const params = new URLSearchParams();
  params.append('user', MORAWARE_USER);
  params.append('pwd', MORAWARE_PASS);
  params.append('redirectURL', '/sys');
  params.append('LOGIN', 'Sign In');

  const loginRes = await customFetch(`${origin}/sys`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Referer': `${origin}/sys`
    },
    body: params.toString()
  });

  console.log(`[Crawler] Login HTTP status: ${loginRes.status}`);

  // Follow redirect
  let currentRes = loginRes;
  let currentUrl = `${origin}/sys`;
  while ([301, 302, 303, 307].includes(currentRes.status)) {
    const location = currentRes.headers.get('location');
    if (!location) break;
    currentUrl = new URL(location, origin).href;
    console.log(`[Crawler] Following redirect to: ${currentUrl}`);
    currentRes = await customFetch(currentUrl, { method: 'GET' });
  }

  const landingHtml = await currentRes.text();

  if (landingHtml.includes('Incorrect User Name or Password') || landingHtml.includes('Invalid credentials')) {
    throw new Error('Authentication Failed: Incorrect User Name or Password on ' + origin);
  }

  if (landingHtml.includes('validateLoginVals') && landingHtml.includes('name=\'pwd\'')) {
    throw new Error('Authentication Failed: Returned back to Sign In form.');
  }

  console.log('\x1b[32m[Crawler] Authenticated successfully with Moraware Systemize!\x1b[0m');
  return { landingUrl: currentUrl, landingHtml };
}

function extractFeaturesFromHtml(html, pageUrl) {
  const titleMatch = html.match(/<title>([^<]*)<\/title>/i);
  const title = titleMatch ? titleMatch[1].trim() : 'Unknown';

  const links = new Set();
  const linkRegex = /href=["']([^"']+)["']/gi;
  let match;
  while ((match = linkRegex.exec(html)) !== null) {
    let link = match[1].trim();
    if (link.startsWith('javascript:') || link.startsWith('#') || link.startsWith('mailto:')) continue;
    try {
      const full = new URL(link, pageUrl);
      if (full.origin === origin && full.pathname.startsWith('/sys')) {
        if (!isMutatingUrl(full.href)) {
          links.add(full.href);
        }
      }
    } catch {
      // ignore
    }
  }

  // Extract navigation items & menu tabs
  const menuItems = [];
  const menuRegex = /class=['"][^'"]*menuItem[^'"]*['"][^>]*>([^<]+)<\//gi;
  while ((match = menuRegex.exec(html)) !== null) {
    menuItems.push(match[1].trim());
  }

  // Extract table headers / fields
  const headers = [];
  const thRegex = /<th[^>]*>([\s\S]*?)<\/th>/gi;
  while ((match = thRegex.exec(html)) !== null) {
    const text = match[1].replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ').trim();
    if (text && text.length < 60) headers.push(text);
  }

  // Extract buttons / action controls (for cataloging UI capabilities without executing them)
  const actions = [];
  const btnRegex = /<(?:input\s+type=['"]submit['"]|button)[^>]*value=['"]([^'"]+)['"]/gi;
  while ((match = btnRegex.exec(html)) !== null) {
    actions.push(match[1].trim());
  }
  const btnTextRegex = /<button[^>]*>([\s\S]*?)<\/button>/gi;
  while ((match = btnTextRegex.exec(html)) !== null) {
    const text = match[1].replace(/<[^>]+>/g, ' ').trim();
    if (text && text.length < 50) actions.push(text);
  }

  // Extract form inputs / custom field labels
  const formLabels = [];
  const labelRegex = /<label[^>]*>([\s\S]*?)<\/label>/gi;
  while ((match = labelRegex.exec(html)) !== null) {
    const text = match[1].replace(/<[^>]+>/g, ' ').trim();
    if (text && text.length < 50) formLabels.push(text);
  }

  return {
    title,
    links: Array.from(links),
    menuItems: Array.from(new Set(menuItems)),
    headers: Array.from(new Set(headers)),
    actions: Array.from(new Set(actions)),
    formLabels: Array.from(new Set(formLabels)),
    contentSnippet: html.slice(0, 1200).replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()
  };
}

async function runCrawl() {
  const startTime = Date.now();
  const discovered = new Map();
  const queue = [];

  try {
    const { landingUrl, landingHtml } = await login();
    queue.push(landingUrl);
    discovered.set(landingUrl, extractFeaturesFromHtml(landingHtml, landingUrl));

    // Seed well-known read-only Moraware UI views
    const wellKnownPaths = [
      '/sys',
      '/sys/jobs',
      '/sys/calendar',
      '/sys/accounts',
      '/sys/reports',
      '/sys/settings',
      '/sys/views',
      '/sys/activitytypes',
      '/sys/customfields',
      '/sys/forms',
      '/sys/processes',
      '/sys/users'
    ];

    for (const p of wellKnownPaths) {
      const full = `${origin}${p}`;
      if (!discovered.has(full) && !isMutatingUrl(full)) {
        queue.push(full);
      }
    }

    console.log(`[Crawler] Traversing Moraware UI views (Limit: ${MAX_PAGES} pages, READ-ONLY)...`);

    while (queue.length > 0 && discovered.size < MAX_PAGES) {
      const current = queue.shift();
      if (discovered.has(current)) continue;

      console.log(`[Crawler] [${discovered.size + 1}/${MAX_PAGES}] GET: ${current}`);

      try {
        let res = await customFetch(current, { method: 'GET' });
        if (!res) continue;

        // Follow safe redirect
        while ([301, 302, 303, 307].includes(res.status)) {
          const loc = res.headers.get('location');
          if (!loc) break;
          const redir = new URL(loc, origin).href;
          if (isMutatingUrl(redir)) {
            console.warn(`[Read-Only Guard] Blocked redirect to mutating URL: ${redir}`);
            res = null;
            break;
          }
          res = await customFetch(redir, { method: 'GET' });
          if (!res) break;
        }

        if (!res || !res.ok) {
          continue;
        }

        const html = await res.text();
        const info = extractFeaturesFromHtml(html, current);
        discovered.set(current, info);

        for (const link of info.links) {
          const norm = new URL(link);
          norm.hash = '';
          const normStr = norm.href;
          if (!discovered.has(normStr) && !queue.includes(normStr) && !isMutatingUrl(normStr)) {
            queue.push(normStr);
          }
        }
      } catch (err) {
        console.warn(`[Crawler] Skipping ${current}:`, err.message);
      }
    }

    const durationSec = ((Date.now() - startTime) / 1000).toFixed(1);
    console.log(`\x1b[32m[Crawler] Completed UI crawl in ${durationSec}s. Cataloged ${discovered.size} screens/views.\x1b[0m`);

    const docsDir = path.join(rootDir, 'docs');
    if (!fs.existsSync(docsDir)) fs.mkdirSync(docsDir, { recursive: true });

    // Output JSON
    const reportData = {
      crawlTarget: origin,
      user: MORAWARE_USER,
      completedAt: new Date().toISOString(),
      readOnlyRuleEnforced: true,
      totalPages: discovered.size,
      pages: Object.fromEntries(discovered.entries())
    };

    const jsonPath = path.join(docsDir, 'moraware_crawled_features.json');
    fs.writeFileSync(jsonPath, JSON.stringify(reportData, null, 2), 'utf-8');
    console.log(`[Crawler] Exported UI map to: ${jsonPath}`);

    // Generate Markdown Inventory
    let md = `# Moraware Systemize UI Feature Inventory\n\n`;
    md += `**Target System:** \`${origin}\`  \n`;
    md += `**Execution Date:** ${new Date().toLocaleString()}  \n`;
    md += `**Safety Mode:** Strict Read-Only Enforced (Zero Edits/Mutations)  \n`;
    md += `**Total UI Views Discovered:** ${discovered.size}  \n\n`;
    md += `## Catalog of Discovered UI Views & Modules\n\n`;

    for (const [pageUrl, info] of discovered.entries()) {
      md += `### ${info.title || 'View'}\n`;
      md += `- **URL:** \`${pageUrl}\`\n`;
      if (info.menuItems.length > 0) {
        md += `- **Navigation Items:** ${info.menuItems.join(', ')}\n`;
      }
      if (info.headers.length > 0) {
        md += `- **Table Columns / Data Headers:** ${info.headers.join(', ')}\n`;
      }
      if (info.formLabels.length > 0) {
        md += `- **Form Fields / Labels:** ${info.formLabels.join(', ')}\n`;
      }
      if (info.actions.length > 0) {
        md += `- **Available Actions / Buttons:** ${info.actions.join(', ')}\n`;
      }
      md += `\n`;
    }

    const mdPath = path.join(docsDir, 'moraware_feature_inventory.md');
    fs.writeFileSync(mdPath, md, 'utf-8');
    console.log(`[Crawler] Exported human-readable UI catalog to: ${mdPath}`);

  } catch (err) {
    console.error('\x1b[31m[Crawler Error]\x1b[0m', err.message);
    process.exit(1);
  }
}

runCrawl();

import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { chromium } from '../frontend/node_modules/playwright-core/index.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const distDir = path.join(rootDir, 'frontend', 'dist');

const EDGE_PATH = fs.existsSync('C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe')
  ? 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe'
  : 'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe';

const VIDEOS_DIR = path.join(rootDir, 'videos');
const ONBOARDING_DIR = path.join(VIDEOS_DIR, '01_Master_Onboarding_Walkthrough');
const FEATURES_DIR = path.join(VIDEOS_DIR, '02_Feature_Deep_Dives');

const PORT = 4173;
const BASE_URL = `http://127.0.0.1:${PORT}`;

// 1. Setup Static Web Server for frontend/dist
function startServer() {
  return new Promise((resolve) => {
    const server = http.createServer((req, res) => {
      const cleanUrl = req.url.split('?')[0];
      let filePath = path.join(distDir, cleanUrl === '/' ? 'index.html' : cleanUrl);

      if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
        filePath = path.join(distDir, 'index.html');
      }

      const ext = path.extname(filePath);
      const mimeTypes = {
        '.html': 'text/html',
        '.js': 'application/javascript',
        '.css': 'text/css',
        '.json': 'application/json',
        '.svg': 'image/svg+xml',
        '.png': 'image/png',
        '.jpg': 'image/jpeg',
        '.webp': 'image/webp'
      };

      res.writeHead(200, { 'Content-Type': mimeTypes[ext] || 'application/octet-stream' });
      fs.createReadStream(filePath).pipe(res);
    });

    server.listen(PORT, '127.0.0.1', () => {
      console.log(`🚀 SlabMaster Preview Server active at ${BASE_URL}`);
      resolve(server);
    });
  });
}

// 2. Browser Visual Overlay Helpers
async function setupVisualPointer(page) {
  await page.addInitScript(() => {
    window.addEventListener('DOMContentLoaded', () => {
      // 1. Glowing Mouse Pointer
      const cursor = document.createElement('div');
      cursor.id = 'demo-mouse-cursor';
      cursor.style.cssText = `
        position: fixed;
        top: 0; left: 0;
        width: 24px; height: 24px;
        background: radial-gradient(circle, #3b82f6 0%, #1d4ed8 70%);
        border: 2.5px solid #ffffff;
        border-radius: 50%;
        pointer-events: none;
        z-index: 2147483647;
        transform: translate(-50%, -50%);
        transition: transform 0.08s ease, width 0.1s, height 0.1s;
        box-shadow: 0 0 15px rgba(37, 99, 235, 0.9), 0 2px 5px rgba(0,0,0,0.5);
      `;
      document.body.appendChild(cursor);

      // Track Mouse
      window.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
      });

      // 2. Expanding Click Ripple Animation
      window.addEventListener('mousedown', (e) => {
        cursor.style.transform = 'translate(-50%, -50%) scale(0.8)';
        const ripple = document.createElement('div');
        ripple.style.cssText = `
          position: fixed;
          left: ${e.clientX}px; top: ${e.clientY}px;
          width: 8px; height: 8px;
          border: 3px solid #ef4444;
          border-radius: 50%;
          pointer-events: none;
          z-index: 2147483646;
          transform: translate(-50%, -50%);
          animation: demo-click-ripple 0.65s cubic-bezier(0, 0, 0.2, 1) forwards;
        `;
        document.body.appendChild(ripple);
        setTimeout(() => ripple.remove(), 650);
      });

      window.addEventListener('mouseup', () => {
        cursor.style.transform = 'translate(-50%, -50%) scale(1)';
      });

      // 3. YouTube Chapter Title Banner
      const banner = document.createElement('div');
      banner.id = 'demo-video-banner';
      banner.style.cssText = `
        position: fixed;
        top: 16px;
        left: 50%;
        transform: translateX(-50%);
        z-index: 2147483640;
        background: rgba(15, 23, 42, 0.92);
        backdrop-filter: blur(8px);
        color: #f8fafc;
        padding: 8px 24px;
        border-radius: 9999px;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        font-size: 13.5px;
        font-weight: 700;
        border: 1.5px solid #3b82f6;
        box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.6), 0 0 15px rgba(59, 130, 246, 0.4);
        display: flex;
        align-items: center;
        gap: 12px;
        pointer-events: none;
        transition: all 0.3s ease;
      `;
      banner.innerHTML = `
        <span id="demo-banner-badge" style="background:#2563eb; color:white; padding:2px 10px; border-radius:6px; font-size:11px; text-transform:uppercase; letter-spacing:0.05em; font-weight:800;">SLABMASTER</span>
        <span id="demo-banner-title">Tutorial Overview</span>
      `;
      document.body.appendChild(banner);

      // Keyframes
      const style = document.createElement('style');
      style.innerHTML = `
        @keyframes demo-click-ripple {
          0% { width: 8px; height: 8px; opacity: 1; border-color: #ef4444; border-width: 3.5px; }
          60% { border-color: #3b82f6; }
          100% { width: 64px; height: 64px; opacity: 0; border-color: #10b981; border-width: 1px; }
        }
      `;
      document.head.appendChild(style);
    });
  });
}

async function updateBanner(page, badge, title) {
  await page.evaluate(({ badge, title }) => {
    const badgeEl = document.getElementById('demo-banner-badge');
    const titleEl = document.getElementById('demo-banner-title');
    if (badgeEl) badgeEl.textContent = badge;
    if (titleEl) titleEl.textContent = title;
  }, { badge, title });
  await page.waitForTimeout(600);
}

async function smoothMoveAndClick(page, selectorOrBox, pauseAfter = 800) {
  let box = null;
  try {
    if (typeof selectorOrBox === 'string') {
      const el = page.locator(selectorOrBox).first();
      await el.waitFor({ state: 'visible', timeout: 5000 });
      await el.scrollIntoViewIfNeeded().catch(() => {});
      box = await el.boundingBox();
    } else {
      box = await selectorOrBox.boundingBox();
    }
  } catch (err) {
    console.warn(`    ⚠️ Note: Element not found or timed out: ${selectorOrBox}`);
    return;
  }

  if (box) {
    const targetX = box.x + box.width / 2;
    const targetY = box.y + box.height / 2;
    await page.mouse.move(targetX, targetY, { steps: 20 });
    await page.waitForTimeout(200);
    await page.mouse.down();
    await page.waitForTimeout(120);
    await page.mouse.up();
  }
  await page.waitForTimeout(pauseAfter);
}

async function smoothScroll(page, deltaY, steps = 15) {
  for (let i = 0; i < steps; i++) {
    await page.mouse.wheel(0, deltaY / steps);
    await page.waitForTimeout(40);
  }
  await page.waitForTimeout(400);
}

async function ensureAuthenticated(page) {
  await page.waitForTimeout(800);
  try {
    const bypassBtn = page.locator('button:has-text("Enter Simulator / Demo Mode")').first();
    if (await bypassBtn.count()) {
      await updateBanner(page, 'AUTHENTICATE', 'Entering Super Admin Simulator Mode...');
      await smoothMoveAndClick(page, bypassBtn, 1200);
      await page.waitForTimeout(800);
    }
  } catch (e) {
    // Already in app
  }
}

// 3. Video Generators
async function generateMasterOnboardingVideo(browser) {
  console.log('\n🎬 Recording Video 1: Master Subscriber Onboarding Walkthrough...');
  const finalVideoPath = path.join(ONBOARDING_DIR, 'full_subscriber_setup_walkthrough.webm');
  if (fs.existsSync(finalVideoPath) && fs.statSync(finalVideoPath).size > 500000) {
    const sizeMb = (fs.statSync(finalVideoPath).size / (1024 * 1024)).toFixed(2);
    console.log(`  ⏩ Master Walkthrough already recorded (${sizeMb} MB)`);
    return;
  }
  const tempDir = path.join(ONBOARDING_DIR, '_temp');
  if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true });

  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
    recordVideo: { dir: tempDir, size: { width: 1920, height: 1080 } }
  });

  const page = await context.newPage();
  await setupVisualPointer(page);
  await page.goto(BASE_URL, { waitUntil: 'domcontentloaded' });
  await ensureAuthenticated(page);
  await page.waitForTimeout(1000);

  // STEP 1: Overview
  await updateBanner(page, 'STEP 1', 'Tenant Provisioning & Global Dashboard');
  await page.mouse.move(960, 400, { steps: 15 });
  await page.waitForTimeout(1200);

  // STEP 2: Settings & Regional Facility
  await updateBanner(page, 'STEP 2', 'Configure Regional Operating Facility (ATL Metro Hub)');
  await smoothMoveAndClick(page, 'button:has-text("Settings")', 1000);
  await smoothMoveAndClick(page, 'button:has-text("Regions & Locations")', 1000);
  await smoothScroll(page, 300);
  await page.waitForTimeout(1000);
  await smoothScroll(page, -300);

  // STEP 3: Assignees & Machines
  await updateBanner(page, 'STEP 3', 'Register Machinery (Sawjet Line 1) & Mobile Crews');
  await smoothMoveAndClick(page, 'button:has-text("Job Settings & Activities")', 1000);
  await smoothScroll(page, 400);
  await page.waitForTimeout(1200);
  await smoothScroll(page, -400);

  // STEP 4: Slab Inventory & Barcodes
  await updateBanner(page, 'STEP 4', 'Load Initial Slab Inventory (Calacatta Gold Quartz)');
  await smoothMoveAndClick(page, 'button:has-text("Slab Inventory")', 1200);
  await smoothScroll(page, 450);
  await page.waitForTimeout(1200);
  await smoothScroll(page, -450);

  // STEP 5: Builder Accounts & Hierarchy
  await updateBanner(page, 'STEP 5', 'Builder Hierarchy (Lennar GA ➔ Austin Park ➔ Lot 000036)');
  await smoothMoveAndClick(page, 'button:has-text("Accounts")', 1000);
  // Click Lennar account card
  const lennarRow = page.locator('text=LENNAR HOMES OF GEORGIA').first();
  if (await lennarRow.count()) {
    await smoothMoveAndClick(page, lennarRow, 1200);
    // Click community
    const commRow = page.locator('text=AUSTIN PARK AT HIGHLAND').first();
    if (await commRow.count()) {
      await smoothMoveAndClick(page, commRow, 1200);
      await smoothScroll(page, 300);
      await page.waitForTimeout(800);
      await smoothScroll(page, -300);
    }
  }

  // STEP 6: Jobs & Scheduling
  await updateBanner(page, 'STEP 6', 'Create Work Order SAP-SO-10170 & Schedule Milestones');
  await smoothMoveAndClick(page, 'button:has-text("Jobs")', 1000);
  const jobRow = page.locator('text=SAP-SO-10170').first();
  if (await jobRow.count()) {
    await smoothMoveAndClick(page, jobRow, 1200);
    await smoothScroll(page, 400);
    await page.waitForTimeout(1000);
    await smoothScroll(page, -400);
  }

  // STEP 7: Interactive Production Calendar
  await updateBanner(page, 'STEP 7', 'Visual Production Calendar & Working-Day Lead Times');
  await smoothMoveAndClick(page, 'button:has-text("Calendar")', 1200);
  await smoothScroll(page, 350);
  await page.waitForTimeout(1200);
  await smoothScroll(page, -350);

  // STEP 8: Shop Floor Kiosk
  await updateBanner(page, 'STEP 8', 'Shop Floor Touch Kiosk (CNC Sawjet Line 1 Queue)');
  await smoothMoveAndClick(page, 'button:has-text("Shop Floor")', 1200);
  await page.waitForTimeout(1500);

  // STEP 9: Digital Forms & Sign-off
  await updateBanner(page, 'STEP 9', 'Offline Form Runner & Superintendent Sign-Off');
  await smoothMoveAndClick(page, 'button:has-text("Form Packets")', 1200);
  await smoothScroll(page, 300);
  await page.waitForTimeout(1000);
  await smoothScroll(page, -300);

  // STEP 10: API Keys & Outbound ERP Queue
  await updateBanner(page, 'STEP 10', 'Generate API Tokens & Monitor Outbound ERP Retry Queue');
  await smoothMoveAndClick(page, 'button:has-text("Settings")', 1000);
  await smoothMoveAndClick(page, 'button:has-text("API & ERP Integration")', 1200);
  await smoothScroll(page, 500);
  await page.waitForTimeout(1500);
  await smoothScroll(page, -500);

  // Complete
  await updateBanner(page, 'COMPLETE', 'Subscriber Onboarding Verified & Ready for Production!');
  await page.waitForTimeout(2000);

  const video = page.video();
  await page.close();
  await context.close();
  const rawVideoPath = await video.path();

  if (fs.existsSync(finalVideoPath)) fs.unlinkSync(finalVideoPath);
  fs.renameSync(rawVideoPath, finalVideoPath);
  fs.rmSync(tempDir, { recursive: true, force: true });

  const sizeMb = (fs.statSync(finalVideoPath).size / (1024 * 1024)).toFixed(2);
  console.log(`  ✅ Master Walkthrough Recorded: ${path.basename(finalVideoPath)} (${sizeMb} MB)`);
}

async function generateFeatureVideos(browser) {
  console.log('\n🎬 Recording Video Set 2: Feature Deep Dives...');
  if (!fs.existsSync(FEATURES_DIR)) fs.mkdirSync(FEATURES_DIR, { recursive: true });

  const featureConfigs = [
    {
      filename: '01_builder_hierarchy_accounts_communities.webm',
      badge: 'FEATURE 1',
      title: 'Builder Accounts, Communities & Lots Hierarchy',
      actions: async (page) => {
        await smoothMoveAndClick(page, 'button:has-text("Accounts")', 1000);
        await updateBanner(page, 'FEATURE 1.1', 'National Builder Accounts Master Roster');
        await smoothScroll(page, 350);
        await page.waitForTimeout(1000);
        await smoothScroll(page, -350);

        await updateBanner(page, 'FEATURE 1.2', 'Drill-down: Lennar GA ➔ Subdivision Communities');
        const acc = page.locator('text=LENNAR HOMES OF GEORGIA').first();
        if (await acc.count()) {
          await smoothMoveAndClick(page, acc, 1200);
          const comm = page.locator('text=AUSTIN PARK AT HIGHLAND').first();
          if (await comm.count()) {
            await updateBanner(page, 'FEATURE 1.3', 'Austin Park: Active Lots & Elevation Models');
            await smoothMoveAndClick(page, comm, 1200);
            await smoothScroll(page, 400);
            await page.waitForTimeout(1200);
            await smoothScroll(page, -400);
          }
        }
      }
    },
    {
      filename: '02_jobs_orders_and_scheduling.webm',
      badge: 'FEATURE 2',
      title: 'Jobs, Work Orders & Lead Time Milestones',
      actions: async (page) => {
        await smoothMoveAndClick(page, 'button:has-text("Jobs")', 1000);
        await updateBanner(page, 'FEATURE 2.1', 'Active Jobs Grid with ERP Work Orders');
        await smoothScroll(page, 400);
        await page.waitForTimeout(1000);
        await smoothScroll(page, -400);

        await updateBanner(page, 'FEATURE 2.2', 'Drill-down: Job SAP-SO-10170 Lifecycle Activities');
        const job = page.locator('text=SAP-SO-10170').first();
        if (await job.count()) {
          await smoothMoveAndClick(page, job, 1200);
          await smoothScroll(page, 450);
          await page.waitForTimeout(1200);
          await smoothScroll(page, -450);
        }

        await updateBanner(page, 'FEATURE 2.3', 'Multi-Plant Working-Day Calendar Engine');
        await smoothMoveAndClick(page, 'button:has-text("Calendar")', 1200);
        await smoothScroll(page, 300);
        await page.waitForTimeout(1000);
      }
    },
    {
      filename: '03_slab_inventory_and_remnants.webm',
      badge: 'FEATURE 3',
      title: 'Slab Inventory, Barcode Tracking & Remnant Management',
      actions: async (page) => {
        await smoothMoveAndClick(page, 'button:has-text("Slab Inventory")', 1000);
        await updateBanner(page, 'FEATURE 3.1', 'Live Barcode Inventory & Rack Bin Locations');
        await smoothScroll(page, 350);
        await page.waitForTimeout(1000);
        await smoothScroll(page, -350);

        await updateBanner(page, 'FEATURE 3.2', 'Filter by Material Category (Quartz, Granite)');
        const filterBtn = page.locator('select').first();
        if (await filterBtn.count()) {
          await smoothMoveAndClick(page, filterBtn, 800);
        }
        await smoothScroll(page, 400);
        await page.waitForTimeout(1200);
        await smoothScroll(page, -400);
      }
    },
    {
      filename: '04_purchasing_and_dock_receiving.webm',
      badge: 'FEATURE 4',
      title: 'Purchasing Orders & Dock Receiving Workflow',
      actions: async (page) => {
        await smoothMoveAndClick(page, 'button:has-text("Purchasing")', 1000);
        await updateBanner(page, 'FEATURE 4.1', 'Vendor Purchase Orders & Material Delivery Status');
        await smoothScroll(page, 350);
        await page.waitForTimeout(1000);
        await smoothScroll(page, -350);

        await updateBanner(page, 'FEATURE 4.2', 'One-Click Dock Receiving into Slab Inventory');
        const receiveBtn = page.locator('button:has-text("Receive"), button:has-text("View")').first();
        if (await receiveBtn.count()) {
          await smoothMoveAndClick(page, receiveBtn, 1200);
        }
        await page.waitForTimeout(1000);
      }
    },
    {
      filename: '05_shop_floor_kiosk_stations.webm',
      badge: 'FEATURE 5',
      title: 'Shop Floor Touch Kiosk for Machine Stations',
      actions: async (page) => {
        await smoothMoveAndClick(page, 'button:has-text("Shop Floor")', 1000);
        await updateBanner(page, 'FEATURE 5.1', 'CNC Sawjet Line 1 Queue & Active Cut Timer');
        await page.waitForTimeout(1500);

        await updateBanner(page, 'FEATURE 5.2', 'Switch Machine Stations (CNC Sawjet ➔ Polish)');
        const stationTab = page.locator('button:has-text("Sawjet"), button:has-text("Line")').first();
        if (await stationTab.count()) {
          await smoothMoveAndClick(page, stationTab, 1200);
        }
        await page.waitForTimeout(1200);
      }
    },
    {
      filename: '06_table_matrix_and_offline_forms.webm',
      badge: 'FEATURE 6',
      title: 'Offline Form Runner & Table Matrix Sub-Grids',
      actions: async (page) => {
        await smoothMoveAndClick(page, 'button:has-text("Form Packets")', 1000);
        await updateBanner(page, 'FEATURE 6.1', 'Offline PWA Form Packets & Field Measure Sheets');
        await smoothScroll(page, 350);
        await page.waitForTimeout(1000);
        await smoothScroll(page, -350);

        await updateBanner(page, 'FEATURE 6.2', 'Custom Form Templates & Table Matrix Sub-Grids');
        const tplTab = page.locator('button:has-text("Custom Form Templates")').first();
        if (await tplTab.count()) {
          await smoothMoveAndClick(page, tplTab, 1200);
          await smoothScroll(page, 300);
          await page.waitForTimeout(1000);
          await smoothScroll(page, -300);
        }
        await page.waitForTimeout(1000);
      }
    },
    {
      filename: '07_admin_settings_api_and_erp_queue.webm',
      badge: 'FEATURE 7',
      title: 'Admin Settings, API Keys & Outbound ERP Retry Queue',
      actions: async (page) => {
        await smoothMoveAndClick(page, 'button:has-text("Settings")', 1000);
        await smoothMoveAndClick(page, 'button:has-text("API & ERP Integration")', 1000);
        await updateBanner(page, 'FEATURE 7.1', 'API Token Generator & Scoped Permissions');
        await smoothScroll(page, 300);
        await page.waitForTimeout(1000);

        await updateBanner(page, 'FEATURE 7.2', 'Outbound ERP Retry Queue & Dead-Letter Recovery');
        await smoothScroll(page, 400);
        await page.waitForTimeout(1500);
        await smoothScroll(page, -700);
      }
    }
  ];

  for (const feat of featureConfigs) {
    const finalVideoPath = path.join(FEATURES_DIR, feat.filename);
    if (fs.existsSync(finalVideoPath) && fs.statSync(finalVideoPath).size > 200000) {
      const sizeMb = (fs.statSync(finalVideoPath).size / (1024 * 1024)).toFixed(2);
      console.log(`  ⏩ Skipping already recorded ${feat.badge}: ${feat.filename} (${sizeMb} MB)`);
      continue;
    }

    const tempDir = path.join(FEATURES_DIR, '_temp_' + feat.badge.replace(/\s+/g, '_'));
    if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true });

    const context = await browser.newContext({
      viewport: { width: 1920, height: 1080 },
      recordVideo: { dir: tempDir, size: { width: 1920, height: 1080 } }
    });

    const page = await context.newPage();
    await setupVisualPointer(page);
    await page.goto(BASE_URL, { waitUntil: 'domcontentloaded' });
    await ensureAuthenticated(page);
    await page.waitForTimeout(600);

    await updateBanner(page, feat.badge, feat.title);
    await feat.actions(page);

    await updateBanner(page, feat.badge, `${feat.title} — Verified!`);
    await page.waitForTimeout(1500);

    const video = page.video();
    await page.close();
    await context.close();
    const rawVideoPath = await video.path();

    if (fs.existsSync(finalVideoPath)) fs.unlinkSync(finalVideoPath);
    fs.renameSync(rawVideoPath, finalVideoPath);
    fs.rmSync(tempDir, { recursive: true, force: true });

    const sizeMb = (fs.statSync(finalVideoPath).size / (1024 * 1024)).toFixed(2);
    console.log(`  ✅ Recorded ${feat.badge}: ${feat.filename} (${sizeMb} MB)`);
  }
}

// 4. Generate Master README.md & Voiceover Cue Sheet
function generateVideoDocumentation() {
  console.log('\n🎙️ Generating YouTube Channel Guide & Voiceover Scripts...');

  const readmeContent = `# SlabMaster Video Walkthroughs & YouTube Tutorial Channel Pack

This directory contains high-definition (1080p) screen recordings with visual mouse pointer tracking, ripple click indicators, and dynamic chapter banners. 

These videos are organized to be directly uploaded to YouTube, embedded in the user Help Center, or used with voiceover / audio narration.

---

## Folder Structure

\`\`\`
videos/
├── 01_Master_Onboarding_Walkthrough/
│   ├── full_subscriber_setup_walkthrough.webm
│   └── full_subscriber_setup_walkthrough_transcript.md  (Voiceover script & timestamp cues)
│
├── 02_Feature_Deep_Dives/
│   ├── 01_builder_hierarchy_accounts_communities.webm
│   ├── 02_jobs_orders_and_scheduling.webm
│   ├── 03_slab_inventory_and_remnants.webm
│   ├── 04_purchasing_and_dock_receiving.webm
│   ├── 05_shop_floor_kiosk_stations.webm
│   ├── 06_table_matrix_and_offline_forms.webm
│   ├── 07_admin_settings_api_and_erp_queue.webm
│   └── feature_videos_voiceover_scripts.md              (Individual feature narration scripts)
│
└── README.md                                            (This index)
\`\`\`

---

## 1. Master Onboarding Walkthrough Video

- **File**: [\`01_Master_Onboarding_Walkthrough/full_subscriber_setup_walkthrough.webm\`](./01_Master_Onboarding_Walkthrough/full_subscriber_setup_walkthrough.webm)
- **Voiceover Transcript & Cue Sheet**: [\`01_Master_Onboarding_Walkthrough/full_subscriber_setup_walkthrough_transcript.md\`](./01_Master_Onboarding_Walkthrough/full_subscriber_setup_walkthrough_transcript.md)
- **Description**: Complete end-to-end setup demonstration from Day Zero to first cut and install.

### YouTube Chapter Timestamps & Narration Outline
- \`00:00\` — **Introduction & Dashboard**: Tenant provisioning, logo branding, and multi-tenant isolation.
- \`00:05\` — **Regional Operating Facilities**: Configuring the Atlanta Metro Hub (\`ATL\`), timezones, and company holidays.
- \`00:10\` — **Machinery & Assignees**: Setting up Sawjet Line 1, CNC Routers, Laser Techs, and Install Crews.
- \`00:15\` — **Slab Inventory & Barcodes**: Calacatta Gold Quartz slabs (\`SLB-ATL-2026-0041\`), rack bins, and remnant rules.
- \`00:20\` — **Builder Master Hierarchy**: Lennar Homes GA (\`SAP-CUST-126954\`) ➔ Austin Park (\`SAP-COMM-LNXAUS\`) ➔ Lot 000036 (\`SAP-LOT-LNXAUS-036\`).
- \`00:26\` — **Jobs & Activity Scheduling**: Work order \`SAP-SO-10170\`, slab allocation, and working-day lead time milestones.
- \`00:32\` — **Production Calendar**: 14-day timeline view with non-working day skips and drag-and-drop rescheduling.
- \`00:37\` — **Shop Floor Touch Kiosk**: Machine station queue, cut list timer, and one-tap status advancement.
- \`00:42\` — **Offline PWA Forms**: Table Matrix stone dimensions and superintendent touch signature capture.
- \`00:48\` — **API Keys & Outbound ERP Retry Queue**: Generating tokens (\`sm_live_...\`), progressive backoff retry ladder, and manual dead-letter recovery.

---

## 2. Feature Deep-Dive Videos

| Video File | Feature Covered | Voiceover Outline |
| :--- | :--- | :--- |
| [\`01_builder_hierarchy_accounts_communities.webm\`](./02_Feature_Deep_Dives/01_builder_hierarchy_accounts_communities.webm) | **3-Tier Builder Hierarchy** | Creating Builder Accounts, adding Communities, mapping Lots, and managing superintendent contacts with External ERP IDs. |
| [\`02_jobs_orders_and_scheduling.webm\`](./02_Feature_Deep_Dives/02_jobs_orders_and_scheduling.webm) | **Jobs & Scheduling Engine** | Work orders, 6-phase lifecycle activities (Template ➔ CAD ➔ Sawjet ➔ Polish ➔ Install ➔ QA), and working-day lead times. |
| [\`03_slab_inventory_and_remnants.webm\`](./02_Feature_Deep_Dives/03_slab_inventory_and_remnants.webm) | **Slab Inventory & Remnants** | Barcode serialization, square footage tracking, warehouse rack bins, slab allocation, and automated remnant generation. |
| [\`04_purchasing_and_dock_receiving.webm\`](./02_Feature_Deep_Dives/04_purchasing_and_dock_receiving.webm) | **Purchasing & Dock Receiving** | Vendor PO creation, slab delivery date tracking, and instant 1-click dock receiving into active inventory. |
| [\`05_shop_floor_kiosk_stations.webm\`](./02_Feature_Deep_Dives/05_shop_floor_kiosk_stations.webm) | **Shop Floor Touch Kiosk** | Tablet station queue for CNC Sawjets, active timer tracking, piece cut verification, and one-tap completion. |
| [\`06_table_matrix_and_offline_forms.webm\`](./02_Feature_Deep_Dives/06_table_matrix_and_offline_forms.webm) | **Forms & Table Matrix Sub-Grids** | Offline IndexedDB form runner, room-by-room stone math sub-tables, photo capture, and touch glass stylus signatures. |
| [\`07_admin_settings_api_and_erp_queue.webm\`](./02_Feature_Deep_Dives/07_admin_settings_api_and_erp_queue.webm) | **API & Outbound ERP Retry Queue** | Scoped API token generation, dead-letter monitoring, progressive backoff (1m ➔ 5m ➔ 15m ➔ 1h), and single/batch retry. |

---
*© 2026 SlabMaster | v1.0.0 — Enterprise Countertop Fabrication & Field Dispatch Platform*
`;

  fs.writeFileSync(path.join(VIDEOS_DIR, 'README.md'), readmeContent, 'utf8');

  // Master transcript file
  const transcriptContent = `# Master Subscriber Setup Video: Voiceover Script & Narration Guide

This cue sheet provides the word-for-word spoken narration script timed to match the visual mouse movements and chapter banners in \`full_subscriber_setup_walkthrough.webm\`.

---

### [00:00 - 00:05] Intro & Dashboard
> *"Welcome to SlabMaster. In this walkthrough, we will demonstrate how to set up a brand-new countertop fabrication subscriber account from day zero all the way to live shop floor production and enterprise ERP integration."*

### [00:05 - 00:10] Step 2: Regional Operating Facilities
> *"First, we navigate to Settings and configure our Regional Facilities. Here we set up our primary fabrication hub—the Atlanta Metro Hub, with region code ATL—and establish localized timezones and company holiday schedules."*

### [00:10 - 00:15] Step 3: Registering Machinery & Crews
> *"Next, under Job Settings and Activities, we register our physical cutting stations—like CNC Sawjet Line 1—and our mobile field crews, including digital laser templaters and installation trucks, each with designated schedule colors."*

### [00:15 - 00:20] Step 4: Slab Inventory & Barcodes
> *"In the Slab Inventory module, we load our initial stone catalog. Here we track serialized barcodes like SLB-ATL-2026-0041, recording exact length, width, square footage, warehouse rack bins, and remnant thresholds."*

### [00:20 - 00:26] Step 5: The 3-Tier Builder Hierarchy
> *"Under Accounts, we manage our corporate builders. Notice the 3-tier structure: Lennar Homes GA links directly to the Austin Park subdivision, which contains individual home parcels like Lot 000036, all tagged with enterprise SAP External IDs."*

### [00:26 - 00:32] Step 6: Creating Work Orders & Scheduling
> *"In the Jobs module, we create work order SAP-SO-10170. We allocate our warehouse slabs directly to the job and apply an automated activity pipeline, which calculates working-day lead times for template, CAD, cutting, and installation."*

### [00:32 - 00:37] Step 7: Interactive Production Calendar
> *"On the Production Calendar, activities populate across our shop and field resources. The scheduling engine automatically respects facility shifts and skips non-working holidays."*

### [00:37 - 00:42] Step 8: Shop Floor Touch Kiosk
> *"For machine operators, the Shop Floor Kiosk view provides a high-contrast queue on touch tablets. Operators at Sawjet Line 1 can start cuts, verify barcodes, and advance jobs in one tap."*

### [00:42 - 00:48] Step 9: Offline Forms & Sign-Offs
> *"Field crews use the offline PWA form runner. They can input room-by-room stone specifications using Table Matrix sub-grids and capture builder superintendent signatures directly on glass."*

### [00:48 - 00:55] Step 10: API Keys & Outbound ERP Queue
> *"Finally, in Admin Settings, we generate scoped REST API keys and monitor the Outbound ERP Retry Queue. Failed pushes to SAP S/4HANA automatically follow a progressive backoff ladder with manual retry controls."*
`;

  fs.writeFileSync(path.join(ONBOARDING_DIR, 'full_subscriber_setup_walkthrough_transcript.md'), transcriptContent, 'utf8');

  // Feature transcripts
  const featureTranscripts = `# Feature Deep-Dive Videos: Narration Scripts & YouTube Descriptions

Use these scripts when recording audio commentary or YouTube shorts for each individual feature video.

---

### Video 1: Builder Accounts & Communities Hierarchy (\`01_builder_hierarchy_accounts_communities.webm\`)
> *"In SlabMaster, we replace flat job naming with a true 3-tier builder hierarchy: Builder Account ➔ Subdivision Community ➔ Lot. Every tier maintains its own external ERP identifier, superintendent contacts, and pricing sheets."*

### Video 2: Jobs, Work Orders & Lead Time Milestones (\`02_jobs_orders_and_scheduling.webm\`)
> *"SlabMaster's job engine manages the complete stone lifecycle across 6 milestones: Laser Template, CAD Match, Sawjet Cutting, Edge Polishing, Installation, and Sign-off, with working-day buffer protection."*

### Video 3: Slab Inventory & Remnant Management (\`03_slab_inventory_and_remnants.webm\`)
> *"Track every slab from dock arrival to CNC cut. Slabs feature serialized thermal barcodes, rack bin locations, and automated remnant tracking for pieces exceeding minimum square footage thresholds."*

### Video 4: Purchasing & Dock Receiving (\`04_purchasing_and_dock_receiving.webm\`)
> *"Manage distributor purchase orders with arrival tracking. When a delivery truck arrives at the yard, one click dock-receives bundles directly into available slab inventory."*

### Video 5: Shop Floor Touch Kiosk (\`05_shop_floor_kiosk_stations.webm\`)
> *"Eliminate paper travelers on the shop floor. Tablet kiosks on Sawjet and CNC lines let saw operators verify slab barcodes, start cut timers, and advance piece statuses with big touch targets."*

### Video 6: Table Matrix Sub-Grids & Offline Forms (\`06_table_matrix_and_offline_forms.webm\`)
> *"Field technicians use our offline PWA to fill out multi-column stone configuration sheets with automatic lineal feet and cutout summation, capturing superintendent touch signatures on glass."*

### Video 7: Admin Settings, API Keys & Outbound ERP Queue (\`07_admin_settings_api_and_erp_queue.webm\`)
> *"Generate live REST API tokens for SAP S/4HANA or WBS systems. The Outbound ERP Retry Queue provides progressive exponential backoff and dead-letter recovery for maximum reliability."*
`;

  fs.writeFileSync(path.join(FEATURES_DIR, 'feature_videos_voiceover_scripts.md'), featureTranscripts, 'utf8');
  console.log('✅ Video documentation, YouTube chapter timestamps & voiceover scripts generated!');
}

async function main() {
  console.log('=== SlabMaster Walkthrough Video Recording Pipeline ===');

  if (!fs.existsSync(VIDEOS_DIR)) fs.mkdirSync(VIDEOS_DIR, { recursive: true });
  if (!fs.existsSync(ONBOARDING_DIR)) fs.mkdirSync(ONBOARDING_DIR, { recursive: true });
  if (!fs.existsSync(FEATURES_DIR)) fs.mkdirSync(FEATURES_DIR, { recursive: true });

  const server = await startServer();

  const browser = await chromium.launch({
    executablePath: EDGE_PATH,
    headless: true
  });

  try {
    // 1. Record Master Onboarding Walkthrough Video
    await generateMasterOnboardingVideo(browser);

    // 2. Record 7 Feature Deep Dive Videos
    await generateFeatureVideos(browser);

    // 3. Generate YouTube Transcripts & Cue Sheets
    generateVideoDocumentation();

    console.log('\n🎉 All video recordings and voiceover scripts completed successfully!\n');
  } catch (err) {
    console.error('❌ Error during video recording:', err);
  } finally {
    await browser.close();
    server.close();
  }
}

main().catch(console.error);

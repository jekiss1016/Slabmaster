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

  const videoMeta = [
    {
      dir: ONBOARDING_DIR,
      prefix: 'full_subscriber_setup_walkthrough',
      title: 'Master Subscriber Setup Walkthrough: Voiceover Script & Narration Guide',
      videoFile: 'full_subscriber_setup_walkthrough.webm',
      duration: '01:12 (71.6s)',
      spokenText: `Welcome to SlabMaster. In this walkthrough, we will demonstrate how to configure a brand-new countertop fabrication subscriber tenant from day zero all the way to live shop floor production and enterprise ERP synchronization.

First, we navigate to Settings to configure our primary regional facility. Here, we establish the Atlanta Metro Hub with plant code ATL, set local operating timezones, and configure the company holiday closure schedule.

Next, under Job Settings and Activities, we register our physical cutting machinery, including CNC Sawjet Line 1, as well as our mobile field crews, digital laser templaters, and installation trucks, each color-coded for visual dispatch.

In the Slab Inventory module, we load our initial stone catalog. Here we track serialized barcodes like SLB-ATL-2026-0041, recording exact dimensions, square footage, warehouse rack bins, and remnant threshold rules.

Under Accounts, we manage our corporate builder relationships using a true three-tier hierarchy. Notice how Lennar Homes GA connects directly to the Austin Park subdivision and individual parcels like Lot 000036, all tagged with enterprise SAP External IDs.

Moving to the Jobs module, we create work order SAP-SO-10170. We allocate our warehouse slabs directly to the job and apply an automated activity pipeline, calculating working-day lead times across templating, CAD, sawjet cutting, polishing, and installation.

On the Production Calendar, activities populate across shop and field resources, automatically respecting shift schedules and skipping non-working holidays.

For shop technicians, the Shop Floor Kiosk view delivers a high-contrast touch queue on tablet screens. Operators at Sawjet Line 1 can start cuts, verify barcodes, and advance piece statuses in one tap.

Field installers utilize the offline PWA form runner to record room-by-room stone specifications with dynamic Table Matrix sub-grids, capturing builder superintendent signatures directly on touch glass.

Finally, in Admin Settings, we generate scoped REST API keys and monitor the Outbound ERP Retry Queue, where outbound pushes to SAP S/4HANA utilize progressive exponential backoff with dead-letter recovery controls.

With these ten steps complete, your new subscriber account is fully verified and ready for live production.`,
      cues: [
        { time: '00:00 - 00:07', visual: 'Banner: Tenant Provisioning & Global Dashboard — Enters simulator bypass mode.', line: 'Welcome to SlabMaster. In this walkthrough, we will demonstrate how to configure a brand-new countertop fabrication subscriber tenant from day zero all the way to live shop floor production and enterprise ERP synchronization.' },
        { time: '00:07 - 00:15', visual: 'Banner: Configure Regional Operating Facility (ATL Metro Hub) — Navigates to Settings ➔ Regions & Locations; scrolls operating facilities.', line: 'First, we navigate to Settings to configure our primary regional facility. Here, we establish the Atlanta Metro Hub with plant code ATL, set local operating timezones, and configure the company holiday closure schedule.' },
        { time: '00:15 - 00:22', visual: 'Banner: Register Machinery (Sawjet Line 1) & Mobile Crews — Clicks Job Settings & Activities; scrolls machinery and crew assignees.', line: 'Next, under Job Settings and Activities, we register our physical cutting machinery, including CNC Sawjet Line 1, as well as our mobile field crews, digital laser templaters, and installation trucks, each color-coded for visual dispatch.' },
        { time: '00:22 - 00:29', visual: 'Banner: Load Initial Slab Inventory (Calacatta Gold Quartz) — Clicks Slab Inventory; scrolls serialized slabs and rack locations.', line: 'In the Slab Inventory module, we load our initial stone catalog. Here we track serialized barcodes like SLB-ATL-2026-0041, recording exact dimensions, square footage, warehouse rack bins, and remnant threshold rules.' },
        { time: '00:29 - 00:37', visual: 'Banner: Builder Hierarchy (Lennar GA ➔ Austin Park ➔ Lot 000036) — Clicks Accounts ➔ Lennar GA ➔ Austin Park subdivision.', line: 'Under Accounts, we manage our corporate builder relationships using a true three-tier hierarchy. Notice how Lennar Homes GA connects directly to the Austin Park subdivision and individual parcels like Lot 000036, all tagged with enterprise SAP External IDs.' },
        { time: '00:37 - 00:44', visual: 'Banner: Create Work Order SAP-SO-10170 & Schedule Milestones — Clicks Jobs ➔ SAP-SO-10170 work order card.', line: 'Moving to the Jobs module, we create work order SAP-SO-10170. We allocate our warehouse slabs directly to the job and apply an automated activity pipeline, calculating working-day lead times across templating, CAD, sawjet cutting, polishing, and installation.' },
        { time: '00:44 - 00:51', visual: 'Banner: Visual Production Calendar & Working-Day Lead Times — Clicks Calendar; scrolls 14-day timeline.', line: 'On the Production Calendar, activities populate across shop and field resources, automatically respecting shift schedules and skipping non-working holidays.' },
        { time: '00:51 - 00:58', visual: 'Banner: Shop Floor Touch Kiosk (CNC Sawjet Line 1 Queue) — Clicks Shop Floor Kiosk; displays tablet cut queue.', line: 'For shop technicians, the Shop Floor Kiosk view delivers a high-contrast touch queue on tablet screens. Operators at Sawjet Line 1 can start cuts, verify barcodes, and advance piece statuses in one tap.' },
        { time: '00:58 - 01:05', visual: 'Banner: Offline Form Runner & Superintendent Sign-Off — Clicks Form Packets; scrolls forms library.', line: 'Field installers utilize the offline PWA form runner to record room-by-room stone specifications with dynamic Table Matrix sub-grids, capturing builder superintendent signatures directly on touch glass.' },
        { time: '01:05 - 01:12', visual: 'Banner: Generate API Tokens & Monitor Outbound ERP Retry Queue — Clicks Settings ➔ API & ERP Integration; scrolls dead-letter queue.', line: 'Finally, in Admin Settings, we generate scoped REST API keys and monitor the Outbound ERP Retry Queue, where outbound pushes to SAP S/4HANA utilize progressive exponential backoff with dead-letter recovery controls. With these ten steps complete, your new subscriber account is fully verified and ready for live production.' }
      ],
      ytTitle: 'How to Set Up SlabMaster: Complete Subscriber Onboarding & Enterprise Fabrication Walkthrough',
      ytDesc: 'Complete Day-Zero to Live Production walkthrough for SlabMaster Enterprise Countertop Fabrication Platform.'
    },
    {
      dir: FEATURES_DIR,
      prefix: '01_builder_hierarchy_accounts_communities',
      title: 'Feature Deep-Dive: Builder Accounts, Communities & Lots Hierarchy',
      videoFile: '01_builder_hierarchy_accounts_communities.webm',
      duration: '00:22 (22.3s)',
      spokenText: `In SlabMaster, we organize commercial stone fabrication around a true three-tier builder hierarchy.

Starting from the Accounts dashboard, we see our master roster of national builders, each mapped with corporate ERP customer codes.

Drilling down into Lennar Homes Georgia, we see their active subdivision communities, including Austin Park at Highland.

Within Austin Park, we manage individual home parcels and lot numbers like Lot 000036, each with dedicated elevation models, job site addresses, and superintendent contacts.

This three-tier structure guarantees flawless data alignment between field operations and your central enterprise ERP.`,
      cues: [
        { time: '00:00 - 00:06', visual: 'Banner: National Builder Accounts Master Roster — Clicks Accounts navigation tab.', line: 'In SlabMaster, we organize commercial stone fabrication around a true three-tier builder hierarchy. Starting from the Accounts dashboard, we see our master roster of national builders, each mapped with corporate ERP customer codes.' },
        { time: '00:06 - 00:13', visual: 'Banner: Drill-down: Lennar GA ➔ Subdivision Communities — Clicks Lennar GA account card.', line: 'Drilling down into Lennar Homes Georgia, we see their active subdivision communities, including Austin Park at Highland.' },
        { time: '00:13 - 00:22', visual: 'Banner: Austin Park: Active Lots & Elevation Models — Clicks Austin Park community; scrolls lots grid.', line: 'Within Austin Park, we manage individual home parcels and lot numbers like Lot 000036, each with dedicated elevation models, job site addresses, and superintendent contacts. This three-tier structure guarantees flawless data alignment between field operations and your central enterprise ERP.' }
      ],
      ytTitle: 'SlabMaster 3-Tier Builder Hierarchy: Builder Accounts, Communities & Lots',
      ytDesc: 'Learn how SlabMaster replaces flat customer naming with a structured 3-tier hierarchy for national homebuilders and subdivisions.'
    },
    {
      dir: FEATURES_DIR,
      prefix: '02_jobs_orders_and_scheduling',
      title: 'Feature Deep-Dive: Jobs, Work Orders & Production Scheduling Engine',
      videoFile: '02_jobs_orders_and_scheduling.webm',
      duration: '00:26 (25.7s)',
      spokenText: `The SlabMaster job engine coordinates complex fabrication pipelines with working-day lead time protection.

From the Jobs grid, we monitor active work orders linked directly to SAP sales orders like SAP-SO-10170.

Opening the job detail reveals our six-stage activity lifecycle, sequencing digital laser templating, stone CAD programming, sawjet CNC cutting, edge polishing, field installation, and customer sign-off.

Switching to the Production Calendar, every activity is scheduled across shop machines and mobile crews, automatically skipping plant closure days and contractor holidays.`,
      cues: [
        { time: '00:00 - 00:08', visual: 'Banner: Active Jobs Grid with ERP Work Orders — Clicks Jobs tab; scrolls active work orders list.', line: 'The SlabMaster job engine coordinates complex fabrication pipelines with working-day lead time protection. From the Jobs grid, we monitor active work orders linked directly to SAP sales orders like SAP-SO-10170.' },
        { time: '00:08 - 00:17', visual: 'Banner: Drill-down: Job SAP-SO-10170 Lifecycle Activities — Clicks SAP-SO-10170 work order card.', line: 'Opening the job detail reveals our six-stage activity lifecycle, sequencing digital laser templating, stone CAD programming, sawjet CNC cutting, edge polishing, field installation, and customer sign-off.' },
        { time: '00:17 - 00:26', visual: 'Banner: Multi-Plant Working-Day Calendar Engine — Clicks Calendar tab; scrolls timeline view.', line: 'Switching to the Production Calendar, every activity is scheduled across shop machines and mobile crews, automatically skipping plant closure days and contractor holidays.' }
      ],
      ytTitle: 'SlabMaster Scheduling Engine: 6-Stage Activity Lifecycle & Calendar Dispatch',
      ytDesc: 'Explore how SlabMaster automatically calculates lead times and schedules fabrication activities across multi-plant fabrication facilities.'
    },
    {
      dir: FEATURES_DIR,
      prefix: '03_slab_inventory_and_remnants',
      title: 'Feature Deep-Dive: Slab Inventory, Barcode Tracking & Remnant Management',
      videoFile: '03_slab_inventory_and_remnants.webm',
      duration: '00:19 (19.4s)',
      spokenText: `SlabMaster delivers complete stone visibility with serialized barcode tracking and automated remnant management.

In the Slab Inventory view, every slab is serialized with thermal barcodes, recording precise length, width, total square footage, and warehouse rack bin assignments.

Using the material category filter, we can instantly isolate quartz, granite, or porcelain inventory.

When slabs are allocated and cut on the shop floor, leftover stone exceeding minimum threshold dimensions automatically converts into reusable remnant stock.`,
      cues: [
        { time: '00:00 - 00:07', visual: 'Banner: Live Barcode Inventory & Rack Bin Locations — Clicks Slab Inventory tab; scrolls inventory grid.', line: 'SlabMaster delivers complete stone visibility with serialized barcode tracking and automated remnant management. In the Slab Inventory view, every slab is serialized with thermal barcodes, recording precise length, width, total square footage, and warehouse rack bin assignments.' },
        { time: '00:07 - 00:13', visual: 'Banner: Filter by Material Category (Quartz, Granite) — Selects material category dropdown.', line: 'Using the material category filter, we can instantly isolate quartz, granite, or porcelain inventory.' },
        { time: '00:13 - 00:19', visual: 'Banner: Live Barcode Inventory & Rack Bin Locations — Scrolls filtered results and remnant records.', line: 'When slabs are allocated and cut on the shop floor, leftover stone exceeding minimum threshold dimensions automatically converts into reusable remnant stock.' }
      ],
      ytTitle: 'SlabMaster Slab Inventory & Barcode Remnant Tracking',
      ytDesc: 'Track serialized quartz and granite bundles, print barcode labels, assign warehouse rack bins, and track remnants automatically.'
    },
    {
      dir: FEATURES_DIR,
      prefix: '04_purchasing_and_dock_receiving',
      title: 'Feature Deep-Dive: Purchasing Orders & Dock Receiving Workflow',
      videoFile: '04_purchasing_and_dock_receiving.webm',
      duration: '00:18 (18.3s)',
      spokenText: `Streamline distributor procurement with SlabMaster's Purchasing and Purchase Order module.

Here, purchasing teams track open distributor purchase orders, vendor expected ship dates, and assigned job allocations.

When the delivery truck arrives at the fabrication yard, receiving personnel click Receive to verify bundle contents and barcode tags.

With a single click, slabs are instantly received at the dock and deposited directly into active warehouse inventory.`,
      cues: [
        { time: '00:00 - 00:08', visual: 'Banner: Vendor Purchase Orders & Material Delivery Status — Clicks Purchasing tab; scrolls PO list.', line: 'Streamline distributor procurement with SlabMaster\'s Purchasing and Purchase Order module. Here, purchasing teams track open distributor purchase orders, vendor expected ship dates, and assigned job allocations.' },
        { time: '00:08 - 00:18', visual: 'Banner: One-Click Dock Receiving into Slab Inventory — Clicks Receive / View button.', line: 'When the delivery truck arrives at the fabrication yard, receiving personnel click Receive to verify bundle contents and barcode tags. With a single click, slabs are instantly received at the dock and deposited directly into active warehouse inventory.' }
      ],
      ytTitle: 'SlabMaster Purchasing & One-Click Dock Receiving Workflow',
      ytDesc: 'How to manage vendor purchase orders and receive incoming stone bundles directly into active serialized inventory.'
    },
    {
      dir: FEATURES_DIR,
      prefix: '05_shop_floor_kiosk_stations',
      title: 'Feature Deep-Dive: Shop Floor Touch Kiosk for Machine Stations',
      videoFile: '05_shop_floor_kiosk_stations.webm',
      duration: '00:17 (16.8s)',
      spokenText: `Eliminate paper shop travelers with SlabMaster's touch-optimized Shop Floor Kiosk.

Mounted on tablet displays next to machines like CNC Sawjet Line 1, operators see an uncluttered, high-contrast cutting queue with real-time job timers.

Operators can switch machine stations between sawjets, CNC routers, and edge polish lines.

With large touch targets, technicians can start cuts, scan slab barcodes, and advance piece progress in one tap.`,
      cues: [
        { time: '00:00 - 00:08', visual: 'Banner: CNC Sawjet Line 1 Queue & Active Cut Timer — Clicks Shop Floor Kiosk tab; displays Sawjet Line 1 queue.', line: 'Eliminate paper shop travelers with SlabMaster\'s touch-optimized Shop Floor Kiosk. Mounted on tablet displays next to machines like CNC Sawjet Line 1, operators see an uncluttered, high-contrast cutting queue with real-time job timers.' },
        { time: '00:08 - 00:17', visual: 'Banner: Switch Machine Stations (CNC Sawjet ➔ Polish) — Clicks station tab and advances status.', line: 'Operators can switch machine stations between sawjets, CNC routers, and edge polish lines. With large touch targets, technicians can start cuts, scan slab barcodes, and advance piece progress in one tap.' }
      ],
      ytTitle: 'SlabMaster Shop Floor Touch Kiosk for Sawjet & CNC Operators',
      ytDesc: 'Turn any Android or iPad tablet into a paperless cutting station kiosk with live timers and one-tap advancement.'
    },
    {
      dir: FEATURES_DIR,
      prefix: '06_table_matrix_and_offline_forms',
      title: 'Feature Deep-Dive: Offline Form Runner & Table Matrix Sub-Grids',
      videoFile: '06_table_matrix_and_offline_forms.webm',
      duration: '00:21 (21.4s)',
      spokenText: `Capture complex field data without cellular coverage using SlabMaster's offline PWA form packets.

Form packets bundle field checklists, CAD drawings, and room-by-room stone specification sheets.

Under Custom Form Templates, our Table Matrix sub-grids allow templaters to enter room rows—such as Island and Perimeter—with automatic lineal feet, square footage, and cutout math.

Technicians attach field site photos and capture builder superintendent signatures directly on glass, syncing automatically when connectivity returns.`,
      cues: [
        { time: '00:00 - 00:08', visual: 'Banner: Offline PWA Form Packets & Field Measure Sheets — Clicks Form Packets tab; scrolls packets library.', line: 'Capture complex field data without cellular coverage using SlabMaster\'s offline PWA form packets. Form packets bundle field checklists, CAD drawings, and room-by-room stone specification sheets.' },
        { time: '00:08 - 00:21', visual: 'Banner: Custom Form Templates & Table Matrix Sub-Grids — Clicks Custom Form Templates tab; scrolls room config sheets.', line: 'Under Custom Form Templates, our Table Matrix sub-grids allow templaters to enter room rows—such as Island and Perimeter—with automatic lineal feet, square footage, and cutout math. Technicians attach field site photos and capture builder superintendent signatures directly on glass, syncing automatically when connectivity returns.' }
      ],
      ytTitle: 'SlabMaster Table Matrix Forms: Offline PWA & Digital Signatures',
      ytDesc: 'Discover how field templaters enter room-by-room stone dimensions with automatic column math and capture superintendent touch signatures offline.'
    },
    {
      dir: FEATURES_DIR,
      prefix: '07_admin_settings_api_and_erp_queue',
      title: 'Feature Deep-Dive: Admin Settings, API Keys & Outbound ERP Retry Queue',
      videoFile: '07_admin_settings_api_and_erp_queue.webm',
      duration: '00:19 (18.8s)',
      spokenText: `Enterprise integration in SlabMaster is secure, observable, and resilient.

Under Settings and API Integration, administrators generate live REST API tokens with granular read and write permissions for external SAP S/4HANA systems.

Below, the Outbound ERP Retry Queue provides real-time visibility into outbound sync operations, featuring progressive exponential backoff ladders.

If a destination ERP experiences downtime, dead-letter records can be inspected, diagnosed, and manually retried individually or in batches.`,
      cues: [
        { time: '00:00 - 00:08', visual: 'Banner: API Token Generator & Scoped Permissions — Clicks Settings ➔ API & ERP Integration; scrolls token creator.', line: 'Enterprise integration in SlabMaster is secure, observable, and resilient. Under Settings and API Integration, administrators generate live REST API tokens with granular read and write permissions for external SAP S/4HANA systems.' },
        { time: '00:08 - 00:19', visual: 'Banner: Outbound ERP Retry Queue & Dead-Letter Recovery — Scrolls to Outbound ERP Retry Queue; highlights retry ladder and buttons.', line: 'Below, the Outbound ERP Retry Queue provides real-time visibility into outbound sync operations, featuring progressive exponential backoff ladders. If a destination ERP experiences downtime, dead-letter records can be inspected, diagnosed, and manually retried individually or in batches.' }
      ],
      ytTitle: 'SlabMaster Enterprise API Tokens & Outbound ERP Retry Queue',
      ytDesc: 'How to configure scoped REST API keys and monitor the dead-letter outbound retry queue with SAP S/4HANA.'
    }
  ];

  for (const t of videoMeta) {
    const mdPath = path.join(t.dir, `${t.prefix}_transcript.md`);
    const txtPath = path.join(t.dir, `${t.prefix}_transcript.txt`);

    const cueRows = t.cues.map(c => `| \`${c.time}\` | **${c.visual}** | *"${c.line}"* |`).join('\n');
    const timeSummary = t.cues.map(c => `${c.time.split(' ')[0]} - ${c.visual.split('—')[0].replace(/Banner:/g, '').trim()}`).join('\n');

    const mdContent = `# ${t.title}

- **Video File**: [\`${t.videoFile}\`](./${t.videoFile})
- **Total Duration**: ${t.duration}
- **Plain Text Voiceover**: [\`${t.prefix}_transcript.txt\`](./${t.prefix}_transcript.txt) (Ready for direct copy-paste into ElevenLabs, Descript, Murf, or Speechify)

---

## 🎙️ Clean Voiceover Script (Copy-Paste for Voiceover Tool)

${t.spokenText}

---

## ⏱️ Visual Action Cue Sheet & Timeline Sync

| Timestamp | Visual Action / Banner | Spoken Voiceover Segment |
| :--- | :--- | :--- |
${cueRows}

---

## 📺 YouTube Upload Metadata

- **Suggested Title**: ${t.ytTitle}
- **Description**:
\`\`\`
${t.ytDesc}

TIMESTAMPS:
${timeSummary}

Official Documentation: https://slabmaster.com/docs
\`\`\`
`;

    fs.writeFileSync(mdPath, mdContent, 'utf8');
    fs.writeFileSync(txtPath, t.spokenText + '\n', 'utf8');
    console.log(`  ✅ Written transcript: ${path.relative(VIDEOS_DIR, mdPath)} & .txt`);
  }

  // Combined feature index
  const combinedFeatureMd = `# Feature Deep-Dive Videos: Combined Voiceover Scripts & Index

This master index references all 7 feature deep-dive screen recordings. Individual standalone transcript files (\`.md\` and \`.txt\`) are also saved alongside each video in this directory for direct copy-pasting into your voiceover tool.

---

` + videoMeta.slice(1).map((t, idx) => `### Video ${idx + 1}: ${t.title.replace('Feature Deep-Dive: ', '')} (\`${t.videoFile}\`, ${t.duration})
- **Standalone Guide**: [\`${t.prefix}_transcript.md\`](./${t.prefix}_transcript.md)
- **Plain Text (Copy-Paste)**: [\`${t.prefix}_transcript.txt\`](./${t.prefix}_transcript.txt)

> *"${t.spokenText.replace(/\n\n/g, ' ')}"*
`).join('\n---\n\n') + '\n';

  fs.writeFileSync(path.join(FEATURES_DIR, 'feature_videos_voiceover_scripts.md'), combinedFeatureMd, 'utf8');

  // Master README.md
  const readmeContent = `# SlabMaster Video Walkthroughs & YouTube Tutorial Channel Pack

This directory contains high-definition (1080p) screen recordings with visual mouse pointer tracking, ripple click indicators, dynamic chapter banners, and dedicated voiceover transcripts for each video.

---

## Folder Structure

\`\`\`
videos/
├── 01_Master_Onboarding_Walkthrough/
│   ├── full_subscriber_setup_walkthrough.webm            (Master walkthrough 1080p, 71.6s)
│   ├── full_subscriber_setup_walkthrough_transcript.md   (Time-coded cue sheet & YouTube metadata)
│   └── full_subscriber_setup_walkthrough_transcript.txt  (Plain text voiceover script)
│
├── 02_Feature_Deep_Dives/
│   ├── 01_builder_hierarchy_accounts_communities.webm
│   ├── 01_builder_hierarchy_accounts_communities_transcript.md
│   ├── 01_builder_hierarchy_accounts_communities_transcript.txt
│   ├── 02_jobs_orders_and_scheduling.webm
│   ├── 02_jobs_orders_and_scheduling_transcript.md
│   ├── 02_jobs_orders_and_scheduling_transcript.txt
│   ├── 03_slab_inventory_and_remnants.webm
│   ├── 03_slab_inventory_and_remnants_transcript.md
│   ├── 03_slab_inventory_and_remnants_transcript.txt
│   ├── 04_purchasing_and_dock_receiving.webm
│   ├── 04_purchasing_and_dock_receiving_transcript.md
│   ├── 04_purchasing_and_dock_receiving_transcript.txt
│   ├── 05_shop_floor_kiosk_stations.webm
│   ├── 05_shop_floor_kiosk_stations_transcript.md
│   ├── 05_shop_floor_kiosk_stations_transcript.txt
│   ├── 06_table_matrix_and_offline_forms.webm
│   ├── 06_table_matrix_and_offline_forms_transcript.md
│   ├── 06_table_matrix_and_offline_forms_transcript.txt
│   ├── 07_admin_settings_api_and_erp_queue.webm
│   ├── 07_admin_settings_api_and_erp_queue_transcript.md
│   ├── 07_admin_settings_api_and_erp_queue_transcript.txt
│   └── feature_videos_voiceover_scripts.md              (Combined overview)
│
└── README.md                                            (This index)
\`\`\`

---

## Voiceover & Narration Quick Jump

| Video File | Duration | Formatted Guide (.md) | Voiceover Text (.txt) |
| :--- | :--- | :--- | :--- |
| [\`full_subscriber_setup_walkthrough.webm\`](./01_Master_Onboarding_Walkthrough/full_subscriber_setup_walkthrough.webm) | 71.6s | [\`transcript.md\`](./01_Master_Onboarding_Walkthrough/full_subscriber_setup_walkthrough_transcript.md) | [\`transcript.txt\`](./01_Master_Onboarding_Walkthrough/full_subscriber_setup_walkthrough_transcript.txt) |
| [\`01_builder_hierarchy_accounts_communities.webm\`](./02_Feature_Deep_Dives/01_builder_hierarchy_accounts_communities.webm) | 22.3s | [\`transcript.md\`](./02_Feature_Deep_Dives/01_builder_hierarchy_accounts_communities_transcript.md) | [\`transcript.txt\`](./02_Feature_Deep_Dives/01_builder_hierarchy_accounts_communities_transcript.txt) |
| [\`02_jobs_orders_and_scheduling.webm\`](./02_Feature_Deep_Dives/02_jobs_orders_and_scheduling.webm) | 25.7s | [\`transcript.md\`](./02_Feature_Deep_Dives/02_jobs_orders_and_scheduling_transcript.md) | [\`transcript.txt\`](./02_Feature_Deep_Dives/02_jobs_orders_and_scheduling_transcript.txt) |
| [\`03_slab_inventory_and_remnants.webm\`](./02_Feature_Deep_Dives/03_slab_inventory_and_remnants.webm) | 19.4s | [\`transcript.md\`](./02_Feature_Deep_Dives/03_slab_inventory_and_remnants_transcript.md) | [\`transcript.txt\`](./02_Feature_Deep_Dives/03_slab_inventory_and_remnants_transcript.txt) |
| [\`04_purchasing_and_dock_receiving.webm\`](./02_Feature_Deep_Dives/04_purchasing_and_dock_receiving.webm) | 18.3s | [\`transcript.md\`](./02_Feature_Deep_Dives/04_purchasing_and_dock_receiving_transcript.md) | [\`transcript.txt\`](./02_Feature_Deep_Dives/04_purchasing_and_dock_receiving_transcript.txt) |
| [\`05_shop_floor_kiosk_stations.webm\`](./02_Feature_Deep_Dives/05_shop_floor_kiosk_stations.webm) | 16.8s | [\`transcript.md\`](./02_Feature_Deep_Dives/05_shop_floor_kiosk_stations_transcript.md) | [\`transcript.txt\`](./02_Feature_Deep_Dives/05_shop_floor_kiosk_stations_transcript.txt) |
| [\`06_table_matrix_and_offline_forms.webm\`](./02_Feature_Deep_Dives/06_table_matrix_and_offline_forms.webm) | 21.4s | [\`transcript.md\`](./02_Feature_Deep_Dives/06_table_matrix_and_offline_forms_transcript.md) | [\`transcript.txt\`](./02_Feature_Deep_Dives/06_table_matrix_and_offline_forms_transcript.txt) |
| [\`07_admin_settings_api_and_erp_queue.webm\`](./02_Feature_Deep_Dives/07_admin_settings_api_and_erp_queue.webm) | 18.8s | [\`transcript.md\`](./02_Feature_Deep_Dives/07_admin_settings_api_and_erp_queue_transcript.md) | [\`transcript.txt\`](./02_Feature_Deep_Dives/07_admin_settings_api_and_erp_queue_transcript.txt) |

---
*© 2026 SlabMaster | v1.0.0 — Enterprise Countertop Fabrication & Field Dispatch Platform*
`;

  fs.writeFileSync(path.join(VIDEOS_DIR, 'README.md'), readmeContent, 'utf8');
  console.log('✅ Video documentation, individual transcripts & voiceover text files generated!');
}

async function main() {
  console.log('=== SlabMaster Walkthrough Video Recording Pipeline ===');

  if (!fs.existsSync(VIDEOS_DIR)) fs.mkdirSync(VIDEOS_DIR, { recursive: true });
  if (!fs.existsSync(ONBOARDING_DIR)) fs.mkdirSync(ONBOARDING_DIR, { recursive: true });
  if (!fs.existsSync(FEATURES_DIR)) fs.mkdirSync(FEATURES_DIR, { recursive: true });

  if (process.argv.includes('--only-docs')) {
    generateVideoDocumentation();
    return;
  }

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

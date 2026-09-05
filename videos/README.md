# SlabMaster Video Walkthroughs & YouTube Tutorial Channel Pack

This directory contains high-definition (1080p) screen recordings with visual mouse pointer tracking, ripple click indicators, and dynamic chapter banners. 

These videos are organized to be directly uploaded to YouTube, embedded in the user Help Center, or used with voiceover / audio narration.

---

## Folder Structure

```
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
```

---

## 1. Master Onboarding Walkthrough Video

- **File**: [`01_Master_Onboarding_Walkthrough/full_subscriber_setup_walkthrough.webm`](./01_Master_Onboarding_Walkthrough/full_subscriber_setup_walkthrough.webm)
- **Voiceover Transcript & Cue Sheet**: [`01_Master_Onboarding_Walkthrough/full_subscriber_setup_walkthrough_transcript.md`](./01_Master_Onboarding_Walkthrough/full_subscriber_setup_walkthrough_transcript.md)
- **Description**: Complete end-to-end setup demonstration from Day Zero to first cut and install.

### YouTube Chapter Timestamps & Narration Outline
- `00:00` — **Introduction & Dashboard**: Tenant provisioning, logo branding, and multi-tenant isolation.
- `00:05` — **Regional Operating Facilities**: Configuring the Atlanta Metro Hub (`ATL`), timezones, and company holidays.
- `00:10` — **Machinery & Assignees**: Setting up Sawjet Line 1, CNC Routers, Laser Techs, and Install Crews.
- `00:15` — **Slab Inventory & Barcodes**: Calacatta Gold Quartz slabs (`SLB-ATL-2026-0041`), rack bins, and remnant rules.
- `00:20` — **Builder Master Hierarchy**: Lennar Homes GA (`SAP-CUST-126954`) ➔ Austin Park (`SAP-COMM-LNXAUS`) ➔ Lot 000036 (`SAP-LOT-LNXAUS-036`).
- `00:26` — **Jobs & Activity Scheduling**: Work order `SAP-SO-10170`, slab allocation, and working-day lead time milestones.
- `00:32` — **Production Calendar**: 14-day timeline view with non-working day skips and drag-and-drop rescheduling.
- `00:37` — **Shop Floor Touch Kiosk**: Machine station queue, cut list timer, and one-tap status advancement.
- `00:42` — **Offline PWA Forms**: Table Matrix stone dimensions and superintendent touch signature capture.
- `00:48` — **API Keys & Outbound ERP Retry Queue**: Generating tokens (`sm_live_...`), progressive backoff retry ladder, and manual dead-letter recovery.

---

## 2. Feature Deep-Dive Videos

| Video File | Feature Covered | Voiceover Outline |
| :--- | :--- | :--- |
| [`01_builder_hierarchy_accounts_communities.webm`](./02_Feature_Deep_Dives/01_builder_hierarchy_accounts_communities.webm) | **3-Tier Builder Hierarchy** | Creating Builder Accounts, adding Communities, mapping Lots, and managing superintendent contacts with External ERP IDs. |
| [`02_jobs_orders_and_scheduling.webm`](./02_Feature_Deep_Dives/02_jobs_orders_and_scheduling.webm) | **Jobs & Scheduling Engine** | Work orders, 6-phase lifecycle activities (Template ➔ CAD ➔ Sawjet ➔ Polish ➔ Install ➔ QA), and working-day lead times. |
| [`03_slab_inventory_and_remnants.webm`](./02_Feature_Deep_Dives/03_slab_inventory_and_remnants.webm) | **Slab Inventory & Remnants** | Barcode serialization, square footage tracking, warehouse rack bins, slab allocation, and automated remnant generation. |
| [`04_purchasing_and_dock_receiving.webm`](./02_Feature_Deep_Dives/04_purchasing_and_dock_receiving.webm) | **Purchasing & Dock Receiving** | Vendor PO creation, slab delivery date tracking, and instant 1-click dock receiving into active inventory. |
| [`05_shop_floor_kiosk_stations.webm`](./02_Feature_Deep_Dives/05_shop_floor_kiosk_stations.webm) | **Shop Floor Touch Kiosk** | Tablet station queue for CNC Sawjets, active timer tracking, piece cut verification, and one-tap completion. |
| [`06_table_matrix_and_offline_forms.webm`](./02_Feature_Deep_Dives/06_table_matrix_and_offline_forms.webm) | **Forms & Table Matrix Sub-Grids** | Offline IndexedDB form runner, room-by-room stone math sub-tables, photo capture, and touch glass stylus signatures. |
| [`07_admin_settings_api_and_erp_queue.webm`](./02_Feature_Deep_Dives/07_admin_settings_api_and_erp_queue.webm) | **API & Outbound ERP Retry Queue** | Scoped API token generation, dead-letter monitoring, progressive backoff (1m ➔ 5m ➔ 15m ➔ 1h), and single/batch retry. |

---
*© 2026 SlabMaster | v1.0.0 — Enterprise Countertop Fabrication & Field Dispatch Platform*

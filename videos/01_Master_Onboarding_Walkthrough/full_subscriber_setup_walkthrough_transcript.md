# Master Subscriber Setup Walkthrough: Voiceover Script & Narration Guide

- **Video File**: [`full_subscriber_setup_walkthrough.webm`](./full_subscriber_setup_walkthrough.webm)
- **Total Duration**: 01:12 (71.6s)
- **Plain Text Voiceover**: [`full_subscriber_setup_walkthrough_transcript.txt`](./full_subscriber_setup_walkthrough_transcript.txt) (Ready for direct copy-paste into ElevenLabs, Descript, Murf, or Speechify)

---

## 🎙️ Clean Voiceover Script (Copy-Paste for Voiceover Tool)

Welcome to SlabMaster. In this walkthrough, we will demonstrate how to configure a brand-new countertop fabrication subscriber tenant from day zero all the way to live shop floor production and enterprise ERP synchronization.

First, we navigate to Settings to configure our primary regional facility. Here, we establish the Atlanta Metro Hub with plant code ATL, set local operating timezones, and configure the company holiday closure schedule.

Next, under Job Settings and Activities, we register our physical cutting machinery, including CNC Sawjet Line 1, as well as our mobile field crews, digital laser templaters, and installation trucks, each color-coded for visual dispatch.

In the Slab Inventory module, we load our initial stone catalog. Here we track serialized barcodes like SLB-ATL-2026-0041, recording exact dimensions, square footage, warehouse rack bins, and remnant threshold rules.

Under Accounts, we manage our corporate builder relationships using a true three-tier hierarchy. Notice how Lennar Homes GA connects directly to the Austin Park subdivision and individual parcels like Lot 000036, all tagged with enterprise SAP External IDs.

Moving to the Jobs module, we create work order SAP-SO-10170. We allocate our warehouse slabs directly to the job and apply an automated activity pipeline, calculating working-day lead times across templating, CAD, sawjet cutting, polishing, and installation.

On the Production Calendar, activities populate across shop and field resources, automatically respecting shift schedules and skipping non-working holidays.

For shop technicians, the Shop Floor Kiosk view delivers a high-contrast touch queue on tablet screens. Operators at Sawjet Line 1 can start cuts, verify barcodes, and advance piece statuses in one tap.

Field installers utilize the offline PWA form runner to record room-by-room stone specifications with dynamic Table Matrix sub-grids, capturing builder superintendent signatures directly on touch glass.

Finally, in Admin Settings, we generate scoped REST API keys and monitor the Outbound ERP Retry Queue, where outbound pushes to SAP S/4HANA utilize progressive exponential backoff with dead-letter recovery controls.

With these ten steps complete, your new subscriber account is fully verified and ready for live production.

---

## ⏱️ Visual Action Cue Sheet & Timeline Sync

| Timestamp | Visual Action / Banner | Spoken Voiceover Segment |
| :--- | :--- | :--- |
| `00:00 - 00:07` | **Banner: Tenant Provisioning & Global Dashboard — Enters simulator bypass mode.** | *"Welcome to SlabMaster. In this walkthrough, we will demonstrate how to configure a brand-new countertop fabrication subscriber tenant from day zero all the way to live shop floor production and enterprise ERP synchronization."* |
| `00:07 - 00:15` | **Banner: Configure Regional Operating Facility (ATL Metro Hub) — Navigates to Settings ➔ Regions & Locations; scrolls operating facilities.** | *"First, we navigate to Settings to configure our primary regional facility. Here, we establish the Atlanta Metro Hub with plant code ATL, set local operating timezones, and configure the company holiday closure schedule."* |
| `00:15 - 00:22` | **Banner: Register Machinery (Sawjet Line 1) & Mobile Crews — Clicks Job Settings & Activities; scrolls machinery and crew assignees.** | *"Next, under Job Settings and Activities, we register our physical cutting machinery, including CNC Sawjet Line 1, as well as our mobile field crews, digital laser templaters, and installation trucks, each color-coded for visual dispatch."* |
| `00:22 - 00:29` | **Banner: Load Initial Slab Inventory (Calacatta Gold Quartz) — Clicks Slab Inventory; scrolls serialized slabs and rack locations.** | *"In the Slab Inventory module, we load our initial stone catalog. Here we track serialized barcodes like SLB-ATL-2026-0041, recording exact dimensions, square footage, warehouse rack bins, and remnant threshold rules."* |
| `00:29 - 00:37` | **Banner: Builder Hierarchy (Lennar GA ➔ Austin Park ➔ Lot 000036) — Clicks Accounts ➔ Lennar GA ➔ Austin Park subdivision.** | *"Under Accounts, we manage our corporate builder relationships using a true three-tier hierarchy. Notice how Lennar Homes GA connects directly to the Austin Park subdivision and individual parcels like Lot 000036, all tagged with enterprise SAP External IDs."* |
| `00:37 - 00:44` | **Banner: Create Work Order SAP-SO-10170 & Schedule Milestones — Clicks Jobs ➔ SAP-SO-10170 work order card.** | *"Moving to the Jobs module, we create work order SAP-SO-10170. We allocate our warehouse slabs directly to the job and apply an automated activity pipeline, calculating working-day lead times across templating, CAD, sawjet cutting, polishing, and installation."* |
| `00:44 - 00:51` | **Banner: Visual Production Calendar & Working-Day Lead Times — Clicks Calendar; scrolls 14-day timeline.** | *"On the Production Calendar, activities populate across shop and field resources, automatically respecting shift schedules and skipping non-working holidays."* |
| `00:51 - 00:58` | **Banner: Shop Floor Touch Kiosk (CNC Sawjet Line 1 Queue) — Clicks Shop Floor Kiosk; displays tablet cut queue.** | *"For shop technicians, the Shop Floor Kiosk view delivers a high-contrast touch queue on tablet screens. Operators at Sawjet Line 1 can start cuts, verify barcodes, and advance piece statuses in one tap."* |
| `00:58 - 01:05` | **Banner: Offline Form Runner & Superintendent Sign-Off — Clicks Form Packets; scrolls forms library.** | *"Field installers utilize the offline PWA form runner to record room-by-room stone specifications with dynamic Table Matrix sub-grids, capturing builder superintendent signatures directly on touch glass."* |
| `01:05 - 01:12` | **Banner: Generate API Tokens & Monitor Outbound ERP Retry Queue — Clicks Settings ➔ API & ERP Integration; scrolls dead-letter queue.** | *"Finally, in Admin Settings, we generate scoped REST API keys and monitor the Outbound ERP Retry Queue, where outbound pushes to SAP S/4HANA utilize progressive exponential backoff with dead-letter recovery controls. With these ten steps complete, your new subscriber account is fully verified and ready for live production."* |

---

## 📺 YouTube Upload Metadata

- **Suggested Title**: How to Set Up SlabMaster: Complete Subscriber Onboarding & Enterprise Fabrication Walkthrough
- **Description**:
```
Complete Day-Zero to Live Production walkthrough for SlabMaster Enterprise Countertop Fabrication Platform.

TIMESTAMPS:
00:00 - Tenant Provisioning & Global Dashboard
00:07 - Configure Regional Operating Facility (ATL Metro Hub)
00:15 - Register Machinery (Sawjet Line 1) & Mobile Crews
00:22 - Load Initial Slab Inventory (Calacatta Gold Quartz)
00:29 - Builder Hierarchy (Lennar GA ➔ Austin Park ➔ Lot 000036)
00:37 - Create Work Order SAP-SO-10170 & Schedule Milestones
00:44 - Visual Production Calendar & Working-Day Lead Times
00:51 - Shop Floor Touch Kiosk (CNC Sawjet Line 1 Queue)
00:58 - Offline Form Runner & Superintendent Sign-Off
01:05 - Generate API Tokens & Monitor Outbound ERP Retry Queue

Official Documentation: https://slabmaster.com/docs
```

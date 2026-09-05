# SlabMaster New Subscriber Onboarding Checklist & Initial Setup Guide

This document defines the comprehensive onboarding checklist and step-by-step procedure for setting up a brand-new countertop fabricator or regional enterprise on SlabMaster.

---

# Part 1: New Subscriber Information Checklist

Before initiating tenant provisioning in SlabMaster, the implementation team must gather the following prerequisite assets, credentials, and data points from the subscriber organization.

```
┌──────────────────────────────────────────────────────────────────────────────────┐
│                   NEW SUBSCRIBER PREREQUISITE INFORMATION GATHERING              │
├──────────────────────────────────────────────────────────────────────────────────┤
│ 1. Organization & Security Profile (Tenant Domain, Logo, Entra ID / SSO)        │
│ 2. Regional Facilities & Operating Hours (Fabrication Plants, Timezones)        │
│ 3. Crews, Machines & Assignees (Sawjet Lines, CNCs, Laser Techs, Installers)     │
│ 4. Activity Pipeline & Lead Times (Template ➔ CAD ➔ Saw ➔ Polish ➔ Install)      │
│ 5. Material & Slab Catalog (Colors, Thickness, Bundles, Remnant Rules)           │
│ 6. Builder Accounts, Subdivisions & Lots (Customer Master Data & ERP IDs)        │
│ 7. Forms, QA Checklists & Table Matrix Sheets (Sign-offs, Cutouts, Sinks)       │
│ 8. ERP / SAP Accounting Connection (API Tokens, Webhooks, WBS Mapping)          │
└──────────────────────────────────────────────────────────────────────────────────┘
```

### 1. Organization & Tenant Identity
- [ ] **Subscriber Legal & Display Name**: Full corporate entity name (e.g. `GraniteCraft Fabrication Inc.`).
- [ ] **Custom Domain / Subdomain**: Desired tenant domain (e.g. `granitecraft.com` or `granitecraft.slabmasterapp.com`).
- [ ] **Corporate Branding Assets**:
  - High-resolution SVG / PNG logo (Base64 transparent for dark & light UI modes).
  - Primary corporate hex color (e.g. `#2563eb`).
- [ ] **Identity & Access Management (SSO)**:
  - Auth Mode: `EMAIL_PASSWORD`, `ENTRA_ID`, or `HYBRID`.
  - If Microsoft Entra ID (Azure AD): Entra Tenant ID, Application (Client) ID, and OAuth Secret.
  - Designated Initial Super Admin Email: Primary technical administrator (e.g. `admin@granitecraft.com`).

---

### 2. Regional Fabrication Facilities (Plants)
- [ ] **Region Codes & Names**: e.g. `ATL` (Atlanta Metro Hub), `PHX` (Phoenix Metro Hub).
- [ ] **Physical Plant Addresses**: Street address, city, state, zip for shipping/receiving and GPS center.
- [ ] **Local Timezones**: e.g. `America/New_York`, `America/Phoenix`, `America/Chicago`.
- [ ] **Operational Calendars & Holidays**: Standard workdays (e.g. Mon-Fri 06:00-16:30) and annual company holiday closure schedule.

---

### 3. Fabrication Stations & Field Mobile Crews (Assignees)
- [ ] **Shop Floor Cutting Machinery**:
  - Primary CNC Sawjets (e.g. `Sawjet Line 1 - BACA Robo SawJet`, `Sawjet Line 2`).
  - CNC Routers & Edge Polishers (e.g. `Marmo Meccanica LCV 711`, `Park Industries Titan`).
- [ ] **Field Measurement Personnel**:
  - Dedicated Laser Templating Technicians (e.g. `Crew 1 - Laser Tech (ATL)`).
  - Tablet hardware models (iPad Pro, Surface Pro with Proliner or LT-2D3D Laser).
- [ ] **Installation & Delivery Fleets**:
  - In-house Install Crews (e.g. `Install Crew 4 (ATL)`, 2-person truck).
  - Subcontractor Partner Crews & insurance expiration tracking dates.
  - Warranty & Service Technicians (e.g. `Field Repair Tech - Dave (ATL)`).

---

### 4. Production Activity Pipeline & Sequencing Rules
- [ ] **Lifecycle Activity Steps**: Define standard milestones:
  1. `Digital Laser Template` (Duration: 90 mins, Phase: `TEMPLATE`)
  2. `CAD Engineering & Slab Matching` (Duration: 120 mins, Phase: `ENGINEERING`)
  3. `CNC Sawjet Cutting` (Duration: 180 mins, Phase: `FABRICATION`)
  4. `Edge Polishing & Quality Miter` (Duration: 120 mins, Phase: `FABRICATION`)
  5. `Field Installation & Seaming` (Duration: 240 mins, Phase: `INSTALL`)
  6. `Superintendent Sign-off & QA` (Duration: 45 mins, Phase: `INSPECTION`)
- [ ] **Activity Dependencies & Lead Times**: Minimum working day buffers between steps (e.g., Saw cutting occurs $\ge 2$ business days after Template approval; Install occurs $\ge 3$ business days after Saw cutting).

---

### 5. Material Catalog & Inventory Configuration
- [ ] **Material Categories**: Granite, Quartz, Quartzite, Marble, Porcelain, Solid Surface.
- [ ] **Color & Brand Catalog**: Manufacturer brand names (Cambria, Silestone, Caesarstone, MSI) and color codes.
- [ ] **Standard Slab Dimensions**: Average length, height, square footage (e.g., $126" \times 63" = 55.13\text{ sq ft}$), and thickness (2cm, 3cm).
- [ ] **Remnant Policy**: Minimum square footage threshold for generating reusable warehouse remnants vs. scrap disposal (e.g., $\ge 15\text{ sq ft}$ or $30" \times 30"$).
- [ ] **Warehouse Rack / Bin Locations**: Aisle, Rack, and Bay nomenclature (e.g., `Rack A-04`, `B-12`, `Showroom Staging`).

---

### 6. Customer Master Data (Builder Accounts, Subdivisions & Lots)
- [ ] **Builder Accounts**: Top-level homebuilders or commercial contractors (e.g., Lennar, Pulte, Toll Brothers, Century Communities).
- [ ] **External ERP Account Codes**: SAP Customer ID (KNA1 `KUNNR`, e.g. `SAP-CUST-126954`).
- [ ] **Subdivisions / Communities**: Active neighborhood job sites with superintendent contacts and gate access codes.
- [ ] **Active Lots & Elevation Plans**: Master lot numbers, physical addresses, and floor plan models (e.g., `Plan 4200 - Cambridge Craft`).

---

### 7. Form Packets, QA Checklists & Table Matrix Sheets
- [ ] **Pre-Installation Field Measure Checklists**: Cabinet levelness verified, electricity active, sink on-site.
- [ ] **Custom Attribute Overrides**: Builder-specific required fields (e.g. `Cutout Polish Grade`, `Splash Height: 4-inch vs Full-Height`).
- [ ] **Room Configuration Matrix**: Sub-table column definitions for room-by-room stone accounting (Room Name, Material, Edge Profile, Linear Feet, Sink Cutout Qty).
- [ ] **Builder Sign-Off & Acceptance Document**: Digital sign-off waiver terms and warranty acknowledgment.

---

### 8. ERP / SAP Accounting Integration Credentials
- [ ] **ERP System Type**: SAP S/4HANA, SAP ECC 6.0, NetSuite, QuickBooks Enterprise, or Moraware migration.
- [ ] **External ID Standardization Strategy**: Standard nomenclature for Accounts (`SAP-CUST-...`), Communities (`SAP-COMM-...`), Lots (`SAP-LOT-...`), Jobs (`SAP-SO-...`), and WBS Milestones (`SAP-WBS-...`).
- [ ] **Outbound Webhook Destination URL**: Endpoint to receive CDC completion callbacks and sign-off events.

---

# Part 2: Step-by-Step Initial Setup Guide

Follow this chronological sequence to configure a newly provisioned SlabMaster subscriber tenant from zero to live production.

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                        CHRONOLOGICAL SUBSCRIBER ONBOARDING SEQUENCE                    │
├────────────────────────────────────────────────────────────────────────────────────────┤
│ STEP 1: Tenant Provisioning & Security (Domain, Entra ID SSO, Admin Account)           │
│ STEP 2: Configure Operating Regions, Plants & Calendars                                │
│ STEP 3: Register Fabrication Stations & Field Crews (Assignees)                        │
│ STEP 4: Build Activity Types, Sequencing Dependencies & Lead Times                     │
│ STEP 5: Load Material Catalog & Initial Slab Inventory with Barcodes                   │
│ STEP 6: Setup First Builder Account, Subdivision & Lot Site                            │
│ STEP 7: Configure Table Matrix Sub-Grids & Digital Form Templates                      │
│ STEP 8: Create First Job (Work Order), Allocate Slabs & Schedule Milestones            │
│ STEP 9: Test Shop Floor Kiosk Cut List & Field Mobile Tablet Sign-Off                  │
│ STEP 10: Generate API Tokens & Establish Two-Way ERP Outbound Synchronization          │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

---

### Step 1: Tenant Provisioning & Security Configuration
1. Navigate to the Super Admin provisioning portal or execute backend subscriber onboarding:
   - Enter Company Name: `GraniteCraft Fabrication Inc.`
   - Assign Tenant Domain: `granitecraft.com`
   - Upload transparent company logo (renders in global header and PDF cut tickets).
2. Configure **Authentication Provider**:
   - If using Microsoft Entra ID: Enter `Entra Tenant ID` and `Entra Client ID`. Enable Single Sign-On (SSO).
   - If using Hybrid / Local: Create the initial Subscriber Administrator account (`admin@granitecraft.com`) with a temporary secure credential.
3. Verify the tenant status is set to `ACTIVE`.

---

### Step 2: Configure Operating Regions, Plants & Calendars
1. Open **Settings ➔ Regional Facilities**:
2. Click **+ Add Region**:
   - Region Name: `Atlanta Metro Hub`
   - Region Code: `ATL`
   - Time Zone: `America/New_York`
   - Set as **Default Region**: Yes.
3. Configure **Company Holidays & Work Hours**:
   - Define standard operating hours: `06:30 - 16:00 Monday - Friday`.
   - Add national and company closure holidays (e.g. New Year's Day, Memorial Day, Labor Day, Thanksgiving, Christmas). The SlabMaster auto-scheduler will skip these dates when scheduling job activities.

---

### Step 3: Register Fabrication Stations & Field Crews (Assignees)
1. Open **Settings ➔ Assignees & Crews**:
2. Register shop floor cutting machinery:
   - Machine 1: `Sawjet Line 1 (ATL)` | Color: `#8b5cf6` (Purple) | Station Type: Sawjet.
   - Machine 2: `CNC Router Line 2 (ATL)` | Color: `#ec4899` (Pink) | Station Type: Router.
3. Register field personnel:
   - Template Tech: `Crew 1 - Laser Tech (ATL)` | Color: `#3b82f6` (Blue).
   - Installation Team: `Install Crew 4 (ATL)` | Color: `#10b981` (Emerald).
   - Warranty Service Tech: `Field Repair Tech - Dave (ATL)` | Color: `#f59e0b` (Amber).
4. Assign each crew to their designated regional operating facility (`ATL`).

---

### Step 4: Build Activity Types, Sequencing Dependencies & Lead Times
1. Navigate to **Settings ➔ Activity Types & Pipeline**:
2. Create the core fabrication lifecycle activities:
   - **Template**: Name = `Digital Laser Template` | Phase = `TEMPLATE` | Duration = `90 mins` | Assignee = `Crew 1 - Laser Tech (ATL)`.
   - **CAD Match**: Name = `CAD Programming & Slab Matching` | Phase = `ENGINEERING` | Duration = `120 mins`.
   - **CNC Saw**: Name = `CNC Sawjet Cutting` | Phase = `FABRICATION` | Duration = `180 mins` | Assignee = `Sawjet Line 1 (ATL)`.
   - **Edge Polish**: Name = `Edge Polishing & Quality Miter` | Phase = `FABRICATION` | Duration = `120 mins`.
   - **Field Install**: Name = `Field Installation & Seaming` | Phase = `INSTALL` | Duration = `240 mins` | Assignee = `Install Crew 4 (ATL)`.
   - **Super Sign-off**: Name = `Superintendent Sign-off & QA` | Phase = `INSPECTION` | Duration = `45 mins`.
3. Set **Activity Dependency Rules**:
   - Link `CNC Sawjet Cutting` $\rightarrow$ After `Digital Laser Template` (+2 working days buffer).
   - Link `Field Installation` $\rightarrow$ After `CNC Sawjet Cutting` (+3 working days buffer).
   - Link `Superintendent Sign-off` $\rightarrow$ Same Day as `Field Installation`.

---

### Step 5: Load Material Catalog & Initial Slab Inventory
1. Open the **Slab Inventory** tab.
2. Click **+ Add Material / Slab Batch**:
   - Material Name: `Calacatta Gold Quartz`
   - Material Category: `Quartz`
   - Thickness: `3cm`
   - Finish: `Polished`
   - Standard Slab Size: `126" x 63"` ($55.13\text{ sq ft}$)
   - Supplier / Distributor: `MSI Stone Atlanta`
3. Enter Initial Slabs into the Warehouse:
   - Slab Barcode: `SLB-ATL-2026-0041` | Block / Lot: `LOT-9921` | Location: `Aisle 2 - Rack B-04` | Status: `Available`.
   - Slab Barcode: `SLB-ATL-2026-0099` | Block / Lot: `LOT-9921` | Location: `Aisle 2 - Rack B-05` | Status: `Available`.
   - Slab Barcode: `SLB-ATL-2026-0104` | Block / Lot: `LOT-9922` | Location: `Aisle 3 - Rack C-01` | Status: `Available`.
4. Verify slabs appear in the inventory grid with automated status indicators (`Available`, `Allocated`, `Consumed`).

---

### Step 6: Setup First Builder Account, Subdivision & Lot Site
1. Open the **Accounts** tab:
   - Click **+ New Account**:
     - Account Name: `LENNAR HOMES OF GEORGIA - 126954`
     - External ERP ID: `SAP-CUST-126954`
     - Account Code: `LNXGA`
     - Billing Address: `1000 Holcomb Woods Pkwy, Roswell, GA 30076`
2. Drill into the Account and click **+ Add Subdivision / Community**:
   - Community Name: `AUSTIN PARK AT HIGHLAND (LNXAUS)`
   - External ERP ID: `SAP-COMM-LNXAUS`
   - Site Address: `5420 Austin Park Trail, Cumming, GA 30040`
   - Superintendent: `Robert Johnson` | Phone: `404-555-0199` | Email: `rjohnson@lennar.com`
3. Drill into the Community and click **+ Add Lot**:
   - Lot Number: `000036`
   - External ERP ID: `SAP-LOT-LNXAUS-036`
   - Physical Address: `5436 Austin Park Way`
   - Elevation / Floor Plan: `Plan 4200 - Cambridge Craft`

---

### Step 7: Configure Table Matrix Sub-Grids & Digital Form Templates
1. Open **Settings ➔ Form Templates**:
2. Click **+ Create Template**:
   - Template Name: `Superintendent Pre-Template & Install Sign-Off`
   - Bundle Category: `Field Packet`
   - Offline PWA Compatible: `Enabled`
3. Add Fields & Sub-Grids:
   - Header Section: Job Name, Lot Address, Superintendent Name, Target Install Date.
   - Field Readiness Toggles: Cabinets Level [Yes/No], Power Active [Yes/No], Sinks on Site [Yes/No].
   - **Table Matrix Sub-Grid**: Add `SAP Configuration Sheet (ft_sap_config_sheet)`:
     - Columns: `Room / Area`, `Material Color`, `Edge Profile`, `Splash Ht`, `Cutout Qty`.
     - Default Rows: `Kitchen Perimeter`, `Island Waterfall`, `Master Bath Vanity`.
   - Sign-Off Section: Touch Signature Canvas, Signer Printed Name, Date Stamp.
4. Save and publish template to mobile crews.

---

### Step 8: Create First Job, Allocate Slabs & Schedule Milestones
1. Open the **Jobs** tab and click **+ New Job**:
   - Job Name: `LNXAUS_000036_000_01`
   - External ERP Order ID: `SAP-SO-10170`
   - Link Account: `LENNAR HOMES OF GEORGIA - 126954`
   - Link Community: `AUSTIN PARK AT HIGHLAND (LNXAUS)`
   - Link Lot: `000036`
   - Job Category: `INITIAL_INSTALL`
   - Target Install Date: Select date (e.g. 14 business days out).
2. **Allocate Inventory Slabs**:
   - In Job Detail, select **Material Allocation**:
   - Pick `Calacatta Gold Quartz 3cm` (2 slabs required).
   - Allocate `SLB-ATL-2026-0041` and `SLB-ATL-2026-0099`.
   - Notice status changes in inventory immediately from `Available` $\rightarrow$ `Allocated to Job SAP-SO-10170`.
3. **Generate Scheduled Activities**:
   - Click **Apply Activity Template**:
   - SlabMaster automatically calculates lead times and schedules:
     - `Digital Laser Template` $\rightarrow$ Day 3 (Assigned to Crew 1 - Laser Tech).
     - `CAD Programming` $\rightarrow$ Day 5.
     - `CNC Sawjet Cutting` $\rightarrow$ Day 8 (Assigned to Sawjet Line 1).
     - `Field Installation` $\rightarrow$ Day 13 (Assigned to Install Crew 4).
     - `Superintendent Sign-off` $\rightarrow$ Day 13.
   - All activities populate onto the interactive Gantt Calendar.

---

### Step 9: Test Shop Floor Kiosk Cut List & Field Mobile Tablet Sign-off
1. **Shop Floor Kiosk Simulation**:
   - Open the **Shop Floor** tab (or station tablet at Sawjet Line 1).
   - Filter by station: `Sawjet Line 1 (ATL)`.
   - View `Job SAP-SO-10170` queued up.
   - Click **Start Cut** $\rightarrow$ Timer starts; Slab barcodes `SLB-ATL-2026-0041` / `0099` verified.
   - Click **Complete Cut** $\rightarrow$ Material status changes to `Cut / In Polish`. Activity marked `Complete`.
2. **Field Mobile Tablet Simulation**:
   - Open **Forms** on field tablet (PWA offline mode verified).
   - Open `Superintendent Pre-Template & Install Sign-Off` packet for `Job SAP-SO-10170`.
   - Verify room measurements in the Table Matrix sub-grid.
   - Capture superintendent touch signature directly on glass.
   - Submit form $\rightarrow$ PDF packet automatically generated and attached to Job File history.

---

### Step 10: Generate API Tokens & Establish Outbound ERP Synchronization
1. Open **Settings ➔ API & ERP Integration**:
2. Click **Generate Live API Token**:
   - Name: `SAP S/4HANA Production Bridge`
   - Scopes: `read,write,sync,orders,wbs`
   - Save the secret token (e.g. `sm_live_9f83a1b4c7e28910fedcba45`).
3. Hand the **SAP Developer Pack** (`/api-docs.html`) and **Postman Collection** (`/slabmaster_postman_collection.json`) to the ERP integration team.
4. Test outbound connectivity:
   - Inspect the **Outbound ERP Retry Queue** table in Admin Portal.
   - Verify that completed milestones (`SAP-WBS-10170-TMPL`, `SAP-WBS-10170-SAW`) generate queued payloads with automated progressive backoff (`Immediate ➔ 1m ➔ 5m ➔ 15m ➔ 1h`).
   - Test the **"Retry Now"** manual recovery button on any mock failure items to ensure resilience.

---

### Onboarding Complete!
The subscriber organization is now fully configured with operational multi-plant dispatch, live barcode slab inventory, scheduled production lines, offline mobile sign-offs, and enterprise ERP integration.

# SlabMaster™ Enterprise Platform
# Functional Specification Document (FSD)

**Document Version:** v1.0.0  
**Application Release:** `v1.0.0`  
**Classification:** Enterprise Operational Specification  
**Status:** Approved & Implemented  
**Updated:** September 2026  

---

## 1. Document Overview & Scope

This document specifies the complete functional capabilities, user interactions, business logic, operational workflows, and data relationships within the **SlabMaster™** enterprise fabrication and field management platform.

SlabMaster serves stone fabricators, quartz manufacturers, residential high-volume countertop subcontractors, and commercial millwork providers. It manages the entire lifecycle of stone fabrication from builder sales order ingestion through CAD programming, slab allocation, sawjet cutting, edge finishing, field dispatch, installation, customer sign-off, and bi-directional ERP reconciliation.

---

## 2. User Personas & Role-Based Access Control (RBAC)

SlabMaster enforces strict principle-of-least-privilege role-based access control across all operational modules:

| Role Identifier | Description & Scoping | Accessible Modules & Permissions |
|---|---|---|
| **Global Admin** | Multi-tenant platform superuser; manages all subscriber tenants, global configuration, and system health. | Full read/write access across all tenants, database migrations, and tenant provisioning. |
| **Subscriber Admin** | Tenant enterprise executive; oversees all plants, accounting, API keys, and corporate policies. | Full read/write within tenant: User management, API Key creation, ERP Retry Queue, Billing, Plant setup, Master pricing. |
| **Plant Admin / GM** | Regional manufacturing general manager; oversees a specific plant location (e.g., Phoenix Metro). | Plant calendar, working days, crew rostering, purchasing, inventory receiving, shop floor station oversight, job dispatch. |
| **Estimator / Scheduler** | Production planner; creates builder jobs, sequences milestones, and manages lead times. | Account/Community/Lot management, Job scheduling, Lead-time offset adjustment, Slab allocation, Form packet assignment. |
| **Shop Floor Operator** | Fabrication technician (sawjet operator, CNC programmer, edge polisher, QA inspector). | **Shop Floor Kiosk View**: Scoped station queues, cut list inspection, piece advancement, remnant logging. (Financial data masked). |
| **Field Crew Lead** | In-house installation truck lead; executes physical installation on job sites. | **Mobile Field PWA**: Daily assigned jobs, turn-by-turn navigation, digital form packets, customer sign-off capture, photo upload. |
| **1099 Subcontractor** | External third-party installation trade contractor. | **Scoped Field View**: Assigned jobs only. Strict isolation: Proprietary builder pricing, profit margins, and other crew schedules are invisible. |
| **Read-Only Auditor** | External financial or compliance reviewer. | Read-only inspection of completed jobs, audit logs, sign-offs, and compliance records. |

---

## 3. 3-Tier Builder Hierarchy & Job Order Management

```
┌─────────────────────────────────────────────────────────────┐
│                    BUILDER ACCOUNT                          │
│           (e.g., Lennar - Central Division)                 │
└──────────────────────────────┬──────────────────────────────┘
                               │ 1 : N
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                 COMMUNITY / SUBDIVISION                     │
│               (e.g., Highland Ranch Estates)                │
└──────────────────────────────┬──────────────────────────────┘
                               │ 1 : N
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                    LOT / JOB SITE                           │
│                (e.g., Lot 14 - Block C)                     │
└──────────────────────────────┬──────────────────────────────┘
                               │ 1 : N
                               ▼
┌─────────────────────────────────────────────────────────────┐
│               INSTALLATION WORK ORDER (JOB)                 │
│      (e.g., Kitchen Perimeter & Waterfall Island)           │
└──────────────────────────────┬──────────────────────────────┘
                               │ 1 : N
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                    JOB ACTIVITIES                           │
│   (Template ➔ CAD ➔ Sawjet ➔ Polish ➔ Install ➔ Signoff)   │
└─────────────────────────────────────────────────────────────┘
```

### 3.1 Builder Accounts (Top Level)
- Represents parent builders, general contractors, or commercial developers.
- Fields: `name`, `external_id` (SAP Customer ID / `KNA1-KUNNR`), `billing_address`, `payment_terms`, `custom_pricing_tier`, `contact_details`.
- Capabilities: Aggregate reporting, master community directory, builder-specific rate cards.

### 3.2 Communities / Subdivisions (Mid Level)
- Represents residential developments, commercial towers, or geographic sub-phases.
- Fields: `name`, `external_id`, `account_id`, `region`, `city`, `state`, `zip_code`, `superintendent_contact`.
- Capabilities: Standard color selections, default edge profiles, community-specific delivery restrictions.

### 3.3 Lots / Job Sites (Parcel Level)
- Represents the physical building address or job parcel.
- Fields: `lot_number`, `block_number`, `street_address`, `external_id`, `community_id`, `target_install_date`, `gate_code`.
- Capabilities: Multi-job container (e.g., Initial Build, Basement Finish, Warranty Remake).

### 3.4 Jobs (Fabrication & Installation Work Orders)
- The fundamental unit of production.
- Fields: `job_name`, `job_number`, `external_id` (SAP Sales Order / `VBAK-VBELN`), `category` (Initial Install, Remake, Warranty, Commercial), `status` (`Active`, `Scheduled`, `In Fabrication`, `Installed`, `Cancelled`), `total_square_feet`.
- Capabilities: Slab reservations, cut ticket generation, milestone sequencing, change order tracking.

### 3.5 Job Activities (Milestone Steps)
- Linear milestone steps required to fulfill the job:
  1. **Laser Template / Measure**
  2. **CAD Programming & Slab Nesting**
  3. **Sawjet CNC Cutting**
  4. **Edge Polishing & Miter Assembly**
  5. **Quality Inspection & Staging**
  6. **Field Installation & Seaming**
  7. **Customer Acceptance & Warranty Sign-Off**
- Fields: `activity_type`, `scheduled_date`, `assigned_crew`, `status` (`Pending`, `In Progress`, `Completed`, `Blocked`), `external_id` (SAP WBS Element / Network Activity).

---

## 4. Auto-Scheduling & Multi-Plant Production Calendar

### 4.1 Operating Calendars & Lead-Time Calculation
- **Plant-Specific Work Schedules:** Supports 5-day (Mon–Fri), 4-day (Mon–Thu 10hr), or custom operating shifts per manufacturing plant.
- **Holiday & Maintenance Blackouts:** System skips scheduled plant shutdown dates when auto-calculating milestone dates.
- **Lead-Time Offsets:** Backward and forward milestone date calculation:
  $$\text{Template Date} = \text{Target Install Date} - \sum (\text{Working Days for CAD, Cutting, Polish, QC})$$
- **Time Zone Intelligence:** Native UTC normalization with automated conversion to plant-local time zones (EST, CST, MST, PST) respecting Daylight Saving Time.

### 4.2 14-Day Visual Dispatch Board
- Matrix view displaying trucks and crews on the vertical axis and chronological dates across the horizontal axis.
- Real-time drag-and-drop rescheduling with automatic working-day validation.
- Over-allocation warning badges when crew square footage exceeds calibrated daily truck capacity.

---

## 5. Slab & Remnant Inventory Management

### 5.1 Slab Lifecycle Tracking
Every stone bundle and individual slab is tracked through discrete lifecycle states:
- `AVAILABLE`: Ready for layout and job nesting.
- `RESERVED`: Allocated to a scheduled work order.
- `IN_PRODUCTION`: Active on the sawjet cutting table.
- `REMNANT`: Offcut returned from the sawjet with measured dimensions.
- `CONSUMED`: Fully cut into finished parts.
- `DAMAGED`: Quarantined due to natural fissures, transport breakage, or cutting error.

### 5.2 Slab Metadata & Barcode Engine
- **Attributes:** Material name, stone type (Granite, Quartz, Marble, Porcelain), supplier, bundle number, slab number, dimensions (length $\times$ width in inches), thickness (2cm, 3cm), lot number, bin/rack location, acquisition cost, square footage.
- **QR / Barcode Printing:** Generates high-contrast thermal printable labels containing QR codes encoding slab UUID and external ID for instant tablet scanning.
- **Remnant Offcut Capture:** When a slab is cut, remaining usable pieces $\ge 24'' \times 24''$ are assigned remnant IDs, labeled, and placed in remnant racks for vanity jobs.

---

## 6. Purchasing & Direct Materials Management

### 6.1 Purchase Order Lifecycle
- **PO Creation:** Issue POs to stone distributors (e.g., Cosentino, Caesarstone, Arizona Tile, Daltile).
- **Line Items:** Bundle specifications, requested slab quantities, slab finish (Polished, Honed, Leathered), unit cost, expected delivery date.
- **PO Statuses:** `DRAFT` ➔ `SUBMITTED` ➔ `PARTIAL_RECEIVED` ➔ `RECEIVED` ➔ `CLOSED`.

### 6.2 Receiving & Inventory Ingestion
- **One-Click Receiving:** Warehouse staff inspect delivered slabs, confirm bundle integrity, record physical dimensions, and click "Receive & Generate Slabs".
- **Automatic Inventory Ingestion:** Automatically provisions slab records in `AVAILABLE` status with assigned bin locations.
- **Cost Reconciliation:** Invoiced costs are matched against purchase orders for financial auditing.

---

## 7. Custom Form Builder & Table Matrix Engine

### 7.1 Field Types & Form Configuration
Allows administrators to design custom digital forms without software engineering:
- Text input, Number, Dropdown select, Multi-select, Date/Time picker, Checkbox toggle, Notes textarea.
- **Digital Signature Pad:** HTML5 canvas touch capture for customer and field lead sign-offs.
- **Photo Upload Attachment:** Camera capture for delivery verification, seam inspection, and damage reporting.

### 7.2 Multi-Column Table Matrix
Supports complex stone trade tabular data collection:
- Columns: Room Location (Kitchen, Primary Bath, Island), Material / Color, Dimensions ($L \times W$), Edge Detail (Eased, Bullnose, Ogee, Miter 2''), Splash Height, Sink Cutout Type (Undermount, Drop-in, Farmhouse), Cooktop Cutout, Quantity.
- Dynamic row addition with real-time calculated total square footage.

### 7.3 Form Packets
- Bundles multiple individual forms into a single dispatch packet (e.g., *Pre-Install Checklist + Table Matrix Cut Sheet + Final Customer Acceptance & Waiver*).
- Form packets are assigned to specific Job Categories (e.g., Residential New Construction vs. Commercial).

---

## 8. Shop Floor Kiosk Application

- **Touchscreen-Optimized Interface:** Designed for 10''–22'' ruggedized tablets and touch monitors mounted at shop workstations.
- **Station-Specific Work Queues:**
  - **Station 1:** Laser Template & Digitizing
  - **Station 2:** CAD Nesting & Programming
  - **Station 3:** CNC Sawjet Cutting
  - **Station 4:** Edge Shaping, Polishing & Mitering
  - **Station 5:** Quality Assurance & Crate Staging
- **One-Tap Advancement:** Operator scans job barcode or taps "Start Station" ➔ "Complete & Advance to Next Station".
- **Real-Time Shop Floor Broadcast:** Shop floor progression instantly updates the office dispatch board and publishes events to the ERP CDC feed.

---

## 9. Field Dispatch & Mobile Offline PWA

- **Progressive Web App (PWA):** Installs directly onto iOS (Safari) and Android (Chrome) devices as a standalone mobile application.
- **Offline Storage Engine:** Service Worker caches application assets, while IndexedDB stores assigned jobs, customer addresses, form templates, and photos.
- **Field Lead Workflows:**
  1. Review daily truck schedule and click address for native Google Maps / Apple Maps navigation.
  2. Inspect job notes, gate codes, and slab layouts.
  3. Execute digital form packets (seam sign-off, plumbing disconnect waiver).
  4. Capture on-site customer signature upon successful installation.
  5. Take completion photos (wide shot, seam closeup, sink mounting).
  6. Tap "Complete Job" — if offline, queued in IndexedDB and synchronized automatically upon cellular reconnection.

---

## 10. Enterprise API & ERP Integration Hub

### 10.1 Admin Portal API Token Management
- Located under **Settings ➔ API & ERP Integration**.
- Allows tenant administrators to generate cryptographically secure API keys (`sm_live_...`).
- Scopes: `READ`, `WRITE`, `ADMIN`, `ERP_SYNC`.
- Features: Instant copy, key revocation, last-used timestamping, and access logging.

### 10.2 Outbound ERP Retry Queue & Dead-Letter Hub
- Captures failed webhook and milestone pushes destined for customer ERP endpoints (SAP S/4HANA, ECC).
- **Progressive Retry Ladder:**
  - Attempt 1: Immediate (0s)
  - Attempt 2: 1 Minute
  - Attempt 3: 5 Minutes
  - Attempt 4: 15 Minutes
  - Attempt 5: 1 Hour
  - Exhausted: Transitions to `FAILED` (Dead-Letter Queue).
- **Manual Admin Recovery:**
  - "Retry Now" on individual failed queue transactions.
  - "Retry All Stuck" batch recovery trigger.
  - Diagnostic error inspection displaying HTTP status codes and endpoint response bodies.

---

## 11. User Help & Integration Documentation

- **In-App Help Center:** Interactive modal with quick-jump cards across all operational modules.
- **Standalone Help Manual (`help.html`):** Complete user guide accessible to all users.
- **SAP Developer Pack (`api-docs.html`):** Interactive REST documentation with ABAP sample code, field mapping matrices, and cURL examples for every endpoint.
- **Official Postman Collection (`slabmaster_postman_collection.json`):** v2.1 collection pre-configured with environment variables and sample payloads.

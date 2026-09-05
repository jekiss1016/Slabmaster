import {
  PrismaClient,
  AuthProvider,
  JobCategory,
  ProcessType,
  JobStatus,
  ActivityStatus,
  UserRole,
  ErpSyncStatus,
} from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding SlabMaster Database with Real-World Moraware Data & SAP External IDs...');

  // 1. Create Subscriber Tenant
  const tenant = await prisma.subscriberTenant.upsert({
    where: { tenantDomain: 'granitecraft.com' },
    update: {},
    create: {
      companyName: 'GraniteCraft Fabrication Inc.',
      tenantDomain: 'granitecraft.com',
      authProvider: AuthProvider.HYBRID,
    },
  });
  console.log(`Tenant created: ${tenant.companyName} (${tenant.id})`);

  // 2. Create Regions (Atlanta Metro & Phoenix Metro)
  const regionATL = await prisma.region.create({
    data: {
      tenantId: tenant.id,
      regionName: 'Atlanta Metro Hub',
      regionCode: 'ATL',
      timeZone: 'America/New_York',
      isDefault: true,
    },
  });

  const regionPHX = await prisma.region.create({
    data: {
      tenantId: tenant.id,
      regionName: 'Phoenix Metro Hub',
      regionCode: 'PHX',
      timeZone: 'America/Phoenix',
      isDefault: false,
    },
  });

  // 3. Create Assignees / Crews
  const laserCrewATL = await prisma.assignee.create({
    data: {
      regionId: regionATL.id,
      name: 'Crew 1 - Laser Tech (ATL)',
      colorHex: '#3b82f6',
      displayOrder: 1,
    },
  });

  const sawjetLineATL = await prisma.assignee.create({
    data: {
      regionId: regionATL.id,
      name: 'Sawjet Line 1 (ATL)',
      colorHex: '#8b5cf6',
      displayOrder: 2,
    },
  });

  const installCrewATL = await prisma.assignee.create({
    data: {
      regionId: regionATL.id,
      name: 'Install Crew 4 (ATL)',
      colorHex: '#10b981',
      displayOrder: 3,
    },
  });

  const fieldRepairTechATL = await prisma.assignee.create({
    data: {
      regionId: regionATL.id,
      name: 'Field Repair Tech - Dave (ATL)',
      colorHex: '#f59e0b',
      displayOrder: 4,
    },
  });

  // 4. Create Activity Types
  const actTypeTemplate = await prisma.activityType.create({
    data: {
      name: 'Digital Laser Template',
      phase: 'TEMPLATE',
      processType: ProcessType.Job,
      colorHex: '#3b82f6',
      defaultStatus: ActivityStatus.Confirmed,
      defaultDuration: 90,
      sequenceOrder: 10,
    },
  });

  const actTypeCAD = await prisma.activityType.create({
    data: {
      name: 'CAD Programming & Slab Matching',
      phase: 'ENGINEERING',
      processType: ProcessType.Job,
      colorHex: '#6366f1',
      defaultStatus: ActivityStatus.Tentative,
      defaultDuration: 120,
      sequenceOrder: 20,
    },
  });

  const actTypeSaw = await prisma.activityType.create({
    data: {
      name: 'CNC Sawjet Cutting',
      phase: 'FABRICATION',
      processType: ProcessType.Job,
      colorHex: '#8b5cf6',
      defaultStatus: ActivityStatus.Tentative,
      defaultDuration: 180,
      sequenceOrder: 30,
    },
  });

  const actTypePolish = await prisma.activityType.create({
    data: {
      name: 'Edge Polishing & Quality Miter',
      phase: 'FABRICATION',
      processType: ProcessType.Job,
      colorHex: '#ec4899',
      defaultStatus: ActivityStatus.Tentative,
      defaultDuration: 120,
      sequenceOrder: 40,
    },
  });

  const actTypeInstall = await prisma.activityType.create({
    data: {
      name: 'Field Installation & Seaming',
      phase: 'INSTALL',
      processType: ProcessType.Job,
      colorHex: '#10b981',
      defaultStatus: ActivityStatus.Tentative,
      defaultDuration: 240,
      sequenceOrder: 50,
    },
  });

  const actTypeSignoff = await prisma.activityType.create({
    data: {
      name: 'Superintendent Sign-off & Quality Inspection',
      phase: 'INSPECTION',
      processType: ProcessType.Job,
      colorHex: '#059669',
      defaultStatus: ActivityStatus.Tentative,
      defaultDuration: 45,
      sequenceOrder: 60,
    },
  });

  const actTypeRepair = await prisma.activityType.create({
    data: {
      name: 'Warranty Field Chip / Seam Repair',
      phase: 'WARRANTY',
      processType: ProcessType.Job,
      colorHex: '#f59e0b',
      defaultStatus: ActivityStatus.Confirmed,
      defaultDuration: 90,
      sequenceOrder: 70,
    },
  });

  // 5. Create Real-World Builder Accounts
  const lennarGA = await prisma.account.create({
    data: {
      tenantId: tenant.id,
      accountName: 'LENNAR HOMES OF GEORGIA - 126954',
      accountCode: 'LNXGA',
      externalId: 'SAP-CUST-126954',
      billingAddress1: '1000 Holcomb Woods Pkwy, Bldg 200',
      billingCity: 'Roswell',
      billingState: 'GA',
      billingZip: '30076',
    },
  });

  const centurySE = await prisma.account.create({
    data: {
      tenantId: tenant.id,
      accountName: 'CENTURY COMMUNITIES SOUTHEAST - 122973',
      accountCode: 'CS2SE',
      externalId: 'SAP-CUST-122973',
      billingAddress1: '3091 Governors Lake Dr, Suite 500',
      billingCity: 'Norcross',
      billingState: 'GA',
      billingZip: '30071',
    },
  });

  const centuryNash = await prisma.account.create({
    data: {
      tenantId: tenant.id,
      accountName: 'CENTURY COMMUNITIES NASHVILLE - 125316',
      accountCode: 'CNAALN',
      externalId: 'SAP-CUST-125316',
      billingAddress1: '61 Century Blvd, Suite 250',
      billingCity: 'Nashville',
      billingState: 'TN',
      billingZip: '37214',
    },
  });

  const dreamFinders = await prisma.account.create({
    data: {
      tenantId: tenant.id,
      accountName: 'DREAM FINDERS HOMES NASHVILLE - 130470',
      accountCode: 'DF41DC',
      externalId: 'SAP-CUST-130470',
      billingAddress1: '1420 Donelson Pike, Suite B-12',
      billingCity: 'Nashville',
      billingState: 'TN',
      billingZip: '37217',
    },
  });

  const perryHomes = await prisma.account.create({
    data: {
      tenantId: tenant.id,
      accountName: 'PERRY HOMES OF FLORIDA LLC - 129495',
      accountCode: 'P2HSPN',
      externalId: 'SAP-CUST-129495',
      billingAddress1: '5200 Belfort Rd, Suite 400',
      billingCity: 'Jacksonville',
      billingState: 'FL',
      billingZip: '32256',
    },
  });

  const tollBrothers = await prisma.account.create({
    data: {
      tenantId: tenant.id,
      accountName: 'TOLL BROTHERS INC - LV - 105870',
      accountCode: 'TOLL-AZ',
      externalId: 'SAP-CUST-105870',
      billingAddress1: '8800 E Gainey Center Dr',
      billingCity: 'Scottsdale',
      billingState: 'AZ',
      billingZip: '85258',
    },
  });

  // 6. Create Communities (Subdivisions)
  const commAustinPark = await prisma.community.create({
    data: {
      tenantId: tenant.id,
      accountId: lennarGA.id,
      regionId: regionATL.id,
      externalId: 'SAP-COMM-LNXAUS',
      communityName: 'AUSTIN PARK AT HIGHLAND (LNXAUS)',
      siteAddress1: '5420 Austin Park Trail',
      siteCity: 'Cumming',
      siteState: 'GA',
      siteZip: '30040',
      superintendentName: 'Robert Johnson',
      superintendentPhone: '404-555-0199',
      superintendentEmail: 'rjohnson@lennar.com',
    },
  });

  const commOldGreenwood = await prisma.community.create({
    data: {
      tenantId: tenant.id,
      accountId: centurySE.id,
      regionId: regionATL.id,
      externalId: 'SAP-COMM-CS2OGG',
      communityName: 'OLD GREENWOOD GLEN (CS2OGG)',
      siteAddress1: '180 Greenwood Lake Crossing',
      siteCity: 'Braselton',
      siteState: 'GA',
      siteZip: '30517',
      superintendentName: 'David Lee',
      superintendentPhone: '770-555-0182',
      superintendentEmail: 'dlee@centurycommunities.com',
    },
  });

  const commAutumnLakes = await prisma.community.create({
    data: {
      tenantId: tenant.id,
      accountId: centuryNash.id,
      regionId: regionATL.id,
      externalId: 'SAP-COMM-CNAALN',
      communityName: 'AUTUMN LAKES NASHVILLE (CNAALN)',
      siteAddress1: '780 Autumn Lakes Dr',
      siteCity: 'Murfreesboro',
      siteState: 'TN',
      siteZip: '37128',
      superintendentName: 'Sarah Jenkins',
      superintendentPhone: '615-555-0211',
      superintendentEmail: 'sjenkins@centurycommunities.com',
    },
  });

  const commDreamCrest = await prisma.community.create({
    data: {
      tenantId: tenant.id,
      accountId: dreamFinders.id,
      regionId: regionATL.id,
      externalId: 'SAP-COMM-DF41DC',
      communityName: 'DREAM CREST (DF41DC)',
      siteAddress1: '2020 Dream Crest Blvd',
      siteCity: 'Franklin',
      siteState: 'TN',
      siteZip: '37064',
      superintendentName: 'Travis Scott',
      superintendentPhone: '615-555-0144',
      superintendentEmail: 'tscott@dreamfinders.com',
    },
  });

  const commStarFarms = await prisma.community.create({
    data: {
      tenantId: tenant.id,
      accountId: perryHomes.id,
      regionId: regionATL.id,
      externalId: 'SAP-COMM-STARFARMS',
      communityName: "STAR FARMS LWR 90'S",
      siteAddress1: '11820 Star Farms Way',
      siteCity: 'Lakewood Ranch',
      siteState: 'FL',
      siteZip: '34211',
      superintendentName: 'Craig Reynolds',
      superintendentPhone: '941-555-0177',
      superintendentEmail: 'creynolds@perryhomes.com',
    },
  });

  const commShadyPines = await prisma.community.create({
    data: {
      tenantId: tenant.id,
      accountId: tollBrothers.id,
      regionId: regionPHX.id,
      externalId: 'ERP-COMM-2001',
      communityName: 'Shady Pines Phase 2',
      siteAddress1: '12000 N 100th St',
      siteCity: 'Scottsdale',
      siteState: 'AZ',
      siteZip: '85260',
      superintendentName: 'John Miller',
      superintendentPhone: '602-555-0199',
      superintendentEmail: 'jmiller@tollbrothers.com',
    },
  });

  // 7. Create Lots
  const lotLennar036 = await prisma.lot.create({
    data: {
      tenantId: tenant.id,
      communityId: commAustinPark.id,
      accountId: lennarGA.id,
      regionId: regionATL.id,
      externalId: 'SAP-LOT-LNXAUS-036',
      lotNumber: '000036',
      streetAddress: '5436 Austin Park Way',
      elevationPlan: 'Plan 4200 - Cambridge Craft',
    },
  });

  const lotCentury069 = await prisma.lot.create({
    data: {
      tenantId: tenant.id,
      communityId: commOldGreenwood.id,
      accountId: centurySE.id,
      regionId: regionATL.id,
      externalId: 'SAP-LOT-CS2OGG-069',
      lotNumber: '000069',
      streetAddress: '1869 Greenwood Ridge',
      elevationPlan: 'Biltmore Craftsman',
    },
  });

  const lotCentury033 = await prisma.lot.create({
    data: {
      tenantId: tenant.id,
      communityId: commAutumnLakes.id,
      accountId: centuryNash.id,
      regionId: regionATL.id,
      externalId: 'SAP-LOT-CNAALN-033',
      lotNumber: '000033',
      streetAddress: '7833 Autumn Lakes Path',
      elevationPlan: 'Somerset Modern Elevation B',
    },
  });

  const lotDreamDC = await prisma.lot.create({
    data: {
      tenantId: tenant.id,
      communityId: commDreamCrest.id,
      accountId: dreamFinders.id,
      regionId: regionATL.id,
      externalId: 'SAP-LOT-DF41DC-001',
      lotNumber: '0000DC',
      streetAddress: '2024 Crested View Court',
      elevationPlan: 'Heritage Luxury Estate',
    },
  });

  const lotPerry1078 = await prisma.lot.create({
    data: {
      tenantId: tenant.id,
      communityId: commStarFarms.id,
      accountId: perryHomes.id,
      regionId: regionATL.id,
      externalId: 'SAP-LOT-STARFARMS-1078',
      lotNumber: '001078',
      streetAddress: '11832 Star Blossom Cir',
      elevationPlan: 'Design 3199 Farmhouse',
    },
  });

  const lotPerry1079 = await prisma.lot.create({
    data: {
      tenantId: tenant.id,
      communityId: commStarFarms.id,
      accountId: perryHomes.id,
      regionId: regionATL.id,
      externalId: 'SAP-LOT-STARFARMS-1079',
      lotNumber: '001079',
      streetAddress: '11836 Star Blossom Cir',
      elevationPlan: 'Design 3199 Coastal',
    },
  });

  const lotToll42 = await prisma.lot.create({
    data: {
      tenantId: tenant.id,
      communityId: commShadyPines.id,
      accountId: tollBrothers.id,
      regionId: regionPHX.id,
      externalId: 'ERP-LOT-42',
      lotNumber: 'Lot 42',
      streetAddress: '104 Willow Way',
      elevationPlan: 'Plan B - Craftsman',
    },
  });

  // 8. Create Jobs (Work Orders)
  const job10170 = await prisma.job.create({
    data: {
      tenantId: tenant.id,
      regionId: regionATL.id,
      accountId: lennarGA.id,
      communityId: commAustinPark.id,
      lotId: lotLennar036.id,
      externalId: 'SAP-SO-10170',
      jobName: 'LNXAUS_000036_000_01',
      jobCategory: JobCategory.INITIAL_INSTALL,
      processType: ProcessType.Job,
      status: JobStatus.Active,
      projectNumber: 'PRJ-10170',
      salesOrderNumber: 'SO-10170-LNX',
      targetInstallDate: new Date('2026-09-18'),
    },
  });

  const job10720 = await prisma.job.create({
    data: {
      tenantId: tenant.id,
      regionId: regionATL.id,
      accountId: centurySE.id,
      communityId: commOldGreenwood.id,
      lotId: lotCentury069.id,
      externalId: 'SAP-SO-10720',
      jobName: 'CS2OGG_000069_000_01',
      jobCategory: JobCategory.INITIAL_INSTALL,
      processType: ProcessType.Job,
      status: JobStatus.Active,
      projectNumber: 'PRJ-10720',
      salesOrderNumber: 'SO-10720-CS2',
      targetInstallDate: new Date('2026-09-19'),
    },
  });

  const job10485 = await prisma.job.create({
    data: {
      tenantId: tenant.id,
      regionId: regionATL.id,
      accountId: centuryNash.id,
      communityId: commAutumnLakes.id,
      lotId: lotCentury033.id,
      externalId: 'SAP-SO-10485',
      jobName: 'CNAALN_000033_000_01',
      jobCategory: JobCategory.INITIAL_INSTALL,
      processType: ProcessType.Job,
      status: JobStatus.Active,
      projectNumber: 'PRJ-10485',
      salesOrderNumber: 'SO-10485-CNA',
      targetInstallDate: new Date('2026-09-21'),
    },
  });

  const job10941 = await prisma.job.create({
    data: {
      tenantId: tenant.id,
      regionId: regionATL.id,
      accountId: dreamFinders.id,
      communityId: commDreamCrest.id,
      lotId: lotDreamDC.id,
      externalId: 'SAP-SO-10941',
      jobName: 'DF41DC_0000DC_000_01',
      jobCategory: JobCategory.INITIAL_INSTALL,
      processType: ProcessType.Job,
      status: JobStatus.Active,
      projectNumber: 'PRJ-10941',
      salesOrderNumber: 'SO-10941-DF4',
      targetInstallDate: new Date('2026-09-22'),
    },
  });

  const job1078 = await prisma.job.create({
    data: {
      tenantId: tenant.id,
      regionId: regionATL.id,
      accountId: perryHomes.id,
      communityId: commStarFarms.id,
      lotId: lotPerry1078.id,
      externalId: 'SAP-SO-1078',
      jobName: 'P2HSPN_001078_000_01',
      jobCategory: JobCategory.INITIAL_INSTALL,
      processType: ProcessType.Job,
      status: JobStatus.Active,
      projectNumber: 'PRJ-1078',
      salesOrderNumber: 'SO-1078-P2H',
      targetInstallDate: new Date('2026-09-24'),
    },
  });

  const job1079 = await prisma.job.create({
    data: {
      tenantId: tenant.id,
      regionId: regionATL.id,
      accountId: perryHomes.id,
      communityId: commStarFarms.id,
      lotId: lotPerry1079.id,
      externalId: 'SAP-SO-1079',
      jobName: 'P2HSPN_001079_000_01',
      jobCategory: JobCategory.REWORK_WARRANTY,
      processType: ProcessType.Job,
      status: JobStatus.Active,
      projectNumber: 'PRJ-1079',
      salesOrderNumber: 'SO-1079-P2H',
      targetInstallDate: new Date('2026-09-25'),
    },
  });

  const jobToll801 = await prisma.job.create({
    data: {
      tenantId: tenant.id,
      regionId: regionPHX.id,
      accountId: tollBrothers.id,
      communityId: commShadyPines.id,
      lotId: lotToll42.id,
      externalId: 'ERP-JOB-801',
      jobName: 'Lot 42 - Primary Kitchen & Bath Countertops',
      jobCategory: JobCategory.INITIAL_INSTALL,
      processType: ProcessType.Job,
      status: JobStatus.Active,
      targetInstallDate: new Date('2026-09-15'),
    },
  });

  // 9. Create Job Activities (WBS Elements per Job)
  // Job 10170 Activities
  await prisma.jobActivity.create({
    data: {
      tenantId: tenant.id,
      jobId: job10170.id,
      activityTypeId: actTypeTemplate.id,
      assigneeId: laserCrewATL.id,
      externalId: 'SAP-WBS-10170-TMPL',
      phase: 'TEMPLATE',
      status: ActivityStatus.Complete,
      startDate: new Date('2026-09-10T08:00:00Z'),
      startTime: '08:00',
      durationMins: 90,
      completedAt: new Date('2026-09-10T09:30:00Z'),
      notes: 'Laser template finalized. Cabinet level confirmed with builder super.',
    },
  });

  await prisma.jobActivity.create({
    data: {
      tenantId: tenant.id,
      jobId: job10170.id,
      activityTypeId: actTypeCAD.id,
      externalId: 'SAP-WBS-10170-CAD',
      phase: 'ENGINEERING',
      status: ActivityStatus.Complete,
      startDate: new Date('2026-09-11T09:00:00Z'),
      durationMins: 120,
      completedAt: new Date('2026-09-11T11:00:00Z'),
      notes: 'CAD slab match approved. DXF exported to Sawjet Line 1.',
    },
  });

  await prisma.jobActivity.create({
    data: {
      tenantId: tenant.id,
      jobId: job10170.id,
      activityTypeId: actTypeSaw.id,
      assigneeId: sawjetLineATL.id,
      externalId: 'SAP-WBS-10170-SAW',
      phase: 'FABRICATION',
      status: ActivityStatus.Confirmed,
      startDate: new Date('2026-09-14T07:30:00Z'),
      startTime: '07:30',
      durationMins: 180,
      notes: 'Scheduled on CNC Sawjet Line 1. Slab SLB-ATL-2026-0099 staged.',
    },
  });

  await prisma.jobActivity.create({
    data: {
      tenantId: tenant.id,
      jobId: job10170.id,
      activityTypeId: actTypePolish.id,
      externalId: 'SAP-WBS-10170-POL',
      phase: 'FABRICATION',
      status: ActivityStatus.Tentative,
      startDate: new Date('2026-09-15T10:00:00Z'),
      durationMins: 120,
    },
  });

  await prisma.jobActivity.create({
    data: {
      tenantId: tenant.id,
      jobId: job10170.id,
      activityTypeId: actTypeInstall.id,
      assigneeId: installCrewATL.id,
      externalId: 'SAP-WBS-10170-INST',
      phase: 'INSTALL',
      status: ActivityStatus.Tentative,
      startDate: new Date('2026-09-18T08:00:00Z'),
      startTime: '08:00',
      durationMins: 240,
    },
  });

  await prisma.jobActivity.create({
    data: {
      tenantId: tenant.id,
      jobId: job10170.id,
      activityTypeId: actTypeSignoff.id,
      externalId: 'SAP-WBS-10170-SIGN',
      phase: 'INSPECTION',
      status: ActivityStatus.Tentative,
      startDate: new Date('2026-09-18T13:00:00Z'),
      durationMins: 45,
    },
  });

  // Job 10720 Activities
  await prisma.jobActivity.create({
    data: {
      tenantId: tenant.id,
      jobId: job10720.id,
      activityTypeId: actTypeTemplate.id,
      assigneeId: laserCrewATL.id,
      externalId: 'SAP-WBS-10720-TMPL',
      phase: 'TEMPLATE',
      status: ActivityStatus.Complete,
      startDate: new Date('2026-09-11T13:00:00Z'),
      durationMins: 90,
      completedAt: new Date('2026-09-11T14:30:00Z'),
    },
  });

  await prisma.jobActivity.create({
    data: {
      tenantId: tenant.id,
      jobId: job10720.id,
      activityTypeId: actTypeSaw.id,
      assigneeId: sawjetLineATL.id,
      externalId: 'SAP-WBS-10720-SAW',
      phase: 'FABRICATION',
      status: ActivityStatus.Confirmed,
      startDate: new Date('2026-09-15T08:00:00Z'),
      durationMins: 180,
    },
  });

  await prisma.jobActivity.create({
    data: {
      tenantId: tenant.id,
      jobId: job10720.id,
      activityTypeId: actTypeInstall.id,
      assigneeId: installCrewATL.id,
      externalId: 'SAP-WBS-10720-INST',
      phase: 'INSTALL',
      status: ActivityStatus.Tentative,
      startDate: new Date('2026-09-19T08:00:00Z'),
      durationMins: 240,
    },
  });

  // Job 10485 Activities
  await prisma.jobActivity.create({
    data: {
      tenantId: tenant.id,
      jobId: job10485.id,
      activityTypeId: actTypeTemplate.id,
      assigneeId: laserCrewATL.id,
      externalId: 'SAP-WBS-10485-TMPL',
      phase: 'TEMPLATE',
      status: ActivityStatus.Tentative,
      startDate: new Date('2026-09-14T09:00:00Z'),
      durationMins: 90,
      notes: 'Superintendent requested morning slot before drywall crew arrives.',
    },
  });

  await prisma.jobActivity.create({
    data: {
      tenantId: tenant.id,
      jobId: job10485.id,
      activityTypeId: actTypeInstall.id,
      assigneeId: installCrewATL.id,
      externalId: 'SAP-WBS-10485-INST',
      phase: 'INSTALL',
      status: ActivityStatus.Tentative,
      startDate: new Date('2026-09-21T08:30:00Z'),
      durationMins: 240,
    },
  });

  // Job 1079 Warranty Activities
  await prisma.jobActivity.create({
    data: {
      tenantId: tenant.id,
      jobId: job1079.id,
      activityTypeId: actTypeRepair.id,
      assigneeId: fieldRepairTechATL.id,
      externalId: 'SAP-WBS-1079-CHIP',
      phase: 'WARRANTY',
      status: ActivityStatus.Confirmed,
      startDate: new Date('2026-09-16T10:00:00Z'),
      startTime: '10:00',
      durationMins: 90,
      notes: 'Master vanity right edge chip filled with color-matched UV resin.',
    },
  });

  // 10. Create Outbound ERP Queue Items (Simulating failed & retried SAP pushes)
  await prisma.erpOutboundQueue.create({
    data: {
      tenantId: tenant.id,
      entityType: 'Job',
      entityId: 'SAP-SO-10170',
      action: 'STATUS_UPDATE',
      payload: JSON.stringify({
        salesOrderNumber: 'SAP-SO-10170',
        workOrderStatus: 'IN_FABRICATION',
        updatedTimestamp: '2026-09-04T19:42:00Z',
        completedPhases: ['TEMPLATE', 'CAD'],
      }),
      destinationUrl: 'https://sap-s4hana.enterprise.com/sap/opu/odata/sap/API_SALES_ORDER_SRV/Orders',
      status: ErpSyncStatus.FAILED,
      attempts: 5,
      maxAttempts: 5,
      lastError: 'HTTP 503: SAP S/4HANA OData Gateway Timeout (RFC_COMMUNICATION_FAILURE)',
    },
  });

  await prisma.erpOutboundQueue.create({
    data: {
      tenantId: tenant.id,
      entityType: 'JobActivity',
      entityId: 'SAP-WBS-10485-TMPL',
      action: 'STATUS_UPDATE',
      payload: JSON.stringify({
        activityId: 'SAP-WBS-10485-TMPL',
        milestone: 'TEMPLATE_SCHEDULED',
        scheduledDate: '2026-09-14T09:00:00Z',
      }),
      destinationUrl: 'https://sap-s4hana.enterprise.com/sap/opu/odata/sap/API_PS_WBS_SRV/Activities',
      status: ErpSyncStatus.RETRYING,
      attempts: 2,
      maxAttempts: 5,
      nextRetryAt: new Date(Date.now() + 15 * 60 * 1000),
      lastError: 'HTTP 500: Lock contention on SAP WBS table PRPS for project PRJ-10485',
    },
  });

  await prisma.erpOutboundQueue.create({
    data: {
      tenantId: tenant.id,
      entityType: 'Job',
      entityId: 'SAP-SO-10720',
      action: 'UPSERT',
      payload: JSON.stringify({
        salesOrderNumber: 'SAP-SO-10720',
        jobName: 'CS2OGG_000069_000_01',
        materialStatus: 'SLAB_ALLOCATED',
      }),
      destinationUrl: 'https://sap-s4hana.enterprise.com/sap/opu/odata/sap/API_SALES_ORDER_SRV/Orders',
      status: ErpSyncStatus.COMPLETED,
      attempts: 1,
      maxAttempts: 5,
    },
  });

  // 11. Create Users (Internal Admin)
  const passwordHash = await bcrypt.hash('Password123!', 10);
  
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@granitecraft.com' },
    update: {},
    create: {
      tenantId: tenant.id,
      email: 'admin@granitecraft.com',
      firstName: 'Sarah',
      lastName: 'Conner',
      isExternal: false,
      role: UserRole.SUBSCRIBER_ADMIN,
      passwordHash,
    },
  });

  await prisma.userRegion.create({
    data: {
      userId: adminUser.id,
      regionId: regionATL.id,
    },
  });

  // 12. Create API Key for SAP Integration
  await prisma.apiKey.create({
    data: {
      tenantId: tenant.id,
      name: 'SAP S/4HANA Production Bridge',
      keyPrefix: 'sm_live_',
      keyHash: await bcrypt.hash('sm_live_9f83a1b4c7e28910fedcba45', 10),
      scopes: 'read,write,sync,orders,wbs',
      isActive: true,
    },
  });

  console.log('Seeding completed successfully with realistic Moraware & SAP records!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

import { PrismaClient, AuthProvider, JobCategory, ProcessType, JobStatus, ActivityStatus, UserRole } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding SlabMaster Database...');

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

  // 2. Create Region
  const regionPHX = await prisma.region.create({
    data: {
      tenantId: tenant.id,
      regionName: 'Phoenix Metro',
      regionCode: 'PHX',
      timeZone: 'America/Phoenix',
    },
  });

  // 3. Create Builder Account
  const tollBrothers = await prisma.account.create({
    data: {
      tenantId: tenant.id,
      accountName: 'Toll Brothers Homes',
      accountCode: 'TOLL-AZ',
      externalId: 'ERP-BLDR-1001',
      billingAddress1: '8800 E Gainey Center Dr',
      billingCity: 'Scottsdale',
      billingState: 'AZ',
      billingZip: '85258',
    },
  });

  // 4. Create Community under Builder Account
  const community = await prisma.community.create({
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

  // 5. Create Lot under Community
  const lot42 = await prisma.lot.create({
    data: {
      tenantId: tenant.id,
      communityId: community.id,
      accountId: tollBrothers.id,
      regionId: regionPHX.id,
      externalId: 'ERP-LOT-42',
      lotNumber: 'Lot 42',
      streetAddress: '104 Willow Way',
      elevationPlan: 'Plan B - Craftsman',
    },
  });

  // 6. Create Jobs under Lot (Initial Install + Rework Warranty)
  const jobInitial = await prisma.job.create({
    data: {
      tenantId: tenant.id,
      regionId: regionPHX.id,
      accountId: tollBrothers.id,
      communityId: community.id,
      lotId: lot42.id,
      externalId: 'ERP-JOB-801',
      jobName: 'Lot 42 - Primary Kitchen & Bath Countertops',
      jobCategory: JobCategory.INITIAL_INSTALL,
      processType: ProcessType.Job,
      status: JobStatus.Active,
      targetInstallDate: new Date('2026-09-15'),
    },
  });

  const jobWarranty = await prisma.job.create({
    data: {
      tenantId: tenant.id,
      regionId: regionPHX.id,
      accountId: tollBrothers.id,
      communityId: community.id,
      lotId: lot42.id,
      externalId: 'ERP-JOB-802',
      jobName: 'Lot 42 - Warranty Chip Repair (Master Vanity)',
      jobCategory: JobCategory.REWORK_WARRANTY,
      processType: ProcessType.Job,
      status: JobStatus.Active,
      targetInstallDate: new Date('2026-09-20'),
    },
  });

  // 7. Create Users (Internal Admin + External Crew Admin)
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
      regionId: regionPHX.id,
    },
  });

  console.log('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

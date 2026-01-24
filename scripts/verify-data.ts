import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function verifyData() {
  console.log('=== Database Verification ===\n');

  const users = await prisma.user.count();
  const caregivers = await prisma.caregiver.count();
  const families = await prisma.family.count();
  const elders = await prisma.elder.count();
  const scheduleItems = await prisma.scheduleItem.count();
  const reviews = await prisma.review.count();
  const events = await prisma.event.count();
  const subscriptions = await prisma.subscription.count();
  const notifications = await prisma.notification.count();
  const messages = await prisma.message.count();
  const careRequests = await prisma.careRequest.count();

  console.log(`Users: ${users}`);
  console.log(`Caregivers: ${caregivers}`);
  console.log(`Families: ${families}`);
  console.log(`Elders: ${elders}`);
  console.log(`Care Requests: ${careRequests}`);
  console.log(`Schedule Items: ${scheduleItems}`);
  console.log(`Reviews: ${reviews}`);
  console.log(`Events: ${events}`);
  console.log(`Subscriptions: ${subscriptions}`);
  console.log(`Notifications: ${notifications}`);
  console.log(`Messages: ${messages}`);

  console.log('\n=== Sample Data ===\n');

  const sampleCaregiver = await prisma.caregiver.findFirst({
    include: {
      user: { select: { email: true } },
      caregiverRegion: true,
      programs: true,
      reviews: true,
      careRequests: {
        include: {
          elder: true,
          family: true,
        }
      }
    }
  });

  if (sampleCaregiver) {
    console.log('Sample Caregiver:');
    console.log(`- Name: ${sampleCaregiver.firstName} ${sampleCaregiver.lastName}`);
    console.log(`- Email: ${sampleCaregiver.user.email}`);
    console.log(`- Region: ${sampleCaregiver.caregiverRegion?.name}`);
    console.log(`- Programs: ${sampleCaregiver.programs.map(p => p.name).join(', ')}`);
    console.log(`- Reviews: ${sampleCaregiver.reviews.length}`);
    console.log(`- Assigned Care Requests: ${sampleCaregiver.careRequests.length}`);
  }

  const sampleFamily = await prisma.family.findFirst({
    include: {
      user: { select: { email: true } },
      elders: {
        include: {
          program: true,
          schedules: true,
        }
      },
      careRequests: {
        include: {
          caregiver: true,
          elder: true,
        }
      }
    }
  });

  if (sampleFamily) {
    console.log('\nSample Family:');
    console.log(`- Name: ${sampleFamily.familyName}`);
    console.log(`- Email: ${sampleFamily.user.email}`);
    console.log(`- Elders: ${sampleFamily.elders.length}`);
    sampleFamily.elders.forEach(elder => {
      console.log(`  - ${elder.firstName} ${elder.lastName} (Program: ${elder.program?.name || 'None'})`);
      console.log(`    - Schedules: ${elder.schedules.length}`);
    });

    console.log(`- Care Requests: ${sampleFamily.careRequests.length}`);
    sampleFamily.careRequests.forEach(cr => {
      console.log(`  - Request for Elder: ${cr.elder.firstName} ${cr.elder.lastName}, Caregiver: ${cr.caregiver.firstName} ${cr.caregiver.lastName}, Status: ${cr.status}`);
    });
  }

  await prisma.$disconnect();
}

verifyData().catch(console.error);

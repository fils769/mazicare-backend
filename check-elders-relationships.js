const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkEldersRelationships() {
  const familyId = 'cmkaxwz4z0017zouwix5ktg82'; // Smith Family
  
  console.log('👵 Checking elders and their caregivers for Smith Family...\n');
  
  // Get all elders for this family with their care requests
  const elders = await prisma.elder.findMany({
    where: { familyId },
    include: {
      careRequests: {
        include: {
          caregiver: { select: { firstName: true, lastName: true } }
        },
        orderBy: { updatedAt: 'desc' }
      }
    }
  });
  
  console.log(`Found ${elders.length} elders for Smith Family:`);
  console.log('===============================================\n');
  
  elders.forEach((elder, index) => {
    console.log(`${index + 1}. ${elder.firstName} ${elder.lastName}`);
    console.log(`   Elder ID: ${elder.id}`);
    
    if (elder.careRequests.length === 0) {
      console.log('   No care requests found');
    } else {
      console.log(`   ${elder.careRequests.length} care request(s):`);
      
      elder.careRequests.forEach((request, reqIndex) => {
        console.log(`   ${reqIndex + 1}. Caregiver: ${request.caregiver?.firstName || 'Unknown'} ${request.caregiver?.lastName || ''}`);
        console.log(`      Status: ${request.status}`);
        console.log(`      Request ID: ${request.id}`);
        console.log(`      Last updated: ${request.updatedAt}`);
      });
    }
    console.log('---\n');
  });
  
  await prisma.$disconnect();
}

checkEldersRelationships().catch(console.error);
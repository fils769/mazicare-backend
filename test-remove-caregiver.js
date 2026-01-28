
// const { PrismaClient } = require('@prisma/client');
// const prisma = new PrismaClient();

// async function getCaregivers() {
//   console.log('📋 Fetching all caregivers...\n');
  
//   const caregivers = await prisma.caregiver.findMany({
//     select: {
//       id: true,
//       firstName: true,
//       lastName: true,
//       email: true,
//       userId: true
//     },
//     take: 10
//   });
  
//   console.log(`Found ${caregivers.length} caregivers:`);
//   console.log('=========================================');
  
//   caregivers.forEach((caregiver, index) => {
//     console.log(`${index + 1}. ID: ${caregiver.id}`);
//     console.log(`   Name: ${caregiver.firstName} ${caregiver.lastName}`);
//     console.log(`   Email: ${caregiver.email}`);
//     console.log(`   User ID: ${caregiver.userId}`);
//     console.log('---');
//   });
  
//   // Also check if there are any active care relationships
//   console.log('\n🔗 Checking active care requests...');
  
//   const activeRequests = await prisma.careRequest.findMany({
//     where: {
//       status: { in: ['PENDING', 'ACCEPTED'] }
//     },
//     include: {
//       caregiver: {
//         select: { id: true, firstName: true, lastName: true }
//       },
//       family: {
//         select: { id: true, familyName: true }
//       },
//       elder: {
//         select: { firstName: true, lastName: true }
//       }
//     },
//     take: 5
//   });
  
//   console.log(`Found ${activeRequests.length} active care requests:`);
//   console.log('===============================================');
  
//   activeRequests.forEach((request, index) => {
//     console.log(`${index + 1}. Request ID: ${request.id}`);
//     console.log(`   Caregiver: ${request.caregiver.firstName} ${request.caregiver.lastName} (ID: ${request.caregiver.id})`);
//     console.log(`   Family: ${request.family.familyName} (ID: ${request.family.id})`);
//     console.log(`   Elder: ${request.elder.firstName} ${request.elder.lastName}`);
//     console.log(`   Status: ${request.status}`);
//     console.log('---');
//   });
  
//   await prisma.$disconnect();
// }

// getCaregivers().catch(console.error);

// test-remove-caregiver.js
const axios = require('axios');

async function testRemoveCaregiver() {
  const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImpvaG4uc21pdGhAZXhhbXBsZS5jb20iLCJzdWIiOiJjbWtheHd6NHgwMDE1em91d3BhY2J5OWJzIiwicm9sZSI6IkZBTUlMWSIsImlhdCI6MTc2OTU0OTA3MywiZXhwIjoxNzY5NjM1NDczfQ.VRfHnWjzfXDa9kWFOQ94oGcXCPQT5vLjsmi7pwoaYqI';
  
  // USE CORRECT IDs FROM YOUR DATABASE:
  const caregiverId = 'cmkaxwz46000yzouwgnl5g5za'; // Sarah Johnson's CAREGIVER ID
  const familyId = 'cmkaxwz4z0017zouwix5ktg82'; // Smith Family ID

  try {
    const response = await axios.delete(
      `http://localhost:3001/care-requests/caregiver/${caregiverId}/remove`,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        data: {
          familyId: familyId,
          reason: 'Testing API removal - schedule conflict'
        }
      }
    );

    console.log('✅ Success:', JSON.stringify(response.data, null, 2));
  } catch (error) {
    console.log('❌ Error occurred:');
    
    if (error.response) {
      console.log('Status:', error.response.status);
      console.log('Data:', JSON.stringify(error.response.data, null, 2));
    } else {
      console.log('Error:', error.message);
    }
  }
}

testRemoveCaregiver();
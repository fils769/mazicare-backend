// Quick performance test for care request creation
// Run with: node test-care-request-performance.js

const axios = require('axios');

const BASE_URL = 'http://localhost:3001';

async function testCareRequestCreation() {
  console.log('🧪 Testing Care Request Creation Performance...\n');

  try {
    // 1. Login as family user
    console.log('1️⃣ Logging in as family user...');
    const loginResponse = await axios.post(`${BASE_URL}/auth/unified/login`, {
      identifier: 'family@example.com', // Update with actual family email
      password: 'password123',
    });
    
    const token = loginResponse.data.access_token;
    console.log('✅ Login successful\n');

    // 2. Get family's elders
    console.log('2️⃣ Fetching elders...');
    const eldersResponse = await axios.get(`${BASE_URL}/elders`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const elderId = eldersResponse.data[0]?.id;
    console.log(`✅ Found elder: ${elderId}\n`);

    // 3. Get available caregivers
    console.log('3️⃣ Fetching caregivers...');
    const caregiversResponse = await axios.get(`${BASE_URL}/caregiver`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const caregiverId = caregiversResponse.data[0]?.id;
    console.log(`✅ Found caregiver: ${caregiverId}\n`);

    // 4. Create care request and measure time
    console.log('4️⃣ Creating care request...');
    const startTime = Date.now();
    
    const careRequestResponse = await axios.post(
      `${BASE_URL}/care-requests`,
      {
        elderId: elderId,
        caregiverId: caregiverId,
        careType: 'FULL_TIME',
      },
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );
    
    const endTime = Date.now();
    const duration = endTime - startTime;

    console.log('✅ Care request created successfully!');
    console.log(`⏱️  Time taken: ${duration}ms`);
    console.log(`📊 Request ID: ${careRequestResponse.data.id}\n`);

    // Performance evaluation
    if (duration < 1000) {
      console.log('🎉 EXCELLENT! Request completed in under 1 second');
    } else if (duration < 2000) {
      console.log('✅ GOOD! Request completed in under 2 seconds');
    } else if (duration < 3000) {
      console.log('⚠️  ACCEPTABLE! Request completed in under 3 seconds');
    } else {
      console.log('❌ SLOW! Request took more than 3 seconds - optimization needed');
    }

  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
    
    if (error.code === 'P2028') {
      console.log('\n🔴 TRANSACTION TIMEOUT ERROR DETECTED!');
      console.log('This indicates the optimization did not work properly.');
    }
  }
}

// Run test
testCareRequestCreation();

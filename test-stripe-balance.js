const https = require('https');
const http = require('http');

// Configuration
const BASE_URL = 'http://localhost:3001'; // Change if your server runs on different port
const ADMIN_EMAIL = 'admin@mazicare.com';
const ADMIN_PASSWORD = 'password123';

// Step 1: Login as admin
function loginAdmin() {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
    });

    const options = {
      hostname: 'localhost',
      port: 3001,
      path: '/auth/login',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length,
      },
    };

    const req = http.request(options, (res) => {
      let body = '';

      res.on('data', (chunk) => {
        body += chunk;
      });

      res.on('end', () => {
        try {
          const response = JSON.parse(body);
          console.log('Login response:', response);
          if (response.accessToken || response.access_token) {
            console.log('✅ Admin login successful');
            resolve(response.accessToken || response.access_token);
          } else {
            reject(new Error('No access token in response'));
          }
        } catch (error) {
          console.log('Raw body:', body);
          reject(error);
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.write(data);
    req.end();
  });
}

// Step 2: Test Stripe balance endpoint
function testStripeBalance(token) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 3001,
      path: '/admin/stripe/balance',
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    };

    const req = http.request(options, (res) => {
      let body = '';

      res.on('data', (chunk) => {
        body += chunk;
      });

      res.on('end', () => {
        console.log(`\n📊 Response Status: ${res.statusCode}`);
        console.log('📋 Response Headers:', res.headers);
        console.log('\n💰 Stripe Balance Response:');
        
        try {
          const response = JSON.parse(body);
          console.log(JSON.stringify(response, null, 2));
          
          if (res.statusCode === 200) {
            console.log('\n✅ Stripe balance endpoint is working!');
            console.log('\n📈 Summary:');
            console.log(`   Total Revenue: $${response.summary?.totalRevenue || 0}`);
            console.log(`   Stripe Available: $${response.summary?.stripeAvailable || 0}`);
            console.log(`   Stripe Pending: $${response.summary?.stripePending || 0}`);
            console.log(`   Currency: ${response.summary?.currency || 'N/A'}`);
          } else {
            console.log('\n❌ Error:', response);
          }
          
          resolve(response);
        } catch (error) {
          console.log('Raw response:', body);
          reject(error);
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.end();
  });
}

// Main test function
async function runTest() {
  console.log('🧪 Testing Stripe Balance Endpoint\n');
  console.log('=' .repeat(50));
  
  try {
    console.log('\n1️⃣  Logging in as admin...');
    const token = await loginAdmin();
    
    console.log('\n2️⃣  Fetching Stripe balance...');
    await testStripeBalance(token);
    
    console.log('\n' + '='.repeat(50));
    console.log('✅ All tests completed successfully!');
    
  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
    console.error('\nMake sure:');
    console.error('  1. Your server is running on http://localhost:3001');
    console.error('  2. Admin user exists (admin@mazicare.com / password123)');
    console.error('  3. STRIPE_SECRET_KEY is configured in .env');
    process.exit(1);
  }
}

// Run the test
runTest();

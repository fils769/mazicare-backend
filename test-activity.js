import axios from 'axios';

const API_URL = 'http://localhost:3001'; 
const TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InNhcmFoLmpvaG5zb25AZXhhbXBsZS5jb20iLCJzdWIiOiJjbWtheHd6M2EwMDB0em91d2p5cjBjc2hzIiwicm9sZSI6IkNBUkVHSVZFUiIsImlhdCI6MTc2OTkxMDQwMSwiZXhwIjoxNzY5OTk2ODAxfQ.8bWTj2D_qGWosd75XdcJXXFlyx7o2Nonh_NFkZHGcd8'; // caregiver JWT

async function testActivity(period = '7d') {
  try {
    const res = await axios.get(
      `${API_URL}/caregiver/activity`,
      {
        params: { period },
        headers: {
          Authorization: `Bearer ${TOKEN}`,
        },
      }
    );

    console.log('================ RAW RESPONSE ================');
    console.dir(res.data, { depth: null });

    console.log('\n================ QUICK CHECKS ================');
    console.log('Period:', res.data.periodLabel);
    console.log('Total elders:', res.data.overallStats.totalElders);
    console.log('Total tasks:', res.data.overallStats.totalTasks);
    console.log('Timeline points:', res.data.tasks.timeline.length);
    console.log('Recent activities:', res.data.recentActivities.length);
  } catch (err) {
    console.error('❌ ERROR');
    if (err.response) {
      console.error(err.response.status, err.response.data);
    } else {
      console.error(err.message);
    }
  }
}

// Try different periods
await testActivity('today');
await testActivity('7d');
await testActivity('30d');

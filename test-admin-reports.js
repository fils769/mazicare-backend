/**
 * Test script for Admin Reports Endpoint
 * 
 * This script demonstrates how to:
 * 1. Login as admin
 * 2. Fetch comprehensive reports
 * 3. Display the metrics
 */

const BASE_URL = 'http://localhost:3000';

async function loginAsAdmin() {
    const response = await fetch(`${BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            email: 'admin@mazicare.com',
            password: 'password123',
        }),
    });

    if (!response.ok) {
        throw new Error(`Login failed: ${response.statusText}`);
    }

    const data = await response.json();
    return data.token || data.access_token;
}

async function fetchAdminReports(token) {
    const response = await fetch(`${BASE_URL}/admin/reports`, {
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        throw new Error(`Failed to fetch reports: ${response.statusText}`);
    }

    return await response.json();
}

function displayReports(reports) {
    console.log('\n' + '='.repeat(60));
    console.log('📊 MAZICARE PLATFORM REPORTS');
    console.log('='.repeat(60) + '\n');

    // Overview Section
    console.log('🏠 PLATFORM OVERVIEW');
    console.log('-'.repeat(60));
    console.log(`Total Families:          ${reports.overview.totalFamilies}`);
    console.log(`Active Families:         ${reports.overview.activeFamilies}`);
    console.log(`Total Caregivers:        ${reports.overview.totalCaregivers}`);
    console.log(`Active Caregivers:       ${reports.overview.activeCaregivers}`);
    console.log(`Pending Caregivers:      ${reports.overview.pendingCaregivers}`);
    console.log(`Total Elders:            ${reports.overview.totalElders}`);
    console.log(`Elders with Caregivers:  ${reports.overview.eldersWithCaregivers}`);
    console.log(`Total Connections:       ${reports.overview.totalConnections}`);
    console.log(`Active Subscriptions:    ${reports.overview.activeSubscriptions}`);
    console.log('');

    // Care Metrics Section
    console.log('💼 CARE PERFORMANCE METRICS');
    console.log('-'.repeat(60));
    console.log(`Care Completion Rate:    ${reports.careMetrics.careCompletionRate}%`);
    console.log(`Total Schedule Items:    ${reports.careMetrics.totalScheduleItems}`);
    console.log(`Completed Items:         ${reports.careMetrics.completedScheduleItems}`);
    console.log(`Pending Items:           ${reports.careMetrics.pendingScheduleItems}`);
    console.log('');

    // Matching Metrics Section
    console.log('🤝 MATCHING & CONNECTION METRICS');
    console.log('-'.repeat(60));
    console.log(`Overall Match Rate:      ${reports.matchingMetrics.matchRate}%`);
    console.log('');
    console.log('Families:');
    console.log(`  With Caregivers:       ${reports.matchingMetrics.familiesWithCaregivers}`);
    console.log(`  Without Caregivers:    ${reports.matchingMetrics.familiesWithoutCaregivers}`);
    console.log('');
    console.log('Caregivers:');
    console.log(`  With Elders:           ${reports.matchingMetrics.caregiversWithElders}`);
    console.log(`  Without Elders:        ${reports.matchingMetrics.caregiversWithoutElders}`);
    console.log('');
    console.log('Elders:');
    console.log(`  With Caregivers:       ${reports.matchingMetrics.eldersWithCaregivers}`);
    console.log(`  Without Caregivers:    ${reports.matchingMetrics.eldersWithoutCaregivers}`);
    console.log('');

    // Activity Section
    console.log('📈 PLATFORM ACTIVITY');
    console.log('-'.repeat(60));
    console.log(`Recent Activity (${reports.activity.periodDays} days): ${reports.activity.recentActivityCount} events`);
    console.log('');

    // Alerts
    console.log('⚠️  ALERTS & RECOMMENDATIONS');
    console.log('-'.repeat(60));

    const alerts = [];

    if (reports.matchingMetrics.eldersWithoutCaregivers > 10) {
        alerts.push(`${reports.matchingMetrics.eldersWithoutCaregivers} elders need caregivers`);
    }

    if (reports.overview.pendingCaregivers > 5) {
        alerts.push(`${reports.overview.pendingCaregivers} caregivers pending approval`);
    }

    if (reports.careMetrics.careCompletionRate < 70) {
        alerts.push(`Low care completion rate: ${reports.careMetrics.careCompletionRate}%`);
    }

    if (reports.matchingMetrics.matchRate < 50) {
        alerts.push(`Low match rate: ${reports.matchingMetrics.matchRate}%`);
    }

    if (alerts.length > 0) {
        alerts.forEach(alert => console.log(`⚠️  ${alert}`));
    } else {
        console.log('✅ No urgent issues detected');
    }

    console.log('\n' + '='.repeat(60) + '\n');
}

// Main execution
async function main() {
    try {
        console.log('🔐 Logging in as admin...');
        const token = await loginAsAdmin();
        console.log('✅ Login successful!\n');

        console.log('📊 Fetching platform reports...');
        const reports = await fetchAdminReports(token);
        console.log('✅ Reports fetched successfully!');

        displayReports(reports);

        // Also save to JSON file for reference
        const fs = require('fs');
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const filename = `admin-reports-${timestamp}.json`;
        fs.writeFileSync(filename, JSON.stringify(reports, null, 2));
        console.log(`💾 Full report saved to: ${filename}\n`);

    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}

// Run if executed directly
if (require.main === module) {
    main();
}

module.exports = { loginAsAdmin, fetchAdminReports, displayReports };

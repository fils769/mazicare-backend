/**
 * Test script for Family and Caregiver Reports
 * 
 * This script demonstrates how to:
 * 1. Login as a family user and fetch family report
 * 2. Login as a caregiver and fetch caregiver report
 * 3. Display the report metrics
 */

const BASE_URL = 'http://localhost:3000';

async function loginUser(email, password) {
    const response = await fetch(`${BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
        throw new Error(`Login failed: ${response.statusText}`);
    }

    const data = await response.json();
    return data.token || data.access_token;
}

async function fetchFamilyReport(token) {
    const response = await fetch(`${BASE_URL}/reports/family`, {
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        throw new Error(`Failed to fetch family report: ${response.statusText}`);
    }

    return await response.json();
}

async function fetchCaregiverReport(token) {
    const response = await fetch(`${BASE_URL}/reports/caregiver`, {
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        throw new Error(`Failed to fetch caregiver report: ${response.statusText}`);
    }

    return await response.json();
}

function displayFamilyReport(report) {
    console.log('\n' + '='.repeat(60));
    console.log('👨‍👩‍👧‍👦 FAMILY REPORT');
    console.log('='.repeat(60) + '\n');

    console.log(`Family: ${report.familyName}`);
    console.log(`Report ID: ${report.reportId}`);
    console.log(`Generated: ${new Date(report.generatedAt).toLocaleString()}\n`);

    // Summary
    console.log('📊 SUMMARY');
    console.log('-'.repeat(60));
    console.log(`Total Elders:              ${report.summary.totalElders}`);
    console.log(`Elders with Caregivers:    ${report.summary.eldersWithCaregivers}`);
    console.log(`Elders without Caregivers: ${report.summary.eldersWithoutCaregivers}`);
    console.log(`Active Caregivers:         ${report.summary.activeCaregivers}`);
    console.log(`Completion Rate:           ${report.summary.completionRate}%`);
    console.log(`Total Schedule Items:      ${report.summary.totalScheduleItems}`);
    console.log(`Completed Items:           ${report.summary.completedScheduleItems}`);
    console.log(`Pending Items:             ${report.summary.pendingScheduleItems}`);
    console.log(`Upcoming Items:            ${report.summary.upcomingScheduleItems}`);
    console.log('');

    // Subscription
    if (report.subscription) {
        console.log('💳 SUBSCRIPTION');
        console.log('-'.repeat(60));
        console.log(`Plan:           ${report.subscription.planName}`);
        console.log(`Status:         ${report.subscription.status}`);
        console.log(`Days Remaining: ${report.subscription.daysRemaining}`);
        console.log('');
    }

    // Requests
    console.log('📝 CAREGIVER REQUESTS');
    console.log('-'.repeat(60));
    console.log(`Total:    ${report.requests.total}`);
    console.log(`Pending:  ${report.requests.pending}`);
    console.log(`Accepted: ${report.requests.accepted}`);
    console.log(`Rejected: ${report.requests.rejected}`);
    console.log('');

    // Elders
    console.log('👴 ELDERS');
    console.log('-'.repeat(60));
    report.elders.forEach((elder, index) => {
        console.log(`${index + 1}. ${elder.name} (${elder.age} years, ${elder.gender})`);
        console.log(`   Program: ${elder.program || 'Not assigned'}`);
        if (elder.caregiver) {
            console.log(`   Caregiver: ${elder.caregiver.name}`);
            console.log(`   Contact: ${elder.caregiver.email} | ${elder.caregiver.phone}`);
        } else {
            console.log(`   Caregiver: Not assigned`);
        }
        console.log('');
    });

    console.log('='.repeat(60) + '\n');
}

function displayCaregiverReport(report) {
    console.log('\n' + '='.repeat(60));
    console.log('🩺 CAREGIVER REPORT');
    console.log('='.repeat(60) + '\n');

    console.log(`Caregiver: ${report.caregiverName}`);
    console.log(`Report ID: ${report.reportId}`);
    console.log(`Generated: ${new Date(report.generatedAt).toLocaleString()}\n`);

    // Profile
    console.log('👤 PROFILE');
    console.log('-'.repeat(60));
    console.log(`Email:      ${report.profile.email}`);
    console.log(`Phone:      ${report.profile.phone || 'Not provided'}`);
    console.log(`Status:     ${report.profile.status}`);
    console.log(`Gender:     ${report.profile.gender}`);
    console.log(`Region:     ${report.profile.region || 'Not specified'}`);
    console.log(`Program:    ${report.profile.program || 'Not assigned'}`);
    console.log(`Experience: ${report.profile.experience || 'Not specified'}`);
    console.log(`Onboarding: ${report.profile.onboardingComplete ? 'Complete' : 'Incomplete'}`);
    console.log('');

    // Summary
    console.log('📊 PERFORMANCE SUMMARY');
    console.log('-'.repeat(60));
    console.log(`Total Elders:           ${report.summary.totalElders}`);
    console.log(`Active Families:        ${report.summary.activeFamilies}`);
    console.log(`Completion Rate:        ${report.summary.completionRate}%`);
    console.log(`Total Schedule Items:   ${report.summary.totalScheduleItems}`);
    console.log(`Completed Items:        ${report.summary.completedScheduleItems}`);
    console.log(`Pending Items:          ${report.summary.pendingScheduleItems}`);
    console.log(`Upcoming Items:         ${report.summary.upcomingScheduleItems}`);
    console.log(`Today's Schedule Items: ${report.summary.todayScheduleItems}`);
    console.log('');

    // Ratings
    console.log('⭐ RATINGS');
    console.log('-'.repeat(60));
    console.log(`Average Rating: ${report.ratings.averageRating}/5.0`);
    console.log(`Total Reviews:  ${report.ratings.totalReviews}`);
    console.log('');

    // Requests
    console.log('📝 FAMILY REQUESTS');
    console.log('-'.repeat(60));
    console.log(`Total:    ${report.requests.total}`);
    console.log(`Pending:  ${report.requests.pending}`);
    console.log(`Accepted: ${report.requests.accepted}`);
    console.log(`Rejected: ${report.requests.rejected}`);
    console.log('');

    // Elders
    console.log('👴 ASSIGNED ELDERS');
    console.log('-'.repeat(60));
    if (report.elders.length === 0) {
        console.log('No elders assigned yet.');
    } else {
        report.elders.forEach((elder, index) => {
            console.log(`${index + 1}. ${elder.name} (${elder.age} years, ${elder.gender})`);
            console.log(`   Program: ${elder.program || 'Not assigned'}`);
            if (elder.family) {
                console.log(`   Family: ${elder.family.name} (${elder.family.email})`);
            }
            console.log('');
        });
    }

    console.log('='.repeat(60) + '\n');
}

// Main execution
async function main() {
    const args = process.argv.slice(2);
    const userType = args[0] || 'family'; // 'family' or 'caregiver'

    try {
        if (userType === 'family') {
            console.log('🔐 Testing Family Report...');
            console.log('Note: Update email/password with actual family credentials\n');

            // Update these credentials with actual family user
            const token = await loginUser('family@example.com', 'password123');
            console.log('✅ Logged in as family user\n');

            const report = await fetchFamilyReport(token);
            displayFamilyReport(report);

            // Save to file
            const fs = require('fs');
            const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
            const filename = `family-report-${timestamp}.json`;
            fs.writeFileSync(filename, JSON.stringify(report, null, 2));
            console.log(`💾 Full report saved to: ${filename}\n`);

        } else if (userType === 'caregiver') {
            console.log('🔐 Testing Caregiver Report...');
            console.log('Note: Update email/password with actual caregiver credentials\n');

            // Update these credentials with actual caregiver user
            const token = await loginUser('caregiver@example.com', 'password123');
            console.log('✅ Logged in as caregiver user\n');

            const report = await fetchCaregiverReport(token);
            displayCaregiverReport(report);

            // Save to file
            const fs = require('fs');
            const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
            const filename = `caregiver-report-${timestamp}.json`;
            fs.writeFileSync(filename, JSON.stringify(report, null, 2));
            console.log(`💾 Full report saved to: ${filename}\n`);

        } else {
            console.log('Usage: node test-reports.js [family|caregiver]');
            console.log('Example: node test-reports.js family');
            console.log('Example: node test-reports.js caregiver');
        }

    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}

// Run if executed directly
if (require.main === module) {
    main();
}

module.exports = { loginUser, fetchFamilyReport, fetchCaregiverReport, displayFamilyReport, displayCaregiverReport };

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testConnection() {
    try {
        console.log('Testing database connection...');

        // Test connection
        await prisma.$connect();
        console.log('✅ Database connected successfully!');

        // Check if tables exist
        const tables = await prisma.$queryRaw`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name;
    `;

        console.log('\n📋 Tables in database:');
        tables.forEach(table => console.log(`  - ${table.table_name}`));

        // Count records in key tables
        const userCount = await prisma.user.count();
        const caregiverCount = await prisma.caregiver.count();
        const familyCount = await prisma.family.count();

        console.log('\n📊 Record counts:');
        console.log(`  - Users: ${userCount}`);
        console.log(`  - Caregivers: ${caregiverCount}`);
        console.log(`  - Families: ${familyCount}`);

    } catch (error) {
        console.error('❌ Error:', error.message);
        console.error('Full error:', error);
    } finally {
        await prisma.$disconnect();
    }
}

testConnection();

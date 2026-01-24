const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkUsers() {
    try {
        console.log('🔍 Fetching all users from database...\n');

        const users = await prisma.user.findMany({
            select: {
                id: true,
                email: true,
                role: true,
                isVerified: true,
                createdAt: true
            },
            orderBy: {
                role: 'asc'
            }
        });

        console.log(`📊 Total Users: ${users.length}\n`);

        // Group by role
        const byRole = users.reduce((acc, user) => {
            if (!acc[user.role]) acc[user.role] = [];
            acc[user.role].push(user);
            return acc;
        }, {});

        // Display by role
        Object.keys(byRole).forEach(role => {
            console.log(`\n${role} (${byRole[role].length}):`);
            console.log('─'.repeat(60));
            byRole[role].forEach(user => {
                console.log(`  📧 ${user.email}`);
                console.log(`     ID: ${user.id}`);
                console.log(`     Verified: ${user.isVerified ? '✅' : '❌'}`);
                console.log(`     Created: ${user.createdAt.toLocaleDateString()}`);
                console.log('');
            });
        });

    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        await prisma.$disconnect();
    }
}

checkUsers();

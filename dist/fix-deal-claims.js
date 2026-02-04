"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function main() {
    console.log('🔧 Fixing deal claims foreign key issue...\n');
    try {
        console.log('🗑️  Deleting all deal claims...');
        const deletedClaims = await prisma.dealClaim.deleteMany({});
        console.log(`✅ Deleted ${deletedClaims.count} deal claims\n`);
        console.log('🗑️  Deleting all deals...');
        const deletedDeals = await prisma.deal.deleteMany({});
        console.log(`✅ Deleted ${deletedDeals.count} deals\n`);
        console.log('✨ Database cleaned! Now you can run:');
        console.log('   npx prisma db push');
        console.log('   npm run db:seed-deals');
    }
    catch (error) {
        console.error('❌ Error:', error.message);
    }
}
main()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=fix-deal-claims.js.map
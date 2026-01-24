"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function main() {
    console.log('Clearing all deals...');
    const deletedClaims = await prisma.dealClaim.deleteMany({});
    console.log(`Deleted ${deletedClaims.count} deal claims`);
    const deletedDeals = await prisma.deal.deleteMany({});
    console.log(`Deleted ${deletedDeals.count} deals`);
    console.log('All deals cleared successfully!');
}
main()
    .catch((e) => {
    console.error('Error:', e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=clear-deals.js.map
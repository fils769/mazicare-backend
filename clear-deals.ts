import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Clearing all deals...');

  // Delete all deal claims first (foreign key constraint)
  const deletedClaims = await prisma.dealClaim.deleteMany({});
  console.log(`Deleted ${deletedClaims.count} deal claims`);

  // Delete all deals
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

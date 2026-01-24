import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Verifying redirectUrl in deals...\n');

  const sampleDeals = await prisma.deal.findMany({
    take: 5,
    orderBy: { createdAt: 'desc' },
  });

  console.log('Sample deals with redirectUrl:\n');
  console.log('='.repeat(80));

  sampleDeals.forEach((deal, index) => {
    console.log(`\n${index + 1}. ${deal.title}`);
    console.log(`   Price: €${deal.price}`);
    console.log(`   Discount: ${deal.discountPercent}%`);
    console.log(`   Redirect URL: ${deal.redirectUrl || 'N/A'}`);
    console.log(`   Image URL: ${deal.imageUrl?.substring(0, 60)}...`);
  });

  console.log('\n' + '='.repeat(80));

  // Check how many deals have redirectUrl
  const totalDeals = await prisma.deal.count();
  const dealsWithRedirectUrl = await prisma.deal.count({
    where: {
      redirectUrl: {
        not: null
      }
    }
  });

  console.log(`\nTotal deals: ${totalDeals}`);
  console.log(`Deals with redirectUrl: ${dealsWithRedirectUrl}`);
  console.log(`Deals without redirectUrl: ${totalDeals - dealsWithRedirectUrl}`);
}

main()
  .catch((e) => {
    console.error('Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

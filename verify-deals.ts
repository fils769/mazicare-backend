import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Verifying deals in database...\n');

  const totalDeals = await prisma.deal.count();
  console.log(`Total deals in database: ${totalDeals}`);

  const sampleDeals = await prisma.deal.findMany({
    take: 5,
    orderBy: { createdAt: 'desc' },
  });

  console.log('\nSample deals (latest 5):');
  console.log('========================\n');

  sampleDeals.forEach((deal, index) => {
    console.log(`${index + 1}. ${deal.title}`);
    console.log(`   Category: ${deal.category}`);
    console.log(`   Price: €${deal.price}`);
    console.log(`   Discount: ${deal.discountPercent}%`);
    console.log(`   Region: ${deal.region || 'N/A'}`);
    console.log(`   Created: ${deal.createdAt.toISOString()}\n`);
  });

  // Get category breakdown
  const categories = await prisma.deal.groupBy({
    by: ['category'],
    _count: {
      category: true,
    },
    orderBy: {
      _count: {
        category: 'desc',
      },
    },
    take: 10,
  });

  console.log('Top 10 Categories:');
  console.log('==================');
  categories.forEach((cat, index) => {
    console.log(`${index + 1}. ${cat.category}: ${cat._count.category} deals`);
  });
}

main()
  .catch((e) => {
    console.error('Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

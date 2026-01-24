import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting to seed deals from new-deals.json...');

  // Read the new-deals.json file
  const filePath = path.join(__dirname, 'deals_20260118_232016.json');
  const rawData = fs.readFileSync(filePath, 'utf-8');
  const dealsData = JSON.parse(rawData);

  console.log(`Found ${dealsData.length} deals to seed`);

  let successCount = 0;
  let errorCount = 0;

  for (const deal of dealsData) {
    try {
      // Transform the data to match the Deal model schema
      const formattedDeal = {
        title: deal.title,
        description: deal.specs || null,
        category: deal.category || null,
        discountPercent: deal.discount_percentage || null,
        price: deal.current_price || null,
        imageUrl: deal.image_url || null,
        redirectUrl: deal.redirect_url || null,
        region: deal.shop_count || null,
        // Optional: You can set startsAt and endsAt if needed
        // startsAt: new Date(),
        // endsAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      };

      const created = await prisma.deal.create({
        data: formattedDeal,
      });

      successCount++;
      if (successCount % 50 === 0) {
        console.log(`Seeded ${successCount} deals...`);
      }
    } catch (error) {
      errorCount++;
      console.error(`Error seeding deal "${deal.title}":`, error.message);
    }
  }

  console.log('\n=== Seeding Summary ===');
  console.log(`✓ Successfully seeded: ${successCount} deals`);
  console.log(`✗ Failed: ${errorCount} deals`);
  console.log('=======================\n');
}

main()
  .catch((e) => {
    console.error('Fatal error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

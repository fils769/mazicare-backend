import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
  log: ['error', 'warn'],
});

interface RawDeal {
  id: number;
  title: string;
  category?: string;
  specs?: string;
  original_price?: number;
  current_price: number;
  discount_percentage?: number;
  rating?: number;
  review_count?: number;
  redirect_url?: string;
  image_url?: string;
  shop_count?: string;
  product_id?: string;
  scraped_at?: string;
  created_at?: string;
}

// Helper function to retry database operations
async function retryOperation<T>(
  operation: () => Promise<T>,
  maxRetries = 3,
  delay = 2000
): Promise<T> {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await operation();
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      console.log(`⚠️  Retry ${i + 1}/${maxRetries} after error: ${error.message}`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  throw new Error('Max retries exceeded');
}

async function main() {
  console.log('🔄 Starting deals formatting and seeding...\n');

  // Test connection first
  try {
    await retryOperation(() => prisma.$connect());
    console.log('✅ Database connected\n');
  } catch (error) {
    console.error('❌ Failed to connect to database:', error.message);
    process.exit(1);
  }

  // Read the raw deals.json file
  const dealsFilePath = path.join(__dirname, '..', 'prisma', 'migrations', 'deals.json');
  const rawDeals: RawDeal[] = JSON.parse(fs.readFileSync(dealsFilePath, 'utf-8'));

  console.log(`📊 Found ${rawDeals.length} deals to process\n`);

  // Delete existing deals first
  console.log('🗑️  Deleting existing deals...');
  const deleteResult = await retryOperation(() => prisma.deal.deleteMany({}));
  console.log(`✅ Deleted ${deleteResult.count} existing deals\n`);

  let successCount = 0;
  let errorCount = 0;
  const errors: string[] = [];

  // Process in batches to avoid connection issues
  const batchSize = 100;
  for (let i = 0; i < rawDeals.length; i += batchSize) {
    const batch = rawDeals.slice(i, i + batchSize);
    
    for (const rawDeal of batch) {
      try {
        // Format the deal according to Prisma schema
        await prisma.deal.create({
          data: {
            title: rawDeal.title,
            description: rawDeal.specs || null,
            category: rawDeal.category || null,
            discountPercent: rawDeal.discount_percentage || null,
            price: rawDeal.current_price,
            imageUrl: rawDeal.image_url || null,
            redirectUrl: rawDeal.redirect_url || null,
            region: null,
            startsAt: null,
            endsAt: null,
            createdBy: 'system',
          },
        });

        successCount++;
      } catch (error) {
        errorCount++;
        const errorMsg = `Deal "${rawDeal.title}": ${error.message}`;
        errors.push(errorMsg);
        
        if (errorCount <= 10) {
          console.error(`❌ ${errorMsg}`);
        }
      }
    }

    console.log(`✅ Processed ${Math.min(i + batchSize, rawDeals.length)}/${rawDeals.length} deals...`);
    
    // Small delay between batches
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  console.log('\n📈 Seeding Summary:');
  console.log(`✅ Successfully seeded: ${successCount} deals`);
  console.log(`❌ Errors: ${errorCount} deals`);
  
  if (errors.length > 10) {
    console.log(`\n⚠️  Showing first 10 errors (${errors.length} total)`);
  }

  console.log('\n✨ Deals seeding completed!');
}

main()
  .catch((e) => {
    console.error('💥 Fatal error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

interface EventData {
  id: number;
  title: string;
  description: string | null;
  date: string;
  schedule: string | null;
  region: string | null;
  category: string | null;
  categoryColor: string | null;
  subCategories: string | null;
  location: string | null;
  venue: string | null;
  venueUrl: string | null;
  url: string | null;
  eventUrl: string | null;
  image: string | null;
  imageUrl: string | null;
  price: number;
  maxCapacity: number | null;
  targetAges: string | null;
  specialFeatures: string | null;
  source: string | null;
}

async function main() {
  console.log('Starting event seeding...');

  // Delete all existing events first
  console.log('🗑️  Deleting existing events...');
  const deleteResult = await prisma.event.deleteMany({});
  console.log(`✅ Deleted ${deleteResult.count} existing events\n`);

  // Read the formatted events.json file
  const eventsFilePath = path.join(__dirname, '..', 'prisma', 'events-formatted.json');
  const eventsData: EventData[] = JSON.parse(fs.readFileSync(eventsFilePath, 'utf-8'));

  console.log(`Found ${eventsData.length} events to seed`);

  let successCount = 0;
  let errorCount = 0;

  for (const eventData of eventsData) {
    try {
      // Parse the date string
      let eventDate: Date;
      
      if (eventData.date.includes('T')) {
        // ISO format with time
        eventDate = new Date(eventData.date);
      } else {
        // YYYY-MM-DD format
        eventDate = new Date(eventData.date);
      }

      // Create the event with all fields
      await prisma.event.create({
        data: {
          title: eventData.title,
          description: eventData.description,
          date: eventDate,
          schedule: eventData.schedule,
          region: eventData.region,
          category: eventData.category,
          categoryColor: eventData.categoryColor,
          subCategories: eventData.subCategories,
          venue: eventData.venue,
          venueUrl: eventData.venueUrl,
          eventUrl: eventData.eventUrl,
          imageUrl: eventData.imageUrl,
          price: eventData.price,
          maxCapacity: eventData.maxCapacity,
          targetAges: eventData.targetAges,
          specialFeatures: eventData.specialFeatures,
          isActive: true,
        },
      });

      successCount++;
      
      if (successCount % 100 === 0) {
        console.log(`Seeded ${successCount} events...`);
      }
    } catch (error) {
      errorCount++;
      console.error(`Error seeding event "${eventData.title}":`, error.message);
    }
  }

  console.log('\n✅ Event seeding completed!');
  console.log(`Successfully seeded: ${successCount} events`);
  console.log(`Errors: ${errorCount} events`);
}

main()
  .catch((e) => {
    console.error('Fatal error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

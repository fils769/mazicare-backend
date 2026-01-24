import * as fs from 'fs';
import * as path from 'path';

interface RawEventData {
  title: string;
  description?: string;
  date: string;
  region?: string;
  category?: string;
  price?: number;
  maxCapacity?: number;
  location?: string;
  venue?: string;
  venueUrl?: string;
  url?: string;
  eventUrl?: string;
  link?: string;
  externalUrl?: string;
  image?: string;
  imageUrl?: string;
  coverImage?: string;
  thumbnail?: string;
  source?: string;
  schedule?: string;
  categoryColor?: string;
  subCategories?: string;
  targetAges?: string;
  specialFeatures?: string;
}

interface FormattedEventData {
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

function formatDate(dateStr: string): string {
  // Handle "new Date('2026-02-18')" format
  if (dateStr.includes("new Date('")) {
    const match = dateStr.match(/new Date\('(.+?)'\)/);
    return match ? match[1] : new Date().toISOString().split('T')[0];
  }
  
  // Handle ISO date strings
  if (dateStr.includes('T')) {
    return dateStr;
  }
  
  // Return as-is if already in YYYY-MM-DD format
  return dateStr;
}

function getCategoryColor(category: string | undefined): string | null {
  const colorMap: Record<string, string> = {
    'Exhibition': '#FF6B6B',
    'Festival': '#4ECDC4',
    'Sports': '#45B7D1',
    'Music': '#FFA07A',
    'Theater': '#9B59B6',
    'Cultural': '#F39C12',
    'Training': '#27AE60',
    'Health': '#E74C3C',
    'Support': '#3498DB',
  };
  
  return category ? (colorMap[category] || null) : null;
}

async function main() {
  console.log('🔄 Starting events formatting...\n');

  // Read the raw events.json file
  const inputPath = path.join(__dirname, '..', 'prisma', 'events-data.json');
  const outputPath = path.join(__dirname, '..', 'prisma', 'events-formatted.json');

  console.log(`📖 Reading from: ${inputPath}`);
  
  const rawData: RawEventData[] = JSON.parse(fs.readFileSync(inputPath, 'utf-8'));
  console.log(`✅ Found ${rawData.length} events\n`);

  const formattedEvents: FormattedEventData[] = rawData.map((event, index) => {
    // Get the best value for each field (handle multiple possible field names)
    const venue = event.venue || event.location || null;
    const eventUrl = event.eventUrl || event.url || event.link || event.externalUrl || null;
    const imageUrl = event.imageUrl || event.image || event.coverImage || event.thumbnail || null;
    
    return {
      id: index + 1,
      title: event.title,
      description: event.description || null,
      date: formatDate(event.date),
      schedule: event.schedule || null,
      region: event.region || null,
      category: event.category || null,
      categoryColor: event.categoryColor || getCategoryColor(event.category),
      subCategories: event.subCategories || null,
      location: venue,
      venue: venue,
      venueUrl: event.venueUrl || null,
      url: eventUrl,
      eventUrl: eventUrl,
      image: imageUrl,
      imageUrl: imageUrl,
      price: event.price ?? 0,
      maxCapacity: event.maxCapacity || null,
      targetAges: event.targetAges || null,
      specialFeatures: event.specialFeatures || null,
      source: event.source || null,
    };
  });

  // Write formatted data
  console.log(`💾 Writing formatted events to: ${outputPath}`);
  fs.writeFileSync(outputPath, JSON.stringify(formattedEvents, null, 2), 'utf-8');
  
  console.log(`✅ Successfully formatted ${formattedEvents.length} events\n`);
  
  // Show sample
  console.log('📋 Sample formatted event:');
  console.log(JSON.stringify(formattedEvents[0], null, 2));
  
  console.log('\n✨ Done! Use this file for seeding.');
}

main().catch(console.error);

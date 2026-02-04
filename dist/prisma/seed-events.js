"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const prisma = new client_1.PrismaClient();
async function main() {
    console.log('Starting event seeding...');
    console.log('🗑️  Deleting existing events...');
    const deleteResult = await prisma.event.deleteMany({});
    console.log(`✅ Deleted ${deleteResult.count} existing events\n`);
    const eventsFilePath = path.join(__dirname, '..', 'prisma', 'events-formatted.json');
    const eventsData = JSON.parse(fs.readFileSync(eventsFilePath, 'utf-8'));
    console.log(`Found ${eventsData.length} events to seed`);
    let successCount = 0;
    let errorCount = 0;
    for (const eventData of eventsData) {
        try {
            let eventDate;
            if (eventData.date.includes('T')) {
                eventDate = new Date(eventData.date);
            }
            else {
                eventDate = new Date(eventData.date);
            }
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
        }
        catch (error) {
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
//# sourceMappingURL=seed-events.js.map
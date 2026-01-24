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
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
function formatDate(dateStr) {
    if (dateStr.includes("new Date('")) {
        const match = dateStr.match(/new Date\('(.+?)'\)/);
        return match ? match[1] : new Date().toISOString().split('T')[0];
    }
    if (dateStr.includes('T')) {
        return dateStr;
    }
    return dateStr;
}
function getCategoryColor(category) {
    const colorMap = {
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
    const inputPath = path.join(__dirname, '..', 'prisma', 'events-data.json');
    const outputPath = path.join(__dirname, '..', 'prisma', 'events-formatted.json');
    console.log(`📖 Reading from: ${inputPath}`);
    const rawData = JSON.parse(fs.readFileSync(inputPath, 'utf-8'));
    console.log(`✅ Found ${rawData.length} events\n`);
    const formattedEvents = rawData.map((event, index) => {
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
    console.log(`💾 Writing formatted events to: ${outputPath}`);
    fs.writeFileSync(outputPath, JSON.stringify(formattedEvents, null, 2), 'utf-8');
    console.log(`✅ Successfully formatted ${formattedEvents.length} events\n`);
    console.log('📋 Sample formatted event:');
    console.log(JSON.stringify(formattedEvents[0], null, 2));
    console.log('\n✨ Done! Use this file for seeding.');
}
main().catch(console.error);
//# sourceMappingURL=format-events.js.map
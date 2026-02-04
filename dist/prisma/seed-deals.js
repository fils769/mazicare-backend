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
    console.log('Starting to seed deals from new-deals.json...');
    const filePath = path.join(__dirname, 'deals_20260118_232016.json');
    const rawData = fs.readFileSync(filePath, 'utf-8');
    const dealsData = JSON.parse(rawData);
    console.log(`Found ${dealsData.length} deals to seed`);
    let successCount = 0;
    let errorCount = 0;
    for (const deal of dealsData) {
        try {
            const formattedDeal = {
                title: deal.title,
                description: deal.specs || null,
                category: deal.category || null,
                discountPercent: deal.discount_percentage || null,
                price: deal.current_price || null,
                imageUrl: deal.image_url || null,
                redirectUrl: deal.redirect_url || null,
                region: deal.shop_count || null,
            };
            const created = await prisma.deal.create({
                data: formattedDeal,
            });
            successCount++;
            if (successCount % 50 === 0) {
                console.log(`Seeded ${successCount} deals...`);
            }
        }
        catch (error) {
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
//# sourceMappingURL=seed-deals.js.map
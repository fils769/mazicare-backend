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
const prisma = new client_1.PrismaClient({
    datasources: {
        db: {
            url: process.env.DATABASE_URL,
        },
    },
    log: ['error', 'warn'],
});
async function retryOperation(operation, maxRetries = 3, delay = 2000) {
    for (let i = 0; i < maxRetries; i++) {
        try {
            return await operation();
        }
        catch (error) {
            if (i === maxRetries - 1)
                throw error;
            console.log(`⚠️  Retry ${i + 1}/${maxRetries} after error: ${error.message}`);
            await new Promise(resolve => setTimeout(resolve, delay));
        }
    }
    throw new Error('Max retries exceeded');
}
async function main() {
    console.log('🔄 Starting deals formatting and seeding...\n');
    try {
        await retryOperation(() => prisma.$connect());
        console.log('✅ Database connected\n');
    }
    catch (error) {
        console.error('❌ Failed to connect to database:', error.message);
        process.exit(1);
    }
    const dealsFilePath = path.join(__dirname, '..', 'prisma', 'migrations', 'deals.json');
    const rawDeals = JSON.parse(fs.readFileSync(dealsFilePath, 'utf-8'));
    console.log(`📊 Found ${rawDeals.length} deals to process\n`);
    console.log('🗑️  Deleting existing deals...');
    const deleteResult = await retryOperation(() => prisma.deal.deleteMany({}));
    console.log(`✅ Deleted ${deleteResult.count} existing deals\n`);
    let successCount = 0;
    let errorCount = 0;
    const errors = [];
    const batchSize = 100;
    for (let i = 0; i < rawDeals.length; i += batchSize) {
        const batch = rawDeals.slice(i, i + batchSize);
        for (const rawDeal of batch) {
            try {
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
            }
            catch (error) {
                errorCount++;
                const errorMsg = `Deal "${rawDeal.title}": ${error.message}`;
                errors.push(errorMsg);
                if (errorCount <= 10) {
                    console.error(`❌ ${errorMsg}`);
                }
            }
        }
        console.log(`✅ Processed ${Math.min(i + batchSize, rawDeals.length)}/${rawDeals.length} deals...`);
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
//# sourceMappingURL=format-and-seed-deals.js.map
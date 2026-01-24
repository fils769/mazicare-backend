import { PrismaClient } from '@prisma/client';
import * as dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

async function updatePlan() {
    const stripePriceId = process.env.STRIPE_PRICE_ID;

    if (!stripePriceId) {
        console.error('❌ STRIPE_PRICE_ID not found in .env file');
        process.exit(1);
    }

    const result = await prisma.subscriptionPlan.update({
        where: { name: 'Premium Plan' },
        data: {
            price: 50.00,
            duration: '1 year',
            stripePriceId: stripePriceId
        }
    });

    console.log('✅ Updated plan:', result);
    console.log('✅ Stripe Price ID:', stripePriceId);
}

updatePlan()
    .catch(console.error)
    .finally(() => prisma.$disconnect());

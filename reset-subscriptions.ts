import { PrismaClient } from '@prisma/client';
import * as dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

async function resetSubscriptionData() {
    console.log('🧹 Resetting all subscription and payment data...\n');

    // 1. Delete all subscriptions
    const deletedSubscriptions = await prisma.subscription.deleteMany({});
    console.log(`✅ Deleted ${deletedSubscriptions.count} subscriptions`);

    // 2. Delete all payment transactions
    const deletedTransactions = await prisma.paymentTransaction.deleteMany({});
    console.log(`✅ Deleted ${deletedTransactions.count} payment transactions`);

    // 3. Show remaining data
    const remainingSubscriptions = await prisma.subscription.count();
    const remainingTransactions = await prisma.paymentTransaction.count();
    const remainingPlans = await prisma.subscriptionPlan.findMany();

    console.log('\n📊 Current state:');
    console.log(`   - Subscriptions: ${remainingSubscriptions}`);
    console.log(`   - Payment Transactions: ${remainingTransactions}`);
    console.log(`   - Available Plans: ${remainingPlans.length}`);

    console.log('\n📋 Available subscription plans:');
    remainingPlans.forEach(plan => {
        console.log(`   ✓ ${plan.name}: $${plan.price}/${plan.duration}`);
        console.log(`     Stripe Price ID: ${plan.stripePriceId || 'Not set'}`);
    });

    console.log('\n✅ Reset complete! You can now test the subscription flow from scratch.');
}

resetSubscriptionData()
    .catch(console.error)
    .finally(() => prisma.$disconnect());

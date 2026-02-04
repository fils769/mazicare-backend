// import { PrismaClient } from '@prisma/client';
// import * as dotenv from 'dotenv';

// dotenv.config();

// const prisma = new PrismaClient();

// async function deleteAllOldPlans() {
//     console.log('🧹 Deleting ALL old subscription plan data...\n');

//     // 1. Get all plans
//     const allPlans = await prisma.subscriptionPlan.findMany();
//     console.log('📋 Found plans:', allPlans.map(p => `${p.name} (${p.id})`));

//     // 2. Find Premium Plan
//     const premiumPlan = allPlans.find(p => p.name === 'Premium Plan');
//     if (!premiumPlan) {
//         console.error('❌ Premium Plan not found!');
//         return;
//     }

//     // 3. Update all subscriptions to use Premium Plan
//     const updatedSubs = await prisma.subscription.updateMany({
//         where: {
//             planId: { not: premiumPlan.id }
//         },
//         data: {
//             planId: premiumPlan.id,
//             price: 50.00
//         }
//     });
//     console.log(`✅ Migrated ${updatedSubs.count} subscriptions to Premium Plan`);

//     // 4. Delete all plans except Premium
//     for (const plan of allPlans) {
//         if (plan.id !== premiumPlan.id) {
//             try {
//                 await prisma.subscriptionPlan.delete({
//                     where: { id: plan.id }
//                 });
//                 console.log(`✅ Deleted: ${plan.name}`);
//             } catch (error: any) {
//                 console.log(`❌ Could not delete ${plan.name}:`, error.message);
//             }
//         }
//     }

//     // 5. Show final state
//     const remaining = await prisma.subscriptionPlan.findMany();
//     console.log('\n📋 Final subscription plans:');
//     remaining.forEach(plan => {
//         console.log(`   ✓ ${plan.name}: $${plan.price}/${plan.duration} (stripePriceId: ${plan.stripePriceId})`);
//     });

//     console.log('\n✅ Cleanup complete!');
// }

// deleteAllOldPlans()
//     .catch(console.error)
//     .finally(() => prisma.$disconnect());

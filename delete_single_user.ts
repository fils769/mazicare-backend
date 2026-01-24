
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const email = 'marybrwon@gmail.com';

    console.log(`Starting deletion process for ${email}...`);

    const user = await prisma.user.findUnique({
        where: { email },
        include: {
            caregiver: true,
            family: true,
        }
    });

    if (!user) {
        console.log(`User ${email} NOT found. They may have already been deleted.`);
        return;
    }

    console.log(`Found user: ${user.id}. Deleting related data...`);

    // 1. Delete OTPs
    await prisma.otp.deleteMany({ where: { email } });

    // 2. Handle Caregiver Data
    if (user.caregiver) {
        await prisma.review.deleteMany({ where: { caregiverId: user.caregiver.id } });
        await prisma.careRequest.deleteMany({ where: { caregiverId: user.caregiver.id } });
        await prisma.paymentTransaction.deleteMany({ where: { caregiverId: user.caregiver.id } });
        await prisma.caregiver.delete({ where: { id: user.caregiver.id } });
        console.log(' - Caregiver profile deleted');
    }

    // 3. Handle Family Data
    if (user.family) {
        await prisma.elder.deleteMany({ where: { familyId: user.family.id } });
        await prisma.careRequest.deleteMany({ where: { familyId: user.family.id } });
        await prisma.family.delete({ where: { id: user.family.id } });
        console.log(' - Family profile deleted');
    }

    // 4. Delete Direct User Relations
    await prisma.message.deleteMany({ where: { senderId: user.id } });
    await prisma.message.deleteMany({ where: { recipientId: user.id } });
    await prisma.notification.deleteMany({ where: { userId: user.id } });
    await prisma.eventRegistration.deleteMany({ where: { userId: user.id } });
    await prisma.subscription.deleteMany({ where: { userId: user.id } });
    await prisma.activityLog.deleteMany({ where: { userId: user.id } });
    await prisma.dealClaim.deleteMany({ where: { userId: user.id } });
    await prisma.paymentTransaction.deleteMany({ where: { userId: user.id } });
    await prisma.supportTicket.deleteMany({ where: { userId: user.id } });
    await prisma.review.deleteMany({ where: { reviewerId: user.id } });

    // 5. Delete User
    await prisma.user.delete({ where: { id: user.id } });
    console.log(`✅ User ${email} successfully deleted!`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });

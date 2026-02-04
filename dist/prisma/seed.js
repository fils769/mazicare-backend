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
const bcrypt = __importStar(require("bcryptjs"));
const prisma = new client_1.PrismaClient();
async function main() {
    const regions = [
        'Ανατολική Μακεδονία και Θράκη',
        'Κεντρική Μακεδονία',
        'Δυτική Μακεδονία',
        'Ήπειρος',
        'Θεσσαλία',
        'Ιόνια Νησιά',
        'Δυτική Ελλάδα',
        'Στερεά Ελλάδα',
        'Αττική',
        'Πελοπόννησος',
        'Βόρειο Αιγαίο',
        'Νότιο Αιγαίο',
        'Κρήτη'
    ];
    const createdRegions = [];
    for (const regionName of regions) {
        const region = await prisma.region.upsert({
            where: { name: regionName },
            update: {},
            create: { name: regionName }
        });
        createdRegions.push(region);
    }
    const languages = ['English', 'French', 'Spanish', 'Mandarin', 'Hindi'];
    for (const languageName of languages) {
        await prisma.language.upsert({
            where: { name: languageName },
            update: {},
            create: { name: languageName }
        });
    }
    const carePrograms = [
        { name: 'General Caregiver', description: 'Assistance with daily living activities and personal care' },
        { name: 'Nurse', description: 'Professional medical care and health monitoring' },
        { name: 'Physiotherapist', description: 'Physical rehabilitation and mobility support' },
        { name: 'Psychologist', description: 'Mental health support and counseling' },
        { name: 'Housekeeper / Cleaning Services', description: 'Home cleaning and organization services' },
        { name: 'Companion', description: 'Social interaction and company' },
        { name: 'Dementia / Alzheimer Care Specialist', description: 'Specialized care for memory loss conditions' },
        { name: 'Nutritionist / Dietitian', description: 'Dietary planning and nutritional guidance' },
        { name: 'Occupational Therapist', description: 'Therapy to improve daily living skills' }
    ];
    const createdPrograms = [];
    for (const program of carePrograms) {
        const createdProgram = await prisma.careProgram.upsert({
            where: { name: program.name },
            update: {},
            create: program
        });
        createdPrograms.push(createdProgram);
    }
    const hashedPassword = await bcrypt.hash('password123', 10);
    const adminUser = await prisma.user.upsert({
        where: { email: 'admin@mazicare.com' },
        update: { status: 'ACTIVE' },
        create: {
            email: 'admin@mazicare.com',
            password: hashedPassword,
            role: 'ADMIN',
            isVerified: true,
            status: 'ACTIVE',
        }
    });
    console.log('✅ Admin user created: admin@mazicare.com');
    const caregiverUsers = [
        {
            email: 'sarah.johnson@example.com',
            firstName: 'Sarah',
            lastName: 'Johnson',
            experience: 5,
            bio: 'Experienced senior care specialist with 5+ years',
            status: 'ACTIVE',
        },
        {
            email: 'mike.chen@example.com',
            firstName: 'Mike',
            lastName: 'Chen',
            experience: 3,
            bio: 'Compassionate caregiver specializing in disability support',
            status: 'PENDING',
        },
        {
            email: 'emma.davis@example.com',
            firstName: 'Emma',
            lastName: 'Davis',
            experience: 7,
            bio: 'Certified nurse with dementia care expertise',
            status: 'ACTIVE',
        },
        {
            email: 'james.wilson@example.com',
            firstName: 'James',
            lastName: 'Wilson',
            experience: 4,
            bio: 'Post-surgery recovery specialist',
            status: 'FREEZE',
        },
    ];
    const createdCaregivers = [];
    for (let i = 0; i < caregiverUsers.length; i++) {
        const userData = caregiverUsers[i];
        const user = await prisma.user.upsert({
            where: { email: userData.email },
            update: { status: userData.status },
            create: {
                email: userData.email,
                password: hashedPassword,
                role: 'CAREGIVER',
                isVerified: true,
                status: userData.status,
            },
        });
        const caregiver = await prisma.caregiver.upsert({
            where: { userId: user.id },
            update: {},
            create: {
                userId: user.id,
                firstName: userData.firstName,
                lastName: userData.lastName,
                dateOfBirth: '1985-01-01',
                gender: i % 2 === 0 ? 'female' : 'male',
                bio: userData.bio,
                email: userData.email,
                phone: `+1-416-555-${1000 + i}`,
                experience: userData.experience,
                regionId: createdRegions[i % createdRegions.length].id,
                programs: {
                    connect: { id: createdPrograms[i % createdPrograms.length].id }
                },
                onboardingComplete: true
            }
        });
        createdCaregivers.push(caregiver);
    }
    const familyUsers = [
        { email: 'john.smith@example.com', familyName: 'Smith Family', status: 'ACTIVE' },
        { email: 'mary.brown@example.com', familyName: 'Brown Family', status: 'ACTIVE' },
        { email: 'susan.lee@example.com', familyName: 'Lee Family', status: 'FREEZE' },
    ];
    const createdFamilies = [];
    for (const familyData of familyUsers) {
        const user = await prisma.user.upsert({
            where: { email: familyData.email },
            update: { status: familyData.status },
            create: {
                email: familyData.email,
                password: hashedPassword,
                role: 'FAMILY',
                isVerified: true,
                status: familyData.status,
            },
        });
        const family = await prisma.family.upsert({
            where: { userId: user.id },
            update: {},
            create: {
                userId: user.id,
                familyName: familyData.familyName,
                careFor: 'Elderly Parent',
                ageGroup: '80+',
                region: 'Αττική',
                language: 'English',
                careTypes: ['Personal Care', 'Medication Management'],
                schedule: 'Full-time',
                daysHours: 'Monday-Friday, 8AM-6PM',
                genderPreference: 'No preference',
                experienceLevel: '3+ years',
                backgroundCheck: true,
                onboardingComplete: true
            }
        });
        createdFamilies.push({ user, family });
    }
    const elders = [
        { firstName: 'Robert', lastName: 'Smith', gender: 'MALE', dob: '1940-03-15', program: 'General Caregiver' },
        { firstName: 'Margaret', lastName: 'Smith', gender: 'FEMALE', dob: '1942-07-22', program: 'Dementia / Alzheimer Care Specialist' },
        { firstName: 'William', lastName: 'Brown', gender: 'MALE', dob: '1938-11-08', program: 'Nurse' }
    ];
    const createdElders = [];
    for (let i = 0; i < elders.length; i++) {
        const elderData = elders[i];
        const familyIndex = i < 2 ? 0 : 1;
        const elder = await prisma.elder.create({
            data: {
                familyId: createdFamilies[familyIndex].family.id,
                firstName: elderData.firstName,
                lastName: elderData.lastName,
                dateOfBirth: new Date(elderData.dob),
                gender: elderData.gender,
                programId: createdPrograms.find(p => p.name === elderData.program)?.id,
                description: `Needs assistance with daily activities and ${elderData.program.toLowerCase()}`
            }
        });
        createdElders.push(elder);
    }
    const reviews = [
        { caregiverId: createdCaregivers[0].id, reviewerId: createdFamilies[0].user.id, rating: 5, comment: 'Excellent care, very professional and caring.' },
        { caregiverId: createdCaregivers[0].id, reviewerId: createdFamilies[1].user.id, rating: 4, comment: 'Great experience, highly recommend.' },
        { caregiverId: createdCaregivers[1].id, reviewerId: createdFamilies[0].user.id, rating: 5, comment: 'Outstanding support for our family member.' },
        { caregiverId: createdCaregivers[2].id, reviewerId: createdFamilies[1].user.id, rating: 4, comment: 'Very knowledgeable about dementia care.' }
    ];
    for (const review of reviews) {
        await prisma.review.create({ data: review });
    }
    const notifications = [
        { userId: createdFamilies[0].user.id, title: 'New Caregiver Match', message: 'We found a caregiver that matches your preferences', type: 'match' },
        { userId: createdFamilies[0].user.id, title: 'Schedule Reminder', message: 'Robert has physical therapy at 10 AM today', type: 'reminder' },
        { userId: createdFamilies[1].user.id, title: 'Care Update', message: 'William completed his morning medication', type: 'update' }
    ];
    for (const notification of notifications) {
        await prisma.notification.create({ data: notification });
    }
    const events = [
        {
            title: 'Senior Wellness Workshop',
            description: 'Health and wellness activities for seniors',
            date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            region: 'Αττική',
            category: 'Health',
            price: 0,
            maxCapacity: 50
        },
        {
            title: 'Caregiver Training Session',
            description: 'Professional development for caregivers',
            date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
            region: 'Κεντρική Μακεδονία',
            category: 'Training',
            price: 25.00,
            maxCapacity: 30
        },
        {
            title: 'Family Support Group',
            description: 'Monthly support group for families',
            date: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000),
            region: 'Θεσσαλία',
            category: 'Support',
            price: 0,
            maxCapacity: 25
        }
    ];
    for (const event of events) {
        await prisma.event.create({ data: event });
    }
    const conversation = await prisma.conversation.create({
        data: {
            participants: [createdFamilies[0].user.id, createdCaregivers[0].userId],
            lastMessage: 'Hello, how is Robert doing today?',
            lastMessageTime: new Date()
        }
    });
    const messages = [
        { senderId: createdFamilies[0].user.id, recipientId: createdCaregivers[0].userId, content: 'Hello, how is Robert doing today?' },
        { senderId: createdCaregivers[0].userId, recipientId: createdFamilies[0].user.id, content: 'Hi! Robert is doing well. He completed his morning routine and is now having lunch.' },
        { senderId: createdFamilies[0].user.id, recipientId: createdCaregivers[0].userId, content: 'That\'s great to hear. Thank you for the update!' }
    ];
    for (const message of messages) {
        await prisma.message.create({
            data: {
                conversationId: conversation.id,
                senderId: message.senderId,
                recipientId: message.recipientId,
                content: message.content
            }
        });
    }
    const createdCareRequests = [];
    for (let i = 0; i < createdElders.length; i++) {
        const elder = createdElders[i];
        const familyIndex = i < 2 ? 0 : 1;
        const caregiverIndex = i % createdCaregivers.length;
        const careRequest = await prisma.careRequest.create({
            data: {
                elderId: elder.id,
                caregiverId: createdCaregivers[caregiverIndex].id,
                familyId: createdFamilies[familyIndex].family.id,
                careType: 'FULL_TIME',
                careDays: ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY'],
                status: 'ACCEPTED'
            }
        });
        createdCareRequests.push(careRequest);
    }
    const scheduleData = [
        {
            elderId: createdElders[0].id,
            careRequestId: createdCareRequests[0].id,
            schedules: [
                {
                    day: 'MONDAY',
                    items: [
                        { title: 'Morning Medication', startTime: '08:00', endTime: '08:30' },
                        { title: 'Physical Therapy', startTime: '10:00', endTime: '11:00' },
                        { title: 'Lunch', startTime: '12:00', endTime: '13:00' },
                        { title: 'Evening Medication', startTime: '18:00', endTime: '18:30' }
                    ]
                },
                {
                    day: 'TUESDAY',
                    items: [
                        { title: 'Morning Medication', startTime: '08:00', endTime: '08:30' },
                        { title: 'Doctor Appointment', startTime: '14:00', endTime: '15:30' },
                        { title: 'Evening Medication', startTime: '18:00', endTime: '18:30' }
                    ]
                }
            ]
        },
        {
            elderId: createdElders[1].id,
            careRequestId: createdCareRequests[1].id,
            schedules: [
                {
                    day: 'MONDAY',
                    items: [
                        { title: 'Morning Care', startTime: '07:30', endTime: '08:30' },
                        { title: 'Memory Activities', startTime: '10:00', endTime: '11:00' },
                        { title: 'Afternoon Walk', startTime: '15:00', endTime: '16:00' }
                    ]
                }
            ]
        }
    ];
    for (const elderSchedule of scheduleData) {
        for (const daySchedule of elderSchedule.schedules) {
            const sortedItems = daySchedule.items.sort((a, b) => a.startTime.localeCompare(b.startTime));
            const dayStart = sortedItems[0].startTime;
            const dayEnd = sortedItems[sortedItems.length - 1].endTime;
            await prisma.schedule.create({
                data: {
                    elderId: elderSchedule.elderId,
                    careRequestId: elderSchedule.careRequestId,
                    day: daySchedule.day,
                    start: dayStart,
                    end: dayEnd,
                    scheduleItems: {
                        create: daySchedule.items.map(item => ({
                            title: item.title,
                            startTime: item.startTime,
                            endTime: item.endTime,
                            status: 'PENDING'
                        }))
                    }
                }
            });
        }
    }
    console.log('Comprehensive seed data created successfully!');
    console.log('Test accounts:');
    console.log('Admin: admin@mazicare.com / password123');
    console.log('Family: john.smith@example.com / password123');
    console.log('Family: mary.brown@example.com / password123');
    console.log('Caregiver: sarah.johnson@example.com / password123');
    console.log('Caregiver: mike.chen@example.com / password123');
}
main()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=seed.js.map
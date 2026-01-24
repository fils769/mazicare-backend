"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CaregiverService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let CaregiverService = class CaregiverService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async saveDetails(userId, data, profilePicture) {
        let caregiver = await this.prisma.caregiver.findUnique({
            where: { userId },
        });
        const caregiverData = { ...data };
        if (data.regionIds && data.regionIds.length > 0) {
            caregiverData.regionId = data.regionIds[0];
            delete caregiverData.regionIds;
        }
        if (profilePicture) {
            caregiverData.profilePicture = profilePicture;
        }
        if (caregiver) {
            return this.prisma.caregiver.update({
                where: { userId },
                data: caregiverData,
            });
        }
        return this.prisma.caregiver.create({
            data: {
                userId,
                ...caregiverData,
            },
        });
    }
    async getRegions() {
        return this.prisma.region.findMany({
            orderBy: { name: 'asc' },
        });
    }
    async saveRegionSelection(userId, data) {
        const region = await this.prisma.region.findUnique({
            where: { id: data.regionId },
        });
        if (!region) {
            throw new common_1.NotFoundException('Region not found');
        }
        let caregiver = await this.prisma.caregiver.findUnique({
            where: { userId },
        });
        if (!caregiver) {
            caregiver = await this.prisma.caregiver.create({
                data: { userId, regionId: data.regionId },
            });
        }
        else {
            caregiver = await this.prisma.caregiver.update({
                where: { userId },
                data: { regionId: data.regionId },
            });
        }
        return caregiver;
    }
    async uploadDocument(userId, documentUrl) {
        let caregiver = await this.prisma.caregiver.findUnique({
            where: { userId },
        });
        if (!caregiver) {
            caregiver = await this.prisma.caregiver.create({
                data: { userId, documentUrl },
            });
        }
        else {
            caregiver = await this.prisma.caregiver.update({
                where: { userId },
                data: { documentUrl },
            });
        }
        return { documentUrl: caregiver.documentUrl };
    }
    async uploadIdPassport(userId, idPassportPhoto) {
        let caregiver = await this.prisma.caregiver.findUnique({
            where: { userId },
        });
        if (!caregiver) {
            caregiver = await this.prisma.caregiver.create({
                data: { userId, idPassportPhoto },
            });
        }
        else {
            caregiver = await this.prisma.caregiver.update({
                where: { userId },
                data: { idPassportPhoto },
            });
        }
        return { idPassportPhoto: caregiver.idPassportPhoto };
    }
    async uploadRecommendation(userId, recommendationLetter) {
        let caregiver = await this.prisma.caregiver.findUnique({
            where: { userId },
        });
        if (!caregiver) {
            caregiver = await this.prisma.caregiver.create({
                data: { userId, recommendationLetter },
            });
        }
        else {
            caregiver = await this.prisma.caregiver.update({
                where: { userId },
                data: { recommendationLetter },
            });
        }
        return { recommendationLetter: caregiver.recommendationLetter };
    }
    async uploadCertificate(userId, certificateUrl) {
        let caregiver = await this.prisma.caregiver.findUnique({
            where: { userId },
        });
        if (!caregiver) {
            caregiver = await this.prisma.caregiver.create({
                data: { userId, certificates: [certificateUrl] },
            });
        }
        else {
            const existingCertificates = caregiver.certificates || [];
            caregiver = await this.prisma.caregiver.update({
                where: { userId },
                data: { certificates: [...existingCertificates, certificateUrl] },
            });
        }
        return { certificates: caregiver.certificates };
    }
    async getCarePrograms() {
        return this.prisma.careProgram.findMany({
            orderBy: { name: 'asc' },
        });
    }
    async saveCareProgram(userId, data) {
        const count = await this.prisma.careProgram.count({
            where: { id: { in: data.programIds } },
        });
        if (count !== data.programIds.length) {
            throw new common_1.NotFoundException('One or more care programs not found');
        }
        let caregiver = await this.prisma.caregiver.findUnique({
            where: { userId },
        });
        if (!caregiver) {
            caregiver = await this.prisma.caregiver.create({
                data: {
                    userId,
                    programs: {
                        connect: data.programIds.map((id) => ({ id })),
                    },
                },
            });
        }
        else {
            caregiver = await this.prisma.caregiver.update({
                where: { userId },
                data: {
                    programs: {
                        set: data.programIds.map((id) => ({ id })),
                    },
                },
            });
        }
        return caregiver;
    }
    async completeOnboarding(userId) {
        const caregiver = await this.prisma.caregiver.findUnique({
            where: { userId },
        });
        if (!caregiver) {
            throw new common_1.BadRequestException('Caregiver profile not found');
        }
        return this.prisma.caregiver.update({
            where: { userId },
            data: { onboardingComplete: true },
        });
    }
    async getOnboardingStatus(userId) {
        const caregiver = await this.prisma.caregiver.findUnique({
            where: { userId },
            include: {
                caregiverRegion: true,
                programs: true,
            },
        });
        if (!caregiver) {
            return {
                hasDetails: false,
                hasRegionSelection: false,
                hasDocument: false,
                hasIdPassport: false,
                hasRecommendation: false,
                hasCertificates: false,
                hasCareProgram: false,
                isComplete: false,
            };
        }
        return {
            hasDetails: !!(caregiver.firstName && caregiver.lastName),
            hasRegionSelection: !!caregiver.regionId,
            hasDocument: !!caregiver.documentUrl,
            hasIdPassport: !!caregiver.idPassportPhoto,
            hasRecommendation: !!caregiver.recommendationLetter,
            hasCertificates: !!(caregiver.certificates && caregiver.certificates.length > 0),
            hasCareProgram: caregiver.programs.length > 0,
            isComplete: caregiver.onboardingComplete,
            caregiver,
        };
    }
    async searchCaregivers(filters) {
        const caregivers = await this.prisma.caregiver.findMany({
            where: {
                onboardingComplete: true,
                ...(filters.region && {
                    caregiverRegion: {
                        name: { contains: filters.region, mode: 'insensitive' },
                    },
                }),
                ...(filters.experience && {
                    experience: { gte: parseInt(filters.experience) },
                }),
                ...(filters.search && {
                    OR: [
                        { firstName: { contains: filters.search, mode: 'insensitive' } },
                        { lastName: { contains: filters.search, mode: 'insensitive' } },
                    ],
                }),
            },
            include: {
                user: { select: { id: true, email: true } },
                caregiverRegion: true,
                reviews: {
                    select: { rating: true },
                },
            },
        });
        return caregivers.map((caregiver) => {
            const avgRating = caregiver.reviews.length > 0
                ? caregiver.reviews.reduce((sum, review) => sum + review.rating, 0) /
                    caregiver.reviews.length
                : 0;
            return {
                id: caregiver.id,
                name: `${caregiver.firstName} ${caregiver.lastName}`,
                avatar: caregiver.profilePicture,
                rating: avgRating,
                experience: `${caregiver.experience || 2}+ years`,
                region: caregiver.caregiverRegion?.name || 'Unknown',
                languages: caregiver.languages || [],
            };
        });
    }
    async getCaregiverProfile(id) {
        const caregiver = await this.prisma.caregiver.findUnique({
            where: { id },
            include: {
                user: { select: { email: true } },
                caregiverRegion: true,
                programs: true,
                reviews: {
                    select: { rating: true },
                },
            },
        });
        if (!caregiver) {
            throw new common_1.NotFoundException('Caregiver not found');
        }
        const avgRating = caregiver.reviews.length > 0
            ? caregiver.reviews.reduce((sum, review) => sum + review.rating, 0) /
                caregiver.reviews.length
            : 0;
        return {
            id: caregiver.id,
            name: `${caregiver.firstName} ${caregiver.lastName}`,
            email: caregiver.user.email,
            avatar: caregiver.profilePicture,
            rating: avgRating,
            experience: `${caregiver.experience || 2}+ years`,
            region: caregiver.caregiverRegion?.name,
            programs: caregiver.programs.map((p) => p.name),
            bio: caregiver.bio ||
                'Experienced caregiver dedicated to providing quality care.',
            languages: caregiver.languages || [],
        };
    }
    async getCaregiverReviews(id) {
        const reviews = await this.prisma.review.findMany({
            where: { caregiverId: id },
            include: {
                reviewer: {
                    select: { email: true },
                },
            },
            orderBy: { createdAt: 'desc' },
        });
        return reviews.map((review) => ({
            id: review.id,
            rating: review.rating,
            comment: review.comment,
            reviewerName: review.reviewer.email.split('@')[0],
            date: review.createdAt,
        }));
    }
    async assignCaregiver(caregiverId, elderId, userId) {
        const family = await this.prisma.family.findFirst({
            where: { userId: userId },
        });
        if (!family) {
            throw new common_1.NotFoundException('Family not found for the provided user');
        }
        const familyId = family.id;
        const caregiverData = await this.prisma.caregiver.findUnique({
            where: { id: caregiverId },
            include: { user: { select: { id: true, status: true, email: true } } },
        });
        const elderData = await this.prisma.elder.findUnique({
            where: {
                id: elderId,
                familyId: familyId,
            },
            include: { family: true },
        });
        if (!caregiverData) {
            throw new common_1.NotFoundException('Caregiver not found');
        }
        if (!elderData) {
            throw new common_1.NotFoundException('Elder not found or does not belong to your family');
        }
        if (caregiverData.user.status !== 'ACTIVE') {
            throw new common_1.BadRequestException('Caregiver is not active');
        }
        const existingRequest = await this.prisma.careRequest.findFirst({
            where: {
                elderId,
                caregiverId,
            },
        });
        if (existingRequest) {
            switch (existingRequest.status) {
                case 'PENDING':
                    throw new common_1.BadRequestException('A request is already pending for this caregiver');
                case 'ACCEPTED':
                    throw new common_1.BadRequestException('This caregiver is already assigned to this elder');
                case 'REJECTED':
                    return this.updateExistingRequest(existingRequest.id, elderId, caregiverId, familyId);
                default:
                    return this.updateExistingRequest(existingRequest.id, elderId, caregiverId, familyId);
            }
        }
        const careRequest = await this.prisma.careRequest.create({
            data: {
                elderId,
                caregiverId,
                familyId: familyId,
                status: 'PENDING',
                requestedAt: new Date(),
                careType: 'FULL_TIME',
            },
        });
        await this.prisma.notification.create({
            data: {
                userId: caregiverData.userId,
                title: 'New Care Request',
                message: JSON.stringify({
                    text: `${elderData.family.familyName} has requested you to care for ${elderData.firstName} ${elderData.lastName}`,
                    requestId: careRequest.id,
                    elderId: elderData.id,
                    familyName: elderData.family.familyName,
                    elderName: `${elderData.firstName} ${elderData.lastName}`,
                }),
                type: 'care_request',
            },
        });
        return {
            success: true,
            message: 'Care request sent successfully. Waiting for caregiver approval.',
            request: {
                id: careRequest.id,
                caregiverId,
                elderId,
                status: 'PENDING',
                requestedAt: careRequest.requestedAt,
                elder: {
                    id: elderData.id,
                    name: `${elderData.firstName} ${elderData.lastName}`,
                },
                caregiver: {
                    id: caregiverData.id,
                    name: `${caregiverData.firstName} ${caregiverData.lastName}`,
                    email: caregiverData.user.email,
                },
            },
        };
    }
    async updateExistingRequest(requestId, elderId, caregiverId, familyId) {
        const existingRequest = await this.prisma.careRequest.findUnique({
            where: { id: requestId },
            include: {
                elder: {
                    include: { family: true },
                },
                caregiver: true,
            },
        });
        if (!existingRequest) {
            throw new common_1.NotFoundException('Original request not found');
        }
        const caregiver = await this.prisma.caregiver.findUnique({
            where: { id: caregiverId },
            include: { user: { select: { id: true, email: true } } },
        });
        if (!caregiver) {
            throw new common_1.NotFoundException('Caregiver not found');
        }
        const updatedRequest = await this.prisma.careRequest.update({
            where: { id: requestId },
            data: {
                status: 'PENDING',
                requestedAt: new Date(),
                respondedAt: null,
            },
        });
        await this.prisma.notification.create({
            data: {
                userId: caregiver.userId,
                title: 'Care Request Updated',
                message: JSON.stringify({
                    text: `${existingRequest.elder.family.familyName} has sent you a new care request for ${existingRequest.elder.firstName} ${existingRequest.elder.lastName}`,
                    requestId: updatedRequest.id,
                    elderId: existingRequest.elderId,
                    familyName: existingRequest.elder.family.familyName,
                    elderName: `${existingRequest.elder.firstName} ${existingRequest.elder.lastName}`,
                    isUpdated: true,
                }),
                type: 'care_request_update',
            },
        });
        return updatedRequest;
    }
    async getMyCaregiverProfile(userId) {
        const caregiver = await this.prisma.caregiver.findUnique({
            where: { userId },
            include: {
                user: { select: { email: true } },
                caregiverRegion: true,
                programs: true,
                reviews: { select: { rating: true } },
            },
        });
        if (!caregiver) {
            throw new common_1.NotFoundException('Caregiver profile not found');
        }
        const elderCount = await this.prisma.careRequest.count({
            where: { caregiverId: caregiver.id, status: 'ACCEPTED' },
        });
        const avgRating = caregiver.reviews.length > 0
            ? caregiver.reviews.reduce((sum, r) => sum + r.rating, 0) /
                caregiver.reviews.length
            : 0;
        return {
            id: caregiver.id,
            firstName: caregiver.firstName,
            lastName: caregiver.lastName,
            name: `${caregiver.firstName} ${caregiver.lastName}`,
            email: caregiver.email || caregiver.user.email,
            phone: caregiver.phone,
            avatar: caregiver.profilePicture,
            bio: caregiver.bio,
            rating: avgRating,
            reviewCount: caregiver.reviews.length,
            experience: caregiver.experience,
            region: caregiver.caregiverRegion?.name,
            programs: caregiver.programs.map((p) => p.name),
            elderCount,
            onboardingComplete: caregiver.onboardingComplete,
            languages: caregiver.languages || [],
            documents: {
                profilePicture: caregiver.profilePicture,
                idPassportPhoto: caregiver.idPassportPhoto,
                recommendationLetter: caregiver.recommendationLetter,
                certificates: caregiver.certificates || [],
                documentUrl: caregiver.documentUrl,
            },
        };
    }
    async getMyElders(userId) {
        const caregiver = await this.prisma.caregiver.findUnique({
            where: { userId },
            select: { id: true },
        });
        if (!caregiver) {
            throw new common_1.NotFoundException('Caregiver profile not found');
        }
        const careRequests = await this.prisma.careRequest.findMany({
            where: { caregiverId: caregiver.id, status: 'ACCEPTED' },
            include: {
                elder: {
                    include: {
                        family: { select: { familyName: true, userId: true } },
                        program: { select: { name: true } },
                        schedules: { include: { scheduleItems: true } },
                    },
                },
            },
        });
        return careRequests.map((cr) => {
            const elder = cr.elder;
            return {
                id: elder.id,
                firstName: elder.firstName,
                lastName: elder.lastName,
                name: `${elder.firstName} ${elder.lastName}`,
                dateOfBirth: elder.dateOfBirth,
                gender: elder.gender,
                description: elder.description,
                profilePicture: elder.profilePicture,
                familyName: elder.family.familyName,
                careProgram: elder.program?.name,
                scheduleCount: elder.schedules.length,
            };
        });
    }
    async getMyElderCount(userId) {
        const caregiver = await this.prisma.caregiver.findUnique({
            where: { userId },
            select: { id: true },
        });
        if (!caregiver) {
            throw new common_1.NotFoundException('Caregiver profile not found');
        }
        const count = await this.prisma.careRequest.count({
            where: { caregiverId: caregiver.id, status: 'ACCEPTED' },
        });
        return { count };
    }
    async getMyRating(userId) {
        const caregiver = await this.prisma.caregiver.findUnique({
            where: { userId },
            include: {
                reviews: { select: { rating: true, comment: true, createdAt: true } },
            },
        });
        if (!caregiver) {
            throw new common_1.NotFoundException('Caregiver profile not found');
        }
        const avgRating = caregiver.reviews.length > 0
            ? caregiver.reviews.reduce((sum, review) => sum + review.rating, 0) /
                caregiver.reviews.length
            : 0;
        return {
            averageRating: Math.round(avgRating * 10) / 10,
            totalReviews: caregiver.reviews.length,
            reviews: caregiver.reviews,
        };
    }
    async getMySchedules(userId) {
        const caregiver = await this.prisma.caregiver.findUnique({
            where: { userId },
            select: { id: true },
        });
        if (!caregiver) {
            throw new common_1.NotFoundException('Caregiver profile not found');
        }
        const careRequests = await this.prisma.careRequest.findMany({
            where: { caregiverId: caregiver.id, status: 'ACCEPTED' },
            include: {
                elder: {
                    include: {
                        schedules: {
                            include: { scheduleItems: { orderBy: { startTime: 'asc' } } },
                            orderBy: { day: 'asc' },
                        },
                        family: { select: { familyName: true } },
                    },
                },
            },
        });
        return careRequests.map((cr) => ({
            elderId: cr.elder.id,
            elderName: `${cr.elder.firstName} ${cr.elder.lastName}`,
            schedules: cr.elder.schedules,
        }));
    }
    async getElderSchedules(userId, elderId) {
        const caregiver = await this.prisma.caregiver.findUnique({
            where: { userId },
            select: { id: true },
        });
        if (!caregiver) {
            throw new common_1.NotFoundException('Caregiver profile not found');
        }
        const careRequest = await this.prisma.careRequest.findFirst({
            where: { caregiverId: caregiver.id, elderId, status: 'ACCEPTED' },
            include: {
                elder: {
                    include: {
                        schedules: {
                            include: { scheduleItems: { orderBy: { startTime: 'asc' } } },
                            orderBy: { day: 'asc' },
                        },
                        family: { select: { familyName: true } },
                    },
                },
            },
        });
        if (!careRequest) {
            throw new common_1.NotFoundException('Elder not found or not assigned to you');
        }
        const elder = careRequest.elder;
        return {
            elderId: elder.id,
            elderName: `${elder.firstName} ${elder.lastName}`,
            schedules: elder.schedules,
        };
    }
    async updateScheduleItem(userId, itemId, data) {
        const caregiver = await this.prisma.caregiver.findUnique({
            where: { userId },
            select: { id: true },
        });
        if (!caregiver) {
            throw new common_1.NotFoundException('Caregiver profile not found');
        }
        const scheduleItem = await this.prisma.scheduleItem.findUnique({
            where: { id: itemId },
            include: {
                schedule: {
                    include: {
                        elder: true,
                        careRequest: true,
                    },
                },
            },
        });
        if (!scheduleItem) {
            throw new common_1.NotFoundException('Schedule item not found');
        }
        const assigned = await this.prisma.careRequest.findFirst({
            where: {
                id: scheduleItem.schedule.careRequestId,
                caregiverId: caregiver.id,
                status: 'ACCEPTED',
            },
        });
        if (!assigned) {
            throw new common_1.ForbiddenException('You are not assigned to this elder');
        }
        return this.prisma.scheduleItem.update({
            where: { id: itemId },
            data: {
                ...(data.title && { title: data.title }),
                ...(data.description !== undefined && {
                    description: data.description,
                }),
                ...(data.startTime && { startTime: data.startTime }),
                ...(data.endTime && { endTime: data.endTime }),
                ...(data.status && { status: data.status }),
            },
        });
    }
    async updateScheduleItemStatus(userId, itemId, status) {
        const caregiver = await this.prisma.caregiver.findUnique({
            where: { userId },
            select: { id: true },
        });
        if (!caregiver) {
            throw new common_1.NotFoundException('Caregiver profile not found');
        }
        const scheduleItem = await this.prisma.scheduleItem.findUnique({
            where: { id: itemId },
            include: { schedule: true },
        });
        if (!scheduleItem) {
            throw new common_1.NotFoundException('Schedule item not found');
        }
        const assigned = await this.prisma.careRequest.findFirst({
            where: {
                id: scheduleItem.schedule.careRequestId,
                caregiverId: caregiver.id,
                status: 'ACCEPTED',
            },
        });
        if (!assigned) {
            throw new common_1.ForbiddenException('You are not assigned to this elder');
        }
        return this.prisma.scheduleItem.update({
            where: { id: itemId },
            data: { status: status },
        });
    }
    async getElderRequests(userId) {
        const caregiver = await this.prisma.caregiver.findUnique({
            where: { userId },
            select: { id: true },
        });
        if (!caregiver) {
            throw new common_1.NotFoundException('Caregiver profile not found');
        }
        const pendingRequests = await this.prisma.careRequest.findMany({
            where: {
                caregiverId: caregiver.id,
                status: 'PENDING',
            },
            include: {
                elder: {
                    include: {
                        program: { select: { name: true } },
                    },
                },
                family: {
                    select: {
                        familyName: true,
                        region: true,
                        user: { select: { email: true } },
                    },
                },
            },
            orderBy: { createdAt: 'desc' },
        });
        return pendingRequests.map((request) => ({
            requestId: request.id,
            elderId: request.elder.id,
            firstName: request.elder.firstName,
            lastName: request.elder.lastName,
            name: `${request.elder.firstName} ${request.elder.lastName}`,
            dateOfBirth: request.elder.dateOfBirth,
            gender: request.elder.gender,
            description: request.elder.description,
            profilePicture: request.elder.profilePicture,
            familyName: request.family.familyName,
            familyEmail: request.family.user.email,
            familyRegion: request.family.region,
            careProgram: request.elder.program?.name,
            requestedAt: request.requestedAt,
            status: request.status,
        }));
    }
    async searchFamilies(filters) {
        const families = await this.prisma.family.findMany({
            where: {
                onboardingComplete: true,
                ...(filters.region && {
                    region: { contains: filters.region, mode: 'insensitive' },
                }),
                ...(filters.search && {
                    OR: [
                        { familyName: { contains: filters.search, mode: 'insensitive' } },
                        { careFor: { contains: filters.search, mode: 'insensitive' } },
                    ],
                }),
            },
            include: {
                user: { select: { id: true, email: true } },
                elders: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        careRequests: {
                            where: { status: 'ACCEPTED' },
                            select: { id: true },
                        },
                    },
                },
            },
        });
        return families.map(family => ({
            id: family.id,
            userId: family.user.id,
            name: family.familyName || 'Family',
            email: family.user.email,
            profilePicture: family.profilePicture,
            region: family.region,
            careFor: family.careFor,
            ageGroup: family.ageGroup,
            language: family.language,
            careTypes: family.careTypes,
            elderCount: family.elders.length,
            elders: family.elders.map(elder => ({
                id: elder.id,
                name: `${elder.firstName} ${elder.lastName}`,
                hasCaregiver: elder.careRequests.length > 0,
            })),
        }));
    }
};
exports.CaregiverService = CaregiverService;
exports.CaregiverService = CaregiverService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CaregiverService);
//# sourceMappingURL=caregiver.service.js.map
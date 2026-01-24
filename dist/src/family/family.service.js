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
exports.FamilyService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let FamilyService = class FamilyService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getFamilyRequests(userId, elderId) {
        const family = await this.prisma.family.findUnique({
            where: { userId },
            select: { id: true }
        });
        if (!family) {
            throw new common_1.NotFoundException('Family not found');
        }
        const where = { familyId: family.id };
        if (elderId) {
            where.elderId = elderId;
        }
        const requests = await this.prisma.careRequest.findMany({
            where,
            include: {
                elder: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        dateOfBirth: true,
                        gender: true
                    }
                },
                caregiver: {
                    include: {
                        user: {
                            select: {
                                email: true
                            }
                        }
                    }
                }
            },
            orderBy: {
                requestedAt: 'desc'
            }
        });
        return requests.map(request => ({
            id: request.id,
            status: request.status,
            requestedAt: request.requestedAt,
            respondedAt: request.respondedAt,
            elder: {
                id: request.elder.id,
                name: `${request.elder.firstName} ${request.elder.lastName}`,
                dateOfBirth: request.elder.dateOfBirth,
                gender: request.elder.gender
            },
            caregiver: request.caregiver ? {
                id: request.caregiver.id,
                name: `${request.caregiver.firstName} ${request.caregiver.lastName}`,
                email: request.caregiver.user.email,
                phone: request.caregiver.phone
            } : null
        }));
    }
    async getRequestStatus(userId, requestId) {
        const family = await this.prisma.family.findUnique({
            where: { userId },
            select: { id: true }
        });
        if (!family) {
            throw new common_1.NotFoundException('Family not found');
        }
        const request = await this.prisma.careRequest.findFirst({
            where: {
                id: requestId,
                familyId: family.id
            },
            include: {
                elder: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true
                    }
                },
                caregiver: {
                    include: {
                        user: {
                            select: {
                                email: true
                            }
                        }
                    }
                }
            }
        });
        if (!request) {
            throw new common_1.NotFoundException('Request not found or access denied');
        }
        return {
            id: request.id,
            status: request.status,
            requestedAt: request.requestedAt,
            respondedAt: request.respondedAt,
            elder: {
                id: request.elder.id,
                name: `${request.elder.firstName} ${request.elder.lastName}`
            },
            caregiver: request.caregiver ? {
                id: request.caregiver.id,
                name: `${request.caregiver.firstName} ${request.caregiver.lastName}`,
                email: request.caregiver.user.email,
                phone: request.caregiver.phone
            } : null,
            message: this.getStatusMessage(request.status)
        };
    }
    getStatusMessage(status) {
        switch (status) {
            case 'PENDING':
                return 'Your request is pending caregiver response';
            case 'ACCEPTED':
                return 'Your request has been accepted by the caregiver';
            case 'REJECTED':
                return 'Your request was declined by the caregiver';
            default:
                return 'Request status unknown';
        }
    }
    async saveOnboardingData(userId, data, profilePicture) {
        let family = await this.prisma.family.findUnique({
            where: { userId }
        });
        const familyData = {
            familyName: data.familyName,
            careFor: data.careFor,
            ageGroup: data.ageGroup,
            region: data.region,
            language: data.language,
            careTypes: data.careTypes,
            schedule: data.schedule,
            daysHours: data.daysHours,
            genderPreference: data.genderPreference,
            experienceLevel: data.experienceLevel,
            backgroundCheck: data.backgroundCheck,
            ...(data.phone && { phone: data.phone }),
            ...(profilePicture && { profilePicture })
        };
        if (family) {
            return this.prisma.family.update({
                where: { userId },
                data: familyData
            });
        }
        return this.prisma.family.create({
            data: {
                userId,
                ...familyData
            }
        });
    }
    async getCaregivers(filters) {
        const caregivers = await this.prisma.caregiver.findMany({
            where: {
                onboardingComplete: true,
                ...(filters.region && { region: filters.region }),
                ...(filters.genderPreference && { gender: filters.genderPreference })
            },
            include: {
                user: {
                    select: { id: true, email: true }
                },
                caregiverRegion: true,
                reviews: {
                    select: { rating: true }
                }
            }
        });
        return caregivers.map(caregiver => {
            const avgRating = caregiver.reviews.length > 0
                ? caregiver.reviews.reduce((sum, review) => sum + review.rating, 0) / caregiver.reviews.length
                : 4.5;
            return {
                id: caregiver.id,
                userId: caregiver.user.id,
                name: `${caregiver.firstName} ${caregiver.lastName}`,
                email: caregiver.email || caregiver.user.email,
                phone: caregiver.phone,
                region: caregiver.caregiverRegion?.name,
                avatar: caregiver.profilePicture,
                rating: avgRating,
                experience: `${caregiver.experience || 2}+ years`,
                monthlyRate: Math.floor(Math.random() * 2000) + 1000,
                availability: 'Full-time',
                specialties: ['Elder Care', 'Disability Support'],
                distance: '2.5 km'
            };
        });
    }
    async getRegions() {
        return this.prisma.region.findMany({
            orderBy: { name: 'asc' }
        });
    }
    async getLanguages() {
        return this.prisma.language.findMany({
            orderBy: { name: 'asc' }
        });
    }
    async completeOnboarding(userId) {
        const family = await this.prisma.family.findUnique({
            where: { userId }
        });
        if (!family) {
            throw new common_1.BadRequestException('Family profile not found');
        }
        return this.prisma.family.update({
            where: { userId },
            data: { onboardingComplete: true }
        });
    }
    async getProfileStatus(userId) {
        const family = await this.prisma.family.findUnique({
            where: { userId }
        });
        if (!family) {
            return {
                completed: false,
                profileComplete: false,
                userId
            };
        }
        const profileComplete = !!(family.familyName && family.careFor && family.region);
        return {
            completed: family.onboardingComplete,
            profileComplete,
            userId,
        };
    }
    async getOnboardingData(userId) {
        const family = await this.prisma.family.findUnique({
            where: { userId }
        });
        return family || {};
    }
    async getElders(userId) {
        const family = await this.prisma.family.findUnique({
            where: { userId },
            include: {
                elders: {
                    include: {
                        program: { select: { name: true } },
                        careRequests: {
                            where: { status: 'ACCEPTED' },
                            include: {
                                caregiver: {
                                    select: {
                                        firstName: true,
                                        lastName: true,
                                        email: true,
                                        profilePicture: true,
                                        user: { select: { email: true } },
                                    },
                                },
                            },
                        },
                    },
                },
            },
        });
        if (!family) {
            return [];
        }
        return family.elders.map(elder => {
            const caregiverRequest = elder.careRequests[0];
            const caregiver = caregiverRequest?.caregiver;
            return {
                id: elder.id,
                firstName: elder.firstName,
                lastName: elder.lastName,
                careProgram: elder.program?.name || null,
                careGiver: caregiver
                    ? `${caregiver.firstName} ${caregiver.lastName}`
                    : null,
                caregiverEmail: caregiver
                    ? caregiver.email || caregiver.user.email
                    : null,
                caregiverProfile: caregiver?.profilePicture || null,
                DOB: elder.dateOfBirth,
                Gender: elder.gender.toLowerCase(),
                description: elder.description,
                profilePicture: elder.profilePicture,
            };
        });
    }
    async registerElder(userId, elderData, profilePicture) {
        console.log('=== Service registerElder Debug ===');
        console.log('userId:', userId);
        console.log('elderData:', elderData);
        console.log('profilePicture URL:', profilePicture);
        let dateOfBirth = new Date('1940-01-01');
        if (elderData.dateOfBirth) {
            const parsedDate = new Date(elderData.dateOfBirth);
            if (isNaN(parsedDate.getTime())) {
                throw new common_1.BadRequestException('Invalid date of birth provided');
            }
            dateOfBirth = parsedDate;
        }
        const family = await this.prisma.family.findUnique({
            where: { userId },
            select: { id: true }
        });
        if (!family) {
            throw new common_1.BadRequestException('Family not found');
        }
        const createData = {
            familyId: family.id,
            firstName: elderData.firstName,
            lastName: elderData.lastName,
            dateOfBirth,
            gender: elderData.Gender?.toUpperCase() || 'OTHER',
            description: elderData.description,
            ...(elderData.careGiver && { careGiverId: elderData.careGiver }),
            ...(elderData.careProgramm && { programId: elderData.careProgramm }),
            ...(profilePicture && { profilePicture })
        };
        console.log('Final create data:', createData);
        const result = await this.prisma.elder.create({
            data: createData
        });
        console.log('Created elder result:', result);
        return result;
    }
    async updateElder(userId, elderId, elderData) {
        const elder = await this.prisma.elder.findFirst({
            where: {
                id: elderId,
                familyId: userId
            }
        });
        if (!elder) {
            throw new common_1.BadRequestException('Elder not found or access denied');
        }
        const updateData = {
            firstName: elderData.firstName,
            lastName: elderData.lastName,
            ...(elderData.careProgramm && { programId: elderData.careProgramm }),
            gender: elderData.Gender?.toUpperCase(),
            description: elderData.description
        };
        if (elderData.dateOfBirth) {
            const parsedDate = new Date(elderData.dateOfBirth);
            if (isNaN(parsedDate.getTime())) {
                throw new common_1.BadRequestException('Invalid date of birth provided');
            }
            updateData.dateOfBirth = parsedDate;
        }
        if (elderData.careGiver) {
            updateData.careGiverId = elderData.careGiver;
        }
        return this.prisma.elder.update({
            where: { id: elderId },
            data: updateData
        });
    }
    async removeElder(userId, elderId) {
        const elder = await this.prisma.elder.findFirst({
            where: {
                id: elderId,
                familyId: userId
            }
        });
        if (!elder) {
            throw new common_1.BadRequestException('Elder not found or access denied');
        }
        await this.prisma.elder.delete({
            where: { id: elderId }
        });
        return {
            success: true,
            message: 'Elder removed successfully',
            elderId
        };
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
                    include: {
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
                age: elder.dateOfBirth
                    ? new Date().getFullYear() - new Date(elder.dateOfBirth).getFullYear()
                    : null,
                gender: elder.gender,
                hasCaregiver: elder.careRequests.length > 0,
            })),
        }));
    }
};
exports.FamilyService = FamilyService;
exports.FamilyService = FamilyService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], FamilyService);
//# sourceMappingURL=family.service.js.map
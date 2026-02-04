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
exports.UserService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let UserService = class UserService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getProfile(userId) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            include: {
                caregiver: {
                    include: {
                        caregiverRegion: true,
                        programs: true
                    }
                },
                family: true
            }
        });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        const { password, caregiver, family, ...userWithoutPassword } = user;
        let displayName = null;
        let profileData = null;
        if (user.role === 'ADMIN') {
            displayName = 'ADMIN';
            return {
                ...userWithoutPassword,
                role: user.role,
                displayName,
                profile: {
                    profilePicture: user.profilePicture
                }
            };
        }
        if (user.role === 'CAREGIVER' && caregiver) {
            displayName =
                caregiver.firstName && caregiver.lastName
                    ? `${caregiver.firstName} ${caregiver.lastName}`
                    : caregiver.firstName || caregiver.lastName || null;
            profileData = {
                firstName: caregiver.firstName,
                lastName: caregiver.lastName,
                bio: caregiver.bio,
                profilePicture: caregiver.profilePicture,
                phone: caregiver.phone,
                region: caregiver.caregiverRegion,
                programs: caregiver.programs,
                onboardingComplete: caregiver.onboardingComplete
            };
        }
        if (user.role === 'FAMILY' && family) {
            displayName = family.familyName || null;
            profileData = {
                familyName: family.familyName,
                careFor: family.careFor,
                ageGroup: family.ageGroup,
                region: family.region,
                language: family.language,
                profilePicture: family.profilePicture,
                phone: family.phone,
                careTypes: family.careTypes,
                schedule: family.schedule,
                daysHours: family.daysHours,
                genderPreference: family.genderPreference,
                experienceLevel: family.experienceLevel,
                backgroundCheck: family.backgroundCheck,
                onboardingComplete: family.onboardingComplete
            };
        }
        return {
            ...userWithoutPassword,
            role: user.role,
            displayName,
            profile: profileData
        };
    }
    async updateProfile(userId, data) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            include: {
                caregiver: true,
                family: true
            }
        });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        if (data.email) {
            await this.prisma.user.update({
                where: { id: userId },
                data: { email: data.email }
            });
        }
        if (user.role === 'CAREGIVER' && user.caregiver) {
            await this.prisma.caregiver.update({
                where: { userId },
                data: {
                    ...(data.firstName && { firstName: data.firstName }),
                    ...(data.lastName && { lastName: data.lastName }),
                    ...(data.phone && { phone: data.phone }),
                    ...(data.bio && { bio: data.bio }),
                }
            });
        }
        else if (user.role === 'FAMILY' && user.family) {
            await this.prisma.family.update({
                where: { userId },
                data: {
                    ...(data.phone && { phone: data.phone }),
                }
            });
        }
        return this.getProfile(userId);
    }
    async updateProfilePicture(userId, profilePictureUrl) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            include: {
                caregiver: true,
                family: true
            }
        });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        if (user.role === 'CAREGIVER') {
            if (!user.caregiver) {
                throw new common_1.NotFoundException('Caregiver profile not found. Please complete onboarding first.');
            }
            await this.prisma.caregiver.update({
                where: { userId },
                data: { profilePicture: profilePictureUrl }
            });
        }
        else if (user.role === 'FAMILY') {
            if (!user.family) {
                throw new common_1.NotFoundException('Family profile not found. Please complete onboarding first.');
            }
            await this.prisma.family.update({
                where: { userId },
                data: { profilePicture: profilePictureUrl }
            });
        }
        else if (user.role === 'ADMIN') {
            await this.prisma.user.update({
                where: { id: userId },
                data: { profilePicture: profilePictureUrl }
            });
        }
        else {
            throw new common_1.NotFoundException('User profile not found');
        }
        return this.getProfile(userId);
    }
};
exports.UserService = UserService;
exports.UserService = UserService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], UserService);
//# sourceMappingURL=user.service.js.map
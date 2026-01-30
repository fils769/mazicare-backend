import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { FamilyOnboardingDto } from './dto/family.dto';

@Injectable()
export class FamilyService {
  constructor(private prisma: PrismaService) { }

  async getFamilyRequests(userId: string, elderId?: string) {
    // Find the family by userId
    const family = await this.prisma.family.findUnique({
      where: { userId },
      select: { id: true }
    });

    if (!family) {
      throw new NotFoundException('Family not found');
    }

    // Build the where clause
    const where: any = { familyId: family.id };
    if (elderId) {
      where.elderId = elderId;
    }

    // Get all care requests for this family
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

  async getRequestStatus(userId: string, requestId: string) {
    // Find the family by userId
    const family = await this.prisma.family.findUnique({
      where: { userId },
      select: { id: true }
    });

    if (!family) {
      throw new NotFoundException('Family not found');
    }

    // Get the specific request
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
      throw new NotFoundException('Request not found or access denied');
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

  private getStatusMessage(status: string): string {
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

  async saveOnboardingData(userId: string, data: FamilyOnboardingDto, profilePicture?: string) {
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

  async getCaregivers(filters: any) {
    const caregivers = await this.prisma.caregiver.findMany({
      where: {
        onboardingComplete: true,
        ...(filters.region && { region: filters.region }),
        ...(filters.genderPreference && { gender: filters.genderPreference }),
      },
      include: {
        user: {
          select: { id: true, email: true },
        },
        caregiverRegion: true,
        reviews: {
          select: { rating: true },
        },
      },
    });
  
    return caregivers.map((caregiver) => {
      const reviewCount = caregiver.reviews.length;
  
      const avgRating =
        reviewCount > 0
          ? caregiver.reviews.reduce(
              (sum, review) => sum + review.rating,
              0,
            ) / reviewCount
          : 0;
  
      return {
        id: caregiver.id,
        userId: caregiver.user.id,
        name: `${caregiver.firstName} ${caregiver.lastName}`,
        email: caregiver.email || caregiver.user.email,
        phone: caregiver.phone,
        region: caregiver.caregiverRegion?.name,
        avatar: caregiver.profilePicture,
  
        rating: Number(avgRating.toFixed(1)),
        reviewCount,
  
        experience: `${caregiver.experience || 2}+ years`,
        monthlyRate: Math.floor(Math.random() * 2000) + 1000,
        availability: 'Full-time',
        specialties: ['Elder Care', 'Disability Support'],
        distance: '2.5 km',
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

  async completeOnboarding(userId: string) {
    const family = await this.prisma.family.findUnique({
      where: { userId }
    });

    if (!family) {
      throw new BadRequestException('Family profile not found');
    }

    return this.prisma.family.update({
      where: { userId },
      data: { onboardingComplete: true }
    });
  }

  async getProfileStatus(userId: string) {
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

  async getOnboardingData(userId: string) {
    const family = await this.prisma.family.findUnique({
      where: { userId }
    });

    return family || {};
  }

  // Elder Management
  async getElders(userId: string) {
    const family = await this.prisma.family.findUnique({
      where: { userId },
      include: {
        elders: {
          include: {
            program: { select: { name: true } },
            careRequests: {
              where: { status: 'ACCEPTED' }, // only accepted caregiver assignments
              include: {
                caregiver: {
                  select: {
                    id: true,
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
      const caregiverRequest = elder.careRequests[0]; // take the first accepted caregiver if any
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
        caregiverId: caregiver?.id || null,
        DOB: elder.dateOfBirth,
        Gender: elder.gender.toLowerCase(),
        description: elder.description,
        profilePicture: elder.profilePicture,
        familyId: elder.familyId
      };
    });
  }
  

  async registerElder(userId: string, elderData: any, profilePicture?: string) {
    console.log('=== Service registerElder Debug ===');
    console.log('userId:', userId);
    console.log('elderData:', elderData);
    console.log('profilePicture URL:', profilePicture);

    let dateOfBirth = new Date('1940-01-01');

    if (elderData.dateOfBirth) {
      const parsedDate = new Date(elderData.dateOfBirth);
      if (isNaN(parsedDate.getTime())) {
        throw new BadRequestException('Invalid date of birth provided');
      }
      dateOfBirth = parsedDate;
    }

    const family = await this.prisma.family.findUnique({
      where: { userId },
      select: { id: true }
    });

    if (!family) {
      throw new BadRequestException('Family not found');
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

  async updateElder(userId: string, elderId: string, elderData: any) {
    // Verify elder belongs to this family
    const elder = await this.prisma.elder.findFirst({
      where: {
        id: elderId,
        familyId: userId
      }
    });

    if (!elder) {
      throw new BadRequestException('Elder not found or access denied');
    }

    const updateData: any = {
      firstName: elderData.firstName,
      lastName: elderData.lastName,
      ...(elderData.careProgramm && { programId: elderData.careProgramm }),
      gender: elderData.Gender?.toUpperCase(),
      description: elderData.description
    };

    if (elderData.dateOfBirth) {
      const parsedDate = new Date(elderData.dateOfBirth);
      if (isNaN(parsedDate.getTime())) {
        throw new BadRequestException('Invalid date of birth provided');
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

  async removeElder(userId: string, elderId: string) {
    // Verify elder belongs to this family
    const elder = await this.prisma.elder.findFirst({
      where: {
        id: elderId,
        familyId: userId
      }
    });

    if (!elder) {
      throw new BadRequestException('Elder not found or access denied');
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

  async searchFamilies(filters: any) {
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
              where: { status: 'ACCEPTED' }, // only accepted caregiver assignments
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
        hasCaregiver: elder.careRequests.length > 0, // true if accepted caregiver exists
      })),
    }));
  }
  
}
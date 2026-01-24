import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateProfileDto } from './dto/user.dto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) { }

  async getProfile(userId: string) {
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
      throw new NotFoundException('User not found');
    }

    const { password, caregiver, family, ...userWithoutPassword } = user;

    let displayName: string | null = null;
    let profileData: any = null;

    //  ADMIN CASE
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

    // CAREGIVER CASE
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

    //  FAMILY CASE
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

  async updateProfile(userId: string, data: UpdateProfileDto) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        caregiver: true,
        family: true
      }
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // 1. Update User table (email only)
    if (data.email) {
      await this.prisma.user.update({
        where: { id: userId },
        data: { email: data.email }
      });
    }

    // 2. Update based on role
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
    } else if (user.role === 'FAMILY' && user.family) {
      await this.prisma.family.update({
        where: { userId },
        data: {
          ...(data.phone && { phone: data.phone }),
          // Families usually update other details via specific endpoints, 
          // but phone is common here.
        }
      });
    }

    return this.getProfile(userId);
  }



  async updateProfilePicture(userId: string, profilePictureUrl: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        caregiver: true,
        family: true
      }
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Update based on user role
    if (user.role === 'CAREGIVER') {
      if (!user.caregiver) {
        throw new NotFoundException('Caregiver profile not found. Please complete onboarding first.');
      }
      await this.prisma.caregiver.update({
        where: { userId },
        data: { profilePicture: profilePictureUrl }
      });
    } else if (user.role === 'FAMILY') {
      if (!user.family) {
        throw new NotFoundException('Family profile not found. Please complete onboarding first.');
      }
      await this.prisma.family.update({
        where: { userId },
        data: { profilePicture: profilePictureUrl }
      });
    } else if (user.role === 'ADMIN') {
      // For admin users, store profile picture in User table
      await this.prisma.user.update({
        where: { id: userId },
        data: { profilePicture: profilePictureUrl }
      });
    } else {
      throw new NotFoundException('User profile not found');
    }

    // Return updated profile
    return this.getProfile(userId);
  }


}
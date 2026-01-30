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
exports.CareRequestService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const create_care_request_dto_1 = require("./dto/create-care-request.dto");
const client_1 = require("@prisma/client");
let CareRequestService = class CareRequestService {
    prisma;
    defaultScheduleItems = [
        {
            title: 'Morning Medication & Breakfast',
            startTime: '08:00',
            endTime: '09:00',
            description: 'Administer morning medication and assist with breakfast',
        },
        {
            title: 'Personal Care',
            startTime: '10:00',
            endTime: '11:00',
            description: 'Assist with bathing, grooming, and dressing',
        },
        {
            title: 'Lunch & Medication',
            startTime: '12:30',
            endTime: '13:30',
            description: 'Assist with lunch and administer midday medication',
        },
        {
            title: 'Afternoon Activities',
            startTime: '15:00',
            endTime: '16:00',
            description: 'Light exercise and social activities',
        },
        {
            title: 'Dinner & Medication',
            startTime: '18:00',
            endTime: '19:00',
            description: 'Assist with dinner and administer evening medication',
        },
        {
            title: 'Evening Care',
            startTime: '20:00',
            endTime: '21:00',
            description: 'Prepare for bed and assist with nighttime routine',
        },
    ];
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createCareRequest(userId, dto) {
        if (dto.careType === 'PART_TIME' &&
            (!dto.careDays || dto.careDays.length === 0)) {
            throw new common_1.BadRequestException('careDays required for PART_TIME');
        }
        if (dto.careType === 'FULL_TIME' && dto.careDays?.length) {
            throw new common_1.BadRequestException('careDays not allowed for FULL_TIME');
        }
        return this.prisma.$transaction(async (tx) => {
            const [family, elder, caregiver, duplicatePending] = await Promise.all([
                tx.family.findFirst({ where: { userId } }),
                tx.elder.findFirst({ where: { id: dto.elderId } }),
                tx.caregiver.findUnique({ where: { id: dto.caregiverId } }),
                tx.careRequest.findFirst({
                    where: {
                        elderId: dto.elderId,
                        caregiverId: dto.caregiverId,
                        status: 'PENDING',
                    },
                }),
            ]);
            if (!family)
                throw new common_1.NotFoundException('Family not found');
            if (!elder)
                throw new common_1.NotFoundException('Elder not found');
            if (elder.familyId !== family.id)
                throw new common_1.ForbiddenException('Elder does not belong to this family');
            if (!caregiver)
                throw new common_1.NotFoundException('Caregiver not found');
            if (duplicatePending)
                throw new common_1.ConflictException('Pending request already exists');
            return tx.careRequest.create({
                data: {
                    elderId: elder.id,
                    caregiverId: caregiver.id,
                    familyId: family.id,
                    careType: dto.careType,
                    careDays: dto.careType === 'PART_TIME' ? dto.careDays : [],
                    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
                },
            });
        });
    }
    async acceptCareRequest(userId, requestId) {
        return this.prisma.$transaction(async (tx) => {
            const request = await tx.careRequest.findUnique({
                where: { id: requestId },
                include: { caregiver: true },
            });
            if (!request)
                throw new common_1.NotFoundException();
            if (request.caregiver.userId !== userId)
                throw new common_1.ForbiddenException();
            if (request.status !== 'PENDING')
                throw new common_1.BadRequestException('Request not pending');
            const [acceptedRequest] = await Promise.all([
                tx.careRequest.update({
                    where: { id: request.id },
                    data: { status: 'ACCEPTED', respondedAt: new Date() },
                }),
                tx.careRequest.updateMany({
                    where: {
                        elderId: request.elderId,
                        status: 'PENDING',
                        NOT: { id: request.id },
                    },
                    data: { status: 'REJECTED' },
                }),
            ]);
            await this.createSchedulesForAcceptedRequest(tx, request);
            return acceptedRequest;
        });
    }
    async createSchedulesForAcceptedRequest(tx, request) {
        const days = request.careType === 'FULL_TIME'
            ? Object.values(create_care_request_dto_1.DayOfWeek)
            : request.careDays;
        const schedules = await Promise.all(days.map((day) => tx.schedule.create({
            data: {
                elderId: request.elderId,
                careRequestId: request.id,
                day,
                start: '08:00',
                end: '21:00',
            },
        })));
        const allScheduleItems = schedules.flatMap((schedule) => this.defaultScheduleItems.map((item) => ({
            scheduleId: schedule.id,
            title: item.title,
            description: item.description,
            startTime: item.startTime,
            endTime: item.endTime,
        })));
        await tx.scheduleItem.createMany({
            data: allScheduleItems,
        });
    }
    async findAllForUser(userId) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            include: {
                family: true,
                caregiver: true,
            },
        });
        if (!user)
            throw new common_1.NotFoundException('User not found');
        if (user.role === 'FAMILY' && user.family) {
            return this.prisma.careRequest.findMany({
                where: { familyId: user.family.id },
            });
        }
        else if (user.role === 'CAREGIVER' && user.caregiver) {
            return this.prisma.careRequest.findMany({
                where: { caregiverId: user.caregiver.id },
            });
        }
        return [];
    }
    async findOne(userId, requestId) {
        const request = await this.prisma.careRequest.findUnique({
            where: { id: requestId },
            include: {
                caregiver: { include: { user: true } },
                family: { include: { user: true } },
            },
        });
        if (!request)
            throw new common_1.NotFoundException('Care request not found');
        const isFamilyOwner = request.family.userId === userId;
        const isCaregiverOwner = request.caregiver.userId === userId;
        if (!isFamilyOwner && !isCaregiverOwner) {
            throw new common_1.ForbiddenException();
        }
        return request;
    }
    async update(userId, requestId, dto) {
        const request = await this.prisma.careRequest.findUnique({
            where: { id: requestId },
            include: { family: { include: { user: true } } },
        });
        if (!request)
            throw new common_1.NotFoundException('Care request not found');
        if (request.status !== 'PENDING')
            throw new common_1.BadRequestException('Cannot update non-pending request');
        if (request.family.userId !== userId)
            throw new common_1.ForbiddenException();
        return this.prisma.careRequest.update({
            where: { id: requestId },
            data: {
                careType: dto.careType ?? request.careType,
                careDays: dto.careDays ?? request.careDays,
                status: dto.status ?? request.status,
            },
        });
    }
    async remove(userId, requestId) {
        const request = await this.prisma.careRequest.findUnique({
            where: { id: requestId },
            include: { family: { include: { user: true } } },
        });
        if (!request)
            throw new common_1.NotFoundException('Care request not found');
        if (request.status !== 'PENDING')
            throw new common_1.BadRequestException('Cannot delete non-pending request');
        if (request.family.userId !== userId)
            throw new common_1.ForbiddenException();
        return this.prisma.careRequest.delete({ where: { id: requestId } });
    }
    async rejectCareRequest(userId, requestId) {
        const request = await this.prisma.careRequest.findUnique({
            where: { id: requestId },
            include: { caregiver: true },
        });
        if (!request)
            throw new common_1.NotFoundException('Care request not found');
        if (request.caregiver.userId !== userId)
            throw new common_1.ForbiddenException();
        if (request.status !== 'PENDING')
            throw new common_1.BadRequestException('Request not pending');
        return this.prisma.careRequest.update({
            where: { id: requestId },
            data: { status: 'REJECTED', respondedAt: new Date() },
        });
    }
    async removeCaregiverFromFamily(caregiverId, elderId, reason, actorId) {
        console.log(caregiverId, elderId);
        const caregiver = await this.prisma.caregiver.findUnique({
            where: { id: caregiverId },
            include: { user: true },
        });
        if (!caregiver) {
            throw new common_1.NotFoundException('Caregiver not found');
        }
        const elder = await this.prisma.elder.findUnique({
            where: { id: elderId },
        });
        if (!elder) {
            throw new common_1.NotFoundException('Elder not found');
        }
        const careRequests = await this.prisma.careRequest.findMany({
            where: {
                caregiverId,
                elderId,
                status: { in: ['PENDING', 'ACCEPTED'] },
            },
            include: {
                elder: true,
                family: true,
                schedules: {
                    include: {
                        scheduleItems: true,
                    },
                },
            },
        });
        if (careRequests.length === 0) {
            throw new common_1.BadRequestException('No active care relationship found between this caregiver and family');
        }
        const family = careRequests[0].family;
        const familyId = family.id;
        return await this.prisma.$transaction(async (tx) => {
            const allScheduleIds = careRequests.flatMap((request) => request.schedules.map((schedule) => schedule.id));
            const allScheduleItemIds = careRequests.flatMap((request) => request.schedules.flatMap((schedule) => schedule.scheduleItems.map((item) => item.id)));
            if (allScheduleItemIds.length > 0) {
                await tx.scheduleItem.deleteMany({
                    where: {
                        id: { in: allScheduleItemIds },
                    },
                });
            }
            if (allScheduleIds.length > 0) {
                await tx.schedule.deleteMany({
                    where: {
                        id: { in: allScheduleIds },
                    },
                });
            }
            const updatedRequests = await tx.careRequest.updateMany({
                where: {
                    caregiverId,
                    elderId,
                    status: { in: ['PENDING', 'ACCEPTED'] },
                },
                data: {
                    status: 'CANCELLED',
                    updatedAt: new Date(),
                },
            });
            if (actorId) {
                for (const request of careRequests) {
                    await tx.activityLog.create({
                        data: {
                            userId: actorId,
                            actorRole: 'FAMILY',
                            category: 'USER_ACTIVITY',
                            eventType: 'CARE_RELATIONSHIP_ENDED',
                            entityType: 'CareRequest',
                            entityId: request.id,
                            metadata: {
                                caregiverId,
                                caregiverName: `${caregiver.firstName} ${caregiver.lastName}`,
                                familyId: elder.familyId,
                                familyName: family.familyName,
                                elderId: request.elderId,
                                elderName: `${request.elder.firstName} ${request.elder.lastName}`,
                                reason,
                                schedulesDeleted: request.schedules.length,
                                scheduleItemsDeleted: request.schedules.reduce((total, schedule) => total + schedule.scheduleItems.length, 0),
                                timestamp: new Date().toISOString(),
                            },
                        },
                    });
                }
            }
            const notificationPromises = [];
            notificationPromises.push(tx.notification.create({
                data: {
                    userId: caregiver.userId,
                    title: 'Care Relationship Ended',
                    message: `Your care relationship with ${family.familyName}'s family has been ended. ${reason ? `Reason: ${reason}` : ''}`,
                    type: 'CARE_RELATIONSHIP_CHANGE',
                },
            }));
            notificationPromises.push(tx.notification.create({
                data: {
                    userId: family.userId,
                    title: 'Caregiver Removed',
                    message: `You have removed ${caregiver.firstName} ${caregiver.lastName} as a caregiver.`,
                    type: 'CARE_RELATIONSHIP_CHANGE',
                },
            }));
            await Promise.all(notificationPromises);
            return {
                message: 'Caregiver successfully removed from family',
                details: {
                    caregiver: {
                        id: caregiverId,
                        name: `${caregiver.firstName} ${caregiver.lastName}`,
                    },
                    family: {
                        id: familyId,
                        name: family.familyName,
                    },
                    careRequestsCancelled: updatedRequests.count,
                    schedulesDeleted: allScheduleIds.length,
                    scheduleItemsDeleted: allScheduleItemIds.length,
                    reason,
                },
            };
        });
    }
    async removeFamilyFromCaregiver(caregiverUserId, familyId, reason, actorId) {
        const caregiver = await this.prisma.caregiver.findUnique({
            where: { userId: caregiverUserId },
        });
        if (!caregiver) {
            throw new common_1.NotFoundException('Caregiver not found');
        }
        if (actorId && caregiver.userId !== actorId) {
            throw new common_1.ForbiddenException('You are not allowed to remove this family');
        }
        return this.removeCaregiverFromFamily(caregiver.id, familyId, reason, actorId);
    }
    async getCaregiverRelationships(caregiverId) {
        return this.prisma.careRequest.findMany({
            where: {
                caregiverId,
                status: { in: ['PENDING', 'ACCEPTED'] },
            },
            include: {
                family: {
                    include: {
                        user: true,
                    },
                },
                elder: true,
                schedules: true,
            },
            orderBy: {
                requestedAt: 'desc',
            },
        });
    }
    async cancelCareRequest(userId, requestId, reason) {
        return this.prisma.$transaction(async (tx) => {
            const request = await tx.careRequest.findUnique({
                where: { id: requestId },
                include: {
                    family: { include: { user: true } },
                    caregiver: { include: { user: true } },
                    elder: true,
                },
            });
            if (!request) {
                throw new common_1.NotFoundException('Care request not found');
            }
            const isRequester = request.family.userId === userId;
            const isCaregiver = request.caregiver?.userId === userId;
            if (!isRequester && !isCaregiver) {
                throw new common_1.ForbiddenException('Not authorized to cancel this request');
            }
            if (request.status !== 'PENDING' && request.status !== 'ACCEPTED') {
                throw new common_1.BadRequestException(`Cannot cancel a request with status: ${request.status}. ` +
                    `Only PENDING or ACCEPTED requests can be cancelled.`);
            }
            if (request.status === 'PENDING' &&
                request.expiresAt &&
                request.expiresAt < new Date()) {
                await tx.careRequest.update({
                    where: { id: requestId },
                    data: {
                        status: 'EXPIRED',
                        updatedAt: new Date(),
                    },
                });
                throw new common_1.BadRequestException('This request has already expired');
            }
            const cancelledRequest = await tx.careRequest.update({
                where: { id: requestId },
                data: {
                    status: 'CANCELLED',
                    respondedAt: request.status === 'PENDING' ? new Date() : request.respondedAt,
                    updatedAt: new Date(),
                },
                include: {
                    family: { include: { user: true } },
                    caregiver: { include: { user: true } },
                    elder: true,
                },
            });
            await tx.activityLog.create({
                data: {
                    userId,
                    actorRole: isRequester ? 'FAMILY' : 'CAREGIVER',
                    category: 'USER_ACTIVITY',
                    eventType: 'CARE_REQUEST_CANCELLED',
                    entityType: 'CareRequest',
                    entityId: request.id,
                    metadata: {
                        requestId: request.id,
                        previousStatus: request.status,
                        cancelledBy: isRequester ? 'family' : 'caregiver',
                        familyName: request.family.familyName,
                        caregiverName: request.caregiver
                            ? `${request.caregiver.firstName} ${request.caregiver.lastName}`
                            : 'Unknown',
                        elderName: `${request.elder.firstName} ${request.elder.lastName}`,
                        reason: reason || null,
                        timestamp: new Date().toISOString(),
                    },
                },
            });
            const notificationPromises = [];
            if (isRequester && request.caregiver?.userId) {
                notificationPromises.push(tx.notification.create({
                    data: {
                        userId: request.caregiver.userId,
                        title: 'Care Request Cancelled',
                        message: `${request.family.familyName} has cancelled the care request for ${request.elder.firstName}.`,
                        type: 'CARE_REQUEST_UPDATE',
                    },
                }));
            }
            else if (isCaregiver && request.family.userId) {
                notificationPromises.push(tx.notification.create({
                    data: {
                        userId: request.family.userId,
                        title: 'Care Request Cancelled',
                        message: `${request.caregiver.firstName} ${request.caregiver.lastName} has cancelled the care request for ${request.elder.firstName}.`,
                        type: 'CARE_REQUEST_UPDATE',
                    },
                }));
            }
            if (notificationPromises.length > 0) {
                await Promise.all(notificationPromises);
            }
            return {
                message: 'Care request cancelled successfully',
                data: cancelledRequest,
            };
        });
    }
    async expirePendingRequests() {
        const expiredRequests = await this.prisma.careRequest.findMany({
            where: {
                status: 'PENDING',
                expiresAt: {
                    lt: new Date(),
                },
            },
            include: {
                family: true,
                caregiver: { include: { user: true } },
                elder: true,
            },
        });
        const results = await Promise.allSettled(expiredRequests.map(async (request) => {
            return this.prisma.$transaction(async (tx) => {
                const expiredRequest = await tx.careRequest.update({
                    where: { id: request.id },
                    data: {
                        status: 'EXPIRED',
                        updatedAt: new Date(),
                    },
                });
                const adminUser = await tx.user.findFirst({
                    where: { role: 'ADMIN' },
                });
                if (adminUser) {
                    await tx.activityLog.create({
                        data: {
                            userId: adminUser.id,
                            actorRole: 'ADMIN',
                            category: 'FEATURE_USAGE',
                            eventType: 'REQUEST_EXPIRED',
                            entityType: 'CareRequest',
                            entityId: request.id,
                            metadata: {
                                requestId: request.id,
                                expiredAt: new Date().toISOString(),
                                originalExpiresAt: request.expiresAt?.toISOString(),
                                familyName: request.family.familyName,
                                caregiverName: request.caregiver
                                    ? `${request.caregiver.firstName} ${request.caregiver.lastName}`
                                    : 'Unknown',
                                elderName: `${request.elder.firstName} ${request.elder.lastName}`,
                            },
                        },
                    });
                }
                await tx.notification.create({
                    data: {
                        userId: request.family.userId,
                        title: 'Request Expired',
                        message: `Your care request for ${request.elder.firstName} has expired without a response.`,
                        type: 'CARE_REQUEST_UPDATE',
                    },
                });
                return expiredRequest;
            });
        }));
        return {
            message: `Processed ${expiredRequests.length} expired requests`,
            details: results,
        };
    }
    async getCancellableRequests(userId) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            include: {
                family: true,
                caregiver: true,
            },
        });
        if (!user)
            throw new common_1.NotFoundException('User not found');
        let whereClause = {
            status: {
                in: [client_1.RequestStatus.PENDING, client_1.RequestStatus.ACCEPTED],
            },
        };
        if (user.role === 'FAMILY' && user.family) {
            whereClause.familyId = user.family.id;
        }
        else if (user.role === 'CAREGIVER' && user.caregiver) {
            whereClause.caregiverId = user.caregiver.id;
        }
        else {
            return [];
        }
        return this.prisma.careRequest.findMany({
            where: whereClause,
            include: {
                elder: true,
                family: user.role === 'CAREGIVER' ? { include: { user: true } } : false,
                caregiver: user.role === 'FAMILY' ? { include: { user: true } } : false,
                schedules: true,
            },
            orderBy: {
                requestedAt: 'desc',
            },
        });
    }
};
exports.CareRequestService = CareRequestService;
exports.CareRequestService = CareRequestService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CareRequestService);
//# sourceMappingURL=care-request.service.js.map
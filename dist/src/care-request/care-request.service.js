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
let CareRequestService = class CareRequestService {
    prisma;
    defaultScheduleItems = [
        { title: 'Morning Medication & Breakfast', startTime: '08:00', endTime: '09:00', description: 'Administer morning medication and assist with breakfast' },
        { title: 'Personal Care', startTime: '10:00', endTime: '11:00', description: 'Assist with bathing, grooming, and dressing' },
        { title: 'Lunch & Medication', startTime: '12:30', endTime: '13:30', description: 'Assist with lunch and administer midday medication' },
        { title: 'Afternoon Activities', startTime: '15:00', endTime: '16:00', description: 'Light exercise and social activities' },
        { title: 'Dinner & Medication', startTime: '18:00', endTime: '19:00', description: 'Assist with dinner and administer evening medication' },
        { title: 'Evening Care', startTime: '20:00', endTime: '21:00', description: 'Prepare for bed and assist with nighttime routine' },
    ];
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createCareRequest(userId, dto) {
        if (dto.careType === 'PART_TIME' && (!dto.careDays || dto.careDays.length === 0)) {
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
                        status: 'PENDING'
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
        const days = request.careType === 'FULL_TIME' ? Object.values(create_care_request_dto_1.DayOfWeek) : request.careDays;
        const schedules = await Promise.all(days.map(day => tx.schedule.create({
            data: { elderId: request.elderId, careRequestId: request.id, day, start: '08:00', end: '21:00' },
        })));
        const allScheduleItems = schedules.flatMap(schedule => this.defaultScheduleItems.map(item => ({
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
            }
        });
        if (!user)
            throw new common_1.NotFoundException('User not found');
        if (user.role === 'FAMILY' && user.family) {
            return this.prisma.careRequest.findMany({ where: { familyId: user.family.id } });
        }
        else if (user.role === 'CAREGIVER' && user.caregiver) {
            return this.prisma.careRequest.findMany({ where: { caregiverId: user.caregiver.id } });
        }
        return [];
    }
    async findOne(userId, requestId) {
        const request = await this.prisma.careRequest.findUnique({
            where: { id: requestId },
            include: {
                caregiver: { include: { user: true } },
                family: { include: { user: true } }
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
};
exports.CareRequestService = CareRequestService;
exports.CareRequestService = CareRequestService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CareRequestService);
//# sourceMappingURL=care-request.service.js.map
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
exports.ScheduleService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@prisma/client");
let ScheduleService = class ScheduleService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createSchedule(elderId, data) {
        const elder = await this.prisma.elder.findUnique({
            where: { id: elderId },
            include: { careRequests: { where: { status: 'ACCEPTED' } } },
        });
        if (!elder) {
            throw new common_1.NotFoundException('Elder not found');
        }
        if (!elder.careRequests || elder.careRequests.length === 0) {
            throw new common_1.BadRequestException('Elder does not have an accepted caregiver assignment');
        }
        const createdDays = [];
        for (const dayData of data.schedules) {
            if (!dayData.scheduleItems || dayData.scheduleItems.length === 0)
                continue;
            const existingSchedule = await this.prisma.schedule.findFirst({
                where: { elderId, day: dayData.day },
            });
            if (existingSchedule) {
                throw new common_1.BadRequestException(`Schedule already exists for ${dayData.day}`);
            }
            const sortedItems = dayData.scheduleItems.sort((a, b) => a.startTime.localeCompare(b.startTime));
            const dayStart = sortedItems[0].startTime;
            const dayEnd = sortedItems[sortedItems.length - 1].endTime;
            const schedule = await this.prisma.schedule.create({
                data: {
                    elderId,
                    day: dayData.day,
                    start: dayStart,
                    end: dayEnd,
                    careRequestId: elder.careRequests[0].id,
                    scheduleItems: {
                        create: dayData.scheduleItems.map((item) => ({
                            title: item.title,
                            description: item.description,
                            startTime: item.startTime,
                            endTime: item.endTime,
                            status: item.status ?? client_1.ScheduleStatus.PENDING,
                        })),
                    },
                },
                include: { scheduleItems: true },
            });
            createdDays.push(schedule);
        }
        return createdDays;
    }
    async updateSchedule(elderId, data) {
        console.log('[updateSchedule] START =========================================');
        console.log('[updateSchedule] called for elderId=', elderId);
        console.log('[updateSchedule] payload:', JSON.stringify(data, null, 2));
        if (!data.schedules || data.schedules.length === 0) {
            console.log('[updateSchedule] WARNING: No schedules provided, returning []');
            return [];
        }
        const elder = await this.prisma.elder.findUnique({
            where: { id: elderId },
            include: {
                careRequests: { where: { status: 'ACCEPTED' } },
            },
        });
        if (!elder) {
            throw new common_1.NotFoundException('Elder not found');
        }
        if (!elder.careRequests || elder.careRequests.length === 0) {
            throw new common_1.BadRequestException('Cannot update schedule: elder does not have an accepted caregiver assignment');
        }
        try {
            const updatedSchedules = [];
            await this.prisma.$transaction(async (tx) => {
                for (const dayData of data.schedules) {
                    console.log(`\n[updateSchedule] === Processing day: ${dayData.day} ===`);
                    if (!dayData.scheduleItems || dayData.scheduleItems.length === 0) {
                        console.log(`[updateSchedule] Day ${dayData.day} has no items, deleting schedule if exists`);
                        const deleted = await tx.schedule.deleteMany({
                            where: { elderId, day: dayData.day },
                        });
                        console.log(`[updateSchedule] Deleted ${deleted.count} schedule(s) for ${dayData.day}`);
                        continue;
                    }
                    const sortedItems = dayData.scheduleItems.sort((a, b) => a.startTime.localeCompare(b.startTime));
                    const dayStart = sortedItems[0].startTime;
                    const dayEnd = sortedItems[sortedItems.length - 1].endTime;
                    console.log(`[updateSchedule] Computed: dayStart=${dayStart}, dayEnd=${dayEnd}`);
                    const existingSchedule = await tx.schedule.findFirst({
                        where: { elderId, day: dayData.day },
                        include: { scheduleItems: { orderBy: { startTime: 'asc' } } },
                    });
                    if (existingSchedule) {
                        console.log(`[updateSchedule] Found existing schedule id=${existingSchedule.id}`);
                        await tx.schedule.update({
                            where: { id: existingSchedule.id },
                            data: { start: dayStart, end: dayEnd },
                        });
                        const newItemIds = [];
                        for (const itemData of dayData.scheduleItems) {
                            const existingItem = existingSchedule.scheduleItems.find((item) => item.startTime === itemData.startTime);
                            if (existingItem) {
                                const updatedItem = await tx.scheduleItem.update({
                                    where: { id: existingItem.id },
                                    data: {
                                        title: itemData.title,
                                        description: itemData.description,
                                        startTime: itemData.startTime,
                                        endTime: itemData.endTime,
                                        status: itemData.status ?? client_1.ScheduleStatus.PENDING,
                                    },
                                });
                                newItemIds.push(updatedItem.id);
                            }
                            else {
                                const newItem = await tx.scheduleItem.create({
                                    data: {
                                        scheduleId: existingSchedule.id,
                                        title: itemData.title,
                                        description: itemData.description,
                                        startTime: itemData.startTime,
                                        endTime: itemData.endTime,
                                        status: itemData.status ?? client_1.ScheduleStatus.PENDING,
                                    },
                                });
                                newItemIds.push(newItem.id);
                            }
                        }
                        const itemsToDelete = existingSchedule.scheduleItems
                            .filter((item) => !newItemIds.includes(item.id))
                            .map((item) => item.id);
                        if (itemsToDelete.length > 0) {
                            await tx.scheduleItem.deleteMany({ where: { id: { in: itemsToDelete } } });
                        }
                        const finalSchedule = await tx.schedule.findUnique({
                            where: { id: existingSchedule.id },
                            include: { scheduleItems: { orderBy: { startTime: 'asc' } } },
                        });
                        updatedSchedules.push(finalSchedule);
                    }
                    else {
                        const created = await tx.schedule.create({
                            data: {
                                elderId,
                                day: dayData.day,
                                start: dayStart,
                                end: dayEnd,
                                careRequestId: elder.careRequests[0].id,
                                scheduleItems: {
                                    create: dayData.scheduleItems.map((item) => ({
                                        title: item.title,
                                        description: item.description,
                                        startTime: item.startTime,
                                        endTime: item.endTime,
                                        status: item.status ?? client_1.ScheduleStatus.PENDING,
                                    })),
                                },
                            },
                            include: { scheduleItems: { orderBy: { startTime: 'asc' } } },
                        });
                        updatedSchedules.push(created);
                    }
                    console.log(`[updateSchedule] ✓ Completed day: ${dayData.day}`);
                }
            });
            console.log(`[updateSchedule] ✓ Transaction committed successfully`);
            return updatedSchedules;
        }
        catch (error) {
            console.error('[updateSchedule] ✗ TRANSACTION FAILED:', error);
            throw new Error(`Failed to update schedule: ${error.message}`);
        }
    }
    calculateDayTimeRange(scheduleItems) {
        if (!scheduleItems || scheduleItems.length === 0) {
            return { dayStart: '00:00', dayEnd: '00:00' };
        }
        const itemsWithMinutes = scheduleItems.map(item => ({
            ...item,
            startMinutes: this.timeToMinutes(item.startTime),
            endMinutes: this.timeToMinutes(item.endTime),
        }));
        const sortedByStart = [...itemsWithMinutes].sort((a, b) => a.startMinutes - b.startMinutes);
        const sortedByEnd = [...itemsWithMinutes].sort((a, b) => b.endMinutes - a.endMinutes);
        const dayStart = sortedByStart[0].startTime;
        const dayEnd = sortedByEnd[0].endTime;
        console.log(`[calculateDayTimeRange] Found ${scheduleItems.length} items, earliest: ${dayStart}, latest: ${dayEnd}`);
        return { dayStart, dayEnd };
    }
    timeToMinutes(timeStr) {
        if (!timeStr || !timeStr.includes(':'))
            return 0;
        const [hours, minutes] = timeStr.split(':').map(Number);
        if (hours < 0 || hours > 23 || minutes < 0 || minutes > 59) {
            console.warn(`[timeToMinutes] Invalid time format: ${timeStr}`);
            return 0;
        }
        return hours * 60 + minutes;
    }
    async getTodaySchedule(elderId) {
        const today = new Date()
            .toLocaleString('en-US', { weekday: 'long' })
            .toUpperCase();
        console.log(today);
        return this.prisma.schedule.findMany({
            where: { elderId, day: today },
            include: { scheduleItems: true },
        });
    }
    async getWeeklySchedule(elderId) {
        return this.prisma.schedule.findMany({
            where: { elderId },
            include: { scheduleItems: true },
            orderBy: { day: 'asc' },
        });
    }
    async getDaySchedule(elderId, day) {
        return this.prisma.schedule.findFirst({
            where: { elderId, day },
            include: { scheduleItems: true },
        });
    }
    async getElderSchedule(elderId) {
        return this.prisma.schedule.findMany({
            where: { elderId },
            include: { scheduleItems: true },
            orderBy: { day: 'asc' },
        });
    }
    async updateItemStatus(itemId, status) {
        return this.prisma.scheduleItem.update({
            where: { id: itemId },
            data: { status },
        });
    }
    async deleteSchedule(scheduleId) {
        return this.prisma.schedule.delete({
            where: { id: scheduleId },
        });
    }
    async deleteAllDaySchedules(elderId, day) {
        return this.prisma.schedule.deleteMany({
            where: { elderId, day },
        });
    }
};
exports.ScheduleService = ScheduleService;
exports.ScheduleService = ScheduleService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ScheduleService);
//# sourceMappingURL=schedule.service.js.map
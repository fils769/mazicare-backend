import { PrismaService } from '../prisma/prisma.service';
import { EventFiltersDto } from './dto/event.dto';
export declare class EventsService {
    private prisma;
    constructor(prisma: PrismaService);
    getEvents(filters: EventFiltersDto): Promise<({
        _count: {
            registrations: number;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        region: string | null;
        schedule: string | null;
        title: string;
        description: string | null;
        category: string | null;
        price: number;
        imageUrl: string | null;
        date: Date;
        maxCapacity: number | null;
        categoryColor: string | null;
        eventUrl: string | null;
        imageHeight: number | null;
        imageSrcset: string | null;
        imageWidth: number | null;
        isActive: boolean;
        postId: string | null;
        scrapedAt: Date | null;
        specialFeatures: string | null;
        subCategories: string | null;
        targetAges: string | null;
        venue: string | null;
        venueUrl: string | null;
    })[]>;
    getEventDetails(id: string): Promise<{
        registeredCount: number;
        _count: {
            registrations: number;
        };
        id: string;
        createdAt: Date;
        updatedAt: Date;
        region: string | null;
        schedule: string | null;
        title: string;
        description: string | null;
        category: string | null;
        price: number;
        imageUrl: string | null;
        date: Date;
        maxCapacity: number | null;
        categoryColor: string | null;
        eventUrl: string | null;
        imageHeight: number | null;
        imageSrcset: string | null;
        imageWidth: number | null;
        isActive: boolean;
        postId: string | null;
        scrapedAt: Date | null;
        specialFeatures: string | null;
        subCategories: string | null;
        targetAges: string | null;
        venue: string | null;
        venueUrl: string | null;
    }>;
    registerForEvent(userId: string, eventId: string): Promise<{
        success: boolean;
        message: string;
        registration: {
            id: string;
            createdAt: Date;
            userId: string;
            eventId: string;
        };
    }>;
}

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
        price: number;
        createdAt: Date;
        updatedAt: Date;
        region: string | null;
        schedule: string | null;
        title: string;
        description: string | null;
        category: string | null;
        imageUrl: string | null;
        date: Date;
        maxCapacity: number | null;
        venue: string | null;
        venueUrl: string | null;
        categoryColor: string | null;
        subCategories: string | null;
        targetAges: string | null;
        specialFeatures: string | null;
        eventUrl: string | null;
        imageWidth: number | null;
        imageHeight: number | null;
        imageSrcset: string | null;
        postId: string | null;
        scrapedAt: Date | null;
        isActive: boolean;
    })[]>;
    getEventDetails(id: string): Promise<{
        registeredCount: number;
        _count: {
            registrations: number;
        };
        id: string;
        price: number;
        createdAt: Date;
        updatedAt: Date;
        region: string | null;
        schedule: string | null;
        title: string;
        description: string | null;
        category: string | null;
        imageUrl: string | null;
        date: Date;
        maxCapacity: number | null;
        venue: string | null;
        venueUrl: string | null;
        categoryColor: string | null;
        subCategories: string | null;
        targetAges: string | null;
        specialFeatures: string | null;
        eventUrl: string | null;
        imageWidth: number | null;
        imageHeight: number | null;
        imageSrcset: string | null;
        postId: string | null;
        scrapedAt: Date | null;
        isActive: boolean;
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

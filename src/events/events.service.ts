import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EventFiltersDto } from './dto/event.dto';

@Injectable()
export class EventsService {
  constructor(private prisma: PrismaService) {}

  async getEvents(filters: EventFiltersDto) {
    return this.prisma.event.findMany({
      where: {
        ...(filters.region && { region: { contains: filters.region, mode: 'insensitive' } }),
        ...(filters.category && { category: { contains: filters.category, mode: 'insensitive' } })
      },
      include: {
        _count: {
          select: { registrations: true }
        }
      },
      orderBy: { date: 'asc' }
    });
  }

  async getEventDetails(id: string) {
    const event = await this.prisma.event.findUnique({
      where: { id },
      include: {
        _count: {
          select: { registrations: true }
        }
      }
    });

    if (!event) {
      throw new NotFoundException('Event not found');
    }

    return {
      ...event,
      registeredCount: event._count.registrations
    };
  }

  async registerForEvent(userId: string, eventId: string) {
    const existingRegistration = await this.prisma.eventRegistration.findUnique({
      where: {
        userId_eventId: {
          userId,
          eventId
        }
      }
    });

    if (existingRegistration) {
      throw new NotFoundException('Already registered for this event');
    }

    const registration = await this.prisma.eventRegistration.create({
      data: {
        userId,
        eventId
      }
    });

    return {
      success: true,
      message: 'Successfully registered for event',
      registration
    };
  }
}
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ScheduleModule as NestScheduleModule } from '@nestjs/schedule';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { CaregiverModule } from './caregiver/caregiver.module';
import { UserModule } from './user/user.module';
import { UploadThingModule } from './uploadthing/uploadthing.module';
import { FamilyModule } from './family/family.module';
import { EventsModule } from './events/events.module';
import { MessagesModule } from './messages/messages.module';
import { NotificationsModule } from './notifications/notifications.module';
import { ScheduleModule } from './schedule/schedule.module';
import { SubscriptionModule } from './subscription/subscription.module';
import { ReportsModule } from './reports/reports.module';
import { AdminModule } from './admin/admin.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { SupportModule } from './support/support.module';
import { ReviewsModule } from './reviews/reviews.module';
import { ArticlesModule } from './articles/articles.module';
import { CareRequestModule } from './care-request/care-request.module';
import { DealsModule } from './deals/deals.module';
import { VivaModule } from './viva/viva.module';
import { VivaWebhookController } from './webhooks/webhook.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    EventEmitterModule.forRoot(),
    NestScheduleModule.forRoot(),
    AuthModule,
    CaregiverModule,
    UserModule,
    UploadThingModule,
    FamilyModule,
    EventsModule,
    MessagesModule,
    NotificationsModule,
    ScheduleModule,
    SubscriptionModule,
    AdminModule,
    ReportsModule,
    AnalyticsModule,
    SupportModule,
    ReviewsModule,
    ArticlesModule,
    CareRequestModule,
    DealsModule,
    VivaModule,
  ],
  controllers: [AppController, VivaWebhookController],
  providers: [AppService],
})
export class AppModule { }

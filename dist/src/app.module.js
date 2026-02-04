"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const event_emitter_1 = require("@nestjs/event-emitter");
const schedule_1 = require("@nestjs/schedule");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const auth_module_1 = require("./auth/auth.module");
const caregiver_module_1 = require("./caregiver/caregiver.module");
const user_module_1 = require("./user/user.module");
const uploadthing_module_1 = require("./uploadthing/uploadthing.module");
const family_module_1 = require("./family/family.module");
const events_module_1 = require("./events/events.module");
const messages_module_1 = require("./messages/messages.module");
const notifications_module_1 = require("./notifications/notifications.module");
const schedule_module_1 = require("./schedule/schedule.module");
const subscription_module_1 = require("./subscription/subscription.module");
const reports_module_1 = require("./reports/reports.module");
const admin_module_1 = require("./admin/admin.module");
const analytics_module_1 = require("./analytics/analytics.module");
const support_module_1 = require("./support/support.module");
const reviews_module_1 = require("./reviews/reviews.module");
const articles_module_1 = require("./articles/articles.module");
const care_request_module_1 = require("./care-request/care-request.module");
const deals_module_1 = require("./deals/deals.module");
const viva_module_1 = require("./viva/viva.module");
const webhook_controller_1 = require("./webhooks/webhook.controller");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
            }),
            event_emitter_1.EventEmitterModule.forRoot(),
            schedule_1.ScheduleModule.forRoot(),
            auth_module_1.AuthModule,
            caregiver_module_1.CaregiverModule,
            user_module_1.UserModule,
            uploadthing_module_1.UploadThingModule,
            family_module_1.FamilyModule,
            events_module_1.EventsModule,
            messages_module_1.MessagesModule,
            notifications_module_1.NotificationsModule,
            schedule_module_1.ScheduleModule,
            subscription_module_1.SubscriptionModule,
            admin_module_1.AdminModule,
            reports_module_1.ReportsModule,
            analytics_module_1.AnalyticsModule,
            support_module_1.SupportModule,
            reviews_module_1.ReviewsModule,
            articles_module_1.ArticlesModule,
            care_request_module_1.CareRequestModule,
            deals_module_1.DealsModule,
            viva_module_1.VivaModule,
        ],
        controllers: [app_controller_1.AppController, webhook_controller_1.VivaWebhookController],
        providers: [app_service_1.AppService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map
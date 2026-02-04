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
var TwilioService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TwilioService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const twilio_1 = require("twilio");
let TwilioService = TwilioService_1 = class TwilioService {
    configService;
    logger = new common_1.Logger(TwilioService_1.name);
    client;
    fromNumber;
    constructor(configService) {
        this.configService = configService;
        const accountSid = this.configService.get('TWILIO_ACCOUNT_SID');
        const authToken = this.configService.get('TWILIO_AUTH_TOKEN');
        this.fromNumber = this.configService.get('TWILIO_PHONE_NUMBER') || '';
        if (!accountSid || !authToken || !this.fromNumber) {
            this.logger.warn('Twilio credentials not configured. SMS functionality will be disabled.');
            return;
        }
        try {
            this.client = new twilio_1.Twilio(accountSid, authToken);
            this.logger.log('Twilio service initialized successfully');
        }
        catch (error) {
            this.logger.error('Failed to initialize Twilio service:', error);
        }
    }
    async sendSMS(to, message) {
        if (!this.client) {
            this.logger.error('Twilio client not initialized. Cannot send SMS.');
            return false;
        }
        try {
            if (!this.isValidPhoneNumber(to)) {
                this.logger.error(`Invalid phone number format: ${to}`);
                return false;
            }
            if (to === this.fromNumber) {
                this.logger.error(`Cannot send SMS to the same number as sender: ${to}`);
                return false;
            }
            const result = await this.client.messages.create({
                body: message,
                from: this.fromNumber,
                to: to,
            });
            this.logger.log(`SMS sent successfully to ${to}. SID: ${result.sid}`);
            return true;
        }
        catch (error) {
            this.logger.error(`Failed to send SMS to ${to}:`, error);
            if (error.code === 21659) {
                this.logger.error(`Twilio Error 21659: The 'From' number ${this.fromNumber} is not a valid Twilio phone number. Please check your Twilio console.`);
            }
            else if (error.code === 21266) {
                this.logger.error(`Twilio Error 21266: Cannot send SMS to the same number as sender.`);
            }
            return false;
        }
    }
    async sendOTP(phoneNumber, otp) {
        const message = `Your MaziCare verification code is: ${otp}. This code will expire in 10 minutes.`;
        return this.sendSMS(phoneNumber, message);
    }
    async sendPasswordResetOTP(phoneNumber, otp) {
        const message = `Your MaziCare password reset code is: ${otp}. This code will expire in 10 minutes.`;
        return this.sendSMS(phoneNumber, message);
    }
    isValidPhoneNumber(phoneNumber) {
        const e164Regex = /^\+[1-9]\d{1,14}$/;
        return e164Regex.test(phoneNumber);
    }
    isConfigured() {
        return !!this.client;
    }
};
exports.TwilioService = TwilioService;
exports.TwilioService = TwilioService = TwilioService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], TwilioService);
//# sourceMappingURL=twilio.service.js.map
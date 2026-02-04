import { ConfigService } from '@nestjs/config';
export declare class TwilioService {
    private configService;
    private readonly logger;
    private client;
    private fromNumber;
    constructor(configService: ConfigService);
    sendSMS(to: string, message: string): Promise<boolean>;
    sendOTP(phoneNumber: string, otp: string): Promise<boolean>;
    sendPasswordResetOTP(phoneNumber: string, otp: string): Promise<boolean>;
    private isValidPhoneNumber;
    isConfigured(): boolean;
}

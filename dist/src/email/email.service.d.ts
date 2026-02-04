import { ConfigService } from '@nestjs/config';
export declare class EmailService {
    private configService;
    private readonly logger;
    private transporter;
    constructor(configService: ConfigService);
    sendOTP(email: string, otp: string): Promise<boolean>;
    sendPasswordResetOTP(email: string, otp: string): Promise<boolean>;
}

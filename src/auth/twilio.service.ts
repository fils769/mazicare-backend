import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Twilio } from 'twilio';

@Injectable()
export class TwilioService {
  private readonly logger = new Logger(TwilioService.name);
  private client: Twilio;
  private fromNumber: string;

  constructor(private configService: ConfigService) {
    const accountSid = this.configService.get<string>('TWILIO_ACCOUNT_SID');
    const authToken = this.configService.get<string>('TWILIO_AUTH_TOKEN');
    this.fromNumber = this.configService.get<string>('TWILIO_PHONE_NUMBER') || '';

    if (!accountSid || !authToken || !this.fromNumber) {
      this.logger.warn('Twilio credentials not configured. SMS functionality will be disabled.');
      return;
    }

    try {
      this.client = new Twilio(accountSid, authToken);
      this.logger.log('Twilio service initialized successfully');
    } catch (error) {
      this.logger.error('Failed to initialize Twilio service:', error);
    }
  }

  async sendSMS(to: string, message: string): Promise<boolean> {
    if (!this.client) {
      this.logger.error('Twilio client not initialized. Cannot send SMS.');
      return false;
    }

    try {
      // Validate phone number format (E.164)
      if (!this.isValidPhoneNumber(to)) {
        this.logger.error(`Invalid phone number format: ${to}`);
        return false;
      }

      // Check if trying to send to the same number as sender
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
    } catch (error) {
      this.logger.error(`Failed to send SMS to ${to}:`, error);
      
      // Log specific Twilio errors for debugging
      if (error.code === 21659) {
        this.logger.error(`Twilio Error 21659: The 'From' number ${this.fromNumber} is not a valid Twilio phone number. Please check your Twilio console.`);
      } else if (error.code === 21266) {
        this.logger.error(`Twilio Error 21266: Cannot send SMS to the same number as sender.`);
      }
      
      return false;
    }
  }

  async sendOTP(phoneNumber: string, otp: string): Promise<boolean> {
    const message = `Your MaziCare verification code is: ${otp}. This code will expire in 10 minutes.`;
    return this.sendSMS(phoneNumber, message);
  }

  async sendPasswordResetOTP(phoneNumber: string, otp: string): Promise<boolean> {
    const message = `Your MaziCare password reset code is: ${otp}. This code will expire in 10 minutes.`;
    return this.sendSMS(phoneNumber, message);
  }

  private isValidPhoneNumber(phoneNumber: string): boolean {
    // E.164 format: +[country code][number]
    const e164Regex = /^\+[1-9]\d{1,14}$/;
    return e164Regex.test(phoneNumber);
  }

  isConfigured(): boolean {
    return !!this.client;
  }
}
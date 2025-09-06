import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor(private configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get<string>('SMTP_HOST'),
      port: this.configService.get<number>('SMTP_PORT'),
      secure: this.configService.get<boolean>('SMTP_SECURE', true),
      auth: {
        user: this.configService.get<string>('SMTP_USER'),
        pass: this.configService.get<string>('SMTP_PASS'),
      },
    });
  }

  async add(type: string, data: any) {
    const templates = {
      welcome: {
        subject: 'Welcome to Task Management System',
        html: `
          <h1>Welcome ${data.name}!</h1>
          <p>Thank you for joining our Task Management System.</p>
          <p>Start managing your tasks efficiently today!</p>
        `,
      },
      'password-reset': {
        subject: 'Password Reset Request',
        html: `
          <h1>Password Reset</h1>
          <p>Hello ${data.name},</p>
          <p>You requested to reset your password. Click the link below to proceed:</p>
          <a href="${this.configService.get<string>('FRONTEND_URL')}/reset-password?token=${data.resetToken}">Reset Password</a>
          <p>This link will expire in 15 minutes.</p>
        `,
      },
      otp: {
        subject: 'Your OTP Code',
        html: `
          <h1>OTP Verification</h1>
          <p>Hello ${data.name},</p>
          <p>Your OTP code is: <strong>${data.otp}</strong></p>
          <p>This code will expire in 5 minutes.</p>
        `,
      },
    };

    const template = templates[type];
    if (!template) {
      throw new Error(`Email template '${type}' not found`);
    }

    await this.transporter.sendMail({
      from: this.configService.get<string>('SMTP_FROM'),
      to: data.email,
      subject: template.subject,
      html: template.html,
    });
  }
}
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor(private configService: ConfigService) {
    // Create hardcoded SMTP transporter for Gmail
    try {
      this.transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
          user: 'hw93goj@gmail.com',
          pass: 'utro dkai fzpm crlx',
        },
        tls: {
          rejectUnauthorized: false
        }
      });
    } catch (error) {
      console.error('❌ Failed to initialize email service:', error);
      this.transporter = null;
    }
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
          <a href="${this.configService.get<string>('FRONTEND_URL') || 'http://localhost:3000'}/auth/reset-password?token=${data.resetToken}&email=${encodeURIComponent(data.email)}">Reset Password</a>
          <p>This link will expire in 15 minutes.</p>
        `,
      },
      otp: {
        subject: 'Your OTP Code - Task Management System',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h1 style="color: #3B82F6; text-align: center;">OTP Verification</h1>
            <p>Hello ${data.name},</p>
            <p>Thank you for registering with our Task Management System. To complete your registration, please use the following OTP code:</p>
            <div style="background-color: #f8f9fa; border: 2px solid #3B82F6; border-radius: 8px; padding: 20px; text-align: center; margin: 20px 0;">
              <h2 style="color: #3B82F6; font-size: 32px; margin: 0; letter-spacing: 4px;">${data.otp}</h2>
            </div>
            <p><strong>Important:</strong> This code will expire in 10 minutes.</p>
            <p>If you didn't request this code, please ignore this email.</p>
            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;">
            <p style="color: #6b7280; font-size: 12px;">Task Management System</p>
          </div>
        `,
      },
      'email-verification': {
        subject: 'Verify Your Email Address',
        html: `
          <h1>Email Verification</h1>
          <p>Hello ${data.name},</p>
          <p>Thank you for registering with our Task Management System. Please verify your email address by clicking the link below:</p>
          <a href="${this.configService.get<string>('FRONTEND_URL') || 'http://localhost:3000'}/auth/verify-email?token=${data.verificationToken}" 
             style="display: inline-block; padding: 12px 24px; background-color: #3B82F6; color: white; text-decoration: none; border-radius: 6px; margin: 16px 0;">
            Verify Email Address
          </a>
          <p>Or copy and paste this link in your browser:</p>
          <p>${this.configService.get<string>('FRONTEND_URL') || 'http://localhost:3000'}/auth/verify-email?token=${data.verificationToken}</p>
          <p>This link will expire in 24 hours.</p>
          <p>If you didn't create an account, please ignore this email.</p>
        `,
      },
      'project-invitation': {
        subject: `You've been invited to join "${data.projectName}"`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h1 style="color: #3B82F6; text-align: center;">Project Invitation</h1>
            <p>Hello,</p>
            <p>${data.inviterName} has invited you to join the project "<strong>${data.projectName}</strong>" in our Task Management System.</p>
            <div style="background-color: #f8f9fa; border-left: 4px solid #3B82F6; padding: 15px; margin: 20px 0;">
              <h3 style="margin: 0 0 10px 0; color: #1f2937;">Project Details:</h3>
              <p style="margin: 5px 0;"><strong>Name:</strong> ${data.projectName}</p>
              ${data.projectDescription ? `<p style="margin: 5px 0;"><strong>Description:</strong> ${data.projectDescription}</p>` : ''}
            </div>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${this.configService.get<string>('FRONTEND_URL') || 'http://localhost:3000'}/invitations/accept?token=${data.invitationToken}" 
                 style="display: inline-block; padding: 12px 24px; background-color: #10B981; color: white; text-decoration: none; border-radius: 6px; margin: 0 10px;">
                Accept Invitation
              </a>
              <a href="${this.configService.get<string>('FRONTEND_URL') || 'http://localhost:3000'}/invitations/decline?token=${data.invitationToken}" 
                 style="display: inline-block; padding: 12px 24px; background-color: #EF4444; color: white; text-decoration: none; border-radius: 6px; margin: 0 10px;">
                Decline Invitation
              </a>
            </div>
            <p>This invitation will expire in 7 days.</p>
            <p>If you don't have an account yet, you'll be prompted to create one when accepting the invitation.</p>
            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;">
            <p style="color: #6b7280; font-size: 12px;">Task Management System</p>
          </div>
        `,
      },
      'project-member-added': {
        subject: `You've been added to project "${data.projectName}"`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h1 style="color: #10B981; text-align: center;">Welcome to the Team!</h1>
            <p>Hello ${data.memberName},</p>
            <p>${data.inviterName} has added you as a member to the project "<strong>${data.projectName}</strong>" in our Task Management System.</p>
            <div style="background-color: #f8f9fa; border-left: 4px solid #10B981; padding: 15px; margin: 20px 0;">
              <h3 style="margin: 0 0 10px 0; color: #1f2937;">Project Details:</h3>
              <p style="margin: 5px 0;"><strong>Name:</strong> ${data.projectName}</p>
              ${data.projectDescription ? `<p style="margin: 5px 0;"><strong>Description:</strong> ${data.projectDescription}</p>` : ''}
            </div>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${this.configService.get<string>('FRONTEND_URL') || 'http://localhost:3000'}/projects/${data.projectId}" 
                 style="display: inline-block; padding: 12px 24px; background-color: #3B82F6; color: white; text-decoration: none; border-radius: 6px;">
                View Project
              </a>
            </div>
            <p>You can now collaborate on tasks, view project updates, and contribute to the project's success.</p>
            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;">
            <p style="color: #6b7280; font-size: 12px;">Task Management System</p>
          </div>
        `,
      },
      'task-assignment': {
        subject: `You've been assigned to task "${data.taskTitle}"`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h1 style="color: #3B82F6; text-align: center;">New Task Assignment</h1>
            <p>Hello ${data.assigneeName},</p>
            <p>${data.assignerName} has assigned you to a new task in our Task Management System.</p>
            <div style="background-color: #f8f9fa; border-left: 4px solid #3B82F6; padding: 15px; margin: 20px 0;">
              <h3 style="margin: 0 0 10px 0; color: #1f2937;">Task Details:</h3>
              <p style="margin: 5px 0;"><strong>Title:</strong> ${data.taskTitle}</p>
              ${data.taskDescription ? `<p style="margin: 5px 0;"><strong>Description:</strong> ${data.taskDescription}</p>` : ''}
              <p style="margin: 5px 0;"><strong>Priority:</strong> <span style="text-transform: capitalize; color: ${data.priority === 'high' ? '#EF4444' : data.priority === 'medium' ? '#F59E0B' : '#10B981'};">${data.priority}</span></p>
              ${data.dueDate ? `<p style="margin: 5px 0;"><strong>Due Date:</strong> ${new Date(data.dueDate).toLocaleDateString()}</p>` : ''}
            </div>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${this.configService.get<string>('FRONTEND_URL') || 'http://localhost:3000'}/tasks/${data.taskId}" 
                 style="display: inline-block; padding: 12px 24px; background-color: #10B981; color: white; text-decoration: none; border-radius: 6px;">
                View Task
              </a>
            </div>
            <p>Please review the task details and update the status as you make progress.</p>
            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;">
            <p style="color: #6b7280; font-size: 12px;">Task Management System</p>
          </div>
        `,
      },
      'task-update': {
        subject: `Task "${data.taskTitle}" has been updated`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h1 style="color: #F59E0B; text-align: center;">Task Update</h1>
            <p>Hello ${data.assigneeName},</p>
            <p>${data.updaterName} has updated the task "${data.taskTitle}" that you're assigned to.</p>
            <div style="background-color: #f8f9fa; border-left: 4px solid #F59E0B; padding: 15px; margin: 20px 0;">
              <h3 style="margin: 0 0 10px 0; color: #1f2937;">Update Details:</h3>
              <p style="margin: 5px 0;"><strong>Task:</strong> ${data.taskTitle}</p>
              <p style="margin: 5px 0;"><strong>New Status:</strong> <span style="text-transform: capitalize; color: ${data.newStatus === 'done' ? '#10B981' : data.newStatus === 'blocked' ? '#EF4444' : '#3B82F6'};">${data.newStatus ? data.newStatus.replace('_', ' ') : 'Unknown'}</span></p>
            </div>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${this.configService.get<string>('FRONTEND_URL') || 'http://localhost:3000'}/tasks/${data.taskId}" 
                 style="display: inline-block; padding: 12px 24px; background-color: #3B82F6; color: white; text-decoration: none; border-radius: 6px;">
                View Task
              </a>
            </div>
            <p>Check the task for more details and any additional updates.</p>
            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;">
            <p style="color: #6b7280; font-size: 12px;">Task Management System</p>
          </div>
        `,
      },
      'issue-assignment': {
        subject: `You've been assigned to issue "${data.issueTitle}"`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h1 style="color: #EF4444; text-align: center;">Issue Assignment</h1>
            <p>Hello ${data.assigneeName},</p>
            <p>${data.assignerName} has assigned you to an issue in our Task Management System.</p>
            <div style="background-color: #f8f9fa; border-left: 4px solid #EF4444; padding: 15px; margin: 20px 0;">
              <h3 style="margin: 0 0 10px 0; color: #1f2937;">Issue Details:</h3>
              <p style="margin: 5px 0;"><strong>Title:</strong> ${data.issueTitle}</p>
              ${data.issueDescription ? `<p style="margin: 5px 0;"><strong>Description:</strong> ${data.issueDescription}</p>` : ''}
              <p style="margin: 5px 0;"><strong>Severity:</strong> <span style="text-transform: capitalize; color: ${data.severity === 'critical' ? '#DC2626' : data.severity === 'high' ? '#EF4444' : data.severity === 'medium' ? '#F59E0B' : '#10B981'};">${data.severity}</span></p>
            </div>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${this.configService.get<string>('FRONTEND_URL') || 'http://localhost:3000'}/issues/${data.issueId}" 
                 style="display: inline-block; padding: 12px 24px; background-color: #EF4444; color: white; text-decoration: none; border-radius: 6px;">
                View Issue
              </a>
            </div>
            <p>Please investigate and resolve this issue as soon as possible.</p>
            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;">
            <p style="color: #6b7280; font-size: 12px;">Task Management System</p>
          </div>
        `,
      },
    };

    const template = templates[type];
    if (!template) {
      throw new Error(`Email template '${type}' not found`);
    }

    if (this.transporter) {
      try {
        const mailOptions = {
          from: `"Task Management System" <hw93goj@gmail.com>`,
          to: data.email,
          subject: template.subject,
          html: template.html,
          text: type === 'otp' ? `Your OTP code is: ${data.otp}. This code expires in 10 minutes.` : undefined,
        };

        const result = await this.transporter.sendMail(mailOptions);
        return { success: true, messageId: result.messageId };
      } catch (error) {
        console.error(`Failed to send ${type} email to ${data.email}:`, error.message);
        return { success: false, error: error.message };
      }
    } else {
      console.error('No SMTP transporter available');
      return { success: false, error: 'No SMTP transporter configured' };
    }
  }
}
import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { ContractEmailDto } from '../contracts/dto/contract.email.dto';

@Injectable()
export class EmailService {
  private transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASSWORD,
    },
  });

  async sendMail(to: string, subject: string, content: string): Promise<void> {
    try {
      await this.transporter.sendMail({
        from: `"Your Company" <support@pedxo.com>`,
        to,
        subject,
        html: content,
      });
      console.log(`Email sent to ${to}`);
    } catch (error) {
      console.error(`Failed to send email to ${to}:`, error);
      throw new Error('Failed to send email');
    }
  }

  async sendContractEmail(contractDto: ContractEmailDto): Promise<void> {
    const emailBody = `
      <h1>Hello Victor,</h1>
      <h3>Here are the details of ${contractDto.clientName}"s contract:</h3>
      <ul>
        <li><strong>Location:</strong> ${contractDto.location}</li>
        <li><strong>Role:</strong> ${contractDto.roleTitle || 'N/A'}</li>
        <li><strong>Seniority Level:</strong> ${contractDto.seniorityLevel || 'N/A'}</li>
        <li><strong>Scope of Work:</strong> ${contractDto.scopeOfWork}</li>
        <li><strong>Start Date:</strong> ${contractDto.startDate}</li>
        <li><strong>End Date:</strong> ${contractDto.endDate || 'N/A'}</li>
        <li><strong>Payment Rate:</strong> ${contractDto.paymentRate} per ${contractDto.paymentFrequency}</li>
        <li><strong>Contract Status:</strong> ${contractDto.isCompleted ? 'Completed' : 'In Progress'}</li>
      </ul>
      ${contractDto.signature ? `<p><strong>Signature:</strong> <img src="${contractDto.signature}" alt="Signature" width="150"/></p>` : ''}
      <p>Thank you.</p>`;

    await this.sendMail(process.env.OWNER_EMAIL, 'New Onboarding Request', emailBody);
  }

  async sendPlainTextEmail(to: string, subject: string, text: string): Promise<void> {
    try {
      await this.transporter.sendMail({
        from: `"Your Company" <${process.env.GMAIL_USER}>`,
        to,
        subject,
        text,
      });
      console.log(`Plain text email sent to ${to}`);
    } catch (error) {
      console.error(`Failed to send plain text email to ${to}:`, error);
      throw new Error('Failed to send plain text email');
    }
  }

  async sendEmailWithAttachment(
    to: string,
    subject: string,
    content: string,
    attachments: nodemailer.Attachment[],
  ): Promise<void> {
    try {
      await this.transporter.sendMail({
        from: `"Your Company" <${process.env.GMAIL_USER}>`,
        to,
        subject,
        html: content,
        attachments,
      });
      console.log(`Email with attachment sent to ${to}`);
    } catch (error) {
      console.error(`Failed to send email with attachment to ${to}:`, error);
      throw new Error('Failed to send email with attachment');
    }
  }

  async verifyConnection(): Promise<void> {
    try {
      await this.transporter.verify();
      console.log('Server is ready to send emails');
    } catch (error) {
      console.error('Failed to verify email server connection:', error);
      throw new Error('Failed to verify email server connection');
    }
  }
}
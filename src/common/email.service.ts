// import { Injectable } from '@nestjs/common';
// import * as nodemailer from 'nodemailer';
// import SMTPTransport from 'nodemailer/lib/smtp-transport';
// import { ContractEmailDto } from '../contracts/dto/contract.email.dto';
// import Mail from 'nodemailer/lib/mailer';

// @Injectable()
// export class EmailService {
//   private transporter = nodemailer.createTransport({
//     host: 'smtp.gmail.com',
//     port: 465,
//     secure: true,
//     auth: {
//       user: process.env.GMAIL_USER,
//       pass: process.env.GMAIL_PASSWORD,
//     },
//     tls: {
//       rejectUnauthorized: false,
//     },
//   } as SMTPTransport.Options);

//   constructor() {
//     this.verifyConnection();
//   }

//   private async verifyConnection() {
//     try {
//       await this.transporter.verify();
//       console.log('✅ SMTP server is ready to take messages');
//     } catch (err) {
//       console.error('❌ SMTP verify failed:', err);
//     }
//   }

//   async sendMail(to: string, subject: string, content: string): Promise<void> {
//     try {
//       await this.transporter.sendMail({
//         from: `"Pedxo" <${process.env.GMAIL_USER}>`,
//         to,
//         subject,
//         html: content,
//       });
//       console.log(`Email sent to ${to}`);
//     } catch (error) {
//       console.error(`Failed to send email to ${to}:`, error);
//       throw new Error('Failed to send email');
//     }
//   }

//   async sendContractEmail(contractDto: ContractEmailDto): Promise<void> {
//     const emailBody = `
//     <h1>New Onboarding Request</h1>

//     <h2>Personal Details</h2>
//     <p><strong>Client Name:</strong> ${contractDto.clientName}</p>
//     <p><strong>Email:</strong> ${contractDto.email}</p>
//     <p><strong>Country:</strong> ${contractDto.country}</p>
//     <p><strong>State:</strong> ${contractDto.region}</p>
//     <p><strong>Company Name:</strong> ${contractDto.companyName}</p>

//     <h2>${contractDto.contractType} Contract</h2>
//     <p><strong>Role Title:</strong> ${contractDto.roleTitle || 'N/A'}</p>
//     <p><strong>Seniority Level:</strong> ${contractDto.seniorityLevel || 'N/A'}</p>
//     <p><strong>Scope Of Explanation And Tech Stack Requirements:</strong> ${contractDto.scopeOfWork} <br></p>

//     <h2>Project Timeline</h2>
//     <p><strong>Start Date:</strong> ${contractDto.startDate}</p>
//     <p><strong>End Date:</strong> ${contractDto.endDate || 'N/A'}</p>
//     <p><strong>Explanation of Scope of Work:</strong> ${contractDto.explanationOfScopeOfWork}</p>

//     <h2>Compensation and Budget</h2>
//     <p><strong>Payment Rate:</strong> ${contractDto.paymentRate}</p>
//     <p><strong>Payment Frequency:</strong> ${contractDto.paymentFrequency}</p>

//     <p>Thank you.</p>
//   `;
//     await this.sendMail(
//       process.env.OWNER_EMAIL,
//       'New Onboarding Request',
//       emailBody,
//     );
//     await this.sendMail(
//       process.env.GMAIL_USER,
//       'New Onboarding Request',
//       emailBody,
//     );
//   }

//   async sendPlainTextEmail(
//     to: string,
//     subject: string,
//     text: string,
//   ): Promise<void> {
//     try {
//       await this.transporter.sendMail({
//         from: `"Pedxo" <${process.env.GMAIL_USER}>`,
//         to,
//         subject,
//         text,
//       });
//       console.log(`Plain text email sent to ${to}`);
//     } catch (error) {
//       console.error(`Failed to send plain text email to ${to}:`, error);
//       throw new Error('Failed to send plain text email');
//     }
//   }

//   async sendEmailWithAttachment(
//     to: string,
//     subject: string,
//     content: string,
//     attachments: Mail.Attachment[],
//   ): Promise<void> {
//     try {
//       await this.transporter.sendMail({
//         from: `"Pedxo" <${process.env.GMAIL_USER}>`,
//         to,
//         subject,
//         html: content,
//         attachments,
//       });
//       console.log(`Email with attachment sent to ${to}`);
//     } catch (error) {
//       console.error(`Failed to send email with attachment to ${to}:`, error);
//       throw new Error('Failed to send email with attachment');
//     }
//   }
// }

import { Injectable } from '@nestjs/common';
import { Resend } from 'resend';
import { ContractEmailDto } from '../contracts/dto/contract.email.dto';
import Mail from 'nodemailer/lib/mailer'; // still needed for attachment typing

@Injectable()
export class EmailService {
  private resend = new Resend(process.env.RESEND_API_KEY);

  constructor() {
    this.verifyConnection();
  }

  private async verifyConnection() {
    try {
      // Resend does not have verify(), so we trigger a simple request
      await this.resend.apiKeys.list();
      console.log('✅ Resend connection verified');
    } catch (err) {
      console.error('❌ Resend verify failed:', err);
    }
  }

  async sendMail(to: string, subject: string, content: string): Promise<void> {
    try {
      await this.resend.emails.send({
        from: `"Pedxo" <${process.env.OWNER_EMAIL}>`,
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
      <h1>New Onboarding Request</h1>

      <h2>Personal Details</h2>
      <p><strong>Client Name:</strong> ${contractDto.clientName}</p>
      <p><strong>Email:</strong> ${contractDto.email}</p>
      <p><strong>Country:</strong> ${contractDto.country}</p>
      <p><strong>State:</strong> ${contractDto.region}</p>
      <p><strong>Company Name:</strong> ${contractDto.companyName}</p>

      <h2>${contractDto.contractType} Contract</h2>
      <p><strong>Role Title:</strong> ${contractDto.roleTitle || 'N/A'}</p>
      <p><strong>Seniority Level:</strong> ${contractDto.seniorityLevel || 'N/A'}</p>
      <p><strong>Scope Of Explanation And Tech Stack Requirements:</strong> ${contractDto.scopeOfWork}</p>

      <h2>Project Timeline</h2>
      <p><strong>Start Date:</strong> ${contractDto.startDate}</p>
      <p><strong>End Date:</strong> ${contractDto.endDate || 'N/A'}</p>
      <p><strong>Explanation of Scope of Work:</strong> ${contractDto.explanationOfScopeOfWork}</p>

      <h2>Compensation and Budget</h2>
      <p><strong>Payment Rate:</strong> ${contractDto.paymentRate}</p>
      <p><strong>Payment Frequency:</strong> ${contractDto.paymentFrequency}</p>

      <p>Thank you.</p>
    `;

    await this.sendMail(
      process.env.OWNER_EMAIL,
      'New Onboarding Request',
      emailBody,
    );

    await this.sendMail(
      process.env.GMAIL_USER,
      'New Onboarding Request',
      emailBody,
    );
  }

  async sendPlainTextEmail(
    to: string,
    subject: string,
    text: string,
  ): Promise<void> {
    try {
      await this.resend.emails.send({
        from: `"Pedxo" <${process.env.OWNER_EMAIL}>`,
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
    attachments: Mail.Attachment[],
  ): Promise<void> {
    try {
      await this.resend.emails.send({
        from: `"Pedxo" <${process.env.OWNER_EMAIL}>`,
        to,
        subject,
        html: content,
        attachments: attachments.map((a) => ({
          filename: a.filename,
          content: a.content as any, // Resend accepts Buffer or string
        })),
      });
      console.log(`Email with attachment sent to ${to}`);
    } catch (error) {
      console.error(`Failed to send email with attachment to ${to}:`, error);
      throw new Error('Failed to send email with attachment');
    }
  }
}

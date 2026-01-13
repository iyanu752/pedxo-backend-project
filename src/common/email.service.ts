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

  async sendTalentAssignmentEmail(payload: {
    talentEmail: string;
    talentName: string;
    clientName: string;
    companyName: string;
    roleTitle?: string;
    contractType: string;
  }) {
    const emailBody = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
      <h2 style="color: #0a66c2;">You've Been Assigned to a New Contract 🎉</h2>

      <p>Hello <strong>${payload.talentName}</strong>,</p>

      <p>
        You’ve been assigned to a new <strong>${payload.contractType}</strong> contract
        on <strong>Pedxo</strong>.
      </p>

      <hr />

      <h3>Contract Details</h3>
      <p><strong>Client:</strong> ${payload.clientName}</p>
      <p><strong>Company:</strong> ${payload.companyName}</p>
      <p><strong>Role:</strong> ${payload.roleTitle || 'To be discussed'}</p>

      <hr />

      <p>
        Please log in to your Pedxo dashboard to review the contract details
        and take the next steps.
      </p>

      <p style="margin-top: 24px;">
        If you have any questions, feel free to reach out.
      </p>

      <p>
        Cheers,<br />
        <strong>The Pedxo Team</strong>
      </p>
    </div>
  `;

    await this.sendMail(
      payload.talentEmail,
      'You’ve been assigned to a new contract',
      emailBody,
    );
  }

  async sendClientTalentAssignedEmail(payload: {
    to: string;
    contractId: string;
    companyName: string;
    contractType: string;
    roleTitle?: string;
    startDate: Date;
    endDate?: Date;
    talents: {
      fullName: string;
      email: string;
      roleTitle?: string;
      experienceLevel?: string;
      location?: string;
      github?: string;
      portfolio?: string;
    }[];
  }) {
    const talentsHtml = payload.talents
      .map(
        (t, i) => `
      <tr>
        <td style="padding:8px;">${i + 1}</td>
        <td style="padding:8px;">${t.fullName}</td>
        <td style="padding:8px;">${t.roleTitle || 'N/A'}</td>
        <td style="padding:8px;">${t.experienceLevel || 'N/A'}</td>
        <td style="padding:8px;">${t.location || 'N/A'}</td>
        <td style="padding:8px;">
          ${t.github ? `<a href="${t.github}">GitHub</a>` : '—'}
          ${t.portfolio ? ` | <a href="${t.portfolio}">Portfolio</a>` : ''}
        </td>
      </tr>
    `,
      )
      .join('');

    const emailBody = `
    <div style="font-family:Arial,sans-serif;color:#333;">
      <h2 style="color:#0a66c2;">Talent Assigned Successfully ✅</h2>

      <p>Talent has been assigned to your contract.</p>

      <h3>Contract Summary</h3>
      <p><strong>Contract ID:</strong> ${payload.contractId}</p>
      <p><strong>Company:</strong> ${payload.companyName}</p>
      <p><strong>Contract Type:</strong> ${payload.contractType}</p>
      <p><strong>Role:</strong> ${payload.roleTitle || 'N/A'}</p>
      <p>
        <strong>Duration:</strong>
        ${payload.startDate.toDateString()}
        ${payload.endDate ? ` – ${payload.endDate.toDateString()}` : ''}
      </p>

      <h3>Assigned Talent</h3>

      <table width="100%" border="1" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
        <thead style="background:#f5f5f5;">
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Role</th>
            <th>Experience</th>
            <th>Location</th>
            <th>Links</th>
          </tr>
        </thead>
        <tbody>
          ${talentsHtml}
        </tbody>
      </table>

      <p style="margin-top:20px;">
        Log in to your Pedxo dashboard to manage this contract.
      </p>

      <p><strong>Pedxo Team</strong></p>
    </div>
  `;

    await this.sendMail(
      payload.to,
      'Talent assigned to your contract',
      emailBody,
    );
  }
}

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
         <td style="padding:8px;">${t.email}</td>
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
            <th>Email</th>
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
  Log in to your Pedxo dashboard to manage this contract:
  <br />
    <a href="https://pedxo.com/login" target="_blank" style="color:#0a66c2;">
    https://pedxo.com/login
    </a>
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

  async sendClientContractDeletedEmail(payload: {
    to: string;
    contractId: string;
    companyName: string;
    roleTitle?: string;
    contractType: string;
  }) {
    const emailBody = `
  <div style="font-family:Arial,sans-serif;color:#222;line-height:1.6;">
    <h2 style="color:#c0392b;">Contract Successfully Terminated ❌</h2>

    <p>
      This is to confirm that your contract on Pedxo has been terminated.
    </p>

    <hr />

    <h3>Contract Summary</h3>
    <p><strong>ID:</strong> ${payload.contractId}</p>
    <p><strong>Company:</strong> ${payload.companyName}</p>
    <p><strong>Role:</strong> ${payload.roleTitle || 'N/A'}</p>
    <p><strong>Type:</strong> ${payload.contractType}</p>

    <hr />

    <p>
      If you have any questions, please contact the Pedxo team.
    </p>

    <p style="margin-top:24px;">
      Regards,<br />
      <strong>Pedxo Team</strong>
    </p>
  </div>
  `;

    await this.sendMail(
      payload.to,
      'Your contract has been terminated',
      emailBody,
    );
  }

  async sendTalentContractTerminationEmail(payload: {
    to: string;
    fullName: string;
    companyName: string;
    roleTitle?: string;
    contractId: string;
  }) {
    const emailBody = `
    <div style="font-family:Arial,sans-serif;color:#222;line-height:1.6;">
      <h2 style="color:#c0392b;">Contract Termination Notice ❌</h2>

      <p>Hello <strong>${payload.fullName}</strong>,</p>

      <p>
        This is to inform you that your assignment with
        <strong>${payload.companyName}</strong> on Pedxo has been terminated.
      </p>

      <hr />

      <h3>Contract Details</h3>
      <p><strong>Contract ID:</strong> ${payload.contractId}</p>
      <p><strong>Company:</strong> ${payload.companyName}</p>
      <p><strong>Role:</strong> ${payload.roleTitle || 'N/A'}</p>

      <hr />

      <p>
        If you believe this is an error or need clarification,
        please contact the Pedxo support team.
      </p>

      <p style="margin-top:24px;">
        Regards,<br />
        <strong>Pedxo Team</strong>
      </p>
    </div>
  `;

    await this.sendMail(payload.to, 'Contract Terminated on Pedxo', emailBody);
  }

  async sendContractUpdatedAlert(payload: {
    to: string;
    contractId: string;
    companyName: string;
    changes: {
      field: string;
      oldValue: any;
      newValue: any;
    }[];
  }) {
    const changesHtml = payload.changes
      .map(
        (c) => `
      <tr>
        <td style="padding:8px;">${c.field}</td>
        <td style="padding:8px;">${c.oldValue ?? '—'}</td>
        <td style="padding:8px;">${c.newValue ?? '—'}</td>
      </tr>
    `,
      )
      .join('');

    const emailBody = `
    <div style="font-family:Arial,sans-serif;color:#333;">
      <h2 style="color:#d97706;">Contract Updated ⚠️</h2>

      <p>A contract has just been edited.</p>

      <p><strong>Contract ID:</strong> ${payload.contractId}</p>
      <p><strong>Company:</strong> ${payload.companyName}</p>

      <h3>Updated Fields</h3>

      <table width="100%" border="1" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
        <thead style="background:#fef3c7;">
          <tr>
            <th>Field</th>
            <th>Previous Value</th>
            <th>New Value</th>
          </tr>
        </thead>
        <tbody>
          ${changesHtml}
        </tbody>
      </table>

      <p style="margin-top:20px;">
        Please review this update in the admin dashboard if necessary.
      </p>

      <p><strong>Pedxo Ops Team</strong></p>
    </div>
  `;

    await this.sendMail(payload.to, 'Contract updated on Pedxo', emailBody);
  }

  async sendContractDeletedEmail(payload: {
    to: string;
    contract: {
      _id: string;
      companyName: string;
      roleTitle?: string;
      contractType: string;
      clientName: string;
      email: string;
      country: string;
      region?: string;
      startDate: Date;
      endDate?: Date;
      paymentRate: number;
      paymentFrequency: string;
      talentAssignedId?: string[];
    };
    performanceRating: number;
    terminationReason: string;
  }) {
    const talentList = payload.contract.talentAssignedId?.length
      ? payload.contract.talentAssignedId.join(', ')
      : 'None';

    const emailBody = `
  <div style="font-family:Arial,sans-serif;color:#222;">
    <h2 style="color:#c0392b;">Contract Terminated ❌</h2>

    <p>A contract has been deleted.</p>

    <h3>Contract Summary</h3>
    <p><strong>ID:</strong> ${payload.contract._id}</p>
    <p><strong>Company:</strong> ${payload.contract.companyName}</p>
    <p><strong>Client:</strong> ${payload.contract.clientName}</p>
    <p><strong>Email:</strong> ${payload.contract.email}</p>
    <p><strong>Country:</strong> ${payload.contract.country}</p>
    ${
      payload.contract.region
        ? `<p><strong>Region:</strong> ${payload.contract.region}</p>`
        : ''
    }

    <p><strong>Role:</strong> ${payload.contract.roleTitle || 'N/A'}</p>
    <p><strong>Type:</strong> ${payload.contract.contractType}</p>

    <p><strong>Start Date:</strong> ${payload.contract.startDate.toDateString()}</p>
    ${
      payload.contract.endDate
        ? `<p><strong>End Date:</strong> ${payload.contract.endDate.toDateString()}</p>`
        : ''
    }

    <p><strong>Payment:</strong> ${payload.contract.paymentRate} (${payload.contract.paymentFrequency})</p>

    <h3>Assigned Talents (IDs)</h3>
    <p>${talentList}</p>

    <h3>Termination Review</h3>
    <p><strong>Performance Rating:</strong> ${payload.performanceRating}/5 ⭐</p>
    <p><strong>Reason:</strong> ${payload.terminationReason}</p>

    <hr />

    <p style="margin-top:20px;">
      <strong>Pedxo Admin Alert</strong>
    </p>
  </div>
  `;

    await this.sendMail(payload.to, 'Contract terminated on Pedxo', emailBody);
  }
}

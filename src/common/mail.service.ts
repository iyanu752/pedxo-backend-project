import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { ContractEmailDto } from '../contracts/dto/contract.email.dto';

@Injectable()
export class MailService {
  private transporter = nodemailer.createTransport({
    service: 'gmail', // Use 'gmail' as the service
    auth: {
      user: process.env.GMAIL_USER, // Your Gmail email address
      pass: process.env.GMAIL_PASSWORD, // Your Gmail password or app-specific password
    },
  });

  async sendContractEmail(contractDto: ContractEmailDto) {
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

    return this.transporter.sendMail({
      from: `"Your Company" <${process.env.GMAIL_USER}>`, // Use your Gmail email address
      to: process.env.OWNER_EMAIL, // Recipient email address
      subject: `New Onboarding Request`,
      html: emailBody,
    });
  }
}
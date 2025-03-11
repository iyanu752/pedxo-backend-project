import { ContractDocument } from '../schemas/contract.schema';

export class ContractEmailDto {
  clientName: string;
  email: string;
  location: string;
  roleTitle?: string;
  seniorityLevel?: string;
  scopeOfWork: string;
  startDate: string;
  endDate?: string;
  paymentRate: number;
  paymentFrequency: string;
  signature?: string;
  isCompleted: boolean;

  constructor(contract: ContractDocument) {
    this.clientName = contract.clientName;
    this.email = contract.email;
    this.location = contract.location;
    this.roleTitle = contract.roleTitle;
    this.seniorityLevel = contract.seniorityLevel;
    this.scopeOfWork = contract.scopeOfWork;
    this.startDate = contract.startDate.toISOString().split('T')[0]; // Format to YYYY-MM-DD
    this.endDate = contract.endDate ? contract.endDate.toISOString().split('T')[0] : undefined;
    this.paymentRate = contract.paymentRate;
    this.paymentFrequency = contract.paymentFrequency;
    this.signature = contract.signature;
    this.isCompleted = contract.isCompleted;
  }
}

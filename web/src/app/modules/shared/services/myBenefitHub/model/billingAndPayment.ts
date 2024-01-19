export interface BillingAndPayment {
  financialAccountId: string;
  balance: string;
  totalSuspense: string;
  billingConfigs?: BillingConfigs[];
}

export interface BillingAccounts {
  billingAccounts: BillingAccount[];
}

export interface BillingAccount {
  financialAccountId: string;
  balance: number;
  totalSuspense: string;
  billingConfigs?: BillingConfigs;
}

export interface PaymentDueDetails {
  totalPaymentDue: number;
  nPaymentsDue: number;
}

export interface BillingConfigs {
  billingServiceTechId: string;
  paymentFormat: string;
  nextBillingGenerationDate: string;
  nextBillingPeriodStartDate: string;
  achDay: string;
  achNextDay: string;
  lapseDate: string;
  status: string;
  effectiveDate: string;
  terminationDate: string;
  invoiceFrequency: string;
  bankAccountTechId: string;
  bankName: string;
  accountType: string;
  routingNumber: string;
  bankAccountNumber: string;
  bankAccountName: string;
  achEffectiveDate: string;
  surrenderStatus: string;
  invoices?: Invoices[];
  downstreamProcessingStatus?: string;
}

interface Invoices {
  InvoiceTechId: string;
  InvoiceNumber: string;
  BillingFromDate: string;
  BillingToDate: string;
  InvoiceDueDate: string;
  TotalDue: string;
  RemainingDue: string;
  ACHPullDate: string;
  InvoiceDetails?: InvoiceDetails[];
  Payment_Details?: PaymentDetails[];
}

interface InvoiceDetails {
  BilledCoverageTechId: string;
  CoverageName: string;
  ProductType: string;
  InsuredFirstName: string;
  InsuredLastName: string;
  InsuredSuffix: string;
  PolicyNumber: string;
  ServiceDescription: string;
  PremiumDue: string;
  IsABillingCharge: string;
  IsAWriteOff: string;
  PaidAmount: string;
}

interface PaymentDetails {
  PaymentTechId: string;
  PaymentType: string;
  InvoicePaymentAmount: string;
  PaymentCheckNumber: string;
  PaymentBankName: string;
  PaymentRoutingNumber: string;
  PaymentAccountNumber: string;
  PaymentAccountName: string;
  PaymentDate: string;
  ConfirmationNumber: string;
}

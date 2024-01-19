export interface Participant {
  firstName: string;
  lastName: string;
  birthDate: string;
  displayName: string;
  age: string;
  nameDobDiff: boolean;
  profileId: string;
}

export interface Account {
  agreementId?: string;
  accountTitle: string;
  accountBalance: string;
  accountBalanceAsOf: string;
  sourceSystem?: string;
  suppressTab: boolean;
  voyaSavings: string;
  includedInOrangeMoney: boolean;
  accountAllowedForMyVoya: boolean;
  additionalPlanBalances?: AdditionalPlanBalances[];
  clientId: string;
  planId: string;
  planType: string;
  accountNumber: string;
  needOMAutomaticUpdate: boolean;
  planName: string;
  mpStatus: string;
  clientAllowed4myVoyaOrSSO: boolean;
  useMyvoyaHomepage: boolean;
  advisorNonMoneyTxnAllowed: boolean;
  advisorMoneyTxnAllowed: boolean;
  nqPenCalPlan: boolean;
  enrollmentAllowed: boolean;
  autoEnrollmentAllowed: boolean;
  vruPhoneNumber: string;
  rmdRecurringPaymentInd: string;
  navigateToRSPortfolio: boolean;
  planLink: string;
  openDetailInNewWindow: boolean;
  nqPlan: boolean;
  new: boolean;
  eligibleForOrangeMoney: boolean;
  iraplan: boolean;
  xsellRestricted: boolean;
  isVoyaAccessPlan: boolean;
  isRestrictedRetirementPlan: boolean;
  isVDAApplication: boolean;
  isVendorPlan: boolean;
  isHSAAccount?: boolean;
  hsaAccountData?: HSAAccount;
  portalSupportFlag?: boolean;
  clientDomain?: string;
  csSessionId?: string;
  accountType?: string;
  isSavingsPlan?: boolean;
  oldPlanLink?: string;
}

export interface SubAccountsData {
  dataStatus?: string;
  errorCode?: string;
  accounts?: Account[];
}

export interface AccountsData {
  retirementAccounts?: SubAccountsData;
  brokerageAccounts?: SubAccountsData;
  vendorAccounts?: SubAccountsData;
  stockAccounts?: SubAccountsData;
  hsaAccounts?: SubAccountsData;
}

export interface ExternalLink {
  id: string;
  link: string;
  label: string;
  popup: boolean;
}

export interface AccountJsonModel {
  managedBy: string;
  accBalance: string;
  vestedBalance: string;
  vestedAmt: string;
  Gainloss: string;
  gainAmt: string;
  Rateofreturn: string;
  rateAmt: string;
  Loanamount: string;
  Loan: string;
  Amount: string;
  loanAmt: string;
  Dividends: string;
  dividentAmt: string;
  Contribution: string;
  contribAmt: string;
  Employercontribution: string;
  EmployerAmt: string;
  Year: string;
  yearAmt: string;
  asOf: string;
  cannotHSA: string;
  last90Days: string;
  viewmore: string;
  noTransactions: string;
  close: string;
  goToMatch: string;
  notThisTime: string;
  addAccount: string;
  manageAccounts: string;
  outsideAccounts: string;
  accountsConnected: string;
  accountsLinkedToast: string;
  accountsUnLinkedToast: string;
}

export interface HSAAccount {
  HAS_PARTY_ID: string;
  Plan_ID: number;
  Current_Or_Prior: string;
  Plan_Year_End_Date: string;
  Plan_Type: string;
  Plan_Name: string;
  Plan_Link?: string;
  Election_Amount: number;
  Calculated_Contribution: number;
  YTD_Contributions: number;
  Employer_Election_Amount: number;
  Employer_YTD_Contributions: number;
  AvailableBalance: number;
  CashBalance: number;
  TotalBalance: number;
  InvestmentBalance: number;
  AsOfDate: string;
  YTD_Wellness_Contributions?: number;
  Pay_Period_Count?: string;
  Individual_Family?: string;
  OLD_PLANLINK?: string;
}

export interface HSAAccountsObject {
  Status: string;
  AllAccountsBalance: HSAAccount[];
}

interface AdditionalPlanBalances {
  rowTitle?: string;
  rowValues?: AdditionalPlanBalances[];
  label?: string;
  value?: string;
}

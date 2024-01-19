export interface AccountData {
  accountBalance: string;
  accountBalanceAsOf: string;
  accountNumber: string;
  accountTitle: string;
  accountType: string;
  accountOpenDate: string;
  suppressTab: boolean;
  planLink: string;
  actualPlanLink?: string;
  mediumLogoUrl: string;
  smallLogoUrl: string;
  bodyText: string;
  buttonText: string;
  ebooksLink: EbooksLink;
  sourceSystem: string;
  voyaSavings: string;
  includedInOrangeMoney: boolean;
  accountAllowedForMyVoya: boolean;
  clientId: string;
  planId: string;
  planType: string;
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
}
export interface EbooksLink {
  label?: string;
  url?: string;
}

export interface CategorizedAccounts {
  accType?: string;
  id?: string;
  accountsCount?: number;
  accountsTotalBalance?: number;
  accounts?: AccountData[];
  enrollEligible?: boolean;
}

export interface AccountGroup {
  hasMXAccount?: boolean;
  categorizedAccounts?: CategorizedAccounts[];
  snapshotAccounts?: SnapshotAccounts;
}

export interface SnapshotAccounts {
  totalBalance?: string;
  accounts?: AccountData[];
}

export interface HSAorFSA {
  hsa: boolean;
  fsa: boolean;
}

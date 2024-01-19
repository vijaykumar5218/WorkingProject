import {
  GroupingCategoryDetails,
  NameCategory,
} from '../../../components/coverages/models/chart.model';

export interface TPACarrier {
  carrierName: string;
  carrierId: number;
  payerId: number;
  logoUrl: string;
  connectionStatus: string;
  loginProblem: string;
  loginMessage?: string;
  crawlStatus: string;
  crawlCount: number;
  totalOutOfPocketAmount: number;
  claimsCount: number;
}

export interface TPAClaimsData {
  carriers: TPACarrier[];
  claims: NameCategory[];
  groupingCategoryDetails: GroupingCategoryDetails;
  memberId: number;
  groupingClaimsByYear?: GroupingClaimsByYear;
}

export interface GroupingClaimsByYear {
  [key: string]: GroupedClaims;
}

export interface GroupedClaims {
  claimTotalCount: number;
  inNetworkTotalCount: number;
  outNetworkTotalCount: number;
  outOfPocketAmountTotal: number;
  year: string;
  aggregateServiceNameClaims?: AggregateServiceNameClaims;
}

export interface AggregateServiceNameClaims {
  [key: string]: {
    claimTotalCount: number;
    inNetworkTotalCount: number;
    outNetworkTotalCount: number;
    outOfPocketAmountTotal: number;
    serviceName: string;
  };
}

export interface Abcd {
  [key: string]: YearCategory;
}

export interface YearCategory {
  name: string;
}

export enum TPAWarningType {
  IN_PROCCESS,
  CONNECTION_ERROR,
}

export interface TPAWarning {
  warningType: TPAWarningType;
  errorMessage?: string;
  carrier: string;
}

export interface TPAInsightContent {
  colors: Colors;
  serviceName: ServiceNameTPA;
}

export interface Colors {
  medical: string;
  dental: string;
  vision: string;
  rx: string;
  facility: string;
}

export interface ServiceNameTPA {
  medical: string;
  dental: string;
  vision: string;
  rx: string;
  facility: string;
}

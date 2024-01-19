export interface OrangeData {
  orangeData?: {
    participantData?: {
      investmentRateOfReturn: number;
      retirementAge: number;
      currentAnnualSalary: number;
    };
    participantDefinedContributionAccounts?: ParticipantDefinedContributionAccounts[];
    omTitle?: string;
  };
  feForecastData?: {
    investmentRateOfReturn?: number;
    participantData?: {
      selectedRetirementAge: number;
      salary: {
        amount: number;
        growthRate: number;
      };
      retirementAgeSlider: {
        min: number;
        max: number;
      };
    };
    feForecast?: {
      totalIncome: number;
      goal: number;
      errorCode: string;
      desiredGoal: number;
      minimumGoal: number;
    };
    omTitle?: string;
  };
  madLibData?: MadlibData;
  errorCode?: string;
  errorMessage?: string;
  desc?: string;
  omTitle?: string;
}

export interface ParticipantDefinedContributionAccounts {
  contributionData: {
    catchupContributionUnit: any;
    catchupEligible: string;
    catchupIneligibilityReason: string;
    catchupPending: any;
    crcEligible: string;
    crcIneligibilityReason: string;
    regularContributionUnit: string;
    regularPending: {
      txDate: string;
      txNumber: string;
    };
  };
  planInfo: {
    catchupContributionType: string;
    regularContributionType: string;
    sources: ContributionSource[];
    crcAllowed: boolean;
    planId: string;
  };
}

export interface ContributionSource {
  amountMod: number;
  contribution: number;
  id: string;
  ircCode: string;
  limits: {max: number; min: number};
  name: string;
  percentLimits: any;
  percentMod: number;
  type: string;
}

export interface ContributionSourcePayload {
  amount: number;
  id: string;
  type: string;
}

export interface OrangeMoneyEstimates {
  estimatedMonthlyIncome: number;
  estimatedMonthlyGoal: number;
  difference: number;
  retirementAge: number;
  currSalary: number;
}

export enum OMStatus {
  ORANGE_DATA,
  FE_DATA,
  MADLIB_OM,
  MADLIB_FE,
  SERVICE_DOWN,
  UNKNOWN,
}

export interface MadlibData {
  adminUser?: boolean;
  annualSalary?: number;
  dob?: string;
  firstName?: string;
  firstTimeUser?: boolean;
  madLib?: boolean;
  madlibHelpContent?: string;
  omTitle?: string;
  participantStatus?: string;
  promoTextForSkip?: string;
  skipMadlibAllowed?: boolean;
  errorCode?: string;
}

export interface RetirementAgeSaveResp {
  result: {
    errors: string[];
    valid: boolean;
  };
}

export interface SalarySaveResp {
  success?: boolean;
  feForecastData?: any;
}

export interface OrangeMoneyHeader {
  OMHeader?: string;
  OMTooltip?: string;
  OMDeeplink?: string;
}

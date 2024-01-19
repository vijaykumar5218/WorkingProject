export interface HSAGoalResponse {
  onFile: boolean;
  notOnFile: boolean;
  overCatchupAge: boolean;
  singleMaxAmt: number;
  familyMaxAmt: number;
  catchUpAmt: number;
  currentBalance?: number;
  individual?: boolean;
  hsaJourneyAnswers: string[];
  accountLinked: boolean;
  accountNotLinked: boolean;
  logoUrl?: string;
  accountName?: string;
  ytdContribution: number;
}

export interface HSAContent {
  HSAGoalJSON: string;
}

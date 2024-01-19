export interface Contribution {
  employersContribution: number;
}

export interface YTDContribution {
  totalYTDContrib: string;
  employeeContrib?: number;
  contribType: string;
  catchupType: string;
  puertoRicoResidentFlag: boolean;
  totalCatchup: number;
}

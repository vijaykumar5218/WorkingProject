export interface CollegeJourneyData {
  dependents: Dependent[];
  collegeTypes: CollegeOption[];
  filingStatuses: CollegeOption[];
  states: CollegeOption[];
  defaultYearsOfAttendance: number;
  defaultCollegeStartAge: number;
  collegeStartAge: InputRange;
  yearsOfAttendance: InputRange;
  inflationRate: InputRange[];
  rateOfReturn: InputRange;
  simpleAnnualInterestRate: InputRange;
}

export interface InputRange {
  label?: string;
  minValue?: number;
  maxValue?: number;
  defaultValue: number;
}

export interface CollegeOption {
  id: string | number;
  inflationRate?: number;
  label: string;
  value: string;
}

export interface Dependent {
  firstName: string;
  age: number;
  id: string;
}

export interface DetailedFees {
  startYear: number;
  endYear: number;
  tuition: number;
  roomAndBoard: number;
  fees: number;
  books: number;
  grantsAndScholarships: number;
  total: number;
}

export interface PortfolioProjector {
  projectedShortfall: number;
  projectedSurplus: number;
  predictedOngoingContributions: number;
  predictedOneTimeContribution: number;
}

export interface CollegeRecords {
  page: number;
  totalPages: number;
  totalEntries: number;
  schools: SchoolDetails[];
}

export interface SchoolDetails {
  id: number;
  name: string;
  schoolType: string;
  schoolDuration: string;
  stateId: string;
}

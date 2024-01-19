import {Dependents} from '@shared-lib/services/benefits/models/benefits.model';
export interface Plan {
  header: {
    label: string;
    rightLink: string;
  };

  tabslabel: {
    details: string;
    transactions: string;
  };

  basic: {
    planType: string;
    plicyLabel: string;
    policyNum: string;
    asOf: string;
  };

  asOfData: AsOfData[];

  dependents: Dependents;

  explanation: Explanation;

  transactions: string;
}

export interface AsOfData {
  label: string;
  val: Date;
}

export interface DependentsData {
  heading: string;
  eachData: EachData[];
  coverage: string;
}

export interface EachData {
  name: string;
  depenedntInfo: DependentInfo[];
}

export interface DependentInfo {
  label: string;
  val: string;
}

export interface Explanation {
  heading: string;
  qa: QA[];
}

export interface QA {
  label: string;
  val: string;
}

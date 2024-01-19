export interface AccessResult {
  clientDomain: string;
  clientId: string;
  clientName: string;
  enableMyVoyage: string;
  planIdList: Plan[];
  currentPlan: Plan;
  myProfileURL: string;
  enableBST: string;
  enableTPA: string;
  enableCoverages: boolean;
  isMxUser?: boolean;
  enableMaintenanceWindow?: string;
  enableMX?: boolean;
  maintenanceMessage?: string;
  voyaSsoAppId?: string;
  myWorkplaceDashboardEnabled?: boolean;
  isHealthOnly?: boolean;
  isMultiClient?: boolean;
  firstTimeLoginWeb: boolean;
  firstTimeLogin: boolean;
  omEligForDashBoard?: boolean;
  hsaStoreEnabled?: boolean;
  nameDobDiff?: string;
  isMyBenefitsUser?: boolean;
  isAltAccessUser?: boolean;
}

interface Plan {
  planId: string;
}

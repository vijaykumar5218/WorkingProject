export interface HealthUtlization {
  categoryDetail?: CategoryDetail;
  inNetworkEventCount: InNetworkEventCount;
  outNetworkEventCount: OutNetworkEventCount;
  inNetworkCost: InNetworkCostOut;
  outNetworkCost: OutNetworkCostOut;
  groupingCategoryDetails?: GroupingCategoryDetails;
  inNetworkCountTotal?: number;
  outNetworkCountTotal?: number;
}

export interface InNetworkCostOut {
  outOfPocketCost: number;
}
export interface OutNetworkCostOut {
  outOfPocketCost: number;
}

export interface InNetworkCost {
  preferredDrugs: number;
  outpatientLabPaths: number;
  specialVisits: number;
  preventive: number;
  genericDrugs: number;
  outpatientXrays: number;
  primaryVisits: number;
  inpatientHosptialCares: number;
  emergencyRoomServices: number;
  outpatientSurgery: number;
  other: number;
}

export interface OutNetworkCost {
  preferredDrugs: number;
  outpatientLabPaths: number;
  specialVisits: number;
  preventive: number;
  genericDrugs: number;
  outpatientXrays: number;
  primaryVisits: number;
  inpatientHosptialCares: number;
  emergencyRoomServices: number;
  outpatientSurgery: number;
  other: number;
}

export interface CategoryDetail {
  emergencyRoomServices: EmergencyRoomServices[];
  genericDrugs: GenericDrugs[];
  inpatientHosptialCares: InpatientHosptialCares[];
  other: Other[];
  outpatientLabPaths: OutpatientLabPaths[];
  outpatientSurgery: OutpatientSurgery[];
  outpatientXrays: OutpatientXrays[];
  preventive: Preventive[];
  primaryVisits: PrimaryVisits[];
  specialVisits: SpecialVisits[];
  inNetworkCost: InNetworkCost;
  outNetworkCost: OutNetworkCost;
}

export interface EmergencyRoomServices {
  inNetwork: boolean;
  outOfPocketCost: number;
  providerName: string;
  serviceDate: string;
}

export interface GenericDrugs {
  inNetwork: boolean;
  outOfPocketCost: number;
  providerName: string;
  serviceDate: string;
}

export interface InpatientHosptialCares {
  inNetwork: boolean;
  outOfPocketCost: number;
  providerName: string;
  serviceDate: string;
}
export interface Other {
  inNetwork: boolean;
  outOfPocketCost: number;
  providerName: string;
  serviceDate: string;
}
export interface OutpatientLabPaths {
  inNetwork: boolean;
  outOfPocketCost: number;
  providerName: string;
  serviceDate: string;
}
export interface OutpatientSurgery {
  inNetwork: boolean;
  outOfPocketCost: number;
  providerName: string;
  serviceDate: string;
}
export interface OutpatientXrays {
  inNetwork: boolean;
  outOfPocketCost: number;
  providerName: string;
  serviceDate: string;
}

export interface Preventive {
  inNetwork: boolean;
  outOfPocketCost: number;
  providerName: string;
  serviceDate: string;
}

export interface PrimaryVisits {
  inNetwork: boolean;
  outOfPocketCost: number;
  providerName: string;
  serviceDate: string;
}

export interface SpecialVisits {
  inNetwork: boolean;
  outOfPocketCost: number;
  providerName: string;
  serviceDate: string;
}

export interface InNetworkEventCount {
  preferredDrugs: number;
  outpatientLabPaths: number;
  specialVisits: number;
  preventive: number;
  genericDrugs: number;
  outpatientXrays: number;
  primaryVisits: number;
  inpatientHosptialCares: number;
  emergencyRoomServices: number;
  outpatientSurgery: number;
  other: number;
}

export interface OutNetworkEventCount {
  preferredDrugs: number;
  outpatientLabPaths: number;
  specialVisits: number;
  preventive: number;
  genericDrugs: number;
  outpatientXrays: number;
  primaryVisits: number;
  inpatientHosptialCares: number;
  emergencyRoomServices: number;
  outpatientSurgery: number;
  other: number;
}

export interface OutNetworkCostNames {
  emergencyRoomServices: string;
  genericDrugs: string;
  inpatientHosptialCares: string;
  other: string;
  outpatientLabPaths: string;
  outpatientSurgery: string;
  outpatientXrays: string;
  preferredDrugs: string;
  preventive: string;
  primaryVisits: string;
  specialVisits: string;
}

export interface HealthContent {
  title: number;
  pieSubTitle: string;
  pieDefaultSubTitle: string;
  totalOutNetwork: number;
  colors: Colors;
  outNetworkCost: OutNetworkCost;
  outNetworkCostNames: OutNetworkCostNames;
  pieData: PieData[];
  bubbleData: BubbleData[];
  myBill: string;
  inNetwork: string;
  outOfNetwork: string;
  inClaimsTxt: string;
  outClaimsTxt: string;
  drugNames: string;
  lastFilled: string;
  thisYearTxt: string;
  lastYearTxt: string;
  segmentValue: string;
  noInfoTxt: string;
  patientName: string;
}

export interface PieTitle {
  title: string;
}

export interface PieData {
  name: string;
  y: number;
  color: string;
}

export interface Colors {
  preferredDrugs: string;
  outpatientLabPaths: string;
  specialVisits: string;
  preventive: string;
  genericDrugs: string;
  outpatientXrays: string;
  primaryVisits: string;
  inpatientHosptialCares: string;
  emergencyRoomServices: string;
  outpatientSurgery: string;
  other: string;
}

export interface YearRange {
  fromYear: number;
  toYear: number;
}

export interface StartEndDate {
  startDate: string;
  endDate: string;
}

export interface GroupingCategoryDetails {
  [key: string]: NameCategory[];
}

export interface AllCategory {
  date?: string;
  name?: NameCategory[];
}

export interface ClaimLine {
  procedure_name: string;
}

export interface NameCategory {
  benefitServiceName?: string;
  inNetwork: boolean;
  outOfPocketCost: number;
  providerName: string;
  serviceDate: string;
  serviceName?: string;
  lastFilledDate?: string;
  insurancePaidAmount?: number;
  drugName?: string;
  carrierName?: string;
  carrierId?: number;
  claimLines?: ClaimLine[];
  patientName?: string;
  firstName?: string;
  lastName?: string;
  relationship?: string;
}

export interface BubbleData {
  name: string;
  data: BubbleDataItem[];
  showInLegend: boolean;
}

export interface BubbleDataItem {
  color: string;
  in: number;
  name: string;
  out: number;
  value: number;
}

export interface InsightsHealthCheck {
  physical: boolean;
  requiredColonScreen: boolean;
  requiredCytologyScreen: boolean;
  requiredMammogramScreen: boolean;
  year: number;
}

export interface HealthDates {
  startDate: string;
  endDate: string;
}

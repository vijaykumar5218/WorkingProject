import {card} from '../../../components/coverages/plan-tabs/plan-details/my-id-card/constants/camera.enum';

export interface Benefits {
  isEnrollmentWindowEnabled: boolean;
  planYear: number;
  enrolled: Benefit[];
  declined: Benefit[];
  provided: Benefit[];
  payrollDeduction?: PayrollDeduction;
}

export interface Benefit {
  name: string;
  benAdminFlag?: boolean;
  coverage: number;
  premium: number;
  employer_premium?: number;
  totalPremium?: number;
  premiumFrequency: string;
  deductible: number;
  type: string;
  id: string;
  deductibleObj: DeductibleObj;
  coverage_levels: CoverageLabels;
  coverageType: string;
  first_name: string;
  benefit_type_title: string;
  coverage_start_date: string;
  coverage_end_date?: string;
  deduction_start_date?: string;
  deduction_end_date?: string;
  planDetails: PlanDetails;
  plan_summary: PlanSummary;
}

export interface PlanDetails {
  id: string;
  type: string;
  coverage_start_date: string;
  coverage_end_date: string;
  employer_premium: number;
  deduction_start_date: string;
  deduction_end_date: string;
  premium: number;
  covered_people_ids: string[];
  dependents: Dependents[];
}

export interface PlanSummary {
  groups: PlanSumGroup[];
  footnotes: FootNote[];
}

export interface FootNote {
  name: string;
  type: string;
  note: string;
  amount?: number;
}

export interface PlanSumGroup {
  name: string;
  items: PlanSumGroupItem[];
  label: string;
}

export interface PlanSumGroupItem {
  name: string;
  type: string;
  qualifiers: string[];
  copay: number;
  coinsurance: number;
  insurance: number;
  has_deductible: boolean;
  footnotes: string[];
  label: string;
  sublabel: string;
  description: string;
  subdescription: string;
}

export interface MyHealthWealth {
  link_name: string;
  title: string;
  description: string;
}

export interface DeductibleObj {
  coinsurance: number;
  copay: number;
  family: number;
  individual: number;
  single: number;
}
export interface CoverageLabels {
  subscriber: number;
  spouse: number;
  child: number;
}

export interface BenefitsSummaryContent {
  header: string;
  payrollText: string;
  coverageLabel: string;
  premiumLabel: string;
  enrolledSectionTitle: string;
  providedSectionTitle: string;
  declinedSectionTitle: string;
  iconMapping: Icons;
  deductibleLabel: string;
  benefitLabel: string;
  subscriberLabel: string;
  spouseLabel: string;
  childLabel: string;
  individualLabel: string;
  familyLabel: string;
  coInsuranceLabel: string;
  copayLabel: string;
  singleLabel: string;
}
export interface Icons {
  hra: string;
  lpfsa: string;
  fsa: string;
  hsa: string;
  vision_plan: string;
  dental_plan: string;
  medical_plan: string;
  accident_indemnity: string;
  add_insurance: string;
  basic_add_insurance: string;
  basic_life_insurance: string;
  basic_ltd_insurance: string;
  basic_std_insurance: string;
  hospital_indemnity: string;
  illness_indemnity: string;
  life_insurance: string;
  ltd_insurance: string;
  std_insurance: string;
}
export interface BenefitsSummaryModalContent {
  nudge: NudgeContent;
  beforeStarting: BeforeStartingModalContent;
  nudgeInProgress: NudgeContent;
}

export interface BeforeStartingModalContent {
  header: string;
  descList: string[];
  descNote: string;
  usefulInfoHeader: string;
  usefulInfoDescList: string[];
  buttonLabel: string;
}

export interface NudgeContent {
  icon: string;
  altText: string;
  header: string;
  desc1?: string;
  desc2?: string;
  desc?: string;
  buttonText: string;
  linkText: string;
}

export interface DependentsData {
  dependents: Dependents[];
  id: string;
  type: string;
  coverage_start_date: string;
  coverage_end_date: string;
  deduction_start_date: string;
  deduction_end_date: string;
  premium: string;
  employer_premium: string;
  coverage: string;
  policyId: string;
}

export interface Dependents {
  id: string;
  relationship: string;
  birthdate: string;
  country: string;
  age: number;
  first_name: string;
  last_name: string;
  coverage_type: string;
  coverage_start_date: string;
  coverage_end_date: string;
  deduction_start_date: string;
  deduction_end_date: string;
  premium: string;
  employer_premium: string;
  heading: string;
  gender?: string;
  coverageDeductible?: string;
  individual?: string;
  family?: string;
  coinsurance?: string;
  copay?: string;
}

export interface BenefitsHomeContent {
  openEnrollment: EnrollmentNudge;
  outsideEnrollment: EnrollmentNudge;
}
export interface EnrollmentNudge {
  NOT_STARTED: BenefitsHomeBannerContent;
  IN_PROGRESS: BenefitsHomeBannerContent;
  ACTION_PLAN_CREATED: BenefitsHomeBannerContent;
  COMPLETED: BenefitsHomeBannerContent;
}

export interface BenefitsHomeBannerContent {
  header: string;
  content: string;
  icon: string;
  altText: string;
  buttonText?: string;
}

export interface BenefitsSelectionContent {
  BenefitsSelectionModalJSON: string;
  BenefitsSelectionHomeJSON: string;
}

export interface BenefitEnrollment {
  status: string;
  enrollmentWindowEnabled: boolean;
  suppressBanner: boolean;
}

export interface GuidanceEnabled {
  guidanceEnabled: boolean;
}

export interface PayrollDeduction {
  cycle_time: string;
  total_deduction: number;
}

export interface MyIDCard {
  cardFront: string;
  cardBack: string;
}

export interface GetMedicalCard {
  contentId: string;
  contentTitle: string;
  contentType: string;
  contentRevision: string;
  contentFormat: string;
  contentExtension: string;
  contentFileName: string;
  content: string;
}

export interface AddMedicalCard {
  srcDocId: string;
  srcPlanType: string;
  docSide: card;
  content: string;
}

export interface UploadedMedicalCard {
  contentExtension: string;
  contentFileName: string;
  contentFormat: string;
  contentId: string;
  contentRevision: string;
  contentTitle: string;
  contentType: string;
}

export interface BSTSmartCardData {
  sc1: boolean;
  sc2: boolean;
  sc6: boolean;
  sc7: boolean;
  sc8: boolean;
  smartcardDetail: BSTSmartCardDetail[];
}

export interface BSTSmartCardDetail {
  currentNdcName: string;
  alternativeNdcName: string;
}

export interface BenefitForBenefitUser {
  linkUrl: string;
  linkLabel: string;
  title:string;
}
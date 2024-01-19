import {ProgressBarStep} from '../../../components/step-progress-bar/models/step-progress-bar-model';
import {ResourcesContent} from './resourcesContent.model';
import {ValidationType} from '../constants/validationType.enum';
import {WidgetType} from '../../mx-service/models/widget-type.enum';
export interface Journey {
  journeyID: number;
  journeyName: string;
  landingAndOverviewContent?: string;
  resourcesContent?: string;
  comingSoonContent?: string;
  parsedLandingAndOverviewContent?: JourneyContentResponse;
  parsedResourcesContent?: ResourcesContent;
  parsedComingSoonContent?: JourneyContentResponse;
  steps?: JourneyStep[];
  lastModifiedStepIndex: number;
}

export interface JourneyResponse {
  all: Journey[];
  recommended: Journey[];
  flags: Record<string, boolean>;
}

export interface JourneyContentResponse {
  intro: JourneyContentSection;
  overview?: OverviewContentSection;
  service?: string;
}

interface JourneyContentSection {
  header?: string;
  message?: string;
  messages?: string[];
  imgUrl?: string;
  altText?: string;
  buttonLabel?: string;
  action?: JourneyContentSection;
}

interface OverviewContentSection extends JourneyContentSection {
  summaryHeader?: string;
  summaryDescription?: string;
  summaryCards?: StepContentElement[];
  summarySteps: SummaryStep[];
  requiredSteps?: string[];
  footnoteText?: string;
}

export interface SummaryStep extends ProgressBarStep {
  journeyStepName?: string;
  header?: string;
  subheader?: string;
  emptySubheader?: string;
  emptyValueHeader?: string;
  elements: StepContentElement[];
  stepContent?: StepContentResponse;
  answer?: Record<string, string>;
  idSuffix?: string;
  answerId?: string;
  marginBottom?: string;
}
export interface JourneyStep extends ProgressBarStep {
  journeyStepName: string;
  journeyStepCMSTagId: string;
  msgType: string;
  value?: Record<string, string | string[]>;
  answer?: string;
  content?: StepContentResponse;
  createdDt?: string;
}

export interface StepContentResponse {
  requiredInputSets?: string[][];
  pageElements?: StepContentElements[];
  helpCards?: StepContentElement[];
}

export interface StepContentElements {
  backgroundColor?: string;
  marginBottom?: string;
  elements: StepContentElement[];
}

export interface StepContentElement
  extends StepContentResponse,
    IntroElement,
    HSASliderElement {
  id?: string;
  answerId?: string;
  ariaLabel?: string;
  header?: string;
  defaultHeader?: string;
  imageUrl?: string;
  imageId?: string;
  type?: string;
  subtype?: string;
  label?: string;
  default?: string | number;
  defaultId?: string;
  help?: StepContentHelp;
  link?: string;
  weblink?: string;
  externalLink?: string;
  options?: Option[];
  placeholder?: string;
  linkColor?: string;
  textColor?: string;
  headerFontSize?: string;
  descFontSize?: string;
  marginBottom?: string;
  marginBottomWeb?: string;
  tableMarginBottom?: string;
  marginTop?: string;
  playerId?: string;
  playerIds?: string[];
  listType?: 'ordered';
  listMargin?: string;
  config?: TableInputConfig;
  validationRules?: ValidationRules;
  displayErrorPopup?: boolean;
  maxWidth?: string;
  widgetType?: WidgetType;
  showWidgetButton?: boolean;
  labelPrefix?: string;
  radioLabel?: string;
  top?: string;
  left?: string;
  fontSize?: string;
  lineHeight?: string;
  answer?: string;
  isEmpty?: boolean;
  showTotal?: boolean;
  totalLabel?: string;
  emptyTableText?: string;
  numberOfSpritesPerRow?: number;
  numberOfSpritesPerColumn?: number;
  totalNumberOfSprites?: number;
  widthOfEachSprite?: number;
  heightOfEachSprite?: number;
  speed?: number;
  idSuffix?: string;
  altText?: string;
  flag?: string;
  rows?: StepsTableObject[];
  bold?: boolean;
  value?: number;
  maxValue?: number;
  isRequired?: boolean;
  isContinueButton?: boolean;
  elements?: StepContentElement[];
  paddingTop?: string;
  paddingBottom?: string;
  largeInput?: boolean;
  noBackLink?: string;
  noSpacing?: string;
  descImageUrl?: string;
  labelFontSize?: string;
  buttonLabel?: string;
  bgColor?: string;
  borderColor?: string;
  fullscreen?: boolean;
  color?: string;
  centered?: boolean;
  isToggle?: boolean;
  accumulateAnswers?: boolean;
  minValue?: number;
  bottom?: string;
  displayAnswer?: boolean;
}
export interface ChartData {
  label?: string;
  name: string;
  dataLabels?: {
    distance: number;
  };
  y: number;
}
export interface IntroElement {
  description?: string;
  descriptions?: string[];
  webviewHeader?: string;
  webviewLinks?: string[];
  webviewHeaders?: string[];
  webviewToolbars?: boolean[];
  appLinks?: string[];
  videoUrl?: string;
  videoUrls?: string[];
}

export interface HSASliderElement {
  perPayPeriodText?: string;
  yearlyTaxSavingsText?: string;
  disclaimer?: string;
}

export interface StepsTableObject {
  answer?: string | number;
  colorDotColor?: string;
  label: string;
  answerId?: string;
  type?: 'dollar';
  flag?: string;
  suppress?: boolean;
  textColor?: string;
  bold?: boolean;
  help?: StepContentHelp;
  prefix?: string;
}

export interface StepContentHelp extends IntroElement {
  label?: string;
  icon?: string;
}

export interface Option extends IntroElement {
  text?: string;
  id: string;
  imageUrl?: string;
  label?: string;
  altText?: string;
  elements?: StepContentElement[];
  checked?: boolean;
  value?: string | number;
  default?: boolean;
  idSuffix?: string;
}

export interface TableInputConfig {
  rows: Row[];
}

export interface Row {
  columns: StepContentElement[];
}

export interface ValidationRules {
  type?: ValidationType;
  decimalPlaces?: number;
  min?: number;
  max?: number;
  maxId?: string;
  emptyAllowed?: boolean;
}

export interface TableInputValue {
  answerId: string;
  value: string;
}

export interface SwipeEnabledEvent {
  swipeEnabled: boolean;
  index: number;
}

export interface JourneyStatus {
  journeyID: number;
  isCompleted: boolean;
}

export interface ContinueEvent {
  route: boolean;
  save?: boolean;
}

export interface RadioButtonStepValue {
  value: Record<string, string>;
  requiredCompleted?: boolean;
}
export interface RadioButtonObject {
  value?: string;
  isRequiredValid?: boolean;
  elements?: StepContentElement[];
  element?: StepContentElement;
}
export interface ValidationRuleInfo {
  answerId: string;
  validationRules: ValidationRules;
  collegeStartAge: string;
}

export interface FilterOption {
  id: number;
  name: string;
}

export interface FilteredRecords {
  page: number;
  totalPages: number;
  totalEntries: number;
  options: FilterOption[];
}

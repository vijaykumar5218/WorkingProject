import {Injectable} from '@angular/core';
import {
  Journey,
  JourneyStep,
  StepContentElement,
  StepContentElements,
  ValidationRuleInfo,
  Option,
  FilteredRecords,
} from '../models/journey.model';
import {BaseService} from '../../base/base-factory-provider';
import {SharedUtilityService} from '../../utility/utility.service';
import {endpoints} from '../constants/collegeEndpoints';
import {
  CollegeJourneyData,
  CollegeOption,
  CollegeRecords,
  Dependent,
  DetailedFees,
  InputRange,
  PortfolioProjector,
} from '../models/collegeJourney.model';
import {JourneyService} from '../journey.service';
import {firstValueFrom, Observable, ReplaySubject, Subscription} from 'rxjs';
import {NotificationsSettingService} from '@shared-lib/services/notification-setting/notification-setting.service';
import {MXAccountRootObject} from '@shared-lib/services/mx-service/models/mx.model';
import {MXService} from '@shared-lib/services/mx-service/mx.service';
import {JourneyUtilityService} from 'shared-lib/services/journey/journeyUtilityService/journey-utility.service';
import {CurrencyPipe} from '@angular/common';
import moment from 'moment';

const portfolioProjectorMapping = {
  one_time_contribution: 'oneTimeContribution',
  existing_savings: 'existingSavings',
  recurrent_payment: 'monthlyPayment',
  annual_interest_rate: 'interestRate',
  years: 'yearsTilStart',
  rate_of_return: 'rateOfReturn',
  household_income: 'householdIncome',
  tax_filing_status_id: 'taxFilingStatus',
  state_id: 'stateId',
  college_projected_cost: 'total',
  goal_percentage: 'goalPercentage',
};

@Injectable({
  providedIn: 'root',
})
export class CollegeService {
  private endpoints;
  collegeJourneyDataPromise: Promise<CollegeJourneyData>;
  whoAreYouSavingFor: string;
  whoAreYouSavingForId: string;
  private whoAreYouSavingForAge: number;
  valueChange = new ReplaySubject<void>(1);
  allDependentSteps: JourneyStep[];
  startYear: number;
  typeCollege: string;
  typeCollegeId: string;
  collegeName: string;
  private collegeNameId: string;
  isCollegeName: boolean;
  scholarshipsNotIncludedCollegeName: boolean;
  isTypeCollege: boolean;
  scholarshipsNotIncludedTypeCollege: boolean;
  averageAmount: number;
  tuition: number;
  books: number;
  roomAndBoard: number;
  fees: number;
  grantsAndScholarships: number;
  grantsAndScholarshipsNegative: number;
  total: number;
  scholarshipsNotIncluded: boolean;
  scholarshipsIncluded: boolean;
  inflation: number;
  currentAge: number;
  private totalCostWithoutScholarships: number;
  private firstInitialize = true;
  private detailedFeesInputs: Record<string, string | number> = {};
  private portfolioProjectorInputs: Record<string, string | number> = {};
  addedDependents: Record<string, string | number>[] = [];
  displayNotificationSection: boolean;
  private subscription = new Subscription();
  accountLinkedId: string[] | string;
  accountLinked: boolean;
  accountNotLinked: boolean;
  private mxAccountSubject: ReplaySubject<
    MXAccountRootObject
  > = new ReplaySubject(1);
  hasDependents: boolean;
  hasNoDependents: boolean;
  private oneTimeContribution = 0;
  existingSavings = 0;
  private monthlyPayment = 0;
  private interestRate: number;
  private rateOfReturn: number;
  private collegeStartAge: number;
  totalYears: number;
  private inflationRateType: string;
  householdIncome: number;
  taxFilingStatus: string;
  stateId: string;
  private goalPercentage = 100;
  private yearsTilStart: number;

  projectedShortfall: number;
  projectedSurplus: number;
  predictedOngoingContributions: number;
  predictedOneTimeContribution: number;
  isShortfall: boolean;
  isSurplus: boolean;
  logoUrl: string;
  accountName: string;
  accountBalance: string;
  isEqual: boolean;
  private validationRulesSubject = new ReplaySubject<ValidationRuleInfo>();
  private editAChildModal: StepContentElement;
  private originalMonthlyContributionOptions: Option[];
  updatedEstimate: number;
  private updatedShortfall: boolean;
  private updatedEstimateDetails: Record<string, string | number>;
  private monthlyContribution: StepContentElement;
  private collegeList: Promise<CollegeRecords>;
  private historicalInflationRate: number;

  constructor(
    private baseService: BaseService,
    private utilityService: SharedUtilityService,
    private journeyService: JourneyService,
    private notificationSettingsService: NotificationsSettingService,
    private mxService: MXService,
    private journeyUtility: JourneyUtilityService,
    private currencyPipe: CurrencyPipe
  ) {
    this.endpoints = this.utilityService.appendBaseUrlToEndpoints(endpoints);
  }

  async initialize(journey: Journey) {
    this.notificationSettingsService.setPrefsSettings();
    this.subscription.add(
      this.notificationSettingsService.notificationPrefsChanged$.subscribe(
        settings => {
          this.displayNotificationSection = !this.notificationSettingsService.getCheckedAndActive(
            settings,
            'AAPref'
          ).sectionActive;
        }
      )
    );
    const collegeData = await this.getCollegeData();
    this.setDefaults(collegeData);
    this.initializeDependents(collegeData, journey);
    await this.setAnswers(journey);
    if (!this.firstInitialize) {
      this.journeyService.updateJourneySteps(
        journey.steps,
        journey.journeyID,
        false
      );
    }
    this.firstInitialize = false;
  }

  private setDefaults(collegeData: CollegeJourneyData) {
    this.totalYears = collegeData.yearsOfAttendance.defaultValue;
    this.collegeStartAge = collegeData.collegeStartAge.defaultValue;
    this.inflationRateType = 'Fixed';
    this.interestRate = collegeData.simpleAnnualInterestRate.defaultValue;
    this.rateOfReturn = collegeData.rateOfReturn.defaultValue;
  }

  async setTrackerAnswers(
    dependent: Record<string, string | number>,
    allDependentSteps: JourneyStep[],
    collegeJourneyDataPromise: Promise<CollegeJourneyData>,
    oldDependentId: string
  ) {
    this.collegeJourneyDataPromise = collegeJourneyDataPromise;
    const collegeData = await this.getCollegeData();
    this.setDefaults(collegeData);
    this.allDependentSteps = allDependentSteps;
    await this.setAnswers(
      JSON.parse(JSON.stringify(this.journeyService.getCurrentJourney())),
      dependent,
      oldDependentId
    );
  }

  private getCollegeData(): Promise<CollegeJourneyData> {
    if (!this.collegeJourneyDataPromise) {
      this.collegeJourneyDataPromise = this.baseService.get(
        this.endpoints.getCollegeData
      );
    }
    return this.collegeJourneyDataPromise;
  }

  private initializeDependents(
    collegeData: CollegeJourneyData,
    journey: Journey
  ) {
    journey.steps.forEach((step: JourneyStep) => {
      step.content?.pageElements.forEach((pageElement: StepContentElements) => {
        this.updateDependents(collegeData.dependents, pageElement);

        this.setOptions(pageElement, collegeData.collegeTypes, 'typeCollege');
        this.setOptions(
          pageElement,
          collegeData.filingStatuses,
          'filingStatus'
        );
        this.setOptions(pageElement, collegeData.states, 'stateResidence');
        this.setModalOptions(pageElement, collegeData);
        this.setEditAChildModal(pageElement);
      });
    });
  }

  private setOptions(
    pageElement: StepContentElements,
    optionArray: CollegeOption[],
    key: string
  ) {
    const elementIndex = pageElement.elements.findIndex(el => el.id === key);
    if (elementIndex > -1) {
      const typeElement = pageElement.elements[elementIndex];
      const typeOptions = [];
      if (optionArray.length > 0) {
        optionArray.forEach((opt: CollegeOption) => {
          typeOptions.push({
            id: opt.id,
            label: opt.label,
            value: opt.value,
          });
        });
        typeElement.id = 'input';
        typeElement.type = 'select';
        typeElement.options = typeOptions;
      } else {
        pageElement.elements.splice(elementIndex, 1);
      }
    }
  }

  private setModalOptions(
    pageElement: StepContentElements,
    collegeData: CollegeJourneyData
  ) {
    const contentModal = pageElement.elements.find(
      el => el.answerId === 'editCollegeInfo'
    );
    if (contentModal) {
      contentModal.elements.forEach(element => {
        element.elements.forEach(ele => {
          ele.elements.forEach(assumptionInput => {
            if (
              assumptionInput.id === 'input' &&
              assumptionInput.type === 'textField' &&
              assumptionInput.answerId !== 'collegeStartAge'
            ) {
              this.setInputProps(assumptionInput, collegeData);
            } else if (assumptionInput.id === 'annualInflationRateSelect') {
              const options = [];
              collegeData.inflationRate.forEach((inflation: InputRange) => {
                options.push({
                  id: inflation.label,
                  label: inflation.label,
                  value: inflation.label,
                });
              });
              assumptionInput.id = 'input';
              assumptionInput.options = options;
            }
          });
        });
      });
    }
  }

  private setInputProps(
    input: StepContentElement,
    collegeData: CollegeJourneyData
  ) {
    const inputRange = collegeData[input['answerId']];
    if (inputRange.maxValue !== undefined) {
      input.validationRules.max = inputRange.maxValue;
    }
    if (inputRange.minValue !== undefined) {
      input.validationRules.min = inputRange.minValue;
    }
    input.default = inputRange.defaultValue;
  }

  private initializeDependentFromList(
    dependents: (Record<string, string> | Dependent | string)[],
    journey: Journey
  ) {
    journey.steps.forEach((step: JourneyStep) => {
      step.content?.pageElements.forEach((pageElement: StepContentElements) => {
        this.updateDependents(dependents, pageElement, true);
      });
    });
  }

  private checkAddAChildAnswer(
    parsedAnswer: Record<string, string | string[]>,
    journey: Journey
  ) {
    if (parsedAnswer['addAChildModal']) {
      this.initializeDependentFromList(
        parsedAnswer['addAChildModal'] as string[],
        journey
      );
    }
  }

  private async setAnswers(
    journey: Journey,
    dependent?: Record<string, string | number>,
    oldDependentId?: string
  ) {
    this.accountLinkedId = undefined;
    this.accountNotLinked = true;
    this.accountLinked = false;
    if (!this.allDependentSteps) {
      this.allDependentSteps = JSON.parse(JSON.stringify(journey.steps));
    }
    this.monthlyPayment = 0;
    this.existingSavings = 0;
    this.oneTimeContribution = 0;
    if (dependent) {
      this.setStaticWhoAreYouSavingFor(dependent, journey, oldDependentId);
    }
    const answerList = this.journeyService.getAnswerList(journey);
    let radioButtonAnswer;
    for (const answer of answerList) {
      const parsedAnswer = this.journeyService.safeParse(answer) as Record<
        string,
        string | string[]
      >;
      if (parsedAnswer) {
        this.addChildFromAnswer(dependent, parsedAnswer, journey);
        await this.setCollegeDetails(parsedAnswer);
        if (parsedAnswer['calculateFinancialAid']) {
          const parseAns = this.journeyService.safeParse(
            parsedAnswer['calculateFinancialAid'] as string
          ) as Record<string, string>;
          this.scholarshipsNotIncluded =
            parseAns['calculateFinancialAid'] === 'yes' ? false : true;
          this.scholarshipsIncluded = !this.scholarshipsNotIncluded;
        }
        await this.setLinkAccountValue(parsedAnswer);
        this.setContributionAmts(parsedAnswer);
        this.setOtherPortfolioAnswers(parsedAnswer);
        this.setEditCollegeInfoAnswers(parsedAnswer);
        radioButtonAnswer = this.getRadioButtonAnswer(
          parsedAnswer['monthlyContribution'] as string,
          radioButtonAnswer
        );
      }
    }

    await this.setCurrentAge(journey, dependent !== undefined);
    await this.setInflationRate();
    await this.updateDetailedFees();
    await this.updatePortfolioProjector(journey, radioButtonAnswer, !dependent);
    this.valueChange.next();
  }

  async setCollegeDetails(parsedAnswer: Record<string, string | string[]>) {
    let collegeNameAns: Record<string, string>;
    let typeCollegeAns: Record<string, string>;
    if (parsedAnswer['collegeName']) {
      collegeNameAns = this.journeyService.safeParse(
        parsedAnswer['collegeName'] as string
      ) as Record<string, string>;
    }
    if (parsedAnswer['typeCollege']) {
      typeCollegeAns = this.journeyService.safeParse(
        parsedAnswer['typeCollege'] as string
      ) as Record<string, string>;
    }
    if (collegeNameAns) {
      this.collegeName = collegeNameAns.name;
      this.collegeNameId = collegeNameAns.id;
      this.isCollegeName = true;
      this.isTypeCollege = false;
      const collegeName: CollegeRecords = await this.getCollegeList(
        'page=1&name=' + encodeURIComponent(this.collegeName)
      );
      if (collegeName && collegeName.schools.length > 0) {
        this.totalYears = Number(collegeName.schools[0].schoolDuration);
      }
    } else if (typeCollegeAns) {
      this.typeCollege = typeCollegeAns.label;
      this.typeCollegeId = typeCollegeAns.id;
      this.isTypeCollege = true;
      this.isCollegeName = false;
      const typeCollege = (await this.getCollegeData()).collegeTypes.find(
        type => type.id === this.typeCollegeId
      );
      this.historicalInflationRate = typeCollege?.inflationRate;
    }
  }

  private getRadioButtonAnswer(answer: string, radioButtonAnswer): string {
    if (!radioButtonAnswer) {
      const parsedAnswer = this.journeyService.safeParse(answer);
      radioButtonAnswer = parsedAnswer;
    }
    return radioButtonAnswer;
  }

  private addChildFromAnswer(
    dependent: Record<string, string | number>,
    parsedAnswer: Record<string, string | string[]>,
    journey: Journey
  ) {
    if (!dependent) {
      this.checkAddAChildAnswer(parsedAnswer, journey);
      this.setWhoAreYouSavingFor(
        parsedAnswer as Record<string, string>,
        journey
      );
    }
  }

  private async setInflationRate() {
    if (this.inflationRateType === 'Historical' && this.isTypeCollege) {
      this.inflation = this.historicalInflationRate;
    } else {
      const collegeData = await this.getCollegeData();
      const inflationOption = collegeData.inflationRate.find(
        el => el.label === this.inflationRateType
      );
      this.inflation = inflationOption.defaultValue;
    }
  }

  private async setLinkAccountValue(
    parsedAnswer: Record<string, string | string[]>
  ) {
    if (parsedAnswer['linkExistingAccount']) {
      this.accountLinkedId = parsedAnswer['linkExistingAccount'];
      await firstValueFrom(this.getMXAccountData());
    }
  }

  getMXAccountData(): Observable<MXAccountRootObject> {
    const mxSubscription = this.mxService
      .getMxAccountConnect()
      .subscribe((data: MXAccountRootObject) => {
        const result = data?.accounts.filter(account => {
          return (
            account.account_type_name.toLowerCase() === 'checking' ||
            account.account_type_name.toLowerCase() === 'cash' ||
            account.account_type_name.toLowerCase() === 'savings' ||
            account.account_type_name.toLowerCase() === 'any' ||
            (account.account_type_name.toLowerCase() === 'investment' &&
              account.account_subtype_name?.toLowerCase() === 'plan_529')
          );
        });

        const linkedAccount = this.journeyUtility.addAccountIconName(
          result,
          this.accountLinkedId
        );
        this.mxAccountSubject.next({accounts: result});
        if (linkedAccount) {
          this.logoUrl = linkedAccount.medium_logo_url;
          this.accountBalance = linkedAccount.balance || '0';
          this.accountName = linkedAccount.name;
          this.accountLinked = true;
        } else {
          this.accountLinked = false;
        }
        this.accountNotLinked = !this.accountLinked;
      });
    this.subscription.add(mxSubscription);
    return this.mxAccountSubject;
  }

  private async setCurrentAge(journey: Journey, skipUpdate: boolean) {
    if (this.whoAreYouSavingForId) {
      const dobVal =
        this.whoAreYouSavingForAge !== undefined
          ? this.whoAreYouSavingForAge
          : (this.addedDependents.find(
              dep => dep.id === this.whoAreYouSavingForId
            )?.age as number);
      this.currentAge = dobVal;
      if (!skipUpdate) {
        this.updateStartAgeMin(journey);
      } else {
        this.setCollegeStartAge();
      }
      this.yearsTilStart = this.collegeStartAge - this.currentAge;
    }
  }
  private calculateAge(dobVal: string | number): number {
    const date = dobVal + '-01';
    return Math.floor(moment().diff(moment(date), 'month', true) / 12);
  }
  private setCollegeStartAge() {
    if (this.currentAge > 18) {
      this.collegeStartAge = this.currentAge;
    }
  }

  private async updateStartAgeMin(journey: Journey) {
    journey.steps.forEach((step: JourneyStep) => {
      step.content?.pageElements.forEach(
        async (pageElement: StepContentElements) => {
          const contentModal = pageElement.elements.find(
            el => el.answerId === 'editCollegeInfo'
          );
          if (contentModal) {
            const collegeData = await this.getCollegeData();
            contentModal.elements.forEach(element => {
              element.elements.forEach(ele => {
                ele.elements.forEach(assumptionInput => {
                  if (assumptionInput.answerId === 'collegeStartAge') {
                    const assumption = this.setassumptionInputs(
                      assumptionInput,
                      collegeData
                    );
                    assumptionInput.default = assumption.default;
                    assumptionInput.validationRules.min =
                      assumption.validationRules.min;
                    this.validationRulesSubject.next({
                      answerId: assumptionInput.answerId,
                      validationRules: assumptionInput.validationRules,
                      collegeStartAge: this.collegeStartAge.toString(),
                    });
                  }
                });
              });
            });
          }
        }
      );
    });
  }
  private setassumptionInputs(
    assumptionInput: StepContentElement,
    collegeData: CollegeJourneyData
  ): StepContentElement {
    assumptionInput.default =
      this.currentAge > collegeData.collegeStartAge.defaultValue
        ? this.currentAge
        : collegeData.collegeStartAge.defaultValue;
    if (this.currentAge < 18) {
      this.collegeStartAge = assumptionInput.default;
    } else {
      this.collegeStartAge = this.currentAge;
    }
    assumptionInput.validationRules.min =
      this.currentAge > assumptionInput.default
        ? this.currentAge
        : assumptionInput.default;
    return assumptionInput;
  }
  private setWhoAreYouSavingFor(
    parsedAnswer: Record<string, string>,
    journey: Journey
  ) {
    const whoAreYouSavingForAns = this.journeyService.safeParse(
      parsedAnswer['whoAreYouSavingFor']
    ) as Record<string, string>;
    if (whoAreYouSavingForAns) {
      this.whoAreYouSavingFor = whoAreYouSavingForAns.label;
      const oldWhoAreYouSavingForId = this.whoAreYouSavingForId;
      this.whoAreYouSavingForId = whoAreYouSavingForAns.id;
      if (oldWhoAreYouSavingForId !== this.whoAreYouSavingForId) {
        this.updateStepValues(journey, oldWhoAreYouSavingForId);
      }
    }
  }

  private setStaticWhoAreYouSavingFor(
    dependent: Record<string, string | number>,
    journey: Journey,
    oldDependentId: string
  ) {
    this.whoAreYouSavingFor = dependent.firstName as string;
    this.whoAreYouSavingForId = dependent.id as string;
    this.whoAreYouSavingForAge = dependent.age as number;
    this.updateStepValues(journey, oldDependentId, false);
  }

  private setContributionAmts(parsedAnswer: Record<string, string | string[]>) {
    if (parsedAnswer['haveYouStartedSavingForChild']) {
      const parseAns = this.journeyService.safeParse(
        parsedAnswer['haveYouStartedSavingForChild'] as string
      ) as Record<string, string>;
      if (parseAns && parseAns['haveYouStartedSavingForChild'] === 'yes') {
        const additionalContribution = parseAns['additionalContribution'];
        if (!this.journeyService.isValueEmpty(additionalContribution)) {
          this.oneTimeContribution = parseFloat(
            additionalContribution.slice(1)
          );
        }
        const monthlyPayment = parseAns['howMuchAreYouSavingMonthly'];
        if (!this.journeyService.isValueEmpty(monthlyPayment)) {
          this.monthlyPayment = parseFloat(monthlyPayment.slice(1));
        }
        const existingSavings = parseAns['howMuchHaveYouSavedSoFar'];
        if (!this.journeyService.isValueEmpty(existingSavings)) {
          this.existingSavings = parseFloat(existingSavings.slice(1));
        }
      }
    }
  }

  private setOtherPortfolioAnswers(
    parsedAnswer: Record<string, string | string[]>
  ) {
    if (parsedAnswer['householdIncome']) {
      this.householdIncome = parseFloat(
        (parsedAnswer['householdIncome'] as string).slice(1)
      );
    }
    if (parsedAnswer['stateResidence']) {
      const parsedState = this.journeyService.safeParse(
        parsedAnswer['stateResidence'] as string
      ) as Record<string, string>;
      this.stateId = parsedState.id;
    }
    if (parsedAnswer['filingStatus']) {
      const filingStatus = this.journeyService.safeParse(
        parsedAnswer['filingStatus'] as string
      ) as Record<string, string>;
      this.taxFilingStatus = filingStatus.id;
    }
  }

  private setEditCollegeInfoAnswers(
    parsedAnswer: Record<string, string | string[]>
  ) {
    const parsedModal = this.journeyService.safeParse(
      parsedAnswer['editCollegeInfo'] as string
    );
    if (parsedModal) {
      Object.keys(parsedModal).forEach(key => {
        this.setTabAnswer(parsedModal[key]);
      });
    }
  }

  private setTabAnswer(tabAnswer: string) {
    const parsedTab = this.journeyService.safeParse(tabAnswer);
    if (parsedTab['collegeStartAge'] !== undefined) {
      this.collegeStartAge = parsedTab['collegeStartAge'];
    }
    if (parsedTab['yearsOfAttendance'] !== undefined) {
      this.totalYears = parsedTab['yearsOfAttendance'];
    }
    if (parsedTab['annualInflationRate']) {
      const parsedInflationRate = this.journeyService.safeParse(
        parsedTab['annualInflationRate']
      ) as Record<string, string>;
      this.inflationRateType = parsedInflationRate.id;
    }
    if (parsedTab['rateOfReturn'] !== undefined) {
      this.rateOfReturn = parsedTab['rateOfReturn'];
    }
    if (parsedTab['simpleAnnualInterestRate'] !== undefined) {
      this.interestRate = parsedTab['simpleAnnualInterestRate'];
    }
  }

  stepChange(journey: Journey) {
    this.setAnswers(journey);
  }

  processForSave(stepStatuses: JourneyStep[]) {
    if (this.whoAreYouSavingForId) {
      stepStatuses.forEach((step: JourneyStep) => {
        if (step.journeyStepName !== 'who_are_you_saving_for') {
          const index = this.allDependentSteps.findIndex(allDependentStep => {
            return allDependentStep.journeyStepName === step.journeyStepName;
          });
          this.addDependentId(step, index);
          step.answer = this.allDependentSteps[index].answer;
        }
      });
    }
  }

  private addDependentId(
    step: JourneyStep,
    i: number,
    id = this.whoAreYouSavingForId
  ) {
    const parsedAnswer = this.journeyService.safeParse(
      this.allDependentSteps[i].answer
    );
    const updatedValue = parsedAnswer ? parsedAnswer : {};
    if (step.value && Object.keys(step.value).length > 0) {
      updatedValue[id] = step.value;
    }

    this.allDependentSteps[i].answer =
      Object.keys(updatedValue).length > 0
        ? JSON.stringify(updatedValue)
        : undefined;
  }

  private updateStepValues(
    journey: Journey,
    oldDependentId: string,
    updateSteps = true
  ) {
    journey.steps.forEach((step: JourneyStep, i: number) => {
      if (step.journeyStepName !== 'who_are_you_saving_for') {
        if (oldDependentId) {
          this.addDependentId(step, i, oldDependentId);
        }

        const parsedAnswer = this.journeyService.safeParse(
          this.allDependentSteps[i].answer
        );
        step.value = undefined;
        if (parsedAnswer && Object.keys(parsedAnswer).length > 0) {
          const value = parsedAnswer[this.whoAreYouSavingForId];
          step.answer =
            typeof value === 'string' ? value : JSON.stringify(value);
        } else {
          step.answer = undefined;
        }
      }
    });
    if (updateSteps) {
      this.journeyService.updateJourneySteps(
        journey.steps,
        journey.journeyID,
        false
      );
    }
  }

  addDependent(
    dependent: Record<string, string>,
    journey: Journey = this.journeyService.getCurrentJourney()
  ) {
    this.initializeDependentFromList([dependent], journey);
    this.journeyService.updateJourneySteps(
      journey.steps,
      journey.journeyID,
      false
    );
  }

  private updateDependents(
    dependents: (Record<string, string> | Dependent | string)[],
    pageElement: StepContentElements,
    manuallyAdded = false
  ) {
    const dependentIndex = pageElement.elements.findIndex(
      el => el.answerId === 'whoAreYouSavingFor'
    );
    if (dependentIndex > -1) {
      const dependentElement = pageElement.elements[dependentIndex];
      const dependentElements = dependentElement.options
        ? dependentElement.options
        : [];
      dependents.forEach(dep => {
        if (typeof dep === 'string') {
          dep = this.journeyService.safeParse(dep) as Record<string, string>;
        }
        const index = dependentElements.findIndex(
          addedDep =>
            addedDep.id === (dep as Record<string, string> | Dependent).id
        );
        if (index === -1) {
          this.trackAddedDependents(dep);
          dependentElements.push(
            this.getDependentElement(
              dep,
              dependentElement,
              dependentElements.length,
              manuallyAdded
            )
          );
        } else {
          dependentElements[index].label =
            'childFirstName' in dep ? dep.childFirstName : dep.firstName;
        }
      });
      dependentElement.id = 'input';
      dependentElement.type = 'iconTextButtonSelect';
      dependentElement.options = dependentElements;
      this.setHasDependents(dependents);
    }
  }

  private getDependentElement(
    dep: Record<string, string> | Dependent,
    dependentElement: StepContentElement,
    i: number,
    manuallyAdded: boolean
  ): Option {
    return {
      id: dep.id,
      label: 'childFirstName' in dep ? dep.childFirstName : dep.firstName,
      imageUrl: dependentElement.imageUrl,
      value: dep.id,
      idSuffix: dependentElement.idSuffix + i,
      elements: manuallyAdded ? [this.editAChildModal] : undefined,
    };
  }

  private setHasDependents(
    dependents: (Record<string, string> | Dependent | string)[]
  ) {
    if (dependents.length !== 0) {
      this.hasDependents = true;
    } else {
      this.hasDependents = false;
    }
    this.hasNoDependents = !this.hasDependents;
  }

  private trackAddedDependents(dep: Record<string, string> | Dependent) {
    const age = 'childAge' in dep ? dep.childAge : dep.age;
    this.addedDependents.push({
      id: dep.id,
      dob: 'dob' in dep ? dep.dob : undefined,
      age: 'dob' in dep ? this.calculateAge(dep.dob) : age,
      firstName: 'childFirstName' in dep ? dep.childFirstName : dep.firstName,
    });
  }

  private updateApiValues(
    originalObjString: string,
    inputs: Record<string, string | number>,
    url: string,
    mapping: Record<string, string>,
    overrideKey?: string,
    overrideValue?: number
  ): string {
    let undefinedInput = false;
    Object.keys(mapping).forEach(key => {
      if (overrideKey !== key) {
        inputs[key] = this[mapping[key]];
      } else {
        inputs[key] = overrideValue;
      }
      if (this.journeyService.isValueEmpty(inputs[key])) {
        undefinedInput = true;
      }
      url = url + key + '=' + inputs[key] + '&';
    });
    url = url.substring(0, url.length - 1);
    if (originalObjString !== JSON.stringify(inputs) && !undefinedInput) {
      return url;
    } else {
      return null;
    }
  }

  private async updateDetailedFees() {
    let detailedFeeMapping: Partial<Record<string, string>>;
    this.scholarshipsNotIncludedCollegeName = false;
    this.scholarshipsNotIncludedTypeCollege = false;
    if (this.isCollegeName) {
      detailedFeeMapping = {
        years_of_attendance: 'totalYears',
        college_start_age: 'collegeStartAge',
        current_age: 'currentAge',
        inflation: 'inflation',
        school_id: 'collegeNameId',
      };
      if (this.scholarshipsNotIncluded) {
        this.scholarshipsNotIncludedCollegeName = true;
      }
    } else {
      detailedFeeMapping = {
        years_of_attendance: 'totalYears',
        college_start_age: 'collegeStartAge',
        current_age: 'currentAge',
        inflation: 'inflation',
        college_type: 'typeCollegeId',
      };
      if (this.scholarshipsNotIncluded) {
        this.scholarshipsNotIncludedTypeCollege = true;
      }
    }
    const updateValuesUrl = this.updateApiValues(
      JSON.stringify(this.detailedFeesInputs),
      this.detailedFeesInputs,
      this.endpoints.detailedFees,
      detailedFeeMapping
    );
    if (updateValuesUrl) {
      const detailedFees: DetailedFees = await this.baseService.get(
        updateValuesUrl
      );
      this.tuition = detailedFees.tuition;
      this.roomAndBoard = detailedFees.roomAndBoard;
      this.fees = detailedFees.fees;
      this.books = detailedFees.books;
      this.grantsAndScholarships = detailedFees.grantsAndScholarships;
      this.grantsAndScholarshipsNegative = -1 * this.grantsAndScholarships;
      this.totalCostWithoutScholarships = detailedFees.total;
      this.startYear = detailedFees.startYear;
    }
    if (this.scholarshipsIncluded) {
      this.total =
        this.totalCostWithoutScholarships - this.grantsAndScholarships;
    } else {
      this.total = this.totalCostWithoutScholarships;
    }
    this.averageAmount = this.total / this.totalYears;
  }

  private async updatePortfolioProjector(
    journey: Journey,
    radioButtonAnswer: Record<string, string>,
    updateSteps: boolean
  ) {
    const updateValuesUrl = this.updateApiValues(
      JSON.stringify(this.portfolioProjectorInputs),
      this.portfolioProjectorInputs,
      this.endpoints.portfolioProjector,
      portfolioProjectorMapping
    );

    if (updateValuesUrl) {
      const portfolioProjector: PortfolioProjector = await this.baseService.get(
        updateValuesUrl
      );
      this.projectedShortfall = portfolioProjector.projectedShortfall;
      this.projectedSurplus = portfolioProjector.projectedSurplus;
      this.predictedOngoingContributions =
        portfolioProjector.predictedOngoingContributions;
      this.predictedOneTimeContribution =
        portfolioProjector.predictedOneTimeContribution;
      this.isShortfall = this.projectedShortfall >= 1;
      this.isSurplus = this.projectedSurplus >= 1;
      this.isEqual = !this.isShortfall && !this.isSurplus;
    }
    if (this.predictedOngoingContributions !== undefined) {
      this.updateRadioOptions(journey);
      await this.updateNoteValueFromAnswer(radioButtonAnswer);
      if (updateSteps) {
        this.journeyService.updateJourneySteps(
          journey.steps,
          journey.journeyID,
          false
        );
      }
    }
  }

  getValidationRules$(): Observable<ValidationRuleInfo> {
    return this.validationRulesSubject;
  }

  private setEditAChildModal(pageElement: StepContentElements) {
    const addAChildModal = pageElement.elements.find(
      ele => ele.answerId === 'addAChildModal'
    );
    if (addAChildModal) {
      this.editAChildModal = JSON.parse(JSON.stringify(addAChildModal));
      this.editAChildModal.elements.forEach(ele => {
        ele.header = ele.header?.replace('Add', 'Edit');
      });
      this.editAChildModal.accumulateAnswers = false;
    }
  }

  getModalValue(
    id: string,
    answerId: string
  ): Record<string, string | string[]> {
    const dep = this.addedDependents.find(d => d.id === id);
    const modalValue = {};
    modalValue[answerId] = JSON.stringify({
      childFirstName: dep.firstName,
      dob: dep.dob,
      id: id,
    });
    return modalValue;
  }

  private updateDependentValue(value: Record<string, string>) {
    const depIndex = this.addedDependents.findIndex(dep => dep.id === value.id);
    this.addedDependents[depIndex] = {
      firstName: value.childFirstName,
      age: this.calculateAge(value.dob),
      id: value.id,
      dob: value.dob,
    };
  }

  handleEditModalValueChange(dependent: string, index: number) {
    const currentJourney = this.journeyService.getCurrentJourney();
    const parsedDep = this.journeyService.safeParse(dependent) as Record<
      string,
      string
    >;
    this.updateDependentValue(parsedDep);
    this.updateStepAnswerWithDependent(currentJourney.steps[index], parsedDep);
    this.addDependent(parsedDep, currentJourney);
  }

  private updateStepAnswerWithDependent(
    step: JourneyStep,
    dep: Record<string, string>
  ) {
    if (!step.value) {
      step.value = this.journeyService.safeParse(step.answer) as Record<
        string,
        string | string[]
      >;
    }
    if (step.value['whoAreYouSavingFor']) {
      const parsedVal = this.journeyService.safeParse(
        step.value['whoAreYouSavingFor'] as string
      ) as Record<string, string>;
      if (parsedVal?.id === dep.id) {
        parsedVal.label = dep.childFirstName;
        step.value['whoAreYouSavingFor'] = JSON.stringify(parsedVal);
      }
    }
    if (step.value['addAChildModal']) {
      const parsedVal = this.journeyService.safeParse(
        step.value['addAChildModal']
      ) as Record<string, string>[];
      if (parsedVal) {
        const index = parsedVal.findIndex(valDep => valDep.id === dep.id);
        if (index > -1) {
          (step.value['addAChildModal'] as string[])[index] = JSON.stringify(
            dep
          );
        }
      }
    }
  }

  private updateRadioOptions(journey: Journey) {
    let stepIndex;
    journey.steps.forEach((step: JourneyStep, i) => {
      step.content?.pageElements.forEach((pageElement: StepContentElements) => {
        pageElement.elements.forEach((element: StepContentElement) => {
          const index = this.updateMonthlyContribution(element, i);
          if (index !== undefined) {
            stepIndex = index;
          }
        });
      });
    });
    this.stripOldAnswers(journey.steps[stepIndex].value);
    journey.steps[stepIndex].answer = JSON.stringify(
      this.stripOldAnswers(
        this.journeyService.safeParse(
          journey.steps[stepIndex].answer
        ) as Record<string, string | string[]>
      )
    );
  }

  private updateMonthlyContribution(
    element: StepContentElement,
    i: number
  ): number {
    let stepIndex;
    if (element.answerId === 'monthlyContribution') {
      this.monthlyContribution = element;
      stepIndex = i;
      let originalMonthlyContributionOptions = this.getElementOptions();
      if (!originalMonthlyContributionOptions) {
        originalMonthlyContributionOptions = JSON.parse(
          JSON.stringify(element.options)
        );
        this.setElementOptions(originalMonthlyContributionOptions);
      }
      element.options = [];
      let percentage = 1;
      const copy = JSON.parse(
        JSON.stringify(originalMonthlyContributionOptions)
      );
      copy.forEach(option => {
        const optionCopy = JSON.parse(JSON.stringify(option));
        optionCopy.id = optionCopy.id + this.predictedOngoingContributions;
        if (optionCopy.label.includes('{dollarAmt}')) {
          const val = this.predictedOngoingContributions * percentage;
          optionCopy.label = optionCopy.label.replace(
            '{dollarAmt}',
            this.currencyPipe.transform(val, 'USD', true, '1.0-0')
          );
          optionCopy.value = val;
          percentage -= 0.25;
        }

        optionCopy.elements?.forEach((ele: StepContentElement) => {
          if (ele.answerId) {
            ele.answerId = ele.answerId + this.predictedOngoingContributions;
          }
        });
        element.options.push(optionCopy);
      });
    }
    return stepIndex;
  }

  private stripOldAnswers(
    value: Record<string, string | string[]>
  ): Record<string, string | string[]> {
    if (value && value['monthlyContribution']) {
      const monthlyContribution = this.journeyService.safeParse(
        value['monthlyContribution']
      );
      if (monthlyContribution) {
        Object.keys(monthlyContribution).forEach(key => {
          if (
            key.includes('specificMonthlyAmount') &&
            key !== 'specificMonthlyAmount' + this.predictedOngoingContributions
          ) {
            delete monthlyContribution[key];
          }

          if (
            key.includes('oneTimeContribution') &&
            key !== 'oneTimeContribution' + this.predictedOngoingContributions
          ) {
            delete monthlyContribution[key];
          }
        });
        value['monthlyContribution'] = JSON.stringify(monthlyContribution);
      }
    }
    return value;
  }

  private setElementOptions(options: Option[]) {
    this.originalMonthlyContributionOptions = options;
    localStorage.setItem(
      'collegeOriginalMonthlyContributionOptions',
      JSON.stringify(options)
    );
  }

  private getElementOptions(): Option[] {
    const elementOptions = localStorage.getItem(
      'collegeOriginalMonthlyContributionOptions'
    );
    return elementOptions && elementOptions !== 'undefined'
      ? JSON.parse(elementOptions)
      : this.originalMonthlyContributionOptions;
  }

  private getOverrideKeyAndValue(
    answerId: string,
    answer: Record<string, string>
  ) {
    let overrideKey;
    let overrideValue;
    if (answerId.includes('oneTimeContribution')) {
      overrideKey = 'one_time_contribution';
      Object.keys(answer).forEach(key => {
        if (key.includes('oneTimeContribution')) {
          overrideValue = parseFloat(answer[key].slice(1));
        }
      });
    } else if (answerId.includes('specificMonthlyAmount')) {
      overrideKey = 'recurrent_payment';
      Object.keys(answer).forEach(key => {
        if (key.includes('specificMonthlyAmount')) {
          overrideValue = parseFloat(answer[key].slice(1));
        }
      });
    }
    return {key: overrideKey, value: overrideValue};
  }

  private async updateNoteValueFromAnswer(answer: Record<string, string>) {
    if (this.predictedOngoingContributions !== undefined && answer) {
      const monthlyContributionAnswer = answer['monthlyContribution'];
      if (monthlyContributionAnswer) {
        let overrideValue;
        let overrideKey;
        let element;
        if (
          monthlyContributionAnswer.includes('oneTimeContribution') ||
          monthlyContributionAnswer.includes('specificMonthlyAmount')
        ) {
          const keyAndValue = this.getOverrideKeyAndValue(
            monthlyContributionAnswer,
            answer
          );
          overrideKey = keyAndValue.key;
          overrideValue = keyAndValue.value;
          const opt = this.monthlyContribution.options.find(
            option => option.id === monthlyContributionAnswer
          );
          element = opt?.elements[0].elements[0];
        } else if (monthlyContributionAnswer.includes('montlyContribution')) {
          overrideKey = 'recurrent_payment';
          const opt = this.monthlyContribution.options.find(
            option => option.id === monthlyContributionAnswer
          );
          element = opt?.elements[0];
          overrideValue = opt?.value;
        }
        if (overrideKey && element) {
          await this.fetchNoteValue(overrideKey, overrideValue, element);
        }
      }
    }
  }

  async updateNoteValue(event: string, element: StepContentElement) {
    if (
      element.answerId?.includes('specificMonthlyAmount') ||
      element.answerId?.includes('oneTimeContribution')
    ) {
      let overrideKey;
      if (element.answerId.includes('specificMonthlyAmount')) {
        overrideKey = 'recurrent_payment';
      } else if (element.answerId.includes('oneTimeContribution')) {
        overrideKey = 'one_time_contribution';
      }

      await this.fetchNoteValue(
        overrideKey,
        parseFloat(event.slice(1)),
        element.elements[0]
      );
    }
  }

  async updateNoteValueForRadioOption(
    element: StepContentElement,
    answer: Record<string, string>
  ) {
    if (
      element.id.includes('montlyContribution') ||
      element.id.includes('specificMonthlyAmount') ||
      element.id.includes('oneTimeContribution')
    ) {
      if (element.value !== undefined) {
        await this.fetchNoteValue(
          'recurrent_payment',
          element.value,
          element.elements[0]
        );
      } else {
        const keyAndValue = this.getOverrideKeyAndValue(element.id, answer);
        if (keyAndValue.value !== undefined) {
          await this.fetchNoteValue(
            keyAndValue.key,
            keyAndValue.value,
            element.elements[0].elements[0]
          );
        }
      }
    }
  }

  private async fetchNoteValue(
    overrideKey: string,
    value: number,
    element: StepContentElement
  ) {
    let oldDetails;
    if (this.updatedEstimateDetails) {
      oldDetails = JSON.stringify(this.updatedEstimateDetails);
    }

    this.updatedEstimateDetails = {
      ongoingContributions: this.predictedOngoingContributions,
      value: value,
      overrideKey: overrideKey,
    };
    if (
      !oldDetails ||
      oldDetails !== JSON.stringify(this.updatedEstimateDetails)
    ) {
      const updateValuesUrl = this.updateApiValues(
        JSON.stringify(this.portfolioProjectorInputs),
        this.portfolioProjectorInputs,
        this.endpoints.portfolioProjector,
        portfolioProjectorMapping,
        overrideKey,
        value
      );
      if (updateValuesUrl) {
        const portfolioProjector: PortfolioProjector = await this.baseService.get(
          updateValuesUrl
        );
        this.updatedShortfall = portfolioProjector.projectedShortfall >= 1;

        this.updatedEstimate = this.updatedShortfall
          ? portfolioProjector.projectedShortfall
          : portfolioProjector.projectedSurplus;
      }
    }
    element.description = this.updatedShortfall
      ? element.label
      : element.defaultHeader;
    this.valueChange.next();
  }

  getCollegeList(searchUrlParams: string): Promise<CollegeRecords> {
    return this.baseService.get(
      this.endpoints.getCollegeList + searchUrlParams
    );
  }

  async filteredList(searchUrlParams: string): Promise<FilteredRecords> {
    const result: CollegeRecords = await this.getCollegeList(searchUrlParams);
    return {
      page: result.page,
      totalPages: result.totalPages,
      totalEntries: result.totalEntries,
      options: result.schools,
    };
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}

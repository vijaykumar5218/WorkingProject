import {Injectable} from '@angular/core';
import {Observable, ReplaySubject, Subscription} from 'rxjs';
import {JourneyService} from '../journey.service';
import {JourneyUtilityService} from '../journeyUtilityService/journey-utility.service';
import {Journey, StepContentElement} from '../models/journey.model';
import {CurrencyPipe} from '@angular/common';
import {MXService} from '@shared-lib/services/mx-service/mx.service';
import {MXAccountRootObject} from '@shared-lib/services/mx-service/models/mx.model';
import {NotificationsSettingService} from '@shared-lib/services/notification-setting/notification-setting.service';
import {SharedUtilityService} from '@shared-lib/services/utility/utility.service';
import {BaseService} from '@shared-lib/services/base/base-factory-provider';
import {endpoints} from '../constants/unExpectedEndpoints';
import {UnexpectedGoalContent} from '../models/unexpectedJourney.model';
import * as moment from 'moment';
import {Status} from '@shared-lib/constants/status.enum';

@Injectable({
  providedIn: 'root',
})
export class UnExpectedService {
  private endpoints;
  valueChange = new ReplaySubject<void>(1);
  private subscription: Subscription = new Subscription();
  private mxAccountSubject: ReplaySubject<
    MXAccountRootObject
  > = new ReplaySubject(1);
  defaultEmergencySavingGoal: string;
  defaultTargetMonthlyContribution: string;
  private grossYearIncome: string;
  private grossWeeklyIncome: number;
  private weeksInYear = 52;
  private savedMoney: number;
  private accountBalance: number;
  currentSavings: number;
  private jobLossWeeks: string;
  private monthsOfThreeYears = 36;
  adjustedJobLossWeeks: number;
  adjustedEmergencySavingGoal: string;
  adjustedTargetMonthlyContribution: string;
  private resetJobLossWeeks: number;
  displayNotificationSection: boolean;
  private isAdjustGoalYes: boolean;
  emergencySavingGoal: string;
  targetMonthlyContribution: string;
  accountLinkedId: string;
  accountLinked: boolean;
  accountNotLinked: boolean;
  private MXAccountData: MXAccountRootObject;
  targetCompletionDate: string;
  private unexpectedGoalContentPromise: Promise<UnexpectedGoalContent>;
  isTargetAchieved: boolean;
  isTargetNotAchieved: boolean;
  isAdjustedTargetAchieved: boolean;
  isAdjustedTargetNotAchieved: boolean;

  constructor(
    private journeyService: JourneyService,
    private currencyPipe: CurrencyPipe,
    private mxService: MXService,
    private notificationSettingsService: NotificationsSettingService,
    private baseService: BaseService,
    private utilityService: SharedUtilityService,
    private journeyUtilityService: JourneyUtilityService
  ) {
    this.endpoints = this.utilityService.appendBaseUrlToEndpoints(endpoints);
  }

  initialize(journey: Journey) {
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

    this.setAnswers(this.journeyService.getAnswerList(journey));
    this.setMaxJobLossWeeks(journey);
    this.setOverviewSummary(journey);
    this.valueChange.next();
  }

  private setAnswers(answerList: string[]) {
    this.accountLinkedId = undefined;
    this.accountNotLinked = true;
    this.accountLinked = false;
    let accountLinkedAnswer = false;
    answerList?.forEach(answer => {
      const parsedAnswer = this.journeyService.safeParse(answer) as Record<
        string,
        string
      >;
      if (parsedAnswer) {
        if (parsedAnswer['grossYearIncome']) {
          this.setGrossYearIncome(parsedAnswer['grossYearIncome']);
          this.grossWeeklyIncome =
            parseInt(this.grossYearIncome) / this.weeksInYear;
          this.setSavedMoney(parsedAnswer);
          this.jobLossWeeks = this.adjustedJobLossWeeks
            ? this.adjustedJobLossWeeks.toString()
            : '4';
          this.emergencyGoalCalculation(
            this.jobLossWeeks,
            'defaultEmergencySavingGoal',
            'defaultTargetMonthlyContribution'
          );
        } else if (parsedAnswer['linkExistingAccount']) {
          accountLinkedAnswer = true;
          this.accountLinkedId = parsedAnswer['linkExistingAccount'];
          this.checkMXAccountsExists();
        }
      }
    });
    if (!accountLinkedAnswer) {
      this.currentSavings = this.accountLinked
        ? this.accountBalance
        : this.savedMoney;
    }

    this.targetAchieved();
    this.adjustedTargetAchieved();
  }

  targetAchieved() {
    this.isTargetAchieved =
      this.currentSavings >=
      parseFloat(this.defaultEmergencySavingGoal?.slice(1).replace(/,/g, ''));
    this.isTargetNotAchieved = !this.isTargetAchieved;
  }

  adjustedTargetAchieved() {
    this.isAdjustedTargetAchieved =
      this.currentSavings >=
      parseFloat(this.adjustedEmergencySavingGoal?.slice(1).replace(/,/g, ''));
    this.isAdjustedTargetNotAchieved = !this.isAdjustedTargetAchieved;
  }

  private checkMXAccountsExists() {
    if (this.MXAccountData) {
      this.setAccountStatus(this.MXAccountData);
    } else {
      this.subscription.add(
        this.getMXAccountData().subscribe(res => {
          this.MXAccountData = res;
          this.setAccountStatus(this.MXAccountData);
          this.valueChange.next();
        })
      );
    }
  }

  private setAccountStatus(mxAccountsData: MXAccountRootObject) {
    if (mxAccountsData.accounts.length > 0) {
      if (this.accountLinkedId) {
        mxAccountsData.accounts.forEach(account => {
          if (account.guid === this.accountLinkedId) {
            this.accountLinked = true;
            this.accountNotLinked = false;
            this.accountBalance = account.balance
              ? parseFloat(account.balance)
              : 0;
            this.currentSavings = this.accountBalance;
          }
        });
      }
    }
    if (!this.accountLinked) {
      this.currentSavings = this.savedMoney;
    }
  }

  stepChange(journey: Journey) {
    this.setAnswers(this.journeyService.getAnswerList(journey));
    this.setMaxJobLossWeeks(journey);
    this.setOverviewSummary(journey);
    this.valueChange.next();
  }

  private setGrossYearIncome(grossYearIncome: string) {
    this.grossYearIncome = grossYearIncome.slice(1).replace(/,/g, '');
  }

  private setSavedMoney(parsedAnswer: Record<string, string>) {
    this.savedMoney = 0;
    if (parsedAnswer['adjustGoal']) {
      const adjustGoal = this.journeyService.safeParse(
        parsedAnswer['adjustGoal']
      );
      if (adjustGoal['adjustGoal'] === 'adjustGoalYes') {
        this.savedMoney = adjustGoal['SavedMoney'].slice(1);
        this.savedMoney = this.savedMoney ? this.savedMoney : 0;
      }
    }
  }

  onChange(newValue: number) {
    if (newValue !== this.adjustedJobLossWeeks) {
      this.adjustedJobLossWeeks = newValue;
      this.emergencyGoalCalculation(
        newValue.toString(),
        'adjustedEmergencySavingGoal',
        'adjustedTargetMonthlyContribution'
      );
      this.adjustedTargetAchieved();
      this.valueChange.next();
    }
  }

  reset(): number {
    return this.resetJobLossWeeks;
  }

  private setMaxJobLossWeeks(journey: Journey) {
    this.adjustedJobLossWeeks = parseInt(this.jobLossWeeks);
    this.isAdjustGoalYes = false;
    for (const step of journey.steps) {
      const answer = this.journeyService.safeParse(step.answer);
      if (answer && answer['adjustGoal']) {
        const adjustGoal = this.journeyService.safeParse(answer['adjustGoal']);
        if (adjustGoal && adjustGoal['adjustedUnexpectedGoal']) {
          const adjustedUnexpectedGoal = this.journeyService.safeParse(
            adjustGoal['adjustedUnexpectedGoal']
          );
          this.adjustedJobLossWeeks = parseInt(
            Object.values(adjustedUnexpectedGoal)[0]
          );
          this.isAdjustGoalYes =
            adjustGoal['adjustGoal'] === 'adjustGoalYes' ? true : false;
        }
      }
    }
    this.emergencyGoalCalculation(
      this.adjustedJobLossWeeks.toString(),
      'adjustedEmergencySavingGoal',
      'adjustedTargetMonthlyContribution'
    );
    this.resetJobLossWeeks = this.adjustedJobLossWeeks;
  }

  private emergencyGoalCalculation(
    jobLossWeeks: string,
    emergencySavingGoalKey: string,
    targetMonthlyContributionKey: string
  ) {
    const emergencySavingGoal = this.grossWeeklyIncome * parseInt(jobLossWeeks);

    const targetMonthlyContribution =
      emergencySavingGoal / this.monthsOfThreeYears;
    this.setValuesOfGoalCalculation(
      emergencySavingGoalKey,
      emergencySavingGoal
    );
    this.setValuesOfGoalCalculation(
      targetMonthlyContributionKey,
      targetMonthlyContribution
    );
  }

  private setValuesOfGoalCalculation(key: string, value: number) {
    this[key] = this.currencyPipe.transform(value, 'USD', true, '1.2-2');
  }

  private setOverviewSummary(journey: Journey) {
    this.emergencySavingGoal = this.isAdjustGoalYes
      ? this.adjustedEmergencySavingGoal
      : this.defaultEmergencySavingGoal;

    this.targetMonthlyContribution = this.isAdjustGoalYes
      ? this.adjustedTargetMonthlyContribution
      : this.defaultTargetMonthlyContribution;

    const journeyStatus = this.journeyService.getJourneyStatus(journey.steps);
    if (journeyStatus === Status.completed) {
      this.targetCompletionDate = this.getTargetCompletionDate(journey);
    }
  }

  async fetchUnexpectedGoalContent(): Promise<StepContentElement> {
    if (!this.unexpectedGoalContentPromise) {
      this.unexpectedGoalContentPromise = this.baseService.get(
        this.endpoints.getUnexpectedContent
      );
    }
    const content: UnexpectedGoalContent = await this
      .unexpectedGoalContentPromise;
    return JSON.parse(content.UnexpectedGoalJSON);
  }

  private getTargetCompletionDate(journey: Journey): string {
    return moment(
      journey.steps[0].createdDt
        ? new Date(journey.steps[0].createdDt)
        : new Date()
    )
      .add(this.monthsOfThreeYears, 'M')
      .format('MMM YYYY');
  }

  getMXAccountData(): Observable<MXAccountRootObject> {
    const mxSubscription = this.mxService
      .getMxAccountConnect()
      .subscribe((data: MXAccountRootObject) => {
        const result = data?.accounts.filter(account => {
          return (
            account.account_type_name.toLowerCase() === 'checking' ||
            account.account_type_name.toLowerCase() === 'savings' ||
            account.account_type_name.toLowerCase() === 'cash'
          );
        });

        this.journeyUtilityService.addAccountIconName(
          result,
          this.accountLinkedId
        );
        this.mxAccountSubject.next({
          accounts: result,
        });
      });
    this.subscription.add(mxSubscription);
    return this.mxAccountSubject;
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}

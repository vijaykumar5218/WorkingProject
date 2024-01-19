import {Injectable} from '@angular/core';
import {ReplaySubject, Subscription} from 'rxjs';
import {BaseService} from '../../base/base-factory-provider';
import {NotificationsSettingService} from '../../notification-setting/notification-setting.service';
import {SharedUtilityService} from '../../utility/utility.service';
import {endpoints} from '../constants/hsaEndpoints';
import {JourneyService} from '../journey.service';
import {HSAContent, HSAGoalResponse} from '../models/hsaJourney.model';
import {Journey, StepContentElement} from '../models/journey.model';

@Injectable({
  providedIn: 'root',
})
export class HSAService {
  private endpoints;
  currentBalance: number;
  private payPeriods: number;
  private isIndividual: boolean;
  private overCatchupAge: boolean;
  private goalData: HSAGoalResponse;
  private goalDataPromise: Promise<HSAGoalResponse>;
  currentContribution: number;
  maxContribution: number;
  onFile: boolean;
  notOnFile: boolean;
  contributionPerPayPeriod: number;
  yearlyTaxSavings: number;
  valueChange = new ReplaySubject<void>(1);
  adjustedMaxContribution: number;
  adjustedContributionPerPayPeriod: number;
  adjustedyearlyTaxSavings: number;
  private hsaContentPromise: Promise<HSAContent>;
  accountLinked: boolean;
  accountNotLinked: boolean;
  logoUrl: string;
  accountName: string;
  private subscription = new Subscription();
  displayNotificationSection: boolean;
  ytdContribution: number;

  constructor(
    private baseService: BaseService,
    private utilityService: SharedUtilityService,
    private journeyService: JourneyService,
    private notificationSettingsService: NotificationsSettingService
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
    if (
      !this.goalDataPromise ||
      this.journeyService.getRefreshMxAccount() === 'true'
    ) {
      await this.setAccountLinkFlag(journey.journeyID);

      if (this.goalData.onFile) {
        this.isIndividual = this.goalData.individual;
      }

      this.setAnswers(this.goalData.hsaJourneyAnswers);
      this.overCatchupAge = this.goalData.overCatchupAge;
      this.calculateRecommendations();
      this.onChange(undefined, true);
    }
  }

  private setAnswers(answerList: string[]) {
    let adjustedMax;
    answerList?.forEach(answer => {
      const parsedAnswer = this.journeyService.safeParse(answer) as Record<
        string,
        string
      >;
      if (parsedAnswer) {
        if (!this.accountLinked && parsedAnswer['currentHSABalance']) {
          this.currentBalance = parseFloat(
            parsedAnswer['currentHSABalance'].slice(1)
          );
        }
        if (parsedAnswer['payFrequency']) {
          const parsedPayFrequency = this.journeyService.safeParse(
            parsedAnswer['payFrequency']
          );
          this.payPeriods = parsedPayFrequency['value'];
        }
        if (this.notOnFile && parsedAnswer['whoAreYouUsingHSAFor']) {
          const parsedWhoAreYouUsingHSAFor = this.journeyService.safeParse(
            parsedAnswer['whoAreYouUsingHSAFor']
          );
          if (
            parsedWhoAreYouUsingHSAFor &&
            parsedWhoAreYouUsingHSAFor['whoAreYouUsingHSAFor']
          ) {
            this.isIndividual =
              parsedWhoAreYouUsingHSAFor['whoAreYouUsingHSAFor'] ===
              'individual';
          }
        }
        const answerAdjustedMax = this.getAdjustedMaxContribution(parsedAnswer);
        if (answerAdjustedMax !== undefined) {
          adjustedMax = answerAdjustedMax;
        }
      }
    });
    this.adjustedMaxContribution = adjustedMax;
  }

  private getAdjustedMaxContribution(
    parsedAnswer: Record<string, string>
  ): number {
    let adjustedMaxContribution;
    if (parsedAnswer['adjustGoal']) {
      const parsedHSAGoalAnswer = this.journeyService.safeParse(
        parsedAnswer['adjustGoal']
      );

      if (
        parsedHSAGoalAnswer &&
        parsedHSAGoalAnswer['adjustGoal'] === 'adjustGoalYes'
      ) {
        const parsedAdjustAnswer = this.journeyService.safeParse(
          parsedHSAGoalAnswer['adjustedHSAGoal']
        );
        if (parsedAdjustAnswer) {
          adjustedMaxContribution = parseFloat(
            Object.values(parsedAdjustAnswer)[0].slice(1)
          );
        }
      }
    }
    return adjustedMaxContribution;
  }

  stepChange(journey: Journey) {
    this.setAnswers(this.journeyService.getAnswerList(journey));
    this.calculateRecommendations();
    this.onChange(undefined, true);
  }

  calculateRecommendations() {
    let yearlyGoal = this.isIndividual
      ? this.goalData.singleMaxAmt
      : this.goalData.familyMaxAmt;
    if (this.overCatchupAge) {
      yearlyGoal += this.goalData.catchUpAmt;
    }

    this.maxContribution = yearlyGoal;
    this.contributionPerPayPeriod = this.calculatePerPayPeriod(yearlyGoal);
    this.yearlyTaxSavings = this.calculateSavings(yearlyGoal);
    this.valueChange.next();
  }

  private calculateSavings(yearlyGoal: number): number {
    return yearlyGoal * 0.22;
  }

  private calculatePerPayPeriod(yearlyGoal: number): number {
    return yearlyGoal / this.payPeriods;
  }

  onChange(
    newValue: number = this.adjustedMaxContribution || this.maxContribution,
    refresh = false
  ) {
    if (refresh || this.adjustedMaxContribution !== newValue) {
      this.adjustedMaxContribution = newValue;
      this.adjustedContributionPerPayPeriod = this.calculatePerPayPeriod(
        newValue
      );
      this.adjustedyearlyTaxSavings = this.calculateSavings(newValue);
      this.valueChange.next();
    }
  }

  async fetchGoalJSON(): Promise<StepContentElement> {
    if (!this.hsaContentPromise) {
      this.hsaContentPromise = this.baseService.get(
        this.endpoints.getHSAContent
      );
    }
    const content: HSAContent = await this.hsaContentPromise;
    return JSON.parse(content.HSAGoalJSON);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  async setAccountLinkFlag(journeyId: number) {
    this.journeyService.setRefreshMxAccount('false');
    this.goalDataPromise = this.baseService.get(
      this.endpoints.getGoal + '/' + journeyId
    );
    this.goalData = await this.goalDataPromise;
    this.onFile = this.goalData.onFile;
    this.notOnFile = this.goalData.notOnFile;
    this.accountLinked = this.goalData.accountLinked;
    this.accountNotLinked = this.goalData.accountNotLinked;
    this.logoUrl = this.goalData.logoUrl;
    this.accountName = this.goalData.accountName;
    if (this.accountLinked) {
      this.currentBalance = this.goalData.currentBalance;
    }
    this.ytdContribution = this.goalData.ytdContribution;
    this.valueChange.next();
  }
}

import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import {IonContent} from '@ionic/angular';
import {Subscription} from 'rxjs';
import {OrangeMoneyService} from '../../../orange-money/services/orange-money.service';

import * as pageText from '@shared-lib/services/account/models/retirement-account/info/info-tab.json';
import {PlanAdviceStatusClient} from '@shared-lib/services/account/models/retirement-account/info/adviceStatus';
import {
  Contribution,
  YTDContribution,
} from '@shared-lib/services/account/models/retirement-account/info/contribution.model';
import {Dividend} from '@shared-lib/services/account/models/retirement-account/info/dividends.model';
import {EmployersMatch} from '@shared-lib/services/account/models/retirement-account/info/employersMatch.model';
import {GainLoss} from '@shared-lib/services/account/models/retirement-account/info/gainloss.model';
import {Clients} from '@shared-lib/services/account/models/retirement-account/info/morningStar.model';
import {OutstandingLoan} from '@shared-lib/services/account/models/retirement-account/info/outstandingLoan.model';
import {RateOfReturn} from '@shared-lib/services/account/models/retirement-account/info/rateOfReturn.model';
import {VestedBalance} from '@shared-lib/services/account/models/retirement-account/info/vestedBalance.model';
import {Mode} from '@shared-lib/services/account/constants/mode.enum';
import {AccountService} from '@shared-lib/services/account/account.service';
import {
  Account,
  Participant,
} from '@shared-lib/services/account/models/accountres.model';
import {SharedUtilityService} from '@shared-lib/services/utility/utility.service';
import {EventManagerService} from '@shared-lib/modules/event-manager/event-manager/event-manager.service';
import {eventKeys} from '@shared-lib/constants/event-keys';
import {JourneyService} from '@shared-lib/services/journey/journey.service';
import {
  JourneyResponse,
  JourneyStatus,
} from '@shared-lib/services/journey/models/journey.model';
import {OrangeMoneyEstimates} from '@shared-lib/services/account/models/orange-money.model';

@Component({
  selector: 'app-info',
  templateUrl: './info.page.html',
  styleUrls: ['./info.page.scss'],
})
export class InfoPage implements OnDestroy, OnInit {
  @ViewChild(IonContent) content: IonContent;
  @ViewChild('orangeMoneyComp', {read: ElementRef}) omComp: ElementRef;

  pageText: any = JSON.parse(JSON.stringify(pageText)).default;
  currentYear: number = new Date().getFullYear();
  account: Account;
  participant: Participant;
  vestedBalance: VestedBalance;
  gainLoss: GainLoss;
  dividends: Dividend;
  gainLossValue: string;
  gainLossColor: string;
  rateOfReturnColor: string;
  loan: OutstandingLoan;
  rateOfReturn: RateOfReturn;
  contribution: Contribution;
  morningStars: Clients;
  contributions: YTDContribution;
  omEligibility: boolean;
  subscription: Subscription = new Subscription();
  employersMatch: EmployersMatch;
  hsaJourneyStatus: JourneyStatus = null;
  hsaJourneyLoading = true;
  isWeb: boolean;
  estimates: OrangeMoneyEstimates;
  readonly modes = Mode;
  flagMorningStar = false;
  flagFeManaged = false;
  omCorrectPlan = false;
  featchSubscription: Subscription = new Subscription();

  constructor(
    private accountService: AccountService,
    private orangeMoneyService: OrangeMoneyService,
    private sharedUtility: SharedUtilityService,
    private eventManagerService: EventManagerService,
    private journeyService: JourneyService
  ) {}

  ngOnInit() {
    this.isWeb = this.sharedUtility.getIsWeb();
  }

  doGainLossCalculation() {
    if (this.gainLoss && this.account) {
      this.gainLossValue = (
        +this.account.accountBalance - +this.gainLoss.balance
      ).toFixed(2);
    } else {
      this.gainLossValue = null;
    }
    this.gainLossColor = this.posNegColor(this.gainLossValue);
  }

  posNegSymbol(val) {
    return this.accountService.posNegSymbol(val);
  }

  posNegColor(val) {
    if (val && +val) {
      return val < 0 ? '#B30000' : '#00a137';
    }
    return '#000000';
  }

  ionViewWillEnter() {
    if (!this.isWeb) {
      this.fetchData();
    }
  }

  async fetchData() {
    this.account = this.accountService.getAccount();
    this.subscription.add(
      this.accountService.getParticipant().subscribe(data => {
        this.participant = data;
      })
    );

    if (this.account.isHSAAccount) {
      this.fetchHsaData();
    } else if (
      !(
        this.account.isVendorPlan ||
        this.account.isVoyaAccessPlan ||
        this.account.sourceSystem == 'VENDOR' ||
        this.account.sourceSystem == 'STOCK' ||
        this.account.sourceSystem == 'BROKERAGE' ||
        this.account.sourceSystem == 'NQPenCalPlan'
      )
    ) {
      this.accountService.getPlanAdviceStatuses().then(data => {
        this.setPlanAdviceStatus(data);
      });

      this.orangeMoneyService.getOMEligibility().then(data => {
        this.omEligibility = data.eligible === 'true';
      });

      this.accountService.getGainLoss().then(data => {
        this.gainLoss = data;
        this.doGainLossCalculation();
      });

      this.subscription.add(
        this.orangeMoneyService.getOrangeData(true).subscribe(async omData => {
          const planId =
            omData.orangeData.participantDefinedContributionAccounts[0].planInfo
              .planId;
          this.omCorrectPlan = planId === this.account.planId;
          this.estimates = await this.orangeMoneyService.getEstimates(omData);
        })
      );

      this.accountService.getLoan().then(data => {
        this.loan = data;
      });

      this.accountService.getRateOfReturn().then(data => {
        this.rateOfReturn = data;
        this.rateOfReturnColor = this.posNegColor(this.rateOfReturn.prr.pct);
      });

      this.accountService.getVestedBalance().then(data => {
        this.vestedBalance = data;
      });

      this.accountService.getDividends().then(data => {
        this.dividends = data;
      });

      this.accountService.getContribution().then(data => {
        this.contribution = data;
      });

      this.accountService.getEmployersMatch().then(data => {
        this.employersMatch = data;
      });

      this.accountService.getYTDContribution().then(data => {
        this.contributions = data;
      });
    }
  }

  async fetchHsaData() {
    this.hsaJourneyStatus = await this.journeyService.getJourneyCompletionStatus();
    if (this.hsaJourneyStatus.isCompleted) {
      this.subscription.add(
        this.journeyService
          .fetchJourneys()
          .subscribe(async (journeys: JourneyResponse) => {
            const hsaJourney = journeys.all.find(
              journey => journey.journeyID === this.hsaJourneyStatus.journeyID
            );
            await this.journeyService.setStepContent(hsaJourney);
            this.journeyService.setCurrentJourney(hsaJourney);
            this.hsaJourneyLoading = false;
          })
      );
    }
  }

  ionViewDidEnter() {
    if (this.isWeb) {
      this.featchSubscription.add(
        this.eventManagerService
          .createSubscriber(eventKeys.refreshAccountInfo)
          .subscribe(this.fetchData.bind(this))
      );
    }
    if (this.featchSubscription) {
      this.featchSubscription.unsubscribe();
    }
  }

  setPlanAdviceStatus(planAdviceStatus: PlanAdviceStatusClient) {
    planAdviceStatus.clients[0].plans.forEach(plan => {
      if (this.account.planId == plan.id) {
        if (plan.adviceStatus == 'M*_MANAGED') {
          this.flagMorningStar = true;
          this.flagFeManaged = false;
        } else if (plan.adviceStatus === 'FE_MANAGED') {
          this.flagFeManaged = true;
          this.flagMorningStar = false;
        } else {
          this.flagFeManaged = false;
          this.flagMorningStar = false;
        }
      }
    });
  }

  scrollToOrangeMoney() {
    this.content.scrollToPoint(
      0,
      this.omComp.nativeElement.offsetTop + 100,
      1000
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}

import {Component, ElementRef, ViewChild} from '@angular/core';
import {Observable, Subscription} from 'rxjs';
import * as PageText from './constants/workplace-dashboard-content.json';
import {MVlandingContent} from '@web/app/modules/features/workplace-dashboard/home/models/mvlandingcontent.model';
import {GreetingService} from '../../../shared/services/greeting/greeting.service';
import {AccessService} from '@shared-lib/services/access/access.service';
import {JourneyService} from '@shared-lib/services/journey/journey.service';
import {BenefitsService} from '@shared-lib/services/benefits/benefits.service';
import {BenefitEnrollment} from '@shared-lib/services/benefits/models/benefits.model';
import {OrangeMoneySizeService} from './components/orange-money/orange-money-size-service';
import {HeaderTypeService} from '@web/app/modules/shared/services/header-type/header-type.service';
import {AccountService} from '@shared-lib/services/account/account.service';
import {AccessResult} from '@shared-lib/services/access/models/access.model';
import {delay, filter} from 'rxjs/operators';
import {ResourcesLinks} from '../../../shared/services/header-type/models/MoreResource.model';
import {HomeService} from '../../../../../../../shared-lib/services/home/home.service';
import {SnapshotAccounts} from '@shared-lib/services/account/models/all-accounts.model';
import {TranslationMessage} from '@web/app/modules/shared/services/content/model/translation-message.model';
import {AdviceCalloutService} from '../../../shared/services/adviceCallout/adviceCallout.service';
import {OfferCode} from '../../../shared/services/adviceCallout/model/OfferCode.model';
import {VoyaGlobalCacheService} from '../../../shared/services/voya-global-cache/voya-global-cache.service';
import {TranslationPreferenceResponse} from '@web/app/modules/shared/services/voya-global-cache/models/translationPreference.model';
import {NavigationEnd, Router} from '@angular/router';
import {SharedUtilityService} from '../../../../../../../shared-lib/services/utility/utility.service';

@Component({
  selector: 'workplace-dashboard-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class WorkplaceHomePage {
  @ViewChild('topmostElement', {read: ElementRef}) topmostElement: ElementRef;
  pageText: MVlandingContent = (PageText as any).default;
  offerVal: OfferCode[] = [];
  subscription: Subscription = new Subscription();
  isMorning: boolean;
  isEvening: boolean;
  hasMXAccount: boolean;
  isMyVoyageEnabled: boolean;
  myVoyageAccess: AccessResult;
  journeys: boolean;
  isMyBenefitsUser: boolean;
  moreResources: ResourcesLinks;
  benefitsEnrollment$: Observable<BenefitEnrollment>;
  snapshotAccount: SnapshotAccounts;
  displayMoneyOutSection = false;
  translation: TranslationMessage;
  myBenefitsUrl: string;
  translationPref: TranslationPreferenceResponse;
  moneyOutMessagesList: string[] = [];
  isMoneyOutAvailable: boolean;
  isTemplateReady: boolean;

  constructor(
    private sizes: OrangeMoneySizeService,
    private greetingService: GreetingService,
    private accessService: AccessService,
    private journeyService: JourneyService,
    private benefitsService: BenefitsService,
    private headerTypeService: HeaderTypeService,
    private accountService: AccountService,
    private homeService: HomeService,
    private adviceCalloutService: AdviceCalloutService,
    private voyaCacheService: VoyaGlobalCacheService,
    private utilityService: SharedUtilityService,
    private router: Router
  ) {}

  getMyBenefitsUrl() {
    const myVoyaDomain = this.utilityService.getMyVoyaDomain();
    this.myBenefitsUrl = myVoyaDomain.includes('intg')
      ? myVoyaDomain + this.pageText.viewMyBenefits
      : undefined;
  }

  scrollToTop() {
    this.subscription = this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        delay(100)
      )
      .subscribe(() => {
        this.utilityService.scrollToTop(this.topmostElement);
      });
  }

  async ngOnInit() {
    this.scrollToTop();
    this.fetchLocalTime();
    this.myVoyageAccess = await this.accessService.checkMyvoyageAccess();
    this.isMyVoyageEnabled = this.myVoyageAccess.enableMyVoyage === 'Y';
    this.isMyBenefitsUser =
      sessionStorage.getItem('isMyBenefitshub') === 'true';
    this.setMyBenefitsUser(this.isMyBenefitsUser);
  }

  setMyBenefitsUser(isMyBenefitsUser: boolean) {
    if (isMyBenefitsUser) {
      this.loadMyBenefitsTemp();
    } else {
      this.loadWorkplaceDashboardTemp();
    }
    this.isTemplateReady = true;
  }

  loadMyBenefitsTemp() {
    this.getMyBenefitsUrl();
  }

  async loadWorkplaceDashboardTemp() {
    this.getOfferCodeValue();
    this.homeService.openPreferenceSettingModal();
    this.fetchMoneyOutStatus();
    this.subscription.add(
      this.journeyService
        .fetchJourneys()
        .pipe(filter(data => data.recommended && data.recommended.length > 0))
        .subscribe(result => {
          this.journeys = result.recommended.length > 0;
        })
    );
    this.subscription.add(
      this.headerTypeService.getMoreResource().subscribe(data => {
        this.moreResources = data.resourceLink;
      })
    );
    this.subscription.add(
      this.accountService.getAggregatedAccounts().subscribe(data => {
        this.hasMXAccount = data.hasMXAccount;
      })
    );
    this.fetchAggregatedAccounts();
    this.benefitsEnrollment$ = await this.benefitsService.getBenefitsEnrollment();
    this.subscription.add(
      this.accountService.fetchPredictiveMessage().subscribe(data => {
        this.translation = data.translationMessage
          ? JSON.parse(data.translationMessage)
          : null;
      })
    );
    this.subscription.add(
      this.voyaCacheService.getTranslationPreference().subscribe(data => {
        this.translationPref = data;
      })
    );
  }

  fetchAggregatedAccounts() {
    this.subscription.add(
      this.accountService.getAggregatedAccounts().subscribe(data => {
        this.snapshotAccount = data.snapshotAccounts;
      })
    );
  }

  async getOfferCodeValue() {
    this.offerVal = await this.adviceCalloutService.getAdviceCallout();
  }

  fetchLocalTime() {
    this.isMorning = this.greetingService.getIsMorningFlag();
    this.isEvening = this.greetingService.getIsEveningFlag();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  isSizeOne(): boolean {
    return this.sizes.isSizeOne();
  }

  isSizeTwo(): boolean {
    return this.sizes.isSizeTwo();
  }

  isSizeThree(): boolean {
    return this.sizes.isSizeThree();
  }

  isSizeFour(): boolean {
    return this.sizes.isSizeFour();
  }

  fetchMoneyOutStatus() {
    this.subscription.add(
      this.accountService.getMoneyOutStatus().subscribe(data => {
        if (data) {
          this.moneyOutMessagesList = data
            .flatMap(cDetails =>
              cDetails.clientPlanTransactions.flatMap(
                cpTrans => cpTrans.details.transactionList?.filter(t => t.moneyOutMessage)
              )
            )
            .sort((a, b) => {
              return (
                new Date(b.transactionDate).getTime() -
                new Date(a.transactionDate).getTime()
              );
            })
            .slice(0, 3)
            .flatMap(msgs => msgs.moneyOutMessage)
            .filter(str => str !== undefined);
          this.isMoneyOutAvailable =
            this.moneyOutMessagesList.length > 0 ? true : false;
        }
      })
    );
  }
}

import {Injectable} from '@angular/core';
import {endPoints, tokenEndPoints} from './constants/endpoints';
import {
  Benefit,
  Benefits,
  BenefitsSummaryContent,
  BenefitsSummaryModalContent,
  BenefitsHomeContent,
  BenefitsSelectionContent,
  BenefitEnrollment,
  GuidanceEnabled,
  GetMedicalCard,
  MyIDCard,
  AddMedicalCard,
  UploadedMedicalCard,
  BSTSmartCardData,
  BenefitsHomeBannerContent,
  BenefitForBenefitUser,
} from './models/benefits.model';
import {ModalController} from '@ionic/angular';
import {CoverageExplanationsOOPDeductible} from './models/message.model';
import {
  BSTSmartCardContent,
  NoBenefitContent,
  NotificationContent,
} from './models/noBenefit.model';
import {BaseService} from '../base/base-factory-provider';
import {SharedUtilityService} from '../utility/utility.service';
import {BenefitsSelectionModalComponent} from '@shared-lib/components/benefits-selection/modal/modal.component';
import {
  HealthDates,
  HealthUtlization,
  InsightsHealthCheck,
  StartEndDate,
  YearRange,
} from '@shared-lib/components/coverages/models/chart.model';
import {from, Observable, ReplaySubject, Subject, BehaviorSubject} from 'rxjs';
import {map, take} from 'rxjs/operators';
import {CoveragesSortOrder} from './constants/sorting';
import {FilterList, FilterModels} from '../../models/filter-sort.model';
import moment from 'moment';
import {card} from '../../components/coverages/plan-tabs/plan-details/my-id-card/constants/camera.enum';
import {EventTrackingService} from '@shared-lib/services/event-tracker/event-tracking.service';
import {ModalPresentationService} from '../modal-presentation/modal-presentation.service';
import {SmartBannerEnableConditions} from '../smart-banner/models/smart-banner.model';
@Injectable({
  providedIn: 'root',
})
export class BenefitsService {
  endPoints = endPoints;
  tokenEndPoints = tokenEndPoints;
  private benefitsSummaryContent: BenefitsSummaryContent;
  private nextYearBenefitsPromise: Promise<Benefits>;
  private benefitSelectionContent: BenefitsSelectionContent;
  private benefit: Benefit;
  private benefitSubject: BehaviorSubject<Benefit> = new BehaviorSubject(null);
  private healthUtlization: HealthUtlization;
  private benefitsModalSeen = false;
  public covexplanation: CoverageExplanationsOOPDeductible;
  private benefitEnrollmentSubject: ReplaySubject<
    BenefitEnrollment
  > = new ReplaySubject(1);
  private benefitEnrollment: Promise<BenefitEnrollment>;

  private selectedTab$: Subject<string> = new Subject<string>();
  private guidanceEnabled: GuidanceEnabled;
  private nohealthUtilization: NotificationContent;
  private benefitSummaryBackButton: string;
  requestPayload = {
    pageName: 'BELL',
    actionPerformed: 'VISITED',
  };
  notificationStatus = new Subject<string>();

  private noBenefitContentsPromise: Promise<NoBenefitContent>;
  private benefitsPromise: Promise<Benefits>;
  private benefitForBenefitUser:Observable<BenefitForBenefitUser>;
  private filt = new BehaviorSubject<FilterList[]>([]);

  private sort = new BehaviorSubject<string>('');
  private selectedSmartCard: BSTSmartCardContent;

  dateOption = new BehaviorSubject<string>('thisYear');

  storedFilterKey = [];
  storedSortKey = '';
  isDeepLink = false;
  private cardImagesSubject: BehaviorSubject<
    Record<string, MyIDCard>
  > = new BehaviorSubject({});
  private benefitCards: Record<string, MyIDCard> = {};
  private flipCardSubject = new BehaviorSubject<string>('front');
  private smartBannerEnableConditions: Subject<
    SmartBannerEnableConditions
  > = new Subject<SmartBannerEnableConditions>();
  currentSmartBannerEnableConditions: SmartBannerEnableConditions = {
    isSmartBannerHidden: false,
    isSmartBannerDismissed: false,
  };

  constructor(
    private baseService: BaseService,
    private utilityService: SharedUtilityService,
    private modalController: ModalController,
    private eventTrackingService: EventTrackingService,
    private modalPresentationService: ModalPresentationService
  ) {
    this.endPoints = this.utilityService.appendBaseUrlToEndpoints(endPoints);
    this.tokenEndPoints = this.utilityService.appendBaseUrlToEndpoints(
      tokenEndPoints,
      this.utilityService.getEnvironment().tokenBaseUrl
    );
  }

  changeFilt(data: FilterList[]) {
    this.filt.next(data);
  }

  changeSort(data: string) {
    this.sort.next(data);
  }

  changeDateOptions(data: string) {
    this.dateOption.next(data);
  }

  getSelectedTab$(): Subject<string> {
    return this.selectedTab$;
  }

  currentFilter(): Observable<FilterList[]> {
    return this.filt.asObservable();
  }

  currentSort(): Observable<string> {
    return this.sort.asObservable();
  }

  currentDateOpt(): Observable<string> {
    return this.dateOption.asObservable();
  }

  getSectionValues(): Promise<FilterModels> {
    return this.baseService.get(this.endPoints.getSelectionValues);
  }

  publishSelectedTab(selectedTab: string) {
    this.selectedTab$.next(selectedTab);
  }

  setSmartBannerEnableConditions(
    smartBannerEnableConditions: Record<string, boolean>
  ) {
    if (smartBannerEnableConditions.isSmartBannerDismissed != undefined) {
      this.currentSmartBannerEnableConditions.isSmartBannerDismissed =
        smartBannerEnableConditions.isSmartBannerDismissed;
    }
    if (smartBannerEnableConditions.isSmartBannerHidden != undefined) {
      this.currentSmartBannerEnableConditions.isSmartBannerHidden =
        smartBannerEnableConditions.isSmartBannerHidden;
    }
    this.smartBannerEnableConditions.next(
      this.currentSmartBannerEnableConditions
    );
  }

  getSmartBannerEnableConditions(): Subject<SmartBannerEnableConditions> {
    return this.smartBannerEnableConditions;
  }

  private async getBenefitsInternal() {
    const bens: Benefits = await this.baseService.get(this.endPoints.benefits);
    return this.sortBenefits(bens);
  }

  async getBenefits(): Promise<Benefits> {
    if (!this.benefitsPromise) {
      this.benefitsPromise = this.getBenefitsInternal();
    }
    return this.benefitsPromise;
  }

  sortBenefits(bens: Benefits): Benefits {
    if (bens.enrolled) {
      bens.enrolled = this.sortCoverages(bens.enrolled);
    }
    if (bens.declined) {
      bens.declined = this.sortCoverages(bens.declined);
    }
    if (bens.provided) {
      bens.provided = this.sortCoverages(bens.provided);
    }
    return bens;
  }

  sortCoverages(coverages: Benefit[]): Benefit[] {
    return coverages.sort((a, b) => {
      let aVal = CoveragesSortOrder[a.type];
      if (aVal == undefined) {
        aVal = Number.MAX_SAFE_INTEGER;
      }
      let bVal = CoveragesSortOrder[b.type];
      if (bVal == undefined) {
        bVal = Number.MAX_SAFE_INTEGER;
      }
      return aVal - bVal;
    });
  }

  async getNextYearBenefits(): Promise<Benefits> {
    if (!this.nextYearBenefitsPromise) {
      this.nextYearBenefitsPromise = new Promise(res => {
        this.baseService
          .get(
            this.endPoints.benefits +
              '?nextYearIfAvailable=true&getTotalDeduction=true'
          )
          .then(bens => {
            res(this.sortBenefits(bens));
          });
      });
    }
    return this.nextYearBenefitsPromise;
  }

  setBenefit(benefit: Benefit) {
    localStorage.setItem('selectedBenefit', JSON.stringify(benefit));
    this.benefit = benefit;
    this.benefitSubject.next(benefit);
  }

  setFiltSlcted(keyName: string[]) {
    this.storedFilterKey = keyName;
    localStorage.setItem('storedFilterKey', JSON.stringify(keyName));
  }

  getFiltSlcted() {
    if (!this.storedFilterKey) {
      this.storedFilterKey = JSON.parse(
        localStorage.getItem('storedFilterKey')
      );
    }
    return this.storedFilterKey;
  }

  getSelectedBenefitObservable() {
    if (this.benefitSubject.getValue() == null) {
      this.getSelectedBenefit();
    }

    return this.benefitSubject;
  }

  getSelectedBenefit(): Benefit {
    if (!this.benefit) {
      this.benefit = JSON.parse(localStorage.getItem('selectedBenefit'));
      this.benefitSubject.next(this.benefit);
    }
    return this.benefit;
  }

  async getBenefitContent(): Promise<BenefitsSummaryContent> {
    if (!this.benefitsSummaryContent) {
      const response = await this.baseService.get(this.endPoints.benefitIcons);
      this.benefitsSummaryContent = JSON.parse(response.BenefitsSummaryJSON);
    }
    return this.benefitsSummaryContent;
  }

  async getNoBenefitContents(): Promise<NoBenefitContent> {
    if (!this.noBenefitContentsPromise) {
      this.noBenefitContentsPromise = this.baseService.get(
        this.endPoints.noBenefitContent
      );
    }
    return this.noBenefitContentsPromise;
  }

  async getNoHealthDataContent(): Promise<NotificationContent> {
    if (!this.nohealthUtilization) {
      this.nohealthUtilization = await this.baseService.get(
        this.endPoints.noHealthData
      );
    }
    return this.nohealthUtilization;
  }

  async getBenefitsSelectionModalContent(): Promise<
    BenefitsSummaryModalContent
  > {
    await this.setBenefitsSelectionContent();
    return JSON.parse(this.benefitSelectionContent.BenefitsSelectionModalJSON);
  }

  async getBenefitsSelectionHomeContent(): Promise<BenefitsHomeContent> {
    await this.setBenefitsSelectionContent();
    return JSON.parse(this.benefitSelectionContent.BenefitsSelectionHomeJSON);
  }

  private async setBenefitsSelectionContent(): Promise<void> {
    if (!this.benefitSelectionContent) {
      this.benefitSelectionContent = await this.baseService.get(
        this.endPoints.benefitModals
      );
    }
  }

  async openBenefitsSelectionModalIfEnabled() {
    if (!this.isDeepLink) {
      const guidanceEnabled = await this.getGuidanceEnabled();
      if (guidanceEnabled.guidanceEnabled && !this.benefitsModalSeen) {
        this.benefitsModalSeen = true;
        const benefitsEnrollment$ = await this.getBenefitsEnrollment();
        benefitsEnrollment$
          .pipe(take(1))
          .subscribe(async benefitsEnrollment => {
            if (
              benefitsEnrollment?.enrollmentWindowEnabled &&
              benefitsEnrollment.status != 'COMPLETED' &&
              benefitsEnrollment.status != 'ACTION_PLAN_CREATED'
            ) {
              this.setSmartBannerEnableConditions({
                isSmartBannerHidden: true,
              });
              const modal = await this.modalController.create({
                component: BenefitsSelectionModalComponent,
                cssClass: 'modal-fullscreen',
                componentProps: {},
              });
              this.modalPresentationService.present(modal);
            }
          });
      }
    }
  }

  resetBenefitsEnrollment() {
    this.benefitEnrollment = undefined;
  }

  async getBenefitsEnrollment(): Promise<Observable<BenefitEnrollment>> {
    try {
      const guidanceEnabled = await this.getGuidanceEnabled();
      if (guidanceEnabled.guidanceEnabled && !this.benefitEnrollment) {
        this.benefitEnrollment = this.baseService.get(
          this.endPoints.benefitsEnrollment
        );
      }
      const benefitEnrollment = await this.benefitEnrollment;
      this.benefitEnrollmentSubject.next(benefitEnrollment);
      return this.benefitEnrollmentSubject;
    } catch (e) {
      console.log(e);
      const benefitEnrollment = undefined;
      this.benefitEnrollmentSubject.next(benefitEnrollment);
      return this.benefitEnrollmentSubject;
    }
  }

  async getCovExp(): Promise<CoverageExplanationsOOPDeductible> {
    if (!this.covexplanation) {
      const response = await this.baseService.get(this.endPoints.messages);
      this.covexplanation = JSON.parse(
        response.CoverageExplanationsOOPDeductible
      );
    }
    return this.covexplanation;
  }

  setBenefitSummaryBackButton(link: string) {
    this.benefitSummaryBackButton = link;
    localStorage.setItem('benefitSummaryBackButton', link);
  }

  getBenefitSummaryBackButton(): string {
    const localStorageLink = localStorage.getItem('benefitSummaryBackButton');
    return localStorageLink && localStorageLink !== 'undefined'
      ? localStorageLink
      : this.benefitSummaryBackButton;
  }

  async fetchSpending(
    healthDates: HealthDates,
    refresh = false
  ): Promise<HealthUtlization> {
    if (!this.healthUtlization || refresh) {
      const payload: StartEndDate = {
        startDate: healthDates.startDate,
        endDate: healthDates.endDate,
      };
      this.healthUtlization = await this.baseService.post(
        this.endPoints.spendingDetails,
        payload
      );
    }
    return this.healthUtlization;
  }

  async fetchHealthCheckContent(
    healthDates: HealthDates
  ): Promise<InsightsHealthCheck> {
    const payload: YearRange = {
      fromYear: moment(healthDates.startDate, 'MM/DD/YYYY').year(),
      toYear: moment(healthDates.endDate, 'MM/DD/YYYY').year(),
    };

    const result: InsightsHealthCheck[] = await this.baseService.post(
      this.endPoints.annualHealthCheckup,
      payload
    );
    return result[0];
  }

  async getGuidanceEnabled(refresh = false): Promise<GuidanceEnabled> {
    if (!this.guidanceEnabled || refresh) {
      this.guidanceEnabled = await this.baseService.get(
        this.endPoints.guidanceEnabled
      );
    }
    return this.guidanceEnabled;
  }

  getBenefitEnrolledData(id: string): Observable<Benefit> {
    return from(this.getNextYearBenefits()).pipe(
      map(data => data.enrolled.filter(account => account.id === id)[0])
    );
  }

  async openGuidelines(trackEvent = false, status?: string) {
    if (trackEvent) {
      this.eventTrackingService.eventTracking({
        eventName: 'CTAClick',
        passThruAttributes: [
          {
            attributeName: 'subType',
            attributeValue: 'open_enrollment_banner',
          },
          {
            attributeName: 'Enrollment_user_status',
            attributeValue: status,
          },
        ],
      });
    }
    this.setSmartBannerEnableConditions({isSmartBannerHidden: true});
    const modal = await this.modalController.create({
      component: BenefitsSelectionModalComponent,
      cssClass: 'modal-fullscreen',
      componentProps: {
        showBeforeStarting: true,
        exitIconPath: 'assets/icon/exit.svg',
      },
    });
    return this.modalPresentationService.present(modal);
  }

  setSortSlcted(keyName: string) {
    this.storedSortKey = keyName;
    localStorage.setItem('storedSortKey', JSON.stringify(keyName));
  }

  getSortSlcted() {
    if (!this.storedSortKey) {
      this.storedSortKey = JSON.parse(
        localStorage.getItem('storedSortKey') || '{}'
      );
    }
    return this.storedSortKey;
  }

  getTotalCostBST(data: HealthUtlization): number {
    return data?.outNetworkCost?.outOfPocketCost +
      data?.inNetworkCost?.outOfPocketCost
      ? data?.outNetworkCost?.outOfPocketCost +
          data?.inNetworkCost?.outOfPocketCost
      : 0;
  }

  getTotalPremium(data: Benefits): number {
    let totalPremiumSavvi = 0;
    if (data && data.enrolled) {
      if (data.enrolled.filter(val => val.type === 'medical_plan').length > 0) {
        totalPremiumSavvi = data.enrolled.filter(
          val => val.type === 'medical_plan'
        )[0].totalPremium
          ? data.enrolled.filter(val => val.type === 'medical_plan')[0]
              .totalPremium
          : 0;
      }
    }
    return totalPremiumSavvi;
  }

  getIdCard(): MyIDCard {
    const cardFrontBack: MyIDCard = {
      cardFront: '',
      cardBack: '',
    };
    const selectedBenefit: Benefit = this.getSelectedBenefit();
    const cardFrontUrl: string = this.endPoints.getMyIdCard
      .replace('$cardSide', card.FRONT)
      .replace('$planId', selectedBenefit.id);
    const cardBackUrl: string = this.endPoints.getMyIdCard
      .replace('$cardSide', card.BACK)
      .replace('$planId', selectedBenefit.id);
    this.baseService.get(cardFrontUrl).then((res: GetMedicalCard) => {
      cardFrontBack.cardFront =
        res === null ? '' : this.appendBase64MetaData(res.content);
      this.benefitCards[selectedBenefit.id] = cardFrontBack;
      this.cardImagesSubject.next(this.benefitCards);
    });
    this.baseService.get(cardBackUrl).then((res: GetMedicalCard) => {
      cardFrontBack.cardBack =
        res === null ? '' : this.appendBase64MetaData(res.content);
      this.benefitCards[selectedBenefit.id] = cardFrontBack;
      this.cardImagesSubject.next(this.benefitCards);
    });
    return cardFrontBack;
  }

  trimBase64MetaData(content: string): string {
    if (content.search(',') > -1) {
      const base64EncodedData = content.split(',')[1];
      return base64EncodedData.replace(/['="]+/g, '');
    }
    return content;
  }

  appendBase64MetaData(content: string): string {
    const metaData = 'data:image/png;base64,';
    if (!content.includes(metaData)) {
      return metaData + content;
    }
    return content;
  }

  private resetImages() {
    const selectedBenefit = this.getSelectedBenefit();
    this.benefitCards[selectedBenefit.id] = {cardFront: '', cardBack: ''};
    this.cardImagesSubject.next(this.benefitCards);
  }

  uploadMyIdCard(cardImage: MyIDCard): Promise<UploadedMedicalCard> {
    const selectedBenefit: Benefit = this.getSelectedBenefit();
    const cardPayLoad: Array<AddMedicalCard> = [
      {
        srcDocId: selectedBenefit.id,
        srcPlanType: selectedBenefit.type,
        docSide: card.FRONT,
        content: cardImage.cardFront,
      },
      {
        srcDocId: selectedBenefit.id,
        srcPlanType: selectedBenefit.type,
        docSide: card.BACK,
        content: cardImage.cardBack,
      },
    ];
    const url =
      this.benefitCards[selectedBenefit.id] &&
      (this.benefitCards[selectedBenefit.id].cardFront ||
        this.benefitCards[selectedBenefit.id].cardBack)
        ? this.endPoints.updateMedicalCard
        : this.endPoints.addMedicalCard;
    this.benefitCards[selectedBenefit.id] = {
      cardFront: this.appendBase64MetaData(cardImage.cardFront),
      cardBack: this.appendBase64MetaData(cardImage.cardBack),
    };
    this.cardImagesSubject.next(this.benefitCards);
    return this.baseService.post(url, cardPayLoad);
  }

  deleteMedicalCard() {
    this.resetImages();
    this.baseService.get(
      this.endPoints.deleteMedicalCard + '/' + this.benefit.id
    );
  }

  getCardImages(): Observable<Record<string, MyIDCard>> {
    return this.cardImagesSubject;
  }

  getFlipCardSubject(): Observable<string> {
    return this.flipCardSubject;
  }

  flipCard(state: string) {
    const newState = state == 'front' ? 'back' : 'front';
    this.flipCardSubject.next(newState);
  }

  getBannerContentObj(
    benefitsEnrollment: BenefitEnrollment,
    enrollmentBannerContent: BenefitsHomeContent
  ): BenefitsHomeBannerContent {
    return benefitsEnrollment.enrollmentWindowEnabled
      ? enrollmentBannerContent.openEnrollment[benefitsEnrollment.status]
      : enrollmentBannerContent.outsideEnrollment[benefitsEnrollment.status];
  }

  fetchBstSmartCards(): Promise<BSTSmartCardData> {
    return this.baseService.get(this.endPoints.bstSmartCards);
  }

  setSelectedSmartCard(smartCard: BSTSmartCardContent) {
    this.selectedSmartCard = smartCard;
    localStorage.setItem(
      'selected_smart_card',
      JSON.stringify(this.selectedSmartCard)
    );
  }

  getSelectedSmartCard(): BSTSmartCardContent {
    if (!this.selectedSmartCard) {
      this.selectedSmartCard = JSON.parse(
        localStorage.getItem('selected_smart_card')
      );
    }
    return this.selectedSmartCard;
  }

  getMBHBenefitDetails(): Observable<BenefitForBenefitUser> {
    if (!this.benefitForBenefitUser) {
      this.benefitForBenefitUser = from(this.baseService.get(
        this.endPoints.benefitForBenefitshub
      ));
    }
    return this.benefitForBenefitUser;
  }
}

import {Injectable, OnDestroy} from '@angular/core';
import {BaseService} from '@shared-lib/services/base/base-factory-provider';
import {SharedUtilityService} from '@shared-lib/services/utility/utility.service';
import {from, Observable, ReplaySubject, Subscription} from 'rxjs';
import {endPoints} from './constants/endpoints';
import navbarContent from '@web/app/modules/shared/components/header/components/myvoyage-header/constants/content.json';
import {LeftSideJSONContent, LeftSideContent} from './model/leftside.model';
import {
  CatchUpContent,
  CatchUpJSONContent,
  CatchUpMessageHub,
} from './model/catchup.model';
import {LandingAddAccountCarousels} from './model/landing-add-account-carousel.model';
import {AccessService} from '@shared-lib/services/access/access.service';
import {LandingOrangeMoneyContent} from './model/landing-om-content.model';
import {MbhDashboardConent} from './model/mbh-dashboard-conent.model';
@Injectable({
  providedIn: 'root',
})
export class ContentService implements OnDestroy {
  endPoints = endPoints;
  navbarContent = navbarContent;
  private subscription: Subscription = new Subscription();
  private leftHandSideConentData: Observable<LeftSideJSONContent> = null;
  private leftHandSideConentSubject: ReplaySubject<LeftSideContent> = null;
  private landingOrangeMoneyContentData: Observable<
    LandingOrangeMoneyContent
  > = null;
  private landingOrangeMoneyContentSubject: ReplaySubject<
    LandingOrangeMoneyContent
  > = null;
  private catchupConentData: Observable<CatchUpJSONContent> = null;
  private catchupConentSubject: ReplaySubject<CatchUpContent> = null;
  private catchUpMessageHubData: Observable<CatchUpMessageHub> = null;
  private catchUpMessageHubSubject: ReplaySubject<CatchUpMessageHub> = null;
  private landingAddAccountCarouselData: Observable<
    LandingAddAccountCarousels
  > = null;
  private landingAddAccountCarouselSubject: ReplaySubject<
    LandingAddAccountCarousels
  > = null;
  private mbhDashboardConentData: Observable<MbhDashboardConent> = null;
  private mbhDashboardConentSubject: ReplaySubject<MbhDashboardConent> = null;

  constructor(
    private baseService: BaseService,
    private accessService: AccessService,
    private utilityService: SharedUtilityService
  ) {
    this.endPoints = this.utilityService.appendBaseUrlToEndpoints(endPoints);
    this.leftHandSideConentSubject = new ReplaySubject(1);
    this.catchupConentSubject = new ReplaySubject(1);
    this.catchUpMessageHubSubject = new ReplaySubject(1);
    this.landingAddAccountCarouselSubject = new ReplaySubject(1);
    this.landingOrangeMoneyContentSubject = new ReplaySubject(1);
    this.mbhDashboardConentSubject = new ReplaySubject(1);
  }

  getLandingAddAccountCarousels(
    refresh = false
  ): Observable<LandingAddAccountCarousels> {
    if (!this.landingAddAccountCarouselData || refresh) {
      this.landingAddAccountCarouselData = from(this.getCarouselData());
      const carouselSubscription = this.landingAddAccountCarouselData.subscribe(
        (data: LandingAddAccountCarousels) => {
          this.landingAddAccountCarouselSubject.next(data);
        }
      );
      this.subscription.add(carouselSubscription);
    }
    return this.landingAddAccountCarouselSubject;
  }

  private async getCarouselData(): Promise<LandingAddAccountCarousels> {
    const sessionID = await this.accessService.getSessionId();
    return this.baseService.get(
      `${this.endPoints.landingAddAccountCarousel}?sessionId=${sessionID}`
    );
  }

  getLeftSideContent(refresh = false): Observable<LeftSideContent> {
    if (!this.leftHandSideConentData || refresh) {
      this.leftHandSideConentData = from(
        this.baseService.get(this.endPoints.leftSideContent)
      );
      const contentSubscription = this.leftHandSideConentData.subscribe(
        (data: LeftSideJSONContent) => {
          this.leftHandSideConentSubject.next(
            this.manageLeftSideContentData(data)
          );
        }
      );
      this.subscription.add(contentSubscription);
    }
    return this.leftHandSideConentSubject;
  }

  manageLeftSideContentData(data: LeftSideJSONContent): LeftSideContent {
    const suggestedLifeEventHeader = data.SuggestedLifeEventHeader
      ? {suggestedLifeEventHeader: JSON.parse(data.SuggestedLifeEventHeader)}
      : null;
    const workplaceAccountSnapshotHeader = data.WorkplaceAccountSnapshotHeader
      ? {workplaceAccountSnapshotHeader: data.WorkplaceAccountSnapshotHeader}
      : null;
    return {
      ...workplaceAccountSnapshotHeader,
      ...suggestedLifeEventHeader,
    };
  }

  getCatchupContent(refresh = false): Observable<CatchUpContent> {
    if (!this.catchupConentData || refresh) {
      this.catchupConentData = from(
        this.baseService.get(this.endPoints.catchupContent)
      );
      const contentSubscription = this.catchupConentData.subscribe(
        (data: CatchUpJSONContent) => {
          this.catchupConentSubject.next(JSON.parse(data.workplacecatchup));
        }
      );
      this.subscription.add(contentSubscription);
    }
    return this.catchupConentSubject;
  }

  getCatchUpMessageHub(refresh = false): Observable<CatchUpMessageHub> {
    if (!this.catchUpMessageHubData || refresh) {
      this.catchUpMessageHubData = from(
        this.baseService.get(this.endPoints.catchUpMessageHub)
      );
      const contentSubscription = this.catchUpMessageHubData.subscribe(
        (data: CatchUpMessageHub) => {
          this.catchUpMessageHubSubject.next(data);
        }
      );
      this.subscription.add(contentSubscription);
    }
    return this.catchUpMessageHubSubject;
  }

  getOrangeMoneyContent(
    refresh = false
  ): Observable<LandingOrangeMoneyContent> {
    if (!this.landingOrangeMoneyContentData || refresh) {
      this.landingOrangeMoneyContentData = from(
        this.baseService.get(this.endPoints.landingOrangeMoneyContent)
      );
      const contentSubscription = this.landingOrangeMoneyContentData.subscribe(
        (data: LandingOrangeMoneyContent) => {
          this.landingOrangeMoneyContentSubject.next(data);
        }
      );
      this.subscription.add(contentSubscription);
    }
    return this.landingOrangeMoneyContentSubject;
  }

  getMbhDashboardContent(refresh = false): Observable<MbhDashboardConent> {
    if (!this.mbhDashboardConentData || refresh) {
      this.mbhDashboardConentData = from(
        this.baseService.get(this.endPoints.mbhDashboard)
      );
      const contentSubscription = this.mbhDashboardConentData.subscribe(
        (data: MbhDashboardConent) => {
          this.mbhDashboardConentSubject.next(data);
        }
      );
      this.subscription.add(contentSubscription);
    }
    return this.mbhDashboardConentSubject;
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}

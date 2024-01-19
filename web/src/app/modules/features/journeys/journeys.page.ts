import {Component, ElementRef, ViewChild} from '@angular/core';
import pageText from '@shared-lib/services/journey/constants/journey-content.json';
import {JourneyContent} from '@shared-lib/services/journey/models/journeyContent.model';
import {JourneyService} from '@shared-lib/services/journey/journey.service';
import {
  Journey,
  JourneyResponse,
} from '@shared-lib/services/journey/models/journey.model';
import {from, Observable, Subscription} from 'rxjs';
import {SharedUtilityService} from '@shared-lib/services/utility/utility.service';
import {UrlProps} from './model/journey.model';
import {map} from 'rxjs/operators';
import {PlatformService} from '@shared-lib/services/platform/platform.service';
import {EventManagerService} from '@shared-lib/modules/event-manager/event-manager/event-manager.service';
import {eventKeys} from '@shared-lib/constants/event-keys';
import {AccessService} from '@shared-lib/services/access/access.service';
@Component({
  selector: 'app-journeys',
  templateUrl: 'journeys.page.html',
  styleUrls: ['journeys.page.scss'],
})
export class JourneysPage {
  pageData: JourneyContent = pageText;
  journeys$: Observable<JourneyResponse>;
  journeysResponse: JourneyResponse;
  urlProps: UrlProps;
  subscription = new Subscription();
  isRoutingActive: boolean;
  isDesktop: boolean;
  myWorkplaceDashboardEnabled: boolean;
  @ViewChild('topmostElement', {read: ElementRef}) topmostElement: ElementRef;
  @ViewChild('focusedElementLifeEvents', {read: ElementRef})
  focusedElementLifeEvents: ElementRef;
  selectedTab: string;

  constructor(
    private journeyService: JourneyService,
    private utilityService: SharedUtilityService,
    private platform: PlatformService,
    private eventManager: EventManagerService,
    private accessService: AccessService
  ) {}

  ngOnInit() {
    this.subscription.add(
      from(this.accessService.checkWorkplaceAccess()).subscribe(res => {
        this.myWorkplaceDashboardEnabled = res.myWorkplaceDashboardEnabled;
      })
    );
    this.journeys$ = this.journeyService.fetchJourneys();
    this.fetchCurrentUrl();
    this.platform.isDesktop().subscribe(data => {
      this.isDesktop = data;
    });
    this.eventManager
      .createSubscriber(eventKeys.journeyStepsScrollToTop)
      .subscribe(() => {
        this.utilityService.scrollToTop(this.topmostElement);
      });
  }

  fetchCurrentUrl() {
    let journeyType: string;
    const fetchUrlSubscription = this.utilityService
      .fetchUrlThroughNavigation(3)
      .pipe(
        map(data => {
          journeyType = data?.url.split('?journeyType=')[1]?.split('&')[0];
          this.selectedTab = data?.url.split('/')[4]?.split('?')[0];
          if (
            this.urlProps &&
            this.urlProps.journeyId &&
            this.urlProps.journeyId === parseInt(data?.paramId) &&
            this.urlProps.journeyType &&
            this.urlProps.journeyType === journeyType
          ) {
            this.isRoutingActive = true;
            return null;
          } else {
            return data;
          }
        })
      )
      .subscribe(data => {
        if (data && data.paramId && data.url) {
          this.isRoutingActive = false;
          const urlProps = {};
          urlProps['journeyId'] = parseInt(data.paramId);
          urlProps['journeyType'] = journeyType;
          urlProps['resolvePromiseTimes'] = 1;
          this.urlProps = urlProps;
        }
        this.utilityService.scrollToTop(this.topmostElement);
      });
    this.subscription.add(fetchUrlSubscription);
  }

  triggerLocalStorageChange(data: Journey) {
    if (data.journeyID === this.journeyService.getCurrentJourney().journeyID) {
      this.isRoutingActive = true;
    }
  }

  journeyClick(): void {
    const element = this.focusedElementLifeEvents.nativeElement as HTMLElement;
    element.focus();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}

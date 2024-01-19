import {Component, Injector} from '@angular/core';
import {SharedUtilityService} from '@shared-lib/services/utility/utility.service';
import {Subscription} from 'rxjs';
import {PlatformService} from '@shared-lib/services/platform/platform.service';
import {WebGoogleAnalyticsService} from './modules/shared/services/google-Analytics/google.analytics.service';
import {ActivatedRoute, Router} from '@angular/router';
import {AccessService} from '@shared-lib/services/access/access.service';
import {SafeResourceUrl} from '@angular/platform-browser';
import {endpoints} from './constants/endpoints';
import {MyVoyaService} from './modules/shared/services/myvoya/myvoya.service';
import {WebLogoutService} from './modules/shared/services/logout/logout.service';
import {EventTrackingService} from '@shared-lib/services/event-tracker/event-tracking.service';
import {VoyaGlobalCacheService} from './modules/shared/services/voya-global-cache/voya-global-cache.service';
import {
  EventTrackingEvent,
  EventTrackingConstants,
} from '@shared-lib/services/event-tracker/models/event-tracking.model';
import * as eventC from '@shared-lib/services/event-tracker/constants/event-tracking.json';
import {AccessResult} from '@shared-lib/services/access/models/access.model';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
})
export class AppComponent {
  suppressHeaderFooter: boolean;
  subscription = new Subscription();
  isDesktop: boolean;
  isUnSecure: boolean;
  endpoints: Record<string, string>;
  urlSafe: SafeResourceUrl;
  loadIframe: boolean;
  isAppReady: boolean;
  isMyVoyageAccess: boolean;
  private accessService: AccessService;
  private logoutService: WebLogoutService;
  isWorkplaceDashboardEnabled: boolean;
  private eventTrackingService: EventTrackingService;
  eventContent: EventTrackingConstants = eventC;
  isMyVoyageEnabled: boolean;

  constructor(
    public sharedUtilService: SharedUtilityService,
    private voyaGlobalCacheService: VoyaGlobalCacheService,
    private platformService: PlatformService,
    private googleAnalyticsService: WebGoogleAnalyticsService,
    private router: Router,
    public myVoyaService: MyVoyaService,
    private injector: Injector,
    private activatedRoute: ActivatedRoute
  ) {
    this.sharedUtilService.setIsWeb(true);
    this.sharedUtilService.setEnvironment(window.environment);
    this.sharedUtilService.fetchUrlThroughNavigation(3);
    this.endpoints = this.sharedUtilService.appendBaseUrlToEndpoints(endpoints);
    this.myVoyaService.listenForIframeLoad();
    this.eventTrackingService = this.injector.get<EventTrackingService>(
      EventTrackingService
    );
  }

  async ngOnInit() {
    this.genesysClearStorage();
    this.loadIframe = !this.myVoyaService.getIframeLoaded();
    if (this.loadIframe) {
      this.urlSafe = this.sharedUtilService.bypassSecurityTrustResourceUrl(
        this.endpoints.securityTrust
      );
    }
    await this.checkIsEnabled();
    this.accessService.checkLastPreferenceUpdated();

    if (this.isMyVoyageAccess) {
      await this.checkWorkplaceAccess();
      this.platformService.isDesktop().subscribe(data => {
        this.isDesktop = data;
        this.navigationDuringScreenResizing();
      });
      this.subscription.add(
        this.sharedUtilService
          .getSuppressHeaderFooter()
          .subscribe((data: boolean) => {
            this.suppressHeaderFooter = data;
          })
      );
      this.googleAnalyticsService.listenForEvents();
      await this.googleAnalyticsService.getQualtricsUser();
      this.googleAnalyticsService.listenForNavigationEnd();
      this.voyaGlobalCacheService.initVoyaGlobalCache();
      this.hideHeaderAndFooter();
    }
    const activatedRouteSubscription = this.activatedRoute.queryParams.subscribe(
      data => {
        this.captureDeepLinkEvent(data);
      }
    );
    this.subscription.add(activatedRouteSubscription);
    this.isAppReady = true;
  }
  private trackHomeEvent() {
    this.eventTrackingService.eventTracking({
      eventName: this.eventContent.eventTrackingLogin.eventName,
    });
  }

  checkIsEnabled(): Promise<void> {
    const allowedApplications = ['PWEB', 'MyVoya'];
    this.accessService = this.injector.get<AccessService>(AccessService);
    return this.accessService
      .checkMyvoyageAccess()
      .then(async data => {
        const isMyBenefitshub = this.checkMyBenefitshub(data);
        this.isMyVoyageEnabled = data.enableMyVoyage === 'Y';
        if (
          data.enableMyVoyage === 'Y' ||
          allowedApplications.includes(data.voyaSsoAppId) ||
          isMyBenefitshub
        ) {
          localStorage.setItem(
            'appId',
            data.voyaSsoAppId ? data.voyaSsoAppId : 'MyVoyage'
          );
          if (sessionStorage.getItem('LoginEventSent') !== 'true') {
            this.trackHomeEvent();
            sessionStorage.setItem('LoginEventSent', 'true');
          }
          this.isMyVoyageAccess = true;
          await this.accessService.getSessionId(data);
        } else {
          this.router.navigateByUrl('no-access');
        }
      })
      .catch(() => {
        this.router.navigateByUrl('no-access');
      });
  }

  checkWorkplaceAccess(): Promise<void> {
    return this.accessService.checkWorkplaceAccess().then(data => {
      this.isWorkplaceDashboardEnabled = data['myWorkplaceDashboardEnabled'];
      localStorage.setItem(
        'myWorkplaceDashboardEnabled',
        this.isWorkplaceDashboardEnabled.toString()
      );
    });
  }

  checkMyBenefitshub(data: AccessResult): boolean {
    const isMyBenefitshub =
      data.voyaSsoAppId === 'myBenefitshub' &&
      data.myWorkplaceDashboardEnabled &&
      data.isMyBenefitsUser
        ? true
        : false;
    sessionStorage.setItem('isMyBenefitshub', isMyBenefitshub.toString());
    return isMyBenefitshub;
  }

  navigationDuringScreenResizing() {
    const url = this.router.url;
    const arrOfURL = url.split('/');
    if (!this.isDesktop) {
      this.mobileNavigation(arrOfURL);
    } else {
      this.desktopNavigation(arrOfURL);
    }
  }

  desktopNavigation(arrOfURL: string[]) {
    if (arrOfURL[1] === 'more') {
      this.router.navigateByUrl('/help/faq');
    } else if (arrOfURL[1] === 'journeys-list') {
      this.router.navigateByUrl('/journeys');
    } else if (
      arrOfURL[1] === 'coverages' &&
      arrOfURL[2] === 'all-coverages' &&
      arrOfURL[3] === 'plans'
    ) {
      this.router.navigateByUrl('/coverages/all-coverages/elections');
    }
  }

  mobileNavigation(arrOfURL: string[]) {
    if (arrOfURL[1] === 'help' || arrOfURL[1] === 'settings') {
      this.router.navigateByUrl('/more');
    } else if (
      arrOfURL[1] === 'coverages' &&
      arrOfURL[2] === 'all-coverages' &&
      arrOfURL[3] === 'elections'
    ) {
      this.router.navigateByUrl('/coverages/all-coverages/plans');
    }
  }

  hideHeaderAndFooter() {
    const webLogoutService: WebLogoutService = this.injector.get<
      WebLogoutService
    >(WebLogoutService);
    this.subscription.add(
      webLogoutService.getTerminatedUser().subscribe((data: boolean) => {
        this.isUnSecure = data;
      })
    );
  }

  genesysClearStorage() {
    this.logoutService = this.injector.get<WebLogoutService>(WebLogoutService);
    if (!this.logoutService.getGenesysIsActive()) {
      this.logoutService.genesysRemoveLocalStorage();
      this.logoutService.setGenesysIsActive(true);
    }
  }

  captureDeepLinkEvent(data: Record<string, string>) {
    if (data?.source) {
      const eventTrackingEvent: EventTrackingEvent = {
        eventName: 'CTAClick',
        passThruAttributes: [
          {
            attributeName: 'subType',
            attributeValue: 'DeepLink',
          },
          {
            attributeName: 'source',
            attributeValue: data.source,
          },
        ],
      };
      if (data.redirect_route) {
        eventTrackingEvent.passThruAttributes.push({
          attributeName: 'redirect_route',
          attributeValue: data.redirect_route,
        });
      }
      this.eventTrackingService.eventTracking(eventTrackingEvent);
    }
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}

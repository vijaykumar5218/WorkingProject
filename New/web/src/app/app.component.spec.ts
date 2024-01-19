import {Component, CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {SharedUtilityService} from '@shared-lib/services/utility/utility.service';
import {AppComponent} from './app.component';
import {of, Subscription} from 'rxjs';
import {PlatformService} from '@shared-lib/services/platform/platform.service';
import {WebGoogleAnalyticsService} from './modules/shared/services/google-Analytics/google.analytics.service';
import {ActivatedRoute, Router} from '@angular/router';
import {endpoints} from './constants/endpoints';
import {MyVoyaService} from './modules/shared/services/myvoya/myvoya.service';
import {EventTrackingEvent} from '@shared-lib/services/event-tracker/models/event-tracking.model';
import {VoyaGlobalCacheService} from './modules/shared/services/voya-global-cache/voya-global-cache.service';
import {EventTrackingService} from '@shared-lib/services/event-tracker/event-tracking.service';
@Component({selector: 'app-header', template: ''})
class MockHeaderComponent {}

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let sharedUtilityServiceSpy;
  let platformServiceSpy;
  let googleAnalyticsServiceSpy;
  let routerSpy;
  let mockAccessData;
  let environment;
  let checkIsEnabledSpy;
  let navigationDuringScreenResizingSpy;
  let hideHeaderAndFooterSpy;
  let genesysChatSpy;
  let myVoyaServiceSpy;
  let checkWorkplaceAccessSpy;
  let voyaGlobalCacheServiceSpy;
  let captureDeepLinkEventSpy;
  let activatedRouteSpy;
  let eventTrackingServiceSpy;
  let accessServiceSpy;

  beforeEach(
    waitForAsync(() => {
      mockAccessData = {
        clientId: 'KOHLER',
        clientDomain: 'kohler.intg.voya.com',
        clientName: 'Kohler Co. 401(k) Savings Plan',
        planIdList: [
          {
            planId: '623040',
            active: true,
            benefitsAdminSystem: 'ADP',
          },
        ],
        firstTimeLogin: false,
        platform: 'ADP',
        currentPlan: {
          planId: '623040',
          active: true,
          benefitsAdminSystem: 'ADP',
        },
        enableMX: true,
        enableBST: 'N',
        isHealthOnly: false,
        myProfileURL: 'https%3A%2F%2Flogin.intg.voya',
      };
      const mockLastPreferenceData = {
        required: false,
        primaryEmail: {
          lastUpdatedDate: '2023-03-29T21:01:27',
          partyContactId: '70720357-e465-450a-a658-e9a1025913d6',
          email: 'jeni.anna@voya.com',
          lastFailedInd: 'N',
        },
        secondaryEmailAllowed: false,
        docDeliveryEmailContactId: '70720357-e465-450a-a658-e9a1025913d6',
        mobilePhone: {
          lastUpdatedDate: '2022-05-24T20:32:10',
          partyContactId: '15a2fbad-ff98-4baf-bfd7-c77d729165b8',
          phoneNumber: '1111111111',
        },
        lastPreferenceResponse: true,
        insightsNotificationPrefs: {},
        highPrioitytNotificationPrefs: {},
        accountAlertPrefs: {},
      };
      googleAnalyticsServiceSpy = jasmine.createSpyObj(
        'GoogleAnalyticsService',
        ['listenForEvents', 'listenForNavigationEnd', 'getQualtricsUser']
      );
      googleAnalyticsServiceSpy.getQualtricsUser.and.returnValue(
        Promise.resolve({
          clientDomain: 'testDomain',
          clientId: 'testClientId',
          clientName: 'testClientName',
          email: 'test@test.com',
          enableMyVoyage: 'Y',
          firstTimeLogin: true,
          mobile: '1112223333',
          partyId: undefined,
          planIdList: [
            {
              planId: '123',
              active: true,
              benefitsAdminSystem: 'aaa',
            },
          ],
        })
      );
      platformServiceSpy = jasmine.createSpyObj('PlatformService', [
        'isDesktop',
      ]);
      platformServiceSpy.isDesktop.and.returnValue({
        subscribe: () => undefined,
      });
      sharedUtilityServiceSpy = jasmine.createSpyObj(
        'SharedUtilityServiceSpy',
        [
          'setEnvironment',
          'setIsWeb',
          'getEnvironment',
          'getSuppressHeaderFooter',
          'appendBaseUrlToEndpoints',
          'fetchUrlThroughNavigation',
          'bypassSecurityTrustResourceUrl',
        ]
      );
      sharedUtilityServiceSpy.appendBaseUrlToEndpoints.and.callFake(
        endpoints => endpoints
      );
      sharedUtilityServiceSpy.getSuppressHeaderFooter.and.returnValue({
        subscribe: () => undefined,
      });
      routerSpy = {
        events: {
          pipe: jasmine.createSpy().and.returnValue(
            of({
              id: 1,
              url: '/session-timeout',
            })
          ),
        },
        navigateByUrl: jasmine.createSpy(),
        url: '/coverages/all-coverages/elections',
      };
      const urlParams = {
        source: 'email',
        redirect_route: 'home',
      };
      activatedRouteSpy = jasmine.createSpyObj('ActivatedRoute', [], {
        queryParams: of(urlParams),
      });
      myVoyaServiceSpy = jasmine.createSpyObj('MyVoyaService', [
        'listenForIframeLoad',
        'getIframeLoaded',
      ]);
      myVoyaServiceSpy.getIframeLoaded.and.returnValue(true);
      voyaGlobalCacheServiceSpy = jasmine.createSpyObj(
        'voyaGlobalCacheService',
        ['initVoyaGlobalCache']
      );
      eventTrackingServiceSpy = jasmine.createSpyObj('EventTrackingService', [
        'eventTracking',
      ]);
      TestBed.configureTestingModule({
        declarations: [AppComponent, MockHeaderComponent],
        providers: [
          {provide: SharedUtilityService, useValue: sharedUtilityServiceSpy},
          {provide: PlatformService, useValue: platformServiceSpy},
          {
            provide: WebGoogleAnalyticsService,
            useValue: googleAnalyticsServiceSpy,
          },
          {provide: Router, useValue: routerSpy},
          {provide: MyVoyaService, useValue: myVoyaServiceSpy},
          {
            provide: VoyaGlobalCacheService,
            useValue: voyaGlobalCacheServiceSpy,
          },
          {provide: ActivatedRoute, useValue: activatedRouteSpy},
          {provide: EventTrackingService, useValue: eventTrackingServiceSpy},
        ],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
      }).compileComponents();

      fixture = TestBed.createComponent(AppComponent);
      component = fixture.componentInstance;
      environment = {
        production: false,
        baseUrl: 'http://localhost:4201/',
        tokenBaseUrl: 'https://token.intg.app.voya.com/',
        myvoyaBaseUrl: 'http://localhost:4201/',
        loginBaseUrl: 'https://login.intg.voya.com/',
        savviBaseUrl: 'https://myhealthwealth.intg.voya.com/',
        firebaseConfig: {
          apiKey: 'AIzaSyA1rqtineGMBei3LKwgbvAj80YSXB7mSDw',
          authDomain: 'myvoyage-intg.firebaseapp.com',
          projectId: 'myvoyage-intg',
          storageBucket: 'myvoyage-intg.appspot.com',
          messagingSenderId: '143111284908',
          appId: '1:143111284908:web:0773ef5d5b027651dc1709',
          measurementId: 'G-SKZE188BBR',
        },
        qualtricsStartupUrl:
          'https://znb3ifcu3urc2bkmk-voyafinancial.siteintercept.qualtrics.com/SIE/',
      };
      window['environment'] = environment;
      sharedUtilityServiceSpy.getEnvironment.and.returnValue(environment);
      component.endpoints = endpoints;

      checkIsEnabledSpy = spyOn(component, 'checkIsEnabled').and.returnValue(
        Promise.resolve()
      );
      navigationDuringScreenResizingSpy = spyOn(
        component,
        'navigationDuringScreenResizing'
      );
      hideHeaderAndFooterSpy = spyOn(component, 'hideHeaderAndFooter');
      genesysChatSpy = spyOn(component, 'genesysClearStorage');
      checkWorkplaceAccessSpy = spyOn(
        component,
        'checkWorkplaceAccess'
      ).and.returnValue(Promise.resolve());
      captureDeepLinkEventSpy = spyOn(component, 'captureDeepLinkEvent');
      accessServiceSpy = jasmine.createSpyObj('accessService', [
        'checkLastPreferenceUpdated',
      ]);
      accessServiceSpy.checkLastPreferenceUpdated.and.returnValue(
        Promise.resolve(mockLastPreferenceData)
      );
      component['accessService'] = accessServiceSpy;
      // spyOn(component['accessService'], 'checkLastPreferenceUpdated').and.returnValue(mockLastPreferenceData);
      fixture.detectChanges();
    })
  );

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  describe('constructor', () => {
    it('should set isWeb', async () => {
      expect(sharedUtilityServiceSpy.setIsWeb).toHaveBeenCalledWith(true);
    });

    it('should call fetchUrlThroughNavigation', async () => {
      expect(
        sharedUtilityServiceSpy.fetchUrlThroughNavigation
      ).toHaveBeenCalled();
    });

    it('should call listenForIframeLoad', () => {
      expect(myVoyaServiceSpy.listenForIframeLoad).toHaveBeenCalled();
    });
  });

  describe('ngOnInit', () => {
    let subscription;
    let observable;
    beforeEach(() => {
      subscription = new Subscription();
      observable = of(true);
      spyOn(observable, 'subscribe').and.callFake(f => {
        f(true);
        return subscription;
      });
      component.suppressHeaderFooter = false;
      component['subscription'] = jasmine.createSpyObj('subscription', [
        'add',
        'unsubscribe',
      ]);
    });
    it('should call genesysClearStorage', async () => {
      await component.ngOnInit();
      expect(component.genesysClearStorage).toHaveBeenCalled();
    });

    it('should set loadIframe and urlSafe if loadIframe is true', () => {
      component.urlSafe = undefined;
      myVoyaServiceSpy.getIframeLoaded.and.returnValue(false);
      const safeUrl = endpoints.securityTrust + 'safe';
      sharedUtilityServiceSpy.bypassSecurityTrustResourceUrl.and.returnValue(
        safeUrl
      );
      component.ngOnInit();
      expect(component.loadIframe).toEqual(true);
      expect(
        sharedUtilityServiceSpy.bypassSecurityTrustResourceUrl
      ).toHaveBeenCalledWith(endpoints.securityTrust);
      expect(component.urlSafe).toEqual(safeUrl);
    });

    it('should set loadIframe and not set urlsafe if loadIframe is false', () => {
      component.urlSafe = undefined;
      component.loadIframe = undefined;
      component.ngOnInit();
      expect(component.loadIframe).toEqual(false);
      expect(
        sharedUtilityServiceSpy.bypassSecurityTrustResourceUrl
      ).not.toHaveBeenCalled();
      expect(component.urlSafe).toBeUndefined();
    });

    describe('when isMyVoyageAccess would be true', () => {
      beforeEach(() => {
        component.isMyVoyageAccess = true;
      });
      it('should call checkWorkplaceAccess', async () => {
        await component.ngOnInit();
        expect(component.checkWorkplaceAccess).toHaveBeenCalled();
      });
      it('should set isDesktop', async () => {
        platformServiceSpy.isDesktop.and.returnValue(of(true));
        component.isDesktop = false;
        await component.ngOnInit();
        expect(component.isDesktop).toEqual(true);
        expect(platformServiceSpy.isDesktop).toHaveBeenCalled();
        expect(component.navigationDuringScreenResizing).toHaveBeenCalled();
      });
      it('should call getSuppressHeaderFooter', async () => {
        sharedUtilityServiceSpy.getSuppressHeaderFooter.and.returnValue(
          observable
        );
        component.suppressHeaderFooter = false;
        await component.ngOnInit();
        expect(
          sharedUtilityServiceSpy.getSuppressHeaderFooter
        ).toHaveBeenCalled();
        expect(component['subscription'].add).toHaveBeenCalledWith(
          subscription
        );
        expect(component.suppressHeaderFooter).toEqual(true);
      });
      it('should call listenForEvents', async () => {
        await component.ngOnInit();
        expect(googleAnalyticsServiceSpy.listenForEvents).toHaveBeenCalled();
      });
      it('should call listenForNavigationEnd', async () => {
        await component.ngOnInit();
        expect(
          googleAnalyticsServiceSpy.listenForNavigationEnd
        ).toHaveBeenCalled();
      });
      it('should call initVoyaGlobalCache of voyaGlobalCacheService', async () => {
        await component.ngOnInit();
        expect(
          voyaGlobalCacheServiceSpy.initVoyaGlobalCache
        ).toHaveBeenCalled();
      });
      it('should call hideHeaderAndFooter', async () => {
        await component.ngOnInit();
        expect(component.hideHeaderAndFooter).toHaveBeenCalled();
      });
    });
    it('should call checkIsEnabled', async () => {
      await component.ngOnInit();
      expect(component.checkIsEnabled).toHaveBeenCalled();
    });
    it('should set queryparams and call captureDeepLinkEvent', async () => {
      component.ngOnInit();
      expect(component.captureDeepLinkEvent).toHaveBeenCalledWith({
        source: 'email',
        redirect_route: 'home',
      });
    });
  });

  describe('navigationDuringScreenResizing', () => {
    beforeEach(() => {
      navigationDuringScreenResizingSpy.and.callThrough();
      spyOn(component, 'mobileNavigation');
      spyOn(component, 'desktopNavigation');
    });
    it('when isDesktop would be true', () => {
      component.isDesktop = true;
      component.navigationDuringScreenResizing();
      expect(component.desktopNavigation).toHaveBeenCalled();
    });
    it('when isDesktop would be false', () => {
      component.isDesktop = false;
      component.navigationDuringScreenResizing();
      expect(component.mobileNavigation).toHaveBeenCalled();
    });
  });

  describe('checkIsEnabled', () => {
    let serviceSpy;
    beforeEach(() => {
      serviceSpy = jasmine.createSpyObj('service', [
        'checkMyvoyageAccess',
        'getSessionId',
      ]);
      spyOn(component['injector'], 'get').and.returnValue(serviceSpy);
      checkIsEnabledSpy.and.callThrough();
      component.isMyVoyageAccess = false;
      spyOn<any>(component, 'trackHomeEvent');
      spyOn(component, 'checkMyBenefitshub').and.returnValue(false);
    });
    it('should isMyVoyageAccess be false and redirect to no-access page', async () => {
      serviceSpy.checkMyvoyageAccess.and.returnValue(
        Promise.resolve({...mockAccessData, ...{enableMyVoyage: 'N'}})
      );
      await component.checkIsEnabled();
      expect(serviceSpy.checkMyvoyageAccess).toHaveBeenCalled();
      expect(routerSpy.navigateByUrl).toHaveBeenCalledWith('no-access');
      expect(component.isMyVoyageAccess).toEqual(false);
      expect(component.checkMyBenefitshub).toHaveBeenCalled();
    });
    it('should isMyVoyageAccess be false and voyaSsoAppId is PWEB provide access ', async () => {
      serviceSpy.checkMyvoyageAccess.and.returnValue(
        Promise.resolve({
          ...mockAccessData,
          ...{enableMyVoyage: 'N', voyaSsoAppId: 'PWEB'},
        })
      );
      serviceSpy.getSessionId.and.returnValue(
        Promise.resolve('Ar0wSx5Vu5tu2WBBICQ1oCu1.i9397')
      );
      await component.checkIsEnabled();
      expect(serviceSpy.checkMyvoyageAccess).toHaveBeenCalled();
      expect(routerSpy.navigateByUrl).not.toHaveBeenCalled();
      expect(component.isMyVoyageAccess).toEqual(true);
      expect(serviceSpy.getSessionId).toHaveBeenCalledWith({
        ...mockAccessData,
        ...{enableMyVoyage: 'N', voyaSsoAppId: 'PWEB'},
      });
    });
    it('should isMyVoyageAccess be false and voyaSsoAppId is MyVoya provide access ', async () => {
      serviceSpy.checkMyvoyageAccess.and.returnValue(
        Promise.resolve({
          ...mockAccessData,
          ...{enableMyVoyage: 'N', voyaSsoAppId: 'MyVoya'},
        })
      );
      serviceSpy.getSessionId.and.returnValue(
        Promise.resolve('Ar0wSx5Vu5tu2WBBICQ1oCu1.i9397')
      );
      await component.checkIsEnabled();
      expect(serviceSpy.checkMyvoyageAccess).toHaveBeenCalled();
      expect(routerSpy.navigateByUrl).not.toHaveBeenCalled();
      expect(component.isMyVoyageAccess).toEqual(true);
      expect(serviceSpy.getSessionId).toHaveBeenCalledWith({
        ...mockAccessData,
        ...{enableMyVoyage: 'N', voyaSsoAppId: 'MyVoya'},
      });
    });
    it('should isMyVoyageAccess be true', async () => {
      serviceSpy.checkMyvoyageAccess.and.returnValue(
        Promise.resolve({...mockAccessData, ...{enableMyVoyage: 'Y'}})
      );
      serviceSpy.getSessionId.and.returnValue(
        Promise.resolve('Ar0wSx5Vu5tu2WBBICQ1oCu1.i9397')
      );
      await component.checkIsEnabled();
      expect(serviceSpy.checkMyvoyageAccess).toHaveBeenCalled();
      expect(routerSpy.navigateByUrl).not.toHaveBeenCalled();
      expect(component.isMyVoyageAccess).toEqual(true);
      expect(serviceSpy.getSessionId).toHaveBeenCalled();
    });
    it('when service failed', async () => {
      serviceSpy.checkMyvoyageAccess.and.returnValue(Promise.reject());
      await component.checkIsEnabled();
      expect(serviceSpy.checkMyvoyageAccess).toHaveBeenCalled();
      expect(routerSpy.navigateByUrl).toHaveBeenCalledWith('no-access');
      expect(component.isMyVoyageAccess).toEqual(false);
    });
    it('should call trackHomeEvent method and set LoginEventSent be true when it is first login', async () => {
      spyOn(Storage.prototype, 'setItem');
      spyOn(Storage.prototype, 'getItem').and.returnValue('false');
      serviceSpy.checkMyvoyageAccess.and.returnValue(
        Promise.resolve({...mockAccessData, ...{enableMyVoyage: 'Y'}})
      );
      serviceSpy.getSessionId.and.returnValue(
        Promise.resolve('Ar0wSx5Vu5tu2WBBICQ1oCu1.i9397')
      );
      await component.checkIsEnabled();
      expect(component['trackHomeEvent']).toHaveBeenCalled();
    });

    it('should not call trackHomeEvent method if LoginEventSent be true', async () => {
      spyOn(Storage.prototype, 'setItem');
      spyOn(Storage.prototype, 'getItem').and.returnValue('true');
      serviceSpy.checkMyvoyageAccess.and.returnValue(
        Promise.resolve({...mockAccessData, ...{enableMyVoyage: 'Y'}})
      );
      serviceSpy.getSessionId.and.returnValue(
        Promise.resolve('Ar0wSx5Vu5tu2WBBICQ1oCu1.i9397')
      );
      await component.checkIsEnabled();
      expect(component['trackHomeEvent']).not.toHaveBeenCalled();
    });
  });

  describe('checkWorkplaceAccess', () => {
    let accessServiceSpy;
    beforeEach(() => {
      accessServiceSpy = jasmine.createSpyObj('accessService', [
        'checkWorkplaceAccess',
      ]);
      accessServiceSpy.checkWorkplaceAccess.and.returnValue(
        Promise.resolve({myWorkplaceDashboardEnabled: true})
      );
      component['accessService'] = accessServiceSpy;
      checkWorkplaceAccessSpy.and.callThrough();
    });
    it('should set the value of isWorkplaceDashboardEnabled', async () => {
      spyOn(Storage.prototype, 'setItem');
      await component.checkWorkplaceAccess();
      expect(component.isWorkplaceDashboardEnabled).toEqual(true);
      expect(Storage.prototype.setItem).toHaveBeenCalledWith(
        'myWorkplaceDashboardEnabled',
        'true'
      );
    });
  });

  describe('checkMyBenefitshub', () => {
    beforeEach(() => {
      spyOn(Storage.prototype, 'setItem');
    });
    it('when isMyBenefitshub will be true', () => {
      const mockData: any = {
        voyaSsoAppId: 'myBenefitshub',
        myWorkplaceDashboardEnabled: true,
        isMyBenefitsUser: true,
      };
      const result = component.checkMyBenefitshub(mockData);
      expect(result).toEqual(true);
      expect(Storage.prototype.setItem).toHaveBeenCalledWith(
        'isMyBenefitshub',
        'true'
      );
    });
    it('when isMyBenefitshub will be false', () => {
      const mockData: any = {
        voyaSsoAppId: 'myBenefitshub',
        myWorkplaceDashboardEnabled: true,
        isMyBenefitsUser: false,
      };
      const result = component.checkMyBenefitshub(mockData);
      expect(result).toEqual(false);
      expect(Storage.prototype.setItem).toHaveBeenCalledWith(
        'isMyBenefitshub',
        'false'
      );
    });
  });

  describe('desktopNavigation', () => {
    it('when url would be /more', () => {
      component.desktopNavigation(['', 'more']);
      expect(routerSpy.navigateByUrl).toHaveBeenCalledWith('/help/faq');
    });
    it('when url would be /journeys-list', () => {
      component.desktopNavigation(['', 'journeys-list']);
      expect(routerSpy.navigateByUrl).toHaveBeenCalledWith('/journeys');
    });
    it('when url would be /coverages/all-coverages/plans', () => {
      component.desktopNavigation(['', 'coverages', 'all-coverages', 'plans']);
      expect(routerSpy.navigateByUrl).toHaveBeenCalledWith(
        '/coverages/all-coverages/elections'
      );
    });
    it('when url would be /help', () => {
      component.desktopNavigation(['', 'help']);
      expect(routerSpy.navigateByUrl).not.toHaveBeenCalled();
    });
  });

  describe('mobileNavigation', () => {
    it('when url would be /help', () => {
      component.mobileNavigation(['', 'help']);
      expect(routerSpy.navigateByUrl).toHaveBeenCalledWith('/more');
    });
    it('when url would be /settings', () => {
      component.mobileNavigation(['', 'settings']);
      expect(routerSpy.navigateByUrl).toHaveBeenCalledWith('/more');
    });
    it('when url would be /coverages/all-coverages/elections', () => {
      component.mobileNavigation([
        '',
        'coverages',
        'all-coverages',
        'elections',
      ]);
      expect(routerSpy.navigateByUrl).toHaveBeenCalledWith(
        '/coverages/all-coverages/plans'
      );
    });
    it('when url would be /more', () => {
      component.mobileNavigation(['', 'more']);
      expect(routerSpy.navigateByUrl).not.toHaveBeenCalled();
    });
  });

  describe('hideHeaderAndFooter', () => {
    let serviceSpy;
    let observable;
    let subscription;
    beforeEach(() => {
      subscription = new Subscription();
      observable = of(true);
      spyOn(observable, 'subscribe').and.callFake(f => {
        f(true);
        return subscription;
      });
      serviceSpy = jasmine.createSpyObj('service', ['getTerminatedUser']);
      spyOn(component['injector'], 'get').and.returnValue(serviceSpy);
      hideHeaderAndFooterSpy.and.callThrough();
      spyOn(component['subscription'], 'add');
      serviceSpy.getTerminatedUser.and.returnValue(observable);
      component.isUnSecure = false;
    });
    it('should set the value of isUnSecure', () => {
      component.hideHeaderAndFooter();
      expect(serviceSpy.getTerminatedUser).toHaveBeenCalled();
      expect(component['subscription'].add).toHaveBeenCalledWith(subscription);
      expect(component.isUnSecure).toEqual(true);
    });
  });

  describe('genesysClearStorage', () => {
    let serviceSpy;
    beforeEach(() => {
      serviceSpy = jasmine.createSpyObj('service', [
        'getGenesysIsActive',
        'genesysRemoveLocalStorage',
        'setGenesysIsActive',
      ]);
      spyOn(component['injector'], 'get').and.returnValue(serviceSpy);
      genesysChatSpy.and.callThrough();
    });
    it('when getGenesysIsActive fun return true', () => {
      serviceSpy.getGenesysIsActive.and.returnValue(true);
      component.genesysClearStorage();
      expect(serviceSpy.getGenesysIsActive).toHaveBeenCalled();
      expect(serviceSpy.genesysRemoveLocalStorage).not.toHaveBeenCalled();
      expect(serviceSpy.setGenesysIsActive).not.toHaveBeenCalled();
    });
    it('when getGenesysIsActive fun return false', () => {
      serviceSpy.getGenesysIsActive.and.returnValue(false);
      component.genesysClearStorage();
      expect(serviceSpy.genesysRemoveLocalStorage).toHaveBeenCalled();
      expect(serviceSpy.setGenesysIsActive).toHaveBeenCalled();
    });
  });

  describe('captureDeepLinkEvent', () => {
    let eventTrackingEvent: EventTrackingEvent;
    let mockQueryParams: any;
    beforeEach(() => {
      captureDeepLinkEventSpy.and.callThrough();
      eventTrackingEvent = {
        eventName: 'CTAClick',
        passThruAttributes: [],
      };
    });
    it('should track the event when source and redirect_route is defined', () => {
      mockQueryParams = {
        source: 'email',
        redirect_route: 'home',
      };
      eventTrackingEvent.passThruAttributes = [
        {
          attributeName: 'subType',
          attributeValue: 'DeepLink',
        },
        {
          attributeName: 'source',
          attributeValue: mockQueryParams.source,
        },
        {
          attributeName: 'redirect_route',
          attributeValue: mockQueryParams.redirect_route,
        },
      ];
      component.captureDeepLinkEvent(mockQueryParams);
      expect(eventTrackingServiceSpy.eventTracking).toHaveBeenCalledWith(
        eventTrackingEvent
      );
    });
    it('should track the event when only source is defined', () => {
      mockQueryParams = {
        source: 'email',
      };
      eventTrackingEvent.passThruAttributes = [
        {
          attributeName: 'subType',
          attributeValue: 'DeepLink',
        },
        {
          attributeName: 'source',
          attributeValue: mockQueryParams.source,
        },
      ];
      component.captureDeepLinkEvent(mockQueryParams);
      expect(eventTrackingServiceSpy.eventTracking).toHaveBeenCalledWith(
        eventTrackingEvent
      );
    });
    it('should not track the event when source is undefined', () => {
      mockQueryParams = undefined;
      component.captureDeepLinkEvent(mockQueryParams);
      expect(eventTrackingServiceSpy.eventTracking).not.toHaveBeenCalled();
    });
  });

  describe('ngOnDestroy', () => {
    it('should unsubscribe from subscription', () => {
      component['subscription'] = jasmine.createSpyObj('subscription', [
        'unsubscribe',
      ]);
      component.ngOnDestroy();
      expect(component['subscription'].unsubscribe).toHaveBeenCalled();
    });
  });
  describe('trackHomeEvent', () => {
    it('should call eventTracking', () => {
      component['trackHomeEvent']();
      expect(eventTrackingServiceSpy.eventTracking).toHaveBeenCalledWith({
        eventName: component.eventContent.eventTrackingLogin.eventName,
      });
    });
  });
});

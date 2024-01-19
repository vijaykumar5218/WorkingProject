import {TestBed, waitForAsync} from '@angular/core/testing';
import {NavigationEnd, Router} from '@angular/router';
import {SharedUtilityService} from '@shared-lib/services/utility/utility.service';
import {of} from 'rxjs';
import {endPoints} from './constants/endpoints';
import {WebGoogleAnalyticsService} from './google.analytics.service';
import {AngularFireAnalytics} from '@angular/fire/compat/analytics';
import {GoogleAnalyticsService} from '@shared-lib/services/google-Analytics/google.analytics.service';

describe('WebGoogleAnalyticsService', () => {
  let service: WebGoogleAnalyticsService;
  let routerSpy;
  let googleAnalyticsServiceSpy;
  let utilityServiceSpy;
  const routeMockEvent = new NavigationEnd(0, '/login', '/login');
  let fireAnalyticsSpy;

  beforeEach(
    waitForAsync(() => {
      googleAnalyticsServiceSpy = jasmine.createSpyObj(
        'googleAnalyticsServiceSpy',
        [
          'getEventCategory',
          'getEventLabel',
          'getQualtricsUser',
          'getGAObjectForClickEvent',
        ]
      );
      fireAnalyticsSpy = jasmine.createSpyObj('fireAnalyticsSpy', [
        'logEvent',
        'setAnalyticsCollectionEnabled',
        'setUserProperties',
        'setCurrentScreen',
      ]);
      utilityServiceSpy = jasmine.createSpyObj('utilityServiceSpy ', [
        'appendBaseUrlToEndpoints',
      ]);
      routerSpy = {
        events: of(routeMockEvent),
      };
      TestBed.configureTestingModule({
        imports: [],
        providers: [
          WebGoogleAnalyticsService,
          {provide: Router, useValue: routerSpy},
          {provide: SharedUtilityService, useValue: utilityServiceSpy},
          {
            provide: GoogleAnalyticsService,
            useValue: googleAnalyticsServiceSpy,
          },
          {provide: AngularFireAnalytics, useValue: fireAnalyticsSpy},
        ],
      });
      service = TestBed.inject(WebGoogleAnalyticsService);
    })
  );

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('listenForEvents', () => {
    beforeEach(() => {
      spyOn(window, 'addEventListener').and.callFake((e, f) => {
        f(e);
      });
      spyOn(service, 'listenFunctionality');
    });

    it('Should call window.addEventListener & service.listenFunctionality', async () => {
      service.endPoints = endPoints;
      await service.listenForEvents();
      expect(window.addEventListener).toHaveBeenCalled();
      expect(utilityServiceSpy.appendBaseUrlToEndpoints).toHaveBeenCalled();
      expect(service.listenFunctionality).toHaveBeenCalled();
    });
  });

  describe('listenFunctionality', () => {
    let event;
    beforeEach(() => {
      event = {
        composedPath: jasmine.createSpy(),
      };
      spyOn(service, 'elementCategory');
      googleAnalyticsServiceSpy.getEventLabel.and.returnValue(
        Promise.resolve([
          '<gaAction: true><gaCategory: true><gaLabel: true><href: true><link: true><id: true><linkText: true><tabtext: true><innerText: true><text: true><name: true><altLabel: true><value: true><tileTitle: true><tileHref: true><currentTopic: true><data-index: true><aria-label: true>',
          'true',
          'true',
          'true',
        ])
      );
    });
    describe('When nodes.length > 0', () => {
      it('When nodes[0] has href property', async () => {
        googleAnalyticsServiceSpy.getEventCategory.and.returnValue([
          {nodeName: 'A', href: '/login'},
        ]);
        await service.listenFunctionality(event);
        expect(googleAnalyticsServiceSpy.getEventCategory).toHaveBeenCalled();
        expect(event.composedPath).toHaveBeenCalled();
        expect(googleAnalyticsServiceSpy.getEventLabel).toHaveBeenCalledWith([
          {nodeName: 'A', href: '/login'},
        ]);
        expect(service.elementCategory).toHaveBeenCalled();
      });
      it('When nodes[0] has not href property', async () => {
        googleAnalyticsServiceSpy.getEventCategory.and.returnValue([
          {nodeName: 'A'},
        ]);
        await service.listenFunctionality(event);
        expect(googleAnalyticsServiceSpy.getEventCategory).toHaveBeenCalled();
        expect(event.composedPath).toHaveBeenCalled();
        expect(googleAnalyticsServiceSpy.getEventLabel).toHaveBeenCalledWith([
          {nodeName: 'A'},
        ]);
        expect(service.elementCategory).toHaveBeenCalled();
      });
    });
    it('When nodes.length = 0', async () => {
      googleAnalyticsServiceSpy.getEventCategory.and.returnValue([]);
      await service.listenFunctionality(event);
      expect(googleAnalyticsServiceSpy.getEventCategory).toHaveBeenCalled();
      expect(event.composedPath).toHaveBeenCalled();
      expect(googleAnalyticsServiceSpy.getEventLabel).not.toHaveBeenCalled();
      expect(service.elementCategory).not.toHaveBeenCalled();
    });
  });

  describe('elementCategory', () => {
    const nodes = ['button.button-native'];
    let e;
    const eventDetail = '<place: BUTTON ION-BUTTON >';
    const eventLabelWithCustom = ['<id: book-apoint><text: Book Appointment>'];
    beforeEach(() => {
      e = {
        composedPath: jasmine.createSpy(),
      };
      fireAnalyticsSpy.logEvent.and.returnValue(Promise.resolve());
    });
    describe('when eventCategory is defined', () => {
      it('when eventLabel is defined', async () => {
        const mockGAObject = {
          eventCategory: 'BUTTON',
          eventAction: 'click',
          eventLabel: '<id: book-apoint><text: Book Appointment>',
          eventActionCustom: '',
          eventCategoryCustom: '',
          eventLabelCustom: '',
          eventDetail: '',
          sessionId: '',
          page_location: '/help/contact-a-coach',
        };
        googleAnalyticsServiceSpy.getGAObjectForClickEvent.and.returnValue(
          mockGAObject
        );
        await service.elementCategory(
          e,
          nodes,
          eventLabelWithCustom,
          eventDetail
        );
        expect(
          googleAnalyticsServiceSpy.getGAObjectForClickEvent
        ).toHaveBeenCalledWith(e, nodes, eventLabelWithCustom, eventDetail);
        expect(fireAnalyticsSpy.logEvent).toHaveBeenCalledWith(
          'action',
          mockGAObject
        );
      });
      it('when eventLabelCustom is defined', async () => {
        const mockGAObject = {
          eventCategory: 'BUTTON',
          eventAction: 'click',
          eventLabel: '',
          eventActionCustom: '',
          eventCategoryCustom: '',
          eventLabelCustom: '<id: book-apoint><text: Book Appointment>',
          eventDetail: '',
          sessionId: '',
          appId: 'MyVoyage',
          page_location: '/help/contact-a-coach',
        };
        googleAnalyticsServiceSpy.getGAObjectForClickEvent.and.returnValue(
          mockGAObject
        );
        await service.elementCategory(
          e,
          nodes,
          eventLabelWithCustom,
          eventDetail
        );
        expect(
          googleAnalyticsServiceSpy.getGAObjectForClickEvent
        ).toHaveBeenCalledWith(e, nodes, eventLabelWithCustom, eventDetail);
        expect(fireAnalyticsSpy.logEvent).toHaveBeenCalledWith(
          'action',
          mockGAObject
        );
      });
      it('when eventDetail is defined', async () => {
        const mockGAObject = {
          eventCategory: 'BUTTON',
          eventAction: 'click',
          eventLabel: '',
          eventActionCustom: '',
          eventCategoryCustom: '',
          eventLabelCustom: '',
          eventDetail: '<place: BUTTON ION-BUTTON >',
          sessionId: '',
          page_location: '/help/contact-a-coach',
        };
        googleAnalyticsServiceSpy.getGAObjectForClickEvent.and.returnValue(
          mockGAObject
        );
        await service.elementCategory(
          e,
          nodes,
          eventLabelWithCustom,
          eventDetail
        );
        expect(
          googleAnalyticsServiceSpy.getGAObjectForClickEvent
        ).toHaveBeenCalledWith(e, nodes, eventLabelWithCustom, eventDetail);
        expect(fireAnalyticsSpy.logEvent).toHaveBeenCalledWith(
          'action',
          mockGAObject
        );
      });
    });
    it('when eventCategory is undefined', async () => {
      const mockGAObject = {
        eventCategory: '',
        eventAction: 'click',
        eventLabel: '<id: book-apoint><text: Book Appointment>',
        eventActionCustom: '',
        eventCategoryCustom: '',
        eventLabelCustom: '',
        eventDetail: '',
        sessionId: '',
        page_location: '/help/contact-a-coach',
      };
      googleAnalyticsServiceSpy.getGAObjectForClickEvent.and.returnValue(
        mockGAObject
      );
      await service.elementCategory(
        e,
        nodes,
        eventLabelWithCustom,
        eventDetail
      );
      expect(
        googleAnalyticsServiceSpy.getGAObjectForClickEvent
      ).toHaveBeenCalledWith(e, nodes, eventLabelWithCustom, eventDetail);
      expect(fireAnalyticsSpy.logEvent).not.toHaveBeenCalled();
    });
  });

  describe('listenForNavigationEnd', () => {
    beforeEach(() => {
      spyOn(service, 'trackingFunctionality');
    });
    it('Should call trackingFunctionality', () => {
      service.listenForNavigationEnd();
      expect(
        fireAnalyticsSpy.setAnalyticsCollectionEnabled
      ).toHaveBeenCalledWith(true);
      expect(service.trackingFunctionality).toHaveBeenCalledWith(
        routeMockEvent
      );
    });
    it('Should not call trackingFunctionality', () => {
      routerSpy.events = of(null);
      service.listenForNavigationEnd();
      expect(service.trackingFunctionality).not.toHaveBeenCalled();
    });
  });

  describe('manageUserProperties', () => {
    beforeEach(() => {
      const store = {appId: 'MyVoyage'};
      const mockLocalStorage = {
        getItem: (key: string): string => {
          return key in store ? store[key] : 'MyVoyage';
        },
      };
      spyOn(localStorage, 'getItem').and.callFake(mockLocalStorage.getItem);
    });
    it('when currentPlan is undefined', () => {
      const mockQualtricsUserData: any = {
        clientDomain: 'testDomain',
        clientId: 'testClientId',
        clientName: 'testClientName',
        email: 'test@test.com',
        enableMyVoyage: 'Y',
        firstTimeLogin: true,
        mobile: '1112223333',
        partyId: '9999',
        appId: 'MyVoyage',
        planIdList: [
          {
            planId: '123',
            active: true,
            benefitsAdminSystem: 'aaa',
          },
        ],
      };
      const result = service.manageUserProperties(mockQualtricsUserData);
      expect(localStorage.getItem('appId')).toEqual('MyVoyage');
      expect(result).toEqual({
        userId: mockQualtricsUserData['partyId'],
        clientId: mockQualtricsUserData['clientId'],
        appId: 'MyVoyage',
      });
    });
    it('when partyId is undefined', () => {
      const mockQualtricsUserData: any = {
        clientDomain: 'testDomain',
        clientId: 'testClientId',
        appId: 'MyVoyage',
        clientName: 'testClientName',
        email: 'test@test.com',
        enableMyVoyage: 'Y',
        firstTimeLogin: true,
        mobile: '1112223333',
        planIdList: [
          {
            planId: '123',
            active: true,
            benefitsAdminSystem: 'aaa',
          },
        ],
      };
      const result = service.manageUserProperties(mockQualtricsUserData);
      expect(localStorage.getItem('appId')).toEqual('MyVoyage');
      expect(result).toEqual({
        clientId: mockQualtricsUserData['clientId'],
        appId: 'MyVoyage',
      });
    });
    it('when currentPlan, clientId and partyId are defined', () => {
      const mockQualtricsUserData: any = {
        clientDomain: 'testDomain',
        clientId: 'testClientId',
        appId: 'MyVoyage',
        clientName: 'testClientName',
        email: 'test@test.com',
        enableMyVoyage: 'Y',
        firstTimeLogin: true,
        mobile: '1112223333',
        partyId: '9999',
        planIdList: [
          {
            planId: '123',
            active: true,
            benefitsAdminSystem: 'aaa',
          },
        ],
        currentPlan: {
          planId: 'testPlanId',
          active: true,
          benefitsAdminSystem: '',
        },
      };
      const result = service.manageUserProperties(mockQualtricsUserData);
      expect(result).toEqual({
        userId: mockQualtricsUserData['partyId'],
        clientId: mockQualtricsUserData['clientId'],
        planId: mockQualtricsUserData['currentPlan']['planId'],
        appId: localStorage.getItem('appId'),
      });
    });
  });

  describe('trackingFunctionality', () => {
    beforeEach(() => {
      fireAnalyticsSpy.logEvent.and.returnValue(Promise.resolve({}));
      fireAnalyticsSpy.setCurrentScreen.and.returnValue(Promise.resolve({}));
      fireAnalyticsSpy.setUserProperties.and.returnValue(Promise.resolve({}));
      spyOn(service, 'manageUserProperties').and.returnValue({
        partyId: '9999',
        clientId: 'testClientId',
        appId: 'MyVoyage',
      });
    });
    describe('When partyId will be there', () => {
      const mockQualtricsUserData: any = {
        clientDomain: 'testDomain',
        clientId: 'testClientId',
        clientName: 'testClientName',
        email: 'test@test.com',
        enableMyVoyage: 'Y',
        firstTimeLogin: true,
        mobile: '1112223333',
        partyId: '9999',
        appId: 'MyVoyage',
        planIdList: [
          {
            planId: '123',
            active: true,
            benefitsAdminSystem: 'aaa',
          },
          {
            planId: '456',
            active: true,
            benefitsAdminSystem: 'aaa',
          },
        ],
      };
      beforeEach(() => {
        spyOn(service, 'getQualtricsUser').and.returnValue(
          Promise.resolve(mockQualtricsUserData)
        );
        const store = {appId: 'MyVoyage'};
        const mockLocalStorage = {
          getItem: (key: string): string => {
            return key in store ? store[key] : 'MyVoyage';
          },
        };
        spyOn(localStorage, 'getItem').and.callFake(mockLocalStorage.getItem);
      });
      it('When event.urlAfterRedirects would be defined', async () => {
        const event = {
          url: '/login',
          urlAfterRedirects: '/login',
        };
        await service.trackingFunctionality(event);
        expect(service.getQualtricsUser).toHaveBeenCalled();
        expect(service.manageUserProperties).toHaveBeenCalledWith(
          mockQualtricsUserData
        );
        expect(fireAnalyticsSpy.setUserProperties).toHaveBeenCalledWith({
          partyId: '9999',
          clientId: 'testClientId',
          appId: 'MyVoyage',
        });
        expect(fireAnalyticsSpy.logEvent).toHaveBeenCalledWith(
          'virtualPageView',
          {
            page_location: '/myVoyage/login',
            userId: '9999',
            appId: 'MyVoyage',
          }
        );
        expect(fireAnalyticsSpy.setCurrentScreen).toHaveBeenCalledWith(
          '/login'
        );
        expect(localStorage.getItem('appId')).toEqual('MyVoyage');
      });
      it('When event.urlAfterRedirects would be undefined', async () => {
        const event = {
          url: '/login',
        };
        await service.trackingFunctionality(event);
        expect(fireAnalyticsSpy.logEvent).toHaveBeenCalledWith(
          'virtualPageView',
          {
            page_location: '/myVoyage/login',
            userId: '9999',
            appId: 'MyVoyage',
          }
        );
        expect(fireAnalyticsSpy.setCurrentScreen).not.toHaveBeenCalled();
      });
      it('When event.url would be undefined', async () => {
        const event = {};
        await service.trackingFunctionality(event);
        expect(fireAnalyticsSpy.logEvent).not.toHaveBeenCalled();
        expect(fireAnalyticsSpy.setCurrentScreen).not.toHaveBeenCalled();
      });
    });
    it('When partyId will not be there', async () => {
      const mockQualtricsUserData: any = {
        clientDomain: 'testDomain',
        clientId: 'testClientId',
        clientName: 'testClientName',
        email: 'test@test.com',
        enableMyVoyage: 'Y',
        firstTimeLogin: true,
        mobile: '1112223333',
        partyId: undefined,
        appId: undefined,
        planIdList: [
          {
            planId: '123',
            active: true,
            benefitsAdminSystem: 'aaa',
          },
          {
            planId: '456',
            active: true,
            benefitsAdminSystem: 'aaa',
          },
        ],
      };
      spyOn(service, 'getQualtricsUser').and.returnValue(
        Promise.resolve(mockQualtricsUserData)
      );
      const event = {
        url: '/login',
        urlAfterRedirects: '/login',
      };
      await service.trackingFunctionality(event);
      expect(service.getQualtricsUser).toHaveBeenCalled();
      expect(service.manageUserProperties).toHaveBeenCalled();
      expect(fireAnalyticsSpy.setUserProperties).toHaveBeenCalled();
      expect(fireAnalyticsSpy.logEvent).toHaveBeenCalledWith(
        'virtualPageView',
        {
          page_location: '/myVoyage/login',
          userId: undefined,
          appId: localStorage.getItem('appId'),
        }
      );
      expect(fireAnalyticsSpy.setCurrentScreen).toHaveBeenCalled();
    });
  });

  describe('getQualtricsUser', () => {
    it('should call googleAnalyticsService.getQualtricsUser', async () => {
      const mockQualtricsUserData: any = {
        clientDomain: 'testDomain',
        clientId: 'testClientId',
        clientName: 'testClientName',
        email: 'test@test.com',
        enableMyVoyage: 'Y',
        firstTimeLogin: true,
        mobile: '1112223333',
        partyId: '9999',
        appId: 'MyVoyage',
        planIdList: [
          {
            planId: '123',
            active: true,
            benefitsAdminSystem: 'aaa',
          },
          {
            planId: '456',
            active: true,
            benefitsAdminSystem: 'aaa',
          },
        ],
      };
      googleAnalyticsServiceSpy.getQualtricsUser.and.returnValue(
        Promise.resolve(mockQualtricsUserData)
      );
      const result = await service.getQualtricsUser();
      expect(result).toEqual(mockQualtricsUserData);
      expect(googleAnalyticsServiceSpy.getQualtricsUser).toHaveBeenCalledWith(
        endPoints.qualtricsUserProps
      );
    });
  });
});

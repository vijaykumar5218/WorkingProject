import {TestBed, waitForAsync} from '@angular/core/testing';
import {NavigationEnd, Router} from '@angular/router';
import {BaseService} from '@shared-lib/services/base/base-factory-provider';
import {SharedUtilityService} from '@shared-lib/services/utility/utility.service';
import {of} from 'rxjs';
import {GoogleAnalyticsService} from './google.analytics.service';
import {endPoints} from '@shared-lib/services/qualtrics/constants/endpoints';

describe('GoogleAnalyticsService', () => {
  let service: GoogleAnalyticsService;
  let routerSpy;
  let utilityServiceSpy;
  let baseServiceSpy;
  const routeMockEvent = new NavigationEnd(0, '/login', '/login');

  beforeEach(
    waitForAsync(() => {
      utilityServiceSpy = jasmine.createSpyObj('utilityServiceSpy ', [
        'appendBaseUrlToEndpoints',
      ]);
      baseServiceSpy = jasmine.createSpyObj('BaseService', ['get']);
      routerSpy = {
        events: of(routeMockEvent),
      };
      TestBed.configureTestingModule({
        imports: [],
        providers: [
          GoogleAnalyticsService,
          {provide: Router, useValue: routerSpy},
          {provide: SharedUtilityService, useValue: utilityServiceSpy},
          {provide: BaseService, useValue: baseServiceSpy},
        ],
      });
      service = TestBed.inject(GoogleAnalyticsService);
    })
  );

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getEventCategory', () => {
    describe("When it's an ionic element", () => {
      it('When innerText would be undefined', () => {
        const path = [
          {
            nodeName: 'BUTTON',
            text: 'BUTTON',
            cloneNode: jasmine.createSpy().and.returnValue({text: 'button'}),
          },
          {
            nodeName: 'NAV',
            innerText: 'test data',
            cloneNode: jasmine.createSpy().and.returnValue({text: 'test data'}),
          },
        ];
        const output = service.getEventCategory(path);
        expect(output).toEqual([{text: 'test data'}, {text: 'test data'}]);
      });
      it('When innerText would be defined', () => {
        const path = [
          {
            nodeName: 'BUTTON',
            innerText: 'button',
            cloneNode: jasmine
              .createSpy()
              .and.returnValue({innerText: 'button'}),
          },
        ];
        const output = service.getEventCategory(path);
        expect(output).toEqual([{innerText: 'button'}]);
      });
    });
    it("When it's not an ionic element", () => {
      const path = [
        {
          nodeName: 'INPUT',
          innerText: 'input',
          cloneNode: jasmine.createSpy().and.returnValue({}),
        },
      ];
      const output = service.getEventCategory(path);
      expect(output).toEqual([]);
    });
  });

  it('getURL', () => {
    const output = service.getURL(
      'https://my3.intg.voya.com/voyasso/logon?domain=my3.intg.voya.com#login'
    );
    expect(output).toEqual('https://my3.intg.voya.com/voyasso/logon#login');
  });

  describe('getEventLabel', () => {
    it('When nodes[0] has only getAttribute and it return true', async () => {
      spyOn(service, 'nodeGetAttribute').and.returnValue(
        Promise.resolve(['<gaAction: true>', 'true', '', ''])
      );
      const nodes = [{getAttribute: jasmine.createSpy().and.returnValue(true)}];
      const output = await service.getEventLabel(nodes);
      expect(service.nodeGetAttribute).toHaveBeenCalled();
      expect(output).toEqual(['<gaAction: true>', 'true', '', '']);
    });
    it('When nodes[1] has id property', async () => {
      const nodes = [
        {img: '', getAttribute: jasmine.createSpy().and.returnValue(false)},
        {id: 'id2'},
      ];
      const output = await service.getEventLabel(nodes);
      expect(output).toEqual(['<id: id2>', '', '', '']);
    });
    it('When nodes[0] has gaAction prop', async () => {
      const nodes = [
        {
          gaAction: 'gaAction',
          getAttribute: jasmine.createSpy().and.returnValue(false),
        },
      ];
      spyOn(service, 'getGAOptions').and.returnValue(
        Promise.resolve(['true', '', '', '<gaAction: gaAction>'])
      );
      const output = await service.getEventLabel(nodes);
      expect(service.getGAOptions).toHaveBeenCalledWith('gaAction', nodes[0]);
      expect(output).toEqual(['<gaAction: gaAction>', 'true', '', '']);
    });
    it('When nodes[0] has href prop', async () => {
      const nodes = [
        {
          href:
            'https://my3.intg.voya.com/voyasso/logon?domain=my3.intg.voya.com#login',
          getAttribute: jasmine.createSpy().and.returnValue(false),
        },
      ];
      spyOn(service, 'getURL').and.returnValue(
        'https://my3.intg.voya.com/voyasso/logon#login'
      );
      const output = await service.getEventLabel(nodes);
      expect(output).toEqual([
        '<href: https://my3.intg.voya.com/voyasso/logon#login>',
        '',
        '',
        '',
      ]);
      expect(service.getURL).toHaveBeenCalledWith(nodes[0].href);
    });
    it('When nodes[0] has innerText prop', async () => {
      const nodes = [
        {
          innerText: 'innerText',
          getAttribute: jasmine.createSpy().and.returnValue(false),
        },
      ];
      spyOn(service, 'getEventLabelFromNode').and.returnValue(
        Promise.resolve('Test data')
      );
      const output = await service.getEventLabel(nodes);
      expect(service.getEventLabelFromNode).toHaveBeenCalledWith(
        nodes,
        nodes[0],
        'innerText'
      );
      expect(output).toEqual(['Test data', '', '', '']);
    });
    it('When nodes[0] has input prop', async () => {
      const nodes = [
        {input: '', getAttribute: jasmine.createSpy().and.returnValue(false)},
      ];
      const output = await service.getEventLabel(nodes);
      expect(output).toEqual(['', '', '', '']);
    });
  });

  describe('getGAOptions', () => {
    let nodeSpy;
    beforeEach(() => {
      nodeSpy = {
        getAttribute: jasmine.createSpy().and.returnValue(true),
      };
    });
    it('when prop would be gaAction', async () => {
      nodeSpy['gaAction'] = 'gaAction';
      const output = await service.getGAOptions('gaAction', nodeSpy);
      expect(output).toEqual(['true', '', '', '<gaAction: gaAction>']);
      expect(nodeSpy.getAttribute).toHaveBeenCalledWith('gaAction');
    });
    it('when prop would be gaCategory', async () => {
      nodeSpy['gaCategory'] = 'gaCategory';
      const output = await service.getGAOptions('gaCategory', nodeSpy);
      expect(output).toEqual(['', 'true', '', '<gaCategory: gaCategory>']);
      expect(nodeSpy.getAttribute).toHaveBeenCalledWith('gaCategory');
    });
    it('when prop would be gaLabel', async () => {
      nodeSpy['gaLabel'] = 'gaLabel';
      const output = await service.getGAOptions('gaLabel', nodeSpy);
      expect(output).toEqual(['', '', 'true', '<gaLabel: gaLabel>']);
      expect(nodeSpy.getAttribute).toHaveBeenCalledWith('gaLabel');
    });
    it('when prop would be unknow element', async () => {
      nodeSpy['BUTTON'] = 'BUTTON';
      const output = await service.getGAOptions('BUTTON', nodeSpy);
      expect(output).toEqual(['', '', '', '<BUTTON: BUTTON>']);
      expect(nodeSpy.getAttribute).not.toHaveBeenCalled();
    });
  });

  describe('getEventLabelFromNode', () => {
    it('should return the text from the first node if its not empty', async () => {
      const result = await service.getEventLabelFromNode(
        [],
        {eventLabel: 'abcdefghijklmnopqrstuvwxyz'},
        'eventLabel'
      );
      expect(result).toEqual('<eventLabel: abcdefghijklmnopqrst>');
    });

    it('should return the text from the second node if its not empty', async () => {
      const result = await service.getEventLabelFromNode(
        [{}, {eventLabel: 'abcdefghijklmnopqrstuvwxyz'}],
        {eventLabel: '  '},
        'eventLabel'
      );
      expect(result).toEqual('<eventLabel: abcdefghijklmnopqrst>');
    });
  });

  describe('nodeGetAttribute', () => {
    let nodeSpy;
    beforeEach(() => {
      nodeSpy = {
        getAttribute: jasmine.createSpy().and.returnValue(true),
      };
    });
    it('when prop would be gaAction', async () => {
      nodeSpy['gaAction'] = 'gaAction';
      const output = await service.nodeGetAttribute('gaAction', nodeSpy);
      expect(output).toEqual(['<gaAction: true>', 'true', '', '']);
      expect(nodeSpy.getAttribute).toHaveBeenCalledWith('gaAction');
    });
    it('when prop would be gaCategory', async () => {
      nodeSpy['gaCategory'] = 'gaCategory';
      const output = await service.nodeGetAttribute('gaCategory', nodeSpy);
      expect(output).toEqual(['<gaCategory: true>', '', 'true', '']);
      expect(nodeSpy.getAttribute).toHaveBeenCalledWith('gaCategory');
    });
    it('when prop would be gaLabel', async () => {
      nodeSpy['gaLabel'] = 'gaLabel';
      const output = await service.nodeGetAttribute('gaLabel', nodeSpy);
      expect(output).toEqual(['<gaLabel: true>', '', '', 'true']);
      expect(nodeSpy.getAttribute).toHaveBeenCalledWith('gaLabel');
    });
    it('when prop would be unknow element', async () => {
      nodeSpy['BUTTON'] = 'BUTTON';
      const output = await service.nodeGetAttribute('BUTTON', nodeSpy);
      expect(output).toEqual(['<BUTTON: true>', '', '', '']);
      expect(nodeSpy.getAttribute).toHaveBeenCalledWith('BUTTON');
    });
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
    let analyticsSpy;
    beforeEach(() => {
      event = {
        composedPath: jasmine.createSpy(),
      };
      spyOn(service, 'elementCategory');
      spyOn(service, 'getEventLabel').and.returnValue(
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
        spyOn(service, 'getEventCategory').and.returnValue([
          {nodeName: 'A', href: '/login'},
        ]);
        await service.listenFunctionality(event, analyticsSpy);
        expect(service.getEventCategory).toHaveBeenCalled();
        expect(event.composedPath).toHaveBeenCalled();
        expect(service.getEventLabel).toHaveBeenCalledWith([
          {nodeName: 'A', href: '/login'},
        ]);
        expect(service.elementCategory).toHaveBeenCalled();
      });
      it('When nodes[0] has not href property', async () => {
        spyOn(service, 'getEventCategory').and.returnValue([{nodeName: 'A'}]);
        await service.listenFunctionality(event, analyticsSpy);
        expect(service.getEventCategory).toHaveBeenCalled();
        expect(event.composedPath).toHaveBeenCalled();
        expect(service.getEventLabel).toHaveBeenCalledWith([{nodeName: 'A'}]);
        expect(service.elementCategory).toHaveBeenCalled();
      });
    });
    it('When nodes.length = 0', async () => {
      spyOn(service, 'getEventCategory').and.returnValue([]);
      await service.listenFunctionality(event, analyticsSpy);
      expect(service.getEventCategory).toHaveBeenCalled();
      expect(event.composedPath).toHaveBeenCalled();
      expect(service.getEventLabel).not.toHaveBeenCalled();
      expect(service.elementCategory).not.toHaveBeenCalled();
    });
  });

  describe('firebaseAnalyticsTracking', () => {
    let analyticsSpy;
    beforeEach(() => {
      analyticsSpy = {
        setCollectionEnabled: jasmine.createSpy(),
      };
      spyOn(service, 'trackingFunctionality');
    });
    it('Should call trackingFunctionality', () => {
      service.firebaseAnalyticsTracking(analyticsSpy);
      expect(analyticsSpy.setCollectionEnabled).toHaveBeenCalledWith({
        enabled: true,
      });
      expect(service.trackingFunctionality).toHaveBeenCalledWith(
        routeMockEvent,
        analyticsSpy
      );
    });
    it('Should not call trackingFunctionality', () => {
      routerSpy.events = of(null);
      service.firebaseAnalyticsTracking(analyticsSpy);
      expect(service.trackingFunctionality).not.toHaveBeenCalled();
    });
    it('Should not call trackingFunctionality if landing', () => {
      routerSpy.events = of(new NavigationEnd(0, '/landing', '/landing'));
      service.firebaseAnalyticsTracking(analyticsSpy);
      expect(service.trackingFunctionality).not.toHaveBeenCalled();
    });

    it('Should not call trackingFunctionality if secure-sign-out', () => {
      routerSpy.events = of(
        new NavigationEnd(0, '/secure-sign-out', '/secure-sign-out')
      );
      service.firebaseAnalyticsTracking(analyticsSpy);
      expect(service.trackingFunctionality).not.toHaveBeenCalled();
    });
  });

  describe('trackingFunctionality', () => {
    let analyticsSpy;
    beforeEach(() => {
      analyticsSpy = {
        logEvent: jasmine.createSpy().and.returnValue(Promise.resolve({})),
        setScreenName: jasmine.createSpy().and.returnValue(Promise.resolve({})),
        setUserProperty: jasmine
          .createSpy()
          .and.returnValue(Promise.resolve({})),
      };
    });
    describe('When partyId will be there', () => {
      beforeEach(() => {
        spyOn(service, 'getQualtricsUser').and.returnValue(
          Promise.resolve({
            clientDomain: 'testDomain',
            clientId: 'testClientId',
            clientName: 'testClientName',
            email: 'test@test.com',
            myVoyageEnabled: true,
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
            currentPlan: {
              planId: '123',
              active: true,
              benefitsAdminSystem: 'aaa',
            },
          })
        );
      });
      it('When event.urlAfterRedirects would be defined', async () => {
        const event = {
          url: '/login',
          urlAfterRedirects: '/login',
        };
        await service.trackingFunctionality(event, analyticsSpy);
        expect(service.getQualtricsUser).toHaveBeenCalled();
        expect(analyticsSpy.setUserProperty).toHaveBeenCalledWith({
          name: 'userId',
          value: '9999',
        });
        expect(analyticsSpy.setUserProperty).toHaveBeenCalledWith({
          name: 'appId',
          value: localStorage.getItem('appId'),
        });
        expect(analyticsSpy.setUserProperty).toHaveBeenCalledWith({
          name: 'clientId',
          value: 'testClientId',
        });
        expect(analyticsSpy.setUserProperty).toHaveBeenCalledWith({
          name: 'planId',
          value: '123',
        });
        expect(analyticsSpy.logEvent).toHaveBeenCalledWith({
          name: 'virtualPageView',
          params: {
            page_location: '/myVoyage/login',
            userId: '9999',
          },
        });
        expect(analyticsSpy.setScreenName).toHaveBeenCalledWith({
          screenName: '/login',
        });
      });
      it('When event.urlAfterRedirects would be undefined', async () => {
        const event = {
          url: '/login',
        };
        await service.trackingFunctionality(event, analyticsSpy);
        expect(analyticsSpy.logEvent).toHaveBeenCalledWith({
          name: 'virtualPageView',
          params: {
            page_location: '/myVoyage/login',
            userId: '9999',
          },
        });
        expect(analyticsSpy.setScreenName).not.toHaveBeenCalled();
      });
      it('When event.url would be undined', async () => {
        const event = {};
        await service.trackingFunctionality(event, analyticsSpy);
        expect(analyticsSpy.logEvent).not.toHaveBeenCalled();
        expect(analyticsSpy.setScreenName).not.toHaveBeenCalled();
      });
    });

    it('When partyId will not be there', async () => {
      spyOn(service, 'getQualtricsUser').and.returnValue(
        Promise.resolve({
          clientDomain: 'testDomain',
          clientId: 'testClientId',
          clientName: 'testClientName',
          email: 'test@test.com',
          myVoyageEnabled: true,
          enableMyVoyage: 'Y',
          firstTimeLogin: true,
          mobile: '1112223333',
          partyId: undefined,
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
          currentPlan: undefined,
        })
      );
      const event = {
        url: '/login',
        urlAfterRedirects: '/login',
      };
      await service.trackingFunctionality(event, analyticsSpy);
      expect(service.getQualtricsUser).toHaveBeenCalled();
      expect(analyticsSpy.setUserProperty).toHaveBeenCalledTimes(2);
      expect(analyticsSpy.logEvent).toHaveBeenCalledWith({
        name: 'virtualPageView',
        params: {
          page_location: '/myVoyage/login',
          userId: undefined,
        },
      });
      expect(analyticsSpy.setScreenName).toHaveBeenCalled();
    });
  });

  describe('elementCategory', () => {
    const nodes = ['button.button-native'];
    let e;
    const eventDetail = '<place: BUTTON ION-BUTTON >';
    const eventLabelWithCustom = ['<id: book-apoint><text: Book Appointment>'];
    let analyticsSpy;
    beforeEach(() => {
      e = {
        composedPath: jasmine.createSpy(),
      };
      analyticsSpy = jasmine.createSpyObj('analytics', ['logEvent']);
      analyticsSpy.logEvent.and.returnValue(Promise.resolve());
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
        spyOn(service, 'getGAObjectForClickEvent').and.returnValue(
          mockGAObject
        );
        await service.elementCategory(
          e,
          nodes,
          eventLabelWithCustom,
          eventDetail,
          analyticsSpy
        );
        expect(service.getGAObjectForClickEvent).toHaveBeenCalledWith(
          e,
          nodes,
          eventLabelWithCustom,
          eventDetail
        );
        expect(analyticsSpy.logEvent).toHaveBeenCalledWith({
          name: 'action',
          params: mockGAObject,
        });
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
          page_location: '/help/contact-a-coach',
        };
        spyOn(service, 'getGAObjectForClickEvent').and.returnValue(
          mockGAObject
        );
        await service.elementCategory(
          e,
          nodes,
          eventLabelWithCustom,
          eventDetail,
          analyticsSpy
        );
        expect(service.getGAObjectForClickEvent).toHaveBeenCalledWith(
          e,
          nodes,
          eventLabelWithCustom,
          eventDetail
        );
        expect(analyticsSpy.logEvent).toHaveBeenCalledWith({
          name: 'action',
          params: mockGAObject,
        });
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
        spyOn(service, 'getGAObjectForClickEvent').and.returnValue(
          mockGAObject
        );
        await service.elementCategory(
          e,
          nodes,
          eventLabelWithCustom,
          eventDetail,
          analyticsSpy
        );
        expect(service.getGAObjectForClickEvent).toHaveBeenCalledWith(
          e,
          nodes,
          eventLabelWithCustom,
          eventDetail
        );
        expect(analyticsSpy.logEvent).toHaveBeenCalledWith({
          name: 'action',
          params: mockGAObject,
        });
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
      spyOn(service, 'getGAObjectForClickEvent').and.returnValue(mockGAObject);
      await service.elementCategory(
        e,
        nodes,
        eventLabelWithCustom,
        eventDetail,
        analyticsSpy
      );
      expect(service.getGAObjectForClickEvent).toHaveBeenCalledWith(
        e,
        nodes,
        eventLabelWithCustom,
        eventDetail
      );
      expect(analyticsSpy.logEvent).not.toHaveBeenCalled();
    });
  });

  describe('getGAObjectForClickEvent', () => {
    let w;
    beforeEach(() => {
      w = {
        location: {
          pathname: '/login',
        },
      };
    });
    describe("When e.target.tagName === 'IMG'", () => {
      const nodes = [{nodeName: 'IMG'}];
      it('When parentElement would be defined', () => {
        const e = {
          target: {
            parentElement: {
              innerText: 'Test innerText',
              tagName: 'IMG',
            },
            tagName: 'IMG',
          },
        };
        const eventLabelWithCustom = [
          'element',
          'gaAction',
          'gaCategory',
          'gaLabel',
        ];
        const gaObject = service.getGAObjectForClickEvent(
          e,
          nodes,
          eventLabelWithCustom,
          '',
          w
        );
        expect(gaObject).toEqual({
          eventCategory: 'IMG',
          eventAction: 'click',
          eventLabel: 'Test innerText',
          eventActionCustom: 'gaAction',
          eventCategoryCustom: 'gaCategory',
          eventLabelCustom: 'gaLabel',
          eventDetail: '<place: IMG>',
          sessionId: '',
          page_location: '/myVoyage/login',
        });
      });
      it('When parentElement would be undefined', () => {
        const eventLabelWithCustom = ['element', 'gaAction', 'gaCategory', ''];
        const e = {
          target: {
            tagName: 'IMG',
          },
        };
        const gaObject = service.getGAObjectForClickEvent(
          e,
          nodes,
          eventLabelWithCustom,
          '',
          w
        );
        expect(gaObject).toEqual({
          eventCategory: undefined,
          eventAction: 'click',
          eventLabel: undefined,
          eventActionCustom: 'gaAction',
          eventCategoryCustom: 'gaCategory',
          eventLabelCustom: '',
          eventDetail: '<place: undefined>',
          sessionId: '',
          page_location: '/myVoyage/login',
        });
      });
    });
    describe("When eventLabel.includes('elementBtn')", () => {
      const nodes = [{nodeName: 'NAV'}];
      it('When parentElement would be defined', () => {
        const eventLabelWithCustom = [
          'elementBtn elementBtn0 elementBtn1',
          'gaAction',
          'gaCategory',
          'gaLabel',
        ];
        const e = {
          target: {
            parentElement: {
              parentElement: {
                parentElement: {
                  getElementsByClassName: jasmine.createSpy(),
                },
              },
            },
          },
        };
        e.target.parentElement.parentElement.parentElement.getElementsByClassName.and.returnValue(
          [{innerHTML: 'Test innerHTML'}]
        );
        const gaObject = service.getGAObjectForClickEvent(
          e,
          nodes,
          eventLabelWithCustom,
          '',
          w
        );
        expect(gaObject).toEqual({
          eventCategory: 'NAV',
          eventAction: 'click',
          eventLabel: 'elementBtn Test innerHTML Test innerHTML',
          eventActionCustom: 'gaAction',
          eventCategoryCustom: 'gaCategory',
          eventLabelCustom: 'gaLabel',
          eventDetail: '<place: >',
          sessionId: '',
          page_location: '/myVoyage/login',
        });
      });
      it('When parentElement would be undefined', () => {
        const eventLabelWithCustom = [
          'elementBtn elementBtn0 elementBtn1',
          'gaAction',
          'gaCategory',
          '',
        ];
        const e = {
          target: {},
        };
        const gaObject = service.getGAObjectForClickEvent(
          e,
          nodes,
          eventLabelWithCustom,
          '',
          w
        );
        expect(gaObject).toEqual({
          eventCategory: 'NAV',
          eventAction: 'click',
          eventLabel: 'elementBtn undefined undefined',
          eventActionCustom: 'gaAction',
          eventCategoryCustom: 'gaCategory',
          eventLabelCustom: '',
          eventDetail: '<place: >',
          sessionId: '',
          page_location: '/myVoyage/login',
        });
      });
    });
  });

  describe('getQualtricsUser', () => {
    let gaContent;
    beforeEach(() => {
      gaContent = {
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
    });

    it('should call baseService.get and return the parsed content the first time', async () => {
      baseServiceSpy.get.and.returnValue(Promise.resolve(gaContent));
      const result = await service.getQualtricsUser();
      expect(baseServiceSpy.get).toHaveBeenCalledWith(
        'myvoyage/ws/ers/service/myvoyageenabled/qualtrics'
      );
      expect(result).toEqual(gaContent);
    });

    it('should not call baseService.get and return the QualtricsUserContent content', async () => {
      baseServiceSpy.get.and.returnValue(Promise.resolve(gaContent));
      service.QualtricsUserContent = gaContent;
      const result = await service.getQualtricsUser();
      expect(baseServiceSpy.get).not.toHaveBeenCalledWith(
        'myvoyage/ws/ers/service/myvoyageenabled/qualtrics'
      );
      expect(result).toEqual(gaContent);
    });

    it('should not call baseService.get and return the null', async () => {
      baseServiceSpy.get.and.callFake(() => Promise.reject());
      service.QualtricsUserContent = null;
      const result = await service.getQualtricsUser();
      expect(baseServiceSpy.get).toHaveBeenCalledWith(
        'myvoyage/ws/ers/service/myvoyageenabled/qualtrics'
      );
      expect(result).toEqual(null);
    });

    it('when we passed the endpointURL as param', async () => {
      baseServiceSpy.get.and.returnValue(Promise.resolve(gaContent));
      const result = await service.getQualtricsUser(
        'myvoyage/ws/ers/service/myvoyageenabled/qualtrics'
      );
      expect(baseServiceSpy.get).toHaveBeenCalledWith(
        'myvoyage/ws/ers/service/myvoyageenabled/qualtrics'
      );
      expect(result).toEqual(gaContent);
    });

    it('should return cached content when called twice', async () => {
      baseServiceSpy.get.and.returnValue(Promise.resolve(gaContent));
      const result = await service.getQualtricsUser();
      expect(baseServiceSpy.get).toHaveBeenCalledTimes(1);
      expect(result).toEqual(gaContent);
    });
  });
});

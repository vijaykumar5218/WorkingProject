import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {Router} from '@angular/router';
import {IonicModule} from '@ionic/angular';
import {EventManagerService} from '@shared-lib/modules/event-manager/event-manager/event-manager.service';
import {BenefitsService} from '@shared-lib/services/benefits/benefits.service';
import {SmartBannerService} from '@shared-lib/services/smart-banner/smart-banner.service';
import {of, Subscription} from 'rxjs';
import {SmartBannerComponent} from './smart-banner.component';

describe('SmartBannerComponent', () => {
  let component: SmartBannerComponent;
  let fixture: ComponentFixture<SmartBannerComponent>;
  let smartBannerServiceSpy;
  let smartbannerOptions;
  let benefitsServiceSpy;
  let eventManagerSpy;
  let smartBannerDisplayedSpy;
  let routerSpy;
  let smartBannerDismissedSpy;
  let publishSmartBannerTopSpy;
  let publisherSpy;

  beforeEach(
    waitForAsync(() => {
      smartBannerServiceSpy = jasmine.createSpyObj('SmartBannerService', [
        'getSmartBannerOptions',
      ]);
      benefitsServiceSpy = jasmine.createSpyObj('BenefitsService', [
        'getSmartBannerEnableConditions',
        'setSmartBannerEnableConditions',
      ]);
      benefitsServiceSpy.getSmartBannerEnableConditions.and.returnValue(
        of({
          isSmartBannerHidden: false,
          isSmartBannerDismissed: false,
        })
      );
      eventManagerSpy = jasmine.createSpyObj('EventManagerService', [
        'createPublisher',
      ]);
      publisherSpy = jasmine.createSpyObj('Publisher', ['publish']);
      eventManagerSpy.createPublisher.and.returnValue(publisherSpy);
      routerSpy = {
        events: {
          pipe: jasmine.createSpy().and.returnValue(
            of({
              id: 1,
              url: '/home',
            })
          ),
        },
      };
      TestBed.configureTestingModule({
        declarations: [SmartBannerComponent],
        imports: [IonicModule.forRoot()],
        providers: [
          {provide: SmartBannerService, useValue: smartBannerServiceSpy},
          {provide: BenefitsService, useValue: benefitsServiceSpy},
          {provide: EventManagerService, useValue: eventManagerSpy},
          {provide: Router, useValue: routerSpy},
        ],
      }).compileComponents();

      fixture = TestBed.createComponent(SmartBannerComponent);
      component = fixture.componentInstance;
      component['subscription'] = jasmine.createSpyObj('Subscription', [
        'unsubscribe',
        'add',
      ]);
      smartbannerOptions = {
        title: 'MyVoyage',
        author: 'Voya Services Company',
        icon: 'voyassoui/static/public/images/myvoyage-icon.png',
        'button-url-apple':
          'https://apps.apple.com/us/app/myvoyage/id1594192157',
        'button-url-google':
          'https://play.google.com/store/apps/details?id=com.voya.edt.myvoyage',
      };
      smartBannerServiceSpy.getSmartBannerOptions.and.returnValue(
        Promise.resolve(smartbannerOptions)
      );
      fixture.detectChanges();
      smartBannerDisplayedSpy = spyOn(component, 'smartBannerDisplayed');
      smartBannerDismissedSpy = spyOn(component, 'smartBannerDismissed');
      publishSmartBannerTopSpy = spyOn(component, 'publishSmartBannerTop');
      component.vSmartbanner = {
        nativeElement: jasmine.createSpyObj('nativeElement', [
          'createMetaTags',
          'hide',
          'show',
        ]),
      };
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    beforeEach(() => {
      spyOn(component, 'routerNavigation');
      spyOn(component, 'getSmartBannerEnableConditions');
      spyOn(component, 'listenSmartBannerDismissed');
      spyOn(component, 'listenSmartBannerDisplayed');
    });

    it('should call listenSmartBannerDisplayed', () => {
      component.ngOnInit();
      expect(component.listenSmartBannerDisplayed).toHaveBeenCalled();
    });

    it('should call listenSmartBannerDismissed', () => {
      component.ngOnInit();
      expect(component.listenSmartBannerDismissed).toHaveBeenCalled();
    });

    it('should call routerNavigation', () => {
      component.ngOnInit();
      expect(component.routerNavigation).toHaveBeenCalled();
    });

    it('should call getSmartBannerEnableConditions', () => {
      component.ngOnInit();
      expect(component.getSmartBannerEnableConditions).toHaveBeenCalled();
    });
  });

  describe('ngAfterViewInit', () => {
    let setSmartBannerOptionsSpy;
    beforeEach(() => {
      setSmartBannerOptionsSpy = spyOn(component, 'setSmartBannerOptions');
    });
    it('should call setSmartBannerOptions if isSmartBannerHidden and isSmartBannerDismissed is false', () => {
      component['smartBannerEnableConditions'] = {
        isSmartBannerDismissed: false,
        isSmartBannerHidden: false,
      };
      component['currentUrl'] = '/home';
      component.ngAfterViewInit();
      expect(setSmartBannerOptionsSpy).toHaveBeenCalled();
    });
    it('should call setSmartBannerOptions if smartBannerEnableConditions is undefined', () => {
      component['smartBannerEnableConditions'] = undefined;
      component['currentUrl'] = '/workplace-dashboard';
      component.ngAfterViewInit();
      expect(setSmartBannerOptionsSpy).toHaveBeenCalled();
    });
    it('should not call setSmartBannerOptions if isSmartBannerDismissed is true', () => {
      component['smartBannerEnableConditions'] = {
        isSmartBannerDismissed: true,
        isSmartBannerHidden: false,
      };
      component['currentUrl'] = '/workplace-dashboard';
      component.ngAfterViewInit();
      expect(setSmartBannerOptionsSpy).not.toHaveBeenCalled();
    });
    it('should not call setSmartBannerOptions if currentUrl is not /home or /workplace-dashboard', () => {
      component['smartBannerEnableConditions'] = {
        isSmartBannerDismissed: false,
        isSmartBannerHidden: false,
      };
      component['currentUrl'] = '/accounts';
      component.ngAfterViewInit();
      expect(setSmartBannerOptionsSpy).not.toHaveBeenCalled();
    });
  });

  describe('listenSmartBannerDisplayed', () => {
    let addEventListenerDisplaySpy;
    beforeEach(() => {
      addEventListenerDisplaySpy = spyOn(window, 'addEventListener');
      addEventListenerDisplaySpy.and.callFake((e, f) => {
        expect(e).toEqual('smartbanner:displayed');
        f();
      });
    });
    it('should call smartBannerDisplayed', () => {
      component.listenSmartBannerDisplayed();
      expect(window.addEventListener).toHaveBeenCalled();
      expect(smartBannerDisplayedSpy).toHaveBeenCalled();
    });
  });

  describe('listenSmartBannerDismissed', () => {
    let addEventListenerSpy;
    beforeEach(() => {
      addEventListenerSpy = spyOn(window, 'addEventListener');
      addEventListenerSpy.and.callFake((e, f) => {
        expect(e).toEqual('smartbanner:dismissed');
        f();
      });
    });
    it('should call setSmartBannerEnableConditions if smartBannerEnableConditions is false and currentRouteUrl is home or workplace-dashboard and call smartBannerDismissed', () => {
      component.smartBannerEnableConditions = undefined;
      component.currentUrl = '/home';
      component.listenSmartBannerDismissed();
      expect(window.addEventListener).toHaveBeenCalled();
      expect(
        benefitsServiceSpy.setSmartBannerEnableConditions
      ).toHaveBeenCalledWith({isSmartBannerDismissed: true});
      expect(smartBannerDismissedSpy).toHaveBeenCalled();
    });

    it('should call setSmartBannerEnableConditions if smartBannerEnableConditions is false and currentRouteUrl is home or workplace-dashboard and call smartBannerDismissed', () => {
      component.smartBannerEnableConditions = {
        isSmartBannerHidden: false,
        isSmartBannerDismissed: false,
      };
      component.currentUrl = '/home';
      component.listenSmartBannerDismissed();
      expect(window.addEventListener).toHaveBeenCalled();
      expect(
        benefitsServiceSpy.setSmartBannerEnableConditions
      ).toHaveBeenCalledWith({isSmartBannerDismissed: true});
      expect(smartBannerDismissedSpy).toHaveBeenCalled();
    });

    it('should not call setSmartBannerEnableConditions if smartBannerEnableConditions is true and currentRouteUrl is home or workplace-dashboard', () => {
      component.smartBannerEnableConditions = {
        isSmartBannerHidden: true,
        isSmartBannerDismissed: false,
      };
      component.currentUrl = '/home';
      component.listenSmartBannerDismissed();
      expect(window.addEventListener).toHaveBeenCalled();
      expect(
        benefitsServiceSpy.setSmartBannerEnableConditions
      ).not.toHaveBeenCalledWith({isSmartBannerDismissed: true});
      expect(smartBannerDismissedSpy).toHaveBeenCalled();
    });

    it('should not call setSmartBannerEnableConditions if smartBannerEnableConditions is false and currentRouteUrl is not home or workplace-dashboard', () => {
      component.smartBannerEnableConditions = {
        isSmartBannerHidden: false,
        isSmartBannerDismissed: false,
      };
      component.currentUrl = '/journeys';
      component.listenSmartBannerDismissed();
      expect(window.addEventListener).toHaveBeenCalled();
      expect(
        benefitsServiceSpy.setSmartBannerEnableConditions
      ).not.toHaveBeenCalledWith({isSmartBannerDismissed: true});
      expect(smartBannerDismissedSpy).toHaveBeenCalled();
    });
  });

  describe('routerNavigation', () => {
    let subscriptionMock;
    beforeEach(() => {
      subscriptionMock = new Subscription();
    });
    it('should call setSmartBannerEnableConditions when event url is not equal to home and workplace-dashboard', () => {
      const mockData = {
        id: 1,
        url: '/coverages/view-plans/1/claim',
      };
      const observable = of(mockData);
      spyOn(observable, 'subscribe').and.callFake(f => {
        f(mockData);
        return subscriptionMock;
      });
      routerSpy.events.pipe.and.returnValue(observable);
      component.routerNavigation();
      expect(
        benefitsServiceSpy.setSmartBannerEnableConditions
      ).toHaveBeenCalledWith({isSmartBannerHidden: true});
      expect(component.subscription.add).toHaveBeenCalledWith(subscriptionMock);
    });
    it('should call setSmartBannerEnableConditions when event url is equal to home and workplace-dashboard', () => {
      const mockData = {
        id: 1,
        url: '/home',
      };
      const observable = of(mockData);
      spyOn(observable, 'subscribe').and.callFake(f => {
        f(mockData);
        return subscriptionMock;
      });
      routerSpy.events.pipe.and.returnValue(observable);
      component.routerNavigation();
      expect(
        benefitsServiceSpy.setSmartBannerEnableConditions
      ).toHaveBeenCalledWith({isSmartBannerHidden: false});
    });
  });

  describe('getSmartBannerEnableConditions', () => {
    let setSmartBannerOptionsSpy;
    let smartBannerubscriptionMock;
    let smartBannerubscriptionMockElse;
    beforeEach(() => {
      setSmartBannerOptionsSpy = spyOn(component, 'setSmartBannerOptions');
      smartBannerubscriptionMock = new Subscription();
      smartBannerubscriptionMockElse = new Subscription();
    });

    it('should set the smartBannerEnableConditions and hide smartbanner when smartbannerDismissed or smartbannerHidden is true', () => {
      const mockData = {
        isSmartBannerHidden: true,
        isSmartBannerDismissed: false,
      };
      const observable = of(mockData);
      spyOn(observable, 'subscribe').and.callFake(f => {
        f(mockData);
        return smartBannerubscriptionMock;
      });
      benefitsServiceSpy.getSmartBannerEnableConditions.and.returnValue(
        observable
      );
      component.smartBannerEnableConditions = mockData;
      component.getSmartBannerEnableConditions();
      expect(
        benefitsServiceSpy.getSmartBannerEnableConditions
      ).toHaveBeenCalled();
      expect(component.subscription.add).toHaveBeenCalledWith(
        smartBannerubscriptionMock
      );
      expect(component.vSmartbanner.nativeElement.hide).toHaveBeenCalled();
      expect(smartBannerDismissedSpy).toHaveBeenCalled();
    });

    it('should set the smartBannerEnableConditions and show smartbanner when smartbannerDismissed and smartbannerHidden is false', () => {
      const mockElseData = {
        isSmartBannerHidden: false,
        isSmartBannerDismissed: false,
      };
      const observableElse = of(mockElseData);
      spyOn(observableElse, 'subscribe').and.callFake(f => {
        f(mockElseData);
        return smartBannerubscriptionMockElse;
      });
      benefitsServiceSpy.getSmartBannerEnableConditions.and.returnValue(
        observableElse
      );
      component.smartBannerEnableConditions = mockElseData;
      component.currentUrl = '/home';
      component.getSmartBannerEnableConditions();
      expect(
        benefitsServiceSpy.getSmartBannerEnableConditions
      ).toHaveBeenCalled();
      expect(component.vSmartbanner.nativeElement.show).toHaveBeenCalled();
      expect(setSmartBannerOptionsSpy).toHaveBeenCalled();
      expect(component.subscription.add).toHaveBeenCalledWith(
        smartBannerubscriptionMockElse
      );
    });
  });

  describe('setSmartBannerOptions', () => {
    beforeEach(() => {
      spyOn(component, 'setSmartBannerOptions').and.callThrough();
    });
    it('should call getSmartBannerOptions and createMetags in vSmartbanner', async () => {
      await component.setSmartBannerOptions();
      expect(smartBannerServiceSpy.getSmartBannerOptions).toHaveBeenCalled();
      expect(
        component.vSmartbanner.nativeElement.createMetaTags
      ).toHaveBeenCalledWith(
        smartbannerOptions.title,
        smartbannerOptions.author,
        smartbannerOptions.icon,
        smartbannerOptions['button-url-apple'],
        smartbannerOptions.icon,
        smartbannerOptions['button-url-google']
      );
    });
  });

  describe('publishSmartBannerTop', () => {
    beforeEach(() => {
      publishSmartBannerTopSpy.and.callThrough();
    });
    it('should call createPublisher', () => {
      component.publishSmartBannerTop();
      expect(eventManagerSpy.createPublisher).toHaveBeenCalledWith(
        'smartBannerStickToTop'
      );
    });
  });

  describe('smartBannerDisplayed', () => {
    beforeEach(() => {
      component.smartBannerTopPublisher = jasmine.createSpyObj(
        'smartBannerTopPublisher',
        ['publish']
      );
      smartBannerDisplayedSpy.and.callThrough();
    });
    it('should call publishSmartBannerTop and publish top 84px if isSmartBannerHidden is false', () => {
      component['smartBannerEnableConditions'] = {
        isSmartBannerHidden: false,
        isSmartBannerDismissed: false,
      };
      component.smartBannerDisplayed();
      expect(publishSmartBannerTopSpy).toHaveBeenCalled();
      expect(component.smartBannerTopPublisher.publish).toHaveBeenCalledWith(
        '84px'
      );
    });
    it('should not call publishSmartBannerTop and publish if isSmartBannerHidden is true', () => {
      component['smartBannerEnableConditions'] = {
        isSmartBannerHidden: true,
        isSmartBannerDismissed: false,
      };
      component.smartBannerDisplayed();
      expect(publishSmartBannerTopSpy).not.toHaveBeenCalled();
      expect(component.smartBannerTopPublisher.publish).not.toHaveBeenCalled();
    });
  });

  describe('smartBannerDismissed', () => {
    beforeEach(() => {
      component.smartBannerTopPublisher = jasmine.createSpyObj(
        'smartBannerTopPublisher',
        ['publish']
      );
      smartBannerDismissedSpy.and.callThrough();
    });
    it('should publish top 0px', () => {
      component.smartBannerDismissed();
      expect(publishSmartBannerTopSpy).toHaveBeenCalled();
      expect(component.smartBannerTopPublisher.publish).toHaveBeenCalledWith(
        '0px'
      );
    });
  });
});

import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {HeaderTypeService} from '@web/app/modules/shared/services/header-type/header-type.service';
import {HeaderComponent} from './header.component';
import {of, Subscription} from 'rxjs';
import {Component, Input} from '@angular/core';
import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {JourneyService} from '@shared-lib/services/journey/journey.service';
import {Router} from '@angular/router';
import {JourneyUtilityService} from '@shared-lib/services/journey/journeyUtilityService/journey-utility.service';
import {AccessService} from '@shared-lib/services/access/access.service';
import {EventManagerService} from '@shared-lib/modules/event-manager/event-manager/event-manager.service';
import {AltAccessService} from '../../services/alt-access/alt-access.service';

@Component({selector: 'ion-header', template: ''})
class MockIonHeader {}

@Component({selector: 'v-brand-stripe', template: ''})
class MockBrandStripe {
  @Input() imageSource;
  @Input() colorFrom;
  @Input() colorTo;
}

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let headerTypeServiceSpy;
  let journeyServiceSpy;
  let routerSpy;
  let journeyUtilityServiceSpy;
  let accessServiceSpy;
  let routerNavigationSpy;
  let eventManagerSpy;
  let smartBannerStickToTopObservableSpy;
  let smartBannerStickToTopSubscriptionSpy;
  let altAccessServiceSpy;

  beforeEach(
    waitForAsync(() => {
      headerTypeServiceSpy = jasmine.createSpyObj('HeaderTypeService', [
        'getSelectedTab$',
        'logoutURLInitialize',
        'sessionTimeoutWatcherInitiated',
        'checkForWorkplaceHeaderFooter',
        'publishSelectedTab',
      ]);
      accessServiceSpy = jasmine.createSpyObj('AccessService', [
        'checkWorkplaceAccess',
        'checkMyvoyageAccess',
      ]);
      accessServiceSpy.checkWorkplaceAccess.and.returnValue(
        Promise.resolve({myWorkplaceDashboardEnabled: true})
      );
      journeyServiceSpy = jasmine.createSpyObj('journeyServiceSpy', [
        'getJourneyStatus',
        'fetchJourneys',
        'publishLeaveJourney',
      ]);
      journeyServiceSpy.fetchJourneys.and.returnValue({
        pipe: jasmine.createSpy().and.returnValue({
          subscribe: jasmine.createSpy(),
        }),
      });

      routerSpy = {
        events: {
          pipe: jasmine.createSpy().and.returnValue(of('/journeys')),
        },
        navigate: jasmine.createSpy(),
        navigateByUrl: jasmine.createSpy(),
      };
      journeyUtilityServiceSpy = jasmine.createSpyObj('JourneyUtilityService', [
        'routeToFirstJourney',
      ]);
      smartBannerStickToTopObservableSpy = jasmine.createSpyObj(
        'smartBannerStickToTopObservable',
        ['subscribe']
      );
      eventManagerSpy = jasmine.createSpyObj('EventManagerService', [
        'createSubscriber',
      ]);
      smartBannerStickToTopObservableSpy = jasmine.createSpyObj(
        'smartBannerStickToTopObservable',
        ['subscribe']
      );
      smartBannerStickToTopSubscriptionSpy = jasmine.createSpyObj(
        'smartBannerStickToTopSubscription',
        ['unsubscribe']
      );
      smartBannerStickToTopObservableSpy.subscribe.and.returnValue(
        smartBannerStickToTopSubscriptionSpy
      );
      eventManagerSpy.createSubscriber.and.returnValue(
        smartBannerStickToTopObservableSpy
      );
      altAccessServiceSpy = jasmine.createSpyObj('altAccessServiceSpy', [
        'createAndShowModal',
      ]);
      TestBed.configureTestingModule({
        declarations: [MockBrandStripe, MockIonHeader],
        providers: [
          {provide: HeaderTypeService, useValue: headerTypeServiceSpy},
          {provide: JourneyService, useValue: journeyServiceSpy},
          {provide: Router, useValue: routerSpy},
          {provide: JourneyUtilityService, useValue: journeyUtilityServiceSpy},
          {provide: AccessService, useValue: accessServiceSpy},
          {provide: EventManagerService, useValue: eventManagerSpy},
          {provide: AltAccessService, useValue: altAccessServiceSpy},
        ],
        imports: [],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderComponent);
    headerTypeServiceSpy.getSelectedTab$.and.returnValue(of('Home'));
    component = fixture.componentInstance;
    routerNavigationSpy = spyOn(component, 'routerNavigation');
    spyOn(component['subscription'], 'add');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should call getSelectedTab$ and set selectedTab', async () => {
      headerTypeServiceSpy.getSelectedTab$.and.returnValue(of('Home'));
      component.selectedTab = undefined;
      await component.ngOnInit();
      expect(headerTypeServiceSpy.getSelectedTab$).toHaveBeenCalled();
      expect(component.selectedTab).toEqual('Home');
    });
    it('should call routerNavigation', async () => {
      await component.ngOnInit();
      expect(component.routerNavigation).toHaveBeenCalled();
    });
    it('should call logoutURLInitialize', async () => {
      await component.ngOnInit();
      expect(headerTypeServiceSpy.logoutURLInitialize).toHaveBeenCalled();
    });
    it('should call sessionTimeoutWatcherInitiated', async () => {
      await component.ngOnInit();
      expect(
        headerTypeServiceSpy.sessionTimeoutWatcherInitiated
      ).toHaveBeenCalled();
    });
    it('should call checkWorkplaceAccess and set the value of isWorkplaceHeader', async () => {
      component.isWorkplaceHeader = false;
      await component.ngOnInit();
      expect(accessServiceSpy.checkWorkplaceAccess).toHaveBeenCalled();
      expect(component.isWorkplaceHeader).toEqual(true);
    });
    it('should isHeaderReady will be true', async () => {
      component.isHeaderReady = false;
      await component.ngOnInit();
      expect(component.isHeaderReady).toEqual(true);
    });
    it('should subscribe to smartBannerStickToTop', async () => {
      await component.ngOnInit();
      expect(smartBannerStickToTopObservableSpy.subscribe).toHaveBeenCalled();
      expect(component['subscription'].add).toHaveBeenCalledWith(
        smartBannerStickToTopSubscriptionSpy
      );
      expect(component.smartBannerTop).toEqual('0px');
    });
    it('should open Alternate Access alert modal', async () => {
      accessServiceSpy.checkMyvoyageAccess.and.returnValue(
        Promise.resolve({isAltAccessUser: true})
      );
      await component.ngOnInit();
      expect(accessServiceSpy.checkMyvoyageAccess).toHaveBeenCalled();
      expect(altAccessServiceSpy.createAndShowModal).toHaveBeenCalled();
    });
    it('should not open Alternate Access alert modal', async () => {
      accessServiceSpy.checkMyvoyageAccess.and.returnValue(
        Promise.resolve({isAltAccessUser: false})
      );
      await component.ngOnInit();
      expect(accessServiceSpy.checkMyvoyageAccess).toHaveBeenCalled();
      expect(altAccessServiceSpy.createAndShowModal).not.toHaveBeenCalled();
    });
  });

  describe('routerNavigation', () => {
    let mockData;
    let subscription;

    beforeEach(() => {
      spyOn(component, 'journeyRouterNavigation');
      mockData = '/journeys';
      const observable = of(mockData);
      subscription = new Subscription();
      spyOn(observable, 'subscribe').and.callFake(f => {
        f(mockData);
        return subscription;
      });
      routerSpy.events.pipe.and.returnValue(observable);
      routerNavigationSpy.and.callThrough();
    });

    it('should call journeyRouterNavigation if the url is journeys', () => {
      component.routerNavigation();
      expect(component.journeyRouterNavigation).toHaveBeenCalledWith(mockData);
      expect(component.subscription.add).toHaveBeenCalledWith(subscription);
    });

    it('should publishLeaveJourney if its a navigationend event and the url is not journeys and the tab is life events', () => {
      mockData = '/coverages';
      component.selectedTab = 'LIFE_EVENTS';
      component.routerNavigation();
      expect(component.journeyRouterNavigation).not.toHaveBeenCalled();
      expect(journeyServiceSpy.publishLeaveJourney).toHaveBeenCalled();
    });
  });

  describe('journeyRouterNavigation', () => {
    let observable;
    let journeyData;
    beforeEach(() => {
      journeyData = {
        all: [
          {
            journeyID: 1,
            landingAndOverviewContent:
              '{"intro":{"header":"Preparing for retirement","message":"It\'s a good time to think about the next phase of your life. Find out how to get organized and take actionable steps to prepare for retirement.","imgUrl":"assets/icon/journeys/In_Company.svg"},"overview":{"header":"Preparing for retirement","message":"It\'s a good time to think about the next phase of your life. Find out how to get organized and take actionable steps to prepare for retirement.","imgUrl":"assets/icon/journeys/In_Company.svg","summarySteps":[]}}',
            resourcesContent: '',
            steps: [],
          },
          {
            journeyID: 2,
            landingAndOverviewContent:
              '{"intro":{"header":"Preparing for retirement2","message":"It\'s a good time to think about the next phase of your life. Find out how to get organized and take actionable steps to prepare for retirement.2","imgUrl":"assets/icon/journeys/In_Company.svg2"},"overview":{"header":"Preparing for retirement2","message":"It\'s a good time to think about the next phase of your life. Find out how to get organized and take actionable steps to prepare for retirement.2","imgUrl":"assets/icon/journeys/In_Company.svg2","summarySteps":[{"journeyStepName":"1","header":"You want to retire at:","elements":[{"id":"imageWithValue","answerId":"retirementAge"}]},{"journeyStepName":"5","header":"Your Retirement Progress","elements":[{"id":"orangeMoney"}]},{"journeyStepName":"2","header":"Here\'s what\'s most important to you:","elements":[{"id":"wordGroupSummary","answerId":"wordGroup"},{"id":"wordGroupOtherSummary","answerId":"otherInput"}]}]}}',
            resourcesContent: '',
            steps: [],
          },
        ],
        recommended: [
          {
            journeyID: 3,
            landingAndOverviewContent:
              '{"intro":{"header":"Preparing for retirement3","message":"It\'s a good time to think about the next phase of your life. Find out how to get organized and take actionable steps to prepare for retirement.3","imgUrl":"assets/icon/journeys/In_Company.svg3"},"overview":{"header":"Preparing for retirement3","message":"It\'s a good time to think about the next phase of your life. Find out how to get organized and take actionable steps to prepare for retirement.3","imgUrl":"assets/icon/journeys/In_Company.svg3","summarySteps":[]}}',
            resourcesContent:
              '{"resources":[{"type":"webview","header":"Articles","links":[{"text":"Setting retirement goals that will help you in your golden years","link":"https://www.voya.com/article/setting-retirement-goals-will-help-you-your-golden-years"}]},{"type":"video","header":"Videos","links":[{"text":"Learn how asset classes work in investing","playerId":"kaltura_player_1644869692","videoUrl":"https://cdnapisec.kaltura.com/p/1234081/sp/123408100/embedIframeJs/uiconf_id/48794683/partner_id/1234081?iframeembed=true&playerId=kaltura_player_1644869692&entry_id=1_9sd775pl"},{"text":"Retirement income planning","playerId":"kaltura_player_1644869723","videoUrl":"https://cdnapisec.kaltura.com/p/1234081/sp/123408100/embedIframeJs/uiconf_id/48794683/partner_id/1234081?iframeembed=true&playerId=kaltura_player_1644869723&entry_id=1_4pj5swer"}]}]}',
            steps: [],
          },
        ],
      };
      observable = of(journeyData);
      spyOn(observable, 'pipe').and.returnValue(observable);
      journeyServiceSpy.fetchJourneys.and.returnValue(observable);
    });

    it('should fetch the journeys and call routeToFirstJourney if url is journeys', () => {
      component.journeyRouterNavigation('/journeys');
      expect(journeyServiceSpy.fetchJourneys).toHaveBeenCalled();
      expect(journeyUtilityServiceSpy.routeToFirstJourney).toHaveBeenCalledWith(
        journeyData
      );
      expect(headerTypeServiceSpy.publishSelectedTab).toHaveBeenCalledWith(
        'LIFE_EVENTS'
      );
    });

    it('should not fetch the journeys if url is accounts', () => {
      component.journeyRouterNavigation('/accounts');
      expect(journeyServiceSpy.fetchJourneys).not.toHaveBeenCalled();
      expect(headerTypeServiceSpy.publishSelectedTab).not.toHaveBeenCalled();
    });
  });

  it('ngOnDestroy', () => {
    spyOn(component.subscription, 'unsubscribe');
    component.ngOnDestroy();
    expect(component.subscription.unsubscribe).toHaveBeenCalled();
  });
});

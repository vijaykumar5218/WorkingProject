import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {JourneysPage} from './journeys.page';
import {JourneyService} from '@shared-lib/services/journey/journey.service';
import {SharedUtilityService} from '@shared-lib/services/utility/utility.service';
import {RouterTestingModule} from '@angular/router/testing';
import {of} from 'rxjs';
import {PlatformService} from '@shared-lib/services/platform/platform.service';
import {EventManagerService} from '@shared-lib/modules/event-manager/event-manager/event-manager.service';
import {ElementRef} from '@angular/core';
import {eventKeys} from '@shared-lib/constants/event-keys';
import {AccessService} from '@shared-lib/services/access/access.service';

describe('JourneysPage', () => {
  let component: JourneysPage;
  let fixture: ComponentFixture<JourneysPage>;
  let journeyServiceSpy;
  let fetchCurrentUrlSpy;
  let platformServiceSpy;
  let eventManagerServiceSpy;
  let nativeElementSpy;
  let accessServiceSpy;

  beforeEach(
    waitForAsync(() => {
      journeyServiceSpy = jasmine.createSpyObj('JourneyService', [
        'fetchJourneys',
        'getCurrentJourney',
      ]);
      accessServiceSpy = jasmine.createSpyObj('accessServiceSpy', [
        'checkWorkplaceAccess',
      ]);
      accessServiceSpy.checkWorkplaceAccess.and.returnValue(
        Promise.resolve({myWorkplaceDashboardEnabled: true})
      );
      platformServiceSpy = jasmine.createSpyObj('platformServiceSpy', [
        'isDesktop',
      ]);
      platformServiceSpy.isDesktop.and.returnValue({
        subscribe: () => undefined,
      });
      eventManagerServiceSpy = jasmine.createSpyObj('EventManagerService', [
        'createSubscriber',
      ]);
      eventManagerServiceSpy.createSubscriber.and.returnValue(of({}));
      nativeElementSpy = jasmine.createSpyObj('nativeElement', [
        'scrollIntoView',
      ]);
      TestBed.configureTestingModule({
        declarations: [JourneysPage],
        providers: [
          {provide: JourneyService, useValue: journeyServiceSpy},
          {provide: PlatformService, useValue: platformServiceSpy},
          {provide: EventManagerService, useValue: eventManagerServiceSpy},
          {provide: AccessService, useValue: accessServiceSpy},
        ],
        imports: [RouterTestingModule],
      }).compileComponents();
      fixture = TestBed.createComponent(JourneysPage);
      component = fixture.componentInstance;
      component.topmostElement = {
        nativeElement: nativeElementSpy,
      } as ElementRef;
      fetchCurrentUrlSpy = spyOn(component, 'fetchCurrentUrl');
      fixture.detectChanges();
    })
  );

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it('ngOnInit', () => {
    spyOn(SharedUtilityService.prototype, 'scrollToTop');
    component.isDesktop = false;
    platformServiceSpy.isDesktop.and.returnValue(of(true));
    component.ngOnInit();
    expect(accessServiceSpy.checkWorkplaceAccess).toHaveBeenCalled();
    expect(component.myWorkplaceDashboardEnabled).toEqual(true);
    expect(journeyServiceSpy.fetchJourneys).toHaveBeenCalled();
    expect(component.fetchCurrentUrl).toHaveBeenCalled();
    expect(platformServiceSpy.isDesktop).toHaveBeenCalled();
    expect(component.isDesktop).toEqual(true);
    expect(eventManagerServiceSpy.createSubscriber).toHaveBeenCalledWith(
      eventKeys.journeyStepsScrollToTop
    );
    expect(SharedUtilityService.prototype.scrollToTop).toHaveBeenCalledWith(
      component.topmostElement
    );
  });

  describe('triggerLocalStorageChange', () => {
    const mockData = {
      journeyID: 1,
      journeyName: 'Journey Name 1',
      lastModifiedStepIndex: 0,
      landingAndOverviewContent: '',
      resourcesContent: '',
      parsedLandingAndOverviewContent: {
        intro: {
          header: 'Adding to your family',
          message:
            'Having a kid changes everything. Learn how to get your finances in order when your family is growing.',
          imgUrl: 'assets/icon/journeys/all/Master_Close_Ups_Family_2.svg',
        },
        overview: undefined,
      },
      steps: [],
    };
    beforeEach(() => {
      journeyServiceSpy.getCurrentJourney.and.returnValue(mockData);
      component.isRoutingActive = false;
      component.urlProps = {
        journeyId: 1,
        journeyType: 'all',
        resolvePromiseTimes: 1,
      };
    });
    it('When isRoutingActive would be true', () => {
      component.triggerLocalStorageChange(mockData);
      expect(component.isRoutingActive).toEqual(true);
    });
    it('When isRoutingActive would be false', () => {
      const mockData1 = {
        journeyID: 2,
        journeyName: 'Journey 2',
        lastModifiedStepIndex: 0,
        landingAndOverviewContent: '',
        resourcesContent: '',
        parsedLandingAndOverviewContent: {
          intro: {
            header: 'Adding to your family',
            message:
              'Having a kid changes everything. Learn how to get your finances in order when your family is growing.',
            imgUrl: 'assets/icon/journeys/all/Master_Close_Ups_Family_2.svg',
          },
          overview: undefined,
        },
        steps: [],
      };
      component.triggerLocalStorageChange(mockData1);
      expect(component.isRoutingActive).toEqual(false);
    });
  });

  describe('journeyClick', () => {
    let eleSpy;
    beforeEach(() => {
      eleSpy = jasmine.createSpyObj('eleSpy', ['focus']);
      component.focusedElementLifeEvents = jasmine.createSpyObj(
        'NativeEl',
        [''],
        {
          nativeElement: eleSpy,
        }
      );
    });
    it('should foucus on ele', () => {
      component.journeyClick();
      expect(eleSpy.focus).toHaveBeenCalled();
    });
  });

  describe('fetchCurrentUrl', () => {
    beforeEach(() => {
      component.isRoutingActive = true;
      fetchCurrentUrlSpy.and.callThrough();
      spyOn(SharedUtilityService.prototype, 'scrollToTop');
    });
    describe('When urlProps would be defined', () => {
      beforeEach(() => {
        spyOn(
          SharedUtilityService.prototype,
          'fetchUrlThroughNavigation'
        ).and.returnValue(
          of({
            paramId: '1',
            url: '/journeys/journey/1/overview?journeyType=all',
          })
        );
        component.selectedTab = undefined;
      });
      it('When previous journeyId is not equal to current journeyId', () => {
        component.urlProps = {
          journeyId: 2,
          journeyType: 'all',
          resolvePromiseTimes: 1,
        };
        component.fetchCurrentUrl();
        expect(component.selectedTab).toEqual('overview');
        expect(
          SharedUtilityService.prototype.fetchUrlThroughNavigation
        ).toHaveBeenCalledWith(3);
        expect(component.isRoutingActive).toEqual(false);
        expect(component.urlProps).toEqual({
          journeyId: 1,
          journeyType: 'all',
          resolvePromiseTimes: 1,
        });
        expect(SharedUtilityService.prototype.scrollToTop).toHaveBeenCalled();
      });
      it('When previous journeyId is equal to current journeyId but previous journeyType is different than current journeyType', () => {
        component.urlProps = {
          journeyId: 1,
          journeyType: 'recommended',
          resolvePromiseTimes: 1,
        };
        component.fetchCurrentUrl();
        expect(
          SharedUtilityService.prototype.fetchUrlThroughNavigation
        ).toHaveBeenCalledWith(3);
        expect(component.isRoutingActive).toEqual(false);
      });
      it('When previous journeyId is equal to current journeyId and also previous journeyType is equal to current journeyType', () => {
        component.urlProps = {
          journeyId: 1,
          journeyType: 'all',
          resolvePromiseTimes: 1,
        };
        component.fetchCurrentUrl();
        expect(
          SharedUtilityService.prototype.fetchUrlThroughNavigation
        ).toHaveBeenCalledWith(3);
        expect(component.isRoutingActive).toEqual(true);
      });
    });
    it('When fetchUrlThroughNavigation return null', () => {
      spyOn(
        SharedUtilityService.prototype,
        'fetchUrlThroughNavigation'
      ).and.returnValue(of(null));
      component.fetchCurrentUrl();
      expect(component.urlProps).toEqual(undefined);
    });
  });

  it('ngOnDestroy', () => {
    spyOn(component.subscription, 'unsubscribe');
    component.ngOnDestroy();
    expect(component.subscription.unsubscribe).toHaveBeenCalled();
  });
});

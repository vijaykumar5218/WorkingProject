import {Component, Input} from '@angular/core';
import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {Router} from '@angular/router';
import {RouterTestingModule} from '@angular/router/testing';
import {Status} from '@shared-lib/constants/status.enum';
import {JourneyService} from '@shared-lib/services/journey/journey.service';
import {JourneyComponent} from './journey.component';
import {EventManagerService} from '@shared-lib/modules/event-manager/event-manager/event-manager.service';
import {of} from 'rxjs';

@Component({selector: 'journeys-status', template: ''})
class MockJourneyStatusComponent {
  @Input() status;
}

describe('JourneyComponent', () => {
  let component: JourneyComponent;
  let fixture: ComponentFixture<JourneyComponent>;
  let journeyServiceSpy;
  let routerSpy;
  let eventManagerServiceSpy;
  let journey;
  let comingSoonContent;
  let landingAndOverviewContent;

  beforeEach(
    waitForAsync(() => {
      eventManagerServiceSpy = jasmine.createSpyObj('EventManagerService', [
        'createSubscriber',
      ]);
      routerSpy = jasmine.createSpyObj('routerSpy', ['navigate']);
      journeyServiceSpy = jasmine.createSpyObj('JourneyService', [
        'getJourneyStatus',
        'setStepContent',
        'setCurrentJourney',
        'isComingSoon',
        'publishLeaveJourney',
      ]);
      eventManagerServiceSpy.createSubscriber.and.returnValue({
        subscribe: () => undefined,
      });
      TestBed.configureTestingModule({
        declarations: [JourneyComponent, MockJourneyStatusComponent],
        imports: [RouterTestingModule],
        providers: [
          {provide: JourneyService, useValue: journeyServiceSpy},
          {provide: EventManagerService, useValue: eventManagerServiceSpy},
          {provide: Router, useValue: routerSpy},
        ],
      }).compileComponents();

      fixture = TestBed.createComponent(JourneyComponent);
      component = fixture.componentInstance;
      component.urlProps = {
        journeyId: 1,
        journeyType: 'all',
      };
      landingAndOverviewContent = {
        intro: {
          header: 'Adding to your family',
          message:
            'Having a kid changes everything. Learn how to get your finances in order when your family is growing.',
          imgUrl: 'assets/icon/journeys/all/Master_Close_Ups_Family_2.svg',
        },
        overview: undefined,
      };
      comingSoonContent = {
        intro: {
          header: 'Adding to your family',
          message:
            'Having a kid changes everything. Learn how to get your finances in order when your family is growing.',
          imgUrl: 'assets/icon/journeys/all/Master_Close_Ups_Family_2.svg',
        },
      };
      journey = {
        journeyID: 1,
        landingAndOverviewContent: '',
        resourcesContent: '',
        parsedLandingAndOverviewContent: landingAndOverviewContent,
        parsedComingSoonContent: comingSoonContent,
        steps: [],
      };
      component.journey = journey;
      journeyServiceSpy.isComingSoon.and.returnValue(false);
      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    beforeEach(() => {
      component.status = Status.notStarted;
      journeyServiceSpy.getJourneyStatus.and.returnValue(Status.inProgress);
    });
    it('should call journeyService.isComingSoon to determine if the journey is coming soon', () => {
      expect(journeyServiceSpy.isComingSoon).toHaveBeenCalledWith(journey);
      expect(component.isComingSoon).toEqual(false);
    });
    it('should set the content to the landingAndOverviewContent if the journey is not comingSoon', () => {
      component.content = undefined;
      component.ngOnInit();
      expect(component.content).toEqual(landingAndOverviewContent);
    });
    it('should set the content to the comingSoonContent if the journey is comingSoon', () => {
      component.content = undefined;
      journeyServiceSpy.isComingSoon.and.returnValue(true);
      component.ngOnInit();
      expect(component.content).toEqual(comingSoonContent);
    });
    it('should get the step status from the journey service if not comingSoon', () => {
      component.ngOnInit();
      expect(journeyServiceSpy.getJourneyStatus).toHaveBeenCalledWith(
        component.journey.steps
      );
      expect(component.status).toEqual(Status.inProgress);
      expect(journeyServiceSpy.getJourneyStatus).toHaveBeenCalledTimes(2);
    });
    it('should call getJourneyStatus to init status and when refresh event happens if the journey is not comingSoon', () => {
      eventManagerServiceSpy.createSubscriber.and.returnValue(of(undefined));
      journeyServiceSpy.getJourneyStatus.calls.reset();
      component.ngOnInit();
      expect(journeyServiceSpy.getJourneyStatus).toHaveBeenCalledTimes(2);
    });
    it('should not call getJourneyStatus if the journey is comingSoon', () => {
      journeyServiceSpy.isComingSoon.and.returnValue(true);
      journeyServiceSpy.getJourneyStatus.calls.reset();
      eventManagerServiceSpy.createSubscriber.and.returnValue(of(undefined));
      component.ngOnInit();
      expect(journeyServiceSpy.getJourneyStatus).not.toHaveBeenCalled();
    });
  });

  describe('handleJourneyClick', () => {
    beforeEach(() => {
      component.journeyType = 'all';
      spyOn(component.journeyClick, 'emit');
    });

    it('should not publishLeavingJourney if the journeyId matches the url props', () => {
      component.urlProps.journeyId = 1;
      component.journey.journeyID = 1;
      component.handleJourneyClick();
      expect(journeyServiceSpy.publishLeaveJourney).not.toHaveBeenCalled();
    });

    it('should publishLeavingJourney if the journeyId does not match the url props', () => {
      component.urlProps.journeyId = 1;
      component.journey.journeyID = 2;
      component.handleJourneyClick();
      expect(journeyServiceSpy.publishLeaveJourney).toHaveBeenCalled();
    });

    it('should not do anything if coming soon', () => {
      component.isComingSoon = true;
      component.handleJourneyClick();
      expect(routerSpy.navigate).not.toHaveBeenCalled();
    });

    it('should route to steps when  status is in progress', () => {
      component.status = Status.inProgress;
      component.handleJourneyClick();
      expect(routerSpy.navigate).toHaveBeenCalledWith(
        ['/journeys/journey/1/steps'],
        {
          queryParams: {journeyType: 'all'},
        }
      );
    });
    it('should route to overview when  status is not started', () => {
      component.status = Status.notStarted;
      component.handleJourneyClick();
      expect(routerSpy.navigate).toHaveBeenCalledWith(
        ['/journeys/journey/1/overview'],
        {
          queryParams: {journeyType: 'all', fromJourneys: true},
        }
      );
    });
    it('should call journeyClick when isComingSoon will be false', () => {
      component.isComingSoon = false;
      component.handleJourneyClick();
      expect(component.journeyClick.emit).toHaveBeenCalled();
    });
    it('should not call journeyClick when isComingSoon will be false', () => {
      component.isComingSoon = true;
      component.handleJourneyClick();
      expect(component.journeyClick.emit).not.toHaveBeenCalled();
    });
  });

  describe('manageWidthOfCard', () => {
    beforeEach(() => {
      spyOn(component, 'setLocalStorage');
    });
    it('Should call setLocalStorage', () => {
      component.journeyType = 'all';
      const result = component.manageWidthOfCard();
      expect(component.setLocalStorage).toHaveBeenCalled();
      expect(result).toEqual({width: '411px'});
    });
    it('Should not call setLocalStorage', () => {
      component.urlProps = {
        journeyId: 2,
        journeyType: 'all',
      };
      const result = component.manageWidthOfCard();
      expect(component.setLocalStorage).not.toHaveBeenCalled();
      expect(result).toEqual({width: '380px'});
    });
  });

  describe('setLocalStorage', () => {
    it("When urlProps['resolvePromiseTimes'] === 1", async () => {
      spyOn(component.localStorageChange, 'emit');
      component.urlProps['resolvePromiseTimes'] = 1;
      await component.setLocalStorage();
      expect(journeyServiceSpy.setCurrentJourney).toHaveBeenCalledWith(
        component.journey
      );
      expect(journeyServiceSpy.setStepContent).toHaveBeenCalledWith(
        component.journey
      );
      expect(component.urlProps['resolvePromiseTimes']).toEqual(2);
      expect(component.localStorageChange.emit).toHaveBeenCalledWith(
        component.journey
      );
    });
    it("When urlProps['resolvePromiseTimes'] !== 1", async () => {
      component.urlProps['resolvePromiseTimes'] = 3;
      await component.setLocalStorage();
      expect(journeyServiceSpy.setCurrentJourney).not.toHaveBeenCalled();
      expect(journeyServiceSpy.setStepContent).not.toHaveBeenCalled();
      expect(component.urlProps['resolvePromiseTimes']).not.toEqual(2);
    });
  });
});

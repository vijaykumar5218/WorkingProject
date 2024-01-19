import {Component, Input} from '@angular/core';
import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {By} from '@angular/platform-browser';
import {RouterTestingModule} from '@angular/router/testing';
import {Status} from '@shared-lib/constants/status.enum';
import {Journey} from '@shared-lib/services/journey/models/journey.model';
import {JourneyService} from '@shared-lib/services/journey/journey.service';
import {IntroductionComponent} from './introduction.component';
import {of, Subscription} from 'rxjs';
import {ActivatedRoute, Router} from '@angular/router';
import {SharedUtilityService} from '@shared-lib/services/utility/utility.service';
import {EventManagerService} from '@shared-lib/modules/event-manager/event-manager/event-manager.service';
import {eventKeys} from '@shared-lib/constants/event-keys';

@Component({selector: 'journeys-status', template: ''})
class MockJourneyStatusComponent {
  @Input() status;
}

describe('IntroductionComponent', () => {
  let component: IntroductionComponent;
  let fixture: ComponentFixture<IntroductionComponent>;
  let journey: Journey;
  let journeyServiceSpy;
  let sharedUtilityServiceSpy;
  let activatedRouteSpy;
  let getJourneyTypeSpy;
  let eventManagerSpy;
  let refreshJourneyStatusSpy;
  let routerSpy;

  beforeEach(
    waitForAsync(() => {
      eventManagerSpy = jasmine.createSpyObj('EventManagerService', [
        'createSubscriber',
      ]);
      sharedUtilityServiceSpy = jasmine.createSpyObj('SharedUtilityService', [
        'getIsWeb',
      ]);
      (activatedRouteSpy = {
        queryParams: of({
          journeyType: 'all',
          fromJourneys: true,
        }),
      }),
        (journey = {
          journeyID: 1,
          journeyName: 'journeyName',
          lastModifiedStepIndex: 0,
          landingAndOverviewContent: '',
          resourcesContent: '',
          parsedLandingAndOverviewContent: {
            intro: undefined,
            overview: {
              header: 'Adding to your family',
              message:
                'Having a kid changes everything. Learn how to get your finances in order when your family is growing.',
              imgUrl: 'assets/icon/journeys/all/Master_Close_Ups_Family_2.svg',
              action: {
                header: 'actionHeader',
                message: 'Number of steps ${stepCount} in this journey',
                buttonLabel: 'actionButtonLabel',
              },
              summarySteps: [
                {
                  journeyStepName: '1',
                  header: 'You want to retire at:',
                  elements: [
                    {
                      id: 'imageWithValue',
                      answerId: 'retirementAge',
                    },
                  ],
                },
                {
                  journeyStepName: '5',
                  header: 'Your Retirement Progress',
                  elements: [
                    {
                      id: 'orangeMoney',
                    },
                  ],
                },
                {
                  journeyStepName: '2',
                  header: "Here's what's most important to you:",
                  elements: [
                    {
                      id: 'wordGroupSummary',
                      answerId: 'wordGroup',
                    },
                    {
                      id: 'wordGroupOtherSummary',
                      answerId: 'otherInput',
                    },
                  ],
                },
              ],
            },
          },
          steps: [
            {
              journeyStepName: '1',
              journeyStepCMSTagId: 'tagId1',
              msgType: 'msgType1',
            },
            {
              journeyStepName: '2',
              journeyStepCMSTagId: 'tagId2',
              msgType: 'msgType2',
            },
          ],
        });
      journeyServiceSpy = jasmine.createSpyObj('JourneyService', [
        'getJourneyStatus',
        'getCurrentJourney',
      ]);
      journeyServiceSpy.getJourneyStatus.and.returnValue(Status.completed);
      routerSpy = jasmine.createSpyObj('Router', ['navigate']);

      TestBed.configureTestingModule({
        declarations: [IntroductionComponent, MockJourneyStatusComponent],
        imports: [RouterTestingModule],
        providers: [
          {provide: JourneyService, useValue: journeyServiceSpy},
          {provide: ActivatedRoute, useValue: activatedRouteSpy},
          {provide: SharedUtilityService, useValue: sharedUtilityServiceSpy},
          {provide: EventManagerService, useValue: eventManagerSpy},
          {provide: Router, useValue: routerSpy},
        ],
      }).compileComponents();

      fixture = TestBed.createComponent(IntroductionComponent);
      component = fixture.componentInstance;
      getJourneyTypeSpy = spyOn(component, 'getJourneyType');
      refreshJourneyStatusSpy = spyOn(component, 'refreshJourneyStatus');
      component.journey = journey;
      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should call getJourneyType', () => {
      sharedUtilityServiceSpy.getIsWeb.and.returnValue(true);
      component.ngOnInit();
      expect(component.getJourneyType).toHaveBeenCalled();
    });

    it('should get the step status from the journey service', () => {
      expect(journeyServiceSpy.getJourneyStatus).toHaveBeenCalledWith(
        component.journey.steps
      );
      expect(component.status).toEqual(Status.completed);
    });

    it('should replace ${stepCount} in the action message with the step count', () => {
      expect(
        component.journey.parsedLandingAndOverviewContent.overview.action
          .message
      ).toEqual('Number of steps 2 in this journey');
    });

    it('should replace ${stepCount} with 0 if there are no steps', () => {
      journey.steps = undefined;
      journey.parsedLandingAndOverviewContent.overview.action.message =
        'Number of steps ${stepCount} in this journey';
      component.ngOnInit();
      expect(
        component.journey.parsedLandingAndOverviewContent.overview.action
          .message
      ).toEqual('Number of steps 0 in this journey');
    });

    it('should not replace ${stepCount} with the stepCount if there is no action message', () => {
      journey.parsedLandingAndOverviewContent.overview.action.message = undefined;
      component.ngOnInit();
      expect(
        component.journey.parsedLandingAndOverviewContent.overview.action
          .message
      ).toBeUndefined();
    });

    describe('refreshJourneyStatus', () => {
      it('when isWeb would be true', () => {
        sharedUtilityServiceSpy.getIsWeb.and.returnValue(true);
        component.ngOnInit();
        expect(component.refreshJourneyStatus).toHaveBeenCalled();
      });
      it('when isWeb would be false', () => {
        sharedUtilityServiceSpy.getIsWeb.and.returnValue(false);
        component.ngOnInit();
        expect(component.refreshJourneyStatus).not.toHaveBeenCalled();
      });
    });
  });

  describe('template', () => {
    describe('intro', () => {
      it('should display the journey header', () => {
        const header = fixture.debugElement.query(
          By.css('.intro div ion-text')
        );
        expect(header).toBeTruthy();
        expect(header.nativeElement.innerHTML.trim()).toEqual(
          journey.parsedLandingAndOverviewContent.overview.header
        );
      });

      it('should display the journey status', () => {
        expect(
          fixture.debugElement.query(By.css('journeys-status'))
        ).toBeTruthy();
      });

      it('should display the journey img', () => {
        const img = fixture.debugElement.query(By.css('img'));
        expect(img).toBeTruthy();
        expect(img.attributes.src).toEqual(
          journey.parsedLandingAndOverviewContent.overview.imgUrl
        );
      });
    });

    describe('action', () => {
      it('should display an ion-card with an ion-card-title in the ion-card-header', () => {
        const title = fixture.debugElement.query(
          By.css('ion-card ion-card-header ion-card-title')
        );
        expect(title).toBeTruthy();
        expect(title.nativeElement.innerHTML.trim()).toEqual('actionHeader');
      });

      it('should display a p tag in the ion-card-content with the action message', () => {
        const message = fixture.debugElement.query(
          By.css('ion-card ion-card-content p')
        );
        expect(message).toBeTruthy();
        expect(message.nativeElement.innerHTML.trim()).toEqual(
          'Number of steps 2 in this journey'
        );
      });

      it('should display the button in the ion-card-content with the buttonLabel', () => {
        const button = fixture.debugElement.query(By.css('div ion-button'));
        expect(button).toBeTruthy();
        expect(button.nativeElement.innerHTML.trim()).toEqual(
          'actionButtonLabel'
        );
      });
    });
  });

  describe('refreshJourneyStatus', () => {
    let subscription;
    let observable;
    beforeEach(() => {
      subscription = new Subscription();
      observable = of(undefined);
      spyOn(observable, 'subscribe').and.callFake(f => {
        f(undefined);
        return subscription;
      });
      eventManagerSpy.createSubscriber.and.returnValue(observable);
      refreshJourneyStatusSpy.and.callThrough();
      journeyServiceSpy.getCurrentJourney.and.returnValue(journey);
      journeyServiceSpy.getJourneyStatus.and.returnValue(Status.inProgress);
      spyOn(component.subscription, 'add');
      component.status = Status.notStarted;
    });
    it('should get the status', () => {
      component.refreshJourneyStatus();
      expect(eventManagerSpy.createSubscriber).toHaveBeenCalledWith(
        eventKeys.refreshJourneyStatus
      );
      expect(journeyServiceSpy.getCurrentJourney).toHaveBeenCalled();
      expect(journeyServiceSpy.getJourneyStatus).toHaveBeenCalledWith(
        journey.steps
      );
      expect(component.subscription.add).toHaveBeenCalledWith(subscription);
      expect(component.status).toEqual(Status.inProgress);
    });
  });

  describe('getJourneyType', () => {
    beforeEach(() => {
      spyOn(component.subscription, 'add');
      component.journeyType = undefined;
      getJourneyTypeSpy.and.callThrough();
    });
    it('if isweb would be true', () => {
      component.isWeb = true;
      component.getJourneyType();
      expect(component.journeyType).toEqual('all');
      expect(component.subscription.add).toHaveBeenCalled();
    });
    it('if isweb would be false', () => {
      component.isWeb = false;
      component.getJourneyType();
      expect(component.journeyType).toEqual(undefined);
      expect(component.subscription.add).not.toHaveBeenCalled();
    });
  });

  describe('buttonClick', () => {
    it('should call router.navigate', () => {
      component.buttonClick();
      expect(routerSpy.navigate).toHaveBeenCalledWith(['../steps'], {
        relativeTo: activatedRouteSpy,
        queryParams: {journeyType: 'all'},
      });
    });
  });

  it('ngOnDestroy', () => {
    spyOn(component.subscription, 'unsubscribe');
    component.ngOnDestroy();
    expect(component.subscription.unsubscribe).toHaveBeenCalled();
  });
});

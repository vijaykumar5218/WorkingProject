import {Component, Input} from '@angular/core';
import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {ActivatedRoute, Router} from '@angular/router';
import {RouterTestingModule} from '@angular/router/testing';
import {IonicModule} from '@ionic/angular';
import {Status} from '@shared-lib/constants/status.enum';
import {JourneyService} from '@shared-lib/services/journey/journey.service';
import {SummaryComponent} from './summary.component';
import {SharedUtilityService} from '@shared-lib/services/utility/utility.service';
import {of} from 'rxjs';
import {PlatformService} from '@shared-lib/services/platform/platform.service';

@Component({
  selector: 'app-step-progress-bar',
  template: '',
})
class MockAppStepProgressBarComponent {
  @Input() steps;
}

@Component({selector: 'journeys-overview-summary-step', template: ''})
class MockOverviewStepComponent {
  @Input() step;
}

describe('SummaryComponent', () => {
  let component: SummaryComponent;
  let fixture: ComponentFixture<SummaryComponent>;
  let journeyServiceSpy;
  let processStepsSpy;
  let routerSpy;
  let setRevisitButtonSpy;
  let activatedRouteSpy;
  let sharedUtilityServiceSpy;
  let platformServiceSpy;

  beforeEach(
    waitForAsync(() => {
      sharedUtilityServiceSpy = jasmine.createSpyObj('SharedUtilityService', [
        'getIsWeb',
      ]);
      journeyServiceSpy = jasmine.createSpyObj('JourneyService', [
        'safeParse',
        'getJourneyStatus',
      ]);
      routerSpy = jasmine.createSpyObj('Router', ['navigateByUrl', 'navigate']);
      (activatedRouteSpy = {
        snapshot: {
          paramMap: {
            get: jasmine.createSpy(),
          },
        },
        queryParams: of({
          journeyType: 'all',
          fromJourneys: true,
        }),
      }),
        (platformServiceSpy = jasmine.createSpyObj('platformServiceSpy', [
          'isDesktop',
        ]));
      platformServiceSpy.isDesktop.and.returnValue(of(true));
      TestBed.configureTestingModule({
        declarations: [
          SummaryComponent,
          MockAppStepProgressBarComponent,
          MockOverviewStepComponent,
        ],
        imports: [IonicModule.forRoot(), RouterTestingModule],
        providers: [
          {provide: JourneyService, useValue: journeyServiceSpy},
          {provide: Router, useValue: routerSpy},
          {provide: ActivatedRoute, useValue: activatedRouteSpy},
          {provide: SharedUtilityService, useValue: sharedUtilityServiceSpy},
          {provide: PlatformService, useValue: platformServiceSpy},
        ],
      }).compileComponents();

      fixture = TestBed.createComponent(SummaryComponent);
      component = fixture.componentInstance;
      setRevisitButtonSpy = spyOn(component, 'setRevisitButton');
      processStepsSpy = spyOn(component, 'processSteps');
      component.journey = {
        journeyID: 1,
        journeyName: 'JourneyName',
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
            footnoteText: '* The amount saved in taxes will vary',
          },
        },
        steps: [
          {
            journeyStepName: '1',
            journeyStepCMSTagId: 'tagId1',
            msgType: 'msgType1',
            answer: 'answer1',
          },
          {
            journeyStepName: '2',
            journeyStepCMSTagId: 'tagId2',
            msgType: 'msgType2',
            status: Status.inProgress,
            answer: 'answer2',
          },
          {
            journeyStepName: '5',
            journeyStepCMSTagId: 'tagId5',
            msgType: 'msgType5',
            status: Status.completed,
          },
        ],
      };
      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnChanges', () => {
    beforeEach(() => {
      spyOn(component, 'updateForJourney');
    });

    it('should updateForJourney if journey changed', () => {
      component.ngOnChanges({
        journey: {
          previousValue: {},
          currentValue: {},
          isFirstChange: undefined,
          firstChange: false,
        },
      });
      expect(component.updateForJourney).toHaveBeenCalled();
    });

    it('should not updateForJourney if journey did not change', () => {
      component.ngOnChanges({});
      expect(component.updateForJourney).not.toHaveBeenCalled();
    });
  });

  describe('updateForJourney', () => {
    it('should empty the summaryStepList', () => {
      component.summaryStepList = [
        {
          journeyStepName: '1',
          header: 'You want to retire at:',
          elements: [
            {
              id: 'imageWithValue',
              answerId: 'retirementAge',
            },
          ],
          answer: {answer: 'answer1'},
          stepContent: undefined,
          status: undefined,
        },
      ];
      component.updateForJourney();
      expect(component.summaryStepList).toEqual([]);
    });

    it('should call setRevisitButton', () => {
      component.updateForJourney();
      expect(setRevisitButtonSpy).toHaveBeenCalled();
    });

    it('should call processSteps', () => {
      component.updateForJourney();
      expect(processStepsSpy).toHaveBeenCalled();
    });

    it('should set the value according to the summary answer in the first step', () => {
      const answer = 'answer';
      component.journey.steps[0].answer = answer;
      const summaryAnswerString = 'summaryAnswer';
      const summaryAnswerValue = {answer1: 'abc'};
      journeyServiceSpy.safeParse.and.callFake(val => {
        if (val === answer) {
          return {summary: summaryAnswerString};
        } else {
          return summaryAnswerValue;
        }
      });
      component.value = undefined;
      component.updateForJourney();
      expect(journeyServiceSpy.safeParse).toHaveBeenCalledWith(answer);
      expect(journeyServiceSpy.safeParse).toHaveBeenCalledWith(
        summaryAnswerString
      );
      expect(component.value).toEqual(summaryAnswerValue);
    });

    it('should set the value to {} if there is no answer', () => {
      component.journey.steps[0].answer = undefined;
      journeyServiceSpy.safeParse.and.returnValue(undefined);
      component.value = undefined;
      component.updateForJourney();
      expect(component.value).toEqual({});
    });
  });

  describe('setRevisitButton', () => {
    beforeEach(() => {
      setRevisitButtonSpy.and.callThrough();
      journeyServiceSpy.getJourneyStatus.and.returnValue(Status.completed);
      activatedRouteSpy.snapshot.paramMap.get.and.returnValue('true');
      spyOn(component, 'changingBtnLabel');
      component.journeyType = undefined;
      spyOn(component.subscription, 'add');
    });

    it('When isWeb would be false', () => {
      component.isWeb = false;
      component.setRevisitButton();
      expect(component.changingBtnLabel).toHaveBeenCalledWith(
        Status.completed,
        'true'
      );
      expect(component.journeyType).toEqual(undefined);
      expect(component.subscription.add).not.toHaveBeenCalled();
    });

    it('When isWeb would be true', () => {
      component.isWeb = true;
      component.setRevisitButton();
      expect(component.changingBtnLabel).toHaveBeenCalled();
      expect(component.journeyType).toEqual('all');
      expect(component.subscription.add).toHaveBeenCalled();
    });
  });

  describe('changingBtnLabel', () => {
    it('should set to revisit button if all steps completed and fromJourneys is true', () => {
      component.showRevisit = false;
      component.buttonLabel = undefined;
      component.changingBtnLabel(Status.completed, 'true');
      expect(component.showRevisit).toBeTrue();
      expect(component.buttonLabel).toEqual("Let's Revisit!");
    });

    it('should set to done button if all steps completed but fromJourneys is null', () => {
      component.showRevisit = false;
      component.buttonLabel = 'Done';
      component.changingBtnLabel(Status.completed, null);
      expect(component.showRevisit).toBeFalse();
      expect(component.buttonLabel).toEqual('Done');
    });

    it('should set to done button if all steps not completed', () => {
      component.showRevisit = false;
      component.buttonLabel = 'Done';
      component.changingBtnLabel(Status.inProgress, 'true');
      expect(component.showRevisit).toBeFalse();
      expect(component.buttonLabel).toEqual('Done');
    });
  });

  describe('processSteps', () => {
    beforeEach(() => {
      processStepsSpy.and.callThrough();
      component.summaryStepList = [];
    });

    it('should set the summaryStepList', () => {
      journeyServiceSpy.safeParse.and.callFake(str => {
        return {answer: str};
      });
      component.processSteps();
      expect(component.summaryStepList).toEqual([
        {
          journeyStepName: '1',
          header: 'You want to retire at:',
          idSuffix: '0',
          elements: [
            {
              id: 'imageWithValue',
              answerId: 'retirementAge',
            },
          ],
          answer: {answer: 'answer1'},
          stepContent: undefined,
          status: undefined,
        },
        {
          journeyStepName: '5',
          header: 'Your Retirement Progress',
          idSuffix: '1',
          elements: [
            {
              id: 'orangeMoney',
            },
          ],
          status: Status.completed,
          stepContent: undefined,
          answer: {answer: undefined},
        },
        {
          journeyStepName: '2',
          header: "Here's what's most important to you:",
          idSuffix: '2',
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
          answer: {answer: 'answer2'},
          status: Status.inProgress,
          stepContent: undefined,
        },
      ]);
    });
    it('should not set the content, answer and status if the step has no journeyStepName', () => {
      component.journey.parsedLandingAndOverviewContent.overview.summarySteps = [
        {
          header: 'You want to retire at:',
          elements: [
            {
              id: 'imageWithValue',
              answerId: 'retirementAge',
            },
          ],
        },
        {
          header: 'Your Retirement Progress',
          elements: [
            {
              id: 'orangeMoney',
            },
          ],
        },
        {
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
      ];

      component.processSteps();
      expect(component.summaryStepList).toEqual([
        {
          header: 'You want to retire at:',
          idSuffix: '0',
          elements: [
            {
              id: 'imageWithValue',
              answerId: 'retirementAge',
            },
          ],
        },
        {
          header: 'Your Retirement Progress',
          idSuffix: '1',
          elements: [
            {
              id: 'orangeMoney',
            },
          ],
        },
        {
          header: "Here's what's most important to you:",
          idSuffix: '2',
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
      ]);
    });
  });

  describe('handleButtonClick', () => {
    describe('should route to steps if showRevisit is true', () => {
      beforeEach(() => {
        component.showRevisit = true;
      });
      it('if isWeb would be false', () => {
        component.handleButtonClick();
        expect(routerSpy.navigateByUrl).toHaveBeenCalledWith(
          '/journeys/journey/1/steps'
        );
      });
      it('if isWeb is true', () => {
        component.journeyType = 'all';
        component.isWeb = true;
        component.handleButtonClick();
        expect(routerSpy.navigate).toHaveBeenCalledWith(
          ['/journeys/journey/1/steps'],
          {
            queryParams: {journeyType: component.journeyType},
          }
        );
        expect(component.showRevisit).toEqual(false);
        expect(component.buttonLabel).toEqual(
          component.content.overviewDoneButton
        );
      });
    });

    describe('should route to journeys tab if showRevisit is false', () => {
      beforeEach(() => {
        component.showRevisit = false;
      });
      it('if isWeb would be false', () => {
        component.isWeb = false;
        component.handleButtonClick();
        expect(routerSpy.navigateByUrl).toHaveBeenCalledWith('/journeys');
      });
      it('if isWeb is true and isDesktop would be false', () => {
        component.isWeb = true;
        component.isDesktop = false;
        component.handleButtonClick();
        expect(routerSpy.navigateByUrl).toHaveBeenCalledWith('/journeys-list');
      });
    });
  });

  describe('updateValue', () => {
    it('should update the value and emit it', () => {
      component.value = {answer1: 'abc'};
      spyOn(component.valueChange, 'emit');
      const expectedValue = {answer1: 'abc', answer2: '123'};
      component.updateValue('123', 'answer2');
      expect(component.value).toEqual(expectedValue);
      expect(component.valueChange.emit).toHaveBeenCalledWith(
        JSON.stringify(expectedValue)
      );
    });
  });

  it('ngOnDestroy', () => {
    spyOn(component.subscription, 'unsubscribe');
    component.ngOnDestroy();
    expect(component.subscription.unsubscribe).toHaveBeenCalled();
  });
});

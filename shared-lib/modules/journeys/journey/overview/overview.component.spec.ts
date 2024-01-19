import {Component, Input} from '@angular/core';
import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {RouterTestingModule} from '@angular/router/testing';
import {IonicModule} from '@ionic/angular';
import {FooterType} from '@shared-lib/modules/footer/constants/footerType.enum';
import {FooterTypeService} from '@shared-lib/modules/footer/services/footer-type/footer-type.service';
import {Journey} from '@shared-lib/services/journey/models/journey.model';
import {JourneyService} from '@shared-lib/services/journey/journey.service';
import {OverviewComponent} from './overview.component';
import {SharedUtilityService} from '@shared-lib/services/utility/utility.service';
import {of} from 'rxjs';
import {eventKeys} from '@shared-lib/constants/event-keys';
import {EventManagerService} from '@shared-lib/modules/event-manager/event-manager/event-manager.service';

@Component({selector: 'journeys-overview-introduction', template: ''})
class MockJourneyOverviewIntroductionComponent {
  @Input() journey;
}

@Component({selector: 'journeys-overview-summary', template: ''})
class MockJourneyOverviewSummaryComponent {
  @Input() journey;
}

describe('OverviewComponent', () => {
  let component: OverviewComponent;
  let fixture: ComponentFixture<OverviewComponent>;
  let journeyServiceSpy;
  let journey: Journey;
  let setShowSummarySpy;
  let footerTypeServiceSpy;
  let sharedUtilityServiceSpy;
  let saveValueSpy;
  let originalSaveValue;
  let eventManagerServiceSpy;
  let leaveJourney$;

  beforeEach(
    waitForAsync(() => {
      journey = {
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
          },
        },
        steps: [
          {
            journeyStepName: '1',
            journeyStepCMSTagId: 'tagId1',
            msgType: 'msgTyp1',
          },
          {
            journeyStepName: '2',
            journeyStepCMSTagId: 'tagId2',
            msgType: 'msgTyp2',
          },
        ],
      };
      journeyServiceSpy = jasmine.createSpyObj('JourneyService', [
        'getCurrentJourney',
        'isSummaryStepCompleted',
        'publishSelectedTab',
        'getAddAccount',
        'setAddAccount',
        'safeParse',
        'updateJourneySteps',
        'saveProgress',
        'removeContent',
      ]);
      journeyServiceSpy.getCurrentJourney.and.returnValue(journey);
      footerTypeServiceSpy = jasmine.createSpyObj('FooterTypeService', [
        'publish',
      ]);
      sharedUtilityServiceSpy = jasmine.createSpyObj('SharedUtilityService', [
        'getIsWeb',
      ]);
      eventManagerServiceSpy = jasmine.createSpyObj('EventManagerService', [
        'createSubscriber',
      ]);
      leaveJourney$ = of();
      eventManagerServiceSpy.createSubscriber.and.returnValue(leaveJourney$);
      TestBed.configureTestingModule({
        declarations: [
          OverviewComponent,
          MockJourneyOverviewIntroductionComponent,
          MockJourneyOverviewSummaryComponent,
        ],

        imports: [IonicModule.forRoot(), RouterTestingModule],
        providers: [
          {provide: JourneyService, useValue: journeyServiceSpy},
          {provide: FooterTypeService, useValue: footerTypeServiceSpy},
          {provide: SharedUtilityService, useValue: sharedUtilityServiceSpy},
          {provide: EventManagerService, useValue: eventManagerServiceSpy},
        ],
      }).compileComponents();

      fixture = TestBed.createComponent(OverviewComponent);
      component = fixture.componentInstance;
      setShowSummarySpy = spyOn(component, 'setShowSummary');
      fixture.detectChanges();
      saveValueSpy = jasmine.createSpy();
      originalSaveValue = component['saveValue'];
      component['saveValue'] = saveValueSpy;
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should set is web', () => {
      component.isWeb = false;
      sharedUtilityServiceSpy.getIsWeb.and.returnValue(true);
      component.ngOnInit();
      expect(sharedUtilityServiceSpy.getIsWeb).toHaveBeenCalled();
      expect(component.isWeb).toEqual(true);
    });

    it('should subscribe to leaveJourney event and call saveValue', () => {
      const sub = jasmine.createSpyObj('Subscription', ['']);
      spyOn(component['leaveJourney$'], 'subscribe').and.callFake(f => {
        f();
        return sub;
      });
      spyOn(component['subscription'], 'add');
      component['leaveJourney$'] = undefined;
      component.ngOnInit();
      expect(eventManagerServiceSpy.createSubscriber).toHaveBeenCalledWith(
        eventKeys.leaveJourney
      );
      expect(component['leaveJourney$']).toEqual(leaveJourney$);
      expect(component['subscription'].add).toHaveBeenCalledWith(sub);
      expect(leaveJourney$.subscribe).toHaveBeenCalled();
      expect(saveValueSpy).toHaveBeenCalled();
    });
  });

  describe('ionViewWillEnter', () => {
    it('should publish the footer type when isWeb would be true', () => {
      component.isWeb = true;
      component.ionViewWillEnter();
      expect(footerTypeServiceSpy.publish).toHaveBeenCalledWith({
        type: FooterType.tabsnav,
        selectedTab: 'journeys-list',
      });
    });

    it('should publish the footer type when isWeb would be false', () => {
      component.isWeb = false;
      component.ionViewWillEnter();
      expect(footerTypeServiceSpy.publish).toHaveBeenCalledWith({
        type: FooterType.tabsnav,
        selectedTab: 'journeys',
      });
    });

    it('should publish the selectedTab', () => {
      component.ionViewWillEnter();
      expect(journeyServiceSpy.publishSelectedTab).toHaveBeenCalledWith(
        'overview'
      );
    });

    it('should get the current journey from the service', () => {
      component.ionViewWillEnter();
      expect(journeyServiceSpy.getCurrentJourney).toHaveBeenCalled();
      expect(component.journey).toEqual(journey);
    });

    it('should call setShowSummary', () => {
      component.ionViewWillEnter();
      expect(component.setShowSummary).toHaveBeenCalled();
    });
  });

  describe('setShowSummary', () => {
    beforeEach(() => {
      setShowSummarySpy.and.callThrough();
    });

    it('should call journeyService isSummaryStepCompleted and set showSummary to the result', () => {
      component.showSummary = false;
      journeyServiceSpy.isSummaryStepCompleted.and.returnValue(true);
      component.setShowSummary();
      expect(journeyServiceSpy.isSummaryStepCompleted).toHaveBeenCalled();
      expect(component.showSummary).toBeTrue();
    });
  });

  describe('updateValue', () => {
    it('should set the value', () => {
      component['value'] = undefined;
      const value = 'value';
      component.updateValue(value);
      expect(component['value']).toEqual(value);
    });
  });

  describe('saveValue', () => {
    beforeEach(() => {
      component['saveValue'] = originalSaveValue;
      journeyServiceSpy.safeParse.and.returnValue({});
    });

    it('should not parse the answer if there is no value', () => {
      component['value'] = undefined;
      component.journey = journey;
      component.journey.steps[0].answer = 'answer';
      component['saveValue']();
      expect(journeyServiceSpy.safeParse).not.toHaveBeenCalled();
    });

    it('should parse the answer if there is a value', () => {
      component['value'] = 'value';
      component.journey = journey;
      component.journey.steps[0].answer = 'answer';
      component['saveValue']();
      expect(journeyServiceSpy.safeParse).toHaveBeenCalledWith('answer');
    });

    it('should save the updated answer with the existing answer if it already exists', () => {
      component['value'] = 'value';
      component.journey = journey;
      component.journey.steps[0].answer = 'answer';
      const content = {
        pageElements: [{elements: [{id: 'input'}]}],
      };
      component.journey.steps[0].content = content;
      const step0 = {
        journeyStepName: '1',
        journeyStepCMSTagId: 'tagId1',
        msgType: 'msgTyp1',
        value: {answer1: '123', answer2: 'abc', summary: 'value'},
        answer: JSON.stringify({
          answer1: '123',
          answer2: 'abc',
          summary: 'value',
        }),
      };
      journeyServiceSpy.removeContent.and.callFake(() => step0);
      const existingValue = {answer1: '123', answer2: 'abc'};
      journeyServiceSpy.safeParse.and.returnValue(existingValue);
      component['saveValue']();

      expect(journeyServiceSpy.updateJourneySteps).toHaveBeenCalledWith(
        [
          {...step0, content: content},
          {
            journeyStepName: '2',
            journeyStepCMSTagId: 'tagId2',
            msgType: 'msgTyp2',
          },
        ],
        1
      );
      expect(journeyServiceSpy.removeContent).toHaveBeenCalledWith({
        ...step0,
        content: content,
      });
      expect(journeyServiceSpy.saveProgress).toHaveBeenCalledWith([step0]);
    });

    it('should save the updated answer as a new answer if no answer exists', () => {
      component['value'] = 'value';
      component.journey = journey;
      const content = {
        pageElements: [{elements: [{id: 'input'}]}],
      };
      component.journey.steps[0].content = content;
      const step0 = {
        journeyStepName: '1',
        journeyStepCMSTagId: 'tagId1',
        msgType: 'msgTyp1',
        value: {summary: 'value'},
        answer: JSON.stringify({
          summary: 'value',
        }),
      };
      journeyServiceSpy.removeContent.and.callFake(() => step0);
      component['saveValue']();
      expect(journeyServiceSpy.saveProgress).toHaveBeenCalledWith([step0]);
    });
  });

  describe('ionViewWillLeave', () => {
    it('should call saveValue', () => {
      component.ionViewWillLeave();
      expect(saveValueSpy).toHaveBeenCalled();
    });
  });

  describe('ngOnDestroy', () => {
    it('should call saveValue', () => {
      spyOn(component['subscription'], 'unsubscribe');
      component.ngOnDestroy();
      expect(component['subscription'].unsubscribe).toHaveBeenCalled();
    });
  });
});

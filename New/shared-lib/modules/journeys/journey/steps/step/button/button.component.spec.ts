import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {IonicModule} from '@ionic/angular';
import {ButtonComponent} from './button.component';
import {SharedUtilityService} from '@shared-lib/services/utility/utility.service';
import {Router} from '@angular/router';
import {Journey} from '@shared-lib/services/journey/models/journey.model';
import {JourneyService} from '@shared-lib/services/journey/journey.service';

describe('ButtonComponent', () => {
  let component: ButtonComponent;
  let fixture: ComponentFixture<ButtonComponent>;
  let utilityServiceSpy;
  let routerSpy;
  let journeyServiceSpy;
  let journey: Journey;

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
      utilityServiceSpy = jasmine.createSpyObj('utilityServiceSpy', [
        'getIsWeb',
      ]);
      routerSpy = jasmine.createSpyObj('Router', ['navigateByUrl', 'navigate']);
      journeyServiceSpy = jasmine.createSpyObj('JourneyService', [
        'getCurrentJourney',
        'setAddAccount',
        'openMxAccModal',
      ]);
      journeyServiceSpy.getCurrentJourney.and.returnValue(journey);
      TestBed.configureTestingModule({
        declarations: [ButtonComponent],
        imports: [IonicModule.forRoot()],
        providers: [
          {provide: SharedUtilityService, useValue: utilityServiceSpy},
          {provide: Router, useValue: routerSpy},
          {provide: JourneyService, useValue: journeyServiceSpy},
        ],
      }).compileComponents();

      fixture = TestBed.createComponent(ButtonComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    beforeEach(() => {
      component.isWeb = false;
    });
    it('When isWeb would be true', () => {
      utilityServiceSpy.getIsWeb.and.returnValue(true);
      component.ngOnInit();
      expect(utilityServiceSpy.getIsWeb).toHaveBeenCalled();
      expect(component.isWeb).toEqual(true);
    });
    it('When isWeb would be false', () => {
      utilityServiceSpy.getIsWeb.and.returnValue(false);
      component.ngOnInit();
      expect(component.isWeb).toEqual(false);
    });
  });

  describe('handleClick', () => {
    beforeEach(() => {
      spyOn(component.continueClick, 'emit');
    });

    it('should emit continueClick if there is no link', () => {
      component.link = undefined;
      component.handleClick();
      expect(component.continueClick.emit).toHaveBeenCalledWith({route: true});
    });

    it('should emit continueClick if link is default', () => {
      component.link = 'default';
      component.handleClick();
      expect(component.continueClick.emit).toHaveBeenCalledWith({route: true});
    });

    it('should not emit continueClick if link is set and is not default or mxAddAccount', () => {
      component.link = 'notDefault';
      component.handleClick();
      expect(component.continueClick.emit).not.toHaveBeenCalled();
    });

    it('should emit continueClick if there link as mxAddAccount if !isWeb', () => {
      component.isWeb = false;
      component.link = 'mxAddAccount';
      component.handleClick();
      expect(journeyServiceSpy.setAddAccount).toHaveBeenCalledWith('true');
      expect(routerSpy.navigate).toHaveBeenCalledWith(
        ['account/add-accounts'],
        {
          queryParams: {backRoute: '/journeys/journey/1/overview'},
        }
      );
      expect(component.continueClick.emit).toHaveBeenCalledWith({route: false});
    });

    it('should emit continueClick if there link as mxAddAccount if isWeb', () => {
      component.isWeb = true;
      component.link = 'mxAddAccount';
      component.handleClick();
      expect(journeyServiceSpy.openMxAccModal).toHaveBeenCalled();
    });

    it('should emit continueClick with route false and save true if link is save', () => {
      component.link = 'save';
      component.handleClick();
      expect(component.continueClick.emit).toHaveBeenCalledWith({
        route: false,
        save: true,
      });
    });
  });

  describe('handleBackClick', () => {
    it('should emit the backClick event', () => {
      spyOn(component.backClick, 'emit');
      component.handleBackClick();
      expect(component.backClick.emit).toHaveBeenCalled();
    });
  });
});

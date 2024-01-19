import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {IonicModule} from '@ionic/angular';
import {RouterTestingModule} from '@angular/router/testing';
import {RecommendedJourneyComponent} from './recommended-journey.component';
import {JourneyService} from '@shared-lib/services/journey/journey.service';
import {AccessService} from '@shared-lib/services/access/access.service';
import {Router} from '@angular/router';
import {ContentService} from '../../services/content/content.service';
import {of, Subscription} from 'rxjs';
import {Status} from '@shared-lib/constants/status.enum';

describe('RecommendedJourneyComponent', () => {
  let component: RecommendedJourneyComponent;
  let fixture: ComponentFixture<RecommendedJourneyComponent>;
  let journeyServiceSpy;
  let accessServiceSpy;
  let contentServiceSpy;
  let routerSpy;
  let fetchJourneyCardContentSpy;
  const mockJourneyData = {
    flags: {},
    all: [],
    recommended: [
      {
        journeyID: 1,
        journeyName: 'Adding to your family',
        lastModifiedStepIndex: 0,
        landingAndOverviewContent: '',
        resourcesContent: '',
        status: Status.inProgress,
        buttonText: '',
        steps: [
          {
            journeyStepId: 1,
            followingStep: 2,
            journeyStepName: 'when_do_you_want_to_retire',
            journeyStepCMSTagId: 'MVRetirementStep1JSON',
            msgType: 'journeyretirementsteps',
          },
        ],
      },
    ],
  };

  const mockLeftSlideData = {
    SuggestedLifeEventHeader:
      '{"journeyHeader":"Suggested Life Event","journeyInProgressButton":"Continue", "journeyNotStartedButton":"Lets Go"}',
  };

  beforeEach(
    waitForAsync(() => {
      journeyServiceSpy = jasmine.createSpyObj('journeyServiceSpy', [
        'getJourneyStatus',
        'fetchJourneys',
      ]);
      journeyServiceSpy.fetchJourneys.and.returnValue({
        pipe: jasmine.createSpy().and.returnValue(of(null)),
      });
      journeyServiceSpy.getJourneyStatus.and.returnValue(Status.notStarted);
      accessServiceSpy = jasmine.createSpyObj('checkWorkplaceAccess', [
        'checkWorkplaceAccess',
      ]);
      accessServiceSpy.checkWorkplaceAccess.and.returnValue(
        Promise.resolve({myWorkplaceDashboardEnabled: true})
      );
      routerSpy = jasmine.createSpyObj('router', ['navigateByUrl']);
      contentServiceSpy = jasmine.createSpyObj('contentServiceSpy', [
        'getLeftSideContent',
      ]);
      contentServiceSpy.getLeftSideContent.and.returnValue({
        subscribe: () => undefined,
      });
      TestBed.configureTestingModule({
        declarations: [RecommendedJourneyComponent],
        imports: [RouterTestingModule, IonicModule.forRoot()],
        providers: [
          {provide: JourneyService, useValue: journeyServiceSpy},
          {provide: AccessService, useValue: accessServiceSpy},
          {
            provide: ContentService,
            useValue: contentServiceSpy,
          },
          {provide: Router, useValue: routerSpy},
        ],
      }).compileComponents();
      fixture = TestBed.createComponent(RecommendedJourneyComponent);
      component = fixture.componentInstance;
      fetchJourneyCardContentSpy = spyOn(component, 'fetchJourneyCardContent');
      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    beforeEach(() => {
      spyOn(component['subscription'], 'add');
    });
    describe('when recommended journey will be in there', () => {
      let observable;
      let subscription;
      beforeEach(() => {
        observable = of(mockJourneyData.recommended[0]);
        subscription = new Subscription();
        spyOn(observable, 'subscribe').and.callFake(f => {
          f(mockJourneyData.recommended);
          return subscription;
        });
        spyOn(component, 'fetchRecommendedJourney').and.returnValue(observable);
      });
      it('when myWorkplaceDashboardEnabled will be true', () => {
        component.myWorkplaceDashboardEnabled = true;
        component.ngOnInit();
        expect(component.fetchRecommendedJourney).toHaveBeenCalled();
        expect(component['subscription'].add).toHaveBeenCalledWith(
          subscription
        );
        expect(component.recommendedJourneys).toEqual(
          mockJourneyData.recommended
        );
        expect(journeyServiceSpy.getJourneyStatus).toHaveBeenCalledWith(
          mockJourneyData.recommended[0].steps
        );
        expect(component.myWorkplaceDashboardEnabled).toEqual(true);
        expect(component.fetchJourneyCardContent).toHaveBeenCalled();
      });
      it('when myWorkplaceDashboardEnabled will be false', () => {
        component.myWorkplaceDashboardEnabled = false;
        component.ngOnInit();
        expect(component.myWorkplaceDashboardEnabled).toEqual(false);
        expect(component.fetchJourneyCardContent).toHaveBeenCalled();
      });
    });
    it('when recommended journey will be null', () => {
      spyOn(component, 'fetchRecommendedJourney').and.returnValue(of(null));
      component.ngOnInit();
      expect(journeyServiceSpy.getJourneyStatus).not.toHaveBeenCalled();
      expect(component.fetchJourneyCardContent).not.toHaveBeenCalled();
    });
  });

  describe('fetchRecommendedJourney', () => {
    beforeEach(() => {
      accessServiceSpy.checkWorkplaceAccess.and.returnValue(
        Promise.resolve({myWorkplaceDashboardEnabled: true})
      );
    });

    it('when recommended journey will be in there', done => {
      journeyServiceSpy.fetchJourneys.and.returnValue(of(mockJourneyData));
      component.fetchRecommendedJourney().subscribe(data => {
        expect(data).toEqual(mockJourneyData.recommended);
        expect(component.myWorkplaceDashboardEnabled).toEqual(true);
        expect(accessServiceSpy.checkWorkplaceAccess).toHaveBeenCalled();
        done();
      });
    });

    it('when recommended journey will be null', done => {
      journeyServiceSpy.fetchJourneys.and.returnValue(
        of({flags: {}, all: [], recommended: []})
      );
      component.fetchRecommendedJourney().subscribe(data => {
        expect(data).toEqual(null);
        done();
      });
    });
  });

  describe('fetchJourneyCardContent', () => {
    let observable;
    let subscription;
    const mockData = {
      ...{
        suggestedLifeEventHeader: JSON.parse(
          mockLeftSlideData.SuggestedLifeEventHeader
        ),
      },
    };

    beforeEach(() => {
      component.jouryneyButton = undefined;
      fetchJourneyCardContentSpy.and.callThrough();
      observable = of(mockData);
      subscription = new Subscription();
      spyOn(component['subscription'], 'add');
      spyOn(observable, 'subscribe').and.callFake(f => {
        f(mockData);
        return subscription;
      });
      contentServiceSpy.getLeftSideContent.and.returnValue(observable);
    });

    describe('when myWorkplaceDashboardEnabled will be true', () => {
      beforeEach(() => {
        component.myWorkplaceDashboardEnabled = true;
        component.jouryneyButton = undefined;
      });
      it('when journey staus is In progress', async () => {
        await component.fetchJourneyCardContent(mockJourneyData.recommended[0]);
        expect(contentServiceSpy.getLeftSideContent).toHaveBeenCalled();
        expect(component.journeyHeader).toEqual('Suggested Life Event');
        expect(component['subscription'].add).toHaveBeenCalledWith(
          subscription
        );
      });
      it('when journey staus is Not started', async () => {
        const mockDataJourneyNotStarted = {
          flags: {},
          all: [],
          recommended: [
            {
              journeyID: 1,
              journeyName: 'Adding to your family',
              lastModifiedStepIndex: 0,
              landingAndOverviewContent: '',
              resourcesContent: '',
              status: Status.notStarted,
              buttonText: ' Continue',
              steps: [
                {
                  journeyStepId: 1,
                  followingStep: 2,
                  journeyStepName: 'when_do_you_want_to_retire',
                  journeyStepCMSTagId: 'MVRetirementStep1JSON',
                  msgType: 'journeyretirementsteps',
                },
              ],
            },
          ],
        };
        const result = await component.fetchJourneyCardContent(
          mockDataJourneyNotStarted.recommended[0]
        );
        expect(result).toEqual('Lets Go');
      });
      it('when journey staus is Completed', async () => {
        const mockDataJourneyCompleted = {
          flags: {},
          all: [],
          recommended: [
            {
              journeyID: 1,
              journeyName: 'Adding to your family',
              lastModifiedStepIndex: 0,
              landingAndOverviewContent: '',
              resourcesContent: '',
              status: Status.completed,
              buttonText: ' Continue',
              steps: [
                {
                  journeyStepId: 1,
                  followingStep: 2,
                  journeyStepName: 'when_do_you_want_to_retire',
                  journeyStepCMSTagId: 'MVRetirementStep1JSON',
                  msgType: 'journeyretirementsteps',
                },
              ],
            },
          ],
        };
        const result = await component.fetchJourneyCardContent(
          mockDataJourneyCompleted.recommended[0]
        );
        expect(result).toEqual(undefined);
      });
    });

    it('when myWorkplaceDashboardEnabled is false', async () => {
      component.jouryneyButton = 'Continue';
      component.myWorkplaceDashboardEnabled = false;
      const result = await component.fetchJourneyCardContent(
        mockJourneyData.recommended[0]
      );
      expect(result).toEqual('Continue');
    });
  });

  describe('navigateToRecommendedJourney', () => {
    it('should call navigateByUrl and router to journey', () => {
      component.navigateToRecommendedJourney();
      expect(routerSpy.navigateByUrl).toHaveBeenCalledWith('/journeys');
    });
  });

  describe('ngOnDestroy', () => {
    beforeEach(() => {
      spyOn(component['subscription'], 'unsubscribe');
    });
    it('should call unsubscribe', () => {
      component.ngOnDestroy();
      expect(component['subscription'].unsubscribe).toHaveBeenCalled();
    });
  });
});

import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {ActivatedRoute, Router} from '@angular/router';
import {IonicModule, ModalController} from '@ionic/angular';
import {JourneyService} from '@shared-lib/services/journey/journey.service';
import {RevisitJourneyComponent} from './revisit-journey.component';
import {of} from 'rxjs';

describe('RevisitJourneyComponent', () => {
  let component: RevisitJourneyComponent;
  let fixture: ComponentFixture<RevisitJourneyComponent>;
  let modalControllerSpy;
  let router;
  let journeyServiceSpy;
  let activatedRouteSpy;
  let mockJourney;

  beforeEach(
    waitForAsync(() => {
      modalControllerSpy = jasmine.createSpyObj('ModalController', ['dismiss']);
      journeyServiceSpy = jasmine.createSpyObj('JourneyService', [
        'getCurrentJourney',
        'isRecommendedJourney',
      ]);
      activatedRouteSpy = jasmine.createSpy('ActivatedRoute');

      mockJourney = {
        journeyID: 1,
        landingAndOverviewContent:
          '{"intro":{"header":"Preparing for retirement","message":"It\'s a good time to think about the next phase of your life. Find out how to get organized and take actionable steps to prepare for retirement.","imgUrl":"assets/icon/journeys/In_Company.svg"},"overview":{"header":"Preparing for retirement","message":"It\'s a good time to think about the next phase of your life. Find out how to get organized and take actionable steps to prepare for retirement.","imgUrl":"assets/icon/journeys/In_Company.svg","summarySteps":[]}}',
        resourcesContent: '',
        steps: [],
      };

      router = {
        navigateByUrl: jasmine.createSpy('navigate'),
      };
      TestBed.configureTestingModule({
        declarations: [RevisitJourneyComponent],
        imports: [IonicModule.forRoot()],
        providers: [
          {provide: ModalController, useValue: modalControllerSpy},
          {provide: Router, useValue: router},
          {provide: JourneyService, useValue: journeyServiceSpy},
          {provide: ActivatedRoute, useValue: activatedRouteSpy},
        ],
      }).compileComponents();

      fixture = TestBed.createComponent(RevisitJourneyComponent);
      component = fixture.componentInstance;
      journeyServiceSpy.getCurrentJourney.and.returnValue(mockJourney);

      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('goToSteps', () => {
    describe('when journeyType is not in route params', () => {
      beforeEach(() => {
        activatedRouteSpy.queryParams = of({});
      });

      it('should call isRecommendedJourney to get journeyType if not in query params, also setting journeyType to recommended if recommended', async () => {
        journeyServiceSpy.isRecommendedJourney.and.returnValue(true);

        await component.goToSteps();

        expect(journeyServiceSpy.isRecommendedJourney).toHaveBeenCalledWith(
          mockJourney
        );
        expect(router.navigateByUrl).toHaveBeenCalledWith(
          '/journeys/journey/1/steps?journeyType=recommended'
        );
      });

      it('should call isRecommendedJourney to get journeyType if not in query params, also setting journeyType to all if all', async () => {
        journeyServiceSpy.isRecommendedJourney.and.returnValue(false);

        await component.goToSteps();

        expect(journeyServiceSpy.isRecommendedJourney).toHaveBeenCalledWith(
          mockJourney
        );
        expect(router.navigateByUrl).toHaveBeenCalledWith(
          '/journeys/journey/1/steps?journeyType=all'
        );
      });
    });

    describe('when journeyType is in route params', () => {
      beforeEach(() => {
        activatedRouteSpy.queryParams = of({
          journeyType: 'all',
        });
      });

      it('should get the current journey from the service', async () => {
        await component.goToSteps();
        expect(journeyServiceSpy.getCurrentJourney).toHaveBeenCalled();
      });

      it('should close modal on click', async () => {
        await component.goToSteps();
        expect(modalControllerSpy.dismiss).toHaveBeenCalled();
      });

      it('should navigate to journey steps', async () => {
        await component.goToSteps();
        expect(router.navigateByUrl).toHaveBeenCalledWith(
          '/journeys/journey/1/steps?journeyType=all'
        );
      });
    });
  });

  describe('closeInfoDialog', () => {
    it('should close modal on click', () => {
      component.closeInfoDialog();
      expect(modalControllerSpy.dismiss).toHaveBeenCalled();
    });
  });
});

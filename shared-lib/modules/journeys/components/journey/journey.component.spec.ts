import {Component, Input} from '@angular/core';
import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {By} from '@angular/platform-browser';
import {Router} from '@angular/router';
import {IonicModule, LoadingController} from '@ionic/angular';
import {Status} from '@shared-lib/constants/status.enum';
import {JourneyService} from '@shared-lib/services/journey/journey.service';
import {JourneyComponent} from './journey.component';
import {SharedUtilityService} from '@shared-lib/services/utility/utility.service';

@Component({selector: 'journeys-status', template: ''})
class MockJourneyStatusComponent {
  @Input() status;
}

describe('JourneyComponent', () => {
  let component: JourneyComponent;
  let fixture: ComponentFixture<JourneyComponent>;
  let journeyServiceSpy;
  let routerSpy;
  let journey;
  let loadingControllerSpy;

  beforeEach(
    waitForAsync(() => {
      journeyServiceSpy = jasmine.createSpyObj('JourneyService', [
        'setCurrentJourney',
        'setStepContent',
        'getJourneyStatus',
        'isComingSoon',
      ]);
      journeyServiceSpy.getJourneyStatus.and.returnValue(Status.inProgress);
      spyOn(SharedUtilityService.prototype, 'getIsWeb').and.returnValue(true);
      routerSpy = jasmine.createSpyObj('routerSpy', [
        'navigate',
        'navigateByUrl',
      ]);
      loadingControllerSpy = jasmine.createSpyObj('LoadingController', [
        'create',
      ]);
      TestBed.configureTestingModule({
        declarations: [JourneyComponent, MockJourneyStatusComponent],
        imports: [IonicModule.forRoot()],
        providers: [
          {
            provide: JourneyService,
            useValue: journeyServiceSpy,
          },
          {
            provide: Router,
            useValue: routerSpy,
          },
          {provide: LoadingController, useValue: loadingControllerSpy},
        ],
      }).compileComponents();

      fixture = TestBed.createComponent(JourneyComponent);
      component = fixture.componentInstance;
      journey = {
        journeyID: 1,
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
      component.journey = journey;
      journeyServiceSpy.isComingSoon.and.returnValue(false);
      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should call journeyService.isComingSoon', () => {
      expect(journeyServiceSpy.isComingSoon).toHaveBeenCalledWith(journey);
    });
    it('should get the step status from the journey service if not coming soon', () => {
      expect(journeyServiceSpy.getJourneyStatus).toHaveBeenCalledWith(
        component.journey.steps
      );
      expect(component.status).toEqual(Status.inProgress);
      expect(component.isComingSoon).toEqual(false);
      expect(component.content).toEqual(
        component.journey.parsedLandingAndOverviewContent
      );
    });

    it('should set isComingSoon to true and not get status if its coming soon', () => {
      journeyServiceSpy.getJourneyStatus.calls.reset();
      component.isComingSoon = false;
      journeyServiceSpy.isComingSoon.and.returnValue(true);
      component.ngOnInit();
      expect(journeyServiceSpy.getJourneyStatus).not.toHaveBeenCalled();
      expect(component.isComingSoon).toEqual(true);
      expect(component.content).toEqual(
        component.journey.parsedComingSoonContent
      );
    });

    it('should call getIsWeb', () => {
      expect(SharedUtilityService.prototype.getIsWeb).toHaveBeenCalled();
      expect(component.isWeb).toEqual(true);
    });
  });

  describe('template', () => {
    it('should display an ion-card ', () => {
      expect(fixture.debugElement.query(By.css('ion-card'))).toBeTruthy();
    });

    it('should display journey header in the card', () => {
      const header = fixture.debugElement.query(
        By.css('ion-card ion-card-header')
      );
      expect(header).toBeTruthy();
      const innerHTML = header.nativeElement.innerHTML.trim();
      const text = innerHTML.split('<journeys-status')[0];
      expect(text).toEqual('Adding to your family');
    });

    it('should display the journey status in the header', () => {
      expect(
        fixture.debugElement.query(
          By.css('ion-card ion-card-header journeys-status')
        )
      ).toBeTruthy();
    });

    it('should display journey desc in the card', () => {
      const desc = fixture.debugElement.query(By.css('ion-card ion-text'));
      expect(desc).toBeTruthy();
      expect(desc.nativeElement.innerHTML.trim()).toEqual(
        'Having a kid changes everything. Learn how to get your finances in order when your family is growing.'
      );
    });

    it('should display journey img in the card', () => {
      const img = fixture.debugElement.query(By.css('ion-card img'));
      expect(img).toBeTruthy();
      expect(img.attributes.src).toEqual(
        'assets/icon/journeys/all/Master_Close_Ups_Family_2.svg'
      );
    });

    it('should call handleJourneyClicked when a journey is clicked', () => {
      spyOn(component, 'handleJourneyClick');
      const journey = fixture.debugElement.query(By.css('ion-card'));
      journey.nativeElement.click();
      expect(component.handleJourneyClick).toHaveBeenCalled();
    });
  });

  describe('handleJourneyClick', () => {
    let loaderSpy;
    beforeEach(() => {
      loaderSpy = jasmine.createSpyObj('Loader', ['present', 'dismiss']);
      loadingControllerSpy.create.and.returnValue(Promise.resolve(loaderSpy));
      component.isComingSoon = false;
    });

    it('should not call setStepContent if coming soon', async () => {
      component.isComingSoon = true;
      await component.handleJourneyClick();
      expect(journeyServiceSpy.setStepContent).not.toHaveBeenCalled();
    });

    it('should call setStepContent if not coming soon', async () => {
      component.isWeb = false;
      await component.handleJourneyClick();
      expect(loadingControllerSpy.create).toHaveBeenCalledWith({
        translucent: true,
      });
      expect(loaderSpy.present).toHaveBeenCalled();
      expect(journeyServiceSpy.setStepContent).toHaveBeenCalled();
      expect(loaderSpy.dismiss).toHaveBeenCalled();
    });

    it('should set the currentJourney in the service if not coming soon', async () => {
      component.isWeb = false;
      await component.handleJourneyClick();
      expect(loadingControllerSpy.create).toHaveBeenCalledWith({
        translucent: true,
      });
      expect(loaderSpy.present).toHaveBeenCalled();
      expect(journeyServiceSpy.setCurrentJourney).toHaveBeenCalledWith(
        component.journey
      );
      expect(loaderSpy.dismiss).toHaveBeenCalled();
    });

    describe('When isWeb would be false', () => {
      beforeEach(() => {
        component.isWeb = false;
      });

      it('should route to the overview page if journey is not started', async () => {
        component.status = Status.notStarted;
        await component.handleJourneyClick();
        expect(routerSpy.navigate).toHaveBeenCalledWith([
          '/journeys/journey/1/overview',
          {fromJourneys: true},
        ]);
      });

      it('should route to the steps page if status is in progress', async () => {
        component.status = Status.inProgress;
        await component.handleJourneyClick();
        expect(routerSpy.navigateByUrl).toHaveBeenCalledWith(
          '/journeys/journey/1/steps'
        );
      });
    });

    describe('When isWeb would be true', () => {
      beforeEach(() => {
        component.isWeb = true;
        component.idPrefix = 'all';
      });

      it('should route to the overview page if journey is not started', async () => {
        component.status = Status.notStarted;
        await component.handleJourneyClick();
        expect(routerSpy.navigate).toHaveBeenCalledWith(
          ['/journeys/journey/1/overview'],
          {
            queryParams: {journeyType: 'all', fromJourneys: true},
          }
        );
      });

      it('should route to the steps page if status is in progress', async () => {
        component.status = Status.inProgress;
        await component.handleJourneyClick();
        expect(routerSpy.navigate).toHaveBeenCalledWith(
          ['/journeys/journey/1/steps'],
          {
            queryParams: {journeyType: 'all'},
          }
        );
      });
    });
  });
});

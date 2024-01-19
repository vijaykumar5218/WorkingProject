import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {Router} from '@angular/router';
import {IonicModule} from '@ionic/angular';
import {JourneyService} from '@shared-lib/services/journey/journey.service';
import {JourneyResponse} from '@shared-lib/services/journey/models/journey.model';
import {of} from 'rxjs';
import {HSANudgeComponent} from './hsa-nudge.component';

describe('HSANudgeComponent', () => {
  let component: HSANudgeComponent;
  let fixture: ComponentFixture<HSANudgeComponent>;
  let routerSpy;
  let journeyServiceSpy;

  beforeEach(
    waitForAsync(() => {
      routerSpy = jasmine.createSpyObj('Router', ['navigateByUrl']);
      journeyServiceSpy = jasmine.createSpyObj('JourneyService', [
        'fetchJourneys',
        'setStepContent',
        'setCurrentJourney',
      ]);
      TestBed.configureTestingModule({
        declarations: [HSANudgeComponent],
        providers: [
          {provide: Router, useValue: routerSpy},
          {provide: JourneyService, useValue: journeyServiceSpy},
        ],
        imports: [IonicModule.forRoot()],
      }).compileComponents();

      fixture = TestBed.createComponent(HSANudgeComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('linkClicked', () => {
    it('should set up some journey stuff and then route to journeys', async () => {
      journeyServiceSpy.fetchJourneys.and.returnValue(
        of({
          all: [
            {
              journeyID: 7,
            },
          ],
        } as JourneyResponse)
      );
      component.journeyId = 7;

      await component.linkClicked();

      expect(journeyServiceSpy.setStepContent).toHaveBeenCalledWith({
        journeyID: 7,
      });
      expect(journeyServiceSpy.setCurrentJourney).toHaveBeenCalledWith({
        journeyID: 7,
      });
      expect(routerSpy.navigateByUrl).toHaveBeenCalledWith(
        '/journeys/journey/7/steps'
      );
    });
  });
});

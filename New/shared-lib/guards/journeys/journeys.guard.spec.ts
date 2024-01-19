import {JourneysGuard} from './journeys.guard';
import {TestBed, waitForAsync} from '@angular/core/testing';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {JourneyService} from '@shared-lib/services/journey/journey.service';
import {of} from 'rxjs/internal/observable/of';
import {JourneyResponse} from '@shared-lib/services/journey/models/journey.model';

describe('JourneysGuard', () => {
  let service: JourneysGuard;
  let journeyServiceSpy;

  beforeEach(
    waitForAsync(() => {
      journeyServiceSpy = jasmine.createSpyObj('JourneyService', [
        'fetchJourneys',
        'setStepContent',
        'setCurrentJourney',
      ]);
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [
          JourneysGuard,
          {provide: JourneyService, useValue: journeyServiceSpy},
        ],
      });
      service = TestBed.inject(JourneysGuard);
    })
  );

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('canActivate', () => {
    it('should call setData', () => {
      spyOn(service, 'setData');
      const dum = jasmine.createSpyObj('ActivatedRouteSnapshot', ['new'], {
        params: {
          id: 2,
        },
      });
      service.canActivate(dum);
      expect(service.setData).toHaveBeenCalledWith(2);
    });
  });
  describe('setData', () => {
    it('should set up some journey stuff', async () => {
      journeyServiceSpy.fetchJourneys.and.returnValue(
        of({
          all: [
            {
              journeyID: 7,
            },
            {
              journeyID: 2,
            },
          ],
        } as JourneyResponse)
      );
      await service.setData(7);
      expect(journeyServiceSpy.setStepContent).toHaveBeenCalledWith({
        journeyID: 7,
      });
      expect(journeyServiceSpy.setCurrentJourney).toHaveBeenCalledWith({
        journeyID: 7,
      });
    });
    it('should not set up some journey stuff', async () => {
      journeyServiceSpy.fetchJourneys.and.returnValue(
        of({
          all: [
            {
              journeyID: 9,
            },
            {
              journeyID: 2,
            },
          ],
        } as JourneyResponse)
      );
      await service.setData(7);
      expect(journeyServiceSpy.setStepContent).not.toHaveBeenCalled();
      expect(journeyServiceSpy.setCurrentJourney).not.toHaveBeenCalled();
    });
  });
});

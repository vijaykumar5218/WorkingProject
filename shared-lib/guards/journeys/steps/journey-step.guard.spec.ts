import {JourneyStepGuard} from './journey-step.guard';
import {TestBed, waitForAsync} from '@angular/core/testing';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {JourneyService} from '@shared-lib/services/journey/journey.service';
import {of} from 'rxjs/internal/observable/of';
import {JourneyResponse} from '@shared-lib/services/journey/models/journey.model';
import {JourneyUtilityService} from '../../../services/journey/journeyUtilityService/journey-utility.service';

describe('JourneyStepGuard', () => {
  let service: JourneyStepGuard;
  let journeyServiceSpy;
  let journeyUtilityServiceSpy;

  beforeEach(
    waitForAsync(() => {
      journeyServiceSpy = jasmine.createSpyObj('JourneyService', [
        'fetchJourneys',
        'isComingSoon',
      ]);
      journeyUtilityServiceSpy = jasmine.createSpyObj('JourneyUtilityService', [
        'routeToFirstJourney',
      ]);
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [
          JourneyStepGuard,
          {provide: JourneyService, useValue: journeyServiceSpy},
          {provide: JourneyUtilityService, useValue: journeyUtilityServiceSpy},
        ],
      });
      service = TestBed.inject(JourneyStepGuard);
    })
  );

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('canActivate', () => {
    it('should call checkComingSoon', async () => {
      service['checkComingSoon'] = jasmine.createSpy().and.returnValue(false);
      const dum = jasmine.createSpyObj('ActivatedRouteSnapshot', [], {
        parent: {
          params: {
            id: 2,
          },
        },
      });
      const result = await service.canActivate(dum);
      expect(service['checkComingSoon']).toHaveBeenCalledWith(2);
      expect(result).toBeFalse();
    });
  });

  describe('checkComingSoon', () => {
    let journeyResponse: JourneyResponse;
    beforeEach(() => {
      journeyResponse = {
        all: [
          {
            journeyID: 9,
          },
          {
            journeyID: 2,
          },
        ],
      } as JourneyResponse;
      journeyServiceSpy.fetchJourneys.and.returnValue(of(journeyResponse));
    });

    it('should allow navigation if journey is not found', async () => {
      const result = await service['checkComingSoon'](6);
      expect(journeyServiceSpy.fetchJourneys).toHaveBeenCalled();
      expect(result).toEqual(true);
    });

    it('should allow navigation if journey is not coming soon', async () => {
      journeyServiceSpy.isComingSoon.and.returnValue(false);
      const result = await service['checkComingSoon'](9);
      expect(journeyServiceSpy.isComingSoon).toHaveBeenCalledWith({
        journeyID: 9,
      });
      expect(result).toBeTrue();
    });

    it('should not allow navigation if journey is coming soon', async () => {
      journeyServiceSpy.isComingSoon.and.returnValue(true);
      const result = await service['checkComingSoon'](9);
      expect(journeyServiceSpy.isComingSoon).toHaveBeenCalledWith({
        journeyID: 9,
      });
      expect(journeyUtilityServiceSpy.routeToFirstJourney).toHaveBeenCalledWith(
        journeyResponse
      );
      expect(result).toBeFalse();
    });
  });
});

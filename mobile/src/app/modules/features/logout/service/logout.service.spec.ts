import {TestBed, waitForAsync} from '@angular/core/testing';
import {LogoutService} from './logout.service';
import {BaseService} from '@shared-lib/services/base/base-factory-provider';
import {endPoints} from '../constants/endpoints';
import {SharedUtilityService} from '@shared-lib/services/utility/utility.service';

describe('LogoutService', () => {
  let service: LogoutService;
  let baseServiceSpy;
  let utilityServiceSpy;

  beforeEach(
    waitForAsync(() => {
      utilityServiceSpy = jasmine.createSpyObj('utilityServiceSpy ', [
        'appendBaseUrlToEndpoints',
      ]);
      baseServiceSpy = jasmine.createSpyObj('baseServiceSpy', ['get']);
      TestBed.configureTestingModule({
        imports: [],
        providers: [
          LogoutService,
          {provide: SharedUtilityService, useValue: utilityServiceSpy},
          {provide: BaseService, useValue: baseServiceSpy},
        ],
      });
      service = TestBed.inject(LogoutService);
      service.endPoints = endPoints;
    })
  );

  it('should be created', () => {
    expect(service).toBeTruthy();
    expect(utilityServiceSpy.appendBaseUrlToEndpoints).toHaveBeenCalledWith(
      endPoints
    );
  });

  describe('getLogoutContent', () => {
    it('should call baseservice get with logout content endpoint', async () => {
      const contentObj = {
        image_url: 'a',
        timeOutMessage: 'b',
        timeOutMessage1: 'c',
        timeOutMessage2: 'd',
      };
      baseServiceSpy.get.and.returnValue(
        Promise.resolve({SessionTimeoutContent: JSON.stringify(contentObj)})
      );

      const result = await service.getLogoutContent();

      expect(baseServiceSpy.get).toHaveBeenCalledWith(
        endPoints.logoutContent,
        false
      );
      expect(result).toEqual(contentObj);
    });
  });
});

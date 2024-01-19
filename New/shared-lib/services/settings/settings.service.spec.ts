import {TestBed, waitForAsync} from '@angular/core/testing';
import {SettingsService} from './settings.service';
import {BaseService} from '@shared-lib/services/base/base-factory-provider';
import {endpoints} from './constants/endpoints';
import {SharedUtilityService} from '@shared-lib/services/utility/utility.service';
import {SettingsDisplayFlags} from './models/settings.model';

describe('SettingsService', () => {
  let service: SettingsService;
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
          SettingsService,
          {provide: SharedUtilityService, useValue: utilityServiceSpy},
          {provide: BaseService, useValue: baseServiceSpy},
        ],
      });
      service = TestBed.inject(SettingsService);
      service['endpoints'] = endpoints;
    })
  );

  it('should be created', () => {
    expect(service).toBeTruthy();
    expect(utilityServiceSpy.appendBaseUrlToEndpoints).toHaveBeenCalledWith(
      endpoints
    );
  });

  describe('getSettingsDisplayFlags', () => {
    const settingsDisplayFlags: SettingsDisplayFlags = {
      displayContactLink: true,
      suppressAppointment: true,
      pwebStatementUrl: '/link',
    };
    it('when displayFlag will be undefined', async () => {
      service['displayFlag'] = undefined;
      baseServiceSpy.get.and.returnValue(Promise.resolve(settingsDisplayFlags));
      const result = await service.getSettingsDisplayFlags();
      expect(baseServiceSpy.get).toHaveBeenCalledWith(
        endpoints.settingsDisplayFlags
      );
      expect(result).toEqual(settingsDisplayFlags);
    });

    it('when displayFlag will be defined but refresh is true', async () => {
      service['displayFlag'] = settingsDisplayFlags;
      baseServiceSpy.get.and.returnValue(Promise.resolve(settingsDisplayFlags));
      const result = await service.getSettingsDisplayFlags(true);
      expect(baseServiceSpy.get).toHaveBeenCalled();
      expect(result).toEqual(settingsDisplayFlags);
    });

    it('when displayFlag will be defined', async () => {
      service['displayFlag'] = settingsDisplayFlags;
      const result = await service.getSettingsDisplayFlags();
      expect(baseServiceSpy.get).not.toHaveBeenCalled();
      expect(result).toEqual(settingsDisplayFlags);
    });

    it('when service get failed to respond', async () => {
      service['displayFlag'] = undefined;
      baseServiceSpy.get.and.callFake(() => Promise.reject());
      const result = await service.getSettingsDisplayFlags(true);
      expect(baseServiceSpy.get).toHaveBeenCalled();
      expect(result).toEqual({
        displayContactLink: false,
        suppressAppointment: false,
      });
    });
  });
});

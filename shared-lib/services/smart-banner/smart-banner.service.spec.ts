import {TestBed, waitForAsync} from '@angular/core/testing';
import {BaseService} from '../base/base-factory-provider';
import {SharedUtilityService} from '../utility/utility.service';
import {endpoints} from './constants/smart-banner-endpoints';
import {SmartBannerOptions} from './models/smart-banner.model';
import {SmartBannerService} from './smart-banner.service';

describe('SmartBannerService', () => {
  const endPoints = endpoints;
  let service: SmartBannerService;
  let baseServiceSpy;
  let utilityServiceSpy;

  beforeEach(
    waitForAsync(() => {
      baseServiceSpy = jasmine.createSpyObj('baseServiceSpy', ['get']);
      utilityServiceSpy = jasmine.createSpyObj('UtilityService', [
        'appendBaseUrlToEndpoints',
        'getEnvironment',
      ]);
      utilityServiceSpy.appendBaseUrlToEndpoints.and.returnValue(endPoints);
      utilityServiceSpy.getEnvironment.and.returnValue({
        production: false,
        baseUrl: '',
        tokenBaseUrl: '',
        myvoyaBaseUrl: '',
        loginBaseUrl: 'https://login.intg.voya.com/',
      });
      TestBed.configureTestingModule({
        imports: [],
        providers: [
          SmartBannerService,
          {provide: BaseService, useValue: baseServiceSpy},
          {provide: SharedUtilityService, useValue: utilityServiceSpy},
        ],
      });
      service = TestBed.inject(SmartBannerService);
    })
  );

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getSmartBannerOptions', () => {
    let smartBannerOptions: SmartBannerOptions;
    beforeEach(() => {
      smartBannerOptions = {
        title: 'MyVoyage',
        author: 'Voya Services Company',
        icon:
          'https://login.intg.voya.com/voyassoui/static/public/images/myvoyage-icon.png',
        'button-url-apple':
          'https://apps.apple.com/us/app/myvoyage/id1594192157',
        'button-url-google':
          'https://play.google.com/store/apps/details?id=com.voya.edt.myvoyage',
      };
      baseServiceSpy.get.and.returnValue(
        Promise.resolve({
          MyVoyageBannerJSON: JSON.stringify({
            title: 'MyVoyage',
            author: 'Voya Services Company',
            icon: 'voyassoui/static/public/images/myvoyage-icon.png',
            'button-url-apple':
              'https://apps.apple.com/us/app/myvoyage/id1594192157',
            'button-url-google':
              'https://play.google.com/store/apps/details?id=com.voya.edt.myvoyage',
          }),
        })
      );
      service.smartBannerOptions = undefined;
    });
    it('should call baseService and get smartbanner Info if smartBannerOptions is undefined', async () => {
      const result = await service.getSmartBannerOptions();
      expect(baseServiceSpy.get).toHaveBeenCalledWith(
        endPoints.getSmartbannerOptions
      );
      expect(result).toEqual(smartBannerOptions);
      expect(service.smartBannerOptions).toEqual(smartBannerOptions);
    });
    it('should not call baseService if smartBannerOptions is present', async () => {
      service.smartBannerOptions = smartBannerOptions;
      await service.getSmartBannerOptions();
      expect(baseServiceSpy.get).not.toHaveBeenCalled();
    });
  });
});

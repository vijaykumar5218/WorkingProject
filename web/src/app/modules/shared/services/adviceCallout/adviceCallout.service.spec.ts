import {TestBed, waitForAsync} from '@angular/core/testing';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {AdviceCalloutService} from './adviceCallout.service';
import {AccessService} from '@shared-lib/services/access/access.service';
import {BaseService} from '@shared-lib/services/base/base-factory-provider';
import {SharedUtilityService} from '@shared-lib/services/utility/utility.service';
import {endPoints} from './constants/endpoints';

describe('adviceCalloutService', () => {
  let service: AdviceCalloutService;
  let accessServiceSpy;
  let baseServiceSpy;
  let utilityServiceSpy;
  beforeEach(
    waitForAsync(() => {
      accessServiceSpy = jasmine.createSpyObj('AccessService', [
        'getSessionId',
      ]);
      utilityServiceSpy = jasmine.createSpyObj('utilityServiceSpy ', [
        'appendBaseUrlToEndpoints',
      ]);
      utilityServiceSpy.appendBaseUrlToEndpoints.and.callFake(
        endpoints => endpoints
      );
      baseServiceSpy = jasmine.createSpyObj('baseServiceSpy', ['get']);
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [
          {provide: AccessService, useValue: accessServiceSpy},
          {provide: BaseService, useValue: baseServiceSpy},
          {provide: SharedUtilityService, useValue: utilityServiceSpy},
        ],
      });
      service = TestBed.inject(AdviceCalloutService);
      service['endpoints'] = endPoints;
    })
  );

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getAdviceCallout', () => {
    let dataval;
    beforeEach(() => {
      accessServiceSpy.getSessionId.and.returnValue(
        Promise.resolve('Ar0wSx5Vu5tu2WBBICQ1oCu1.i9397')
      );
      dataval = [
        {
          clientId: 'INGWIN',
          messages:
            'The right advice can make all the difference. Investing for retirement can be complicated. Fortunately, getting answers doesn’t have to be. Consider personalized support from a professional.',
          linkName: 'Learn More',
          title: 'Get Advice',
          offerCode: 'MANACCT',
          messageType: 'MESSAGE',
          targetUrl:
            'https%3A%2F%2Flogin.unit.voya.com%2Fsaml%2Fsps%2Fsaml-idp-login%2Fsaml20%2Flogininitial%3FPartnerId%3Dhttps%3A%2F%2Fmy3.unit.voya.com%2Fmga%2Fsps%2Fsaml-sp-my-local%2Fsaml20%26access_token%3D%5Bexchanged_access_token%5D%26Target=https%3A%2F%2Fmy3.unit.voya.com%2Fvoyasso%2FmobileSignOn%3Fdomain%3Dadptotalsource.intg.voya.com%26target%3D/epweb/pweblink.do?s=t5GrHS1kbmdRAVyy0fN0bA11.i9290&domain=adptotalsource.intg.voya.com&cl=INGWIN&act_type=P&page=advice&pageId=ACCT_GET_ADVICE&plan=814059&d=fcd814d3ab4f7100e1b914b3a980526d102e4569',
          imageTargetUrl:
            'https://my3.intg.voya.com/eicc/servlet/MessageEventTrackingServlet?summaryId=041848716814059MANACCT&loginDateTime=10%2F06%2F2023+17%3A22%3A42&sessionId=t5GrHS1kbmdRAVyy0fN0bA11.i9290&msgAction=Yes&messageId=AC.84&msgSource=ACCORDION&targetURL=https%3A%2F%2F%3Cclient+domain%3E%2Fepweb%2Fpweblink.do%3Fpage%3Dadvice%26plan%3D814059%26s%3D%3CSSO+Session+ID%3E%26domain%3D%3CClient+domain%3E%26act_type%3D%26pageId%3DACCT_GET_ADVICE%26d%3D%3Cdigital+sig%3E&d=b9428dfa73d919a62d4bc255118b7e3990de367e',
        },
        {
          clientId: 'INGWIN',
          messages:
            'The right advice can make all the difference. Investing for retirement can be complicated. Fortunately, getting answers doesn’t have to be. Consider personalized support from a professional.',
          linkName: 'Get Started',
          title: 'Compare Yourself',
          offerCode: 'MANACTIPS',
          messageType: 'DEFAULT',
          targetUrl: 'http://voya.com/tool/compare-me/',
          imageTargetUrl: 'http://voya.com/tool/compare-me/',
        },
        {
          clientId: 'INGWIN',
          messages:
            'The right advice can make all the difference. Investing for retirement can be complicated. Fortunately, getting answers doesn’t have to be. Consider personalized support from a professional.',
          linkName: 'Get Started',
          title: 'Compare Yourself',
          offerCode: 'FE',
          messageType: 'DEFAULT',
          targetUrl: 'http://voya.com/tool/compare-me/',
          imageTargetUrl: 'http://voya.com/tool/compare-me/',
        },
      ];
      baseServiceSpy.get.and.returnValue(Promise.resolve(dataval));
    });

    it('should call get method when offercodes is empty', async () => {
      const result = await service.getAdviceCallout();
      expect(baseServiceSpy.get).toHaveBeenCalledWith(
        'myvoyage/ws/ers/dashboard/adviceCallout?s=' +
          'Ar0wSx5Vu5tu2WBBICQ1oCu1.i9397'
      );
      expect(result.length).toEqual(1);
    });

    it('should not call get when offer code have data', async () => {
      spyOn(Storage.prototype, 'getItem').and.returnValue(
        'Ar0wSx5Vu5tu2WBBICQ1oCu1.i9397'
      );
      service['offercodes'] = [dataval[0]];
      const result = await service.getAdviceCallout();
      expect(baseServiceSpy.get).not.toHaveBeenCalledWith(
        'myvoyage/ws/ers/dashboard/adviceCallout?s=' +
          'Ar0wSx5Vu5tu2WBBICQ1oCu1.i9397'
      );
      expect(result.length).toEqual(1);
    });
  });
});

import {TestBed, waitForAsync} from '@angular/core/testing';
import {TPAStreamService} from './tpastream.service';
import {SharedUtilityService} from '../utility/utility.service';
import {BaseService} from '../base/base-factory-provider';
import {endPoints} from './constants/endpoints';
import {ModalController} from '@ionic/angular';
import {TPAStreamConnectPage} from '@shared-lib/components/coverages/tpastream-connect/tpastream-connect.page';
import {GroupingCategoryDetails} from '../../components/coverages/models/chart.model';
import {Router} from '@angular/router';
import {TPAClaimsData} from './models/tpa.model';

describe('TPAStreamService', () => {
  let service: TPAStreamService;
  const endpoints = endPoints;
  let baseServiceSpy;
  let utilityServiceSpy;
  let tpaTestData;
  let modalControllerSpy;
  let routerSpy;

  beforeEach(
    waitForAsync(() => {
      tpaTestData = {
        carriers: [
          {
            carrierId: 471393,
            carrierName: 'Test Carrier',
            claimsCount: 5,
            connectionStatus: 'Enabled',
            crawlCount: 10,
            crawlStatus: 'SUCCESS',
            loginProblem: 'valid',
            logoUrl:
              'https://tpastream-public.s3.amazonaws.com/test-tpastream.png',
            payerId: 1659,
            totalOutOfPocketAmount: 367.72,
          },
        ],
        groupingCategoryDetails: {} as GroupingCategoryDetails,
        claims: [
          {
            inNetwork: true,
            outOfPocketCost: 20,
            providerName: 'Test Provider',
            serviceDate: '2022-01-23',
            carrierName: 'Test Carrier',
          },
        ],
      };

      baseServiceSpy = jasmine.createSpyObj('BaseService', ['post']);
      utilityServiceSpy = jasmine.createSpyObj('UtilityService', [
        'getEnvironment',
        'appendBaseUrlToEndpoints',
        'getIsWeb',
      ]);
      utilityServiceSpy.appendBaseUrlToEndpoints.and.returnValue(endpoints);
      modalControllerSpy = jasmine.createSpyObj('ModalController', ['create']);

      utilityServiceSpy.getIsWeb.and.returnValue(false);
      routerSpy = jasmine.createSpyObj('Router', ['navigateByUrl']);

      TestBed.configureTestingModule({
        imports: [],
        providers: [
          TPAStreamService,
          {provide: BaseService, useValue: baseServiceSpy},
          {provide: SharedUtilityService, useValue: utilityServiceSpy},
          {provide: ModalController, useValue: modalControllerSpy},
          {provide: Router, useValue: routerSpy},
        ],
      });
      service = TestBed.inject(TPAStreamService);
    })
  );

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('processTPAData', () => {
    it('should process tpa data from backend into correct format', () => {
      const rawTPAData: TPAClaimsData = {
        carriers: [
          {
            carrierName: 'Test Carrier 1',
            carrierId: 123,
            claimsCount: 5,
            connectionStatus: 'Enabled',
            crawlCount: 10,
            crawlStatus: 'SUCCESS',
            loginProblem: 'valid',
            logoUrl:
              'https://tpastream-public.s3.amazonaws.com/test-tpastream.png',
            payerId: 1659,
            totalOutOfPocketAmount: 367.72,
          },
          {
            carrierName: 'Test Carrier 2',
            carrierId: 456,
            claimsCount: 5,
            connectionStatus: 'Enabled',
            crawlCount: 10,
            crawlStatus: 'SUCCESS',
            loginProblem: 'valid',
            logoUrl:
              'https://tpastream-public.s3.amazonaws.com/test-tpastream.png',
            payerId: 1659,
            totalOutOfPocketAmount: 367.72,
          },
        ],
        groupingCategoryDetails: {
          '2023-11': [
            {
              serviceName: 'rx',
              providerName: 'Test Provider -- Do Not Use',
              inNetwork: false,
              outOfPocketCost: 0.0,
              serviceDate: '2023-11-29',
              insurancePaidAmount: 148.0,
              carrierId: 123,
              claimLines: [
                {
                  procedure_name: 'ItsADrug 20MG',
                },
                {
                  procedure_name: 'ItsADrug2 20MG',
                },
              ],
              patientName: 'Angla',
            },
            {
              serviceName: 'medical',
              providerName: 'Test Provider -- Do Not Use',
              inNetwork: false,
              outOfPocketCost: 0.0,
              serviceDate: '2023-11-29',
              insurancePaidAmount: 0.0,
              carrierId: 123,
              claimLines: [],
              patientName: 'Ricky',
            },
          ],
          '2023-09': [
            {
              serviceName: 'rx',
              providerName: 'Test Provider -- Do Not Use',
              inNetwork: false,
              outOfPocketCost: 115.0,
              serviceDate: '2023-09-24',
              insurancePaidAmount: 0.0,
              carrierId: 456,
              claimLines: [
                {
                  procedure_name: 'Advil 200MG',
                },
              ],
              patientName: 'Ricky Silvertien',
            },
            {
              serviceName: 'medical',
              providerName: 'Test Provider -- Do Not Use',
              inNetwork: false,
              outOfPocketCost: 0.0,
              serviceDate: '2023-09-16',
              insurancePaidAmount: 0.0,
              carrierId: 456,
              claimLines: [],
              patientName: 'Richard Kingston',
            },
          ],
        },
        claims: [],
        memberId: 555,
      };

      const resultTPAData: TPAClaimsData = {
        carriers: [
          {
            carrierName: 'Test Carrier 1',
            carrierId: 123,
            claimsCount: 5,
            connectionStatus: 'Enabled',
            crawlCount: 10,
            crawlStatus: 'SUCCESS',
            loginProblem: 'valid',
            logoUrl:
              'https://tpastream-public.s3.amazonaws.com/test-tpastream.png',
            payerId: 1659,
            totalOutOfPocketAmount: 367.72,
          },
          {
            carrierName: 'Test Carrier 2',
            carrierId: 456,
            claimsCount: 5,
            connectionStatus: 'Enabled',
            crawlCount: 10,
            crawlStatus: 'SUCCESS',
            loginProblem: 'valid',
            logoUrl:
              'https://tpastream-public.s3.amazonaws.com/test-tpastream.png',
            payerId: 1659,
            totalOutOfPocketAmount: 367.72,
          },
        ],
        groupingCategoryDetails: {
          '2023-11': [
            {
              carrierName: 'Test Carrier 1',
              serviceName: 'rx',
              providerName: 'Test Provider -- Do Not Use',
              inNetwork: false,
              outOfPocketCost: 0.0,
              serviceDate: '2023-11-29',
              insurancePaidAmount: 148.0,
              carrierId: 123,
              drugName: 'ItsADrug 20MG',
              claimLines: [
                {
                  procedure_name: 'ItsADrug 20MG',
                },
                {
                  procedure_name: 'ItsADrug2 20MG',
                },
              ],
              patientName: 'Angla',
            },
            {
              carrierName: 'Test Carrier 1',
              serviceName: 'medical',
              providerName: 'Test Provider -- Do Not Use',
              inNetwork: false,
              outOfPocketCost: 0.0,
              serviceDate: '2023-11-29',
              insurancePaidAmount: 0.0,
              carrierId: 123,
              claimLines: [],
              patientName: 'Ricky',
            },
          ],
          '2023-09': [
            {
              carrierName: 'Test Carrier 2',
              serviceName: 'rx',
              providerName: 'Test Provider -- Do Not Use',
              inNetwork: false,
              outOfPocketCost: 115.0,
              serviceDate: '2023-09-24',
              insurancePaidAmount: 0.0,
              carrierId: 456,
              drugName: 'Advil 200MG',
              claimLines: [
                {
                  procedure_name: 'Advil 200MG',
                },
              ],
              patientName: 'Ricky Silvertien',
            },
            {
              carrierName: 'Test Carrier 2',
              serviceName: 'medical',
              providerName: 'Test Provider -- Do Not Use',
              inNetwork: false,
              outOfPocketCost: 0.0,
              serviceDate: '2023-09-16',
              insurancePaidAmount: 0.0,
              carrierId: 456,
              claimLines: [],
              patientName: 'Richard Kingston',
            },
          ],
        },
        claims: [],
        memberId: 555,
      };

      service.processTPAData(rawTPAData);
      expect(rawTPAData).toEqual(resultTPAData);
    });
  });

  describe('getTPAData', () => {
    beforeEach(() => {
      baseServiceSpy.post.and.returnValue(Promise.resolve(tpaTestData));
      service.tpaDataReload$ = jasmine.createSpyObj('Observable', ['next']);
    });

    it('should tpa data and call tpaDataRefresh observable', async () => {
      service.getTPAData().subscribe(data => {
        expect(data).toEqual(tpaTestData);

        expect(service.tpaDataReload$.next).toHaveBeenCalled();
        expect(baseServiceSpy.post).toHaveBeenCalledWith(
          endpoints.healthUtilization,
          {}
        );
      });

      service.getTPAData().subscribe(data => {
        expect(data).toEqual(tpaTestData);

        expect(baseServiceSpy.post).toHaveBeenCalledTimes(1);
      });
    });

    it('should tpa data', async () => {
      service.getTPAData().subscribe(data => {
        expect(data).toEqual(tpaTestData);

        expect(baseServiceSpy.post).toHaveBeenCalledWith(
          endpoints.healthUtilization,
          {}
        );
      });

      service.getTPAData(true).subscribe(data => {
        expect(data).toEqual(tpaTestData);

        expect(baseServiceSpy.post).toHaveBeenCalledTimes(2);
      });
    });
  });

  describe('openTPAConnect', () => {
    it('should navigate to url if web', async () => {
      service.isWeb = true;
      await service.openTPAConnect();

      expect(routerSpy.navigateByUrl).toHaveBeenCalledWith(
        'coverages/all-coverages/tpaclaims/connect'
      );
    });

    it('should open modal with the add carrier page is not web', async () => {
      service.isWeb = false;

      const modalSpy = jasmine.createSpyObj('Modal', ['present']);
      modalControllerSpy.create.and.returnValue(Promise.resolve(modalSpy));

      await service.openTPAConnect();

      expect(modalControllerSpy.create).toHaveBeenCalledWith({
        component: TPAStreamConnectPage,
        cssClass: 'modal-fullscreen',
      });
      expect(modalSpy.present).toHaveBeenCalled();
    });

    it('should open modal with the add carrier page is not web and redired to insights if redirect=true', async () => {
      service.isWeb = false;

      const modalSpy = jasmine.createSpyObj('Modal', [
        'present',
        'onWillDismiss',
      ]);
      modalControllerSpy.create.and.returnValue(Promise.resolve(modalSpy));
      modalSpy.onWillDismiss.and.returnValue(Promise.resolve());

      await service.openTPAConnect(true);

      expect(routerSpy.navigateByUrl).toHaveBeenCalledWith(
        'coverages/coverage-tabs/insights'
      );
    });
  });

  describe('revokeCarrier', () => {
    it('should call baseService post and return true if success', async () => {
      baseServiceSpy.post.and.returnValue(Promise.resolve(true));

      const result = await service.revokeCarrier(12, 12345);

      expect(baseServiceSpy.post).toHaveBeenCalledWith(
        endpoints.disablePolicyHolder,
        {
          memberId: 12345,
          policyHolderId: 12,
          enable: false,
        }
      );

      expect(result).toBeTrue();
    });

    it('should call baseService post and return false if not success', async () => {
      baseServiceSpy.post.and.returnValue(Promise.resolve({}));

      const result = await service.revokeCarrier(12, 12345);

      expect(baseServiceSpy.post).toHaveBeenCalledWith(
        endpoints.disablePolicyHolder,
        {
          memberId: 12345,
          policyHolderId: 12,
          enable: false,
        }
      );

      expect(result).toBeFalse();
    });

    it('should call baseService post and return false if not success', async () => {
      baseServiceSpy.post.and.returnValue(Promise.resolve(null));

      const result = await service.revokeCarrier(12, 12345);

      expect(baseServiceSpy.post).toHaveBeenCalledWith(
        endpoints.disablePolicyHolder,
        {
          memberId: 12345,
          policyHolderId: 12,
          enable: false,
        }
      );

      expect(result).toBeFalse();
    });
  });

  describe('ngOnDestroy', () => {
    it('should unsubscribe', () => {
      const spy = jasmine.createSpyObj('Sub', ['unsubscribe']);
      service['subscription'] = spy;
      service.ngOnDestroy();

      expect(spy.unsubscribe).toHaveBeenCalled();
    });
  });
});

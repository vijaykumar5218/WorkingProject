import {AccountService} from '@shared-lib/services/account/account.service';
import {endPoints} from '@shared-lib/services/account/constants/endpoints';
import {LoadingService} from '@mobile/app/modules/shared/service/loading-service/loading.service';
import {BaseService} from '@shared-lib/services/base/base-factory-provider';
import {RouterTestingModule} from '@angular/router/testing';
import {TestBed, waitForAsync} from '@angular/core/testing';
import {OrangeMoneyService} from './orange-money.service';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {
  OMStatus,
  OrangeData,
} from '@shared-lib/services/account/models/orange-money.model';
import {Account} from '@shared-lib/services/account/models/accountres.model';
import {SharedUtilityService} from '@shared-lib/services/utility/utility.service';
import {AccessService} from '../../../services/access/access.service';
import {AccessResult} from '@shared-lib/services/access/models/access.model';
import {of} from 'rxjs';
import {OmEmployerMatch} from '@shared-lib/services/account/models/om-employer-match.model';

describe('OrangeMoneyService', () => {
  let service: OrangeMoneyService;
  let baseServiceSpy;
  let loadingServiceSpy;
  let accountServiceSpy;
  let utilityServiceSpy;
  let accessServiceSpy;

  beforeEach(
    waitForAsync(() => {
      baseServiceSpy = jasmine.createSpyObj('baseServiceSpy', ['post', 'get']);
      loadingServiceSpy = jasmine.createSpyObj('loadingServiceSpy', [
        'startLoading',
        'stopLoading',
      ]);
      accountServiceSpy = jasmine.createSpyObj('AccountService', [
        'getAccount',
      ]);
      utilityServiceSpy = jasmine.createSpyObj('SharedUtilityService', [
        'appendBaseUrlToEndpoints',
      ]);
      utilityServiceSpy.appendBaseUrlToEndpoints.and.callFake(
        endpoints => endpoints
      );
      accessServiceSpy = jasmine.createSpyObj('AccessService', [
        'checkMyvoyageAccess',
      ]);

      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule, RouterTestingModule],
        providers: [
          OrangeMoneyService,
          {provide: BaseService, useValue: baseServiceSpy},
          {provide: LoadingService, useValue: loadingServiceSpy},
          {provide: AccountService, useValue: accountServiceSpy},
          {provide: SharedUtilityService, useValue: utilityServiceSpy},
          {provide: AccessService, useValue: accessServiceSpy},
        ],
      });
      service = TestBed.inject(OrangeMoneyService);
      service.endpoints = endPoints;
    })
  );

  const emptyEstimates = {
    estimatedMonthlyIncome: 0,
    estimatedMonthlyGoal: 0,
    difference: 0,
    retirementAge: 0,
    currSalary: 0,
  };

  const emptyOrangeMoneyData = {
    orangeData: {
      adminUser: false,
      advisor: false,
      annuityFactors: [],
      callCenterPhoneNumber: '232-323-4434',
      content: {},
      csrId: '',
      irsLimits: {},
      omTitle: 'myOrangeMoney&reg;',
      otherAssets: {},
      participantData: {
        annualSalaryIncrementRate: 0,
        closeTheGapPlans: [],
        currentAnnualSalary: 60020,
        currentDcBalance: 1600483.63,
        displayOMVideos: true,
        dob: '1941-01-06T00:00:00',
        firstName: 'PARTICIPAN',
        firstTimeVisitor: false,
        guaranteedIncome: 0,
        hcData: {age: 65, hcEnable: true, healthCareViewed: false, state: 'MA'},
        includeSocialSecurity: true,
        incomeReplacementRatio: 0.7,
        inflationRate: 0.023,
        investmentRateOfReturn: 0.02,
        omSectionExpanded: true,
        otherAccountPrompt: true,
        outsideRetAssetPrompt: false,
        participantStatus: 'ACTIVE',
        pensionView: null,
        personId: '2143941201',
        replacementIncomeCalcType: 'Balanced',
        retirementAge: 80,
        rothBumpRate: 0.25,
        showSurvey: true,
        socialSecData: {},
      },
      participantDefinedContributionAccounts: [
        {
          contributionData: {
            catchupContributionUnit: null,
            catchupEligible: '',
            catchupIneligibilityReason: '',
            catchupPending: null,
            crcEligible: '',
            crcIneligibilityReason: '',
            regularContributionUnit: 'UNIT',
            regularPending: {
              txDate: '',
              txNumber: '',
            },
          },
          planInfo: {
            planId: 'planId',
            catchupContributionType: 'AMOUNT',
            regularContributionType: 'AMOUNT',
            crcAllowed: false,
            sources: [
              {
                amountMod: 0.01,
                contribution: 0.05,
                id: '',
                ircCode: '',
                limits: {max: 1, min: 0},
                name: 'name',
                percentLimits: '',
                percentMod: 0.2,
                type: 'AMT',
              },
              {
                amountMod: 0.01,
                contribution: 0.05,
                id: '',
                ircCode: '',
                limits: {max: 1, min: 0},
                name: 'name',
                percentLimits: '',
                percentMod: 0.2,
                type: 'AMT',
              },
            ],
          },
        },
      ],
      pension: {enabled: true, monthlyPension: 0},
      quickEnrollAllowed: false,
      quickEnrollData: {plan: '', quickEnrollAllowed: false},
      ssBenefits: [],
      urls: {},
      usStates: [],
      voyaOtherAccounts: [],
    },
  };

  const emptyMadlibData = {
    adminUser: false,
    annualSalary: 50000.0,
    dob: '1956-09-13T00:00:00',
    firstName: 'TestFirst',
    firstTimeUser: false,
    madLib: false,
    madlibHelpContent: '',
    omTitle: '',
    participantStatus: '',
    promoTextForSkip: '',
    skipMadlibAllowed: true,
  };

  const employerMatchResponse = {
    showERMatch: true,
    erContributionsHeader: 'Employer Contributions',
    erContributionDesc2:
      'Note: The match amount reflects the most recent information we have on file from your employer.',
    erContributionsDesc:
      'Your Employer is putting money in your account in the following ways:',
    matchTiers: [
      'Then Match 0.33 of the next 100% of pay',
      'Match 100% of the first 1% of pay',
    ],
  };

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getOMEligibility', async () => {
    it('should return eligibility', async () => {
      const eligibilityData = {eligible: 'true', planId: '20232'};
      baseServiceSpy.get.and.returnValue(Promise.resolve(eligibilityData));
      const result = await service.getOMEligibility();

      expect(result).toEqual(eligibilityData);
      expect(baseServiceSpy.get).toHaveBeenCalledWith(
        'myvoyage/ws/ers/orangemoney/omElig'
      );
    });
    it('should return saved eligibility', async () => {
      service.omEligibleData = {eligible: 'true', planId: '20232'};
      const result = await service.getOMEligibility();

      expect(result).toEqual(service.omEligibleData);
      expect(baseServiceSpy.get).not.toHaveBeenCalled();
    });
  });

  describe('getOrangeData', () => {
    it('should load orange money data', (done: DoneFn) => {
      const appendQueryParamsSpy = spyOn(service, 'appendQueryParams');
      appendQueryParamsSpy.and.returnValue(
        Promise.resolve(
          'myvoyage/ws/ers/orangemoney/data/getrrinfo?clientId=TEST_CLIENT_ID&s=AAAAAAA.i9291'
        )
      );
      baseServiceSpy.get.and.returnValue(Promise.resolve(emptyOrangeMoneyData));
      service.getOrangeData().subscribe(data => {
        expect(data).toEqual(emptyOrangeMoneyData);
        expect(baseServiceSpy.get).toHaveBeenCalledWith(
          'myvoyage/ws/ers/orangemoney/data/getrrinfo?clientId=TEST_CLIENT_ID&s=AAAAAAA.i9291'
        );
      });
      service.getOrangeData().subscribe(data => {
        expect(data).toEqual(emptyOrangeMoneyData);
        expect(baseServiceSpy.get).toHaveBeenCalledWith(
          'myvoyage/ws/ers/orangemoney/data/getrrinfo?clientId=TEST_CLIENT_ID&s=AAAAAAA.i9291'
        );
        expect(baseServiceSpy.get).toHaveBeenCalledTimes(2);
      });
      done();
    });

    it('should load orange money data and force refresh it', (done: DoneFn) => {
      const appendQueryParamsSpy = spyOn(service, 'appendQueryParams');
      appendQueryParamsSpy.and.returnValue(
        Promise.resolve(
          'myvoyage/ws/ers/orangemoney/data/getrrinfo?clientId=TEST_CLIENT_ID&s=AAAAAAA.i9291'
        )
      );
      baseServiceSpy.get.and.returnValue(Promise.resolve(emptyOrangeMoneyData));
      service.getOrangeData().subscribe(data => {
        expect(data).toEqual(emptyOrangeMoneyData);
        expect(baseServiceSpy.get).toHaveBeenCalledWith(
          'myvoyage/ws/ers/orangemoney/data/getrrinfo?clientId=TEST_CLIENT_ID&s=AAAAAAA.i9291'
        );
      });
      service.getOrangeData(true).subscribe(data => {
        expect(data).toEqual(emptyOrangeMoneyData);
        expect(baseServiceSpy.get).toHaveBeenCalledWith(
          'myvoyage/ws/ers/orangemoney/data/getrrinfo?clientId=TEST_CLIENT_ID&s=AAAAAAA.i9291'
        );
        expect(baseServiceSpy.get).toHaveBeenCalledTimes(2);
      });
      done();
    });
  });

  describe('setOrangeData', () => {
    it('should update orange money data subject', async () => {
      const orangeDataSubjectSpy = jasmine.createSpyObj(
        'ReplaySubject<OrangeData>',
        ['next']
      );
      service['orangeDataSubject'] = orangeDataSubjectSpy;

      const orangeData = {} as OrangeData;
      service.setOrangeData(orangeData);
      expect(orangeDataSubjectSpy.next).toHaveBeenCalledWith(orangeData);
    });
  });

  describe('saveRetiremnetAgeFE', () => {
    it('should call saveRetirementAgeFE with payload using planId from accountService if available', async () => {
      const acc = {
        planId: '23232',
      } as Account;
      accountServiceSpy.getAccount.and.returnValue(acc);
      await service.saveRetiremnetAgeFE(12);
      expect(baseServiceSpy.post).toHaveBeenCalledWith(
        'myvoya/ws/ers/service/customers/272c2587-6b79-d874-e053-d22aac0a0939/orangemoney/fevalidate',
        {
          contributionUpdate: {
            planId: '23232',
            crc: true,
            retirementAge: 12,
            regularUnit: 'PERCENT',
            sources: [],
            saveRetirementAge: true,
          },
        }
      );
    });

    it('should call saveRetirementAgeFE with payload using planId from landingService if accountService planId not available', async () => {
      accountServiceSpy.getAccount.and.returnValue(undefined);
      const accessResult: AccessResult = {
        clientDomain: 'domain',
        clientId: 'id',
        clientName: 'name',
        enableMyVoyage: 'Y',
        enableBST: 'Y',
        enableTPA: 'N',
        currentPlan: {planId: '623043'},
        planIdList: [],
        myProfileURL: 'https://test.profile.link',
        enableCoverages: false,
        firstTimeLogin: true,
        firstTimeLoginWeb: false,
      };
      accessServiceSpy.checkMyvoyageAccess.and.returnValue(
        Promise.resolve(accessResult)
      );
      await service.saveRetiremnetAgeFE(12);
      expect(baseServiceSpy.post).toHaveBeenCalledWith(
        'myvoya/ws/ers/service/customers/272c2587-6b79-d874-e053-d22aac0a0939/orangemoney/fevalidate',
        {
          contributionUpdate: {
            planId: '623043',
            crc: true,
            retirementAge: 12,
            regularUnit: 'PERCENT',
            sources: [],
            saveRetirementAge: true,
          },
        }
      );
    });
  });

  describe('saveRetirementAgeNonFE', () => {
    beforeEach(() => {
      const acc = {
        planId: '23232',
      } as Account;
      accountServiceSpy.getAccount.and.returnValue(acc);
    });

    it('should call saveRetirementAgeNonFE with payload with planId from accountService', () => {
      service.saveRetirementAgeNonFE(16, emptyOrangeMoneyData);

      const payload = {
        contributionUpdate: {
          planId: '23232',
          crc: false,
          retirementAge: 16,
          investmentRateOfReturn: 0.02,
          regularUnit: 'UNIT',
          catchupUnit: 'AMOUNT',
          sources: [
            {
              amount: 0.05,
              id: '',
              type: 'AMT',
            },
            {
              amount: 0.05,
              id: '',
              type: 'AMT',
            },
          ],
        },
      };

      expect(baseServiceSpy.post).toHaveBeenCalledWith(
        'myvoya/ws/ers/service/customers/272c2587-6b79-d874-e053-d22aac0a0939/orangemoney/validate',
        payload
      );
    });

    it('should call saveRetirementAgeNonFE with payload with planId from orangeData if accountService planId not set', () => {
      accountServiceSpy.getAccount.and.returnValue(undefined);
      service.saveRetirementAgeNonFE(16, emptyOrangeMoneyData);

      const payload = {
        contributionUpdate: {
          planId: 'planId',
          crc: false,
          retirementAge: 16,
          investmentRateOfReturn: 0.02,
          regularUnit: 'UNIT',
          catchupUnit: 'AMOUNT',
          sources: [
            {
              amount: 0.05,
              id: '',
              type: 'AMT',
            },
            {
              amount: 0.05,
              id: '',
              type: 'AMT',
            },
          ],
        },
      };

      expect(baseServiceSpy.post).toHaveBeenCalledWith(
        'myvoya/ws/ers/service/customers/272c2587-6b79-d874-e053-d22aac0a0939/orangemoney/validate',
        payload
      );
    });
  });

  describe('saveSalaryFE', () => {
    beforeEach(() => {
      const acc = {
        planId: '23232',
      } as Account;
      accountServiceSpy.getAccount.and.returnValue(acc);
    });

    it('should call saveSalaryFE with payload', () => {
      service.saveSalaryFE(5000, 2, 200, 100);
      expect(baseServiceSpy.post).toHaveBeenCalledWith(
        'myvoya/ws/ers/service/customers/272c2587-6b79-d874-e053-d22aac0a0939/orangemoney/feshowmeimpact',
        {
          contributionUpdate: {},
          aboutMeData: {
            salary: 5000,
            growthRate: 2,
            desiredGoal: 200 * 12,
            minimumGoal: 100 * 12,
          },
        }
      );
    });
  });

  describe('saveSalaryNonFE', () => {
    it('should call saveSalaryFE with payload with plan id from account service', () => {
      const acc = {
        planId: '23232',
      } as Account;
      accountServiceSpy.getAccount.and.returnValue(acc);
      service.saveSalaryNonFE(5000, '10/05/1950', emptyOrangeMoneyData);
      expect(baseServiceSpy.post).toHaveBeenCalledWith(
        'myvoya/ws/ers/service/customers/272c2587-6b79-d874-e053-d22aac0a0939/orangemoney/saveprofile',
        {
          pptProfile: {
            currentAnnualSalary: 5000,
            dob: '10/05/1950',
            plans: [
              {
                planId: '23232',
              },
            ],
          },
        }
      );
    });

    it('should call saveSalaryFE with payload with plan id from orange data if no planId in account service', () => {
      service.saveSalaryNonFE(5000, '10/05/1950', emptyOrangeMoneyData);
      expect(baseServiceSpy.post).toHaveBeenCalledWith(
        'myvoya/ws/ers/service/customers/272c2587-6b79-d874-e053-d22aac0a0939/orangemoney/saveprofile',
        {
          pptProfile: {
            currentAnnualSalary: 5000,
            dob: '10/05/1950',
            plans: [
              {
                planId: 'planId',
              },
            ],
          },
        }
      );
    });
  });

  describe('getOrangeMoneyStatus', () => {
    it('should return status ORANGE_DATA', async () => {
      const omData = {
        orangeData: {
          participantData: {
            investmentRateOfReturn: 0,
            retirementAge: 0,
            currentAnnualSalary: 0,
          },
        },
      } as OrangeData;

      expect(service.getOrangeMoneyStatus(omData)).toEqual(
        OMStatus.ORANGE_DATA
      );
    });

    it('should return status FE_DATA', async () => {
      const omData = {
        feForecastData: {
          investmentRateOfReturn: 0,
          feForecast: {
            investmentRateOfReturn: 0.06,
            totalIncome: 100.0,
            goal: 500.0,
            errorCode: null,
            desiredGoal: 0,
            minimumGoal: 0,
          },
          participantData: {
            selectedRetirementAge: 65,
            salary: {
              amount: 150000.0,
              growthRate: 0,
            },
            retirementAgeSlider: {
              min: 47,
              max: 80,
            },
          },
        },
      };

      expect(service.getOrangeMoneyStatus(omData)).toEqual(OMStatus.FE_DATA);
    });

    it('should return status MADLIB_OM', async () => {
      const omData = {madLibData: emptyMadlibData};
      const omData2 = {errorCode: 'opt-out'};

      expect(service.getOrangeMoneyStatus(omData)).toEqual(OMStatus.MADLIB_OM);
      expect(service.getOrangeMoneyStatus(omData2)).toEqual(OMStatus.MADLIB_OM);
    });

    it('should return status MADLIB_FE', async () => {
      const omData = {
        feForecastData: {
          investmentRateOfReturn: 0,
          feForecast: {
            investmentRateOfReturn: 0.06,
            totalIncome: 100.0,
            goal: 500.0,
            errorCode: '0005',
            desiredGoal: 0,
            minimumGoal: 0,
          },
          participantData: {
            selectedRetirementAge: 65,
            salary: {
              amount: 150000.0,
              growthRate: 0,
            },
            retirementAgeSlider: {
              min: 47,
              max: 80,
            },
          },
        },
      };

      expect(service.getOrangeMoneyStatus(omData)).toEqual(OMStatus.MADLIB_FE);
    });

    it('should return status SERVICE_DOWN', async () => {
      const omData = null;
      const omData2 = {errorCode: 'system-unavailable'};
      const omData3 = {errorCode: 'insufficient-data'};

      expect(service.getOrangeMoneyStatus(omData)).toEqual(
        OMStatus.SERVICE_DOWN
      );
      expect(service.getOrangeMoneyStatus(omData2)).toEqual(
        OMStatus.SERVICE_DOWN
      );
      expect(service.getOrangeMoneyStatus(omData3)).toEqual(
        OMStatus.SERVICE_DOWN
      );
    });

    it('should return status UNKNOWN', async () => {
      const omData = {errorCode: 'random-error'};

      expect(service.getOrangeMoneyStatus(omData)).toEqual(OMStatus.UNKNOWN);
    });
  });

  describe('getpension', () => {
    it('should return pension data', async () => {
      const pension = {
        pensionView: {
          defaultPensionData: {
            mandatoryContrib: 0,
            monthlyIncome: 0,
            pensionViewFlag: null,
            percCOLA: 0,
            retSysCode: null,
            special1: null,
            special2: null,
            srManualPenBenefitType: null,
            srPenCalcMethod: null,
            stateCode: null,
            yearsOfService: 0,
          },
          defaultplanId: '878076',
          enabled: true,
          pensionByAgeData: [
            {
              omPensionByAgeAllowed: false,
              pensionByAge: null,
              planId: '878076',
            },
          ],
          pensionViewFlag: 'None',
          planId: '878076',
          planRuleId: '0',
          rulemap: {
            '878076': '0',
          },
          srData: null,
          stillriverplanId: null,
          vendorData: null,
          vendorplanId: null,
        },
      };
      const appendQueryParamsSpy = spyOn(service, 'appendQueryParams');
      appendQueryParamsSpy.and.returnValue(
        Promise.resolve(
          'myvoyage/ws/ers/orangemoney/data/getrrinfo?clientId=TEST_CLIENT_ID&s=AAAAAAA.i9291'
        )
      );

      baseServiceSpy.get.and.returnValue(Promise.resolve(pension));
      const result = await service.getpension();
      expect(result).toEqual(pension);
      expect(baseServiceSpy.get).toHaveBeenCalledWith(
        'myvoyage/ws/ers/orangemoney/data/getrrinfo?clientId=TEST_CLIENT_ID&s=AAAAAAA.i9291'
      );
    });
  });

  describe('getsrbenefits', () => {
    it('should return srBenefits data', async () => {
      const srBenefits = {srBenefits: null};
      const appendQueryParamsSpy = spyOn(service, 'appendQueryParams');
      appendQueryParamsSpy.and.returnValue(
        Promise.resolve(
          'myvoyage/ws/ers/orangemoney/data/getsrbenefits?clientId=TEST_CLIENT_ID&s=AAAAAAA.i9291'
        )
      );

      baseServiceSpy.get.and.returnValue(Promise.resolve(srBenefits));
      const result = await service.getsrbenefits();
      expect(result).toEqual(srBenefits);
      expect(baseServiceSpy.get).toHaveBeenCalledWith(
        'myvoyage/ws/ers/orangemoney/data/getsrbenefits?clientId=TEST_CLIENT_ID&s=AAAAAAA.i9291'
      );
    });
  });

  describe('getssbenefits', () => {
    it('should return ssbenefits data', async () => {
      const ssBenefits = {
        socialSecurityBenefits: {
          SSThreshold: 62,
          highRetRef: 70,
          highSSRef: 70,
          lowRetRef: 70,
          lowSSRef: 70,
          monthlyBenefits: [[2129.0]],
          nra: 65,
          passedPia: 0.0,
        },
      };
      const appendQueryParamsSpy = spyOn(service, 'appendQueryParams');
      appendQueryParamsSpy.and.returnValue(
        Promise.resolve(
          'myvoyage/ws/ers/orangemoney/data/getssbenefits?clientId=TEST_CLIENT_ID&s=AAAAAAA.i9291'
        )
      );

      baseServiceSpy.get.and.returnValue(Promise.resolve(ssBenefits));
      const result = await service.getssbenefits();
      expect(result).toEqual(ssBenefits);
      expect(baseServiceSpy.get).toHaveBeenCalledWith(
        'myvoyage/ws/ers/orangemoney/data/getssbenefits?clientId=TEST_CLIENT_ID&s=AAAAAAA.i9291'
      );
    });
  });

  describe('appendQueryParams', () => {
    it('should return Url with queryParams clientId and sessionId', async () => {
      spyOn(Storage.prototype, 'getItem').and.returnValue('AAAAAAA.i9291');
      await accessServiceSpy.checkMyvoyageAccess.and.returnValue(
        Promise.resolve({
          clientDomain: 'test.domain',
          clientId: 'TEST_CLIENT_ID',
          clientName: 'TEST_CLIENT_NAME',
          enableMyVoyage: 'Y',
          planIdList: ['plan_a'],
        })
      );
      const exp =
        'myvoyage/ws/ers/orangemoney/data/getrrinfo?clientId=TEST_CLIENT_ID&s=AAAAAAA.i9291';
      const result = await service.appendQueryParams(
        'myvoyage/ws/ers/orangemoney/data/getrrinfo?{clientId}{sessionId}'
      );
      expect(result).toEqual(exp);
    });
    it('should return Url with queryParams clientId is null', async () => {
      spyOn(Storage.prototype, 'getItem').and.returnValue('AAAAAAA.i9291');
      await accessServiceSpy.checkMyvoyageAccess.and.returnValue(
        Promise.resolve({
          clientDomain: 'test.domain',
          clientId: null,
          clientName: 'TEST_CLIENT_NAME',
          enableMyVoyage: 'Y',
          planIdList: ['plan_a'],
        })
      );
      const exp = 'myvoyage/ws/ers/orangemoney/data/getrrinfo?s=AAAAAAA.i9291';
      const result = await service.appendQueryParams(
        'myvoyage/ws/ers/orangemoney/data/getrrinfo?{clientId}{sessionId}'
      );
      expect(result).toEqual(exp);
    });
    it('should return Url with queryParams sessionId is null', async () => {
      spyOn(Storage.prototype, 'getItem').and.returnValue(null);
      await accessServiceSpy.checkMyvoyageAccess.and.returnValue(
        Promise.resolve({
          clientDomain: 'test.domain',
          clientId: 'TEST_CLIENT_ID',
          clientName: 'TEST_CLIENT_NAME',
          enableMyVoyage: 'Y',
          planIdList: ['plan_a'],
        })
      );
      const exp =
        'myvoyage/ws/ers/orangemoney/data/getrrinfo?clientId=TEST_CLIENT_ID';
      const result = await service.appendQueryParams(
        'myvoyage/ws/ers/orangemoney/data/getrrinfo?{clientId}{sessionId}'
      );
      expect(result).toEqual(exp);
    });
    it('should return Url without queryParams', async () => {
      spyOn(Storage.prototype, 'getItem').and.returnValue(null);
      await accessServiceSpy.checkMyvoyageAccess.and.returnValue(
        Promise.resolve({
          clientDomain: 'test.domain',
          clientId: null,
          clientName: 'TEST_CLIENT_NAME',
          enableMyVoyage: 'Y',
          planIdList: ['plan_a'],
        })
      );
      const exp = 'myvoyage/ws/ers/orangemoney/data/getrrinfo';
      const result = await service.appendQueryParams(
        'myvoyage/ws/ers/orangemoney/data/getrrinfo?clientId={clientId}&s={sessionId}'
      );
      expect(result).toEqual(exp);
    });
  });

  describe('getEstimates()', () => {
    beforeEach(() => {
      spyOn(service, 'getNonFEEstimates').and.returnValue(
        Promise.resolve(emptyEstimates)
      );
      spyOn(service, 'getFEData').and.returnValue(emptyEstimates);
    });

    it('should call a method to get the OMData status', () => {
      spyOn(service, 'getOrangeMoneyStatus');

      const omData = {
        orangeData: {
          participantData: {
            investmentRateOfReturn: 0,
            retirementAge: 0,
            currentAnnualSalary: 0,
          },
        },
      } as OrangeData;

      service.getEstimates(omData);
      expect(service.getOrangeMoneyStatus).toHaveBeenCalledWith(omData);
    });

    it('should call getNonFEEstimates when OMStatus == ORANGE_DATA', async () => {
      spyOn(service, 'getOrangeMoneyStatus').and.returnValue(
        OMStatus.ORANGE_DATA
      );

      const omData = {
        orangeData: {
          participantData: {
            investmentRateOfReturn: 0,
            retirementAge: 0,
            currentAnnualSalary: 0,
          },
        },
      } as OrangeData;

      const result = await service.getEstimates(omData);
      expect(service.getNonFEEstimates).toHaveBeenCalledWith(omData);
      expect(service.getFEData).not.toHaveBeenCalledWith(omData);
      expect(result).toBe(emptyEstimates);
    });

    it('should call getFEData when OMStatus == FE_DATA', async () => {
      spyOn(service, 'getOrangeMoneyStatus').and.returnValue(OMStatus.FE_DATA);

      const omData = {
        feForecastData: {
          investmentRateOfReturn: 0,
          feForecast: {
            investmentRateOfReturn: 0.06,
            totalIncome: 100.0,
            goal: 500.0,
            errorCode: null,
            desiredGoal: 0,
            minimumGoal: 0,
          },
          participantData: {
            selectedRetirementAge: 65,
            salary: {
              amount: 150000.0,
              growthRate: 0,
            },
            retirementAgeSlider: {
              min: 47,
              max: 80,
            },
          },
        },
      };

      const result = await service.getEstimates(omData);
      expect(service.getFEData).toHaveBeenCalledWith(omData);
      expect(service.getNonFEEstimates).not.toHaveBeenCalledWith(omData);
      expect(result).toBe(emptyEstimates);
    });

    it('should return null when OMStatus == MADLIB_OM', async () => {
      spyOn(service, 'getOrangeMoneyStatus').and.returnValue(
        OMStatus.MADLIB_OM
      );

      const omData = {madLibData: emptyMadlibData};

      const result = await service.getEstimates(omData);
      expect(service.getNonFEEstimates).not.toHaveBeenCalledWith(omData);
      expect(service.getFEData).not.toHaveBeenCalledWith(omData);
      expect(result).toBe(null);
    });

    it('should return null when OMStatus == MADLIB_FE', async () => {
      spyOn(service, 'getOrangeMoneyStatus').and.returnValue(
        OMStatus.MADLIB_FE
      );

      const omData = {madLibData: emptyMadlibData};

      const result = await service.getEstimates(omData);
      expect(service.getNonFEEstimates).not.toHaveBeenCalledWith(omData);
      expect(service.getFEData).not.toHaveBeenCalledWith(omData);
      expect(result).toBe(null);
    });

    it('should return null when OMStatus == SERVICE_DOWN', async () => {
      spyOn(service, 'getOrangeMoneyStatus').and.returnValue(
        OMStatus.SERVICE_DOWN
      );

      const omData = {madLibData: emptyMadlibData};

      const result = await service.getEstimates(omData);
      expect(service.getNonFEEstimates).not.toHaveBeenCalledWith(omData);
      expect(service.getFEData).not.toHaveBeenCalledWith(omData);
      expect(result).toBe(null);
    });

    it('should return null when OMStatus == UNKNOWN', async () => {
      spyOn(service, 'getOrangeMoneyStatus').and.returnValue(OMStatus.UNKNOWN);

      const omData = {madLibData: emptyMadlibData};

      const result = await service.getEstimates(omData);
      expect(service.getNonFEEstimates).not.toHaveBeenCalledWith(omData);
      expect(service.getFEData).not.toHaveBeenCalledWith(omData);
      expect(result).toBe(null);
    });
  });

  describe('getIncome', () => {
    it('should return incomeAtRA when retire age is less than start age', () => {
      const nonFeLandingObject = {
        calcResponse: {},
        includeSS: true,
        currentPlanID: '878076',
        personalData: {
          annualSalaryIncrementRate: 0,
          closeTheGapPlans: [],
          currentAnnualSalary: 50000,
          currentDcBalance: 1637498.64,
          displayOMVideos: true,
          dob: '1941-01-06T00:00:00',
          firstName: 'PARTICIPAN',
          firstTimeVisitor: false,
          guaranteedIncome: 0,
          hcData: {
            age: 65,
            hcEnable: true,
            healthCareViewed: false,
            state: 'MA',
          },
          includeSocialSecurity: true,
          incomeReplacementRatio: 0.7,
          inflationRate: 0.023,
          investmentRateOfReturn: 0.12,
          omSectionExpanded: true,
          otherAccountPrompt: true,
          outsideRetAssetPrompt: false,
          participantStatus: 'ACTIVE',
          pensionView: null,
          personId: '2143941201',
          replacementIncomeCalcType: 'Balanced',
          retirementAge: 80,
          rothBumpRate: 0.25,
          showSurvey: true,
        },

        calc: {},
        selectedPlan: '878076',
        ssAdditionalBenefits: 0,
        ssAddlBenefitsChgFlag: false,
        ssRetireAge: 70,
        ssStartAge: 80,
        calculatedSSData: {
          calculatedNRAAmt: 2129,
          goal: 2916.67,
          nra: 65,
          ssBenefitRA: 2129,
          ssBenefitNRA: 2129,
          ssBenefitSS: 2129,
          ssDisabled: true,
          ssIncomeRA: 14344.49,
          ssIncomeSS: 0,
          ssNRAAmount: 2129,
          ssRetireAgeMin: 80,
          ssShortfallRA: -13556.819999999998,
          ssShortfallSS: 787.6700000000001,
          ssStartRetireAgeValue: 80,
          ssStartAgeMin: 81,
          ssStartValue: 70,
        },
        guaranteedIncome: 0,
      };
      service.ssAdditionalBenefits = 0;
      const result = service.getIncome(nonFeLandingObject);
      expect(result).toBe(
        nonFeLandingObject.calculatedSSData.ssIncomeRA +
          nonFeLandingObject.calculatedSSData.ssBenefitRA +
          service.ssAdditionalBenefits
      );
    });

    it('should return incomeAtRA when retire age is greater than start age', () => {
      const nonFeLandingObject = {
        calcResponse: {},
        includeSS: true,
        currentPlanID: '878076',
        personalData: {
          annualSalaryIncrementRate: 0,
          closeTheGapPlans: [],
          currentAnnualSalary: 50000,
          currentDcBalance: 1637498.64,
          displayOMVideos: true,
          dob: '1941-01-06T00:00:00',
          firstName: 'PARTICIPAN',
          firstTimeVisitor: false,
          guaranteedIncome: 0,
          hcData: {
            age: 65,
            hcEnable: true,
            healthCareViewed: false,
            state: 'MA',
          },
          includeSocialSecurity: true,
          incomeReplacementRatio: 0.7,
          inflationRate: 0.023,
          investmentRateOfReturn: 0.12,
          omSectionExpanded: true,
          otherAccountPrompt: true,
          outsideRetAssetPrompt: false,
          participantStatus: 'ACTIVE',
          pensionView: null,
          personId: '2143941201',
          replacementIncomeCalcType: 'Balanced',
          retirementAge: 80,
          rothBumpRate: 0.25,
          showSurvey: true,
        },

        calc: {},
        selectedPlan: '878076',
        ssAdditionalBenefits: 0,
        ssAddlBenefitsChgFlag: false,
        ssRetireAge: 90,
        ssStartAge: 80,
        calculatedSSData: {
          calculatedNRAAmt: 2129,
          goal: 2916.67,
          nra: 65,
          ssBenefitRA: 2129,
          ssBenefitNRA: 2129,
          ssBenefitSS: 2129,
          ssDisabled: true,
          ssIncomeRA: 14344.49,
          ssIncomeSS: 0,
          ssNRAAmount: 2129,
          ssRetireAgeMin: 80,
          ssShortfallRA: -13556.819999999998,
          ssShortfallSS: 787.6700000000001,
          ssStartRetireAgeValue: 80,
          ssStartAgeMin: 81,
          ssStartValue: 70,
        },
        guaranteedIncome: 0,
      };
      service.ssAdditionalBenefits = 0;
      const result = service.getIncome(nonFeLandingObject);
      expect(result).toBe(
        nonFeLandingObject.calculatedSSData.ssIncomeRA +
          nonFeLandingObject.calculatedSSData.ssBenefitRA +
          service.ssAdditionalBenefits
      );
    });

    it('should return incomeAtSS when retire age is equal to start age', () => {
      const nonFeLandingObject = {
        calcResponse: {},
        includeSS: true,
        currentPlanID: '878076',
        personalData: {
          annualSalaryIncrementRate: 0,
          closeTheGapPlans: [],
          currentAnnualSalary: 50000,
          currentDcBalance: 1637498.64,
          displayOMVideos: true,
          dob: '1941-01-06T00:00:00',
          firstName: 'PARTICIPAN',
          firstTimeVisitor: false,
          guaranteedIncome: 0,
          hcData: {
            age: 65,
            hcEnable: true,
            healthCareViewed: false,
            state: 'MA',
          },
          includeSocialSecurity: true,
          incomeReplacementRatio: 0.7,
          inflationRate: 0.023,
          investmentRateOfReturn: 0.12,
          omSectionExpanded: true,
          otherAccountPrompt: true,
          outsideRetAssetPrompt: false,
          participantStatus: 'ACTIVE',
          pensionView: null,
          personId: '2143941201',
          replacementIncomeCalcType: 'Balanced',
          retirementAge: 80,
          rothBumpRate: 0.25,
          showSurvey: true,
        },

        calc: {},
        selectedPlan: '878076',
        ssAdditionalBenefits: 0,
        ssAddlBenefitsChgFlag: false,
        ssRetireAge: 90,
        ssStartAge: 90,
        calculatedSSData: {
          calculatedNRAAmt: 2129,
          goal: 2916.67,
          nra: 65,
          ssBenefitRA: 2129,
          ssBenefitNRA: 2129,
          ssBenefitSS: 2129,
          ssDisabled: true,
          ssIncomeRA: 14344.49,
          ssIncomeSS: 0,
          ssNRAAmount: 2129,
          ssRetireAgeMin: 80,
          ssShortfallRA: -13556.819999999998,
          ssShortfallSS: 787.6700000000001,
          ssStartRetireAgeValue: 80,
          ssStartAgeMin: 81,
          ssStartValue: 70,
        },
        guaranteedIncome: 0,
      };
      service.ssAdditionalBenefits = 0;
      const result = service.getIncome(nonFeLandingObject);
      expect(result).toBe(
        nonFeLandingObject.calculatedSSData.ssIncomeSS +
          nonFeLandingObject.calculatedSSData.ssBenefitSS +
          service.ssAdditionalBenefits
      );
    });

    it('should return undefined when retire age and start age are null', () => {
      const nonFeLandingObject = {
        calcResponse: {},
        includeSS: true,
        currentPlanID: '878076',
        personalData: {
          annualSalaryIncrementRate: 0,
          closeTheGapPlans: [],
          currentAnnualSalary: 50000,
          currentDcBalance: 1637498.64,
          displayOMVideos: true,
          dob: '1941-01-06T00:00:00',
          firstName: 'PARTICIPAN',
          firstTimeVisitor: false,
          guaranteedIncome: 0,
          hcData: {
            age: 65,
            hcEnable: true,
            healthCareViewed: false,
            state: 'MA',
          },
          includeSocialSecurity: true,
          incomeReplacementRatio: 0.7,
          inflationRate: 0.023,
          investmentRateOfReturn: 0.12,
          omSectionExpanded: true,
          otherAccountPrompt: true,
          outsideRetAssetPrompt: false,
          participantStatus: 'ACTIVE',
          pensionView: null,
          personId: '2143941201',
          replacementIncomeCalcType: 'Balanced',
          retirementAge: 80,
          rothBumpRate: 0.25,
          showSurvey: true,
        },

        calc: {},
        selectedPlan: '878076',
        ssAdditionalBenefits: 0,
        ssAddlBenefitsChgFlag: false,
        ssRetireAge: null,
        ssStartAge: null,
        calculatedSSData: {
          calculatedNRAAmt: 2129,
          goal: 2916.67,
          nra: 65,
          ssBenefitRA: 2129,
          ssBenefitNRA: 2129,
          ssBenefitSS: 2129,
          ssDisabled: true,
          ssIncomeRA: 14344.49,
          ssIncomeSS: 0,
          ssNRAAmount: 2129,
          ssRetireAgeMin: 80,
          ssShortfallRA: -13556.819999999998,
          ssShortfallSS: 787.6700000000001,
          ssStartRetireAgeValue: 80,
          ssStartAgeMin: 81,
          ssStartValue: 70,
        },
        guaranteedIncome: 0,
      };
      service.ssAdditionalBenefits = 0;
      const result = service.getIncome(nonFeLandingObject);
      expect(result).toBe(2129);
    });
  });

  describe('getDifference', () => {
    it('Should return difference of estimates', () => {
      const nonFeLandingObject = {
        calcResponse: {
          getMonthlySalaryReplacementRequirement() {
            return 100;
          },
        },
        includeSS: true,
        currentPlanID: '878076',
        personalData: {
          annualSalaryIncrementRate: 0,
          closeTheGapPlans: [],
          currentAnnualSalary: 50000,
          currentDcBalance: 1637498.64,
          displayOMVideos: true,
          dob: '1941-01-06T00:00:00',
          firstName: 'PARTICIPAN',
          firstTimeVisitor: false,
          guaranteedIncome: 0,
          hcData: {
            age: 65,
            hcEnable: true,
            healthCareViewed: false,
            state: 'MA',
          },
          includeSocialSecurity: true,
          incomeReplacementRatio: 0.7,
          inflationRate: 0.023,
          investmentRateOfReturn: 0.12,
          omSectionExpanded: true,
          otherAccountPrompt: true,
          outsideRetAssetPrompt: false,
          participantStatus: 'ACTIVE',
          pensionView: null,
          personId: '2143941201',
          replacementIncomeCalcType: 'Balanced',
          retirementAge: 80,
          rothBumpRate: 0.25,
          showSurvey: true,
        },

        calc: {},
        selectedPlan: '878076',
        ssAdditionalBenefits: 0,
        ssAddlBenefitsChgFlag: false,
        ssRetireAge: 70,
        ssStartAge: 80,
        calculatedSSData: {
          calculatedNRAAmt: 2129,
          goal: 2916.67,
          nra: 65,
          ssBenefitRA: 2129,
          ssBenefitNRA: 2129,
          ssBenefitSS: 2129,
          ssDisabled: true,
          ssIncomeRA: 14344.49,
          ssIncomeSS: 0,
          ssNRAAmount: 2129,
          ssRetireAgeMin: 80,
          ssShortfallRA: -13556.819999999998,
          ssShortfallSS: 787.6700000000001,
          ssStartRetireAgeValue: 80,
          ssStartAgeMin: 81,
          ssStartValue: 70,
        },
        guaranteedIncome: 0,
      };
      service.income = 16473.489999999998;
      const result = service.getDifference(nonFeLandingObject);
      expect(result).toBe(
        nonFeLandingObject.calcResponse.getMonthlySalaryReplacementRequirement() -
          service.income
      );
    });
  });

  describe('getSSAddlBenefits', () => {
    it('should return 0 when ssRetireAge < ssStartAge', () => {
      const nonFeLandingObject = {
        calcResponse: {
          getMonthlySalaryReplacementRequirement() {
            return 100;
          },
        },
        includeSS: true,
        currentPlanID: '878076',
        personalData: {
          annualSalaryIncrementRate: 0,
          closeTheGapPlans: [],
          currentAnnualSalary: 50000,
          currentDcBalance: 1637498.64,
          displayOMVideos: true,
          dob: '1941-01-06T00:00:00',
          firstName: 'PARTICIPAN',
          firstTimeVisitor: false,
          guaranteedIncome: 0,
          hcData: {
            age: 65,
            hcEnable: true,
            healthCareViewed: false,
            state: 'MA',
          },
          includeSocialSecurity: true,
          incomeReplacementRatio: 0.7,
          inflationRate: 0.023,
          investmentRateOfReturn: 0.12,
          omSectionExpanded: true,
          otherAccountPrompt: true,
          outsideRetAssetPrompt: false,
          participantStatus: 'ACTIVE',
          pensionView: null,
          personId: '2143941201',
          replacementIncomeCalcType: 'Balanced',
          retirementAge: 80,
          rothBumpRate: 0.25,
          showSurvey: true,
        },

        calc: {},
        selectedPlan: '878076',
        ssAdditionalBenefits: 10,
        ssAddlBenefitsChgFlag: false,
        ssRetireAge: 70,
        ssStartAge: 80,
        calculatedSSData: {
          calculatedNRAAmt: 2129,
          goal: 2916.67,
          nra: 65,
          ssBenefitRA: 2129,
          ssBenefitNRA: 2129,
          ssBenefitSS: 2129,
          ssDisabled: true,
          ssIncomeRA: 14344.49,
          ssIncomeSS: 0,
          ssNRAAmount: 2129,
          ssRetireAgeMin: 80,
          ssShortfallRA: -13556.819999999998,
          ssShortfallSS: 787.6700000000001,
          ssStartRetireAgeValue: 60,
          ssStartAgeMin: 81,
          ssStartValue: 70,
        },
        guaranteedIncome: 0,
      };
      const result = service.getSSAddlBenefits(nonFeLandingObject);
      expect(result).toBe(0);
    });

    it('should return ssAdditionalBenefits when ssRetireAge > ssStartAge', () => {
      const nonFeLandingObject = {
        calcResponse: {
          getMonthlySalaryReplacementRequirement() {
            return 100;
          },
        },
        includeSS: true,
        currentPlanID: '878076',
        personalData: {
          annualSalaryIncrementRate: 0,
          closeTheGapPlans: [],
          currentAnnualSalary: 50000,
          currentDcBalance: 1637498.64,
          displayOMVideos: true,
          dob: '1941-01-06T00:00:00',
          firstName: 'PARTICIPAN',
          firstTimeVisitor: false,
          guaranteedIncome: 0,
          hcData: {
            age: 65,
            hcEnable: true,
            healthCareViewed: false,
            state: 'MA',
          },
          includeSocialSecurity: true,
          incomeReplacementRatio: 0.7,
          inflationRate: 0.023,
          investmentRateOfReturn: 0.12,
          omSectionExpanded: true,
          otherAccountPrompt: true,
          outsideRetAssetPrompt: false,
          participantStatus: 'ACTIVE',
          pensionView: null,
          personId: '2143941201',
          replacementIncomeCalcType: 'Balanced',
          retirementAge: 80,
          rothBumpRate: 0.25,
          showSurvey: true,
        },

        calc: {},
        selectedPlan: '878076',
        ssAdditionalBenefits: 0,
        ssAddlBenefitsChgFlag: false,
        ssRetireAge: 70,
        ssStartAge: 80,
        calculatedSSData: {
          calculatedNRAAmt: 2129,
          goal: 2916.67,
          nra: 65,
          ssBenefitRA: 2129,
          ssBenefitNRA: 2129,
          ssBenefitSS: 2129,
          ssDisabled: true,
          ssIncomeRA: 14344.49,
          ssIncomeSS: 0,
          ssNRAAmount: 2129,
          ssRetireAgeMin: 80,
          ssShortfallRA: -13556.819999999998,
          ssShortfallSS: 787.6700000000001,
          ssStartRetireAgeValue: 80,
          ssStartAgeMin: 70,
          ssStartValue: 70,
        },
        guaranteedIncome: 0,
      };
      const result = service.getSSAddlBenefits(nonFeLandingObject);
      expect(result).toBe(nonFeLandingObject.ssAdditionalBenefits);
    });

    it('should return ssAdditionalBenefits when ssRetireAge = ssStartAge', () => {
      const nonFeLandingObject = {
        calcResponse: {
          getMonthlySalaryReplacementRequirement() {
            return 100;
          },
        },
        includeSS: true,
        currentPlanID: '878076',
        personalData: {
          annualSalaryIncrementRate: 0,
          closeTheGapPlans: [],
          currentAnnualSalary: 50000,
          currentDcBalance: 1637498.64,
          displayOMVideos: true,
          dob: '1941-01-06T00:00:00',
          firstName: 'PARTICIPAN',
          firstTimeVisitor: false,
          guaranteedIncome: 0,
          hcData: {
            age: 65,
            hcEnable: true,
            healthCareViewed: false,
            state: 'MA',
          },
          includeSocialSecurity: true,
          incomeReplacementRatio: 0.7,
          inflationRate: 0.023,
          investmentRateOfReturn: 0.12,
          omSectionExpanded: true,
          otherAccountPrompt: true,
          outsideRetAssetPrompt: false,
          participantStatus: 'ACTIVE',
          pensionView: null,
          personId: '2143941201',
          replacementIncomeCalcType: 'Balanced',
          retirementAge: 80,
          rothBumpRate: 0.25,
          showSurvey: true,
        },

        calc: {},
        selectedPlan: '878076',
        ssAdditionalBenefits: 0,
        ssAddlBenefitsChgFlag: false,
        ssRetireAge: 70,
        ssStartAge: 80,
        calculatedSSData: {
          calculatedNRAAmt: 2129,
          goal: 2916.67,
          nra: 65,
          ssBenefitRA: 2129,
          ssBenefitNRA: 2129,
          ssBenefitSS: 2129,
          ssDisabled: true,
          ssIncomeRA: 14344.49,
          ssIncomeSS: 0,
          ssNRAAmount: 2129,
          ssRetireAgeMin: 80,
          ssShortfallRA: -13556.819999999998,
          ssShortfallSS: 787.6700000000001,
          ssStartRetireAgeValue: 80,
          ssStartAgeMin: 81,
          ssStartValue: 80,
        },
        guaranteedIncome: 0,
      };
      const result = service.getSSAddlBenefits(nonFeLandingObject);
      expect(result).toBe(nonFeLandingObject.ssAdditionalBenefits);
    });

    it('should return undefined when ssRetireAge = ssStartAge = undefined', () => {
      const nonFeLandingObject = {
        calcResponse: {
          getMonthlySalaryReplacementRequirement() {
            return 100;
          },
        },
        includeSS: true,
        currentPlanID: '878076',
        personalData: {
          annualSalaryIncrementRate: 0,
          closeTheGapPlans: [],
          currentAnnualSalary: 50000,
          currentDcBalance: 1637498.64,
          displayOMVideos: true,
          dob: '1941-01-06T00:00:00',
          firstName: 'PARTICIPAN',
          firstTimeVisitor: false,
          guaranteedIncome: 0,
          hcData: {
            age: 65,
            hcEnable: true,
            healthCareViewed: false,
            state: 'MA',
          },
          includeSocialSecurity: true,
          incomeReplacementRatio: 0.7,
          inflationRate: 0.023,
          investmentRateOfReturn: 0.12,
          omSectionExpanded: true,
          otherAccountPrompt: true,
          outsideRetAssetPrompt: false,
          participantStatus: 'ACTIVE',
          pensionView: null,
          personId: '2143941201',
          replacementIncomeCalcType: 'Balanced',
          retirementAge: 80,
          rothBumpRate: 0.25,
          showSurvey: true,
        },

        calc: {},
        selectedPlan: '878076',
        ssAdditionalBenefits: 0,
        ssAddlBenefitsChgFlag: false,
        ssRetireAge: null,
        ssStartAge: null,
        calculatedSSData: {
          calculatedNRAAmt: 2129,
          goal: 2916.67,
          nra: 65,
          ssBenefitRA: 2129,
          ssBenefitNRA: 2129,
          ssBenefitSS: 2129,
          ssDisabled: true,
          ssIncomeRA: 14344.49,
          ssIncomeSS: 0,
          ssNRAAmount: 2129,
          ssRetireAgeMin: 80,
          ssShortfallRA: -13556.819999999998,
          ssShortfallSS: 787.6700000000001,
          ssStartRetireAgeValue: null,
          ssStartAgeMin: 81,
          ssStartValue: null,
        },
        guaranteedIncome: 0,
      };
      const result = service.getSSAddlBenefits(nonFeLandingObject);
      expect(result).toBe(0);
    });
  });

  describe('getFEData', () => {
    it('should return estimates from OrangeMoneyData', () => {
      const orangeData = {
        feForecastData: {
          investmentRateOfReturn: 0,
          feForecast: {
            investmentRateOfReturn: 0.06,
            totalIncome: 100.0,
            goal: 500.0,
            errorCode: null,
            desiredGoal: 0,
            minimumGoal: 0,
          },
          participantData: {
            selectedRetirementAge: 65,
            salary: {
              amount: 150000.0,
              growthRate: 0,
            },
            retirementAgeSlider: {
              min: 47,
              max: 80,
            },
          },
        },
      };
      const result = service.getFEData(orangeData);
      const resultExpect = {
        estimatedMonthlyIncome: 100.0,
        estimatedMonthlyGoal: 500.0,
        difference: 400.0,
        retirementAge: 65,
        currSalary: 150000.0,
      };
      expect(result).toEqual(resultExpect);
    });
  });

  describe('createDollarGraphHeaderObject', () => {
    it('should create the dollar header object', () => {
      const nonFeLandingObject = {
        calcResponse: {
          getMonthlySalaryReplacementRequirement() {
            return 100;
          },
        },
        includeSS: true,
        currentPlanID: '878076',
        personalData: {
          annualSalaryIncrementRate: 0,
          closeTheGapPlans: [],
          currentAnnualSalary: 50000,
          currentDcBalance: 1637498.64,
          displayOMVideos: true,
          dob: '1941-01-06T00:00:00',
          firstName: 'PARTICIPAN',
          firstTimeVisitor: false,
          guaranteedIncome: 0,
          hcData: {
            age: 65,
            hcEnable: true,
            healthCareViewed: false,
            state: 'MA',
          },
          includeSocialSecurity: true,
          incomeReplacementRatio: 0.7,
          inflationRate: 0.023,
          investmentRateOfReturn: 0.12,
          omSectionExpanded: true,
          otherAccountPrompt: true,
          outsideRetAssetPrompt: false,
          participantStatus: 'ACTIVE',
          pensionView: null,
          personId: '2143941201',
          replacementIncomeCalcType: 'Balanced',
          retirementAge: 80,
          rothBumpRate: 0.25,
          showSurvey: true,
        },

        calc: {},
        selectedPlan: '878076',
        ssAdditionalBenefits: 0,
        ssAddlBenefitsChgFlag: false,
        ssRetireAge: 70,
        ssStartAge: 80,
        calculatedSSData: {
          calculatedNRAAmt: 2129,
          goal: 2916.67,
          nra: 65,
          ssBenefitRA: 2129,
          ssBenefitNRA: 2129,
          ssBenefitSS: 2129,
          ssDisabled: true,
          ssIncomeRA: 14344.49,
          ssIncomeSS: 0,
          ssNRAAmount: 2129,
          ssRetireAgeMin: 80,
          ssShortfallRA: -13556.819999999998,
          ssShortfallSS: 787.6700000000001,
          ssStartRetireAgeValue: 60,
          ssStartAgeMin: 81,
          ssStartValue: 70,
        },
        guaranteedIncome: 0,
      };
      spyOn(service, 'getSSAddlBenefits');
      spyOn(service, 'getIncome').and.returnValue(200);
      spyOn(service, 'getDifference').and.returnValue(100);
      const result = service.createDollarGraphHeaderObject(nonFeLandingObject);
      expect(result).toEqual({
        estimatedMonthlyIncome: 200,
        estimatedMonthlyGoal: 100,
        difference: 100,
      });
    });
  });

  describe('getNonFEEstimates', () => {
    it('should return undefined when pension.errormessage', async () => {
      const getpensionSpy = spyOn(service, 'getpension');
      getpensionSpy.and.returnValue(
        Promise.resolve({
          errorMessage: '500 error',
          pensionView: {
            defaultPensionData: {
              mandatoryContrib: 0,
              monthlyIncome: 0,
              pensionViewFlag: null,
              percCOLA: 0,
              retSysCode: null,
              special1: null,
              special2: null,
              srManualPenBenefitType: null,
              srPenCalcMethod: null,
              stateCode: null,
              yearsOfService: 0,
            },
          },
        })
      );
      const result = await service.getNonFEEstimates(emptyOrangeMoneyData);
      expect(result).toBe(undefined);
    });

    it('should call getsrbenefits if pension type is calcBenefit', async () => {
      const getpensionSpy = spyOn(service, 'getpension');
      const getsrbenefitsSpy = spyOn(service, 'getsrbenefits');
      const pension = {
        pensionView: {
          defaultPensionData: {
            mandatoryContrib: 0,
            monthlyIncome: 0,
            pensionViewFlag: 'CalcBenefit',
            percCOLA: 0,
            retSysCode: null,
            special1: null,
            special2: null,
            srManualPenBenefitType: null,
            srPenCalcMethod: null,
            stateCode: null,
            yearsOfService: 0,
          },
          defaultplanId: '878076',
          enabled: true,
          pensionByAgeData: [
            {
              omPensionByAgeAllowed: false,
              pensionByAge: null,
              planId: '878076',
            },
          ],
          pensionViewFlag: 'CalcBenefit',
          planId: '878076',
          planRuleId: '0',
          rulemap: {
            '878076': '0',
          },
          srData: {pensionCalMethod: 'C'},
          stillriverplanId: null,
          vendorData: null,
          vendorplanId: null,
        },
      };
      getpensionSpy.and.returnValue(Promise.resolve(pension));
      getsrbenefitsSpy.and.returnValue(
        Promise.resolve({errorMessage: '500 error'})
      );
      const result = await service.getNonFEEstimates(emptyOrangeMoneyData);
      expect(result).toBe(undefined);
    });
  });

  describe('updateOrangeMoneyOptOut', () => {
    it('should call baseservice post', async () => {
      await service.updateOrangeMoneyOptOut();
      expect(
        baseServiceSpy.post
      ).toHaveBeenCalledWith(
        'myvoya/ws/ers/service/customers/272c2587-6b79-d874-e053-d22aac0a0939/orangemoney/optout',
        {optOut: false}
      );
    });
  });

  describe('postMadlibData', () => {
    it('should call baseService post', async () => {
      await service.postMadlibData('1941-01-06T00:00:00', 15000.0, 'Happy');
      expect(baseServiceSpy.post).toHaveBeenCalledWith(
        'myvoya/ws/ers/service/customers/272c2587-6b79-d874-e053-d22aac0a0939/orangemoney/savemadlib',
        {
          dob: '1941-01-06T00:00:00',
          salary: 15000.0,
          feeling: 'Happy',
        }
      );
    });
  });

  describe('getSalary', () => {
    beforeEach(() => {
      spyOn(service, 'getOrangeData').and.returnValue(of(emptyOrangeMoneyData));
      spyOn(service, 'getEstimates').and.returnValue(
        Promise.resolve(emptyEstimates)
      );
    });
    it('should get salary', async () => {
      const result = await service.getSalary();
      expect(service.getOrangeData).toHaveBeenCalled();
      expect(service.getEstimates).toHaveBeenCalledWith(emptyOrangeMoneyData);
      expect(result).toEqual(emptyEstimates.currSalary);
    });
  });

  describe('getEmployerMatch', () => {
    beforeEach(() => {
      baseServiceSpy.get.and.returnValue(of(employerMatchResponse));
    });
    it('should get employer match data if omEmployerMatch undefined', () => {
      service
        .getOmEmployerMatch('INGWIN', '123456', 'sessionId')
        .subscribe(data => {
          expect(data).toEqual(employerMatchResponse as OmEmployerMatch);
          expect(baseServiceSpy.get).toHaveBeenCalledWith(
            'myvoyage/ws/ers/orangemoney/employerContribution?clientId=INGWIN&planId=123456&s=sessionId'
          );
        });
    });
    it('should return omEmployerMatch if omEmployerMatch defined', () => {
      service['omEmployerMatch'] = of(employerMatchResponse as OmEmployerMatch);

      service.getOmEmployerMatch('INGWIN', '123456', 'sessionId');
      expect(baseServiceSpy.get).not.toHaveBeenCalled();
    });
  });
});

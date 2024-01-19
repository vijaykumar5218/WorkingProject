import {TestBed, waitForAsync} from '@angular/core/testing';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {RouterTestingModule} from '@angular/router/testing';
import {BenefitsService} from './benefits.service';
import {endPoints, tokenEndPoints} from './constants/endpoints';
import {SharedUtilityService} from '../utility/utility.service';
import {BaseService} from '../base/base-factory-provider';
import {ModalController} from '@ionic/angular';
import {BenefitsSelectionModalComponent} from '@shared-lib/components/benefits-selection/modal/modal.component';
import {
  AddMedicalCard,
  Benefit,
  BenefitEnrollment,
  Benefits,
  BenefitsHomeContent,
  BenefitsSelectionContent,
  GuidanceEnabled,
  MyIDCard,
} from './models/benefits.model';
import {HealthUtlization} from '@shared-lib/components/coverages/models/chart.model';
import {environment} from 'mobile/environments/environment';
import {Subject, of, BehaviorSubject} from 'rxjs';
import {FilterList} from '../../models/filter-sort.model';
import {card} from '@shared-lib/components/coverages/plan-tabs/plan-details/my-id-card/constants/camera.enum';
import {EventTrackingService} from '../event-tracker/event-tracking.service';
import {ModalPresentationService} from '../modal-presentation/modal-presentation.service';
import {BSTSmartCardContent} from './models/noBenefit.model';
import {SmartBannerEnableConditions} from '../smart-banner/models/smart-banner.model';

describe('BenefitsService', () => {
  let baseServiceSpy;
  let utilityServiceSpy;
  let service: BenefitsService;
  let modalControllerSpy;
  let benefitData;
  let benefitEnrollmentData;
  let benefitsSelectionContent: BenefitsSelectionContent;
  let link;
  let benefit;
  let guidanceEnabled: GuidanceEnabled;
  let storedFilterKey;
  let storedSortKey;
  let eventTrackingServiceSpy;
  let modalPresentationServiceSpy;
  let benefitSubjectSpy;

  beforeEach(
    waitForAsync(() => {
      baseServiceSpy = jasmine.createSpyObj('BaseService', ['get', 'post']);
      utilityServiceSpy = jasmine.createSpyObj('UtilityService', [
        'appendBaseUrlToEndpoints',
        'getEnvironment',
        'getIsWeb',
      ]);
      utilityServiceSpy.appendBaseUrlToEndpoints.and.callFake(
        endpoints => endpoints
      );
      utilityServiceSpy.getEnvironment.and.returnValue(environment);
      modalControllerSpy = jasmine.createSpyObj('ModalController', ['create']);
      eventTrackingServiceSpy = jasmine.createSpyObj('EventTrackingService', [
        'eventTracking',
      ]);
      modalPresentationServiceSpy = jasmine.createSpyObj(
        'ModalPresentationService',
        ['present']
      );
      benefitSubjectSpy = jasmine.createSpyObj('BenefitSubject', [
        'next',
        'getValue',
      ]);

      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule, RouterTestingModule],
        providers: [
          BenefitsService,
          {provide: BaseService, useValue: baseServiceSpy},
          {provide: SharedUtilityService, useValue: utilityServiceSpy},
          {provide: ModalController, useValue: modalControllerSpy},
          {provide: EventTrackingService, useValue: eventTrackingServiceSpy},
          {
            provide: ModalPresentationService,
            useValue: modalPresentationServiceSpy,
          },
        ],
      });
      benefitData = {
        isEnrollmentWindowEnabled: false,
        planYear: 2022,
        enrolled: [],
        declined: [],
        provided: [],
      };
      benefitEnrollmentData = {
        status: 'COMPLETED',
        enrollmentWindowEnabled: true,
      };
      service = TestBed.inject(BenefitsService);
      service['benefitSubject'] = benefitSubjectSpy;

      benefitsSelectionContent = {
        BenefitsSelectionModalJSON:
          '{"nudge":{"icon":"assets/icon/benefits/calendar.svg","header":"Let\'s do this!","desc1":"Time to select your benefits for the year","desc2":"Answer some questions in the following pages to get a recommendation for the benefits you should select for this year, based on your past and anticipated future needs.","buttonText":"Select Your Benefits","linkText":"See your current summary of benefits"},"beforeStarting":{"header":"Before you get started:","descList":["myHealth &Wealth will help you understand the impact of your benefit choices and make informed decisions all in one place.","When you access myHealth*Wealth, you will be asked a series of questions about your household, your coverage needs and your savings goals.","It is important to note that once you receive your benefits guidance, you will still need to access your enrollment in Workday to make your elections and complete your enrollment."],"descNote":"You will not be enrolled in the benefits unless you complete this step!","usefulInfoHeader":"Useful information to have on hand:","usefulInfoDescList":["Current HSA, FSA account balances","Current emergency savings balance","Spouse/dependent benefit plan details (deductible, coinsurance, premiums) if you would like those plans to be included in the guidance experience"],"buttonLabel":"Continue"}}',
        BenefitsSelectionHomeJSON:
          '{"banner":{"header":"Time to select your benefits for the year","content":"Answer some questions in the following pages to get a recommendation for the benefits you should select for this year... ","icon":"assets/icon/benefits/calendar.svg","altText":"calendar"}}',
      };
      benefit = {
        name: 'name',
        coverage: 0,
        premium: 5,
        premiumFrequency: 'premiumFrequnency',
        deductible: 10,
        type: 'type',
        id: 'id',
        deductibleObj: undefined,
        coverage_levels: undefined,
        coverageType: 'coverageType',
        first_name: 'first_name',
        benefit_type_title: 'benefit_type_title',
      };
      guidanceEnabled = {
        guidanceEnabled: true,
      };
      storedFilterKey = ['test1', 'test2'];
      storedSortKey = 'asc';
      service['currentSmartBannerEnableConditions'] = {
        isSmartBannerHidden: false,
        isSmartBannerDismissed: false,
      };
    })
  );

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('constructor', () => {
    it('should append endpoints', () => {
      expect(utilityServiceSpy.appendBaseUrlToEndpoints).toHaveBeenCalledWith(
        endPoints
      );
      expect(service.endPoints).toEqual(endPoints);
    });

    it('should append token base url to token endpoints', () => {
      expect(utilityServiceSpy.appendBaseUrlToEndpoints).toHaveBeenCalledWith(
        tokenEndPoints,
        environment.tokenBaseUrl
      );
      expect(service.tokenEndPoints).toEqual(tokenEndPoints);
    });
  });

  describe('getSelectedTab$', () => {
    it('should return the selectedTab$ subscriber', () => {
      service['selectedTab$'] = new Subject<string>();
      const result = service.getSelectedTab$();
      expect(result).toEqual(service['selectedTab$']);
    });
  });

  describe('publishSelectedTab', () => {
    it('should call next on the selectedTab subject', () => {
      service['selectedTab$'] = jasmine.createSpyObj('selectedTab$', ['next']);
      service.publishSelectedTab('selectedTab');
      expect(service['selectedTab$'].next).toHaveBeenCalledWith('selectedTab');
    });
  });

  describe('changeFilt', () => {
    const data = [
      {
        label: 'Network',
        values: [
          {name: 'In Network', key: 'inNetwork'},
          {name: 'Out of Network', key: 'OutNetwork'},
        ],
      },

      {
        label: 'Category',

        values: [
          {
            name: 'Preferred Drugs',
            key: 'preferredDrugs',
          },
        ],
      },
    ] as FilterList[];

    it('should call next on the changeFilt subject', () => {
      service['filt'] = jasmine.createSpyObj('filt', ['next']);
      service.changeFilt(data);
      expect(service['filt'].next).toHaveBeenCalledWith(data);
    });
  });

  describe('changeSort', () => {
    it('should call next on the changeSort subject', () => {
      service['sort'] = jasmine.createSpyObj('sort', ['next']);
      service.changeSort('data');
      expect(service['sort'].next).toHaveBeenCalledWith('data');
    });
  });

  describe('changeDateOptions', () => {
    it('should call next on the changeDateOptions subject', () => {
      service['dateOption'] = jasmine.createSpyObj('dateOption', ['next']);
      service.changeDateOptions('data');
      expect(service['dateOption'].next).toHaveBeenCalledWith('data');
    });
  });

  describe('getBenefits', () => {
    beforeEach(() => {
      spyOn(service, 'sortBenefits').and.returnValue(benefitData);
      baseServiceSpy.get.and.returnValue(benefitData);
    });

    it('should call baseservice get', async () => {
      const result = await service.getBenefits();
      expect(baseServiceSpy.get).toHaveBeenCalledWith(
        'myvoyage/health/savvi/plan/benefits'
      );
      expect(service.sortBenefits).toHaveBeenCalledWith(benefitData);
      expect(result).toEqual(benefitData);
    });

    it('should not call baseservice get if promise exists', async () => {
      service['benefitsPromise'] = new Promise(res => {
        res(benefitData);
      });
      const result = await service.getBenefits();
      expect(baseServiceSpy.get).not.toHaveBeenCalledWith(
        'myvoyage/health/savvi/plan/benefits'
      );
      expect(service.sortBenefits).not.toHaveBeenCalledWith(benefitData);
      expect(result).toEqual(benefitData);
    });
  });

  describe('sortBenefits', () => {
    it('should sort all benefits in the Benefits object', () => {
      spyOn(service, 'sortCoverages');

      const benArr1 = [{} as Benefit];
      const benArr2 = [{} as Benefit, {} as Benefit];
      const benArr3 = [{} as Benefit, {} as Benefit, {} as Benefit];

      const bens: Benefits = {
        enrolled: benArr1,
        declined: benArr2,
        provided: benArr3,
        isEnrollmentWindowEnabled: true,
        planYear: 1990,
        payrollDeduction: null,
      };

      service.sortBenefits(bens);

      expect(service.sortCoverages).toHaveBeenCalledWith(benArr1);
      expect(service.sortCoverages).toHaveBeenCalledWith(benArr2);
      expect(service.sortCoverages).toHaveBeenCalledWith(benArr3);
    });

    it('should not call sort benefits if the benefit array is null', () => {
      spyOn(service, 'sortCoverages');

      const bens: Benefits = {
        enrolled: null,
        declined: null,
        provided: null,
        isEnrollmentWindowEnabled: true,
        planYear: 1990,
        payrollDeduction: null,
      };

      service.sortBenefits(bens);

      expect(service.sortCoverages).not.toHaveBeenCalled();
    });
  });

  describe('sortCoverages', () => {
    it('should return a sorted list of coverages', () => {
      const coverages: Benefit[] = [
        {
          type: 'retirement_plan',
        } as Benefit,
        {
          type: 'lpfsa',
        } as Benefit,
        {
          type: 'other_plan',
        } as Benefit,
        {
          type: 'hospital_indemnity',
        } as Benefit,
        {
          type: 'illness_indemnity',
        } as Benefit,
        {
          type: 'accident_indemnity',
        } as Benefit,
        {
          type: 'pension_Plan',
        } as Benefit,
        {
          type: 'fsa',
        } as Benefit,
        {
          type: 'hsa',
        } as Benefit,
        {
          type: 'vision_plan',
        } as Benefit,
        {
          type: 'medical_plan',
        } as Benefit,
        {
          type: 'dental_plan',
        } as Benefit,
      ];

      const result = service.sortCoverages(coverages);

      expect(result).toEqual([
        {
          type: 'medical_plan',
        } as Benefit,
        {
          type: 'dental_plan',
        } as Benefit,
        {
          type: 'vision_plan',
        } as Benefit,
        {
          type: 'accident_indemnity',
        } as Benefit,
        {
          type: 'illness_indemnity',
        } as Benefit,
        {
          type: 'hospital_indemnity',
        } as Benefit,
        {
          type: 'hsa',
        } as Benefit,
        {
          type: 'fsa',
        } as Benefit,
        {
          type: 'lpfsa',
        } as Benefit,
        {
          type: 'retirement_plan',
        } as Benefit,
        {
          type: 'pension_Plan',
        } as Benefit,
        {
          type: 'other_plan',
        } as Benefit,
      ]);
    });
  });

  describe('getNextYearBenefits', () => {
    beforeEach(() => {
      baseServiceSpy.get.and.returnValue(Promise.resolve(benefitData));
      spyOn(service, 'sortBenefits').and.returnValue(benefitData);
    });

    it('should call baseservice get on first call', async () => {
      const result = await service.getNextYearBenefits();
      expect(baseServiceSpy.get).toHaveBeenCalledWith(
        'myvoyage/health/savvi/plan/benefits?nextYearIfAvailable=true&getTotalDeduction=true'
      );
      expect(service.sortBenefits).toHaveBeenCalledWith(benefitData);
      expect(result).toEqual(benefitData);
    });

    it('should return cached data on second call', async () => {
      await service.getNextYearBenefits();
      const result = await service.getNextYearBenefits();
      expect(baseServiceSpy.get).toHaveBeenCalledTimes(1);
      expect(result).toEqual(benefitData);
    });
  });

  describe('getBenefitContent', () => {
    let expectedContent;
    beforeEach(() => {
      expectedContent = {
        header: 'Summary Of Benefits',
        payrollText: 'Payroll deduction per paycheck for',
        coverageLabel: 'Coverage',
        premiumLabel: 'Premium',
        benefitLabel: 'Benefit',
        individualLabel: 'Individual',
        familyLabel: 'Family',
        coInsuranceLabel: 'Coinsurance',
        copayLabel: 'Copay',
        subscriberLabel: 'Subscriber',
        spouseLabel: 'Spouse',
        childLabel: 'Child',
        enrolledSectionTitle: 'Enrolled',
        providedSectionTitle: 'Provided',
        declinedSectionTitle: 'Declined',
        iconMapping: {
          accident_indemnity: 'assets/icon/benefits/umbrella.svg',
          add_insurance: 'assets/icon/benefits/umbrella.svg',
          basic_add_insurance: 'assets/icon/benefits/umbrella.svg',
          basic_life_insurance: 'assets/icon/benefits/umbrella.svg',
          basic_ltd_insurance: 'assets/icon/benefits/umbrella.svg',
          basic_std_insurance: 'assets/icon/benefits/umbrella.svg',
          dental_plan: 'assets/icon/benefits/tooth.svg',
          fsa: 'assets/icon/benefits/shield.svg',
          hospital_indemnity: 'assets/icon/benefits/umbrella.svg',
          hra: 'assets/icon/benefits/shield.svg',
          hsa: 'assets/icon/benefits/shield.svg',
          illness_indemnity: 'assets/icon/benefits/umbrella.svg',
          life_insurance: 'assets/icon/benefits/umbrella.svg',
          lpfsa: 'assets/icon/benefits/shield.svg',
          ltd_insurance: 'assets/icon/benefits/umbrella.svg',
          medical_plan: 'assets/icon/benefits/shield.svg',
          std_insurance: 'assets/icon/benefits/umbrella.svg',
          vision_plan: 'assets/icon/benefits/eye.svg',
        },
        singleLabel: 'Single',
      };
      baseServiceSpy.get.and.returnValue({
        BenefitsSummaryJSON: JSON.stringify(expectedContent),
      });
    });

    it('should call baseService.get and return the parsed content the first time', async () => {
      const result = await service.getBenefitContent();
      expect(baseServiceSpy.get).toHaveBeenCalledWith(
        'myvoyage/ws/ers/content/section/benefitssummary'
      );
      expect(result).toEqual(expectedContent);
    });

    it('should return cached content when called twice', async () => {
      await service.getBenefitContent();
      const result = await service.getBenefitContent();
      expect(baseServiceSpy.get).toHaveBeenCalledTimes(1);
      expect(result).toEqual(expectedContent);
    });
  });

  describe('getSmartBannerEnableConditions', () => {
    it('should return the smartBannerEnableConditions subscriber', () => {
      service['smartBannerEnableConditions'] = new Subject<
        SmartBannerEnableConditions
      >();
      const result = service.getSmartBannerEnableConditions();
      expect(result).toEqual(service['smartBannerEnableConditions']);
    });
  });

  describe('getNoBenefitContents', () => {
    let noBenefitContent;

    beforeEach(() => {
      noBenefitContent = {
        NoBenefitsText:
          'Please refer to your HR / Benefit Administrator for more information.',
      };
    });

    it('Should call the drupal content for no benefit available if it is not already set', async () => {
      baseServiceSpy.get.and.returnValue(Promise.resolve(noBenefitContent));
      const result = await service.getNoBenefitContents();
      expect(baseServiceSpy.get).toHaveBeenCalledWith(
        'myvoyage/ws/ers/content/section/coverages'
      );
      expect(result).toEqual(noBenefitContent);
    });

    it('not call base service if benefit content is already set', async () => {
      service['noBenefitContentsPromise'] = new Promise(res => {
        res(noBenefitContent);
      });
      const result = await service.getNoBenefitContents();
      expect(baseServiceSpy.get).not.toHaveBeenCalled();
      expect(result).toEqual(noBenefitContent);
    });
  });

  describe('setSmartBannerEnableConditions', () => {
    let mockSmartBannerEnableConitions: SmartBannerEnableConditions;
    beforeEach(() => {
      service[
        'smartBannerEnableConditions'
      ] = jasmine.createSpyObj('smartBannerEnableConditions', ['next']);
    });
    it('should call next on the smartBannerEnableConditions subject when isSmartBannerDismissed is present', () => {
      mockSmartBannerEnableConitions = {
        isSmartBannerHidden: false,
        isSmartBannerDismissed: true,
      };
      service.setSmartBannerEnableConditions({isSmartBannerDismissed: true});
      expect(service['smartBannerEnableConditions'].next).toHaveBeenCalledWith(
        mockSmartBannerEnableConitions
      );
    });
    it('should call next on the smartBannerEnableConditions subject when isSmartBannerHidden is present', () => {
      mockSmartBannerEnableConitions = {
        isSmartBannerHidden: true,
        isSmartBannerDismissed: false,
      };
      service.setSmartBannerEnableConditions({isSmartBannerHidden: true});
      expect(service['smartBannerEnableConditions'].next).toHaveBeenCalledWith(
        mockSmartBannerEnableConitions
      );
    });
  });

  describe('getBenefitsSelectionModalContent', () => {
    it('should return the benefit modal content and call base service if the content is not already set', async () => {
      service['benefitSelectionContent'] = undefined;
      baseServiceSpy.get.and.returnValue(
        Promise.resolve(benefitsSelectionContent)
      );
      const result = await service.getBenefitsSelectionModalContent();
      expect(baseServiceSpy.get).toHaveBeenCalledWith(
        'myvoyage/ws/ers/content/section/benefitsselection'
      );
      expect(result).toEqual(
        JSON.parse(benefitsSelectionContent.BenefitsSelectionModalJSON)
      );
    });
  });

  describe('getBenefitsSelectionHomeContent', () => {
    it('should return the benefit home content and not call base service if the content is already set', async () => {
      service['benefitSelectionContent'] = benefitsSelectionContent;
      const result = await service.getBenefitsSelectionHomeContent();
      expect(baseServiceSpy.get).not.toHaveBeenCalled();
      expect(result).toEqual(
        JSON.parse(benefitsSelectionContent.BenefitsSelectionHomeJSON)
      );
    });
  });

  describe('openBenefitsSelectionModalIfEnabled', () => {
    beforeEach(() => {
      spyOn(service, 'getBenefitsEnrollment').and.returnValue(
        Promise.resolve(of(benefitEnrollmentData))
      );
      spyOn(service, 'getGuidanceEnabled').and.returnValue(
        Promise.resolve(guidanceEnabled)
      );
      spyOn(service, 'setSmartBannerEnableConditions');
    });

    it('should not call the benefit enrollment data', async () => {
      service.isDeepLink = true;
      await service.openBenefitsSelectionModalIfEnabled();
      expect(service.getBenefitsEnrollment).not.toHaveBeenCalled();
    });

    it('should get the benefit enrollment data if guidance is enabled and modal has not been seen', async () => {
      await service.openBenefitsSelectionModalIfEnabled();
      expect(service.getBenefitsEnrollment).toHaveBeenCalled();
    });

    it('should not open the benefits selection modal if it is not enabled', async () => {
      await service.openBenefitsSelectionModalIfEnabled();
      expect(service.setSmartBannerEnableConditions).not.toHaveBeenCalled();
      expect(modalControllerSpy.create).not.toHaveBeenCalled();
    });

    it('should open the benefits selection modal if it is enabled and has not been seen', async () => {
      benefitEnrollmentData.status = 'IN_PROGRESS';
      const modal = jasmine.createSpyObj('HTMLIonModalElement', ['']);
      modalControllerSpy.create.and.returnValue(Promise.resolve(modal));
      service['benefitsModalSeen'] = false;
      await service.openBenefitsSelectionModalIfEnabled();
      expect(service.setSmartBannerEnableConditions).toHaveBeenCalledWith({
        isSmartBannerHidden: true,
      });
      expect(modalControllerSpy.create).toHaveBeenCalledWith({
        component: BenefitsSelectionModalComponent,
        cssClass: 'modal-fullscreen',
        componentProps: {},
      });
      expect(modalPresentationServiceSpy.present).toHaveBeenCalledWith(modal);
    });

    it('should not call getBenefitsEnrollment if it has been seen', async () => {
      service['benefitsModalSeen'] = true;
      await service.openBenefitsSelectionModalIfEnabled();
      expect(service.getBenefitsEnrollment).not.toHaveBeenCalled();
    });

    it('should not call getBenefitsEnrollment if guidance is not enabled', async () => {
      guidanceEnabled.guidanceEnabled = false;
      await service.openBenefitsSelectionModalIfEnabled();
      expect(service.getBenefitsEnrollment).not.toHaveBeenCalled();
    });
    it('should not open the benefits selection modal if status is action plan created', async () => {
      benefitEnrollmentData.status = 'ACTION_PLAN_CREATED';
      const modal = jasmine.createSpyObj('HTMLIonModalElement', ['']);
      modalControllerSpy.create.and.returnValue(Promise.resolve(modal));
      service['benefitsModalSeen'] = false;
      await service.openBenefitsSelectionModalIfEnabled();
      expect(service.setSmartBannerEnableConditions).not.toHaveBeenCalled();
      expect(modalControllerSpy.create).not.toHaveBeenCalled();
    });
  });

  describe('resetBenefitsEnrollment', () => {
    it('should set benefitEnrollment back to undefined', () => {
      service['benefitEnrollment'] = benefitEnrollmentData;
      service.resetBenefitsEnrollment();
      expect(service['benefitEnrollment']).toBeUndefined();
    });
  });

  describe('getBenefitsEnrollment', () => {
    let benefitEnrollment: BenefitEnrollment;

    beforeEach(() => {
      benefitEnrollment = {
        enrollmentWindowEnabled: true,
        status: 'NOT_STARTED',
        suppressBanner: false,
      };
      baseServiceSpy.get.and.returnValue(benefitEnrollment);
      spyOn(service, 'getGuidanceEnabled').and.returnValue(
        Promise.resolve(guidanceEnabled)
      );
    });

    it('should not call baseService.get if guidance is not enabled', async () => {
      guidanceEnabled.guidanceEnabled = false;
      await service.getBenefitsEnrollment();
      expect(baseServiceSpy.get).not.toHaveBeenCalled();
    });

    it('should call baseService.get and return the enrollment data the first time if guidance is enabled', async () => {
      (await service.getBenefitsEnrollment()).subscribe(data => {
        expect(baseServiceSpy.get).toHaveBeenCalledWith(
          'myvoyage/health/savvi/benefits/enrollment'
        );
        expect(data).toEqual(benefitEnrollment);
      });
    });

    it('if api get failed to respond', async () => {
      baseServiceSpy.get.and.callFake(() => Promise.reject());
      await service.getBenefitsEnrollment();
      expect(baseServiceSpy.get).toHaveBeenCalledWith(
        'myvoyage/health/savvi/benefits/enrollment'
      );
    });

    it('should return cached content when called twice if guidance is enabled', async () => {
      await service.getBenefitsEnrollment();
      (await service.getBenefitsEnrollment()).subscribe(data => {
        expect(baseServiceSpy.get).toHaveBeenCalledTimes(1);
        expect(data).toEqual(benefitEnrollment);
      });
    });
  });

  describe('getBenefitSummaryBackButton', () => {
    it('return getBenefitSummaryBackButton from local storage if it exists', () => {
      spyOn(Storage.prototype, 'getItem').and.returnValue(link);
      const result = service.getBenefitSummaryBackButton();
      expect(Storage.prototype.getItem).toHaveBeenCalledWith(
        'benefitSummaryBackButton'
      );
      expect(result).toEqual(link);
    });

    it('return getBenefitSummaryBackButton from class property if localStorage is undefined', () => {
      spyOn(Storage.prototype, 'getItem').and.returnValue('undefined');
      service['benefitSummaryBackButton'] = link;
      const result = service.getBenefitSummaryBackButton();
      expect(result).toEqual(link);
    });

    it('return getBenefitSummaryBackButton from class property if localStorage is null', () => {
      spyOn(Storage.prototype, 'getItem').and.returnValue(null);
      service['benefitSummaryBackButton'] = link;
      const result = service.getBenefitSummaryBackButton();
      expect(result).toEqual(link);
    });

    it('return localStorageLink from class property if localStorage is not null', () => {
      spyOn(Storage.prototype, 'getItem').and.returnValue('hello world');
      service['benefitSummaryBackButton'] = link;
      const result = service.getBenefitSummaryBackButton();
      expect(result).toEqual('hello world');
    });
  });

  describe('getCovExp', () => {
    beforeEach(() => {
      const benefitData = {
        Benefit: [
          {
            benefit_type: '',
            explanations: [
              {
                outOfPocketTitle: '',
                outOfPocketDescription: '',
                deductibleTitle: '',
                deductibleDescription: '',
              },
            ],
            benefit_type_title: '',
          },
        ],
      };
      baseServiceSpy.get.and.returnValue(Promise.resolve(benefitData));
    });

    it('return DependentsData if covexplanation is not null', async () => {
      const benefitDataValue = {
        Benefit: [
          {
            benefit_type: '',
            explanations: [
              {
                outOfPocketTitle: '',
                outOfPocketDescription: '',
                deductibleTitle: '',
                deductibleDescription: '',
              },
            ],
            benefit_type_title: '',
          },
        ],
      };

      service.covexplanation = benefitDataValue;
      const result = await service.getCovExp();
      expect(result).toEqual(benefitDataValue);
    });
  });

  describe('setBenefitSummaryBackButton', () => {
    it('should set the benefitSummaryBackButton in localStorage and in the class prop', () => {
      spyOn(Storage.prototype, 'setItem');
      service['benefitSummaryBackButton'] = undefined;
      service.setBenefitSummaryBackButton(link);
      expect(Storage.prototype.setItem).toHaveBeenCalledWith(
        'benefitSummaryBackButton',
        link
      );
      expect(service['benefitSummaryBackButton']).toEqual(link);
    });
  });

  describe('setBenefit', () => {
    it('should set the benefit in local storage and call next on observable', () => {
      spyOn(Storage.prototype, 'setItem');
      service.setBenefit(benefit);
      expect(Storage.prototype.setItem).toHaveBeenCalledWith(
        'selectedBenefit',
        JSON.stringify(benefit)
      );
      expect(service['benefit']).toEqual(benefit);
      expect(benefitSubjectSpy.next).toHaveBeenCalledWith(benefit);
    });
  });

  describe('getSelectedBenefitObservable', () => {
    beforeEach(() => {
      spyOn(service, 'getSelectedBenefit');
    });

    it('should call getSelectedBenefit if getValue == null and then return benefitSubject', () => {
      benefitSubjectSpy.getValue.and.returnValue(null);

      const res = service.getSelectedBenefitObservable();
      expect(service.getSelectedBenefit).toHaveBeenCalled();
      expect(res).toEqual(benefitSubjectSpy);
    });

    it('should not call getSelectedBenefit if getValue == null and then return benefitSubject', () => {
      benefitSubjectSpy.getValue.and.returnValue(benefit);

      const res = service.getSelectedBenefitObservable();
      expect(service.getSelectedBenefit).not.toHaveBeenCalled();
      expect(res).toEqual(benefitSubjectSpy);
    });
  });

  describe('getSelectedBenefit', () => {
    beforeEach(() => {
      spyOn(Storage.prototype, 'getItem').and.returnValue(
        JSON.stringify(benefit)
      );
    });

    it('should return the benefit if without going to local storage if it is set', () => {
      service['benefit'] = benefit;
      const result = service.getSelectedBenefit();
      expect(result).toEqual(benefit);
      expect(Storage.prototype.getItem).not.toHaveBeenCalled();
    });

    it('should get the benefit from local storage if it is not set', () => {
      service['benefit'] = undefined;
      const result = service.getSelectedBenefit();
      expect(result).toEqual(JSON.parse(JSON.stringify(benefit)));
      expect(Storage.prototype.getItem).toHaveBeenCalledWith('selectedBenefit');
      expect(benefitSubjectSpy.next).toHaveBeenCalledWith(result);
    });
  });

  describe('fetchSpending', () => {
    it('should call baseService post with payload for health utilization response', () => {
      const healthDates = {
        startDate: '01/01/2022',
        endDate: '12/31/2022',
      };
      service.fetchSpending(healthDates);

      expect(baseServiceSpy.post).toHaveBeenCalledWith(
        'myvoyage/bst/healthUtlization',
        {
          startDate: '01/01/2022',
          endDate: '12/31/2022',
        }
      );
    });

    it('should call baseService post with payload for health utilization response when refresh is true', () => {
      const healthDates = {
        startDate: '01/01/2022',
        endDate: '12/31/2022',
      };
      service.fetchSpending(healthDates, true);
      expect(baseServiceSpy.post).toHaveBeenCalledWith(
        'myvoyage/bst/healthUtlization',
        {
          startDate: '01/01/2022',
          endDate: '12/31/2022',
        }
      );
    });

    it('should not call baseService post with payload for health utilization response is not null', () => {
      const healthDates = {
        startDate: '01/01/2022',
        endDate: '12/31/2022',
      };
      const data: HealthUtlization = {
        inNetworkEventCount: {
          preferredDrugs: 0,
          outpatientLabPaths: 0,
          specialVisits: 0,
          preventive: 0,
          genericDrugs: 0,
          outpatientXrays: 0,
          primaryVisits: 0,
          inpatientHosptialCares: 0,
          emergencyRoomServices: 0,
          outpatientSurgery: 0,
          other: 0,
        },
        outNetworkEventCount: {
          preferredDrugs: 0,
          outpatientLabPaths: 0,
          specialVisits: 0,
          preventive: 0,
          genericDrugs: 0,
          outpatientXrays: 0,
          primaryVisits: 0,
          inpatientHosptialCares: 0,
          emergencyRoomServices: 0,
          outpatientSurgery: 0,
          other: 0,
        },
        inNetworkCost: {
          outOfPocketCost: 0,
        },
        outNetworkCost: {
          outOfPocketCost: 0,
        },
      };
      service['healthUtlization'] = data;
      service.fetchSpending(healthDates);
      expect(baseServiceSpy.post).not.toHaveBeenCalledWith(
        'myvoyage/bst/healthUtlization',
        {
          startDate: '01/01/2022',
          endDate: '12/31/2022',
        }
      );
    });
  });

  describe('fetchHealthCheckContent', () => {
    it('should call baseService psost with payload for health annual reminder response', async () => {
      const data = {
        physical: true,
        requiredColonScreen: true,
        requiredCytologyScreen: true,
        requiredMammogramScreen: true,
        year: 2022,
      };
      baseServiceSpy.post.and.returnValue(Promise.resolve([data]));

      const healthDates = {
        startDate: '01/01/2022',
        endDate: '12/31/2022',
      };
      const result = await service.fetchHealthCheckContent(healthDates);
      expect(baseServiceSpy.post).toHaveBeenCalledWith(
        'myvoyage/bst/annualHealthCheckup',
        {
          fromYear: 2022,
          toYear: 2022,
        }
      );
      expect(result).toEqual(data);
    });
  });

  describe('getGuidanceEnabled', () => {
    beforeEach(() => {
      baseServiceSpy.get.and.returnValue(Promise.resolve(guidanceEnabled));
    });

    it('should call baseService.get and return the enablement data the first time', async () => {
      const result = await service.getGuidanceEnabled();
      expect(baseServiceSpy.get).toHaveBeenCalledWith(
        endPoints.guidanceEnabled
      );
      expect(result).toEqual(guidanceEnabled);
    });

    it('should return cached content when called twice', async () => {
      await service.getGuidanceEnabled();
      const result = await service.getGuidanceEnabled();
      expect(baseServiceSpy.get).toHaveBeenCalledTimes(1);
      expect(result).toEqual(guidanceEnabled);
    });
  });

  describe('getNoHealthDataContent', () => {
    let noHealthDataContent;

    beforeEach(() => {
      noHealthDataContent = {
        AggregateAccountsMSG: '',
        ComeBackMSG: '',
        FinishJourneyMSG: '',
        Insights_TotalHealthSpend_tileMessage_NoDataAvailable: '<p>Test</p>',
        OpenEnrollmentMSG: '',
      };
    });

    it('Should call the drupal content for no health data available if it is not already set', async () => {
      baseServiceSpy.get.and.returnValue(Promise.resolve(noHealthDataContent));
      const result = await service.getNoHealthDataContent();
      expect(baseServiceSpy.get).toHaveBeenCalledWith(
        'myvoyage/ws/ers/content/section/notifications'
      );
      expect(result).toEqual(noHealthDataContent);
    });

    it('not call base service if health data is already set', async () => {
      service['nohealthUtilization'] = noHealthDataContent;
      const result = await service.getNoHealthDataContent();
      expect(baseServiceSpy.get).not.toHaveBeenCalled();
      expect(result).toEqual(noHealthDataContent);
    });
  });

  describe('getBenefitEnrolledData', () => {
    const benefitData: Benefits = {
      isEnrollmentWindowEnabled: false,
      planYear: 2022,
      enrolled: [
        {
          name: 'name',
          coverage: 0,
          premium: 5,
          premiumFrequency: 'premiumFrequnency',
          deductible: 10,
          type: 'type',
          id: '32323',
          deductibleObj: undefined,
          coverage_levels: undefined,
          coverage_start_date: '01-01-2021',
          coverageType: 'coverageType',
          first_name: 'first_name',
          benefit_type_title: 'benefit_type_title',
          plan_summary: null,
          planDetails: null,
          benAdminFlag: false,
          totalPremium: 100,
        },
      ],
      declined: [],
      provided: [],
    };
    beforeEach(() => {
      spyOn(service, 'getNextYearBenefits').and.returnValue(
        Promise.resolve(benefitData)
      );
    });
    it('should filter the data', done => {
      service.getBenefitEnrolledData('32323').subscribe(data => {
        expect(data).toEqual(benefitData.enrolled[0]);
        expect(service.getNextYearBenefits).toHaveBeenCalled();
        done();
      });
    });
    describe('openGuidelines', () => {
      let modal;
      beforeEach(() => {
        modal = jasmine.createSpyObj('HTMLIonModalElement', [
          'present',
          'dismiss',
        ]);
        modalControllerSpy.create.and.returnValue(Promise.resolve(modal));
        spyOn(service, 'setSmartBannerEnableConditions');
      });

      it('should track the event if trackEvent is true', () => {
        service.openGuidelines(true, 'NOT_STARTED');
        expect(eventTrackingServiceSpy.eventTracking).toHaveBeenCalledWith({
          eventName: 'CTAClick',
          passThruAttributes: [
            {
              attributeName: 'subType',
              attributeValue: 'open_enrollment_banner',
            },
            {
              attributeName: 'Enrollment_user_status',
              attributeValue: 'NOT_STARTED',
            },
          ],
        });
      });

      it('should not track the event if trackEvent is false', () => {
        service.openGuidelines();
        expect(eventTrackingServiceSpy.eventTracking).not.toHaveBeenCalled();
      });

      it('should open the benefits enrollment guidelines', async () => {
        utilityServiceSpy.getIsWeb.and.returnValue(false);
        const modal = jasmine.createSpyObj('HTMLIonModalElement', ['']);
        modalControllerSpy.create.and.returnValue(Promise.resolve(modal));
        await service.openGuidelines();
        expect(service.setSmartBannerEnableConditions).toHaveBeenCalledWith({
          isSmartBannerHidden: true,
        });
        expect(modalControllerSpy.create).toHaveBeenCalledWith({
          component: BenefitsSelectionModalComponent,
          cssClass: 'modal-fullscreen',
          componentProps: {
            showBeforeStarting: true,
            exitIconPath: 'assets/icon/exit.svg',
          },
        });
        expect(modalPresentationServiceSpy.present).toHaveBeenCalledWith(modal);
      });
    });
  });

  describe('getSectionValues', () => {
    it('should call baseservice get getSectionValues', () => {
      service.getSectionValues();
      expect(baseServiceSpy.get).toHaveBeenCalledWith(
        'myvoyage/bst/selectionValues'
      );
    });
  });

  describe('currentDateOpt', () => {
    it('changeDateOptions & currentDateOpt', () => {
      service.changeDateOptions('1');
      service.currentDateOpt().subscribe(data => {
        expect(data).toEqual('1');
      });
    });
  });

  describe('setFiltSlcted', () => {
    it('should set the selectd filter in local storage', () => {
      spyOn(Storage.prototype, 'setItem');
      service.setFiltSlcted(storedFilterKey);
      expect(Storage.prototype.setItem).toHaveBeenCalledWith(
        'storedFilterKey',
        JSON.stringify(storedFilterKey)
      );
      expect(service['storedFilterKey']).toEqual(storedFilterKey);
    });
  });

  describe('getFiltSlcted', () => {
    beforeEach(() => {
      spyOn(Storage.prototype, 'getItem').and.returnValue(
        JSON.stringify(storedFilterKey)
      );
    });
    it('should return the storedFilterKey if without going to local storage if it is set', () => {
      service['storedFilterKey'] = storedFilterKey;
      const result = service.getFiltSlcted();
      expect(result).toEqual(storedFilterKey);
      expect(Storage.prototype.getItem).not.toHaveBeenCalled();
    });
    it('should get the storedFilterKey from local storage if it is not set', () => {
      service['storedFilterKey'] = undefined;
      const result = service.getFiltSlcted();
      expect(result).toEqual(JSON.parse(JSON.stringify(storedFilterKey)));
      expect(Storage.prototype.getItem).toHaveBeenCalledWith('storedFilterKey');
    });
  });

  describe('getSortSlcted', () => {
    beforeEach(() => {
      spyOn(Storage.prototype, 'getItem').and.returnValue(
        JSON.stringify(storedSortKey)
      );
    });
    it('should return the storedSortKey if without going to local storage if it is set', () => {
      service['storedSortKey'] = storedSortKey;
      const result = service.getSortSlcted();
      expect(result).toEqual(storedSortKey);
      expect(Storage.prototype.getItem).not.toHaveBeenCalled();
    });
    it('should get the storedSortKey from local storage if it is not set', () => {
      service['storedSortKey'] = undefined;
      const result = service.getSortSlcted();
      expect(result).toEqual(JSON.parse(JSON.stringify(storedSortKey)));
      expect(Storage.prototype.getItem).toHaveBeenCalledWith('storedSortKey');
    });
  });

  describe('getTotalCostBST', () => {
    it('when totalBST will be greater than 0', () => {
      const mockHealthData: any = {
        inNetworkCost: {
          outOfPocketCost: 22,
        },
        outNetworkCost: {
          outOfPocketCost: 22,
        },
      };
      const result = service.getTotalCostBST(mockHealthData);
      expect(result).toEqual(44);
    });
    it('when totalBST will be 0', () => {
      const mockHealthData = null;
      const result = service.getTotalCostBST(mockHealthData);
      expect(result).toEqual(0);
    });
  });

  describe('getTotalPremium', () => {
    describe('if enrolled length would be greater than zero', () => {
      it('type would be medical_plan', () => {
        const mockBenefit: Benefit = {
          name: 'name',
          coverage: 0,
          premium: 5,
          premiumFrequency: 'premiumFrequnency',
          deductible: 10,
          type: 'medical_plan',
          id: 'id',
          deductibleObj: undefined,
          coverage_levels: undefined,
          coverageType: 'coverageType',
          first_name: 'first_name',
          benefit_type_title: 'benefit_type_title',
          totalPremium: 100,
          coverage_start_date: '01-01-2021',
          plan_summary: null,
          planDetails: null,
          benAdminFlag: false,
        };
        const mockBenefits = {
          isEnrollmentWindowEnabled: false,
          planYear: 2022,
          enrolled: [mockBenefit],
          declined: [],
          provided: [],
        };

        const result = service.getTotalPremium(mockBenefits);
        expect(result).toEqual(100);
      });
      it('type would not be medical_plan', () => {
        const mockBenefit = {
          name: 'name',
          coverage: 0,
          premium: 5,
          premiumFrequency: 'premiumFrequnency',
          deductible: 10,
          type: 'plan',
          id: 'id',
          deductibleObj: undefined,
          coverage_levels: undefined,
          coverageType: 'coverageType',
          first_name: 'first_name',
          benefit_type_title: 'benefit_type_title',
          totalPremium: 100,
          plan_summary: null,
          planDetails: null,
          benAdminFlag: false,
          coverage_start_date: '01-01-2021',
        };
        const mockBenefits = {
          isEnrollmentWindowEnabled: false,
          planYear: 2022,
          enrolled: [mockBenefit],
          declined: [],
          provided: [],
        };
        const result = service.getTotalPremium(mockBenefits);
        expect(result).toEqual(0);
      });
    });

    it('if enrolled length would be greater than zero', () => {
      const mockBenefits = {
        isEnrollmentWindowEnabled: false,
        planYear: 2022,
        enrolled: [],
        declined: [],
        provided: [],
      };
      const result = service.getTotalPremium(mockBenefits);
      expect(result).toEqual(0);
    });

    it('if there is not benefit data', () => {
      const mockBenefits = null;
      const result = service.getTotalPremium(mockBenefits);
      expect(result).toEqual(0);
    });
  });

  describe('getIdCard', () => {
    beforeEach(() => {
      spyOn(service, 'getSelectedBenefit').and.returnValue(benefit);
      service['appendBase64MetaData'] = jasmine
        .createSpy()
        .and.callFake(str => {
          return 'base64' + str;
        });
      spyOn(service['cardImagesSubject'], 'next');
    });
    it('should call subjects with front and back', async () => {
      baseServiceSpy.get.and.callFake(str => {
        if (str.includes('front')) {
          return Promise.resolve({content: 'image-front'});
        } else {
          return Promise.resolve({content: 'image-back'});
        }
      });
      await service.getIdCard();
      expect(service.getSelectedBenefit).toHaveBeenCalled();
      expect(baseServiceSpy.get).toHaveBeenCalledWith(
        'myvoyage/health/savvi/owcc/getMedicalCard/front/id'
      );
      expect(baseServiceSpy.get).toHaveBeenCalledWith(
        'myvoyage/health/savvi/owcc/getMedicalCard/back/id'
      );
      expect(service['cardImagesSubject'].next).toHaveBeenCalledTimes(2);
      expect(service['cardImagesSubject'].next).toHaveBeenCalledWith({
        id: {
          cardFront: 'base64image-front',
          cardBack: 'base64image-back',
        },
      });
      expect(service['appendBase64MetaData']).toHaveBeenCalledWith(
        'image-front'
      );
      expect(service['appendBase64MetaData']).toHaveBeenCalledWith(
        'image-back'
      );
    });
    it('should call subjects with empty if service returns null', async () => {
      baseServiceSpy.get.and.returnValue(Promise.resolve(null));
      await service.getIdCard();
      expect(service['cardImagesSubject'].next).toHaveBeenCalledWith({
        id: {
          cardFront: '',
          cardBack: '',
        },
      });
      expect(service['cardImagesSubject'].next).toHaveBeenCalledWith({
        id: {
          cardFront: '',
          cardBack: '',
        },
      });
    });
  });

  describe('uploadMyIdCard', () => {
    let cardPayload: Array<AddMedicalCard>;
    let cardImage: MyIDCard;
    beforeEach(() => {
      cardPayload = [
        {
          srcDocId: benefit.id,
          srcPlanType: benefit.type,
          docSide: card.FRONT,
          content: 'front',
        },
        {
          srcDocId: benefit.id,
          srcPlanType: benefit.type,
          docSide: card.BACK,
          content: 'back',
        },
      ];
      cardImage = {
        cardFront: 'front',
        cardBack: 'back',
      };
      spyOn(service, 'getSelectedBenefit').and.returnValue(benefit);
      service['appendBase64MetaData'] = jasmine
        .createSpy()
        .and.callFake(str => {
          return 'base64' + str;
        });
      spyOn(service['cardImagesSubject'], 'next');
    });
    it('should call uploadMyIdCard update', () => {
      service['benefitCards'] = {id: {cardFront: 'front', cardBack: 'back'}};
      service.uploadMyIdCard(cardImage);
      expect(baseServiceSpy.post).toHaveBeenCalledWith(
        endPoints.updateMedicalCard,
        cardPayload
      );
      expect(service['cardImagesSubject'].next).toHaveBeenCalledWith({
        id: {
          cardFront: 'base64front',
          cardBack: 'base64back',
        },
      });
      expect(service['appendBase64MetaData']).toHaveBeenCalledWith('front');
      expect(service['appendBase64MetaData']).toHaveBeenCalledWith('back');
      expect(service.getSelectedBenefit).toHaveBeenCalled();
    });
    it('should call uploadMyIdCard add', () => {
      service['benefitCards'] = {id: {cardFront: '', cardBack: ''}};
      service.uploadMyIdCard(cardImage);
      expect(baseServiceSpy.post).toHaveBeenCalledWith(
        endPoints.addMedicalCard,
        cardPayload
      );
    });

    it('should call uploadMyIdCard add when benefitCards is empty', () => {
      service['benefitCards'] = {};
      service.uploadMyIdCard(cardImage);
      expect(baseServiceSpy.post).toHaveBeenCalledWith(
        endPoints.addMedicalCard,
        cardPayload
      );
    });
  });

  describe('trimBase64MetaData', () => {
    let content;
    beforeEach(() => {
      content = 'data:image/png;base64,file-upload';
    });
    it('should call trimBase64MetaData if content include ,', () => {
      content = 'file-upload,';
      service.trimBase64MetaData(content);
      expect(service['trimBase64MetaData'](content)).toEqual('');
    });
    it('should call trimBase64MetaData if content include =', () => {
      content = 'data:image/png;base64,file-upload=';
      service.trimBase64MetaData(content);
      expect(service['trimBase64MetaData'](content)).toEqual('file-upload');
    });
    it('should call trimBase64MetaData if content doesnot include =', () => {
      content = 'file-upload';
      service.trimBase64MetaData(content);
      expect(service['trimBase64MetaData'](content)).toEqual('file-upload');
    });
    it('should call appendBase64MetaData if content includes metadata', () => {
      content = 'data:image/png;base64,file-upload';
      service.trimBase64MetaData(content);
      expect(service['trimBase64MetaData'](content)).toEqual('file-upload');
    });
  });

  describe('appendBase64MetaData', () => {
    let metaData;
    beforeEach(() => {
      metaData = 'data:image/png;base64,';
    });
    it('should call appendBase64MetaData if content does not includes metadata', () => {
      const content = 'kjshdghksldvdfb';
      service.appendBase64MetaData(content);
      expect(service['appendBase64MetaData'](content)).toEqual(
        metaData + content
      );
    });
    it('should call appendBase64MetaData if content includes metadata', () => {
      const content = 'data:image/png;base64,kjshdghksldvdfb';
      expect(service['appendBase64MetaData'](content)).toEqual(content);
    });
  });

  describe('resetImages', () => {
    it('should call resetImages next', () => {
      spyOn(service, 'getSelectedBenefit').and.returnValue(benefit);
      const participantSubjectSpy = jasmine.createSpyObj(
        'BehaviorSubject<MyIDCard>',
        ['next']
      );
      service['cardImagesSubject'] = participantSubjectSpy;

      service['resetImages']();
      expect(participantSubjectSpy.next).toHaveBeenCalledWith({
        id: {
          cardFront: '',
          cardBack: '',
        },
      });
    });
  });

  describe('deleteMedicalCard', () => {
    beforeEach(() => {
      service['resetImages'] = jasmine.createSpy();
    });
    it('should call deleteMedicalCard', () => {
      service['benefit'] = benefit;
      service.deleteMedicalCard();
      expect(service['resetImages']).toHaveBeenCalled();
      expect(baseServiceSpy.get).toHaveBeenCalledWith(
        'myvoyage/health/savvi/owcc/deleteMedicalCard' + '/' + benefit.id
      );
    });
  });

  describe('getCardImages', () => {
    it('should return the card images observable', () => {
      const subject = new BehaviorSubject<Record<string, MyIDCard>>({
        id: {
          cardFront: '',
          cardBack: '',
        },
      });
      service['cardImagesSubject'] = subject;
      const result = service.getCardImages();
      expect(result).toEqual(subject);
    });
  });

  describe('getFlipCardSubject', () => {
    it('should call getFlipCardSubject', () => {
      const subject = new BehaviorSubject<string>('front');
      service['flipCardSubject'] = subject;
      const result = service.getFlipCardSubject();
      expect(result).toEqual(subject);
    });
  });

  describe('flipCard', () => {
    let state: string;
    beforeEach(() => {
      state = 'front';
    });
    it('should set the value of flip to front', () => {
      service['state'] = 'front';
      service.flipCard(state);
      expect(service['state']).toEqual('front');
    });
    it('should set the value of flip to back', () => {
      service['state'] = 'back';
      service.flipCard(state);
      expect(service['state']).toEqual('back');
    });
    it('should call next on the flipCardSubject', () => {
      service['flipCardSubject'] = jasmine.createSpyObj('flipCardSubject', [
        'next',
      ]);
      service.flipCard('state');
      expect(service['flipCardSubject'].next).toHaveBeenCalledWith('front');
    });
  });

  describe('fetchBstSmartCards', () => {
    it('should call baseService.get', async () => {
      const data = {
        sc1: true,
        sc2: true,
        sc6: true,
        sc7: true,
        sc8: true,
        smartcardDetail: [],
      };

      baseServiceSpy.get.and.returnValue(Promise.resolve(data));

      const res = await service.fetchBstSmartCards();

      expect(baseServiceSpy.get).toHaveBeenCalledWith(endPoints.bstSmartCards);
      expect(res).toEqual(data);
    });
  });

  describe('BST Smart Cards', () => {
    const content: BSTSmartCardContent = {
      name: 'sc_3',
      header: 'head',
      header_img: 'img',
      body: 'body',
      body_img: 'body_img',
      link_text: 'link_text',
      modalContent: {
        modalHeader: 'mod_head',
        topHeader: 'top_head',
        topBody: 'top_bod',
        topImage: 'top_img',
        bodyParts: [
          {
            header: 'head',
            body: 'bod',
          },
        ],
      },
    };

    describe('setSelectedSmartCard', () => {
      it('should set selectedSmartCard', () => {
        spyOn(localStorage, 'setItem');

        service.setSelectedSmartCard(content);
        expect(service['selectedSmartCard']).toEqual(content);
        expect(localStorage.setItem).toHaveBeenCalledWith(
          'selected_smart_card',
          JSON.stringify(content)
        );
      });
    });

    describe('getSelectedSmartCard', () => {
      it('should return the selected smart card from local storage if null', () => {
        spyOn(localStorage, 'getItem').and.returnValue(JSON.stringify(content));

        const res = service.getSelectedSmartCard();

        expect(localStorage.getItem).toHaveBeenCalledWith(
          'selected_smart_card'
        );
        expect(res).toEqual(content);
      });

      it('should return the selected smart card not from local storage if not null', () => {
        service['selectedSmartCard'] = content;
        spyOn(localStorage, 'getItem');

        const res = service.getSelectedSmartCard();

        expect(localStorage.getItem).not.toHaveBeenCalled();
        expect(res).toEqual(content);
      });
    });
  });

  describe('getBannerContentObj', () => {
    let mockBenefitHomeContent: BenefitsHomeContent;
    beforeEach(() => {
      mockBenefitHomeContent = {
        openEnrollment: {
          NOT_STARTED: {
            header: 'Get back to your benefits',
            content: 'Stay on track and make your health benefits choices',
            icon: 'assets/icon/benefits/not_started_icon.svg',
            altText: 'calendar',
          },
          IN_PROGRESS: {
            header: 'TIme to select benefit',
            content: 'Stay on track and make your health benefits choices',
            icon: 'assets/icon/benefits/not_started_icon.svg',
            altText: 'calendar',
          },
          ACTION_PLAN_CREATED: {
            header: 'Reminder',
            content:
              'Check out your action plan for a personalized to-do list. It will help you take your next step in your benefits decisions.',
            icon: 'assets/icon/benefits/action_plan_created_icon.svg',
            altText: '',
          },
          COMPLETED: {
            header: 'Great job, your benefits action plan is complete.',
            content:
              "Congrats on checking off your list. Don't forget to come back and revisit as your needs and circumstances change.",
            icon: 'assets/icon/benefits/completed_icon.svg',
            altText: '',
            buttonText: 'Revisit Action Plan',
          },
        },
        outsideEnrollment: {
          NOT_STARTED: {
            header: 'Get back to your benefits',
            content: 'After benefits',
            icon: 'assets/icon/benefits/not_started_icon.svg',
            altText: '',
          },
          IN_PROGRESS: {
            header: 'TIme to select benefit',
            content: 'Stay on track and make your health benefits choices',
            icon: 'assets/icon/benefits/not_started_icon.svg',
            altText: 'calendar',
          },
          ACTION_PLAN_CREATED: {
            header: 'Reminder',
            content:
              'Check out your action plan for a personalized to-do list. It will help you take your next step in your benefits decisions.',
            icon: 'assets/icon/benefits/action_plan_created_icon.svg',
            altText: '',
          },
          COMPLETED: {
            header: 'Great job, your benefits action plan is complete.',
            content:
              "Congrats on checking off your list. Don't forget to come back and revisit as your needs and circumstances change.",
            icon: 'assets/icon/benefits/completed_icon.svg',
            altText: '',
            buttonText: 'Revisit Action Plan',
          },
        },
      };
    });
    it('should return not started object from open enrollment if status is not started and enrollment is true', () => {
      const benefitsEnrollment = {
        status: 'NOT_STARTED',
        enrollmentWindowEnabled: true,
        suppressBanner: false,
      };
      expect(
        service.getBannerContentObj(benefitsEnrollment, mockBenefitHomeContent)
      ).toEqual({
        header: 'Get back to your benefits',
        content: 'Stay on track and make your health benefits choices',
        icon: 'assets/icon/benefits/not_started_icon.svg',
        altText: 'calendar',
      });
    });
    it('should return not started object from outside enrollment if status is not started and enrollment is false', () => {
      const benefitsEnrollment = {
        status: 'NOT_STARTED',
        enrollmentWindowEnabled: false,
        suppressBanner: false,
      };
      expect(
        service.getBannerContentObj(benefitsEnrollment, mockBenefitHomeContent)
      ).toEqual({
        header: 'Get back to your benefits',
        content: 'After benefits',
        icon: 'assets/icon/benefits/not_started_icon.svg',
        altText: '',
      });
    });
  });

  describe('getMBHBenefitDetails', () => {
    let benefitForBenefitUser;

    beforeEach(() => {
      benefitForBenefitUser = {
        "linkUrl": "https://my3.unit.voya.com/myBenefitsHub/home",
        "linkLabel": "Go to myBenefitsHub",
        "title": "Benefits & Coverages"
      };
     
    });

    it('Should call the drupal content for no benefit title available if it is not already set', async () => {
      baseServiceSpy.get.and.returnValue(Promise.resolve(benefitForBenefitUser));
     service.getMBHBenefitDetails().subscribe(data=>{
      expect(baseServiceSpy.get).toHaveBeenCalledWith(
        'myvoyage/ws/ers/service/mybenefitshub/getbenefitsandcoverages'
      );
      expect(data).toEqual(benefitForBenefitUser);
    });
    });

    it('not call base service if benefit title content is already set', async () => {
      service['benefitForBenefitUser'] = of(benefitForBenefitUser);
      service.getMBHBenefitDetails().subscribe(result=>{
      expect(baseServiceSpy.get).not.toHaveBeenCalled();
      expect(result).toEqual(benefitForBenefitUser);
      })
    });
  });
});

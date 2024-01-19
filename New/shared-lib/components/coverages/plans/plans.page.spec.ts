import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {IonicModule} from '@ionic/angular';
import {RouterModule, Router} from '@angular/router';
import {PlansPage} from './plans.page';
import {BenefitsService} from '../../../services/benefits/benefits.service';
import {SharedUtilityService} from '@shared-lib/services/utility/utility.service';
import {of, Subscription} from 'rxjs';
import {PlatformService} from '@shared-lib/services/platform/platform.service';
import {NoBenefitContent} from '@shared-lib/services/benefits/models/noBenefit.model';
import {MyHealthWealth} from '@shared-lib/services/benefits/models/benefits.model';
import {FooterTypeService} from '@shared-lib/modules/footer/services/footer-type/footer-type.service';
import {FooterType} from '@shared-lib/modules/footer/constants/footerType.enum';

describe('PlansPage', () => {
  let component: PlansPage;
  let fixture: ComponentFixture<PlansPage>;
  let benefitsServiceSpy;
  let getBenefitContentSpy;
  let fetchSpy;
  let benefitContent;
  let utilityServiceSpy;
  let mockBenefitData;
  let fetchPlanIdSpy;
  let platformServiceSpy;
  let routerSpy;
  let footerTypeSpy;
  let myHealthWealth: MyHealthWealth;

  beforeEach(
    waitForAsync(() => {
      mockBenefitData = {
        name: '',
        coverage: 0,
        premium: 0,
        totalPremium: 0,
        premiumFrequency: '',
        deductible: 0,
        type: 'dental_plan',
        id: 'bkUzB3q876hc',
        deductibleObj: {},
        coverage_levels: {
          subscriber: 30000.0,
          spouse: 15000.0,
          child: 15000.0,
        },
        coverageType: '',
        first_name: '',
        benefit_type_title: '',
      };
      benefitsServiceSpy = jasmine.createSpyObj('BenefitsService', [
        'getBenefits',
        'getBenefitContent',
        'setBenefit',
        'getNoBenefitContents',
        'openGuidelines',
        'getGuidanceEnabled',
        'publishSelectedTab',
      ]);
      myHealthWealth = {
        description: 'test',
        title: 'title',
        link_name: 'link_name_test',
      };
      const benContent = {
        Insights_ManageMyHealthandWealth: JSON.stringify(myHealthWealth),
      } as NoBenefitContent;
      benefitsServiceSpy.getNoBenefitContents.and.returnValue(
        Promise.resolve(benContent)
      );
      const guidance = {
        guidanceEnabled: true,
      };
      benefitsServiceSpy.getGuidanceEnabled.and.returnValue(
        Promise.resolve(guidance)
      );
      benefitsServiceSpy.getBenefits.and.returnValue(Promise.resolve());
      benefitContent = {
        header: 'Summary Of Benefits',
        payrollText: 'Payroll deduction per paycheck',
        coverageLabel: 'Coverage',
        premiumLabel: 'Premium',
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
      };
      benefitsServiceSpy.getBenefitContent.and.returnValue(
        Promise.resolve(benefitContent)
      );

      utilityServiceSpy = jasmine.createSpyObj('SharedUtilityService', [
        'getIsWeb',
        'fetchUrlThroughNavigation',
      ]);
      utilityServiceSpy.getIsWeb.and.returnValue(Promise.resolve());

      platformServiceSpy = jasmine.createSpyObj('PlatformService', [
        'isDesktop',
      ]);
      platformServiceSpy.isDesktop.and.returnValue(of(true));

      routerSpy = jasmine.createSpyObj('Router', ['navigateByUrl']);
      footerTypeSpy = jasmine.createSpyObj('FooterType', ['publish']);

      TestBed.configureTestingModule({
        declarations: [PlansPage],
        imports: [IonicModule.forRoot(), RouterModule.forRoot([])],
        providers: [
          {provide: BenefitsService, useValue: benefitsServiceSpy},
          {provide: SharedUtilityService, useValue: utilityServiceSpy},
          {provide: PlatformService, useValue: platformServiceSpy},
          {provide: Router, useValue: routerSpy},
          {provide: FooterTypeService, useValue: footerTypeSpy},
        ],
      }).compileComponents();

      fixture = TestBed.createComponent(PlansPage);
      component = fixture.componentInstance;
      fetchSpy = spyOn(component, 'fetchData');
      getBenefitContentSpy = spyOn(component, 'getBenefitContent');
      fetchPlanIdSpy = spyOn(component, 'fetchPlanId');
      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should call fetchPlanId, getBenefitContent', () => {
      component.ngOnInit();
      expect(component.fetchPlanId).toHaveBeenCalled();
      expect(component.getBenefitContent).toHaveBeenCalled();
    });
    it('should set myHealthWealth', () => {
      component.ngOnInit();
      expect(benefitsServiceSpy.getNoBenefitContents).toHaveBeenCalled();
      expect(component.myHealthWealth).toEqual(myHealthWealth);
    });
    describe('when isDesktop got subscribed', () => {
      beforeEach(() => {
        component.isDesktop = false;
      });
      it('if isDesktop will be true', () => {
        component.ngOnInit();
        expect(platformServiceSpy.isDesktop).toHaveBeenCalled();
        expect(component.isDesktop).toEqual(true);
        expect(component.itemsPerPage).toEqual(5);
      });
      it('if isDesktop will be false', () => {
        platformServiceSpy.isDesktop.and.returnValue(of(false));
        component.ngOnInit();
        expect(component.isDesktop).toEqual(false);
        expect(component.itemsPerPage).toEqual(3);
      });
    });
    describe('should call fetchData', () => {
      it('when isWorkplaceDashboard will be true', () => {
        component.isWorkplaceDashboard = true;
        component.ngOnInit();
        expect(component.fetchData).toHaveBeenCalled();
      });
    });
    it('should set isWeb', () => {
      component.isWeb = false;
      utilityServiceSpy.getIsWeb.and.returnValue(true);
      component.ngOnInit();
      expect(component.isWeb).toEqual(true);
      expect(utilityServiceSpy.getIsWeb).toHaveBeenCalled();
    });
  });

  describe('fetchPlanId', () => {
    let subscriptionMock;
    let observable;
    let mockData;
    beforeEach(() => {
      mockData = {
        paramId: 'bkUzB3q876hc',
        url: '/coverages/view-plans/bkUzB3q876hc/details',
      };
      fetchPlanIdSpy.and.callThrough();
      spyOn(component.subscription, 'add');
      observable = of(mockData);
      subscriptionMock = new Subscription();
      spyOn(observable, 'subscribe').and.callFake(f => {
        f(mockData);
        return subscriptionMock;
      });
      component.planId = undefined;
    });
    it("When planId would be 'bkUzB3q876hc'", () => {
      utilityServiceSpy.fetchUrlThroughNavigation.and.returnValue(observable);
      component.fetchPlanId();
      expect(component.planId).toEqual(mockData['paramId']);
      expect(component.subscription.add).toHaveBeenCalledWith(subscriptionMock);
      expect(utilityServiceSpy.fetchUrlThroughNavigation).toHaveBeenCalledWith(
        3
      );
    });
    it('When planId would be undefined', () => {
      utilityServiceSpy.fetchUrlThroughNavigation.and.returnValue(of(null));
      component.fetchPlanId();
      expect(component.planId).toEqual(undefined);
    });
  });

  describe('manageWidthOfCard', () => {
    beforeEach(() => {
      component.isWeb = true;
    });
    describe('isWeb would be true', () => {
      it('When Width would be 385px', () => {
        component.planId = 'bkUzB3q876hc';
        const output = component.manageWidthOfCard(mockBenefitData);
        expect(output).toEqual({width: '385px'});
      });
      it('When Width would be auto', () => {
        component.planId = 'PlanId124';
        const output = component.manageWidthOfCard(mockBenefitData);
        expect(output).toEqual({width: 'auto'});
      });
    });
    it('isWeb would be false', () => {
      component.isWeb = false;
      const output = component.manageWidthOfCard(mockBenefitData);
      expect(output).toEqual(null);
    });
  });

  describe('openGuidelines', () => {
    it('should call benefits service openGuidelines', () => {
      component.openGuidelines();
      expect(benefitsServiceSpy.openGuidelines).toHaveBeenCalled();
    });
  });

  describe('fetchData', () => {
    const mockPlanData =
      '{"planYear":2022,"enrolled":[{"name":"Consumer Plan B","coverage":0,"premium":161.73,"premiumFrequency":"semimonthly","deductible":2800,"type":"medical_plan","id":"bkUzB3q876hc","deductibleObj":{"copay":0,"coinsurance":20,"family":2800},"totalPremium":1617.3,"coverageType":"Family","coverage_start_date":"2021-07-12","coverage_end_date":"2022-12-31"},{"name":"Delta Dental Plan","coverage":0,"premium":7.15,"premiumFrequency":"semimonthly","deductible":50,"type":"dental_plan","id":"b0TrALia7QVb","deductibleObj":{"copay":0,"coinsurance":20,"individual":50,"family":150},"totalPremium":0,"coverageType":"Individual","coverage_start_date":"2021-07-12","coverage_end_date":"2022-12-31"},{"name":"Superior Vision Plan","coverage":0,"premium":1.79,"premiumFrequency":"semimonthly","deductible":0,"type":"vision_plan","id":"bhNUNe4JuzmH","deductibleObj":{"copay":10,"coinsurance":0,"individual":0,"family":0},"totalPremium":0,"coverageType":"Individual","coverage_start_date":"2021-07-12","coverage_end_date":"2022-12-31"},{"name":"Consumer Plan C","coverage":0,"premiumFrequency":"semimonthly","deductible":2800,"type":"accident_indemnity","id":"bkUzB3q876hc9","deductibleObj":{"copay":0,"coinsurance":20,"family":2800},"totalPremium":1617.3,"coverageType":"Family","coverage_start_date":"2021-07-12","coverage_end_date":"2022-12-31"},{"name":"Superior Vision Plan C","coverage":0,"premiumFrequency":"semimonthly","deductible":2800,"type":"accident_indemnity","id":"bkUzB3q876hc90","deductibleObj":{"copay":0,"coinsurance":20,"family":2800},"totalPremium":1617.3,"coverageType":"Family","coverage_start_date":"2021-07-12","coverage_end_date":"2022-12-31"},{"name":"Consumer Plan D","coverage":0,"premiumFrequency":"semimonthly","deductible":200,"type":"accident_indemnity","id":"bkUzB3q876hc9","deductibleObj":{"copay":0,"coinsurance":20,"family":200},"totalPremium":161.3,"coverageType":"Family","coverage_start_date":"2021-07-12","coverage_end_date":"2022-12-31"}],"provided":[],"declined":[{"name":"Traditional Plan C","coverage":0,"premium":0,"premiumFrequency":"semimonthly","deductible":650,"type":"medical_plan","id":"bEjcFdLReNU0","deductibleObj":{"copay":0,"coinsurance":20,"individual":650,"family":1300},"coverageType":"Individual","coverage_start_date":"2022-01-01","coverage_end_date":"2022-12-31"},{"name":"Consumer Plan A","coverage":0,"premium":0,"premiumFrequency":"semimonthly","deductible":2800,"type":"medical_plan","id":"bHbNhKDyXpd0","deductibleObj":{"copay":0,"coinsurance":30,"individual":2800,"family":5600},"coverageType":"Individual","coverage_start_date":"2022-01-01","coverage_end_date":"2022-12-31"},{"name":"Accident Insurance - Non-NY","coverage":0,"premium":0,"premiumFrequency":"semimonthly","deductible":0,"type":"accident_indemnity","id":"bTFFrGHH0DMw","deductibleObj":{},"coverageType":"Individual","coverage_start_date":"2022-01-01","coverage_end_date":"2022-12-31"},{"name":"Critical Illness Insurance","coverage":0,"premium":0,"premiumFrequency":"semimonthly","deductible":0,"type":"illness_indemnity","id":"bb95aPYGRNz9","coverage_levels":{"subscriber":0,"spouse":0,"child":0},"deductibleObj":{},"coverageType":"Individual","coverage_start_date":"2022-01-01","coverage_end_date":"2022-12-31"}]}';

    beforeEach(() => {
      fetchSpy.and.callThrough();
      spyOn(component, 'managePaginationConfig');
    });

    describe('when showPagination will be true', () => {
      beforeEach(() => {
        component.showPagination = true;
        benefitsServiceSpy.getBenefits.and.returnValue(
          Promise.resolve(JSON.parse(mockPlanData))
        );
      });
      it('when isDesktop will be true', async () => {
        component.isDesktop = true;
        await component.fetchData();
        expect(benefitsServiceSpy.getBenefits).toHaveBeenCalled();
        expect(component.coverages).toEqual(JSON.parse(mockPlanData).enrolled);
        expect(component.managePaginationConfig).toHaveBeenCalledWith(1);
      });
      it('when isDesktop will be false', async () => {
        component.isDesktop = false;
        await component.fetchData();
        expect(component.managePaginationConfig).toHaveBeenCalledWith(1);
      });
    });

    it('should set item count to 3 if forHomePageMobile', async () => {
      component.showPagination = false;
      component.forHomePageMobile = true;
      benefitsServiceSpy.getBenefits.and.returnValue(
        Promise.resolve(JSON.parse(mockPlanData))
      );
      await component.fetchData();
      expect(component.currentPage).toEqual(1);
      expect(component.managePaginationConfig).not.toHaveBeenCalled();
      expect(component.itemsPerPage).toEqual(3);
    });

    it('when showPagination will be false', async () => {
      component.showPagination = false;
      benefitsServiceSpy.getBenefits.and.returnValue(
        Promise.resolve(JSON.parse(mockPlanData))
      );
      await component.fetchData();
      expect(component.currentPage).toEqual(1);
      expect(component.managePaginationConfig).not.toHaveBeenCalled();
      expect(component.totalItems).toEqual(6);
      expect(component.itemsPerPage).toEqual(6);
    });

    it('when service get failed', async () => {
      benefitsServiceSpy.getBenefits.and.callFake(() => Promise.reject({}));
      await component.fetchData();
      expect(benefitsServiceSpy.getBenefits).toHaveBeenCalled();
      expect(component.coverages).toEqual([]);
    });
  });

  describe('managePaginationConfig', () => {
    it('should set the value of currentPage, totalItems & paginationConfig', () => {
      component.coverages = [mockBenefitData];
      component.managePaginationConfig(1);
      expect(component.currentPage).toEqual(1);
      expect(component.totalItems).toEqual(1);
      expect(component.paginationConfig).toEqual(
        JSON.stringify({
          conjunction: '',
          currentPage: component.currentPage,
          itemsPerPage: component.itemsPerPage,
          dataSize: component.totalItems,
        })
      );
    });
  });

  describe('paginationChange', () => {
    beforeEach(() => {
      spyOn(component, 'managePaginationConfig');
    });
    it('should call managePaginationConfig', () => {
      component.paginationChange(1);
      expect(component.managePaginationConfig).toHaveBeenCalledWith(1);
    });
  });

  describe('getBenefitContent', () => {
    beforeEach(() => {
      getBenefitContentSpy.and.callThrough();
    });

    it('should get the benefit content from the service', async () => {
      component.benefitContent = undefined;
      await component.getBenefitContent();
      expect(benefitsServiceSpy.getBenefitContent).toHaveBeenCalled();
      expect(component.benefitContent).toEqual(benefitContent);
    });
  });

  describe('viewBenefit', () => {
    describe('should navigate to benefit details page', () => {
      it('when isWeb would be false', () => {
        component.isWeb = false;
        component.viewBenefit(mockBenefitData);
        expect(footerTypeSpy.publish).toHaveBeenCalledWith({
          type: FooterType.tabsnav,
          selectedTab: 'coverages',
        });
        expect(benefitsServiceSpy.setBenefit).toHaveBeenCalledWith(
          mockBenefitData
        );
        expect(routerSpy.navigateByUrl).toHaveBeenCalledWith(
          '/coverages/plan-tabs/details'
        );
      });
      it('when isWeb would be true', () => {
        component.isWeb = true;
        component.viewBenefit(mockBenefitData);
        expect(routerSpy.navigateByUrl).toHaveBeenCalledWith(
          `coverages/view-plans/${mockBenefitData.id}/details`
        );
        expect(benefitsServiceSpy.setBenefit).toHaveBeenCalledWith(
          mockBenefitData
        );
      });
    });
  });

  describe('viewAllBenefits', () => {
    it('should navigate to coverage plans if !isWeb', () => {
      component.isWeb = false;
      component.viewAllBenefits();
      expect(routerSpy.navigateByUrl).toHaveBeenCalledWith(
        '/coverages/coverage-tabs/plans'
      );
      expect(benefitsServiceSpy.publishSelectedTab).toHaveBeenCalledWith(
        'plans'
      );
    });

    it('should navigate to coverages if isWeb', () => {
      component.isWeb = true;
      component.viewAllBenefits();
      expect(routerSpy.navigateByUrl).toHaveBeenCalledWith('/coverages');
    });
  });

  it('ngOnDestroy', () => {
    spyOn(component.subscription, 'unsubscribe');
    component.ngOnDestroy();
    expect(component.subscription.unsubscribe).toHaveBeenCalled();
  });
});

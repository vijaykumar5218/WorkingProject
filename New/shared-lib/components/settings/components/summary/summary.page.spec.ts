import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {IonicModule} from '@ionic/angular';
import {SummaryPage} from './summary.page';
import {Router} from '@angular/router';
import {BenefitsService} from '@shared-lib/services/benefits/benefits.service';
import {SharedUtilityService} from '@shared-lib/services/utility/utility.service';
import {ActionOptions} from '@shared-lib/models/ActionOptions.model';
import {HeaderType} from '@shared-lib/constants/headerType.enum';
import {HeaderTypeService} from '@shared-lib/services/header-type/header-type.service';

describe('SummaryPage', () => {
  let component: SummaryPage;
  let fixture: ComponentFixture<SummaryPage>;
  let headerTypeServiceSpy;
  let router;
  let benefitsServiceSpy;
  let fetchSpy;
  let utilityServiceSpy;
  let benefitContent;

  beforeEach(
    waitForAsync(() => {
      headerTypeServiceSpy = jasmine.createSpyObj('HeaderTypeService', [
        'publish',
      ]);
      utilityServiceSpy = jasmine.createSpyObj('utilityServiceSpy', [
        'getIsWeb',
      ]);

      router = {
        navigateByUrl: jasmine.createSpy('navigate'),
      };

      benefitsServiceSpy = jasmine.createSpyObj('BenefitsService', [
        'getNextYearBenefits',
        'getBenefitContent',
        'getBenefitSummaryBackButton',
        'setBenefitSummaryBackButton',
      ]);
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
      TestBed.configureTestingModule({
        declarations: [SummaryPage],
        imports: [IonicModule.forRoot()],
        providers: [
          {provide: HeaderTypeService, useValue: headerTypeServiceSpy},
          {provide: Router, useValue: router},
          {provide: BenefitsService, useValue: benefitsServiceSpy},
          {provide: SharedUtilityService, useValue: utilityServiceSpy},
        ],
      }).compileComponents();

      fixture = TestBed.createComponent(SummaryPage);
      component = fixture.componentInstance;
      fetchSpy = spyOn(component, 'getBenefitData');
      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should call getBenefitData and getIsWeb', () => {
      component.ngOnInit();
      utilityServiceSpy.getIsWeb.and.returnValue(true);
      expect(component.getBenefitData).toHaveBeenCalled();
    });
  });

  describe('getBenefitData', () => {
    let enrData;

    beforeEach(() => {
      fetchSpy.and.callThrough();

      enrData = {
        planYear: '2022',
        enrolled: [
          {
            name: 'name',
            coverage: 500,
            premium: 100,
            premiumFrequency: 'string',
            deductible: 40,
            icon: 'string',
          },
        ],
        declined: [],
        provided: [],
      };
      benefitsServiceSpy.getNextYearBenefits.and.returnValue(
        Promise.resolve(enrData)
      );
    });

    it('should call benefits service and set the benefits', async () => {
      component.benefits = undefined;
      await component.getBenefitData();
      expect(benefitsServiceSpy.getNextYearBenefits).toHaveBeenCalled();
      expect(component.benefits).toEqual(enrData);
    });

    it('should set hasBenefits to true if there are enrolled benefits', async () => {
      component.hasBenefits = false;
      await component.getBenefitData();
      expect(component.hasBenefits).toBeTrue();
    });

    it('should set hasBenefits to true if there are provided benefits', async () => {
      enrData.enrolled = [];
      enrData.provided = [{}];
      component.hasBenefits = false;
      await component.getBenefitData();
      expect(component.hasBenefits).toBeTrue();
    });

    it('should set hasBenefits to true if there are declined benefits', async () => {
      enrData.enrolled = undefined;
      enrData.provided = [];
      enrData.declined = [{}];
      component.hasBenefits = false;
      await component.getBenefitData();
      expect(component.hasBenefits).toBeTrue();
    });

    it('should set hasBenefits to false if benefits is undefined', async () => {
      benefitsServiceSpy.getNextYearBenefits.and.returnValue(
        Promise.resolve(undefined)
      );
      component.hasBenefits = true;
      await component.getBenefitData();
      expect(component.hasBenefits).toBeFalse();
    });

    it('should set hasBenefits to false if benefits is {}', async () => {
      benefitsServiceSpy.getNextYearBenefits.and.returnValue(
        Promise.resolve({})
      );
      component.hasBenefits = true;
      await component.getBenefitData();
      expect(component.hasBenefits).toBeFalse();
    });

    it('should set hasBenefits to false if only empty enrolled benefits', async () => {
      benefitsServiceSpy.getNextYearBenefits.and.returnValue(
        Promise.resolve({enrolled: []})
      );
      component.hasBenefits = true;
      await component.getBenefitData();
      expect(component.hasBenefits).toBeFalse();
    });

    it('should set hasBenefits to false if only empty provided benefits', async () => {
      benefitsServiceSpy.getNextYearBenefits.and.returnValue(
        Promise.resolve({provided: []})
      );
      component.hasBenefits = true;
      await component.getBenefitData();
      expect(component.hasBenefits).toBeFalse();
    });

    it('should set hasBenefits to false if only empty declined benefits', async () => {
      benefitsServiceSpy.getNextYearBenefits.and.returnValue(
        Promise.resolve({declined: []})
      );
      component.hasBenefits = true;
      await component.getBenefitData();
      expect(component.hasBenefits).toBeFalse();
    });
  });

  describe('ionViewWillEnter', () => {
    it('should fetch the benefits content', async () => {
      component.benefitsContent = undefined;
      await component.ionViewWillEnter();
      expect(benefitsServiceSpy.getBenefitContent).toHaveBeenCalled();
      expect(component.benefitsContent).toEqual(benefitContent);
    });

    it(' should publish header', async () => {
      const actionOption: ActionOptions = {
        headername: 'Summary Of Benefits',
        btnleft: true,
        btnright: true,
        buttonLeft: {
          name: '',
          link: 'settings',
        },
        buttonRight: {
          name: '',
          link: 'notification',
        },
      };
      benefitsServiceSpy.getBenefitSummaryBackButton.and.returnValue(
        'settings'
      );
      await component.ionViewWillEnter();
      expect(benefitsServiceSpy.getBenefitSummaryBackButton).toHaveBeenCalled();
      expect(headerTypeServiceSpy.publish).toHaveBeenCalledWith({
        type: HeaderType.navbar,
        actionOption: actionOption,
      });
      expect(
        benefitsServiceSpy.setBenefitSummaryBackButton
      ).toHaveBeenCalledWith('settings');
    });
  });

  describe('goToAddBenefits', () => {
    it('should navigate to add benefits page', () => {
      component.goToAddBenefits();
      expect(router.navigateByUrl).toHaveBeenCalledWith(
        '/settings/summary/add-benefits'
      );
    });
  });
});

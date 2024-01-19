import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {IonicModule} from '@ionic/angular';
import {BenefitElectionsPage} from './benefit-elections.page';
import {BenefitsService} from '@shared-lib/services/benefits/benefits.service';
import {ElementRef} from '@angular/core';
import {SharedUtilityService} from '@shared-lib/services/utility/utility.service';

describe('BenefitElectionsPage', () => {
  let component: BenefitElectionsPage;
  let fixture: ComponentFixture<BenefitElectionsPage>;
  let benefitsServiceSpy;
  let benefitContent;
  let benefitsData;
  let sharedUtilityServiceSpy;

  beforeEach(
    waitForAsync(() => {
      benefitsServiceSpy = jasmine.createSpyObj('BenefitsService', [
        'getNextYearBenefits',
        'getBenefitContent',
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
      benefitsData = {
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
      sharedUtilityServiceSpy = jasmine.createSpyObj('SharedUtilityService', [
        'scrollToTop',
      ]);

      TestBed.configureTestingModule({
        declarations: [BenefitElectionsPage],
        imports: [IonicModule.forRoot()],
        providers: [
          {provide: BenefitsService, useValue: benefitsServiceSpy},
          {provide: SharedUtilityService, useValue: sharedUtilityServiceSpy},
        ],
      }).compileComponents();

      fixture = TestBed.createComponent(BenefitElectionsPage);
      component = fixture.componentInstance;
      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ionViewWillEnter', () => {
    beforeEach(() => {
      benefitsServiceSpy.getNextYearBenefits.and.returnValue(
        Promise.resolve(benefitsData)
      );
      benefitsServiceSpy.getBenefitContent.and.returnValue(
        Promise.resolve(benefitContent)
      );
      component.benefitsContent = undefined;
      component.benefits = undefined;
      component.topmostElement = {
        nativeElement: jasmine.createSpyObj('nativeElement', [
          'scrollIntoView',
        ]),
      } as ElementRef;
    });
    it('should fetch the benefits content and benefits data', async () => {
      await component.ionViewWillEnter();
      expect(component.benefits).toEqual(benefitsData);
      expect(benefitsServiceSpy.getNextYearBenefits).toHaveBeenCalled();
      expect(benefitsServiceSpy.getBenefitContent).toHaveBeenCalled();
      expect(component.benefitsContent).toEqual(benefitContent);
      expect(sharedUtilityServiceSpy.scrollToTop).toHaveBeenCalledWith(
        component.topmostElement
      );
    });
  });
});

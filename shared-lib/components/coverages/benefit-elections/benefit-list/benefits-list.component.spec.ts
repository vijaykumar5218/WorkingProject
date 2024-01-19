import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {IonicModule} from '@ionic/angular';
import {BenefitsService} from '@shared-lib/services/benefits/benefits.service';
import {BenefitsListComponent} from './benefits-list.component';

describe('BenefitsListComponent', () => {
  let component: BenefitsListComponent;
  let fixture: ComponentFixture<BenefitsListComponent>;
  let benefitsServiceSpy;
  let getBenefitContentSpy;
  let benefitContent;

  beforeEach(
    waitForAsync(() => {
      benefitsServiceSpy = jasmine.createSpyObj('BenefitsService', [
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
        coverageType: 'Family',
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
        declarations: [BenefitsListComponent],
        imports: [IonicModule.forRoot()],
        providers: [{provide: BenefitsService, useValue: benefitsServiceSpy}],
      }).compileComponents();

      fixture = TestBed.createComponent(BenefitsListComponent);
      component = fixture.componentInstance;
      getBenefitContentSpy = spyOn(component, 'getBenefitContent');
      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should call getBenefitContent', () => {
      component.ngOnInit();
      expect(component.getBenefitContent).toHaveBeenCalled();
    });
  });

  describe('getBenefitContent', () => {
    beforeEach(() => {
      getBenefitContentSpy.and.callThrough();
    });

    it('should get the benefit content from the service', async () => {
      component.content = undefined;
      await component.getBenefitContent();
      expect(benefitsServiceSpy.getBenefitContent).toHaveBeenCalled();
      expect(component.content).toEqual(benefitContent);
    });
  });
});

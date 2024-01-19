import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
  waitForAsync,
} from '@angular/core/testing';
import {RouterModule} from '@angular/router';
import {IonicModule} from '@ionic/angular';
import {BenefitsService} from '@shared-lib/services/benefits/benefits.service';
import {SharedUtilityService} from '@shared-lib/services/utility/utility.service';
import {EventManagerService} from '@shared-lib/modules/event-manager/event-manager/event-manager.service';
import {PlanDetailsComponent} from './plan-details.component';
import {of} from 'rxjs';
import {eventKeys} from '@shared-lib/constants/event-keys';
import {ElementRef} from '@angular/core';
import {Benefit} from '@shared-lib/services/benefits/models/benefits.model';

describe('PlanDetailsComponent', () => {
  let component: PlanDetailsComponent;
  let fixture: ComponentFixture<PlanDetailsComponent>;
  let benefitsServiceSpy;
  let getBenefitContentSpy;
  let benefitContent;
  let getCovExpSpy;
  let covExplanation;
  let utilityServiceSpy;
  let eventManagerServiceSpy;
  let benefit: Benefit;

  beforeEach(
    waitForAsync(() => {
      utilityServiceSpy = jasmine.createSpyObj('SharedUtilityService', [
        'getIsWeb',
        'scrollToTop',
      ]);
      benefitsServiceSpy = jasmine.createSpyObj('BenefitsService', [
        'getBenefitContent',
        'getSelectedBenefitObservable',
        'getCovExp',
        'getBenefits',
      ]);
      eventManagerServiceSpy = jasmine.createSpyObj('EventManagerService', [
        'createSubscriber',
      ]);

      benefit = {
        name: 'name',
        coverage: 0,
        premium: 5,
        premiumFrequency: 'premiumFrequnency',
        deductible: 10,
        type: 'SelectedBenefit',
        id: 'id',
        deductibleObj: undefined,
        coverage_levels: undefined,
        coverageType: 'coverageType',
        first_name: 'first_name',
        benefit_type_title: 'benefit_type_title',
        plan_summary: null,
        coverage_start_date: '01-01-2021',
        planDetails: {
          id: 'id',
          type: 'type',
          coverage_start_date: '01-01-2021',
          coverage_end_date: '01-01-2022',
          premium: 12,
          covered_people_ids: [],
          employer_premium: 23,
          deduction_start_date: '01-01-2021',
          deduction_end_date: '01-01-2021',
          dependents: [
            {
              id: 'id',
              relationship: 'child',
              birthdate: '01-01-1992',
              age: 23,
              first_name: 'testfirst',
              last_name: 'testlast',
              country: '',
              coverage_type: 'type',
              coverage_start_date: '01-01-2012',
              coverage_end_date: '01-01-2012',
              deduction_start_date: '01-01-2012',
              deduction_end_date: '01-01-2012',
              premium: '',
              employer_premium: '',
              heading: '',
            },
          ],
        },
        benAdminFlag: false,
      };
      benefitsServiceSpy.getSelectedBenefitObservable.and.returnValue(
        of(benefit)
      );

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

      covExplanation = {
        Benefit: [
          {benefit_type: 'medical_plan'},
          {
            explanations: [
              {
                outOfPocketTitle: 'What is an out-of-pocket maximum?',
                outOfPocketDescription:
                  'Out-of-pocket maximum is the most you could pay for covered medical expenses in a year. This amount includes money you spend o…',
                deductibleTitle: 'What is a deductible?',
                deductibleDescription:
                  'A deductible is the amount you pay each year for most eligible medical services or medications before your health plan begins to share i…',
              },
            ],
          },
        ],
      };

      benefitsServiceSpy.getBenefitContent.and.returnValue(
        Promise.resolve(benefitContent)
      );

      benefitsServiceSpy.getCovExp.and.returnValue(
        Promise.resolve(covExplanation)
      );

      TestBed.configureTestingModule({
        declarations: [PlanDetailsComponent],
        imports: [IonicModule.forRoot(), RouterModule.forRoot([])],
        providers: [
          {provide: BenefitsService, useValue: benefitsServiceSpy},
          {provide: SharedUtilityService, useValue: utilityServiceSpy},
          {provide: EventManagerService, useValue: eventManagerServiceSpy},
        ],
      }).compileComponents();

      fixture = TestBed.createComponent(PlanDetailsComponent);
      component = fixture.componentInstance;

      getBenefitContentSpy = spyOn(component, 'getBenefitContent');
      getCovExpSpy = spyOn(component, 'fetchCovExp');
      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    beforeEach(() => {
      spyOn(component, 'fetchData');
    });
    it('should call fetchData when isWeb would be false', () => {
      utilityServiceSpy.getIsWeb.and.returnValue(false);
      component.ngOnInit();
      expect(component.fetchData).toHaveBeenCalled();
    });
    it('should not call fetchData when isWeb would be true', () => {
      utilityServiceSpy.getIsWeb.and.returnValue(true);
      component.ngOnInit();
      expect(component.fetchData).not.toHaveBeenCalled();
    });
  });

  describe('fetchData', () => {
    beforeEach(() => {
      benefitsServiceSpy.getSelectedBenefitObservable.and.returnValue(
        of(benefit)
      );
      component.fetchData();
    });
    it('should get selected benefit from service', () => {
      expect(component.getBenefitContent).toHaveBeenCalled();
      expect(component.selectedBenefit).toEqual(benefit);
    });

    it('should set dependentsData', () => {
      expect(component.dependentsData).toEqual(benefit.planDetails.dependents);
    });
    it('should call fetchCovExp', () => {
      expect(component.fetchCovExp).toHaveBeenCalled();
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

  describe('fetchCovExp', () => {
    beforeEach(() => {
      getCovExpSpy.and.callThrough();
    });

    it('should get coverage explanation content from the service', async () => {
      component.covExplanation = undefined;
      await component.fetchCovExp();
      expect(benefitsServiceSpy.getCovExp).toHaveBeenCalled();
      expect(component.covExplanation).toEqual(covExplanation);
    });
  });

  describe('ionViewDidEnter', () => {
    beforeEach(() => {
      eventManagerServiceSpy.createSubscriber.and.returnValue(of(''));
      spyOn(component, 'fetchData');
      component.topmostElement = {
        nativeElement: jasmine.createSpyObj('nativeElement', [
          'scrollIntoView',
        ]),
      } as ElementRef;
    });
    it('should call fetchData if getIsWeb returns true', fakeAsync(() => {
      utilityServiceSpy.getIsWeb.and.returnValue(true);
      component.ionViewDidEnter();
      expect(eventManagerServiceSpy.createSubscriber).toHaveBeenCalledWith(
        eventKeys.refreshCoveragePlansDetails
      );
      tick(100);
      expect(component.fetchData).toHaveBeenCalled();
      expect(utilityServiceSpy.scrollToTop).toHaveBeenCalledWith(
        component.topmostElement
      );
    }));
    it('should not call fetchData if getIsWeb returns false', () => {
      utilityServiceSpy.getIsWeb.and.returnValue(false);
      component.ionViewDidEnter();
      expect(eventManagerServiceSpy.createSubscriber).not.toHaveBeenCalled();
      expect(component.fetchData).not.toHaveBeenCalled();
    });
  });

  it('ngOnDestroy', () => {
    spyOn(component.subscription, 'unsubscribe');
    component.ngOnDestroy();
    expect(component.subscription.unsubscribe).toHaveBeenCalled();
  });
});

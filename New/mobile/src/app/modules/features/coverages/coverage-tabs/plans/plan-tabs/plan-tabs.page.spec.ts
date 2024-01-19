import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {RouterTestingModule} from '@angular/router/testing';
import {IonicModule} from '@ionic/angular';
import {BenefitsService} from '@shared-lib/services/benefits/benefits.service';
import {FooterTypeService} from '@shared-lib/modules/footer/services/footer-type/footer-type.service';
import {HeaderType} from '@shared-lib/constants/headerType.enum';
import {HeaderTypeService} from '@shared-lib/services/header-type/header-type.service';
import {PlanTabsPage} from './plan-tabs.page';
import * as pageText from '@shared-lib/constants/coverage.json';

describe('PlanTabsPage', () => {
  let component: PlanTabsPage;
  let fixture: ComponentFixture<PlanTabsPage>;
  let headerTypeServiceSpy;
  let footerTypeServiceSpy;
  let benefitsServiceSpy;
  const pagetext = pageText;

  beforeEach(
    waitForAsync(() => {
      headerTypeServiceSpy = jasmine.createSpyObj('HeaderTypeService', [
        'publish',
      ]);
      footerTypeServiceSpy = jasmine.createSpyObj('FooterTypeService', [
        'publish',
      ]);
      benefitsServiceSpy = jasmine.createSpyObj('BenefitsService', [
        'getBenefits',
        'getSelectedBenefit',
      ]);
      benefitsServiceSpy.getBenefits.and.returnValue(Promise.resolve());
      const benefit = {
        name: 'SelectedBenefit',
        coverage: 0,
        premium: 0,
        premiumFrequency: '',
        deductible: 0,
        type: '',
        id: '',
        deductibleObj: {
          coinsurance: 0,
          copay: 0,
          family: 0,
          individual: 0,
          single: 0,
        },
        coverage_levels: {
          subscriber: 0,
          spouse: 0,
          child: 0,
        },
        coverageType: '',
        first_name: '',
        benefit_type_title: '',
        coverage_start_date: '01-01-2021',
        plan_summary: null,
        planDetails: null,
        benAdminFlag: false,
      };
      benefitsServiceSpy.getSelectedBenefit.and.returnValue(benefit);

      TestBed.configureTestingModule({
        declarations: [PlanTabsPage],
        imports: [IonicModule.forRoot(), RouterTestingModule],
        providers: [
          {provide: HeaderTypeService, useValue: headerTypeServiceSpy},
          {provide: FooterTypeService, useValue: footerTypeServiceSpy},
          {provide: BenefitsService, useValue: benefitsServiceSpy},
        ],
      }).compileComponents();

      fixture = TestBed.createComponent(PlanTabsPage);
      component = fixture.componentInstance;
      component.selectedBenefit = benefit;
      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should setup 1 tab', () => {
      expect(component.tabs).toEqual([
        {
          label: pagetext.detailsLabel,
          link: 'details',
        },
      ]);
    });
  });

  describe('tabChange', () => {
    it('should call ionViewWillEnter', () => {
      spyOn(component, 'ionViewWillEnter');
      component.tabChange();
      expect(component.ionViewWillEnter).toHaveBeenCalled();
    });
  });

  describe('ionViewWillEnter', () => {
    it(' should publish header', () => {
      component.actionOption = {headername: ''};
      benefitsServiceSpy.getSelectedBenefit.and.returnValue({
        name: 'SelectedBenefit',
      });
      component.ionViewWillEnter();
      expect(component.actionOption.headername).toEqual('SelectedBenefit');
      expect(headerTypeServiceSpy.publish).toHaveBeenCalledWith({
        type: HeaderType.navbar,
        actionOption: {headername: 'SelectedBenefit'},
      });
    });
  });

  describe('handleClick', () => {
    it('should set selectedTab', () => {
      component.handleClick({label: 'test', link: 'testlink'});
      expect(component.selectedTab).toEqual('testlink');
    });
  });
});

import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {IonicModule} from '@ionic/angular';
import {BenefitsService} from '@shared-lib/services/benefits/benefits.service';
import {NoBenefitsComponent} from './no-benefits.component';

describe('NoBenefitsComponent', () => {
  let component: NoBenefitsComponent;
  let fixture: ComponentFixture<NoBenefitsComponent>;
  let benefitsServiceSpy;
  let fetchNoBenefitSpy;

  beforeEach(
    waitForAsync(() => {
      benefitsServiceSpy = jasmine.createSpyObj('BenefitsService', [
        'getNoBenefitContents',
      ]);
      TestBed.configureTestingModule({
        declarations: [NoBenefitsComponent],
        imports: [IonicModule.forRoot()],
        providers: [{provide: BenefitsService, useValue: benefitsServiceSpy}],
      }).compileComponents();

      fixture = TestBed.createComponent(NoBenefitsComponent);
      component = fixture.componentInstance;
      fetchNoBenefitSpy = spyOn(component, 'fetchNoBenefit');
      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should call fetchNoBenefit', () => {
      component.ngOnInit();
      expect(component.fetchNoBenefit).toHaveBeenCalled();
    });
  });

  describe('fetchNoBenefit', () => {
    let nbText;

    beforeEach(() => {
      fetchNoBenefitSpy.and.callThrough();
      nbText = {
        NoBenefitsText:
          'Please refer to your HR / Benefit Administrator for more information.',
        workplaceCovergeNoBenefits:
          '{"noBenefitHeader":"No Benefits Available","noBenefitDescription":"Please refer to your HR / Benefit Administrator for more information."}',
      };
      benefitsServiceSpy.getNoBenefitContents.and.returnValue(
        Promise.resolve(nbText)
      );
    });

    it('should load NoBenefit Data', async () => {
      component.nobenfitdata = undefined;
      await component.fetchNoBenefit();
      expect(component.nobenfitdata).toEqual(nbText);
    });

    it('when workplaceDashboard will be true', async () => {
      component.workplaceDashboardBenefitData = undefined;
      component.workplaceDashboard = true;
      await component.fetchNoBenefit();
      expect(component.workplaceDashboardBenefitData).toEqual(
        JSON.parse(nbText.workplaceCovergeNoBenefits)
      );
    });
  });
});

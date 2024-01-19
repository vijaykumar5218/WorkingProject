import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {IonicModule} from '@ionic/angular';
import {BenefitsService} from '../../../../../services/benefits/benefits.service';
import {
  NoBenefitContent,
  PrevCareContent,
} from '../../../../../services/benefits/models/noBenefit.model';
import {SharedUtilityService} from '../../../../../services/utility/utility.service';

import {ScreeningNudgeComponent} from './screening-nudge.component';

describe('ScreeningNudgeComponent', () => {
  let component: ScreeningNudgeComponent;
  let fixture: ComponentFixture<ScreeningNudgeComponent>;
  let utilityServiceSpy;
  let benefitsServiceSpy;
  let noBenContent;
  let screeningContent: PrevCareContent;

  beforeEach(
    waitForAsync(() => {
      screeningContent = {
        title: 'test title',
        title_img_url: 'test img url',
        title_img_alt: 'title-alt',
        body: 'test body',
        body_img_url: 'test body img url',
        body_img_alt: 'body-alt',
        footer_text: 'test footer',
      };
      noBenContent = {
        INSIGHTS_PreventativeCancerScreening_Breast: JSON.stringify(
          screeningContent
        ),
      } as NoBenefitContent;

      utilityServiceSpy = jasmine.createSpyObj('UtilityService', ['getIsWeb']);
      benefitsServiceSpy = jasmine.createSpyObj('BenefitsService', [
        'getNoBenefitContents',
      ]);

      utilityServiceSpy.getIsWeb.and.returnValue(false);
      benefitsServiceSpy.getNoBenefitContents.and.returnValue(
        Promise.resolve(noBenContent)
      );

      TestBed.configureTestingModule({
        declarations: [ScreeningNudgeComponent],
        providers: [
          {provide: SharedUtilityService, useValue: utilityServiceSpy},
          {provide: BenefitsService, useValue: benefitsServiceSpy},
        ],
        imports: [IonicModule.forRoot()],
      }).compileComponents();

      fixture = TestBed.createComponent(ScreeningNudgeComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should set isWeb', async () => {
      component.isWeb = false;
      utilityServiceSpy.getIsWeb.and.returnValue(true);

      await component.ngOnInit();

      expect(component.isWeb).toBeTrue();
    });

    it('should call getNoBenefitContents and set content if prevCareKey is set', async () => {
      component.prevCareKey = 'INSIGHTS_PreventativeCancerScreening_Breast';

      await component.ngOnInit();

      expect(benefitsServiceSpy.getNoBenefitContents).toHaveBeenCalled();
      expect(component.content).toEqual(screeningContent);
    });

    it('should call getNoBenefitContents and content should be null if prevCareKey is not set', async () => {
      component.prevCareKey = '';

      await component.ngOnInit();

      expect(benefitsServiceSpy.getNoBenefitContents).toHaveBeenCalled();
      expect(component.content).toEqual(undefined);
    });
  });
});

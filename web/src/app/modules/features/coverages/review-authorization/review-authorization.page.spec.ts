import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {IonicModule} from '@ionic/angular';
import {ConsentService} from '@shared-lib/services/consent/consent.service';
import {ActivatedRoute, Router} from '@angular/router';
import {BenefitsService} from '@shared-lib/services/benefits/benefits.service';
import {ReviewAuthorizationPage} from './review-authorization.page';
import {RouterTestingModule} from '@angular/router/testing';
import {ConsentType} from '@shared-lib/services/consent/constants/consentType.enum';
import {HeaderTypeService} from '@web/app/modules/shared/services/header-type/header-type.service';
import {of} from 'rxjs';

describe('ReviewAuthorizationPage', () => {
  let component: ReviewAuthorizationPage;
  let fixture: ComponentFixture<ReviewAuthorizationPage>;
  let consentServiceSpy;
  let routerSpy;
  let benefitsServiceSpy;
  let headerTypeServiceSpy;

  const mockNoBenefitsContent = {
    Insights_ClaimsAuthorization_ReadDisclosure: JSON.stringify({
      auth_Text: 'test auth text',
      disclosure_parts: [
        {
          disclosure_description_1: 'desc',
          disclosure_description_2: 'title',
          disclosure_title: 'img',
        },
      ],
    }),
  } as any;
  let activatedRouteSpy;

  beforeEach(
    waitForAsync(() => {
      headerTypeServiceSpy = jasmine.createSpyObj('headerTypeServiceSpy', [
        'backToPrevious',
      ]);
      consentServiceSpy = jasmine.createSpyObj('ConsentService', [
        'setConsent',
        'getMedicalConsent',
      ]);
      routerSpy = jasmine.createSpyObj('Router', ['navigateByUrl']);
      benefitsServiceSpy = jasmine.createSpyObj('BenefitsService', [
        'getNoBenefitContents',
      ]);
      benefitsServiceSpy.getNoBenefitContents.and.returnValue(
        Promise.resolve(mockNoBenefitsContent)
      );
      (activatedRouteSpy = {
        queryParams: of({
          redirectTo: 'coverage',
        }),
      }),
        TestBed.configureTestingModule({
          declarations: [ReviewAuthorizationPage],
          imports: [IonicModule.forRoot(), RouterTestingModule],
          providers: [
            {provide: ConsentService, useValue: consentServiceSpy},
            {provide: Router, useValue: routerSpy},
            {provide: BenefitsService, useValue: benefitsServiceSpy},
            {provide: HeaderTypeService, useValue: headerTypeServiceSpy},
            {provide: ActivatedRoute, useValue: activatedRouteSpy},
          ],
        }).compileComponents();

      fixture = TestBed.createComponent(ReviewAuthorizationPage);
      component = fixture.componentInstance;
      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should fetch content', () => {
      expect(benefitsServiceSpy.getNoBenefitContents).toHaveBeenCalled();
      expect(component.contentData).toEqual(
        JSON.parse(
          mockNoBenefitsContent.Insights_ClaimsAuthorization_ReadDisclosure
        )
      );
    });
    it('when set the value of redirectTo', () => {
      expect(component.redirectTo).toEqual('coverage');
    });
  });

  describe('saveConsent', () => {
    beforeEach(() => {
      consentServiceSpy.setConsent.and.returnValue(Promise.resolve());
    });
    describe('when radioSelection === YES', () => {
      beforeEach(() => {
        component.radioSelection = 'YES';
      });
      it('when redirectTo will be undefined', async () => {
        component.redirectTo = undefined;
        await component.saveConsent();
        expect(consentServiceSpy.setConsent).toHaveBeenCalledWith(
          ConsentType.MEDICAL,
          true
        );
        expect(consentServiceSpy.getMedicalConsent).toHaveBeenCalledWith(true);
        expect(headerTypeServiceSpy.backToPrevious).toHaveBeenCalled();
      });
      it('when redirectTo will be defined', async () => {
        component.redirectTo = '/coverage';
        await component.saveConsent();
        expect(headerTypeServiceSpy.backToPrevious).not.toHaveBeenCalled();
        expect(routerSpy.navigateByUrl).toHaveBeenCalledWith(
          component.redirectTo
        );
      });
    });
    it('when radioSelection === NO', async () => {
      component.radioSelection = 'NO';
      await component.saveConsent();
      expect(consentServiceSpy.setConsent).not.toHaveBeenCalled();
      expect(consentServiceSpy.getMedicalConsent).not.toHaveBeenCalled();
      expect(headerTypeServiceSpy.backToPrevious).not.toHaveBeenCalled();
      expect(routerSpy.navigateByUrl).toHaveBeenCalledWith(
        '/coverages/all-coverages/elections'
      );
    });
  });
});

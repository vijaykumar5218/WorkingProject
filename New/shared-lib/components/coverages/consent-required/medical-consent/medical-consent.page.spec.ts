import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {IonicModule, LoadingController, ModalController} from '@ionic/angular';
import {ConsentService} from '@shared-lib/services/consent/consent.service';
import {MedicalConsentPage} from './medical-consent.page';
import {ConsentType} from '@shared-lib/services/consent/constants/consentType.enum';
import {Router} from '@angular/router';
import {BenefitsService} from '@shared-lib/services/benefits/benefits.service';
import {SharedUtilityService} from '@shared-lib/services/utility/utility.service';
import {Location} from '@angular/common';

describe('MedicalConsentPage', () => {
  let component: MedicalConsentPage;
  let fixture: ComponentFixture<MedicalConsentPage>;
  let modalControllerSpy;
  let consentServiceSpy;
  let loadingControllerSpy;
  let routerSpy;
  let benefitsServiceSpy;
  let utilityServiceSpy;
  let locationSpy;

  beforeEach(
    waitForAsync(() => {
      utilityServiceSpy = jasmine.createSpyObj('utilityServiceSpy', [
        'getIsWeb',
      ]);
      modalControllerSpy = jasmine.createSpyObj('ModalController', ['dismiss']);
      consentServiceSpy = jasmine.createSpyObj('ConsentService', [
        'setConsent',
        'getMedicalConsent',
      ]);
      loadingControllerSpy = jasmine.createSpyObj('LoadingController', [
        'create',
      ]);
      routerSpy = jasmine.createSpyObj('Router', ['navigateByUrl']);
      benefitsServiceSpy = jasmine.createSpyObj('BenefitsService', [
        'publishSelectedTab',
      ]);
      locationSpy = jasmine.createSpyObj('Location', ['back']);

      TestBed.configureTestingModule({
        declarations: [MedicalConsentPage],
        imports: [IonicModule.forRoot()],
        providers: [
          {provide: ModalController, useValue: modalControllerSpy},
          {provide: ConsentService, useValue: consentServiceSpy},
          {provide: LoadingController, useValue: loadingControllerSpy},
          {provide: Router, useValue: routerSpy},
          {provide: BenefitsService, useValue: benefitsServiceSpy},
          {provide: SharedUtilityService, useValue: utilityServiceSpy},
          {provide: Location, useValue: locationSpy},
        ],
      }).compileComponents();

      fixture = TestBed.createComponent(MedicalConsentPage);
      component = fixture.componentInstance;
      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should call getIsWeb and set isWeb', () => {
      component.isWeb = false;
      utilityServiceSpy.getIsWeb.and.returnValue(true);
      component.ngOnInit();
      expect(utilityServiceSpy.getIsWeb).toHaveBeenCalled();
      expect(component.isWeb).toEqual(true);
    });
  });

  describe('saveConsent', () => {
    let loadSpy;
    beforeEach(() => {
      loadSpy = jasmine.createSpyObj('Loader', ['present', 'dismiss']);
      loadingControllerSpy.create.and.returnValue(Promise.resolve(loadSpy));
      consentServiceSpy.setConsent.and.returnValue(Promise.resolve());
    });
    it('should present loading and save consent if radioSelection === YES', async () => {
      component.radioSelection = 'YES';
      await component.saveConsent();
      expect(loadingControllerSpy.create).toHaveBeenCalledWith({
        translucent: true,
      });
      expect(loadSpy.present).toHaveBeenCalled();
      expect(consentServiceSpy.setConsent).toHaveBeenCalledWith(
        ConsentType.MEDICAL,
        true
      );
      expect(consentServiceSpy.getMedicalConsent).toHaveBeenCalledWith(true);
      expect(routerSpy.navigateByUrl).not.toHaveBeenCalledWith(
        '/coverages/coverage-tabs/plans'
      );
      expect(benefitsServiceSpy.publishSelectedTab).not.toHaveBeenCalledWith(
        'plans'
      );
      expect(loadSpy.dismiss).toHaveBeenCalled();
      expect(modalControllerSpy.dismiss).toHaveBeenCalled();
    });

    it('should call completion if radioSelection === YES and completion != null', async () => {
      component.radioSelection = 'YES';
      component.completion = jasmine.createSpy();
      await component.saveConsent();
      expect(component.completion).toHaveBeenCalled();
    });

    describe('should present loading and not save consent and route to plans page if radioSelection === NO', () => {
      beforeEach(() => {
        component.radioSelection = 'NO';
      });
      it('when isWeb would be false', async () => {
        component.isWeb = false;
        await component.saveConsent();
        expect(consentServiceSpy.getMedicalConsent).not.toHaveBeenCalledWith(
          true
        );
        expect(routerSpy.navigateByUrl).toHaveBeenCalledWith(
          '/coverages/coverage-tabs/plans'
        );
        expect(benefitsServiceSpy.publishSelectedTab).toHaveBeenCalledWith(
          'plans'
        );
      });
      it('when isWeb would be true', async () => {
        component.isWeb = true;
        await component.saveConsent();
        expect(routerSpy.navigateByUrl).toHaveBeenCalledWith(
          '/coverages/all-coverages/plans'
        );
        expect(benefitsServiceSpy.publishSelectedTab).not.toHaveBeenCalled();
      });
      it('should call location.back if back is true', async () => {
        component.back = true;
        await component.saveConsent();
        expect(routerSpy.navigateByUrl).not.toHaveBeenCalled();
        expect(locationSpy.back).toHaveBeenCalled();
      });
    });
  });

  describe('onScroll', () => {
    describe('when hasScrolledToBottom would be true', () => {
      let event;
      beforeEach(
        waitForAsync(() => {
          event = {
            target: {
              getScrollElement: jasmine.createSpy().and.returnValue(
                Promise.resolve({
                  clientHeight: 500,
                  scrollTop: 50000,
                  scrollHeight: 1000,
                })
              ),
            },
          };
        })
      );
      it('should getScrollElement call', async () => {
        await component.onScroll(event);
        expect(component.hasScrolledToBottom).toBeTrue();
        expect(event.target.getScrollElement).toHaveBeenCalled();
      });
      it('should not getScrollElement call', async () => {
        component.hasScrolledToBottom = true;
        await component.onScroll(event);
        expect(component.hasScrolledToBottom).toBeTrue();
        expect(event.target.getScrollElement).not.toHaveBeenCalled();
      });
    });

    it('should detect if scrolled to bottom and not set property if it is not', async () => {
      component.hasScrolledToBottom = false;
      const event = {
        target: {
          getScrollElement: () => {
            return {
              clientHeight: 500,
              scrollTop: 400,
              scrollHeight: 1000,
            };
          },
        },
      };

      await component.onScroll(event);
      expect(component.hasScrolledToBottom).toBeFalse();
    });
  });
});

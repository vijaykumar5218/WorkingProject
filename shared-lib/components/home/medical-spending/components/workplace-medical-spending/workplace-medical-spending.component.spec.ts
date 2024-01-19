import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {IonicModule, ModalController} from '@ionic/angular';
import {RouterTestingModule} from '@angular/router/testing';
import {WorkplaceMedicalSpendingComponent} from './workplace-medical-spending.component';
import {BenefitsService} from '@shared-lib/services/benefits/benefits.service';
import {Router} from '@angular/router';
import {SharedUtilityService} from '../../../../../services/utility/utility.service';
import {MedicalConsentPage} from '../../../../coverages/consent-required/medical-consent/medical-consent.page';
import {NoBenefitContent} from '@shared-lib/services/benefits/models/noBenefit.model';
import {TPAStreamService} from '@shared-lib/services/tpa-stream/tpastream.service';

describe('WorkplaceMedicalSpendingComponent', () => {
  let component: WorkplaceMedicalSpendingComponent;
  let fixture: ComponentFixture<WorkplaceMedicalSpendingComponent>;
  let benefitsServiceSpy;
  let routerSpy;
  let utilityServiceSpy;
  let modalControllerSpy;
  let tpaServiceSpy;

  const mockNoBenefitContent: any = {
    workplaceCovergeMedicalSpending:
      '{"medicalSpendingHeader":"Your Medical Spending","medicalSpendingDescription":"Total co-pay, out of pocket services, and premiums","medicalSpendingButton":"View Details"}',
    workplaceCovergePreAuthMessage:
      '{"preAuthHeader":"Unlock Your Medical Spending","preAuthButton":"Provide Access","preAuthDescription":"Get insights and track your out-of-pocket medical, dental and vision spending."}',
    workplaceCovergeTPAWaitingMessage:
      '{"TPAWaitingMessageTitle":"Your Claims Will Be Ready Soon...","TPAWaitingMessageDescription":"Thank you for connecting your carriers claims data. Please allow up to 2 weeks for your claims information to be available to in myVoyage.","TPAWaitingMessageButton":"Manage Insurance Carriers"}',
  };
  let fetchContentSpy;

  beforeEach(
    waitForAsync(() => {
      benefitsServiceSpy = jasmine.createSpyObj('BenefitsService', [
        'getNoBenefitContents',
        'publishSelectedTab',
      ]);
      routerSpy = jasmine.createSpyObj('router', ['navigateByUrl', 'navigate']);
      utilityServiceSpy = jasmine.createSpyObj('UtilityService', ['getIsWeb']);
      modalControllerSpy = jasmine.createSpyObj('ModalController', ['create']);
      tpaServiceSpy = jasmine.createSpyObj('TPAStremService', [
        'openTPAConnect',
      ]);

      TestBed.configureTestingModule({
        declarations: [WorkplaceMedicalSpendingComponent],
        imports: [RouterTestingModule, IonicModule.forRoot()],
        providers: [
          {provide: BenefitsService, useValue: benefitsServiceSpy},
          {provide: Router, useValue: routerSpy},
          {provide: SharedUtilityService, useValue: utilityServiceSpy},
          {provide: ModalController, useValue: modalControllerSpy},
          {provide: TPAStreamService, useValue: tpaServiceSpy},
        ],
      }).compileComponents();

      fixture = TestBed.createComponent(WorkplaceMedicalSpendingComponent);
      component = fixture.componentInstance;
      fetchContentSpy = spyOn(component, 'fetchContent').and.returnValue(
        Promise.resolve()
      );
      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should call fetchContent', async () => {
      await component.ngOnInit();
      expect(component.fetchContent).toHaveBeenCalled();
    });
  });

  describe('fetchContent', () => {
    beforeEach(() => {
      fetchContentSpy.and.callThrough();
      benefitsServiceSpy.getNoBenefitContents.and.returnValue(
        Promise.resolve(mockNoBenefitContent)
      );
      component.workplaceCovergePreAuthMessage = undefined;
      component.workplaceMedicalSpending = undefined;
      component.workplaceCovergeTPAWaitingMessage = undefined;
    });
    it('should set content', async () => {
      await component.fetchContent();
      expect(benefitsServiceSpy.getNoBenefitContents).toHaveBeenCalled();
      expect(component.workplaceCovergePreAuthMessage).toEqual(
        JSON.parse(mockNoBenefitContent.workplaceCovergePreAuthMessage)
      );
      expect(component.workplaceMedicalSpending).toEqual(
        JSON.parse(mockNoBenefitContent.workplaceCovergeMedicalSpending)
      );
      expect(component.workplaceCovergeTPAWaitingMessage).toEqual(
        JSON.parse(mockNoBenefitContent.workplaceCovergeTPAWaitingMessage)
      );
    });
  });

  describe('onClickButton', () => {
    it('when link is defined', () => {
      component.onClickButton('coverages');
      expect(routerSpy.navigateByUrl).toHaveBeenCalledWith('coverages');
    });
    describe('when link is not defined', () => {
      it('if isTPA will be false', () => {
        component.isTPA = false;
        spyOn(component, 'onClickConsentRequest');
        component.onClickButton();
        expect(component.onClickConsentRequest).toHaveBeenCalled();
      });
      it('should call onClickRouteToTPA if !link and isTPA', () => {
        component.isTPA = true;
        spyOn(component, 'onClickRouteToTPA');
        component.onClickButton();
        expect(component.onClickRouteToTPA).toHaveBeenCalled();
      });
    });
  });

  describe('onClickRouteToTPA', () => {
    it('should route to providers page web if isweb and tpaWaiting', () => {
      utilityServiceSpy.getIsWeb.and.returnValue(true);
      component.isTPAWaiting = true;

      component.onClickRouteToTPA();

      expect(routerSpy.navigateByUrl).toHaveBeenCalledWith(
        'coverages/all-coverages/tpaclaims/providers'
      );
    });

    it('should route to providers page mobile if mobile and tpaWaiting', () => {
      utilityServiceSpy.getIsWeb.and.returnValue(false);
      component.isTPAWaiting = true;

      component.onClickRouteToTPA();

      expect(routerSpy.navigateByUrl).toHaveBeenCalledWith(
        'coverages/coverage-tabs/tpaclaims'
      );
      expect(benefitsServiceSpy.publishSelectedTab).toHaveBeenCalledWith(
        'tpaclaims'
      );
    });

    it('should call openTPAConnect if not tpaWaiting', () => {
      utilityServiceSpy.getIsWeb.and.returnValue(true);
      component.isTPAWaiting = false;

      component.onClickRouteToTPA();

      expect(tpaServiceSpy.openTPAConnect).toHaveBeenCalledWith(true);
    });
  });

  describe('onClickConsentRequest', () => {
    it('should open consent modal if not web', async () => {
      const modalSpy = jasmine.createSpyObj('Modal', ['present']);

      utilityServiceSpy.getIsWeb.and.returnValue(false);
      modalControllerSpy.create.and.returnValue(Promise.resolve(modalSpy));

      const contentObj = {test: 'test'};
      component.benefitsContent = {
        Insights_ClaimsAuthorization_ReadDisclosure: JSON.stringify(contentObj),
      } as NoBenefitContent;

      await component.onClickConsentRequest();

      expect(modalControllerSpy.create).toHaveBeenCalledWith({
        component: MedicalConsentPage,
        cssClass: 'modal-fullscreen',
        componentProps: {
          contentData: contentObj,
          completion: jasmine.any(Function),
          back: false,
        },
      });
      expect(modalSpy.present).toHaveBeenCalled();

      const compFunc = modalControllerSpy.create.calls.all()[0].args[0]
        .componentProps.completion;
      compFunc();

      expect(routerSpy.navigateByUrl).toHaveBeenCalledWith(
        'coverages/insights'
      );
      expect(benefitsServiceSpy.publishSelectedTab).toHaveBeenCalledWith(
        'insights'
      );
    });

    it('should call navigate with a redirect url if web', async () => {
      utilityServiceSpy.getIsWeb.and.returnValue(true);

      await component.onClickConsentRequest();

      expect(routerSpy.navigate).toHaveBeenCalledWith(['coverages/review'], {
        queryParams: {redirectTo: 'coverages/all-coverages/insights'},
      });
    });
  });
});

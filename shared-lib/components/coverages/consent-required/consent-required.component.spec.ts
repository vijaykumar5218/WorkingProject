import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {IonicModule, ModalController} from '@ionic/angular';
import {BenefitsService} from '@shared-lib/services/benefits/benefits.service';
import {ConsentRequiredComponent} from './consent-required.component';
import {MedicalConsentPage} from './medical-consent/medical-consent.page';
import {SharedUtilityService} from '@shared-lib/services/utility/utility.service';
import {Router} from '@angular/router';
import {PlatformService} from '@shared-lib/services/platform/platform.service';
import {of} from 'rxjs';
import {AccessResult} from '../../../services/access/models/access.model';
import {AccessService} from '../../../services/access/access.service';
import {TPAStreamService} from '@shared-lib/services/tpa-stream/tpastream.service';
import {TPAClaimsData} from '@shared-lib/services/tpa-stream/models/tpa.model';
import {GroupingCategoryDetails} from '../models/chart.model';

describe('ConsentRequiredComponent', () => {
  let component: ConsentRequiredComponent;
  let fixture: ComponentFixture<ConsentRequiredComponent>;
  let modalControllerSpy;
  let benefitServicesSpy;
  let utilityServiceSpy;
  let routerSpy;
  let platformServiceSpy;
  let accessServiceSpy;
  let tpaServiceSpy;

  beforeEach(
    waitForAsync(() => {
      utilityServiceSpy = jasmine.createSpyObj('utilityServiceSpy', [
        'getIsWeb',
      ]);
      routerSpy = jasmine.createSpyObj('Router', ['navigateByUrl']);
      modalControllerSpy = jasmine.createSpyObj('ModalController', ['create']);
      benefitServicesSpy = jasmine.createSpyObj('BenefitsService', [
        'getNoBenefitContents',
        'publishSelectedTab',
      ]);
      tpaServiceSpy = jasmine.createSpyObj('TPAStreamService', [
        'openTPAConnect',
        'getTPAData',
      ]);
      tpaServiceSpy.getTPAData.and.returnValue(
        of({
          claims: [],
          carriers: [],
          groupingCategoryDetails: {} as GroupingCategoryDetails,
        })
      );

      benefitServicesSpy.getNoBenefitContents.and.returnValue(
        Promise.resolve({
          Insights_OverlayMessage_ReviewAuthorization: JSON.stringify({
            consent_description: 'desc',
            consent_title: 'title',
            image_url: 'img',
          }),
          Insights_ClaimsAuthorization_ReadDisclosure: JSON.stringify({}),
          Insights_TPA_PendingClaimsAccess: JSON.stringify({
            consent_description: 'tpa desc',
            consent_title: 'tpa title',
            image_url: 'tpa_img',
          }),
        })
      );
      platformServiceSpy = jasmine.createSpyObj('PlatformService', [
        'isDesktop',
      ]);
      platformServiceSpy.isDesktop.and.returnValue(of(true));

      accessServiceSpy = jasmine.createSpyObj('AccessService', [
        'checkMyvoyageAccess',
      ]);
      accessServiceSpy.checkMyvoyageAccess.and.returnValue(
        Promise.resolve({enableTPA: 'Y'} as AccessResult)
      );

      TestBed.configureTestingModule({
        declarations: [ConsentRequiredComponent],
        imports: [IonicModule.forRoot()],
        providers: [
          {provide: ModalController, useValue: modalControllerSpy},
          {provide: BenefitsService, useValue: benefitServicesSpy},
          {provide: SharedUtilityService, useValue: utilityServiceSpy},
          {provide: Router, useValue: routerSpy},
          {provide: PlatformService, useValue: platformServiceSpy},
          {provide: AccessService, useValue: accessServiceSpy},
          {provide: TPAStreamService, useValue: tpaServiceSpy},
        ],
      }).compileComponents();

      fixture = TestBed.createComponent(ConsentRequiredComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should set isTPAStream to true if value from server is Y', async () => {
      accessServiceSpy.checkMyvoyageAccess.and.returnValue(
        Promise.resolve({enableTPA: 'Y'} as AccessResult)
      );
      component.isTPAStream = false;
      await component.ngOnInit();
      expect(component.isTPAStream).toBeTrue();
    });

    it('should set isTPAStream to false if value from server is N', async () => {
      component.isTPAStream = true;
      accessServiceSpy.checkMyvoyageAccess.and.returnValue(
        Promise.resolve({enableTPA: 'N'} as AccessResult)
      );
      await component.ngOnInit();
      expect(component.isTPAStream).toBeFalse();
    });

    it('should set isWeb true', async () => {
      utilityServiceSpy.getIsWeb.and.returnValue(true);
      await component.ngOnInit();
      expect(component.isWeb).toEqual(true);
      expect(utilityServiceSpy.getIsWeb).toHaveBeenCalled();
    });

    it('should set isWeb false', async () => {
      utilityServiceSpy.getIsWeb.and.returnValue(false);
      await component.ngOnInit();
      expect(component.isWeb).toEqual(false);
      expect(utilityServiceSpy.getIsWeb).toHaveBeenCalled();
    });

    it('should get content', async () => {
      await component.ngOnInit();
      expect(benefitServicesSpy.getNoBenefitContents).toHaveBeenCalled();
      expect(component.contentJSON).toEqual({
        consent_description: 'desc',
        consent_title: 'title',
        image_url: 'img',
      });
    });

    it('should call initTPAStream if isTPAStream', async () => {
      spyOn(component, 'initTPAStream');
      accessServiceSpy.checkMyvoyageAccess.and.returnValue(
        Promise.resolve({enableTPA: 'Y'} as AccessResult)
      );
      component.isTPAStream = false;
      await component.ngOnInit();
      expect(component.initTPAStream).toHaveBeenCalled();
    });

    it('should not call initTPAStream if not isTPAStream', async () => {
      spyOn(component, 'initTPAStream');
      accessServiceSpy.checkMyvoyageAccess.and.returnValue(
        Promise.resolve({enableTPA: 'N'} as AccessResult)
      );
      component.isTPAStream = false;
      await component.ngOnInit();
      expect(component.initTPAStream).not.toHaveBeenCalled();
    });
  });

  describe('initTPAStream', () => {
    it('should get tpaData and get tpa waiting content if carriers.length > 0', () => {
      const tpaData: TPAClaimsData = {
        memberId: 12345,
        carriers: [
          {
            carrierId: 471393,
            carrierName: 'Test Carrier',
            claimsCount: 5,
            connectionStatus: 'Enabled',
            crawlCount: 10,
            crawlStatus: 'SUCCESS',
            loginProblem: 'valid',
            logoUrl:
              'https://tpastream-public.s3.amazonaws.com/test-tpastream.png',
            payerId: 1659,
            totalOutOfPocketAmount: 367.72,
          },
        ],
        groupingCategoryDetails: {} as GroupingCategoryDetails,
        claims: [],
      };
      tpaServiceSpy.getTPAData.and.returnValue(of(tpaData));
      component.initTPAStream();

      expect(tpaServiceSpy.getTPAData).toHaveBeenCalled();
      expect(component.isTPAWaiting).toBeTrue();
      expect(component.contentJSON).toEqual({
        consent_description: 'tpa desc',
        consent_title: 'tpa title',
        image_url: 'tpa_img',
      });
    });

    it('should get tpaData and get tpa waiting content if carriers.length < 1', () => {
      const tpaData: TPAClaimsData = {
        memberId: 12345,
        carriers: [],
        groupingCategoryDetails: {} as GroupingCategoryDetails,
        claims: [],
      };
      tpaServiceSpy.getTPAData.and.returnValue(of(tpaData));
      component.initTPAStream();

      expect(tpaServiceSpy.getTPAData).toHaveBeenCalled();
      expect(component.isTPAWaiting).toBeFalse();
      expect(component.contentJSON).toEqual({
        consent_description: 'desc',
        consent_title: 'title',
        image_url: 'img',
      });
    });
  });

  describe('manageTPA', () => {
    it('should call navigateByUlr is web', () => {
      component.isWeb = true;
      component.manageTPA();
      expect(routerSpy.navigateByUrl).toHaveBeenCalledWith(
        'coverages/all-coverages/tpaclaims/providers'
      );
    });
    it('should call navigateByUlr is not web', () => {
      component.isWeb = false;
      component.manageTPA();
      expect(routerSpy.navigateByUrl).toHaveBeenCalledWith(
        'coverages/coverage-tabs/tpaproviders'
      );
    });
  });

  describe('skip', () => {
    it('should call navigateByUrl and publishSelectedTab', () => {
      component.skip();
      expect(routerSpy.navigateByUrl).toHaveBeenCalledWith('/coverages/plans');
      expect(benefitServicesSpy.publishSelectedTab).toHaveBeenCalledWith(
        'plans'
      );
    });
  });

  describe('allowAuthorization', () => {
    it('should show tpa connect modal if is tpa', async () => {
      component.isTPAStream = true;

      await component.allowAuthorization();
      expect(tpaServiceSpy.openTPAConnect).toHaveBeenCalled();
    });

    it('should redirect to review page if not tpa', async () => {
      component.isTPAStream = false;
      component.isWeb = true;
      component.isDesktop = true;
      await component.allowAuthorization();
      expect(routerSpy.navigateByUrl).toHaveBeenCalledWith('coverages/review');
    });

    it('should show medical consent modal if not tpa', async () => {
      component.isTPAStream = false;
      const modalSpy = jasmine.createSpyObj('Modal', ['present']);
      modalControllerSpy.create.and.returnValue(Promise.resolve(modalSpy));
      component.back = true;

      await component.allowAuthorization();

      expect(modalControllerSpy.create).toHaveBeenCalledWith({
        component: MedicalConsentPage,
        cssClass: 'modal-fullscreen',
        componentProps: {
          contentData: JSON.parse(JSON.stringify({})),
          back: true,
        },
      });
      expect(modalSpy.present).toHaveBeenCalled();
    });
  });

  describe('ngOnDestroy', () => {
    let spy;
    beforeEach(() => {
      spy = jasmine.createSpyObj('Subscription', ['unsubscribe']);
    });

    it('should call unsubscribe if subscription is not null', () => {
      component.subscription = spy;
      component.ngOnDestroy();
      expect(spy.unsubscribe).toHaveBeenCalled();
    });
  });
});

import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
  waitForAsync,
} from '@angular/core/testing';
import {IonicModule} from '@ionic/angular';
import {OpenSavviService} from '@shared-lib/services/benefits/open-savvi/open-savvi.service';
import {HeaderTypeService} from '@shared-lib/services/header-type/header-type.service';
import {FooterTypeService} from '@shared-lib/modules/footer/services/footer-type/footer-type.service';
import {EnrollmentGuidanceComponent} from './enrollment-guidance.component';
import {ActionOptions} from '@shared-lib/models/ActionOptions.model';
import {HeaderType} from '@shared-lib/constants/headerType.enum';
import {FooterType} from '@shared-lib/modules/footer/constants/footerType.enum';
import {SharedUtilityService} from '@shared-lib/services/utility/utility.service';
import {ActivatedRoute, Router} from '@angular/router';
import {of} from 'rxjs';
import {AccessService} from '@shared-lib/services/access/access.service';

describe('EnrollmentGuidanceComponent', () => {
  let component: EnrollmentGuidanceComponent;
  let fixture: ComponentFixture<EnrollmentGuidanceComponent>;
  let savviServiceSpy;
  let headerTypeSpy;
  let footerTypeSpy;
  let utilityServiceSpy;
  let routerSpy;
  let activatedRouteSpy;
  let accessServiceSpy;
  let workplaceEnabled$;

  beforeEach(
    waitForAsync(() => {
      headerTypeSpy = jasmine.createSpyObj('HeaderTypeService', ['publish']);
      footerTypeSpy = jasmine.createSpyObj('FooterTypeService', ['publish']);
      savviServiceSpy = jasmine.createSpyObj('OpenSavviService', [
        'generateSavviUrl',
        'exitCallback',
      ]);
      utilityServiceSpy = jasmine.createSpyObj('UtilityService', [
        'getIsWeb',
        'setSuppressHeaderFooter',
        'getEnvironment',
      ]);
      utilityServiceSpy.getEnvironment.and.returnValue({
        loginBaseUrl: 'loginBaseUrl/',
      });
      routerSpy = jasmine.createSpyObj('Router', ['navigateByUrl']);
      activatedRouteSpy = jasmine.createSpyObj('ActivatedRoute', [''], {
        snapshot: {
          paramMap: {get: jasmine.createSpy().and.returnValue('previousRoute')},
        },
      });
      accessServiceSpy = jasmine.createSpyObj('AccessService', [
        'isMyWorkplaceDashboardEnabled',
      ]);
      workplaceEnabled$ = of(false);
      accessServiceSpy.isMyWorkplaceDashboardEnabled.and.returnValue(
        workplaceEnabled$
      );
      TestBed.configureTestingModule({
        declarations: [EnrollmentGuidanceComponent],
        imports: [IonicModule.forRoot()],
        providers: [
          {provide: HeaderTypeService, useValue: headerTypeSpy},
          {provide: FooterTypeService, useValue: footerTypeSpy},
          {provide: OpenSavviService, useValue: savviServiceSpy},
          {provide: SharedUtilityService, useValue: utilityServiceSpy},
          {provide: Router, useValue: routerSpy},
          {provide: ActivatedRoute, useValue: activatedRouteSpy},
          {provide: AccessService, useValue: accessServiceSpy},
        ],
      }).compileComponents();

      fixture = TestBed.createComponent(EnrollmentGuidanceComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should publish header & footer', () => {
      const actionOption: ActionOptions = {
        headername: 'myVoyage',
        btnleft: true,
        buttonLeft: {
          name: '',
          link: 'back',
        },
      };
      component.ngOnInit();
      expect(headerTypeSpy.publish).toHaveBeenCalledWith({
        type: HeaderType.navbar,
        actionOption: actionOption,
      });
      expect(footerTypeSpy.publish).toHaveBeenCalledWith({
        type: FooterType.none,
      });
    });

    it('should set isWeb', () => {
      component.isWeb = undefined;
      utilityServiceSpy.getIsWeb.and.returnValue(true);
      component.ngOnInit();
      expect(component.isWeb).toBeTrue();
      expect(utilityServiceSpy.getIsWeb).toHaveBeenCalled();
    });

    it('should call setSuppressHeaderFooter with true', () => {
      expect(utilityServiceSpy.setSuppressHeaderFooter).toHaveBeenCalledWith(
        true
      );
    });

    it('should set the logoBaseUrl', () => {
      expect(utilityServiceSpy.getEnvironment).toHaveBeenCalled();
      expect(component.logoBaseUrl).toEqual('loginBaseUrl');
    });

    it('should set workplaceEnabled$', () => {
      expect(accessServiceSpy.isMyWorkplaceDashboardEnabled).toHaveBeenCalled();
      expect(component.workplaceEnabled$).toEqual(workplaceEnabled$);
    });
  });

  describe('ionViewWillEnter', () => {
    it('should call setSuppressHeaderFooter with true', async () => {
      await component.ionViewWillEnter();
      expect(utilityServiceSpy.setSuppressHeaderFooter).toHaveBeenCalledWith(
        true
      );
    });
  });

  describe('ionViewDidEnter', () => {
    it('should replace the iframe with a clone with the savvi url as src', fakeAsync(async () => {
      const mockResult =
        'https://login.intg.voya.com/saml/sps/saml-idp-my-to-guidance/saml20/logininitial?PartnerId=https://myhealthwealth.intg.voya.com/v1/auth/saml2/voya&access_token=access_token';
      component.iframe = jasmine.createSpyObj('iframe', ['']);
      const oldIframe = {
        cloneNode: jasmine.createSpy(),
        parentNode: {
          replaceChild: jasmine.createSpy(),
        },
      };
      component.iframe.nativeElement = oldIframe;
      const newIframe = {new: 'iframe'};
      component.iframe.nativeElement.cloneNode.and.returnValue(newIframe);
      savviServiceSpy.generateSavviUrl.and.returnValue(
        Promise.resolve(mockResult)
      );
      spyOn(window, 'setTimeout').and.callThrough();
      await component.ionViewDidEnter();
      tick(0);
      expect(window.setTimeout).toHaveBeenCalled();
      expect(savviServiceSpy.generateSavviUrl).toHaveBeenCalled();
      expect(component.iframe.nativeElement.cloneNode).toHaveBeenCalled();
      expect(
        component.iframe.nativeElement.parentNode.replaceChild
      ).toHaveBeenCalledWith({...newIframe, src: mockResult}, oldIframe);
    }));
  });

  describe('return', () => {
    it('should call utilityService backToPrevious', () => {
      component.return();
      expect(routerSpy.navigateByUrl).toHaveBeenCalledWith('previousRoute');
    });
  });

  describe('ionViewWillLeave', () => {
    it('should call setSuppressHeaderFooter with false', () => {
      component.ionViewWillLeave();
      expect(utilityServiceSpy.setSuppressHeaderFooter).toHaveBeenCalledWith(
        false
      );
    });
  });

  describe('ngOnDestroy', () => {
    it('should call exitCallback', () => {
      component.ngOnDestroy();
      expect(savviServiceSpy.exitCallback).toHaveBeenCalled();
    });

    it('should call setSuppressHeaderFooter with false', () => {
      component.ngOnDestroy();
      expect(utilityServiceSpy.setSuppressHeaderFooter).toHaveBeenCalledWith(
        false
      );
    });
  });
});

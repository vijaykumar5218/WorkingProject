import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {IonicModule, LoadingController} from '@ionic/angular';
import {BaseService} from '@shared-lib/services/base/base-factory-provider';
import {AuthenticationService} from '@mobile/app/modules/shared/service/authentication/authentication.service';
import {LandingService} from '@mobile/app/modules/features/landing/service/landing.service';
import {NoAccessPage} from './no-access.page';
import {SharedUtilityService} from '@shared-lib/services/utility/utility.service';
import {WebLogoutService} from '@web/app/modules/shared/services/logout/logout.service';

describe('NoAccessPage', () => {
  let component: NoAccessPage;
  let fixture: ComponentFixture<NoAccessPage>;

  let authServiceSpy;
  let baseServiceSpy;
  let loadingControllerSpy;
  let landingServiceSpy;
  let utilityServiceSpy;
  let webLogoutServiceSpy;

  beforeEach(
    waitForAsync(() => {
      webLogoutServiceSpy = jasmine.createSpyObj('WebLogoutService', [
        'setTerminatedUser',
        'action',
        'constructLogoutURL',
      ]);
      authServiceSpy = jasmine.createSpyObj('AuthenticationService', [
        'logoutAndRevoke',
      ]);
      utilityServiceSpy = jasmine.createSpyObj('SharedUtilityService', [
        'getIsWeb',
      ]);
      baseServiceSpy = jasmine.createSpyObj('BaseService', ['navigateByUrl']);
      loadingControllerSpy = jasmine.createSpyObj('LoadingController', [
        'create',
      ]);
      landingServiceSpy = jasmine.createSpyObj('LandingService', [
        'getNoAccessMessage',
      ]);
      landingServiceSpy.getNoAccessMessage.and.returnValue(
        Promise.resolve({message_1: 'm1', message_2: 'm2'})
      );

      TestBed.configureTestingModule({
        declarations: [NoAccessPage],
        imports: [IonicModule.forRoot()],
        providers: [
          {provide: AuthenticationService, useValue: authServiceSpy},
          {provide: BaseService, useValue: baseServiceSpy},
          {provide: LoadingController, useValue: loadingControllerSpy},
          {provide: LandingService, useValue: landingServiceSpy},
          {provide: SharedUtilityService, useValue: utilityServiceSpy},
          {provide: WebLogoutService, useValue: webLogoutServiceSpy},
        ],
      }).compileComponents();

      fixture = TestBed.createComponent(NoAccessPage);
      component = fixture.componentInstance;
      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should call getIsWeb', () => {
      expect(utilityServiceSpy.getIsWeb).toHaveBeenCalled();
    });
    describe('when isWeb will be true', () => {
      beforeEach(() => {
        utilityServiceSpy.getIsWeb.and.returnValue(true);
      });
      it('should call setTerminatedUser, constructLogoutURL of webLogoutService', () => {
        component.ngOnInit();
        expect(webLogoutServiceSpy.setTerminatedUser).toHaveBeenCalled();
        expect(webLogoutServiceSpy.constructLogoutURL).toHaveBeenCalled();
      });
    });
    describe('when isWeb will be false', () => {
      beforeEach(() => {
        utilityServiceSpy.getIsWeb.and.returnValue(false);
      });
      it('should not call setTerminatedUser, constructLogoutURL, checkMyvoyageAccess ', async () => {
        await component.ngOnInit();
        expect(webLogoutServiceSpy.setTerminatedUser).not.toHaveBeenCalled();
        expect(webLogoutServiceSpy.constructLogoutURL).not.toHaveBeenCalled();
      });
      it('should call getNoAccessMessage of landingService', async () => {
        await component.ngOnInit();
        expect(landingServiceSpy.getNoAccessMessage).toHaveBeenCalled();
        expect(component.messages).toEqual({message_1: 'm1', message_2: 'm2'});
      });
    });
  });

  describe('closeClicked', () => {
    it('should clear session and return to landing page', async () => {
      const loaderSpy = jasmine.createSpyObj('Loader', ['present', 'dismiss']);
      loadingControllerSpy.create.and.returnValue(Promise.resolve(loaderSpy));
      component.isWeb = false;
      await component.closeClicked();

      expect(loaderSpy.present).toHaveBeenCalled();
      expect(authServiceSpy.logoutAndRevoke).toHaveBeenCalled();
      expect(baseServiceSpy.navigateByUrl).toHaveBeenCalledWith('landing');
      expect(loaderSpy.dismiss).toHaveBeenCalled();
    });
    it('should clear session and return to landing page', async () => {
      component.isWeb = true;
      await component.closeClicked();
      expect(webLogoutServiceSpy.action).toHaveBeenCalled();
    });
  });
});

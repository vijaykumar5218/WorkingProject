import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {AlertController, IonicModule, Platform} from '@ionic/angular';
import {FooterType} from '@shared-lib/modules/footer/constants/footerType.enum';
import {AuthenticationService} from '../../../shared/service/authentication/authentication.service';
import {VaultService} from '../../../shared/service/authentication/vault.service';
import {BiometricsPage} from './biometrics.page';
import * as bioText from './constants/biometrics-content.json';
import {HeaderType} from '@shared-lib/constants/headerType.enum';
import {HeaderFooterTypeService} from '@shared-lib/services/header-footer-type/headerFooterType.service';

describe('BiometricsPage', () => {
  let component: BiometricsPage;
  let fixture: ComponentFixture<BiometricsPage>;
  let vaultServiceSpy;
  let headerFooterServiceSpy;
  let authServiceSpy;
  let alertControllerSpy;
  let platformServiceSpy;
  const pageText = bioText;

  beforeEach(
    waitForAsync(() => {
      vaultServiceSpy = jasmine.createSpyObj('VaultService', [
        'enableFaceID',
        'setDefaultFaceIDDisabled',
        'disableFaceID',
        'lockVault',
        'unlockVault',
        'isLocked',
      ]);
      authServiceSpy = jasmine.createSpyObj('AuthService', [
        'getBiometricsIconName',
        'getBiometricsLabel',
        'navigateToLoggedInLanding',
      ]);
      headerFooterServiceSpy = jasmine.createSpyObj('HeaderFooterTypeSpy', [
        'publishType',
      ]);
      alertControllerSpy = jasmine.createSpyObj('AlertController', ['create']);
      platformServiceSpy = jasmine.createSpyObj('Platform', ['is']);

      TestBed.configureTestingModule({
        declarations: [BiometricsPage],
        imports: [IonicModule.forRoot()],
        providers: [
          {provide: VaultService, useValue: vaultServiceSpy},
          {provide: AuthenticationService, useValue: authServiceSpy},
          {provide: HeaderFooterTypeService, useValue: headerFooterServiceSpy},
          {provide: AlertController, useValue: alertControllerSpy},
          {provide: Platform, useValue: platformServiceSpy},
        ],
      }).compileComponents();

      fixture = TestBed.createComponent(BiometricsPage);
      component = fixture.componentInstance;
      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should get bio icon and bio text', async () => {
      authServiceSpy.getBiometricsIconName.and.returnValue(
        Promise.resolve('bioIcon')
      );
      authServiceSpy.getBiometricsLabel.and.returnValue(
        Promise.resolve('bioLabel')
      );

      component.bioIcon = null;
      component.bioText = null;

      await component.ngOnInit();

      expect(component.bioIcon).toEqual('bioIcon');
      expect(component.bioText).toEqual('bioLabel');
    });
  });

  describe('ionViewWillEnter', () => {
    it('should set up header and footer', () => {
      component.ionViewWillEnter();

      expect(headerFooterServiceSpy.publishType).toHaveBeenCalledWith(
        {
          type: HeaderType.navbar,
          actionOption: {
            displayLogo: true,
            headername: '',
          },
        },
        {type: FooterType.none}
      );
    });
  });

  describe('showError', () => {
    it('should show error alert', async () => {
      const alertSpy = jasmine.createSpyObj('Alert', ['present']);
      alertControllerSpy.create.and.returnValue(Promise.resolve(alertSpy));

      await component.showError();

      expect(alertControllerSpy.create).toHaveBeenCalledWith({
        header: pageText.biometricsError,
        buttons: ['OK'],
      });
      expect(alertSpy.present).toHaveBeenCalled();
    });
  });

  describe('biometricsChanged', () => {
    it('should call enableFaceID', async () => {
      vaultServiceSpy.enableFaceID.and.returnValue(Promise.resolve(true));

      component.faceIDEnabled = true;
      await component.biometricsChanged();

      expect(vaultServiceSpy.enableFaceID).toHaveBeenCalled();
      expect(vaultServiceSpy.setDefaultFaceIDDisabled).toHaveBeenCalledWith(
        false
      );
    });

    it('should call enableFaceID and then disable it if it fails', async () => {
      vaultServiceSpy.enableFaceID.and.returnValue(Promise.resolve(false));

      component.faceIDEnabled = true;
      await component.biometricsChanged();

      expect(vaultServiceSpy.enableFaceID).toHaveBeenCalled();
      expect(component.faceIDEnabled).toBeFalse();
      expect(vaultServiceSpy.setDefaultFaceIDDisabled).not.toHaveBeenCalledWith(
        false
      );
    });

    it('should call disableFaceID', async () => {
      component.faceIDEnabled = false;
      await component.biometricsChanged();

      expect(vaultServiceSpy.disableFaceID).toHaveBeenCalled();
      expect(vaultServiceSpy.setDefaultFaceIDDisabled).toHaveBeenCalledWith(
        true
      );
    });
  });

  describe('continueClicked', () => {
    beforeEach(() => {
      spyOn(component, 'showError');
    });

    it('should route to home page if faceid disabled', async () => {
      spyOn(component, 'biometricsChanged').and.returnValue(
        Promise.resolve(true)
      );
      component.faceIDEnabled = false;

      await component.continueClicked();

      expect(authServiceSpy.navigateToLoggedInLanding).toHaveBeenCalled();
    });

    it('should test a biometric login if faceid enabled and on ios and if unlocked at the end, continue to home screen', async () => {
      platformServiceSpy.is.and.returnValue(true);
      spyOn(component, 'biometricsChanged').and.returnValue(
        Promise.resolve(true)
      );
      component.faceIDEnabled = true;
      vaultServiceSpy.isLocked.and.returnValue(Promise.resolve(false));

      await component.continueClicked();

      expect(vaultServiceSpy.lockVault).toHaveBeenCalled();
      expect(vaultServiceSpy.unlockVault).toHaveBeenCalled();
      expect(vaultServiceSpy.isLocked).toHaveBeenCalled();
      expect(authServiceSpy.navigateToLoggedInLanding).toHaveBeenCalled();
    });

    it('should not test a biometric login if faceid enabled and not on ios and if unlocked at the end, continue to home screen', async () => {
      platformServiceSpy.is.and.returnValue(false);
      spyOn(component, 'biometricsChanged').and.returnValue(
        Promise.resolve(true)
      );
      component.faceIDEnabled = true;
      vaultServiceSpy.isLocked.and.returnValue(Promise.resolve(false));

      await component.continueClicked();

      expect(vaultServiceSpy.lockVault).not.toHaveBeenCalled();
      expect(vaultServiceSpy.unlockVault).not.toHaveBeenCalled();
      expect(vaultServiceSpy.isLocked).toHaveBeenCalled();
      expect(authServiceSpy.navigateToLoggedInLanding).toHaveBeenCalled();
    });

    it('should test a biometric login if faceid enabled and if locked at the end, do nothing', async () => {
      platformServiceSpy.is.and.returnValue(true);
      spyOn(component, 'biometricsChanged').and.returnValue(
        Promise.resolve(true)
      );
      component.faceIDEnabled = true;
      vaultServiceSpy.isLocked.and.returnValue(Promise.resolve(true));

      await component.continueClicked();

      expect(authServiceSpy.navigateToLoggedInLanding).not.toHaveBeenCalled();
    });

    it('should show error and return', async () => {
      spyOn(component, 'biometricsChanged').and.returnValue(
        Promise.resolve(false)
      );
      component.faceIDEnabled = true;
      vaultServiceSpy.isLocked.and.returnValue(Promise.resolve(true));

      await component.continueClicked();

      expect(component.showError).toHaveBeenCalled();
      expect(vaultServiceSpy.lockVault).not.toHaveBeenCalled();
      expect(vaultServiceSpy.unlockVault).not.toHaveBeenCalled();
      expect(vaultServiceSpy.isLocked).not.toHaveBeenCalled();
      expect(authServiceSpy.navigateToLoggedInLanding).not.toHaveBeenCalled();
    });
  });
});

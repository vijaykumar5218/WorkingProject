import {Component, Input} from '@angular/core';
import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {IonicModule, ModalController, Platform} from '@ionic/angular';
import {AlertComponent} from '@shared-lib/components/alert/alert.component';
import {MenuConfigItems} from '@shared-lib/components/settings/components/menu/model/menuConfig.model';
import {AuthenticationService} from '../../shared/service/authentication/authentication.service';
import {VaultService} from '../../shared/service/authentication/vault.service';
import * as settingsOption from '@shared-lib/components/settings/constants/settingsOption.json';
import {SettingsService} from '@shared-lib/services/settings/settings.service';
import {SettingsPage} from './settings.page';
import {ActionOptions} from '@shared-lib/models/ActionOptions.model';
import {HeaderType} from '@shared-lib/constants/headerType.enum';
import {HeaderFooterTypeService} from '@shared-lib/services/header-footer-type/headerFooterType.service';
import {FooterType} from '@shared-lib/modules/footer/constants/footerType.enum';

@Component({selector: 'app-menu', template: ''})
class MockAppMenu {
  @Input() config;
}

describe('SettingsPage', () => {
  const settingsText = settingsOption;

  let component: SettingsPage;
  let fixture: ComponentFixture<SettingsPage>;
  let headerTypeServiceSpy;
  let authServiceSpy;
  let vaultServiceSpy;
  let platformSpy;
  let modalControllerSpy;
  let settingsServiceSpy;
  let setMenuItemsSpy;

  beforeEach(
    waitForAsync(() => {
      headerTypeServiceSpy = jasmine.createSpyObj('HeaderTypeService', [
        'publishType',
      ]);
      authServiceSpy = jasmine.createSpyObj('AuthenticationService', [
        'logout',
        'getBiometricsLabel',
        'getBiometricsIconName',
      ]);
      vaultServiceSpy = jasmine.createSpyObj('VaultService', [
        'enableFaceID',
        'disableFaceID',
        'isFaceIDAvailableOnDevice',
        'isFaceIDEnabled',
        'setDefaultFaceIDDisabled',
      ]);
      settingsServiceSpy = jasmine.createSpyObj('SettingsService', [
        'getSettingsDisplayFlags',
      ]);
      platformSpy = jasmine.createSpyObj('Platform', ['is']);
      modalControllerSpy = jasmine.createSpyObj('ModalController', ['create']);

      TestBed.configureTestingModule({
        declarations: [SettingsPage, MockAppMenu],
        imports: [IonicModule.forRoot()],
        providers: [
          {provide: HeaderFooterTypeService, useValue: headerTypeServiceSpy},
          {provide: AuthenticationService, useValue: authServiceSpy},
          {provide: VaultService, useValue: vaultServiceSpy},
          {provide: Platform, useValue: platformSpy},
          {provide: ModalController, useValue: modalControllerSpy},
          {provide: SettingsService, useValue: settingsServiceSpy},
        ],
      }).compileComponents();

      fixture = TestBed.createComponent(SettingsPage);
      component = fixture.componentInstance;
      setMenuItemsSpy = spyOn(component, 'setMenuItems');
      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ionViewWillEnter', () => {
    beforeEach(() => {
      vaultServiceSpy.isFaceIDAvailableOnDevice.and.returnValue(
        Promise.resolve(true)
      );
      vaultServiceSpy.isFaceIDEnabled.and.returnValue(true);
    });

    it(' should publish header', async () => {
      const actionOption: ActionOptions = {
        headername: 'More',
        btnright: true,
        buttonRight: {
          name: '',
          link: 'notification',
        },
      };
      await component.ionViewWillEnter();
      expect(headerTypeServiceSpy.publishType).toHaveBeenCalledWith(
        {
          type: HeaderType.navbar,
          actionOption: actionOption,
        },
        {type: FooterType.tabsnav}
      );
    });

    it('should set properties for faceid allowed, and enabled', async () => {
      component.faceIDAllowed = false;
      component.faceIDEnabled = false;

      await component.ionViewWillEnter();

      expect(vaultServiceSpy.isFaceIDAvailableOnDevice).toHaveBeenCalled();
      expect(vaultServiceSpy.isFaceIDEnabled).toHaveBeenCalled();

      expect(component.faceIDAllowed).toBeTrue();
      expect(component.faceIDEnabled).toBeTrue();
    });

    it('should set properties for biometricsLabel and biometricsIcon', async () => {
      authServiceSpy.getBiometricsLabel.and.returnValue(
        Promise.resolve('test_label')
      );
      authServiceSpy.getBiometricsIconName.and.returnValue(
        Promise.resolve('test_icon')
      );

      component.biometricsText = 'null';
      component.biometricsIcon = 'noicon';

      await component.ionViewWillEnter();

      expect(component.biometricsText).toEqual('test_label');
      expect(component.biometricsIcon).toEqual('test_icon');
    });

    it('should set marginTop to 24px if is ios', async () => {
      platformSpy.is.and.returnValue(true);
      component.marginTop = '12px';

      await component.ionViewWillEnter();
      expect(platformSpy.is).toHaveBeenCalledWith('ios');
      expect(component.marginTop).toEqual('24px');
    });
  });

  describe('setMenuItems', () => {
    let menuItems: MenuConfigItems[];
    beforeEach(() => {
      component.loading = true;
      setMenuItemsSpy.and.callThrough();

      menuItems = [
        {
          id: 'personalAccountInfo',
          route: '/settings/account-and-personal-info',
          text: 'Personal & Account Info',
          icon: 'assets/icon/settings/Personal.svg',
        },
        {
          id: 'manageAccounts',
          route: '/account/manage-accounts',
          text: 'Manage Accounts',
          icon: 'assets/icon/settings/Manage_Accounts.svg',
        },
        {
          id: 'summaryBenifits',
          route: '/settings/summary',
          text: 'Summary of Benefits',
          icon: 'assets/icon/settings/Summary.svg',
        },
        {
          id: 'notificationSettings',
          route: '/settings/notification-settings',
          text: 'Notification Settings',
          icon: 'assets/icon/settings/notifications.svg',
        },
        {
          id: 'help',
          route: '/settings/help',
          text: 'Help',
          icon: 'assets/icon/settings/help.svg',
        },
        {
          id: 'contactAdvisor',
          route: '/settings/contact-a-coach',
          text: 'Contact a Professional',
          icon: 'assets/icon/settings/conatact_coach.svg',
        },
        {
          id: 'termsUse',
          route: 'undefined',
          text: 'Terms of Use',
          icon: 'assets/icon/settings/terms_use.svg',
        },
        {
          id: 'privacy',
          route: '/settings/privacy',
          text: 'Privacy',
          icon: 'assets/icon/settings/Privacy.svg',
        },
        {
          id: 'feedback',
          route: 'feedback',
          text: 'Feedback',
          icon: 'assets/icon/settings/Feedback.svg',
        },
      ];
    });

    it('should properly set menu items, and then set loading to false', () => {
      component.menuConfig = {
        items: [],
      };

      component.setMenuItems({
        displayContactLink: true,
        suppressAppointment: true,
        pwebStatementUrl:
          'https://my3.intg.voya.com/eportal/preauth.do?s=M3WzuDn6AZtT4YCVU6Ew4g11.i9291&page=STATEMENTS&section=myCorresPrec&d=ea6a8fd9af34f694dfa940078ee98b2f229da710',
      });

      expect(component.menuConfig.items).toEqual(menuItems);
      expect(component.loading).toBeFalse();
    });

    it('should remove contact a professional link if not available', () => {
      component.menuConfig = {
        items: [],
      };

      component.setMenuItems({
        displayContactLink: false,
        suppressAppointment: true,
        pwebStatementUrl:
          'https://my3.intg.voya.com/eportal/preauth.do?s=M3WzuDn6AZtT4YCVU6Ew4g11.i9291&page=STATEMENTS&section=myCorresPrec&d=ea6a8fd9af34f694dfa940078ee98b2f229da710',
      });

      expect(component.menuConfig.items).toEqual(
        menuItems.slice(0, 5).concat(menuItems.slice(6))
      );
    });
  });

  describe('onFaceIDChanged', () => {
    it('should call enableFaceID if toggle on and not already enabled', async () => {
      vaultServiceSpy.isFaceIDEnabled.and.returnValue(false);
      vaultServiceSpy.enableFaceID.and.returnValue(Promise.resolve(true));

      component.faceIDEnabled = true;
      await component.onFaceIDChanged();

      expect(vaultServiceSpy.enableFaceID).toHaveBeenCalled();
      expect(vaultServiceSpy.setDefaultFaceIDDisabled).toHaveBeenCalledWith(
        false
      );
    });

    it('should not call enableFaceID if toggle on and already enabled', async () => {
      vaultServiceSpy.isFaceIDEnabled.and.returnValue(true);
      vaultServiceSpy.enableFaceID.and.returnValue(Promise.resolve(true));

      component.faceIDEnabled = true;
      await component.onFaceIDChanged();

      expect(vaultServiceSpy.enableFaceID).not.toHaveBeenCalled();
      expect(vaultServiceSpy.setDefaultFaceIDDisabled).not.toHaveBeenCalledWith(
        false
      );
    });

    it('should call enableFaceID and then disable it if it fails', async () => {
      vaultServiceSpy.isFaceIDEnabled.and.returnValue(false);
      vaultServiceSpy.enableFaceID.and.returnValue(Promise.resolve(false));

      component.faceIDEnabled = true;
      await component.onFaceIDChanged();

      expect(vaultServiceSpy.enableFaceID).toHaveBeenCalled();
      expect(component.faceIDEnabled).toBeFalse();
      expect(vaultServiceSpy.setDefaultFaceIDDisabled).not.toHaveBeenCalledWith(
        false
      );
    });

    it('should call disableFaceID', async () => {
      vaultServiceSpy.isFaceIDEnabled.and.returnValue(true);

      component.faceIDEnabled = false;
      await component.onFaceIDChanged();

      expect(vaultServiceSpy.disableFaceID).toHaveBeenCalled();
      expect(vaultServiceSpy.setDefaultFaceIDDisabled).toHaveBeenCalledWith(
        true
      );
    });

    it('should not call disableFaceID if already disabled', async () => {
      vaultServiceSpy.isFaceIDEnabled.and.returnValue(false);

      component.faceIDEnabled = false;
      await component.onFaceIDChanged();

      expect(vaultServiceSpy.disableFaceID).not.toHaveBeenCalled();
      expect(vaultServiceSpy.setDefaultFaceIDDisabled).not.toHaveBeenCalledWith(
        true
      );
    });
  });

  describe('logout', () => {
    it('should call auth service logout', () => {
      const modalSpy = jasmine.createSpyObj('Modal', ['present']);
      modalControllerSpy.create.and.returnValue(Promise.resolve(modalSpy));

      component.logout();

      expect(modalControllerSpy.create).toHaveBeenCalledWith({
        component: AlertComponent,
        cssClass: 'modal-not-fullscreen',
        componentProps: {
          titleMessage: settingsText.signOutQuestion,
          yesButtonTxt: settingsText.button,
          noButtonTxt: settingsText.close,
          saveFunction: jasmine.any(Function),
        },
      });

      const saveFunction = modalControllerSpy.create.calls.all()[0].args[0]
        .componentProps.saveFunction;
      saveFunction();

      expect(authServiceSpy.logout).toHaveBeenCalled();
    });
  });
});

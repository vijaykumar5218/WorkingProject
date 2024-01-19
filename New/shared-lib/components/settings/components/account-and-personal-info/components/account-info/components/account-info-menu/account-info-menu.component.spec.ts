import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {Router} from '@angular/router';
import {IonicModule, ModalController} from '@ionic/angular';
import {AccountService} from '@shared-lib/services/account/account.service';
import {AccountInfoText} from '@shared-lib/services/account-info/models/account-and-personal-info.model';
import {AccountInfoMenuComponent} from './account-info-menu.component';
import accountText from '@shared-lib/services/account-info/constants/accountText.json';
import {SharedUtilityService} from '@shared-lib/services/utility/utility.service';
import {PlatformService} from '@shared-lib/services/platform/platform.service';
import {NotificationsSettingService} from '@shared-lib/services/notification-setting/notification-setting.service';
import {AccountInfoService} from '@shared-lib/services/account-info/account-info.service';
import {of} from 'rxjs';
import {AccessService} from '@shared-lib/services/access/access.service';
import {EditDisplayNameService} from '@shared-lib/services/edit-display-name/edit-display-name.service';
import {AlertComponent} from '@shared-lib/components/alert/alert.component';
import {PopupInputType} from '@shared-lib/components/popup-input-dialog/constants/popup-input-type.enum';
import {PopupInputDialogComponent} from '@shared-lib/components/popup-input-dialog/popup-input-dialog.component';

describe('AccountInfoMenuComponent', () => {
  let component: AccountInfoMenuComponent;
  let fixture: ComponentFixture<AccountInfoMenuComponent>;
  let router;
  let accountServiceSpy;
  let utilityServiceSpy;
  const displayText: AccountInfoText = accountText;
  let platformServiceSpy;
  let notificationServiceSpy;
  let accountInfoServiceSpy;
  let modalControllerSpy;
  let modalSpy;
  const participantData = {
    firstName: 'Joseph',
    lastName: 'lastName',
    birthDate: '',
    displayName: '',
    age: '',
    nameDobDiff: false,
    profileId: 'profileId',
  };
  const prefSettings = {
    primaryEmail: {
      lastUpdatedDate: new Date('2021-11-15T12:57:58'),
      partyContactId: 'sdasd-sdasd-fdgdg-sdfsfs',
      email: 'test@voya.com',
      lastFailedInd: 'N',
    },
    mobilePhone: {
      lastUpdatedDate: new Date('2021-11-15T12:57:58'),
      partyContactId: 'sdasd-sdasd-fdgdg-sdfsfs',
      phoneNumber: '1112223333',
    },
  };
  let accessServiceSpy;
  let editDisplayNameServiceSpy;
  const myvoyaAccess = {
    clientDomain: 'domain',
    clientId: 'id',
    clientName: 'name',
    enableMyVoyage: 'Y',
    myProfileURL: 'https://test.profile.link',
    planIdList: [{planId: '623043'}],
    currentPlan: {planId: '623043'},
  };

  beforeEach(
    waitForAsync(() => {
      editDisplayNameServiceSpy = jasmine.createSpyObj(
        'EditDisplayNameService',
        ['saveDisplayName']
      );
      accessServiceSpy = jasmine.createSpyObj('AccessService', [
        'checkMyvoyageAccess',
      ]);
      router = {
        navigateByUrl: jasmine.createSpy('navigate'),
      };
      accountServiceSpy = jasmine.createSpyObj('AccountService', [
        'openPwebAccountLink',
        'setParticipant',
        'getParticipant',
      ]);
      utilityServiceSpy = jasmine.createSpyObj('SharedUtilityService', [
        'getIsWeb',
        'validatePhone',
        'validateEmail',
        'formatPhone',
      ]);
      platformServiceSpy = jasmine.createSpyObj('PlatformService', [
        'isDesktop',
      ]);
      platformServiceSpy.isDesktop.and.returnValue({
        subscribe: () => undefined,
      });
      modalControllerSpy = jasmine.createSpyObj('ModalController', ['create']);
      modalSpy = jasmine.createSpyObj('modalSpy', ['onDidDismiss', 'present']);
      modalSpy.onDidDismiss.and.returnValue(Promise.resolve({saved: true}));
      modalSpy.present.and.returnValue(Promise.resolve(true));
      modalControllerSpy.create.and.returnValue(Promise.resolve(modalSpy));
      notificationServiceSpy = jasmine.createSpyObj(
        'NotificationsSettingService',
        ['setNotificationSettings', 'getNotificationSettings']
      );
      accountInfoServiceSpy = jasmine.createSpyObj('AccountInfoService', [
        'saveEmail',
        'savePhone',
      ]);
      accountServiceSpy.getParticipant.and.returnValue(of(participantData));
      notificationServiceSpy.getNotificationSettings.and.returnValue(
        of(prefSettings)
      );
      TestBed.configureTestingModule({
        declarations: [AccountInfoMenuComponent],
        imports: [IonicModule.forRoot()],
        providers: [
          {provide: Router, useValue: router},
          {provide: AccountService, useValue: accountServiceSpy},
          {provide: SharedUtilityService, useValue: utilityServiceSpy},
          {provide: PlatformService, useValue: platformServiceSpy},
          {
            provide: NotificationsSettingService,
            useValue: notificationServiceSpy,
          },
          {provide: AccountInfoService, useValue: accountInfoServiceSpy},
          {provide: ModalController, useValue: modalControllerSpy},
          {provide: AccessService, useValue: accessServiceSpy},
          {
            provide: EditDisplayNameService,
            useValue: editDisplayNameServiceSpy,
          },
        ],
      }).compileComponents();

      fixture = TestBed.createComponent(AccountInfoMenuComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('ngOnInit', () => {
    spyOn(component.subscription, 'add');
    component.ngOnInit();
    expect(accountServiceSpy.getParticipant).toHaveBeenCalled();
    expect(component.participantData).toEqual(participantData);
    expect(component.subscription.add).toHaveBeenCalled();
    expect(notificationServiceSpy.getNotificationSettings).toHaveBeenCalled();
    expect(component.prefSettings).toEqual(prefSettings);
    expect(component.emailContactId).toEqual(
      prefSettings.primaryEmail.partyContactId
    );
    expect(component.phoneContactId).toEqual(
      prefSettings.mobilePhone.partyContactId
    );
    expect(component.email).toEqual(prefSettings.primaryEmail.email);
    expect(utilityServiceSpy.formatPhone).toHaveBeenCalledWith(
      prefSettings.mobilePhone.phoneNumber
    );
  });

  describe('openPwebProfile', () => {
    it('should call open pweb link', async () => {
      accessServiceSpy.checkMyvoyageAccess.and.returnValue(
        Promise.resolve(myvoyaAccess)
      );
      await component.openPwebProfile();
      expect(accessServiceSpy.checkMyvoyageAccess).toHaveBeenCalled();
      expect(accountServiceSpy.openPwebAccountLink).toHaveBeenCalledWith(
        myvoyaAccess.myProfileURL
      );
    });
  });

  describe('edit', () => {
    beforeEach(() => {
      spyOn(component, 'modalDismissed');
      spyOn(component, 'saveData').and.returnValue(Promise.resolve());
      spyOn(component, 'validation');
    });
    it('should open PopupInputDialogComponent modal and present it', async () => {
      await component.edit(
        component.displayText.phoneTitle,
        component.displayText.phoneSubTitle,
        '111-111-1111',
        component.displayText.phone,
        PopupInputType.phone,
        'editPhonePopupText'
      );
      expect(modalControllerSpy.create).toHaveBeenCalledWith({
        component: PopupInputDialogComponent,
        cssClass: 'modal-not-fullscreen',
        componentProps: {
          title: component.displayText.phoneTitle,
          inputTitle: component.displayText.phoneSubTitle,
          value: '111-111-1111',
          inputType: PopupInputType.phone,
          validator: jasmine.any(Function),
          saveFunction: jasmine.any(Function),
        },
      });
      expect(modalSpy.present).toHaveBeenCalled();
    });
    it('should call modalDismissed during onDidDismiss', async () => {
      await component.edit(
        component.displayText.phoneTitle,
        component.displayText.phoneSubTitle,
        '111-111-1111',
        component.displayText.phone,
        PopupInputType.phone,
        'editPhonePopupText'
      );
      await modalSpy.onDidDismiss();
      expect(component.modalDismissed).toHaveBeenCalledWith(
        {saved: true},
        undefined,
        undefined
      );
    });
    it('for saveFunction & validator', async () => {
      await component.edit(
        component.displayText.phoneTitle,
        component.displayText.phoneSubTitle,
        '111-111-1111',
        component.displayText.phone,
        PopupInputType.phone,
        'editPhonePopupText'
      );
      const saveFunction = modalControllerSpy.create.calls.all()[0].args[0]
        .componentProps.saveFunction;
      await saveFunction('111-111-1111');
      expect(component.saveData).toHaveBeenCalledWith(
        '111-111-1111',
        component.displayText.phone,
        'editPhonePopupText'
      );
      const validator = modalControllerSpy.create.calls.all()[0].args[0]
        .componentProps.validator;
      await validator('111-111-1111');
      expect(component.validation).toHaveBeenCalledWith(
        component.displayText.phone,
        '111-111-1111'
      );
    });
  });

  describe('validation', () => {
    describe('when accountType would be Phone', () => {
      it('phoneVaild would be true', () => {
        utilityServiceSpy.validatePhone.and.returnValue(true);
        const output = component.validation('Phone', '111-111-1111');
        expect(output).toEqual(null);
      });
      it('phoneVaild would be false', () => {
        utilityServiceSpy.validatePhone.and.returnValue(false);
        const output = component.validation('Phone', '111-111-1111');
        expect(utilityServiceSpy.validatePhone).toHaveBeenCalledWith(
          '111-111-1111'
        );
        expect(output).toEqual(component.displayText.invalidPhone);
      });
    });
    describe('when accountType would be Email', () => {
      it('emailVaild would be true', () => {
        utilityServiceSpy.validateEmail.and.returnValue(true);
        const output = component.validation('Email', 'dev@voya.com');
        expect(output).toEqual(null);
      });
      it('emailVaild would be false', () => {
        utilityServiceSpy.validateEmail.and.returnValue(false);
        const output = component.validation('Email', 'dev@voya.com');
        expect(utilityServiceSpy.validateEmail).toHaveBeenCalledWith(
          'dev@voya.com'
        );
        expect(output).toEqual(component.displayText.invalidEmail);
      });
    });
    describe('when accountType would be Display Name', () => {
      it('displayName is Valid', () => {
        const output = component.validation('Display Name', 'Dev');
        expect(output).toEqual(null);
      });
      it('displayName is Non Valid', () => {
        const output = component.validation('Display Name', '  ');
        expect(output).toEqual(component.displayText.invalidDisplayName);
      });
    });
    it('when accountType is empty', () => {
      const output = component.validation(' ', 'dev');
      expect(output).toEqual(null);
    });
  });

  describe('saveData', () => {
    beforeEach(() => {
      spyOn(component, 'modalDismissed');
      spyOn(component, 'saveDisplayName').and.returnValue(
        Promise.resolve(true)
      );
      spyOn(component, 'saveEmailOrPhone').and.returnValue(
        Promise.resolve(true)
      );
    });
    it('should open AlertComponent modal and present it', async () => {
      await component.saveData('111-111-1111', 'Phone', 'editPhonePopupText');
      expect(modalControllerSpy.create).toHaveBeenCalledWith({
        component: AlertComponent,
        cssClass: 'modal-not-fullscreen',
        componentProps: {
          titleMessage: component.editPhonePopupText.alert.message,
          imageUrl: component.editPhonePopupText.alert.imageUrl,
          saveFunction: jasmine.any(Function),
        },
      });
      expect(modalSpy.present).toHaveBeenCalled();
    });
    it('should call modalDismissed during onDidDismiss', async () => {
      await component.saveData('111-111-1111', 'Phone', 'editPhonePopupText');
      await modalSpy.onDidDismiss();
      expect(component.modalDismissed).toHaveBeenCalledWith(
        {saved: true},
        'Phone',
        '111-111-1111'
      );
    });
    describe('for saveFunction', () => {
      it('when accountType would be Phone', async () => {
        await component.saveData('111-111-1111', 'Phone', 'editPhonePopupText');
        const saveFunction = modalControllerSpy.create.calls.all()[0].args[0]
          .componentProps.saveFunction;
        await saveFunction();
        expect(component.saveEmailOrPhone).toHaveBeenCalledWith(
          '1111111111',
          'savePhone',
          component.phoneContactId
        );
      });
      it('when accountType would be Email', async () => {
        await component.saveData('dev@voya.com', 'Email', 'editEmailPopupText');
        const saveFunction = modalControllerSpy.create.calls.all()[0].args[0]
          .componentProps.saveFunction;
        await saveFunction();
        expect(component.saveEmailOrPhone).toHaveBeenCalledWith(
          'dev@voya.com',
          'saveEmail',
          component.emailContactId
        );
      });
      it('when accountType would be Display Name', async () => {
        await component.saveData('dev', 'Display Name', 'editNamePopupText');
        const saveFunction = modalControllerSpy.create.calls.all()[0].args[0]
          .componentProps.saveFunction;
        await saveFunction();
        expect(component.saveDisplayName).toHaveBeenCalledWith('dev');
      });
      it('when accountType would be undefined', async () => {
        await component.saveData('dev', undefined, 'editNamePopupText');
        const saveFunction = modalControllerSpy.create.calls.all()[0].args[0]
          .componentProps.saveFunction;
        await saveFunction();
        expect(component.saveDisplayName).not.toHaveBeenCalled();
      });
    });
  });

  describe('editProperty', () => {
    describe('when isWeb would be false', () => {
      beforeEach(() => {
        component.isWeb = false;
      });
      it('Should redirect to edit display name when clicked on display name', () => {
        component.label = displayText.name;
        component.editProperty();
        expect(router.navigateByUrl).toHaveBeenCalledWith(
          '/settings/account-and-personal-info/edit-display-name'
        );
      });
      it('Should redirect to edit email when clicked on email', () => {
        component.label = displayText.email;
        component.editProperty();
        expect(router.navigateByUrl).toHaveBeenCalledWith(
          '/settings/account-and-personal-info/edit-email'
        );
      });
      it('Should redirect to edit phone when clicked on phone', () => {
        component.label = displayText.phone;
        component.editProperty();
        expect(router.navigateByUrl).toHaveBeenCalledWith(
          '/settings/account-and-personal-info/edit-phone'
        );
      });
      it('Should open pweb in external browser when login info clicked', () => {
        spyOn(component, 'openPwebProfile');
        component.label = displayText.loginInfo;
        component.editProperty();
        expect(component.openPwebProfile).toHaveBeenCalled();
      });
    });
    describe('when isWeb would be true and isDesktop would be false', () => {
      beforeEach(() => {
        component.isWeb = true;
        component.isDesktop = false;
      });
      it('Should redirect to edit email when clicked on email', () => {
        component.label = displayText.email;
        component.editProperty();
        expect(router.navigateByUrl).toHaveBeenCalledWith(
          '/more/account-and-personal-info/edit-email'
        );
      });
    });
    describe('when isWeb would be true and isDesktop would be true', () => {
      beforeEach(() => {
        spyOn(component, 'edit');
        spyOn(component, 'openPwebProfile');
        component.isWeb = true;
        component.isDesktop = true;
      });
      it('when label would be Display Name', () => {
        component.label = 'Display Name';
        component.editProperty();
        expect(component.edit).toHaveBeenCalledWith(
          component.displayText.nameTitle,
          component.displayText.name,
          component.participantData.displayName,
          component.displayText.name,
          PopupInputType.text,
          'editNamePopupText'
        );
      });
      it('when label would be Email', () => {
        component.label = 'Email';
        component.editProperty();
        expect(component.edit).toHaveBeenCalledWith(
          component.displayText.emailTitle,
          component.displayText.email,
          component.email,
          component.displayText.email,
          PopupInputType.email,
          'editEmailPopupText'
        );
      });
      it('when label would be Phone', () => {
        component.label = 'Phone';
        component.editProperty();
        expect(component.edit).toHaveBeenCalledWith(
          component.displayText.phoneTitle,
          component.displayText.phoneSubTitle,
          component.phone,
          component.displayText.phone,
          PopupInputType.phone,
          'editPhonePopupText'
        );
      });
      it('when label would be Login Information', () => {
        component.label = 'Login Information';
        component.editProperty();
        expect(component.openPwebProfile).toHaveBeenCalled();
      });
    });
  });

  describe('saveDisplayName', () => {
    beforeEach(() => {
      editDisplayNameServiceSpy.saveDisplayName.and.returnValue(
        Promise.resolve({
          displayName: 'dev',
        })
      );
    });
    it('when res would be true', async () => {
      const data = await component.saveDisplayName('dev');
      expect(editDisplayNameServiceSpy.saveDisplayName).toHaveBeenCalledWith(
        'dev'
      );
      expect(data).toEqual(true);
    });
    it('when res would be false', async () => {
      const data = await component.saveDisplayName('dev1');
      expect(data).toEqual(false);
    });
  });

  describe('saveEmailOrPhone', () => {
    beforeEach(() => {
      component.phoneContactId = 'contactId1234';
    });
    it('when res would be true', async () => {
      accountInfoServiceSpy.savePhone.and.returnValue(Promise.resolve({}));
      const data = await component.saveEmailOrPhone(
        '111-111-11111',
        'savePhone',
        component.phoneContactId
      );
      expect(accountInfoServiceSpy.savePhone).toHaveBeenCalledWith(
        '111-111-11111',
        component.phoneContactId
      );
      expect(data).toEqual(true);
    });
    it('when res would be false', async () => {
      accountInfoServiceSpy.savePhone.and.returnValue(
        Promise.resolve(undefined)
      );
      const data = await component.saveEmailOrPhone(
        '111-111-11111',
        'savePhone',
        component.phoneContactId
      );
      expect(data).toEqual(false);
    });
  });

  describe('modalDismissed', () => {
    beforeEach(() => {
      component.prefSettings = prefSettings;
      component.participantData = participantData;
    });
    describe('when data is saved', () => {
      const data = {
        data: {
          saved: true,
        },
      };
      it('when accountType would be Email', () => {
        component.modalDismissed(data, 'Email', 'dev@voya.com');
        expect(component.prefSettings.primaryEmail.email).toEqual(
          'dev@voya.com'
        );
        expect(
          notificationServiceSpy.setNotificationSettings
        ).toHaveBeenCalledWith(component.prefSettings);
      });
      it('when accountType would be Phone', () => {
        component.modalDismissed(data, 'Phone', '111-111-1111');
        expect(component.prefSettings.mobilePhone.phoneNumber).toEqual(
          '1111111111'
        );
        expect(
          notificationServiceSpy.setNotificationSettings
        ).toHaveBeenCalledWith(component.prefSettings);
      });
      it('when accountType would be Display Name', () => {
        component.modalDismissed(data, 'Display Name', 'dev');
        expect(component.participantData.displayName).toEqual('dev');
        expect(accountServiceSpy.setParticipant).toHaveBeenCalledWith(
          component.participantData
        );
      });
      it('when accountType would be undefined', () => {
        component.modalDismissed(data, undefined, 'dev');
        expect(accountServiceSpy.setParticipant).not.toHaveBeenCalled();
        expect(
          notificationServiceSpy.setNotificationSettings
        ).not.toHaveBeenCalled();
      });
    });
    describe('when data is not saved', () => {
      const data = {
        data: {
          saved: false,
        },
      };
      it('when accountType would be Email', () => {
        component.modalDismissed(data, 'Email', 'dev@voya.com');
        expect(
          notificationServiceSpy.setNotificationSettings
        ).not.toHaveBeenCalled();
      });
    });
  });

  it('ngOnDestroy', () => {
    spyOn(component.subscription, 'unsubscribe');
    component.ngOnDestroy();
    expect(component.subscription.unsubscribe).toHaveBeenCalled();
  });
});

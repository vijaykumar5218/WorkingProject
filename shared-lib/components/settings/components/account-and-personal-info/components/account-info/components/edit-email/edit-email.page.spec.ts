import {AlertComponent} from '@shared-lib/components/alert/alert.component';
import {EditEmailPage} from './edit-email.page';
import {RouterTestingModule} from '@angular/router/testing';
import {HttpClientModule} from '@angular/common/http';
import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {IonicModule, ModalController} from '@ionic/angular';
import * as pageText from './constants/displayText.json';
import {AccountInfoService} from '@shared-lib/services/account-info/account-info.service';
import {SharedUtilityService} from '@shared-lib/services/utility/utility.service';
import {NotificationsSettingService} from '@shared-lib/services/notification-setting/notification-setting.service';
import {of} from 'rxjs';
import {SettingsPreferences} from '@shared-lib/services/notification-setting/models/notification-settings-preferences.model';
import {Router} from '@angular/router';
import {PlatformService} from '@shared-lib/services/platform/platform.service';
import {ActionOptions} from '@shared-lib/models/ActionOptions.model';
import {HeaderType} from '@shared-lib/constants/headerType.enum';
import {HeaderTypeService} from '@shared-lib/services/header-type/header-type.service';

describe('EditEmailPage', () => {
  let component: EditEmailPage;
  let fixture: ComponentFixture<EditEmailPage>;
  const displayText = JSON.parse(JSON.stringify(pageText)).default;
  let accountInfoServiceSpy;
  let noteSettingsServiceSpy;
  let fetchSpy;
  let headerTypeServiceSpy;
  let routerSpy;
  let modalControllerSpy;
  let utilityServiceSpy;
  let settingsPrefs;
  let testPartyId;
  let platformServiceSpy;

  beforeEach(
    waitForAsync(() => {
      accountInfoServiceSpy = jasmine.createSpyObj('AccountInfoService', [
        'saveEmail',
      ]);
      noteSettingsServiceSpy = jasmine.createSpyObj(
        'NotificationSettingsService',
        ['getNotificationSettings', 'setNotificationSettings']
      );
      headerTypeServiceSpy = jasmine.createSpyObj('HeaderTypeService', [
        'publish',
      ]);
      routerSpy = jasmine.createSpyObj('Router', ['navigateByUrl']);
      modalControllerSpy = jasmine.createSpyObj('ModalController', [
        'create',
        'onDidDismiss',
      ]);
      utilityServiceSpy = jasmine.createSpyObj('UtilityService', [
        'validateEmail',
        'getIsWeb',
      ]);
      testPartyId = 'aaa-bbb-cccv';
      settingsPrefs = {
        required: false,
        primaryEmail: {
          lastUpdatedDate: new Date(),
          partyContactId: testPartyId,
          email: 'test@voya.com',
          lastFailedInd: 'N',
        },
        secondaryEmailAllowed: false,
        docDeliveryEmailContactId: testPartyId,
        mobilePhone: {
          lastUpdatedDate: new Date(),
          partyContactId: testPartyId,
          phoneNumber: '1112223333',
        },
        insightsNotificationPrefs: {
          prefPushNotificationContactId: testPartyId,
          prefMobileContactId: testPartyId,
          prefEmailContactId: testPartyId,
        },
        highPrioitytNotificationPrefs: {
          prefPushNotificationContactId: testPartyId,
          prefMobileContactId: testPartyId,
          prefEmailContactId: testPartyId,
        },
        accountAlertPrefs: {
          prefPushNotificationContactId: testPartyId,
          prefMobileContactId: testPartyId,
          prefEmailContactId: testPartyId,
        },
      };
      platformServiceSpy = jasmine.createSpyObj('PlatformService', [
        'isDesktop',
      ]);
      platformServiceSpy.isDesktop.and.returnValue(of(true));

      TestBed.configureTestingModule({
        declarations: [EditEmailPage],
        imports: [HttpClientModule, RouterTestingModule, IonicModule.forRoot()],
        providers: [
          {provide: AccountInfoService, useValue: accountInfoServiceSpy},
          {
            provide: NotificationsSettingService,
            useValue: noteSettingsServiceSpy,
          },
          {provide: Router, useValue: routerSpy},
          {provide: HeaderTypeService, useValue: headerTypeServiceSpy},
          {provide: ModalController, useValue: modalControllerSpy},
          {provide: SharedUtilityService, useValue: utilityServiceSpy},
          {provide: PlatformService, useValue: platformServiceSpy},
        ],
      }).compileComponents();

      fixture = TestBed.createComponent(EditEmailPage);
      component = fixture.componentInstance;
      component.subscription = jasmine.createSpyObj('Subscription', [
        'unsubscribe',
      ]);
      fetchSpy = spyOn(component, 'fetchData');
      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should publish header and call fetchData', () => {
      const actionOption: ActionOptions = {
        headername: displayText.headerName,
        btnleft: true,
        btnright: true,
        buttonLeft: {
          name: '',
          link: 'settings/account-and-personal-info',
        },
        buttonRight: {
          name: '',
          link: 'notification',
        },
      };
      component.ngOnInit();
      expect(headerTypeServiceSpy.publish).toHaveBeenCalledWith({
        type: HeaderType.navbar,
        actionOption: actionOption,
      });
      expect(component.fetchData).toHaveBeenCalledWith();
    });
  });

  describe('fetchData', () => {
    beforeEach(() => {
      fetchSpy.and.callThrough();

      noteSettingsServiceSpy.getNotificationSettings.and.returnValue(
        of(settingsPrefs)
      );
    });

    it('should call getProfileData from accountInfoService', async () => {
      await component.fetchData();

      expect(noteSettingsServiceSpy.getNotificationSettings).toHaveBeenCalled();
      expect(component.prefSettings).toEqual(settingsPrefs);
      expect(component.email).toEqual('test@voya.com');
      expect(component.contactId).toEqual(testPartyId);
    });
  });

  describe('cancel', () => {
    it('when isWeb would be false', () => {
      component.isWeb = false;
      component.cancel();
      expect(routerSpy.navigateByUrl).toHaveBeenCalledWith(
        '/settings/account-and-personal-info'
      );
    });
    it('when isWeb would be true and isDesktop would be false', () => {
      component.isWeb = true;
      component.isDesktop = false;
      component.cancel();
      expect(routerSpy.navigateByUrl).toHaveBeenCalledWith(
        '/more/account-and-personal-info'
      );
    });
  });

  describe('valueChanged', () => {
    it('should change the value of email var and validate', () => {
      utilityServiceSpy.validateEmail.and.returnValue(true);
      component.email = undefined;
      component.emailVailid = false;
      component.valueChanged('John@test.com');
      expect(component.email).toEqual('John@test.com');
      expect(utilityServiceSpy.validateEmail).toHaveBeenCalledWith(
        'John@test.com'
      );
      expect(component.emailVailid).toEqual(true);
    });

    it('should change the value of email var and set invalid', () => {
      utilityServiceSpy.validateEmail.and.returnValue(false);
      component.email = undefined;
      component.emailVailid = true;
      component.valueChanged('John@test.c');
      expect(component.email).toEqual('John@test.c');
      expect(utilityServiceSpy.validateEmail).toHaveBeenCalledWith(
        'John@test.c'
      );
      expect(component.emailVailid).toEqual(false);
    });

    it('should change the value of email to undefined if value is undefined', () => {
      component.email = 'John@test.c';
      component.valueChanged(undefined);
      expect(component.email).toBeUndefined();
    });
  });

  describe('saveEmail', () => {
    it('should show the alert modal for confirmation of save of email', async () => {
      const modal = jasmine.createSpyObj('HTMLIonModalElement', [
        'present',
        'onDidDismiss',
      ]);
      modalControllerSpy.create.and.returnValue(Promise.resolve(modal));
      modal.onDidDismiss.and.returnValue(
        Promise.resolve({
          data: {
            saved: false,
          },
        })
      );
      await component.saveEmail();
      expect(modalControllerSpy.create).toHaveBeenCalledWith({
        component: AlertComponent,
        cssClass: 'modal-not-fullscreen',
        componentProps: {
          titleMessage: displayText.alert.message,
          imageUrl: displayText.alert.imageUrl,
          saveFunction: jasmine.any(Function),
        },
      });
      expect(modal.present).toHaveBeenCalled();
    });

    it('should properly use save function', async () => {
      const modal = jasmine.createSpyObj('HTMLIonModalElement', [
        'present',
        'onDidDismiss',
      ]);
      modalControllerSpy.create.and.returnValue(Promise.resolve(modal));
      modal.onDidDismiss.and.returnValue(
        Promise.resolve({
          data: {
            saved: false,
          },
        })
      );
      await component.saveEmail();
      expect(modalControllerSpy.create).toHaveBeenCalledWith({
        component: AlertComponent,
        cssClass: 'modal-not-fullscreen',
        componentProps: {
          titleMessage: displayText.alert.message,
          imageUrl: displayText.alert.imageUrl,
          saveFunction: jasmine.any(Function),
        },
      });
      expect(modal.present).toHaveBeenCalled();

      const saveFunction = modalControllerSpy.create.calls.all()[0].args[0]
        .componentProps.saveFunction;

      component.email = 'test@test.com';

      accountInfoServiceSpy.saveEmail.and.returnValue(
        Promise.resolve({dataStatus: 'OK'})
      );

      const result = await saveFunction();
      expect(accountInfoServiceSpy.saveEmail).toHaveBeenCalledWith(
        component.email,
        component.contactId
      );
      expect(result).toEqual(true);

      accountInfoServiceSpy.saveEmail.and.returnValue(Promise.resolve(null));

      const result2 = await saveFunction();
      expect(accountInfoServiceSpy.saveEmail).toHaveBeenCalledWith(
        component.email,
        component.contactId
      );
      expect(result2).toEqual(false);
    });
  });

  describe('modalDismissed', () => {
    beforeEach(() => {
      component.email = 'test@test.com';
      component.prefSettings = settingsPrefs;
    });

    it('should call cancel and refreshData if data saved', () => {
      spyOn(component, 'cancel');
      component.modalDismissed({
        data: {
          saved: true,
        },
      });

      const newPrefs: SettingsPreferences = {...settingsPrefs};
      newPrefs.primaryEmail.email = 'test@test.com';

      expect(
        noteSettingsServiceSpy.setNotificationSettings
      ).toHaveBeenCalledWith(newPrefs);
      expect(component.cancel).toHaveBeenCalled();
    });

    it('should not call cancel and refreshData if data not saved', () => {
      spyOn(component, 'cancel');
      component.modalDismissed({
        data: {
          saved: false,
        },
      });
      expect(
        noteSettingsServiceSpy.getNotificationSettings
      ).not.toHaveBeenCalledWith(true);
      expect(component.cancel).not.toHaveBeenCalled();
    });
  });

  describe('ngOnDestroy', () => {
    it('should unsubscribe', () => {
      component.ngOnDestroy();
      expect(component.subscription.unsubscribe).toHaveBeenCalled();
    });
  });
});

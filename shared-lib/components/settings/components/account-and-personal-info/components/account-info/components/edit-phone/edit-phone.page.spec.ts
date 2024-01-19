import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {IonicModule, ModalController} from '@ionic/angular';
import {EditPhonePage} from './edit-phone.page';
import {RouterTestingModule} from '@angular/router/testing';
import {HttpClientModule} from '@angular/common/http';
import {of} from 'rxjs';
import * as pageText from './constants/displayText.json';
import {AccountInfoService} from '@shared-lib/services/account-info/account-info.service';
import {AlertComponent} from '@shared-lib/components/alert/alert.component';
import {SharedUtilityService} from '@shared-lib/services/utility/utility.service';
import {NotificationsSettingService} from '@shared-lib/services/notification-setting/notification-setting.service';
import {SettingsPreferences} from '@shared-lib/services/notification-setting/models/notification-settings-preferences.model';
import {Router} from '@angular/router';
import {PlatformService} from '@shared-lib/services/platform/platform.service';
import {ActionOptions} from '@shared-lib/models/ActionOptions.model';
import {HeaderType} from '@shared-lib/constants/headerType.enum';
import {HeaderTypeService} from '@shared-lib/services/header-type/header-type.service';

describe('EditPhonePage', () => {
  let component: EditPhonePage;
  let fixture: ComponentFixture<EditPhonePage>;
  const displayText = JSON.parse(JSON.stringify(pageText)).default;
  let accountInfoServiceSpy;
  let noteSettingsServiceSpy;
  let fetchSpy;
  let headerTypeServiceSpy;
  let modalControllerSpy;
  let utilityServiceSpy;
  let testPartyId;
  let settingsPrefs;
  let platformServiceSpy;
  let routerSpy;

  beforeEach(
    waitForAsync(() => {
      accountInfoServiceSpy = jasmine.createSpyObj('AccountInfoService', [
        'savePhone',
      ]);
      noteSettingsServiceSpy = jasmine.createSpyObj(
        'NotificationSettingsService',
        ['getNotificationSettings', 'setNotificationSettings']
      );
      headerTypeServiceSpy = jasmine.createSpyObj('HeaderTypeService', [
        'publish',
      ]);
      routerSpy = jasmine.createSpyObj('Router', ['navigateByUrl']);
      platformServiceSpy = jasmine.createSpyObj('PlatformService', [
        'isDesktop',
      ]);
      platformServiceSpy.isDesktop.and.returnValue(of(true));
      modalControllerSpy = jasmine.createSpyObj('ModalController', [
        'create',
        'onDidDismiss',
      ]);
      utilityServiceSpy = jasmine.createSpyObj('UtilityService', [
        'validatePhone',
        'getIsWeb',
        'formatPhone',
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

      TestBed.configureTestingModule({
        declarations: [EditPhonePage],
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

      fixture = TestBed.createComponent(EditPhonePage);
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

      spyOn(component, 'valueChanged');
    });

    it('should call getProfileData from accountInfoService', async () => {
      await component.fetchData();

      expect(component.prefSettings).toEqual(settingsPrefs);
      expect(noteSettingsServiceSpy.getNotificationSettings).toHaveBeenCalled();
      expect(component.valueChanged).toHaveBeenCalledWith('1112223333');
      expect(component.contactId).toEqual(testPartyId);
    });
  });

  describe('goBack', () => {
    it('when isWeb would be false', () => {
      component.isWeb = false;
      component.goBack();
      expect(routerSpy.navigateByUrl).toHaveBeenCalledWith(
        '/settings/account-and-personal-info'
      );
    });
    it('when isWeb would be true and isDesktop would be false', () => {
      component.isWeb = true;
      component.isDesktop = false;
      component.goBack();
      expect(routerSpy.navigateByUrl).toHaveBeenCalledWith(
        '/more/account-and-personal-info'
      );
    });
  });

  describe('valueChanged', () => {
    it('should change the value of phone var and validate', () => {
      utilityServiceSpy.validatePhone.and.returnValue(true);
      utilityServiceSpy.formatPhone.and.returnValue('860-867-5309');
      component.phone = undefined;
      component.phoneVailid = false;
      component.valueChanged('860-867-5309');
      expect(component.phone).toEqual('860-867-5309');
      expect(utilityServiceSpy.validatePhone).toHaveBeenCalledWith(
        '860-867-5309'
      );
      expect(component.phoneVailid).toEqual(true);
      expect(utilityServiceSpy.formatPhone).toHaveBeenCalledWith(
        '860-867-5309'
      );
    });
  });

  describe('savePhone', () => {
    it('should show the alert modal for confirmation of save of phone', async () => {
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
      await component.savePhone();
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
      await component.savePhone();
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

      component.phone = '860-867-5309';
      component.contactId = 'aaa-bbb-ccc-ddd';

      accountInfoServiceSpy.savePhone.and.returnValue(
        Promise.resolve({dataStatus: 'OK'})
      );

      const result = await saveFunction();
      expect(accountInfoServiceSpy.savePhone).toHaveBeenCalledWith(
        component.phone,
        component.contactId
      );
      expect(result).toEqual(true);

      accountInfoServiceSpy.savePhone.and.returnValue(Promise.resolve(null));

      const result2 = await saveFunction();
      expect(accountInfoServiceSpy.savePhone).toHaveBeenCalledWith(
        component.phone,
        component.contactId
      );
      expect(result2).toEqual(false);
    });
  });

  describe('modalDismissed', () => {
    beforeEach(() => {
      component.phone = '860-867-5309';
      component.prefSettings = settingsPrefs;
    });

    it('should call cancel and setNotificationSettings if data saved', () => {
      spyOn(component, 'goBack');
      component.modalDismissed({
        saved: true,
      });

      const newPrefs: SettingsPreferences = {...settingsPrefs};
      newPrefs.mobilePhone.phoneNumber = '8608675309';

      expect(
        noteSettingsServiceSpy.setNotificationSettings
      ).toHaveBeenCalledWith(newPrefs);
      expect(component.goBack).toHaveBeenCalled();
      expect(
        noteSettingsServiceSpy.getNotificationSettings
      ).toHaveBeenCalledWith(true);
    });

    it('should call cancel and refreshData if data saved', () => {
      spyOn(component, 'goBack');
      component.modalDismissed({saved: false});
      expect(component.goBack).not.toHaveBeenCalled();
    });
  });

  describe('ngOnDestroy', () => {
    it('should unsubscribe', () => {
      component.ngOnDestroy();
      expect(component.subscription.unsubscribe).toHaveBeenCalled();
    });
  });
});

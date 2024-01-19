import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {IonicModule} from '@ionic/angular';
import {SharedUtilityService} from '@shared-lib/services/utility/utility.service';
import {PreferenceSelectionPage} from './preferences-selection.page';
import {NativeSettingsService} from '@shared-lib/services/native-settings/native-settings.service';
import {NotificationsSettingService} from '@shared-lib/services/notification-setting/notification-setting.service';
import {EventTrackingService} from '@shared-lib/services/event-tracker/event-tracking.service';
import {ModalPresentationService} from '../../services/modal-presentation/modal-presentation.service';

describe('PreferenceSelectionPage', () => {
  let component: PreferenceSelectionPage;
  let fixture: ComponentFixture<PreferenceSelectionPage>;
  let modalPresentationServiceSpy;
  let utilityServiceSpy;
  let nativeSettingsServiceSpy;
  let settingsServiceSpy;
  let eventTrackingServiceSpy;

  beforeEach(
    waitForAsync(() => {
      utilityServiceSpy = jasmine.createSpyObj('SharedUtilityService', [
        'getIsWeb',
        'setSuppressHeaderFooter',
        'registerModal',
        'resetModalHead',
      ]);
      modalPresentationServiceSpy = jasmine.createSpyObj(
        'ModalPresentationService',
        ['dismiss']
      );
      nativeSettingsServiceSpy = jasmine.createSpyObj('NativeSettingsService', [
        'checkNotificationStatus',
        'createAndShowModal',
      ]);
      settingsServiceSpy = jasmine.createSpyObj('NotificationsSettingService', [
        'saveNotificationPrefs',
      ]);
      eventTrackingServiceSpy = jasmine.createSpyObj('EventTrackingService', [
        'eventTracking',
      ]);

      TestBed.configureTestingModule({
        declarations: [PreferenceSelectionPage],
        imports: [IonicModule.forRoot()],
        providers: [
          {
            provide: ModalPresentationService,
            useValue: modalPresentationServiceSpy,
          },
          {provide: SharedUtilityService, useValue: utilityServiceSpy},
          {provide: NativeSettingsService, useValue: nativeSettingsServiceSpy},
          {provide: NotificationsSettingService, useValue: settingsServiceSpy},
          {provide: EventTrackingService, useValue: eventTrackingServiceSpy},
        ],
      }).compileComponents();

      fixture = TestBed.createComponent(PreferenceSelectionPage);
      component = fixture.componentInstance;
      component.emailContactId = '987';
      component.mobileContactId = '123';
      spyOn<any>(component, 'setUpToggleValues');
      const mockLastPreferenceData = {
        required: false,
        primaryEmail: {
          lastUpdatedDate: new Date(),
          partyContactId: '123',
          email: 'jeni.anna@voya.com',
          lastFailedInd: 'N',
        },
        secondaryEmailAllowed: false,
        docDeliveryEmailContactId: '70720357-e465-450a-a658-e9a1025913d6',
        mobilePhone: {
          lastUpdatedDate: new Date(),
          partyContactId: '987',
          phoneNumber: '1111111111',
        },
        lastPreferenceResponse: true,
      };
      const mockAccessData = {
        clientId: 'KOHLER',
        clientDomain: 'kohler.intg.voya.com',
        clientName: 'Kohler Co. 401(k) Savings Plan',
        planIdList: [
          {
            planId: '623040',
          },
        ],
        firstTimeLoginWeb: true,
        currentPlan: {
          planId: '623040',
        },
        enableMyVoyage: 'N',
        isHealthOnly: false,
        myProfileURL: 'https%3A%2F%2Flogin.intg.voya',
        firstTimeLogin: true,
        enableBST: 'Y',
        enableTPA: 'N',
        enableCoverages: false,
      };
      component.loginObject = mockAccessData;
      component.preferenceObject = mockLastPreferenceData;
      component.noMobilePhone = false;
      nativeSettingsServiceSpy.checkNotificationStatus.and.returnValue(
        Promise.resolve(false)
      );
      fixture.detectChanges();
      nativeSettingsServiceSpy.checkNotificationStatus.calls.reset();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should call setUpToggleValues', async () => {
      await component.ngOnInit();
      expect(component['setUpToggleValues']).toHaveBeenCalled();
    });
    it('should set mobileContactId', async () => {
      await component.ngOnInit();
      expect(component.mobileContactId).toBe('987');
    });
    it('should set mobileContactId to empty string', async () => {
      component.preferenceObject = {
        required: false,
        primaryEmail: {
          lastUpdatedDate: new Date(),
          partyContactId: '123',
          email: 'jeni.anna@voya.com',
          lastFailedInd: 'N',
        },
        secondaryEmailAllowed: false,
        docDeliveryEmailContactId: '70720357-e465-450a-a658-e9a1025913d6',
        lastPreferenceResponse: true,
      };
      await component.ngOnInit();
      expect(component.mobileContactId).toBe('');
    });

    it('should set originalPushPref if its not web', async () => {
      utilityServiceSpy.getIsWeb.and.returnValue(false);
      component['originalPushPref'] = undefined;
      await component.ngOnInit();
      expect(
        nativeSettingsServiceSpy.checkNotificationStatus
      ).toHaveBeenCalled();
      expect(component['originalPushPref']).toBeFalse();
    });

    it('should not set originalPushPref if its web', async () => {
      utilityServiceSpy.getIsWeb.and.returnValue(true);
      component['originalPushPref'] = undefined;
      await component.ngOnInit();
      expect(
        nativeSettingsServiceSpy.checkNotificationStatus
      ).not.toHaveBeenCalled();
      expect(component['originalPushPref']).toBeUndefined();
    });
  });
  describe('ngAfterViewInit', () => {
    it('should disabled toggle', () => {
      component.preferenceObject = {};
      component.ngAfterViewInit();
      expect(component.noMobilePhone).toBeTrue();
    });
    it('should enable toggle', () => {
      component.ngAfterViewInit();
      expect(component.noMobilePhone).toBeFalse();
    });
  });

  describe('closeDialog', () => {
    it('should call dismiss and call save Api if first time login is true and OS notification is allow', async () => {
      component.pageText.preferenceOptions['Text'] = true;
      component['originalPushPref'] = true;
      await component.closeDialog();
      expect(settingsServiceSpy.saveNotificationPrefs).toHaveBeenCalledWith({
        accountAlertPrefs: {
          prefEmailContactId: '123',
          prefMobileContactId: 'DONT_TEXT',
          prefPushNotificationContactId: '123',
        },
        highPrioitytNotificationPrefs: {
          prefEmailContactId: '123',
          prefMobileContactId: 'DONT_TEXT',
          prefPushNotificationContactId: '123',
        },
        insightsNotificationPrefs: {
          prefEmailContactId: '123',
          prefMobileContactId: 'DONT_TEXT',
          prefPushNotificationContactId: '123',
        },
      });
      expect(modalPresentationServiceSpy.dismiss).toHaveBeenCalled();
    });
    it('should call dismiss and call save Api if first time login is true and OS notification is off', async () => {
      component.pageText.preferenceOptions['Text'] = true;
      component['originalPushPref'] = false;
      await component.closeDialog();
      expect(settingsServiceSpy.saveNotificationPrefs).toHaveBeenCalledWith({
        accountAlertPrefs: {
          prefEmailContactId: '123',
          prefMobileContactId: 'DONT_TEXT',
          prefPushNotificationContactId: 'DONT_PUSH',
        },
        highPrioitytNotificationPrefs: {
          prefEmailContactId: '123',
          prefMobileContactId: 'DONT_TEXT',
          prefPushNotificationContactId: 'DONT_PUSH',
        },
        insightsNotificationPrefs: {
          prefEmailContactId: '123',
          prefMobileContactId: 'DONT_TEXT',
          prefPushNotificationContactId: 'DONT_PUSH',
        },
      });
      expect(modalPresentationServiceSpy.dismiss).toHaveBeenCalled();
    });
    it('should not call if it is not first time user', async () => {
      component.loginObject.firstTimeLogin = false;
      component.loginObject.firstTimeLoginWeb = false;
      await component.closeDialog();
      expect(settingsServiceSpy.saveNotificationPrefs).not.toHaveBeenCalled();
    });
    it('should set push notification on for web', async () => {
      component.isWeb = true;
      component.loginObject.firstTimeLogin = true;
      component.loginObject.firstTimeLoginWeb = true;
      await component.closeDialog();
      expect(settingsServiceSpy.saveNotificationPrefs).toHaveBeenCalledWith({
        accountAlertPrefs: {
          prefEmailContactId: '123',
          prefMobileContactId: 'DONT_TEXT',
          prefPushNotificationContactId: '123',
        },
        highPrioitytNotificationPrefs: {
          prefEmailContactId: '123',
          prefMobileContactId: 'DONT_TEXT',
          prefPushNotificationContactId: '123',
        },
        insightsNotificationPrefs: {
          prefEmailContactId: '123',
          prefMobileContactId: 'DONT_TEXT',
          prefPushNotificationContactId: '123',
        },
      });
    });
  });

  describe('onPopState', () => {
    it('should call closeDialog', () => {
      spyOn(component, 'closeDialog');
      component.onPopState();
      expect(component.closeDialog).toHaveBeenCalled();
    });
  });

  describe('changeNotificationMethod', () => {
    it('should not call CreateAndShowModal for Text', async () => {
      await component.changeNotificationMethod('Text');
      expect(
        nativeSettingsServiceSpy.checkNotificationStatus
      ).not.toHaveBeenCalled();
      expect(
        nativeSettingsServiceSpy.createAndShowModal
      ).not.toHaveBeenCalled();
    });

    it('should not call CreateAndShowModal for Email', async () => {
      await component.changeNotificationMethod('Email');
      expect(
        nativeSettingsServiceSpy.checkNotificationStatus
      ).not.toHaveBeenCalled();
      expect(
        nativeSettingsServiceSpy.createAndShowModal
      ).not.toHaveBeenCalled();
    });

    it('should not call checkNotificationStatus for Push Notification toggle and preference turned off', async () => {
      utilityServiceSpy.getIsWeb.and.returnValue(false);
      component.pageText.preferenceOptions['Push Notifications'] = false;
      await component.changeNotificationMethod('Push Notifications');
      expect(
        nativeSettingsServiceSpy.checkNotificationStatus
      ).not.toHaveBeenCalled();
    });

    it('should not call CreateAndShowModal for Push Notification toggle, preference turned on and Notification permission grated', async () => {
      nativeSettingsServiceSpy.checkNotificationStatus.and.returnValue(
        Promise.resolve(true)
      );
      utilityServiceSpy.getIsWeb.and.returnValue(false);
      component.pageText.preferenceOptions['Push Notifications'] = true;
      await component.changeNotificationMethod('Push Notifications');
      expect(
        nativeSettingsServiceSpy.checkNotificationStatus
      ).toHaveBeenCalled();
      expect(
        nativeSettingsServiceSpy.createAndShowModal
      ).not.toHaveBeenCalled();
    });

    it('should call CreateAndShowModal for Push Notification toggle and notification permission denied if being toggled on', async () => {
      nativeSettingsServiceSpy.checkNotificationStatus.and.returnValue(
        Promise.resolve(false)
      );
      utilityServiceSpy.getIsWeb.and.returnValue(false);
      component.pageText.preferenceOptions['Push Notifications'] = true;
      await component.changeNotificationMethod('Push Notifications');
      expect(
        nativeSettingsServiceSpy.checkNotificationStatus
      ).toHaveBeenCalled();
      expect(nativeSettingsServiceSpy.createAndShowModal).toHaveBeenCalled();
    });
  });

  describe('setUpToggleValues', async () => {
    beforeEach(() => {
      (component['setUpToggleValues'] as any).and.callThrough();
    });
    it('should call set push notification toggle on', async () => {
      component.isWeb = true;
      await component['setUpToggleValues']();
      expect(component.pageText.preferenceOptions['Push Notifications']).toBe(
        true
      );
    });
    it('should call set push notification toggle on or off when permission is granted', async () => {
      component['originalPushPref'] = true;
      component.isWeb = false;
      await component['setUpToggleValues']();
      expect(component.pageText.preferenceOptions['Push Notifications']).toBe(
        true
      );
    });
    it('should call set push notification toggle on or off when no permission granted', async () => {
      component.pageText.preferenceOptions['Push Notifications'] = false;
      nativeSettingsServiceSpy.checkNotificationStatus.and.returnValue(
        Promise.resolve(false)
      );
      component.isWeb = false;
      await component['setUpToggleValues']();
      expect(component.pageText.preferenceOptions['Push Notifications']).toBe(
        false
      );
    });
    it('should set push, email and text all to default off ', async () => {
      component.loginObject.firstTimeLogin = false;
      component.loginObject.firstTimeLoginWeb = false;
      component.pageText.preferenceOptions['Push Notifications'] = false;
      await component['setUpToggleValues']();
      expect(component.pageText.preferenceOptions['Push Notifications']).toBe(
        false
      );
      expect(component.pageText.preferenceOptions['Email']).toBe(false);
    });
  });
  describe('Object', () => {
    it('should return object keys', () => {
      const optionArray = {Push: 'yes', text: 'no'};
      expect(component.objectKeys(optionArray)).toEqual(['Push', 'text']);
    });
  });
  describe('trackpreferenceEvent', () => {
    it('should call eventTracking', () => {
      component['trackpreferenceEvent']();
      expect(eventTrackingServiceSpy.eventTracking).toHaveBeenCalledWith({
        eventName: component.eventContent.eventTrackingPreference.eventName,
      });
    });
  });
  describe('savePreferenceInDB', () => {
    it('should call trackpreferenceEvent', async () => {
      component['setPreferenceObject'];
      spyOn<any>(component, 'trackpreferenceEvent');
      await component.savePreferenceInDB();
      expect(component['trackpreferenceEvent']).toHaveBeenCalled();
      expect(modalPresentationServiceSpy.dismiss).toHaveBeenCalled();
    });
  });

  describe('setPreferenceObject', () => {
    it('should call setPreferenceObject with contact id in email and push notification', () => {
      component.pageText.preferenceOptions['Push Notifications'] = true;
      component.pageText.preferenceOptions['Email'] = false;
      component.pageText.preferenceOptions['Text'] = false;
      const result = component['setPreferenceObject']();
      expect(result).toEqual({
        insightsNotificationPrefs: {
          prefPushNotificationContactId: '123',
          prefMobileContactId: 'DONT_TEXT',
          prefEmailContactId: 'DONT_EMAIL',
        },
        accountAlertPrefs: {
          prefPushNotificationContactId: '123',
          prefMobileContactId: 'DONT_TEXT',
          prefEmailContactId: 'DONT_EMAIL',
        },
        highPrioitytNotificationPrefs: {
          prefPushNotificationContactId: '123',
          prefMobileContactId: 'DONT_TEXT',
          prefEmailContactId: 'DONT_EMAIL',
        },
      });
    });
    it('should call setPreferenceObject with contact id in email and text', () => {
      component.pageText.preferenceOptions['Push Notifications'] = false;
      component.pageText.preferenceOptions['Email'] = true;
      component.pageText.preferenceOptions['Text'] = true;
      const result = component['setPreferenceObject']();
      expect(result).toEqual({
        insightsNotificationPrefs: {
          prefPushNotificationContactId: 'DONT_PUSH',
          prefMobileContactId: '987',
          prefEmailContactId: '123',
        },
        accountAlertPrefs: {
          prefPushNotificationContactId: 'DONT_PUSH',
          prefMobileContactId: '987',
          prefEmailContactId: '123',
        },
        highPrioitytNotificationPrefs: {
          prefPushNotificationContactId: 'DONT_PUSH',
          prefMobileContactId: '987',
          prefEmailContactId: '123',
        },
      });
    });
  });
});

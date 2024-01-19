import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {IonicModule} from '@ionic/angular';
import {RouterTestingModule} from '@angular/router/testing';
import {PartyIds} from '@shared-lib/services/notification-setting/models/party-ids.model';
import {NotificationsSettingService} from '@shared-lib/services/notification-setting//notification-setting.service';
import {NotificationEventsComponent} from './notification-events.component';
import {NativeSettingsService} from '@shared-lib/services/native-settings/native-settings.service';
import {SharedUtilityService} from '@shared-lib/services/utility/utility.service';

describe('NotificationEventsComponent', () => {
  let component: NotificationEventsComponent;
  let fixture: ComponentFixture<NotificationEventsComponent>;
  let settingsServiceSpy;
  let partyIds: PartyIds;
  let noteObSpy;
  let subSpy;
  let nativeSettingsServiceSpy;
  let utilityServiceSpy;

  beforeEach(
    waitForAsync(() => {
      subSpy = jasmine.createSpyObj('Subscription', ['unsubscribe']);
      noteObSpy = jasmine.createSpyObj('NotificationPrefsChanged', [
        'subscribe',
      ]);
      nativeSettingsServiceSpy = jasmine.createSpyObj('NativeSettingsService', [
        'checkNotificationStatus',
        'createAndShowModal',
      ]);
      noteObSpy.subscribe.and.returnValue(subSpy);
      settingsServiceSpy = jasmine.createSpyObj(
        'NotificationsSettingService',
        ['updateSettings', 'getCheckedAndActive'],
        {
          notificationPrefsChanged$: noteObSpy,
        }
      );
      utilityServiceSpy = jasmine.createSpyObj('UtilityService', ['getIsWeb']);
      utilityServiceSpy.getIsWeb.and.returnValue(true);
      partyIds = {
        emailContactId: '1111',
        mobileContactId: '1111',
        HPPrefPushContactId: '1111',
        HPPrefMobileContactId: '1111',
        HPPrefEmailContactId: '1111',
        AAPrefPushContactId: '1111',
        AAPrefMobileContactId: '1111',
        AAPrefEmailContactId: '1111',
        INPrefPushContactId: '1111',
        INPrefMobileContactId: '1111',
        INPrefEmailContactId: '1111',
      };

      TestBed.configureTestingModule({
        declarations: [NotificationEventsComponent],
        imports: [RouterTestingModule, IonicModule.forRoot()],
        providers: [
          {provide: NotificationsSettingService, useValue: settingsServiceSpy},
          {provide: NativeSettingsService, useValue: nativeSettingsServiceSpy},
          {provide: SharedUtilityService, useValue: utilityServiceSpy},
        ],
      }).compileComponents();

      fixture = TestBed.createComponent(NotificationEventsComponent);
      component = fixture.componentInstance;

      component.basePropName = 'HPPref';

      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should set isWeb', async () => {
      expect(utilityServiceSpy.getIsWeb).toHaveBeenCalled();
      expect(component['isWeb']).toBeTrue();
    });

    it('should subscribe to partyIds', async () => {
      expect(
        settingsServiceSpy.notificationPrefsChanged$.subscribe
      ).toHaveBeenCalledWith(jasmine.any(Function));
    });
  });

  describe('partyIdsUpdated', () => {
    it('should set checked and active based on service', () => {
      component.pushChecked = undefined;
      component.emailChecked = undefined;
      component.textChecked = undefined;
      component.sectionActive = undefined;
      settingsServiceSpy.getCheckedAndActive.and.returnValue({
        pushChecked: true,
        emailChecked: false,
        textChecked: false,
        sectionActive: true,
      });
      component.partyIdsUpdated(partyIds);
      expect(settingsServiceSpy.getCheckedAndActive).toHaveBeenCalled();
      expect(component.pushChecked).toBeTrue();
      expect(component.emailChecked).toBeFalse();
      expect(component.textChecked).toBeFalse();
      expect(component.sectionActive).toBeTrue();
    });
    it('should set isdisabled to true when mobile phone is not present', () => {
      component.pushChecked = undefined;
      component.emailChecked = undefined;
      component.textChecked = undefined;
      component.sectionActive = undefined;
      component.isDisabled = true;
      settingsServiceSpy.getCheckedAndActive.and.returnValue({
        pushChecked: true,
        emailChecked: false,
        textChecked: false,
        sectionActive: true,
        textDisabled: false,
      });
      component.partyIdsUpdated(partyIds);
      expect(settingsServiceSpy.getCheckedAndActive).toHaveBeenCalled();
      expect(component.isDisabled).toBeFalse();
    });
  });

  describe('toggleSection', () => {
    it('if sectionActive is false, should set all valued to false', () => {
      component.toggleSection();

      expect(settingsServiceSpy.updateSettings).toHaveBeenCalledTimes(3);

      expect(settingsServiceSpy.updateSettings.calls.all()[0].args[0]).toEqual(
        false
      );
      expect(settingsServiceSpy.updateSettings.calls.all()[0].args[1]).toEqual(
        component.basePropName + 'MobileContactId-DONT_TEXT'
      );

      expect(settingsServiceSpy.updateSettings.calls.all()[1].args[0]).toEqual(
        false
      );
      expect(settingsServiceSpy.updateSettings.calls.all()[1].args[1]).toEqual(
        component.basePropName + 'EmailContactId-DONT_EMAIL'
      );

      expect(settingsServiceSpy.updateSettings.calls.all()[2].args[0]).toEqual(
        false
      );
      expect(settingsServiceSpy.updateSettings.calls.all()[2].args[1]).toEqual(
        component.basePropName + 'PushContactId-DONT_PUSH'
      );
    });
  });

  describe('updateSetting', () => {
    it('should call service function', () => {
      const checked = false;
      const fName = 'HPPrefEmailContactId-DONT_EMAIL';

      component.updateSetting(checked, fName);
      expect(settingsServiceSpy.updateSettings).toHaveBeenCalledWith(
        checked,
        fName
      );
    });
  });

  describe('ngOnDestroy', () => {
    it('should unsubscribe', () => {
      component.ngOnDestroy();
      expect(subSpy.unsubscribe).toHaveBeenCalled();
    });
  });

  describe('updatePushSetting', () => {
    beforeEach(() => {
      component['updateSetting'] = jasmine.createSpy();
      component['isWeb'] = false;
      nativeSettingsServiceSpy.checkNotificationStatus.and.returnValue(
        Promise.resolve(false)
      );
    });

    it('should call updateSetting', () => {
      component.updatePushSetting(true, 'PushContactId-DONT_PUSH');
      expect(component.updateSetting).toHaveBeenCalledWith(
        true,
        'PushContactId-DONT_PUSH'
      );
    });

    it('should not checkNotificationStatus for web', () => {
      component['isWeb'] = true;
      component.updatePushSetting(true, 'PushContactId-DONT_PUSH');
      expect(
        nativeSettingsServiceSpy.checkNotificationStatus
      ).not.toHaveBeenCalled();
    });

    it('should not call createAndShowModal when permissionStatus is true', async () => {
      nativeSettingsServiceSpy.checkNotificationStatus.and.returnValue(
        Promise.resolve(true)
      );
      await component.updatePushSetting(true, 'PushContactId-DONT_PUSH');
      expect(
        nativeSettingsServiceSpy.checkNotificationStatus
      ).toHaveBeenCalled();
      expect(
        nativeSettingsServiceSpy.createAndShowModal
      ).not.toHaveBeenCalled();
    });

    it('should call createAndShowModal when permissionStatus is false and checked is true', async () => {
      await component.updatePushSetting(true, 'PushContactId-DONT_PUSH');
      expect(
        nativeSettingsServiceSpy.checkNotificationStatus
      ).toHaveBeenCalled();
      expect(nativeSettingsServiceSpy.createAndShowModal).toHaveBeenCalled();
    });

    it('should not call createAndShowModal when permissionStatus is false and checked is false', async () => {
      await component.updatePushSetting(false, 'PushContactId-DONT_PUSH');
      expect(
        nativeSettingsServiceSpy.createAndShowModal
      ).not.toHaveBeenCalled();
    });
  });
});

import {Component, HostListener, Injector, Input, OnInit} from '@angular/core';
import {SharedUtilityService} from '@shared-lib/services/utility/utility.service';
import {PreferencesContent} from '../../../mobile/src/app/modules/features/landing/models/landing.model';
import * as preferenceText from './constants/preference-selection-content.json';
import {NativeSettingsService} from '@shared-lib/services/native-settings/native-settings.service';
import {EventTrackingService} from '@shared-lib/services/event-tracker/event-tracking.service';
import {EventTrackingConstants} from '@shared-lib/services/event-tracker/models/event-tracking.model';
import * as eventC from '@shared-lib/services/event-tracker/constants/event-tracking.json';
import {NotificationsSettingService} from '@shared-lib/services/notification-setting/notification-setting.service';
import {Preferences} from './constants/preferenceEnum.enum';
import {SettingsPreferences} from '@shared-lib/services/notification-setting/models/notification-settings-preferences.model';
import {ModalPresentationService} from '../../services/modal-presentation/modal-presentation.service';
import {AccessResult} from '@shared-lib/services/access/models/access.model';
@Component({
  selector: 'app-preference-selection',
  templateUrl: './preferences-selection.page.html',
  styleUrls: ['preferences-selection.page.scss'],
})
export class PreferenceSelectionPage implements OnInit {
  pageText: PreferencesContent = preferenceText;
  private eventTrackingService: EventTrackingService;
  eventContent: EventTrackingConstants = eventC;
  isWeb: boolean;
  @Input() public preferenceObject: SettingsPreferences;
  mobileContactId: string;
  emailContactId: string;
  noMobilePhone: boolean;
  @Input() public loginObject: AccessResult;
  @HostListener('window:popstate', ['$event'])
  private originalPushPref: boolean;
  onPopState() {
    this.closeDialog();
  }
  constructor(
    private utilityService: SharedUtilityService,
    private injector: Injector,
    private notificationSettingService: NotificationsSettingService,
    private nativeSettingsService: NativeSettingsService,
    private modalPresentationService: ModalPresentationService
  ) {
    this.eventTrackingService = this.injector.get<EventTrackingService>(
      EventTrackingService
    );
  }
  async ngOnInit() {
    this.emailContactId = this.preferenceObject.primaryEmail.partyContactId;
    this.mobileContactId =
      'mobilePhone' in this.preferenceObject
        ? this.preferenceObject.mobilePhone.partyContactId
        : '';
    this.isWeb = this.utilityService.getIsWeb();
    if (!this.isWeb) {
      this.originalPushPref = await this.nativeSettingsService.checkNotificationStatus();
    }

    this.setUpToggleValues();
  }
  ngAfterViewInit() {
    if (!('mobilePhone' in this.preferenceObject)) {
      this.noMobilePhone = true;
    }
  }

  async changeNotificationMethod(notificationText: string) {
    if (
      notificationText === 'Push Notifications' &&
      this.pageText.preferenceOptions[notificationText] &&
      !this.isWeb
    ) {
      const permissionStatus = await this.nativeSettingsService.checkNotificationStatus();
      if (!permissionStatus) {
        await this.nativeSettingsService.createAndShowModal();
      }
    }
  }

  async closeDialog() {
    this.trackpreferenceEvent();
    if (this.loginObject.firstTimeLogin && this.loginObject.firstTimeLoginWeb) {
      let pushID = this.emailContactId;
      if (!this.isWeb && !this.originalPushPref) {
        pushID = 'DONT_PUSH';
      }
      const defaultObj = {
        accountAlertPrefs: {
          prefEmailContactId: this.emailContactId,
          prefMobileContactId: 'DONT_TEXT',
          prefPushNotificationContactId: pushID,
        },
        highPrioitytNotificationPrefs: {
          prefEmailContactId: this.emailContactId,
          prefMobileContactId: 'DONT_TEXT',
          prefPushNotificationContactId: pushID,
        },
        insightsNotificationPrefs: {
          prefEmailContactId: this.emailContactId,
          prefMobileContactId: 'DONT_TEXT',
          prefPushNotificationContactId: pushID,
        },
      };
      await this.notificationSettingService.saveNotificationPrefs(defaultObj);
    }
    this.modalPresentationService.dismiss();
  }

  private async setUpToggleValues() {
    const isFirstLogin =
      this.loginObject.firstTimeLoginWeb && this.loginObject.firstTimeLogin;
    if (!isFirstLogin) {
      this.pageText.preferenceOptions['Email'] = false;
    } else {
      if (this.isWeb) {
        this.pageText.preferenceOptions['Push Notifications'] = true;
      } else {
        if (this.originalPushPref) {
          this.pageText.preferenceOptions['Push Notifications'] = true;
        }
      }
    }
  }
  objectKeys(keyObject): Array<string> {
    return Object.keys(keyObject);
  }

  async savePreferenceInDB() {
    this.trackpreferenceEvent();
    await this.notificationSettingService.saveNotificationPrefs(
      this.setPreferenceObject()
    );
    this.modalPresentationService.dismiss();
  }
  private setPreferenceObject(): SettingsPreferences {
    const preferenceObj: SettingsPreferences = {
      insightsNotificationPrefs: {
        prefPushNotificationContactId: 'DONT_PUSH',
        prefMobileContactId: 'DONT_TEXT',
        prefEmailContactId: 'DONT_EMAIL',
      },
      accountAlertPrefs: {
        prefPushNotificationContactId: 'DONT_PUSH',
        prefMobileContactId: 'DONT_TEXT',
        prefEmailContactId: 'DONT_EMAIL',
      },
      highPrioitytNotificationPrefs: {
        prefPushNotificationContactId: 'DONT_PUSH',
        prefMobileContactId: 'DONT_TEXT',
        prefEmailContactId: 'DONT_EMAIL',
      },
    };
    const ArrKeys = this.objectKeys(this.pageText.preferenceOptions);
    ArrKeys.forEach(key => {
      switch (true) {
        case Preferences.PUSH_NOTIFICATION === key &&
          this.pageText.preferenceOptions[Preferences.PUSH_NOTIFICATION]:
          preferenceObj.insightsNotificationPrefs.prefPushNotificationContactId = this.emailContactId;
          preferenceObj.accountAlertPrefs.prefPushNotificationContactId = this.emailContactId;
          preferenceObj.highPrioitytNotificationPrefs.prefPushNotificationContactId = this.emailContactId;
          break;

        case Preferences.TEXT === key &&
          this.pageText.preferenceOptions[Preferences.TEXT]:
          preferenceObj.insightsNotificationPrefs.prefMobileContactId = this.mobileContactId;
          preferenceObj.accountAlertPrefs.prefMobileContactId = this.mobileContactId;
          preferenceObj.highPrioitytNotificationPrefs.prefMobileContactId = this.mobileContactId;
          break;

        case Preferences.EMAIL === key &&
          this.pageText.preferenceOptions[Preferences.EMAIL]:
          preferenceObj.insightsNotificationPrefs.prefEmailContactId = this.emailContactId;
          preferenceObj.accountAlertPrefs.prefEmailContactId = this.emailContactId;
          preferenceObj.highPrioitytNotificationPrefs.prefEmailContactId = this.emailContactId;
          break;
      }
    });
    return preferenceObj;
  }
  private trackpreferenceEvent() {
    this.eventTrackingService.eventTracking({
      eventName: this.eventContent.eventTrackingPreference.eventName,
    });
  }
}

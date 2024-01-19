import {Injectable} from '@angular/core';
import {BaseService} from '@shared-lib/services/base/base-factory-provider';
import {SharedUtilityService} from '@shared-lib/services/utility/utility.service';
import {BehaviorSubject, from, Observable, ReplaySubject} from 'rxjs';
import {endpoints} from './constants/endpoints/endpoints';
import {SettingsContent} from './models/notification-settings-content.model';
import {SettingsPreferences} from './models/notification-settings-preferences.model';
import {PartyIds} from './models/party-ids.model';

@Injectable({
  providedIn: 'root',
})
export class NotificationsSettingService {
  private endpoints;
  private settingsContent: SettingsContent;
  prefSettings: PartyIds;
  updatedValues: SettingsPreferences;

  public notificationPrefsChanged$: Observable<PartyIds>;
  private notificationPrefsChanged: BehaviorSubject<
    PartyIds
  > = new BehaviorSubject({});

  private notificationSettingsData: Observable<SettingsPreferences> = null;
  private notificationSettingsSubject: ReplaySubject<
    SettingsPreferences
  > = new ReplaySubject(1);
  prefSettingsInitialized: boolean;

  constructor(
    private baseService: BaseService,
    private utilityService: SharedUtilityService
  ) {
    this.endpoints = this.utilityService.appendBaseUrlToEndpoints(endpoints);

    this.notificationPrefsChanged$ = this.notificationPrefsChanged.asObservable();

    this.prefSettings = {
      emailContactId: '',
      mobileContactId: '',
      HPPrefPushContactId: '',
      HPPrefMobileContactId: '',
      HPPrefEmailContactId: '',
      AAPrefPushContactId: '',
      AAPrefMobileContactId: '',
      AAPrefEmailContactId: '',
      INPrefPushContactId: '',
      INPrefMobileContactId: '',
      INPrefEmailContactId: '',
    };
    this.notificationPrefsChanged.next(this.prefSettings);
  }

  async getSettingsContent(): Promise<SettingsContent> {
    if (this.settingsContent == null) {
      this.settingsContent = await this.baseService.get(
        this.endpoints.getFooterContent
      );
    }
    return this.settingsContent;
  }

  setNotificationSettings(noteSettings: SettingsPreferences) {
    this.notificationSettingsSubject.next(noteSettings);
  }

  getNotificationSettings(refresh = false): Observable<SettingsPreferences> {
    if (!this.notificationSettingsData || refresh) {
      this.notificationSettingsData = from(
        this.baseService.get(this.endpoints.getNotificationSettings)
      );

      this.notificationSettingsData.subscribe((result: SettingsPreferences) => {
        //If mobilePhone is undefined, it causes issues with the notificaton settings
        if (!result.mobilePhone) {
          result.mobilePhone = {
            partyContactId: '',
            phoneNumber: '',
            lastUpdatedDate: new Date(),
          };
        }

        this.notificationSettingsSubject.next(result);
      });
    }
    return this.notificationSettingsSubject;
  }

  updateSettings(checked: boolean, fieldName: string): void {
    const tmpVals = fieldName.split('-');
    const splitField = tmpVals[0];
    const splitVal = tmpVals[1];
    if (checked) {
      if (fieldName.includes('Email')) {
        this.prefSettings[splitField] = this.prefSettings.emailContactId;
      } else if (fieldName.includes('Mobile')) {
        this.prefSettings[splitField] = this.prefSettings.mobileContactId;
      } else {
        this.prefSettings[splitField] = this.prefSettings.emailContactId;
      }
    } else {
      this.prefSettings[splitField] = splitVal;
    }

    this.notificationPrefsChanged.next(this.prefSettings);
  }

  setPrefsSettings() {
    if (!this.prefSettingsInitialized) {
      this.prefSettingsInitialized = true;
      this.getNotificationSettings().subscribe(
        (nsPrefSettingsData: SettingsPreferences) => {
          const partyIds: PartyIds = {
            mobileContactId: nsPrefSettingsData?.mobilePhone?.partyContactId,
            emailContactId: nsPrefSettingsData?.primaryEmail?.partyContactId,
            HPPrefPushContactId:
              nsPrefSettingsData?.highPrioitytNotificationPrefs
                ?.prefPushNotificationContactId,
            HPPrefMobileContactId:
              nsPrefSettingsData?.highPrioitytNotificationPrefs
                ?.prefMobileContactId,
            HPPrefEmailContactId:
              nsPrefSettingsData?.highPrioitytNotificationPrefs
                ?.prefEmailContactId,
            AAPrefPushContactId:
              nsPrefSettingsData?.accountAlertPrefs
                ?.prefPushNotificationContactId,
            AAPrefMobileContactId:
              nsPrefSettingsData?.accountAlertPrefs?.prefMobileContactId,
            AAPrefEmailContactId:
              nsPrefSettingsData?.accountAlertPrefs?.prefEmailContactId,
            INPrefPushContactId:
              nsPrefSettingsData?.insightsNotificationPrefs
                ?.prefPushNotificationContactId,
            INPrefMobileContactId:
              nsPrefSettingsData?.insightsNotificationPrefs
                ?.prefMobileContactId,
            INPrefEmailContactId:
              nsPrefSettingsData?.insightsNotificationPrefs?.prefEmailContactId,
          };

          this.prefSettings = partyIds;
          this.notificationPrefsChanged.next(this.prefSettings);
        }
      );
    }
  }

  async saveNotificationPrefs(values?: SettingsPreferences): Promise<void> {
    if (values) {
      this.updatedValues = values;
    } else {
      this.updatedValues = {
        insightsNotificationPrefs: {
          prefPushNotificationContactId: this.prefSettings.INPrefPushContactId,
          prefMobileContactId: this.prefSettings.INPrefMobileContactId,
          prefEmailContactId: this.prefSettings.INPrefEmailContactId,
        },
        accountAlertPrefs: {
          prefPushNotificationContactId: this.prefSettings.AAPrefPushContactId,
          prefMobileContactId: this.prefSettings.AAPrefMobileContactId,
          prefEmailContactId: this.prefSettings.AAPrefEmailContactId,
        },
        highPrioitytNotificationPrefs: {
          prefPushNotificationContactId: this.prefSettings.HPPrefPushContactId,
          prefMobileContactId: this.prefSettings.HPPrefMobileContactId,
          prefEmailContactId: this.prefSettings.HPPrefEmailContactId,
        },
      };
    }
    return this.baseService.post(
      this.endpoints.saveNotificationPreferences,
      this.updatedValues
    );
  }

  getCheckedAndActive(
    partyIds: PartyIds,
    basePropName: string
  ): {
    pushChecked: boolean;
    emailChecked: boolean;
    textChecked: boolean;
    sectionActive: boolean;
    textDisabled: boolean;
  } {
    const text: string = partyIds[basePropName + 'MobileContactId'];
    const email: string = partyIds[basePropName + 'EmailContactId'];
    const push: string = partyIds[basePropName + 'PushContactId'];

    const pushChecked = this.isChecked(push);

    const textChecked = this.isChecked(text);
    const emailChecked = this.isChecked(email);

    const isDisabled = this.prefSettings.mobileContactId === '' ? true : false;
    return {
      pushChecked: pushChecked,
      emailChecked: emailChecked,
      textChecked: textChecked,
      sectionActive: pushChecked || emailChecked || textChecked,
      textDisabled: isDisabled,
    };
  }

  private isChecked(str: string): boolean {
    return str !== undefined && str.length > 0 && !str.includes('DONT');
  }
}

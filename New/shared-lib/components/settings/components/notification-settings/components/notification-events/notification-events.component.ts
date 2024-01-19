import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {NotificationsSettingService} from '@shared-lib/services/notification-setting/notification-setting.service';
import {CommonContent} from '@shared-lib/services/notification-setting/models/common-content.model';
import {
  PartyIds,
  SectionChecked,
} from '@shared-lib/services/notification-setting/models/party-ids.model';
import * as commonContent from '@shared-lib/services/notification-setting/constants/common-content.json';
import {Subscription} from 'rxjs';
import {NativeSettingsService} from '@shared-lib/services/native-settings/native-settings.service';
import {SharedUtilityService} from '@shared-lib/services/utility/utility.service';

@Component({
  selector: 'app-notification-events',
  templateUrl: './notification-events.component.html',
  styleUrls: ['../../common.scss'],
})
export class NotificationEventsComponent implements OnInit, OnDestroy {
  @Input() title: string;
  @Input() subTitle: string;
  @Input() basePropName: string;
  isDisabled: boolean;

  commonContent: CommonContent = (commonContent as any).default;
  sectionActive = false;
  pushChecked = false;
  textChecked = false;
  emailChecked = false;
  private isWeb: boolean;

  private subscription: Subscription;

  constructor(
    private settingService: NotificationsSettingService,
    private nativeSettingsService: NativeSettingsService,
    private utilityService: SharedUtilityService
  ) {}

  async ngOnInit() {
    this.isWeb = this.utilityService.getIsWeb();
    this.subscription = this.settingService.notificationPrefsChanged$.subscribe(
      this.partyIdsUpdated.bind(this)
    );
  }

  partyIdsUpdated(partyIds: PartyIds) {
    const sectionChecked: SectionChecked = this.settingService.getCheckedAndActive(
      partyIds,
      this.basePropName
    );
    this.pushChecked = sectionChecked.pushChecked;
    this.emailChecked = sectionChecked.emailChecked;
    this.textChecked = sectionChecked.textChecked;
    this.sectionActive = sectionChecked.sectionActive;
    this.isDisabled = sectionChecked.textDisabled;
  }

  async updatePushSetting(checked: boolean, fieldName: string) {
    this.updateSetting(checked, fieldName);
    if (!this.isWeb) {
      const permissionStatus = await this.nativeSettingsService.checkNotificationStatus();
      if (!permissionStatus && checked) {
        await this.nativeSettingsService.createAndShowModal();
      }
    }
  }

  updateSetting(checked: boolean, fieldName: string) {
    this.settingService.updateSettings(checked, fieldName);
  }

  toggleSection(): void {
    if (!this.sectionActive) {
      this.settingService.updateSettings(
        false,
        this.basePropName + 'MobileContactId-DONT_TEXT'
      );
      this.settingService.updateSettings(
        false,
        this.basePropName + 'EmailContactId-DONT_EMAIL'
      );
      this.settingService.updateSettings(
        false,
        this.basePropName + 'PushContactId-DONT_PUSH'
      );
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}

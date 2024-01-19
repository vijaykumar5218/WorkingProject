import {Component} from '@angular/core';
import pageText from './constants/pageText.json';
import {SettingPage} from './models/settings.model';
import {HeaderTypeService} from '@web/app/modules/shared/services/header-type/header-type.service';
import {NotificationsSettingService} from '@shared-lib/services/notification-setting/notification-setting.service';
import {SettingsPreferences} from '@shared-lib/services/notification-setting/models/notification-settings-preferences.model';
import {Subscription} from 'rxjs';
@Component({
  selector: 'app-settings',
  templateUrl: 'settings.page.html',
  styleUrls: ['settings.page.scss'],
})
export class SettingsPage {
  pagedata: SettingPage = pageText;
  settings: SettingsPreferences;
  subscription = new Subscription();
  constructor(
    private headerTypeService: HeaderTypeService,
    private notificationsSettingService: NotificationsSettingService
  ) {}

  ngOnInit() {
    this.headerTypeService.publishSelectedTab(null);
    const notificationService = this.notificationsSettingService
      .getNotificationSettings()
      .subscribe(result => {
        this.settings = result;
      });
    this.subscription.add(notificationService);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}

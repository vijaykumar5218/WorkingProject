import {
  AccountInfoText,
  PasswordResponse,
} from '@shared-lib/services/account-info/models/account-and-personal-info.model';
import {AccountService} from '@shared-lib/services/account/account.service';
import {Subscription} from 'rxjs';
import * as accountText from '@shared-lib/services/account-info/constants/accountText.json';
import {Component, OnInit} from '@angular/core';
import {AccountInfoService} from '@shared-lib/services/account-info/account-info.service';
import {NotificationsSettingService} from '@shared-lib/services/notification-setting/notification-setting.service';
import {SettingsPreferences} from '@shared-lib/services/notification-setting/models/notification-settings-preferences.model';
import {SharedUtilityService} from '@shared-lib/services/utility/utility.service';
import {Participant} from '@shared-lib/services/account/models/accountres.model';
import {AccessService} from '@shared-lib/services/access/access.service';

@Component({
  selector: 'app-account-info',
  templateUrl: './account-info.page.html',
  styleUrls: ['./account-info.page.scss'],
})
export class AccountInfoPage implements OnInit {
  displayText: AccountInfoText = JSON.parse(JSON.stringify(accountText))
    .default;
  participantDataSubscription: Subscription;
  settingsPrefSubscription: Subscription;
  participantData: Participant;
  PasswordData: PasswordResponse;
  emailError = false;
  loading = true;
  email: string;
  phone: string;
  isWeb: boolean;
  isHealthOnly = false;

  constructor(
    private accountInfoService: AccountInfoService,
    private accountService: AccountService,
    private settingsService: NotificationsSettingService,
    private utilityService: SharedUtilityService,
    private accessService: AccessService
  ) {}

  ngOnInit() {
    this.isWeb = this.utilityService.getIsWeb();
    this.fetchData();
    this.getPrefs();
    this.accessService.checkMyvoyageAccess().then(access => {
      this.isHealthOnly = access.isHealthOnly;
    });
  }

  async getPrefs(): Promise<void> {
    this.settingsPrefSubscription = this.settingsService
      .getNotificationSettings()
      .subscribe((settingsPrefs: SettingsPreferences) => {
        this.email = settingsPrefs.primaryEmail?.email;
        this.phone = this.accountInfoService.formatPhoneNumber(
          settingsPrefs.mobilePhone?.phoneNumber
        );
        this.emailError = settingsPrefs.primaryEmail?.lastFailedInd === 'Y';
        this.loading = false;
      });
  }

  fetchData(): void {
    this.participantDataSubscription = this.accountService
      .getParticipant()
      .subscribe(data => {
        this.participantData = data;
      });
  }

  ngOnDestroy(): void {
    this.settingsPrefSubscription.unsubscribe();
    this.participantDataSubscription.unsubscribe();
  }
}

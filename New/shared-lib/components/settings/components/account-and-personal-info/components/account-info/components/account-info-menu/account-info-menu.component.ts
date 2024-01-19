import {Component, Injector, Input} from '@angular/core';
import {Router} from '@angular/router';
import {AccountInfoText} from '@shared-lib/services/account-info/models/account-and-personal-info.model';
import accountText from '@shared-lib/services/account-info/constants/accountText.json';
import {AccountService} from '@shared-lib/services/account/account.service';
import {SharedUtilityService} from '@shared-lib/services/utility/utility.service';
import {PlatformService} from '@shared-lib/services/platform/platform.service';
import {ModalController} from '@ionic/angular';
import {PopupInputDialogComponent} from '@shared-lib/components/popup-input-dialog/popup-input-dialog.component';
import {Subscription} from 'rxjs';
import {PopupInputType} from '@shared-lib/components/popup-input-dialog/constants/popup-input-type.enum';
import {AlertComponent} from '@shared-lib/components/alert/alert.component';
import * as editDisplayName from '@shared-lib/services/edit-display-name/constants/displayText.json';
import * as editEmail from '../edit-email/constants/displayText.json';
import * as editPhone from '../edit-phone/constants/displayText.json';
import {SettingsPreferences} from '@shared-lib/services/notification-setting/models/notification-settings-preferences.model';
import {NotificationsSettingService} from '@shared-lib/services/notification-setting/notification-setting.service';
import {AccountInfoService} from '@shared-lib/services/account-info/account-info.service';
import {AccessService} from '@shared-lib/services/access/access.service';
import {EditDisplayNameService} from '@shared-lib/services/edit-display-name/edit-display-name.service';
import {Participant} from '@shared-lib/services/account/models/accountres.model';
@Component({
  selector: 'app-account-info-menu',
  templateUrl: './account-info-menu.component.html',
  styleUrls: ['./account-info-menu.component.scss'],
})
export class AccountInfoMenuComponent {
  @Input() label: string;
  @Input() value: string;
  @Input() recoveryType: string;
  @Input() emailError: boolean;
  displayText: AccountInfoText = accountText;
  isWeb: boolean;
  isDesktop: boolean;
  participantData: Participant;
  subscription = new Subscription();
  editNamePopupText: any = JSON.parse(JSON.stringify(editDisplayName)).default;
  editEmailPopupText: any = JSON.parse(JSON.stringify(editEmail)).default;
  editPhonePopupText: any = JSON.parse(JSON.stringify(editPhone)).default;
  email: string;
  emailContactId: string;
  prefSettings: SettingsPreferences;
  phone: string;
  phoneContactId: string;
  private accountService: AccountService;
  private router: Router;
  private notificationService: NotificationsSettingService;
  private accountInfoService: AccountInfoService;

  constructor(
    private utilityService: SharedUtilityService,
    private platformService: PlatformService,
    private modalController: ModalController,
    private accessService: AccessService,
    private editDisplayNameService: EditDisplayNameService,
    private injector: Injector
  ) {
    this.accountService = injector.get<AccountService>(AccountService);
    this.router = injector.get<Router>(Router);
    this.notificationService = injector.get<NotificationsSettingService>(
      NotificationsSettingService
    );
    this.accountInfoService = injector.get<AccountInfoService>(
      AccountInfoService
    );
    this.isWeb = this.utilityService.getIsWeb();
    this.platformService.isDesktop().subscribe(data => {
      this.isDesktop = data;
    });
  }

  ngOnInit() {
    this.subscription.add(
      this.accountService.getParticipant().subscribe(data => {
        this.participantData = data;
      })
    );
    this.subscription.add(
      this.notificationService
        .getNotificationSettings()
        .subscribe((prefSettings: SettingsPreferences) => {
          this.prefSettings = prefSettings;
          this.emailContactId = prefSettings.primaryEmail.partyContactId;
          this.email = prefSettings.primaryEmail.email;
          this.phone = this.utilityService.formatPhone(
            prefSettings.mobilePhone.phoneNumber
          );
          this.phoneContactId = prefSettings.mobilePhone.partyContactId;
        })
    );
  }

  async openPwebProfile() {
    const myVoyaAccess = await this.accessService.checkMyvoyageAccess();
    this.accountService.openPwebAccountLink(
      decodeURIComponent(myVoyaAccess.myProfileURL)
    );
  }

  editProperty(): void {
    const rootPath = this.isWeb && !this.isDesktop ? 'more' : 'settings';
    if (this.isWeb && this.isDesktop) {
      switch (this.label) {
        case this.displayText.name:
          this.edit(
            this.displayText.nameTitle,
            this.displayText.name,
            this.participantData.displayName,
            this.displayText.name,
            PopupInputType.text,
            'editNamePopupText'
          );
          break;
        case this.displayText.email:
          this.edit(
            this.displayText.emailTitle,
            this.displayText.email,
            this.email,
            this.displayText.email,
            PopupInputType.email,
            'editEmailPopupText'
          );
          break;
        case this.displayText.phone:
          this.edit(
            this.displayText.phoneTitle,
            this.displayText.phoneSubTitle,
            this.phone,
            this.displayText.phone,
            PopupInputType.phone,
            'editPhonePopupText'
          );
          break;
        case this.displayText.loginInfo:
          this.openPwebProfile();
          break;
      }
    } else {
      switch (this.label) {
        case this.displayText.name:
          this.router.navigateByUrl(
            `/${rootPath}/account-and-personal-info/edit-display-name`
          );
          break;
        case this.displayText.email:
          this.router.navigateByUrl(
            `/${rootPath}/account-and-personal-info/edit-email`
          );
          break;
        case this.displayText.phone:
          this.router.navigateByUrl(
            `/${rootPath}/account-and-personal-info/edit-phone`
          );
          break;
        case this.displayText.loginInfo:
          this.openPwebProfile();
          break;
      }
    }
  }

  async edit(
    title: string,
    inputTitle: string,
    defaultValue: string,
    accountType: string,
    inputType: string,
    popupTextKey: string
  ) {
    const modal = await this.modalController.create({
      component: PopupInputDialogComponent,
      cssClass: 'modal-not-fullscreen',
      componentProps: {
        title: title,
        inputTitle: inputTitle,
        value: defaultValue,
        inputType: inputType,
        validator: (value?: string): string => {
          return this.validation(accountType, value);
        },
        saveFunction: async (value: string): Promise<boolean> => {
          return new Promise(res => {
            this.saveData(value, accountType, popupTextKey);
            res(true);
          });
        },
      },
    });
    modal.onDidDismiss().then(data => {
      this.modalDismissed(data, undefined, undefined);
    });
    return modal.present();
  }

  validation(accountType: string, value: string): string | null {
    if (accountType === this.displayText.email) {
      const emailVaild = this.utilityService.validateEmail(value);
      if (!emailVaild) {
        return this.displayText.invalidEmail;
      } else {
        return null;
      }
    } else if (accountType === this.displayText.phone) {
      const phoneVaild = this.utilityService.validatePhone(value);
      if (!phoneVaild) {
        return this.displayText.invalidPhone;
      } else {
        return null;
      }
    } else if (accountType === this.displayText.name) {
      if (value.trim().length < 1) {
        return this.displayText.invalidDisplayName;
      } else {
        return null;
      }
    } else {
      return null;
    }
  }

  async saveData(
    value: string,
    accountType: string,
    popupTextKey: string
  ): Promise<void> {
    const modal = await this.modalController.create({
      component: AlertComponent,
      cssClass: 'modal-not-fullscreen',
      componentProps: {
        titleMessage: this[popupTextKey].alert.message,
        imageUrl: this[popupTextKey].alert.imageUrl,
        saveFunction: async (): Promise<boolean> => {
          if (accountType === this.displayText.name) {
            return this.saveDisplayName(value);
          } else if (accountType === this.displayText.email) {
            return this.saveEmailOrPhone(
              value,
              'saveEmail',
              this.emailContactId
            );
          } else if (accountType === this.displayText.phone) {
            value = value?.replace(/[-\s]/g, '');
            return this.saveEmailOrPhone(
              value,
              'savePhone',
              this.phoneContactId
            );
          }
        },
      },
    });
    modal.onDidDismiss().then(data => {
      this.modalDismissed(data, accountType, value);
    });
    return modal.present();
  }

  saveDisplayName(value: string): Promise<boolean> {
    return new Promise(res => {
      this.editDisplayNameService.saveDisplayName(value).then(resp => {
        if (resp.displayName && resp.displayName === value) {
          res(true);
        } else {
          res(false);
        }
      });
    });
  }

  saveEmailOrPhone(
    value: string,
    functionName: string,
    contactId: string
  ): Promise<boolean> {
    return new Promise(res => {
      this.accountInfoService[functionName](value, contactId).then(resp => {
        if (resp) {
          res(true);
        } else {
          res(false);
        }
      });
    });
  }

  modalDismissed(data, accountType: string, value: string) {
    if (data.data.saved || data.saved) {
      if (accountType === this.displayText.email) {
        this.prefSettings.primaryEmail.email = value;
        this.notificationService.setNotificationSettings(this.prefSettings);
      } else if (accountType === this.displayText.phone) {
        this.prefSettings.mobilePhone.phoneNumber = value.replace(/-/g, '');
        this.notificationService.setNotificationSettings(this.prefSettings);
      } else if (accountType === this.displayText.name) {
        this.participantData.displayName = value;
        this.accountService.setParticipant(this.participantData);
      }
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}

import {AlertComponent} from '@shared-lib/components/alert/alert.component';
import {ModalController} from '@ionic/angular';
import {Subscription} from 'rxjs';
import {HeaderType} from '@shared-lib/constants/headerType.enum';
import {ActionOptions} from '@shared-lib/models/ActionOptions.model';
import {HeaderTypeService} from '@shared-lib/services/header-type/header-type.service';
import {Component, OnInit} from '@angular/core';
import * as pageText from './constants/displayText.json';
import {AccountInfoService} from '@shared-lib/services/account-info/account-info.service';
import {SharedUtilityService} from '@shared-lib/services/utility/utility.service';
import {NotificationsSettingService} from '@shared-lib/services/notification-setting/notification-setting.service';
import {SettingsPreferences} from '@shared-lib/services/notification-setting/models/notification-settings-preferences.model';
import {PlatformService} from '@shared-lib/services/platform/platform.service';
import {Router} from '@angular/router';
@Component({
  selector: 'app-edit-email',
  templateUrl: './edit-email.page.html',
  styleUrls: ['./edit-email.page.scss'],
})
export class EditEmailPage implements OnInit {
  displayText: any = JSON.parse(JSON.stringify(pageText)).default;
  email: string;
  emailVailid = true;
  prefSettings: SettingsPreferences;
  subscription: Subscription;
  contactId: string;
  actionOption: ActionOptions = {
    headername: this.displayText.headerName,
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
  isWeb: boolean;
  isDesktop: boolean;

  constructor(
    private headerType: HeaderTypeService,
    private router: Router,
    public modalController: ModalController,
    private accountInfoService: AccountInfoService,
    private notificationService: NotificationsSettingService,
    private utilityService: SharedUtilityService,
    private platformService: PlatformService
  ) {
    this.isWeb = this.utilityService.getIsWeb();
    this.platformService.isDesktop().subscribe(data => {
      this.isDesktop = data;
    });
  }

  ngOnInit(): void {
    this.headerType.publish({
      type: HeaderType.navbar,
      actionOption: this.actionOption,
    });
    this.fetchData();
  }

  fetchData() {
    this.subscription = this.notificationService
      .getNotificationSettings()
      .subscribe((prefSettings: SettingsPreferences) => {
        this.prefSettings = prefSettings;
        this.contactId = prefSettings.primaryEmail.partyContactId;
        this.email = prefSettings.primaryEmail.email;
      });
  }

  cancel() {
    const rootPath = this.isWeb && !this.isDesktop ? 'more' : 'settings';
    this.router.navigateByUrl(`/${rootPath}/account-and-personal-info`);
  }

  valueChanged(val: string | number) {
    this.email = val?.toString();
    this.emailVailid = this.utilityService.validateEmail(this.email);
  }

  async saveEmail(): Promise<void> {
    const modal = await this.modalController.create({
      component: AlertComponent,
      cssClass: 'modal-not-fullscreen',
      componentProps: {
        titleMessage: this.displayText.alert.message,
        imageUrl: this.displayText.alert.imageUrl,
        saveFunction: async (): Promise<boolean> => {
          return new Promise(res => {
            this.accountInfoService
              .saveEmail(this.email, this.contactId)
              .then(resp => {
                if (resp) {
                  res(true);
                } else {
                  res(false);
                }
              });
          });
        },
      },
    });
    modal.onDidDismiss().then(data => {
      this.modalDismissed(data);
    });
    return modal.present();
  }

  modalDismissed(data) {
    if (data.data.saved) {
      this.prefSettings.primaryEmail.email = this.email;
      this.notificationService.setNotificationSettings(this.prefSettings);
      this.cancel();
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}

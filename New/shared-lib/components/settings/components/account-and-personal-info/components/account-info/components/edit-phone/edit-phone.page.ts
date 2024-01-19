import {Component, OnInit} from '@angular/core';
import * as pageText from './constants/displayText.json';
import {ModalController} from '@ionic/angular';
import {AlertComponent} from '@shared-lib/components/alert/alert.component';
import {HeaderType} from '@shared-lib/constants/headerType.enum';
import {ActionOptions} from '@shared-lib/models/ActionOptions.model';
import {HeaderTypeService} from '@shared-lib/services/header-type/header-type.service';
import {Subscription} from 'rxjs';
import {AccountInfoService} from '@shared-lib/services/account-info/account-info.service';
import {AlertBox, ModalCloseData} from './models/alertbox-model';
import {SharedUtilityService} from '@shared-lib/services/utility/utility.service';
import {NotificationsSettingService} from '@shared-lib/services/notification-setting/notification-setting.service';
import {SettingsPreferences} from '@shared-lib/services/notification-setting/models/notification-settings-preferences.model';
import {PlatformService} from '@shared-lib/services/platform/platform.service';
import {Router} from '@angular/router';

@Component({
  selector: 'mobile-edit-phone',
  templateUrl: './edit-phone.page.html',
  styleUrls: ['./edit-phone.page.scss'],
})
export class EditPhonePage implements OnInit {
  displayText: AlertBox = (pageText as any).default;

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
  subscription: Subscription;
  phone: string;
  contactId: string;
  phoneVailid = true;
  prefSettings: SettingsPreferences;
  isWeb: boolean;
  isDesktop: boolean;

  constructor(
    private headerType: HeaderTypeService,
    public modalController: ModalController,
    private accountInfoService: AccountInfoService,
    private utilityService: SharedUtilityService,
    private noteSettingsService: NotificationsSettingService,
    private platformService: PlatformService,
    private router: Router
  ) {
    this.isWeb = this.utilityService.getIsWeb();
    this.platformService.isDesktop().subscribe(data => {
      this.isDesktop = data;
    });
  }

  ngOnInit() {
    this.headerType.publish({
      type: HeaderType.navbar,
      actionOption: this.actionOption,
    });

    this.fetchData();
  }

  fetchData() {
    this.subscription = this.noteSettingsService
      .getNotificationSettings()
      .subscribe((prefSettings: SettingsPreferences) => {
        this.prefSettings = prefSettings;
        this.contactId = prefSettings.mobilePhone.partyContactId;
        this.phone = prefSettings.mobilePhone.phoneNumber;
        this.valueChanged(prefSettings.mobilePhone.phoneNumber);
      });
  }

  valueChanged(val: string | number) {
    this.phone = this.utilityService.formatPhone(val);
    this.phoneVailid = this.utilityService.validatePhone(this.phone);
  }

  goBack() {
    const rootPath = this.isWeb && !this.isDesktop ? 'more' : 'settings';
    this.router.navigateByUrl(`/${rootPath}/account-and-personal-info`);
  }

  async savePhone(): Promise<void> {
    const modal = await this.modalController.create({
      component: AlertComponent,
      cssClass: 'modal-not-fullscreen',
      componentProps: {
        titleMessage: this.displayText.alert.message,
        imageUrl: this.displayText.alert.imageUrl,
        saveFunction: async (): Promise<boolean> => {
          return new Promise(res => {
            this.phone = this.phone?.replace(/[-\s]/g, '');

            this.accountInfoService
              .savePhone(this.phone, this.contactId)
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
      this.modalDismissed(data.data);
    });
    return modal.present();
  }

  modalDismissed(data: ModalCloseData) {
    if (data.saved) {
      this.prefSettings.mobilePhone.phoneNumber = this.phone.replace(/-/g, '');
      this.noteSettingsService.setNotificationSettings(this.prefSettings);
      this.goBack();

      this.noteSettingsService.getNotificationSettings(true);
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}

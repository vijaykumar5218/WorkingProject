import {AlertComponent} from '@shared-lib/components/alert/alert.component';
import {ModalController} from '@ionic/angular';
import {Subscription} from 'rxjs';
import {AccountRecovery} from '@shared-lib/services/account-info/models/account-and-personal-info.model';
import {AccountInfoService} from '@shared-lib/services/account-info/account-info.service';
import {HeaderType} from '@shared-lib/constants/headerType.enum';
import {ActionOptions} from '@shared-lib/models/ActionOptions.model';
import {HeaderTypeService} from '@shared-lib/services/header-type/header-type.service';
import {Component} from '@angular/core';
import * as pageText from './constants/displayText.json';
import {DisplayText} from './models/edit-password.model';
import {Router} from '@angular/router';

@Component({
  selector: 'app-edit-password',
  templateUrl: './edit-password.page.html',
  styleUrls: ['./edit-password.page.scss'],
})
export class EditPasswordPage {
  displayText: DisplayText = (pageText as any).default;
  showPassword = false;
  showConfirmPassword = false;
  showNewPassword = false;
  submitDisabled = true;
  accountRecoveryData: AccountRecovery;
  recoveryDataSubscription: Subscription;
  password: string;
  confirmPassword: string;
  newPassword: string;

  constructor(
    private headerType: HeaderTypeService,
    public router: Router,
    private accountInfoService: AccountInfoService,
    public modalController: ModalController
  ) {}

  actionOption: ActionOptions = {
    headername: this.displayText.actionOption.headername,
    btnleft: true,
    btnright: true,
    buttonLeft: {
      name: '',
      link: this.displayText.actionOption.buttonLeft,
    },
    buttonRight: {
      name: '',
      link: this.displayText.actionOption.buttonRight,
    },
  };

  ionViewWillEnter(): void {
    this.headerType.publish({
      type: HeaderType.navbar,
      actionOption: this.actionOption,
    });
    this.fetchRecoveryData();
  }

  routeToNotification(): void {
    this.router.navigateByUrl('/settings/notification-settings');
  }

  goBack(): void {
    this.router.navigateByUrl('/settings/account-and-personal-info');
  }

  toggleShowPassword(password: string): void {
    switch (password) {
      case 'old':
        this.showPassword = !this.showPassword;
        break;
      case 'new':
        this.showNewPassword = !this.showNewPassword;
        break;
      case 'confirm':
        this.showConfirmPassword = !this.showConfirmPassword;
        break;
    }
  }

  fetchRecoveryData(): void {
    this.recoveryDataSubscription = this.accountInfoService
      .getAccountRecovery()
      .subscribe(data => {
        this.accountRecoveryData = data;
      });
  }

  passwordChanged(val: string) {
    this.password = val;
  }

  async submitNewPassword(): Promise<void> {
    const modal = await this.modalController.create({
      component: AlertComponent,
      cssClass: 'modal-not-fullscreen',
      componentProps: {
        titleMessage: this.displayText.alert.message,
        imageUrl: this.displayText.alert.imageUrl,
      },
    });
    modal.onDidDismiss().then(() => {
      this.router.navigateByUrl('/settings/account-and-personal-info');
    });
    return modal.present();
  }
}
